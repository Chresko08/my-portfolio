// Auto-generated module: pubsubKafka
// Primary questions count: 5

export const pubsubKafkaQuestions = [
  {
    "id": "streaming-kafka-realtime-architecture-design",
    "qNo": 67,
    "q": "How would you design a real-time streaming system using Kafka?",
    "a": "A typical real-time architecture (Lambda or Kappa) involves:\n\n1. **Ingestion (Kafka):** Source systems (databases via CDC, application logs, IoT devices) publish events as messages to Kafka Topics. Kafka acts as a high-throughput, fault-tolerant message buffer.\n2. **Processing (Spark Structured Streaming / Flink):** Consumes messages from Kafka in real-time. Here we apply stateful transformations (e.g., tumbling windows), enrich the data by joining it with static dimension tables, and handle late-arriving data using Watermarks.\n3. **Storage (Data Lakehouse/NoSQL):** Processed streams are written to a low-latency NoSQL database (Cassandra/DynamoDB) for instant API serving, and simultaneously to a Delta Lake/Iceberg for historical batch analytics.\n4. **Serving:** Microservices or BI dashboards query the NoSQL/Lakehouse layer.",
    "complexity": "Intermediate",
    "topics": [
      "pubsub-kafka",
      "distributed-systems"
    ],
    "tags": [
      "kafka-architecture",
      "real-time-streaming",
      "broker-partitioning",
      "consumer-groups",
      "fault-tolerance",
      "offsets"
    ]
  },
  {
    "id": "streaming-cdc-change-data-capture-implementation",
    "qNo": 68,
    "q": "What is Change Data Capture (CDC) and how do you implement it?",
    "a": "CDC is a design pattern used to track and capture row-level changes (Inserts, Updates, Deletes) in a source database so they can be replicated downstream in near real-time.\n\n**How to implement it:**\nInstead of doing heavy daily `SELECT *` batch loads, we use a tool like **Debezium**. Debezium reads the database's internal transaction log (e.g., MySQL's `binlog` or PostgreSQL's `WAL`). \nEvery time a row changes, Debezium streams that exact change event to an Apache Kafka topic. Downstream pipelines (like Spark) consume these events to apply the exact UPSERT/DELETE operations to the Data Warehouse (using Delta Lake/Hudi), keeping systems perfectly in sync with minimal overhead.",
    "complexity": "Intermediate",
    "topics": [
      "pubsub-kafka",
      "distributed-systems",
      "data-modeling"
    ],
    "tags": [
      "cdc",
      "change-data-capture",
      "debezium",
      "wal-binlog",
      "event-driven-etl",
      "streaming"
    ]
  },
  {
    "id": "kafka-architecture-partitions-replicas-consumer-lag",
    "qNo": 139,
    "q": "Apache Kafka Internals Deep Dive: How do Topics, Partitions, In-Sync Replicas (ISR), Producer ACKs, Consumer Groups, and Consumer Lag monitoring work?",
    "a": "Apache Kafka is a distributed event streaming platform architected as a partitioned commit log, capable of handling trillions of events per day with sub-millisecond latencies.\n\n### 1. Topics, Partitions, and the Append-Only Log\n- A **Topic** is a logical category to which events are published.\n- A topic is physically split into multiple **Partitions** spread across the cluster brokers.\n- **Ordered Immutable Commit Log:** Within a single partition, messages are strictly ordered and assigned a sequential integer identifier called an **Offset**.\n- **Scale-Out Parallelism:** The partition is the unit of parallelism in Kafka. If a topic has 12 partitions, up to 12 consumers in a consumer group can read the topic concurrently in parallel.\n\n### 2. High Availability: Replicas & In-Sync Replicas (ISR)\nEach partition has one **Leader** replica and $N-1$ **Follower** replicas:\n- All producer writes and consumer reads go directly to the Leader.\n- Followers continuously fetch messages from the Leader to replicate data.\n- **In-Sync Replicas (ISR):** The subset of replicas that are fully caught up with the Leader (within `replica.lag.time.max.ms`).\n- If the Leader broker crashes, an active controller broker elects a new Leader exclusively from the ISR pool, guaranteeing zero data loss.\n\n### 3. Producer Durability: `acks` Configuration\n- **`acks=0`:** Producer does not wait for any acknowledgment. Blazing fast, but high risk of data loss.\n- **`acks=1`:** Producer waits for the Leader replica to write to its local log. If the Leader crashes before replicating to followers, data is lost.\n- **`acks=all` (or `-1`) + `min.insync.replicas=2`:** The gold standard for financial/mission-critical data. The Leader acknowledges write success only after the message is safely committed by all replicas currently in the ISR pool.\n\n### 4. Consumer Groups & Consumer Lag\n```\n[ Topic: Orders (3 Partitions) ]\n  Partition 0 (Current Offset: 50,000) ---> Consumer A (Committed: 50,000, Lag = 0)\n  Partition 1 (Current Offset: 42,000) ---> Consumer B (Committed: 32,000, Lag = 10,000)  <-- BOTTLENECK!\n  Partition 2 (Current Offset: 38,000) ---> Consumer C (Committed: 38,000, Lag = 0)\n```\n- **Consumer Group:** Multiple consumers cooperating under a shared `group.id`. Kafka assigns each partition exclusively to one consumer within the group.\n- **Consumer Lag:** The delta between the **Log End Offset (LEO)** (latest message written by producers) and the **Committed Offset** (last message processed by the consumer).\n- **Lag Monitoring:** Tools like **Burrow** or **Prometheus/Grafana** monitor lag. If Consumer B's lag is spiraling upwards, downstream pipelines are falling behind real-time SLAs, requiring scaling up the consumer group or optimizing consumer processing throughput.",
    "complexity": "Complex",
    "topics": [
      "pubsub-kafka",
      "distributed-systems"
    ],
    "tags": [
      "kafka-internals",
      "partition-assignment",
      "in-sync-replicas-isr",
      "producer-acks",
      "consumer-lag",
      "offset-commit"
    ],
    "codeSnippet": "# Producer configuration in Python (confluent-kafka) for maximum durability\nproducer_conf = {\n    'bootstrap.servers': 'kafka1:9092,kafka2:9092',\n    'acks': 'all',                      # Wait for full ISR commit\n    'enable.idempotence': True,         # Exactly-once producer semantics\n    'retries': 5,\n    'max.in.flight.requests.per.connection': 5\n}"
  },
  {
    "id": "pubsub-vs-kafka-architecture-and-tradeoffs",
    "qNo": 140,
    "q": "Compare Google Cloud Pub/Sub vs. Apache Kafka. What are the fundamental differences in their architecture, message ordering guarantees, consumer models, and operational overhead?",
    "a": "Both Google Cloud Pub/Sub and Apache Kafka are dominant enterprise message backbones, but they are built on fundamentally different architectural models.\n\n### 1. Fundamental Architectural Comparison\n\n| Dimension | Apache Kafka | Google Cloud Pub/Sub |\n| :--- | :--- | :--- |\n| **Model** | Partitioned Append-Only Distributed Log | Fully Managed Serverless Message Broker |\n| **Storage Unit** | Fixed physical partitions assigned to brokers | Dynamic global distributed storage |\n| **Scaling** | Manual or operator-driven partition & broker scaling | Fully automatic horizontal scaling (Zero ops) |\n| **Message Ordering**| Strictly guaranteed within a partition | Ordered if **Ordering Key** is specified; unordered by default |\n| **Consumption Model**| **Pull** (Dumb broker, smart consumer tracking offsets)| **Pull or Push** (Smart broker tracking individual message ACKs)|\n| **Message Retention**| Configurable time/size retention (can replay days of data)| Up to 7 days retention (can seek if enabled) |\n| **Billing** | Provisioned infrastructure (VMs, storage, network) | Pay-per-use based on throughput (GB ingested/read) |\n\n---\n\n### 2. Deep Dive: Message Consumption Models\n- **Kafka (The Smart Consumer):**\n  - Kafka brokers are lightweight: they append bytes to disk and serve byte ranges to consumers.\n  - The broker does *not* track whether individual messages succeeded. It simply records the consumer group's **Offset pointer**.\n  - A consumer can rewind its offset to re-read and reprocess the entire last week's worth of data.\n- **Pub/Sub (The Smart Broker):**\n  - Pub/Sub tracks **individual message acknowledgment (ACK)** states.\n  - If a consumer fails to ACK a specific message before `ack_deadline_seconds`, Pub/Sub redelivers that specific message.\n  - Supports **Push Subscriptions**: Pub/Sub can automatically deliver messages via HTTP POST webhooks to serverless endpoints like Cloud Functions or Cloud Run without running a persistent consumer daemon!\n\n### 3. Ordering Guarantees: Kafka Partitions vs. Pub/Sub Ordering Keys\n- In Kafka, ordering is guaranteed by assigning related messages to the same partition via a consistent hashing key (e.g., `key=customer_id`).\n- In Pub/Sub, messages are routed randomly across global workers for maximum throughput unless you explicitly set an **`Ordering Key`**. When an ordering key is enabled, Pub/Sub guarantees sequential delivery for all messages sharing that key until an ACK is received.",
    "complexity": "Intermediate",
    "topics": [
      "pubsub-kafka",
      "dataflow",
      "distributed-systems"
    ],
    "tags": [
      "google-pubsub",
      "kafka-comparison",
      "ordering-keys",
      "pull-vs-push",
      "dead-letter-topics",
      "serverless-messaging"
    ],
    "codeSnippet": "from google.cloud import pubsub_v1\n\n# Publishing with an Ordering Key in Google Cloud Pub/Sub\npublisher = pubsub_v1.PublisherClient(\n    publisher_options=pubsub_v1.types.PublisherOptions(enable_message_ordering=True)\n)\ntopic_path = publisher.topic_path(\"my-project\", \"orders-topic\")\n\nfuture = publisher.publish(\n    topic_path,\n    data=b'{\"order_id\": 101, \"status\": \"SUBMITTED\"}',\n    ordering_key=\"customer_101\" # Guarantees sequential delivery for this customer\n)"
  },
  {
    "id": "streaming-log-vs-query-cdc-debezium-wal-exactly-once",
    "qNo": 141,
    "q": "Change Data Capture (CDC) Deep Dive: Compare Log-Based CDC (Debezium, Write-Ahead Logs) vs. Query-Based CDC. How do you handle schema drift, delete events (tombstones), and lakehouse upserts?",
    "a": "Change Data Capture (CDC) is the process of identifying and capturing changes made to a source database (Inserts, Updates, Deletes) and delivering them in real-time to downstream lakes and warehouses.\n\n### 1. Log-Based vs. Query-Based CDC\n\n#### A. Query-Based CDC (Polling)\n- Queries the source database periodically using SQL:\n```sql\nSELECT * FROM orders WHERE updated_at > :last_sync_timestamp;\n```\n- **Fatal Flaws:**\n  1. **Cannot Detect Hard Deletes:** If a row is deleted (`DELETE FROM orders WHERE id=10`), the row no longer exists! Polling query cannot detect it.\n  2. **High Database Load:** Continuous polling adds CPU and read load to transactional databases.\n  3. **Missed Intermediate State:** If a record updates from 'Pending' to 'Shipped' to 'Delivered' within a 5-minute polling window, the intermediate states are completely lost.\n\n#### B. Log-Based CDC (Debezium & Transaction Logs)\n- Reads directly from the database's internal transaction log:\n  - MySQL: **Binary Log (binlog)**\n  - PostgreSQL: **Write-Ahead Log (WAL) / Logical Replication (pgoutput)**\n  - Oracle: **Redo Log**\n- **Advantages:**\n  1. **Captures 100% of Changes:** Captures every intermediate state and physical `DELETE`.\n  2. **Zero Query Overhead:** Does not execute SQL queries on the database engine.\n  3. **Low Latency:** Captures changes in near real-time (sub-second).\n\n### 2. Handling Deletes & Tombstones\nWhen a row is deleted in the source database, Debezium emits two messages to Kafka:\n1. A **Delete Event:** Contains the old row state before deletion (`\"op\": \"d\"`).\n2. A **Tombstone Event:** A message with the record key and a `null` payload. This instructs Kafka log compaction to physically remove the key from the topic log.\n- In downstream Lakehouse tables (Delta Lake / Iceberg), downstream consumers interpret `op='d'` to issue a `DELETE` command against the target table.\n\n### 3. Schema Drift & Downstream Lakehouse Upserts\nWhen an engineer alters a source column (`ALTER TABLE orders ADD COLUMN discount DOUBLE`), Debezium captures the schema change event via its Schema History Topic.\n- Downstream streaming pipelines (e.g. PySpark Structured Streaming or Databricks Delta Live Tables) enable **Schema Evolution**:\n```python\n# Writing Debezium stream to Delta Lake with automated schema evolution\n(streaming_df.writeStream\n    .format(\"delta\")\n    .option(\"checkpointLocation\", \"/checkpoints/orders\")\n    .option(\"mergeSchema\", \"true\") # Automatically adapts to new source columns!\n    .foreachBatch(upsert_cdc_into_delta)\n    .start())\n```",
    "complexity": "Complex",
    "topics": [
      "pubsub-kafka",
      "distributed-systems",
      "databricks"
    ],
    "tags": [
      "log-based-cdc",
      "query-based-cdc",
      "debezium",
      "binlog-wal",
      "schema-drift",
      "tombstone-events",
      "merge-upsert"
    ],
    "codeSnippet": "-- Sample Debezium JSON Envelope structure\n{\n  \"before\": { \"id\": 1, \"status\": \"PENDING\" },\n  \"after\":  { \"id\": 1, \"status\": \"APPROVED\" },\n  \"source\": { \"version\": \"2.4.0\", \"connector\": \"postgresql\", \"ts_ms\": 1696950000000 },\n  \"op\": \"u\", -- \"c\" = Create, \"u\" = Update, \"d\" = Delete, \"r\" = Read\n  \"ts_ms\": 1696950000500\n}"
  }
];
