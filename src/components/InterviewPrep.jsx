import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiBookOpen, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiCheckCircle, FiStar } from 'react-icons/fi';
import { interviewCategories } from '../data/interviewData';

const ITEMS_PER_PAGE = 10;

const InterviewPrep = ({ viewMode }) => {
    // We only show this section in 'all' viewMode
    if (viewMode !== 'all') return null;

    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [activeCategory, setActiveCategory] = useState(interviewCategories[0].id);
    const [searchTerm, setSearchTerm] = useState("");
    const [complexityFilter, setComplexityFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [questionStatuses, setQuestionStatuses] = useState({});

    // Load from local storage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('interviewQuestionStatuses');
            if (saved) {
                setQuestionStatuses(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Error loading statuses", e);
        }
    }, []);

    const toggleStatus = (qNo, type, e) => {
        e.stopPropagation(); // Prevent expanding the accordion
        setQuestionStatuses(prev => {
            const current = prev[qNo] || { completed: false, review: false };
            const updated = { ...prev, [qNo]: { ...current, [type]: !current[type] } };
            localStorage.setItem('interviewQuestionStatuses', JSON.stringify(updated));
            return updated;
        });
    };

    const toggleQuestion = (qIndex) => {
        setExpandedQuestion(prev => prev === qIndex ? null : qIndex);
    };

    const handleCategoryChange = (id) => {
        setActiveCategory(id);
        setSearchTerm("");
        setComplexityFilter("All");
        setCurrentPage(1);
        setExpandedQuestion(null);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        setExpandedQuestion(null);
    };

    const handleComplexityChange = (val) => {
        setComplexityFilter(val);
        setCurrentPage(1);
        setExpandedQuestion(null);
    };

    const currentCategory = interviewCategories.find(c => c.id === activeCategory);

    const filteredQuestions = useMemo(() => {
        if (!currentCategory) return [];
        let qs = currentCategory.questions;

        if (complexityFilter !== "All") {
            qs = qs.filter(q => q.complexity === complexityFilter);
        }

        if (searchTerm.trim() !== "") {
            const lowerSearch = searchTerm.toLowerCase();
            qs = qs.filter(q => 
                q.q.toLowerCase().includes(lowerSearch) || 
                q.a.toLowerCase().includes(lowerSearch)
            );
        }
        
        return qs;
    }, [currentCategory, searchTerm, complexityFilter]);

    const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE) || 1;
    
    // Ensure we don't end up on a blank page if filtering reduces the page count
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    const paginatedQuestions = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredQuestions.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredQuestions, currentPage]);

    const getComplexityColor = (comp) => {
        switch(comp) {
            case 'Basic': return 'var(--accent-emerald)';
            case 'Intermediate': return 'var(--accent-amber)';
            case 'Complex': return '#ef4444'; // Use a standard red since accent-red isn't defined explicitly
            default: return 'var(--primary-color)';
        }
    };

    return (
        <section id="interview-prep" className="section" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
            <div className="container">
                <div className="section-title-wrap" style={{ marginBottom: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="section-subtitle">Exclusive Content</span>
                    <h2 className="section-heading">
                        Interview <span className="gradient-text">Preparation</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '1rem', maxWidth: '800px', margin: '10px auto 24px auto', lineHeight: '1.6' }}>
                        A comprehensive guide for Data Engineering interviews, featuring real-world system design scenarios, deep-dive architectural trade-offs, and complex problem-solving tailored for a 5 YOE Senior Data Engineer.
                    </p>

                    {/* Stats Counter */}
                    <div style={{
                        display: 'inline-flex',
                        gap: '24px',
                        padding: '12px 24px',
                        background: 'var(--surface-color)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                                {interviewCategories.reduce((acc, cat) => acc + cat.questions.length, 0)}
                            </span>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Qs</span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--card-border)' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                                {currentCategory ? currentCategory.questions.length : 0}
                            </span>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>In Topic</span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--card-border)' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                                {filteredQuestions.length}
                            </span>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Visible</span>
                        </div>
                    </div>
                </div>

                {/* Category Toggles */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
                    {interviewCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={activeCategory === cat.id ? "btn-primary" : "btn-secondary"}
                            style={{ 
                                padding: '8px 16px', 
                                fontSize: '0.9rem',
                                borderRadius: '20px',
                                border: activeCategory === cat.id ? 'none' : '1px solid var(--card-border)'
                            }}
                        >
                            {cat.title}
                        </button>
                    ))}
                </div>

                {/* Controls: Search and Complexity Filter */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '30px', alignItems: 'center' }}>
                    {/* Search Bar */}
                    <div style={{ 
                        position: 'relative', 
                        flex: '1 1 300px',
                        maxWidth: '500px'
                    }}>
                        <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input 
                            type="text" 
                            placeholder="Search questions or answers..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 42px',
                                borderRadius: '12px',
                                border: '1px solid var(--card-border)',
                                background: 'var(--surface-color)',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'border-color 0.2s ease'
                            }}
                        />
                    </div>

                    {/* Complexity Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--surface-color)', padding: '6px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                        <FiFilter style={{ color: 'var(--text-muted)', marginLeft: '8px' }} />
                        {['All', 'Basic', 'Intermediate', 'Complex'].map(comp => (
                            <button
                                key={comp}
                                onClick={() => handleComplexityChange(comp)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: complexityFilter === comp ? 'var(--badge-bg)' : 'transparent',
                                    color: complexityFilter === comp ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {comp}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question List */}
                <div style={{ maxWidth: '900px', minHeight: '400px' }}>
                    {paginatedQuestions.length > 0 ? paginatedQuestions.map((item, index) => {
                        const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                        return (
                            <div key={globalIndex} style={{ marginBottom: '16px' }}>
                                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <button
                                        onClick={() => toggleQuestion(globalIndex)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            padding: '20px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-primary)',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '1.05rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
                                            <FiBookOpen style={{ color: 'var(--primary-color)', marginTop: '4px', flexShrink: 0 }} size={18} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                                <span style={{ 
                                                    lineHeight: '1.4',
                                                    textDecoration: questionStatuses[item.qNo]?.completed ? 'line-through' : 'none',
                                                    opacity: questionStatuses[item.qNo]?.completed ? 0.6 : 1,
                                                    transition: 'all 0.2s'
                                                }}>
                                                    {item.qNo && <span style={{ color: 'var(--primary-color)', marginRight: '6px', textDecoration: 'none', display: 'inline-block' }}>Q{item.qNo}.</span>}
                                                    {item.q}
                                                </span>
                                                {item.complexity && (
                                                    <span style={{ 
                                                        fontSize: '0.75rem', 
                                                        fontWeight: 700, 
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        color: getComplexityColor(item.complexity),
                                                        background: `color-mix(in srgb, ${getComplexityColor(item.complexity)} 15%, transparent)`,
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        alignSelf: 'flex-start'
                                                    }}>
                                                        {item.complexity}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ flexShrink: 0, marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {item.qNo && (
                                                <>
                                                    <button 
                                                        onClick={(e) => toggleStatus(item.qNo, 'review', e)}
                                                        title="Mark for Review"
                                                        style={{
                                                            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px',
                                                            color: questionStatuses[item.qNo]?.review ? '#f59e0b' : 'var(--text-muted)',
                                                            display: 'flex', alignItems: 'center', transition: 'color 0.2s'
                                                        }}
                                                    >
                                                        <FiStar size={18} fill={questionStatuses[item.qNo]?.review ? '#f59e0b' : 'none'} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => toggleStatus(item.qNo, 'completed', e)}
                                                        title="Mark as Completed"
                                                        style={{
                                                            background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px',
                                                            color: questionStatuses[item.qNo]?.completed ? 'var(--accent-emerald)' : 'var(--text-muted)',
                                                            display: 'flex', alignItems: 'center', transition: 'color 0.2s'
                                                        }}
                                                    >
                                                        <FiCheckCircle size={18} fill={questionStatuses[item.qNo]?.completed ? 'var(--accent-emerald)' : 'none'} color={questionStatuses[item.qNo]?.completed ? 'var(--bg-color)' : 'currentColor'} />
                                                    </button>
                                                </>
                                            )}
                                            <div style={{ marginLeft: '4px', display: 'flex', alignItems: 'center' }}>
                                                {expandedQuestion === globalIndex ? (
                                                    <FiChevronUp size={20} style={{ color: 'var(--text-secondary)' }} />
                                                ) : (
                                                    <FiChevronDown size={20} style={{ color: 'var(--text-secondary)' }} />
                                                )}
                                            </div>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {expandedQuestion === globalIndex && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <div style={{
                                                    padding: '0 20px 20px 54px',
                                                    color: 'var(--text-secondary)',
                                                    lineHeight: '1.7',
                                                    fontSize: '0.95rem'
                                                }}>
                                                    <style dangerouslySetInnerHTML={{__html: `
                                                        .interview-ans-content pre {
                                                            background: rgba(0,0,0,0.3);
                                                            padding: 16px;
                                                            border-radius: 8px;
                                                            overflow-x: auto;
                                                            border: 1px solid var(--card-border);
                                                            margin: 12px 0;
                                                        }
                                                        .interview-ans-content code {
                                                            font-family: monospace;
                                                            font-size: 0.9em;
                                                            color: #e2e8f0;
                                                        }
                                                        .interview-ans-content p {
                                                            margin-bottom: 12px;
                                                        }
                                                        .interview-ans-content strong {
                                                            color: var(--text-primary);
                                                        }
                                                    `}} />
                                                    <div className="interview-ans-content" dangerouslySetInnerHTML={{ 
                                                        __html: item.a
                                                            .replace(/```[a-z]*\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>') // multiline code
                                                            .replace(/`([^`]+)`/g, '<code>$1</code>') // inline code
                                                            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // bold
                                                            .replace(/\n/g, '<br/>') // newlines
                                                    }} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    }) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                            <FiSearch size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <h3>No questions found</h3>
                            <p>Try adjusting your search or complexity filter.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '20px',
                        marginTop: '30px',
                        maxWidth: '900px'
                    }}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px', borderRadius: '8px',
                                background: currentPage === 1 ? 'transparent' : 'var(--surface-color)',
                                border: `1px solid ${currentPage === 1 ? 'transparent' : 'var(--card-border)'}`,
                                color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                                cursor: currentPage === 1 ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: currentPage === 1 ? 0.5 : 1
                            }}
                        >
                            <FiChevronLeft /> Previous
                        </button>
                        
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px', borderRadius: '8px',
                                background: currentPage === totalPages ? 'transparent' : 'var(--surface-color)',
                                border: `1px solid ${currentPage === totalPages ? 'transparent' : 'var(--card-border)'}`,
                                color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                                cursor: currentPage === totalPages ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: currentPage === totalPages ? 0.5 : 1
                            }}
                        >
                            Next <FiChevronRight />
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

export default InterviewPrep;
