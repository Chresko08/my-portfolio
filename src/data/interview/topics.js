export const interviewTopics = [
  {
    id: 'advanced-sql',
    title: 'Advanced SQL',
    icon: 'FiDatabase',
    description: 'Window functions, CTEs, recursive queries, execution plans, indexing & query optimization.',
    tags: ['window-functions', 'ctes', 'query-optimization', 'indexing', 'explain-plan', 'recursive-queries']
  },
  {
    id: 'hadoop-hive',
    title: 'Hadoop / Hive',
    icon: 'FiLayers',
    description: 'HDFS architecture, NameNode/DataNode, MapReduce vs Tez, partitioning, bucketing & file formats.',
    tags: ['hdfs', 'hive', 'tez', 'mapreduce', 'orc', 'parquet', 'avro', 'bucketing', 'partitioning']
  },
  {
    id: 'pyspark',
    title: 'PySpark',
    icon: 'FiCpu',
    description: 'Catalyst optimizer, DAG execution, AQE, memory tuning, driver/executor OOM & skew resolution.',
    tags: ['catalyst-optimizer', 'aqe', 'memory-tuning', 'oom-troubleshooting', 'data-skew', 'broadcast-join']
  },
  {
    id: 'python',
    title: 'Python',
    icon: 'FiCode',
    description: 'Core data structures, generators, OOP for ETL pipelines, memory optimization & DE algorithms.',
    tags: ['generators', 'memory-optimization', '__slots__', 'gil', 'multiprocessing', 'pandas', 'oop-etl']
  },
  {
    id: 'azure',
    title: 'Azure',
    icon: 'FiCloud',
    description: 'ADLS Gen2, Azure Data Factory (ADF), Synapse Analytics, pipelines & integration runtimes.',
    tags: ['adls-gen2', 'adf', 'integration-runtime', 'synapse', 'managed-identity', 'azure-storage']
  },
  {
    id: 'databricks',
    title: 'Databricks',
    icon: 'FiBox',
    description: 'Delta Lake ACID logs, Unity Catalog, Photon, Liquid Clustering, Z-Ordering & Medallion Architecture.',
    tags: ['delta-lake', '_delta_log', 'unity-catalog', 'photon', 'liquid-clustering', 'z-order', 'medallion']
  },
  {
    id: 'distributed-systems',
    title: 'Distributed Systems & System Design',
    icon: 'FiServer',
    description: 'CAP theorem, consensus, partitioning, replication, backpressure, rate limiting & scalable design.',
    tags: ['cap-theorem', 'consensus', 'partitioning', 'backpressure', 'system-design', 'feature-store', 'rate-limiting']
  },
  {
    id: 'data-modeling',
    title: 'Data Modeling',
    icon: 'FiGrid',
    description: 'Kimball Star/Snowflake schemas, Fact vs Dimension, Grain, SCD Type 1/2/3, Data Vault & normalization.',
    tags: ['star-schema', 'snowflake-schema', 'grain', 'scd-type-2', 'data-vault', 'normalization', 'fact-dimension']
  },
  {
    id: 'dataproc',
    title: 'Dataproc',
    icon: 'FiHardDrive',
    description: 'Cluster lifecycle management, ephemeral clusters, autoscaling, preemptible/spot nodes & Composer.',
    tags: ['ephemeral-clusters', 'dataproc-autoscaling', 'preemptible-vms', 'cloud-composer', 'dataproc-serverless']
  },
  {
    id: 'dataflow',
    title: 'Dataflow',
    icon: 'FiActivity',
    description: 'Apache Beam, unified streaming/batch, PCollections, PTransforms, windowing, watermarks & exactly-once.',
    tags: ['apache-beam', 'pcollections', 'windowing', 'watermarks', 'triggers', 'exactly-once', 'stream-processing']
  },
  {
    id: 'cloud-composer',
    title: 'Cloud Composer',
    icon: 'FiCompass',
    description: 'Apache Airflow, DAG architecture, custom operators, sensors, XComs, idempotent backfills & isolation.',
    tags: ['airflow-architecture', 'composer', 'deferrable-operators', 'xcoms', 'idempotency', 'backfills', 'sensors']
  },
  {
    id: 'bigquery',
    title: 'BigQuery',
    icon: 'FiBarChart2',
    description: 'Capacitor columnar storage, partitioning vs clustering, slot reservations, MERGE DML & BI Engine.',
    tags: ['capacitor', 'partitioning', 'clustering', 'slot-reservations', 'merge-dml', 'bi-engine']
  },
  {
    id: 'dbt',
    title: 'dbt (Data Build Tool)',
    icon: 'FiTool',
    description: 'Models, incremental strategies, snapshots for SCD, tests, sources, Jinja macros & lineage.',
    tags: ['incremental-strategies', 'snapshots', 'dbt-tests', 'ref-source', 'jinja-macros', 'materializations']
  },
  {
    id: 'unix-shell',
    title: 'Unix & Shell',
    icon: 'FiTerminal',
    description: 'Shell scripting, awk, sed, grep, cron routines, process management & streaming pipelines.',
    tags: ['awk', 'sed', 'grep', 'bash-scripting', 'cron', 'pipes', 'process-management', 'linux-cli']
  },
  {
    id: 'cicd-devops',
    title: 'CI/CD & DevOps',
    icon: 'FiGitBranch',
    description: 'Git workflows, automated testing, containerization, deployment sequences & promotion.',
    tags: ['git-workflows', 'docker', 'automated-testing', 'ci-cd-pipelines', 'environment-promotion', 'iac']
  },
  {
    id: 'data-governance',
    title: 'Data Governance',
    icon: 'FiShield',
    description: 'Data Quality frameworks, circuit breakers, PII masking, policy tags, auditability & lineage.',
    tags: ['data-quality', 'circuit-breaker', 'great-expectations', 'pii-masking', 'policy-tags', 'lineage', 'compliance']
  },
  {
    id: 'pubsub-kafka',
    title: 'Google Pub/Sub & Kafka',
    icon: 'FiSend',
    description: 'Message brokers, topics, partitions, consumer groups, offset management, CDC via Debezium & streaming.',
    tags: ['kafka-partitions', 'pubsub-subscriptions', 'cdc', 'debezium', 'consumer-groups', 'offsets', 'message-broker']
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    icon: 'FiCode',
    description: 'Arrays, strings, searching, sorting, recursion, hashing, two pointers, sliding window & dynamic programming.',
    tags: ['dsa', 'arrays', 'strings', 'searching', 'sorting', 'recursion', 'hashing', 'dynamic-programming', 'two-pointers', 'sliding-window', 'leetcode']
  },
  {
    id: 'nosql-mongodb',
    title: 'NoSQL & MongoDB',
    icon: 'FiDatabase',
    description: 'Document data modeling, BSON, Aggregation Pipeline, indexing, sharding, replica sets & ACID transactions.',
    tags: ['nosql', 'mongodb', 'aggregation-pipeline', 'document-store', 'indexing', 'sharding', 'replica-sets', 'bson', 'acid-transactions']
  },
  {
    id: 'excel-analytics',
    title: 'Excel & Analytics',
    icon: 'FiFileText',
    description: 'Formulas (SUMIFS/INDEX-MATCH), VLOOKUP/XLOOKUP, Pivot Tables, conditional formatting, filtering & data analysis.',
    tags: ['excel', 'vlookup', 'xlookup', 'pivot-tables', 'formulas', 'data-analysis', 'conditional-formatting', 'sorting-filtering', 'spreadsheets']
  },
  {
    id: 'data-viz-bi',
    title: 'Data Visualization & BI',
    icon: 'FiPieChart',
    description: 'Power BI & Tableau architectures, DAX measures, data modeling, dashboard storytelling, RLS & refresh.',
    tags: ['power-bi', 'tableau', 'dax', 'measures', 'dashboards', 'data-visualization', 'kpis', 'star-schema-bi', 'rls', 'lod-expressions']
  }
];
