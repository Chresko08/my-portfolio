import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiChevronDown, FiChevronUp, FiExternalLink, FiAward, FiCheck } from 'react-icons/fi';

const Experience = ({ viewMode }) => {
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
            date: 'Nov 2024 – Present',
            metrics: ['+20% Data Reliability', '500+ Automated Rules', 'GCP BigQuery & Composer'],
            description: 'Architecting and orchestrating highly scalable data pipelines using GCP BigQuery to integrate disparate external architectures, ensuring strict data localization and regulatory compliance.',
            highlights: [
                'Architected and deployed an end-to-end Operational Data Layer (ODL) in GCP BigQuery, engineering complex ledger cross-referencing and left anti-joins to process 15M+ transactional records. This pipeline directly empowered product teams to execute high-yield marketing campaigns targeting dormant offer enrollees.',
                'Spearheaded the legacy decommissioning of 4 MapR Hadoop/Oracle Systems of Record (SORs), orchestrating the migration of fragmented demographic data into a unified Customer 360 (C360) Single Source of Truth (SSOT) to strictly enforce enterprise data localization.',
                'Engineered deterministic deduplication and schema evolution frameworks, utilizing advanced BigQuery Window functions (ROW_NUMBER) and CTEs to guarantee 100% data fidelity and exact state resolution for daily append-load workloads.',
                'Re-architected a massive-scale Data Quality (DQ) framework within the Qalibrate portal, systematically refactoring legacy Hive logic into optimized BigQuery SQL. Enforced strict datatype mapping (e.g., upcasting to BIGNUMERIC for precise financial ledgers) to eliminate zero-coverage gaps on Critical Data Elements (CDEs).',
                'Orchestrated fault-tolerant ETL pipelines using GCP Cloud Composer (Apache Airflow), architecting resilient DAG dependencies and driving rigorous Post-Implementation Verification (PIV) protocols to ensure zero data loss during critical cloud cutovers.'
            ],
            project: {
                title: 'Global Card Issuer ODL Platform',
                impact: '60% reduction in pipeline failures',
                tags: ['GCP BigQuery', 'Cloud Composer', 'SQL', 'Data Quality'],
                deepDive: (
                    <div className="deep-dive-content">
                        <h4>The Business Catalyst & Architectural Context</h4>
                        <p>I am a Data Engineer for American Express, driving a massive infrastructure modernization from an on-premise MapR Hadoop/Hive data lake (Cornerstone) to a cloud-native GCP BigQuery architecture (Lumi). My mandate spans three critical pillars: architecting Operational Data Layers (ODLs) for targeted marketing campaigns, executing major Source of Record (SOR) migrations to establish Single Sources of Truth (SSOT), and engineering a stringent Data Quality (DQ) framework to ensure zero-defect regulatory compliance across the massive-scale card-issuer platform.</p>
                        
                        <h4>My Core Engineering Responsibilities</h4>
                        <ul>
                            <li><strong>Operational Data Layer (ODL) Engineering:</strong> I architected an end-to-end ODL to power a high-priority marketing campaign targeting customers who enrolled in offers but never redeemed them. I reverse-engineered legacy Oracle SQL logic (previously executed manually by adjacent teams) and modernized it for BigQuery. I engineered complex pipelines to process 10-15 million records, cross-referencing customer enrollment tables with transactional ledger tables. By isolating enrollee data and performing left anti-joins/filtering against redeemer data, I created a highly performant dataset that directly empowered the product team's targeting logic.</li>
                            <li><strong>Source of Record (SOR) Migrations & SSOT Consolidation:</strong> I drove the migration and decommissioning of 4 major legacy systems, including transitioning USMR to R42 and consolidating fragmented customer demographic sources into a unified C360 SSOT. Because data quality at Amex requires absolute precision, I handled complex edge cases in customer deduplication. I utilized advanced BigQuery window functions—specifically <code>ROW_NUMBER() OVER(PARTITION BY cm13/customerID ORDER BY last_updated_timestamp DESC)</code>—to enforce strict deduplication and extract the most recent valid customer state. I owned the Post-Implementation Verification (PIV) testing phase, ensuring that the daily append outputs of the new Lumi pipelines matched the legacy business logic outputs precisely before providing production sign-off.</li>
                            <li><strong>Data Quality (DQ) Framework & Dialect Translation:</strong> I migrated and strengthened hundreds of Data Quality rules from the legacy Cornerstone (Hive) environment to Lumi (BigQuery) using the Qalibrate DQM portal. I analyzed pass/fail rates for Critical Data Elements (CDE) and non-CDE attributes, secured Product Owner sign-off, and engineered custom BigQuery SQL logic (CTEs, Window Functions) to close coverage gaps. I executed a massive dialect translation effort, refactoring legacy Hive queries into native BigQuery SQL. This required systematic data type downcasting and upcasting, alongside rewriting string, date, and null-handling functions to optimize compute costs.</li>
                            <li><strong>Pipeline Orchestration (Cloud Composer/Airflow):</strong> I orchestrated the daily append load jobs for the new ODL and migrated SSOTs utilizing GCP Cloud Composer (Apache Airflow). I configured DAGs, established logical task dependencies between BigQuery extraction and load operators, and monitored execution logs during integration testing to guarantee fault-tolerant daily pipeline runs.</li>
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
                'Engineered multi-layered ETL pipelines for loan syndication regulatory reporting, writing Unix shell scripts and Oracle SQL to orchestrate data flow across Staging, Curated, and Materialized layers for millions of financial records.',
                'Automated enterprise data quality (DQ) validation by integrating a centralized REST API portal, parsing JSON responses via awk to enforce automated pipeline hard-stops and email alerting upon validation failures.',
                'Directed monthly production deployments and cross-functional release management, enforcing a strict CI/CD sequence (Unix -> Oracle -> Autosys JIL) and conducting rigorous Post-Implementation Verification (PIV) to guarantee zero-defect rollouts.',
                'Collaborated with internal platform teams to optimize a nascent DQ portal, driving architectural upgrades to connection stability and data retention schedules while mentoring 3 junior developers in SDLC best practices and complex deployment workflows.',
                'Orchestrated automated job scheduling and dependency management using Autosys, ensuring high availability and fault-tolerant execution of critical regulatory reporting workloads.'
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
                'Architected a high-throughput Teradata-to-Hadoop migration POC using IBM DataStage, establishing the initial Dev environment, configuring Kerberos service principals, and managing JDBC connectivity across Oracle, DB2, and Hive systems.',
                'Engineered an HDFS bypass ingestion strategy for billion-row historical loads, swapping JDBC Hive connectors for Native HDFS file streaming, reducing processing time for massive datasets from 45 minutes to under 10 minutes.',
                'Optimized Hadoop execution pipelines by decoupling data ingestion from schema enforcement, loading Snappy-compressed Parquet files into external staging tables before utilizing Tez execution engines to dynamically partition and bucket the finalized datasets.',
                'Implemented ACID-compliant mutation pipelines via HiveServer2 and ORC formatting, ensuring robust security by managing keytab generation and automating kinit cron routines to prevent Kerberos ticket expiration during long-running batch operations.',
                'Mentored junior engineers and documented tuning strategies including dynamic partition thresholds and parallel execution parameters, successfully meeting stringent SLA targets before the strategic reprioritization of Project OMNI.'
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
                'Engineered the lift-and-shift migration of legacy PySpark and Scala workloads from an on-premise Cloudera Data Platform to Azure, orchestrating complex execution dependencies to extract heterogeneous files (Avro, Parquet, JSON) from ADLS Gen2, apply transformations, and load into Synapse Dedicated SQL Pools.',
                'Developed and executed Unix shell scripts on legacy Hive edge nodes to establish stringent audit controls and metadata baselines, ensuring 100% data fidelity and exact row-count reconciliation for highly sensitive healthcare enrollment data during the cloud cutover.',
                'Reverse-engineered legacy Talend ETL jobs and mapped complex data dependencies, migrating transformation logic into native Azure Data Factory (ADF) pipelines to consolidate enterprise orchestration and reduce third-party licensing overhead.',
                'Conducted rigorous end-to-end testing of Synapse Pipeline activities, monitoring execution logs to resolve schema mismatches and validate proper execution order within the dependency graph, resulting in zero data loss during staging layer loads.'
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
        <section id="experience" className="section" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
            <div className="container">
                <div className="section-title-wrap" style={{ marginBottom: '40px' }}>
                    <span className="section-subtitle">Career Pathway & Featured Projects</span>
                    <h2 className="section-heading">
                        Work <span className="gradient-text">Experience</span>
                    </h2>
                </div>

                {/* Timeline Container */}
                <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
                    {/* Glowing vertical line */}
                    <div style={{
                        position: 'absolute',
                        left: '16px',
                        top: '10px',
                        bottom: '10px',
                        width: '2px',
                        background: 'linear-gradient(to bottom, var(--primary-color), var(--accent-purple), transparent)',
                        borderRadius: '2px',
                        opacity: 0.5
                    }} />

                    {experiences.map((exp, expIdx) => (
                        <div key={exp.id} style={{ marginBottom: '40px' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.05 }}
                                viewport={{ once: true, margin: "-50px" }}
                                style={{
                                    position: 'relative',
                                    paddingLeft: '48px'
                                }}
                            >
                                {/* Timeline Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '9px',
                                    top: '24px',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    background: 'var(--surface-card)',
                                    border: '3px solid var(--primary-color)',
                                    zIndex: 2,
                                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
                                }}></div>
                                
                                {/* Experience Glass Card */}
                                <div className="glass-card" style={{ padding: '24px' }}>
                                    {/* Header Row */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flexWrap: 'wrap',
                                        gap: '12px',
                                        marginBottom: '12px'
                                    }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px', color: 'var(--primary-color)' }}>
                                                {exp.role}
                                            </h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
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
                                                padding: '4px 12px',
                                                borderRadius: '9999px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                background: 'var(--badge-bg)',
                                                border: '1px solid var(--badge-border)',
                                                color: 'var(--text-primary)'
                                            }}>
                                                <FiCalendar size={12} style={{ color: 'var(--primary-color)' }} />
                                                {exp.date}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Highlights list */}
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {exp.highlights.map((h, hIdx) => (
                                            <li key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                                <FiCheck style={{ color: 'var(--accent-emerald)', marginTop: '4px', flexShrink: 0 }} size={14} />
                                                <span>{h}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Project Deep Dive (hidden in recruiter view) */}
                                    {exp.project && viewMode !== 'recruiter' && (
                                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
                                            <div style={{
                                                background: 'var(--surface-color)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '8px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                                                        <h6 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                                                            {exp.project.title}
                                                        </h6>
                                                    </div>

                                                    <button
                                                        onClick={() => toggleProject(exp.id)}
                                                        className="btn-secondary"
                                                        style={{ padding: '6px 14px', fontSize: '0.85rem', width: '100%', justifyContent: 'center', border: '1px solid var(--card-border)' }}
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
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                            style={{ overflow: 'hidden' }}
                                                        >
                                                            <div style={{
                                                                padding: '20px',
                                                                background: 'rgba(0,0,0,0.02)',
                                                                borderTop: '1px solid var(--card-border)'
                                                            }}>
                                                                <style dangerouslySetInnerHTML={{__html: `
                                                                    .deep-dive-content h4 { font-size: 1rem; color: var(--primary-color); margin-top: 16px; margin-bottom: 8px; font-weight: 600; }
                                                                    .deep-dive-content h4:first-child { margin-top: 0; }
                                                                    .deep-dive-content p { color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px; font-size: 0.9rem; }
                                                                    .deep-dive-content ul { list-style-type: none; padding-left: 0; margin-bottom: 12px; }
                                                                    .deep-dive-content li { position: relative; padding-left: 16px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px; font-size: 0.9rem; }
                                                                    .deep-dive-content li::before { content: "▹"; position: absolute; left: 0; color: var(--accent-purple); font-weight: bold; }
                                                                    .deep-dive-content code { background: var(--bg-color); padding: 2px 4px; border-radius: 4px; font-size: 0.85em; font-family: monospace; border: 1px solid var(--card-border); color: var(--text-primary); }
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
