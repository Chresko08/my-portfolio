// Auto-generated module: distributedSystems
// Primary questions count: 8

export const distributedSystemsQuestions = [
  {
    "id": "dist-cap-theorem-distributed-systems",
    "qNo": 66,
    "q": "Explain CAP theorem and its relevance in distributed data systems.",
    "a": "The CAP theorem states that a distributed system can only guarantee two out of the following three properties simultaneously:\n\n1. **Consistency (C):** Every read receives the most recent write or an error. (All nodes see the same data).\n2. **Availability (A):** Every request receives a non-error response, without guaranteeing it contains the most recent write.\n3. **Partition Tolerance (P):** The system continues to operate despite network failures dropping messages between nodes.\n\n**Relevance:** Because network partitions (P) are inevitable in the cloud, databases must choose between C and A.\n- **CP Systems (HBase, MongoDB):** If a node fails, they shut down access to prevent reading stale data. Good for financial ledgers.\n- **AP Systems (Cassandra, DynamoDB):** If a node fails, they keep serving reads, even if the data might be slightly outdated (Eventual Consistency). Good for social media feeds or shopping carts.",
    "complexity": "Basic",
    "topics": [
      "distributed-systems"
    ],
    "tags": [
      "cap-theorem",
      "pacelc",
      "consistency",
      "availability",
      "partition-tolerance",
      "cp-vs-ap"
    ]
  },
  {
    "id": "dist-realtime-fraud-detection-pipeline",
    "qNo": 79,
    "q": "Design a real-time fraud detection pipeline for a global payment processor (e.g., Stripe/Visa). It processes 50,000 transactions/sec, must evaluate ML models and block fraud in <50ms, and simultaneously sync data to a warehouse for offline training.",
    "a": "This requires a highly decoupled, real-time event-driven architecture (Kappa or Lambda pattern) to handle the massive throughput and sub-50ms SLA.\n\n### 1. Ingestion Layer\n- **API Gateway -> Apache Kafka:** Incoming transactions hit the gateway and are published to a Kafka topic. \n- **Partitioning Strategy:** Partition by `Merchant_ID` or `User_ID` to ensure strict ordering of events per user and enable massive parallel consumption.\n\n### 2. Stream Processing (The 50ms SLA)\n- **Engine:** Use **Apache Flink** rather than Spark Streaming. Flink offers true event-by-event processing (microsecond latency) with advanced state management, whereas Spark uses micro-batching which struggles with strict sub-50ms SLAs.\n- **Feature Hydration:** Flink reads the raw transaction and queries a **Low-Latency Feature Store (Redis / ScyllaDB)** to pull historical aggregates (e.g., 'total spending in last 5 minutes', 'IP address risk score'). \n- **Inference:** Flink bundles the raw data and historical features, making a gRPC call to a served ML Model (e.g., via NVIDIA Triton or AWS SageMaker). Based on the score, Flink publishes a 'Block' or 'Allow' event to a downstream Kafka topic.\n\n### 3. State Management & Checkpointing\n- Flink maintains internal state (e.g., tumbling windows for 5-minute aggregates) using the **RocksDB State Backend**. It periodically checkpoints this state to S3/ADLS to ensure **Exactly-Once Processing** in case a worker node crashes.\n\n### 4. Offline Sync & Retraining\n- **Kafka Connect:** A sink connector asynchronously dumps the raw Kafka streams into an object store (S3) in Parquet format, orchestrated into an **Apache Iceberg or Delta Lake** table.\n- **Batch Jobs:** Daily Spark/dbt jobs compute complex features (e.g., '30-day average transaction value') and bulk-upsert them back into the Redis Feature Store for tomorrow's real-time inference.",
    "complexity": "Complex",
    "topics": [
      "distributed-systems",
      "pubsub-kafka",
      "dataflow"
    ],
    "tags": [
      "fraud-detection",
      "real-time-streaming",
      "sliding-windows",
      "redis-caching",
      "system-design",
      "feature-lookup"
    ]
  },
  {
    "id": "dist-ml-feature-store-architecture",
    "qNo": 80,
    "q": "Design a Machine Learning Feature Store platform (like Uber's Michelangelo). It must serve real-time features for inference at <10ms, while ensuring 'Point-in-Time Correctness' for offline model training to prevent data leakage.",
    "a": "A Feature Store abstracts feature engineering from model deployment, providing a unified access layer for both training (offline) and inference (online).\n\n### 1. Dual-Storage Architecture\n- **Online Store (Redis / DynamoDB):** Optimized for low-latency row lookups by a primary key (e.g., `user_id = 123`). It stores *only the latest* feature values.\n- **Offline Store (Snowflake / Delta Lake):** Optimized for high-throughput batch scans. It acts as an append-only log, storing every historical change to a feature alongside a timestamp.\n\n### 2. Pipeline Design\n- **Batch Features:** Airflow schedules Spark jobs to compute heavy metrics (e.g., 'total rides last week'). It writes to the Offline Store, and a synchronization job (or reverse ETL) pushes the latest state to the Online Store.\n- **Streaming Features:** Flink consumes a Kafka event stream, calculates real-time windows (e.g., 'rides in last 5 mins'), and **dual-writes**: it updates the Online Store for instant serving and appends to the Offline Store for auditability.\n\n### 3. Solving Data Leakage (Point-in-Time Correctness)\n- **The Problem:** If a data scientist generates a training dataset for an event that happened at `t1`, but joins it with a feature value that was computed at `t2` (where `t2 > t1`), the model 'cheats' by looking into the future. This ruins production performance.\n- **The Solution:** The Feature Store API must perform an **AS OF Join** (Time-Travel Join). When constructing the training set, the offline store joins the label data with the feature data exactly as it existed immediately prior to the event timestamp, ignoring all newer rows.",
    "complexity": "Complex",
    "topics": [
      "distributed-systems",
      "data-modeling",
      "databricks"
    ],
    "tags": [
      "feature-store",
      "point-in-time-correctness",
      "online-offline-store",
      "ml-pipelines",
      "feast",
      "feature-lineage"
    ]
  },
  {
    "id": "dist-enterprise-rag-pipeline-design",
    "qNo": 81,
    "q": "Design an Enterprise RAG (Retrieval-Augmented Generation) pipeline that ingests 10 million unstructured PDFs daily into a Vector Database to power a chatbot. How do you handle document updates, deletions, and embedding model versioning?",
    "a": "This is a specialized ELT pipeline designed for semantic search, heavily utilizing distributed processing to handle the massive compute required for embeddings.\n\n### 1. Ingestion & Change Data Tracking\n- **Event Triggers:** S3 object creation events or Confluence webhooks trigger an Airflow DAG or Kafka topic.\n- **Metadata State Table:** You must maintain a relational table (PostgreSQL) tracking `document_id`, `file_hash`, and `processing_status`. If a file is uploaded but its hash hasn't changed, the pipeline skips it, saving massive API costs.\n\n### 2. Processing (Chunking & Embedding)\n- **Engine:** Apache Spark (Databricks) or Ray.\n- **Chunking:** Unstructured text is extracted (via OCR/PyPDF) and split into semantic chunks (e.g., 512 tokens with a 50-token overlap). Overlaps prevent sentences from being cut in half, losing context.\n- **Embedding Generation:** Spark UDFs distribute API calls to the embedding model (e.g., OpenAI `text-embedding-3`). You must implement robust rate-limiting and exponential backoff to avoid HTTP 429 (Too Many Requests) errors.\n\n### 3. Managing Vector Database State (The 5 YOE Differentiator)\n- **Updates/Deletes:** Unlike relational databases, you cannot easily 'upsert' chunks if the chunk boundaries changed. If a PDF is updated, the pipeline must explicitly execute a `DELETE` query in the Vector DB (e.g., Milvus, Pinecone) using the metadata tag `document_id`, and then `INSERT` the newly generated chunks.\n- **Model Versioning:** If you upgrade your embedding model from v1 to v2, the dimensionality (e.g., 768 to 1536) and vector space completely change. You cannot mix them. You must create a *new collection* in the Vector DB, run a backfill batch job to re-embed all 10 million documents with v2, and then atomically hot-swap the chatbot's routing to the new collection.",
    "complexity": "Complex",
    "topics": [
      "distributed-systems",
      "python"
    ],
    "tags": [
      "rag-pipeline",
      "vector-databases",
      "chunking-strategies",
      "embeddings",
      "hybrid-search",
      "reranking"
    ]
  },
  {
    "id": "dist-monolithic-mysql-scaling-cdc-sharding",
    "qNo": 82,
    "q": "You have a monolithic MySQL database handling millions of e-commerce orders. Complex analytical queries are degrading production performance. Design a real-time CDC pipeline to replicate this to a Lakehouse. How do you handle schema evolution and deduplication?",
    "a": "A Change Data Capture (CDC) architecture decouples the analytical workload from the operational database with zero performance penalty.\n\n### 1. CDC Extraction\n- Deploy **Debezium**, which reads directly from MySQL's write-ahead log (`binlog`). Unlike JDBC polling (which executes `SELECT` statements and strains the DB), reading the binlog is virtually free. \n- Debezium translates every `INSERT`, `UPDATE`, and `DELETE` into an event payload and publishes it to Apache Kafka.\n\n### 2. Schema Evolution\n- Implement a **Schema Registry** (e.g., Confluent). \n- If a backend engineer runs an `ALTER TABLE` to add a new column in MySQL, Debezium detects the DDL change, registers the new Avro/Protobuf schema in the Registry, and the downstream consumers dynamically adapt to the new payload structure without breaking.\n\n### 3. Streaming Ingestion & Deduplication\n- **Engine:** Spark Structured Streaming or Flink consumes the Kafka topics.\n- **Lakehouse Merges:** Data is written to an **Apache Iceberg or Delta Lake** table. Because a single order might be updated 5 times in one minute (e.g., pending -> paid -> shipped), the streaming micro-batch must group by `order_id`, extract the row with the latest `updated_at` timestamp (or highest Kafka offset), and execute a `MERGE INTO` (Upsert) operation against the Lakehouse. This guarantees deduplication.\n\n### 4. Compaction (The Small Files Problem)\n- Real-time streaming creates thousands of tiny Parquet files on S3. Reading these is catastrophically slow due to I/O overhead.\n- **Solution:** Schedule an asynchronous background Airflow job to run `OPTIMIZE` and `ZORDER` (Delta Lake) or `RewriteDataFiles` (Iceberg). This compacts the tiny files into optimally sized ~1GB chunks, massively improving analytical read performance.",
    "complexity": "Complex",
    "topics": [
      "distributed-systems",
      "pubsub-kafka",
      "data-modeling"
    ],
    "tags": [
      "mysql-scaling",
      "read-write-splitting",
      "sharding",
      "cdc",
      "debezium",
      "caching",
      "kafka"
    ]
  },
  {
    "id": "dist-customer-facing-analytics-serving-layer",
    "qNo": 83,
    "q": "Design a customer-facing analytics API (Serving Layer) that allows thousands of merchants to query their live sales dashboards. The raw data is billions of rows in Snowflake, but the dashboard must load in <500ms and support custom filtering.",
    "a": "Pointing a customer-facing API directly at a Data Warehouse (Snowflake/BigQuery) is a massive anti-pattern. They are designed for high-throughput, low-concurrency workloads and will suffer from queuing delays, high latency, and astronomical compute costs.\n\n### 1. The Pre-Aggregation Layer (Transformation)\n- Use **dbt** to build daily and hourly aggregate tables (e.g., `sales_by_merchant_day_product`) inside Snowflake. This reduces billions of raw rows down to millions of summarized rows.\n\n### 2. The Speed Layer (Real-Time OLAP)\n- Export the aggregated data from Snowflake and ingest it into a real-time analytical database engineered specifically for high-concurrency, sub-second latency. Standard choices are **Apache Druid, ClickHouse, or Apache Pinot**.\n- **Hybrid Ingestion:** \n  - *Historical Data:* Bulk-exported from Snowflake to S3, then loaded into ClickHouse.\n  - *Intra-day Data:* ClickHouse directly subscribes to the upstream Kafka sales topics, appending real-time events seamlessly alongside the historical batch data.\n\n### 3. The API Serving Layer\n- A lightweight Go or Node.js microservice receives the HTTP requests from the merchant dashboard.\n- It translates the user's dashboard filters (Date, Region, Product) into a highly optimized ClickHouse SQL query.\n- **Caching:** Implement a **Redis** caching layer in front of the API. When a merchant logs in, the dashboard typically queries the exact same default view ('This Month's Sales'). Caching this payload with a 5-minute TTL intercepts 80% of database hits, driving latency down to <10ms and protecting the database from traffic spikes.",
    "complexity": "Complex",
    "topics": [
      "distributed-systems",
      "bigquery"
    ],
    "tags": [
      "serving-layer",
      "low-latency-apis",
      "clickhouse",
      "pinot",
      "materialized-views",
      "cube-js"
    ]
  },
  {
    "id": "dist-data-contracts-prevent-breaking-changes",
    "qNo": 84,
    "q": "What are Data Contracts? How do they solve the 'silent schema change' problem between Software Engineers and Data Engineers?",
    "a": "The most common friction point in data pipelines is when upstream Software Engineers change a database schema (e.g., dropping a column, changing a status string from 'shipped' to 'Shipped') without telling the Data Team, instantly breaking downstream dashboards and ML models.\n\n**Data Contracts** solve this.\nA Data Contract is a formalized agreement (usually defined in YAML/JSON Schema) between data producers and data consumers. It defines the exact schema, data types, and semantic expectations of the data.\n\n**Enforcement:**\nThe contract is enforced in the CI/CD pipeline of the *Software Engineer's* application. If a software engineer tries to deploy a PR that renames the `user_id` column to `account_id`, the CI/CD pipeline runs a test against the Data Contract, fails the build, and prevents the code from reaching production. Producers become accountable for the data they emit.",
    "complexity": "Complex",
    "topics": [
      "distributed-systems",
      "data-governance"
    ],
    "tags": [
      "data-contracts",
      "schema-enforcement",
      "protobuf",
      "shift-left-quality",
      "schema-registry"
    ]
  },
  {
    "id": "dist-lambda-vs-kappa-architecture",
    "qNo": 85,
    "q": "Lambda vs Kappa Architecture. Why is the industry slowly migrating toward Kappa?",
    "a": "**Lambda Architecture:**\nMaintains two entirely separate paths for data processing:\n1. A **Batch Layer** (e.g., Spark, Airflow) that processes massive historical data accurately (the source of truth).\n2. A **Speed Layer** (e.g., Flink, Kafka) that provides low-latency approximations for real-time dashboards.\n*The Problem:* You have to write, maintain, and debug two completely different codebases (e.g., SQL for batch, Java/Scala for streaming) that do the exact same logic. \n\n**Kappa Architecture:**\nEliminates the Batch layer entirely. **Everything is a stream.**\nData is ingested into a massively scalable messaging system with infinite retention (like Kafka or Apache Pulsar). Both real-time processing and historical backfills are executed by the exact same stream processing engine using the exact same codebase. You simply rewind the Kafka offset to the beginning of time to perform 'batch' reprocessing.",
    "complexity": "Intermediate",
    "topics": [
      "distributed-systems",
      "pubsub-kafka",
      "dataflow"
    ],
    "tags": [
      "lambda-architecture",
      "kappa-architecture",
      "unified-streaming",
      "event-sourcing",
      "log-centric"
    ]
  }
];
