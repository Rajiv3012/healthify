import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        caregiverName: '',
        caregiverEmail: '',
        caregiverRelation: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return false;
        }
        if (!/\d/.test(formData.password)) {
            setError("Password must contain a number");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                caregiverName: formData.caregiverName,
                caregiverEmail: formData.caregiverEmail,
                caregiverRelation: formData.caregiverRelation
            });
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-['Inter']">
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-[#0B0F14] border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-white/40">Join Healthify for personalized care</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white/60 border-b border-white/5 pb-2">Your Details</h3>
                        <div>
                            <label className="block text-xs font-semibold text-white/40 mb-1">Full Name</label>
                            <input name="name" required onChange={handleChange} className="w-full bg-[#1A1F26] border border-white/5 rounded-lg px-4 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-white/40 mb-1">Email</label>
                            <input type="email" name="email" required onChange={handleChange} className="w-full bg-[#1A1F26] border border-white/5 rounded-lg px-4 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-white/40 mb-1">Password</label>
                            <input type="password" name="password" required onChange={handleChange} className="w-full bg-[#1A1F26] border border-white/5 rounded-lg px-4 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-white/40 mb-1">Confirm Password</label>
                            <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full bg-[#1A1F26] border border-white/5 rounded-lg px-4 py-2 text-white" />
                        </div>
                    </div>

                    {/* Caregiver Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white/60 border-b border-white/5 pb-2">Primary Caregiver (Optional)</h3>
                        <div>
                            <label className="block text-xs font-semibold text-white/40 mb-1">Caregiver Name</label>
                            <input name="caregiverName" onChange={handleChange} className="w-full bg-[#1A1F26] border border-white/5 rounded-lg px-4 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-white/40 mb-1">Caregiver Email</label>
                            <input type="email" name="caregiverEmail" onChange={handleChange} className="w-full bg-[#1A1F26] border border-white/5 rounded-lg px-4 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-white/40 mb-1">Relation</label>
                            <input name="caregiverRelation" onChange={handleChange} className="w-full bg-[#1A1F26] border border-white/5 rounded-lg px-4 py-2 text-white" placeholder="e.g. Daughter" />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-all"
                        >
                            Create Account
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-white/40">
                    Already have an account? {' '}
                    <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold">
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
