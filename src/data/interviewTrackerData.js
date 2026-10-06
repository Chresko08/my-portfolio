export const resignationDetails = {
    resignationDate: 'Aug 22, 2026',
    lastWorkingDay: 'Nov 19, 2026',
    noticePeriod: '90 Days (Serving Notice)',
    currentCtc: '17 LPA Fixed + 20% Variable',
    expectedCtc: '20 - 24 LPA',
    activeOffer: 'Tech Mahindra — 21 LPA CTC (Bengaluru)',
    pendingResult: 'Nagarro — Round 1 Technical (Awaiting feedback)'
};

export const interviewRecords = [
    {
        id: 'tech-mahindra',
        company: 'Tech Mahindra',
        role: 'Sr. Software Engineer (Data Engineering / Cloud Analytics)',
        clientAccount: 'Standard Chartered Bank (SCB) — Global Business Services',
        date: 'Oct 3, 2026',
        status: 'selected',
        statusLabel: 'Internal Cleared • Offer Track',
        ctcOffered: '21 LPA CTC',
        location: 'Bengaluru (Hybrid, RMZ Ecoworld, Bellandur)',
        rounds: [
            {
                name: 'Round 1: Internal Technical Evaluation',
                date: 'Oct 3, 2026 (10:00 – 10:30 AM IST)',
                duration: '30 min',
                platform: 'MS Teams',
                status: 'cleared',
                notes: 'Evaluated PySpark transformations, cloud ETL patterns, and data warehousing fundamentals.'
            },
            {
                name: 'Compliance & BGV Declaration',
                date: 'Oct 6, 2026',
                duration: 'Async',
                platform: 'Email / Portal',
                status: 'cleared',
                notes: 'Formally confirmed RMZ Ecoworld hybrid schedule and executed pre-onboarding BGV declarations with Anudeep Reddy G.'
            },
            {
                name: 'Round 2: SCB Client Technical & Architecture Gate',
                date: 'Pending Scheduling',
                duration: '45-60 min',
                platform: 'MS Teams / Webex',
                status: 'pending',
                notes: 'Final definitive gate: Standard Chartered Bank engineering leads covering financial schemas, idempotency, and Spark tuning.'
            }
        ],
        keyTopics: [
            'PySpark transformations',
            'SQL Join Mechanics',
            'Spark Architecture',
            'Hadoop vs Spark',
            'Job Debugging & Performance Tuning'
        ],
        interviewQuestions: [
            {
                topic: 'SQL Join Cartesian Output Calculation',
                q: 'Given two single-column tables t1 and t2 with duplicate values, calculate the exact row count for INNER, LEFT, RIGHT, FULL, and CROSS joins:\n\nTable t1 (col1):\n1, 0, 0, 1, 1  (three 1s, two 0s)\n\nTable t2 (col2):\n0, 0, 0, 1, 1  (two 1s, three 0s)',
                myAnswer: '• Inner Join: (3 × 2 for key 1) + (2 × 3 for key 0) = 6 + 6 = 12 rows\n• Left Join: All keys in t1 match t2 -> 12 rows\n• Right Join: All keys in t2 match t1 -> 12 rows\n• Full Outer Join: No unmatched keys on either side -> 12 rows\n• Cross Join: Total rows = 5 × 5 = 25 rows'
            },
            {
                topic: 'PySpark Column Transformation',
                q: 'Write the PySpark syntax to add a new column to an existing DataFrame.',
                myAnswer: 'df = df.withColumn("new_column_name", transformation_expression)'
            },
            {
                topic: 'Spark & Hadoop Internals',
                q: 'Key architectural questions asked:\n1. How do you troubleshoot and debug a Spark job failure (driver OOM vs executor failure)?\n2. How do you optimize slow query performance in distributed queries?\n3. Explain Spark Architecture (Driver, Cluster Manager, Worker Nodes, Executors).\n4. Hadoop vs Spark: Architectural differences and memory paradigm.\n5. How do you debug Hadoop job failures or performance bottlenecks in legacy clusters?',
                myAnswer: 'Explained driver vs executor memory allocation, inspecting Spark UI stages for data skew/spill, salting join keys, configuring AQE, and YARN resource preemption.'
            }
        ],
        notes: 'Agreed 21 LPA represents ~23.5% increment over 17 LPA baseline at EY. Relocation to Bellandur/Bengaluru required. Next step is SCB Client Technical interview.'
    },
    {
        id: 'nagarro',
        company: 'Nagarro',
        role: 'GCP Big Data Engineer',
        clientAccount: 'Global Digital Engineering Practice',
        date: 'Oct 5, 2026',
        status: 'pending',
        statusLabel: 'Round 1 Completed • Result Pending',
        ctcOffered: 'Target 22 - 24 LPA',
        location: 'Gurugram / Remote (Pan India)',
        rounds: [
            {
                name: 'Stage 1: Online Aptitude & Logic Assessment',
                date: 'May 22, 2026',
                duration: '60 min',
                platform: 'Online Proctored',
                status: 'cleared',
                notes: 'Cleared standardized multi-section aptitude covering quantitative analysis, logical reasoning, and data sufficiency.'
            },
            {
                name: 'Stage 2: Recruiter Re-engagement',
                date: 'Sept 30, 2026',
                duration: 'Call / Email',
                platform: 'Direct Outreach',
                status: 'cleared',
                notes: 'Re-engaged for GCP Big Data track following confirmation of availability and 5 YOE credentials.'
            },
            {
                name: 'Stage 3: Technical Evaluation (Round 1)',
                date: 'Oct 5, 2026 (03:00 – 03:45 PM IST)',
                duration: '45 min',
                platform: 'MS Teams (Recorded)',
                status: 'pending',
                notes: 'Completed deep-dive on distributed computing, BigQuery storage engine, Spark skew optimization, and analytical SQL. Currently awaiting feedback.'
            }
        ],
        keyTopics: [
            'BigQuery Capacitor Storage & Partitioning',
            'Dataproc & Dataflow Processing',
            'GCS IAM & Storage Classes',
            'PySpark Skew Salting & AQE',
            'Join Execution Trade-offs',
            'SQL Window Functions & SCD 1/2'
        ],
        interviewQuestions: [
            {
                topic: 'GCP Data Architecture',
                q: 'Deep evaluation on BigQuery internals (Capacitor columnar storage, partition pruning vs clustering, slot contention), Cloud Storage lifecycle rules, and Dataproc ephemeral provisioning.',
                myAnswer: 'Walked through BigQuery storage vs compute decoupling, partitioning by ingestion date, clustering by high-cardinality query filter keys, and using Cloud Composer for ephemeral cluster lifecycle.'
            },
            {
                topic: 'Distributed Spark Optimization',
                q: 'How to diagnose and mitigate data skew, disk spill, and garbage collection pauses during large-scale shuffle operations.',
                myAnswer: 'Explained key salting techniques, Adaptive Query Execution (AQE skew join optimization), broadcast join thresholds, and tuning spark.sql.shuffle.partitions.'
            }
        ],
        notes: 'Round 1 technical evaluation completed on Oct 5. Followed up with HR; official panel assessment and next round status pending.'
    },
    {
        id: 'impetus',
        company: 'Impetus Technologies',
        role: 'GCP Data Engineer',
        clientAccount: 'Data & Analytics Engineering Practice',
        date: 'Sept 30, 2026',
        status: 'rejected',
        statusLabel: 'Round 1 Completed • Not Selected',
        ctcOffered: null,
        location: 'Noida / Remote',
        rounds: [
            {
                name: 'Round 1: Live Technical & Systems Architecture',
                date: 'Sept 30, 2026 (04:00 – 05:00 PM IST)',
                duration: '60 min',
                platform: 'MS Teams (Recorded)',
                status: 'rejected',
                notes: 'Deep technical interrogation featuring live coding, PySpark data frame transformations, and architectural trade-offs.'
            }
        ],
        keyTopics: [
            'BigQuery Table Design & Partitioning',
            'Cloud Composer / Airflow DAGs',
            'PySpark Internal Engine & Memory',
            'Python Data Structures & Algorithms',
            'BigQuery MERGE DML',
            'Financial Data Localization'
        ],
        interviewQuestions: [
            {
                topic: 'PySpark Date Manipulation',
                q: 'We have a DataFrame with string column trans_date formatted as "dd-mm-YYYY". Write PySpark code to create a new column trans_month formatted as "yyyy-MM".',
                myAnswer: 'df.withColumn("trans_month", date_format(to_date(col("trans_date"), "dd-MM-yyyy"), "yyyy-MM"))\n(Note: During live coding responded with df.withColumn(trans_date, formatDate(trans_date, "yyyy-MM")))'
            },
            {
                topic: 'Python Algorithm: First Positive Missing Integer',
                q: 'Given an unsorted list of positive integers:\ninput = [1, 12, 3, 5, 6, 7, 22, 8, 2, 10]\nFind the smallest positive integer missing from the list.',
                myAnswer: 'Provided solution:\ni = 1\nwhile True:\n    if i not in input:\n        print(i)\n        break\n    i += 1\n\n(Follow-up discussion covered optimizing from O(N^2) to O(N) by converting input into a set for O(1) membership lookups).'
            },
            {
                topic: 'Systems Architecture & Project Context',
                q: '1. What happens internally after spark-submit is executed on a cluster?\n2. Why did American Express use Fiserv payment rails if they already moved ledger data to India servers?\n3. How does the BigQuery MERGE statement execute SCD Type 2 row updates under concurrent writes?',
                myAnswer: 'Detailed client vs cluster mode job submission, driver creation, YARN container allocation, Amex data localization boundaries, and atomic MERGE mechanics in BigQuery.'
            }
        ],
        notes: 'Prior engagement history: Dec 8, 2023 (Round 1 for Software Engineer), Aug 5, 2024 (Big Data Engineer application). Panel decided not to advance following the Sept 30 live coding evaluation.'
    },
    {
        id: 'hcltech',
        company: 'HCLTech',
        role: 'GCP Data Engineer / Specialist Data Engineer',
        clientAccount: 'Data Science & Analytics Division',
        date: 'Sept 26, 2026',
        status: 'rejected',
        statusLabel: 'In-Person Hackathon • Not Selected',
        ctcOffered: null,
        location: 'Sector 126 Campus, Noida',
        rounds: [
            {
                name: 'Stage 1: Virtual Orientation Call',
                date: 'Sept 24, 2026',
                duration: '30 min',
                platform: 'MS Teams',
                status: 'cleared',
                notes: 'Hackathon logistics, sandbox parameters, and problem statement orientation.'
            },
            {
                name: 'Stage 2: HirePanel GCP Assessment-Level2 (Initial Screening)',
                date: 'Sept 25, 2026',
                duration: '60 min',
                platform: 'TalentStudio Online',
                status: 'cleared',
                notes: 'Initial online proctored technical assessment cleared with ~80% score on Sept 25th, unlocking admission to the in-person campus hackathon.'
            },
            {
                name: 'Stage 3: In-Person Hiring Challenge & Hackathon',
                date: 'Sept 26, 2026 (08:30 AM – 05:30 PM IST)',
                duration: '9 hours',
                platform: 'In-Person (OMC-2 / ANDES Room, Noida)',
                status: 'rejected',
                notes: '9-hour full day on-premise coding challenge parsing interleaved banking extracts into Medallion architecture.'
            }
        ],
        keyTopics: [
            'Interleaved Banking File Ingestion',
            'Medallion Architecture (Bronze -> Silver -> Gold)',
            'SCD Type 2 Dimensional Modeling',
            'Apache Beam vs PySpark / Dataproc',
            'Banking KPIs (Account Dormancy & Structuring Detection)'
        ],
        interviewQuestions: [
            {
                topic: 'Technical Challenge Brief: Analyze_Customer_Transactions_UseCase',
                q: 'Construct an automated metadata-driven data warehouse pipeline in GCP:\n• Source: Day 0 (full extract), Day 1 & Day 2 (incremental deltas) of interleaved blocks (Customers, Accounts, Transactions, Cards).\n• Bronze: Raw file ingestion with block delimiting and file audit metadata.\n• Silver: Data hygiene, referential integrity check, anomaly quarantine dead-letter queue, deduplication.\n• Gold: Star schema dimensional models, SCD Type 2 history (EffectiveFrom/To, IsCurrent).\n• KPIs: Top 5 customers by volume, inactive accounts (>90 days), structuring transaction bursts (>£100k rolling windows).',
                myAnswer: 'Architected using Apache Beam on Google Cloud Dataflow. Overcame sandbox IAM and VPC subnetwork restrictions by isolating transformations in DirectRunner before deploying cloud jobs. Modeled entities into BigQuery bronze_hack83 datasets.'
            }
        ],
        notes: 'Critical Post-Mortem: Selection panel favored candidates who implemented using PySpark on Dataproc. The assignment was fundamentally an ELT dimensional modeling and SCD Type 2 task (which PySpark handles natively with declarative SQL/MERGE in ~150 lines), whereas Beam required heavy low-level PTransform and DoFn plumbing. Key takeaway: Always select the framework based on output modeling requirements rather than stream abstractions.'
    },
    {
        id: 'v4c-ai',
        company: 'V4C.ai',
        role: 'Data Engineer / Senior Data Engineer',
        clientAccount: 'Databricks-focused Boutique Consulting',
        date: 'Aug 25, 2026',
        status: 'rejected',
        statusLabel: 'L1 Screening • Not Selected',
        ctcOffered: null,
        location: 'Remote',
        rounds: [
            {
                name: 'L1 Technical Interview',
                date: 'Aug 25, 2026 (03:30 – 04:00 PM IST)',
                duration: '30 min',
                platform: 'Google Meet',
                status: 'rejected',
                notes: 'High-autonomy Databricks and PySpark screening round.'
            }
        ],
        keyTopics: [
            'Delta Lake ACID Logs (_delta_log)',
            'Z-Ordering & Liquid Clustering',
            'Unity Catalog Metastore Governance',
            'Photon Engine & Serverless Compute',
            'Spark UI Diagnostics & Data Spill',
            'Databricks Workflows Orchestration'
        ],
        interviewQuestions: [
            {
                topic: 'Databricks Lakehouse & Spark Internals',
                q: 'Evaluated on low-level Databricks mechanics:\n1. Delta Lake transaction log serialization, schema evolution vs enforcement, time travel, and VACUUM retentions.\n2. Compaction (OPTIMIZE), Z-Ordering vs Liquid Clustering in DBR 13+.\n3. Diagnosing Spark stage bottlenecks, memory spill (Execution vs Storage memory), and resolving skew at partition boundaries.\n4. Structuring Medallion architecture pipelines with autonomous Databricks Workflows.',
                myAnswer: 'Discussed architectural patterns and enterprise deployment workflows.'
            }
        ],
        notes: 'Rejected on Aug 27, 2026 following L1. Critical lesson: 30-minute screenings at agile boutiques focus heavily on rapid, low-level code mechanics and greenfield building rather than enterprise compliance and governance. (Received duplicate recruitment outreach from BL Consultants on Sept 10 for the same firm).'
    },
    {
        id: 'deloitte',
        company: 'Deloitte',
        role: 'GCP Data Engineer / Consultant Data Engineer',
        clientAccount: 'Deloitte LLP / USI Consulting Practice',
        date: 'Aug 24, 2026',
        status: 'rejected',
        statusLabel: 'Screening Completed • Not Selected',
        ctcOffered: null,
        location: 'Gurugram / Delhi NCR',
        rounds: [
            {
                name: 'Initial Slot (No-Show by Panel)',
                date: 'Aug 19, 2026 (12:00 PM IST)',
                duration: '45 min',
                platform: 'HirePro Lobby',
                status: 'no-show',
                notes: 'Joined lobby prior to 12:00 PM. Waited 10 mins; panel did not join. Captured screenshot and notified coordinator Tushar Bhardwaj.'
            },
            {
                name: 'Rescheduled Slot',
                date: 'Aug 22, 2026',
                duration: 'Tentative',
                platform: 'HirePro',
                status: 'rescheduled',
                notes: 'Weekend slot proposed; deferred to following Monday.'
            },
            {
                name: 'External Screening Round',
                date: 'Aug 24, 2026 (02:00 – 02:45 PM IST)',
                duration: '45 min',
                platform: 'HirePro AI Proctored Video',
                status: 'rejected',
                notes: 'External panelist contracted via HirePro Interview-as-a-Service model conducting horizontal competency screening.'
            }
        ],
        keyTopics: [
            'BigQuery Partitioning & Clustering',
            'Dataproc & PySpark Lifecycles',
            'Dataflow (Apache Beam) Paradigms',
            'Cloud Composer / Airflow DAG Scheduling',
            'PySpark Catalyst Optimizer & Skew Handling',
            'SCD Type 1 & Type 2 Warehousing',
            'Client Consulting & SLA Management'
        ],
        interviewQuestions: [
            {
                topic: 'GCP & Distributed Systems Competency Audit',
                q: 'Comprehensive horizontal evaluation covering:\n• GCP: BigQuery slot reservations, partitioning vs clustering, GCS IAM, Cloud Composer sensors.\n• PySpark: Catalyst logical vs physical plans, coalesce vs repartition, broadcast hash joins.\n• Delivery: Managing client stakeholders, resolving ODL pipeline SLA breaches for American Express financial ledgers.',
                myAnswer: 'Walked through end-to-end cloud migration patterns and enterprise data quality governance.'
            }
        ],
        notes: 'Sourced via Covenant Consultants against 17 LPA Current / 20 LPA Target CTC. Serving notice with LWD recorded as Nov 19, 2026. External screening round did not convert to Deloitte hiring manager discussion.'
    },
    {
        id: 'micro1',
        company: 'micro1',
        role: 'Data Engineer (Remote Global Talent Pool)',
        clientAccount: 'Global US/Remote Talent Network',
        date: 'Aug 2026',
        status: 'rejected',
        statusLabel: 'AI Interview Attempted • Not Selected',
        ctcOffered: '$80,000 – $150,000 USD / year',
        location: '100% Remote (Global)',
        rounds: [
            {
                name: 'Asynchronous AI Video Assessment ("Zara")',
                date: 'Attempted on Final Reminder Date',
                duration: '30 min',
                platform: 'micro1 Conversational AI ("Zara")',
                status: 'rejected',
                notes: 'Attempted the 30-minute timed conversational AI video interview with Zara avatar on the final day of the reminder sequence. Probed PySpark internals, modern cloud DWH architectures, and live Python systems.'
            }
        ],
        keyTopics: [
            'Conversational AI Screen (Zara Avatar)',
            'PySpark Catalyst & Memory Tuning',
            'Cloud DWH (BigQuery, Redshift, Snowflake)',
            'Production Python OOP & Windowed SQL',
            'Change Data Capture (CDC) & SCD'
        ],
        interviewQuestions: [
            {
                topic: 'micro1 Conversational AI Evaluation',
                q: 'Proprietary conversational AI evaluation probing spoken technical mastery:\n• Distributed Computing: Spark execution plans, shuffle bottlenecks, and memory management.\n• Data Architecture: Partitioning, clustering, and CDC ingestion paradigms.\n• Python & SQL: Modular data pipeline design and analytical window functions.',
                myAnswer: 'Completed timed conversational assessment with AI interviewer on final reminder day.'
            }
        ],
        notes: 'Sourced through Crossing Hurdles. Attempted the conversational AI screening on the final day of the reminder sequence. Did not convert to the vetted talent bench / matching stage.'
    }
];
