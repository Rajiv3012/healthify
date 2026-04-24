import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CaregiverManager from './CaregiverManager';

export default function Navbar() {
    const location = useLocation();
    const [showCaregiver, setShowCaregiver] = useState(false);

    return (
        <>
            <CaregiverManager isOpen={showCaregiver} onClose={() => setShowCaregiver(false)} />
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference pointer-events-none text-white/90">
                <Link to="/" className="text-xl font-bold tracking-tighter pointer-events-auto">Healthify</Link>

                <div className="flex items-center gap-6 pointer-events-auto">
                    <div className="hidden md:flex gap-6 text-sm font-medium">
                        <Link
                            to="/features"
                            className={`transition-colors hover:text-green-400 ${location.pathname === '/features' ? 'text-green-400' : 'text-white/60'}`}
                        >
                            Features
                        </Link>
                        <Link
                            to="/diabetes"
                            className={`transition-colors hover:text-green-400 ${location.pathname === '/diabetes' ? 'text-green-400' : 'text-white/60'}`}
                        >
                            Diabetes Care
                        </Link>
                        <Link
                            to="/achievements"
                            className={`transition-colors hover:text-green-400 ${location.pathname === '/achievements' ? 'text-green-400' : 'text-white/60'}`}
                        >
                            Achievements
                        </Link>
                    </div>

                    <Link
                        to="/login"
                        className="rounded-full px-5 py-2 text-sm font-semibold border border-green-400/30 bg-green-500/20 text-green-100 shadow-[0_8px_24px_rgba(34,197,94,0.22)] transition-all hover:bg-green-400/30 hover:border-green-300/50 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300/60"
                    >
                        Login
                    </Link>

                    <button
                        onClick={() => setShowCaregiver(true)}
                        className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium border border-white/10 hover:bg-white/20 cursor-pointer transition-all flex items-center gap-2"
                    >
                        <span>Family Access</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
