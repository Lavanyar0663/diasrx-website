import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';

const PrescriptionIssuedPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extract state passed from CreatePrescription
    const state = location.state || {};
    const prescriptionId = state.prescriptionId || 'N/A';
    const patientName = state.patientName || 'Unknown Patient';
    const opdId = state.opdId || 'OPD #---';
    const ageGender = state.ageGender || 'Unknown y / U';
    const mobile = state.phone || 'N/A';
    const email = state.email || 'N/A';
    
    const medicationList = state.medicationList || [];
    const medCount = state.medCount || medicationList.length || 0;

    const [isDownloading, setIsDownloading] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    // Actual PDF generate entirely client-side (Bypasses backend 500 error)
    const processPdfDownload = async () => {
        if (!prescriptionId || prescriptionId === 'N/A') {
            throw new Error("Invalid or missing Prescription ID.");
        }
        
        // Dynamically load html2pdf if not present
        if (!window.html2pdf) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
                script.onload = resolve;
                script.onerror = () => reject(new Error("Failed to load PDF engine"));
                document.head.appendChild(script);
            });
        }

        const element = document.getElementById('prescription-receipt');
        if (!element) throw new Error("Could not find the prescription receipt to print.");

        // We clone it to remove any buttons we don't want printed, but wait, the receipt ID will only wrap the content to print!
        const opt = {
            margin:       15,
            filename:     `prescription_${prescriptionId}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const pdfWorker = window.html2pdf().set(opt).from(element);
        const pdfBlob = await pdfWorker.output('blob');
        return new File([pdfBlob], `prescription_${prescriptionId}.pdf`, { type: 'application/pdf' });
    };

    const handleDownloadPdf = async () => {
        try {
            setIsDownloading(true);
            const file = await processPdfDownload();
            
            const url = window.URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            setIsDownloading(false);
        } catch (error) {
            alert(`Download Failed: ${error.message}`);
            setIsDownloading(false);
        }
    };

    const handleSharePdf = () => {
        setShowShareMenu(!showShareMenu);
    };

    const shareToApp = async (app) => {
        setShowShareMenu(false);
        try {
            const shareTitle = `Prescription: ${patientName}`;
            const shareText = `Digital Prescription for ${patientName} (OPD ID: ${opdId}).`;

            let intentUrl = '';
            if (app === 'whatsapp') {
                intentUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' Please attach the prescription PDF.')}`;
            } else if (app === 'gmail') {
                intentUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + ' Please see the attached prescription PDF.')}`;
            }
            
            if (intentUrl) {
                window.open(intentUrl, '_blank');
            }
        } catch (error) {
            alert(`Sharing Failed: ${error.message}`);
            setIsDownloading(false);
        }
    };

    /* ── Styles ── */
    const theme = {
        bg: '#F5FCFC', cardBg: '#fff', border: '#E5E7EB',
        primary: '#00E5FF', secondary: '#091B29', textSecondary: '#5A6B7C',
        textLabel: '#7F93A3'
    };

    const cardStyle = {
        backgroundColor: theme.cardBg, borderRadius: '16px', padding: '20px',
        border: `1px solid #EAF0F4`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        marginBottom: '16px', textAlign: 'left'
    };

    const sectionTitleStyle = {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px'
    };

    const accentTitleStyle = {
        fontSize: '13px', fontWeight: '800', color: theme.secondary,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        borderLeft: `4px solid ${theme.primary}`, paddingLeft: '8px'
    };

    const rowStyle = {
        display: 'flex', marginBottom: '12px'
    };

    const labelStyle = {
        width: '100px', fontSize: '13px', fontWeight: '600', color: theme.textLabel
    };

    const valStyle = {
        flex: 1, fontSize: '14px', fontWeight: '700', color: theme.secondary,
        wordBreak: 'break-word'
    };

    return (
        <DoctorLayout>
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                minHeight: '80vh', backgroundColor: theme.bg,
                maxWidth: '900px', margin: '0 auto', padding: '40px 20px',
                fontFamily: "'Inter', sans-serif"
            }}>
                
                {/* ── Titles ── */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: theme.secondary, margin: '0 0 12px 0' }}>
                        Prescription Issued Successfully
                    </h1>
                    <p style={{ fontSize: '15px', fontWeight: '500', color: theme.textLabel, lineHeight: '1.5', margin: 0 }}>
                        Prescription #{prescriptionId} has been successfully generated and stored in the system.
                    </p>
                </div>

                {/* Printable Area Wrapper */}
                <div id="prescription-receipt" style={{ width: '100%', maxWidth: '700px', backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '40px', border: '1px solid #E5E7EB' }}>

                {/* ── Patient Summary Card ── */}
                <div style={{ ...cardStyle, width: '100%' }}>
                    <div style={sectionTitleStyle}>
                        <span style={accentTitleStyle}>PATIENT SUMMARY</span>
                    </div>
                    
                    <div style={rowStyle}>
                        <span style={labelStyle}>Name</span>
                        <span style={valStyle}>{patientName}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>OPD ID</span>
                        <span style={valStyle}>{opdId}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Age / Sex</span>
                        <span style={valStyle}>{ageGender}</span>
                    </div>
                    <div style={rowStyle}>
                        <span style={labelStyle}>Mobile</span>
                        <span style={valStyle}>{mobile}</span>
                    </div>
                    <div style={{...rowStyle, marginBottom: 0}}>
                        <span style={labelStyle}>Email</span>
                        <span style={valStyle}>{email}</span>
                    </div>
                </div>

                {/* ── Prescribed Medicines Card ── */}
                <div style={{ ...cardStyle, width: '100%', marginBottom: '24px' }}>
                    <div style={sectionTitleStyle}>
                        <span style={accentTitleStyle}>PRESCRIBED MEDICINES</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: theme.textLabel }}>{medCount} Items</span>
                    </div>
                    
                    {medicationList.map((med, idx) => (
                        <div key={idx} style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginBottom: '16px', borderLeft: `3px solid ${theme.primary}`, paddingLeft: '12px'
                        }}>
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: '800', color: theme.secondary, margin: '0 0 4px 0' }}>
                                    {med.name} {med.strength !== 'N/A' ? med.strength : ''}
                                </p>
                                <p style={{ fontSize: '12px', fontWeight: '600', color: theme.textLabel, margin: 0 }}>
                                    {med.frequency} - {med.instructions}
                                </p>
                            </div>
                            <div style={{ 
                                backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px',
                                padding: '4px 12px', fontSize: '12px', fontWeight: '800', color: theme.secondary
                            }}>
                                Qty: {med.quantity}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Actions Container (Web Layout) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', maxWidth: '700px', marginBottom: '40px' }}>
                    
                    {/* ── Download ── */}
                    <button 
                        onClick={handleDownloadPdf}
                        disabled={isDownloading}
                        style={{ 
                            padding: '16px', borderRadius: '12px', border: `2px solid ${theme.primary}`, 
                            backgroundColor: '#fff', color: theme.primary, fontSize: '15px', fontWeight: '800', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            opacity: isDownloading ? 0.7 : 1, transition: 'all 0.2s'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {isDownloading ? 'Generating...' : 'Download PDF Copy'}
                    </button>

                    {/* ── Share ── */}
                    <div style={{ position: 'relative', width: '100%' }}>
                    <button
                        onClick={handleSharePdf}
                        style={{
                            width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                            backgroundColor: theme.primary, color: '#fff',
                            fontSize: '15px', fontWeight: '800', cursor: 'pointer',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                            boxShadow: '0 4px 12px rgba(0, 229, 255, 0.3)'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                        Share Prescription PDF
                    </button>

                    {showShareMenu && (
                        <div style={{
                            position: 'absolute', bottom: '100%', left: 0, right: 0,
                            backgroundColor: '#fff', borderRadius: '12px', padding: '8px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginBottom: '8px',
                            border: '1px solid #E5E7EB', display: 'flex', gap: '8px'
                        }}>
                            <button
                                onClick={() => shareToApp('whatsapp')}
                                style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', backgroundColor: '#F0FDF4', color: '#16A34A', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.372 0 0 5.373 0 12c0 2.117.554 4.104 1.523 5.827L.057 23.428a.5.5 0 0 0 .515.572l5.752-1.507A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.626 0 11.999 0z"/></svg>
                                WhatsApp
                            </button>
                            <button
                                onClick={() => shareToApp('gmail')}
                                style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                Gmail
                            </button>
                        </div>
                    )}
                </div>

                    </div>
                </div>

                {/* ── Navigation ── */}
                <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '700px' }}>
                    <button
                        onClick={() => navigate('/doctor-prescriptions')}
                        style={{
                            flex: 1, padding: '16px', borderRadius: '12px',
                            border: '1px solid #E5E7EB', backgroundColor: '#F8FAFC',
                            color: theme.secondary, fontSize: '15px', fontWeight: '800',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        View Prescription History
                    </button>
                    
                    <button 
                        onClick={() => navigate('/doctor-dashboard')}
                        style={{ 
                            flex: 1, padding: '16px', borderRadius: '12px', border: 'none',
                            backgroundColor: '#1E293B', color: '#fff', fontSize: '15px', fontWeight: '800',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        Back to Dashboard
                    </button>
                </div>

            </div>
        </DoctorLayout>
    );
};

export default PrescriptionIssuedPage;
