import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCpu, FiDatabase, FiCode, FiLayers, FiGrid, FiCloud, FiUsers,
    FiSearch, FiPrinter, FiCopy, FiCheck, FiLock, FiUnlock,
    FiPlus, FiTrash2, FiEdit2, FiRotateCcw, FiFilter, FiArrowLeft, FiShare2
} from 'react-icons/fi';
import {
    loadAllQuestions,
    saveAllQuestions,
    resetToDefaultQuestions,
    INITIAL_INTERVIEW_TOPICS
} from '../data/allInterviewQuestionsData';

const TOPIC_ICON_MAP = {
    'spark-pyspark': FiCpu,
    'sql-optimization': FiDatabase,
    'python-algorithms': FiCode,
    'bigdata-hadoop': FiLayers,
    'data-architecture': FiGrid,
    'cloud-orchestration': FiCloud,
    'behavioral-projects': FiUsers
};

export default function AllInterviewQuestions({
    onBack,
    isAdmin = false,
    onOpenPasswordModal
}) {
    const [topics, setTopics] = useState(() => loadAllQuestions());
    const [selectedTopicId, setSelectedTopicId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [copied, setCopied] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editDraftText, setEditDraftText] = useState('');
    const [addingTopicId, setAddingTopicId] = useState(null);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [saveNotification, setSaveNotification] = useState('');
    const editInputRef = useRef(null);

    // Synchronize to localStorage whenever topics change via admin actions
    const handleUpdateTopics = (newTopics) => {
        setTopics(newTopics);
        saveAllQuestions(newTopics);
        showNotification('Changes saved to your device.');
    };

    const showNotification = (msg) => {
        setSaveNotification(msg);
        setTimeout(() => setSaveNotification(''), 3000);
    };

    // Calculate total questions across all topics
    const totalQuestionsCount = useMemo(() => {
        return topics.reduce((acc, t) => acc + (t.questions?.length || 0), 0);
    }, [topics]);

    // Filter questions based on selected topic and search query
    const filteredTopics = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        return topics
            .filter(t => selectedTopicId === 'all' || t.id === selectedTopicId)
            .map(t => {
                if (!query) return t;
                const matchingQuestions = (t.questions || []).filter(q =>
                    q.q.toLowerCase().includes(query) ||
                    t.title.toLowerCase().includes(query)
                );
                return { ...t, questions: matchingQuestions };
            })
            .filter(t => t.questions && t.questions.length > 0);
    }, [topics, selectedTopicId, searchQuery]);

    // Print to PDF trigger
    const handleExportPDF = () => {
        window.print();
    };

    // Copy entire question list as formatted text
    const handleCopyAll = () => {
        let text = `# Master Interview Questions Repository\n\n`;
        filteredTopics.forEach(t => {
            text += `## ${t.title}\n`;
            if (t.subtitle) text += `> ${t.subtitle}\n\n`;
            t.questions.forEach((q, idx) => {
                text += `${idx + 1}. ${q.q}\n`;
            });
            text += `\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    // Admin: Start editing a question
    const startEditQuestion = (q) => {
        if (!isAdmin) return;
        setEditingQuestionId(q.id);
        setEditDraftText(q.q);
    };

    // Admin: Save edited question
    const saveEditedQuestion = (topicId, qId) => {
        if (!editDraftText.trim()) return;
        const newTopics = topics.map(t => {
            if (t.id !== topicId) return t;
            return {
                ...t,
                questions: t.questions.map(q => q.id === qId ? { ...q, q: editDraftText.trim() } : q)
            };
        });
        handleUpdateTopics(newTopics);
        setEditingQuestionId(null);
        setEditDraftText('');
    };

    // Admin: Delete a question
    const handleDeleteQuestion = (topicId, qId) => {
        if (!isAdmin) return;
        if (!window.confirm('Delete this question?')) return;
        const newTopics = topics.map(t => {
            if (t.id !== topicId) return t;
            return {
                ...t,
                questions: t.questions.filter(q => q.id !== qId)
            };
        });
        handleUpdateTopics(newTopics);
    };

    // Admin: Add a new question to a topic
    const handleAddQuestion = (topicId) => {
        if (!newQuestionText.trim()) return;
        const newId = `${topicId.slice(0, 3)}-${Date.now().toString().slice(-4)}`;
        const newTopics = topics.map(t => {
            if (t.id !== topicId) return t;
            return {
                ...t,
                questions: [...t.questions, { id: newId, q: newQuestionText.trim() }]
            };
        });
        handleUpdateTopics(newTopics);
        setNewQuestionText('');
        setAddingTopicId(null);
    };

    // Admin: Reset to default factory questions
    const handleReset = () => {
        if (!window.confirm('Reset all questions to default? Custom additions or edits will be discarded.')) return;
        const defaults = resetToDefaultQuestions();
        setTopics(defaults);
        showNotification('Questions reset to default.');
    };

    return (
        <section className="all-questions-page" style={{ minHeight: '100vh', padding: '100px 0 60px' }}>
            {/* Embedded Print & Responsive Styles */}
            <style>{`
                @media print {
                    nav, footer, .no-print, .back-btn-container, .toolbar-actions, .admin-controls, .search-box-wrapper, .topic-chips-wrapper {
                        display: none !important;
                    }
                    body, .all-questions-page {
                        background: #fff !important;
                        color: #111 !important;
                        padding: 0 !important;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                    }
                    .print-only-header {
                        display: block !important;
                        margin-bottom: 24px;
                        border-bottom: 2px solid #222;
                        padding-bottom: 12px;
                    }
                    .print-only-footer {
                        display: flex !important;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        border-top: 1px solid #ddd;
                        padding-top: 6px;
                        font-size: 8pt;
                        color: #555;
                        justify-content: space-between;
                        align-items: center;
                        background: #fff;
                    }
                    .topic-card {
                        border: none !important;
                        background: transparent !important;
                        box-shadow: none !important;
                        page-break-inside: avoid;
                        margin-bottom: 28px !important;
                        padding: 0 !important;
                    }
                    .question-item {
                        border-bottom: 1px solid #ddd !important;
                        background: transparent !important;
                        page-break-inside: avoid;
                        color: #111 !important;
                        padding: 8px 0 !important;
                    }
                    .question-text {
                        color: #111 !important;
                        font-size: 11pt !important;
                        line-height: 1.45 !important;
                    }
                    .question-num {
                        color: #444 !important;
                        font-weight: 700 !important;
                    }
                }
                .print-only-header, .print-only-footer {
                    display: none;
                }
                .topic-chip {
                    cursor: pointer;
                    transition: all 0.2s ease;
                    user-select: none;
                    flex-shrink: 0;
                }
                .topic-chip:hover {
                    transform: translateY(-2px);
                }
                .question-item {
                    transition: background 0.15s ease, border-color 0.15s ease;
                }
                .question-item:hover {
                    border-color: rgba(97, 175, 239, 0.4);
                }
                .topic-chips-wrapper {
                    -webkit-overflow-scrolling: touch;
                }
                @media (max-width: 768px) {
                    .all-questions-page {
                        padding-top: 75px !important;
                    }
                    .questions-sticky-bar {
                        top: 60px !important;
                        padding: 12px !important;
                        margin-bottom: 18px !important;
                    }
                    .questions-sticky-bar input {
                        font-size: 16px !important; /* Prevents iOS auto-zoom */
                    }
                    .topic-card {
                        padding: 16px 14px !important;
                    }
                }
            `}</style>

            <div className="container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 20px' }}>

                {/* Print Header (Visible only when printed or exported to PDF) */}
                <div className="print-only-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #111', paddingBottom: '12px', marginBottom: '14px' }}>
                        <div>
                            <h1 style={{ fontSize: '20pt', margin: '0 0 6px', fontWeight: '800', color: '#111' }}>Master Interview Questions Compilation</h1>
                            <p style={{ margin: '0 0 4px', fontSize: '10pt', color: '#444' }}>
                                Curated from 12 real enterprise interview rounds & technical reference repository • {totalQuestionsCount} Questions across 7 Core Domains
                            </p>
                            <p style={{ margin: 0, fontSize: '9pt', color: '#666' }}>
                                Candidate: <strong>Shubham Srivastava</strong> (Senior Data & Cloud Platform Engineer) • Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: '240px' }}>
                            <div style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666', fontWeight: 600 }}>Interactive Portfolio & Solutions</div>
                            <a href="https://chresko08.github.io/my-portfolio/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '10pt', fontWeight: 700, color: '#0071e3', textDecoration: 'underline' }}>
                                https://chresko08.github.io/my-portfolio/
                            </a>
                            <div style={{ fontSize: '8pt', color: '#777', marginTop: '2px' }}>Live Career Lineage & System Architecture</div>
                        </div>
                    </div>
                </div>

                {/* Top Navigation & Back Action */}
                <div className="back-btn-container no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    {onBack && (
                        <button
                            onClick={onBack}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'var(--surface-color)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-primary)',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            <FiArrowLeft size={16} /> Back to Portfolio
                        </button>
                    )}

                    {/* Admin Status Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isAdmin ? (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(16, 185, 129, 0.12)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                color: '#10b981',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                fontSize: '0.82rem',
                                fontWeight: '600'
                            }}>
                                <FiUnlock size={14} /> Admin Mode (Editing Enabled)
                            </div>
                        ) : (
                            <button
                                onClick={onOpenPasswordModal}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'var(--surface-color)',
                                    border: '1px solid var(--card-border)',
                                    color: 'var(--text-muted)',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '0.82rem',
                                    cursor: 'pointer'
                                }}
                                title="Unlock admin mode to edit or add questions"
                            >
                                <FiLock size={13} /> Admin Login
                            </button>
                        )}

                        {isAdmin && (
                            <button
                                onClick={handleReset}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    background: 'transparent',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                                title="Reset all questions back to factory original"
                            >
                                <FiRotateCcw size={13} /> Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Hero Header */}
                <div className="no-print" style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(97, 175, 239, 0.12)',
                        border: '1px solid rgba(97, 175, 239, 0.3)',
                        color: 'var(--primary-color)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Unified Master Question Bank
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        marginBottom: '10px',
                        letterSpacing: '-0.5px'
                    }}>
                        All Interview Questions
                    </h1>
                    <p style={{
                        fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                        color: 'var(--text-secondary)',
                        maxWidth: '720px',
                        margin: '0 auto 20px',
                        lineHeight: '1.6'
                    }}>
                        Every technical, algorithmic, and architectural question asked across <strong>12 real company interview rounds</strong> & reference sets — genericized and organized by domain.
                    </p>

                    {/* Quick Stats Banner */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '20px',
                        padding: '8px 24px',
                        background: 'var(--surface-card)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '30px',
                        fontSize: '0.88rem',
                        color: 'var(--text-muted)'
                    }}>
                        <span><strong style={{ color: 'var(--text-primary)' }}>{totalQuestionsCount}</strong> Total Questions</span>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span><strong style={{ color: 'var(--text-primary)' }}>{topics.length}</strong> Core Domains</span>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span style={{ color: '#10b981' }}>Universal Zero-App Access</span>
                    </div>
                </div>

                {/* Save Notification Toast */}
                <AnimatePresence>
                    {saveNotification && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                position: 'fixed',
                                top: '80px',
                                right: '20px',
                                zIndex: 1000,
                                background: '#10b981',
                                color: '#fff',
                                padding: '10px 18px',
                                borderRadius: '8px',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <FiCheck size={16} /> {saveNotification}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sticky Action Toolbar (Search, Export to PDF, Copy) */}
                <div className="questions-sticky-bar no-print" style={{
                    position: 'sticky',
                    top: '70px',
                    zIndex: 50,
                    background: 'var(--nav-bg)',
                    backdropFilter: 'blur(25px) saturate(190%)',
                    WebkitBackdropFilter: 'blur(25px) saturate(190%)',
                    padding: '16px',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--card-border)',
                    boxShadow: 'var(--card-highlight), 0 12px 36px rgba(0,0,0,0.25)',
                    marginBottom: '28px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {/* Search Input (Apple Spotlight Style) */}
                        <div style={{ flex: '1 1 260px', position: 'relative' }}>
                            <FiSearch size={16} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search questions (e.g. OOM, window, join, spark-submit)..."
                                style={{
                                    width: '100%',
                                    padding: '11px 16px 11px 40px',
                                    background: 'var(--surface-color)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: 'var(--radius-button)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--primary-color)';
                                    e.target.style.boxShadow = '0 0 0 3px var(--badge-bg)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--card-border)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {/* Export to PDF Button */}
                        <motion.button
                            onClick={handleExportPDF}
                            whileTap={{ scale: 0.96 }}
                            className="btn-primary"
                            style={{
                                padding: '10px 18px',
                                fontSize: '0.86rem'
                            }}
                            title="Export clean formatted questions to PDF"
                        >
                            <FiPrinter size={15} />
                            <span>Export to PDF</span>
                        </motion.button>

                        {/* Copy Questions Button */}
                        <motion.button
                            onClick={handleCopyAll}
                            whileTap={{ scale: 0.96 }}
                            className="btn-secondary"
                            style={{
                                padding: '10px 18px',
                                fontSize: '0.86rem'
                            }}
                            title="Copy questions to clipboard"
                        >
                            {copied ? <FiCheck size={15} color="#30d158" /> : <FiCopy size={14} />}
                            <span>{copied ? 'Copied!' : 'Copy Questions'}</span>
                        </motion.button>
                    </div>

                    {/* Topic Filter Chips */}
                    <div className="topic-chips-wrapper" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        overflowX: 'auto',
                        paddingTop: '14px',
                        paddingBottom: '2px',
                        scrollbarWidth: 'none'
                    }}>
                        <button
                            onClick={() => setSelectedTopicId('all')}
                            className="topic-chip"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                borderRadius: '9999px',
                                fontSize: '0.82rem',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                border: '1px solid',
                                background: selectedTopicId === 'all' ? 'var(--primary-color)' : 'transparent',
                                borderColor: selectedTopicId === 'all' ? 'var(--primary-color)' : 'var(--card-border)',
                                color: selectedTopicId === 'all' ? '#ffffff' : 'var(--text-secondary)'
                            }}
                        >
                            <span>All Topics</span>
                            <span style={{
                                padding: '1px 6px',
                                borderRadius: '10px',
                                fontSize: '0.72rem',
                                background: selectedTopicId === 'all' ? 'rgba(255,255,255,0.25)' : 'var(--surface-color)'
                            }}>{totalQuestionsCount}</span>
                        </button>

                        {topics.map(t => {
                            const IconComponent = TOPIC_ICON_MAP[t.id] || FiLayers;
                            const isSelected = selectedTopicId === t.id;
                            const count = t.questions?.length || 0;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTopicId(t.id)}
                                    className="topic-chip"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 14px',
                                        borderRadius: '9999px',
                                        fontSize: '0.82rem',
                                        fontWeight: '600',
                                        whiteSpace: 'nowrap',
                                        border: '1px solid',
                                        background: isSelected ? 'var(--primary-color)' : 'transparent',
                                        borderColor: isSelected ? 'var(--primary-color)' : 'var(--card-border)',
                                        color: isSelected ? '#ffffff' : 'var(--text-secondary)'
                                    }}
                                >
                                    <IconComponent size={13} />
                                    <span>{t.title}</span>
                                    <span style={{
                                        padding: '1px 6px',
                                        borderRadius: '10px',
                                        fontSize: '0.72rem',
                                        background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--surface-color)'
                                    }}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Questions Content List */}
                <div className="questions-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {filteredTopics.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            background: 'var(--surface-card)',
                            borderRadius: '16px',
                            border: '1px solid var(--card-border)'
                        }}>
                            <FiSearch size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>No questions found</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Try searching for another keyword or switch topic filters.
                            </p>
                        </div>
                    ) : (
                        filteredTopics.map((topic, topicIdx) => {
                            const IconComponent = TOPIC_ICON_MAP[topic.id] || FiLayers;
                            return (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: topicIdx * 0.04 }}
                                    className="topic-card"
                                    style={{
                                        background: 'var(--surface-color)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '16px',
                                        padding: '24px 28px',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Topic Header */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        marginBottom: '20px',
                                        borderBottom: '1px solid var(--card-border)',
                                        paddingBottom: '16px',
                                        gap: '14px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: `${topic.badgeColor || '#61afef'}18`,
                                                color: topic.badgeColor || 'var(--primary-color)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <IconComponent size={20} />
                                            </div>
                                            <div>
                                                <h2 style={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: '700',
                                                    color: 'var(--text-primary)',
                                                    margin: '0 0 4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                }}>
                                                    {topic.title}
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        background: 'var(--surface-color)',
                                                        border: '1px solid var(--card-border)',
                                                        color: 'var(--text-muted)'
                                                    }}>
                                                        {topic.questions.length} Qs
                                                    </span>
                                                </h2>
                                                {topic.subtitle && (
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        {topic.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Admin: Add Question Trigger */}
                                        {isAdmin && (
                                            <button
                                                onClick={() => setAddingTopicId(addingTopicId === topic.id ? null : topic.id)}
                                                className="no-print"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    background: 'rgba(16, 185, 129, 0.1)',
                                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                                    color: '#10b981',
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiPlus size={14} /> Add Question
                                            </button>
                                        )}
                                    </div>

                                    {/* Inline Add Question Form (Admin Only) */}
                                    {isAdmin && addingTopicId === topic.id && (
                                        <div className="no-print" style={{
                                            marginBottom: '20px',
                                            padding: '16px',
                                            background: 'var(--surface-color)',
                                            border: '1px dashed rgba(16, 185, 129, 0.5)',
                                            borderRadius: '10px'
                                        }}>
                                            <textarea
                                                value={newQuestionText}
                                                onChange={(e) => setNewQuestionText(e.target.value)}
                                                placeholder={`Type new question for ${topic.title}...`}
                                                rows={2}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    background: 'var(--surface-color)',
                                                    border: '1px solid var(--card-border)',
                                                    borderRadius: '8px',
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.9rem',
                                                    marginBottom: '10px',
                                                    outline: 'none',
                                                    resize: 'vertical'
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => setAddingTopicId(null)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: 'transparent',
                                                        border: '1px solid var(--card-border)',
                                                        color: 'var(--text-muted)',
                                                        borderRadius: '6px',
                                                        fontSize: '0.82rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleAddQuestion(topic.id)}
                                                    style={{
                                                        padding: '6px 14px',
                                                        background: '#10b981',
                                                        border: 'none',
                                                        color: '#fff',
                                                        borderRadius: '6px',
                                                        fontSize: '0.82rem',
                                                        fontWeight: '600',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Save Question
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Question Items */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {topic.questions.map((q, idx) => {
                                            const isEditing = editingQuestionId === q.id;
                                            return (
                                                <div
                                                    key={q.id || idx}
                                                    className="question-item"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '14px',
                                                        padding: '12px 14px',
                                                        borderRadius: '8px',
                                                        background: 'var(--bg-primary, rgba(0,0,0,0.2))',
                                                        border: '1px solid var(--card-border)'
                                                    }}
                                                >
                                                    <span className="question-num" style={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: '700',
                                                        color: 'var(--primary-color)',
                                                        minWidth: '28px',
                                                        paddingTop: '2px'
                                                    }}>
                                                        #{idx + 1}
                                                    </span>

                                                    {/* Question Content / Edit Field */}
                                                    <div style={{ flex: 1 }}>
                                                        {isEditing ? (
                                                            <div className="no-print">
                                                                <textarea
                                                                    ref={editInputRef}
                                                                    value={editDraftText}
                                                                    onChange={(e) => setEditDraftText(e.target.value)}
                                                                    rows={3}
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '8px 10px',
                                                                        background: 'var(--surface-color)',
                                                                        border: '1px solid var(--primary-color)',
                                                                        borderRadius: '6px',
                                                                        color: 'var(--text-primary)',
                                                                        fontSize: '0.92rem',
                                                                        outline: 'none',
                                                                        resize: 'vertical',
                                                                        marginBottom: '8px'
                                                                    }}
                                                                />
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    <button
                                                                        onClick={() => saveEditedQuestion(topic.id, q.id)}
                                                                        style={{
                                                                            padding: '4px 10px',
                                                                            background: '#10b981',
                                                                            border: 'none',
                                                                            color: '#fff',
                                                                            borderRadius: '4px',
                                                                            fontSize: '0.78rem',
                                                                            fontWeight: '600',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingQuestionId(null)}
                                                                        style={{
                                                                            padding: '4px 10px',
                                                                            background: 'transparent',
                                                                            border: '1px solid var(--card-border)',
                                                                            color: 'var(--text-muted)',
                                                                            borderRadius: '4px',
                                                                            fontSize: '0.78rem',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="question-text" style={{
                                                                margin: 0,
                                                                fontSize: '0.94rem',
                                                                color: 'var(--text-primary)',
                                                                lineHeight: '1.55',
                                                                fontWeight: '400'
                                                            }}>
                                                                {q.q}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Admin Controls (Edit & Delete) */}
                                                    {isAdmin && !isEditing && (
                                                        <div className="admin-controls no-print" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <button
                                                                onClick={() => startEditQuestion(q)}
                                                                style={{
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    color: 'var(--text-muted)',
                                                                    cursor: 'pointer',
                                                                    padding: '4px',
                                                                    borderRadius: '4px'
                                                                }}
                                                                title="Edit question text"
                                                            >
                                                                <FiEdit2 size={13} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteQuestion(topic.id, q.id)}
                                                                style={{
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    color: '#ef4444',
                                                                    cursor: 'pointer',
                                                                    padding: '4px',
                                                                    borderRadius: '4px'
                                                                }}
                                                                title="Delete question"
                                                            >
                                                                <FiTrash2 size={13} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Print Footer (Visible only when printed or exported to PDF) */}
                <div className="print-only-footer">
                    <span>Candidate: <strong>Shubham Srivastava</strong> — Senior Data & Cloud Platform Engineer</span>
                    <span>
                        Live Portfolio & Interactive Verification: <a href="https://chresko08.github.io/my-portfolio/" target="_blank" rel="noopener noreferrer" style={{ color: '#0071e3', textDecoration: 'underline', fontWeight: 600 }}>https://chresko08.github.io/my-portfolio/</a>
                    </span>
                </div>
            </div>
        </section>
    );
}
