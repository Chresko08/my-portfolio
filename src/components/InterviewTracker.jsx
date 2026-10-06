import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiCalendar, FiClock, FiMonitor, FiMessageSquare, FiTag, 
    FiFileText, FiSearch, FiChevronDown, FiChevronUp, 
    FiCheckCircle, FiAlertCircle, FiXCircle, FiSkipForward,
    FiLock, FiCopy, FiCheck, FiBriefcase, FiDollarSign, FiMapPin
} from 'react-icons/fi';
import { interviewRecords, resignationDetails } from '../data/interviewTrackerData';

const statusConfig = {
    selected: {
        label: 'Selected • Offer Track',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.35)',
        icon: <FiCheckCircle size={15} />
    },
    pending: {
        label: 'Evaluation Pending',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.35)',
        icon: <FiAlertCircle size={15} />
    },
    rejected: {
        label: 'Not Selected / Closed',
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.35)',
        icon: <FiXCircle size={15} />
    },
    'not-attempted': {
        label: 'Not Attempted / Expired',
        color: '#94a3b8',
        bg: 'rgba(148, 163, 184, 0.12)',
        border: 'rgba(148, 163, 184, 0.35)',
        icon: <FiSkipForward size={15} />
    }
};

const InterviewTracker = ({ viewMode, onLockDevice }) => {
    if (viewMode !== 'personal') return null;

    const [expandedCard, setExpandedCard] = useState(interviewRecords[0]?.id || null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Filtered records
    const filteredRecords = useMemo(() => {
        return interviewRecords.filter(record => {
            const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
            const q = searchQuery.toLowerCase().trim();
            if (!q) return matchesStatus;

            const matchesSearch = 
                record.company.toLowerCase().includes(q) ||
                record.role.toLowerCase().includes(q) ||
                (record.clientAccount && record.clientAccount.toLowerCase().includes(q)) ||
                record.keyTopics.some(t => t.toLowerCase().includes(q)) ||
                record.interviewQuestions.some(iq => 
                    iq.q.toLowerCase().includes(q) || 
                    (iq.myAnswer && iq.myAnswer.toLowerCase().includes(q))
                );

            return matchesStatus && matchesSearch;
        });
    }, [statusFilter, searchQuery]);

    // Stats
    const stats = useMemo(() => {
        return {
            total: interviewRecords.length,
            selected: interviewRecords.filter(r => r.status === 'selected').length,
            pending: interviewRecords.filter(r => r.status === 'pending').length,
            rejected: interviewRecords.filter(r => r.status === 'rejected').length,
            skipped: interviewRecords.filter(r => r.status === 'not-attempted').length,
        };
    }, []);

    const handleLock = () => {
        if (window.confirm("Lock this device? You'll need to enter your password again next time.")) {
            if (onLockDevice) {
                onLockDevice();
            } else {
                localStorage.removeItem('portfolioAuthenticated');
                window.location.reload();
            }
        }
    };

    return (
        <section id="interview-tracker" className="section" style={{ paddingTop: '80px', paddingBottom: '70px' }}>
            <div className="container">
                {/* Header Title Wrap */}
                <div className="section-title-wrap" style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', borderRadius: '9999px', fontSize: '0.82rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '12px' }}>
                        <span>🔒</span> Private Dashboard • For Me
                    </div>
                    <h2 className="section-heading">
                        Interview <span className="gradient-text">Tracker</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1.02rem', maxWidth: '750px', margin: '8px auto 0', lineHeight: '1.6' }}>
                        Comprehensive audit of all interviews, evaluation funnels, live questions, and outcomes since resigning on <strong style={{ color: 'var(--text-primary)' }}>{resignationDetails.resignationDate}</strong>.
                    </p>
                </div>

                {/* Resignation & Notice Period Operational Banner */}
                <div className="glass-card" style={{
                    padding: '24px 28px',
                    marginBottom: '32px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-color)' }}>
                                Career Transition Parameters
                            </span>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                                Notice Period & Compensation Baseline
                            </h3>
                        </div>

                        {/* Lock Button */}
                        <button
                            onClick={handleLock}
                            title="Lock private view on this device"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '6px 14px', borderRadius: '8px',
                                background: 'var(--surface-color)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-muted)', fontSize: '0.8rem',
                                fontWeight: 500, cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                        >
                            <FiLock size={13} /> Lock Device
                        </button>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                        gap: '16px'
                    }}>
                        <div style={{ padding: '12px 16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resignation Date</div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                                {resignationDetails.resignationDate}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', marginTop: '2px' }}>
                                LWD: {resignationDetails.lastWorkingDay}
                            </div>
                        </div>

                        <div style={{ padding: '12px 16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Notice Status</div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '2px' }}>
                                {resignationDetails.noticePeriod}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Immediate / Serving
                            </div>
                        </div>

                        <div style={{ padding: '12px 16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Current Baseline</div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                                17 LPA Fixed
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Target: {resignationDetails.expectedCtc}
                            </div>
                        </div>

                        <div style={{ padding: '12px 16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pipeline Lead</div>
                            <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                                Tech Mahindra (21 LPA)
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '2px' }}>
                                Nagarro Result Pending
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Summary Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '12px',
                    marginBottom: '28px'
                }}>
                    {[
                        { label: 'Total Tracked', count: stats.total, color: 'var(--primary-color)', filter: 'all' },
                        { label: 'Selected / Offer', count: stats.selected, color: '#10b981', filter: 'selected' },
                        { label: 'Under Review', count: stats.pending, color: '#f59e0b', filter: 'pending' },
                        { label: 'Not Selected', count: stats.rejected, color: '#ef4444', filter: 'rejected' },
                        { label: 'Lapsed / Skipped', count: stats.skipped, color: '#94a3b8', filter: 'not-attempted' },
                    ].map(kpi => {
                        const isCurrent = statusFilter === kpi.filter;
                        return (
                            <button
                                key={kpi.label}
                                onClick={() => setStatusFilter(kpi.filter)}
                                style={{
                                    textAlign: 'center',
                                    padding: '16px 12px',
                                    background: isCurrent ? 'var(--badge-bg)' : 'var(--surface-color)',
                                    border: `1px solid ${isCurrent ? kpi.color : 'var(--card-border)'}`,
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s ease'
                                }}
                            >
                                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: kpi.color, lineHeight: 1 }}>
                                    {kpi.count}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {kpi.label}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Controls: Search and Filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '26px' }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '480px' }}>
                        <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                        <input
                            type="text"
                            placeholder="Search by company, role, topic (PySpark, BigQuery), or question..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 44px',
                                borderRadius: '12px',
                                border: '1px solid var(--card-border)',
                                background: 'var(--surface-color)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    {/* Filter Pills */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'selected', label: 'Selected (1)' },
                            { id: 'pending', label: 'Pending (1)' },
                            { id: 'rejected', label: 'Rejected (4)' },
                            { id: 'not-attempted', label: 'Skipped (1)' }
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setStatusFilter(f.id)}
                                style={{
                                    padding: '7px 16px',
                                    borderRadius: '9999px',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    background: statusFilter === f.id ? 'var(--primary-color)' : 'var(--surface-color)',
                                    color: statusFilter === f.id ? '#ffffff' : 'var(--text-secondary)',
                                    border: '1px solid',
                                    borderColor: statusFilter === f.id ? 'var(--primary-color)' : 'var(--card-border)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Company Interview Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {filteredRecords.length > 0 ? filteredRecords.map((record) => {
                        const isExpanded = expandedCard === record.id;
                        const config = statusConfig[record.status] || statusConfig.pending;

                        return (
                            <motion.div
                                key={record.id}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div
                                    className="glass-card"
                                    style={{
                                        overflow: 'hidden',
                                        borderLeft: `4px solid ${config.color}`,
                                        border: isExpanded ? `1px solid ${config.border}` : '1px solid var(--card-border)',
                                        borderLeftWidth: '4px',
                                        borderLeftColor: config.color,
                                        transition: 'border-color 0.25s'
                                    }}
                                >
                                    {/* Card Header Accordion Trigger */}
                                    <button
                                        onClick={() => setExpandedCard(isExpanded ? null : record.id)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '22px 24px',
                                            background: isExpanded ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            color: 'var(--text-primary)',
                                            gap: '16px'
                                        }}
                                    >
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            {/* Top badges line */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                                                    {record.company}
                                                </h3>

                                                {/* Status Badge */}
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.76rem',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    padding: '3px 11px',
                                                    borderRadius: '9999px',
                                                    background: config.bg,
                                                    color: config.color,
                                                    border: `1px solid ${config.border}`,
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {config.icon} {record.statusLabel}
                                                </span>

                                                {/* CTC Tag */}
                                                {record.ctcOffered && (
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 700,
                                                        padding: '3px 10px',
                                                        borderRadius: '9999px',
                                                        background: 'var(--badge-bg)',
                                                        color: 'var(--primary-color)',
                                                        border: '1px solid var(--badge-border)',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        💰 {record.ctcOffered}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Subtitle & Metadata */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {record.role}
                                                </span>
                                                {record.clientAccount && (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', opacity: 0.9 }}>
                                                        <FiBriefcase size={13} /> {record.clientAccount}
                                                    </span>
                                                )}
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', opacity: 0.85 }}>
                                                    <FiCalendar size={13} /> {record.date}
                                                </span>
                                                {record.location && (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', opacity: 0.85 }}>
                                                        <FiMapPin size={13} /> {record.location}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Key Topic Badges (Collapsed preview) */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                                                {record.keyTopics.slice(0, 4).map((t, i) => (
                                                    <span key={i} style={{
                                                        fontSize: '0.75rem',
                                                        padding: '2px 8px',
                                                        borderRadius: '6px',
                                                        background: 'var(--surface-color)',
                                                        border: '1px solid var(--card-border)',
                                                        color: 'var(--text-muted)'
                                                    }}>
                                                        {t}
                                                    </span>
                                                ))}
                                                {record.keyTopics.length > 4 && (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                                                        +{record.keyTopics.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ flexShrink: 0, color: 'var(--text-secondary)', padding: '4px' }}>
                                            {isExpanded ? <FiChevronUp size={22} /> : <FiChevronDown size={22} />}
                                        </div>
                                    </button>

                                    {/* Expanded Body */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <div style={{
                                                    padding: '8px 24px 28px',
                                                    borderTop: '1px solid var(--card-border)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '24px'
                                                }}>
                                                    {/* Section 1: Selection & Interview Audit Trail */}
                                                    {record.rounds && record.rounds.length > 0 && (
                                                        <div>
                                                            <h4 style={{
                                                                fontSize: '0.82rem',
                                                                fontWeight: 700,
                                                                color: 'var(--primary-color)',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '1px',
                                                                marginBottom: '12px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px'
                                                            }}>
                                                                <FiClock size={14} /> Evaluation Stages & Timeline
                                                            </h4>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                {record.rounds.map((round, i) => {
                                                                    const roundStatusColor = 
                                                                        round.status === 'cleared' ? '#10b981' :
                                                                        round.status === 'rejected' ? '#ef4444' :
                                                                        round.status === 'pending' ? '#f59e0b' : 'var(--text-secondary)';

                                                                    return (
                                                                        <div key={i} style={{
                                                                            padding: '12px 16px',
                                                                            background: 'var(--surface-color)',
                                                                            borderRadius: '12px',
                                                                            border: '1px solid var(--card-border)',
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            gap: '6px'
                                                                        }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                    <div style={{
                                                                                        width: '9px',
                                                                                        height: '9px',
                                                                                        borderRadius: '50%',
                                                                                        background: roundStatusColor,
                                                                                        boxShadow: `0 0 8px ${roundStatusColor}`
                                                                                    }} />
                                                                                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                                                                        {round.name}
                                                                                    </span>
                                                                                </div>
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                                                    {round.duration && <span>⏱️ {round.duration}</span>}
                                                                                    <span>🖥️ {round.platform}</span>
                                                                                    <span style={{
                                                                                        fontWeight: 700,
                                                                                        textTransform: 'uppercase',
                                                                                        color: roundStatusColor,
                                                                                        fontSize: '0.74rem',
                                                                                        background: `color-mix(in srgb, ${roundStatusColor} 12%, transparent)`,
                                                                                        padding: '2px 8px',
                                                                                        borderRadius: '4px'
                                                                                    }}>
                                                                                        {round.status}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                                                📅 {round.date}
                                                                            </div>
                                                                            {round.notes && (
                                                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '2px' }}>
                                                                                    {round.notes}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Section 2: Real Interview Questions Asked */}
                                                    {record.interviewQuestions && record.interviewQuestions.length > 0 && (
                                                        <div>
                                                            <h4 style={{
                                                                fontSize: '0.82rem',
                                                                fontWeight: 700,
                                                                color: 'var(--accent-cyan)',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '1px',
                                                                marginBottom: '12px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px'
                                                            }}>
                                                                <FiMessageSquare size={14} /> Questions Evaluated In This Round
                                                            </h4>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                                {record.interviewQuestions.map((item, qIdx) => (
                                                                    <div key={qIdx} style={{
                                                                        padding: '16px 18px',
                                                                        background: 'var(--surface-color)',
                                                                        borderRadius: '12px',
                                                                        border: '1px solid var(--card-border)',
                                                                        position: 'relative'
                                                                    }}>
                                                                        {item.topic && (
                                                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--accent-purple)', marginBottom: '6px' }}>
                                                                                {item.topic}
                                                                            </div>
                                                                        )}
                                                                        <div style={{
                                                                            fontSize: '0.92rem',
                                                                            fontWeight: 600,
                                                                            color: 'var(--text-primary)',
                                                                            lineHeight: 1.5,
                                                                            whiteSpace: 'pre-line'
                                                                        }}>
                                                                            {item.q}
                                                                        </div>

                                                                        {item.myAnswer && (
                                                                            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                                        ✓ Answer Given / Solution:
                                                                                    </span>
                                                                                    <button
                                                                                        onClick={() => handleCopy(item.myAnswer, `${record.id}-${qIdx}`)}
                                                                                        style={{
                                                                                            background: 'transparent',
                                                                                            border: 'none',
                                                                                            color: copiedIndex === `${record.id}-${qIdx}` ? '#10b981' : 'var(--text-muted)',
                                                                                            cursor: 'pointer',
                                                                                            fontSize: '0.75rem',
                                                                                            display: 'inline-flex',
                                                                                            alignItems: 'center',
                                                                                            gap: '4px'
                                                                                        }}
                                                                                    >
                                                                                        {copiedIndex === `${record.id}-${qIdx}` ? (
                                                                                            <><FiCheck size={12} /> Copied</>
                                                                                        ) : (
                                                                                            <><FiCopy size={12} /> Copy</>
                                                                                        )}
                                                                                    </button>
                                                                                </div>
                                                                                <pre style={{
                                                                                    background: 'rgba(5, 8, 18, 0.7)',
                                                                                    padding: '12px 14px',
                                                                                    borderRadius: '8px',
                                                                                    border: '1px solid var(--card-border)',
                                                                                    color: '#f8fafc',
                                                                                    fontSize: '0.86rem',
                                                                                    lineHeight: 1.6,
                                                                                    overflowX: 'auto',
                                                                                    fontFamily: 'monospace',
                                                                                    margin: 0,
                                                                                    whiteSpace: 'pre-wrap'
                                                                                }}>
                                                                                    {item.myAnswer}
                                                                                </pre>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Section 3: Key Technical Scope Topics */}
                                                    {record.keyTopics && record.keyTopics.length > 0 && (
                                                        <div>
                                                            <h4 style={{
                                                                fontSize: '0.82rem',
                                                                fontWeight: 700,
                                                                color: 'var(--text-muted)',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '1px',
                                                                marginBottom: '10px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px'
                                                            }}>
                                                                <FiTag size={14} /> Evaluation Domain Topics
                                                            </h4>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                {record.keyTopics.map((topic, i) => (
                                                                    <span key={i} style={{
                                                                        padding: '6px 14px',
                                                                        background: 'var(--badge-bg)',
                                                                        border: '1px solid var(--badge-border)',
                                                                        borderRadius: '8px',
                                                                        fontSize: '0.82rem',
                                                                        fontWeight: 600,
                                                                        color: 'var(--primary-color)'
                                                                    }}>
                                                                        {topic}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Section 4: Post-Mortem & Key Strategic Notes */}
                                                    {record.notes && (
                                                        <div>
                                                            <h4 style={{
                                                                fontSize: '0.82rem',
                                                                fontWeight: 700,
                                                                color: 'var(--text-muted)',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '1px',
                                                                marginBottom: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px'
                                                            }}>
                                                                <FiFileText size={14} /> Key Strategic Notes & Post-Mortem
                                                            </h4>
                                                            <div style={{
                                                                padding: '14px 18px',
                                                                background: 'var(--surface-color)',
                                                                borderRadius: '12px',
                                                                border: '1px solid var(--card-border)',
                                                                color: 'var(--text-secondary)',
                                                                fontSize: '0.9rem',
                                                                lineHeight: 1.65
                                                            }}>
                                                                {record.notes}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                            <FiSearch size={42} style={{ marginBottom: '16px', opacity: 0.4 }} />
                            <h3>No interview records match your filter</h3>
                            <p style={{ fontSize: '0.9rem' }}>Try clearing the search term or switching status filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default InterviewTracker;
