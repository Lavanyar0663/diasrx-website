import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import { drugService } from '../services/drugService';
import { prescriptionService } from '../services/prescriptionService';
import { DEPARTMENTS } from '../utils/constants';

const CreatePrescriptionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const patientFromHistory = location.state?.patient;

    /* Patient form state */
    const [fullName, setFullName] = useState(patientFromHistory?.name || '');
    const [age, setAge] = useState(patientFromHistory?.age || patientFromHistory?.ageGender?.split('y / ')[0] || '');
    const [sex, setSex] = useState(
        patientFromHistory?.gender || 
        (patientFromHistory?.ageGender?.includes('M') ? 'Male' : patientFromHistory?.ageGender?.includes('F') ? 'Female' : '')
    );
    const [mobile, setMobile] = useState(patientFromHistory?.phone || '');
    const [email, setEmail] = useState(patientFromHistory?.email || '');
    const opdId = patientFromHistory?.pid || patientFromHistory?.opdId || 'New Case';

    /* Global prescription state */
    const [department, setDepartment] = useState(patientFromHistory?.department || '');
    const [targetPharmacy, setTargetPharmacy] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    
    // Treatments
    const [selectedTreatments, setSelectedTreatments] = useState('');
    const treatmentOptions = ["ANUG", "Bell's Palsy", "Gingivitis", "Periodontitis", "Dental Abscess", "Stomatitis"];

    /* Drug list */
    const [drugList, setDrugList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(-1);

    /* Medicine Form state */
    const [drugSearch, setDrugSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedDrugId, setSelectedDrugId] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isDrugSelected, setIsDrugSelected] = useState(false);
    const isSelectingRef = useRef(false);

    const [strength, setStrength] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [frequency, setFrequency] = useState('');
    const [days, setDays] = useState('');
    
    /* Instructions */
    const [selectedInstructions, setSelectedInstructions] = useState([]);
    const instructionOptions = ["After Meal", "Before Meal", "With Meal", "Empty Stomach", "At Night"];

    /* Submission */
    const [disclaimer, setDisclaimer] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* AI State */
    const [aiEngExp, setAiEngExp] = useState('Add medications to generate simplified instructions.');
    const [aiTamExp, setAiTamExp] = useState('விளக்கத்தை உருவாக்க மருந்துகளைச் சேர்க்கவும்.');
    const [aiEngRem, setAiEngRem] = useState('Schedule not generated yet.');
    const [aiTamRem, setAiTamRem] = useState('அட்டவணை இன்னும் உருவாக்கப்படவில்லை.');

    /* ── Drug Search Debounce ── */
    useEffect(() => {
        if (isSelectingRef.current) {
            isSelectingRef.current = false;
            return;
        }
        if (drugSearch.trim().length >= 2) {
            setIsSearching(true);
            const timer = setTimeout(() => {
                drugService.searchDrugs(drugSearch.trim())
                    .then(results => {
                        setSearchResults(results);
                    })
                    .catch(() => setSearchResults([]))
                    .finally(() => setIsSearching(false));
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [drugSearch]);

    /* ── Handlers ── */
    const selectDrug = (drug) => {
        isSelectingRef.current = true;
        setDrugSearch(drug.name);
        setSelectedDrugId(drug.id || "0");
        setIsDrugSelected(true);
        
        // Auto-fill strength heuristically
        const match = drug.name.match(/\d+(mg|g|ml)/i);
        if (match) {
            setStrength(drug.name.substring(drug.name.indexOf(match[0])).trim());
        } else {
            setStrength(drug.strength || '');
        }

        setSearchResults([]);
    };

    const toggleInstruction = (instr) => {
        setSelectedInstructions(prev => 
            prev.includes(instr) ? prev.filter(i => i !== instr) : [...prev, instr]
        );
    };

    const toggleTreatment = (t) => {
        setSelectedTreatments(t === selectedTreatments ? '' : t); // Single selection
    };

    const clearMedicineForm = () => {
        setDrugSearch('');
        setSelectedDrugId(null);
        setIsDrugSelected(false);
        setStrength('');
        setQuantity(0);
        setFrequency('');
        setDays('');
        setSelectedInstructions([]);
        setEditingIndex(-1);
    };

    const addToList = () => {
        if (!drugSearch || !isDrugSelected) return alert("Please select a drug from suggestions");
        if (quantity <= 0) return alert("Quantity must be at least 1");
        if (!frequency) return alert("Please select a frequency");
        if (!days) return alert("Please enter duration in days");

        const durStr = parseInt(days) === 1 ? days + " Day" : days + " Days";
        const instrStr = selectedInstructions.length > 0 ? selectedInstructions.join(', ') : "As directed";

        const newMed = {
            id: selectedDrugId,
            name: drugSearch,
            strength: strength.trim() || 'N/A',
            quantity: quantity,
            frequency: frequency,
            days: days, // Keep raw number for editing
            duration: durStr,
            instructions: instrStr,
            selectedInstructions: [...selectedInstructions] // preserve for editing
        };

        let newList = [...drugList];
        if (editingIndex >= 0) {
            newList[editingIndex] = newMed;
        } else {
            newList.push(newMed);
        }

        setDrugList(newList);
        clearMedicineForm();
    };

    const editMedicine = (index) => {
        const med = drugList[index];
        setEditingIndex(index);
        
        isSelectingRef.current = true;
        setDrugSearch(med.name);
        setSelectedDrugId(med.id);
        setIsDrugSelected(true);
        setStrength(med.strength === 'N/A' ? '' : med.strength);
        setQuantity(med.quantity);
        setFrequency(med.frequency);
        setDays(med.days || med.duration.replace(/ Days?/i, '').trim());
        setSelectedInstructions(med.selectedInstructions || med.instructions.split(', '));
        
        // Scroll to form (simulate manual scroll)
        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
    };

    const deleteMedicine = (index) => {
        const newList = drugList.filter((_, i) => i !== index);
        setDrugList(newList);
        if (editingIndex === index) clearMedicineForm();
    };

    /* ── AI Translation Logic ── */
    const translateToTamil = (text) => {
        if (!text) return "";
        let translated = text.toLowerCase();
        translated = translated.replace(/after meal/g, "சாப்பாட்டிற்கு பின்");
        translated = translated.replace(/before meal/g, "சாப்பாட்டிற்கு முன்");
        translated = translated.replace(/with meal/g, "உணவுடன்");
        translated = translated.replace(/empty stomach/g, "வெறும் வயிற்றில்");
        translated = translated.replace(/at night/g, "இரவில்");
        return translated;
    };

    useEffect(() => {
        if (drugList.length === 0) {
            setAiEngExp('Add medications to generate simplified instructions.');
            setAiTamExp('விளக்கத்தை உருவாக்க மருந்துகளைச் சேர்க்கவும்.');
            setAiEngRem('Schedule not generated yet.');
            setAiTamRem('அட்டவணை இன்னும் உருவாக்கப்படவில்லை.');
            return;
        }

        let expText = '', expTamText = '', remText = '', remTamText = '';

        drugList.forEach(m => {
            const tempDur = m.duration || '';
            const durSuffix = tempDur ? ' for ' + tempDur : '';
            const durTamil = tempDur.replace(/Days/gi, "நாட்கள்").replace(/Day/gi, "நாள்").replace(/7 நாட்கள்/g, "1 வாரம்");
            const durSuffixTam = durTamil ? ' ' + durTamil + ' வரை' : '';

            const freq = m.frequency;
            const instr = (m.instructions || '').toLowerCase();
            const instrTam = translateToTamil(instr);
            const name = m.name;

            if (freq === "OD") {
                expText += `Take ${name} once daily${durSuffix} (${instr}).\n`;
                expTamText += `${name} மாத்திரையை ஒரு முறை மட்டும்${durSuffixTam} (${instrTam}) உட்கொள்ளவும்.\n`;
                remText += `• ${name}: 09:00 AM (${instr})\n`;
                remTamText += `• ${name}: காலை 09:00 மணி (${instrTam})\n`;
            } else if (freq === "BD") {
                expText += `Take ${name} twice daily${durSuffix} (${instr}).\n`;
                expTamText += `${name} மாத்திரையை தினம் இரு முறை${durSuffixTam} (${instrTam}) உட்கொள்ளவும்.\n`;
                remText += `• ${name}: 09:00 AM, 09:00 PM (${instr})\n`;
                remTamText += `• ${name}: காலை 09:00, இரவு 09:00 (${instrTam})\n`;
            } else if (freq === "TDS") {
                expText += `Take ${name} three times daily${durSuffix} (${instr}).\n`;
                expTamText += `${name} மாத்திரையை தினம் மூன்று முறை${durSuffixTam} (${instrTam}) உட்கொள்ளவும்.\n`;
                remText += `• ${name}: 09:00 AM, 02:00 PM, 09:00 PM (${instr})\n`;
                remTamText += `• ${name}: காலை 09:00, மதியம் 02:00, இரவு 09:00 (${instrTam})\n`;
            } else if (freq === "QID") {
                expText += `Take ${name} four times daily${durSuffix} (${instr}).\n`;
                expTamText += `${name} மாத்திரையை தினம் நான்கு முறை${durSuffixTam} (${instrTam}) உட்கொள்ளவும்.\n`;
                remText += `• ${name}: 08:00 AM, 12:00 PM, 04:00 PM, 08:00 PM (${instr})\n`;
                remTamText += `• ${name}: காலை 08:00, மதியம் 12:00, மாலை 04:00, இரவு 08:00 (${instrTam})\n`;
            } else if (freq === "SOS" || freq === "As needed") {
                expText += `Take ${name} as needed for symptoms${durSuffix} (${instr}).\n`;
                expTamText += `${name} மாத்திரையை தேவைப்படும் போது மட்டும்${durSuffixTam} (${instrTam}) உட்கொள்ளவும்.\n`;
                remText += `• ${name}: Take only when required (${instr})\n`;
                remTamText += `• ${name}: தேவைப்படும் போது மட்டும் (${instrTam})\n`;
            } else {
                expText += `Take ${name} ${freq}${durSuffix} (${instr}).\n`;
                expTamText += `${name} மாத்திரையை ${freq}${durSuffixTam} (${instrTam}) உட்கொள்ளவும்.\n`;
                remText += `• ${name}: ${freq} (${instr})\n`;
                remTamText += `• ${name}: ${freq} (${instrTam})\n`;
            }
        });

        setAiEngExp(expText.trim());
        setAiTamExp(expTamText.trim());
        setAiEngRem(remText.trim());
        setAiTamRem(remTamText.trim());
    }, [drugList]);

    /* ── Submit ── */
    const issuePrescription = async () => {
        if (drugList.length === 0) return alert('Add at least one medication');
        if (!targetPharmacy) return alert('Please select a target internal pharmacy');
        if (!department) return alert('Please select a department');
        if (!disclaimer) return alert('Please certify the prescription first.');

        setIsSubmitting(true);
        const finalDiagnosis = diagnosis.trim() || 'Clinical Consultation';

        const body = {
            patient_id: patientFromHistory?.id || patientFromHistory?.patient_display_id, 
            diagnosis: finalDiagnosis,
            remarks: "Standard medical prescription generated via AI Assistant.",
            drugs: drugList.map(m => ({
                drug_id: m.id,
                quantity: m.quantity,
                frequency: m.frequency,
                dosage: m.strength,
                duration: m.duration,
                instructions: m.instructions
            }))
        };

        try {
            const result = await prescriptionService.createPrescription(body);
            // Backend returns { prescription: { prescription_id: ... } }
            const newId = result?.prescription?.prescription_id || result?.prescription_id || "N/A";
            const finalOpdId = opdId === 'New Case' ? `OPD #${newId}` : (opdId || `OPD #${newId}`);

            navigate(`/prescription-issued/${newId}`, {
                state: {
                    prescriptionId: newId,
                    patientName: fullName,
                    ageGender: `${age}y / ${sex === 'Male' ? 'M' : sex === 'Female' ? 'F' : 'O'}`,
                    phone: mobile,
                    email: email,
                    opdId: finalOpdId,
                    medCount: drugList.length,
                    medicationList: drugList,
                    diagnosis: finalDiagnosis,
                    department: department,
                    // Pass AI data logic so the success page can read it exactly like Android intents!
                    ai_explanation: aiEngExp,
                    ai_explanation_tamil: aiTamExp,
                    ai_reminders: aiEngRem,
                    ai_reminders_tamil: aiTamRem
                }
            });
        } catch (error) {
            console.error(error);
            alert('Failed to save prescription: ' + (error.response?.data?.message || error.message));
            setIsSubmitting(false);
        }
    };

    /* ── Styles ── */
    const theme = {
        bg: '#F8FAFC', cardBg: '#fff', border: '#E5E7EB',
        primary: '#006064', primaryLight: '#E0F7FA', primaryStroke: '#80DEEA',
        cyan: '#00E5FF', secondary: '#111827', textSecondary: '#6B7280', outline: '#9CA3AF',
        purpleBg: '#F3EAFF', purpleStroke: '#D1B2FF', purpleText: '#4A148C'
    };

    const inputStyle = {
        width: '100%', minHeight: '48px', padding: '12px 16px', border: `1px solid ${theme.border}`,
        borderRadius: '8px', fontSize: '14px', color: theme.secondary,
        backgroundColor: '#fff', outline: 'none',
        boxSizing: 'border-box'
    };

    const smallGridInput = {
        ...inputStyle, minHeight: '36px', padding: '8px', textAlign: 'center', fontSize: '13px'
    };

    const labelStyle = {
        display: 'block', fontSize: '10px', fontWeight: '700', color: theme.outline,
        marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em'
    };

    const titleStyle = {
        display: 'block', fontSize: '14px', fontWeight: '700', color: theme.secondary,
        marginTop: '16px', marginBottom: '8px'
    };

    const chipStyle = (isActive) => ({
        display: 'inline-block', padding: '6px 14px', borderRadius: '16px',
        backgroundColor: isActive ? theme.primary : '#fff',
        color: isActive ? '#fff' : theme.secondary,
        border: isActive ? `1px solid ${theme.primary}` : `1.5px solid ${theme.border}`,
        fontSize: '12px', fontWeight: '600', cursor: 'pointer', margin: '0 8px 8px 0',
        transition: 'all 0.2s'
    });

    const isMedicineValid = isDrugSelected && drugSearch.trim() !== '' && quantity > 0 && frequency !== '' && days !== '';

    return (
        <DoctorLayout>
            <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '100px', fontFamily: "'Inter', sans-serif" }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <button onClick={() => navigate(-1)} style={{
                        width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.secondary} strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <h1 style={{ fontSize: '20px', fontWeight: '800', color: theme.secondary, margin: 0, flex: 1, textAlign: 'center' }}>Create Prescription</h1>
                    <div style={{ width: '32px' }} /> {/* Spacer */}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(400px, 1.4fr)', gap: '32px', alignItems: 'start' }}>
                    {/* ── LEFT COLUMN ── */}
                    <div>
                        {/* Patient Details Card */}
                        <div style={{ backgroundColor: theme.primaryLight, border: `1px solid ${theme.primaryStroke}`, borderRadius: '16px', padding: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: theme.primary }}>PATIENT DETAILS</span>
                        </div>
                        <span style={{ backgroundColor: '#fff', border: `1px solid ${theme.primaryStroke}`, color: theme.primary, fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '4px' }}>
                            {opdId}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <span style={{ fontSize: '12px', color: theme.primary }}>Full Name</span>
                            <input value={fullName} onChange={e => setFullName(e.target.value)} style={{ ...inputStyle, marginTop: '4px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '12px', color: theme.primary }}>Age</span>
                                <input type="number" value={age} onChange={e => setAge(e.target.value)} style={{ ...inputStyle, marginTop: '4px' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '12px', color: theme.primary }}>Sex</span>
                                <select value={sex} onChange={e => setSex(e.target.value)} style={{ ...inputStyle, marginTop: '4px', cursor: 'pointer' }}>
                                    <option value="" disabled>Select</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: theme.primary }}>Mobile No. *</span>
                            <input value={mobile} onChange={e => setMobile(e.target.value)} style={{ ...inputStyle, marginTop: '4px' }} />
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: theme.primary }}>Email (Optional)</span>
                            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="patient@example.com" style={{ ...inputStyle, marginTop: '4px' }} />
                        </div>
                    </div>
                </div>

                {/* Form Elements */}
                <label style={titleStyle}>Department</label>
                <select value={department} onChange={e => setDepartment(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="" disabled>Select Department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <label style={titleStyle}>Target Internal Pharmacy</label>
                <select value={targetPharmacy} onChange={e => setTargetPharmacy(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select Target Pharmacy</option>
                    <option>Main Pharmacy - Block A</option>
                    <option>OPD Pharmacy - Block B</option>
                    <option>Emergency Pharmacy</option>
                    <option>Dental Block Pharmacy</option>
                    <option>Staff Clinic Pharmacy</option>
                </select>

                <label style={titleStyle}>Diagnosis</label>
                <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Patient's current condition..." style={inputStyle} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: theme.secondary, margin: 0 }}>Treatment</label>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: theme.cyan, cursor: 'pointer' }}>+ Add New</span>
                </div>
                    <div style={{ marginTop: '8px', marginBottom: '24px' }}>
                        {treatmentOptions.map(t => (
                            <div key={t} onClick={() => toggleTreatment(t)} style={chipStyle(selectedTreatments === t)}>
                                {t}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div>
                    {/* Digital Prescription List */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.cyan} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: theme.secondary, marginLeft: '8px' }}>Digital Prescription</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: theme.textSecondary, marginLeft: 'auto' }}>{drugList.length} Items Added</span>
                    </div>

                {drugList.map((m, i) => (
                    <div key={i} style={{ backgroundColor: '#fff', border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: theme.secondary, margin: 0 }}>{m.name} {m.strength !== 'N/A' && m.strength}</p>
                            <p style={{ fontSize: '12px', color: theme.textSecondary, margin: '4px 0 0 0' }}>{m.frequency} - {m.instructions}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: '12px', color: theme.textSecondary, margin: 0 }}>Qty: {m.quantity}</p>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <span onClick={() => editMedicine(i)} style={{ fontSize: '12px', color: theme.cyan, cursor: 'pointer', fontWeight: '700' }}>EDIT</span>
                                <span onClick={() => deleteMedicine(i)} style={{ fontSize: '12px', color: '#EF4444', cursor: 'pointer', fontWeight: '700' }}>DEL</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Prescription Entry Card */}
                <div style={{ backgroundColor: '#fff', border: `2px solid ${theme.cyan}`, borderRadius: '16px', padding: '16px', marginTop: '24px' }}>
                    <label style={labelStyle}>DRUG NAME / GENERIC</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            value={drugSearch}
                            onChange={(e) => {
                                setDrugSearch(e.target.value);
                                setIsDrugSelected(false);
                            }}
                            placeholder="Type to search (e.g. Amoxicillin)..."
                            style={inputStyle}
                        />
                        {(isSearching || searchResults.length > 0) && drugSearch.trim().length >= 2 && !isDrugSelected && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: '#fff', border: `1px solid ${theme.border}`, borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                {searchResults.map(res => (
                                    <div key={res.id} onClick={() => selectDrug(res)} style={{ padding: '12px', borderBottom: `1px solid ${theme.border}`, cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                                        {res.name} {res.strength && `— ${res.strength}`}
                                    </div>
                                ))}
                                {searchResults.length === 0 && !isSearching && (
                                    <div style={{ padding: '12px', fontSize: '13px', color: theme.textSecondary, textAlign: 'center' }}>No results</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>STRENGTH</label>
                            <input value={strength} onChange={e => setStrength(e.target.value)} style={smallGridInput} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>QTY</label>
                            <div style={{ display: 'flex', alignItems: 'center', ...smallGridInput, padding: 0 }}>
                                <div onClick={() => setQuantity(Math.max(0, quantity - 1))} style={{ flex: 1, padding: '8px', cursor: 'pointer', textAlign: 'center', userSelect: 'none' }}>-</div>
                                <div style={{ flex: 1, fontWeight: '700', borderLeft: `1px solid ${theme.border}`, borderRight: `1px solid ${theme.border}`, padding: '8px' }}>{quantity}</div>
                                <div onClick={() => setQuantity(quantity + 1)} style={{ flex: 1, padding: '8px', cursor: 'pointer', textAlign: 'center', userSelect: 'none' }}>+</div>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>FREQ</label>
                            <select value={frequency} onChange={e => setFrequency(e.target.value)} style={{ ...smallGridInput, cursor: 'pointer', padding: '0 4px' }}>
                                <option value=""></option>
                                <option>OD</option>
                                <option>BD</option>
                                <option>TDS</option>
                                <option>QID</option>
                                <option>SOS</option>
                                <option>As needed</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>DAYS</label>
                            <input type="number" value={days} onChange={e => setDays(e.target.value)} style={smallGridInput} />
                        </div>
                    </div>

                    <label style={{ ...labelStyle, marginTop: '16px' }}>INSTRUCTIONS</label>
                    <div style={{ marginBottom: '8px' }}>
                        {instructionOptions.map(instr => (
                            <div key={instr} onClick={() => toggleInstruction(instr)} style={chipStyle(selectedInstructions.includes(instr))}>
                                {instr}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button
                            onClick={addToList}
                            disabled={!isMedicineValid}
                            style={{
                                backgroundColor: isMedicineValid ? '#006064' : '#E5E7EB',
                                color: isMedicineValid ? '#fff' : theme.outline,
                                borderRadius: '24px', padding: '10px 20px', border: 'none',
                                fontSize: '14px', fontWeight: '700', cursor: isMedicineValid ? 'pointer' : 'not-allowed',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                opacity: isMedicineValid ? 1 : 0.5
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            {editingIndex >= 0 ? "Update Medicine" : "Add to List"}
                        </button>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '10px', color: theme.outline, marginTop: '12px', marginBottom: 0 }}>
                        Start typing to search our database of 5000+ approved drugs.
                    </p>
                </div>

                {/* AI Features Card */}
                <div style={{ backgroundColor: theme.purpleBg, border: `1px solid ${theme.purpleStroke}`, borderRadius: '16px', padding: '16px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.purpleText} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: theme.purpleText }}>AI ASSISTANT</span>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: theme.secondary }}>Simplified Instructions (English)</span>
                        <p style={{ fontSize: '13px', color: theme.textSecondary, margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>{aiEngExp}</p>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: theme.secondary }}>எளிய வழிமுறைகள் (Tamil)</span>
                        <p style={{ fontSize: '13px', color: theme.textSecondary, margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>{aiTamExp}</p>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: theme.secondary }}>Suggested Medication Schedule (English)</span>
                        <p style={{ fontSize: '13px', color: theme.textSecondary, margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>{aiEngRem}</p>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: theme.secondary }}>பரிந்துரைக்கப்பட்ட மருந்து அட்டவணை (Tamil)</span>
                        <p style={{ fontSize: '13px', color: theme.textSecondary, margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>{aiTamRem}</p>
                    </div>
                    <p style={{ fontSize: '10px', fontStyle: 'italic', color: theme.outline, marginTop: '12px', marginBottom: 0 }}>
                        This is a suggested schedule for patient guidance.
                    </p>
                </div>

                {/* Certify & Submit */}
                <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '16px', gap: '8px' }}>
                    <input type="checkbox" checked={disclaimer} onChange={e => setDisclaimer(e.target.checked)} style={{ marginTop: '2px' }} />
                    <span style={{ fontSize: '12px', color: theme.textSecondary }}>
                        I certify this prescription is accurate and clinically appropriate for the diagnosis above.
                    </span>
                </div>
            
                    {/* Submit Button */}
                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={issuePrescription}
                            disabled={isSubmitting || !disclaimer}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                                backgroundColor: isSubmitting || !disclaimer ? theme.outline : theme.cyan,
                                color: isSubmitting || !disclaimer ? '#fff' : theme.secondary,
                                fontSize: '16px', fontWeight: '800', cursor: isSubmitting || !disclaimer ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s', boxShadow: isSubmitting || !disclaimer ? 'none' : '0 4px 12px rgba(0, 229, 255, 0.3)'
                            }}
                        >
                            {isSubmitting ? 'Issuing...' : 'Issue Prescription'}
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </DoctorLayout>
    );
};

export default CreatePrescriptionPage;
