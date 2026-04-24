import { motion } from 'framer-motion';

export default function FeatureCard({ title, subtitle, icon, delay = 0, variant = "default" }) {
    const isRisk = variant === "risk";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`
        relative p-6 rounded-2xl border backdrop-blur-sm
        ${isRisk ? 'bg-[#0B0F14]/80 border-white/5' : 'bg-[#0B0F14] border-white/5 hover:border-white/10 transition-colors'}
        flex flex-col h-full
      `}
        >
            {/* Icon or Status Indicator */}
            {icon && (
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 text-green-400">
                    {icon}
                </div>
            )}

            <h3 className="text-xl font-semibold text-white/90 mb-2">{title}</h3>
            <p className="text-sm text-white/60 leading-relaxed font-light">{subtitle}</p>
        </motion.div>
    );
}
