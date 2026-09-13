import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiChevronDown, FiChevronUp, FiAward } from 'react-icons/fi';

const Projects = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    // Using a state array to manage which project "Deep Dives" are expanded
    const [expandedProjects, setExpandedProjects] = useState([]);

    const toggleProject = (id) => {
        setExpandedProjects(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const categories = ['All', 'Cloud & Architecture', 'Data Quality', 'Performance Optimization'];

    const projectsData = [
        {
            id: 1,
            title: 'Project OMNI - Teradata to Hadoop Migration',
            category: 'Performance Optimization',
            client: 'Bank of America (via Infosys)',
            date: 'Mar 2022 – Mar 2023',
            tags: ['Hadoop', 'Hive/HDFS', 'Tez', 'DataStage', 'Kerberos'],
            impact: 'Reduced query times from 45m to <10m',
            summary: 'Engineered a highly optimized Proof of Concept (POC) to transition enterprise data workloads from Teradata to Cloudera Hadoop, resolving major SLA bottlenecks.',
            deepDive: (
                <div className="deep-dive-content">
                    <h4>The Business Catalyst & Architectural Context</h4>
                    <p>I spearheaded a strategic Proof of Concept (POC) aimed at replacing the expensive, monolithic Teradata data warehouse with Cloudera Hadoop (Hive/HDFS). The client's existing massive DataStage ETL pipelines were bottlenecking on Teradata IO, regularly missing SLAs for critical end-of-day regulatory reporting.</p>

                    <h4>My Core Engineering Responsibilities:</h4>
                    <ul>
                        <li><strong>Connector Optimization & The HDFS Bypass Strategy:</strong> I replaced the standard Teradata JDBC connector with the DataStage Native HDFS connector. Instead of forcing data through the compute layer, I engineered the pipeline to write Snappy-compressed Parquet files directly into HDFS landing zones, completely bypassing the JDBC overhead.</li>
                        <li><strong>Schema Enforcement & Dynamic Partitioning:</strong> Once data landed in HDFS, I wrote highly tuned HiveQL scripts running on the Tez execution engine. I implemented <code>INSERT OVERWRITE</code> with dynamic partitioning to instantly register the new partitions in the Hive Metastore without manual ALTER TABLE commands.</li>
                        <li><strong>ACID Compliance & Security Configuration:</strong> To support downstream BI tool updates, I configured the Hive tables using the ORC format with transactional properties enabled (ACID). I secured the pipeline by configuring the JDBC connection to HiveServer2 via Kerberos, implementing automated kinit cron jobs to refresh the headless keytab before the pipeline execution window.</li>
                    </ul>

                    <h4>The Strategic Resolution</h4>
                    <p>My optimizations reduced the data load and registration time from 45 minutes down to under 10 minutes. The POC successfully proved that Hadoop could out-perform Teradata for this workload at a fraction of the cost, resulting in the client green-lighting the multi-million dollar migration phase.</p>
                </div>
            )
        },
        {
            id: 2,
            title: 'HCSC Infrastructure Modernization',
            category: 'Cloud & Architecture',
            client: 'Health Care Service Corporation (via Infosys)',
            date: 'Nov 2021 – Feb 2022',
            tags: ['Azure Synapse', 'PySpark', 'ADF', 'Hive'],
            impact: 'Zero Data Loss Migration',
            summary: 'Executed a mission-critical infrastructure modernization from on-premise Cloudera Data Platform to Azure Synapse Analytics under strict compliance and zero-data-loss constraints.',
            deepDive: (
                <div className="deep-dive-content">
                    <h4>The Business Catalyst & Architectural Context</h4>
                    <p>Joined the HCSC account during a critical infrastructure modernization phase. The enterprise was migrating off a legacy, on-premise Cloudera Data Platform (CDP) to reduce Total Cost of Ownership (TCO) and centralize analytics in the Azure cloud. Given the healthcare customer and enrollment data involved, operational constraints were strict: zero data loss, exact schema preservation, and highly monitored access controls. The target architecture was built around Azure Synapse Analytics.</p>

                    <h4>My Core Engineering Responsibilities:</h4>
                    <ul>
                        <li><strong>Dependency Mapping & Pipeline Orchestration:</strong> I reverse-engineered legacy Oozie workflows, identifying hidden data dependencies. I mapped these to modern Azure Synapse Pipelines (and some Airflow DAGs) to ensure the execution order of PySpark data transformation scripts was preserved exactly.</li>
                        <li><strong>Audit Controls & Data Fidelity:</strong> I engineered automated Unix shell scripts executing on the legacy Hive edge nodes. These scripts systematically generated record counts, checksums, and schema DDLs for hundreds of tables, storing the baseline audit data in blob storage.</li>
                        <li><strong>Cross-Platform ETL Consolidation:</strong> Re-wrote legacy Talend ingestion jobs into native Azure Data Factory (ADF) copy activities.</li>
                        <li><strong>Testing and Validation:</strong> Post-migration, I wrote PySpark validation scripts in Synapse Notebooks to join the legacy audit baselines against the new Synapse Dedicated SQL Pools, programmatically proving zero data loss and perfect schema translation to the business stakeholders.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 3,
            title: 'Global Card Issuer ODL Platform',
            category: 'Data Quality',
            client: 'American Express (via EY)',
            date: '2024 - Present',
            tags: ['GCP BigQuery', 'Cloud Composer', 'SQL', 'Data Quality'],
            impact: '60% reduction in pipeline failures',
            summary: 'Architecting an Operational Data Layer (ODL) and a comprehensive data validation framework for massive-scale credit card datasets.',
            deepDive: (
                <div className="deep-dive-content">
                    <h4>Architectural Context</h4>
                    <p>Designed and deployed an end-to-end Operational Data Layer (ODL) that serves as a new Source of Record (SOR) for demographic and behavioral data. Replaced legacy monolithic ingestion processes with highly scalable GCP components.</p>
                    <h4>Core Engineering Responsibilities:</h4>
                    <ul>
                        <li><strong>Data Quality Framework:</strong> Built a comprehensive Data Quality (DQ) engine running 500+ automated validation rules. This framework enforces strict governance, preventing corrupted data from entering downstream ML models and BI dashboards.</li>
                        <li><strong>Orchestration:</strong> Utilized GCP Cloud Composer (Apache Airflow) to orchestrate complex ETL/ELT DAGs, dynamically scaling workers to handle high-throughput batch files.</li>
                        <li><strong>Legacy Migration:</strong> Reverse-engineered legacy business logic embedded in old Unix and SQL systems, translating them into modern, scalable BigQuery SQL transformations.</li>
                    </ul>
                </div>
            )
        }
    ];

    const filteredProjects = activeFilter === 'All'
        ? projectsData
        : projectsData.filter(p => p.category === activeFilter);

    return (
        <section id="projects" className="section" style={{ background: 'var(--surface-card)' }}>
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-subtitle">Deep Dives & Master References</span>
                    <h2 className="section-heading">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
                        Expand the project cards below for detailed architectural context and core engineering responsibilities.
                    </p>
                </div>

                {/* Filter Categories */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            style={{
                                padding: '8px 18px',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                background: activeFilter === cat ? 'var(--primary-color)' : 'transparent',
                                color: activeFilter === cat ? '#fff' : 'var(--text-secondary)',
                                border: '1px solid',
                                borderColor: activeFilter === cat ? 'var(--primary-color)' : 'var(--card-border)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Projects Grid Container (Using Flex column for Deep Dives) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="glass-card"
                                style={{ padding: '0', overflow: 'hidden' }}
                            >
                                {/* Project Card Header (Always visible) */}
                                <div style={{ padding: '28px', borderBottom: expandedProjects.includes(project.id) ? '1px solid var(--card-border)' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                                                {project.title}
                                            </h3>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px', fontWeight: 500 }}>
                                                {project.client} | {project.date}
                                            </div>
                                        </div>
                                        {/* Impact Badge */}
                                        <div style={{
                                            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(14,165,233,0.1))',
                                            border: '1px solid rgba(139,92,246,0.2)',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            color: 'var(--accent-purple)',
                                            fontWeight: 600,
                                            fontSize: '0.85rem'
                                        }}>
                                            <FiAward size={14} />
                                            {project.impact}
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                                        {project.summary}
                                    </p>

                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                        {project.tags.map((tag) => (
                                            <span key={tag} style={{
                                                fontSize: '0.75rem',
                                                padding: '4px 10px',
                                                background: 'var(--bg-color)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '4px',
                                                color: 'var(--text-muted)',
                                                fontWeight: 600,
                                                letterSpacing: '0.5px'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => toggleProject(project.id)}
                                        className="btn-primary"
                                        style={{ padding: '8px 16px', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}
                                    >
                                        <span>{expandedProjects.includes(project.id) ? 'Close Deep Dive' : 'Read Master Reference Deep Dive'}</span>
                                        {expandedProjects.includes(project.id) ? <FiChevronUp /> : <FiChevronDown />}
                                    </button>
                                </div>

                                {/* Deep Dive Content (Expandable) */}
                                <AnimatePresence>
                                    {expandedProjects.includes(project.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{
                                                padding: '30px',
                                                background: 'rgba(0,0,0,0.02)',
                                                borderTop: '1px solid var(--card-border)'
                                            }}>
                                                <style dangerouslySetInnerHTML={{__html: `
                                                    .deep-dive-content h4 { font-size: 1.15rem; color: var(--primary-color); margin-top: 24px; margin-bottom: 12px; font-weight: 600; }
                                                    .deep-dive-content h4:first-child { margin-top: 0; }
                                                    .deep-dive-content p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px; font-size: 0.95rem; }
                                                    .deep-dive-content ul { list-style-type: none; padding-left: 0; margin-bottom: 16px; }
                                                    .deep-dive-content li { position: relative; padding-left: 20px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px; font-size: 0.95rem; }
                                                    .deep-dive-content li::before { content: "▹"; position: absolute; left: 0; color: var(--accent-purple); font-weight: bold; }
                                                    .deep-dive-content code { background: var(--bg-color); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; font-family: monospace; border: 1px solid var(--card-border); color: var(--text-primary); }
                                                `}} />
                                                {project.deepDive}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Projects;
