import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AppleVisual from '../components/AppleScroll';

export default function Home() {
    const { scrollY } = useScroll();

    // Smooth Scroll Physics for Parallax
    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const smoothScroll = useSpring(scrollY, springConfig);

    // Hero Scroll Effects (Linked to smoothed scroll)
    const heroOpacity = useTransform(smoothScroll, [0, 600], [1, 0]);
    const heroScale = useTransform(smoothScroll, [0, 600], [1, 0.95]);
    const heroY = useTransform(smoothScroll, [0, 600], [0, -100]); // Reduced movement for "grounded" feel
    const textY = useTransform(smoothScroll, [0, 600], [0, -50]);

    return (
        <div className="bg-[#050505] min-h-screen font-sans text-white selection:bg-green-500/30 overflow-x-hidden">
            <Navbar />

            {/* --- 1. HERO SECTION --- */}
            <section className="relative h-[110vh] flex items-center pt-24 px-6 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full items-center">

                    {/* LEFT: Text Content */}
                    <motion.div
                        style={{ y: textY, opacity: heroOpacity }}
                        className="space-y-10 z-10 text-center lg:text-left relative"
                    >
                        {/* Heading Group */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <h1 className="text-6xl md:text-8xl tracking-[-0.04em] font-medium leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
                                    Control diabetes.
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                            >
                                <h1 className="text-6xl md:text-8xl tracking-[-0.04em] font-medium leading-[0.95] text-white/30">
                                    One day at a time.
                                </h1>
                            </motion.div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                            className="text-xl md:text-2xl text-white/60 max-w-lg leading-relaxed font-light mx-auto lg:mx-0 tracking-wide"
                        >
                            Healthify aligns with your rhythm. <br className="hidden md:block" />
                            Simple habits. Deep insights. Zero anxiety.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                        >
                            <Link to="/features" className="group inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full text-lg font-medium hover:bg-[#e0e0e0] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                Start Your Journey
                                <div className="w-5 h-5 flex items-center justify-center relative overflow-hidden">
                                    <span className="absolute transform group-hover:translate-x-full transition-transform duration-300">→</span>
                                    <span className="absolute transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300">→</span>
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT: Apple Visual (Parallaxed) */}
                    <motion.div
                        style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
                        className="relative h-[50vh] md:h-[80vh] w-full flex items-center justify-center lg:justify-end"
                    >
                        <div className="w-full h-full relative flex items-center justify-center">
                            {/* Visual Component */}
                            <AppleVisual />

                            {/* Cinematic Glow */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ duration: 2 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-500/10 blur-[120px] -z-10 rounded-full pointer-events-none"
                            ></motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- 2. GUIDANCE SECTIONS --- */}

            {/* MEDICINES */}
            <SectionLayout
                title="Medicines on time."
                subtitle="Never miss a dose. Integrates effortlessly with your daily flow."
            >
                <TimelineVisual />
            </SectionLayout>

            {/* TRACKING */}
            <SectionLayout
                title="Daily signals."
                subtitle="Log vitals in seconds. Focus on the trend, not the noise."
                reversed
            >
                <TrendVisual />
            </SectionLayout>

            {/* SAFETY */}
            <SectionLayout
                title="Silent Guardian."
                subtitle="Our algorithms watch for anomalies while you live your life."
            >
                <StatusVisual />
            </SectionLayout>


            {/* --- 3. FINAL CTA --- */}
            <section className="py-24 px-6 text-center border-t border-white/5 bg-[#050505] relative overflow-hidden">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10 transition-all">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px", once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-5xl md:text-7xl font-medium text-white tracking-[-0.03em] mb-8 leading-tight">
                            You don’t need to be perfect. <br />
                            <span className="text-white/30">Just consistent.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px", once: true }}
                        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    >
                        <Link to="/features">
                            <button className="group relative mt-12 px-1 text-xl text-white/70 hover:text-green-400 transition-colors duration-300">
                                <span className="relative z-10">Explore Features</span>
                                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-white/20 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-green-400"></span>
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-16 px-6 border-t border-white/5 bg-black text-sm text-white/30">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="font-medium tracking-[0.2em] uppercase text-white/50">Healthify Inc.</div>
                    <div className="flex gap-10">
                        <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// --- REFINED SUB-COMPONENTS ---

function SectionLayout({ title, subtitle, children, reversed = false }) {
    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto border-t border-white/5">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-center ${reversed ? 'auto-rows-fr md:[direction:rtl]' : ''}`}
            >

                {/* Text Side */}
                <div className={`${reversed ? 'md:[direction:ltr]' : ''} space-y-8 text-center md:text-left`}>
                    <div>
                        <h2 className="text-4xl md:text-6xl font-medium text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-6 tracking-[-0.03em] leading-tight">
                            {title}
                        </h2>
                        <p className="text-xl text-white/50 leading-relaxed font-light max-w-md mx-auto md:mx-0">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Visual Side */}
                <div className={`${reversed ? 'md:[direction:ltr]' : ''} flex justify-center md:justify-end`}>
                    {children}
                </div>
            </motion.div>
        </section>
    );
}

// VISUAL 1: Timeline (Refined)
function TimelineVisual() {
    return (
        <div className="relative w-full max-w-md h-80 bg-[#0A0A0A] rounded-3xl border border-white/5 p-10 flex flex-col justify-center overflow-hidden shadow-2xl">
            {/* Ambient Light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px]"></div>

            <div className="absolute left-12 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

            {/* Items */}
            {[
                { label: "Morning Dose", time: "08:00", color: "bg-green-500" },
                { label: "Noon Check", time: "13:00", color: "bg-white/20" },
                { label: "Night Dose", time: "21:00", color: "bg-white/20" }
            ].map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (i * 0.2), duration: 0.5 }}
                    className="flex items-center gap-6 mb-8 last:mb-0 relative z-10"
                >
                    <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_15px_rgba(255,255,255,0.1)] ring-4 ring-[#0A0A0A]`}></div>
                    <div>
                        <div className="text-base font-medium text-white/90">{item.label}</div>
                        <div className="text-xs font-mono text-white/30 mt-1">{item.time}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

// VISUAL 2: Trend Line (Refined)
function TrendVisual() {
    return (
        <div className="relative w-full max-w-md h-80 bg-[#0A0A0A] rounded-3xl border border-white/5 p-8 flex flex-col justify-end overflow-hidden shadow-2xl group">
            {/* Header */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                <div>
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Glucose Avg</div>
                    <div className="text-3xl font-light text-white tracking-tight">98 <span className="text-lg text-white/30 font-normal">mg/dL</span></div>
                </div>
                <div className="text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-medium">Include Range</div>
            </div>

            {/* Grid Lines */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_40px]"></div>
            </div>

            <svg className="w-full h-32 relative z-10" viewBox="0 0 100 40" preserveAspectRatio="none">
                <motion.path
                    d="M0,35 C15,35 20,20 35,25 C50,30 55,15 70,18 C85,21 90,10 100,12"
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.path
                    d="M0,35 C15,35 20,20 35,25 C50,30 55,15 70,18 C85,21 90,10 100,12 V40 H0 Z"
                    fill="url(#trendGradient)"
                    opacity="0.2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.3 }}
                    transition={{ delay: 1, duration: 1 }}
                />
                <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ADE80" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}

// VISUAL 3: Status Morph (Refined)
function StatusVisual() {
    return (
        <div className="relative w-full max-w-md h-80 flex items-center justify-center">
            {/* Pulsing Background */}
            <div className="absolute inset-0 bg-green-500/5 blur-[80px] rounded-full animate-pulse"></div>

            <motion.div
                className="w-56 h-56 rounded-full border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md flex flex-col items-center justify-center relative z-10 shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Orbit Ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-2 rounded-full border border-white/5"></div>

                {/* Center Indicator */}
                <motion.div
                    className="w-4 h-4 bg-green-500 rounded-full mb-6 shadow-[0_0_20px_#22c55e]"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="text-2xl font-medium text-white tracking-tight">All Safe</div>
                <div className="text-sm text-white/40 mt-2 font-light">Monitoring Active</div>

                {/* Scanning Line (Replaced keyframe CSS with Framer Motion loop for cleanliness) */}
                <div className="absolute inset-0 rounded-full overflow-hidden opacity-20 pointer-events-none">
                    <motion.div
                        className="w-full h-[2px] bg-green-400 absolute top-0 shadow-[0_0_10px_#4ade80]"
                        animate={{ top: ["10%", "90%"], opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </div>
    )
}
