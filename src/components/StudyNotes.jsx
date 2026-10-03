import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiChevronDown, FiChevronUp, FiBook, FiSearch, FiLayers, FiCpu, 
    FiDatabase, FiCloud, FiActivity, FiCheckCircle, FiBookmark, 
    FiCopy, FiCheck, FiArrowRight, FiArrowLeft, FiList
} from 'react-icons/fi';

// Data imports
import { foundationsNotes } from '../data/studyNotes_foundations';
import { bigDataNotes } from '../data/studyNotes_bigdata';
import { modelingNotes } from '../data/studyNotes_modeling';
import { cloudNotes } from '../data/studyNotes_cloud';
import { streamingNotes } from '../data/studyNotes_streaming';

// Domain groups that organize topics into logical clusters
const domainGroups = [
    {
        id: 'foundations',
        label: 'Foundations',
        icon: <FiLayers size={16} />,
        description: 'Advanced SQL, Python & Core CS Internals',
        color: '#6366f1',
        getData: () => foundationsNotes,
    },
    {
        id: 'bigdata',
        label: 'Big Data Ecosystem',
        icon: <FiCpu size={16} />,
        description: 'Hadoop, Hive, Spark & Storage Formats',
        color: '#06b6d4',
        getData: () => bigDataNotes,
    },
    {
        id: 'modeling',
        label: 'Data Modeling & Architecture',
        icon: <FiDatabase size={16} />,
        description: 'DW, Lakehouse, Modeling, SCD & CDC',
        color: '#a855f7',
        getData: () => modelingNotes,
    },
    {
        id: 'cloud',
        label: 'Cloud & Orchestration',
        icon: <FiCloud size={16} />,
        description: 'Airflow, BigQuery, Dataflow, Composer, Dataproc, dbt',
        color: '#10b981',
        getData: () => cloudNotes,
    },
    {
        id: 'streaming',
        label: 'Streaming & Distributed Systems',
        icon: <FiActivity size={16} />,
        description: 'Kafka, Pub/Sub, Flink, Databricks, Distributed Systems & System Design',
        color: '#f59e0b',
        getData: () => streamingNotes,
    },
];

const STANDARD_SECTION_TITLES = [
    "1. Architecture & Core Internals",
    "2. Key Mechanics & Features",
    "3. Performance Tuning & Optimization",
    "4. High-Frequency Interview Patterns",
    "5. Critical Interview Traps & Edge Cases"
];

const SECTION_ICONS = ["🏗️", "⚙️", "🚀", "🎯", "⚠️"];

const StudyNotes = ({ viewMode }) => {
    if (viewMode !== 'all') return null;

    const [activeDomain, setActiveDomain] = useState('foundations');
    const [activeTopic, setActiveTopic] = useState(null);
    const [expandedSections, setExpandedSections] = useState({ 0: true }); // Open section 1 by default
    const [searchTerm, setSearchTerm] = useState('');
    const [completedTopics, setCompletedTopics] = useState({});
    const [bookmarkedTopics, setBookmarkedTopics] = useState({});
    const [copiedIndex, setCopiedIndex] = useState(null);

    const notesContainerRef = useRef(null);

    // Load progress from localStorage
    useEffect(() => {
        try {
            const savedCompleted = localStorage.getItem('studyNotesCompleted');
            const savedBookmarks = localStorage.getItem('studyNotesBookmarks');
            if (savedCompleted) setCompletedTopics(JSON.parse(savedCompleted));
            if (savedBookmarks) setBookmarkedTopics(JSON.parse(savedBookmarks));
        } catch (e) {
            console.error("Error loading study notes progress", e);
        }
    }, []);

    const currentDomain = domainGroups.find(d => d.id === activeDomain);
    const topics = useMemo(() => currentDomain ? currentDomain.getData() : [], [activeDomain]);

    // Set first topic active on domain change
    useEffect(() => {
        if (topics.length > 0) {
            // Keep active topic if it exists in new domain, else pick first
            const exists = topics.some(t => t.id === activeTopic);
            if (!exists) {
                setActiveTopic(topics[0].id);
                setExpandedSections({ 0: true });
                setSearchTerm('');
            }
        }
    }, [activeDomain, topics]);

    const currentTopicIndex = useMemo(() => topics.findIndex(t => t.id === activeTopic), [topics, activeTopic]);
    const currentTopic = useMemo(() => topics[currentTopicIndex] || topics[0], [topics, currentTopicIndex]);

    // Handle search filtering and auto-expanding matched sections
    const filteredSections = useMemo(() => {
        if (!currentTopic || !currentTopic.sections) return [];
        if (!searchTerm.trim()) return currentTopic.sections;

        const lower = searchTerm.toLowerCase();
        return currentTopic.sections.filter(s =>
            s.title.toLowerCase().includes(lower) ||
            (s.content && s.content.toLowerCase().includes(lower))
        );
    }, [currentTopic, searchTerm]);

    // When searching, auto-expand all matching sections
    useEffect(() => {
        if (searchTerm.trim() && currentTopic?.sections) {
            const matchExpanded = {};
            currentTopic.sections.forEach((_, idx) => {
                matchExpanded[idx] = true;
            });
            setExpandedSections(matchExpanded);
        }
    }, [searchTerm, currentTopic]);

    const toggleSection = (idx) => {
        setExpandedSections(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const expandAll = () => {
        if (!currentTopic?.sections) return;
        const allExpanded = {};
        currentTopic.sections.forEach((_, idx) => { allExpanded[idx] = true; });
        setExpandedSections(allExpanded);
    };

    const collapseAll = () => {
        setExpandedSections({});
    };

    const toggleCompleted = (topicId, e) => {
        if (e) e.stopPropagation();
        setCompletedTopics(prev => {
            const updated = { ...prev, [topicId]: !prev[topicId] };
            localStorage.setItem('studyNotesCompleted', JSON.stringify(updated));
            return updated;
        });
    };

    const toggleBookmark = (topicId, e) => {
        if (e) e.stopPropagation();
        setBookmarkedTopics(prev => {
            const updated = { ...prev, [topicId]: !prev[topicId] };
            localStorage.setItem('studyNotesBookmarks', JSON.stringify(updated));
            return updated;
        });
    };

    const navigateTopic = (direction) => {
        if (direction === 'prev' && currentTopicIndex > 0) {
            setActiveTopic(topics[currentTopicIndex - 1].id);
            setExpandedSections({ 0: true });
            setSearchTerm('');
            scrollToTop();
        } else if (direction === 'next' && currentTopicIndex < topics.length - 1) {
            setActiveTopic(topics[currentTopicIndex + 1].id);
            setExpandedSections({ 0: true });
            setSearchTerm('');
            scrollToTop();
        }
    };

    const scrollToTop = () => {
        if (notesContainerRef.current) {
            notesContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Calculate overall stats
    const totalTopics = useMemo(() => domainGroups.reduce((acc, d) => acc + d.getData().length, 0), []);
    const completedCount = Object.values(completedTopics).filter(Boolean).length;
    const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    return (
        <section id="study-notes" className="section" style={{ paddingTop: '80px', paddingBottom: '70px' }}>
            <div className="container" ref={notesContainerRef}>
                {/* Header Banner */}
                <div className="section-title-wrap" style={{ marginBottom: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="section-subtitle">Principal Data Engineer Master Guide</span>
                    <h2 className="section-heading">
                        Interview <span className="gradient-text">Study Notes</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '1rem', maxWidth: '820px', margin: '10px auto 20px auto', lineHeight: '1.65' }}>
                        Rigorous, production-level interview notes covering execution engine internals, distributed mechanics, memory bottlenecks, data skew, and architectural trade-offs across 21 core topics.
                    </p>

                    {/* Overall Study Progress Meter */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '20px',
                        padding: '14px 24px',
                        background: 'var(--surface-color)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '14px',
                        maxWidth: '560px',
                        width: '100%',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Mastery Progress</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 700 }}>
                                    {completedCount} / {totalTopics} Topics Completed ({progressPercent}%)
                                </span>
                            </div>
                            <div style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, var(--primary-color), var(--accent-cyan))',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1. DOMAIN TABS (Level 1 Hierarchy) */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px',
                    justifyContent: 'center'
                }}>
                    {domainGroups.map(domain => {
                        const isDomainActive = activeDomain === domain.id;
                        const domainTopics = domain.getData();
                        const domainCompleted = domainTopics.filter(t => completedTopics[t.id]).length;
                        return (
                            <button
                                key={domain.id}
                                onClick={() => {
                                    setActiveDomain(domain.id);
                                    setSearchTerm('');
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 18px',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    border: isDomainActive ? `2px solid ${domain.color}` : '1px solid var(--card-border)',
                                    background: isDomainActive ? `color-mix(in srgb, ${domain.color} 14%, transparent)` : 'var(--surface-color)',
                                    color: isDomainActive ? domain.color : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                    boxShadow: isDomainActive ? `0 4px 15px color-mix(in srgb, ${domain.color} 20%, transparent)` : 'none'
                                }}
                            >
                                {domain.icon}
                                <span>{domain.label}</span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '2px 7px',
                                    borderRadius: '999px',
                                    background: isDomainActive ? domain.color : 'rgba(255,255,255,0.08)',
                                    color: isDomainActive ? '#ffffff' : 'var(--text-muted)',
                                    fontWeight: 700
                                }}>
                                    {domainCompleted}/{domainTopics.length}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* MOBILE ONLY: Horizontal scrolling topic chips */}
                <div className="study-notes-mobile-topics" style={{
                    display: 'none',
                    overflowX: 'auto',
                    gap: '8px',
                    paddingBottom: '12px',
                    marginBottom: '16px'
                }}>
                    {topics.map(topic => (
                        <button
                            key={topic.id}
                            onClick={() => {
                                setActiveTopic(topic.id);
                                setExpandedSections({ 0: true });
                                setSearchTerm('');
                            }}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '20px',
                                fontSize: '0.82rem',
                                whiteSpace: 'nowrap',
                                border: activeTopic === topic.id ? `1px solid ${currentDomain?.color}` : '1px solid var(--card-border)',
                                background: activeTopic === topic.id ? 'var(--badge-bg)' : 'var(--surface-color)',
                                color: activeTopic === topic.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                                fontWeight: activeTopic === topic.id ? 700 : 500
                            }}
                        >
                            {completedTopics[topic.id] && '✓ '}
                            {topic.title}
                        </button>
                    ))}
                </div>

                {/* MAIN SPLIT VIEW (Sidebar + Content) */}
                <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

                    {/* 2. TOPIC SIDEBAR (Level 2 Hierarchy - Desktop) */}
                    <aside className="study-notes-sidebar" style={{
                        minWidth: '260px',
                        maxWidth: '290px',
                        position: 'sticky',
                        top: '90px',
                        flexShrink: 0
                    }}>
                        <div className="glass-card" style={{ padding: '16px', borderRadius: '16px' }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: '14px', paddingBottom: '10px',
                                borderBottom: '1px solid var(--card-border)'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text-muted)', fontWeight: 700 }}>
                                        Topics in Domain
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: currentDomain?.color, fontWeight: 600 }}>
                                        {currentDomain?.label}
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    {topics.length} Guides
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {topics.map(topic => {
                                    const isSelected = activeTopic === topic.id;
                                    const isDone = completedTopics[topic.id];
                                    const isMarked = bookmarkedTopics[topic.id];

                                    return (
                                        <button
                                            key={topic.id}
                                            onClick={() => {
                                                setActiveTopic(topic.id);
                                                setExpandedSections({ 0: true });
                                                setSearchTerm('');
                                                scrollToTop();
                                            }}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                width: '100%',
                                                padding: '9px 12px',
                                                borderRadius: '10px',
                                                fontSize: '0.88rem',
                                                fontWeight: isSelected ? 700 : 500,
                                                border: isSelected ? `1px solid color-mix(in srgb, ${currentDomain?.color} 40%, transparent)` : '1px solid transparent',
                                                background: isSelected ? 'var(--badge-bg)' : 'transparent',
                                                color: isSelected ? 'var(--primary-color)' : 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <span style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                opacity: isDone ? 0.6 : 1,
                                                textDecoration: isDone ? 'line-through' : 'none'
                                            }}>
                                                {topic.title}
                                            </span>
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                                                <span
                                                    onClick={(e) => toggleBookmark(topic.id, e)}
                                                    title={isMarked ? "Bookmarked" : "Add Bookmark"}
                                                    style={{ cursor: 'pointer', color: isMarked ? '#f59e0b' : 'var(--text-muted)', display: 'flex' }}
                                                >
                                                    <FiBookmark size={14} fill={isMarked ? '#f59e0b' : 'none'} />
                                                </span>
                                                <span
                                                    onClick={(e) => toggleCompleted(topic.id, e)}
                                                    title={isDone ? "Completed" : "Mark as Completed"}
                                                    style={{ cursor: 'pointer', color: isDone ? 'var(--accent-emerald)' : 'var(--text-muted)', display: 'flex' }}
                                                >
                                                    <FiCheckCircle size={14} fill={isDone ? 'var(--accent-emerald)' : 'none'} />
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* 3. CONTENT AREA (Level 3 Hierarchy - 5 Accordion Sections) */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {currentTopic ? (
                            <>
                                {/* Topic Top Bar: Title, Search & Interactive Controls */}
                                <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '22px', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <div>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: currentDomain?.color, marginBottom: '4px' }}>
                                                <span>{currentDomain?.label}</span>
                                                <span>•</span>
                                                <span>Topic {currentTopicIndex + 1} of {topics.length}</span>
                                            </div>
                                            <h3 style={{
                                                fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)',
                                                margin: 0, display: 'flex', alignItems: 'center', gap: '10px'
                                            }}>
                                                <FiBook style={{ color: currentDomain?.color }} size={24} />
                                                {currentTopic.title}
                                            </h3>
                                        </div>

                                        {/* Status Toggles: Complete & Bookmark */}
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <button
                                                onClick={() => toggleBookmark(currentTopic.id)}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    padding: '7px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                                                    border: '1px solid var(--card-border)',
                                                    background: bookmarkedTopics[currentTopic.id] ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-color)',
                                                    color: bookmarkedTopics[currentTopic.id] ? '#f59e0b' : 'var(--text-secondary)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiBookmark size={14} fill={bookmarkedTopics[currentTopic.id] ? '#f59e0b' : 'none'} />
                                                {bookmarkedTopics[currentTopic.id] ? 'Bookmarked' : 'Bookmark'}
                                            </button>

                                            <button
                                                onClick={() => toggleCompleted(currentTopic.id)}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    padding: '7px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                                                    border: '1px solid var(--card-border)',
                                                    background: completedTopics[currentTopic.id] ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface-color)',
                                                    color: completedTopics[currentTopic.id] ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiCheckCircle size={14} fill={completedTopics[currentTopic.id] ? 'var(--accent-emerald)' : 'none'} />
                                                {completedTopics[currentTopic.id] ? 'Completed' : 'Mark Done'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Search & Bulk Section Toggles */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '420px' }}>
                                            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={15} />
                                            <input
                                                type="text"
                                                placeholder={`Search in ${currentTopic.title}...`}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '9px 12px 9px 36px',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--card-border)',
                                                    background: 'var(--bg-color)',
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.85rem',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={expandAll}
                                                style={{
                                                    padding: '7px 13px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                                                    background: 'var(--surface-color)', border: '1px solid var(--card-border)',
                                                    color: 'var(--text-secondary)', cursor: 'pointer'
                                                }}
                                            >
                                                Expand All
                                            </button>
                                            <button
                                                onClick={collapseAll}
                                                style={{
                                                    padding: '7px 13px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                                                    background: 'var(--surface-color)', border: '1px solid var(--card-border)',
                                                    color: 'var(--text-secondary)', cursor: 'pointer'
                                                }}
                                            >
                                                Collapse All
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Jump Links */}
                                <div style={{
                                    display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FiList size={13} /> Quick Jump:
                                    </span>
                                    {STANDARD_SECTION_TITLES.map((title, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setExpandedSections(prev => ({ ...prev, [idx]: true }));
                                                const el = document.getElementById(`section-card-${idx}`);
                                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }}
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                background: expandedSections[idx] ? 'var(--badge-bg)' : 'var(--surface-color)',
                                                border: '1px solid var(--card-border)',
                                                color: expandedSections[idx] ? 'var(--primary-color)' : 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            {SECTION_ICONS[idx]} {title.split('.')[1]?.trim() || title}
                                        </button>
                                    ))}
                                </div>

                                {/* Accordion List of 5 Sections */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {filteredSections.map((section, idx) => {
                                        const isExpanded = !!expandedSections[idx];
                                        const sectionTitle = STANDARD_SECTION_TITLES[idx] || section.title;
                                        const sectionIcon = SECTION_ICONS[idx] || section.icon || "📘";

                                        return (
                                            <div
                                                key={section.id || idx}
                                                id={`section-card-${idx}`}
                                                className="glass-card"
                                                style={{
                                                    padding: 0,
                                                    overflow: 'hidden',
                                                    borderRadius: '14px',
                                                    border: isExpanded ? `1px solid color-mix(in srgb, ${currentDomain?.color} 30%, var(--card-border))` : '1px solid var(--card-border)',
                                                    transition: 'border-color 0.3s ease'
                                                }}
                                            >
                                                <button
                                                    onClick={() => toggleSection(idx)}
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '18px 22px',
                                                        background: isExpanded ? `color-mix(in srgb, ${currentDomain?.color} 5%, transparent)` : 'transparent',
                                                        border: 'none',
                                                        color: 'var(--text-primary)',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '1.02rem',
                                                        fontWeight: 700,
                                                        gap: '12px',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <span style={{ fontSize: '1.25rem' }}>{sectionIcon}</span>
                                                        <span style={{ lineHeight: 1.35 }}>{sectionTitle}</span>
                                                    </div>
                                                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                                        {isExpanded ? (
                                                            <FiChevronUp size={20} style={{ color: currentDomain?.color }} />
                                                        ) : (
                                                            <FiChevronDown size={20} style={{ color: 'var(--text-secondary)' }} />
                                                        )}
                                                    </div>
                                                </button>

                                                <AnimatePresence initial={false}>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.28, ease: 'easeOut' }}
                                                            style={{ overflow: 'hidden' }}
                                                        >
                                                            <div className="study-notes-content" style={{
                                                                padding: '6px 24px 24px 24px',
                                                                color: 'var(--text-secondary)',
                                                                lineHeight: '1.75',
                                                                fontSize: '0.94rem',
                                                                borderTop: '1px solid var(--card-border)'
                                                            }}>
                                                                <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination: Prev & Next Topic Navigation */}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    marginTop: '32px', paddingTop: '20px',
                                    borderTop: '1px solid var(--card-border)'
                                }}>
                                    <button
                                        onClick={() => navigateTopic('prev')}
                                        disabled={currentTopicIndex === 0}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            padding: '10px 18px', borderRadius: '10px',
                                            background: currentTopicIndex === 0 ? 'transparent' : 'var(--surface-color)',
                                            border: `1px solid ${currentTopicIndex === 0 ? 'transparent' : 'var(--card-border)'}`,
                                            color: currentTopicIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                                            cursor: currentTopicIndex === 0 ? 'not-allowed' : 'pointer',
                                            fontWeight: 600, fontSize: '0.88rem',
                                            opacity: currentTopicIndex === 0 ? 0.4 : 1
                                        }}
                                    >
                                        <FiArrowLeft /> Previous: {currentTopicIndex > 0 ? topics[currentTopicIndex - 1]?.title : 'None'}
                                    </button>

                                    <button
                                        onClick={() => navigateTopic('next')}
                                        disabled={currentTopicIndex === topics.length - 1}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            padding: '10px 18px', borderRadius: '10px',
                                            background: currentTopicIndex === topics.length - 1 ? 'transparent' : 'var(--surface-color)',
                                            border: `1px solid ${currentTopicIndex === topics.length - 1 ? 'transparent' : 'var(--card-border)'}`,
                                            color: currentTopicIndex === topics.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                                            cursor: currentTopicIndex === topics.length - 1 ? 'not-allowed' : 'pointer',
                                            fontWeight: 600, fontSize: '0.88rem',
                                            opacity: currentTopicIndex === topics.length - 1 ? 0.4 : 1
                                        }}
                                    >
                                        Next: {currentTopicIndex < topics.length - 1 ? topics[currentTopicIndex + 1]?.title : 'None'} <FiArrowRight />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                                <p>Select a topic to start studying.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Scoped CSS styles for rendering high-density notes cleanly without clutter */}
            <style dangerouslySetInnerHTML={{ __html: `
                .study-notes-content pre {
                    background: rgba(10, 14, 26, 0.7);
                    padding: 18px;
                    border-radius: 12px;
                    overflow-x: auto;
                    border: 1px solid var(--card-border);
                    margin: 14px 0;
                    font-size: 0.88em;
                    box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
                }
                .study-notes-content code {
                    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
                    font-size: 0.9em;
                    color: #f1f5f9;
                }
                .study-notes-content p code,
                .study-notes-content li code,
                .study-notes-content td code {
                    background: rgba(99, 102, 241, 0.15);
                    padding: 2px 7px;
                    border-radius: 5px;
                    color: #a5b4fc;
                    font-size: 0.88em;
                    border: 1px solid rgba(99, 102, 241, 0.2);
                }
                .study-notes-content strong {
                    color: var(--text-primary);
                    font-weight: 700;
                }
                .study-notes-content ul {
                    padding-left: 22px;
                    margin: 10px 0;
                }
                .study-notes-content li {
                    margin-bottom: 8px;
                    line-height: 1.7;
                }
                .study-notes-content table {
                    width: 100%;
                    display: table;
                    border-collapse: collapse;
                    margin: 16px 0;
                    font-size: 0.88em;
                    border-radius: 10px;
                    overflow-x: auto;
                    border: 1px solid var(--card-border);
                }
                .study-notes-content th {
                    background: rgba(99, 102, 241, 0.14);
                    color: var(--text-primary);
                    font-weight: 700;
                    text-align: left;
                    padding: 10px 14px;
                    border: 1px solid var(--card-border);
                }
                .study-notes-content td {
                    padding: 9px 14px;
                    border: 1px solid var(--card-border);
                    vertical-align: top;
                }
                .study-notes-content tr:nth-child(even) {
                    background: rgba(255, 255, 255, 0.02);
                }
                .study-notes-content h3 {
                    color: var(--text-primary);
                    font-size: 1.05rem;
                    margin: 18px 0 8px 0;
                    font-weight: 700;
                }
                .study-notes-content h4 {
                    color: var(--primary-color);
                    font-size: 0.95rem;
                    margin: 14px 0 6px 0;
                    font-weight: 600;
                }
                [data-theme="light"] .study-notes-content pre {
                    background: #f1f5f9;
                    box-shadow: inset 0 1px 4px rgba(0,0,0,0.05);
                }
                [data-theme="light"] .study-notes-content code {
                    color: #0f172a;
                }
                [data-theme="light"] .study-notes-content p code,
                [data-theme="light"] .study-notes-content li code,
                [data-theme="light"] .study-notes-content td code {
                    background: rgba(79, 70, 229, 0.08);
                    color: #4338ca;
                    border-color: rgba(79, 70, 229, 0.2);
                }
                [data-theme="light"] .study-notes-content th {
                    background: rgba(79, 70, 229, 0.08);
                }

                /* Responsive tweaks */
                @media (max-width: 900px) {
                    .study-notes-sidebar {
                        display: none !important;
                    }
                    .study-notes-mobile-topics {
                        display: flex !important;
                    }
                }
            `}} />
        </section>
    );
};

export default StudyNotes;
