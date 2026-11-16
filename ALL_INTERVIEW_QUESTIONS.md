# 📚 Master Interview Questions Compilation

> **Compiled from 12 Enterprise Interview Rounds & Reference Questions Repository**  
> *Consolidated into 7 core technical and architectural domains. Questions are kept generic and focused purely on the problem statement without company-specific references.*

---

## 📑 Table of Contents
1. [Apache Spark & PySpark](#1-apache-spark--pyspark) (24 Questions)
2. [SQL & Query Optimization](#2-sql--query-optimization) (27 Questions)
3. [Python & Algorithms](#3-python--algorithms) (17 Questions)
4. [Big Data & Hadoop](#4-big-data--hadoop) (6 Questions)
5. [Data Architecture, Modeling & Warehousing](#5-data-architecture-modeling--warehousing) (8 Questions)
6. [Cloud & Workflow Orchestration (GCP / Airflow)](#6-cloud--workflow-orchestration-gcp--airflow) (8 Questions)
7. [Behavioral & Project Deep Dive](#7-behavioral--project-deep-dive) (10 Questions)

---

## 1. Apache Spark & PySpark

1. **Architecture & Execution Lifecycle**: Explain the internal architecture of Apache Spark: how do the Driver, Cluster Manager, Worker Nodes, and Executors collaborate, and how does a job execute from submission to completion?
2. **Spark-Submit Lifecycle**: Trace the step-by-step lifecycle of what happens internally across the cluster after `spark-submit` is executed on a cluster.
3. **SparkSession Initialization**: What is a SparkSession, and how do you initialize and configure it in PySpark?
4. **DAG & Scheduling**: What is a DAG (Directed Acyclic Graph) in Spark, and how does the DAGScheduler decompose jobs into stages and tasks?
5. **Transformations Classification**: What are narrow transformations vs. wide transformations in Spark? Explain why wide transformations trigger shuffle operations.
6. **Lazy Evaluation**: What are Actions and Transformations in Spark? Explain the concept and benefits of lazy evaluation.
7. **Caching vs. Persistence**: What is the difference between `cache()` and `persist()` in Spark? What storage levels are supported (`MEMORY_ONLY`, `MEMORY_AND_DISK`, `OFF_HEAP`)?
8. **Partition Control**: What is the difference between `repartition()` and `coalesce()` in Spark, and when should you choose one over the other?
9. **Aggregation Efficiency**: What is the difference between `groupByKey()` and `reduceByKey()` in Spark, and why does `reduceByKey()` dramatically reduce network shuffle?
10. **Broadcast Join**: What is a Broadcast Variable and Broadcast Hash Join in Spark? What are the default threshold limits (e.g. `spark.sql.autoBroadcastJoinThreshold`) and failure risks?
11. **Executor Stragglers & Skew**: During a Spark job execution, 99 tasks finish in 1 minute, but 1 task / executor takes 45 minutes to finish (or hangs). How do you diagnose and resolve this executor straggler / data skew issue?
12. **Driver vs. Executor OOM**: What is the difference between Driver OOM and Executor OOM errors in Spark? What root causes trigger each, and how do you fix them?
13. **Enterprise Performance Tuning**: What core optimizations do you implement to tune PySpark applications for enterprise-scale workloads (AQE, Skew Join hints, Kryo serializer, dynamic partition pruning)?
14. **Catalyst Optimizer**: How does Spark’s Catalyst Optimizer work? Explain the difference between Unresolved Logical Plan, Analyzed Logical Plan, Optimized Logical Plan, and Physical Execution Plans.
15. **Memory Spill & GC Pauses**: How do you diagnose and mitigate data skew, disk spill (Execution memory vs. Storage memory spill), and excessive Java Garbage Collection (GC) pauses during massive shuffle operations?
16. **Delta Lake Internals**: Explain Delta Lake transaction log serialization (ACID protocol), schema evolution vs. schema enforcement, time travel, and VACUUM retentions.
17. **Delta Lake Maintenance**: Explain Delta table performance maintenance: File Compaction (`OPTIMIZE`), Z-Ordering, and Liquid Clustering in modern Databricks runtimes.
18. **DataFrame Column Manipulation**: How do you rename or add a new column to a DataFrame in PySpark using `withColumn()`, `withColumnRenamed()`, or `select()`?
19. **Date & Timestamp Conversion**: Given a DataFrame with a string column `trans_date` formatted as `"dd-mm-YYYY"`, write PySpark code to convert and create a new column `trans_month` formatted as `"yyyy-MM"`.
20. **Live Business Logic Coding**: Given a DataFrame `payment_events(payment_id, provider, customer_id, status, amount, event_ts)`, write PySpark code to find customers whose total `REFUNDED` amount is greater than 50% of their total `CAPTURED` amount, displaying the refund percentage rounded to 1 decimal place.
21. **SCD Type 2 in PySpark**: Write PySpark DataFrame code to implement Slowly Changing Dimension (SCD) Type 2 updates for an incoming batch of changed customer records, handling effective start dates, end dates, and current active flags.
22. **Analytical Window Functions**: What is the use of `lead()` and `lag()` analytic window functions in Spark DataFrames, and how do you specify window specifications with `Window.partitionBy()` and `Window.orderBy()`?
23. **Spark vs. Hadoop**: How does Apache Spark outperform Hadoop MapReduce for large-scale iterative processing and data analytics?
24. **Hive Integration & Pruning**: How do Hive partitioning and bucketing integrate with Spark DataFrame reads, and how does partition pruning prevent full table scans?

---

## 2. SQL & Query Optimization

1. **Distributed Query Optimization**: How do you optimize slow-running SQL queries in distributed engines (BigQuery, Snowflake, Spark SQL) versus traditional relational databases (PostgreSQL, Oracle)?
2. **Subquery Elimination**: How do you eliminate correlated subqueries and optimize queries using Common Table Expressions (CTEs), temporary staging tables, or window functions?
3. **Partitioning vs. Clustering**: Explain the fundamental differences between Partitioning and Clustering in modern analytical data warehouses. When should each be used, and what are the trade-offs?
4. **Index Structures**: What are the different types of indexes available in relational database engines (B-Tree, Bitmap, Hash, Clustered vs. Non-Clustered)? Explain their internal structures and use cases.
5. **Window Functions Anatomy**: What are SQL window functions? Explain the components of an `OVER()` clause (`PARTITION BY`, `ORDER BY`, `ROWS/RANGE BETWEEN`) with practical examples.
6. **Ranking Functions Comparison**: Explain the difference between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` with examples of duplicate tie-breaking.
7. **Ranking Calculation Problem**: Given a column with values `[1, 2, 3, NULL, NULL, 3, 3, 1]`, what is the exact rank output assigned by `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` ordered ascending?
8. **Highest Salary per Department**: Write a query to find the highest salary from each department.
9. **2nd Highest Salary**: Write an optimized query to find the 2nd highest salary from each department using window functions and joins.
10. **Nth Highest Salary**: Write a query to find the nth highest salary from an employee table without using proprietary functions.
11. **Running Total & Department Average**: Write a query using window functions to find the running cumulative total and average salary for each department.
12. **Daily Metric & Day-over-Day Delta**: Given table `payment_events(payment_id, provider, customer_id, status, amount, event_ts)`, write a SQL query to calculate for each provider and each day: total `CAPTURED` revenue, running total of revenue for that provider, and the day-over-day change compared with that provider’s previous active revenue day.
13. **Duplicate Detection (3 Methods)**: Write a SQL query to find duplicates in a table using three distinct approaches (`GROUP BY / HAVING`, `ROW_NUMBER()`, and self-joins).
14. **Top & Least Performers**: Write a query to find the top and least performing employees based on performance conditions using subqueries or CTEs.
15. **Conditional Categorization**: Write a query to categorize salary ranges into tags (`"low"` < 30k, `"med"` 30k-50k, `"high"` > 50k) using conditional `CASE WHEN` statements.
16. **Temporal Frequency Analysis**: Write a query to find employees who changed their address more than three times in the last three months.
17. **Join Types Taxonomy**: How many types of joins are there? Explain Inner, Left, Right, Full Outer, Cross, Left Semi, and Left Anti joins with examples.
18. **Semi-Join vs. Anti-Join**: Explain the relational mechanics and practical differences between a Left Semi-Join and a Left Anti-Join. How are they implemented in SQL and Spark?
19. **Join Cardinality Limits**: If Table A has 100 records and Table B has 20 records, what are the minimum and maximum possible row counts of a `LEFT JOIN`?
20. **Join Row Count Evaluation (NULLs & Duplicates)**: Given two single-column tables: `table1: [1, 2, 3, 4, NULL]` (5 rows) and `table2: [1, 2, 3, NULL, NULL, 3, 3, 1]` (8 rows), calculate the exact output row count for: Inner Join, Left Join, Right Join, Full Outer Join, Cross Join, Left Anti Join, and Left Semi Join.
21. **Join Row Count Evaluation (Binary Values)**: Given two single-column tables with duplicate 1s and 0s: Table t1 has three 1s and two 0s (5 rows); Table t2 has two 1s and three 0s (5 rows). Calculate the exact output row counts for `INNER`, `LEFT`, `RIGHT`, `FULL`, and `CROSS` joins.
22. **Large-Scale Join Tuning**: How do you optimize a large-scale join between a dimension table with 500 million records and a fact/transaction table with 2 billion records to avoid severe shuffle and skew?
23. **Pairwise Unique Combinations**: Given Table A with products and prices (laptop: 1500, keyboard: 1000, mouse: 500), write a SQL query using joins and `CASE` to generate unique pairs displaying the highest and lowest priced item in each pair.
24. **Hierarchy & Manager IDs**: Given an Employee table `(EmpID, ManagerID)`, write a SQL query to extract all unique manager IDs representing valid managers who manage at least one person.
25. **Outer Join Entity Alignment**: Given tables `Department(DeptID, DeptName, ManagerID)` and `Employee(EmpID, EmpName)`, write a SQL query to retrieve each department alongside its assigned manager, properly handling departments that currently lack an assigned manager.
26. **COUNT Semantics**: What is the difference between `COUNT(*)`, `COUNT(1)`, and `COUNT(column_name)` in SQL?
27. **Concurrent MERGE Operations**: How does the SQL `MERGE` statement execute SCD Type 2 updates under concurrent write transactions?

---

## 3. Python & Algorithms

1. **Core Data Types & Mutability**: What are Python’s primary built-in data types (Integer, Float, Complex Number, Boolean, String, List, Tuple, Set, Dictionary), and which are mutable vs. immutable?
2. **Lambda Functions & Functional Constructs**: What are lambda functions in Python, what are their limitations, and how are they used with `map()`, `filter()`, and `reduce()`?
3. **Exception Handling**: Explain Python’s exception handling mechanism: how do `try`, `except`, `else`, and `finally` blocks execute?
4. **Dunder Init vs. New**: What is the `__init__` method in Python classes, why is it used, and how does it differ from `__new__`?
5. **Object Cloning**: Explain the difference between shallow copy and deep copy in Python (using the `copy` module) and how compound nested objects are affected.
6. **Object-Oriented Programming (OOP)**: How is Object-Oriented Programming (OOP) and inheritance implemented in Python? What are its types (single, multiple, multilevel, hierarchical), and what is the Method Resolution Order (MRO)?
7. **The `self` Keyword**: What is the purpose of the `self` keyword in Python class methods, and what happens behind the scenes when calling instance methods?
8. **Comprehensions & Generators**: Write a Python program demonstrating list comprehensions, dictionary comprehensions, and generator expressions.
9. **String Frequency Counting**: Write a Python program to calculate the frequency of characters in a string and identify duplicate characters.
10. **Factorial Computation**: Write a Python program to calculate the factorial of a number using both iterative and recursive approaches.
11. **List Difference & Intersection**: Write a program to find elements: 1. In List1 but not in List2, 2. In List2 but not in List1, 3. In both lists (using set operations and list comprehension).
12. **Common Elements with Duplicates**: Write a program to find common elements between two lists in Python while preserving element frequency / handling duplicates.
13. **Missing Number in Sorted Array (O(n) & O(1) Space)**: Given a list containing numbers from 1 to n in ascending order with missing numbers (e.g., `[1, 2, 3, 4, 6, 7, 8, 10]`), write an algorithm to find all missing numbers in O(n) time and O(1) extra space without using built-in functions (no `max()`, no `range()`, no `"in"` membership search).
14. **First Missing Positive Integer**: Given an unsorted list of positive integers (e.g. `[1, 12, 3, 5, 6, 7, 22, 8, 2, 10]`), write an algorithm in Python to find the smallest positive integer missing from the list in O(n) time and O(1) auxiliary space.
15. **Kth Largest Element in Array**: Given an unsorted integer array `arr = [10, 40, 20, 30, 50, 60, 5, 4]` and `k = 3`, write an algorithm to find the 3rd largest element (expected: 40). Compare the brute-force, min-heap, and quickselect approaches with their time and space complexities.
16. **Big-O Complexity Analysis**: Explain time and space complexities (Big-O notation) for array search, hash table lookup, binary search, merge sort, and recursive call stacks.
17. **Pipeline Automation Scripting**: Write a shell script and a Python script for automated file validation, checksum verification, and graceful error alerting in an ETL ingestion pipeline.

---

## 4. Big Data & Hadoop

1. **Hadoop Core Architecture**: Explain the Hadoop architecture and its primary components: HDFS (NameNode, DataNode), YARN (ResourceManager, NodeManager), and MapReduce execution model.
2. **Spark vs. Hadoop Processing**: How is Apache Spark better and faster than Hadoop MapReduce for large-scale data processing tasks?
3. **HDFS Data Integrity**: How do you verify and ensure data integrity in HDFS when moving, replicating, or migrating multi-terabyte datasets across clusters?
4. **Data Integrity vs. Data Quality**: What is the fundamental difference between Data Integrity and Data Quality, and what tools/processes do you use to enforce both across an enterprise data ecosystem?
5. **Hive Partitioning & Bucketing**: What is bucketing and partitioning in Apache Hive, and how does Hive integrate with Spark for query acceleration?
6. **Kerberos Security Pitfalls**: Why is relying on a cron job running `"kinit"` problematic in an enterprise Kerberos-secured Hadoop/Spark infrastructure, and what is the proper architectural approach (e.g. keytabs with automated token renewal)?

---

## 5. Data Architecture, Modeling & Warehousing

1. **OLTP vs. OLAP Paradigms**: Compare OLTP and OLAP architectures in detail across data modeling, storage layouts (row vs. columnar), concurrency, transaction semantics, and query access patterns.
2. **Medallion Architecture**: Explain the Medallion Architecture (Bronze, Silver, Gold layers) in detail: how is data structured across each layer, and what validation, cleaning, and business aggregation transformations take place?
3. **Financial Precision (BIGNUMERIC vs. FLOAT)**: Why should you strictly prefer BIGNUMERIC (or NUMERIC / DECIMAL) over FLOAT or DOUBLE when designing financial data pipelines and ledger tables in BigQuery or Spark, and what are the computational trade-offs?
4. **Idempotent Historical Backfills**: How do you design and execute an idempotent data pipeline to re-process / backfill data for the past 3 days without introducing duplicate records in your target warehouse or lakehouse?
5. **Enterprise Data Quality (DQ) Framework**: How do you design and implement an enterprise Data Quality (DQ) framework: what checks run, how are validation rules structured, and how are failures quarantined or alerted?
6. **Slowly Changing Dimensions (SCD)**: What are Slowly Changing Dimensions (SCD), and how do you implement SCD Type 1, Type 2, and Type 3 updates in modern data warehouses?
7. **Star vs. Snowflake Schema**: What are the architectural differences between Star Schema and Snowflake Schema in dimensional data modeling, and when is each appropriate for cloud data warehouses?
8. **Schema Evolution in Lakehouses**: How do you handle schema evolution and schema enforcement when consuming upstream data streams in an enterprise lakehouse?

---

## 6. Cloud & Workflow Orchestration (GCP / Airflow)

1. **Airflow Architecture & Execution**: 1. Is Apache Airflow asynchronous or synchronous? How is parallel execution achieved? 2. Are Airflow workers stateful or stateless? 3. Can Airflow run multiple instances of the same task simultaneously? 4. Can you execute specific tasks from an Airflow DAG directly via CLI without running the whole DAG?
2. **Production Airflow Management**: How do you manage Airflow Sensors, DAG concurrency limits, task pools, and SLA miss alerts in production workflows?
3. **GCP Compute Selection**: Explain Google Cloud Platform data architecture: when would you choose BigQuery vs. Dataproc vs. Cloud Dataflow for ETL/ELT workloads?
4. **BigQuery Engine Internals**: Explain BigQuery internals: Capacitor columnar storage, slot reservations, slot contention, partition pruning, and BI Engine acceleration.
5. **GCS Lifecycle Optimization**: How do you configure Cloud Storage (GCS) lifecycle management rules, storage tiers (Standard, Nearline, Coldline, Archive), and object versioning for cost optimization?
6. **Unstructured Stream Ingestion**: How do you architect an ingestion pipeline to parse and process interleaved, high-throughput unstructured streaming logs or financial events with out-of-order records?
7. **Data CI/CD Pipelines**: How do you design and implement CI/CD deployment pipelines for data engineering code, Airflow DAGs, and infrastructure as code across dev, stage, and prod environments?
8. **Change Data Capture (CDC)**: How do modern Change Data Capture (CDC) ingestion paradigms (e.g. Debezium, Kafka Connect, Datastream) synchronize transactional databases to cloud data lakehouses?

---

## 7. Behavioral & Project Deep Dive

1. **Professional Introduction**: Introduce yourself, your technical stack, and your key data engineering responsibilities across recent production engagements.
2. **Project Walkthrough & Role**: Walk me through your primary enterprise data projects, architectural responsibilities, data volumes, and day-to-day engineering role.
3. **End-to-End Pipeline Design**: Walk me through an end-to-end data pipeline you architected from source ingestion to consumption, detailing technologies and key design decisions.
4. **Technical Problem Solving**: Describe a complex technical challenge you faced in your project and how you diagnosed and resolved it.
5. **Performance & Cost Optimization**: Have you implemented any performance or cost optimizations in your projects? Describe the problem, approach, and measurable outcome.
6. **Vague Requirements & Deadlines**: How would you handle vague or shifting requirements from a business analyst or client under a tight delivery deadline?
7. **SLA Breaches & Production Incidents**: How do you handle production pipeline SLA breaches, data outages, or critical bugs during on-call production support?
8. **Pressure & Cross-Team Delivery**: Share an instance where you worked in a cross-functional team under high pressure, and what was the outcome?
9. **Massive Scale & Monitoring**: How do you monitor, benchmark, and scale a production data pipeline handling billions of daily records and multiple terabytes of data?
10. **Mentorship & Stakeholder Management**: How do you approach cross-skilling, mentoring junior engineers, or aligning multiple stakeholders across engineering and business domains?

---

*Document generated and compiled for high-impact interview preparation.*
