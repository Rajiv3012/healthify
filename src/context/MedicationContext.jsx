import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../config';

const MedicationContext = createContext();

export function MedicationProvider({ children }) {
    const [medications, setMedications] = useState([]);
    const [taken, setTaken] = useState({});

    // Fetch Initial Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Medications
                const medRes = await fetch(`${API_BASE}/medications`);
                if (medRes.ok) {
                    const meds = await medRes.json();
                    setMedications(meds);
                }

                // 2. Fetch Logs (Sync status)
                const logRes = await fetch(`${API_BASE}/sync/logs`);
                if (logRes.ok) {
                    const data = await logRes.json();
                    setTaken(data.logs || {});
                }
            } catch (err) {
                console.error("Failed to fetch medication data:", err);
            }
        };

        fetchData();
    }, []);

    const addMed = async (medData) => {
        try {
            const res = await fetch(`${API_BASE}/medications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: medData.name,
                    dosage: medData.dosage || '10mg', // Default if missing
                    schedule: medData.slots
                })
            });
            if (res.ok) {
                const updatedMeds = await res.json();
                setMedications(updatedMeds);
            }
        } catch (err) {
            console.error("Failed to add medication:", err);
        }
    };

    const removeMed = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/medications/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                const updatedMeds = await res.json();
                setMedications(updatedMeds);
            }
        } catch (err) {
            console.error("Failed to remove medication:", err);
        }
    };

    const toggleTaken = async (medicationId, slot, date) => {
        // Optimistic UI Update
        const key = `${medicationId}_${slot}_${date}`;
        const newState = !taken[key];
        setTaken(prev => ({ ...prev, [key]: newState }));

        try {
            const res = await fetch(`${API_BASE}/medications/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    medicationId,
                    slot,
                    date,
                    status: newState
                })
            });

            if (!res.ok) {
                // Revert on failure
                setTaken(prev => ({ ...prev, [key]: !newState }));
            }
        } catch (err) {
            console.error("Log failed:", err);
            setTaken(prev => ({ ...prev, [key]: !newState }));
        }
    };

    return (
        <MedicationContext.Provider value={{ medications, taken, addMed, removeMed, toggleTaken }}>
            {children}
        </MedicationContext.Provider>
    );
}

export const useMedication = () => useContext(MedicationContext);
