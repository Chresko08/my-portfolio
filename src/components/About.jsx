import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="section" style={{ background: 'var(--surface-color)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>
                        About <span className="gradient-text">Me</span>
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
                        <div style={{
                            height: '400px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src="/profile.jpg"
                                alt="Shubham Srivastava"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '10px' }}
                            />
                        </div>
                        <div>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                I am a skilled Big Data Engineer and Business Analyst with experience at top global firms like EY and Infosys. My expertise lies in designing robust data pipelines, optimizing ETL processes, and leveraging cloud technologies to solve complex business problems.
                            </p>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                <strong>Education:</strong> Bachelor of Technology from UCEM, Prayagraj (2017-2021).<br />
                                <strong>Certifications:</strong> AWS Certified Cloud Practitioner.
                            </p>

                            <div style={{ marginTop: '30px' }}>
                                <h3 style={{ marginBottom: '15px' }}>Skills</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {['SQL', 'Python', 'PySpark', 'Hadoop', 'Hive', 'AWS', 'Azure', 'GCP BigQuery', 'Git', 'Jira', 'ETL'].map((skill) => (
                                        <span key={skill} style={{
                                            padding: '8px 16px',
                                            background: 'rgba(100, 108, 255, 0.1)',
                                            color: 'var(--primary-color)',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem'
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
