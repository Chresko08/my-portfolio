import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    // Navigation & UI icons
    FiChevronDown, FiChevronUp, FiBookOpen, FiSearch, FiFilter,
    FiChevronLeft, FiChevronRight, FiCheckCircle, FiStar,
    FiCode, FiCopy, FiCheck, FiTag, FiChevronsDown, FiChevronsUp,
    FiRotateCcw, FiX,
    // Topic Track Icons
    FiDatabase, FiLayers, FiCpu, FiCloud, FiBox,
    FiServer, FiGrid, FiHardDrive, FiActivity, FiCompass,
    FiBarChart2, FiTool, FiTerminal, FiGitBranch, FiShield, FiSend,
    FiFileText, FiPieChart
} from 'react-icons/fi';
import { interviewTopics, interviewQuestions } from '../data/interviewData';

const ITEMS_PER_PAGE = 10;

// Dual lookup mapping for all canonical topic tracks + All Topics fallback
const TOPIC_ICON_MAP = {
    'all': FiBookOpen,
    'advanced-sql': FiDatabase,
    'hadoop-hive': FiLayers,
    'pyspark': FiCpu,
    'python': FiCode,
    'azure': FiCloud,
    'databricks': FiBox,
    'distributed-systems': FiServer,
    'data-modeling': FiGrid,
    'dataproc': FiHardDrive,
    'dataflow': FiActivity,
    'cloud-composer': FiCompass,
    'bigquery': FiBarChart2,
    'dbt': FiTool,
    'unix-shell': FiTerminal,
    'cicd-devops': FiGitBranch,
    'data-governance': FiShield,
    'pubsub-kafka': FiSend,
    'dsa': FiCode,
    'nosql-mongodb': FiDatabase,
    'excel-analytics': FiFileText,
    'data-viz-bi': FiPieChart
};

const getTopicIcon = (topicId) => TOPIC_ICON_MAP[topicId] || FiBookOpen;

const getComplexityColor = (comp) => {
    switch (comp) {
        case 'Basic': return 'var(--accent-emerald)';
        case 'Intermediate': return 'var(--accent-amber)';
        case 'Complex': return '#ef4444';
        default: return 'var(--primary-color)';
    }
};

// Language detector for code snippet header badge
const detectSnippetLanguage = (item) => {
    const code = item.codeSnippet || '';
    const upperCode = code.toUpperCase();
    if (
        upperCode.includes('SELECT') ||
        upperCode.includes('FROM') ||
        upperCode.includes('WITH ') ||
        upperCode.includes('CREATE ') ||
        upperCode.includes('MERGE ') ||
        upperCode.includes('INSERT ') ||
        upperCode.includes('UPDATE ') ||
        code.startsWith('--') ||
        (Array.isArray(item.topics) && item.topics.includes('advanced-sql') && !code.includes('import '))
    ) {
        return 'SQL';
    }
    if (
        code.includes('def ') ||
        code.includes('import ') ||
        code.includes('spark.') ||
        code.includes('pyspark') ||
        code.includes('df.') ||
        code.includes('df_') ||
        code.includes('sc.') ||
        code.includes('beam.') ||
        code.includes('DAG(') ||
        (Array.isArray(item.topics) && (item.topics.includes('pyspark') || item.topics.includes('python') || item.topics.includes('cloud-composer') || item.topics.includes('dataflow')) && !upperCode.includes('MERGE ') && !code.includes('gcloud'))
    ) {
        return 'Python / PySpark';
    }
    if (
        code.includes('#!/bin') ||
        code.includes('bash') ||
        code.includes('curl ') ||
        code.includes('awk ') ||
        code.includes('sed ') ||
        code.includes('grep ') ||
        code.includes('chmod ') ||
        code.includes('cron') ||
        code.includes('gcloud ') ||
        code.includes('kafka-') ||
        (Array.isArray(item.topics) && item.topics.includes('unix-shell'))
    ) {
        return 'Shell';
    }
    if (
        code.includes('resource ') ||
        code.includes('provider ') ||
        code.includes('terraform')
    ) {
        return 'Terraform / IaC';
    }
    if (
        code.includes('version:') ||
        code.includes('models:') ||
        code.includes('config(') ||
        code.includes('ref(') ||
        code.includes('source(') ||
        (Array.isArray(item.topics) && item.topics.includes('dbt'))
    ) {
        return 'dbt / Jinja';
    }
    if (
        code.includes('db.') ||
        code.includes('aggregate([') ||
        code.includes('ObjectId(') ||
        (Array.isArray(item.topics) && item.topics.includes('nosql-mongodb'))
    ) {
        return 'MongoDB / NoSQL';
    }
    if (
        code.startsWith('=') ||
        code.includes('CALCULATE(') ||
        code.includes('USERELATIONSHIP') ||
        code.includes('XLOOKUP(') ||
        code.includes('SUMIFS(') ||
        code.includes('FIXED') ||
        (Array.isArray(item.topics) && (item.topics.includes('excel-analytics') || item.topics.includes('data-viz-bi')))
    ) {
        return 'Excel / DAX';
    }
    return 'Implementation';
};

// 5-Stage Robust Markdown Formatter:
// 1. Shelters code blocks
// 2. Shelters inline code
// 3. Escapes bare HTML entities in remaining narrative text
// 4. Applies typography (headings, bold, italic, bullet points, linebreaks)
// 5. Restores sheltered code without corrupting special regex characters ($)
const formatMarkdown = (text) => {
    if (!text) return "";

    // 1. Sheltered code blocks
    const codeBlocks = [];
    let processed = text.replace(/```([a-zA-Z0-9_-]*)\r?\n?([\s\S]*?)```/g, (match, lang, code) => {
        const escapedCode = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        const index = codeBlocks.length;
        const langBadge = lang.trim()
            ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px; text-transform:uppercase; font-weight:700; letter-spacing:0.5px;">${lang.trim()}</div>`
            : "";
        codeBlocks.push(
            `<div class="code-block-wrapper">${langBadge}<pre><code>${escapedCode.trim()}</code></pre></div>`
        );
        return `__MD_CODE_BLOCK_${index}__`;
    });

    // 2. Sheltered inline code
    const inlineCodes = [];
    processed = processed.replace(/`([^`]+)`/g, (match, code) => {
        const escaped = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        const index = inlineCodes.length;
        inlineCodes.push(`<code class="md-inline-code">${escaped}</code>`);
        return `__MD_INLINE_CODE_${index}__`;
    });

    // 3. Escape raw HTML entities in narrative text to eliminate comment swallow bugs (e.g. `<--`)
    processed = processed
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 4. Typography & Layout
    processed = processed.replace(/^### (.*$)/gim, '<h4 class="md-subheading">$1</h4>');
    processed = processed.replace(/^## (.*$)/gim, '<h3 class="md-heading">$1</h3>');
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong class="md-bold">$1</strong>');
    processed = processed.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em class="md-italic">$1</em>');
    processed = processed.replace(/^[-*] (.*$)/gim, '<div class="md-bullet-item"><span class="md-bullet">&bull;</span><span>$1</span></div>');
    processed = processed.replace(/\r?\n/g, "<br/>");

    // 5. Restore sheltered code using function replacer to prevent $ substitution issues
    inlineCodes.forEach((codeHtml, idx) => {
        processed = processed.replace(`__MD_INLINE_CODE_${idx}__`, () => codeHtml);
    });
    codeBlocks.forEach((codeHtml, idx) => {
        processed = processed.replace(`__MD_CODE_BLOCK_${idx}__`, () => codeHtml);
    });

    return processed;
};

const InterviewPrep = ({ viewMode }) => {
    // Strictly preserve private access guard — returns null for non-personal viewMode
    if (viewMode !== 'personal') return null;

    // Filter, search & pagination states
    const [activeTopic, setActiveTopic] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [complexityFilter, setComplexityFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    // Multi-accordion tracking via dictionary { [id]: boolean }
    const [expandedIds, setExpandedIds] = useState({});

    // LocalStorage question progress & bookmark tracking
    const [questionStatuses, setQuestionStatuses] = useState({});

    // Snippet copy state tracking
    const [copiedSnippetId, setCopiedSnippetId] = useState(null);

    // Load saved statuses from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('interviewQuestionStatuses');
            if (saved) {
                setQuestionStatuses(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Error loading interview question statuses from localStorage", e);
        }
    }, []);

    // Toggle bookmark / completed status with localStorage persistence
    const toggleStatus = useCallback((qNo, type, e) => {
        e.stopPropagation();
        setQuestionStatuses(prev => {
            const current = prev[qNo] || { completed: false, review: false };
            const updated = {
                ...prev,
                [qNo]: {
                    ...current,
                    [type]: !current[type]
                }
            };
            try {
                localStorage.setItem('interviewQuestionStatuses', JSON.stringify(updated));
            } catch (err) {
                console.error("Error saving status to localStorage", err);
            }
            return updated;
        });
    }, []);

    // Clipboard copy handler with secure context fallback
    const handleCopySnippet = useCallback((id, code, e) => {
        e.stopPropagation();
        const copyPromise = navigator?.clipboard?.writeText
            ? navigator.clipboard.writeText(code)
            : new Promise((resolve, reject) => {
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = code;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-999999px";
                    textArea.style.top = "-999999px";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    if (successful) resolve();
                    else reject(new Error('execCommand failed'));
                } catch (err) {
                    reject(err);
                }
            });

        copyPromise
            .then(() => {
                setCopiedSnippetId(id);
                setTimeout(() => setCopiedSnippetId(null), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy snippet to clipboard", err);
            });
    }, []);

    // Lookup map for fast topic metadata resolution
    const topicMap = useMemo(() => {
        const map = {};
        for (const topic of interviewTopics) {
            map[topic.id] = topic;
        }
        return map;
    }, []);

    // Precomputed live question counts per topic (O(N) single pass over 141 questions)
    const topicCounts = useMemo(() => {
        const counts = { all: interviewQuestions.length };
        for (const topic of interviewTopics) {
            counts[topic.id] = 0;
        }
        for (const q of interviewQuestions) {
            if (Array.isArray(q.topics)) {
                for (const t of q.topics) {
                    if (counts[t] !== undefined) {
                        counts[t]++;
                    }
                }
            }
        }
        return counts;
    }, []);

    // 18 Filter tabs: All Topics + 17 canonical topic tracks
    const tabs = useMemo(() => [
        { id: 'all', title: 'All Topics', count: topicCounts.all },
        ...interviewTopics.map(t => ({
            id: t.id,
            title: t.title,
            count: topicCounts[t.id] || 0
        }))
    ], [topicCounts]);

    const activeTopicObj = activeTopic === 'all' ? null : topicMap[activeTopic];

    // Filter pipeline: Many-to-Many Topic + Complexity + Real-Time Tokenized Search
    const filteredQuestions = useMemo(() => {
        const terms = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);

        return interviewQuestions.filter(q => {
            // 1. Many-to-many topic filtering
            if (activeTopic !== 'all') {
                if (!Array.isArray(q.topics) || !q.topics.includes(activeTopic)) {
                    return false;
                }
            }

            // 2. Complexity filtering
            if (complexityFilter !== 'All') {
                if (q.complexity !== complexityFilter) {
                    return false;
                }
            }

            // 3. Multi-field tokenized search (all terms must match across q, a, codeSnippet, topics, tags, qNo, id)
            if (terms.length > 0) {
                const qText = (q.q || '').toLowerCase();
                const aText = (q.a || '').toLowerCase();
                const codeText = (q.codeSnippet || '').toLowerCase();
                const tags = Array.isArray(q.tags) ? q.tags.map(t => t.toLowerCase()) : [];
                const topics = Array.isArray(q.topics) ? q.topics.map(t => t.toLowerCase()) : [];
                const topicTitles = topics.map(t => (topicMap[t]?.title || '').toLowerCase());
                const qNoStr = String(q.qNo ?? '').toLowerCase();
                const qNoHash = `#${qNoStr}`;
                const qId = (q.id || '').toLowerCase();

                const matchesAllTerms = terms.every(term => {
                    const cleanTerm = term.replace(/^(#|q\.?)/i, '');
                    if (qNoStr === cleanTerm || qNoHash === term || `q${qNoStr}` === term) return true;
                    if (qId.includes(term)) return true;
                    if (qText.includes(term)) return true;
                    if (aText.includes(term)) return true;
                    if (codeText.includes(term)) return true;
                    if (tags.some(tag => tag.includes(term))) return true;
                    if (topics.some(top => top.includes(term))) return true;
                    if (topicTitles.some(title => title.includes(term))) return true;
                    return false;
                });

                if (!matchesAllTerms) return false;
            }

            return true;
        });
    }, [activeTopic, complexityFilter, searchTerm, topicMap]);

    // Safe pagination calculation to avoid render-phase state updates
    const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);

    const paginatedQuestions = useMemo(() => {
        const start = (safePage - 1) * ITEMS_PER_PAGE;
        return filteredQuestions.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredQuestions, safePage]);

    // Handler helpers
    const handleTopicChange = (topicId) => {
        setActiveTopic(topicId);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleComplexityChange = (comp) => {
        setComplexityFilter(comp);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setActiveTopic('all');
        setSearchTerm('');
        setComplexityFilter('All');
        setCurrentPage(1);
    };

    const toggleQuestion = (qId) => {
        setExpandedIds(prev => ({
            ...prev,
            [qId]: !prev[qId]
        }));
    };

    const handleExpandAll = () => {
        const next = { ...expandedIds };
        paginatedQuestions.forEach(q => {
            next[q.id] = true;
        });
        setExpandedIds(next);
    };

    const handleCollapseAll = () => {
        setExpandedIds({});
    };

    // Summary counters
    const completedCount = useMemo(() => {
        return Object.values(questionStatuses).filter(s => s?.completed).length;
    }, [questionStatuses]);

    const reviewCount = useMemo(() => {
        return Object.values(questionStatuses).filter(s => s?.review).length;
    }, [questionStatuses]);

    return (
        <section id="interview-prep" className="section" style={{ paddingTop: '80px', paddingBottom: '70px' }}>
            {/* Scoped CSS Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .interview-ans-content pre {
                    background: rgba(10, 14, 26, 0.85);
                    padding: 16px;
                    border-radius: 10px;
                    overflow-x: auto;
                    border: 1px solid var(--card-border);
                    margin: 14px 0;
                    max-width: 100%;
                    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.35);
                }
                .interview-ans-content code {
                    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
                    font-size: 0.88em;
                    color: #e2e8f0;
                }
                .interview-ans-content .md-inline-code {
                    background: rgba(99, 102, 241, 0.15);
                    padding: 2px 6px;
                    border-radius: 4px;
                    color: #a5b4fc;
                    border: 1px solid rgba(99, 102, 241, 0.25);
                    font-size: 0.88em;
                    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
                }
                .interview-ans-content .md-heading {
                    margin: 18px 0 8px 0;
                    color: var(--text-primary);
                    font-size: 1.05rem;
                    font-weight: 700;
                }
                .interview-ans-content .md-subheading {
                    margin: 14px 0 6px 0;
                    color: var(--text-primary);
                    font-size: 0.95rem;
                    font-weight: 600;
                }
                .interview-ans-content .md-bold {
                    color: var(--text-primary);
                    font-weight: 700;
                }
                .interview-ans-content .md-italic {
                    font-style: italic;
                    color: var(--text-secondary);
                }
                .interview-ans-content .md-bullet-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    margin-bottom: 6px;
                    line-height: 1.6;
                }
                .interview-ans-content .md-bullet {
                    color: var(--primary-color);
                    font-size: 1.1rem;
                    line-height: 1.2;
                    flex-shrink: 0;
                }
                .code-snippet-card {
                    margin-top: 18px;
                    border-radius: 10px;
                    border: 1px solid var(--card-border);
                    overflow: hidden;
                    background: rgba(10, 14, 26, 0.7);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                }
                .code-snippet-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 16px;
                    background: rgba(255, 255, 255, 0.04);
                    border-bottom: 1px solid var(--card-border);
                    font-size: 0.82rem;
                    color: var(--text-secondary);
                }
                .code-snippet-body {
                    margin: 0;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.4);
                    overflow-x: auto;
                    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
                    font-size: 0.85rem;
                    line-height: 1.55;
                    color: #f1f5f9;
                }
                .interview-topic-tab {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .interview-topic-tab:hover {
                    transform: translateY(-1px);
                    border-color: var(--card-border-hover);
                }
                @media (max-width: 640px) {
                    .interview-card-btn {
                        padding: 14px 12px !important;
                        gap: 10px !important;
                    }
                    .interview-card-body {
                        padding: 0 12px 16px 12px !important;
                    }
                    .interview-actions-group {
                        gap: 4px !important;
                    }
                    .interview-list-header {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 12px !important;
                    }
                    .code-snippet-body {
                        padding: 12px !important;
                        font-size: 0.78rem !important;
                    }
                    .stats-counter-bar {
                        gap: 12px !important;
                        padding: 10px 14px !important;
                    }
                }
            `}} />

            <div className="container">
                {/* Header Title & Subtitle */}
                <div className="section-title-wrap" style={{ marginBottom: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="section-subtitle">Exclusive Content</span>
                    <h2 className="section-heading">
                        Interview <span className="gradient-text">Preparation</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '1rem', maxWidth: '820px', margin: '10px auto 22px auto', lineHeight: '1.6' }}>
                        A comprehensive, 17-topic technical mastery curriculum for Senior Data Engineering interviews. Featuring real-world distributed architectures, lakehouse internals, query tuning, streaming patterns, and system design trade-offs.
                    </p>

                    {/* Stats Counter Bar */}
                    <div className="stats-counter-bar" style={{
                        display: 'inline-flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '20px',
                        padding: '12px 24px',
                        background: 'var(--surface-color)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '14px',
                        fontSize: '0.88rem',
                        color: 'var(--text-secondary)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                        backdropFilter: 'blur(8px)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '65px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                {interviewQuestions.length}
                            </span>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Total Qs</span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--card-border)', alignSelf: 'stretch' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '65px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                {activeTopic === 'all' ? interviewQuestions.length : (topicCounts[activeTopic] || 0)}
                            </span>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>In Track</span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--card-border)', alignSelf: 'stretch' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '65px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                                {filteredQuestions.length}
                            </span>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Filtered</span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--card-border)', alignSelf: 'stretch' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '65px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                                {completedCount}
                            </span>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Done</span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--card-border)', alignSelf: 'stretch' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '65px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>
                                {reviewCount}
                            </span>
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>Starred</span>
                        </div>
                    </div>
                </div>

                {/* 17 Topics + All Topics Interactive Filter Pills */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '10px',
                    maxWidth: '1140px',
                    margin: '0 auto 24px auto'
                }}>
                    {tabs.map((tab) => {
                        const TabIcon = getTopicIcon(tab.id);
                        const isActive = activeTopic === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTopicChange(tab.id)}
                                className="interview-topic-tab"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    borderRadius: '9999px',
                                    fontSize: '0.85rem',
                                    fontWeight: isActive ? 600 : 500,
                                    cursor: 'pointer',
                                    background: isActive
                                        ? 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))'
                                        : 'var(--surface-color)',
                                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                                    border: isActive ? '1px solid transparent' : '1px solid var(--card-border)',
                                    boxShadow: isActive ? '0 4px 14px -2px var(--glow-color)' : 'none',
                                    backdropFilter: 'blur(8px)',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <TabIcon size={15} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.8 }} />
                                <span>{tab.title}</span>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '1px 7px',
                                        borderRadius: '9999px',
                                        background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--badge-bg)',
                                        color: isActive ? '#ffffff' : 'var(--primary-color)',
                                        border: isActive ? 'none' : '1px solid var(--badge-border)',
                                        marginLeft: '2px',
                                        lineHeight: '1.4'
                                    }}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Active Track Focus Banner */}
                {activeTopicObj && (
                    <div style={{
                        maxWidth: '960px',
                        margin: '0 auto 24px auto',
                        padding: '12px 20px',
                        background: 'var(--surface-color)',
                        borderRadius: '12px',
                        border: '1px solid var(--card-border)',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap',
                        backdropFilter: 'blur(8px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {React.createElement(getTopicIcon(activeTopicObj.id), { size: 18, style: { color: 'var(--primary-color)', flexShrink: 0 } })}
                            <div>
                                <strong style={{ color: 'var(--text-primary)', marginRight: '6px' }}>{activeTopicObj.title} Focus:</strong>
                                <span>{activeTopicObj.description}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleTopicChange('all')}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--card-border)',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                color: 'var(--primary-color)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            View All Tracks
                        </button>
                    </div>
                )}

                {/* Controls: Search Bar and Complexity Filter */}
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '14px', 
                    marginBottom: '26px', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    maxWidth: '960px',
                    margin: '0 auto 26px auto'
                }}>
                    {/* Search Input */}
                    <div style={{ 
                        position: 'relative', 
                        flex: '1 1 320px',
                        maxWidth: '540px'
                    }}>
                        <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input 
                            type="text" 
                            placeholder="Search questions, answers, code, tags..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{
                                width: '100%',
                                padding: '12px 40px 12px 44px',
                                borderRadius: '12px',
                                border: '1px solid var(--card-border)',
                                background: 'var(--surface-color)',
                                color: 'var(--text-primary)',
                                fontSize: '0.92rem',
                                outline: 'none',
                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                backdropFilter: 'blur(8px)'
                            }}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '4px'
                                }}
                                title="Clear search"
                            >
                                <FiX size={16} />
                            </button>
                        )}
                    </div>

                    {/* Right Controls: Complexity Filter + Clear */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '4px', 
                            background: 'var(--surface-color)', 
                            padding: '5px 8px', 
                            borderRadius: '12px', 
                            border: '1px solid var(--card-border)' 
                        }}>
                            <FiFilter style={{ color: 'var(--text-muted)', marginLeft: '4px', marginRight: '4px' }} size={14} />
                            {['All', 'Basic', 'Intermediate', 'Complex'].map(comp => {
                                const isSelected = complexityFilter === comp;
                                return (
                                    <button
                                        key={comp}
                                        onClick={() => handleComplexityChange(comp)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '0.82rem',
                                            fontWeight: isSelected ? 600 : 500,
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: isSelected ? 'var(--badge-bg)' : 'transparent',
                                            color: isSelected ? 'var(--primary-color)' : 'var(--text-secondary)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {comp}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Reset Filters Button (active when filters are applied) */}
                        {(activeTopic !== 'all' || complexityFilter !== 'All' || searchTerm.trim() !== '') && (
                            <button
                                onClick={handleClearFilters}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    borderRadius: '10px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.25)',
                                    color: '#ef4444',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                title="Reset all filters to defaults"
                            >
                                <FiRotateCcw size={13} />
                                <span>Reset</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* List Header Bar: Item count and Expand/Collapse actions */}
                <div className="interview-list-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    maxWidth: '960px',
                    margin: '0 auto 16px auto',
                    padding: '0 4px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.88rem'
                }}>
                    <div>
                        <span>
                            Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredQuestions.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}</strong>
                            {' '}-{' '}
                            <strong style={{ color: 'var(--text-primary)' }}>{Math.min(safePage * ITEMS_PER_PAGE, filteredQuestions.length)}</strong>
                            {' '}of{' '}
                            <strong style={{ color: 'var(--text-primary)' }}>{filteredQuestions.length}</strong> questions
                        </span>
                        {activeTopic !== 'all' && (
                            <span style={{ marginLeft: '8px', color: 'var(--primary-color)', fontWeight: 600 }}>
                                ({topicMap[activeTopic]?.title})
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={handleExpandAll}
                            disabled={paginatedQuestions.length === 0}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: 'var(--surface-color)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: paginatedQuestions.length === 0 ? 'default' : 'pointer',
                                opacity: paginatedQuestions.length === 0 ? 0.5 : 1,
                                transition: 'all 0.2s ease'
                            }}
                            title="Expand all questions on this page"
                        >
                            <FiChevronsDown size={14} />
                            <span>Expand All</span>
                        </button>
                        <button
                            onClick={handleCollapseAll}
                            disabled={paginatedQuestions.length === 0}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: 'var(--surface-color)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: paginatedQuestions.length === 0 ? 'default' : 'pointer',
                                opacity: paginatedQuestions.length === 0 ? 0.5 : 1,
                                transition: 'all 0.2s ease'
                            }}
                            title="Collapse all questions"
                        >
                            <FiChevronsUp size={14} />
                            <span>Collapse All</span>
                        </button>
                    </div>
                </div>

                {/* Question Accordion List */}
                <div style={{ maxWidth: '960px', margin: '0 auto', minHeight: '400px' }}>
                    {paginatedQuestions.length > 0 ? (
                        paginatedQuestions.map((item) => {
                            const isCompleted = Boolean(questionStatuses[item.qNo]?.completed);
                            const isStarred = Boolean(questionStatuses[item.qNo]?.review);
                            const isExpanded = Boolean(expandedIds[item.id]);

                            return (
                                <div key={item.id} style={{ marginBottom: '14px' }}>
                                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                                        {/* Question Accordion Button Header */}
                                        <button
                                            onClick={() => toggleQuestion(item.id)}
                                            className="interview-card-btn"
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                padding: '18px 20px',
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--text-primary)',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                gap: '14px',
                                                transition: 'background-color 0.2s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: 0 }}>
                                                <FiBookOpen style={{ color: 'var(--primary-color)', marginTop: '4px', flexShrink: 0 }} size={18} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
                                                    {/* Question Title */}
                                                    <span style={{ 
                                                        lineHeight: '1.45',
                                                        textDecoration: isCompleted ? 'line-through' : 'none',
                                                        color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                                                        opacity: isCompleted ? 0.65 : 1,
                                                        transition: 'all 0.2s ease',
                                                        wordBreak: 'break-word'
                                                    }}>
                                                        {item.qNo && (
                                                            <span style={{ color: 'var(--primary-color)', marginRight: '6px', fontWeight: 700 }}>
                                                                Q{item.qNo}.
                                                            </span>
                                                        )}
                                                        {item.q}
                                                    </span>

                                                    {/* Badges: Complexity & Topics */}
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                                                        {item.complexity && (
                                                            <span style={{ 
                                                                fontSize: '0.72rem', 
                                                                fontWeight: 700, 
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                color: getComplexityColor(item.complexity),
                                                                background: `color-mix(in srgb, ${getComplexityColor(item.complexity)} 14%, transparent)`,
                                                                padding: '2px 8px',
                                                                borderRadius: '4px'
                                                            }}>
                                                                {item.complexity}
                                                            </span>
                                                        )}

                                                        {Array.isArray(item.topics) && item.topics.map(tId => {
                                                            const topicInfo = topicMap[tId];
                                                            const title = topicInfo?.title || tId;
                                                            return (
                                                                <span 
                                                                    key={tId}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleTopicChange(tId);
                                                                    }}
                                                                    title={`Filter by track: ${title}`}
                                                                    style={{
                                                                        fontSize: '0.72rem',
                                                                        fontWeight: 600,
                                                                        padding: '2px 8px',
                                                                        borderRadius: '4px',
                                                                        background: 'rgba(99, 102, 241, 0.1)',
                                                                        color: 'var(--primary-color)',
                                                                        border: '1px solid rgba(99, 102, 241, 0.22)',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.2s ease'
                                                                    }}
                                                                >
                                                                    {title}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons: Star (Bookmark), Checkmark (Complete), Chevron */}
                                            <div className="interview-actions-group" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
                                                <button 
                                                    onClick={(e) => toggleStatus(item.qNo, 'review', e)}
                                                    title={isStarred ? "Starred for Review" : "Star for Review"}
                                                    style={{
                                                        background: isStarred ? 'rgba(245, 158, 11, 0.14)' : 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '6px',
                                                        borderRadius: '8px',
                                                        color: isStarred ? '#f59e0b' : 'var(--text-muted)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: '34px',
                                                        minHeight: '34px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <FiStar size={17} fill={isStarred ? '#f59e0b' : 'none'} />
                                                </button>

                                                <button 
                                                    onClick={(e) => toggleStatus(item.qNo, 'completed', e)}
                                                    title={isCompleted ? "Mark Incomplete" : "Mark Completed"}
                                                    style={{
                                                        background: isCompleted ? 'rgba(16, 185, 129, 0.14)' : 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: '6px',
                                                        borderRadius: '8px',
                                                        color: isCompleted ? 'var(--accent-emerald)' : 'var(--text-muted)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: '34px',
                                                        minHeight: '34px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <FiCheckCircle size={17} fill={isCompleted ? 'var(--accent-emerald)' : 'none'} color={isCompleted ? 'var(--bg-color)' : 'currentColor'} />
                                                </button>

                                                <div style={{ padding: '4px', display: 'flex', alignItems: 'center' }}>
                                                    {isExpanded ? (
                                                        <FiChevronUp size={20} style={{ color: 'var(--text-secondary)' }} />
                                                    ) : (
                                                        <FiChevronDown size={20} style={{ color: 'var(--text-secondary)' }} />
                                                    )}
                                                </div>
                                            </div>
                                        </button>

                                        {/* Collapsible Content */}
                                        <AnimatePresence initial={false}>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <div className="interview-card-body" style={{
                                                        padding: '0 20px 20px 52px',
                                                        color: 'var(--text-secondary)',
                                                        lineHeight: '1.7',
                                                        fontSize: '0.94rem'
                                                    }}>
                                                        {/* Narrative Answer */}
                                                        <div 
                                                            className="interview-ans-content" 
                                                            dangerouslySetInnerHTML={{ __html: formatMarkdown(item.a) }} 
                                                        />

                                                        {/* Dedicated Prominent Code Snippet Card */}
                                                        {item.codeSnippet && (
                                                            <div className="code-snippet-card">
                                                                <div className="code-snippet-header">
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                                                        <FiCode size={14} style={{ color: 'var(--primary-color)' }} />
                                                                        <span>Key Implementation Snippet</span>
                                                                        <span style={{
                                                                            fontSize: '0.7rem',
                                                                            fontWeight: 700,
                                                                            padding: '1px 6px',
                                                                            borderRadius: '4px',
                                                                            background: 'rgba(255, 255, 255, 0.08)',
                                                                            color: 'var(--text-muted)',
                                                                            textTransform: 'uppercase',
                                                                            letterSpacing: '0.5px'
                                                                        }}>
                                                                            {detectSnippetLanguage(item)}
                                                                        </span>
                                                                    </span>
                                                                    <button
                                                                        onClick={(e) => handleCopySnippet(item.id, item.codeSnippet, e)}
                                                                        style={{
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            gap: '5px',
                                                                            background: copiedSnippetId === item.id ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.08)',
                                                                            color: copiedSnippetId === item.id ? '#ffffff' : 'var(--text-secondary)',
                                                                            border: '1px solid var(--card-border)',
                                                                            borderRadius: '6px',
                                                                            padding: '4px 10px',
                                                                            fontSize: '0.75rem',
                                                                            fontWeight: 600,
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.2s ease'
                                                                        }}
                                                                        title="Copy code to clipboard"
                                                                    >
                                                                        {copiedSnippetId === item.id ? (
                                                                            <>
                                                                                <FiCheck size={13} />
                                                                                <span>Copied!</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FiCopy size={13} />
                                                                                <span>Copy Code</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                <pre className="code-snippet-body">
                                                                    <code>{item.codeSnippet}</code>
                                                                </pre>
                                                            </div>
                                                        )}

                                                        {/* Cross-Cutting Semantic Tags Footer */}
                                                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                                                            <div style={{
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                gap: '6px',
                                                                marginTop: '16px',
                                                                paddingTop: '12px',
                                                                borderTop: '1px solid var(--card-border)',
                                                                alignItems: 'center'
                                                            }}>
                                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                    <FiTag size={12} /> Tags:
                                                                </span>
                                                                {item.tags.map(tag => (
                                                                    <span
                                                                        key={tag}
                                                                        onClick={() => {
                                                                            setSearchTerm(tag);
                                                                            setCurrentPage(1);
                                                                        }}
                                                                        title={`Search for #${tag}`}
                                                                        style={{
                                                                            fontSize: '0.72rem',
                                                                            fontFamily: "'JetBrains Mono', monospace",
                                                                            padding: '2px 7px',
                                                                            borderRadius: '4px',
                                                                            background: 'rgba(255, 255, 255, 0.03)',
                                                                            color: 'var(--text-muted)',
                                                                            border: '1px solid var(--card-border)',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.2s ease'
                                                                        }}
                                                                    >
                                                                        #{tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                            <FiSearch size={40} style={{ marginBottom: '16px', opacity: 0.5, color: 'var(--primary-color)' }} />
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No matching interview questions</h3>
                            <p style={{ maxWidth: '420px', margin: '0 auto 20px auto', fontSize: '0.92rem' }}>
                                No questions match your current track, complexity, or search criteria.
                            </p>
                            <button
                                onClick={handleClearFilters}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 18px',
                                    borderRadius: '8px',
                                    background: 'var(--primary-color)',
                                    border: 'none',
                                    color: '#ffffff',
                                    fontSize: '0.88rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease'
                                }}
                            >
                                <FiRotateCcw size={14} /> Reset Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '12px',
                        marginTop: '32px',
                        maxWidth: '960px',
                        margin: '32px auto 0 auto',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            style={{
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                padding: '8px 16px', 
                                borderRadius: '8px',
                                background: safePage === 1 ? 'transparent' : 'var(--surface-color)',
                                border: `1px solid ${safePage === 1 ? 'transparent' : 'var(--card-border)'}`,
                                color: safePage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                                cursor: safePage === 1 ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: safePage === 1 ? 0.4 : 1,
                                fontSize: '0.88rem'
                            }}
                        >
                            <FiChevronLeft size={16} /> Previous
                        </button>
                        
                        {/* Numbered Page Buttons */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                                if (
                                    totalPages > 7 &&
                                    pageNum !== 1 &&
                                    pageNum !== totalPages &&
                                    Math.abs(pageNum - safePage) > 2
                                ) {
                                    if (pageNum === 2 && safePage > 4) {
                                        return <span key="ellipsis-start" style={{ padding: '0 4px', color: 'var(--text-muted)' }}>...</span>;
                                    }
                                    if (pageNum === totalPages - 1 && safePage < totalPages - 3) {
                                        return <span key="ellipsis-end" style={{ padding: '0 4px', color: 'var(--text-muted)' }}>...</span>;
                                    }
                                    return null;
                                }

                                const isActive = pageNum === safePage;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        style={{
                                            minWidth: '34px',
                                            height: '34px',
                                            padding: '0 8px',
                                            borderRadius: '8px',
                                            border: isActive ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
                                            background: isActive ? 'var(--primary-color)' : 'var(--surface-color)',
                                            color: isActive ? '#ffffff' : 'var(--text-secondary)',
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            style={{
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                padding: '8px 16px', 
                                borderRadius: '8px',
                                background: safePage === totalPages ? 'transparent' : 'var(--surface-color)',
                                border: `1px solid ${safePage === totalPages ? 'transparent' : 'var(--card-border)'}`,
                                color: safePage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                                cursor: safePage === totalPages ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: safePage === totalPages ? 0.4 : 1,
                                fontSize: '0.88rem'
                            }}
                        >
                            Next <FiChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default InterviewPrep;
