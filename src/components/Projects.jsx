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
                    <p>I operated as the primary Big Data Engineer on Project OMNI, a high-stakes Proof of Concept (POC) at Bank of America designed to evaluate if Cloudera Hadoop (Hive/HDFS) could replace Teradata for processing billions of records, thereby eliminating massive Teradata licensing costs. The business mandate was strict: the new Hadoop architecture had to match or beat the legacy Teradata load times. I was responsible for migrating complex IBM DataStage ETL pipelines connected to Teradata, Oracle, and DB2 over to the new Hadoop ecosystem, configuring the development environment from scratch, and establishing the security protocols via Kerberos.</p>

                    <h4>My Core Engineering Responsibilities</h4>
                    
                    <ul>
                        <li><strong>Connector Optimization & The HDFS Bypass Strategy:</strong> My primary technical hurdle was massive data latency. Initial full-history load jobs of billion-row tables using the standard DataStage Hive JDBC connector took approximately 45 minutes. By injecting Hive execution properties (hive.execution.engine=tez, hive.stats.autogather=false, and hive.optimize.sort.dynamic.partition.threshold=0), I reduced this to 30 minutes. To hit the sub-10-minute target, I abandoned the JDBC bottleneck entirely. I re-architected the pipeline to use the DataStage Native HDFS connector, writing Snappy-compressed Parquet files directly into a flat HDFS staging path in parallel.</li>
                        <li><strong>Schema Enforcement & Dynamic Partitioning:</strong> Once the raw data safely landed in the staging directory, I orchestrated a secondary Hive job to enforce the schema. Using Tez, I executed an INSERT OVERWRITE from the staging table into the final optimized Hive table, applying dynamic partitioning and bucketing based on HDFS block sizes and column cardinality. This decoupled write-and-load pattern drove execution time down to under 10 minutes.</li>
                        <li><strong>ACID Compliance & Security Configuration:</strong> For specific workloads requiring state mutations (updates/deletes), I maintained the DataStage Hive connector but mandated the use of the ORC file format and HiveServer2 to ensure ACID compliance. Because these batch jobs ran extensively, I engineered secure authentication by establishing service principals and automating keytab refreshes via kinit cron routines, eliminating pipeline failures caused by Kerberos ticket expiration.</li>
                        <li><strong>Strategic Project Resolution:</strong> I drove this application track independently for several months before mentoring a new engineer to assist in pipeline delivery. While my team successfully met the sub-10-minute SLA for high-throughput batch loads, Project OMNI ultimately lost funding because other business units failed to achieve the necessary sub-second latency required for their OLTP-style applications, proving that while Hadoop is superior for batch staging, it cannot economically replace Teradata for highly concurrent, low-latency operational reporting.</li>
                    </ul>
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
                    <p>I joined the Health Care Service Corporation (HCSC) account during a critical infrastructure modernization phase. The enterprise was migrating off a legacy, on-premise Cloudera Data Platform (CDP) to reduce Total Cost of Ownership (TCO) and centralize analytics in the Azure cloud. Because I was dealing with healthcare customer and enrollment data, the operational constraints were strict: zero data loss, exact schema preservation, and highly monitored access controls.</p>

                    <p>The target architecture was built around Azure Synapse Analytics. The data flow operated in a decoupled compute-and-storage model. Legacy data (heterogeneous formats including JSON, CSV, ORC, Avro, and Parquet) landed in Azure Data Lake Storage (ADLS Gen2). From there, PySpark and Scala scripts executed the necessary transformations before loading the finalized datasets into Synapse Dedicated SQL Pools for downstream consumption.</p>

                    <h4>My Core Engineering Responsibilities</h4>
                    <p>Because this was an accelerated "lift-and-shift" migration, the engineering friction was not in writing new business logic, but in safely transplanting massive, highly interdependent legacy systems without breaking the execution order.</p>

                    <ul>
                        <li><strong>Dependency Mapping & Pipeline Orchestration:</strong> My primary challenge was reverse-engineering the execution dependencies of the existing on-premise workloads. I configured and deployed Azure Synapse Pipelines to orchestrate the Spark scripts. I had to map out the exact sequence of data extraction from ADLS, ensure the Spark transformations successfully completed, and orchestrate the final load into the Synapse Dedicated SQL Pools. Misunderstanding a single dependency in this Directed Acyclic Graph (DAG) would result in incomplete data loads or schema failures.</li>
                        <li><strong>Audit Controls & Data Fidelity:</strong> Migrating healthcare data requires mathematical proof that the source and target match perfectly. I utilized Unix shell scripts running directly on the legacy Hive edge nodes. These scripts queried the on-premise Hive tables to capture baseline audit controls—extracting exact row counts, partition sizes, and structural metadata. This baseline was strictly required to validate the success of the Azure migration.</li>
                        <li><strong>Cross-Platform ETL Consolidation (Talend to ADF):</strong> In parallel with the CDP migration, HCSC was actively decommissioning legacy third-party tools to reduce licensing overhead. I contributed to a sub-project migrating standalone Talend ETL jobs into Azure Data Factory (ADF). I analyzed the existing Talend pipeline logic, documented the dependencies, and mapped the transformations into native ADF pipeline activities.</li>
                        <li><strong>Testing and Validation:</strong> I conducted rigorous end-to-end unit testing of the PySpark scripts within the new Azure environment. I monitored pipeline execution logs to identify and resolve any dependency failures or schema mismatches before the pipelines were promoted to higher environments.</li>
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
