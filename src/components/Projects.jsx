import React from 'react';
import { motion } from 'framer-motion';

const Projects = () => {
    const professionalProjects = [
        {
            id: 1,
            title: 'Data Quality Modernization',
            description: 'Designed and implemented a comprehensive data quality framework for a major US card issuer. Developed 500+ complex SQL/BigQuery rules to validate marketing data, achieving a 30% reduction in failures. Architected a new Operational Data Layer (ODL) to support targeted customer enrollment and redemption campaigns.',
            tags: ['GCP BigQuery', 'SQL', 'Data Quality', 'ODL'],
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '60px', height: '60px', color: '#10b981' }}>
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            id: 2,
            title: 'Regulatory Reporting Automation',
            description: 'Built an end-to-end automated workflow for quarterly regulatory reporting in loan syndication. Utilized workload automation tools to orchestrate complex data pipelines, reducing manual effort and increasing process efficiency by 60%. Implemented multi-layered data transformations (Staging to Materialized) for downstream analytics.',
            tags: ['Automation', 'Unix', 'SQL', 'Data Pipelines'],
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '60px', height: '60px', color: '#f43f5e' }}>
                    <path d="M9 17V7M12 17V12M15 17V10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 12H21M3 6H21M3 18H21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            id: 3,
            title: 'Teradata to Hadoop Migration',
            description: 'Led a critical migration initiative for a global investment bank, moving massive datasets from legacy Teradata systems to a modern Hadoop/Hive architecture. This strategic move significantly reduced data storage costs and leveraged distributed processing to improve query performance and scalability.',
            tags: ['Hadoop', 'Hive', 'Teradata', 'Migration'],
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '60px', height: '60px', color: '#a855f7' }}>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
                    <path d="M12 8V16" strokeLinecap="round" />
                    <path d="M8 12H16" strokeLinecap="round" />
                </svg>
            )
        },
        {
            id: 4,
            title: 'Azure Cloud Migration',
            description: 'Directed the migration of mission-critical PySpark and Scala data pipelines to the Azure cloud for a leading health insurer. Optimized the infrastructure to reduce costs by 25% while enhancing system scalability. Conducted rigorous end-to-end testing to ensure zero downtime during the transition.',
            tags: ['Azure', 'PySpark', 'Scala', 'Cloud'],
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '60px', height: '60px', color: '#3b82f6' }}>
                    <path d="M7 16.5C3.5 16.5 2 14 2 11C2 8 4 6 7 6C7.5 3 10 2 12 2C15 2 17 4 17 6C20.5 6 22 8.5 22 11.5C22 14.5 20 16.5 17 16.5H7Z" />
                    <path d="M12 12V22" strokeLinecap="round" />
                    <path d="M16 18L12 22L8 18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        }
    ];

    const personalProjects = [
        {
            id: 5,
            title: 'AWS Hands-On Infrastructure',
            description: 'Architected a fault-tolerant web application environment using AWS Elastic Beanstalk with auto-scaling and load balancing. Configured S3 lifecycle policies (Glacier Deep Archive) for cost-effective storage and integrated RDS MySQL databases with Python-based backend services for seamless data operations.',
            tags: ['AWS', 'EC2', 'S3', 'RDS', 'Python'],
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '60px', height: '60px', color: '#f59e0b' }}>
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        }
    ];

    const ProjectCard = ({ project, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            style={{
                background: 'var(--bg-color)',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.05)'
            }}
        >
            <div style={{
                height: '120px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    {project.icon}
                </motion.div>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{project.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {project.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {project.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.8rem', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '4px 10px', borderRadius: '15px' }}>
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>
    );

    return (
        <section id="projects" className="section" style={{ background: 'var(--surface-color)' }}>
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    style={{ fontSize: '2.5rem', marginBottom: '60px', textAlign: 'center' }}
                >
                    Featured <span className="gradient-text">Projects</span>
                </motion.h2>

                <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', borderLeft: '4px solid var(--primary-color)', paddingLeft: '15px' }}>Professional Work</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                    {professionalProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', borderLeft: '4px solid #f59e0b', paddingLeft: '15px' }}>Hands-on & Personal</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {personalProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
