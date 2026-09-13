import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiExternalLink, FiCheck } from 'react-icons/fi';

const Experience = () => {
    const [activeTab, setActiveTab] = useState('work');

    const experiences = [
        {
            id: 1,
            role: 'Business Analyst',
            company: 'EY',
            client: 'Client: American Express',
            date: 'Nov 2024 – Present',
            status: 'Current Role',
            metrics: ['+20% Data Quality', '500+ SQL Rules', 'ODL Architecture'],
            description: 'Spearheading the data quality modernization program for a major global card issuer. Designed over 500 complex validation rules and architected a new Operational Data Layer (ODL).',
            highlights: [
                'Architected the new Operational Data Layer (ODL) supporting targeted marketing campaigns and high-volume customer redemptions.',
                'Developed 500+ automated SQL/BigQuery rules reducing rule failure rates and increasing downstream campaign precision.',
                'Collaborated with global business teams and engineering leads to align data models with enterprise compliance standards.'
            ]
        },
        {
            id: 2,
            role: 'Big Data Engineer',
            company: 'Infosys',
            client: 'Clients: Bank of America, HCSC',
            date: 'Aug 2021 – Aug 2024',
            status: '3 Years',
            metrics: ['60% Automation Speedup', '25% Cost Reduction', 'Teradata → Hadoop'],
            description: 'Engineered scalable big data solutions for premier investment banking and healthcare clients, automating critical data pipelines and leading large-scale cloud migrations.',
            highlights: [
                'Optimized high-volume ETL pipelines by 60% through custom automation and workload orchestration.',
                'Led cloud transformation initiatives migrating PySpark and Scala pipelines to Microsoft Azure, reducing operational costs by 25%.',
                'Spearheaded the migration of legacy Teradata data marts to modern distributed Hadoop/Hive clusters, handling terabyte-scale datasets without downtime.'
            ]
        }
    ];

    const internships = [
        {
            id: 1,
            role: 'System Engineer Intern',
            company: 'Infosys',
            client: 'Training Program',
            date: 'Feb 2021 – May 2021',
            status: 'Completed (81.6% Score)',
            metrics: ['LAMP Stack', 'Full-Stack Portal', 'Assessment: 81.6%'],
            description: 'Completed rigorous training on the LAMP stack and engineered a collaborative "Learner-Teacher Portal" for automated session scheduling.',
            highlights: [
                'Attained an 81.6% distinction in the comprehensive final technical assessment.',
                'Collaborated in a four-member engineering team to build a session scheduling portal with slot booking and course management.',
                'Implemented backend business logic and database integration for dynamic availability calendars.'
            ],
            certificate: 'https://drive.google.com/file/d/1TjlwMY3z7vPEvEU8M129hOcabnEyzdBK/view?usp=drive_link'
        }
    ];

    const currentList = activeTab === 'work' ? experiences : internships;

    return (
        <section id="experience" className="section">
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-subtitle">Career Pathway</span>
                    <h2 className="section-heading">
                        Work <span className="gradient-text">Experience</span>
                    </h2>
                </div>

                {/* Interactive Experience Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${activeTab === 'work' ? 'active' : ''}`}
                        onClick={() => setActiveTab('work')}
                    >
                        💼 Professional Experience ({experiences.length})
                    </button>
                    <button
                        className={`filter-tab ${activeTab === 'internships' ? 'active' : ''}`}
                        onClick={() => setActiveTab('internships')}
                    >
                        🎓 Internships & Training ({internships.length})
                    </button>
                </div>

                {/* Timeline Container */}
                <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
                    {/* Glowing vertical line */}
                    <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '10px',
                        bottom: '10px',
                        width: '2px',
                        background: 'linear-gradient(to bottom, var(--primary-color), var(--accent-purple), transparent)',
                        borderRadius: '2px',
                        opacity: 0.7
                    }} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentList.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    style={{
                                        position: 'relative',
                                        paddingLeft: '60px',
                                        marginBottom: '45px'
                                    }}
                                >
                                    {/* Timeline Node Dot */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '11px',
                                        top: '24px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: 'var(--bg-color)',
                                        border: '3px solid var(--primary-color)',
                                        boxShadow: '0 0 12px var(--primary-color)',
                                        zIndex: 2
                                    }} />

                                    {/* Experience Glass Card */}
                                    <div className="glass-card" style={{ padding: '28px' }}>
                                        {/* Header Row */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            flexWrap: 'wrap',
                                            gap: '12px',
                                            marginBottom: '12px'
                                        }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '4px' }}>
                                                    {item.role}
                                                </h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                                                        {item.company}
                                                    </span>
                                                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                                                        {item.client}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '4px 12px',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.82rem',
                                                    fontWeight: 600,
                                                    background: 'var(--badge-bg)',
                                                    border: '1px solid var(--badge-border)',
                                                    color: 'var(--text-primary)'
                                                }}>
                                                    <FiCalendar size={13} style={{ color: 'var(--primary-color)' }} />
                                                    {item.date}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Impact KPI Metric Badges */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '14px 0 16px' }}>
                                            {item.metrics.map((metric) => (
                                                <span key={metric} style={{
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    padding: '3px 10px',
                                                    borderRadius: '6px',
                                                    background: 'rgba(6, 182, 212, 0.1)',
                                                    color: 'var(--accent-cyan)',
                                                    border: '1px solid rgba(6, 182, 212, 0.25)'
                                                }}>
                                                    ⚡ {metric}
                                                </span>
                                            ))}
                                        </div>

                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '16px' }}>
                                            {item.description}
                                        </p>

                                        {/* Highlights list */}
                                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {item.highlights.map((h, hIdx) => (
                                                <li key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: 1.5 }}>
                                                    <FiCheck style={{ color: 'var(--accent-emerald)', marginTop: '4px', flexShrink: 0 }} />
                                                    <span>{h}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Certificate link for internship */}
                                        {item.certificate && (
                                            <a
                                                href={item.certificate}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-secondary"
                                                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                                            >
                                                <span>View Internship Certificate</span>
                                                <FiExternalLink size={13} />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Experience;
