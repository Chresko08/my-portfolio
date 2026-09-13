import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiChevronDown, FiChevronUp, FiExternalLink, FiAward, FiCheck } from 'react-icons/fi';

const Experience = () => {
    // Array to manage which project "Deep Dives" are expanded
    const [expandedProjects, setExpandedProjects] = useState([]);

    const toggleProject = (id) => {
        setExpandedProjects(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const experiences = [
        {
            id: 'ey-amex',
            company: 'EY',
            role: 'Consultant - Data Engineer',
            client: 'Client: American Express',
            date: 'Dec 2024 – Nov 2026',
            metrics: ['+20% Data Reliability', '500+ Automated Rules', 'GCP BigQuery & Composer'],
            description: 'Architecting and orchestrating highly scalable data pipelines using GCP BigQuery to integrate disparate external architectures, ensuring strict data localization and regulatory compliance.',
            highlights: [
                'Designed and deployed an end-to-end Operational Data Layer (ODL) establishing a new Source of Record (SOR). Automated ETL/ELT pipelines using GCP Cloud Composer (Apache Airflow).',
                'Engineered a robust Data Quality (DQ) framework across a massive-scale platform, implementing 500+ automated validation rules. Eliminated zero-coverage gaps, reducing pipeline failures by 60% and improving reliability by 20%.',
                'Migrated demographic data from multiple legacy systems into a modernized Single Source of Truth (SSOT), reverse-engineering complex business logic via Unix and SQL.',
                'Mentored a team of 3 data professionals, driving engineering best practices, conducting code reviews, and resolving pipeline bottlenecks.',
                'Delivered critical infrastructure for the "Early Evidence Campaign," empowering product teams with high-value customer targeting insights through complex behavioral data.'
            ],
            project: {
                title: 'Global Card Issuer ODL Platform',
                impact: '60% reduction in pipeline failures',
                tags: ['GCP BigQuery', 'Cloud Composer', 'SQL', 'Data Quality'],
                deepDive: (
                    <div className="deep-dive-content">
                        <h4>Architectural Context</h4>
                        <p>Designed and deployed an end-to-end Operational Data Layer (ODL) that serves as a new Source of Record (SOR) for demographic and behavioral data. Replaced legacy monolithic ingestion processes with highly scalable GCP components.</p>
                        <h4>Core Engineering Responsibilities</h4>
                        <ul>
                            <li><strong>Data Quality Framework:</strong> Built a comprehensive Data Quality (DQ) engine running 500+ automated validation rules. This framework enforces strict governance, preventing corrupted data from entering downstream ML models and BI dashboards.</li>
                            <li><strong>Orchestration:</strong> Utilized GCP Cloud Composer (Apache Airflow) to orchestrate complex ETL/ELT DAGs, dynamically scaling workers to handle high-throughput batch files.</li>
                            <li><strong>Legacy Migration:</strong> Reverse-engineered legacy business logic embedded in old Unix and SQL systems, translating them into modern, scalable BigQuery SQL transformations.</li>
                        </ul>
                    </div>
                )
            }
        },
        {
            id: 'inf-bofa-loan',
            company: 'Infosys',
            role: 'Lead ETL Developer',
            client: 'Client: Bank of America',
            date: 'Apr 2023 – Aug 2024',
            metrics: ['Zero-Defect Compliance', 'REST API Integration', 'CI/CD Orchestration'],
            description: 'Led the ETL development and deployment for regulatory reporting pipelines processing millions of financial records.',
            highlights: [
                'Developed an end-to-end workflow for quarterly regulatory reporting for loan syndication analysis, automating jobs using workload automation tools to increase efficiency by 60%.',
                'Led the migration of data quality checks from an existing workflow to a separate application with a web portal, providing real-time status updates and detailed reporting.',
                'Used Bitbucket/Git and collaborated with CI/CD teams to ensure smooth deployment of code to production, reducing deployment time by 30%.'
            ],
            project: {
                title: 'My Project Loan Syndication Master Reference',
                impact: '60% Efficiency Increase',
                tags: ['Oracle SQL', 'Unix Shell', 'Autosys', 'REST API', 'JSON/AWK'],
                deepDive: (
                    <div className="deep-dive-content">
                        <h4>The Business Catalyst & Architectural Context</h4>
                        <p>I operated as the lead ETL developer for Bank of America\'s loan syndication regulatory reporting pipelines. This was a highly structured Agile environment enforcing rigorous SDLC protocols, JIRA-driven sprint planning, and strict release management. The architecture was a traditional, high-volume RDBMS stack processing millions of financial records. We utilized Oracle as the primary data warehouse, Unix shell scripting for data manipulation, and Autosys for enterprise workload orchestration.</p>
                        
                        <h4>My Core Engineering Responsibilities</h4>
                        <ul>
                            <li><strong>Multi-Layered ETL Architecture:</strong> I engineered the end-to-end data flow using a rigid, tiered architecture. I wrote Unix shell scripts containing parameterized Oracle SQL to extract data from upstream sources, load it into a Staging layer, apply business rules to push it to a Curated layer, and finally aggregate the metrics into a Materialized layer for downstream regulatory reporting. I prioritized code readability and deterministic execution over complex query logic to guarantee zero-defect compliance.</li>
                            <li><strong>Data Quality (DQ) API Integration:</strong> I led the migration of our legacy, SQL-based DQ checks to a newly developed centralized UI portal. To achieve this, I engineered shell scripts to execute REST API calls to the portal via curl. I used awk to parse the JSON responses. If the portal returned a failure status, I programmed the scripts to execute a hard-stop on the pipeline and trigger automated email alerts. Because the portal was in its infancy, I acted as a critical feedback loop, driving cross-team architectural improvements regarding connection stability, refresh schedules, and data retention policies.</li>
                            <li><strong>Release Management & CI/CD Orchestration:</strong> I owned the monthly production deployments for my team. I enforced a strict deployment dependency sequence: Unix (scripts) -{'>'} Oracle (schema/logic) -{'>'} Autosys (JIL files/orchestration). I coordinated directly with onshore and offshore production support teams. Before providing sign-off to proceed to the next layer in the deployment sequence, I executed rigorous Post-Implementation Verification (PIV) and sanity checks, maintaining the authority to trigger immediate rollbacks if data parity or code presence failed.</li>
                            <li><strong>Mentorship & Agile Leadership:</strong> As the sole senior developer on the team, I mentored three junior engineers. I onboarded them into the BofA ecosystem, teaching them the end-to-end SDLC, JIL file syntax for Autosys, Oracle SQL development standards, and the exact protocols for production deployment and monitoring.</li>
                        </ul>
                    </div>
                )
            }
        },
        {
            id: 'inf-bofa-omni',
            company: 'Infosys',
            role: 'Big Data Engineer',
            client: 'Client: Bank of America',
            date: 'Mar 2022 – Mar 2023',
            metrics: ['60% Automation Speedup', '25% Cost Reduction', 'Teradata → Hadoop'],
            description: 'Operated as the primary Big Data Engineer on a high-stakes POC to replace Teradata with Hadoop.',
            highlights: [
                'Led the migration of PySpark and Spark Scala scripts to Azure cloud servers, reducing infrastructure costs by 25% and enhancing scalability.',
                'Led the migration of data dependencies from Teradata to Hive, significantly reducing operational costs for managing large volumes of data by leveraging Hive\'s cost-effective architecture.'
            ],
            project: {
                title: 'Project OMNI - Teradata to Hadoop Migration',
                impact: 'Reduced query times from 45m to <10m',
                tags: ['Hadoop', 'Hive/HDFS', 'Tez', 'DataStage', 'Kerberos'],
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
            }
        },
        {
            id: 'inf-hcsc',
            company: 'Infosys',
            role: 'Big Data Engineer',
            client: 'Client: Health Care Service Corporation (HCSC)',
            date: 'Nov 2021 – Feb 2022',
            metrics: ['Zero Data Loss', 'Schema Preservation', 'Azure Synapse'],
            description: 'Engineered robust data pipelines and audit frameworks during a massive on-premise CDP to Azure cloud migration.',
            highlights: [
                'Migrated legacy PySpark and Spark Scala workloads into modern Azure Synapse Pipelines.',
                'Engineered automated Unix shell scripts running on Hive edge nodes to systematically generate pre-migration baselines for hundreds of tables.',
                'Validated perfect schema translation programmatically using Synapse Notebooks.'
            ],
            project: {
                title: 'HCSC Infrastructure Modernization',
                impact: 'Zero Data Loss Migration',
                tags: ['Azure Synapse', 'PySpark', 'ADF', 'Hive'],
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
            }
        },
        {
            id: 'inf-intern',
            company: 'Infosys',
            role: 'System Engineer Intern',
            client: 'Infosys Training Program',
            date: 'Feb 2021 – June 2021',
            metrics: ['LAMP Stack', 'Full-Stack Portal', 'Assessment: 81.6%'],
            description: 'Completed rigorous training on the LAMP stack and engineered a collaborative "Learner-Teacher Portal" for automated session scheduling.',
            highlights: [
                'Attained an 81.6% distinction in the comprehensive final technical assessment.',
                'Collaborated in a four-member engineering team to build a session scheduling portal with slot booking and course management.',
                'Implemented backend business logic and database integration for dynamic availability calendars.'
            ],
            project: null,
            certificate: 'https://drive.google.com/file/d/1TjlwMY3z7vPEvEU8M129hOcabnEyzdBK/view?usp=drive_link'
        }
    ];

    return (
        <section id="experience" className="section">
            <div className="container">
                <div className="section-title-wrap">
                    <span className="section-subtitle">Career Pathway & Featured Projects</span>
                    <h2 className="section-heading">
                        Work <span className="gradient-text">Experience</span>
                    </h2>
                </div>

                {/* Timeline Container */}
                <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
                    {/* Glowing vertical line */}
                    <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '10px',
                        bottom: '10px',
                        width: '2px',
                        background: 'linear-gradient(to bottom, var(--primary-color), var(--accent-purple), transparent)',
                        borderRadius: '2px',
                        opacity: 0.7
                    }} />

                    {experiences.map((exp, expIdx) => (
                        <div key={exp.id} style={{ marginBottom: '60px' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                                style={{
                                    position: 'relative',
                                    paddingLeft: '60px',
                                    marginBottom: '40px'
                                }}
                            >
                                {/* Timeline Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '9px',
                                    top: '32px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'var(--surface-card)',
                                    border: '3px solid var(--primary-color)',
                                    zIndex: 2,
                                    boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
                                }}></div>
                                
                                {/* Experience Glass Card */}
                                <div className="glass-card" style={{ padding: '32px' }}>
                                    {/* Header Row */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flexWrap: 'wrap',
                                        gap: '12px',
                                        marginBottom: '16px'
                                    }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '6px', color: 'var(--primary-color)' }}>
                                                {exp.role}
                                            </h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                                <strong style={{ color: 'var(--text-primary)' }}>{exp.company}</strong>
                                                <span>•</span>
                                                <span style={{ fontWeight: 500 }}>{exp.client}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '6px 14px',
                                                borderRadius: '9999px',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                background: 'var(--badge-bg)',
                                                border: '1px solid var(--badge-border)',
                                                color: 'var(--text-primary)'
                                            }}>
                                                <FiCalendar size={14} style={{ color: 'var(--primary-color)' }} />
                                                {exp.date}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Impact KPI Metric Badges */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '0 0 20px' }}>
                                        {exp.metrics.map((metric) => (
                                            <span key={metric} style={{
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                background: 'rgba(6, 182, 212, 0.1)',
                                                color: 'var(--accent-cyan)',
                                                border: '1px solid rgba(6, 182, 212, 0.25)'
                                            }}>
                                                ⚡ {metric}
                                            </span>
                                        ))}
                                    </div>

                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px' }}>
                                        {exp.description}
                                    </p>

                                    {/* Highlights list */}
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {exp.highlights.map((h, hIdx) => (
                                            <li key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                                <FiCheck style={{ color: 'var(--accent-emerald)', marginTop: '4px', flexShrink: 0 }} size={16} />
                                                <span>{h}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Certificate link for internship */}
                                    {exp.certificate && (
                                        <a
                                            href={exp.certificate}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-secondary"
                                            style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'inline-flex', marginBottom: '10px' }}
                                        >
                                            <span>View Internship Certificate</span>
                                            <FiExternalLink size={14} />
                                        </a>
                                    )}

                                    {/* Project Deep Dive */}
                                    {exp.project && (
                                        <div style={{ marginTop: '30px', paddingTop: '24px', borderTop: '1px solid var(--card-border)' }}>
                                            <h5 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
                                                Featured Project
                                            </h5>
                                            
                                            <div style={{
                                                background: 'var(--surface-color)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '12px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{ padding: '20px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                                                        <h6 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                                                            {exp.project.title}
                                                        </h6>
                                                        {exp.project.impact && (
                                                            <div style={{
                                                                background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(14,165,233,0.1))',
                                                                border: '1px solid rgba(139,92,246,0.2)',
                                                                padding: '4px 10px',
                                                                borderRadius: '6px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                color: 'var(--accent-purple)',
                                                                fontWeight: 600,
                                                                fontSize: '0.8rem'
                                                            }}>
                                                                <FiAward size={13} />
                                                                {exp.project.impact}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                                        {exp.project.tags.map((tag) => (
                                                            <span key={tag} style={{
                                                                fontSize: '0.75rem',
                                                                padding: '4px 10px',
                                                                background: 'var(--bg-color)',
                                                                border: '1px solid var(--card-border)',
                                                                borderRadius: '4px',
                                                                color: 'var(--text-muted)',
                                                                fontWeight: 600
                                                            }}>
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <button
                                                        onClick={() => toggleProject(exp.id)}
                                                        className="btn-secondary"
                                                        style={{ padding: '8px 16px', fontSize: '0.9rem', width: '100%', justifyContent: 'center', border: '1px solid var(--card-border)' }}
                                                    >
                                                        <span>{expandedProjects.includes(exp.id) ? 'Close Deep Dive' : 'Read Master Reference Deep Dive'}</span>
                                                        {expandedProjects.includes(exp.id) ? <FiChevronUp /> : <FiChevronDown />}
                                                    </button>
                                                </div>

                                                {/* Deep Dive Content (Expandable) */}
                                                <AnimatePresence>
                                                    {expandedProjects.includes(exp.id) && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                                            style={{ overflow: 'hidden' }}
                                                        >
                                                            <div style={{
                                                                padding: '24px',
                                                                background: 'rgba(0,0,0,0.02)',
                                                                borderTop: '1px solid var(--card-border)'
                                                            }}>
                                                                <style dangerouslySetInnerHTML={{__html: `
                                                                    .deep-dive-content h4 { font-size: 1.1rem; color: var(--primary-color); margin-top: 20px; margin-bottom: 12px; font-weight: 600; }
                                                                    .deep-dive-content h4:first-child { margin-top: 0; }
                                                                    .deep-dive-content p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px; font-size: 0.95rem; }
                                                                    .deep-dive-content ul { list-style-type: none; padding-left: 0; margin-bottom: 16px; }
                                                                    .deep-dive-content li { position: relative; padding-left: 20px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px; font-size: 0.95rem; }
                                                                    .deep-dive-content li::before { content: "▹"; position: absolute; left: 0; color: var(--accent-purple); font-weight: bold; }
                                                                    .deep-dive-content code { background: var(--bg-color); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; font-family: monospace; border: 1px solid var(--card-border); color: var(--text-primary); }
                                                                `}} />
                                                                {exp.project.deepDive}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
