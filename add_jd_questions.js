import fs from 'fs';
import { interviewCategories } from './src/data/interviewData.js';

const jdQuestions = [
    {
        q: "GCP Architecture: This role requires both Dataproc and Dataflow. How do you decide whether to run pipelines on Dataproc (PySpark) or Dataflow (Apache Beam)?",
        a: "As a senior data engineer, the choice comes down to ecosystem, workload type, and existing codebase:\n\n**Dataproc (PySpark):**\n- **Use Case:** Best for lifting-and-shifting existing Spark codebases, or when the team is highly skilled in PySpark.\n- **Pros:** Full control over cluster configuration, massive open-source ecosystem, excellent for batch processing and complex ML pipelines (Spark MLlib).\n- **Cons:** You have to manage cluster sizing (even with autoscaling), and true streaming latency is limited to micro-batches.\n\n**Dataflow (Apache Beam):**\n- **Use Case:** Best for unified batch and real-time streaming architectures where sub-second latency is required.\n- **Pros:** True serverless execution (Google handles all worker scaling invisibly). Exactly-once processing semantics for streaming are natively handled much better than Spark Structured Streaming.\n- **Cons:** Vendor lock-in (if relying heavily on GCP-specific I/O), and a steeper learning curve compared to PySpark.",
        complexity: "Complex",
        qNo: 91
    },
    {
        q: "Cloud Composer & Ephemeral Clusters: How do you design an Airflow DAG to reliably orchestrate a PySpark job and load it to BigQuery while minimizing GCP costs?",
        a: "Running long-lived Dataproc clusters is a massive waste of money for batch ETL. The best practice is using **Ephemeral Clusters** orchestrated via Cloud Composer.\n\n**The DAG Pattern:**\n1. **`DataprocCreateClusterOperator`**: Spins up a perfectly sized cluster dynamically. You configure it with preemptible (Spot) worker nodes to save up to 80% on compute costs.\n2. **`DataprocSubmitJobOperator`**: Submits the PySpark script (stored in GCS) to the newly created cluster. The script processes data from GCS and writes intermediate Parquet files back to GCS.\n3. **`GCSToBigQueryOperator`**: Safely loads the processed Parquet files from GCS into BigQuery.\n4. **`DataprocDeleteClusterOperator`**: Tears down the cluster. **Crucially**, set `trigger_rule='all_done'` so the cluster deletes even if the Spark job fails, preventing orphan clusters from racking up bills.",
        complexity: "Intermediate",
        qNo: 92
    },
    {
        q: "Data Quality & Integrity: How do you implement automated data quality checks and circuit breakers in a PySpark ETL pipeline before writing to BigQuery?",
        a: "Data quality cannot be an afterthought; it must be enforced as a 'circuit breaker' in the pipeline.\n\n**Implementation Strategy:**\n1. **Great Expectations (or Deequ):** Integrate a data testing framework directly into the PySpark job. Before the final write, the framework evaluates the DataFrame against a suite of expectations (e.g., `expect_column_values_to_not_be_null`, `expect_column_values_to_be_unique`).\n2. **The Circuit Breaker Pattern:** If the validation fails (e.g., a drop in row count > 10% or a sudden spike in NULLs), the PySpark job intentionally throws an Exception.\n3. **Quarantine (Dead Letter Queue):** The bad records are filtered and written to a separate 'Quarantine' GCS bucket for investigation, rather than polluting the downstream BigQuery tables.\n4. **Alerting:** The Airflow DAG catches the failure and triggers a Slack/Email alert with the data quality report.",
        complexity: "Complex",
        qNo: 93
    },
    {
        q: "Data Modeling for BigQuery: What are the critical differences between traditional relational modeling and optimizing for BigQuery?",
        a: "BigQuery is a distributed columnar database, which changes how you model data drastically compared to traditional RDBMS (like PostgreSQL).\n\n1. **Denormalization over Star Schemas:** In traditional DBs, you normalize data to save space. In BigQuery, storage is cheap, but `JOIN` operations across massive network partitions are expensive. You should denormalize heavily.\n2. **Nested and Repeated Fields:** Instead of joining an `Orders` table with an `Order_Items` table, BigQuery handles this natively via `ARRAY` and `STRUCT` data types. You store all items inside the order row itself. This eliminates the `JOIN` entirely and vastly improves read performance.\n3. **Partitioning & Clustering:** You *must* partition large tables (usually by a `DATE` or `TIMESTAMP` column) to limit the amount of data scanned per query. Within a partition, you **Cluster** the data by heavily filtered columns (e.g., `customer_id`) to colocate related data on disk, drastically reducing query costs.",
        complexity: "Intermediate",
        qNo: 94
    },
    {
        q: "Pipeline Reliability: A PySpark job on Dataproc is failing with OOM errors during a massive join. Walk me through your troubleshooting process.",
        a: "This is a classic Data Skew and Memory Tuning scenario.\n\n**1. Identify the Bottleneck:** I would check the Spark History Server UI. If I see 199 tasks finishing quickly and 1 task hanging or throwing the OOM, it's Data Skew (a massive key imbalance).\n**2. Skew Mitigation:** \n- If the skewed key is `NULL`, I'd filter out nulls before the join.\n- If it's a valid key, I'd enable **Adaptive Query Execution (AQE)** (`spark.sql.adaptive.skewJoin.enabled = true`), which dynamically splits skewed partitions at runtime.\n- If the table being joined is small (<8GB), I would enforce a **BroadcastHashJoin** to broadcast it to all executors, completely avoiding the shuffle.\n**3. Memory Tuning:** If it's not skew, the executors simply lack RAM. I would reduce `spark.executor.cores` to give each task more memory overhead, or increase `spark.sql.shuffle.partitions` (e.g., from 200 to 1000) so each task processes a much smaller chunk of data.",
        complexity: "Complex",
        qNo: 95
    },
    {
        q: "Data Governance & Security: How do you implement data governance and PII masking across GCP storage and BigQuery?",
        a: "Data security in GCP is multi-layered, combining IAM, BigQuery policies, and Data Catalog.\n\n1. **Storage (GCS):** Enforce uniform bucket-level access and use CMEK (Customer-Managed Encryption Keys) for sensitive buckets. Data should be physically separated into raw, trusted, and refined zones.\n2. **BigQuery Column-Level Security:** Using **GCP Data Catalog**, you define Policy Tags (e.g., 'High Security PII'). You attach these tags to specific columns in BigQuery (like `SSN` or `Email`). \n3. **Dynamic Data Masking:** Instead of creating multiple views or duplicating data for different teams, you set masking rules on the Policy Tags. A Data Scientist querying the table sees `XXX-XX-XXXX` for the SSN, while a Finance Administrator sees the raw value, all from the exact same table.\n4. **Versioning:** BigQuery natively supports 'Time Travel' (querying data as it looked up to 7 days ago) and Table Snapshots for robust versioning.",
        complexity: "Complex",
        qNo: 96
    }
];

// Add to a specific target role category
const targetCategory = {
    id: "target-role-gcp-pyspark",
    title: "Target Role: GCP & PySpark",
    questions: jdQuestions
};

// Push to front
interviewCategories.unshift(targetCategory);

const jsContent = `export const interviewCategories = ${JSON.stringify(interviewCategories, null, 4)};\n`;
fs.writeFileSync('./src/data/interviewData.js', jsContent, 'utf-8');
console.log("JD target questions successfully added.");
