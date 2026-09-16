import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowDown, FiMail, FiCheckCircle, FiLinkedin, FiGithub } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

const Hero = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

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
        { number: '15M+', label: 'Records Processed/Day' },
        { number: '4', label: 'Systems Decommissioned' },
        { number: '500+', label: 'DQ Rules Engineered' },
        { number: '5', label: 'Years Experience' }
    ];

    const socialLinks = [
        { icon: <FiLinkedin size={20} />, url: 'https://www.linkedin.com/in/chresko/', label: 'LinkedIn' },
        { icon: <FiGithub size={20} />, url: 'https://github.com/Chresko08', label: 'GitHub' },
        { icon: <SiLeetcode size={20} />, url: 'https://leetcode.com/chresko', label: 'LeetCode' }
    ];

    return (
        <section id="hero" className="hero-section" style={{ position: 'relative', overflow: 'hidden', paddingTop: '130px' }}>
            {/* Data Engineering Decorative DAG Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                opacity: 0.2,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary-color)" />
                            <stop offset="100%" stopColor="var(--accent-purple)" />
                        </linearGradient>
                    </defs>
                    <g stroke="url(#lineGrad)" strokeWidth="2.5" fill="none">
                        {/* Pipelines */}
                        <path d="M 50,200 C 150,200 150,100 250,100" />
                        <path d="M 50,200 C 150,200 150,300 250,300" />
                        <path d="M 250,100 C 350,100 350,200 450,200" />
                        <path d="M 250,300 C 350,300 350,200 450,200" />
                        <path d="M 450,200 C 600,200 600,100 750,100" />
                        <path d="M 450,200 C 600,200 600,300 750,300" />
                        <path d="M 450,200 C 600,200 600,450 750,450" />
                        
                        <path d="M 750,100 C 850,100 850,200 950,200" />
                        <path d="M 750,300 C 850,300 850,200 950,200" />
                        
                        {/* Floating Nodes */}
                        <circle cx="50" cy="200" r="6" fill="var(--bg-color)" />
                        <circle cx="250" cy="100" r="6" fill="var(--bg-color)" />
                        <circle cx="250" cy="300" r="6" fill="var(--bg-color)" />
                        <circle cx="450" cy="200" r="8" fill="var(--bg-color)" strokeWidth="2" />
                        <circle cx="750" cy="100" r="6" fill="var(--bg-color)" />
                        <circle cx="750" cy="300" r="6" fill="var(--bg-color)" />
                        <circle cx="750" cy="450" r="6" fill="var(--bg-color)" />
                        <circle cx="950" cy="200" r="8" fill="var(--bg-color)" strokeWidth="2" />
                    </g>
                    
                    {/* Animated Data Packets */}
                    <circle r="3" fill="var(--primary-color)">
                        <animateMotion dur="4s" repeatCount="indefinite" path="M 50,200 C 150,200 150,100 250,100" />
                    </circle>
                    <circle r="3" fill="var(--accent-cyan)">
                        <animateMotion dur="3s" repeatCount="indefinite" path="M 50,200 C 150,200 150,300 250,300" />
                    </circle>
                    <circle r="3" fill="var(--primary-color)">
                        <animateMotion dur="3.5s" repeatCount="indefinite" path="M 250,100 C 350,100 350,200 450,200" />
                    </circle>
                    <circle r="3" fill="var(--accent-purple)">
                        <animateMotion dur="4s" repeatCount="indefinite" path="M 250,300 C 350,300 350,200 450,200" />
                    </circle>
                    <circle r="4" fill="var(--accent-emerald)">
                        <animateMotion dur="5s" repeatCount="indefinite" path="M 450,200 C 600,200 600,100 750,100" />
                    </circle>
                    <circle r="4" fill="var(--primary-color)">
                        <animateMotion dur="4.5s" repeatCount="indefinite" path="M 450,200 C 600,200 600,300 750,300" />
                    </circle>
                </svg>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '40px', alignItems: 'center', marginBottom: '80px' }}>
                    
                    {/* Left Column: Intro */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ flex: '1 1 500px' }}
                    >
                        <div style={{ display: 'inline-block', padding: '8px 16px', background: 'var(--badge-bg)', color: 'var(--primary-color)', borderRadius: '9999px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '24px', border: '1px solid var(--badge-border)' }}>
                            <span style={{ marginRight: '8px' }}>👋</span> Hello, I'm
                        </div>
                        
                        <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px' }}>
                            Shubham Srivastava
                        </h1>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--text-secondary)', marginBottom: '30px', fontWeight: 400 }}>
                            Senior Data & <span className="gradient-text" style={{ fontWeight: 600 }}>Cloud Engineer</span>
                        </h2>

                        {/* Social Links Moved Here */}
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon"
                                    aria-label={link.label}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'var(--surface-color)', border: '1px solid var(--card-border)',
                                        color: 'var(--text-secondary)', transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--primary-color)';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--surface-color)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>

                        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', borderLeft: '4px solid var(--primary-color)' }}>
                            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                                Specializing in migrating legacy on-premise systems to modern cloud-native architectures. Beyond just moving data, I focus on engineering strict data governance, optimizing pipeline SLAs (reducing runtimes by up to 70%), and building automated validation frameworks that Fortune 100 financial and healthcare institutions rely on for critical business intelligence.
                            </p>
                            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 0 }}>
                                <strong style={{ color: 'var(--text-primary)' }}>I bring a relentless go-getter attitude to my engineering.</strong> I don't sit on problems—I proactively connect with the right people, hunt down resources, and forge new pathways to engineer solutions that perfectly fit the client's architectural requirements.
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
