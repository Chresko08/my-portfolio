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


    const internships = [
        {
            id: 1,
            role: 'System Engineer Intern',
            company: 'Infosys',
            date: 'Feb 2021 - May 2021',
            description: 'Completed comprehensive training on the LAMP stack, achieving 81.6% in the final assessment. Collaborated in a team of four to build a "Learner-Teacher Portal" that facilitated session scheduling, allowing learners to book slots and instructors to manage their availability and course offerings.',
            certificate: 'https://drive.google.com/file/d/1TjlwMY3z7vPEvEU8M129hOcabnEyzdBK/view?usp=drive_link'
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
                    style={{ fontSize: '2.5rem', marginBottom: '50px', textAlign: 'center' }}
                >
                    Work <span className="gradient-text">Experience</span>
                </motion.h2>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            style={{
                                marginBottom: '50px',
                                paddingLeft: '20px',
                                borderLeft: '2px solid var(--primary-color)',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                left: '-9px',
                                top: '0',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: 'var(--primary-color)'
                            }}></div>

                            <div style={{ marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{exp.role}</h3>
                                <span style={{ color: 'var(--primary-color)', fontWeight: 500 }}>{exp.date}</span>
                            </div>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>{exp.company}</h4>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{exp.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    style={{ fontSize: '2.5rem', margin: '80px 0 50px', textAlign: 'center' }}
                >
                    <span className="gradient-text">Internships</span>
                </motion.h2>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {internships.map((intern, index) => (
                        <motion.div
                            key={intern.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            style={{
                                marginBottom: '50px',
                                paddingLeft: '20px',
                                borderLeft: '2px solid var(--primary-color)',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                left: '-9px',
                                top: '0',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: 'var(--primary-color)'
                            }}></div>

                            <div style={{ marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{intern.role}</h3>
                                <span style={{ color: 'var(--primary-color)', fontWeight: 500 }}>{intern.date}</span>
                            </div>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>{intern.company}</h4>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '15px' }}>{intern.description}</p>

                            <a
                                href={intern.certificate}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--primary-color)',
                                    fontWeight: 500,
                                    fontSize: '0.9rem'
                                }}
                            >
                                View Certificate <span>→</span>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
