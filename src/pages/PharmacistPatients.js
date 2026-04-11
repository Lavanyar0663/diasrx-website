import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacistLayout from '../components/PharmacistLayout';
import { getAvatarUrl } from '../utils/helpers';
import { prescriptionService } from '../services/prescriptionService';
import { patientService } from '../services/patientService';
import { eventBus } from '../utils/eventBus';

const PharmacistPatientsPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            setError(null);
            try {
                // Workaround: Since Pharmacist can't call /patients (backend restriction),
                // we build the patient list from the clinical history they have access to.
                const allHistory = await prescriptionService.getPrescriptionHistory();
                
                if (Array.isArray(allHistory)) {
                    // Include ONLY patients whose prescription status is "DISPENSED"
                    const dispensedHistory = allHistory.filter(p => p.status?.toUpperCase() === 'DISPENSED');

                    // Deduplicate using patientId, keep latest record assuming history is already sorted
                    const uniqueDispensedHistory = [];
                    const seenPatientIds = new Set();
                    for (const rx of dispensedHistory) {
                        const pid = rx.patient_id || rx.patient_display_id;
                        if (!seenPatientIds.has(pid)) {
                            seenPatientIds.add(pid);
                            uniqueDispensedHistory.push(rx);
                        }
                    }

                    // Sort by latest updated_at or created_at (latest first)
                    uniqueDispensedHistory.sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));

                    const patientIds = uniqueDispensedHistory.map(p => p.patient_id || p.patient_display_id);
                    
                    // Fetch full details for each unique patient to get the age/phone
                    const patientDetails = await Promise.all(
                        patientIds.slice(0, 20).map(async (id) => {
                            try {
                                return await patientService.getPatientById(id);
                            } catch (e) {
                                console.warn(`Failed to fetch details for patient ${id}`, e);
                                // Fallback to history data if detail fetch fails
                                const h = uniqueDispensedHistory.find(p => (p.patient_id || p.patient_display_id) === id);
                                return {
                                    id: h.patient_id,
                                    pid: h.patient_display_id || `PID-${String(h.patient_id).padStart(4, '0')}`,
                                    name: h.patient_name,
                                    gender: h.gender || h.pat_gender,
                                    age: '?'
                                };
                            }
                        })
                    );

                    setPatients(patientDetails.filter(p => p !== null));
                } else {
                    setPatients([]);
                }
            } catch (err) {
                console.error("Failed to reconstruct patients list from history", err);
                setPatients([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();

        // 1. Sync Listeners
        const unsub = eventBus.on((type) => {
            if (type === 'prescriptionsUpdated') fetchPatients();
        });

        // 2. Fallback Polling (Every 60s for patient list)
        const pollId = setInterval(fetchPatients, 60000);

        return () => {
            unsub();
            clearInterval(pollId);
        };
    }, []);

    const filteredPatients = patients.filter(p => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (p.name || '').toLowerCase().includes(s) || 
               (p.pid || '').toLowerCase().includes(s) ||
               (p.phone || '').includes(s);
    });

    return (
        <PharmacistLayout>
            <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px', fontFamily: "'Inter', sans-serif" }}>
                {/* ── Header ── */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111827', marginBottom: '4px' }}>Patients</h1>
                    <p style={{ fontSize: '15px', fontWeight: '500', color: '#6B7280', margin: 0 }}>Manage your patient history</p>
                </div>

                {/* ── Search Bar ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: '#fff', borderRadius: '30px', padding: '16px 24px',
                    border: '1px solid #E5E7EB', marginBottom: '32px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name or Patient ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            border: 'none', outline: 'none', background: 'transparent',
                            fontSize: '15px', fontWeight: '500', color: '#374151', width: '100%',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                {/* ── Error & Loading States ── */}
                {error && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '12px', padding: '12px 20px', marginBottom: '20px', color: '#EF4444', fontWeight: '700', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        HOSPITAL PATIENTS
                    </h2>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#00BFB3' }}>
                        {loading ? '...' : filteredPatients.length} Total
                    </span>
                </div>

                {/* ── Patient List ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1.5px solid #F3F4F6', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '18px', backgroundColor: '#F3F4F6' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ height: '16px', backgroundColor: '#F3F4F6', borderRadius: '6px', marginBottom: '8px', width: '45%' }} />
                                    <div style={{ height: '12px', backgroundColor: '#F3F4F6', borderRadius: '6px', width: '30%' }} />
                                </div>
                            </div>
                        ))
                    ) : filteredPatients.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', border: '2px dashed #F3F4F6', borderRadius: '24px', backgroundColor: '#FAFAFA' }}>
                            <p style={{ color: '#9CA3AF', fontSize: '15px', fontWeight: '700' }}>
                                {search ? `No patients matched "${search}"` : 'No dispensed patients yet'}
                            </p>
                        </div>
                    ) : filteredPatients.map((p) => {
                        const opdId = p.pid ? `${p.pid}` : `PID-${String(p.id).padStart(4, '0')}`;
                        return (
                            <div
                                key={p.id}
                                onClick={() => navigate(`/patient-history/${p.id}`)}
                                style={{
                                    backgroundColor: '#fff', borderRadius: '24px', padding: '20px 24px',
                                    border: '1px solid #F3F4F6',
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)'}
                                onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '18px',
                                    overflow: 'hidden', display: 'flex', flexShrink: 0,
                                    border: '1px solid #E5E7EB'
                                }}>
                                    <img src={getAvatarUrl(null, p.gender, p.name)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#111827', margin: 0 }}>{p.name}</h3>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                                            {p.age || '?'}y • {p.gender || 'Unknown'} • {opdId}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#9CA3AF' }}>
                                            {p.phone || 'No phone'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PharmacistLayout>
    );
};

export default PharmacistPatientsPage;
