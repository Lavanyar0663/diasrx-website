import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import { patientService } from '../services/patientService';
import { getAvatarUrl } from '../utils/helpers';

// Gender-based avatar for patient cards
const PatientAvatar = ({ gender, avatar_url, name }) => {
    return (
        <div style={{ 
            width: '52px', height: '52px', borderRadius: '50%', 
            backgroundColor: (gender || '').toString().toLowerCase() === 'female' || (gender || '').toString().toLowerCase() === 'f' ? '#F0FDFA' : 
                            (gender || '').toString().toLowerCase() === 'male' || (gender || '').toString().toLowerCase() === 'm' ? '#EFF6FF' : '#F8FAFC', 
            border: '1.5px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' 
        }}>
            <img 
                src={getAvatarUrl(avatar_url, gender, name)} 
                alt="" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} 
            />
        </div>
    );
};

const DoctorPatientsPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Already Visited');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Backend already filters by doctor's department/doctor_id
                const allPatients = await patientService.getPatients();
                setPatients(Array.isArray(allPatients) ? allPatients : []);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Failed to load patients. Please refresh.');
                setPatients([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Split using `is_visited` flag from backend (1 = visited, 0 = new)
    const filtered = patients.filter(p => {
        const matchesSearch =
            (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.pid || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.phone || '').includes(search);

        if (!matchesSearch) return false;

        const visited = p.is_visited === 1 || p.is_visited === true;
        return activeTab === 'Already Visited' ? visited : !visited;
    });

    const newCount      = patients.filter(p => !p.is_visited || p.is_visited === 0).length;
    const visitedCount  = patients.filter(p =>  p.is_visited === 1 || p.is_visited === true).length;

    return (
        <DoctorLayout>
            <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '80px', fontFamily: "'Inter', sans-serif" }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '28px' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#111827', margin: 0 }}>Patients List</h1>
                </div>

                {/* ── Search Bar ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: '#fff', borderRadius: '16px', padding: '14px 20px',
                    border: '1.5px solid #F3F4F6', marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, PID or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', fontWeight: '600', color: '#374151', width: '100%' }}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, display: 'flex' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    )}
                </div>

                {/* ── Tabs ── */}
                <div style={{ display: 'flex', gap: '0', backgroundColor: 'transparent', marginBottom: '28px', borderBottom: '2px solid #F3F4F6' }}>
                    {[
                        { key: 'Already Visited', count: visitedCount },
                        { key: 'New Patients',    count: newCount }
                    ].map(({ key, count }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            style={{
                                flex: 1, padding: '14px 0', border: 'none', background: 'none',
                                fontSize: '15px', fontWeight: '900', cursor: 'pointer',
                                color: activeTab === key ? '#00BFB3' : '#9CA3AF',
                                borderBottom: activeTab === key ? '3px solid #00BFB3' : '3px solid transparent',
                                marginBottom: '-2px', transition: 'all 0.2s ease'
                            }}
                        >
                            {key}&nbsp;
                            <span style={{
                                fontSize: '12px', fontWeight: '800',
                                backgroundColor: activeTab === key ? '#E0F2F1' : '#F3F4F6',
                                color: activeTab === key ? '#00BFB3' : '#9CA3AF',
                                padding: '2px 8px', borderRadius: '20px'
                            }}>
                                {loading ? '…' : count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ── Error ── */}
                {error && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '12px', padding: '12px 20px', marginBottom: '20px', color: '#EF4444', fontWeight: '700', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                {/* ── Patient List ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1.5px solid #F3F4F6' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#F3F4F6' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ height: '16px', backgroundColor: '#F3F4F6', borderRadius: '6px', marginBottom: '8px', width: '55%' }} />
                                        <div style={{ height: '12px', backgroundColor: '#F3F4F6', borderRadius: '6px', width: '35%' }} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filtered.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', border: '2px dashed #F3F4F6', borderRadius: '24px', backgroundColor: '#FAFAFA' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px auto', display: 'block' }}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            <p style={{ color: '#9CA3AF', fontSize: '15px', fontWeight: '700' }}>
                                {search ? `No results for "${search}"` : `No ${activeTab.toLowerCase()} found.`}
                            </p>
                        </div>
                    ) : filtered.map(p => {
                        const opdId    = p.pid ? `${p.pid}` : `PID-${String(p.id).padStart(4, '0')}`;
                        const isVisited = p.is_visited === 1 || p.is_visited === true;

                        return (
                            <div
                                key={p.id}
                                onClick={() => isVisited
                                    ? navigate(`/patient-history/${p.id}`)
                                    : navigate('/create-prescription', { state: { patient: p } })
                                }
                                style={{
                                    backgroundColor: '#fff', borderRadius: '24px', padding: '20px 24px',
                                    border: '1.5px solid #F3F4F6', boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                    cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column'
                                }}
                                onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.07)'}
                                onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                                    <PatientAvatar gender={p.pat_gender} avatar_url={p.avatar_url} name={p.name} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                            <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {p.name}
                                            </h3>
                                            <span style={{
                                                fontSize: '10px', fontWeight: '900', letterSpacing: '0.06em',
                                                padding: '3px 10px', borderRadius: '6px', whiteSpace: 'nowrap', flexShrink: 0,
                                                backgroundColor: isVisited ? '#F3F4F6' : '#E0F2F1',
                                                color: isVisited ? '#6B7280' : '#00BFB3'
                                            }}>
                                                {isVisited ? 'VISITED' : 'NEW REG'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#6B7280' }}>{opdId}</span>
                                            <span style={{ color: '#E5E7EB' }}>•</span>
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#6B7280' }}>
                                                {p.age || '?'}y / {((p.pat_gender || 'f')[0] || 'f').toUpperCase()}
                                            </span>
                                            {p.department && (
                                                <>
                                                    <span style={{ color: '#E5E7EB' }}>•</span>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#00BFB3' }}>{p.department}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF' }}>
                                        {/* Phone icon */}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280' }}>
                                            {p.phone || 'No phone on record'}
                                        </span>
                                    </div>
                                    {!isVisited && (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00BFB3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m9 18 6-6-6-6"/>
                                        </svg>
                                    )}
                                </div>

                                {isVisited && (
                                    <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', borderTop: '1.5px solid #F3F4F6', paddingTop: '16px' }}>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/patient-history/${p.id}`); }}
                                            style={{ flex: 1, padding: '10px', backgroundColor: '#F8FAFC', color: '#4B5563', borderRadius: '12px', fontWeight: '800', fontSize: '13px', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                                            onMouseOut={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                                            </svg>
                                            Medication History
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate('/create-prescription', { state: { patient: p } }); }}
                                            style={{ flex: 1, padding: '10px', backgroundColor: '#00E3D3', color: '#111827', borderRadius: '12px', fontWeight: '900', fontSize: '13px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#00BFB3'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseOut={e => { e.currentTarget.style.backgroundColor = '#00E3D3'; e.currentTarget.style.color = '#111827'; }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                                            </svg>
                                            Create Prescription
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorPatientsPage;
