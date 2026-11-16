import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiAward } from 'react-icons/fi';
import { SiAmazon, SiDatabricks, SiHackerrank } from 'react-icons/si';

const SPRING_TRANSITION = { type: 'spring', stiffness: 380, damping: 28 };

const Certificates = () => {
    const certs = [
        {
            title: "Databricks Certified Data Engineer Professional",
            issuer: "Databricks",
            icon: <SiDatabricks size={26} color="#FF3621" />,
            link: "https://credentials.databricks.com/82604b02-ba08-432c-b7e1-b095a5cfb995",
            color: "#FF3621",
            category: "Databricks Architecture"
        },
        {
            title: "Databricks Certified Data Engineer Associate",
            issuer: "Databricks",
            icon: <SiDatabricks size={26} color="#FF3621" />,
            link: "https://credentials.databricks.com/ff55ea21-ef3a-49ef-9d09-fc85d2e4e99e",
            color: "#FF3621",
            category: "Data Engineering"
        },
        {
            title: "Databricks Certified Apache Spark Developer Associate",
            issuer: "Databricks",
            icon: <SiDatabricks size={26} color="#FF3621" />,
            link: "https://credentials.databricks.com/3ae62d70-e265-4005-8f1d-ae7d9c506ad7",
            color: "#FF3621",
            category: "Spark Distributed Compute"
        },
        {
            title: "Databricks Certified Data Analyst Associate",
            issuer: "Databricks",
            icon: <SiDatabricks size={26} color="#FF3621" />,
            link: "https://credentials.databricks.com/f0720754-ff63-4244-8b11-d7d4453f3e05",
            color: "#FF3621",
            category: "Lakehouse Analytics"
        },
        {
            title: "Databricks Certified Generative AI Engineer Associate",
            issuer: "Databricks",
            icon: <SiDatabricks size={26} color="#FF3621" />,
            link: "https://credentials.databricks.com/86f24cec-3bb7-418f-8c5c-5eea84e235db",
            color: "#FF3621",
            category: "Generative AI"
        },
        {
            title: "AWS Certified Cloud Practitioner",
            issuer: "Amazon Web Services",
            icon: <SiAmazon size={26} color="#FF9900" />,
            link: "https://drive.google.com/open?id=13UTvMKwyU4u13A5Fk-dwMT7LqXe3hOyY",
            color: "#FF9900",
            category: "Cloud Architecture"
        },
        {
            title: "HackerRank SQL (Advanced)",
            issuer: "HackerRank",
            icon: <SiHackerrank size={26} color="#00EA64" />,
            link: "https://www.hackerrank.com/certificates/54d980f0649b",
            color: "#00EA64",
            category: "Database & SQL"
        },
        {
            title: "HackerRank SQL (Intermediate)",
            issuer: "HackerRank",
            icon: <SiHackerrank size={26} color="#00EA64" />,
            link: "https://www.hackerrank.com/certificates/632dd6e24bbc",
            color: "#00EA64",
            category: "Database & SQL"
        },
        {
            title: "HackerRank SQL (Basic)",
            issuer: "HackerRank",
            icon: <SiHackerrank size={26} color="#00EA64" />,
            link: "https://www.hackerrank.com/certificates/bedfcced02a0",
            color: "#00EA64",
            category: "Database & SQL"
        },
        {
            title: "HackerRank Python (Basic)",
            issuer: "HackerRank",
            icon: <SiHackerrank size={26} color="#00EA64" />,
            link: "https://www.hackerrank.com/certificates/3d9adfc63466",
            color: "#00EA64",
            category: "Programming"
        },
        {
            title: "HackerRank Problem Solving & Java",
            issuer: "HackerRank",
            icon: <SiHackerrank size={26} color="#00EA64" />,
            link: "https://www.hackerrank.com/profile/shubham_chresko",
            color: "#00EA64",
            category: "Core Algorithms"
        }
    ];

    return (
        <section id="certificates" className="section" style={{ paddingTop: '80px', paddingBottom: '70px' }}>
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-subtitle">Verified Industry Credentials</span>
                    <h2 className="section-heading">
                        Professional <span className="gradient-text">Certifications</span>
                    </h2>
                </div>

                {/* Apple Summary Pill */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '44px' }}>
                    <div style={{
                        background: 'var(--surface-card)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        padding: '10px 22px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        border: '1px solid var(--card-border)',
                        boxShadow: 'var(--card-highlight)'
                    }}>
                        <FiAward size={20} color="var(--primary-color)" />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem', letterSpacing: '-0.01em' }}>
                            6x Certified Databricks & AWS Multi-Cloud Data Professional
                        </span>
                    </div>
                </div>

                {/* Certificates Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                        gap: '20px'
                    }}
                >
                    {certs.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ ...SPRING_TRANSITION, delay: index * 0.04 }}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-card"
                            style={{
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
                                <div style={{
                                    padding: '10px',
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
                                    fontSize: '0.74rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    color: cert.color,
                                    background: 'var(--bg-secondary)',
                                    padding: '4px 10px',
                                    borderRadius: '9999px',
                                    border: '1px solid var(--card-border)'
                                }}>
                                    {cert.category}
                                </span>
                            </div>

                            <h3 style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                lineHeight: 1.35,
                                marginBottom: '8px',
                                flexGrow: 1,
                                letterSpacing: '-0.015em',
                                color: 'var(--text-primary)'
                            }}>
                                {cert.title}
                            </h3>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '20px' }}>
                                Issued by <strong style={{ color: 'var(--text-primary)' }}>{cert.issuer}</strong>
                            </p>

                            <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: 'var(--primary-color)',
                                    fontWeight: 500,
                                    fontSize: '0.86rem',
                                    marginTop: 'auto',
                                    transition: 'color 0.2s ease'
                                }}
                            >
                                <span>Verify Credential</span>
                                <FiExternalLink size={13} />
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certificates;
