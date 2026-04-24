import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required. Define it in your environment variables.');
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/healthify')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- MOCK DATABASE ---
let db = {
    medications: [
        { id: 1, name: 'Metformin', dosage: '500mg', schedule: { morning: true, afternoon: false, night: true } },
        { id: 2, name: 'Insulin', dosage: '10 units', schedule: { morning: true, afternoon: true, night: true } }
    ],
    caregivers: [
        { id: 1, name: "Sarah", relation: "Daughter", email: "caregiver@example.com" }
    ],
    medicationLog: {}, // Format: "medId_slot_YYYY-MM-DD": true
    alertHistory: {},
    weeklyChallenge: {
        status: 'IDLE', // IDLE, PENDING, ACTIVE, COMPLETED, FAILED
        targetDates: [],
        progress: { day1: false, day2: false }
    }
};

// --- EMAIL TRANSPORTER (MOCK) ---
const sendEmail = (to, subject, text) => {
    console.log(`
    📧 [EMAIL SENT]
    To: ${to}
    Subject: ${subject}
    Body: ${text}
    `);
};

// --- CRON JOBS ---
const checkAdherence = (slot) => {
    console.log(`🔎 Running Adherence Check for: ${slot.toUpperCase()}`);
    const today = new Date().toISOString().split('T')[0];

    db.medications.forEach(med => {
        if (med.schedule[slot]) {
            const logKey = `${med.id}_${slot}_${today}`;
            if (!db.medicationLog[logKey]) {
                const message = `Alert: Patient missed ${med.name} (${med.dosage}) for ${slot} slot on ${today}.`;
                console.log(`❌ MISSED: ${message}`);
                db.caregivers.forEach(cg => {
                    sendEmail(cg.email, "Missed Medication Alert", message);
                });
            } else {
                console.log(`✅ TAKEN: ${med.name} (${slot})`);
            }
        }
    });
};

cron.schedule('0 11 * * *', () => checkAdherence('morning'));
cron.schedule('0 15 * * *', () => checkAdherence('afternoon'));
cron.schedule('0 21 * * *', () => checkAdherence('night'));

// Weekly Challenge Logic
const getUpcomingWeekend = () => {
    const d = new Date();
    const day = d.getDay();
    let sat = new Date();
    sat.setDate(d.getDate() + (day === 6 ? 0 : (6 - day)));
    let sun = new Date();
    sun.setDate(sat.getDate() + 1);
    return [sat.toISOString().split('T')[0], sun.toISOString().split('T')[0]];
};

const checkDailyCompletion = (dateStr) => {
    return db.medications.every(med => {
        const slots = ['morning', 'afternoon', 'night'].filter(s => med.schedule[s]);
        return slots.every(slot => db.medicationLog[`${med.id}_${slot}_${dateStr}`]);
    });
};

cron.schedule('0 0 * * *', () => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (db.weeklyChallenge.status === 'PENDING' && db.weeklyChallenge.targetDates[0] === todayStr) {
        db.weeklyChallenge.status = 'ACTIVE';
        console.log('⚔️ Weekly Challenge is now ACTIVE!');
    }
});

cron.schedule('59 23 * * 6', () => {
    if (db.weeklyChallenge.status === 'ACTIVE') {
        const todayStr = new Date().toISOString().split('T')[0];
        const success = checkDailyCompletion(todayStr);
        db.weeklyChallenge.progress.day1 = success;
        if (!success) db.weeklyChallenge.status = 'FAILED';
    }
});

cron.schedule('59 23 * * 0', () => {
    if (db.weeklyChallenge.status === 'ACTIVE') {
        const todayStr = new Date().toISOString().split('T')[0];
        const success = checkDailyCompletion(todayStr);
        db.weeklyChallenge.progress.day2 = success;

        if (success && db.weeklyChallenge.progress.day1) {
            db.weeklyChallenge.status = 'COMPLETED';
        } else {
            db.weeklyChallenge.status = 'FAILED';
        }
    }
});

// --- API ROUTES ---

// --- MIDDLEWARE ---
const protectRoute = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ error: "Not authorized, no token" });

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ error: "Not authorized, token failed" });
    }
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, caregiverName, caregiverEmail, caregiverRelation } = req.body;
        
        if (!email || !email.includes('@')) return res.status(400).json({ error: "Invalid email format" });
        if (!password || password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name, email, password: hashedPassword,
            caregiverName, caregiverEmail, caregiverRelation
        });

        res.status(201).json({ success: true, message: "User created" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Please provide email and password" });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        if (!user.password) return res.status(401).json({ error: "Please sign in with Google" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/auth/google', async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.email) return res.status(400).json({ error: "Invalid Google token" });

        const { email, name, sub: googleId } = decoded;

        let user = await User.findOne({ email });
        
        if (!user) {
            user = await User.create({ name, email, googleId });
        } else if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

        res.json({ success: true, token: jwtToken, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


// Consistency Map
app.get('/api/consistency-map', (req, res) => {
    try {
        const last180Days = {};
        const today = new Date();

        for (let i = 180; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            last180Days[dateStr] = 0;
        }

        Object.keys(db.medicationLog).forEach(key => {
            if (db.medicationLog[key]) {
                const parts = key.split('_');
                const dateStr = parts[parts.length - 1];
                if (last180Days.hasOwnProperty(dateStr)) {
                    last180Days[dateStr]++;
                }
            }
        });

        res.json(last180Days);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Medications
app.get('/api/medications', protectRoute, (req, res) => res.json(db.medications));

app.post('/api/medications', (req, res) => {
    const newMed = { id: Date.now(), ...req.body };
    db.medications.push(newMed);
    res.json(db.medications);
});

app.delete('/api/medications/:id', (req, res) => {
    db.medications = db.medications.filter(m => m.id !== parseInt(req.params.id));
    res.json(db.medications);
});

// Logs
app.post('/api/medications/log', (req, res) => {
    const { medicationId, slot, date, status } = req.body;
    // Handle both 'taken' (old) and 'status' (new) payload keys if necessary, sticking to 'status' as per recent
    const val = status !== undefined ? status : req.body.taken;

    const key = `${medicationId}_${slot}_${date}`;
    if (val) db.medicationLog[key] = true;
    else delete db.medicationLog[key];

    res.json({ success: true, logs: db.medicationLog });
});

app.post('/api/sync/medications', (req, res) => {
    res.json({ logs: db.medicationLog });
});
app.get('/api/sync/logs', (req, res) => { // Support both GET/POST for sync
    res.json({ logs: db.medicationLog });
});

// Challenges
app.get('/api/challenge/status', (req, res) => res.json(db.weeklyChallenge));

app.post('/api/challenge/accept', (req, res) => {
    const targets = getUpcomingWeekend();
    const todayStr = new Date().toISOString().split('T')[0];

    db.weeklyChallenge = {
        status: targets[0] === todayStr ? 'ACTIVE' : 'PENDING',
        targetDates: targets,
        progress: { day1: false, day2: false }
    };
    res.json({ success: true, challenge: db.weeklyChallenge });
});

// Caregivers
app.get('/api/caregivers', (req, res) => res.json(db.caregivers));
app.post('/api/caregivers', (req, res) => {
    db.caregivers.push({ id: Date.now(), ...req.body });
    res.json({ success: true, caregivers: db.caregivers });
});
app.delete('/api/caregivers/:id', (req, res) => {
    db.caregivers = db.caregivers.filter(c => c.id !== parseInt(req.params.id));
    res.json({ success: true, caregivers: db.caregivers });
});

// Debug
app.get('/api/debug/check-now', (req, res) => {
    checkAdherence('morning');
    checkAdherence('afternoon');
    checkAdherence('night');
    res.json({ message: 'Checks triggered' });
});


// --- SERVE FRONTEND (Production/Deployment) ---
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
    // Only serve static files if we are NOT in a serverless environment (optional check, but good for keeping logs clean)
    // However, for Netlify Functions, this code might run but the route handling below will be superseded by Netlify's own routing
    // unless we are hitting this function specifically.
    // For simplicity, we leave it.
    app.use(express.static(distPath));

    app.get(/.*/, (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(distPath, 'index.html'));
        } else {
            res.status(404).json({ error: 'API route not found' });
        }
    });
}

// Export app for Serverless
export { app };

// Only listen if run directly (Local / Render)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Healthify Backend running on ${PORT}`));
}
