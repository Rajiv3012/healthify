import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Features from './pages/Features';
import DiabetesCare from './pages/DiabetesCare';
import Achievements from './pages/Achievements';
import Login from './pages/Login';
import Register from './pages/Register';
import { MedicationProvider } from './context/MedicationContext';
import { CaregiverProvider } from './context/CaregiverContext';
import { AuthProvider } from './context/AuthContext';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    return (
        <AuthProvider>
            <MedicationProvider>
                <CaregiverProvider>
                    <Router>
                        <ScrollToTop />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/features" element={<Features />} />
                            <Route path="/diabetes" element={<DiabetesCare />} />
                            <Route path="/achievements" element={<Achievements />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </Router>
                </CaregiverProvider>
            </MedicationProvider>
        </AuthProvider>
    );
}

export default App;
