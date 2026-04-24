import { createContext, useContext, useState, useCallback } from 'react';

const CaregiverContext = createContext();

export function CaregiverProvider({ children }) {
    const [caregivers, setCaregivers] = useState([
        // Mock initial caregiver for demo purposes
        // { id: 1, name: "Sarah (Daughter)", contact: "555-0123", relation: "Daughter" }
    ]);

    const [alerts, setAlerts] = useState([]);

    const addCaregiver = (caregiver) => {
        setCaregivers(prev => [...prev, { ...caregiver, id: Date.now() }]);
    };

    const removeCaregiver = (id) => {
        setCaregivers(prev => prev.filter(c => c.id !== id));
    };

    const sendAlert = useCallback((type, message) => {
        if (caregivers.length === 0) return; // No one to alert

        const newAlert = {
            id: Date.now(),
            type, // 'missed_meds', 'high_risk', 'trend'
            message,
            timestamp: new Date().toISOString(),
            sentTo: caregivers.map(c => c.name)
        };

        console.log("ALERT SENT:", newAlert);
        setAlerts(prev => [newAlert, ...prev]);

        // Return true to indicate alert was "sent"
        return true;
    }, [caregivers]);

    return (
        <CaregiverContext.Provider value={{ caregivers, addCaregiver, removeCaregiver, sendAlert, alerts }}>
            {children}
        </CaregiverContext.Provider>
    );
}

export const useCaregiver = () => useContext(CaregiverContext);
