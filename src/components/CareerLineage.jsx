import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBriefcase, FiAward, FiBookOpen, FiCalendar, FiMapPin,
    FiChevronDown, FiChevronUp, FiCheckCircle, FiXCircle,
    FiAlertCircle, FiSearch, FiLock, FiFlag, FiExternalLink,
    FiCode, FiDatabase, FiCheck, FiCopy, FiChevronsDown, FiChevronsUp
} from 'react-icons/fi';
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

const CareerLineage = ({ data, onLockDevice, onUnlockRequest }) => {
    const careerParameters = data?.careerParameters || {};
    const lineageEras = data?.lineageEras || [
        { id: 'all', label: 'Complete Lineage (2004 – 2026)', range: '2004 – 2026' }
    ];
    const lineageItems = data?.lineageItems || [];
    const [selectedType, setSelectedType] = useState('all');
    const [selectedEra, setSelectedEra] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIds, setExpandedIds] = useState({});
    const [expandedProjectDeepDives, setExpandedProjectDeepDives] = useState({});
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleProjectDeepDive = (id) => {
        setExpandedProjectDeepDives(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Filtered items
    const filteredItems = useMemo(() => {
        return lineageItems.filter(item => {
            const matchesType = selectedType === 'all' || item.type === selectedType;
            const matchesEra = selectedEra === 'all' || item.era === selectedEra;
            
            const q = searchQuery.toLowerCase().trim();
            if (!q) return matchesType && matchesEra;

            const matchesSearch =
                item.title.toLowerCase().includes(q) ||
                item.organization.toLowerCase().includes(q) ||
                (item.badge && item.badge.toLowerCase().includes(q)) ||
                (item.summary && item.summary.toLowerCase().includes(q)) ||
                (item.location && item.location.toLowerCase().includes(q)) ||
                (item.keyTopics && item.keyTopics.some(t => t.toLowerCase().includes(q))) ||
                (item.certList && item.certList.some(c => c.title.toLowerCase().includes(q))) ||
                (item.highlights && item.highlights.some(h => h.toLowerCase().includes(q))) ||
                (item.academicHighlights && item.academicHighlights.some(ah => ah.toLowerCase().includes(q))) ||
                (item.project && (
                    item.project.title.toLowerCase().includes(q) ||
                    (item.project.impact && item.project.impact.toLowerCase().includes(q)) ||
                    (item.project.tags && item.project.tags.some(t => t.toLowerCase().includes(q))) ||
                    (item.project.catalyst && item.project.catalyst.toLowerCase().includes(q)) ||
                    (item.project.responsibilities && item.project.responsibilities.some(r =>
                        r.title.toLowerCase().includes(q) || r.detail.toLowerCase().includes(q)
                    ))
                )) ||
                (item.capstoneProject && (
                    item.capstoneProject.title.toLowerCase().includes(q) ||
                    item.capstoneProject.description.toLowerCase().includes(q)
                )) ||
                (item.interviewQuestions && item.interviewQuestions.some(iq => 
                    iq.q.toLowerCase().includes(q) || (iq.myAnswer && iq.myAnswer.toLowerCase().includes(q))
                ));

            return matchesType && matchesEra && matchesSearch;
        });
    }, [selectedType, selectedEra, searchQuery]);

    const allExpanded = useMemo(() => {
        if (filteredItems.length === 0) return false;
        return filteredItems.every(item => expandedIds[item.id]);
    }, [filteredItems, expandedIds]);

    const handleToggleAll = () => {
        if (allExpanded) {
            setExpandedIds({});
            setExpandedProjectDeepDives({});
        } else {
            const next = {};
            const nextDeep = {};
            filteredItems.forEach(item => {
                next[item.id] = true;
                if (item.project) nextDeep[item.id] = true;
            });
            setExpandedIds(next);
            setExpandedProjectDeepDives(nextDeep);
        }
    };

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

    if (!data || !lineageItems || lineageItems.length === 0) {
        return (
            <section id="career-lineage" className="section" style={{ paddingTop: '100px', paddingBottom: '80px', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="glass-card" style={{ padding: '40px 24px', borderRadius: '16px' }}>
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
                                style={{ padding: '10px 24px', fontSize: '0.92rem', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Enter Passcode to Decrypt
                            </button>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="career-lineage" className="section" style={{ paddingTop: '80px', paddingBottom: '70px' }}>
            <div className="container">
                {/* Header Title Wrap */}
                <div className="section-title-wrap" style={{ marginBottom: '32px', textAlign: 'center' }}>
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
                        fontWeight: 600,
                        marginBottom: '12px'
                    }}>
                        <span>🔒</span> Private View • For Me
                    </div>
                    <h2 className="section-heading">
                        Career & Education <span className="gradient-text">Lineage</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1.02rem', maxWidth: '820px', margin: '8px auto 0', lineHeight: '1.6' }}>
                        Chronological progression spanning 22 years: from schooling inception in <strong style={{ color: 'var(--text-primary)' }}>2004</strong> through university (AKTU First Division), enterprise engineering at Infosys, TCS, and EY, to active <strong style={{ color: 'var(--text-primary)' }}>2026</strong> market transition pipelines.
                    </p>
                </div>

                {/* Notice Period & Transition Parameter Banner */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '28px',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-color)' }}>
                                Operational Parameters & Verified HR Audits
                            </span>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                                Notice Period, Compensation Baseline & Separation Trail
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
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '14px'
                    }}>
                        <div style={{ padding: '12px 16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resignation Status</div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                                {careerParameters.resignationDate}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', marginTop: '2px' }}>
                                Last Working Day: {careerParameters.lastWorkingDay}
                            </div>
                        </div>

                        <div style={{ padding: '12px 16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Notice Period</div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '2px' }}>
                                {careerParameters.noticePeriod}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Serving (Immediate Release Negotiable)
                            </div>
                        </div>

                        <div style={{ padding: '12px 16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Compensation Baseline</div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                                {careerParameters.currentCtc || 'Confidential Baseline'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Target Band: {careerParameters.expectedCtc}
                            </div>
                        </div>

                        <div style={{ padding: '12px 16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Target Pipeline</div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary-color)', marginTop: '2px' }}>
                                {careerParameters.upcomingPipeline || 'Confidential Pipeline'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                                Target: {careerParameters.expectedCtc}
                            </div>
                        </div>
                    </div>

                    {/* Verified Institutional Identifiers Ribbon */}
                    <div style={{
                        marginTop: '16px',
                        paddingTop: '14px',
                        borderTop: '1px solid var(--card-border)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)'
                    }}>
                        {careerParameters.eyAppointment && (
                            <span><strong style={{ color: 'var(--text-secondary)' }}>EY {careerParameters.eyAppointment.designation}:</strong> Joined {careerParameters.eyAppointment.joinedDate} ({careerParameters.eyAppointment.annualFixedCompensation})</span>
                        )}
                        {careerParameters.tcsSeparation && (
                            <>
                                <span>•</span>
                                <span><strong style={{ color: 'var(--text-secondary)' }}>TCS Employee ID:</strong> {careerParameters.tcsSeparation.employeeId} (Relieved {careerParameters.tcsSeparation.relievedDate})</span>
                            </>
                        )}
                        {careerParameters.infosysIdentifiers && (
                            <>
                                <span>•</span>
                                <span><strong style={{ color: 'var(--text-secondary)' }}>Infosys Employee ID:</strong> {careerParameters.infosysIdentifiers.employeeId} (Big Data Cluster: {careerParameters.infosysIdentifiers.trainingCluster})</span>
                            </>
                        )}
                        {careerParameters.aktuAcademics && (
                            <>
                                <span>•</span>
                                <span><strong style={{ color: 'var(--text-secondary)' }}>AKTU Roll:</strong> {careerParameters.aktuAcademics.rollNo} ({careerParameters.aktuAcademics.division} • Sem 8 SGPA: {careerParameters.aktuAcademics.sem8Sgpa})</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Era Selector Tabs */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '16px'
                }}>
                    {lineageEras.map(era => {
                        const isSelected = selectedEra === era.id;
                        return (
                            <button
                                key={era.id}
                                onClick={() => setSelectedEra(era.id)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    fontSize: '0.84rem',
                                    fontWeight: isSelected ? 700 : 500,
                                    border: isSelected ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
                                    background: isSelected ? 'var(--primary-color)' : 'var(--card-bg)',
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

                {/* Filters, Search & Global Expand Controls */}
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
                            onClick={() => setSelectedType('all')}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: selectedType === 'all' ? 700 : 500,
                                background: selectedType === 'all' ? 'var(--badge-bg)' : 'transparent',
                                border: selectedType === 'all' ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
                                color: selectedType === 'all' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}
                        >
                            All Items ({lineageItems.length})
                        </button>
                        {Object.entries(TYPE_CONFIG).map(([typeKey, cfg]) => {
                            const count = lineageItems.filter(i => i.type === typeKey).length;
                            const isSelected = selectedType === typeKey;
                            const Icon = cfg.icon;
                            return (
                                <button
                                    key={typeKey}
                                    onClick={() => setSelectedType(typeKey)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
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

                    {/* Search & Expand All */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: '1', justifyContent: 'flex-end', minWidth: '280px' }}>
                        <div style={{ position: 'relative', minWidth: '220px', maxWidth: '340px', flex: '1' }}>
                            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={14} />
                            <input
                                type="text"
                                placeholder="Search roles, deep dives, Q&As, topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '7px 12px 7px 34px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--card-border)',
                                    background: 'var(--card-bg)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.84rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <button
                            onClick={handleToggleAll}
                            style={{
                                padding: '7px 14px',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'var(--card-bg)',
                                color: 'var(--text-primary)',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            {allExpanded ? <FiChevronsUp size={14} /> : <FiChevronsDown size={14} />}
                            {allExpanded ? 'Collapse All' : 'Expand All & Deep Dives'}
                        </button>
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

                    {filteredItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                            <p style={{ fontSize: '1.1rem', margin: 0 }}>No lineage records match your filter criteria.</p>
                            <button
                                onClick={() => { setSelectedType('all'); setSelectedEra('all'); setSearchQuery(''); }}
                                style={{
                                    marginTop: '12px',
                                    padding: '6px 14px',
                                    background: 'var(--primary-color)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        filteredItems.map((item, idx) => {
                            const typeCfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.milestone;
                            const TypeIcon = typeCfg.icon;
                            const isExpanded = !!expandedIds[item.id];

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.2) }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    style={{
                                        position: 'relative',
                                        paddingLeft: '52px',
                                        marginBottom: '32px'
                                    }}
                                >
                                    {/* Timeline Node Dot */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '9px',
                                        top: '22px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: 'var(--card-bg)',
                                        border: `3px solid ${item.badgeColor || typeCfg.color}`,
                                        zIndex: 2,
                                        boxShadow: `0 0 10px ${item.badgeColor || typeCfg.color}40`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} />

                                    {/* Lineage Card Container */}
                                    <div
                                        className="glass-card"
                                        style={{
                                            padding: '22px',
                                            borderRadius: '14px',
                                            background: 'var(--card-bg)',
                                            border: isExpanded ? `1px solid ${typeCfg.color}60` : '1px solid var(--card-border)',
                                            transition: 'border-color 0.2s, box-shadow 0.2s'
                                        }}
                                    >
                                        {/* Card Header Row */}
                                        <div
                                            onClick={() => toggleExpand(item.id)}
                                            style={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                flexWrap: 'wrap',
                                                gap: '12px'
                                            }}
                                        >
                                            <div style={{ flex: '1', minWidth: '260px' }}>
                                                {/* Top Subtitle / Badges */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        fontSize: '0.74rem',
                                                        padding: '3px 9px',
                                                        borderRadius: '6px',
                                                        background: typeCfg.bg,
                                                        border: `1px solid ${typeCfg.border}`,
                                                        color: typeCfg.color,
                                                        fontWeight: 600
                                                    }}>
                                                        <TypeIcon size={12} />
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

                                                    {item.ctcOffered && (
                                                        <span style={{
                                                            fontSize: '0.74rem',
                                                            padding: '3px 9px',
                                                            borderRadius: '6px',
                                                            background: 'rgba(16, 185, 129, 0.15)',
                                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                                            color: '#10b981',
                                                            fontWeight: 600
                                                        }}>
                                                            Offered: {item.ctcOffered}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Main Title & Organization */}
                                                <h4 style={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: 700,
                                                    color: 'var(--text-primary)',
                                                    margin: '0 0 4px 0',
                                                    lineHeight: '1.3'
                                                }}>
                                                    {item.title}
                                                </h4>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    flexWrap: 'wrap',
                                                    color: 'var(--text-secondary)',
                                                    fontSize: '0.88rem'
                                                }}>
                                                    <strong style={{ color: 'var(--primary-color)' }}>{item.organization}</strong>
                                                    {item.clientAccount && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{item.clientAccount}</span>
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
                                                    {item.affiliation && (
                                                        <>
                                                            <span>•</span>
                                                            <span style={{ color: 'var(--text-muted)' }}>{item.affiliation}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Date Pill & Expand Chevron */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '4px 12px',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 600,
                                                    background: 'var(--badge-bg)',
                                                    border: '1px solid var(--badge-border)',
                                                    color: 'var(--text-primary)'
                                                }}>
                                                    <FiCalendar size={12} style={{ color: 'var(--primary-color)' }} />
                                                    {item.date}
                                                </span>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--text-secondary)',
                                                        cursor: 'pointer',
                                                        padding: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Brief Summary */}
                                        {item.summary && (
                                            <p style={{
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.92rem',
                                                lineHeight: '1.6',
                                                margin: '12px 0 0 0'
                                            }}>
                                                {item.summary}
                                            </p>
                                        )}

                                        {/* Metrics Badges Row */}
                                        {item.metrics && item.metrics.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                                                {item.metrics.map((m, mIdx) => (
                                                    <span key={mIdx} style={{
                                                        fontSize: '0.74rem',
                                                        padding: '3px 8px',
                                                        borderRadius: '6px',
                                                        background: 'var(--surface-color)',
                                                        border: '1px solid var(--card-border)',
                                                        color: 'var(--text-secondary)',
                                                        fontWeight: 500
                                                    }}>
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Expandable Detailed Body */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    style={{
                                                        marginTop: '16px',
                                                        paddingTop: '16px',
                                                        borderTop: '1px solid var(--card-border)'
                                                    }}
                                                >
                                                    {/* Work Experience Highlights */}
                                                    {item.highlights && item.highlights.length > 0 && (
                                                        <div style={{ marginBottom: '16px' }}>
                                                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                Key Engineering Deliverables:
                                                            </div>
                                                            <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                                                {item.highlights.map((h, hIdx) => (
                                                                    <li key={hIdx} style={{ marginBottom: '6px' }}>{h}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* ========================================================= */}
                                                    {/* PROJECT DEEP DIVE SECTION (Comprehensive Master Reference) */}
                                                    {/* ========================================================= */}
                                                    {item.project && (
                                                        <div style={{
                                                            marginTop: '16px',
                                                            marginBottom: '18px',
                                                            background: 'var(--surface-color)',
                                                            border: '1px solid var(--card-border)',
                                                            borderRadius: '12px',
                                                            overflow: 'hidden',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                                        }}>
                                                            <div style={{ padding: '16px 18px' }}>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'flex-start',
                                                                    flexWrap: 'wrap',
                                                                    gap: '10px',
                                                                    marginBottom: '10px'
                                                                }}>
                                                                    <div>
                                                                        <div style={{
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            gap: '6px',
                                                                            fontSize: '0.72rem',
                                                                            fontWeight: 700,
                                                                            textTransform: 'uppercase',
                                                                            letterSpacing: '0.8px',
                                                                            color: 'var(--primary-color)',
                                                                            marginBottom: '4px'
                                                                        }}>
                                                                            <FiDatabase size={13} />
                                                                            Master Architecture Project Deep Dive
                                                                        </div>
                                                                        <h5 style={{
                                                                            fontSize: '1.1rem',
                                                                            fontWeight: 700,
                                                                            margin: 0,
                                                                            color: 'var(--text-primary)'
                                                                        }}>
                                                                            {item.project.title}
                                                                        </h5>
                                                                    </div>

                                                                    {item.project.impact && (
                                                                        <span style={{
                                                                            fontSize: '0.78rem',
                                                                            fontWeight: 600,
                                                                            padding: '4px 12px',
                                                                            borderRadius: '9999px',
                                                                            background: 'rgba(16, 185, 129, 0.12)',
                                                                            color: '#10b981',
                                                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            gap: '5px'
                                                                        }}>
                                                                            <FiCheckCircle size={13} />
                                                                            {item.project.impact}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {item.project.tags && item.project.tags.length > 0 && (
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                                                                        {item.project.tags.map((tag, tIdx) => (
                                                                            <span key={tIdx} style={{
                                                                                fontSize: '0.75rem',
                                                                                padding: '3px 8px',
                                                                                borderRadius: '4px',
                                                                                background: 'var(--bg-color)',
                                                                                border: '1px solid var(--card-border)',
                                                                                color: 'var(--text-secondary)',
                                                                                fontWeight: 500
                                                                            }}>
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleProjectDeepDive(item.id);
                                                                    }}
                                                                    className="btn-secondary"
                                                                    style={{
                                                                        padding: '8px 16px',
                                                                        fontSize: '0.86rem',
                                                                        width: '100%',
                                                                        justifyContent: 'center',
                                                                        border: '1px solid var(--card-border)',
                                                                        borderRadius: '8px',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px',
                                                                        fontWeight: 600,
                                                                        color: 'var(--primary-color)',
                                                                        background: 'var(--card-bg)',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                >
                                                                    <span>{expandedProjectDeepDives[item.id] ? 'Close Deep Dive' : 'Read Master Reference Deep Dive'}</span>
                                                                    {expandedProjectDeepDives[item.id] ? <FiChevronUp /> : <FiChevronDown />}
                                                                </button>
                                                            </div>

                                                            {/* Expandable Project Deep Dive Detail */}
                                                            <AnimatePresence>
                                                                {expandedProjectDeepDives[item.id] && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                        style={{ overflow: 'hidden' }}
                                                                    >
                                                                        <div style={{
                                                                            padding: '20px',
                                                                            background: 'rgba(0,0,0,0.02)',
                                                                            borderTop: '1px solid var(--card-border)'
                                                                        }}>
                                                                            {item.project.catalyst && (
                                                                                <div style={{ marginBottom: '18px' }}>
                                                                                    <h4 style={{
                                                                                        fontSize: '0.98rem',
                                                                                        color: 'var(--primary-color)',
                                                                                        margin: '0 0 8px 0',
                                                                                        fontWeight: 700
                                                                                    }}>
                                                                                        The Business Catalyst & Architectural Context
                                                                                    </h4>
                                                                                    <p style={{
                                                                                        color: 'var(--text-secondary)',
                                                                                        lineHeight: 1.65,
                                                                                        fontSize: '0.9rem',
                                                                                        margin: 0
                                                                                    }}>
                                                                                        {item.project.catalyst}
                                                                                    </p>
                                                                                </div>
                                                                            )}

                                                                            {item.project.responsibilities && item.project.responsibilities.length > 0 && (
                                                                                <div>
                                                                                    <h4 style={{
                                                                                        fontSize: '0.98rem',
                                                                                        color: 'var(--primary-color)',
                                                                                        margin: '16px 0 10px 0',
                                                                                        fontWeight: 700
                                                                                    }}>
                                                                                        Core Engineering Responsibilities
                                                                                    </h4>
                                                                                    <ul style={{
                                                                                        listStyle: 'none',
                                                                                        padding: 0,
                                                                                        margin: 0,
                                                                                        display: 'flex',
                                                                                        flexDirection: 'column',
                                                                                        gap: '12px'
                                                                                    }}>
                                                                                        {item.project.responsibilities.map((resp, rIdx) => (
                                                                                            <li key={rIdx} style={{
                                                                                                position: 'relative',
                                                                                                paddingLeft: '20px',
                                                                                                color: 'var(--text-secondary)',
                                                                                                fontSize: '0.9rem',
                                                                                                lineHeight: 1.6
                                                                                            }}>
                                                                                                <span style={{
                                                                                                    position: 'absolute',
                                                                                                    left: 0,
                                                                                                    top: '1px',
                                                                                                    color: 'var(--accent-purple)',
                                                                                                    fontWeight: 'bold',
                                                                                                    fontSize: '1.1rem'
                                                                                                }}>
                                                                                                    ▹
                                                                                                </span>
                                                                                                <strong style={{ color: 'var(--text-primary)' }}>
                                                                                                    {resp.title}:{' '}
                                                                                                </strong>
                                                                                                <span>{resp.detail}</span>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    )}

                                                    {/* Interview Rounds Audit Trail */}
                                                    {item.rounds && item.rounds.length > 0 && (
                                                        <div style={{ marginBottom: '16px' }}>
                                                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                Evaluation Rounds & Audit:
                                                            </div>
                                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                                {item.rounds.map((rnd, rIdx) => (
                                                                    <div key={rIdx} style={{
                                                                        padding: '10px 14px',
                                                                        borderRadius: '8px',
                                                                        background: 'var(--surface-color)',
                                                                        border: '1px solid var(--card-border)',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'flex-start',
                                                                        flexWrap: 'wrap',
                                                                        gap: '8px'
                                                                    }}>
                                                                        <div>
                                                                            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                                                                                {rnd.name}
                                                                            </div>
                                                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                                                {rnd.date} • {rnd.platform || 'Online'}
                                                                            </div>
                                                                            {rnd.notes && (
                                                                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                                                    {rnd.notes}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span style={{
                                                                            fontSize: '0.74rem',
                                                                            fontWeight: 600,
                                                                            padding: '2px 8px',
                                                                            borderRadius: '4px',
                                                                            background: rnd.status === 'cleared' ? 'rgba(16, 185, 129, 0.15)' : rnd.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                                                            color: rnd.status === 'cleared' ? '#10b981' : rnd.status === 'rejected' ? '#ef4444' : '#f59e0b'
                                                                        }}>
                                                                            {rnd.status}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Interview Questions Log */}
                                                    {item.interviewQuestions && item.interviewQuestions.length > 0 && (
                                                        <div style={{ marginBottom: '16px' }}>
                                                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                Questions & Solutions ({item.interviewQuestions.length}):
                                                            </div>
                                                            <div style={{ display: 'grid', gap: '10px' }}>
                                                                {item.interviewQuestions.map((iq, qIdx) => (
                                                                    <div key={qIdx} style={{
                                                                        padding: '12px 14px',
                                                                        borderRadius: '8px',
                                                                        background: 'var(--surface-color)',
                                                                        border: '1px solid var(--card-border)'
                                                                    }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                                                                {iq.topic || `Question ${qIdx + 1}`}
                                                                            </span>
                                                                            <button
                                                                                onClick={() => handleCopy(iq.q + '\n\n' + iq.myAnswer, `${item.id}-${qIdx}`)}
                                                                                style={{
                                                                                    background: 'transparent',
                                                                                    border: 'none',
                                                                                    color: copiedIndex === `${item.id}-${qIdx}` ? '#10b981' : 'var(--text-muted)',
                                                                                    cursor: 'pointer',
                                                                                    display: 'inline-flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '4px',
                                                                                    fontSize: '0.75rem'
                                                                                }}
                                                                            >
                                                                                {copiedIndex === `${item.id}-${qIdx}` ? <FiCheck size={12} /> : <FiCopy size={12} />}
                                                                                {copiedIndex === `${item.id}-${qIdx}` ? 'Copied' : 'Copy'}
                                                                            </button>
                                                                        </div>
                                                                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '6px', whiteSpace: 'pre-line' }}>
                                                                            {iq.q}
                                                                        </div>
                                                                        {iq.myAnswer && (
                                                                            <div style={{
                                                                                fontSize: '0.84rem',
                                                                                color: 'var(--text-secondary)',
                                                                                background: 'rgba(0,0,0,0.15)',
                                                                                padding: '10px',
                                                                                borderRadius: '6px',
                                                                                whiteSpace: 'pre-line',
                                                                                lineHeight: '1.5'
                                                                            }}>
                                                                                {iq.myAnswer}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Academic Highlights */}
                                                    {item.academicHighlights && item.academicHighlights.length > 0 && (
                                                        <div style={{ marginBottom: '16px' }}>
                                                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                Academic Performance & Milestones:
                                                            </div>
                                                            <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                                                {item.academicHighlights.map((ah, ahIdx) => (
                                                                    <li key={ahIdx} style={{ marginBottom: '6px' }}>{ah}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Certifications List */}
                                                    {item.certList && item.certList.length > 0 && (
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                                                            {item.certList.map((cert, cIdx) => (
                                                                <a
                                                                  key={cIdx}
                                                                  href={cert.link}
                                                                  target="_blank"
                                                                  rel="noopener noreferrer"
                                                                  style={{
                                                                      padding: '12px 14px',
                                                                      borderRadius: '10px',
                                                                      background: 'var(--surface-color)',
                                                                      border: '1px solid var(--card-border)',
                                                                      color: 'var(--text-primary)',
                                                                      display: 'flex',
                                                                      justifyContent: 'space-between',
                                                                      alignItems: 'center',
                                                                      textDecoration: 'none',
                                                                      transition: 'all 0.2s'
                                                                  }}
                                                                >
                                                                    <div>
                                                                        <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{cert.title}</div>
                                                                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{cert.issuer}</div>
                                                                    </div>
                                                                    <FiExternalLink size={14} color="var(--primary-color)" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Capstone Project Details for Education */}
                                                    {item.capstoneProject && (
                                                        <div style={{
                                                            padding: '14px',
                                                            borderRadius: '10px',
                                                            background: 'var(--surface-color)',
                                                            border: '1px solid var(--card-border)',
                                                            marginBottom: '12px'
                                                        }}>
                                                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                                Final Year Capstone Project:
                                                            </div>
                                                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                                                {item.capstoneProject.title}
                                                            </div>
                                                            <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                                                {item.capstoneProject.description}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Certificate Link */}
                                                    {item.certificate && (
                                                        <div style={{ marginTop: '12px' }}>
                                                            <a
                                                                href={item.certificate}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px',
                                                                    fontSize: '0.84rem',
                                                                    color: 'var(--primary-color)',
                                                                    textDecoration: 'none',
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                <FiAward size={14} />
                                                                <span>View Verified Completion Certificate</span>
                                                                <FiExternalLink size={12} />
                                                            </a>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
};

export default CareerLineage;
