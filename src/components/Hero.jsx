import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowDown, FiMail, FiGithub, FiLinkedin, FiCheckCircle } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

const Hero = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const techHighlights = ['Databricks & Spark', 'Cloud Architecture', 'ETL/ELT Pipelines', 'Data Quality & Governance'];

    const stats = [
        { number: '5+', label: 'Years Experience' },
        { number: '6x', label: 'Cloud Certified' },
        { number: '500+', label: 'Validation Rules' },
        { number: '3', label: 'Major Clouds' },
    ];

    const skillCategories = ['All', 'Big Data & Processing', 'Cloud & DevOps', 'Databases & Warehousing', 'Programming & Scripting'];

    const skillsData = [
        { name: 'PySpark', category: 'Big Data & Processing', proficiency: 'Expert' },
        { name: 'Databricks', category: 'Big Data & Processing', proficiency: 'Expert' },
        { name: 'Apache Spark', category: 'Big Data & Processing', proficiency: 'Expert' },
        { name: 'Hadoop', category: 'Big Data & Processing', proficiency: 'Advanced' },
        { name: 'Hive', category: 'Big Data & Processing', proficiency: 'Advanced' },
        { name: 'AWS', category: 'Cloud & DevOps', proficiency: 'Certified' },
        { name: 'Azure', category: 'Cloud & DevOps', proficiency: 'Advanced' },
        { name: 'GCP (Cloud Composer)', category: 'Cloud & DevOps', proficiency: 'Advanced' },
        { name: 'Docker & Kubernetes', category: 'Cloud & DevOps', proficiency: 'Proficient' },
        { name: 'CI/CD Pipelines', category: 'Cloud & DevOps', proficiency: 'Advanced' },
        { name: 'Git', category: 'Cloud & DevOps', proficiency: 'Advanced' },
        { name: 'GCP BigQuery', category: 'Databases & Warehousing', proficiency: 'Advanced' },
        { name: 'Snowflake', category: 'Databases & Warehousing', proficiency: 'Proficient' },
        { name: 'Teradata', category: 'Databases & Warehousing', proficiency: 'Advanced' },
        { name: 'Oracle', category: 'Databases & Warehousing', proficiency: 'Proficient' },
        { name: 'dbt (Data Build Tool)', category: 'Databases & Warehousing', proficiency: 'Proficient' },
        { name: 'Python', category: 'Programming & Scripting', proficiency: 'Expert' },
        { name: 'SQL', category: 'Programming & Scripting', proficiency: 'Expert' },
        { name: 'Unix/Shell Scripting', category: 'Programming & Scripting', proficiency: 'Advanced' },
        { name: 'Java', category: 'Programming & Scripting', proficiency: 'Proficient' },
    ];

    const filteredSkills = selectedCategory === 'All'
        ? skillsData
        : skillsData.filter(s => s.category === selectedCategory);

    return (
        <section id="hero" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '120px',
            paddingBottom: '80px',
            background: 'var(--surface-card)'
        }}>
            {/* Ambient Background Glow Elements */}
            <div style={{
                position: 'absolute',
                top: '15%',
                left: '10%',
                width: '380px',
                height: '380px',
                background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)',
                filter: 'blur(120px)',
                opacity: 0.18,
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                width: '420px',
                height: '420px',
                background: 'radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)',
                filter: 'blur(140px)',
                opacity: 0.15,
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <div className="container" style={{ zIndex: 1, maxWidth: '1100px' }}>
                
                {/* Hero / About Split Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '60px',
                    alignItems: 'center',
                    marginBottom: '80px'
                }}>
                    
                    {/* Left Column: Intro, Bio, and CTAs */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Status Pill */}
                        <div style={{ marginBottom: '24px', display: 'inline-block' }}>
                            <span className="status-pill">
                                <span className="pulse-dot"></span>
                                Available for Full-time Senior Roles & Consulting
                            </span>
                        </div>

                        {/* Name */}
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: 800,
                            marginBottom: '10px',
                            lineHeight: 1.1,
                            letterSpacing: '-1px'
                        }}>
                            Shubham Srivastava
                        </h1>

                        {/* Title */}
                        <h2 style={{
                            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            marginBottom: '24px',
                            lineHeight: 1.3
                        }}>
                            Senior Data & <span className="gradient-text">Cloud Engineer</span>
                        </h2>

                        {/* Social Links (Moved here from Contact as per user request) */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '30px' }}>
                            <a href="https://www.linkedin.com/in/chresko" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.95rem' }}>
                                <FiLinkedin /> <span>LinkedIn</span>
                            </a>
                            <a href="https://github.com/Chresko08" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.95rem' }}>
                                <FiGithub /> <span>GitHub</span>
                            </a>
                            <a href="https://leetcode.com/u/shubham_chresko/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.95rem' }}>
                                <SiLeetcode /> <span>LeetCode</span>
                            </a>
                        </div>

                        {/* Bio Paragraphs */}
                        <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '35px' }}>
                            <p style={{ marginBottom: '16px' }}>
                                I am a <strong style={{ color: 'var(--text-primary)' }}>Senior Data Engineer</strong> with over 5 years of proven enterprise experience consulting for tier-1 global organizations, including <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>EY</span> and <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Infosys</span>.
                            </p>
                            <p style={{ marginBottom: '16px' }}>
                                My technical foundation is highly versatile. I operate seamlessly across the data spectrum as a <strong style={{ color: 'var(--text-primary)' }}>Big Data Engineer</strong> processing terabytes of information, a <strong style={{ color: 'var(--text-primary)' }}>Cloud Architect</strong> designing robust infrastructure across AWS, Azure, and GCP, and an <strong style={{ color: 'var(--text-primary)' }}>ETL Developer</strong> orchestrating complex, dependency-driven pipelines.
                            </p>
                            <p>
                                I specialize in migrating legacy on-premise systems to modern cloud-native architectures. Beyond just moving data, I focus on engineering strict data governance, optimizing pipeline SLAs (reducing runtimes by up to 70%), and building automated validation frameworks that Fortune 100 financial and healthcare institutions rely on for critical business intelligence.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <a href="#experience" className="btn-primary" style={{ padding: '14px 28px' }}>
                                <span>Explore Experience</span>
                                <FiArrowDown />
                            </a>
                            <a href="#contact" className="btn-secondary" style={{ padding: '14px 28px' }}>
                                <span>Contact Me</span>
                                <FiMail />
                            </a>
                        </div>
                    </motion.div>

                    {/* Right Column: Profile Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <div style={{
                            position: 'relative',
                            borderRadius: '24px',
                            padding: '8px',
                            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-purple))',
                            boxShadow: '0 20px 40px -15px var(--glow-color)',
                            width: '100%',
                            maxWidth: '400px'
                        }}>
                            <div style={{
                                borderRadius: '18px',
                                overflow: 'hidden',
                                background: 'var(--bg-color)',
                                height: '450px',
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
                                        transition: 'transform 0.5s ease'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
                                />
                            </div>
                        </div>

                        </motion.div>
                </div>

                {/* Stats Counter Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="stats-grid" 
                    style={{ marginBottom: '60px' }}
                >
                    {stats.map((stat, idx) => (
                        <div key={idx} className="stat-card" style={{ padding: '24px 20px' }}>
                            <div className="stat-number" style={{ fontSize: '2.4rem' }}>{stat.number}</div>
                            <div className="stat-label" style={{ fontSize: '1.05rem' }}>{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Interactive Skills Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Core Technical Competencies</h3>
                    </div>

                    {/* Category Filter Pills */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                        {skillCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '9999px',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    background: selectedCategory === cat ? 'var(--primary-color)' : 'var(--surface-color)',
                                    color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                                    border: '1px solid',
                                    borderColor: selectedCategory === cat ? 'var(--primary-color)' : 'var(--card-border)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Animated Skills Grid */}
                    <motion.div
                        layout
                        style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}
                    >
                        <AnimatePresence>
                            {filteredSkills.map((skill) => (
                                <motion.div
                                    key={skill.name}
                                    layout
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        padding: '10px 18px',
                                        background: 'var(--badge-bg)',
                                        border: '1px solid var(--badge-border)',
                                        color: 'var(--text-primary)',
                                        borderRadius: '12px',
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontWeight: 500
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        borderColor: 'var(--primary-color)'
                                    }}
                                >
                                    <FiCheckCircle size={16} style={{ color: 'var(--primary-color)' }} />
                                    <span>{skill.name}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
