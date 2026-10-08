export const resignationDetails = {
    resignationDate: 'Aug 22, 2026',
    lastWorkingDay: 'Nov 19, 2026',
    noticePeriod: '90 Days (Serving Notice)',
    currentCtc: '17 LPA Fixed + 20% Variable',
    expectedCtc: '20 - 24 LPA',
    activeOffer: 'None (TechM client round closed; Nagarro closed)',
    pendingResult: 'None (All recent rounds concluded)',
    upcomingPipeline: 'Amgen (Hyderabad GCC) — Re-applying Nov 2026 via Workday Referral (Target: 24 - 28 LPA)'
};

export const interviewRecords = [
    {
        id: 'tech-mahindra',
        company: 'Tech Mahindra',
        role: 'Sr. Software Engineer (Data Engineering / Cloud Analytics)',
        clientAccount: 'Standard Chartered Bank (SCB) — Global Business Services',
        date: 'Oct 8, 2026',
        status: 'rejected',
        statusLabel: 'SCB Client Gate • Not Selected',
        ctcOffered: '21 LPA CTC (Not Proceeded)',
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
                name: 'Round 2: SCB Client Technical & Architecture Gate (Britto Lawrence)',
                date: 'Oct 8, 2026',
                duration: '45-60 min',
                platform: 'MS Teams / Webex',
                status: 'rejected',
                notes: 'Technical evaluation with Standard Chartered Bank client lead Britto Lawrence. Candidacy was not selected because candidate was unable to answer HDFS block checksum data integrity and Airflow engine internals/CLI execution, could not produce shell scripting or PySpark code live, and implemented the requested SCD Type 2 logic in SQL instead of PySpark.'
            }
        ],
        keyTopics: [
            'HDFS Data Integrity (Checksums)',
            'Data Integrity vs Data Quality',
            'Apache Airflow Internals & CLI',
            'SCD Type 2 Dimensional Modeling',
            'SQL Cross Joins & Conditional Pairing',
            'PySpark Transformations & Spark Architecture',
            'Shell Scripting & Unix Commands'
        ],
        interviewQuestions: [
            {
                topic: 'SQL Pairwise Price Comparison (CROSS JOIN & CASE)',
                q: 'Given Table A with products and prices:\nproduct | price\nlaptop  | 1500\nkeyboard| 1000\nmouse   | 500\n\nWrite a query to generate unique pairs displaying the highest and lowest priced item in each pair:\nhighest  | lowest\nlaptop   | keyboard\nlaptop   | mouse\nkeyboard | mouse',
                myAnswer: 'SELECT\n    CASE\n        WHEN a1.price > a2.price THEN a1.product\n        ELSE a2.product\n    END AS highest,\n    CASE\n        WHEN a1.price < a2.price THEN a1.product\n        ELSE a2.product\n    END AS lowest\nFROM A AS a1\nCROSS JOIN A AS a2\nWHERE a1.product <> a2.product\n  AND a1.price > a2.price; -- Prevents duplicate inverted pairs'
            },
            {
                topic: 'SCD Type 2 Customer Record Evolution (SQL vs PySpark)',
                q: 'Write code to implement SCD (Slowly Changing Dimension) Type 2 updates for a Customer table when address changes for customerId = 1.',
                myAnswer: 'Interview Reality: Panel asked to implement SCD Type 2 using PySpark code, but candidate was unable to write PySpark code live on the spot and instead implemented it in SQL:\n\n-- Step 1: Invalidate existing active record\nUPDATE Customer \nSET endDate = now() \nWHERE customerId = 1 AND endDate IS NULL;\n\n-- Step 2: Insert new record version\nINSERT INTO Customer (customerID, address, startDate, endDate) \nVALUES (1, "abcd", now(), NULL);\n\nTarget PySpark Solution: Join incoming staging delta with current dimension on surrogate/business key, identify updated records, union expired rows with updated active rows, or execute DeltaTable.merge() in PySpark.'
            },
            {
                topic: 'Big Data Storage: HDFS Data Integrity',
                q: 'How do you ensure data integrity in HDFS when moving or replicating data from one location to another?',
                myAnswer: 'Interview Reality: Unable to answer during live interrogation; block checksum mechanism was a primary blocker.\n\nRetrospection / Target Answer: Checksum verification.\nHDFS computes CRC32/CRC32C checksums per block during writes. When transferring data (e.g. via DistCp), DistCp uses block-level checksum comparison (or -diff / -update flags) to ensure the destination bytes match source bytes exactly. We can also run `hdfs fsck` to audit block replica health.'
            },
            {
                topic: 'Data Governance: Data Integrity vs. Data Quality',
                q: 'What is the fundamental difference between Data Integrity and Data Quality, and how would you ensure Data Quality across an enterprise pipeline?',
                myAnswer: '• Data Integrity (Structural): Ensures data is intact, uncorrupted, and structurally valid (ACID transactions, entity & referential constraints, HDFS checksums, network packet validation).\n• Data Quality (Semantic & Business): Ensures data is accurate, complete, timely, valid, and fit for consumption.\n• How to ensure Data Quality: Implement automated circuit breakers, write Great Expectations / Deequ assertions at ingestion boundaries, route anomalous records to dead-letter quarantine queues, execute automated row count & checksum reconciliation, and alert via Airflow on SLA breaches.'
            },
            {
                topic: 'Apache Airflow Engine Internals & CLI Execution',
                q: '1. Is Airflow asynchronous or synchronous? Can parallel execution be achieved?\n2. Are Airflow workers stateful or stateless?\n3. Can Airflow run multiple instances of the same task simultaneously?\n4. Can we execute specific tasks from an Airflow DAG directly instead of running the whole DAG?',
                myAnswer: 'Interview Reality: Unable to answer Airflow engine internals or CLI execution commands live during the round.\n\nRetrospection / Target Answer:\n1. Airflow is fundamentally asynchronous: the Scheduler evaluates DAG dependencies and places tasks in an executor queue. Parallelism is achieved via CeleryExecutor or KubernetesExecutor distributing tasks across multiple worker pods.\n2. Airflow workers are stateless; all DAG state, task execution metadata, and logs are persisted centrally in the metadata database (Postgres/MySQL) and remote object storage (GCS/S3).\n3. Yes, Airflow can run multiple instances of the same task across different execution dates (controlled by max_active_tis_per_dag and concurrency settings).\n4. Yes! Specific tasks can be executed directly from CLI via:\n   airflow tasks run <dag_id> <task_id> <logical_date>\n   or backfilled selectively using:\n   airflow dags backfill -t <task_regex> <dag_id> -s <start_date> -e <end_date>'
            },
            {
                topic: 'Live Shell Scripting & PySpark Coding Gate',
                q: 'Write live shell scripts for log validation/data ingestion and PySpark DataFrame code for ETL pipelines.',
                myAnswer: 'Interview Reality: Unable to write shell scripting code and PySpark code live during the interview session, which was a fatal gatekeeper for the technical evaluation.'
            },
            {
                topic: 'SQL Join Cartesian Output Calculation (Round 1)',
                q: 'Given two single-column tables t1 and t2 with duplicate values, calculate the exact row count for INNER, LEFT, RIGHT, FULL, and CROSS joins:\n\nTable t1 (col1): 1, 0, 0, 1, 1 (three 1s, two 0s)\nTable t2 (col2): 0, 0, 0, 1, 1 (two 1s, three 0s)',
                myAnswer: '• Inner Join: (3 × 2 for key 1) + (2 × 3 for key 0) = 6 + 6 = 12 rows\n• Left Join: All keys in t1 match t2 -> 12 rows\n• Right Join: All keys in t2 match t1 -> 12 rows\n• Full Outer Join: No unmatched keys on either side -> 12 rows\n• Cross Join: Total rows = 5 × 5 = 25 rows'
            },
            {
                topic: 'PySpark & Spark Internals (Round 1)',
                q: 'PySpark syntax to add a column, debugging Spark job failures (driver vs executor OOM), query optimization, and Spark vs Hadoop architecture.',
                myAnswer: 'df.withColumn("new_column_name", expr). Explained driver vs executor memory allocation, inspecting Spark UI stages for shuffle spill, salting skewed join keys, and enabling Adaptive Query Execution (AQE).'
            }
        ],
        notes: 'Agreed 21 LPA CTC for hybrid Bellandur Bengaluru location (+23.5% over EY 17 LPA baseline). Round 2 client evaluation completed with Standard Chartered Bank engineering lead Britto Lawrence. Candidacy was not selected. Key post-mortem gaps: unable to answer HDFS data integrity checksums, unable to answer Airflow engine internals/CLI execution, unable to write shell scripting code live, and unable to produce PySpark code for SCD Type 2 (reverting to SQL).'
    },
    {
        id: 'nagarro',
        company: 'Nagarro',
        role: 'GCP Big Data Engineer',
        clientAccount: 'Global Digital Engineering Practice',
        date: 'Oct 5, 2026',
        status: 'rejected',
        statusLabel: 'Round 1 Completed • Not Selected',
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
                status: 'rejected',
                notes: 'Completed deep-dive on distributed computing, BigQuery storage engine, Spark skew optimization, and analytical SQL. Candidacy was not advanced to Round 2.'
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
        notes: 'Round 1 technical evaluation completed on Oct 5. HR follow-up confirmed candidacy was not selected to advance to Round 2.'
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
    },
    {
        id: 'amgen',
        company: 'Amgen',
        role: 'Associate Python Developer -> Target: Sr. Associate Data Engineer',
        clientAccount: 'Amgen Digital Technology & Innovation Center (GCC)',
        date: 'Feb 2026 (Re-applying Nov 2026)',
        status: 'rejected',
        statusLabel: 'Cooling-Off Cleared • Re-applying Nov 2026',
        ctcOffered: 'Target 24 – 28 LPA Fixed',
        location: 'Hyderabad, Telangana (On-site / Hybrid)',
        rounds: [
            {
                name: 'Application & Eightfold.ai Vetting Invite',
                date: 'Early Feb 2026',
                duration: 'Async',
                platform: 'Eightfold.ai Talent Portal',
                status: 'cleared',
                notes: 'Applied for Associate Python Developer (Enterprise Data Fabric); received automated Eightfold.ai video screening invitation.'
            },
            {
                name: 'Stage 1: AI Video Screening',
                date: 'Feb 10, 2026',
                duration: '30 min',
                platform: 'Eightfold.ai Browser Interface',
                status: 'rejected',
                notes: 'Recorded asynchronous video responses to algorithmic and behavioral prompts using real enterprise project context. Talent acquisition closed the requisition on Feb 24, 2026.'
            },
            {
                name: 'Cooling-Off Window & Re-application Pipeline',
                date: 'November 2026 (Target)',
                duration: 'Workday Referral',
                platform: 'Internal Workday Portal',
                status: 'pending',
                notes: 'Mandatory 6-month cooling-off window is cleared (8.5 months elapsed). Re-engaging in November 2026 via 1st-degree employee referral at the Hyderabad innovation center for dedicated Data Engineer roles (Job IDs R-236186 / R-244078).'
            }
        ],
        keyTopics: [
            'Enterprise Data Fabric',
            'Apache Spark & PySpark Internals',
            'Databricks Lakehouse & Unity Catalog',
            'AWS Data Engineering Architecture',
            'Python Systems & Algorithmic Problem Solving'
        ],
        interviewQuestions: [
            {
                topic: 'Eightfold.ai Automated Screening & AI Model Vocabulary Scoring',
                q: 'Asynchronous video prompts evaluating algorithmic problem solving, enterprise software design, and behavioral delivery.',
                myAnswer: 'Root-Cause & Core Lesson: Candidacy was lost primarily because responses lacked the exact target vocabulary identified and weighted by Eightfold\'s automated AI evaluation models. While the requisition was titled "Associate Python Developer", answers were framed through a Big Data / PySpark / BigQuery lens. Eightfold\'s automated NLP models scored video transcripts against backend software development tokens (REST microservices, async event loops, FastAPI/Django, concurrency). Missing the exact lexical terms expected by the AI scoring rubric caused the automated match score to fall below the human recruiter escalation threshold.'
            }
        ],
        notes: 'Captive GCC life sciences innovation hub in Hyderabad offering 24-28 LPA Fixed (40-65% premium over EY 17 LPA baseline). Critical lesson: Asynchronous AI screening models evaluate against strict keyword and vocabulary vectors; missing target lexicon results in automated disqualification. Mandatory 6-month cooling-off window is cleared (8.5 months elapsed). Re-application strategy in November 2026 leverages 1st-degree employee referrals to bypass automated ATS filters, backed by 5 Databricks certifications + AWS Data Engineer certification.'
    },
    {
        id: 'servicenow',
        company: 'ServiceNow',
        role: 'Software Engineer / Sr. Software Engineer (Core Platform)',
        clientAccount: 'Core Platform Engineering Track',
        date: 'Nov 18, 2023',
        status: 'rejected',
        statusLabel: 'Technical & HM Round • Not Selected',
        ctcOffered: null,
        location: 'Hyderabad / Bengaluru (On-site / Hybrid)',
        rounds: [
            {
                name: 'Stage 1: Level 1 Coding Hackathon',
                date: 'Sept 23, 2023 (02:00 – 04:00 PM IST)',
                duration: '90 min',
                platform: 'HackerRank Engage',
                status: 'cleared',
                notes: 'Cleared nationwide competitive programming challenge evaluating data structures, algorithmic complexity, and problem-solving to qualify for fast-track interview scheduling.'
            },
            {
                name: 'Stage 2: Shortlist Notification',
                date: 'October 2023',
                duration: 'Email',
                platform: 'Direct Outreach from ServiceNow Recruiting',
                status: 'cleared',
                notes: 'Official shortlist notification confirming qualification based on Level 1 leaderboard ranking.'
            },
            {
                name: 'Stage 3: Technical Evaluation & HM Round',
                date: 'Nov 18, 2023 (10:00 AM IST)',
                duration: '60 min',
                platform: 'Zoom',
                status: 'rejected',
                notes: 'Live technical round covering algorithmic coding, SQL schema queries, and relational data modeling. Formal rejection communication issued on Nov 18–19, 2023.'
            }
        ],
        keyTopics: [
            'Data Structures & Algorithms (DSA)',
            'Min-Heap / Priority Queue (LeetCode 215)',
            'QuickSelect Partitioning (Hoare)',
            'Relational SQL & Schema Queries',
            'Self-Joins & Manager Hierarchies',
            'PySpark DataFrame Operations'
        ],
        interviewQuestions: [
            {
                topic: 'Algorithmic Problem: Find Kth Largest Element in an Array (LeetCode 215)',
                q: 'Input: arr = [10, 40, 20, 30, 50, 60, 5, 4], k = 3\nTarget Answer: 40 (Sorted descending: [60, 50, 40, 30, 20, 10, 5, 4]; 1st = 60, 2nd = 50, 3rd = 40)\n\nProvide the optimal engineering approach and implementation.',
                myAnswer: 'Execution Status: Unable to solve live on camera (primary blocker for the round).\nCandidate Lesson: Revised all medium-difficulty topics prior to this interview but skipped Heaps assuming they were unimportant; the very first question asked was from Min-Heap.\n\nOptimal Engineering Solutions:\n1. Approach A: Min-Heap (O(N log k) time, O(k) space)\nMaintain a min-heap containing only k elements. As you iterate through the stream of numbers, push each element into the min-heap. Whenever the heap size exceeds k, pop the smallest element. After traversing all N elements, the top of the min-heap holds the kth largest element.\n\n```python\nimport heapq\n\ndef find_kth_largest_heap(nums: list[int], k: int) -> int:\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if len(min_heap) > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]\n\n# Verification\narr = [10, 40, 20, 30, 50, 60, 5, 4]\nassert find_kth_largest_heap(arr, 3) == 40\n```\n\n2. Approach B: QuickSelect (Hoare\'s Selection Algorithm — O(N) average time, O(1) space)\nPartition the array around a random pivot identical to QuickSort. If the pivot index lands exactly on len(nums) - k (when targeting the kth largest in ascending partition), return that value. Otherwise, recurse solely into the partition holding the target index.'
            },
            {
                topic: 'Relational SQL: Find Unique Set of Manager IDs',
                q: 'Given Schema: Employee (EmpID, ManagerID)\nExtract all unique manager IDs representing valid managers.',
                myAnswer: 'SQL Solution:\nSELECT DISTINCT ManagerID\nFROM Employee\nWHERE ManagerID IS NOT NULL;\n\nPySpark DataFrame Alternative:\nfrom pyspark.sql.functions import col\nunique_managers_df = employee_df.filter(col("ManagerID").isNotNull()).select("ManagerID").distinct()'
            },
            {
                topic: 'Relational SQL: Find Departments and Their Managers',
                q: 'Given Schema: Department (DeptID, DeptName, ManagerID) and Employee (EmpID, EmpName)\nRetrieve each department alongside its assigned manager, handling cases where a department might temporarily lack an assigned manager.',
                myAnswer: 'SQL Solution (Handling Unassigned Managers via LEFT JOIN):\nSELECT \n    d.DeptID,\n    d.DeptName,\n    COALESCE(e.EmpName, "Unassigned") AS ManagerName,\n    d.ManagerID\nFROM Department d\nLEFT JOIN Employee e \n    ON d.ManagerID = e.EmpID;\n\nPure Department Table Scope:\nSELECT DISTINCT DeptID, ManagerID\nFROM Department\nWHERE ManagerID IS NOT NULL;'
            }
        ],
        notes: 'Critical Lesson & Mentor Post-Mortem: Revised all medium-difficulty topics for this interview but skipped Heaps assuming they were unimportant—only for the very first question to be LeetCode #215 (Kth Largest Element via minHeap). Tier-1 product companies (unlike IT service integrators) enforce a strict DSA elimination gate where failing an elementary heap/partitioning problem is an immediate disqualifier that cannot be rescued by standard SQL queries. Also highlighted the contrast between asynchronous HackerRank contests (cleared on Sept 23) and high-pressure live Zoom whiteboard coding.'
    }
];
