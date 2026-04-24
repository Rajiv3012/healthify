import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useMedication } from '../context/MedicationContext';
import { API_BASE } from '../config';

// --- CONSTANTS ---
const DAYS_IN_MONTH = Array.from({ length: 30 }, (_, i) => i + 1);

const LEVELS = [
    { level: 1, minXP: 0, title: 'Health Starter' },
    { level: 2, minXP: 1000, title: 'Consistent Keeper' },
    { level: 3, minXP: 2500, title: 'Wellness Warrior' },
    { level: 4, minXP: 5000, title: 'Health Guardian' },
    { level: 5, minXP: 10000, title: 'Master of Vitality' }
];

const ACHIEVEMENT_BADGES = [
    { id: 'streak_3', title: '3-Day Streak', desc: 'Consistent intake for 3 days', icon: '🌱', threshold: 3, type: 'streak' },
    { id: 'streak_7', title: 'Week Warrior', desc: 'Perfect attendance for 7 days', icon: '⚔️', threshold: 7, type: 'streak' },
    { id: 'streak_30', title: 'Monthly Master', desc: '30 days of health discipline', icon: '👑', threshold: 30, type: 'streak' },
    { id: 'perfect_day', title: 'Perfect Day', desc: 'Completed all daily quests', icon: '🌟', threshold: 1, type: 'special' },
];

// --- COMPONENTS ---

// 1. XP & Level Banner
function LevelBanner({ xp, dailyXP }) {
    const currentLevel = LEVELS.slice().reverse().find(l => xp >= l.minXP) || LEVELS[0];
    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
    const progress = nextLevel
        ? ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
        : 100;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-900/20 to-[#0B0F14] border border-green-500/20 p-8 mb-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-green-500 text-black text-xs font-bold uppercase tracking-wider">
                            Level {currentLevel.level}
                        </span>
                        <span className="text-green-400 font-mono text-sm">+{dailyXP} XP Today</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">{currentLevel.title}</h1>
                    <p className="text-white/60">Keep up the great work! You are building a healthier future.</p>
                </div>

                <div className="w-full md:w-1/3">
                    <div className="flex justify-between text-xs text-white/40 mb-2 font-mono">
                        <span>{xp} XP</span>
                        {nextLevel && <span>{nextLevel.minXP} XP</span>}
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-green-500 relative"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 2. Daily Quest Card
function QuestCard({ quest, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-2xl border flex items-center gap-4 transition-all group
                ${quest.completed
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-[#0B0F14] border-white/5 hover:border-white/10'
                }
            `}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all
                ${quest.completed ? 'bg-green-500 text-black scale-110' : 'bg-white/5 text-white/20'}
            `}>
                {quest.completed ? '✓' : quest.icon}
            </div>
            <div className="flex-1">
                <h3 className={`font-semibold ${quest.completed ? 'text-white' : 'text-white/60'}`}>{quest.title}</h3>
                <p className="text-xs text-white/40">{quest.desc}</p>
            </div>
            <div className="text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded border
                    ${quest.completed ? 'bg-green-500/20 border-green-500/20 text-green-400' : 'border-white/10 text-white/20'}
                `}>
                    {quest.xp} XP
                </span>
            </div>
        </motion.div>
    );
}

// 3. Calendar View (Proper Month Grid)
function CalendarView({ history }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const generateDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);

        // Padding
        for (let i = 0; i < startDay; i++) {
            days.push({ day: null });
        }

        // Days
        for (let i = 1; i <= totalDays; i++) {
            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            // Fix timezone offset issue for string comparison
            const localDateStr = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];

            days.push({
                day: i,
                date: localDateStr,
                isPast: localDateStr < todayStr,
                isToday: localDateStr === todayStr,
                isFuture: localDateStr > todayStr,
                count: history[localDateStr] || 0
            });
        }
        return days;
    };

    const days = generateDays();

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-xl font-bold text-white tracking-wide">{monthName} <span className="text-white/40 font-light">{year}</span></h3>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full text-white/60 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full text-white/60 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            {/* Grid Headers */}
            <div className="grid grid-cols-7 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-center text-white/30 text-xs font-bold uppercase">{d}</div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-3">
                {days.map((item, i) => {
                    if (!item.day) return <div key={i} />;

                    // Determine Status Color
                    let bg = 'bg-[#1A1F26] border-white/5 text-white/30'; // Default Future
                    let icon = null;

                    if (item.count > 0) {
                        // Success (Green)
                        bg = 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]';
                        icon = '✓';
                    } else if (item.isPast && item.count === 0) {
                        // Missed (Red)
                        bg = 'bg-red-500/10 border-red-500/30 text-red-500';
                        icon = '✕';
                    } else if (item.isToday) {
                        // Today (Neutral/Active)
                        bg = 'bg-blue-500/10 border-blue-500/30 text-blue-400 animate-pulse';
                    }

                    return (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.01 }}
                            className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center relative cursor-default transition-all group hover:scale-105 ${bg}`}
                        >
                            <span className="text-sm font-bold">{item.day}</span>
                            {icon && <span className="text-xs mt-1 absolute bottom-1.5 opacity-60 font-black">{icon}</span>}

                            {/* Simple tooltip for raw count */}
                            {item.count > 0 && (
                                <div className="absolute -top-8 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                    {item.count} meds
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

// 4. Achievement Badge
function Badge({ item, unlocked }) {
    return (
        <div className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all
            ${unlocked ? 'bg-gradient-to-b from-[#1A1F26] to-[#0B0F14] border-green-500/20' : 'opacity-40 border-transparent'}
        `}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 relative
                ${unlocked ? 'bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-white/5 grayscale'}
            `}>
                {item.icon}
                {unlocked && <div className="absolute inset-0 rounded-full border border-green-500/30 animate-pulse"></div>}
            </div>
            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
            <p className="text-xs text-white/40 mt-1 max-w-[120px]">{item.desc}</p>
        </div>
    );
}



export default function Achievements() {
    const { medications, taken } = useMedication();

    // --- MOCKED HISTORY & XP STATE ---
    const [xp, setXp] = useState(1250); // Start at Level 2

    // --- REAL CONSISTENCY STATE ---
    // Default to empty objects for proper rendering before fetch
    const [history, setHistory] = useState({});

    useEffect(() => {
        fetch(`${API_BASE}/consistency-map`)
            .then(res => res.json())
            .then(data => setHistory(data))
            .catch(err => console.error("Failed to fetch consistency map:", err));
    }, []);

    // --- CHALLENGE STATE ---
    const [challenge, setChallenge] = useState({ status: 'IDLE', targetDates: [], progress: { day1: false, day2: false } });

    useEffect(() => {
        fetch(`${API_BASE}/challenge/status`)
            .then(res => res.json())
            .then(data => setChallenge(data))
            .catch(err => console.error("Failed to fetch challenge status:", err));
    }, []);

    const acceptChallenge = () => {
        fetch(`${API_BASE}/challenge/accept`, { method: 'POST' })
            .then(res => res.json())
            .then(data => setChallenge(data.challenge))
            .catch(err => console.error("Failed to accept challenge:", err));
    };

    // --- RENDER HELPERS ---
    const getChallengeUI = () => {
        switch (challenge.status) {
            case 'IDLE':
                return {
                    text: 'Accept Challenge',
                    subtext: 'Complete all quests on Saturday & Sunday to unlock this rare shield badge.',
                    disabled: false,
                    color: 'text-indigo-400',
                    bg: 'bg-indigo-600',
                    icon: '🛡️'
                };
            case 'PENDING':
                return {
                    text: 'Challenge Accepted!',
                    subtext: `Get ready! Your challenge begins on Saturday (${challenge.targetDates[0]}).`,
                    disabled: true,
                    color: 'text-yellow-400',
                    bg: 'bg-indigo-600/50',
                    icon: '⏳'
                };
            case 'ACTIVE':
                return {
                    text: 'Challenge Active!',
                    subtext: 'Maintain your streak today! We are watching.',
                    disabled: true,
                    color: 'text-green-400',
                    bg: 'bg-green-600',
                    icon: '⚔️'
                };
            case 'COMPLETED':
                return {
                    text: 'Victory!',
                    subtext: 'You earned the Weekend Guardian Badge.',
                    disabled: true,
                    color: 'text-green-400',
                    bg: 'bg-green-500',
                    icon: '🏆'
                };
            case 'FAILED':
                return {
                    text: 'Challenge Failed',
                    subtext: 'You missed a quest. Try again next week.',
                    disabled: true,
                    color: 'text-red-400',
                    bg: 'bg-red-600',
                    icon: '❌'
                };
            default: return {
                text: 'Loading...', subtext: '', disabled: true, color: 'text-white', bg: 'bg-gray-700', icon: '...'
            };
        }
    };

    const uiState = getChallengeUI();

    // --- QUEST LOGIC ---
    const quests = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        // Calculate status based on actual medication context

        // 1. Morning Quest
        const morningMeds = medications.filter(m => m.schedule.morning);
        const morningDone = morningMeds.length > 0 && morningMeds.every(m => taken[`${m.id}_morning`]);

        // 2. Noon Quest
        const noonMeds = medications.filter(m => m.schedule.afternoon);
        const noonDone = noonMeds.length > 0 && noonMeds.every(m => taken[`${m.id}_afternoon`]);

        // 3. Night Quest
        const nightMeds = medications.filter(m => m.schedule.night);
        const nightDone = nightMeds.length > 0 && nightMeds.every(m => taken[`${m.id}_night`]);

        // 4. Log Quest (Mocked for now as we don't store log history in simple context)
        const logDone = false;

        return [
            { id: 'q_morning', title: 'Morning Routine', desc: 'Take all morning medications', icon: '☀️', xp: 50, completed: morningDone || morningMeds.length === 0 }, // Auto-complete if none scheduled
            { id: 'q_noon', title: 'Midday Power', desc: 'Take noon medications', icon: '🌤️', xp: 50, completed: noonDone || noonMeds.length === 0 },
            { id: 'q_night', title: 'Night Shield', desc: 'Take night medications', icon: '🌙', xp: 50, completed: nightDone || nightMeds.length === 0 },
            { id: 'q_log', title: 'Daily Check-In', desc: 'Visit Dashboard & check status', icon: '📝', xp: 25, completed: true }, // Freebie for visiting
        ];
    }, [medications, taken]);

    const dailyXP = quests.reduce((acc, q) => q.completed ? acc + q.xp : acc, 0);
    const allCompleted = quests.every(q => q.completed);

    return (
        <div className="bg-[#050505] min-h-screen font-['Inter'] text-white overflow-hidden pb-48">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 pt-32">

                {/* 1. HERO: Level & XP */}
                <LevelBanner xp={xp + dailyXP} dailyXP={dailyXP} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COL: QUESTS & CALENDAR (7 cols) */}
                    <div className="lg:col-span-7 space-y-12">

                        {/* 2. Daily Quests */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    👾 Daily Health Quests
                                </h2>
                                {allCompleted && (
                                    <span className="text-green-400 text-sm font-bold bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full animate-bounce">
                                        ✨ Perfect Day Bonus!
                                    </span>
                                )}
                            </div>
                            <div className="grid gap-4">
                                {quests.map((q, i) => (
                                    <QuestCard key={q.id} quest={q} index={i} />
                                ))}
                            </div>
                        </section>

                        {/* 3. Consistency Heatmap */}
                        <section className="bg-[#0B0F14] rounded-3xl border border-white/5 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Consistency Map</h2>
                                <div className="text-xs text-white/40">Daily Tracking</div>
                            </div>
                            <CalendarView history={history} />
                            <div className="flex items-center gap-4 mt-6 text-xs text-white/40 justify-end">
                                <span>Less</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded bg-[#1A1F26]"></div>
                                    <div className="w-3 h-3 rounded bg-green-900/40"></div>
                                    <div className="w-3 h-3 rounded bg-green-500"></div>
                                </div>
                                <span>More</span>
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COL: BADGES & BOSS (5 cols) */}
                    <div className="lg:col-span-5 space-y-12">

                        {/* 4. Weekly Boss / Challenge */}
                        {/* 4. Daily Cheer: Health Companion */}
                        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900/10 to-[#0B0F14] border border-green-500/10 p-8 text-center group">
                            {/* Ambient Light */}
                            <div className="absolute top-0 right-0 w-full h-full bg-green-500/5 blur-3xl rounded-full"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-48 h-48 mb-4 relative"
                                >
                                    {/* Using the generated cute mascot image */}
                                    <img
                                        src="/assets/cute_mascot.png"
                                        alt="Health Companion"
                                        className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                                    />

                                    {/* Cute floating hearts animation */}
                                    {[1, 2, 3].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [0, -30],
                                                opacity: [0, 1, 0],
                                                scale: [0.5, 1]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                delay: i * 1,
                                                ease: "easeOut"
                                            }}
                                            className="absolute top-0 right-1/4 text-2xl"
                                            style={{ left: `${50 + (i === 2 ? -20 : 20)}%` }}
                                        >
                                            💖
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <h2 className="text-xl font-bold text-white mb-2">You're doing great!</h2>
                                <p className="text-white/60 text-sm max-w-[200px]">
                                    One step at a time. Your heart is proud of you today.
                                </p>
                            </div>
                        </section>



                        {/* 5. Achievement Collection */}
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6">Trophy Case</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {ACHIEVEMENT_BADGES.map(badge => (
                                    <Badge
                                        key={badge.id}
                                        item={badge}
                                        unlocked={badge.threshold <= 3} // Mock logic for unlocked
                                    />
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div >
    );
}
