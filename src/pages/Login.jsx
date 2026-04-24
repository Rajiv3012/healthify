import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { GoogleLogin } from '@react-oauth/google';
import healthcareLoginImg from '../healthcare login page.png';

const CardTiltWrapper = ({ children, className = "" }) => {
    const cardRef = useRef(null);
    const shineRef = useRef(null);
    const borderShineRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const shine = shineRef.current;
        const borderShine = borderShineRef.current;
        if (!card || !shine || !borderShine) return;

        // Check if device is touch-capable (disable GSAP tilt on mobile)
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Subtle tilt: max 6 degrees
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            // Shine position
            const shineX = (x / rect.width) * 100;
            const shineY = (y / rect.height) * 100;

            gsap.to(card, {
                duration: 0.6,
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1200,
                ease: "power2.out"
            });

            // Surface shine - Stronger
            gsap.to(shine, {
                duration: 0.4,
                background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(34, 197, 94, 0.15) 0%, transparent 70%)`,
                ease: "power2.out"
            });

            // Border shine - MUCH Stronger and larger radius
            gsap.to(borderShine, {
                duration: 0.4,
                background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(34, 197, 94, 1) 0%, rgba(34, 197, 94, 0.5) 20%, transparent 60%)`,
                ease: "power2.out"
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                duration: 1,
                rotateX: 0,
                rotateY: 0,
                ease: "power3.out"
            });
            gsap.to(shine, {
                duration: 1,
                background: `radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0) 0%, transparent 70%)`,
                ease: "power3.out"
            });
            gsap.to(borderShine, {
                duration: 1,
                background: `radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0) 0%, transparent 60%)`,
                ease: "power3.out"
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div style={{ perspective: "1200px" }} className={`relative z-10 ${className}`}>
            <div 
                ref={cardRef} 
                className="w-full h-full relative rounded-[28px] p-[2px] bg-[#1E242D] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] group overflow-hidden" 
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Border shine layer that tracks cursor (Stronger) */}
                <div ref={borderShineRef} className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Inner Card Container */}
                <div className="w-full h-full bg-[#0A0D12] rounded-[26px] overflow-hidden flex flex-col relative z-10">
                    {/* Subtle surface shine overlay mapped to cursor */}
                    <div ref={shineRef} className="absolute inset-0 z-50 pointer-events-none rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const isEmailValid = email.includes('@') && email.includes('.');
    const isFormValid = isEmailValid && password.length >= 6;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setError("Please provide a valid email and password (min 6 chars).");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/diabetes');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true);
            setError('');
            await loginWithGoogle(credentialResponse.credential);
            navigate('/diabetes');
        } catch (err) {
            setError("Google login failed. " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030406] flex items-center justify-center p-4 sm:p-8 relative font-['Inter'] selection:bg-green-500/30 overflow-hidden">
            {/* Very controlled background lighting, NO blurs, NO glass */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/15 via-[#030406] to-[#030406] pointer-events-none"></div>

            <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 relative z-10 items-stretch">
                {/* Left Side: Visual/Branding Image Card */}
                <CardTiltWrapper className="hidden lg:flex w-full lg:w-1/2 min-h-[600px]">
                    <div className="w-full h-full relative flex flex-col justify-between overflow-hidden bg-[#050608]">
                        {/* Object-cover ensures zero black/empty space without scaling animations */}
                        <img 
                            src={healthcareLoginImg} 
                            alt="Health Tracking Interaction" 
                            className="absolute inset-0 w-full h-full object-cover z-0"
                        />
                        
                        {/* Controlled dark gradient overlay to ensure text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/60 to-[#0A0D12]/20 z-10"></div>
                        
                        <div className="relative z-20 p-10">
                            <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-[#0A0D12] shadow-md">H</span>
                                Healthify
                            </Link>
                        </div>

                        <div className="relative z-20 mt-auto p-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0A0D12]/50 border border-green-500/20 text-xs font-semibold text-green-400 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Health Tracking System
                            </div>
                            <h2 className="text-4xl font-semibold text-white leading-tight mb-4 tracking-tight drop-shadow-lg">
                                Smarter health.<br/>
                                <span className="text-green-400">Better life.</span>
                            </h2>
                            <p className="text-gray-300 text-base max-w-sm leading-relaxed drop-shadow-md">
                                Experience AI-driven insights, seamless family monitoring, and clinical-grade tracking in one unified platform.
                            </p>
                        </div>
                    </div>
                </CardTiltWrapper>

                {/* Right Side: Login Form Card */}
                <CardTiltWrapper className="w-full lg:w-1/2">
                    <div className="w-full h-full p-8 sm:p-12 relative flex flex-col justify-center bg-[#0A0D12] z-20">
                        <div className="w-full max-w-[400px] mx-auto">
                            <div className="mb-10 lg:hidden">
                                <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-[#0A0D12]">H</span>
                                    Healthify
                                </Link>
                            </div>

                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Sign in</h1>
                                <p className="text-gray-400 text-sm">Enter your credentials to access your dashboard.</p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-sm flex items-start gap-3 mb-6">
                                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#12161C] border border-[#2A313C] rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/60 transition-all shadow-sm"
                                        placeholder="name@company.com"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-300">Password</label>
                                        <a href="#" className="text-sm font-medium text-green-500 hover:text-green-400 transition-colors">Forgot password?</a>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#12161C] border border-[#2A313C] rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/60 transition-all shadow-sm"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading || !isFormValid}
                                        className="w-full flex items-center justify-center gap-2 bg-green-500 text-[#0A0D12] font-semibold py-3.5 rounded-lg hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-[#0A0D12] border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                Sign In
                                                <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-[#2A313C]"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-[#0A0D12] text-gray-500">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <GoogleLogin 
                                        onSuccess={handleGoogleSuccess} 
                                        onError={() => setError('Google Sign-In failed.')}
                                        theme="filled_black"
                                        shape="pill"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-gray-400 text-sm">
                                    Don't have an account? {' '}
                                    <Link to="/register" className="text-green-400 font-medium hover:text-green-300 transition-colors">
                                        Create one
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </CardTiltWrapper>
            </div>
        </div>
    );
}
