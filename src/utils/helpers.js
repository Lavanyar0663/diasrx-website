// src/utils/helpers.js
// Utility functions for DIASRx

export const formatDate = (date) => new Date(date).toLocaleDateString();

// Removed femaleNames as gender must be strictly from backend data

/**
 * Standardizes the avatar URL retrieval. 
 * If a profile image exists, it returns it; otherwise, it returns a 
 * gender-specific professional medical icon to match the core aesthetic.
 * @param {string} imageUrl 
 * @param {string} gender 
 * @param {string} name 
 * @returns {string} Image URL or SVG Data URI
 */
/**
 * Generates a guaranteed SVG initials avatar as a data URI.
 * This requires NO network and will ALWAYS render — the ultimate fallback.
 * @param {string} name - User's name to extract initials from
 * @param {string} bgColor - Background color (hex)
 * @returns {string} SVG data URI
 */
export const getInitialsAvatar = (name = 'User', bgColor = '#00BFB3') => {
    let source = (name || 'User').toString().trim();
    
    // Strip common medical titles for consistent initial extraction (e.g., "Dr. Alana" -> "Alana" -> "A")
    source = source.replace(/^(dr\.?|ph\.?)\s+/i, '');

    // If source is purely numeric (like an ID), default to 'User'
    if (/^\d+$/.test(source) || !source) {
        source = 'User';
    }

    // Extract ONLY the first character as per user request (e.g., "Saravanan" -> "S")
    const initial = source.charAt(0).toUpperCase() || 'U';
    
    // Increased font size and font weight for better visibility of the single letter
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="${bgColor}" rx="12"/><text x="75" y="75" dy=".35em" text-anchor="middle" font-size="72" font-weight="900" fill="white" font-family="Arial, sans-serif">${initial}</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const getAvatarUrl = (imageUrl, gender, seed = 'default', name = '') => {
    // Human photos are now disabled globally as per user request
    const normalizedGender = (gender || '').toString().toLowerCase().trim();
    const isFemale = normalizedGender === 'female' || normalizedGender === 'f';
    const isMale = normalizedGender === 'male' || normalizedGender === 'm';
    
    const bgColor = isFemale ? '#00BFB3' : (isMale ? '#3B82F6' : '#6B7280');
    
    // Improved name discovery: check common field names if name is missing
    let textForInitial = name;
    
    // If name is numeric, empty, or 'User', try to use seed if it's a string
    if (!textForInitial || /^\d+$/.test(textForInitial) || textForInitial.toLowerCase() === 'user') {
        textForInitial = (seed && isNaN(seed)) ? seed : 'User';
    }
    
    return getInitialsAvatar(textForInitial, bgColor);
};

/**
 * Returns a set of standard React SVG icons for consistency.
 */
export const Icons = {
    mail: (size = 20, color = 'currentColor') => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    ),
    lock: (size = 20, color = 'currentColor') => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    ),
    user: (size = 20, color = 'currentColor') => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    phone: (size = 20, color = 'currentColor') => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    ),
};


