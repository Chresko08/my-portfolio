export const streamingNotes = [
  {
    id: "message-brokers",
    title: "Message Brokers (Kafka & Google Pub/Sub)",
    sections: [
      {
        id: "mb-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>Apache Kafka Internals:</strong>
              <ul>
                <li><span style='color:#6366f1'>Commit Log Architecture:</span> An append-only, immutable ordered sequence of records persisted to disk. Disk reads are sequential, matching raw memory sequential I/O speeds.</li>
                <li><span style='color:#6366f1'>Zero-Copy Optimization:</span> Kafka utilizes Linux's <code>sendfile()</code> system call to transfer byte buffers directly from the OS PageCache to the Network Socket NIC buffer, completely bypassing user-space JVM memory and eliminating GC pauses.</li>
                <li><span style='color:#6366f1'>Partition Anatomy:</span> Topics are subdivided into partitions. Each partition maps to a physical directory containing segment files (<code>.log</code>, <code>.index</code>, <code>.timeindex</code>). Segments roll over at 1GB (default).</li>
                <li><span style='color:#6366f1'>Replication & ISR:</span> Each partition has 1 Leader and $N-1$ Followers. Followers actively fetch from the leader. The <strong>In-Sync Replicas (ISR)</strong> list contains nodes that are caught up with the leader within <code>replica.lag.time.max.ms</code>.</li>
                <li><span style='color:#6366f1'>KRaft vs. ZooKeeper:</span> Modern Kafka (v3.3+) replaces ZooKeeper with <strong>KRaft (Kafka Raft Metadata mode)</strong>, running consensus natively within broker controller quorums to support millions of partitions without ZK metadata bottlenecks.</li>
              </ul>
            </li>
            <li><strong>Google Cloud Pub/Sub Internals:</strong>
              <ul>
                <li><span style='color:#6366f1'>Decoupled Architecture:</span> Topics and Subscriptions are independent entities. Publishers publish to topics; subscribers pull or receive pushes from subscriptions.</li>
                <li><span style='color:#6366f1'>Global Ingestion & Dynamic Sharding:</span> No manual partition sizing. Google dynamically provisions and splits message channels behind a global DNS endpoint based on incoming traffic volume.</li>
                <li><span style='color:#6366f1'>Acknowledgment Tracking:</span> Messages remain buffered until explicitly acknowledged (<code>ack</code>). Unacknowledged messages redeliver after the <code>ack_deadline</code> expires.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "mb-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Producer Semantics:</strong>
              <ul>
                <li><code>acks=0</code>: Fire and forget. Highest throughput, data loss risk.</li>
                <li><code>acks=1</code>: Leader writes locally and confirms. Data loss if leader crashes before replication.</li>
                <li><code>acks=-1</code> (or <code>all</code>): Confirmed only after all active ISR replicas write to log. Guarantees zero data loss when paired with <code>min.insync.replicas=2</code>.</li>
                <li><span style='color:#6366f1'>Idempotent Producer:</span> (<code>enable.idempotence=true</code>). Producer attaches a Producer ID (PID) and monotonically increasing Sequence Number to each batch, allowing brokers to deduplicate re-sent batches automatically.</li>
              </ul>
            </li>
            <li><strong>Consumer Groups & Rebalancing:</strong>
              <ul>
                <li>Consumer group instances coordinate partition ownership. Total active consumers per group cannot exceed partition count (excess consumers sit idle).</li>
                <li><em>Rebalance Protocols:</em> Eager Rebalance (stops all consumers) vs. <strong>Cooperative Sticky Rebalance</strong> (reassigns only affected partitions without pausing active streams).</li>
              </ul>
            </li>
            <li><strong>Log Compaction:</strong> Deletes older records with duplicate keys, retaining only the latest value per key. Enables using Kafka as a materialized key-value changelog table (e.g., CDC state).</li>
          </ul>
        `
      },
      {
        id: "mb-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Producer Throughput Maximization:</strong>
              <ul>
                <li><code>linger.ms=20</code>: Forces producer to wait up to 20ms before sending, allowing micro-batches to fill.</li>
                <li><code>batch.size=65536</code> (64KB): Increases batch memory buffer for network efficiency.</li>
                <li><code>compression.type=lz4</code> (or <code>zstd</code>): Highly CPU-efficient compression that shrinks network bandwidth and disk footprint by 60-80%.</li>
              </ul>
            </li>
            <li><strong>Consumer Lag Optimization:</strong> Monitor <code>records-lag-max</code>. If lag grows:
              <ul>
                <li>Increase partition count and scale consumer group pods 1:1 with partitions.</li>
                <li>Increase <code>max.poll.records</code> for batch processing, or delegate IO work to internal worker thread pools.</li>
                <li>Ensure <code>max.poll.interval.ms</code> is large enough to prevent the consumer coordinator from mistaking slow processing for a dead consumer.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "mb-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>Kafka vs. Google Pub/Sub Architectural Comparison:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Dimension</th><th>Apache Kafka</th><th>Google Cloud Pub/Sub</th></tr>
                <tr><td><strong>Model</strong></td><td>Partitioned commit log (Pull-based)</td><td>Decoupled publish/subscribe (Push & Pull)</td></tr>
                <tr><td><strong>Ordering</strong></td><td>Strictly ordered <em>within a partition</em></td><td>Global unordered by default; Ordered with Ordering Keys</td></tr>
                <tr><td><strong>Message Retention</strong></td><td>Retained after read up to retention threshold (days/forever)</td><td>Deleted from subscription once acknowledged (Ack)</td></tr>
                <tr><td><strong>Consumer Tracking</strong></td><td>Offset pointer maintained by consumer group in <code>__consumer_offsets</code></td><td>Per-message individual Ack state managed by GCP backend</td></tr>
                <tr><td><strong>Replayability</strong></td><td>Trivial: rewind offset to any timestamp or beginning</td><td>Requires explicit Seek feature or Cloud Storage backup</td></tr>
                <tr><td><strong>Operational Overhead</strong></td><td>High (Cluster sizing, partition planning, rebalancing)</td><td>Zero (Fully serverless, autoscaled by Google)</td></tr>
              </table>
            </li>
            <li><strong>Production Python Kafka Producer with Exactly-Once Semantics:</strong>
<pre><code>from confluent_kafka import Producer
import json

conf = {
    'bootstrap.servers': 'kafka1:9092,kafka2:9092',
    'client.id': 'order-ingestion-producer',
    # Exactly-Once / Lossless Configuration
    'acks': 'all',
    'enable.idempotence': True,
    'max.in.flight.requests.per.connection': 5,
    'retries': 1000000,
    'retry.backoff.ms': 100,
    # High-Throughput Batching
    'compression.type': 'lz4',
    'linger.ms': 20,
    'batch.size': 65536
}

producer = Producer(conf)

def delivery_callback(err, msg):
    if err:
        print(f"CRITICAL: Message delivery failed: {err}")
    else:
        # Delivered successfully to partition
        pass

def send_transaction(order):
    key = str(order['customer_id']).encode('utf-8')  # Ensures strict ordering per customer
    value = json.dumps(order).encode('utf-8')
    producer.produce(topic='prod.orders', key=key, value=value, on_delivery=delivery_callback)
    producer.poll(0)

# Flush on shutdown
producer.flush()</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "mb-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>The Auto-Commit Data Loss Anti-Pattern:</strong> Setting <code>enable.auto.commit=true</code> with <code>auto.commit.interval.ms=5000</code>. If the consumer fetches a batch, commits the offset at second 5, and crashes at second 6 before writing records to the database, those records are permanently lost. <em>Fix:</em> Set <code>enable.auto.commit=false</code> and commit offsets manually ONLY after downstream database writes complete.</li>
            <li><strong>Rebalance Storms:</strong> If a consumer takes longer to process a batch than <code>max.poll.interval.ms</code>, the broker assumes the consumer died and triggers a group rebalance. During the rebalance, all processing pauses. The consumer rejoins, picks up the work again, exceeds the timeout again, triggering an infinite rebalance loop. <em>Fix:</em> Decrease <code>max.poll.records</code> or increase <code>max.poll.interval.ms</code>.</li>
            <li><strong>Message Ordering Fallacy:</strong> Assuming Kafka guarantees total global ordering. Kafka guarantees ordering ONLY within a single partition. If messages for the same customer are published without a partition key, they hash randomly across partitions, arriving completely out-of-order downstream.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "stream-processing",
    title: "Stream Processing (Flink & Spark Streaming)",
    sections: [
      {
        id: "sp-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>True Streaming (Apache Flink) vs. Micro-Batching (Spark Structured Streaming):</strong>
              <ul>
                <li><span style='color:#6366f1'>Apache Flink (Pipelined Dataflow):</span> Processes records one-by-one with microsecond latency. Operators pass records through memory buffers continuously. State is a first-class citizen stored natively inside operator state backends.</li>
                <li><span style='color:#6366f1'>Spark Structured Streaming (Discretized Micro-Batching):</span> Discretizes the incoming stream into continuous micro-batches (e.g., every 100ms). Processes each micro-batch through the Catalyst optimizer and Tungsten execution engine. Lower latency limits (~50-100ms) but higher raw batch throughput.</li>
              </ul>
            </li>
            <li><strong>State Management Internals:</strong>
              <ul>
                <li><span style='color:#6366f1'>Heap / Memory State Backend:</span> Fast in-memory state; limited by JVM heap size and vulnerable to GC pauses.</li>
                <li><span style='color:#6366f1'>EmbeddedRocksDB State Backend:</span> Out-of-core embedded key-value store. State is stored on local SSDs in LSM-trees (Log-Structured Merge-trees). Can hold terabytes of state exceeding JVM memory with predictable GC behavior.</li>
              </ul>
            </li>
            <li><strong>Distributed Snapshotting (Chandy-Lamport Algorithm):</strong> Flink injects special <em>Checkpoint Barriers</em> into the data stream at sources. As barriers flow through operators in alignment, each operator asynchronously snapshots its state to durable storage (S3/GCS). Guarantees <strong>Exactly-Once Processing</strong> with minimal latency interruption.</li>
          </ul>
        `
      },
      {
        id: "sp-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Event Time vs. Processing Time vs. Ingestion Time:</strong>
              <ul>
                <li><span style='color:#6366f1'>Event Time:</span> The timestamp embedded inside the record payload when the event occurred on the client device. The only reliable metric for analytical correctness.</li>
                <li><span style='color:#6366f1'>Processing Time:</span> The wall-clock time of the server processing the record. Fast and simple, but nondeterministic (network lag distorts results).</li>
              </ul>
            </li>
            <li><strong>Watermarks:</strong> The clock mechanism for event-time progression. If an operator receives a watermark with timestamp $T$, it assumes no future events with $t \le T$ will arrive, allowing event-time windows up to $T$ to be finalized and evaluated.</li>
            <li><strong>Windowing Paradigms:</strong>
              <ul>
                <li><em>Tumbling Windows:</em> Fixed-size, non-overlapping time intervals (e.g., every 5 minutes: [00:00-00:05), [00:05-00:10)).</li>
                <li><em>Sliding Windows:</em> Fixed-size, overlapping intervals (e.g., 10-minute window sliding every 1 minute).</li>
                <li><em>Session Windows:</em> Dynamic intervals defined by periods of user inactivity (gap duration).</li>
              </ul>
            </li>
            <li><strong>End-to-End Exactly-Once Guarantees:</strong> Requires three coordinated components:
              <ul>
                <li>1. Replayable Source (e.g., Kafka offset rewind).</li>
                <li>2. Deterministic State Engine (e.g., Flink Checkpoints / Spark WAL).</li>
                <li>3. Transactional Sink (e.g., Two-Phase Commit <code>TwoPhaseCommitSinkFunction</code> or Idempotent Upserts).</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "sp-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>State Size Optimization:</strong> State grows indefinitely if unbounded aggregations are used. Always configure <strong>State Time-To-Live (State TTL)</strong>:
<pre><code>StateTtlConfig ttlConfig = StateTtlConfig
    .newBuilder(Time.days(7))
    .setUpdateType(StateTtlConfig.UpdateType.OnCreateAndWrite)
    .cleanupInRocksdbCompactFilter(1000)
    .build();</code></pre>
            </li>
            <li><strong>Unaligned Checkpoints:</strong> Under severe backpressure, checkpoint barriers get stuck in operator network buffers, causing checkpoints to time out. Enabling <em>Unaligned Checkpoints</em> allows barriers to overtake in-flight data buffers, guaranteeing snapshot completion under high load.</li>
            <li><strong>Tuning Spark Shuffle Partitions:</strong> In Structured Streaming, <code>spark.sql.shuffle.partitions</code> defaults to 200. For lightweight streams with low data volume, reduce this to match executor cores (e.g., 8-16) to eliminate task scheduling overhead.</li>
          </ul>
        `
      },
      {
        id: "sp-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>Apache Flink vs. Spark Structured Streaming:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Feature</th><th>Apache Flink</th><th>Spark Structured Streaming</th></tr>
                <tr><td><strong>Latency SLA</strong></td><td>Sub-10ms (Native stream)</td><td>50ms - 500ms (Micro-batch)</td></tr>
                <tr><td><strong>State Management</strong></td><td>Native RocksDB up to TBs of state; custom keyed state</td><td>StateStore provider (HDFSBacked/RocksDB); less granular API</td></tr>
                <tr><td><strong>Complex Windows</strong></td><td>Native Session/Global windows with custom Triggers/Evictors</td><td>Tumbling & Sliding native; Session requires flatMapGroupsWithState</td></tr>
                <tr><td><strong>Batch Unification</strong></td><td>Batch is a special case of streaming</td><td>Streaming is a series of tiny batches</td></tr>
                <tr><td><strong>Ecosystem</strong></td><td>Best with Kafka, Iceberg, Flink CDC</td><td>Best with Lakehouse (Delta Lake), MLlib, Hive</td></tr>
              </table>
            </li>
            <li><strong>Production PySpark Structured Streaming (Watermarked Window + Delta Lake Sink):</strong>
<pre><code>from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, window, expr
from pyspark.sql.types import StructType, StringType, DoubleType, TimestampType

spark = SparkSession.builder \\
    .appName("RealtimeRevenueAggregator") \\
    .config("spark.sql.streaming.checkpointLocation", "gs://lakehouse/checkpoints/revenue") \\
    .getOrCreate()

schema = StructType() \\
    .add("transaction_id", StringType()) \\
    .add("customer_id", StringType()) \\
    .add("amount", DoubleType()) \\
    .add("event_time", TimestampType())

# 1. Ingestion from Kafka
stream_df = spark.readStream \\
    .format("kafka") \\
    .option("kafka.bootstrap.servers", "kafka:9092") \\
    .option("subscribe", "transactions") \\
    .load() \\
    .select(from_json(col("value").cast("string"), schema).alias("data")) \\
    .select("data.*")

# 2. Stateful Windowing with 15-minute Watermark
windowed_revenue = stream_df \\
    .withWatermark("event_time", "15 minutes") \\
    .groupBy(
        window(col("event_time"), "10 minutes", "5 minutes"),
        col("customer_id")
    ) \\
    .agg({"amount": "sum"}) \\
    .withColumnRenamed("sum(amount)", "total_spend")

# 3. Exactly-once Output to Delta Lake
query = windowed_revenue.writeStream \\
    .format("delta") \\
    .outputMode("append") \\
    .option("checkpointLocation", "gs://lakehouse/checkpoints/revenue") \\
    .start("gs://lakehouse/gold/customer_revenue_windowed")

query.awaitTermination()</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "sp-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>The Idle Partition Watermark Stall:</strong> If a Kafka topic has 10 partitions, but partition 9 receives 0 events during off-peak hours, its local watermark never advances. Because the operator watermark is calculated as $\\min(\\text{watermark}_0, \\dots, \\text{watermark}_9)$, the entire application watermark freezes, causing downstream window triggers to stop firing permanently. <em>Fix:</em> Configure <code>WatermarkStrategy.withIdleness(Duration.ofMinutes(1))</code> in Flink to ignore idle channels.</li>
            <li><strong>State Leakage in Stream-Stream Joins:</strong> Joining two unbounded streams (e.g., Orders and Payments). If an order never receives a payment, the join state retains the order in memory forever. Without explicit watermarks and interval join constraints (e.g., <code>payment_time BETWEEN order_time AND order_time + INTERVAL 1 HOUR</code>), the state store will grow until the disk or RAM exhausts.</li>
            <li><strong>Divergent Source Clocks:</strong> Relying on system timestamps across distributed clients. If a mobile device's clock is set to year 2099, its events will emit future watermarks that advance the pipeline's watermark prematurely, causing all valid current events to be dropped as "late data".</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "databricks",
    title: "Databricks & Lakehouse Platform",
    sections: [
      {
        id: "db-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>The Lakehouse Foundation:</strong> Blends the low-cost, scalable open storage of data lakes (S3, ADLS, GCS) with the ACID transactions, data governance, and high performance of enterprise data warehouses.</li>
            <li><strong>Core Architectural Pillars:</strong>
              <ul>
                <li><span style='color:#6366f1'>Photon Vectorized Execution Engine:</span> Completely rewritten native execution engine written in <strong>C++</strong> that replaces the JVM execution layer under Spark. Processes records in columnar batches (vectors) directly utilizing modern CPU hardware SIMD (Single Instruction Multiple Data) registers, bypassing JVM object overhead and garbage collection entirely.</li>
                <li><span style='color:#6366f1'>Unity Catalog:</span> Centralized, cross-workspace governance layer using a unified 3-level namespace (<code>catalog.schema.table_or_view</code>). Enforces ANSI SQL permissions, automated column-level data lineage, row-level filtering, and dynamic column masking.</li>
                <li><span style='color:#6366f1'>Delta Lake Storage Layer:</span> Parquet file storage coupled with a deterministic JSON transaction log (<code>_delta_log</code>) enabling atomicity, isolation, and time-travel rollbacks.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "db-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>The Delta Transaction Log (<code>_delta_log</code>):</strong>
              <ul>
                <li>Every table change (insert, update, delete) commits an atomic JSON file (e.g., <code>000001.json</code>) detailing which Parquet data files were added and which were marked as removed (tombstoned).</li>
                <li><em>Checkpoints:</em> Every 10 commits, Delta collapses history into a compacted Parquet checkpoint file, allowing readers to reconstruct state with a single read.</li>
              </ul>
            </li>
            <li><strong>Liquid Clustering (Next-Gen Layout):</strong>
              <ul>
                <li>Replaces legacy Hive partitioning and Z-Ordering. Eliminates the need to choose rigid partition columns or schedule manual <code>OPTIMIZE ZORDER BY</code> jobs.</li>
                <li>Clusters data incrementally on multiple keys without data duplication, automatically adapting layout as query access patterns shift.</li>
              </ul>
            </li>
            <li><strong>Auto Loader (<code>cloudFiles</code>):</strong>
              <ul>
                <li>High-scale streaming file ingestion. In <em>File Notification Mode</em>, Auto Loader automatically provisions cloud messaging queues (AWS SQS/SNS or GCP PubSub) to detect newly landed files without listing multi-million object directories.</li>
                <li>Supports automatic <strong>Schema Evolution</strong>: Appends newly introduced columns to the Delta table seamlessly without pipeline downtime.</li>
              </ul>
            </li>
            <li><strong>Delta Live Tables (DLT):</strong> Declarative framework for building production ETL pipelines. Allows defining pipelines in SQL or Python with embedded data quality <em>Expectations</em> (e.g., <code>@dlt.expect_or_drop("valid_id", "id IS NOT NULL")</code>).</li>
          </ul>
        `
      },
      {
        id: "db-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Dynamic File Pruning (DFP):</strong> For star schema joins, Databricks generates a runtime bloom filter on the small dimension table and pushes it down to the storage scan of the massive Delta fact table, skipping 90% of file reads before the shuffle.</li>
            <li><strong>Small File Compaction:</strong>
              <ul>
                <li><code>OPTIMIZE table_name;</code>: Bin-packs thousands of small Parquet files generated by streaming or micro-batches into optimal ~1GB files.</li>
                <li><code>VACUUM table_name RETAIN 168 HOURS;</code>: Permanently deletes physical Parquet files marked as tombstoned older than the 7-day retention safety limit, reclaiming cloud storage costs.</li>
              </ul>
            </li>
            <li><strong>Cluster Sizing Strategy:</strong>
              <ul>
                <li>Never use <em>All-Purpose</em> clusters for production scheduled jobs (costs 3x more). Use <strong>Job Clusters</strong> that spin up on demand and terminate on job completion.</li>
                <li>Configure <em>Single-Node</em> clusters for lightweight staging jobs; enable <em>Autoscaling</em> with Spot instances for heavy ELT jobs.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "db-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>Table Layout Comparison:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Technique</th><th>Mechanics</th><th>Pros</th><th>Cons</th></tr>
                <tr><td><strong>Hive Partitioning</strong></td><td>Creates physical subdirectories (<code>/date=2026-01-01/</code>)</td><td>Excellent for coarse, low-cardinality filters</td><td>High risk of small files problem; rigid schema</td></tr>
                <tr><td><strong>Z-Ordering</strong></td><td>Multi-dimensional space-filling curve within files</td><td>Speeds up queries filtering on multiple high-cardinality keys</td><td>Requires expensive, manual <code>OPTIMIZE</code> compute runs</td></tr>
                <tr><td><strong>Liquid Clustering</strong></td><td>Dynamic, self-tuning incremental clustering</td><td>Flexible; low maintenance; zero partition planning</td><td>Requires modern Databricks runtime (DBR 13.3+)</td></tr>
              </table>
            </li>
            <li><strong>Production Medallion Pipeline with Auto Loader & Liquid Clustering:</strong>
<pre><code># Ingesting raw JSON into Bronze Delta table using Auto Loader
from pyspark.sql.functions import current_timestamp

bronze_stream = spark.readStream \\
    .format("cloudFiles") \\
    .option("cloudFiles.format", "json") \\
    .option("cloudFiles.schemaLocation", "s3://lakehouse-checkpoint/schema_bronze") \\
    .option("cloudFiles.useNotifications", "true") \\
    .load("s3://landing-zone/events/")

bronze_stream.writeStream \\
    .format("delta") \\
    .outputMode("append") \\
    .option("checkpointLocation", "s3://lakehouse-checkpoint/bronze_write") \\
    .table("bronze_events")

# Silver Layer: Merge CDC updates into Clustered Delta Table
spark.sql("""
    CREATE TABLE IF NOT EXISTS silver_users (
        user_id STRING,
        email STRING,
        country STRING,
        updated_at TIMESTAMP
    )
    USING DELTA
    CLUSTER BY (country, user_id); -- Liquid Clustering enabled
""")

# Idempotent CDC Merge
def merge_cdc(micro_batch_df, batch_id):
    micro_batch_df.createOrReplaceTempView("updates")
    micro_batch_df._jdf.sparkSession().sql("""
        MERGE INTO silver_users AS target
        USING updates AS source
        ON target.user_id = source.user_id
        WHEN MATCHED AND source.updated_at > target.updated_at THEN
            UPDATE SET *
        WHEN NOT MATCHED THEN
            INSERT *
    """)</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "db-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>The Zero-Retention VACUUM Disaster:</strong> Running <code>SET spark.databricks.delta.vacuum.parallelDelete.enabled = true; VACUUM table RETAIN 0 HOURS;</code> to save disk space. If a long-running concurrent query is reading a snapshot created 5 minutes ago, VACUUM deletes the files out from underneath the active reader, causing query crashes with <code>FileNotFoundException</code>. <em>Rule:</em> Never set VACUUM retention below 168 hours (7 days) in production.</li>
            <li><strong>Z-Ordering on Over 4 Columns:</strong> Z-Ordering efficiency degrades mathematically as dimensionality increases. Z-Ordering across 8 columns dilutes the space-filling curve, making file pruning no better than a full scan while costing enormous compute time to re-sort. <em>Rule:</em> Limit Z-Ordering to 1-3 high-frequency filter keys.</li>
            <li><strong>Reading Delta Tables as Raw Parquet:</strong> Pointing an external engine (e.g., standard Athena or Presto without Delta standalone) directly at the underlying Parquet files in S3. The engine reads ALL historical files, including tombstoned deleted rows and intermediate update files, returning completely corrupted, duplicated data. <em>Fix:</em> Always query via the Delta connector or Unity Catalog integration.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "distributed-systems",
    title: "Distributed Systems Concepts",
    sections: [
      {
        id: "dist-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>The CAP Theorem (Brewer's Theorem):</strong> In any asynchronous network subject to partitions ($P$), a distributed data store can guarantee at most two of the following properties simultaneously:
              <ul>
                <li><span style='color:#6366f1'>Consistency (C):</span> Every read receives the most recent write or an error (Linearizability).</li>
                <li><span style='color:#6366f1'>Availability (A):</span> Every non-failing node returns a non-error response for every request, without guarantee of latest data.</li>
                <li><span style='color:#6366f1'>Partition Tolerance (P):</span> The system continues to operate despite arbitrary dropped/delayed network messages between nodes.</li>
                <li><em>The Cloud Reality:</em> Network partitions are physical inevitabilities (switch failures, fiber cuts). Therefore, distributed databases MUST choose between <strong>CP</strong> (HBase, MongoDB, Bigtable) and <strong>AP</strong> (Cassandra, DynamoDB, CouchDB).</li>
              </ul>
            </li>
            <li><strong>The PACELC Theorem:</strong> Extends CAP by evaluating normal non-partitioned operation:
              <ul>
                <li>If there is a <strong>Partition (P)</strong>, trade off <strong>Availability (A)</strong> vs. <strong>Consistency (C)</strong>;</li>
                <li><strong>Else (E)</strong>, trade off <strong>Latency (L)</strong> vs. <strong>Consistency (C)</strong>.</li>
                <li><em>Examples:</em> DynamoDB is <strong>PA/EL</strong> (optimizes for availability and low latency); Bigtable is <strong>PC/EC</strong> (always enforces strict consistency, sacrificing latency and availability).</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "dist-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Consensus Protocols:</strong> Algorithms allowing nodes to agree on a shared state machine despite failures:
              <ul>
                <li><span style='color:#6366f1'>Paxos:</span> Two-phase consensus (Phase 1: Prepare/Promise; Phase 2: Accept/Accepted). Highly complex, mathematically proven.</li>
                <li><span style='color:#6366f1'>Raft:</span> Deconstructs consensus into explicit sub-problems: Leader Election (randomized election timers), Log Replication, and Safety. Used by etcd, CockroachDB, and Kafka KRaft.</li>
                <li><span style='color:#6366f1'>ZAB (ZooKeeper Atomic Broadcast):</span> High-performance leader-based broadcast protocol designed for primary-backup systems.</li>
              </ul>
            </li>
            <li><strong>Distributed Transactions:</strong>
              <ul>
                <li><span style='color:#6366f1'>Two-Phase Commit (2PC):</span> Phase 1 (Prepare): Coordinator asks participants if they can commit. Phase 2 (Commit): Coordinator issues commit. <em>Flaw:</em> Blocking protocol. If coordinator crashes during commit, participants remain locked indefinitely.</li>
                <li><span style='color:#6366f1'>Saga Pattern:</span> Decomposes a distributed transaction into a sequence of local transactions coordinated via events (Choreography) or an orchestrator (Orchestration). Each local step has a corresponding <em>Compensating Transaction</em> to undo changes if a downstream step fails.</li>
              </ul>
            </li>
            <li><strong>Quorum Math ($R + W > N$):</strong>
              <ul>
                <li>In a leaderless system with $N$ total replicas: $W$ = write quorum size, $R$ = read quorum size.</li>
                <li>If $R + W > N$, the read quorum and write quorum overlap by at least one replica, guaranteeing that reads will see the latest committed write (Strong Consistency).</li>
                <li>If $R + W \le N$, reads may hit replicas that missed the write, resulting in Eventual Consistency.</li>
              </ul>
            </li>
            <li><strong>Consistent Hashing:</strong> Maps both cluster nodes and data keys onto a circular hash ring ($0$ to $2^{32}-1$). Adding or removing a node requires remapping only $K/N$ keys on average (where $K$ is total keys, $N$ is nodes). <em>Virtual Nodes (vnodes):</em> Each physical node holds multiple tokens on the ring, preventing non-uniform data skew.</li>
          </ul>
        `
      },
      {
        id: "dist-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Anti-Entropy via Merkle Trees:</strong> In systems like Cassandra/DynamoDB, replicas maintain Merkle Trees (hierarchical binary hash trees of data blocks). Replicas compare root hashes; only mismatched tree branches are traversed and transferred over the network, minimizing synchronization bandwidth.</li>
            <li><strong>Sloppy Quorums & Hinted Handoff:</strong> If the designated replica nodes for a key are temporarily unreachable during network failure, the coordinator writes the record to an alternate healthy node with a "hint". Once the primary node recovers, the hint is handed off. Keeps writes available at the cost of transient read consistency.</li>
          </ul>
        `
      },
      {
        id: "dist-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>Consensus and Distributed Transaction Comparison:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Pattern</th><th>Coordination</th><th>Blocking?</th><th>Fault Tolerance</th><th>Typical Use Case</th></tr>
                <tr><td><strong>Two-Phase Commit (2PC)</strong></td><td>Central Coordinator</td><td>Yes (Single point of failure)</td><td>Zero tolerance for coordinator crash</td><td>Relational RDBMS XA transactions</td></tr>
                <tr><td><strong>Raft / Paxos</strong></td><td>Leader Election + Majority Quorum</td><td>No (Requires $\lfloor N/2 \rfloor + 1$ alive)</td><td>Tolerates $(N-1)/2$ node crashes</td><td>Distributed metadata, etcd, Kafka KRaft</td></tr>
                <tr><td><strong>Saga (Orchestration)</strong></td><td>Workflow Orchestrator (Temporal/Airflow)</td><td>No (Asynchronous eventual consistency)</td><td>High (Compensating actions reverse partial work)</td><td>Microservices e-commerce checkout</td></tr>
              </table>
            </li>
            <li><strong>Production Consistent Hashing Ring Implementation (Python):</strong>
<pre><code>import hashlib
import bisect

class ConsistentHashRing:
    def __init__(self, nodes=None, replicas=100):
        self.replicas = replicas  # Virtual nodes per physical server to eliminate data skew
        self.ring = []            # Sorted list of virtual node hash keys
        self.node_map = {}        # Maps hash key -> physical node string

        if nodes:
            for node in nodes:
                self.add_node(node)

    def _hash(self, key):
        return int(hashlib.md5(key.encode('utf-8')).hexdigest(), 16)

    def add_node(self, node):
        for i in range(self.replicas):
            vnode_key = f"{node}#vnode_{i}"
            val = self._hash(vnode_key)
            bisect.insort(self.ring, val)
            self.node_map[val] = node

    def remove_node(self, node):
        for i in range(self.replicas):
            vnode_key = f"{node}#vnode_{i}"
            val = self._hash(vnode_key)
            idx = bisect.bisect_left(self.ring, val)
            del self.ring[idx]
            del self.node_map[val]

    def get_node(self, key):
        if not self.ring:
            return None
        val = self._hash(key)
        idx = bisect.bisect_right(self.ring, val)
        if idx == len(self.ring):
            idx = 0  # Wrap around the circular ring
        return self.node_map[self.ring[idx]]</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "dist-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>Split-Brain Syndrome:</strong> When a network partition divides a cluster into two isolated sub-clusters, and both sides elect a new leader and accept concurrent writes. Once the partition heals, data is fatally corrupted. <em>Mitigation:</em> Leaders must require a strict majority quorum ($\lfloor N/2 \rfloor + 1$) to operate, and use <strong>Fencing Tokens</strong> (monotonically increasing generation numbers) to reject writes from deposed old leaders.</li>
            <li><strong>Clock Drift & NTP Inaccuracy:</strong> Assuming physical server timestamps can be used to order events across servers. NTP (Network Time Protocol) adjustments can cause server clocks to tick backward or drift by hundreds of milliseconds. Relying on wall-clock time for Last-Write-Wins (LWW) leads to silent data loss. <em>Fix:</em> Use <strong>Lamport Timestamps</strong>, <strong>Vector Clocks</strong>, or Google's hardware-backed <strong>TrueTime API</strong> (GPS + Atomic clocks in Spanner).</li>
            <li><strong>The Fallacies of Distributed Computing:</strong> Assuming the network is reliable, latency is zero, bandwidth is infinite, and topology doesn't change. Designing systems without timeouts, exponential backoff, and circuit breakers causes catastrophic cascade outages.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "system-design",
    title: "System Design & Design Patterns",
    sections: [
      {
        id: "sd-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>Lambda vs. Kappa vs. Data Mesh Architectures:</strong>
              <ul>
                <li><span style='color:#6366f1'>Lambda Architecture:</span> Splits data ingestion into a Batch Layer (Hadoop/Spark, accurate historical source of truth) and a Speed Layer (Storm/Flink, low-latency delta approximation), combined at query time in the Serving Layer. <em>Flaw:</em> Dual codebase tax (maintaining identical logic in SQL and Java/Scala).</li>
                <li><span style='color:#6366f1'>Kappa Architecture:</span> Eliminates the batch layer entirely. <strong>Everything is a stream.</strong> The append-only log (Kafka) is the permanent source of truth. Reprocessing historical data simply means rewinding the streaming engine's consumer offset to the beginning of time.</li>
                <li><span style='color:#6366f1'>Data Mesh:</span> Organizational & technical shift away from monolithic centralized data lakes. Decentralizes ownership into <strong>Domain-Oriented Data Products</strong> governed by federated computational policies and self-serve data infrastructure platforms.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "sd-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Data Contracts:</strong> A formalized, version-controlled schema agreement (YAML/Protobuf) between upstream software engineering microservices and downstream data platforms. Enforced in software CI/CD pipelines to block breaking DDL migrations before production deployment.</li>
            <li><strong>Change Data Capture (CDC):</strong> Extracts row-level mutations directly from database transaction logs (MySQL binlog, PostgreSQL WAL) via Debezium, publishing event streams to Kafka with zero query load on operational databases.</li>
            <li><strong>Feature Store Architecture:</strong> Solves training-serving skew in Machine Learning:
              <ul>
                <li><em>Online Store (Redis, DynamoDB):</em> Low-latency (<10ms) key-value lookup for real-time model inference.</li>
                <li><em>Offline Store (Delta Lake, Snowflake):</em> High-throughput historical scans supporting <strong>Point-in-Time Correctness (As-Of Joins)</strong> to prevent data leakage during offline model training.</li>
              </ul>
            </li>
            <li><strong>Resilience Patterns:</strong>
              <ul>
                <li><em>Circuit Breaker:</em> Temporarily blocks calls to an overloaded downstream dependency once error thresholds are breached, preventing cascading cluster collapse.</li>
                <li><em>Dead Letter Queue (DLQ):</em> Diverts unparseable/malformed records into a quarantine bucket for asynchronous inspection without blocking pipeline throughput.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "sd-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>The Real-Time Serving Layer Pattern:</strong> Pointing customer-facing analytics dashboards directly at a Cloud Data Warehouse (BigQuery, Snowflake) is a massive anti-pattern due to query latency (1-5s) and astronomical concurrency costs.
              <ul>
                <li><em>Solution:</em> Ingest aggregate data into specialized Real-Time OLAP databases like <strong>ClickHouse</strong>, <strong>Apache Pinot</strong>, or <strong>StarRocks</strong>. Pair with a <strong>Redis</strong> caching layer for top-level query results to achieve sub-50ms latency across 50,000+ concurrent dashboard users.</li>
              </ul>
            </li>
            <li><strong>Pre-Aggregation with dbt:</strong> Pre-compute expensive multi-table joins and high-cardinality rollups during batch ingestion into hourly and daily summary mart tables.</li>
          </ul>
        `
      },
      {
        id: "sd-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>Architecture Paradigm Tradeoffs:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Architecture</th><th>Latency</th><th>Codebase Complexity</th><th>Reprocessing Strategy</th><th>Best Use Case</th></tr>
                <tr><td><strong>Lambda</strong></td><td>Sub-second (Speed) + High (Batch)</td><td>High (Duplicate logic across two engines)</td><td>Batch layer recomputes full history daily</td><td>Legacy architectures with complex ML batch transforms</td></tr>
                <tr><td><strong>Kappa</strong></td><td>Sub-second throughout</td><td>Low (Single streaming codebase)</td><td>Rewind stream offset to re-stream data</td><td>Modern real-time analytics & event-driven platforms</td></tr>
                <tr><td><strong>Data Mesh</strong></td><td>Decentralized by domain</td><td>Domain-specific ownership</td><td>Domain teams manage independent product lifecycles</td><td>Large enterprises with 50+ data engineers across domains</td></tr>
              </table>
            </li>
            <li><strong>Full System Design: Real-Time Fraud Detection System (50,000 tx/sec, &lt;50ms SLA):</strong>
              <br/>
              <pre><code>[Client Apps] &rarr; [API Gateway] 
                     &darr;
             [Apache Kafka] (Partitioned by user_id)
                     &darr;
             [Apache Flink Stream Processor]
              &harr; [Online Feature Store: Redis] (Hydrate 5-min spend, IP risk in &lt;5ms)
              &rarr; [ML Scoring Engine: Triton/SageMaker] (gRPC call to Fraud Model &lt;15ms)
                     &darr;
           --------------------------------------------------
           &darr; (&gt;0.85 Score)                        &darr; (&le;0.85 Score)
    [Kafka: Block_Events]                  [Kafka: Approved_Events]
           &darr;                                      &darr;
   [Payment Gateway Block]                [Kafka Connect &rarr; Delta Lake (Bronze &rarr; Silver)]
                                                  &darr;
                                          [Offline Retraining & Analytics]</code></pre>
            </li>
            <li><strong>Production Data Contract Specification (YAML):</strong>
<pre><code>dataContractSpecification: 0.9.2
id: urn:datacontract:checkout:order_placed
info:
  title: Order Placed Event Contract
  version: 2.1.0
  owner: checkout-core-team@company.com
models:
  order_placed:
    description: Emitted whenever a consumer completes payment
    type: table
    fields:
      order_id:
        type: string
        format: uuid
        required: true
        unique: true
      customer_id:
        type: string
        required: true
      amount_usd:
        type: number
        minimum: 0.01
      event_timestamp:
        type: timestamp
        required: true
serviceLevelAgreement:
  freshness: 60s
  availability: 99.99%</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "sd-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>Data Leakage in ML Feature Stores:</strong> Joining an event that occurred at time $T_1$ with a feature calculated at $T_2$ (where $T_2 > T_1$). The model "cheats" by looking into future data during training, achieving 99% accuracy in tests but failing completely in live production. <em>Mitigation:</em> The Feature Store MUST implement <strong>Point-in-Time Correctness (As-Of Joins)</strong>.</li>
            <li><strong>Non-Idempotent Consumer Sinks:</strong> Designing a streaming consumer that uses standard <code>INSERT</code> statements into a relational database. If the consumer crashes after writing but before committing the Kafka offset, upon restart it will re-consume the batch and insert duplicate records. <em>Mitigation:</em> Use idempotent <code>UPSERT</code> / <code>MERGE</code> on a unique idempotency key, or use a Two-Phase Commit transactional sink.</li>
            <li><strong>Over-Engineering with Real-Time Streaming:</strong> Proposing a complex Flink + Kafka real-time streaming pipeline for business metrics that are reviewed by human executives once a week on Monday morning. Real-time streaming introduces 5x operational complexity and state maintenance costs. When a 15-minute or daily batch ETL in BigQuery/Snowflake satisfies the business SLA, batch is always the superior architectural choice.</li>
          </ul>
        `
      }
    ]
  }
];
