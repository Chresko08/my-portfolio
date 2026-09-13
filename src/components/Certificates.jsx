import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiCheckCircle, FiExternalLink, FiShield } from 'react-icons/fi';

const Certificates = () => {
    const awsCert = {
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services (AWS)',
        type: 'Cloud Architecture & Fundamentals',
        description: 'Demonstrated overall knowledge of AWS Cloud platform, security, architecture principles, and core services (EC2, S3, RDS, IAM).',
        verified: true,
        badge: 'Industry Certification'
    };

    const hackerRankCertificates = [
        { name: 'SQL (Advanced)', url: 'https://www.hackerrank.com/certificates/54d980f0649b', level: 'Advanced', issuer: 'HackerRank' },
        { name: 'SQL (Intermediate)', url: 'https://www.hackerrank.com/certificates/632dd6e24bbc', level: 'Intermediate', issuer: 'HackerRank' },
        { name: 'SQL (Basic)', url: 'https://www.hackerrank.com/certificates/bedfcced02a0', level: 'Basic', issuer: 'HackerRank' },
        { name: 'Python (Basic)', url: 'https://www.hackerrank.com/certificates/3d9adfc63466', level: 'Basic', issuer: 'HackerRank' },
        { name: 'Problem Solving (Basic)', url: 'https://www.hackerrank.com/certificates/59e88173784e', level: 'Basic', issuer: 'HackerRank' },
        { name: 'Java (Basic)', url: 'https://www.hackerrank.com/certificates/25e10f453928', level: 'Basic', issuer: 'HackerRank' }
    ];

    return (
        <section id="certificates" className="section">
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-subtitle">Credentials & Badges</span>
                    <h2 className="section-heading">
                        Certifications & <span className="gradient-text">Achievements</span>
                    </h2>
                </div>

                {/* Featured AWS Cloud Certification Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="glass-card"
                    style={{
                        maxWidth: '900px',
                        margin: '0 auto 40px',
                        padding: '30px',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, var(--surface-card) 60%)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#f59e0b'
                        }}>
                            <FiAward size={36} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '3px 10px',
                                    borderRadius: '9999px',
                                    background: 'rgba(245, 158, 11, 0.2)',
                                    color: '#f59e0b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {awsCert.badge}
                                </span>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.8rem',
                                    color: '#10b981',
                                    fontWeight: 600
                                }}>
                                    <FiCheckCircle size={13} /> Verified
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>
                                {awsCert.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                                {awsCert.description}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <FiShield style={{ color: '#f59e0b' }} />
                        <span>Amazon Web Services</span>
                    </div>
                </motion.div>

                {/* HackerRank Skill Certifications Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    maxWidth: '1100px',
                    margin: '0 auto'
                }}>
                    {hackerRankCertificates.map((cert, index) => (
                        <motion.a
                            key={cert.name}
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, borderColor: 'var(--primary-color)' }}
                            className="glass-card"
                            style={{
                                padding: '22px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                textDecoration: 'none',
                                color: 'inherit'
                            }}
                        >
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '14px'
                                }}>
                                    <span style={{
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        background: 'rgba(34, 197, 94, 0.12)',
                                        color: '#22c55e',
                                        border: '1px solid rgba(34, 197, 94, 0.25)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <FiCheckCircle size={11} /> {cert.issuer}
                                    </span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        fontWeight: 500
                                    }}>
                                        {cert.level}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>
                                    {cert.name}
                                </h3>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '16px',
                                paddingTop: '12px',
                                borderTop: '1px solid var(--card-border)',
                                fontSize: '0.85rem',
                                color: 'var(--primary-color)',
                                fontWeight: 600
                            }}>
                                <span>Verify Credential</span>
                                <FiExternalLink size={14} />
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certificates;
