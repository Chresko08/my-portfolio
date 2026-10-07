// Auto-generated module: hadoopHive
// Primary questions count: 6

export const hadoopHiveQuestions = [
  {
    "id": "hadoop-hdfs-architecture-namenode-datanode-ha",
    "qNo": 97,
    "q": "Explain the HDFS Master-Worker Architecture. How do NameNode, DataNodes, and Secondary NameNode interact, and how is High Availability (HA) achieved in production?",
    "a": "Hadoop Distributed File System (HDFS) is designed to reliably store multi-terabyte to petabyte datasets across commodity hardware clusters following a master/worker paradigm.\n\n### 1. Core Architectural Components\n- **NameNode (Master):**\n  - Manages the filesystem namespace (directory tree, file permissions) and maps file blocks to DataNodes.\n  - Keeps all metadata in RAM for ultra-fast lookups (approx. 150 bytes per object).\n  - Persists state to disk via two critical files:\n    - `fsimage`: Point-in-time snapshot of the filesystem metadata.\n    - `edits` (EditLog): Write-Ahead Log (WAL) recording every transaction (create, delete, rename) made since the last fsimage checkpoint.\n- **DataNodes (Workers):**\n  - Store actual data blocks (default size 128MB or 256MB) as physical files on their local Linux filesystems (ext4/xfs).\n  - Send periodic **Heartbeats** (every 3 seconds by default) and **Block Reports** (every 6 hours) to the NameNode confirming health and block allocations.\n- **Secondary NameNode (Cold Checkpoint Helper - NOT a failover master!):**\n  - Does *not* act as an automatic backup if the NameNode crashes.\n  - Periodically merges the active NameNode's `fsimage` with accumulated `edits` logs (checkpointing) to prevent the EditLog from growing uncontrollably, which would otherwise result in multi-hour restart times.\n\n### 2. High Availability (HA) Architecture\nIn modern production clusters, HDFS runs in HA mode with an **Active NameNode** and a **Standby NameNode**:\n```\n[ Client Requests ]\n         |\n         v\n+------------------+     JournalNodes (Quorum)     +-------------------+\n|  Active NameNode | ---> [ J1 ] [ J2 ] [ J3 ] <--- |  Standby NameNode |\n+------------------+                               +-------------------+\n         ^                                                   ^\n         |                    ZooKeeper                      |\n         +------------- [ ZKFailoverController ] -----------+\n```\n1. **Quorum Journal Manager (QJM):** Both NameNodes communicate through a group of lightweight daemons called **JournalNodes (JNs)**. When the Active logs an edit, it writes synchronously to a quorum ($N/2 + 1$) of JNs. The Standby continuously tails these JNs to keep its in-memory metadata in near real-time sync.\n2. **ZooKeeper & ZKFailoverController (ZKFC):** Each NameNode runs a ZKFC process. If the Active NameNode stops heartbeating to ZooKeeper, an election is triggered, fencing the old Active (via STONITH - \"Shoot The Other Node In The Head\") and promoting the Standby to Active with zero downtime.\n3. **DataNode Dual-Reporting:** All DataNodes are configured with the addresses of both NameNodes and stream block locations and heartbeats to both simultaneously.",
    "complexity": "Intermediate",
    "topics": [
      "hadoop-hive",
      "distributed-systems"
    ],
    "tags": [
      "hdfs",
      "namenode",
      "datanode",
      "journalnodes",
      "zookeeper-failover",
      "block-replication",
      "checkpointing"
    ],
    "codeSnippet": "<!-- hdfs-site.xml snippet for HDFS HA with QJM -->\n<property>\n  <name>dfs.nameservices</name>\n  <value>mycluster</value>\n</property>\n<property>\n  <name>dfs.ha.namenodes.mycluster</name>\n  <value>nn1,nn2</value>\n</property>\n<property>\n  <name>dfs.namenode.shared.edits.dir</name>\n  <value>qjournal://jn1:8485;jn2:8485;jn3:8485/mycluster</value>\n</property>"
  },
  {
    "id": "hadoop-hdfs-small-files-problem-mitigation",
    "qNo": 98,
    "q": "What is the HDFS \"Small Files Problem\"? Why does it degrade NameNode performance and Spark/MapReduce job execution, and how do you resolve it?",
    "a": "The \"Small Files Problem\" is one of the most common operational bottlenecks in Hadoop, Spark, and Data Lake ecosystems.\n\n### 1. Root Cause & Technical Impact\n- **NameNode RAM Exhaustion:** Every file, directory, and block in HDFS occupies ~150 bytes in the NameNode's JVM Heap. Storing 100 million 100MB files requires ~15GB RAM (well within limits). However, storing 100 million 10KB files still consumes 15GB of RAM to hold only ~1TB of actual data!\n- **Disk I/O and Network Seek Penalties:** HDFS is optimized for sequential streaming reads of large continuous blocks (128MB+). Reading millions of tiny files introduces massive random seek latency across DataNodes.\n- **Spark/MapReduce Execution Overhead:** Each HDFS block or file typically instantiates a separate Spark Partition / Map task. Launching thousands of tasks that each process 5KB results in the JVM startup, task scheduling, and metadata coordination time dwarfing actual data processing by 100x.\n\n### 2. Detection\n```bash\n# Analyze average file size in an HDFS directory\nhdfs dfs -count -q -h /warehouse/tablespace/external/hive/customer_events\n# If file count is in the thousands while total size is a few megabytes, you have a small files issue.\n```\n\n### 3. Mitigation Strategies\n1. **CombineFileInputFormat / Spark coalesce:**\n   In MapReduce, use `CombineFileInputFormat` to pack multiple small files into a single InputSplit. In PySpark, read the data and run `coalesce` before writing:\n```python\n# Compact thousands of tiny ingested files into 128MB chunks\ndf = spark.read.parquet(\"hdfs:///raw/streaming_events/year=2024/month=10/\")\ntarget_partitions = max(1, int(total_bytes / (128 * 1024 * 1024)))\ndf.coalesce(target_partitions).write.mode(\"overwrite\").parquet(\"hdfs:///processed/events_compacted/\")\n```\n2. **Hadoop Archives (HAR):**\n   `hadoop archive -archiveName events.har -p /raw/events /archives/events` packs directories into virtual archives, reducing NameNode metadata while allowing MapReduce access.\n3. **Hive / Delta Auto-Compaction:**\n   In Delta Lake, run `OPTIMIZE target_table` to pack small Parquet files into uniform 1GB target files.\n4. **Ingestion Layer Aggregation:**\n   Buffer small streaming messages in Kafka or Flume, writing micro-batches to object storage only once a target size threshold (e.g. 128MB) or time window (e.g. 15 minutes) is satisfied.",
    "complexity": "Intermediate",
    "topics": [
      "hadoop-hive",
      "pyspark",
      "databricks"
    ],
    "tags": [
      "small-files",
      "namenode-heap-memory",
      "combine-file-input-format",
      "har-archives",
      "file-compaction",
      "coalesce"
    ],
    "codeSnippet": "# Compact small files in PySpark\ndf = spark.read.parquet(\"hdfs:///raw/small_files/\")\n# Coalesce to target 128MB files\ndf.coalesce(10).write.mode(\"overwrite\").parquet(\"hdfs:///curated/compacted/\")"
  },
  {
    "id": "hive-execution-engines-mapreduce-vs-tez-vs-spark",
    "qNo": 99,
    "q": "Compare Hive execution engines: MapReduce vs. Apache Tez vs. Apache Spark. Why did Tez replace MapReduce as the default execution engine in Hive 2/3?",
    "a": "Hive translates SQL queries into distributed physical execution plans. Over the years, the backend execution engine evolved from classic MapReduce to DAG-based engines like Apache Tez and Spark.\n\n### 1. MapReduce Execution Model Bottlenecks\nMapReduce executes queries as rigid sequences of independent Map $\\rightarrow$ Shuffle $\\rightarrow$ Reduce steps.\n- **Hard Disk Barriers:** If a SQL query requires multiple joins or aggregations (e.g., `JOIN` followed by `GROUP BY`), MapReduce must split the query into multiple MR jobs:\n```\nMR Job 1: [Map] -> [Shuffle] -> [Reduce] -> Write intermediate result to HDFS\n                                                  |\nMR Job 2: [Map (Read from HDFS)] -> [Shuffle] -> [Reduce] -> Write final HDFS\n```\n- Every stage boundary writes data to physical HDFS disks with 3x replication, incurring staggering disk I/O, serialization, and network replication overhead.\n- Container spin-up and teardown latency for every intermediate job.\n\n### 2. Apache Tez: Generalized Dataflow DAGs\nApache Tez re-architected execution into an arbitrary **Directed Acyclic Graph (DAG)** of tasks:\n```\n[ Input A ] -> [ Map Task ]  \\\n                              -> [ Join Vertex ] -> [ Aggregation Vertex ] -> [ Output ]\n[ Input B ] -> [ Map Task ]  /\n```\n1. **In-Memory & Pipelined Shuffle:** Intermediate outputs between vertices are streamed through memory or fast local disk buffers without writing replicated files back to HDFS.\n2. **Container Reuse:** Tez reuses YARN containers across multiple vertices of the same query, eliminating JVM boot overhead.\n3. **Adaptive Physical Execution:** Tez dynamically inspects runtime vertex metrics. If intermediate data is smaller than estimated, it automatically collapses downstream reducers or converts a Sort-Merge Join into a Broadcast Join on the fly.\n\n### 3. Hive on Tez vs. Hive on Spark (LLAP)\n- **Tez with LLAP (Low Latency Analytical Processing):** Introduced in Hive 3, LLAP pairs Tez with persistent daemon processes running on cluster nodes. Daemons cache columnar data blocks (ORC format) and off-heap metadata in RAM, enabling sub-second query response times directly on HDFS.\n- **Spark:** While Hive on Spark existed, the industry predominantly moved to **Spark SQL** directly rather than running Hive-SQL-over-Spark, making **Hive on Tez + LLAP** the standard for enterprise on-premise data warehouses.",
    "complexity": "Intermediate",
    "topics": [
      "hadoop-hive",
      "distributed-systems"
    ],
    "tags": [
      "hive-on-tez",
      "mapreduce",
      "dag-execution",
      "pipelined-processing",
      "intermediate-shuffle-io",
      "llap"
    ],
    "codeSnippet": "-- Enabling Apache Tez in Hive session\nSET hive.execution.engine=tez;\nSET hive.vectorized.execution.enabled=true;\nSET hive.vectorized.execution.reduce.enabled=true;\nSET tez.queue.name=production;"
  },
  {
    "id": "hive-partitioning-vs-bucketing-join-optimization",
    "qNo": 100,
    "q": "What is the architectural difference between Partitioning and Bucketing in Hive? How do they impact physical directory layout and join strategies like Bucket Map Join and SMB Join?",
    "a": "Partitioning and Bucketing are complementary data organization techniques in Hive designed to prune data and optimize distributed joins.\n\n### 1. Partitioning (Coarse-Grained / Directory Level)\n- **Mechanism:** Creates physical subdirectories in HDFS based on distinct values of the partition column(s).\n- **Physical Layout:**\n```\n/warehouse/sales/country=US/year=2024/\n/warehouse/sales/country=IN/year=2024/\n```\n- **Best For:** Low-to-moderate cardinality columns that frequently appear in `WHERE` clauses (e.g. `date`, `country`, `department`).\n- **Danger (Over-partitioning):** Partitioning by high-cardinality columns (e.g. `user_id`, `timestamp`) creates millions of tiny directories and files, overwhelming the NameNode.\n\n### 2. Bucketing (Fine-Grained / File Level)\n- **Mechanism:** Divides data within a table (or within a partition) into a fixed number of physical files ($N$ buckets) using a hash function on the bucketing column:\n  $$\\text{Bucket ID} = \\text{hash}(column\\_value) \\pmod N$$\n- **Physical Layout:**\n```\n/warehouse/sales/country=US/\n    000000_0  (Bucket 0)\n    000001_0  (Bucket 1)\n    000002_0  (Bucket 2)\n```\n- **Best For:** High-cardinality columns (e.g., `user_id`) and columns frequently used in `JOIN` keys or `SAMPLE` queries.\n\n### 3. Join Optimization Enabled by Bucketing\nWhen joining two large tables on their bucketed column, Hive avoids expensive cluster-wide shuffles:\n1. **Bucket Map Join:**\n   - Both tables are bucketed on the join key, and one table's bucket count is an exact multiple of the other (e.g., Table A has 32 buckets, Table B has 16 buckets).\n   - Each mapper reads Bucket $i$ of Table A and matches it with Bucket $i$ of Table B without shuffling across the network.\n2. **Sort-Merge Bucket (SMB) Join:**\n   - Both tables are bucketed on the join key AND sorted by that key within each bucket (`CLUSTERED BY (user_id) SORTED BY (user_id) INTO 16 BUCKETS`).\n   - Mappers read the pre-sorted files sequentially and perform a merge join in linear time $O(M + N)$ with near-zero memory footprint and zero shuffle overhead!",
    "complexity": "Complex",
    "topics": [
      "hadoop-hive",
      "data-modeling",
      "pyspark"
    ],
    "tags": [
      "hive-partitioning",
      "hive-bucketing",
      "bucket-map-join",
      "smb-join",
      "cardinality",
      "hash-distribution"
    ],
    "codeSnippet": "-- Defining a partitioned and bucketed Hive table for SMB join\nCREATE TABLE user_transactions (\n    txn_id STRING,\n    amount DOUBLE,\n    txn_time TIMESTAMP\n)\nPARTITIONED BY (txn_date STRING)\nCLUSTERED BY (txn_id) SORTED BY (txn_id ASC) INTO 16 BUCKETS\nSTORED AS ORC;"
  },
  {
    "id": "hadoop-file-formats-parquet-orc-avro-delta",
    "qNo": 101,
    "q": "Comprehensive File Formats Deep Dive: Compare Apache Parquet, ORC, Apache Avro, and Delta Lake. What are their internal layouts, compression benefits, and ideal use cases?",
    "a": "Choosing the correct file format dictates storage footprint, network I/O, memory utilization, and query scan performance in big data ecosystems.\n\n### 1. Comparative Architecture Overview\n\n| Dimension | Apache Parquet | Apache ORC | Apache Avro | Delta Lake |\n| :--- | :--- | :--- | :--- | :--- |\n| **Storage Paradigm** | Columnar (Hybrid) | Columnar (Hybrid) | Row-based | ACID wrapper over Parquet |\n| **Best Engine** | Spark, Presto/Trino, Impala | Apache Hive, Tez, LLAP | Kafka, Event streams | Spark, Databricks, Trino |\n| **Primary Use Case** | OLAP Analytics, Datalake querying | Hadoop/Hive EDW | Ingestion, Message serialization | Lakehouse, ACID transactions |\n| **Splittable?** | Yes (at Row Group) | Yes (at Stripe) | Yes (Sync markers) | Yes (at Row Group) |\n| **Schema Evolution** | Supported (Additive) | Supported (ACID) | Exceptional (JSON Schema) | Full (ACID schema enforcement/evolution) |\n| **ACID / Time Travel**| No (read-only files) | Limited (Hive ACID) | No | Yes (via `_delta_log` metadata) |\n\n---\n\n### 2. Deep Dive: Row vs. Columnar Internal Mechanics\n\n#### A. Apache Avro (Row-Oriented)\n- **Internal Structure:** Stores data row-by-row sequentially. Preceded by a compact JSON schema header. Data blocks are separated by 16-byte random synchronization markers.\n- **Why it shines for Ingestion/Kafka:**\n  - Writing is an append operation ($O(1)$) with no need to buffer large blocks in memory.\n  - Serialization and deserialization are blazing fast.\n  - Schema evolution is first-class (Schema Registry safely handles adding/renaming fields).\n- **Why it fails for OLAP:** If a table has 200 columns and you run `SELECT avg(age) FROM users`, the engine must read every single byte of all 200 columns from disk into memory.\n\n#### B. Apache Parquet vs. Apache ORC (Columnar)\n- **Parquet Layout:** Divided into **Row Groups** (typically 128MB to 512MB). Inside each Row Group, data is partitioned into **Column Chunks**, further divided into **Data Pages** (typically 1MB).\n- **ORC Layout:** Divided into **Stripes** (typically 250MB). Contains Index Data (min/max/bloom filters per 10,000 rows), Row Data, and Stripe Footer.\n- **Key Performance Superpowers:**\n  1. **Projection Pushdown:** Scanning 3 columns out of 100 reads only 3% of the data volume from storage.\n  2. **Predicate Pushdown (Data Skipping):** Parquet Page Headers and ORC Indexes store column statistics (`min_value`, `max_value`, `null_count`). If a query filters `WHERE age > 65` and a page's max is 42, the engine skips reading the entire page or row group without decompressing it.\n  3. **High-Efficiency Encoding:** Consecutive column values of the same type leverage Run-Length Encoding (RLE), Dictionary Encoding, and Bit Packing before applying Snappy/ZSTD compression.\n\n#### C. Delta Lake (The Lakehouse Format)\n- Delta Lake is *not* a proprietary binary format; it stores data as standard **Snappy-compressed Parquet files** paired with a transactional metadata directory (`_delta_log/`).\n- It elevates Parquet from dumb storage files into a full ACID transaction engine with Snapshot Isolation, Time Travel, `MERGE` upserts, and file compaction (`OPTIMIZE`).",
    "complexity": "Complex",
    "topics": [
      "hadoop-hive",
      "pyspark",
      "databricks",
      "bigquery"
    ],
    "tags": [
      "file-formats",
      "parquet",
      "orc",
      "avro",
      "delta-lake",
      "row-vs-columnar",
      "predicate-pushdown",
      "compression",
      "snappy"
    ],
    "codeSnippet": "# Converting raw streaming Avro data into analytics-optimized Delta Lake\nraw_df = spark.read.format(\"avro\").load(\"/raw/kafka_dump/\")\n\n# Write as ACID Delta table partitioned by ingest date\nraw_df.write.format(\"delta\") \\\n    .partitionBy(\"event_date\") \\\n    .mode(\"append\") \\\n    .save(\"/lakehouse/silver/events/\")"
  },
  {
    "id": "hive-internal-managed-vs-external-tables-acid",
    "qNo": 102,
    "q": "What is the difference between Hive Managed (Internal) Tables and External Tables? How did Hive 3 ACID alter these definitions?",
    "a": "The distinction between Managed and External tables controls the lifecycle of metadata vs. the underlying raw data on storage.\n\n### 1. Traditional Hive Definitions (Hive 1 & 2)\n- **Managed Tables (`CREATE TABLE foo ...`):**\n  - Hive owns both the metadata (schema in MySQL/PostgreSQL Metastore) and the physical data files in HDFS (typically under `/user/hive/warehouse/dbname.db/tablename`).\n  - **Drop Semantics:** Dropping the table (`DROP TABLE foo`) deletes **BOTH** the schema definition in Metastore and the physical HDFS directory and all data files permanently.\n- **External Tables (`CREATE EXTERNAL TABLE foo ... LOCATION '/path'`):**\n  - Hive owns *only* the schema metadata. The storage path is managed outside of Hive.\n  - **Drop Semantics:** Dropping the table deletes only the schema metadata. The underlying files on HDFS/S3/GCS remain completely intact.\n  - **Production Rule:** Almost all production enterprise data lakes use **External Tables** to prevent accidental accidental data loss if a developer runs a drop script.\n\n### 2. Paradigm Shift in Hive 3 & Apache Ranger\nIn Hive 3, Managed tables were re-architected to support **Full ACID Transactions** (Insert, Update, Delete) and strict security isolation:\n1. **Exclusive Warehouse Directory:** Managed tables are restricted to a secured directory (`/warehouse/tablespace/managed/hive`) accessible only by the Hive service account. Users cannot bypass Hive to read or write files directly via HDFS or Spark.\n2. **ACID Requirement:** Hive 3 Managed tables are required to be ACID tables stored exclusively in ORC format. Updates and deletes create delta directories (`delta_0000001_0000001`) resolved via background compaction threads.\n3. **External Tables as the Data Lake Standard:** In Hive 3, any non-ACID table or table shared with external tools (Spark, Presto, Impala) is automatically classified as or converted to an **External Table**.",
    "complexity": "Basic",
    "topics": [
      "hadoop-hive",
      "data-governance"
    ],
    "tags": [
      "managed-tables",
      "external-tables",
      "metadata-drop-semantics",
      "hive-acid",
      "orc-transactional",
      "data-lakehouse"
    ],
    "codeSnippet": "-- External Table: Safe for shared production environments\nCREATE EXTERNAL TABLE ext_customer_orders (\n    order_id STRING,\n    customer_id STRING,\n    amount DOUBLE\n)\nSTORED AS PARQUET\nLOCATION '/data/lake/orders/';\n-- Dropping this table will NOT delete the Parquet files in /data/lake/orders/"
  }
];
