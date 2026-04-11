import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl, getInitialsAvatar } from '../utils/helpers';

const RequestRow = ({ id, name, role, department, time, status, onApprove, onReject, data, variant = 'dashboard' }) => {
    const navigate = useNavigate();
    
    // Multi-source fallback for gender/sex to ensure gender-accurate photos
    const gender = data?.gender || data?.sex || data?.sex_text;
    // Use the actual profile image URL (if any), with gender + id as consistent fallback seed
    const avatarUrl = getAvatarUrl(data?.avatar_url || data?.profile_pic, gender, id || data?.id, name);

    const normalizedStatus = (status || 'pending').toUpperCase();
    const isDoctor = (role || '').toLowerCase().includes('doc');

    const handleClick = () => {
        const navigationState = { state: { request: { ...data, name: name, full_name: name } } };
        if (normalizedStatus === 'PENDING') {
            navigate(`/request-detail/${id}`, navigationState);
        } else if (normalizedStatus === 'APPROVED' || normalizedStatus === 'ACTIVE') {
            navigate(`/applicant-profile/${id}`, navigationState);
        } else if (normalizedStatus === 'REJECTED') {
            navigate(`/rejection-reason/${id}`, navigationState);
        }
    };

    return (
        <div 
            className="request-item" 
            onClick={handleClick} 
            style={{ 
                cursor: 'pointer', 
                padding: '24px 32px', 
                backgroundColor: '#fff', 
                borderRadius: '24px', 
                border: '1px solid #E5E7EB', 
                marginBottom: '16px',
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center', 
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseOver={e => {
                e.currentTarget.style.borderColor = '#3B82F6';
            }}
            onMouseOut={e => {
                e.currentTarget.style.borderColor = '#E5E7EB';
            }}
        >
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img src={avatarUrl} alt={name} style={{ width: '64px', height: '64px', borderRadius: '18px', objectFit: 'cover', border: '1px solid #F3F4F6' }} onError={(e) => { e.target.onerror = null; e.target.src = getInitialsAvatar(name); }} />
                <div className="user-info">
                    <h4 style={{ fontWeight: '800', fontSize: '19px', margin: '0 0 6px 0', color: '#111827' }}>{name}</h4>
                    <div className="user-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                            fontSize: '11px', fontWeight: '800', padding: '2px 10px', borderRadius: '6px',
                            backgroundColor: isDoctor ? '#F0F9FF' : '#F3F4F6',
                            color: isDoctor ? '#3B82F6' : '#6B7280',
                            textTransform: 'uppercase'
                        }}>
                            {(role || 'Staff').toUpperCase()}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#9CA3AF' }}>• {department || 'General'}</span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#9CA3AF' }}>• {time}</span>
                    </div>
                </div>
            </div>

            <div className="action-buttons" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {(normalizedStatus === 'PENDING' || normalizedStatus === '') ? (
                    <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onReject && onReject(data); }}
                            style={{ 
                                padding: '10px 28px', borderRadius: '12px', border: '1px solid #EF4444', 
                                backgroundColor: 'transparent', color: '#EF4444', fontSize: '14px', fontWeight: '700', 
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                            onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                            Reject
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onApprove && onApprove(data); }}
                            style={{ 
                                padding: '10px 32px', borderRadius: '12px', border: 'none', 
                                backgroundColor: '#3B82F6', color: '#fff', fontSize: '14px', fontWeight: '700', 
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseOver={e => { e.currentTarget.style.opacity = '0.9'; }}
                            onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                        >
                            Approve
                        </button>
                    </>
                ) : (normalizedStatus === 'APPROVED' || normalizedStatus === 'ACTIVE') ? (
                    <button 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/applicant-profile/${id}`, { state: { request: { ...data, name: name, full_name: name } } }); 
                        }}
                        style={{ 
                            padding: '10px 24px', borderRadius: '12px', border: 'none', 
                            backgroundColor: '#F3F4F6', color: '#111827', fontSize: '14px', fontWeight: '700', 
                            cursor: 'pointer', transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#E5E7EB'; }}
                        onMouseOut={e => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        View Profile
                    </button>
                ) : normalizedStatus === 'REJECTED' ? (
                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/rejection-reason/${id}`, { state: { request: data } }); }}
                        style={{ 
                            padding: '10px 24px', borderRadius: '12px', border: '1px solid #6B7280', 
                            backgroundColor: 'white', color: '#6B7280', fontSize: '14px', fontWeight: '700', 
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        View Reason
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default RequestRow;
