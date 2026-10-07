// Auto-generated module: dataGovernance
// Primary questions count: 5

export const dataGovernanceQuestions = [
  {
    "id": "gov-data-quality-circuit-breakers-great-expectations",
    "qNo": 93,
    "q": "Data Quality & Integrity: How do you implement automated data quality checks and circuit breakers in a PySpark ETL pipeline before writing to BigQuery?",
    "a": "Data quality cannot be an afterthought; it must be enforced as a 'circuit breaker' in the pipeline.\n\n**Implementation Strategy:**\n1. **Great Expectations (or Deequ):** Integrate a data testing framework directly into the PySpark job. Before the final write, the framework evaluates the DataFrame against a suite of expectations (e.g., `expect_column_values_to_not_be_null`, `expect_column_values_to_be_unique`).\n2. **The Circuit Breaker Pattern:** If the validation fails (e.g., a drop in row count > 10% or a sudden spike in NULLs), the PySpark job intentionally throws an Exception.\n3. **Quarantine (Dead Letter Queue):** The bad records are filtered and written to a separate 'Quarantine' GCS bucket for investigation, rather than polluting the downstream BigQuery tables.\n4. **Alerting:** The Airflow DAG catches the failure and triggers a Slack/Email alert with the data quality report.",
    "complexity": "Complex",
    "topics": [
      "data-governance",
      "pyspark",
      "dataproc"
    ],
    "tags": [
      "great-expectations",
      "circuit-breaker",
      "quarantine-dlq",
      "automated-validation",
      "slack-alerting",
      "data-quality"
    ]
  },
  {
    "id": "gov-bigquery-gcs-pii-masking-policy-tags",
    "qNo": 96,
    "q": "Data Governance & Security: How do you implement data governance and PII masking across GCP storage and BigQuery?",
    "a": "Data security in GCP is multi-layered, combining IAM, BigQuery policies, and Data Catalog.\n\n1. **Storage (GCS):** Enforce uniform bucket-level access and use CMEK (Customer-Managed Encryption Keys) for sensitive buckets. Data should be physically separated into raw, trusted, and refined zones.\n2. **BigQuery Column-Level Security:** Using **GCP Data Catalog**, you define Policy Tags (e.g., 'High Security PII'). You attach these tags to specific columns in BigQuery (like `SSN` or `Email`). \n3. **Dynamic Data Masking:** Instead of creating multiple views or duplicating data for different teams, you set masking rules on the Policy Tags. A Data Scientist querying the table sees `XXX-XX-XXXX` for the SSN, while a Finance Administrator sees the raw value, all from the exact same table.\n4. **Versioning:** BigQuery natively supports 'Time Travel' (querying data as it looked up to 7 days ago) and Table Snapshots for robust versioning.",
    "complexity": "Complex",
    "topics": [
      "data-governance",
      "bigquery"
    ],
    "tags": [
      "pii-masking",
      "policy-tags",
      "dynamic-data-masking",
      "column-level-security",
      "data-catalog",
      "cmek"
    ]
  },
  {
    "id": "gov-data-lineage-openlineage-marquez-metadata",
    "qNo": 136,
    "q": "How do you implement End-to-End Column-Level Data Lineage in a modern data stack? Explain the OpenLineage standard, Marquez, and Automated Impact Analysis.",
    "a": "As data platforms grow to encompass hundreds of tables, pipelines, and dashboards, knowing the provenance of data is critical. When a bug appears in a revenue report, engineers must trace backwards to find which upstream source caused the issue (**Root Cause Analysis**). Conversely, before renaming a column in a staging model, engineers must trace forwards to identify every broken dashboard (**Impact Analysis**).\n\n### 1. The OpenLineage Standard\nHistorically, every vendor had proprietary lineage tools. **OpenLineage** is the open-source industry standard for lineage collection, defining a specification for jobs, datasets, and run events:\n- **Event-Driven Architecture:** As jobs run, OpenLineage integrations capture metadata events emitted via JSON payloads to a centralized metadata backend (such as **Marquez**, DataHub, or Atlan).\n- **Core Entities:**\n  - **Datasets:** The inputs and outputs of operations (e.g. `db.schema.customers`), complete with schema facets and namespace identifiers.\n  - **Jobs:** The pipeline task executing the transformation (e.g. an Airflow task, Spark job, or dbt model).\n  - **Runs:** Individual execution instances of a job with start, complete, and fail timestamps.\n\n### 2. Integration with Airflow, Spark, and dbt\n- **Apache Airflow:** Install `apache-airflow-providers-openlineage`. Airflow automatically extracts task input/output datasets and reports them to the lineage server without changing DAG code.\n- **Spark:** Attach the `openlineage-spark` jar to the Spark submission. It inspects Spark's internal Catalyst Logical Plans, extracting inputs, outputs, and column-level projection mappings.\n- **dbt:** Packages like `dbt-openlineage` parse dbt's compiled `manifest.json` to register all model dependencies and tests.\n\n### 3. Column-Level Lineage & Automated Impact Analysis\nTable-level lineage tells you that `Fact_Orders` depends on `Stg_Orders`. **Column-Level Lineage** traces how `Fact_Orders.net_revenue` was computed:\n```\nStg_Orders.gross_amt ---> [ Transform: gross - discount ] ---> Fact_Orders.net_revenue\nStg_Orders.discount  ---/\n```\nBefore running a migration, CI/CD queries the OpenLineage API:\n```bash\n# Query Marquez REST API for downstream consumers of a specific column\ncurl -X GET \"http://marquez:5000/api/v1/lineage?node=dataset:gold.dim_customer:column:phone_number&depth=5\"\n```\nIf the API returns 3 active BI dashboards and 2 machine learning models, CI fails the pull request, preventing a silent production outage!",
    "complexity": "Intermediate",
    "topics": [
      "data-governance",
      "distributed-systems"
    ],
    "tags": [
      "data-lineage",
      "openlineage",
      "marquez",
      "column-level-lineage",
      "metadata-graph",
      "impact-analysis"
    ],
    "codeSnippet": "# Configuring OpenLineage in Airflow via environment variables\nexport AIRFLOW__OPENLINEAGE__TRANSPORT='{\"type\": \"http\", \"url\": \"http://marquez:5000\"}'\nexport AIRFLOW__OPENLINEAGE__NAMESPACE='production-composer-us'"
  },
  {
    "id": "gov-production-data-quality-framework-dlq-anomalies",
    "qNo": 137,
    "q": "How do you build a multi-layered Data Quality framework in production? Detail row-level validations, volumetric anomaly detection, and Dead Letter Queues (DLQ).",
    "a": "Data Quality (DQ) cannot be verified by running a single ad-hoc query once a day. A production data quality architecture operates across three distinct defensive perimeters: **Pre-Ingestion Schema Validation**, **In-Flight Data Testing**, and **Post-Load Anomaly Detection**.\n\n### 1. The Three Layers of Data Quality Defense\n\n```\n[ Raw Stream / Files ]\n         |\n         v\n[ 1. Ingestion Gate ]: Schema enforcement, Protobuf / Pydantic validation\n         | (Valid records)          | (Corrupted / Malformed)\n         v                          v\n[ Clean Staging ]            [ Dead Letter Queue (DLQ) / Quarantine ]\n         |\n         v\n[ 2. In-Flight Checks ]: Great Expectations / Soda SQL assertions\n         | (Pass circuit breaker)   | (Fails critical thresholds)\n         v                          v\n[ Curated Silver/Gold ]      [ Pipeline Circuit Breaker (Halt & Alert) ]\n         |\n         v\n[ 3. Volumetric Monitoring ]: Statistical anomaly detection (Z-Score on row count)\n```\n\n### 2. In-Flight Circuit Breakers with Great Expectations\nIf an unexpected bug causes 90% of rows to have `NULL` in a primary key column, the pipeline must trigger an automated **Circuit Breaker** to halt execution before corrupted data pollutes downstream reporting:\n```python\nimport great_expectations as gx\n\ncontext = gx.get_context()\nvalidator = context.sources.pandas_default.read_dataframe(processed_df)\n\n# Define critical business assertions\nvalidator.expect_column_values_to_not_be_null(column=\"transaction_id\")\nvalidator.expect_column_values_to_be_between(column=\"order_amount\", min_value=0.01, max_value=1000000.0)\nvalidator.expect_column_distinct_values_to_be_in_set(column=\"currency\", value_set=[\"USD\", \"EUR\", \"GBP\", \"JPY\"])\n\nresults = validator.validate()\nif not results.success:\n    # Trigger Circuit Breaker\n    raise DataQualityAssertionError(f\"Data quality validation failed! Details: {results.statistics}\")\n```\n\n### 3. Dead Letter Queue (DLQ) Quarantine Architecture\nNever simply drop bad records on the floor, and never fail an entire 10-million-row batch because 5 rows had invalid email formats.\n- **The Split Pattern:**\n  - Route valid rows ($99.99\\%$) to the main processing path.\n  - Divert invalid rows with their validation error messages to a **Quarantine / DLQ** table (`quarantine.failed_orders`).\n  - Analysts and upstream source teams can inspect the quarantine table to fix data bugs without blocking downstream analytics!\n\n### 4. Volumetric Anomaly Detection (Statistical Z-Scores)\nSometimes data is well-formed, but the volume is wrong (e.g. today has only 500 orders instead of the expected 50,000 due to an upstream API outage).\n- Calculate historical rolling 30-day mean ($\\mu$) and standard deviation ($\\sigma$).\n- If $|\\text{Count}_{\\text{today}} - \\mu| > 3\\sigma$, fire a high-priority PagerDuty incident.",
    "complexity": "Complex",
    "topics": [
      "data-governance",
      "pyspark",
      "pubsub-kafka"
    ],
    "tags": [
      "quality-framework",
      "dead-letter-queue",
      "volume-anomalies",
      "schema-enforcement",
      "soda-sql",
      "circuit-breaker"
    ],
    "codeSnippet": "# Volumetric Anomaly Detection query in SQL\nWITH Stats AS (\n    SELECT AVG(daily_rows) as mean_rows, STDDEV(daily_rows) as stddev_rows\n    FROM table_row_history WHERE run_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)\n)\nSELECT CURRENT_DATE() as today, count_today,\n    ABS(count_today - mean_rows) / stddev_rows as z_score\nFROM Stats, (SELECT COUNT(*) as count_today FROM prod.orders WHERE order_date = CURRENT_DATE())\nWHERE ABS(count_today - mean_rows) / stddev_rows > 3.0;"
  },
  {
    "id": "gov-pii-tokenization-gdpr-rtbf-lakehouse",
    "qNo": 138,
    "q": "How do you handle PII masking, cryptographic tokenization, and GDPR/CCPA \"Right to be Forgotten\" (RTBF) in an append-heavy Lakehouse or Data Warehouse?",
    "a": "Privacy regulations like GDPR and CCPA require data platforms to protect Personally Identifiable Information (PII) and guarantee the **Right to be Forgotten (RTBF)**: the legal obligation to delete all personal data for an individual within 30 days of receiving a request.\n\n### 1. The Conflict: Big Data Immutability vs. Right to be Forgotten\nColumnar files (Parquet, ORC) and object stores (S3, GCS) are optimized for immutable, write-once-read-many (WORM) storage. Deleting a single user from an append-only 50TB Parquet archive requires rewriting thousands of files, costing huge compute and creating immense write amplification.\n\n### 2. Architectural Solution 1: Cryptographic Erasure (Pseudonymization via Key Shredding)\nInstead of rewriting terabytes of data files, use **Cryptographic Shredding**:\n```\n[ Raw User Event ] ---> PII: email=\"alice@gmail.com\"\n                               |\n                   Encrypt with Per-User Key K_alice (AES-256)\n                               v\n[ Lakehouse Storage ] -> Encrypted ciphertext: \"8f7b2c91a0e...\"\n                               |\n[ User Requests RTBF ] -> DELELTE Key K_alice from Secret Vault!\n```\n- Personal data stored in the lakehouse is now mathematically unrecoverable garbage (equivalent to physical erasure under GDPR standards).\n- Cost: Deleting 1 key in Key Vault takes milliseconds and costs zero storage rewrites!\n\n### 3. Architectural Solution 2: Surrogate Key Mapping with Delta Lake MERGE\nIf cryptographic shredding cannot be used:\n1. **Isolate PII into a Single Dimension:** Strip PII out of all large billion-row fact tables. Fact tables reference only an anonymous `user_surrogate_id`.\n2. **Keep PII Exclusively in a Small Dimension Table:** Store real names, emails, and phone numbers exclusively in `dim_user_pii`.\n3. **Execute Targeted Deletions:** When a user requests erasure, execute a single Delta Lake or BigQuery DML deletion against `dim_user_pii`:\n```sql\nDELETE FROM dim_user_pii WHERE user_id = 'user_12345';\nVACUUM dim_user_pii RETAIN 0 HOURS; -- Purge historical snapshots and tombstones\n```\n4. The fact tables remain intact for historical reporting (total revenue, item counts), while the individual's identity is completely erased.",
    "complexity": "Complex",
    "topics": [
      "data-governance",
      "databricks",
      "bigquery"
    ],
    "tags": [
      "tokenization",
      "gdpr-compliance",
      "right-to-be-forgotten",
      "delta-vacuum-tombstones",
      "pseudonymization",
      "key-shredding"
    ],
    "codeSnippet": "-- Enforcing Right to be Forgotten in Delta Lake\nDELETE FROM lakehouse.dim_customer WHERE customer_id = 'USR-98412';\n-- Force hard physical deletion of tombstone files older than retention\nSET spark.databricks.delta.vacuum.parallelDelete.enabled = true;\nVACUUM lakehouse.dim_customer RETAIN 168 HOURS;"
  }
];
