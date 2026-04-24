import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCaregiver } from '../context/CaregiverContext';

export default function CaregiverManager({ isOpen, onClose }) {
    const { caregivers, addCaregiver, removeCaregiver } = useCaregiver();
    const [formData, setFormData] = useState({ name: '', relation: '', contact: '' });

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!formData.name || !formData.contact) return;
        addCaregiver(formData);
        setFormData({ name: '', relation: '', contact: '' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#12161C] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl overflow-hidden"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Family Access</h2>
                        <p className="text-white/40 text-sm mt-1">Trusted individuals who can view your status.</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-colors">✕</button>
                </div>

                {/* List of existing caregivers */}
                <div className="space-y-3 mb-8">
                    {caregivers.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5">
                            <p className="text-white/40 text-sm">No caregivers added yet.</p>
                        </div>
                    ) : (
                        caregivers.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-4 bg-[#0B0F14] border border-white/5 rounded-xl">
                                <div>
                                    <div className="font-medium text-white">{c.name}</div>
                                    <div className="text-xs text-white/40">{c.relation} • {c.contact}</div>
                                </div>
                                <button onClick={() => removeCaregiver(c.id)} className="text-red-400 text-xs hover:underline">Remove</button>
                            </div>
                        ))
                    )}
                </div>

                {/* Add New Form */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                    <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Add New Caregiver</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="bg-[#1A1F26] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/50 text-sm"
                        />
                        <input
                            type="text"
                            placeholder="Relationship (e.g. Daughter)"
                            value={formData.relation}
                            onChange={e => setFormData({ ...formData, relation: e.target.value })}
                            className="bg-[#1A1F26] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/50 text-sm"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Phone or Email (for alerts)"
                        value={formData.contact}
                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                        className="w-full bg-[#1A1F26] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/50 text-sm"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.name || !formData.contact}
                        className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Grant Access
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
