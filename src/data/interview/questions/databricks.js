// Auto-generated module: databricks
// Primary questions count: 7

export const databricksQuestions = [
  {
    "id": "databricks-delta-optimize-zorder-vacuum",
    "qNo": 56,
    "q": "How do OPTIMIZE, Z-Order, and VACUUM work in Delta Lake?",
    "a": "**OPTIMIZE (Bin-packing):** Solves the \"Small Files Problem\". Streaming or frequent small batch jobs write thousands of tiny Parquet files. `OPTIMIZE` reads these tiny files and rewrites them into larger, optimal-sized files (usually 1GB), massively improving read performance.\n\n**Z-Order (Multi-dimensional Clustering):** Used alongside OPTIMIZE. It physically sorts the data in the storage files based on frequently filtered columns. This allows Delta Lake to use \"Data Skipping\" to ignore entire files that don't contain the requested data, dramatically speeding up `WHERE` clauses.\n\n**VACUUM:** Delta Lake keeps older versions of files for Time Travel (querying historical states). `VACUUM` permanently deletes files that are no longer referenced by the current Delta log and are older than the retention threshold (default 7 days), freeing up storage space.",
    "complexity": "Intermediate",
    "topics": [
      "databricks",
      "pyspark",
      "hadoop-hive"
    ],
    "tags": [
      "optimize",
      "z-order",
      "vacuum",
      "delta-lake",
      "file-compaction",
      "file-formats",
      "data-skipping"
    ],
    "codeSnippet": "-- Compact small files and organize by high-cardinality query filters\nOPTIMIZE delta.`/mnt/delta/events`\nZORDER BY (customer_id, event_date);\n\n-- Remove obsolete file versions older than retention threshold (default 7 days)\nVACUUM delta.`/mnt/delta/events` RETAIN 168 HOURS;"
  },
  {
    "id": "databricks-unity-catalog-governance",
    "qNo": 58,
    "q": "Deep Dive: What is Unity Catalog? How does it fundamentally change data governance in Databricks?",
    "a": "Historically, Databricks relied on the Hive Metastore (HMS), which was bound to a specific workspace. If you had 5 workspaces, you had 5 siloed metastores. Permissions were managed via complex cloud IAM roles, and table-level ACLs were notoriously difficult.\n\n**Unity Catalog (UC)** is a centralized, account-level governance layer:\n1. **Centralized Metastore:** One metastore governs all workspaces across your entire organization. Data is strictly referenced hierarchically: `catalog.schema.table`.\n2. **Standardized SQL ACLs:** Instead of cloud IAM roles, you grant permissions using standard ANSI SQL: `GRANT SELECT ON TABLE my_table TO group_data_scientists;`. UC translates this natively to the cloud storage layer.\n3. **Fine-Grained Governance:** UC enables Row-Level Security (RLS) and Column-Level Masking out of the box, preventing PII exposure without duplicating datasets.\n4. **Automated Lineage:** UC automatically tracks data lineage at the table and column level across all languages (SQL, Python, Scala) and displays it visually.",
    "complexity": "Complex",
    "topics": [
      "databricks",
      "data-governance"
    ],
    "tags": [
      "unity-catalog",
      "3-level-namespace",
      "data-lineage",
      "centralized-governance",
      "rbac",
      "metastore"
    ]
  },
  {
    "id": "databricks-delta-lake-transaction-log-acid",
    "qNo": 59,
    "q": "Deep Dive: Explain the Delta Lake Transaction Log (_delta_log). How does it achieve ACID transactions on Cloud Object Storage?",
    "a": "Cloud Object Storage (S3, ADLS) is immutable. You cannot natively 'update' an object. Delta Lake achieves ACID transactions by managing a specialized folder called `_delta_log`.\n\n**How it works:**\n1. Every time you write, update, or delete data, Delta doesn't mutate existing Parquet files. It writes brand new Parquet files.\n2. Simultaneously, it writes a JSON commit file (e.g., `000001.json`) to the `_delta_log` directory. This JSON explicitly lists which Parquet files were `add`ed and which were `remove`d (logically deleted).\n3. When a reader queries the table, the Spark engine first reads the `_delta_log`. It computes the current state of the table by reconciling all the `add` and `remove` actions, and *only* reads the valid Parquet files, ignoring the tombstoned ones.\n\n**Checkpoints:** Reading thousands of JSON files would be slow. Every 10 commits, Delta automatically generates a Parquet Checkpoint file in the log, summarizing the entire table state. The reader just reads the latest checkpoint + any newer JSONs.",
    "complexity": "Complex",
    "topics": [
      "databricks",
      "pyspark",
      "distributed-systems",
      "data-modeling"
    ],
    "tags": [
      "_delta_log",
      "acid-transactions",
      "time-travel",
      "concurrency-control",
      "file-formats",
      "lakehouse",
      "crc-checkpoints"
    ],
    "codeSnippet": "# Querying historical snapshot via Delta Time Travel\ndf_v3 = spark.read.format(\"delta\").option(\"versionAsOf\", 3).load(\"/mnt/delta/orders\")\ndf_ts = spark.read.format(\"delta\").option(\"timestampAsOf\", \"2024-01-01 00:00:00\").load(\"/mnt/delta/orders\")"
  },
  {
    "id": "databricks-photon-engine-vectorized-execution",
    "qNo": 60,
    "q": "Databricks Photon Engine vs standard Spark. How does vectorized execution work?",
    "a": "**Standard Spark** runs on the JVM (Java Virtual Machine). It processes data row-by-row (or using Tungsten's whole-stage code generation). While highly optimized, the JVM still suffers from garbage collection overhead and virtual method dispatching.\n\n**Photon** is a custom, native execution engine written entirely in **C++** that integrates seamlessly under Spark.\n- **Vectorized Execution:** Instead of processing one row at a time, Photon processes batches of data (vectors) simultaneously, utilizing modern CPU architectures (SIMD instructions - Single Instruction, Multiple Data).\n- **Bypass JVM:** For supported operations (like Aggregations, Joins, and string manipulations), the execution completely bypasses the JVM, eliminating garbage collection pauses and massively accelerating performance. If an operation isn't supported in C++, it seamlessly falls back to the JVM.",
    "complexity": "Complex",
    "topics": [
      "databricks",
      "pyspark"
    ],
    "tags": [
      "photon",
      "vectorized-execution",
      "c++-engine",
      "hardware-acceleration",
      "simd",
      "row-vs-columnar"
    ]
  },
  {
    "id": "databricks-structured-streaming-vs-autoloader",
    "qNo": 61,
    "q": "Structured Streaming vs Databricks Auto Loader. When and why should you use Auto Loader?",
    "a": "If you want to ingest thousands of new files landing in S3 into a Delta Table, you have two options.\n\n**Standard Structured Streaming:**\n- Uses file listing (e.g., `spark.readStream.json('s3://bucket/')`). \n- *The Problem:* To find new files, Spark has to list the entire directory on every micro-batch. If your directory has 5 million files, the `ls` API call takes minutes, causing extreme bottlenecks.\n\n**Databricks Auto Loader (`cloudFiles`):**\n- Specifically engineered to ingest millions of files from cloud storage efficiently.\n- **File Notification Mode:** Instead of listing directories, Auto Loader automatically sets up Cloud Event Notifications (e.g., AWS SNS/SQS). When a file lands, an event is pushed to the queue. Auto Loader just reads the queue to know exactly which files are new. Zero directory listing required.\n- **Schema Evolution:** Auto Loader automatically detects schema changes (new columns, data type changes) and handles them gracefully using a schema location path, preventing the stream from crashing.",
    "complexity": "Intermediate",
    "topics": [
      "databricks",
      "pyspark",
      "pubsub-kafka"
    ],
    "tags": [
      "auto-loader",
      "structured-streaming",
      "cloudfiles",
      "incremental-ingestion",
      "file-notification-mode"
    ],
    "codeSnippet": "df = (spark.readStream.format(\"cloudFiles\")\n      .option(\"cloudFiles.format\", \"json\")\n      .option(\"cloudFiles.schemaLocation\", \"/mnt/checkpoints/schema\")\n      .load(\"/mnt/raw-landing/\"))"
  },
  {
    "id": "databricks-liquid-clustering-vs-zordering",
    "qNo": 108,
    "q": "Deep Dive: Delta Lake Liquid Clustering vs. Traditional Hive Partitioning and Z-Ordering. How does Liquid Clustering solve partitioning skew and rewrite overhead?",
    "a": "For years, big data systems relied on two primary data organization methods: physical directory partitioning (`PARTITIONED BY (date)`) and multi-dimensional sorting (`Z-ORDER BY (colA, colB)`). In Databricks Runtime 13.3+, **Liquid Clustering** was introduced to replace both.\n\n### 1. Limitations of Partitioning & Z-Ordering\n- **Partitioning Flaws:**\n  - **Rigid & Static:** Once you partition a table by `date`, you cannot change the layout without completely rewriting the table.\n  - **Data Skew & Small Files:** Partitioning by high-cardinality columns creates thousands of tiny files and empty partitions. Partitioning by low-cardinality columns results in huge, unpruned files.\n- **Z-Ordering Flaws:**\n  - **Full Rewrite Cost:** Z-Ordering is not incremental. Running `OPTIMIZE ... ZORDER BY (user_id)` on a table rewrites all data files in the target partition from scratch, consuming immense compute and causing high write amplification.\n  - **Degradation:** As new append data lands, query performance degrades rapidly until the next expensive full Z-Order job runs.\n\n### 2. How Liquid Clustering Works\nLiquid Clustering replaces fixed directory trees with **Dynamic Hilbert-curve Clustering** directly recorded in the Delta transaction log:\n1. **Incremental & Fast:** When `OPTIMIZE` runs on a table with Liquid Clustering, it only clusters newly appended or unclustered data files. It does not rewrite already clustered data, reducing compactions costs by up to 80%.\n2. **Flexibility to Redefine Keys:** You can change the clustering keys at any time (`ALTER TABLE ... CLUSTER BY (...)`) without rewriting historical data! New appends and subsequent compactions will simply cluster according to the new keys.\n3. **Multi-Column Concurrency:** Supports up to 4 clustering keys with equal filtering power, eliminating the trade-offs of partition column hierarchies.\n4. **No Small Files or Partition Overkill:** Data is kept in optimal file sizes (approx. 512MB-1GB) regardless of the cardinality of the clustering columns.\n\n### 3. Syntax & Migration\n```sql\n-- Creating a table with Liquid Clustering\nCREATE TABLE silver_sensor_readings (\n    device_id STRING,\n    event_timestamp TIMESTAMP,\n    temperature DOUBLE,\n    location_id STRING\n)\nUSING DELTA\nCLUSTER BY (device_id, event_timestamp);\n\n-- Trigger incremental clustering\nOPTIMIZE silver_sensor_readings;\n```",
    "complexity": "Complex",
    "topics": [
      "databricks"
    ],
    "tags": [
      "liquid-clustering",
      "z-order",
      "data-clustering",
      "performance-tuning",
      "delta-lake",
      "partitioning-anti-patterns"
    ],
    "codeSnippet": "-- Changing clustering keys on the fly without rewriting data\nALTER TABLE silver_sensor_readings CLUSTER BY (location_id, event_timestamp);\nOPTIMIZE silver_sensor_readings;"
  },
  {
    "id": "databricks-medallion-architecture-deep-dive",
    "qNo": 109,
    "q": "Explain the Medallion Architecture (Bronze, Silver, Gold) in a Lakehouse. What are the specific schemas, storage formats, validation rules, and SCD policies across each layer?",
    "a": "The **Medallion Architecture** describes a multi-hop data design pattern that logically organizes data as it flows through a Lakehouse, incrementally improving the structure and quality of data.\n\n```\n[ Raw Sources ] -> [ BRONZE (Raw Append) ] -> [ SILVER (Cleansed/Enriched) ] -> [ GOLD (Aggregated/Business) ]\n                           ^                                ^                                    ^\n                   Schema-on-read                  Schema enforcement                     Star Schema\n                   Full fidelity audit             Deduplication & SCD 2                  BI / ML consumption\n```\n\n### 1. Bronze Layer (Raw Data / Landing Zone)\n- **Role:** Pure append-only historical archive of raw source transactions.\n- **Characteristics:**\n  - Preserves exact source payload with full fidelity (raw JSON strings, binary messages from Kafka).\n  - Schema-on-read: Minimal transformations. Appends ingestion metadata: `_ingest_timestamp`, `_source_filename`.\n  - Retains all raw history indefinitely to allow replaying pipelines from scratch if downstream logic changes.\n\n### 2. Silver Layer (Cleaned, Conformed, & Enriched)\n- **Role:** Enterprise-wide single version of truth.\n- **Transformations Applied:**\n  - **Schema Enforcement:** Enforces strict types and nullability constraints.\n  - **Deduplication:** Removes duplicate records originating from source retries using window functions or Delta `MERGE`.\n  - **Data Cleansing:** Strips whitespace, standardizes dates and country codes, parses JSON payloads into structured columns.\n  - **History Tracking (SCD Type 2):** Tracks slowly changing dimensions using Delta Lake Time Travel or MERGE statements setting `is_current` and `valid_to` timestamps.\n  - **Data Quality Quarantine:** Rows failing validation are rerouted to a dead-letter quarantine table.\n\n### 3. Gold Layer (Business Aggregates & Star Schemas)\n- **Role:** Purpose-built data marts optimized for executive dashboards, BI tools (Power BI, Tableau), and ML features.\n- **Characteristics:**\n  - Modeled using dimensional modeling principles (Kimball Star Schema with Fact and Dimension tables) or denormalized wide reporting tables.\n  - Pre-aggregated metrics (e.g. daily active users, customer lifetime value, store revenue).\n  - High performance: Liquid clustered or Z-Ordered on query filter keys for sub-second BI query response times.",
    "complexity": "Intermediate",
    "topics": [
      "databricks",
      "data-modeling"
    ],
    "tags": [
      "medallion-architecture",
      "bronze-silver-gold",
      "lakehouse",
      "scd-type-2",
      "data-quality",
      "data-cleansing"
    ],
    "codeSnippet": "# Silver pipeline: Reading from Bronze and performing idempotent MERGE upsert into Silver\nfrom delta.tables import DeltaTable\n\nsilver_table = DeltaTable.forPath(spark, \"/lakehouse/silver/customers\")\nbronze_updates = spark.readStream.table(\"bronze_customers\")\n\ndef upsert_to_silver(microBatchDF, batchId):\n    (silver_table.alias(\"t\")\n     .merge(microBatchDF.alias(\"s\"), \"t.customer_id = s.customer_id\")\n     .whenMatchedUpdateAll()\n     .whenNotMatchedInsertAll()\n     .execute())\n\nbronze_updates.writeStream.foreachBatch(upsert_to_silver).start()"
  }
];
