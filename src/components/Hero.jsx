import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown, FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

const Hero = () => {
    const techHighlights = ['Databricks & Spark', 'Cloud Architecture (GCP/Azure/AWS)', 'Data Quality & ODL', 'Pipeline Orchestration'];

    return (
        <section id="hero" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '80px',
            paddingBottom: '40px'
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

            <div className="container" style={{ textAlign: 'center', zIndex: 1, maxWidth: '880px' }}>
                {/* Status Pill */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '24px', display: 'inline-block' }}
                >
                    <span className="status-pill">
                        <span className="pulse-dot"></span>
                        Available for Full-time Senior Roles & Consulting
                    </span>
                </motion.div>

                {/* Subtitle intro */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                        fontSize: '1.1rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '12px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontWeight: 600
                    }}
                >
                    Hello, I am
                </motion.p>

                {/* Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                        fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
                        fontWeight: 800,
                        marginBottom: '16px',
                        lineHeight: 1.1,
                        letterSpacing: '-1px'
                    }}
                >
                    Shubham Srivastava
                </motion.h1>

                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    style={{
                        fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: '24px',
                        lineHeight: 1.3
                    }}
                >
                    Senior <span className="gradient-text">Data Engineer</span>
                </motion.h2>

                {/* Short Bio */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{
                        maxWidth: '720px',
                        margin: '0 auto 30px',
                        color: 'var(--text-secondary)',
                        fontSize: '1.12rem',
                        lineHeight: 1.7
                    }}
                >
                    Specializing in enterprise Big Data analytics, cloud-native architectures (AWS, Azure, GCP), and automated ETL/ELT pipelines. I engineer high-throughput Operational Data Layers (ODL), implement rigorous data quality frameworks, and mentor technical teams to convert massive datasets into actionable, compliant business intelligence.
                </motion.p>

                {/* Floating Tech Highlight Chips */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '40px'
                    }}
                >
                    {techHighlights.map((tech) => (
                        <span key={tech} className="pill-badge">
                            ✨ {tech}
                        </span>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '40px'
                    }}
                >
                    <a href="#projects" className="btn-primary">
                        <span>Explore Deep Dives</span>
                        <FiArrowDown />
                    </a>
                    <a href="#contact" className="btn-secondary">
                        <span>Get In Touch</span>
                        <FiMail />
                    </a>
                </motion.div>

                {/* Social Quick Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.85 }}
                    style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <a
                        href="https://github.com/Chresko08"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Profile"
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1.3rem',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s, transform 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <FiGithub />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/chresko"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn Profile"
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1.3rem',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s, transform 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#0077b5'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <FiLinkedin />
                    </a>
                    <a
                        href="https://leetcode.com/u/shubham_chresko/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LeetCode Profile"
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1.3rem',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s, transform 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <SiLeetcode />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
