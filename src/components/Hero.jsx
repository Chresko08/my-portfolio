import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowDown, FiMail, FiCheckCircle, FiLinkedin, FiGithub, FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

const SPRING_TRANSITION = { type: 'spring', stiffness: 400, damping: 30 };

const Hero = ({ viewMode = 'general' }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAllSkillsMobile, setShowAllSkillsMobile] = useState(false);

    const skills = [
        { category: 'Compute & Processing', name: 'GCP BigQuery' },
        { category: 'Compute & Processing', name: 'Apache Spark (PySpark, Scala)' },
        { category: 'Compute & Processing', name: 'Databricks (Delta Lake, Vector Search)' },
        { category: 'Compute & Processing', name: 'Azure Synapse Analytics' },
        { category: 'Compute & Processing', name: 'Apache Hive (Tez)' },
        { category: 'Compute & Processing', name: 'MapR Hadoop' },
        
        { category: 'Orchestration & ETL', name: 'GCP Cloud Composer (Airflow)' },
        { category: 'Orchestration & ETL', name: 'Azure Data Factory (ADF)' },
        { category: 'Orchestration & ETL', name: 'IBM DataStage' },
        { category: 'Orchestration & ETL', name: 'Autosys' },
        
        { category: 'Storage & Architecture', name: 'Azure Data Lake Storage (ADLS Gen2)' },
        { category: 'Storage & Architecture', name: 'HDFS' },
        { category: 'Storage & Architecture', name: 'Snowflake' },
        { category: 'Storage & Architecture', name: 'Teradata' },
        { category: 'Storage & Architecture', name: 'Oracle RDBMS' },
        
        { category: 'Programming & Scripting', name: 'Python' },
        { category: 'Programming & Scripting', name: 'Advanced SQL (Window Functions, CTEs)' },
        { category: 'Programming & Scripting', name: 'Unix/Shell Scripting' }
    ];

    const skillCategories = ['All', ...new Set(skills.map(s => s.category))];
    const filteredSkills = selectedCategory === 'All' ? skills : skills.filter(s => s.category === selectedCategory);

    const stats = [
        { number: '15M+', label: 'Daily Records Processed' },
        { number: '4', label: 'Legacy SORs Decommissioned' },
        { number: '500+', label: 'DQ Rules Engineered' },
        { number: '5+', label: 'Years Production Experience' }
    ];

    const socialLinks = [
        { icon: <FiLinkedin size={18} />, url: 'https://www.linkedin.com/in/chresko/', label: 'LinkedIn' },
        { icon: <FiGithub size={18} />, url: 'https://github.com/Chresko08', label: 'GitHub' },
        { icon: <SiLeetcode size={18} />, url: 'https://leetcode.com/chresko', label: 'LeetCode' }
    ];

    return (
        <section id="hero" className="hero-section" style={{ position: 'relative', overflow: 'hidden', paddingTop: '135px', paddingBottom: '70px' }}>
            
            {/* Subtle Apple Ambient Glow */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1000px',
                height: '480px',
                background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(41, 151, 255, 0.12), transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '48px', alignItems: 'center', marginBottom: '70px' }}>
                    
                    {/* Left Column: Hero Introduction */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING_TRANSITION}
                        style={{ flex: '1 1 520px' }}
                    >
                        {/* Status Capsule */}
                        <div style={{ marginBottom: '20px' }}>
                            <div className="status-pill">
                                <span className="pulse-dot"></span>
                                <span>Senior Data & Cloud Platform Engineer</span>
                            </div>
                        </div>
                        
                        <h1 style={{
                            fontSize: 'clamp(2.6rem, 5.2vw, 4.2rem)',
                            lineHeight: 1.06,
                            marginBottom: '16px',
                            letterSpacing: '-0.035em',
                            fontWeight: 800,
                            color: 'var(--text-primary)'
                        }}>
                            Shubham Srivastava
                        </h1>

                        <h2 style={{
                            fontSize: 'clamp(1.3rem, 2.4vw, 1.85rem)',
                            color: 'var(--text-secondary)',
                            marginBottom: '24px',
                            fontWeight: 400,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.3
                        }}>
                            Architecting <span className="gradient-text" style={{ fontWeight: 600 }}>cloud-native lakehouses</span> & high-throughput financial data pipelines.
                        </h2>

                        {/* Social Links (Apple Frosted Buttons) */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
                            {socialLinks.map((link) => (
                                <motion.a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.94 }}
                                    transition={SPRING_TRANSITION}
                                    aria-label={link.label}
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--surface-card)',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        border: '1px solid var(--card-border)',
                                        color: 'var(--text-secondary)',
                                        boxShadow: 'var(--card-highlight)',
                                        transition: 'color 0.2s ease, border-color 0.2s ease'
                                    }}
                                >
                                    {link.icon}
                                </motion.a>
                            ))}
                        </div>

                        {/* Narrative Frosted Card */}
                        <div className="glass-card" style={{ padding: '24px 28px', marginBottom: '32px' }}>
                            <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '14px' }}>
                                Specializing in modernizing legacy on-premise ecosystems into high-velocity cloud lakehouses on GCP & Databricks. Engineered end-to-end Operational Data Layers, C360 single sources of truth, and automated data quality frameworks processing <strong>15M+ daily accounts</strong> for Fortune 100 financial enterprises.
                            </p>
                            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                                <strong style={{ color: 'var(--text-primary)' }}>Focus on Craft & Performance:</strong> Reducing pipeline runtimes by up to 70%, eliminating shuffle skew, and enforcing mathematical precision with zero data loss.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hero-cta-group" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <motion.a
                                href="#experience"
                                className="btn-primary"
                                whileTap={{ scale: 0.96 }}
                                transition={SPRING_TRANSITION}
                            >
                                <span>Explore Experience</span>
                                <FiArrowDown size={15} />
                            </motion.a>
                            <motion.a
                                href="#contact"
                                className="btn-secondary"
                                whileTap={{ scale: 0.96 }}
                                transition={SPRING_TRANSITION}
                            >
                                <span>Contact Me</span>
                                <FiMail size={15} />
                            </motion.a>
                            <motion.a 
                                href="https://drive.google.com/file/d/1X7xri0IVDUtWYZz_MF_WN2IHHtFK56Bc/view?usp=sharing" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-secondary" 
                                whileTap={{ scale: 0.96 }}
                                transition={SPRING_TRANSITION}
                                style={{ 
                                    background: 'var(--badge-bg)',
                                    color: 'var(--primary-color)',
                                    borderColor: 'var(--badge-border)'
                                }}
                            >
                                <span>Resume</span>
                                <FiExternalLink size={14} />
                            </motion.a>
                        </div>
                    </motion.div>

                    {/* Right Column: Profile Image with Apple Continuous Curvature */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
                        style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '0 0 auto' }}
                    >
                        <div style={{
                            position: 'relative',
                            borderRadius: '32px',
                            padding: '6px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(41,151,255,0.25))',
                            boxShadow: '0 24px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                            width: '100%',
                            maxWidth: '360px'
                        }}>
                            <div style={{
                                borderRadius: '26px',
                                overflow: 'hidden',
                                background: 'var(--bg-secondary)',
                                height: '420px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img
                                    src={`${import.meta.env.BASE_URL}profile.jpg`}
                                    alt="Shubham Srivastava"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Key Production Stats Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={SPRING_TRANSITION}
                    viewport={{ once: true }}
                    className="stats-grid" 
                    style={{ marginBottom: '64px' }}
                >
                    {stats.map((stat, idx) => (
                        <div key={idx} className="stat-card">
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Interactive Technical Competencies (Apple Segmented Bar & Fluid Chips) - Shown only in General mode */}
                {viewMode !== 'personal' && (
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={SPRING_TRANSITION}
                        viewport={{ once: true }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                                Core Technical Competencies
                            </h3>
                        </div>

                        {/* Category Filter Tabs */}
                        <div className="filter-tabs">
                            {skillCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Animated Skills Grid */}
                        <motion.div
                            layout
                            style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}
                        >
                            <AnimatePresence>
                                {filteredSkills.map((skill, sIdx) => {
                                    const isHiddenOnMobile = selectedCategory === 'All' && sIdx >= 6 && !showAllSkillsMobile;
                                    return (
                                        <motion.div
                                            key={skill.name}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                                            className={`skill-chip ${isHiddenOnMobile ? 'mobile-hidden-skill' : ''}`}
                                            style={{
                                                padding: '9px 16px',
                                                background: 'var(--surface-card)',
                                                backdropFilter: 'blur(16px)',
                                                WebkitBackdropFilter: 'blur(16px)',
                                                border: '1px solid var(--card-border)',
                                                boxShadow: 'var(--card-highlight)',
                                                color: 'var(--text-primary)',
                                                borderRadius: 'var(--radius-inner)',
                                                fontSize: '0.88rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontWeight: 500,
                                                letterSpacing: '-0.01em',
                                                userSelect: 'none'
                                            }}
                                            whileHover={{
                                                y: -2,
                                                borderColor: 'var(--primary-color)'
                                            }}
                                            whileTap={{ scale: 0.96 }}
                                        >
                                            <FiCheckCircle size={15} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />
                                            <span>{skill.name}</span>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>

                        {/* Mobile Toggle to Show All / Fewer Skills */}
                        {selectedCategory === 'All' && filteredSkills.length > 6 && (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                                <button
                                    onClick={() => setShowAllSkillsMobile(!showAllSkillsMobile)}
                                    className="skills-mobile-toggle"
                                    style={{
                                        display: 'none',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '7px 18px',
                                        borderRadius: '9999px',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        color: 'var(--primary-color)',
                                        background: 'var(--badge-bg)',
                                        border: '1px solid var(--badge-border)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span>{showAllSkillsMobile ? 'Show Fewer Skills' : `View All ${filteredSkills.length} Skills`}</span>
                                    {showAllSkillsMobile ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

            </div>
        </section>
    );
};

export default Hero;
