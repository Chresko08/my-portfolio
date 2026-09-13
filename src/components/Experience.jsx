import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiExternalLink, FiCheck } from 'react-icons/fi';

const Experience = () => {
    const [activeTab, setActiveTab] = useState('work');

    const experiences = [
        {
            id: 1,
            role: 'Consultant - Data Engineer',
            company: 'EY',
            client: 'Client: American Express',
            date: 'Nov 2024 – Present',
            status: 'Current Role',
            metrics: ['+20% Data Reliability', '500+ Automated Rules', 'GCP BigQuery & Composer'],
            description: 'Architecting and orchestrating highly scalable data pipelines using GCP BigQuery to integrate disparate external architectures, ensuring strict data localization and regulatory compliance.',
            highlights: [
                'Designed and deployed an end-to-end Operational Data Layer (ODL) establishing a new Source of Record (SOR). Automated ETL/ELT pipelines using GCP Cloud Composer (Apache Airflow).',
                'Engineered a robust Data Quality (DQ) framework across a massive-scale platform, implementing 500+ automated validation rules. Eliminated zero-coverage gaps, reducing pipeline failures by 60% and improving reliability by 20%.',
                'Migrated demographic data from multiple legacy systems into a modernized Single Source of Truth (SSOT), reverse-engineering complex business logic via Unix and SQL.',
                'Mentored a team of 3 data professionals, driving engineering best practices, conducting code reviews, and resolving pipeline bottlenecks.',
                'Delivered critical infrastructure for the "Early Evidence Campaign," empowering product teams with high-value customer targeting insights through complex behavioral data.'
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
                'Developed an end-to-end workflow for quarterly regulatory reporting for loan syndication analysis, automating jobs using workload automation tools to increase efficiency by 60%.',
                'Led the migration of PySpark and Spark Scala scripts to Azure cloud servers, reducing infrastructure costs by 25% and enhancing scalability.',
                'Led the migration of data dependencies from Teradata to Hive, significantly reducing operational costs for managing large volumes of data by leveraging Hive\'s cost-effective architecture.',
                'Created Unix scripts for data quality checks with automated email notifications, and led the migration of checks to a separate web portal application for real-time monitoring.',
                'Used Bitbucket/Git and collaborated with CI/CD teams to ensure smooth deployment of code to production, reducing deployment time by 30%.'
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
                <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
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
