import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import PharmacistLayout from '../components/PharmacistLayout';
import { patientService } from '../services/patientService';
import { prescriptionService } from '../services/prescriptionService';
import { authService } from '../services/authService';
import { eventBus } from '../utils/eventBus';

const PatientHistoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const patientData = await patientService.getPatientById(id);
                if (patientData) {
                    setPatient(patientData);
                }

                // 2. Fetch Medication History
                // Optimized: Using dedicated endpoint that includes nested drugs
                const rawData = await prescriptionService.getPrescriptionsByPatient(id);
                
                if (rawData && Array.isArray(rawData)) {
                    setHistory(rawData);
                } else {
                    setHistory([]);
                }
            } catch (err) {
                console.error("[ERROR] Critical failure loading history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // 1. Sync Listeners
        const unsub = eventBus.on((type) => {
            if (type === 'prescriptionsUpdated') fetchData();
        });

        // 2. Polling
        const pollId = setInterval(fetchData, 30000);

        return () => {
            unsub();
            clearInterval(pollId);
        };
    }, [id]);

    const patientName = patient ? (patient.full_name || patient.name) : 'Patient';
    const patientPID = patient ? (patient.pid || `PID-${String(id).padStart(4, '0')}`) : '...';
    const patientAgeGender = patient ? `${patient.age || 'N/A'} yrs • ${patient.gender || 'N/A'}` : '';

    const Layout = user?.role === 'pharmacist' ? PharmacistLayout : DoctorLayout;

    return (
        <Layout>
            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '90px', fontFamily: "'Inter', sans-serif" }}>
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={() => navigate(-1)} style={{
                            width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#111827', margin: '0 0 6px 0' }}>{patientName}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ backgroundColor: '#E6FCFA', color: '#00BFB3', fontSize: '12px', fontWeight: '800', padding: '4px 8px', borderRadius: '6px' }}>
                                    {patientPID}
                                </span>
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                                    {patientAgeGender}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Add Prescription Button (Only for doctors) */}
                    {user?.role === 'doctor' && (
                        <button 
                            onClick={() => navigate('/create-prescription', { state: { patient } })}
                            style={{
                                backgroundColor: '#00E3D3', color: '#fff', border: 'none',
                                padding: '12px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: '800',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Create Prescription
                        </button>
                    )}
                </div>

                {/* ── Label ── */}
                <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
                    MEDICATION HISTORY
                </h2>

                {/* ── Timeline ── */}
                <div style={{ position: 'relative', paddingLeft: '32px' }}>
                    {loading && history.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '50px', color: '#6B7280' }}>Loading patient history...</p>
                    ) : history.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '50px', color: '#9CA3AF', fontStyle: 'italic' }}>
                            No previous medical records found for this patient.
                        </p>
                    ) : history.map((record, index) => (
                        <div key={record.id} style={{ position: 'relative', marginBottom: '24px', zIndex: 1 }}>
                            {/* Dot */}
                            <div style={{
                                position: 'absolute', left: '-27px', top: '24px', width: '14px', height: '14px',
                                borderRadius: '50%', backgroundColor: index === 0 ? '#00E3D3' : '#D1D5DB', border: '3px solid #F9FAFB'
                            }} />

                            {/* Card */}
                            <div style={{
                                backgroundColor: '#fff', borderRadius: '24px', padding: '24px',
                                border: '1px solid #F3F4F6', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', width: '100%'
                            }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#00BFB3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {record.formatted_date || record.created_at}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#111827', margin: '0 0 20px 0' }}>{record.doctor_department || 'General Medicine'}</h3>

                                {/* Diagnosis */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ fontSize: '10px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>DIAGNOSIS</p>
                                    <p style={{ fontSize: '15px', fontWeight: '500', color: '#374151', margin: 0 }}>{record.diagnosis}</p>
                                </div>

                                {/* Divider */}
                                <div style={{ height: '1px', backgroundColor: '#F3F4F6', marginBottom: '20px' }} />

                                {/* Prescription */}
                                <div>
                                    <p style={{ fontSize: '10px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>PRESCRIPTION</p>
                                    
                                    {record.drugs && record.drugs.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {record.drugs.map((rx, i) => (
                                                <div key={i} style={{ 
                                                    backgroundColor: '#F8FAFC', 
                                                    borderRadius: '16px', 
                                                    padding: '16px',
                                                    border: '1px solid #E2E8F0'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ 
                                                                width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E0F2FE', 
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                                            }}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                                                            </div>
                                                            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E293B', margin: 0 }}>
                                                                {(rx.drug_name || '').toLowerCase().includes('tab') ? '' : 'Tab. '}{rx.drug_name}
                                                            </h4>
                                                        </div>
                                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: '8px' }}>
                                                            {rx.strength || rx.dosage || ''}
                                                        </span>
                                                    </div>
                                                    <div style={{ paddingLeft: '42px', fontSize: '13px', fontWeight: '600', color: '#64748B' }}>
                                                        {rx.frequency} for {rx.duration}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#9CA3AF', fontStyle: 'italic', margin: 0 }}>
                                            No medication details recorded.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default PatientHistoryPage;
