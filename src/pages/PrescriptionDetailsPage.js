import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import { patientService } from '../services/patientService';
import { prescriptionService } from '../services/prescriptionService';
import { authService } from '../services/authService';

/**
 * PrescriptionDetailsPage
 * 
 * A robust page for viewing patient prescription history.
 * Implements a 4-Stage data recovery mechanism to ensure that medication details
 * are always visible, even in cases of backend authorization leaks or missing nested data.
 */
const PrescriptionDetailsPage = () => {
    const navigate = useNavigate();
    const { id: patientId } = useParams();

    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!patientId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // --- Step 0: Patient Core Details ---
                const patientData = await patientService.getPatientById(patientId);
                if (patientData) setPatient(patientData);

                // Drug Normalizer strictly following requirements
                const normalize = (drugs) => (drugs || []).map(d => ({
                    name: d.drug_name || d.name || 'Unknown Medication',
                    dosage: d.strength || d.dosage || d.quantity || 'As prescribed',
                    frequency: d.frequency || '',
                    duration: d.duration || 'As prescribed'
                }));

                // --- STAGE 1: Primary API ---
                let results = await prescriptionService.getPrescriptionsByPatient(patientId);
                console.log(`[NETWORK] Stage 1 - getPrescriptionsByPatient(${patientId}) Results:`, results);

                // --- STAGE 2: Doctor Fallback ---
                if (!results || results.length === 0) {
                    const user = authService.getCurrentUser();
                    if (user) {
                        const doctorId = user.id || user.user_id;
                        const allDoctorPrescriptions = await prescriptionService.getPrescriptionsByDoctor(doctorId);
                        results = (allDoctorPrescriptions || []).filter(p =>
                            String(p.patient_id) === String(patientId) || String(p.patient_display_id) === String(patientId)
                        );
                        console.log(`[NETWORK] Stage 2 - getPrescriptionsByDoctor(${doctorId}) Filtered Results:`, results);
                    }
                }

                // --- STAGE 2.5 & 3: Deep Sync & AI Enrichment ---
                const consolidatedData = await Promise.all((results || []).map(async (p) => {
                    let record = { ...p };
                    
                    // Initial normalization
                    record.drugs = normalize(record.drugs);

                    // --- STAGE 2.5: Deep Sync via ID (Fetching real drug data) ---
                    // Triggers if drugs are missing OR contain "Unknown Medication"
                    const needsSync = !record.drugs || record.drugs.length === 0 || record.drugs.some(d => d.name === 'Unknown Medication');
                    
                    if (needsSync) {
                        console.log(`[NETWORK] Stage 2.5 - DEEP SYNC: getPrescriptionById(${record.id})`);
                        try {
                            const detailed = await prescriptionService.getPrescriptionById(record.id);
                            if (detailed && detailed.drugs && detailed.drugs.length > 0) {
                                record.drugs = normalize(detailed.drugs);
                                console.log(`[NETWORK] Stage 2.5 SUCCESS for ${record.id}`);
                            }
                        } catch (err) {
                            console.warn(`[NETWORK] Stage 2.5 error for ${record.id}:`, err);
                        }
                    }

                    // --- STAGE 3: AI Fallback (Last Resort) ---
                    // Triggers if drugs are STILL missing OR STILL contain "Unknown Medication"
                    const stillNeedsSync = !record.drugs || record.drugs.length === 0 || record.drugs.some(d => d.name === 'Unknown Medication');

                    if (stillNeedsSync) {
                        console.log(`[NETWORK] Stage 3 - AI ENRICHMENT: getExplanation(${record.id})`);
                        try {
                            const explanation = await prescriptionService.getExplanation(record.id);
                            const enrichedDrugs = explanation.simplified_explanation?.drugs || [];
                            if (enrichedDrugs.length > 0) {
                                record.drugs = normalize(enrichedDrugs);
                                record.isAiGenerated = true; // Mark for UI indication
                                console.log(`[NETWORK] Stage 3 SUCCESS for AI Recovery of ${record.id}`);
                            }
                        } catch (err) {
                            console.error(`[NETWORK] Stage 3 FAILED for ${record.id}:`, err);
                        }
                    }

                    return record;
                }));

                // Sort by date (latest first)
                consolidatedData.sort((a, b) => {
                    const dateA = new Date(a.created_at || a.iso_created_at || 0);
                    const dateB = new Date(b.created_at || b.iso_created_at || 0);
                    return dateB - dateA;
                });

                setPrescriptions(consolidatedData);
            } catch (err) {
                console.error("[NETWORK] Critical failure during prescription sync logic:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId]);

    const patientName = patient ? (patient.full_name || patient.name) : 'Patient';
    const patientPID = patient ? (patient.pid || `PID-${String(patientId).padStart(4, '0')}`) : '...';

    return (
        <DoctorLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '100px' }}>
                
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button 
                            onClick={() => navigate('/doctor-patients')} 
                            style={{
                                width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                                background: '#F3F4F6', cursor: 'pointer', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center'
                            }}
                        >
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
                                    {patient ? `${patient.age || 'N/A'} yrs • ${patient.gender || 'N/A'}` : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/create-prescription', { state: { patient } })}
                        style={{
                            backgroundColor: '#00E3D3', color: '#fff', border: 'none',
                            padding: '12px 24px', borderRadius: '16px', fontSize: '14px', fontWeight: '800',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
                            boxShadow: '0 4px 12px rgba(0, 227, 211, 0.25)'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Prescription
                    </button>
                </div>

                <h2 style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '24px' }}>
                    PRESCRIPTION DETAILS
                </h2>

                {/* ── Timeline ── */}
                <div style={{ position: 'relative', paddingLeft: '32px' }}>
                    <div style={{ position: 'absolute', left: '0', top: '10px', bottom: '0', width: '2px', backgroundColor: '#F3F4F6' }} />

                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#6B7280', fontWeight: '600' }}>Loading details...</p>
                    ) : prescriptions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', borderRadius: '24px', backgroundColor: '#F9FAFB' }}>
                            <p style={{ fontSize: '16px', color: '#9CA3AF', fontStyle: 'italic', margin: 0 }}>
                                No prescriptions found for this patient.
                            </p>
                        </div>
                    ) : prescriptions.map((record) => (
                        <div key={record.id} style={{ position: 'relative', marginBottom: '40px' }}>
                            <div style={{
                                position: 'absolute', left: '-37px', top: '24px', width: '12px', height: '12px',
                                borderRadius: '50%', backgroundColor: '#00E3D3', border: '3px solid #fff', zIndex: 2
                            }} />
                            
                            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '28px', border: '1.5px solid #F3F4F6', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div>
                                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#00BFB3' }}>
                                            {record.iso_created_at ? new Date(record.iso_created_at).toLocaleDateString('en-GB') : (record.formatted_date || 'Recent')}
                                        </span>
                                        <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#111827', marginTop: '4px' }}>General Medicine</h3>
                                    </div>
                                    <div style={{ 
                                        backgroundColor: record.status?.toUpperCase() === 'DISPENSED' ? '#ECFDF5' : '#FEF3C7', 
                                        color: record.status?.toUpperCase() === 'DISPENSED' ? '#059669' : '#D97706', 
                                        padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', 
                                        textTransform: 'uppercase' 
                                    }}>
                                        {record.status || 'PENDING'}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>DIAGNOSIS</p>
                                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#374151', margin: 0 }}>{record.diagnosis || 'No diagnosis recorded'}</p>
                                </div>

                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>PRESCRIPTION</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {record.drugs && record.drugs.length > 0 ? (
                                            record.drugs.map((drug, di) => (
                                                <div key={di} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#F9FAFB', padding: '12px 16px', borderRadius: '14px' }}>
                                                    <div style={{ backgroundColor: '#EEF2FF', padding: '8px', borderRadius: '10px' }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                                                            <path d="m8.5 8.5 7 7" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <p style={{ fontSize: '15px', fontWeight: '800', color: '#111827', margin: 0 }}>{drug.name}</p>
                                                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>({drug.dosage})</span>
                                                            {record.isAiGenerated && (
                                                                <span style={{ fontSize: '9px', fontWeight: '800', color: '#7C3AED', backgroundColor: '#F3E8FF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #DDD6FE', textTransform: 'uppercase' }}>
                                                                    AI Sync
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginTop: '2px', margin: 0 }}>
                                                            {drug.frequency}{drug.duration ? ` — ${drug.duration}` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ fontSize: '14px', fontStyle: 'italic', fontWeight: '600', color: '#9CA3AF', margin: 0 }}>
                                                Prescription exists, details missing.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DoctorLayout>
    );
};

export default PrescriptionDetailsPage;