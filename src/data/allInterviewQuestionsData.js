/**
 * Compiled Master Question Bank
 * Consolidated from 12 Real Company Interview Experiences & Interview Questions Reference Document
 * Divided by 7 Core Technical & Architectural Topics
 */

export const INITIAL_INTERVIEW_TOPICS = [
    {
        id: 'spark-pyspark',
        title: 'Apache Spark & PySpark',
        subtitle: 'Architecture, Internals, Optimization, OOM Debugging, Catalyst & Live DataFrame Coding',
        icon: 'FiCpu',
        badgeColor: '#e06c75',
        questions: [
            {
                id: 'sp-01',
                q: 'Explain the internal architecture of Apache Spark: how do the Driver, Cluster Manager, Worker Nodes, and Executors collaborate, and how does a job execute from submission to completion?'
            },
            {
                id: 'sp-02',
                q: 'Trace the step-by-step lifecycle of what happens internally across the cluster after spark-submit is executed on a cluster.'
            },
            {
                id: 'sp-03',
                q: 'What is a SparkSession, and how do you initialize and configure it in PySpark?'
            },
            {
                id: 'sp-04',
                q: 'What is a DAG (Directed Acyclic Graph) in Spark, and how does the DAGScheduler decompose jobs into stages and tasks?'
            },
            {
                id: 'sp-05',
                q: 'What are narrow transformations vs. wide transformations in Spark? Explain why wide transformations trigger shuffle operations.'
            },
            {
                id: 'sp-06',
                q: 'What are Actions and Transformations in Spark? Explain the concept and benefits of lazy evaluation.'
            },
            {
                id: 'sp-07',
                q: 'What is the difference between cache() and persist() in Spark? What storage levels are supported (MEMORY_ONLY, MEMORY_AND_DISK, OFF_HEAP)?'
            },
            {
                id: 'sp-08',
                q: 'What is the difference between repartition() and coalesce() in Spark, and when should you choose one over the other?'
            },
            {
                id: 'sp-09',
                q: 'What is the difference between groupByKey() and reduceByKey() in Spark, and why does reduceByKey() dramatically reduce network shuffle?'
            },
            {
                id: 'sp-10',
                q: 'What is a Broadcast Variable and Broadcast Hash Join in Spark? What are the default threshold limits (e.g. spark.sql.autoBroadcastJoinThreshold) and failure risks?'
            },
            {
                id: 'sp-11',
                q: 'During a Spark job execution, 99 tasks finish in 1 minute, but 1 task / executor takes 45 minutes to finish (or hangs). How do you diagnose and resolve this executor straggler / data skew issue?'
            },
            {
                id: 'sp-12',
                q: 'What is the difference between Driver OOM and Executor OOM errors in Spark? What root causes trigger each, and how do you fix them?'
            },
            {
                id: 'sp-13',
                q: 'What core optimizations do you implement to tune PySpark applications for enterprise-scale workloads (AQE, Skew Join hints, Kryo serializer, dynamic partition pruning)?'
            },
            {
                id: 'sp-14',
                q: 'How does Spark’s Catalyst Optimizer work? Explain the difference between Unresolved Logical Plan, Analyzed Logical Plan, Optimized Logical Plan, and Physical Execution Plans.'
            },
            {
                id: 'sp-15',
                q: 'How do you diagnose and mitigate data skew, disk spill (Execution memory vs. Storage memory spill), and excessive Java Garbage Collection (GC) pauses during massive shuffle operations?'
            },
            {
                id: 'sp-16',
                q: 'Explain Delta Lake transaction log serialization (ACID protocol), schema evolution vs. schema enforcement, time travel, and VACUUM retentions.'
            },
            {
                id: 'sp-17',
                q: 'Explain Delta table performance maintenance: File Compaction (OPTIMIZE), Z-Ordering, and Liquid Clustering in modern Databricks runtimes.'
            },
            {
                id: 'sp-18',
                q: 'How do you rename or add a new column to a DataFrame in PySpark using withColumn(), withColumnRenamed(), or select()?'
            },
            {
                id: 'sp-19',
                q: 'Given a DataFrame with a string column trans_date formatted as "dd-mm-YYYY", write PySpark code to convert and create a new column trans_month formatted as "yyyy-MM".'
            },
            {
                id: 'sp-20',
                q: 'Given a DataFrame payment_events(payment_id, provider, customer_id, status, amount, event_ts), write PySpark code to find customers whose total REFUNDED amount is greater than 50% of their total CAPTURED amount, displaying the refund percentage rounded to 1 decimal place.'
            },
            {
                id: 'sp-21',
                q: 'Write PySpark DataFrame code to implement Slowly Changing Dimension (SCD) Type 2 updates for an incoming batch of changed customer records, handling effective start dates, end dates, and current active flags.'
            },
            {
                id: 'sp-22',
                q: 'What is the use of lead() and lag() analytic window functions in Spark DataFrames, and how do you specify window specifications with Window.partitionBy() and Window.orderBy()?'
            },
            {
                id: 'sp-23',
                q: 'How does Apache Spark outperform Hadoop MapReduce for large-scale iterative processing and data analytics?'
            },
            {
                id: 'sp-24',
                q: 'How do Hive partitioning and bucketing integrate with Spark DataFrame reads, and how does partition pruning prevent full table scans?'
            }
        ]
    },
    {
        id: 'sql-optimization',
        title: 'SQL & Query Optimization',
        subtitle: 'Analytical Window Functions, Complex Join Mechanics, Row Cardinality Math, Indexing & Optimization',
        icon: 'FiDatabase',
        badgeColor: '#61afef',
        questions: [
            {
                id: 'sql-01',
                q: 'How do you optimize slow-running SQL queries in distributed engines (BigQuery, Snowflake, Spark SQL) versus traditional relational databases (PostgreSQL, Oracle)?'
            },
            {
                id: 'sql-02',
                q: 'How do you eliminate correlated subqueries and optimize queries using Common Table Expressions (CTEs), temporary staging tables, or window functions?'
            },
            {
                id: 'sql-03',
                q: 'Explain the fundamental differences between Partitioning and Clustering in modern analytical data warehouses. When should each be used, and what are the trade-offs?'
            },
            {
                id: 'sql-04',
                q: 'What are the different types of indexes available in relational database engines (B-Tree, Bitmap, Hash, Clustered vs. Non-Clustered)? Explain their internal structures and use cases.'
            },
            {
                id: 'sql-05',
                q: 'What are SQL window functions? Explain the components of an OVER() clause (PARTITION BY, ORDER BY, ROWS/RANGE BETWEEN) with practical examples.'
            },
            {
                id: 'sql-06',
                q: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() with examples of duplicate tie-breaking.'
            },
            {
                id: 'sql-07',
                q: 'Given a column with values [1, 2, 3, NULL, NULL, 3, 3, 1], what is the exact rank output assigned by ROW_NUMBER(), RANK(), and DENSE_RANK() ordered ascending?'
            },
            {
                id: 'sql-08',
                q: 'Write a query to find the highest salary from each department.'
            },
            {
                id: 'sql-09',
                q: 'Write an optimized query to find the 2nd highest salary from each department using window functions and joins.'
            },
            {
                id: 'sql-10',
                q: 'Write a query to find the nth highest salary from an employee table without using proprietary functions.'
            },
            {
                id: 'sql-11',
                q: 'Write a query using window functions to find the running cumulative total and average salary for each department.'
            },
            {
                id: 'sql-12',
                q: 'Given table payment_events(payment_id, provider, customer_id, status, amount, event_ts), write a SQL query to calculate for each provider and each day: total CAPTURED revenue, running total of revenue for that provider, and the day-over-day change compared with that provider’s previous active revenue day.'
            },
            {
                id: 'sql-13',
                q: 'Write a SQL query to find duplicates in a table using three distinct approaches (GROUP BY / HAVING, ROW_NUMBER(), and self-joins).'
            },
            {
                id: 'sql-14',
                q: 'Write a query to find the top and least performing employees based on performance conditions using subqueries or CTEs.'
            },
            {
                id: 'sql-15',
                q: 'Write a query to categorize salary ranges into tags ("low" < 30k, "med" 30k-50k, "high" > 50k) using conditional CASE WHEN statements.'
            },
            {
                id: 'sql-16',
                q: 'Write a query to find employees who changed their address more than three times in the last three months.'
            },
            {
                id: 'sql-17',
                q: 'How many types of joins are there? Explain Inner, Left, Right, Full Outer, Cross, Left Semi, and Left Anti joins with examples.'
            },
            {
                id: 'sql-18',
                q: 'Explain the relational mechanics and practical differences between a Left Semi-Join and a Left Anti-Join. How are they implemented in SQL and Spark?'
            },
            {
                id: 'sql-19',
                q: 'If Table A has 100 records and Table B has 20 records, what are the minimum and maximum possible row counts of a LEFT JOIN?'
            },
            {
                id: 'sql-20',
                q: 'Given two single-column tables: table1: [1, 2, 3, 4, NULL] (5 rows) and table2: [1, 2, 3, NULL, NULL, 3, 3, 1] (8 rows), calculate the exact output row count for: Inner Join, Left Join, Right Join, Full Outer Join, Cross Join, Left Anti Join, and Left Semi Join.'
            },
            {
                id: 'sql-21',
                q: 'Given two single-column tables with duplicate 1s and 0s: Table t1 has three 1s and two 0s (5 rows); Table t2 has two 1s and three 0s (5 rows). Calculate the exact output row counts for INNER, LEFT, RIGHT, FULL, and CROSS joins.'
            },
            {
                id: 'sql-22',
                q: 'How do you optimize a large-scale join between a dimension table with 500 million records and a fact/transaction table with 2 billion records to avoid severe shuffle and skew?'
            },
            {
                id: 'sql-23',
                q: 'Given Table A with products and prices (laptop: 1500, keyboard: 1000, mouse: 500), write a SQL query using joins and CASE to generate unique pairs displaying the highest and lowest priced item in each pair.'
            },
            {
                id: 'sql-24',
                q: 'Given an Employee table (EmpID, ManagerID), write a SQL query to extract all unique manager IDs representing valid managers who manage at least one person.'
            },
            {
                id: 'sql-25',
                q: 'Given tables Department(DeptID, DeptName, ManagerID) and Employee(EmpID, EmpName), write a SQL query to retrieve each department alongside its assigned manager, properly handling departments that currently lack an assigned manager.'
            },
            {
                id: 'sql-26',
                q: 'What is the difference between COUNT(*), COUNT(1), and COUNT(column_name) in SQL?'
            },
            {
                id: 'sql-27',
                q: 'How does the SQL MERGE statement execute SCD Type 2 updates under concurrent write transactions?'
            }
        ]
    },
    {
        id: 'python-algorithms',
        title: 'Python & Algorithms',
        subtitle: 'Core Python, Data Types, OOPs, Memory Model, Big-O Complexity & Algorithmic Problem Solving',
        icon: 'FiCode',
        badgeColor: '#98c379',
        questions: [
            {
                id: 'py-01',
                q: 'What are Python’s primary built-in data types (Integer, Float, Complex Number, Boolean, String, List, Tuple, Set, Dictionary), and which are mutable vs. immutable?'
            },
            {
                id: 'py-02',
                q: 'What are lambda functions in Python, what are their limitations, and how are they used with map(), filter(), and reduce()?'
            },
            {
                id: 'py-03',
                q: 'Explain Python’s exception handling mechanism: how do try, except, else, and finally blocks execute?'
            },
            {
                id: 'py-04',
                q: 'What is the __init__ method in Python classes, why is it used, and how does it differ from __new__?'
            },
            {
                id: 'py-05',
                q: 'Explain the difference between shallow copy and deep copy in Python (using the copy module) and how compound nested objects are affected.'
            },
            {
                id: 'py-06',
                q: 'How is Object-Oriented Programming (OOP) and inheritance implemented in Python? What are its types (single, multiple, multilevel, hierarchical), and what is the Method Resolution Order (MRO)?'
            },
            {
                id: 'py-07',
                q: 'What is the purpose of the self keyword in Python class methods, and what happens behind the scenes when calling instance methods?'
            },
            {
                id: 'py-08',
                q: 'Write a Python program demonstrating list comprehensions, dictionary comprehensions, and generator expressions.'
            },
            {
                id: 'py-09',
                q: 'Write a Python program to calculate the frequency of characters in a string and identify duplicate characters.'
            },
            {
                id: 'py-10',
                q: 'Write a Python program to calculate the factorial of a number using both iterative and recursive approaches.'
            },
            {
                id: 'py-11',
                q: 'Write a program to find elements: 1. In List1 but not in List2, 2. In List2 but not in List1, 3. In both lists (using set operations and list comprehension).'
            },
            {
                id: 'py-12',
                q: 'Write a program to find common elements between two lists in Python while preserving element frequency / handling duplicates.'
            },
            {
                id: 'py-13',
                q: 'Given a list containing numbers from 1 to n in ascending order with missing numbers (e.g., [1, 2, 3, 4, 6, 7, 8, 10]), write an algorithm to find all missing numbers in O(n) time and O(1) extra space without using built-in functions (no max(), no range(), no "in" membership search).'
            },
            {
                id: 'py-14',
                q: 'Given an unsorted list of positive integers (e.g. [1, 12, 3, 5, 6, 7, 22, 8, 2, 10]), write an algorithm in Python to find the smallest positive integer missing from the list in O(n) time and O(1) auxiliary space.'
            },
            {
                id: 'py-15',
                q: 'Given an unsorted integer array arr = [10, 40, 20, 30, 50, 60, 5, 4] and k = 3, write an algorithm to find the kth largest element (expected: 40). Compare the brute-force, min-heap, and quickselect approaches with their time and space complexities.'
            },
            {
                id: 'py-16',
                q: 'Explain time and space complexities (Big-O notation) for array search, hash table lookup, binary search, merge sort, and recursive call stacks.'
            },
            {
                id: 'py-17',
                q: 'Write a shell script and a Python script for automated file validation, checksum verification, and graceful error alerting in an ETL ingestion pipeline.'
            }
        ]
    },
    {
        id: 'bigdata-hadoop',
        title: 'Big Data & Hadoop',
        subtitle: 'Hadoop Architecture, HDFS Data Integrity, Hive Partitioning & Kerberos Cluster Security',
        icon: 'FiLayers',
        badgeColor: '#d19a66',
        questions: [
            {
                id: 'bd-01',
                q: 'Explain the Hadoop architecture and its primary components: HDFS (NameNode, DataNode), YARN (ResourceManager, NodeManager), and MapReduce execution model.'
            },
            {
                id: 'bd-02',
                q: 'How is Apache Spark better and faster than Hadoop MapReduce for large-scale data processing tasks?'
            },
            {
                id: 'bd-03',
                q: 'How do you verify and ensure data integrity in HDFS when moving, replicating, or migrating multi-terabyte datasets across clusters?'
            },
            {
                id: 'bd-04',
                q: 'What is the fundamental difference between Data Integrity and Data Quality, and what tools/processes do you use to enforce both across an enterprise data ecosystem?'
            },
            {
                id: 'bd-05',
                q: 'What is bucketing and partitioning in Apache Hive, and how does Hive integrate with Spark for query acceleration?'
            },
            {
                id: 'bd-06',
                q: 'Why is relying on a cron job running "kinit" problematic in an enterprise Kerberos-secured Hadoop/Spark infrastructure, and what is the proper architectural approach (e.g. keytabs with automated token renewal)?'
            }
        ]
    },
    {
        id: 'data-architecture',
        title: 'Data Architecture, Modeling & Warehousing',
        subtitle: 'OLTP vs. OLAP, Medallion Architecture, Financial Precision, Idempotency & Data Quality Frameworks',
        icon: 'FiGrid',
        badgeColor: '#c678dd',
        questions: [
            {
                id: 'da-01',
                q: 'Compare OLTP and OLAP architectures in detail across data modeling, storage layouts (row vs. columnar), concurrency, transaction semantics, and query access patterns.'
            },
            {
                id: 'da-02',
                q: 'Explain the Medallion Architecture (Bronze, Silver, Gold layers) in detail: how is data structured across each layer, and what validation, cleaning, and business aggregation transformations take place?'
            },
            {
                id: 'da-03',
                q: 'Why should you strictly prefer BIGNUMERIC (or NUMERIC / DECIMAL) over FLOAT or DOUBLE when designing financial data pipelines and ledger tables in BigQuery or Spark, and what are the computational trade-offs?'
            },
            {
                id: 'da-04',
                q: 'How do you design and execute an idempotent data pipeline to re-process / backfill data for the past 3 days without introducing duplicate records in your target warehouse or lakehouse?'
            },
            {
                id: 'da-05',
                q: 'How do you design and implement an enterprise Data Quality (DQ) framework: what checks run, how are validation rules structured, and how are failures quarantined or alerted?'
            },
            {
                id: 'da-06',
                q: 'What are Slowly Changing Dimensions (SCD), and how do you implement SCD Type 1, Type 2, and Type 3 updates in modern data warehouses?'
            },
            {
                id: 'da-07',
                q: 'What are the architectural differences between Star Schema and Snowflake Schema in dimensional data modeling, and when is each appropriate for cloud data warehouses?'
            },
            {
                id: 'da-08',
                q: 'How do you handle schema evolution and schema enforcement when consuming upstream data streams in an enterprise lakehouse?'
            }
        ]
    },
    {
        id: 'cloud-orchestration',
        title: 'Cloud & Workflow Orchestration (GCP / Airflow)',
        subtitle: 'Apache Airflow Engine Internals, BigQuery Capacitor & Slot Management, Dataproc, GCS & CI/CD',
        icon: 'FiCloud',
        badgeColor: '#56b6c2',
        questions: [
            {
                id: 'co-01',
                q: '1. Is Apache Airflow asynchronous or synchronous? How is parallel execution achieved? 2. Are Airflow workers stateful or stateless? 3. Can Airflow run multiple instances of the same task simultaneously? 4. Can you execute specific tasks from an Airflow DAG directly via CLI without running the whole DAG?'
            },
            {
                id: 'co-02',
                q: 'How do you manage Airflow Sensors, DAG concurrency limits, task pools, and SLA miss alerts in production workflows?'
            },
            {
                id: 'co-03',
                q: 'Explain Google Cloud Platform data architecture: when would you choose BigQuery vs. Dataproc vs. Cloud Dataflow for ETL/ELT workloads?'
            },
            {
                id: 'co-04',
                q: 'Explain BigQuery internals: Capacitor columnar storage, slot reservations, slot contention, partition pruning, and BI Engine acceleration.'
            },
            {
                id: 'co-05',
                q: 'How do you configure Cloud Storage (GCS) lifecycle management rules, storage tiers (Standard, Nearline, Coldline, Archive), and object versioning for cost optimization?'
            },
            {
                id: 'co-06',
                q: 'How do you architect an ingestion pipeline to parse and process interleaved, high-throughput unstructured streaming logs or financial events with out-of-order records?'
            },
            {
                id: 'co-07',
                q: 'How do you design and implement CI/CD deployment pipelines for data engineering code, Airflow DAGs, and infrastructure as code across dev, stage, and prod environments?'
            },
            {
                id: 'co-08',
                q: 'How do modern Change Data Capture (CDC) ingestion paradigms (e.g. Debezium, Kafka Connect, Datastream) synchronize transactional databases to cloud data lakehouses?'
            }
        ]
    },
    {
        id: 'behavioral-projects',
        title: 'Behavioral & Project Deep Dive',
        subtitle: 'Professional Introductions, End-to-End System Walkthroughs, Production Outages & Cross-Team Delivery',
        icon: 'FiUsers',
        badgeColor: '#e5c07b',
        questions: [
            {
                id: 'bp-01',
                q: 'Introduce yourself, your technical stack, and your key data engineering responsibilities across recent production engagements.'
            },
            {
                id: 'bp-02',
                q: 'Walk me through your primary enterprise data projects, architectural responsibilities, data volumes, and day-to-day engineering role.'
            },
            {
                id: 'bp-03',
                q: 'Walk me through an end-to-end data pipeline you architected from source ingestion to consumption, detailing technologies and key design decisions.'
            },
            {
                id: 'bp-04',
                q: 'Describe a complex technical challenge you faced in your project and how you diagnosed and resolved it.'
            },
            {
                id: 'bp-05',
                q: 'Have you implemented any performance or cost optimizations in your projects? Describe the problem, approach, and measurable outcome.'
            },
            {
                id: 'bp-06',
                q: 'How would you handle vague or shifting requirements from a business analyst or client under a tight delivery deadline?'
            },
            {
                id: 'bp-07',
                q: 'How do you handle production pipeline SLA breaches, data outages, or critical bugs during on-call production support?'
            },
            {
                id: 'bp-08',
                q: 'Share an instance where you worked in a cross-functional team under high pressure, and what was the outcome?'
            },
            {
                id: 'bp-09',
                q: 'How do you monitor, benchmark, and scale a production data pipeline handling billions of daily records and multiple terabytes of data?'
            },
            {
                id: 'bp-10',
                q: 'How do you approach cross-skilling, mentoring junior engineers, or aligning multiple stakeholders across engineering and business domains?'
            }
        ]
    }
];

export const STORAGE_KEY_CUSTOM_QUESTIONS = 'portfolio_all_interview_questions_v1';

/**
 * Loads questions from LocalStorage (if customized by admin) or returns defaults
 */
export const loadAllQuestions = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length === INITIAL_INTERVIEW_TOPICS.length) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Could not read custom questions from localStorage:', e);
    }
    return INITIAL_INTERVIEW_TOPICS;
};

/**
 * Saves customized questions to LocalStorage
 */
export const saveAllQuestions = (topicsData) => {
    try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_QUESTIONS, JSON.stringify(topicsData));
        return true;
    } catch (e) {
        console.error('Failed to save custom questions:', e);
        return false;
    }
};

/**
 * Resets questions back to factory defaults
 */
export const resetToDefaultQuestions = () => {
    try {
        localStorage.removeItem(STORAGE_KEY_CUSTOM_QUESTIONS);
    } catch (e) {
        console.warn('Failed to reset questions:', e);
    }
    return INITIAL_INTERVIEW_TOPICS;
};
