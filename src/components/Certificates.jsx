import React from 'react';
import { motion } from 'framer-motion';

const Certificates = () => {
    const certificates = [
        { name: 'Python (Basic)', url: 'https://www.hackerrank.com/certificates/3d9adfc63466', date: 'Verified' },
        { name: 'Problem Solving (Basic)', url: 'https://www.hackerrank.com/certificates/59e88173784e', date: 'Verified' },
        { name: 'Java (Basic)', url: 'https://www.hackerrank.com/certificates/25e10f453928', date: 'Verified' },
        { name: 'SQL (Basic)', url: 'https://www.hackerrank.com/certificates/bedfcced02a0', date: 'Verified' },
        { name: 'SQL (Intermediate)', url: 'https://www.hackerrank.com/certificates/632dd6e24bbc', date: 'Verified' },
        { name: 'SQL (Advanced)', url: 'https://www.hackerrank.com/certificates/54d980f0649b', date: 'Verified' }
    ];

    return (
        <section id="certificates" className="section">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    style={{ fontSize: '2.5rem', marginBottom: '60px', textAlign: 'center' }}
                >
                    Certifications & <span className="gradient-text">Achievements</span>
                </motion.h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {certificates.map((cert, index) => (
                        <motion.a
                            key={index}
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, borderColor: 'var(--primary-color)' }}
                            style={{
                                display: 'block',
                                padding: '20px',
                                background: 'var(--surface-color)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                textDecoration: 'none',
                                color: 'inherit'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{cert.name}</h3>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <span style={{
                                    padding: '2px 8px',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    color: '#22c55e',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem'
                                }}>
                                    HackerRank
                                </span>
                                <span>{cert.date}</span>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certificates;
