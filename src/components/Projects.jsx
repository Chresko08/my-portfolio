import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDatabase, FiCloud, FiServer, FiCpu, FiTrendingUp } from 'react-icons/fi';

const Projects = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const projects = [
        {
            id: 1,
            category: 'enterprise',
            categoryLabel: 'Enterprise Big Data',
            title: 'Data Quality Modernization',
            impact: '30% Failure Reduction',
            description: 'Architected an automated enterprise data validation engine for a major US credit card issuer. Formulated 500+ complex SQL/BigQuery rules validating millions of campaign records. Engineered a resilient Operational Data Layer (ODL) supporting hyper-targeted customer marketing and reward programs.',
            tags: ['GCP BigQuery', 'SQL', 'Data Quality', 'ODL Architecture'],
            icon: <FiDatabase size={32} style={{ color: 'var(--accent-emerald)' }} />,
            glowColor: 'rgba(16, 185, 129, 0.15)'
        },
        {
            id: 2,
            category: 'enterprise',
            categoryLabel: 'Enterprise Big Data',
            title: 'Regulatory Reporting Automation',
            impact: '60% Pipeline Efficiency',
            description: 'Spearheaded the automation of complex quarterly regulatory data pipelines for corporate loan syndication. Integrated workload orchestration with Unix scripting to automate multi-stage transformations from raw staging schemas to high-performance materialized reporting marts.',
            tags: ['Workflow Automation', 'Unix Scripting', 'SQL', 'Data Modeling'],
            icon: <FiTrendingUp size={32} style={{ color: '#f43f5e' }} />,
            glowColor: 'rgba(244, 63, 94, 0.15)'
        },
        {
            id: 3,
            category: 'enterprise',
            categoryLabel: 'Enterprise Big Data',
            title: 'Teradata to Hadoop Migration',
            impact: 'Massive Scalability & Savings',
            description: 'Directed end-to-end data migration from legacy on-premise Teradata appliances to a modern distributed Apache Hadoop and Hive cluster for a global investment bank. Achieved zero downtime, drastically reduced storage overhead, and improved distributed query execution.',
            tags: ['Apache Hadoop', 'Apache Hive', 'Teradata', 'Big Data Migration'],
            icon: <FiCpu size={32} style={{ color: 'var(--accent-purple)' }} />,
            glowColor: 'rgba(168, 85, 247, 0.15)'
        },
        {
            id: 4,
            category: 'cloud',
            categoryLabel: 'Cloud & Infrastructure',
            title: 'Azure Cloud Pipeline Modernization',
            impact: '25% Infrastructure Cost Reduction',
            description: 'Architected and migrated mission-critical PySpark and Scala analytics pipelines to Microsoft Azure for a national healthcare provider. Optimized executor memory allocations and distributed computing nodes to elevate pipeline reliability and reduce cloud consumption costs.',
            tags: ['Microsoft Azure', 'PySpark', 'Scala', 'Distributed Computing'],
            icon: <FiCloud size={32} style={{ color: 'var(--primary-color)' }} />,
            glowColor: 'rgba(99, 102, 241, 0.15)'
        },
        {
            id: 5,
            category: 'cloud',
            categoryLabel: 'Cloud & Infrastructure',
            title: 'AWS Fault-Tolerant Cloud Infrastructure',
            impact: 'Automated Scaling & Storage Tiering',
            description: 'Architected a multi-tier fault-tolerant web application environment utilizing AWS Elastic Beanstalk with dynamic auto-scaling and application load balancing. Configured S3 lifecycle policies with Glacier Deep Archive for cost-effective cold data storage and integrated Amazon RDS MySQL.',
            tags: ['AWS Beanstalk', 'Amazon EC2', 'Amazon S3', 'Amazon RDS', 'Python'],
            icon: <FiServer size={32} style={{ color: '#f59e0b' }} />,
            glowColor: 'rgba(245, 158, 11, 0.15)'
        }
    ];

    const filterTabs = [
        { id: 'all', label: 'All Projects', count: projects.length },
        { id: 'enterprise', label: 'Enterprise Big Data', count: projects.filter(p => p.category === 'enterprise').length },
        { id: 'cloud', label: 'Cloud & Infrastructure', count: projects.filter(p => p.category === 'cloud').length }
    ];

    const filteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(p => p.category === activeFilter);

    return (
        <section id="projects" className="section" style={{ background: 'var(--surface-card)' }}>
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-subtitle">Portfolio Highlights</span>
                    <h2 className="section-heading">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                </div>

                {/* Interactive Filter Pills */}
                <div className="filter-tabs">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveFilter(tab.id)}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Animated Projects Grid */}
                <motion.div
                    layout
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '28px'
                    }}
                >
                    <AnimatePresence>
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ duration: 0.35, delay: index * 0.05 }}
                                whileHover={{ y: -8 }}
                                className="glass-card"
                                style={{
                                    padding: '28px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Subtle background glow */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '150px',
                                    height: '150px',
                                    background: project.glowColor,
                                    filter: 'blur(50px)',
                                    borderRadius: '50%',
                                    zIndex: 0,
                                    pointerEvents: 'none'
                                }} />

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    {/* Icon & Category Header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '14px',
                                            background: 'var(--surface-color)',
                                            border: '1px solid var(--card-border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                        }}>
                                            {project.icon}
                                        </div>
                                        <span style={{
                                            fontSize: '0.78rem',
                                            fontWeight: 600,
                                            padding: '4px 10px',
                                            borderRadius: '9999px',
                                            background: 'var(--surface-color)',
                                            border: '1px solid var(--card-border)',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            {project.categoryLabel}
                                        </span>
                                    </div>

                                    {/* Title & Key Impact Badge */}
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
                                        {project.title}
                                    </h3>

                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid rgba(99, 102, 241, 0.25)',
                                        color: 'var(--primary-color)',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        marginBottom: '16px'
                                    }}>
                                        🎯 {project.impact}
                                    </div>

                                    {/* Description */}
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.94rem',
                                        lineHeight: 1.65,
                                        marginBottom: '22px'
                                    }}>
                                        {project.description}
                                    </p>
                                </div>

                                {/* Tech Tags */}
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    position: 'relative',
                                    zIndex: 1,
                                    paddingTop: '16px',
                                    borderTop: '1px solid var(--card-border)'
                                }}>
                                    {project.tags.map(tag => (
                                        <span
                                            key={tag}
                                            style={{
                                                fontSize: '0.78rem',
                                                color: 'var(--text-secondary)',
                                                background: 'var(--surface-color)',
                                                border: '1px solid var(--card-border)',
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                fontWeight: 500
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
