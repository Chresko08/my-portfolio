// Auto-generated module: pyspark
// Primary questions count: 11

export const pysparkQuestions = [
  {
    "id": "pyspark-architecture-driver-executors",
    "qNo": 50,
    "q": "Explain the Spark Architecture (Driver, Executors, Stages, and Tasks).",
    "a": "Apache Spark follows a master-slave architecture. \n\n**1. Driver (Master):** The brain of the application. It runs the `main()` function, converts your code into a logical and physical execution plan (DAG), and negotiates resources with the cluster manager (YARN/Kubernetes).\n**2. Cluster Manager:** Allocates resources (CPU/Memory) across the cluster.\n**3. Executors (Slaves):** Worker nodes that run the actual computations and store data in memory (cache/persist).\n\nWhen you submit a job, Spark breaks it down into:\n- **Jobs:** Triggered by an Action (e.g., `.count()`).\n- **Stages:** Created whenever there is a wide transformation (Shuffle). Data must move across the network.\n- **Tasks:** The smallest unit of work, executed by a core on an executor. One task processes one partition of data.",
    "complexity": "Basic",
    "topics": [
      "pyspark",
      "distributed-systems"
    ],
    "tags": [
      "spark-architecture",
      "driver",
      "executors",
      "dag",
      "tasks",
      "cluster-manager"
    ]
  },
  {
    "id": "pyspark-narrow-vs-wide-transformations",
    "qNo": 51,
    "q": "What is the difference between Narrow and Wide Transformations?",
    "a": "Transformations in Spark are lazy (they don't compute until an action is called). They are divided into two types based on data movement:\n\n**1. Narrow Transformations:** Data required to compute the records in a single partition reside in at most one partition of the parent dataset. No data is sent over the network (No Shuffle). \n*Examples:* `map()`, `filter()`, `withColumn()`.\n\n**2. Wide Transformations:** Data required to compute the records in a single partition may reside in many partitions of the parent dataset. This requires a **Shuffle** (moving data across the network between executors), which is expensive and slow.\n*Examples:* `groupBy()`, `join()`, `orderBy()`, `repartition()`.\n\nBecause wide transformations require a shuffle, they form the boundaries for Spark **Stages**.",
    "complexity": "Basic",
    "topics": [
      "pyspark"
    ],
    "tags": [
      "narrow-transformations",
      "wide-transformations",
      "shuffle",
      "stages",
      "lineage-graph"
    ]
  },
  {
    "id": "pyspark-repartition-vs-coalesce",
    "qNo": 52,
    "q": "What is the difference between repartition() and coalesce()?",
    "a": "Both are used to change the number of partitions in a DataFrame.\n\n**repartition(n):** Can increase or decrease partitions. It does a full data **shuffle** across the network to ensure data is evenly distributed. Used when you need balanced partitions for heavy downstream processing.\n\n**coalesce(n):** Can *only decrease* partitions. It avoids a full shuffle by safely moving data from one partition into an existing one on the same node (where possible). It is much faster but can result in unevenly sized partitions. Typically used right before writing data to disk to reduce the number of output files.",
    "complexity": "Basic",
    "topics": [
      "pyspark"
    ],
    "tags": [
      "repartition",
      "coalesce",
      "shuffle-optimization",
      "partitions",
      "file-sizing"
    ],
    "codeSnippet": "# repartition: Full shuffle across cluster, balances partition sizes\ndf_repart = df.repartition(200, \"user_id\")\n\n# coalesce: Merges existing partitions locally without full shuffle\ndf_coalesced = df.coalesce(10)"
  },
  {
    "id": "pyspark-catalyst-optimizer-phases",
    "qNo": 53,
    "q": "How does the Catalyst Optimizer work?",
    "a": "The Catalyst Optimizer is the core engine in Spark SQL and DataFrames that automatically optimizes your queries. It operates in 4 phases:\n\n1. **Analysis:** Resolves column names and table names against the Catalog (Metadata). (Yields a Resolved Logical Plan)\n2. **Logical Optimization:** Applies rule-based optimizations like *Predicate Pushdown* (filtering data as early as possible before joins/shuffles) and *Column Pruning* (dropping unused columns). (Yields an Optimized Logical Plan)\n3. **Physical Planning:** Uses Cost-Based Optimization (CBO) to generate multiple physical plans and selects the cheapest one (e.g., choosing a Broadcast Join over a Sort-Merge Join based on table size).\n4. **Code Generation:** Uses Tungsten to generate highly optimized Java bytecode for execution.",
    "complexity": "Intermediate",
    "topics": [
      "pyspark"
    ],
    "tags": [
      "catalyst-optimizer",
      "logical-plan",
      "physical-plan",
      "cost-based-optimizer",
      "code-generation"
    ]
  },
  {
    "id": "pyspark-broadcast-vs-shuffle-sort-merge-join",
    "qNo": 54,
    "q": "What are Broadcast Joins vs Shuffle Sort-Merge Joins?",
    "a": "**Broadcast Hash Join (BHJ):** Used when joining a massive table with a very small table (default < 10MB). Spark sends (broadcasts) the entire small table to every executor. This completely avoids a network shuffle of the large table, making it extremely fast.\n\n**Shuffle Sort-Merge Join (SMJ):** The default join for two large tables. Spark shuffles both tables across the network so that matching keys end up on the same executor, sorts them, and then merges them. It is highly robust for large data but very slow due to the network I/O.",
    "complexity": "Intermediate",
    "topics": [
      "pyspark"
    ],
    "tags": [
      "broadcast-hash-join",
      "sort-merge-join",
      "shuffle-avoidance",
      "joins",
      "threshold"
    ],
    "codeSnippet": "from pyspark.sql.functions import broadcast\n# Force BroadcastHashJoin on small lookup dimension (<10MB default, adjustable)\njoined_df = large_fact_df.join(broadcast(small_dim_df), \"dim_key\")"
  },
  {
    "id": "pyspark-adaptive-query-execution-aqe",
    "qNo": 55,
    "q": "What is Adaptive Query Execution (AQE)?",
    "a": "Introduced in Spark 3.0, AQE allows Spark to re-optimize query plans *at runtime* based on exact data statistics gathered during shuffles, rather than relying solely on static estimates. \n\nIt does 3 main things:\n1. **Dynamically coalesces shuffle partitions:** If Spark creates 200 partitions but many are tiny, AQE merges them to avoid the small-file/scheduling overhead.\n2. **Dynamically switches join strategies:** If a table gets heavily filtered during runtime and becomes small enough, AQE downgrades a slow Sort-Merge Join into a fast Broadcast Join.\n3. **Dynamically handles skew:** If AQE detects a heavily skewed partition during a join, it automatically splits the skewed partition into smaller sub-partitions.",
    "complexity": "Intermediate",
    "topics": [
      "pyspark",
      "databricks"
    ],
    "tags": [
      "aqe",
      "adaptive-query-execution",
      "runtime-reoptimization",
      "coalesce-shuffle",
      "join-strategy"
    ]
  },
  {
    "id": "pyspark-data-skew-salting-technique",
    "qNo": 57,
    "q": "What is Data Skew in Spark, and how do you fix it (Salting)?",
    "a": "Data Skew happens when data is unevenly distributed across partitions. During a shuffle (like a `groupBy` or `join`), one executor might receive 90% of the data while others get 10%. The entire stage waits for that single \"straggler\" task to finish, or it crashes with an OutOfMemory (OOM) error.\n\n**How to fix it (Salting):**\nSalting is a technique to artificially distribute the skewed key.\n1. **Add a random number (Salt):** Append a random integer (e.g., 1 to 10) to the skewed key in the large table (`key_1`, `key_2`).\n2. **Replicate the small table:** Explode the small table so it contains every possible salt variant of the key.\n3. **Join:** Now, the skewed key is broken into 10 smaller, evenly distributed keys, allowing Spark to process the join in parallel without OOMing.\n\n*(Note: If using Spark 3+, Adaptive Query Execution (AQE) can often handle data skew automatically if skew hints are enabled).*.",
    "complexity": "Complex",
    "topics": [
      "pyspark"
    ],
    "tags": [
      "data-skew",
      "salting",
      "skewed-keys",
      "stragglers",
      "random-salt"
    ],
    "codeSnippet": "from pyspark.sql.functions import concat, col, lit, rand, floor\n# Add random salt (0-9) to skewed large DataFrame\nsalted_df = large_df.withColumn(\"salt\", floor(rand() * 10)) \\\n                    .withColumn(\"salted_key\", concat(col(\"customer_id\"), lit(\"_\"), col(\"salt\")))"
  },
  {
    "id": "pyspark-driver-oom-troubleshooting",
    "qNo": 62,
    "q": "Deep Dive: You get an OutOfMemory (OOM) error on the Spark Driver. What causes it, and how do you fix it?",
    "a": "Driver OOMs are usually caused by bad coding practices that force massive amounts of data back to the master node, overwhelming its limited memory (e.g., 4GB-8GB).\n\n**Common Causes & Fixes:**\n1. **`df.collect()`:** This pulls the entire distributed DataFrame from all Executors directly into the Driver's RAM. *Fix:* Never use `collect()` on large datasets. Use `take()`, `show()`, or write directly to storage.\n2. **Massive Broadcast Joins:** If you explicitly broadcast a table that is larger than the Driver's memory limit (or `spark.sql.autoBroadcastJoinThreshold`), the Driver will OOM while trying to collect and broadcast the table. *Fix:* Disable broadcast join or increase driver memory.\n3. **Too many partitions / Large DAG:** If you have 100,000 partitions or an extremely complex lineage, the metadata the Driver tracks for task scheduling becomes so large it exhausts the JVM heap. *Fix:* Coalesce partitions, or truncate lineage by using `df.checkpoint()`.",
    "complexity": "Complex",
    "topics": [
      "pyspark",
      "distributed-systems"
    ],
    "tags": [
      "driver-oom",
      "collect",
      "broadcast-threshold",
      "troubleshooting",
      "memory-tuning"
    ]
  },
  {
    "id": "pyspark-executor-oom-shuffle-troubleshooting",
    "qNo": 63,
    "q": "Deep Dive: You get an OOM on a Spark Executor during a Shuffle (e.g., a massive GroupBy or Join). How do you troubleshoot?",
    "a": "Executor OOMs during a shuffle are primarily caused by **Data Skew** or insufficient memory per core.\n\n**Troubleshooting & Fixes:**\n1. **Identify Data Skew:** Look at the Spark UI's 'Tasks' tab. If 199 tasks finish in 5 seconds, and 1 task takes 20 minutes (or OOMs), you have skew. A single executor is choking on a massive partition (e.g., `null` values or a default 'Unknown' key). *Fix:* Filter out nulls, use Salting, or enable AQE Skew Join.\n2. **Memory per Core Ratio:** If an executor has 16GB RAM and 8 cores, each task only gets 2GB of RAM. If you are processing wide rows, they will OOM. *Fix:* Lower `spark.executor.cores` (e.g., to 4), effectively doubling the RAM available per task (4GB).\n3. **High Concurrency / Partition Size:** If partitions are too large, they won't fit in execution memory. *Fix:* Increase `spark.sql.shuffle.partitions` (default is 200) to e.g., 1000, ensuring each task processes a much smaller chunk of data.",
    "complexity": "Complex",
    "topics": [
      "pyspark",
      "distributed-systems"
    ],
    "tags": [
      "executor-oom",
      "shuffle-spill",
      "shuffle-partitions",
      "off-heap-memory",
      "memory-overhead"
    ]
  },
  {
    "id": "pyspark-unified-memory-management",
    "qNo": 64,
    "q": "Explain Spark's Unified Memory Management. What is the difference between Execution Memory and Storage Memory?",
    "a": "Spark's JVM heap is divided into distinct regions. The most critical is the Unified Memory region, which dynamically shares space between Execution and Storage.\n\n**Execution Memory:**\nUsed for short-lived data during computations (Shuffles, Joins, Sorts, Aggregations). If it runs out of space, it spills to the local disk, which severely impacts performance.\n\n**Storage Memory:**\nUsed for long-lived data that you explicitly cache/persist (e.g., `df.cache()`) or broadcast variables.\n\n**The Dynamic Boundary:**\nThey share a boundary. If Execution needs memory, it can evict cached blocks from Storage Memory (forcing them to disk or dropping them entirely). However, Storage Memory *cannot* evict Execution Memory, because dropping active computation data would crash the job. \n\n*5 YOE Insight:* If your Spark job is heavily caching DataFrames but suddenly starts running incredibly slowly during a complex join, it's because Execution memory stole the space and evicted your cache to disk.",
    "complexity": "Complex",
    "topics": [
      "pyspark"
    ],
    "tags": [
      "unified-memory",
      "execution-memory",
      "storage-memory",
      "eviction-policy",
      "memory-fraction"
    ]
  },
  {
    "id": "pyspark-aqe-dynamic-skew-join-handling",
    "qNo": 65,
    "q": "How does Adaptive Query Execution (AQE) dynamically handle Data Skew?",
    "a": "Data Skew occurs when one join key has millions of records while others have tens. Standard Spark maps the massive key to a single partition, crushing a single executor.\n\n**AQE Skew Join Optimization:**\nAQE inspects data statistics *at runtime* during the shuffle stage. If it detects a partition that is significantly larger than the median partition size (based on `spark.sql.adaptive.skewJoin.skewedPartitionFactor`), it intervenes:\n\n1. AQE dynamically splits the massive skewed partition into multiple smaller sub-partitions.\n2. It then replicates the corresponding matching key from the other table (the smaller table) to match these new sub-partitions.\n3. The join is then processed in parallel across multiple tasks, rather than bottlenecking on one executor. This entirely eliminates the need for manual 'Salting'.",
    "complexity": "Complex",
    "topics": [
      "pyspark",
      "databricks"
    ],
    "tags": [
      "aqe-skew-join",
      "dynamic-partition-splitting",
      "runtime-optimizations",
      "adaptive-query-execution"
    ]
  },
  {
    "id": "pyspark-scd-type-2-delta-merge-implementation",
    "qNo": 147,
    "q": "How do you implement SCD (Slowly Changing Dimension) Type 2 updates in PySpark? Walk through both pure PySpark DataFrame operations and Delta Lake's PySpark MERGE API.",
    "a": "Senior Data Engineering interviewers (e.g. Standard Chartered / Tech Mahindra) frequently evaluate candidates on whether they can write live **PySpark code** for SCD Type 2 rather than reverting to traditional SQL.\n\n### 1. Pure PySpark DataFrame Implementation (Non-Delta / Append-Only Lake)\nWhen working with plain Parquet or Hive tables, you cannot do in-place updates. You must reconstruct the dimension table via set operations:\n```python\nfrom pyspark.sql import functions as F\n\n# 1. Load active target dimension and incoming staging changes\ndim_df = spark.table(\"dim_customer\")\nstg_df = spark.table(\"stg_customer\") # e.g. customer_id, address, updated_at\n\n# 2. Identify active target records\nactive_dim = dim_df.filter(F.col(\"is_current\") == True)\n\n# 3. Join on business key and detect attribute changes\njoined = active_dim.alias(\"tgt\").join(\n    stg_df.alias(\"src\"),\n    on=\"customer_id\",\n    how=\"inner\"\n).filter(F.col(\"tgt.address\") != F.col(\"src.address\"))\n\n# 4. Expire previous versions: set is_current = False, end_date = now\nexpired_records = joined.select(\n    F.col(\"tgt.customer_id\"),\n    F.col(\"tgt.address\"),\n    F.col(\"tgt.start_date\"),\n    F.current_timestamp().alias(\"end_date\"),\n    F.lit(False).alias(\"is_current\")\n)\n\n# 5. Create new active versions for updated & brand new inserts\nnew_records = stg_df.select(\n    F.col(\"customer_id\"),\n    F.col(\"address\"),\n    F.current_timestamp().alias(\"start_date\"),\n    F.lit(None).cast(\"timestamp\").alias(\"end_date\"),\n    F.lit(True).alias(\"is_current\")\n)\n\n# 6. Unaffected unchanged records\nunchanged_records = dim_df.join(\n    stg_df.select(\"customer_id\"), on=\"customer_id\", how=\"left_anti\"\n)\n\n# 7. Final union & write back\nfinal_dim_df = unchanged_records.unionByName(expired_records).unionByName(new_records)\n```\n\n### 2. Delta Lake PySpark MERGE (Production Standard)\nDelta Lake eliminates complex multi-DataFrame reconstruction with an atomic, transactional `MERGE` in PySpark:\n```python\nfrom delta.tables import DeltaTable\n\ndelta_target = DeltaTable.forName(spark, \"dim_customer\")\n\n# Generate merge key: NULL for second stage to force INSERT of new version\nstg_with_keys = stg_df.selectExpr(\"customer_id as merge_key\", \"*\").unionByName(\n    stg_df.selectExpr(\"NULL as merge_key\", \"*\")\n)\n\ndelta_target.alias(\"target\").merge(\n    source=stg_with_keys.alias(\"source\"),\n    condition=\"target.customer_id = source.merge_key AND target.is_current = true\"\n).whenMatchedUpdate(\n    condition=\"target.address <> source.address\",\n    set={\"end_date\": \"current_timestamp()\", \"is_current\": \"false\"}\n).whenNotMatchedInsert(\n    values={\n        \"customer_id\": \"source.customer_id\",\n        \"address\": \"source.address\",\n        \"start_date\": \"current_timestamp()\",\n        \"end_date\": \"NULL\",\n        \"is_current\": \"true\"\n    }\n).execute()\n```",
    "complexity": "Intermediate",
    "topics": [
      "pyspark",
      "data-modeling",
      "databricks"
    ],
    "tags": [
      "scd-type-2",
      "pyspark-dataframe",
      "delta-merge",
      "left-anti-join",
      "dimensional-modeling"
    ],
    "codeSnippet": "delta_target.alias('target').merge(\n    source=stg_df.alias('source'),\n    condition='target.customer_id = source.customer_id AND target.is_current = true'\n).whenMatchedUpdate(\n    condition='target.address != source.address',\n    set={'end_date': 'current_timestamp()', 'is_current': 'false'}\n).whenNotMatchedInsert(\n    values={'customer_id': 'source.customer_id', 'is_current': 'true'}\n).execute()"
  },
  {
    "id": "pyspark-large-scale-join-optimization-500m-2b",
    "qNo": 154,
    "q": "How do you optimize a large-scale distributed join between a 500 Million record Client table and a 2 Billion record Payment table? Detail partitioning, Bucket Map Joins, key salting, and runtime pruning.",
    "a": "A high-stakes architectural question frequently evaluated in Principal and Lead Data Engineer technical loops.\n\n### 1. The Core Bottleneck: Shuffle & Disk Spilling\nJoining 500M rows with 2B rows via standard Sort-Merge Join (SMJ) requires shuffling 2.5 Billion rows across cluster network interfaces, creating severe I/O serialization, shuffle service bottlenecks, and executor OutOfMemory (OOM) failures.\n\n### 2. Architectural Optimization Strategies\n\n#### A. Pre-Bucketing & Bucket Map Join (BMJ) / Co-Partitioning\n- If both tables are stored in Hive/Iceberg/Delta Lake, pre-bucket both tables on `client_id` using an identical number of buckets (e.g. 512 buckets):\n  ```sql\n  CREATE TABLE clients (...) CLUSTERED BY (client_id) INTO 512 BUCKETS STORED AS PARQUET;\n  CREATE TABLE payments (...) CLUSTERED BY (client_id) INTO 512 BUCKETS STORED AS PARQUET;\n  ```\n- When joined, Spark detects co-partitioning and executes a **Bucket Map Join**: Executor $i$ joins bucket $i$ of `clients` with bucket $i$ of `payments` locally without **any network shuffle whatsoever**!\n\n#### B. Salting for Data Skew Mitigation\n- If a few enterprise clients (e.g. Amazon, Walmart) generate 100M payment records each, their hash partitions will bottleneck on a single core.\n- **Salting Implementation in PySpark:**\n  ```python\n  from pyspark.sql import functions as F\n\n  # 1. Salt the massive 2B Payments table with random integer (0 to 19)\n  SALT_FACTOR = 20\n  payments_salted = payments_df.withColumn(\n      'salt', F.floor(F.rand() * SALT_FACTOR)\n  ).withColumn(\n      'salted_key', F.concat_ws('_', F.col('client_id'), F.col('salt'))\n  )\n\n  # 2. Replicate the 500M Clients table across all 20 salt values using explode\n  clients_exploded = clients_df.withColumn(\n      'salt_array', F.array([F.lit(i) for i in range(SALT_FACTOR)])\n  ).withColumn(\n      'salt', F.explode('salt_array')\n  ).withColumn(\n      'salted_key', F.concat_ws('_', F.col('client_id'), F.col('salt'))\n  )\n\n  # 3. Join on the evenly distributed salted key\n  result_df = payments_salted.join(clients_exploded, on='salted_key', how='inner')\n  ```\n- In Spark 3+, enable **Adaptive Query Execution (AQE)** (`spark.sql.adaptive.skewJoin.enabled = true`), which automatically splits skewed shuffle partitions at runtime.\n\n#### C. Runtime Dynamic Partition Pruning (DPP) & Bloom Filters\n- Modern Lakehouse platforms (Databricks Photon, Apache Iceberg, Snowflake) generate dynamic Bloom filters from the filtered Client table. If you query payments for US clients, the Bloom filter prunes 90% of Parquet data files in the 2B Payment table before reading bytes from cloud storage (S3/GCS).\n\n#### D. Column Projection & Early Pushdown\n- Never execute `SELECT *`. Select only `client_id` and required aggregations (`SUM(amount)`). Push all date and transaction status filters before the join.",
    "complexity": "Complex",
    "topics": [
      "pyspark",
      "distributed-systems",
      "advanced-sql"
    ],
    "tags": [
      "large-scale-joins",
      "bucket-map-join",
      "salting",
      "skew-mitigation",
      "shuffle-tuning",
      "bloom-filter",
      "aqe"
    ],
    "codeSnippet": "-- PySpark Skew Salting:\npayments_salted = payments.withColumn('salt', floor(rand() * 20))\nclients_replicated = clients.withColumn('salt', explode(array([lit(i) for i in range(20)])))\njoined = payments_salted.join(clients_replicated, on=['client_id', 'salt'])"
  }
];
