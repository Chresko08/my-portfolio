import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiAward } from 'react-icons/fi';
import { SiAmazon, SiDatabricks, SiHackerrank } from 'react-icons/si';

const Certificates = () => {
    const certs = [
        {
            title: "Databricks Certified Data Engineer Professional",
            issuer: "Databricks",
            icon: <SiDatabricks size={28} color="#FF3621" />,
            link: "https://credentials.databricks.com/82604b02-ba08-432c-b7e1-b095a5cfb995",
            color: "#FF3621",
            category: "Databricks Architecture"
        },
        {
            title: "Databricks Certified Data Engineer Associate",
            issuer: "Databricks",
            icon: <SiDatabricks size={28} color="#FF3621" />,
            link: "https://credentials.databricks.com/ff55ea21-ef3a-49ef-9d09-fc85d2e4e99e",
            color: "#FF3621",
            category: "Databricks Data Engineering"
        },
        {
            title: "Databricks Certified Apache Spark Developer Associate",
            issuer: "Databricks",
            icon: <SiDatabricks size={28} color="#FF3621" />,
            link: "https://credentials.databricks.com/3ae62d70-e265-4005-8f1d-ae7d9c506ad7",
            color: "#FF3621",
            category: "Databricks Data Processing"
        },
        {
            title: "Databricks Certified Data Analyst Associate",
            issuer: "Databricks",
            icon: <SiDatabricks size={28} color="#FF3621" />,
            link: "https://credentials.databricks.com/f0720754-ff63-4244-8b11-d7d4453f3e05",
            color: "#FF3621",
            category: "Databricks Analytics"
        },
        {
            title: "Databricks Certified Generative AI Engineer Associate",
            issuer: "Databricks",
            icon: <SiDatabricks size={28} color="#FF3621" />,
            link: "https://credentials.databricks.com/86f24cec-3bb7-418f-8c5c-5eea84e235db",
            color: "#FF3621",
            category: "Databricks Machine Learning"
        },
        {
            title: "AWS Certified Cloud Practitioner",
            issuer: "Amazon Web Services",
            icon: <SiAmazon size={28} color="#FF9900" />,
            link: "https://drive.google.com/open?id=13UTvMKwyU4u13A5Fk-dwMT7LqXe3hOyY",
            color: "#FF9900",
            category: "Cloud Infrastructure"
        },
        {
            title: "HackerRank Advanced SQL Certificate",
            issuer: "HackerRank",
            icon: <SiHackerrank size={28} color="#00EA64" />,
            link: "https://www.hackerrank.com/profile/shubham_chresko",
            color: "#00EA64",
            category: "Database & SQL"
        },
        {
            title: "HackerRank Python Certificate",
            issuer: "HackerRank",
            icon: <SiHackerrank size={28} color="#00EA64" />,
            link: "https://www.hackerrank.com/profile/shubham_chresko",
            color: "#00EA64",
            category: "Programming"
        },
        {
            title: "HackerRank Certificates (REST API & Others)",
            issuer: "HackerRank",
            icon: <SiHackerrank size={28} color="#00EA64" />,
            link: "https://www.hackerrank.com/profile/shubham_chresko",
            color: "#00EA64",
            category: "Core Competency"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1, y: 0,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <section id="certificates" className="section">
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-subtitle">Licenses & Certifications</span>
                    <h2 className="section-heading">
                        Professional <span className="gradient-text">Credentials</span>
                    </h2>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                    <div style={{
                        background: 'linear-gradient(90deg, rgba(255,54,33,0.1), rgba(255,153,0,0.1))',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        border: '1px solid var(--card-border)'
                    }}>
                        <FiAward size={24} color="var(--primary-color)" />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                            Recognized 6x Multi-Cloud Certified Data Professional
                        </span>
                    </div>
                </div>

                <motion.div
                    className="certs-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px'
                    }}
                >
                    {certs.map((cert, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -8, boxShadow: '0 20px 30px rgba(0,0,0,0.2)' }}
                            className="glass-card cert-card"
                            style={{
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Accent line on top based on brand color */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                backgroundColor: cert.color
                            }} />

                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: 'var(--surface-color)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--card-border)'
                                }}>
                                    {cert.icon}
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    color: cert.color,
                                    background: 'var(--bg-color)',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--card-border)'
                                }}>
                                    {cert.category}
                                </span>
                            </div>

                            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.4, marginBottom: '8px', flexGrow: 1 }}>
                                {cert.title}
                            </h3>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                                Issued by <strong>{cert.issuer}</strong>
                            </p>

                            <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--primary-color)',
                                    fontWeight: 500,
                                    fontSize: '0.9rem',
                                    marginTop: 'auto',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-cyan)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--primary-color)'; }}
                            >
                                Verify Credential <FiExternalLink />
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Certificates;
