import React from 'react';
import { motion } from 'framer-motion';

const Experience = () => {
    const experiences = [
        {
            id: 1,
            role: 'Business Analyst',
            company: 'EY (Client: American Express)',
            date: 'Nov 2024 - Present',
            description: 'Spearheading the data quality modernization for a major global card issuer, I designed over 500 complex validation rules and architected a new Operational Data Layer (ODL). This initiative drove a 20% improvement in overall data quality, enabling more precise targeted marketing campaigns and significantly reducing rule failures through robust, scalable pipeline architecture.'
        },
        {
            id: 2,
            role: 'Big Data Engineer',
            company: 'Infosys (Clients: Bank of America, HCSC)',
            date: 'Aug 2021 – Aug 2024',
            description: 'Engineered scalable big data solutions for top investment banks and healthcare providers, optimizing critical data pipelines by 60% through automation. I led high-impact cloud migrations to Azure and legacy transformations from Teradata to Hadoop, delivering substantial operational cost reductions and enhancing system scalability for massive datasets.'
        }
    ];


    return (
        <section id="experience" className="section">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    style={{ fontSize: '2.5rem', marginBottom: '60px', textAlign: 'center' }}
                >
                    My <span className="gradient-text">Experience</span>
                </motion.h2>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            style={{
                                marginBottom: '40px',
                                padding: '30px',
                                background: 'var(--surface-color)',
                                borderRadius: '15px',
                                borderLeft: '4px solid var(--primary-color)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap' }}>
                                <h3 style={{ fontSize: '1.5rem' }}>{exp.role}</h3>
                                <span style={{ color: 'var(--primary-color)', fontWeight: 500 }}>{exp.date}</span>
                            </div>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>{exp.company}</h4>
                            <p style={{ color: '#ccc', lineHeight: '1.6' }}>{exp.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
