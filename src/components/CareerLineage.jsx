import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FiBriefcase, FiAward, FiBookOpen, FiCalendar, FiMapPin,
    FiSearch, FiLock, FiFlag, FiExternalLink, FiCode,
    FiDatabase, FiCheckCircle
} from 'react-icons/fi';
import LineageDetailModal from './LineageDetailModal';

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
    const lineageEras = data?.lineageEras || [
        { id: 'all', label: 'Complete Lineage (2004 – 2026)', range: '2004 – 2026' }
    ];
    const lineageItems = data?.lineageItems || [];
    const [selectedType, setSelectedType] = useState('all');
    const [selectedEra, setSelectedEra] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeModalItem, setActiveModalItem] = useState(null);

    // Filtered items
    const filteredItems = useMemo(() => {
        return lineageItems.filter(item => {
            const matchesType = selectedType === 'all' || item.type === selectedType;
            const matchesEra = selectedEra === 'all' || item.era === selectedEra;

            const q = searchQuery.toLowerCase().trim();
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
    }, [lineageItems, selectedType, selectedEra, searchQuery]);

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
                {/* Header Title & Controls Wrap */}
                <div className="section-title-wrap" style={{ marginBottom: '28px', textAlign: 'center' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        marginBottom: '12px'
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

                        {/* Unobtrusive Header Lock Device Button */}
                        <button
                            onClick={handleLock}
                            title="Lock private view on this device"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                borderRadius: '9999px',
                                background: 'var(--surface-color)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-muted)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                        >
                            <FiLock size={12} /> Lock Device
                        </button>
                    </div>

                    <h2 className="section-heading">
                        Career & Education <span className="gradient-text">Lineage</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1rem', maxWidth: '820px', margin: '8px auto 0', lineHeight: '1.6' }}>
                        Chronological progression spanning 2004 to present: university academics, corporate engineering tenures at Infosys, TCS, and EY, and active technical transition pipelines.
                    </p>
                </div>

                {/* Era Selector Tabs */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '16px',
                    justifyContent: 'center'
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

                    {/* Search Field */}
                    <div style={{ position: 'relative', minWidth: '220px', maxWidth: '340px', flex: '1' }}>
                        <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={14} />
                        <input
                            type="text"
                            placeholder="Search roles, deep dives, Q&As, topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px 8px 34px',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'var(--card-bg)',
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

                    {filteredItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                            <p style={{ fontSize: '1.05rem', margin: 0 }}>No lineage records match your filter criteria.</p>
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
                                        marginBottom: '24px'
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

                                    {/* Streamlined Executive Timeline Card */}
                                    <div
                                        className="glass-card"
                                        onClick={() => setActiveModalItem(item)}
                                        style={{
                                            padding: '20px 22px',
                                            borderRadius: '14px',
                                            background: 'var(--card-bg)',
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
                                        {/* Card Header Row */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                                            <div style={{ flex: '1', minWidth: '240px' }}>
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
                                                    fontSize: '1.2rem',
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
                                                    fontSize: '0.86rem'
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
                                                </div>
                                            </div>

                                            {/* Date Pill */}
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

                                        {/* Brief Summary */}
                                        {item.summary && (
                                            <p style={{
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.9rem',
                                                lineHeight: '1.6',
                                                margin: '10px 0 0 0'
                                            }}>
                                                {item.summary}
                                            </p>
                                        )}

                                        {/* Metrics Badges Row & Action Trigger Button */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexWrap: 'wrap',
                                            gap: '10px',
                                            marginTop: '14px',
                                            paddingTop: '12px',
                                            borderTop: '1px solid var(--card-border)'
                                        }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {item.metrics && item.metrics.map((m, mIdx) => (
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

                                            {/* Action Button that triggers Detail Modal */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveModalItem(item);
                                                }}
                                                className="btn-secondary"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '6px 14px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    color: 'var(--primary-color)',
                                                    background: 'var(--surface-color)',
                                                    border: '1px solid var(--card-border)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                                                    e.currentTarget.style.background = 'var(--badge-bg)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--card-border)';
                                                    e.currentTarget.style.background = 'var(--surface-color)';
                                                }}
                                            >
                                                {item.project ? (
                                                    <>
                                                        <FiDatabase size={13} />
                                                        <span>View Architecture Deep Dive</span>
                                                    </>
                                                ) : item.interviewQuestions ? (
                                                    <>
                                                        <FiCode size={13} />
                                                        <span>View Interview Q&As ({item.interviewQuestions.length})</span>
                                                    </>
                                                ) : item.capstoneProject ? (
                                                    <>
                                                        <FiBookOpen size={13} />
                                                        <span>View Project & Records</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiExternalLink size={13} />
                                                        <span>View Details & Highlights</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Responsive Desktop Modal & Mobile Bottom Sheet */}
            <LineageDetailModal
                item={activeModalItem}
                onClose={() => setActiveModalItem(null)}
            />
        </section>
    );
};

export default CareerLineage;
