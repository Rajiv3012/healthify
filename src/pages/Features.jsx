import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Features() {
    const scrollRef = useRef(null);

    // --- ANCHOR SCROLL ANIMATIONS ---
    const { scrollYProgress } = useScroll({ target: scrollRef });

    return (
        <div ref={scrollRef} className="bg-[#050505] min-h-screen font-['Inter'] text-white selection:bg-green-500/30 overflow-hidden">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <header className="pt-48 pb-32 px-6 relative">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
                    >
                        How Healthify Helps You <br /> Control Diabetes
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto"
                    >
                        Simple daily habits. Clear guidance. <br /> Support when you need it.
                    </motion.p>
                </div>

                {/* Ambient Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-green-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            </header>

            <div className="max-w-5xl mx-auto px-6 pb-32 space-y-48">

                {/* --- SECTION 1: MEDICINE --- */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center gap-16"
                >
                    <div className="flex-1 space-y-6">
                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-2xl mb-4">
                            💊
                        </div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-white">Take Medicines on Time</h2>
                        <p className="text-lg text-white/60 leading-relaxed">
                            Taking medicines on time is the <b>most important step</b> in controlling diabetes. We make it simple to remember your morning, noon, and night doses.
                        </p>
                    </div>

                    {/* VISUAL: Medicine Tracker Simulation */}
                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-[#0B0F14] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                            <div className="space-y-4 relative z-10">
                                {['Morning', 'Noon', 'Night'].map((time, i) => (
                                    <motion.div
                                        key={time}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2 + 0.5 }}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${i < 2 ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                                            {i < 2 && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-2 w-16 bg-white/20 rounded mb-1.5"></div>
                                            <div className="h-1.5 w-10 bg-white/10 rounded"></div>
                                        </div>
                                        <span className="text-sm text-white/40">{time}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/5 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </motion.section>

                {/* --- SECTION 2: TRACKING --- */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row-reverse items-center gap-16"
                >
                    <div className="flex-1 space-y-6">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl mb-4">
                            📈
                        </div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-white">Track Your Health Daily</h2>
                        <p className="text-lg text-white/60 leading-relaxed">
                            Daily blood pressure, weight, and sugar trends help prevent complications. Watching these numbers stay stable gives you peace of mind.
                        </p>
                    </div>

                    {/* VISUAL: Graph Animation */}
                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-[#0B0F14] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                            <div className="flex justify-between items-end h-32 gap-2 relative z-10">
                                {[40, 60, 55, 75, 65, 80, 70].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                                        className="flex-1 bg-gradient-to-t from-blue-500/20 to-blue-500/60 rounded-t-sm"
                                    ></motion.div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between text-xs text-white/20 font-mono">
                                <span>MON</span>
                                <span>SUN</span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* --- SECTION 3: SAFETY STATUS --- */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center gap-16"
                >
                    <div className="flex-1 space-y-6">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-2xl mb-4">
                            🛡️
                        </div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-white">Know When You’re Safe</h2>
                        <p className="text-lg text-white/60 leading-relaxed">
                            You don’t need to understand complicated medical numbers. We’ll simply tell you if you are "Safe", "Improving", or need to "See a Doctor".
                        </p>
                    </div>

                    {/* VISUAL: Status Switching */}
                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-[#0B0F14] border border-white/10 rounded-3xl p-8 flex items-center justify-center min-h-[200px] relative overflow-hidden">
                            <motion.div
                                animate={{
                                    borderColor: ["rgba(34,197,94,0.2)", "rgba(234,179,8,0.2)", "rgba(34,197,94,0.2)"],
                                    backgroundColor: ["rgba(34,197,94,0.05)", "rgba(234,179,8,0.05)", "rgba(34,197,94,0.05)"]
                                }}
                                transition={{ duration: 8, repeat: Infinity }}
                                className="px-6 py-3 rounded-full border border-green-500/20 bg-green-500/10 flex items-center gap-3 backdrop-blur-md relative z-10"
                            >
                                <motion.div
                                    animate={{ backgroundColor: ["#22c55e", "#eab308", "#22c55e"] }}
                                    transition={{ duration: 8, repeat: Infinity }}
                                    className="w-3 h-3 rounded-full bg-green-500 animate-pulse"
                                ></motion.div>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-white font-medium tracking-wide"
                                >
                                    You're on the Safe Side
                                </motion.span>
                            </motion.div>

                            {/* Glow */}
                            <motion.div
                                animate={{ backgroundColor: ["rgba(34,197,94,0.1)", "rgba(234,179,8,0.1)", "rgba(34,197,94,0.1)"] }}
                                transition={{ duration: 8, repeat: Infinity }}
                                className="absolute inset-0 blur-[60px]"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* --- SECTION 4: MOTIVATION --- */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto space-y-8"
                >
                    <div className="w-16 h-16 bg-purple-500/10 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">
                        🌟
                    </div>
                    <h2 className="text-3xl md:text-5xl font-semibold text-white">Stay Motivated, Not Stressed</h2>
                    <p className="text-xl text-white/60 leading-relaxed">
                        Consistency matters more than perfection. We celebrate every day you take care of your health with simple milestones.
                    </p>

                    <div className="pt-8">
                        <Link to="/diabetes">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[#4ADE80] text-black px-10 py-4 rounded-full text-lg font-bold hover:bg-[#22c55e] transition-colors shadow-[0_0_30px_rgba(74,222,128,0.3)]"
                            >
                                Start Your Journey
                            </motion.button>
                        </Link>
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
