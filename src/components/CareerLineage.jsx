import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBriefcase, FiAward, FiBookOpen, FiCalendar, FiMapPin,
    FiSearch, FiLock, FiFlag, FiExternalLink, FiCode,
    FiDatabase, FiCheckCircle, FiChevronDown, FiChevronUp,
    FiCopy, FiCheck, FiRefreshCw, FiAlertCircle, FiXCircle,
    FiDollarSign, FiClock, FiLayers, FiInfo, FiFileText
} from 'react-icons/fi';
import LineageDetailModal from './LineageDetailModal';

const SPRING_TRANSITION = { type: 'spring', stiffness: 450, damping: 32 };

const TYPE_CONFIG = {
    experience: {
        label: 'Work Experience',
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.12)',
        border: 'rgba(59, 130, 246, 0.3)',
        icon: FiBriefcase
    },
    interview: {
        label: 'Interview Loop',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.3)',
        icon: FiCode
    },
    certification: {
        label: 'Credential',
        color: '#8b5cf6',
        bg: 'rgba(139, 92, 246, 0.12)',
        border: 'rgba(139, 92, 246, 0.3)',
        icon: FiAward
    },
    education: {
        label: 'Education',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.3)',
        icon: FiBookOpen
    },
    milestone: {
        label: 'Career Transition',
        color: '#ec4899',
        bg: 'rgba(236, 72, 153, 0.12)',
        border: 'rgba(236, 72, 153, 0.3)',
        icon: FiFlag
    }
};

const STATUS_CONFIG = {
    selected: {
        label: 'Selected • Offer Track',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.35)',
        icon: FiCheckCircle
    },
    pending: {
        label: 'Evaluation Pending',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.35)',
        icon: FiAlertCircle
    },
    rejected: {
        label: 'Not Selected / Closed',
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.35)',
        icon: FiXCircle
    },
    'not-attempted': {
        label: 'Not Attempted / Expired',
        color: '#94a3b8',
        bg: 'rgba(148, 163, 184, 0.12)',
        border: 'rgba(148, 163, 184, 0.35)',
        icon: FiClock
    }
};

const CareerLineage = ({ data, onLockDevice, onUnlockRequest, onRefreshData }) => {
    const lineageEras = data?.lineageEras || [
        { id: 'all', label: 'Complete Lineage (2004 – 2026)', range: '2004 – 2026' }
    ];
    const lineageItems = data?.lineageItems || [];
    const careerParameters = data?.careerParameters || {};

    // Segmented Navigation Tab State
    const [activeTab, setActiveTab] = useState('experience'); // 'experience' | 'interview' | 'education' | 'timeline'

    // Interview Tab Filters
    const [interviewStatusFilter, setInterviewStatusFilter] = useState('all');
    const [interviewSearch, setInterviewSearch] = useState('');

    // Experience Tab Filters
    const [experienceSearch, setExperienceSearch] = useState('');
    const [showCompensationDrawer, setShowCompensationDrawer] = useState(false);

    // Education Tab Filters
    const [educationSearch, setEducationSearch] = useState('');

    // Full Timeline Tab Filters
    const [timelineType, setTimelineType] = useState('all');
    const [timelineEra, setTimelineEra] = useState('all');
    const [timelineSearch, setTimelineSearch] = useState('');

    // Shared State
    const [activeModalItem, setActiveModalItem] = useState(null);
    const [expandedCardIds, setExpandedCardIds] = useState([]);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const toggleCardExpansion = (id) => {
        setExpandedCardIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleLock = () => {
        if (window.confirm("Lock this device? You'll need to enter your password again next time.")) {
            if (onLockDevice) {
                onLockDevice();
            } else {
                sessionStorage.removeItem('portfolioDecryptedData');
                localStorage.removeItem('portfolioDecryptedData');
                localStorage.removeItem('portfolioRememberedToken');
                localStorage.removeItem('portfolioAuthenticated');
                localStorage.removeItem('portfolioActiveMode');
                window.location.reload();
            }
        }
    };

    // Filtered Items for Work Experience
    const experienceItems = useMemo(() => {
        const raw = lineageItems.filter(item => item.type === 'experience' || item.type === 'milestone');
        const q = experienceSearch.toLowerCase().trim();
        if (!q) return raw;
        return raw.filter(item =>
            item.title?.toLowerCase().includes(q) ||
            item.organization?.toLowerCase().includes(q) ||
            item.summary?.toLowerCase().includes(q) ||
            item.location?.toLowerCase().includes(q) ||
            (item.project && (
                item.project.title?.toLowerCase().includes(q) ||
                item.project.impact?.toLowerCase().includes(q) ||
                (item.project.tags && item.project.tags.some(t => t.toLowerCase().includes(q))) ||
                (item.project.responsibilities && item.project.responsibilities.some(r =>
                    r.title?.toLowerCase().includes(q) || r.detail?.toLowerCase().includes(q)
                ))
            )) ||
            (item.highlights && item.highlights.some(h => h.toLowerCase().includes(q)))
        );
    }, [lineageItems, experienceSearch]);

    // Filtered Items for Interview Tracker
    const interviewItems = useMemo(() => {
        const raw = lineageItems.filter(item => item.type === 'interview');
        return raw.filter(item => {
            const matchesStatus = interviewStatusFilter === 'all' || item.status === interviewStatusFilter;
            const q = interviewSearch.toLowerCase().trim();
            if (!q) return matchesStatus;

            const matchesSearch =
                item.organization?.toLowerCase().includes(q) ||
                item.title?.toLowerCase().includes(q) ||
                item.clientAccount?.toLowerCase().includes(q) ||
                item.summary?.toLowerCase().includes(q) ||
                (item.keyTopics && item.keyTopics.some(t => t.toLowerCase().includes(q))) ||
                (item.interviewQuestions && item.interviewQuestions.some(iq =>
                    iq.q?.toLowerCase().includes(q) || (iq.myAnswer && iq.myAnswer.toLowerCase().includes(q))
                ));

            return matchesStatus && matchesSearch;
        });
    }, [lineageItems, interviewStatusFilter, interviewSearch]);

    // Interview Stats
    const interviewStats = useMemo(() => {
        const raw = lineageItems.filter(item => item.type === 'interview');
        return {
            total: raw.length,
            selected: raw.filter(i => i.status === 'selected').length,
            pending: raw.filter(i => i.status === 'pending').length,
            rejected: raw.filter(i => i.status === 'rejected').length,
            notAttempted: raw.filter(i => i.status === 'not-attempted').length
        };
    }, [lineageItems]);

    // Filtered Items for Education & Credentials
    const educationItems = useMemo(() => {
        const raw = lineageItems.filter(item => item.type === 'education' || item.type === 'certification');
        const q = educationSearch.toLowerCase().trim();
        if (!q) return raw;
        return raw.filter(item =>
            item.title?.toLowerCase().includes(q) ||
            item.organization?.toLowerCase().includes(q) ||
            item.badge?.toLowerCase().includes(q) ||
            item.summary?.toLowerCase().includes(q) ||
            (item.academicHighlights && item.academicHighlights.some(h => h.toLowerCase().includes(q))) ||
            (item.certList && item.certList.some(c => c.title.toLowerCase().includes(q))) ||
            (item.capstoneProject && (
                item.capstoneProject.title?.toLowerCase().includes(q) ||
                item.capstoneProject.description?.toLowerCase().includes(q)
            ))
        );
    }, [lineageItems, educationSearch]);

    // Filtered Items for Full Timeline
    const fullTimelineItems = useMemo(() => {
        return lineageItems.filter(item => {
            const matchesType = timelineType === 'all' || item.type === timelineType;
            const matchesEra = timelineEra === 'all' || item.era === timelineEra;

            const q = timelineSearch.toLowerCase().trim();
            if (!q) return matchesType && matchesEra;

            const matchesSearch =
                item.title?.toLowerCase().includes(q) ||
                item.organization?.toLowerCase().includes(q) ||
                (item.badge && item.badge.toLowerCase().includes(q)) ||
                (item.summary && item.summary.toLowerCase().includes(q)) ||
                (item.location && item.location.toLowerCase().includes(q)) ||
                (item.keyTopics && item.keyTopics.some(t => t.toLowerCase().includes(q))) ||
                (item.certList && item.certList.some(c => c.title.toLowerCase().includes(q))) ||
                (item.highlights && item.highlights.some(h => h.toLowerCase().includes(q))) ||
                (item.academicHighlights && item.academicHighlights.some(ah => ah.toLowerCase().includes(q))) ||
                (item.project && (
                    item.project.title?.toLowerCase().includes(q) ||
                    (item.project.impact && item.project.impact.toLowerCase().includes(q)) ||
                    (item.project.tags && item.project.tags.some(t => t.toLowerCase().includes(q))) ||
                    (item.project.catalyst && item.project.catalyst.toLowerCase().includes(q)) ||
                    (item.project.responsibilities && item.project.responsibilities.some(r =>
                        r.title?.toLowerCase().includes(q) || r.detail?.toLowerCase().includes(q)
                    ))
                )) ||
                (item.capstoneProject && (
                    item.capstoneProject.title?.toLowerCase().includes(q) ||
                    item.capstoneProject.description?.toLowerCase().includes(q)
                )) ||
                (item.interviewQuestions && item.interviewQuestions.some(iq =>
                    iq.q?.toLowerCase().includes(q) || (iq.myAnswer && iq.myAnswer.toLowerCase().includes(q))
                ));

            return matchesType && matchesEra && matchesSearch;
        });
    }, [lineageItems, timelineType, timelineEra, timelineSearch]);

    if (!data || !lineageItems || lineageItems.length === 0) {
        return (
            <section id="career-lineage" className="section" style={{ paddingTop: '100px', paddingBottom: '80px', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="glass-card" style={{ padding: '40px 24px', borderRadius: 'var(--radius-card)' }}>
                        <FiLock size={48} style={{ color: 'var(--primary-color)', marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Private Lineage is Encrypted
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                            Personal compensation parameters, active interview pipelines, and master project deep dives are zero-knowledge encrypted with AES-256-GCM.
                        </p>
                        {onUnlockRequest && (
                            <button
                                onClick={onUnlockRequest}
                                className="btn-primary"
                                style={{ padding: '10px 24px', fontSize: '0.92rem', borderRadius: 'var(--radius-pill)', cursor: 'pointer' }}
                            >
                                Enter Passcode to Decrypt
                            </button>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    const tabs = [
        { id: 'experience', label: 'Work Experience', icon: FiBriefcase, count: lineageItems.filter(i => i.type === 'experience' || i.type === 'milestone').length },
        { id: 'interview', label: 'Interview Experiences', icon: FiCode, count: lineageItems.filter(i => i.type === 'interview').length },
        { id: 'education', label: 'Education & Credentials', icon: FiAward, count: lineageItems.filter(i => i.type === 'education' || i.type === 'certification').length },
        { id: 'timeline', label: 'Full Timeline', icon: FiLayers, count: lineageItems.length }
    ];

    return (
        <section id="career-lineage" className="section" style={{ paddingTop: '80px', paddingBottom: '70px' }}>
            <div className="container">
                {/* Header Title & Unobtrusive Controls */}
                <div className="section-title-wrap" style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        marginBottom: '14px'
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            background: 'var(--badge-bg)',
                            border: '1px solid var(--badge-border)',
                            borderRadius: '9999px',
                            fontSize: '0.82rem',
                            color: 'var(--primary-color)',
                            fontWeight: 600
                        }}>
                            <span>🔒</span> Private View • For Me
                        </div>

                        <button
                            onClick={() => {
                                if (onRefreshData) {
                                    onRefreshData();
                                } else {
                                    sessionStorage.removeItem('portfolioDecryptedData');
                                    localStorage.removeItem('portfolioDecryptedData');
                                    if (onUnlockRequest) {
                                        onUnlockRequest();
                                    } else {
                                        window.location.reload();
                                    }
                                }
                            }}
                            title="Force reload & decrypt latest private data"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                borderRadius: '9999px',
                                background: 'var(--surface-card)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-color)'; e.currentTarget.style.borderColor = 'var(--primary-color)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                        >
                            <FiRefreshCw size={12} /> Reload Latest Data
                        </button>

                        <button
                            onClick={handleLock}
                            title="Lock private view on this device"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                borderRadius: '9999px',
                                background: 'var(--surface-card)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                        >
                            <FiLock size={12} /> Lock Device
                        </button>
                    </div>

                    <h2 className="section-heading">
                        Career & Experience <span className="gradient-text">Lineage</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1rem', maxWidth: '820px', margin: '8px auto 0', lineHeight: '1.6' }}>
                        Streamlined executive dashboard: focused work history, active interview tracker with real Q&As, academic foundations, and complete chronological timeline.
                    </p>
                </div>

                {/* Standalone Filter Pills Switcher */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '32px'
                }}>
                    {tabs.map((tab) => {
                        const isSelected = activeTab === tab.id;
                        const TabIcon = tab.icon;
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ y: -2 }}
                                transition={SPRING_TRANSITION}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 18px',
                                    borderRadius: '9999px',
                                    fontSize: '0.86rem',
                                    fontWeight: isSelected ? 600 : 500,
                                    background: isSelected ? 'var(--primary-color)' : 'var(--surface-card)',
                                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                                    border: isSelected ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
                                    boxShadow: isSelected ? '0 4px 14px rgba(0, 113, 227, 0.35)' : 'var(--card-highlight)',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    userSelect: 'none',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                <TabIcon size={14} style={{ color: isSelected ? '#ffffff' : 'var(--primary-color)' }} />
                                <span>{tab.label}</span>
                                <span
                                    style={{
                                        fontSize: '0.74rem',
                                        padding: '2px 8px',
                                        borderRadius: '9999px',
                                        background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'var(--badge-bg)',
                                        color: isSelected ? '#ffffff' : 'var(--primary-color)',
                                        fontWeight: 700
                                    }}
                                >
                                    {tab.count}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* ==========================================================================
                    TAB 1: WORK EXPERIENCE
                    ========================================================================== */}
                {activeTab === 'experience' && (
                    <motion.div
                        key="tab-experience"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={SPRING_TRANSITION}
                    >
                        {/* Executive Identity & Compensation Audit Banner */}
                        {careerParameters.eyAppointment && (
                            <div
                                className="glass-card"
                                style={{
                                    padding: '20px 24px',
                                    borderRadius: 'var(--radius-card)',
                                    marginBottom: '28px',
                                    background: 'var(--surface-card)',
                                    border: '1px solid var(--card-border)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '10px',
                                            background: 'rgba(59, 130, 246, 0.12)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#3b82f6'
                                        }}>
                                            <FiBriefcase size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                Current Engagement: Ernst & Young (EY) • American Express Campus
                                            </h4>
                                            <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                                                Consultant (Band 5) • Joined Nov 11, 2024 • Gurgaon, Haryana • Baseline: {careerParameters.eyAppointment.currentBaseline}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowCompensationDrawer(!showCompensationDrawer)}
                                        className="btn-secondary"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 14px',
                                            borderRadius: '9999px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <FiInfo size={13} />
                                        <span>{showCompensationDrawer ? 'Hide Corporate Details' : 'View Corporate Parameters'}</span>
                                        {showCompensationDrawer ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {showCompensationDrawer && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25 }}
                                            style={{ overflow: 'hidden', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}
                                        >
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                                                <div style={{ padding: '12px', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                                                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 600 }}>EY Official Record</span>
                                                    <div style={{ marginTop: '4px', fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 600 }}>Fixed: {careerParameters.eyAppointment.annualFixedCompensation}</div>
                                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Joining Bonus: {careerParameters.eyAppointment.joiningBonus}</div>
                                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Max Potential: {careerParameters.eyAppointment.earningPotential} • Notice: {careerParameters.eyAppointment.noticePeriod}</div>
                                                </div>

                                                {careerParameters.tcsSeparation && (
                                                    <div style={{ padding: '12px', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                                                        <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 600 }}>TCS Relieving Audit</span>
                                                        <div style={{ marginTop: '4px', fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 600 }}>Employee ID: {careerParameters.tcsSeparation.employeeId}</div>
                                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Tenure: Sep 23, 2024 – Nov 8, 2024</div>
                                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Relieving Ref: {careerParameters.tcsSeparation.relievingRef}</div>
                                                    </div>
                                                )}

                                                {careerParameters.infosysIdentifiers && (
                                                    <div style={{ padding: '12px', background: 'var(--surface-color)', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                                                        <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Infosys Record</span>
                                                        <div style={{ marginTop: '4px', fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 600 }}>Employee ID: {careerParameters.infosysIdentifiers.employeeId}</div>
                                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Tenure: Aug 2021 – Aug 2024 (3 Years)</div>
                                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Official Base: {careerParameters.infosysIdentifiers.baseLocation}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Search Toolbar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                Showing <strong>{experienceItems.length}</strong> engineering tenures & transitions
                            </div>
                            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={14} />
                                <input
                                    type="text"
                                    placeholder="Search roles, catalysts, tech stack..."
                                    value={experienceSearch}
                                    onChange={(e) => setExperienceSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px 8px 34px',
                                        borderRadius: 'var(--radius-pill)',
                                        border: '1px solid var(--card-border)',
                                        background: 'var(--surface-card)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.84rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Experience Cards Stack */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {experienceItems.map((item, idx) => {
                                const typeCfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.experience;
                                const TypeIcon = typeCfg.icon;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: idx * 0.04 }}
                                        viewport={{ once: true }}
                                        className="glass-card"
                                        style={{
                                            padding: '24px 26px',
                                            borderRadius: 'var(--radius-card)',
                                            background: 'var(--surface-card)',
                                            border: '1px solid var(--card-border)',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Card Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                                    <span style={{
                                                        fontSize: '0.74rem',
                                                        padding: '3px 10px',
                                                        borderRadius: '9999px',
                                                        background: typeCfg.bg,
                                                        border: `1px solid ${typeCfg.border}`,
                                                        color: typeCfg.color,
                                                        fontWeight: 600,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}>
                                                        <TypeIcon size={12} />
                                                        {typeCfg.label}
                                                    </span>

                                                    {item.badge && (
                                                        <span style={{
                                                            fontSize: '0.74rem',
                                                            padding: '3px 10px',
                                                            borderRadius: '9999px',
                                                            background: `${item.badgeColor || typeCfg.color}15`,
                                                            border: `1px solid ${item.badgeColor || typeCfg.color}40`,
                                                            color: item.badgeColor || typeCfg.color,
                                                            fontWeight: 600
                                                        }}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                    {item.title}
                                                </h3>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                                                    <strong style={{ color: 'var(--primary-color)' }}>{item.organization}</strong>
                                                    {item.clientAccount && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Client: <strong>{item.clientAccount}</strong></span>
                                                        </>
                                                    )}
                                                    {item.location && (
                                                        <>
                                                            <span>•</span>
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                <FiMapPin size={12} /> {item.location}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tenure Date Pill */}
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '5px 14px',
                                                borderRadius: '9999px',
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                background: 'var(--badge-bg)',
                                                border: '1px solid var(--badge-border)',
                                                color: 'var(--text-primary)'
                                            }}>
                                                <FiCalendar size={13} style={{ color: 'var(--primary-color)' }} />
                                                {item.date}
                                            </span>
                                        </div>

                                        {/* Executive Summary */}
                                        {item.summary && (
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.65', margin: '0 0 14px 0' }}>
                                                {item.summary}
                                            </p>
                                        )}

                                        {/* Project Catalyst Highlight (if present) */}
                                        {item.project && item.project.catalyst && (
                                            <div style={{
                                                padding: '12px 16px',
                                                borderRadius: '10px',
                                                background: 'rgba(59, 130, 246, 0.08)',
                                                borderLeft: '3px solid #3b82f6',
                                                marginBottom: '14px',
                                                fontSize: '0.86rem',
                                                color: 'var(--text-secondary)',
                                                lineHeight: '1.6'
                                            }}>
                                                <strong style={{ color: 'var(--text-primary)' }}>Architectural Catalyst: </strong>
                                                {item.project.catalyst}
                                            </div>
                                        )}

                                        {/* Key Responsibilities / Highlights */}
                                        {item.project && item.project.responsibilities && (
                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {item.project.responsibilities.slice(0, 3).map((resp, rIdx) => (
                                                        <div key={rIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                                                            <FiCheckCircle size={14} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '3px' }} />
                                                            <div>
                                                                <strong style={{ color: 'var(--text-primary)' }}>{resp.title}: </strong>
                                                                {resp.detail}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tech Stack Chips & Metrics Row */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--card-border)' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {item.project?.tags ? (
                                                    item.project.tags.slice(0, 6).map((tag, tIdx) => (
                                                        <span key={tIdx} style={{
                                                            fontSize: '0.74rem',
                                                            padding: '3px 9px',
                                                            borderRadius: '6px',
                                                            background: 'var(--surface-color)',
                                                            border: '1px solid var(--card-border)',
                                                            color: 'var(--text-secondary)',
                                                            fontWeight: 500
                                                        }}>
                                                            {tag}
                                                        </span>
                                                    ))
                                                ) : item.metrics ? (
                                                    item.metrics.map((m, mIdx) => (
                                                        <span key={mIdx} style={{
                                                            fontSize: '0.74rem',
                                                            padding: '3px 9px',
                                                            borderRadius: '6px',
                                                            background: 'var(--surface-color)',
                                                            border: '1px solid var(--card-border)',
                                                            color: 'var(--text-secondary)',
                                                            fontWeight: 500
                                                        }}>
                                                            {m}
                                                        </span>
                                                    ))
                                                ) : null}
                                            </div>

                                            <button
                                                onClick={() => setActiveModalItem(item)}
                                                className="btn-secondary"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '7px 16px',
                                                    borderRadius: 'var(--radius-pill)',
                                                    fontSize: '0.82rem',
                                                    fontWeight: 600,
                                                    color: 'var(--primary-color)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiDatabase size={13} />
                                                <span>View Architecture Deep Dive</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* ==========================================================================
                    TAB 2: INTERVIEW EXPERIENCES
                    ========================================================================== */}
                {activeTab === 'interview' && (
                    <motion.div
                        key="tab-interview"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={SPRING_TRANSITION}
                    >
                        {/* Interview Pipeline Stats Strip */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                            <div className="glass-card" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center', background: 'var(--surface-card)', border: '1px solid var(--card-border)' }}>
                                <div style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--text-primary)' }}>{interviewStats.total}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Company Loops</div>
                            </div>
                            <div className="glass-card" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center', background: 'var(--surface-card)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#10b981' }}>{interviewStats.selected}</div>
                                <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>Selected / Offers</div>
                            </div>
                            <div className="glass-card" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center', background: 'var(--surface-card)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#f59e0b' }}>{interviewStats.pending}</div>
                                <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>Evaluation Pending</div>
                            </div>
                            <div className="glass-card" style={{ padding: '16px', borderRadius: '14px', textAlign: 'center', background: 'var(--surface-card)', border: '1px solid var(--card-border)' }}>
                                <div style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>{interviewStats.rejected + interviewStats.notAttempted}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Closed / Expired</div>
                            </div>
                        </div>

                        {/* Search & Status Filter Controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
                            {/* Status Filter Pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                <button
                                    onClick={() => setInterviewStatusFilter('all')}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '9999px',
                                        fontSize: '0.8rem',
                                        fontWeight: interviewStatusFilter === 'all' ? 700 : 500,
                                        background: interviewStatusFilter === 'all' ? 'var(--badge-bg)' : 'var(--surface-card)',
                                        border: interviewStatusFilter === 'all' ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
                                        color: interviewStatusFilter === 'all' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    All Loops ({interviewStats.total})
                                </button>
                                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                                    const count = lineageItems.filter(i => i.type === 'interview' && i.status === key).length;
                                    if (count === 0) return null;
                                    const isSelected = interviewStatusFilter === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setInterviewStatusFilter(key)}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '9999px',
                                                fontSize: '0.8rem',
                                                fontWeight: isSelected ? 700 : 500,
                                                background: isSelected ? cfg.bg : 'var(--surface-card)',
                                                border: isSelected ? `1px solid ${cfg.color}` : '1px solid var(--card-border)',
                                                color: isSelected ? cfg.color : 'var(--text-secondary)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {cfg.label.split('•')[0].trim()} ({count})
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Search Input */}
                            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={14} />
                                <input
                                    type="text"
                                    placeholder="Search company, question, tech..."
                                    value={interviewSearch}
                                    onChange={(e) => setInterviewSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px 8px 34px',
                                        borderRadius: '9999px',
                                        border: '1px solid var(--card-border)',
                                        background: 'var(--surface-card)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.84rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Interview Company Cards Grid */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {interviewItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                                    <p style={{ fontSize: '1rem', margin: 0 }}>No interview records found matching your filter criteria.</p>
                                    <button
                                        onClick={() => { setInterviewStatusFilter('all'); setInterviewSearch(''); }}
                                        style={{
                                            marginTop: '12px',
                                            padding: '6px 16px',
                                            background: 'var(--primary-color)',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '9999px',
                                            cursor: 'pointer',
                                            fontSize: '0.84rem'
                                        }}
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            ) : (
                                interviewItems.map((item, idx) => {
                                    const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                                    const isExpanded = expandedCardIds.includes(item.id);

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.28, delay: Math.min(idx * 0.03, 0.2) }}
                                            viewport={{ once: true }}
                                            className="glass-card"
                                            style={{
                                                padding: '22px 24px',
                                                borderRadius: 'var(--radius-card)',
                                                background: 'var(--surface-card)',
                                                border: '1px solid var(--card-border)'
                                            }}
                                        >
                                            {/* Header Row */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                                        {/* Status Badge */}
                                                        <span style={{
                                                            fontSize: '0.74rem',
                                                            padding: '3px 10px',
                                                            borderRadius: '9999px',
                                                            background: statusCfg.bg,
                                                            border: `1px solid ${statusCfg.border}`,
                                                            color: statusCfg.color,
                                                            fontWeight: 600,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '5px'
                                                        }}>
                                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusCfg.color }} />
                                                            {item.badge || statusCfg.label}
                                                        </span>

                                                        {/* Offered CTC Badge */}
                                                        {item.ctcOffered && (
                                                            <span style={{
                                                                fontSize: '0.74rem',
                                                                padding: '3px 10px',
                                                                borderRadius: '9999px',
                                                                background: 'rgba(16, 185, 129, 0.15)',
                                                                border: '1px solid rgba(16, 185, 129, 0.35)',
                                                                color: '#10b981',
                                                                fontWeight: 600
                                                            }}>
                                                                Offered: {item.ctcOffered}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                        {item.organization}
                                                    </h3>

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                                                        <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{item.title.replace(`Interview: ${item.organization} — `, '')}</span>
                                                        {item.clientAccount && (
                                                            <>
                                                                <span>•</span>
                                                                <span>Client: {item.clientAccount}</span>
                                                            </>
                                                        )}
                                                        {item.location && (
                                                            <>
                                                                <span>•</span>
                                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                    <FiMapPin size={12} /> {item.location}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '4px 12px',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.76rem',
                                                    fontWeight: 600,
                                                    background: 'var(--badge-bg)',
                                                    border: '1px solid var(--badge-border)',
                                                    color: 'var(--text-primary)'
                                                }}>
                                                    <FiCalendar size={12} style={{ color: 'var(--primary-color)' }} />
                                                    {item.date}
                                                </span>
                                            </div>

                                            {/* Summary & Notes */}
                                            {item.summary && (
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0 0 12px 0' }}>
                                                    {item.summary}
                                                </p>
                                            )}

                                            {/* Interview Rounds Strip */}
                                            {item.rounds && item.rounds.length > 0 && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                                    {item.rounds.map((rnd, rIdx) => {
                                                        const isCleared = rnd.status === 'cleared';
                                                        const isRejected = rnd.status === 'rejected';
                                                        const rColor = isCleared ? '#10b981' : isRejected ? '#ef4444' : '#f59e0b';
                                                        const rBg = isCleared ? 'rgba(16, 185, 129, 0.12)' : isRejected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)';
                                                        const rBorder = isCleared ? 'rgba(16, 185, 129, 0.3)' : isRejected ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)';

                                                        return (
                                                            <span key={rIdx} style={{
                                                                fontSize: '0.74rem',
                                                                padding: '4px 10px',
                                                                borderRadius: '8px',
                                                                background: rBg,
                                                                border: `1px solid ${rBorder}`,
                                                                color: rColor,
                                                                fontWeight: 600,
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '5px'
                                                            }}>
                                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: rColor }} />
                                                                {rnd.name.split(':')[0] || rnd.name}: {rnd.status.toUpperCase()} ({rnd.date.split('(')[0].trim()})
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Key Topics Badges */}
                                            {item.keyTopics && item.keyTopics.length > 0 && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                                                    {item.keyTopics.map((t, tIdx) => (
                                                        <span key={tIdx} style={{
                                                            fontSize: '0.72rem',
                                                            padding: '3px 8px',
                                                            borderRadius: '6px',
                                                            background: 'var(--surface-color)',
                                                            border: '1px solid var(--card-border)',
                                                            color: 'var(--text-secondary)'
                                                        }}>
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Expandable Interview Questions Accordion */}
                                            {item.interviewQuestions && item.interviewQuestions.length > 0 && isExpanded && (
                                                <div
                                                    style={{
                                                        marginTop: '16px',
                                                        paddingTop: '16px',
                                                        borderTop: '1px solid var(--card-border)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '12px'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                            Live Questions & Verified Solutions ({item.interviewQuestions.length}):
                                                        </span>
                                                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                                            Complete Technical Audit
                                                        </span>
                                                    </div>

                                                    {item.interviewQuestions.map((iq, qIdx) => (
                                                        <div key={qIdx} style={{
                                                            padding: '14px',
                                                            borderRadius: '10px',
                                                            background: 'var(--surface-color)',
                                                            border: '1px solid var(--card-border)'
                                                        }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                                                    {iq.topic || `Question ${qIdx + 1}`}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleCopy(iq.q + '\n\n' + (iq.myAnswer || ''), `${item.id}-card-${qIdx}`)}
                                                                    style={{
                                                                        background: 'transparent',
                                                                        border: 'none',
                                                                        color: copiedIndex === `${item.id}-card-${qIdx}` ? '#10b981' : 'var(--text-muted)',
                                                                        cursor: 'pointer',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px',
                                                                        fontSize: '0.74rem'
                                                                    }}
                                                                >
                                                                    {copiedIndex === `${item.id}-card-${qIdx}` ? <FiCheck size={11} /> : <FiCopy size={11} />}
                                                                    {copiedIndex === `${item.id}-card-${qIdx}` ? 'Copied' : 'Copy'}
                                                                </button>
                                                            </div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                                {iq.q}
                                                            </div>
                                                            {iq.myAnswer && (
                                                                <div style={{
                                                                    fontSize: '0.84rem',
                                                                    color: 'var(--text-secondary)',
                                                                    background: 'rgba(0,0,0,0.22)',
                                                                    padding: '12px',
                                                                    borderRadius: '8px',
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordBreak: 'break-word',
                                                                    lineHeight: 1.6,
                                                                    borderLeft: '3px solid var(--primary-color)'
                                                                }}>
                                                                    {iq.myAnswer}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Action Buttons Row */}
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                                                {item.interviewQuestions && (
                                                    <button
                                                        onClick={() => toggleCardExpansion(item.id)}
                                                        className="btn-secondary"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            padding: '6px 14px',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.78rem',
                                                            fontWeight: 600,
                                                            color: 'var(--text-primary)',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {isExpanded ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                                                        <span>{isExpanded ? 'Hide Questions' : `View Questions (${item.interviewQuestions.length})`}</span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => setActiveModalItem(item)}
                                                    className="btn-secondary"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '6px 14px',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 600,
                                                        color: 'var(--primary-color)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <FiCode size={13} />
                                                    <span>Full Audit Modal</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ==========================================================================
                    TAB 3: EDUCATION & CREDENTIALS
                    ========================================================================== */}
                {activeTab === 'education' && (
                    <motion.div
                        key="tab-education"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={SPRING_TRANSITION}
                    >
                        {/* Search Toolbar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                Showing <strong>{educationItems.length}</strong> academic degrees, credentials & certifications
                            </div>
                            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={14} />
                                <input
                                    type="text"
                                    placeholder="Search degree, certificate, school..."
                                    value={educationSearch}
                                    onChange={(e) => setEducationSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px 8px 34px',
                                        borderRadius: '9999px',
                                        border: '1px solid var(--card-border)',
                                        background: 'var(--surface-card)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.84rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Grid: Academic Foundations & Professional Credentials */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                            {educationItems.map((item, idx) => {
                                const typeCfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.education;
                                const TypeIcon = typeCfg.icon;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.28, delay: idx * 0.04 }}
                                        viewport={{ once: true }}
                                        className="glass-card"
                                        style={{
                                            padding: '22px 24px',
                                            borderRadius: 'var(--radius-card)',
                                            background: 'var(--surface-card)',
                                            border: '1px solid var(--card-border)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                                                <span style={{
                                                    fontSize: '0.74rem',
                                                    padding: '3px 10px',
                                                    borderRadius: '9999px',
                                                    background: typeCfg.bg,
                                                    border: `1px solid ${typeCfg.border}`,
                                                    color: typeCfg.color,
                                                    fontWeight: 600,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}>
                                                    <TypeIcon size={12} />
                                                    {typeCfg.label}
                                                </span>

                                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                                    {item.date}
                                                </span>
                                            </div>

                                            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {item.title}
                                            </h3>

                                            <div style={{ fontSize: '0.86rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '8px' }}>
                                                {item.organization}
                                            </div>

                                            {item.badge && (
                                                <div style={{ marginBottom: '12px' }}>
                                                    <span style={{
                                                        fontSize: '0.76rem',
                                                        padding: '3px 10px',
                                                        borderRadius: '6px',
                                                        background: `${item.badgeColor || typeCfg.color}15`,
                                                        border: `1px solid ${item.badgeColor || typeCfg.color}40`,
                                                        color: item.badgeColor || typeCfg.color,
                                                        fontWeight: 600
                                                    }}>
                                                        {item.badge}
                                                    </span>
                                                </div>
                                            )}

                                            {item.summary && (
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0 0 12px 0' }}>
                                                    {item.summary}
                                                </p>
                                            )}

                                            {/* Capstone Project Preview */}
                                            {item.capstoneProject && (
                                                <div style={{
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    background: 'var(--surface-color)',
                                                    border: '1px solid var(--card-border)',
                                                    marginBottom: '12px',
                                                    fontSize: '0.84rem'
                                                }}>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                                        Capstone: {item.capstoneProject.title}
                                                    </div>
                                                    <div style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                                        {item.capstoneProject.description}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Cert List Preview */}
                                            {item.certList && item.certList.length > 0 && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                                                    {item.certList.map((c, cIdx) => (
                                                        <div key={cIdx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <FiAward size={12} style={{ color: 'var(--primary-color)' }} />
                                                            <span><strong>{c.title}</strong> — {c.issuer}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => setActiveModalItem(item)}
                                                className="btn-secondary"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '6px 14px',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    color: 'var(--primary-color)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiExternalLink size={12} />
                                                <span>View Full Details</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* ==========================================================================
                    TAB 4: FULL CHRONOLOGICAL TIMELINE (Spine View)
                    ========================================================================== */}
                {activeTab === 'timeline' && (
                    <motion.div
                        key="tab-timeline"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={SPRING_TRANSITION}
                    >
                        {/* Era Selector Tabs */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '16px',
                            justifyContent: 'center'
                        }}>
                            {lineageEras.map(era => {
                                const isSelected = timelineEra === era.id;
                                return (
                                    <button
                                        key={era.id}
                                        onClick={() => setTimelineEra(era.id)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '9999px',
                                            fontSize: '0.84rem',
                                            fontWeight: isSelected ? 700 : 500,
                                            border: isSelected ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
                                            background: isSelected ? 'var(--primary-color)' : 'var(--surface-card)',
                                            color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {era.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Filters & Search Row */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '12px',
                            marginBottom: '28px'
                        }}>
                            {/* Category Type Pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                <button
                                    onClick={() => setTimelineType('all')}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '0.8rem',
                                        fontWeight: timelineType === 'all' ? 700 : 500,
                                        background: timelineType === 'all' ? 'var(--badge-bg)' : 'transparent',
                                        border: timelineType === 'all' ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
                                        color: timelineType === 'all' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    All Items ({lineageItems.length})
                                </button>
                                {Object.entries(TYPE_CONFIG).map(([typeKey, cfg]) => {
                                    const count = lineageItems.filter(i => i.type === typeKey).length;
                                    const isSelected = timelineType === typeKey;
                                    const Icon = cfg.icon;
                                    return (
                                        <button
                                            key={typeKey}
                                            onClick={() => setTimelineType(typeKey)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '9999px',
                                                fontSize: '0.8rem',
                                                fontWeight: isSelected ? 700 : 500,
                                                background: isSelected ? cfg.bg : 'transparent',
                                                border: isSelected ? `1px solid ${cfg.color}` : '1px solid var(--card-border)',
                                                color: isSelected ? cfg.color : 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <Icon size={12} />
                                            {cfg.label} ({count})
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Search Field */}
                            <div style={{ position: 'relative', minWidth: '220px', maxWidth: '340px', flex: '1' }}>
                                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={14} />
                                <input
                                    type="text"
                                    placeholder="Search timeline..."
                                    value={timelineSearch}
                                    onChange={(e) => setTimelineSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px 8px 34px',
                                        borderRadius: '9999px',
                                        border: '1px solid var(--card-border)',
                                        background: 'var(--surface-card)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.84rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Timeline Spine Container */}
                        <div style={{ position: 'relative', maxWidth: '960px', margin: '0 auto' }}>
                            {/* Glowing vertical line */}
                            <div style={{
                                position: 'absolute',
                                left: '18px',
                                top: '10px',
                                bottom: '10px',
                                width: '2px',
                                background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6, #10b981, #64748b)',
                                borderRadius: '2px',
                                opacity: 0.4
                            }} />

                            {fullTimelineItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                                    <p style={{ fontSize: '1.05rem', margin: 0 }}>No lineage records match your filter criteria.</p>
                                    <button
                                        onClick={() => { setTimelineType('all'); setTimelineEra('all'); setTimelineSearch(''); }}
                                        style={{
                                            marginTop: '12px',
                                            padding: '6px 14px',
                                            background: 'var(--primary-color)',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '9999px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            ) : (
                                fullTimelineItems.map((item, idx) => {
                                    const typeCfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.milestone;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            className="timeline-item"
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.2) }}
                                            viewport={{ once: true, margin: "-40px" }}
                                            style={{
                                                position: 'relative',
                                                paddingLeft: '52px',
                                                marginBottom: '24px'
                                            }}
                                        >
                                            {/* Node Dot */}
                                            <div style={{
                                                position: 'absolute',
                                                left: '9px',
                                                top: '22px',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: 'var(--surface-card)',
                                                border: `3px solid ${item.badgeColor || typeCfg.color}`,
                                                zIndex: 2,
                                                boxShadow: `0 0 10px ${item.badgeColor || typeCfg.color}40`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }} />

                                            <div
                                                className="glass-card"
                                                onClick={() => setActiveModalItem(item)}
                                                style={{
                                                    padding: '20px 22px',
                                                    borderRadius: 'var(--radius-card)',
                                                    background: 'var(--surface-card)',
                                                    border: '1px solid var(--card-border)',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = `${item.badgeColor || typeCfg.color}60`;
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--card-border)';
                                                    e.currentTarget.style.transform = 'none';
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                                            <span style={{
                                                                fontSize: '0.74rem',
                                                                padding: '3px 9px',
                                                                borderRadius: '6px',
                                                                background: typeCfg.bg,
                                                                border: `1px solid ${typeCfg.border}`,
                                                                color: typeCfg.color,
                                                                fontWeight: 600
                                                            }}>
                                                                {typeCfg.label}
                                                            </span>

                                                            {item.badge && (
                                                                <span style={{
                                                                    fontSize: '0.74rem',
                                                                    padding: '3px 9px',
                                                                    borderRadius: '6px',
                                                                    background: `${item.badgeColor || typeCfg.color}15`,
                                                                    border: `1px solid ${item.badgeColor || typeCfg.color}40`,
                                                                    color: item.badgeColor || typeCfg.color,
                                                                    fontWeight: 600
                                                                }}>
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                                                            {item.title}
                                                        </h4>

                                                        <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                                                            <strong style={{ color: 'var(--primary-color)' }}>{item.organization}</strong>
                                                            {item.clientAccount && <span> • {item.clientAccount}</span>}
                                                            {item.location && <span> • {item.location}</span>}
                                                        </div>
                                                    </div>

                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '4px 12px',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.76rem',
                                                        fontWeight: 600,
                                                        background: 'var(--badge-bg)',
                                                        border: '1px solid var(--badge-border)',
                                                        color: 'var(--text-primary)'
                                                    }}>
                                                        <FiCalendar size={12} style={{ color: 'var(--primary-color)' }} />
                                                        {item.date}
                                                    </span>
                                                </div>

                                                {item.summary && (
                                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: '10px 0 0 0' }}>
                                                        {item.summary}
                                                    </p>
                                                )}

                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        View Details <FiExternalLink size={12} />
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Modal Detail Viewer */}
            <LineageDetailModal
                item={activeModalItem}
                onClose={() => setActiveModalItem(null)}
            />
        </section>
    );
};

export default CareerLineage;