import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PharmacistLayout from '../components/PharmacistLayout';
import { prescriptionService } from '../services/prescriptionService';
import { eventBus } from '../utils/eventBus';

const PrescriptionDetailPage = () => {
    const navigate = useNavigate();
    const { id: urlId } = useParams();
    const location = useLocation();
    const [prescription, setPrescription] = useState(location.state?.prescription || null);
    const [loading, setLoading] = useState(!prescription);
    const [isDispensing, setIsDispensing] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            const id = urlId || prescription?.id;
            if (!id) return;
            setLoading(true);
            try {
                const data = await prescriptionService.getPrescriptionById(id);
                setPrescription(data);
            } catch (err) {
                console.error("Failed to fetch prescription detail", err);
            } finally {
                setLoading(false);
            }
        };

        // Fetch if:
        // 1. We have a URL ID but no prescription (direct navigation)
        // 2. We have a prescription from state, but its drugs are missing (nav from list)
        if (urlId || (prescription && (!prescription.drugs || prescription.drugs.length === 0))) {
            fetchDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlId]);

    const handleDispense = async () => {
        if (!prescription) return;
        setIsDispensing(true);
        try {
            // Generate a unique idempotency key for this specific attempt
            // Format: RX-[ID]-TIME-[NOW]
            const idempotencyKey = `RX-${prescription.id}-T-${Date.now()}`;
            
            await prescriptionService.dispensePrescription(prescription.id, [], idempotencyKey);
            
            // Broadcast update to all listeners (tabs)
            eventBus.emit('prescriptionsUpdated');
            
            navigate('/prescription-dispensed', { state: { prescription } });
        } catch (err) {
            console.error("Dispense failed:", err);
            alert(err.response?.data?.message || "Failed to dispense prescription. Check stock.");
        } finally {
            setIsDispensing(false);
        }
    };

    if (loading) return <PharmacistLayout><p style={{ textAlign: 'center', padding: '100px' }}>Loading prescription detail...</p></PharmacistLayout>;
    if (!prescription) return <PharmacistLayout><p style={{ textAlign: 'center', padding: '100px' }}>Prescription not found.</p></PharmacistLayout>;

    const isPending = !prescription.status || ['PENDING', 'CREATED', ''].includes(prescription.status.toUpperCase());

    return (
        <PharmacistLayout>
            <div style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '40px' }}>
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <button onClick={() => navigate(-1)} style={{
                        width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                        background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                    </button>
                    <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>Prescription Detail</h1>
                </div>

                {/* ── Prescription Header Card ── */}
                <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #F3F4F6', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#00BFB3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            PRESCRIPTION ID
                        </span>
                        <span style={{ 
                            backgroundColor: isPending ? '#E6FCFA' : '#F3F4F6', 
                            color: isPending ? '#00BFB3' : '#6B7280', 
                            fontSize: '12px', fontWeight: '800', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' 
                        }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isPending ? '#00BFB3' : '#6B7280' }} />
                            {isPending ? 'Pending Dispense' : 'Dispensed'}
                        </span>
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#111827', marginBottom: '24px' }}>#RX-{prescription.id}</h2>
                    <div style={{ display: 'flex', gap: '48px' }}>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', marginBottom: '4px' }}>Date Prescribed</p>
                            <p style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{prescription.formatted_date || new Date(prescription.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', marginBottom: '4px' }}>Diagnosis</p>
                            <p style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{prescription.diagnosis || 'General Case'}</p>
                        </div>
                    </div>
                </div>

                {/* ── Patient Card ── */}
                <div style={{
                    backgroundColor: '#fff', borderRadius: '24px', padding: '20px 24px', border: '1px solid #F3F4F6',
                    marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E6FCFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00BFB3" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', marginBottom: '2px' }}>Patient</p>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>{prescription.patient_name}</h3>
                        <p style={{ fontSize: '13px', fontWeight: '500', color: '#6B7280' }}>ID: #{prescription.patient_display_id || prescription.patient_id} • {prescription.age} Yrs / {prescription.gender}</p>
                    </div>
                </div>

                {/* ── Prescribed By Card ── */}
                <div style={{
                    backgroundColor: '#fff', borderRadius: '24px', padding: '20px 24px', border: '1px solid #F3F4F6',
                    marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5"><path d="M22 8h-4a2 2 0 0 0-2 2v10H8V10a2 2 0 0 0-2-2H2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', marginBottom: '2px' }}>Prescribed by</p>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>Dr. {prescription.doctor_name || 'Staff'}</h3>
                        <p style={{ fontSize: '13px', fontWeight: '500', color: '#6B7280' }}>{prescription.doctor_department || 'General Practice'}</p>
                    </div>
                </div>

                {/* ── Medications Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>Medications ({prescription.drugs?.length || 0})</h2>
                </div>

                {/* ── Medication Cards ── */}
                {prescription.drugs?.map((drug, i) => (
                    <div key={i} style={{
                        backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #E5E7EB',
                        borderLeft: '4px solid #00E3D3', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>{drug.drug_name}</h3>
                                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>{drug.strength} • {drug.drug_type || 'Medicine'}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', backgroundColor: '#F9FAFB', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                            <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                                <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>FREQ</p>
                                <p style={{ fontSize: '15px', fontWeight: '800', color: '#111827' }}>{drug.frequency}</p>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <p style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>DUR</p>
                                <p style={{ fontSize: '15px', fontWeight: '800', color: '#111827' }}>{drug.duration}</p>
                            </div>
                        </div>
                        {drug.instructions && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" style={{ marginTop: '2px' }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0, lineHeight: '1.4' }}>
                                    <span style={{ fontWeight: '800' }}>Instruction:</span> {drug.instructions}
                                </p>
                            </div>
                        )}
                    </div>
                ))}

                {/* ── Integrated Action Card (In-flow instead of floating) ── */}
                {isPending && (
                    <div style={{
                        marginTop: '40px',
                        backgroundColor: '#fff', borderRadius: '32px', padding: '40px 24px',
                        border: '2px dashed #00E3D3', textAlign: 'center',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ 
                            width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#E6FCFA',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00BFB3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#111827', marginBottom: '8px' }}>Ready to Dispense?</h3>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: '#6B7280', marginBottom: '32px', maxWidth: '280px', margin: '0 auto 32px auto' }}>
                            Confirm all medications are present and match the patient details before finalizing.
                        </p>
                        <button
                            onClick={handleDispense}
                            disabled={isDispensing}
                            style={{
                                width: '100%', maxWidth: '300px',
                                backgroundColor: '#00E3D3', padding: '18px 0', borderRadius: '100px',
                                border: 'none', color: '#111827', fontSize: '16px', fontWeight: '800',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                cursor: 'pointer', boxShadow: '0 12px 24px rgba(0, 227, 211, 0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                opacity: isDispensing ? 0.7 : 1
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {isDispensing ? 'Processing Dispense...' : 'Confirm & Mark as Dispensed'}
                        </button>
                    </div>
                )}
            </div>
        </PharmacistLayout>
    );
};

export default PrescriptionDetailPage;
