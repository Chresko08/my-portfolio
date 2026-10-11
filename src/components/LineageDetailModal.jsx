import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX, FiCalendar, FiMapPin, FiBriefcase, FiAward,
    FiBookOpen, FiCode, FiFlag, FiExternalLink, FiCheckCircle,
    FiCheck, FiCopy, FiDatabase, FiLayers
} from 'react-icons/fi';

const TYPE_CONFIG = {
    experience: { label: 'Work Experience', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', icon: FiBriefcase },
    interview: { label: 'Interview Loop', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', icon: FiCode },
    certification: { label: 'Credential', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', icon: FiAward },
    education: { label: 'Education', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', icon: FiBookOpen },
    milestone: { label: 'Career Transition', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.3)', icon: FiFlag }
};

const LineageDetailModal = ({ item, onClose }) => {
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Lock body scroll and listen for Escape key
    useEffect(() => {
        if (!item) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [item, onClose]);

    if (!item) return null;

    const typeCfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.milestone;
    const TypeIcon = typeCfg.icon;

    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <AnimatePresence>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0'
                }}
            >
                {/* Backdrop with blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.72)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                />

                {/* Dialog / Bottom Sheet Card */}
                <motion.div
                    initial={{ y: '100%', opacity: 0.5 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '820px',
                        maxHeight: '90vh',
                        background: 'var(--surface-card, #121624)',
                        border: '1px solid var(--card-border-hover, rgba(99, 102, 241, 0.3))',
                        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px var(--glow-color, rgba(99, 102, 241, 0.15))',
                        zIndex: 2001,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                    className="lineage-modal-dialog"
                >
                    {/* Mobile Pull Handle */}
                    <div className="lineage-modal-drag-handle" style={{ display: 'none', justifyContent: 'center', padding: '10px 0 4px' }}>
                        <div style={{ width: '40px', height: '4px', borderRadius: '999px', background: 'var(--card-border, rgba(255, 255, 255, 0.2))' }} />
                    </div>

                    {/* Modal Header */}
                    <div style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid var(--card-border)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '16px',
                        background: 'var(--card-bg)'
                    }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Badges Row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
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

                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.74rem',
                                    padding: '3px 9px',
                                    borderRadius: '6px',
                                    background: 'var(--surface-color)',
                                    border: '1px solid var(--card-border)',
                                    color: 'var(--text-muted)'
                                }}>
                                    <FiCalendar size={11} /> {item.date}
                                </span>
                            </div>

                            {/* Title & Organization */}
                            <h3 style={{
                                fontSize: '1.28rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                margin: '0 0 6px 0',
                                lineHeight: 1.3
                            }}>
                                {item.title}
                            </h3>

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
                            </div>
                        </div>

                        {/* Large Touch-friendly Close Button */}
                        <button
                            onClick={onClose}
                            aria-label="Close details"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'var(--surface-color)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Scrollable Modal Content */}
                    <div style={{
                        padding: '24px',
                        overflowY: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        flex: 1
                    }}>
                        {/* Summary Narrative */}
                        {item.summary && (
                            <div style={{
                                padding: '14px 16px',
                                borderRadius: '10px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-primary)',
                                fontSize: '0.94rem',
                                lineHeight: 1.6,
                                marginBottom: '20px'
                            }}>
                                {item.summary}
                            </div>
                        )}

                        {/* ========================================================= */}
                        {/* MASTER ARCHITECTURE PROJECT DEEP DIVE                     */}
                        {/* ========================================================= */}
                        {item.project && (
                            <div style={{
                                marginBottom: '24px',
                                background: 'var(--surface-color)',
                                border: '1px solid var(--card-border-hover, rgba(99, 102, 241, 0.3))',
                                borderRadius: '12px',
                                padding: '20px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
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
                                        <h4 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                                            {item.project.title}
                                        </h4>
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
                                            <FiCheckCircle size={13} /> {item.project.impact}
                                        </span>
                                    )}
                                </div>

                                {/* Tech Tags */}
                                {item.project.tags && item.project.tags.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                                        {item.project.tags.map((tag, tIdx) => (
                                            <span key={tIdx} style={{
                                                fontSize: '0.75rem',
                                                padding: '4px 9px',
                                                borderRadius: '6px',
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

                                {/* Business Catalyst Narrative */}
                                {item.project.catalyst && (
                                    <div style={{ marginBottom: '18px' }}>
                                        <h5 style={{ fontSize: '0.92rem', color: 'var(--primary-color)', margin: '0 0 8px 0', fontWeight: 700 }}>
                                            The Business Catalyst & Architectural Context
                                        </h5>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.9rem', margin: 0 }}>
                                            {item.project.catalyst}
                                        </p>
                                    </div>
                                )}

                                {/* Engineering Responsibilities */}
                                {item.project.responsibilities && item.project.responsibilities.length > 0 && (
                                    <div>
                                        <h5 style={{ fontSize: '0.92rem', color: 'var(--primary-color)', margin: '14px 0 10px 0', fontWeight: 700 }}>
                                            Core Engineering Responsibilities & Impact
                                        </h5>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {item.project.responsibilities.map((resp, rIdx) => (
                                                <li key={rIdx} style={{ position: 'relative', paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                                                    <span style={{ position: 'absolute', left: 0, top: '2px', color: 'var(--accent-purple)', fontWeight: 'bold' }}>▹</span>
                                                    <strong style={{ color: 'var(--text-primary)' }}>{resp.title}:{' '}</strong>
                                                    <span>{resp.detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Engineering Highlights / Deliverables */}
                        {item.highlights && item.highlights.length > 0 && (
                            <div style={{ marginBottom: '22px' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Key Engineering Deliverables & Milestones:
                                </div>
                                <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                                    {item.highlights.map((h, hIdx) => (
                                        <li key={hIdx} style={{ marginBottom: '8px' }}>{h}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Interview Rounds & Notes */}
                        {item.rounds && item.rounds.length > 0 && (
                            <div style={{ marginBottom: '22px' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Selection Funnel & Technical Rounds Audit:
                                </div>
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    {item.rounds.map((rnd, rIdx) => (
                                        <div key={rIdx} style={{
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            background: 'var(--surface-color)',
                                            border: '1px solid var(--card-border)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            flexWrap: 'wrap',
                                            gap: '10px'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                                    {rnd.name}
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                    {rnd.date} • {rnd.platform || 'Online'}
                                                </div>
                                                {rnd.notes && (
                                                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                                                        {rnd.notes}
                                                    </div>
                                                )}
                                            </div>
                                            <span style={{
                                                fontSize: '0.74rem',
                                                fontWeight: 600,
                                                padding: '3px 9px',
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

                        {/* Interview Questions Bank */}
                        {item.interviewQuestions && item.interviewQuestions.length > 0 && (
                            <div style={{ marginBottom: '22px' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Technical Interview Questions & Solutions ({item.interviewQuestions.length}):
                                </div>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {item.interviewQuestions.map((iq, qIdx) => (
                                        <div key={qIdx} style={{
                                            padding: '14px 16px',
                                            borderRadius: '10px',
                                            background: 'var(--surface-color)',
                                            border: '1px solid var(--card-border)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                                    {iq.topic || `Question ${qIdx + 1}`}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(iq.q + '\n\n' + (iq.myAnswer || ''), `${item.id}-${qIdx}`)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: copiedIndex === `${item.id}-${qIdx}` ? '#10b981' : 'var(--text-muted)',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '0.78rem'
                                                    }}
                                                >
                                                    {copiedIndex === `${item.id}-${qIdx}` ? <FiCheck size={12} /> : <FiCopy size={12} />}
                                                    {copiedIndex === `${item.id}-${qIdx}` ? 'Copied' : 'Copy Question & Answer'}
                                                </button>
                                            </div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px', whiteSpace: 'pre-line' }}>
                                                {iq.q}
                                            </div>
                                            {iq.myAnswer && (
                                                <div style={{
                                                    fontSize: '0.85rem',
                                                    color: 'var(--text-secondary)',
                                                    background: 'rgba(0,0,0,0.18)',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    whiteSpace: 'pre-line',
                                                    lineHeight: 1.55,
                                                    borderLeft: '3px solid var(--primary-color)'
                                                }}>
                                                    {iq.myAnswer}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Academic Highlights & Capstone Project */}
                        {item.academicHighlights && item.academicHighlights.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Academic Milestones & Score Breakdown:
                                </div>
                                <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    {item.academicHighlights.map((ah, ahIdx) => (
                                        <li key={ahIdx} style={{ marginBottom: '6px' }}>{ah}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {item.capstoneProject && (
                            <div style={{
                                padding: '16px',
                                borderRadius: '10px',
                                background: 'var(--surface-color)',
                                border: '1px solid var(--card-border)',
                                marginBottom: '20px'
                            }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    Final Year Capstone Project
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                                    {item.capstoneProject.title}
                                </div>
                                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                                    {item.capstoneProject.description}
                                </div>
                            </div>
                        )}

                        {/* Verified Credential Links */}
                        {item.certList && item.certList.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px', marginTop: '12px' }}>
                                {item.certList.map((cert, cIdx) => (
                                    <a
                                        key={cIdx}
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '12px 14px',
                                            borderRadius: '8px',
                                            background: 'var(--surface-color)',
                                            border: '1px solid var(--card-border)',
                                            color: 'var(--text-primary)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            textDecoration: 'none'
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

                        {item.certificate && (
                            <div style={{ marginTop: '16px' }}>
                                <a
                                    href={item.certificate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '0.88rem',
                                        color: 'var(--primary-color)',
                                        textDecoration: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    <FiAward size={15} />
                                    <span>View Verified Certificate</span>
                                    <FiExternalLink size={13} />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div style={{
                        padding: '14px 24px',
                        borderTop: '1px solid var(--card-border)',
                        background: 'var(--card-bg)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        <button
                            onClick={onClose}
                            className="btn-secondary"
                            style={{
                                padding: '8px 20px',
                                borderRadius: '8px',
                                fontSize: '0.86rem',
                                cursor: 'pointer',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-primary)',
                                background: 'var(--surface-color)'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LineageDetailModal;
