// Auto-generated module: bigquery
// Primary questions count: 5

export const bigqueryQuestions = [
  {
    "id": "bq-data-modeling-denormalization-arrays-structs",
    "qNo": 94,
    "q": "Data Modeling for BigQuery: What are the critical differences between traditional relational modeling and optimizing for BigQuery?",
    "a": "BigQuery is a distributed columnar database, which changes how you model data drastically compared to traditional RDBMS (like PostgreSQL).\n\n1. **Denormalization over Star Schemas:** In traditional DBs, you normalize data to save space. In BigQuery, storage is cheap, but `JOIN` operations across massive network partitions are expensive. You should denormalize heavily.\n2. **Nested and Repeated Fields:** Instead of joining an `Orders` table with an `Order_Items` table, BigQuery handles this natively via `ARRAY` and `STRUCT` data types. You store all items inside the order row itself. This eliminates the `JOIN` entirely and vastly improves read performance.\n3. **Partitioning & Clustering:** You *must* partition large tables (usually by a `DATE` or `TIMESTAMP` column) to limit the amount of data scanned per query. Within a partition, you **Cluster** the data by heavily filtered columns (e.g., `customer_id`) to colocate related data on disk, drastically reducing query costs.",
    "complexity": "Intermediate",
    "topics": [
      "bigquery",
      "data-modeling"
    ],
    "tags": [
      "bigquery-modeling",
      "denormalization",
      "nested-repeated",
      "arrays-structs",
      "partitioning-clustering"
    ]
  },
  {
    "id": "bq-storage-architecture-capacitor-colossus-jupiter",
    "qNo": 120,
    "q": "Explain the internal storage and compute architecture of Google BigQuery. How do Capacitor columnar storage, Colossus filesystem, and the Jupiter network enable petabyte-scale queries?",
    "a": "BigQuery achieves sub-minute query performance over petabytes by completely disaggregating storage and compute, connected by a datacenter-wide petabit network.\n\n### 1. Disaggregated Architecture\n```\n+---------------------+      +---------------------+      +---------------------+\n| Dremel Worker Slot  |      | Dremel Worker Slot  |      | Dremel Worker Slot  |  (Compute)\n+---------------------+      +---------------------+      +---------------------+\n          ^                             ^                            ^\n          |                             |                            |\n          +=============================+============================+\n                                        |\n                 [ Jupiter Datacenter Network (Petabit-scale) ]\n                                        |\n          +=============================+============================+\n          |                             |                            |\n          v                             v                            v\n+---------------------+      +---------------------+      +---------------------+\n|   Colossus Disk     |      |   Colossus Disk     |      |   Colossus Disk     |  (Storage)\n| (Capacitor format)  |      | (Capacitor format)  |      | (Capacitor format)  |\n+---------------------+      +---------------------+      +---------------------+\n```\n\n1. **Compute: Dremel Engine:**\n   - BigQuery executes queries using **Dremel**, a multi-tenant distributed query execution engine.\n   - When a query is submitted, Dremel compiles the SQL into an execution tree consisting of Root, Intermediate, and Leaf nodes.\n   - Leaf nodes communicate directly with storage, filtering and projecting data in parallel across thousands of **Slots** (virtual CPUs).\n2. **Network: Jupiter:**\n   - Traditional databases locate compute next to disk to minimize network transfer.\n   - BigQuery shatters this constraint using Google's **Jupiter network fabric**, which delivers over **1 Petabit per second** of bisection bandwidth, allowing compute workers to pull data from remote disks at the speed of local motherboard buses!\n3. **Storage: Colossus & Capacitor:**\n   - Data is stored in Google's globally distributed filesystem, **Colossus**, replicating data across multiple failure domains for 99.999999999% (11 9's) annual durability.\n   - Data files are encoded in **Capacitor**, Google's proprietary columnar file format (the evolutionary predecessor to Apache Parquet and Arrow).\n\n### 2. Capacitor's Columnar Optimizations\n- **Deep Encoding Selection:** For every column chunk, Capacitor evaluates multiple compression and encoding strategies (RLE, Dictionary, Frame-of-Reference, Bit-Vector) and picks the one yielding the smallest footprint and fastest vectorized evaluation.\n- **Predicate Evaluation without Decompression:** Capacitor evaluates queries directly on compressed dictionaries, filtering out non-matching blocks without expanding data in RAM.",
    "complexity": "Complex",
    "topics": [
      "bigquery",
      "distributed-systems",
      "hadoop-hive"
    ],
    "tags": [
      "capacitor-storage",
      "colossus-filesystem",
      "jupiter-network",
      "storage-compute-separation",
      "file-formats",
      "dremel-engine"
    ],
    "codeSnippet": "-- Analyzing bytes scanned and slot usage in BigQuery INFORMATION_SCHEMA\nSELECT\n    project_id,\n    job_id,\n    total_bytes_billed / (1024*1024*1024*1024) AS tb_billed,\n    total_slot_ms / (1000 * 60) AS slot_minutes,\n    query\nFROM `region-us`.INFORMATION_SCHEMA.JOBS_BY_PROJECT\nWHERE creation_time > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)\nORDER BY total_bytes_billed DESC LIMIT 10;"
  },
  {
    "id": "bq-partitioning-vs-clustering-optimization",
    "qNo": 121,
    "q": "Compare Partitioning vs. Clustering in BigQuery. What are the query pruning mechanics, cost implications, and common anti-patterns that lead to full table scans?",
    "a": "In BigQuery's on-demand pricing model ($6.25 per TB scanned), optimizing data layout directly cuts cloud infrastructure bills and boosts query speeds.\n\n### 1. Partitioning (Coarse-Grained Virtual Division)\n- Divides a table into segments based on a single column (up to 4,000 partitions per table).\n- **Partitioning Types:**\n  1. **Time-unit partitioning:** `DATE`, `DATETIME`, or `TIMESTAMP` column (e.g. partition by day, month, hour).\n  2. **Ingestion-time partitioning:** Pseudo-column `_PARTITIONDATE` populated automatically when data is written.\n  3. **Integer range partitioning:** Ranges based on an integer column (e.g. `customer_id` range 0-1000, 1001-2000).\n- **Pruning Mechanics:** If a query includes `WHERE transaction_date = '2024-10-01'`, BigQuery **physically skips reading all other partition files**. The bytes billed counter in the BigQuery validator reflects this reduction instantly before execution.\n\n### 2. Clustering (Fine-Grained Colocation)\n- Automatically sorts and colocates data within partitions based on up to 4 specified columns:\n```sql\nCREATE TABLE prod.orders (...)\nPARTITION BY DATE(order_timestamp)\nCLUSTER BY customer_id, store_id, order_status;\n```\n- **Column Order Matters:** BigQuery sorts data hierarchically by Column 1, then Column 2, etc. Filtering by `customer_id` provides maximum pruning; filtering only by `order_status` provides minimal pruning.\n- **Adaptive Auto-Clustering:** Unlike traditional databases that require manual `REINDEX` or `VACUUM`, BigQuery runs automatic background re-clustering jobs at zero user cost to re-sort newly appended data.\n\n### 3. Critical Anti-Patterns that Break Partition Pruning\n1. **Applying Functions to Partition Columns in WHERE clauses:**\n```sql\n-- BAD: Full table scan! Function prevents BigQuery from calculating static partition boundary\nWHERE DATE_ADD(transaction_date, INTERVAL 1 DAY) = '2024-10-02'\n\n-- GOOD: Instant partition pruning!\nWHERE transaction_date = DATE_SUB('2024-10-02', INTERVAL 1 DAY)\n```\n2. **Correlated Subquery Joins on Partition Keys:** Joining against an unmaterialized dynamic subquery often forces BigQuery into a full table scan because partition pruning cannot be determined during query planning.\n3. **Partitioning by High-Cardinality Columns:** Tables have a hard limit of 4,000 partitions. Partitioning by an unbinned timestamp or high-cardinality ID causes the table creation to fail. Use Clustering for high cardinality!",
    "complexity": "Intermediate",
    "topics": [
      "bigquery",
      "data-modeling"
    ],
    "tags": [
      "partitioning",
      "clustering",
      "cost-optimization",
      "query-pruning",
      "partition-anti-patterns",
      "bytes-billed"
    ],
    "codeSnippet": "-- Creating an optimized Partitioned & Clustered table with partition filtering enforced\nCREATE TABLE analytics.customer_events (\n    event_id STRING,\n    customer_id INT64,\n    event_type STRING,\n    event_timestamp TIMESTAMP\n)\nPARTITION BY DATE(event_timestamp)\nCLUSTER BY customer_id, event_type\nOPTIONS (\n    require_partition_filter = TRUE -- Rejects queries that omit the partition filter!\n);"
  },
  {
    "id": "bq-slot-allocations-on-demand-vs-editions-reservations",
    "qNo": 122,
    "q": "Explain BigQuery Compute Pricing Models: On-Demand vs. Capacity Editions (Standard, Enterprise, Enterprise Plus). How do Slot Reservations and Autoscaling prevent query queueing?",
    "a": "BigQuery offers two distinct pricing paradigms: **On-Demand (Per-Query)** and **Capacity Editions (Slot-based)**.\n\n### 1. On-Demand vs. Editions Model\n- **On-Demand Model:**\n  - Charged purely on the volume of bytes scanned by queries ($6.25 per TB in US).\n  - Every project receives access to a shared burst pool of up to **2,000 slots** on best-effort availability.\n  - Ideal for development environments, ad-hoc exploratory analysis, or low-frequency batch ETL workloads.\n- **BigQuery Editions (Standard, Enterprise, Enterprise Plus):**\n  - Introduced to replace legacy flat-rate reservations.\n  - You purchase dedicated compute capacity measured in **Slots** (1 slot = 1 virtual CPU worker).\n  - Billed per slot-hour, with features tiered by edition:\n    - **Standard:** Low-cost, basic SQL queries, maximum 1,600 autoscaling slots.\n    - **Enterprise:** Advanced workload management, multi-cloud (Omni), data masking, customer-managed encryption keys (CMEK).\n    - **Enterprise Plus:** 99.99% SLA, Disaster Recovery, mission-critical compliance.\n\n### 2. Slot Reservations, Baseline, and Autoscaling\nIn the Editions model, you manage capacity using **Reservations**:\n```\n[ Enterprise Reservation Pool ] (Baseline: 100 slots, Max Autoscaling: 500 slots)\n                 |\n      +----------+----------+\n      |                     |\n[ ETL Assignment ]    [ BI / Dashboard Assignment ]\n(Weight: 70%)         (Weight: 30%)\n```\n1. **Baseline Slots:** Dedicated capacity provisioned 24/7. Ensures critical workloads never experience cold-start spin-up delays.\n2. **Autoscaling Slots:** BigQuery monitors the query queue. If high-concurrency BI dashboards demand more compute, BigQuery automatically provisions slots in increments of 50 up to your configured `max_slots`, then scales down to the baseline when traffic subsides.\n3. **Fair Scheduling & Priority Queues:**\n   - Within a reservation, Dremel shares available slots fairly across running queries.\n   - If a heavy ETL query runs concurrently with an executive dashboard query, you can assign them to separate reservations or set the ETL job to `BATCH` priority, preventing interactive reporting queries from starving.",
    "complexity": "Complex",
    "topics": [
      "bigquery",
      "distributed-systems"
    ],
    "tags": [
      "slot-reservations",
      "editions-autoscaling",
      "baseline-slots",
      "on-demand-pricing",
      "concurrency",
      "workload-management"
    ],
    "codeSnippet": "# Creating an Enterprise Reservation with 100 Baseline and 400 Autoscaling Slots\nbq mk --project_id=my-project --location=us \\\n    --reservation \\\n    --slots=100 \\\n    --autoscale_max_slots=400 \\\n    --edition=ENTERPRISE \\\n    prod_bi_reservation\n\n# Assigning a folder/project to the reservation\nbq mk --project_id=my-project --location=us \\\n    --reservation_assignment \\\n    --reservation_id=prod_bi_reservation \\\n    --job_type=QUERY \\\n    --assignee_id=my-bi-project"
  },
  {
    "id": "bq-merge-dml-tuning-and-bi-engine-acceleration",
    "qNo": 123,
    "q": "How do you optimize large-scale MERGE DML statements in BigQuery for CDC and SCD Type 2? How does BigQuery BI Engine accelerate queries?",
    "a": "Performing continuous updates and CDC upserts in BigQuery historically was challenging because columnar storage formats favor bulk appends over row-level mutations.\n\n### 1. The `MERGE` Statement Problem in Columnar Databases\nWhen you execute `MERGE INTO target USING source ON target.id = source.id ...`, BigQuery must rewrite entire partitions containing updated or inserted rows.\n- **The Anti-Pattern:** Merging directly against a 50-billion-row unpartitioned table rewrites petabytes of data for a 1,000-row update batch.\n- **Optimization Strategy:**\n  1. **Partition Pruning on Both Target and Source:** Always include the partition filter in the `ON` match condition:\n```sql\nMERGE INTO `dw.orders` T\nUSING `staging.stg_orders` S\nON T.order_date = S.order_date AND T.order_id = S.order_id\nWHEN MATCHED THEN\n    UPDATE SET T.status = S.status, T.updated_at = S.updated_at\nWHEN NOT MATCHED THEN\n    INSERT ROW;\n```\n  2. **Deduplicate Source Prior to Merge:** BigQuery will throw a runtime error (`UPDATE/DELETE statement matched multiple rows`) if the source batch contains duplicate keys. Pre-filter using `ROW_NUMBER() OVER(PARTITION BY order_id ORDER BY change_seq DESC) = 1`.\n  3. **Batching:** Rather than executing row-by-row streaming merges, micro-batch CDC events into staging tables and run a single `MERGE` every 15–30 minutes.\n\n### 2. BigQuery BI Engine Acceleration\n**BI Engine** is an in-memory analysis service built directly into BigQuery that accelerates SQL queries for BI tools (Looker, Power BI, Tableau) down to sub-second response times.\n- **Zero ETL Caching:** You do not have to build extract cubes or replicate data to external Redis caches. BI Engine caches hot table columns and partitions directly inside memory allocated to your reservation.\n- **Vectorized Execution:** Queries evaluate against cached columnar vectors using SIMD CPU instructions without dispatching work to Dremel disk workers.\n- **Reservation Allocation:** You configure BI Engine capacity (e.g. 50GB) in your BigQuery administration console. BI Engine automatically determines which tables or partitions to keep resident in RAM based on query access frequency.",
    "complexity": "Intermediate",
    "topics": [
      "bigquery",
      "advanced-sql"
    ],
    "tags": [
      "merge-dml",
      "bi-engine",
      "in-memory-caching",
      "cdc-upserts",
      "subquery-pruning",
      "row-number-dedup"
    ],
    "codeSnippet": "-- Optimized CDC MERGE pattern with partition pruning & source deduplication\nMERGE INTO prod_dw.dim_customer target\nUSING (\n    SELECT * EXCEPT(rn)\n    FROM (\n        SELECT *, ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY updated_at DESC) as rn\n        FROM staging.cdc_customer_events\n        WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)\n    )\n    WHERE rn = 1\n) source\nON target.signup_date = source.signup_date AND target.customer_id = source.customer_id\nWHEN MATCHED AND target.hash_diff != source.hash_diff THEN\n    UPDATE SET target.address = source.address, target.updated_at = CURRENT_TIMESTAMP()\nWHEN NOT MATCHED THEN\n    INSERT (customer_id, signup_date, address, updated_at)\n    VALUES (source.customer_id, source.signup_date, source.address, CURRENT_TIMESTAMP());"
  }
];
