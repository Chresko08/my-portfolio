import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiBookOpen, FiCheckCircle } from 'react-icons/fi';

const About = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const stats = [
        { number: '4+', label: 'Years Experience' },
        { number: '500+', label: 'Validation Rules' },
        { number: '60%', label: 'Pipeline Speedup' },
        { number: 'AWS', label: 'Certified Cloud' },
    ];

    const skillCategories = ['All', 'Big Data & ETL', 'Cloud & DBs', 'Languages & Tools'];

    const skillsData = [
        { name: 'PySpark', category: 'Big Data & ETL', proficiency: 'Expert' },
        { name: 'Hadoop', category: 'Big Data & ETL', proficiency: 'Advanced' },
        { name: 'Hive', category: 'Big Data & ETL', proficiency: 'Advanced' },
        { name: 'ETL Pipelines', category: 'Big Data & ETL', proficiency: 'Expert' },
        { name: 'AWS Cloud', category: 'Cloud & DBs', proficiency: 'Certified' },
        { name: 'Azure Cloud', category: 'Cloud & DBs', proficiency: 'Advanced' },
        { name: 'GCP BigQuery', category: 'Cloud & DBs', proficiency: 'Advanced' },
        { name: 'SQL', category: 'Languages & Tools', proficiency: 'Expert' },
        { name: 'Python', category: 'Languages & Tools', proficiency: 'Advanced' },
        { name: 'Git', category: 'Languages & Tools', proficiency: 'Proficient' },
        { name: 'Jira', category: 'Languages & Tools', proficiency: 'Proficient' },
        { name: 'Teradata', category: 'Cloud & DBs', proficiency: 'Proficient' },
    ];

    const filteredSkills = selectedCategory === 'All'
        ? skillsData
        : skillsData.filter(s => s.category === selectedCategory);

    return (
        <section id="about" className="section" style={{ background: 'var(--surface-card)' }}>
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-subtitle">Profile & Background</span>
                    <h2 className="section-heading">
                        About <span className="gradient-text">Me</span>
                    </h2>
                </div>

                <div className="about-grid">
                    {/* Left: Profile Photo with Glowing Card Frame */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        style={{ position: 'relative' }}
                    >
                        <div style={{
                            position: 'relative',
                            borderRadius: '24px',
                            padding: '8px',
                            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-purple))',
                            boxShadow: '0 20px 40px -15px var(--glow-color)'
                        }}>
                            <div style={{
                                borderRadius: '18px',
                                overflow: 'hidden',
                                background: 'var(--bg-color)',
                                height: '380px',
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

                        {/* Experience Floating Badge */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            style={{
                                position: 'absolute',
                                bottom: '-15px',
                                right: '10px',
                                background: 'var(--nav-bg)',
                                backdropFilter: 'blur(12px)',
                                padding: '10px 18px',
                                borderRadius: '14px',
                                border: '1px solid var(--card-border-hover)',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <span style={{ fontSize: '1.4rem' }}>🚀</span>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Big Data Engineer</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>EY & Infosys Alum</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Bio, Stats & Interactive Skills */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
                            I am a dedicated <strong style={{ color: 'var(--text-primary)' }}>Big Data Engineer</strong> and <strong style={{ color: 'var(--text-primary)' }}>Business Analyst</strong> with proven enterprise experience at tier-1 global organizations including <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>EY</span> and <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Infosys</span>.
                        </p>
                        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                            My expertise centers on architecting resilient distributed data pipelines, executing high-stakes cloud migrations (AWS, Azure, GCP), and orchestrating automated data validation layers for Fortune 100 financial and healthcare institutions.
                        </p>

                        {/* Education & Certs Pills */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            padding: '16px 20px',
                            background: 'var(--surface-color)',
                            borderRadius: '14px',
                            border: '1px solid var(--card-border)',
                            marginBottom: '25px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                <FiBookOpen style={{ color: 'var(--primary-color)' }} />
                                <span><strong>Education:</strong> Bachelor of Technology from UCEM, Prayagraj (2017 – 2021)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                <FiAward style={{ color: '#f59e0b' }} />
                                <span><strong>Certification:</strong> AWS Certified Cloud Practitioner</span>
                            </div>
                        </div>

                        {/* Stats Counter Cards */}
                        <div className="stats-grid">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    className="stat-card"
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Interactive Skills with Filter Tabs */}
                        <div style={{ marginTop: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Core Technical Competencies</h3>
                            </div>

                            {/* Category Filter Pills */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                                {skillCategories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{
                                            padding: '6px 14px',
                                            borderRadius: '9999px',
                                            fontSize: '0.82rem',
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
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
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
                                                padding: '7px 14px',
                                                background: 'var(--badge-bg)',
                                                border: '1px solid var(--badge-border)',
                                                color: 'var(--text-primary)',
                                                borderRadius: '12px',
                                                fontSize: '0.88rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontWeight: 500
                                            }}
                                            whileHover={{
                                                scale: 1.05,
                                                borderColor: 'var(--primary-color)'
                                            }}
                                        >
                                            <FiCheckCircle size={14} style={{ color: 'var(--primary-color)' }} />
                                            <span>{skill.name}</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
