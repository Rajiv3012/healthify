import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

// --- Helper Logic ---

function getBMIStatus(bmi) {
    if (!bmi) return { label: 'Unknown', color: 'text-white/40', bg: 'bg-white/5' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    if (bmi < 25) return { label: 'Healthy Weight', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    return { label: 'Obese', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
}

function getBPStatus(sys, dia) {
    if (!sys || !dia) return { label: 'Unknown', color: 'text-white/40', bg: 'bg-white/5' };
    if (sys < 120 && dia < 80) return { label: 'Normal', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    if (sys < 130 && dia < 80) return { label: 'Elevated', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    return { label: 'High BP', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
}

function getGlucoseStatus(level) {
    if (!level) return { label: 'Unknown', color: 'text-white/40', bg: 'bg-white/5' };
    if (level < 70) return { label: 'Low', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    if (level <= 100) return { label: 'Normal', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    if (level <= 125) return { label: 'Pre-diabetic', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    return { label: 'Diabetic Range', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
}

// --- Components ---

function MetricInput({ label, value, onChange, unit, placeholder }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs text-white/40 font-medium uppercase tracking-wider">{label}</label>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-[#1A1F26] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-green-500/50 transition-all font-mono"
                />
                {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 text-sm">{unit}</span>}
            </div>
        </div>
    );
}

function StatusIndicator({ statusObj }) {
    return (
        <div className={`px-3 py-1 rounded-full border ${statusObj.border || 'border-white/10'} ${statusObj.bg} inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusObj.color.replace('text', 'bg')} animate-pulse`}></span>
            <span className={statusObj.color}>{statusObj.label}</span>
        </div>
    );
}

function Checkbox({ label, checked, onChange }) {
    return (
        <div
            onClick={onChange}
            className={`
        flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all group
        ${checked ? 'bg-green-500/5 border-green-500/30' : 'bg-[#12161C] border-white/5 hover:border-white/10'}
      `}
        >
            <div className={`
        w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300
        ${checked ? 'bg-green-500 border-green-500 text-black scale-110' : 'border-white/20 group-hover:border-white/40'}
      `}>
                {checked && (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                )}
            </div>
            <span className={`transition-colors ${checked ? 'text-white font-medium' : 'text-white/60'}`}>{label}</span>
        </div>
    );
}

function AddMedModal({ isOpen, onClose }) {
    const { addMed } = useMedication();
    const [name, setName] = useState('');
    const [slots, setSlots] = useState({ morning: true, afternoon: false, night: false });

    if (!isOpen) return null;

    const handleAdd = () => {
        addMed({ name, slots });
        onClose();
        setName('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#12161C] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative z-50"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Add Medication</h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">✕</button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-white/60 text-sm font-medium mb-2 block">Medication Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Metformin"
                            className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 placeholder-white/20 transition-all font-medium"
                        />
                    </div>

                    <div>
                        <label className="text-white/60 text-sm font-medium mb-3 block">Daily Schedule</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Morning', 'Afternoon', 'Night'].map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setSlots({ ...slots, [slot.toLowerCase()]: !slots[slot.toLowerCase()] })}
                                    className={`py-3 rounded-xl text-sm font-medium border transition-all ${slots[slot.toLowerCase()] ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-white/10 text-white/40 hover:bg-white/5'}`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 gap-3 flex flex-col">
                        <button
                            onClick={handleAdd}
                            disabled={!name}
                            className="w-full bg-[#4ADE80] text-black font-bold py-3.5 rounded-xl hover:bg-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:shadow-[0_0_30px_rgba(74,222,128,0.4)]"
                        >
                            Save Schedule
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

import { useMedication } from '../context/MedicationContext';
import { useCaregiver } from '../context/CaregiverContext';
import { useEffect } from 'react';

export default function DiabetesCare() {
    // --- State ---
    const { medications, taken, toggleTaken, removeMed } = useMedication();
    const { caregivers, sendAlert, alerts } = useCaregiver();
    const [vitals, setVitals] = useState({
        height: 175, // cm
        weight: 72, // kg
        glucose: 98,
        sys: 118,
        dia: 78
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- Derived Metrics ---
    const bmi = useMemo(() => {
        if (!vitals.height || !vitals.weight) return 0;
        const hM = vitals.height / 100;
        return (vitals.weight / (hM * hM)).toFixed(1);
    }, [vitals.height, vitals.weight]);

    const bmiStatus = getBMIStatus(bmi);
    const bpStatus = getBPStatus(vitals.sys, vitals.dia);
    const glucoseStatus = getGlucoseStatus(vitals.glucose);

    // Overall Health Status Logic
    const overallStatus = useMemo(() => {
        const statuses = [bmiStatus.label, bpStatus.label, glucoseStatus.label];
        if (statuses.some(s => ['Obese', 'High BP', 'Diabetic Range'].includes(s))) {
            return {
                title: "Doctor Contact Advice",
                message: "Some of your metrics are in the high-risk range. Please consult your specialist.",
                color: "red"
            };
        }
        if (statuses.some(s => ['Overweight', 'Elevated', 'Pre-diabetic', 'Low'].includes(s))) {
            return {
                title: "Needs Attention",
                message: "You are doing okay, but some metrics need monitoring. Keep up your habits.",
                color: "yellow"
            };
        }
        return {
            title: "You're on the Safe Side",
            message: "Great job! Your vitals are measuring within the healthy range.",
            color: "green"
        };
    }, [bmiStatus, bpStatus, glucoseStatus]);

    // Caregiver Alert Logic
    useEffect(() => {
        if (overallStatus.color === 'red' && caregivers.length > 0) {
            // Rate limit alerts in real app, here we just check if one was recently sent or send once per mounting/change
            // For demo: Only send if no alerts exist yet or last alert was long ago.
            // Simplified: Just log for now to avoid loop.
            const sent = sendAlert('high_risk', `Patient metrics indicate high risk. Status: ${overallStatus.title}`);
            if (sent) {
                // In a real app we'd show a toast "Caregiver Notified"
            }
        }
    }, [overallStatus.color, caregivers.length, overallStatus.title]); // Simplified deps

    const statusColors = {
        green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-400', glow: 'shadow-green-900/50' },
        yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-900/50' },
        red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-red-900/50' }
    };

    const currentTheme = statusColors[overallStatus.color];

    return (
        <div className="bg-[#050505] min-h-screen font-['Inter'] text-white overflow-hidden pb-48">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 pt-32">

                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                            Diabetes Care
                        </h1>
                        <div className="flex items-center gap-4">
                            <p className="text-white/60 text-lg">Daily health intelligence companion.</p>
                            {caregivers.length > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </span>
                                    Caregiver Active
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-white/40 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <span>📅 Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                    </div>
                </header>

                <AddMedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                {/* --- MAIN GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN (Inputs & Checks) */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* 1. Overall Health Status Card */}
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative overflow-hidden rounded-3xl p-8 border ${currentTheme.border}/30 bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.0))]`}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-20 ${currentTheme.bg}`}></div>

                            <div className="relative z-10">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${currentTheme.border} ${currentTheme.text} bg-black/40`}>
                                    <span className={`w-2 h-2 rounded-full ${currentTheme.bg} animate-pulse`}></span>
                                    Current Status
                                </div>
                                <h2 className="text-3xl font-semibold text-white mb-2">{overallStatus.title}</h2>
                                <p className="text-white/60 text-lg leading-relaxed max-w-lg">
                                    {overallStatus.message}
                                </p>
                            </div>
                        </motion.section>

                        {/* 2. Vital Inputs (The "Work") */}
                        <section className="bg-[#0B0F14] rounded-3xl border border-white/5 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-semibold text-white/90">Daily Check-In</h2>
                                <button className="text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition-colors">
                                    AUTO-FILL MOCK
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Glucose */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white/80 font-medium">Blood Glucose</h3>
                                        <StatusIndicator statusObj={glucoseStatus} />
                                    </div>
                                    <MetricInput
                                        label="mg/dL"
                                        value={vitals.glucose}
                                        onChange={(v) => setVitals({ ...vitals, glucose: v })}
                                        placeholder="98"
                                    />
                                </div>

                                {/* Blood Pressure */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white/80 font-medium">Blood Pressure</h3>
                                        <StatusIndicator statusObj={bpStatus} />
                                    </div>
                                    <div className="flex gap-4">
                                        <MetricInput
                                            label="Systolic"
                                            value={vitals.sys}
                                            onChange={(v) => setVitals({ ...vitals, sys: v })}
                                            placeholder="120"
                                        />
                                        <MetricInput
                                            label="Diastolic"
                                            value={vitals.dia}
                                            onChange={(v) => setVitals({ ...vitals, dia: v })}
                                            placeholder="80"
                                        />
                                    </div>
                                </div>

                                {/* Weight & BMI */}
                                <div className="space-y-4 md:col-span-2 pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white/80 font-medium">Body Metrics</h3>
                                        <StatusIndicator statusObj={bmiStatus} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <MetricInput
                                            label="Weight (kg)"
                                            value={vitals.weight}
                                            onChange={(v) => setVitals({ ...vitals, weight: v })}
                                        />
                                        <MetricInput
                                            label="Height (cm)"
                                            value={vitals.height}
                                            onChange={(v) => setVitals({ ...vitals, height: v })}
                                        />
                                        <div className="bg-[#1A1F26] border border-white/5 rounded-lg p-3 flex flex-col justify-center">
                                            <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Calculated BMI</span>
                                            <span className="text-xl font-mono text-white mt-1">{bmi}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN (Support) */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* 3. Medication Tracker */}
                        <section className="bg-[#0B0F14] rounded-3xl border border-white/5 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white/90">Medications</h2>
                                        <p className="text-white/40 text-xs">Maintain your streak!</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    + Manage
                                </button>
                            </div>

                            <div className="space-y-3">
                                {medications.map(med => (
                                    <div key={med.id} className="space-y-2 group relative">
                                        {Object.entries(med.schedule).map(([slot, active]) => {
                                            if (!active) return null;
                                            const statusKey = `${med.id}_${slot}`;
                                            const isTaken = !!taken[statusKey];

                                            return (
                                                <Checkbox
                                                    key={statusKey}
                                                    label={`${med.name} (${slot.charAt(0).toUpperCase() + slot.slice(1)})`}
                                                    checked={isTaken}
                                                    onChange={() => toggleTaken(med.id, slot)}
                                                />
                                            );
                                        })}

                                        <button
                                            onClick={() => removeMed(med.id)}
                                            className="absolute md:top-2 md:right-2 top-0 right-0 p-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove Medication"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </button>
                                    </div>
                                ))}
                                {medications.length === 0 && <p className="text-white/40 text-sm italic">No medications planned.</p>}
                            </div>
                        </section>

                        {/* 4. Achievements (Non-gamified) */}
                        <section className="bg-[#0B0F14] rounded-3xl border border-white/5 p-8">
                            <h2 className="text-lg font-semibold text-white/90 mb-6">Progress Markers</h2>
                            <div className="space-y-4">
                                {/* Unlocked */}
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 flex items-center justify-center text-xl">
                                        🌟
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Consistency Champion</h4>
                                        <p className="text-white/40 text-xs mt-0.5">7 Days of perfect logging</p>
                                    </div>
                                </div>
                                {/* Locked */}
                                <div className="flex gap-4 items-center opacity-40 grayscale">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                                        ⚖️
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Healthy BMI Range</h4>
                                        <p className="text-white/40 text-xs mt-0.5">Reach BMI &lt; 25</p>
                                    </div>
                                    <div className="ml-auto text-xs border border-white/20 px-2 py-1 rounded">Locked</div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Doctor Call to Action */}
                        <AnimatePresence>
                            {(overallStatus.color === 'red' || overallStatus.color === 'yellow') && (
                                <motion.section
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-gradient-to-b from-[#1A1F26] to-[#0B0F14] rounded-3xl border border-white/5 p-8 text-center"
                                >
                                    <h3 className="text-white font-semibold mb-2">Professional Support</h3>
                                    <p className="text-white/60 text-sm mb-6">
                                        Based on your recent metrics, we recommend a quick consultation to adjust your plan.
                                    </p>
                                    <button className="w-full py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                                        Find Nearby Specialist
                                    </button>
                                </motion.section>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </div>
    );
}
