export const modelingNotes = [
  {
    id: "dw-lakehouse-datalake",
    title: "Data Warehouse, Data Lake, & Lakehouse Architectures",
    sections: [
      {
        id: "architecture-core-internals",
        title: "Architecture & Core Internals",
        icon: "🏛️",
        content: `
          <ul>
            <li><strong>Data Warehouse (DW):</strong> A central repository for structured, filtered data that has already been processed for a specific purpose. Uses <span style='color:#6366f1'>Schema-on-Write</span>. Powered by MPP (Massively Parallel Processing) engines (e.g., Snowflake, Redshift, BigQuery). Architecture historically relies on ETL (Extract, Transform, Load). Organized into schemas (Star/Snowflake).</li>
            <li><strong>Data Lake:</strong> A vast pool of raw data, the purpose for which is not yet defined. Uses <span style='color:#6366f1'>Schema-on-Read</span>. Backed by cheap, distributed object storage (S3, GCS, ADLS). Processing engines decouple storage from compute (Spark, Presto, Trino).</li>
            <li><strong>Lakehouse Architecture:</strong> Unifies DW and Data Lake. Implements DW-like data structures and data management features directly on low-cost cloud object storage. Built on open table formats like <span style='color:#6366f1'>Delta Lake, Apache Iceberg, and Apache Hudi</span>. Provides ACID transactions, schema enforcement/evolution, and time travel.</li>
            <li><strong>Medallion Architecture:</strong> A recommended data design pattern for Lakehouses that logically organizes data:
              <ul>
                <li><strong>Bronze Layer (Raw):</strong> Lands data as-is from sources (JSON, CSV). High volume, append-only, minimal transformations.</li>
                <li><strong>Silver Layer (Cleansed):</strong> Filtered, cleaned, augmented, and normalized data. Represents an "enterprise view" of key entities. Resolves schema evolution.</li>
                <li><strong>Gold Layer (Curated):</strong> Business-level aggregates, star schemas, dimensional models ready for BI and ML consumption.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "key-mechanics",
        title: "Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <table style='width:100%; border-collapse:collapse; text-align:left; border:1px solid rgba(255,255,255,0.1);'>
            <thead>
              <tr style='background:rgba(255,255,255,0.05);'>
                <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Feature</th>
                <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Data Warehouse</th>
                <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Data Lake</th>
                <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Lakehouse</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Data Types</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Structured, highly curated</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Structured, Semi-structured, Unstructured</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Structured, Semi-structured, Unstructured</td>
              </tr>
              <tr>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Compute vs Storage</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Historically tightly coupled (now separated in Snowflake/BQ)</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Decoupled</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Decoupled (Open formats)</td>
              </tr>
              <tr>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>ACID Support</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Full support</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>No native support</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Full support via Iceberg/Delta/Hudi</td>
              </tr>
            </tbody>
          </table>
          <br/>
          <ul>
            <li><strong>OLTP vs OLAP:</strong> OLTP (Online Transaction Processing) optimizes for fast row-level inserts/updates (row-oriented, normalized, high concurrency). OLAP (Online Analytical Processing) optimizes for complex queries across massive datasets (column-oriented, denormalized, aggregations).</li>
            <li><strong>ETL vs ELT:</strong> ETL transforms data in-flight before loading to DW (costly compute upfront). ELT extracts and loads raw data into the DW/Lakehouse, then leverages the powerful MPP engine to transform the data natively (dbt uses ELT).</li>
            <li><strong>Materialized Views:</strong> Pre-computed views that physically store the result of a query. Excellent for accelerating heavy joins and aggregations in Gold zones. Automatically refreshed incrementally in modern engines.</li>
          </ul>
        `
      },
      {
        id: "performance-tuning",
        title: "Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Partitioning:</strong> Segmenting data physically into directories/files based on a column (e.g., date, country). Essential for pruning data during query planning. 
              <br/><em>Rule of thumb:</em> Avoid overly granular partitions that create thousands of tiny files ("Small File Problem"). Optimal file size in object storage is usually 128MB-1GB.</li>
            <li><strong>Clustering (Z-Ordering/Sort Keys):</strong> Co-locating related information within a partition. Useful for columns frequently used in <code>WHERE</code> clauses but having too high cardinality for partitioning (e.g., customer_id). Delta Lake uses Z-Ordering to map multidimensional data into 1D arrays while preserving data locality.</li>
            <li><strong>Materialization Tradeoffs:</strong> Extensive materialization speeds up read queries but increases write times, storage costs, and pipeline complexity. Balance by only materializing frequently queried, expensive joins.</li>
            <li><strong>Compaction (Bin-packing):</strong> Periodically combining small files into larger optimal sizes (e.g., Delta Lake's <code>OPTIMIZE</code>). Reduces object store metadata overhead and API call costs.</li>
          </ul>
        `
      },
      {
        id: "interview-patterns",
        title: "High-Frequency Interview Patterns",
        icon: "🧠",
        content: `
          <ul>
            <li><strong>Kimball vs Inmon vs Data Vault Comparison:</strong> 
              <ul>
                <li><strong>Kimball (Bottom-Up):</strong> Dimensional modeling (Star schemas). Focuses on business processes. Data marts are built first, then conformed dimensions tie them into an enterprise DW.</li>
                <li><strong>Inmon (Top-Down):</strong> ER modeling (3NF). Focuses on the enterprise. A centralized normalized EDW is built first, then data marts are extracted from it.</li>
                <li><strong>Data Vault 2.0:</strong> Hubs (business keys), Links (transactions/relationships), and Satellites (context/attributes). Designed for massive scale, flexibility, and auditability.</li>
              </ul>
            </li>
            <li><strong>Production Medallion Architecture Implementation (PySpark + Delta):</strong>
<pre><code># 1. Bronze Layer: Ingest raw event stream with metadata audit columns
bronze_df = raw_json_df \\
    .withColumn("ingested_at", current_timestamp()) \\
    .withColumn("source_file", input_file_name())
bronze_df.write.format("delta").mode("append").save("gs://lakehouse/bronze/events")

# 2. Silver Layer: Deduplicate, cleanse schema, and filter corrupted records
silver_df = spark.read.format("delta").load("gs://lakehouse/bronze/events") \\
    .filter("user_id IS NOT NULL AND event_type != 'UNKNOWN'") \\
    .dropDuplicates(["event_id"])
silver_df.write.format("delta").mode("overwrite").save("gs://lakehouse/silver/events")

# 3. Gold Layer: Pre-aggregated business dimensional mart for BI
gold_df = silver_df.groupBy("user_id", "country") \\
    .agg(count("event_id").alias("total_actions"), sum("revenue").alias("lifetime_val"))
gold_df.write.format("delta").mode("overwrite").save("gs://lakehouse/gold/user_summary")</code></pre>
            </li>
            <li><strong>Lambda vs Kappa Architecture:</strong> Lambda handles streaming and batch processing in two parallel paths, unifying at the serving layer (high complexity). Kappa treats everything as a stream; batch is just a historic stream (simplifies architecture, requires robust streaming infrastructure like Kafka/Flink).</li>
            <li><strong>Data Mesh vs Data Fabric:</strong> Data Mesh is an organizational/architectural paradigm treating data as a product, owned by domain-specific decentralized teams. Data Fabric is a technology-centric approach using AI/metadata to dynamically connect disparate data sources.</li>
          </ul>
        `
      },
      {
        id: "interview-traps",
        title: "Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>The Data Swamp:</strong> Dumping data into a Data Lake without schema enforcement, metadata management, or governance. Becomes unsearchable and unusable. <em>Solution:</em> Medallion architecture, data catalogs (Amundsen, DataHub), and schema registries.</li>
            <li><strong>Ignoring the Small File Problem:</strong> Continual streaming inserts into a Data Lake create millions of tiny files. Query engines spend more time reading metadata and opening files than processing data. <em>Fix:</em> Scheduled compaction jobs.</li>
            <li><strong>Serverless Cost Explosions:</strong> Using BigQuery or Snowflake without partitioning/clustering means queries perform full table scans. Scanning petabytes costs thousands of dollars per query. Always implement partition pruning limits.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "data-modeling",
    title: "Data Modeling",
    sections: [
      {
        id: "architecture-core-internals",
        title: "Architecture & Core Internals",
        icon: "🏛️",
        content: `
          <ul>
            <li><strong>Conceptual vs Logical vs Physical Models:</strong>
              <ul>
                <li><strong>Conceptual:</strong> High-level business concepts and rules. Technology agnostic (Entities and Relationships).</li>
                <li><strong>Logical:</strong> Adds attributes and primary/foreign keys. Still independent of a specific RDBMS. Normalization applied here.</li>
                <li><strong>Physical:</strong> Technology-specific implementation. Defines table structures, data types, constraints, indexes, and partitioning schemas.</li>
              </ul>
            </li>
            <li><strong>Normalization (1NF to 3NF/BCNF):</strong> Process of organizing data to reduce redundancy and improve data integrity. Heavily used in OLTP.
              <ul>
                <li><em>1NF:</em> Atomic values, unique records.</li>
                <li><em>2NF:</em> 1NF + no partial dependencies (non-key attributes depend on the entire primary key).</li>
                <li><em>3NF:</em> 2NF + no transitive dependencies (non-key attributes depend ONLY on the primary key).</li>
              </ul>
            </li>
            <li><strong>Denormalization:</strong> Intentionally introducing redundancy to improve read performance (fewer joins). Heavily used in OLAP/Dimensional modeling.</li>
          </ul>
        `
      },
      {
        id: "key-mechanics",
        title: "Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Star Schema:</strong> One central Fact table connected to multiple surrounding Dimension tables. Highly denormalized dimensions. Optimized for fast aggregations and simple joins.</li>
            <li><strong>Snowflake Schema:</strong> A Star Schema where dimensions are normalized into sub-dimensions (e.g., a City dimension linked to a State dimension). Saves storage but degrades read performance due to complex joins.</li>
            <li><strong>Fact Table Types:</strong>
              <ul>
                <li><span style='color:#6366f1'>Transaction Fact Table:</span> One row per event/transaction (e.g., a retail sale). Most granular.</li>
                <li><span style='color:#6366f1'>Periodic Snapshot Fact Table:</span> One row per time period for a specific entity (e.g., daily bank account balance).</li>
                <li><span style='color:#6366f1'>Accumulating Snapshot Fact Table:</span> One row per discrete process, updated as the process moves through stages (e.g., order lifecycle: placed -> shipped -> delivered). Contains multiple date keys.</li>
              </ul>
            </li>
            <li><strong>Dimension Table Types:</strong>
              <ul>
                <li><span style='color:#6366f1'>Conformed Dimension:</span> A dimension standardized across multiple fact tables/data marts (e.g., Date, Customer). Critical for cross-functional reporting.</li>
                <li><span style='color:#6366f1'>Degenerate Dimension:</span> A dimension key in the fact table without a corresponding dimension table (e.g., order_id or invoice_number).</li>
                <li><span style='color:#6366f1'>Junk Dimension:</span> A single dimension table grouping low-cardinality flags and indicators to prevent cluttering the fact table.</li>
                <li><span style='color:#6366f1'>Role-Playing Dimension:</span> A single physical dimension table referenced multiple times in a fact table for different purposes (e.g., Date dimension used as order_date, ship_date).</li>
              </ul>
            </li>
            <li><strong>Keys:</strong> Natural keys are business keys (e.g., SSN). Surrogate keys are system-generated (usually auto-incrementing integers or UUIDs) used to isolate the DW from source system changes.</li>
          </ul>
        `
      },
      {
        id: "performance-tuning",
        title: "Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Grain Definition:</strong> Defining exactly what one row in the fact table represents. The most critical step. Mixing granularities (e.g., order header and order line items in one fact table) causes massive double-counting errors. Always model at the lowest possible atomic grain.</li>
            <li><strong>Pre-aggregation & Rollup Tables:</strong> Creating summary tables (e.g., daily_sales, monthly_sales) to prevent aggregating billions of transaction rows for high-level dashboards.</li>
            <li><strong>Bridge Tables for Many-to-Many:</strong> Used when a fact table row relates to multiple dimension rows (e.g., one hospital visit fact having multiple diagnosis codes). The bridge table resolves the M:M relationship with a weighting factor to prevent double-counting.</li>
          </ul>
        `
      },
      {
        id: "interview-patterns",
        title: "High-Frequency Interview Patterns",
        icon: "🧠",
        content: `
          <ul>
            <li><strong>Modeling Paradigms Comparison:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Architecture</th><th>Normalization</th><th>Join Complexity</th><th>Storage Cost</th><th>Best Use Case</th></tr>
                <tr><td><strong>Star Schema</strong></td><td>Denormalized dimensions</td><td>Single hop (Fact &harr; Dim)</td><td>Moderate (redundancy in dims)</td><td>Default for modern BI, Tableau, PowerBI, BigQuery</td></tr>
                <tr><td><strong>Snowflake Schema</strong></td><td>Normalized sub-dimensions (3NF)</td><td>Multi-hop (Fact &harr; Dim &harr; Sub-Dim)</td><td>Lowest storage footprint</td><td>Legacy RDBMS where storage was expensive and writes frequent</td></tr>
                <tr><td><strong>Data Vault 2.0</strong></td><td>Hubs, Links, Satellites</td><td>High (multiple joins across satellites)</td><td>High (table proliferation)</td><td>Agile enterprise DW integration, audit-heavy finance/insurance</td></tr>
              </table>
            </li>
            <li><strong>Production SQL DDL: Star Schema E-Commerce Fact & Dimension Design:</strong>
<pre><code>-- 1. Conformed Customer Dimension (SCD Type 2)
CREATE TABLE dim_customer (
    customer_sk INT64,              -- Surrogate Key (Primary Key)
    customer_id STRING NOT NULL,     -- Natural / Business Key
    first_name STRING,
    last_name STRING,
    email STRING,
    country STRING,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL
);

-- 2. Transaction Fact Table (Grain: 1 row per order line item)
CREATE TABLE fct_order_items (
    order_item_sk INT64,            -- Degenerate / Surrogate Key
    order_id STRING NOT NULL,        -- Degenerate Dimension
    customer_sk INT64 NOT NULL,      -- Foreign Key pointing to dim_customer
    product_sk INT64 NOT NULL,       -- Foreign Key pointing to dim_product
    order_date_sk INT64 NOT NULL,    -- Foreign Key pointing to dim_date (e.g. 20260303)
    quantity INT64 NOT NULL,
    unit_price NUMERIC(10, 2),
    discount_amount NUMERIC(10, 2),
    net_sales_amount NUMERIC(12, 2), -- Additive Fact
    created_at TIMESTAMP
);</code></pre>
            </li>
            <li><strong>Handling Multi-Currency:</strong> Store both original transaction currency amount (and currency code) and the standardized base currency amount (e.g., USD) with the exchange rate timestamp in the fact row.</li>
            <li><strong>Late-Arriving Dimensions:</strong> When a fact arrives before its associated dimension record, insert a "stub" dimension row with the natural key and surrogate key, then backfill descriptive attributes when the dimension batch arrives.</li>
          </ul>
        `
      },
      {
        id: "interview-traps",
        title: "Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>The Fan-Out Problem (Chasm Trap):</strong> Joining two one-to-many relationships through a central table causes Cartesian products, heavily duplicating metrics. <em>Fix:</em> Aggregate first in CTEs before joining, or separate into distinct fact tables.</li>
            <li><strong>Double-Counting via Bridge Tables:</strong> Failing to apply allocation/weighting factors when querying across many-to-many bridge tables.</li>
            <li><strong>Breaking Conformed Dimensions:</strong> Allowing different departments to create their own isolated Customer or Date dimensions, making cross-departmental reporting impossible.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "scd",
    title: "Slowly Changing Dimensions (SCD)",
    sections: [
      {
        id: "architecture-core-internals",
        title: "Architecture & Core Internals",
        icon: "🏛️",
        content: `
          <ul>
            <li><strong>Definition:</strong> In a Data Warehouse, dimension attributes (like a customer's address or an employee's title) change over time. SCDs are techniques for managing these changes while preserving historical accuracy for fact tables.</li>
            <li><strong>The Core Problem:</strong> If an employee gets promoted from Junior to Senior Developer in 2023, how do we attribute the sales they generated in 2022? If we just overwrite their title, 2022 reports will inaccurately show a Senior Developer generating those sales.</li>
          </ul>
        `
      },
      {
        id: "key-mechanics",
        title: "Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <table style='width:100%; border-collapse:collapse; text-align:left; border:1px solid rgba(255,255,255,0.1);'>
            <thead>
              <tr style='background:rgba(255,255,255,0.05);'>
                <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Type</th>
                <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Description</th>
                <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Use Case & Drawbacks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>Type 0</strong></td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Retain Original. No changes allowed.</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Birth dates, original signup dates.</td>
              </tr>
              <tr>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>Type 1</strong></td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Overwrite. Replaces old data with new.</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Spelling corrections. Loses all history.</td>
              </tr>
              <tr>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>Type 2</strong></td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Add new row. Requires Surrogate Key, <code>start_date</code>, <code>end_date</code>, <code>is_current</code>.</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>Industry Standard.</strong> Full history tracking. Causes table growth.</td>
              </tr>
              <tr>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>Type 3</strong></td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Add new column (e.g., <code>current_city</code>, <code>previous_city</code>).</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Limited history (usually just 1 previous state).</td>
              </tr>
              <tr>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>Type 4</strong></td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>History table. Current profile in main table, historical rows in separate table.</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Keeps main table small and fast for current queries.</td>
              </tr>
              <tr>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>Type 6</strong></td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Hybrid (1+2+3). Row tracking + current column on all historical rows.</td>
                <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Allows querying history using <em>either</em> historical or current attributes. Very complex to maintain.</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: "performance-tuning",
        title: "Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>SCD2 on Massive Tables:</strong> Do not use SCD2 for rapidly changing attributes (e.g., a user's weight tracked daily). This causes row explosion. Instead, break out volatile attributes into a <span style='color:#6366f1'>Mini-Dimension</span> with a Type 4 pattern, or keep them in the fact table.</li>
            <li><strong>Merge Optimization:</strong> Implementing SCD2 requires an Upsert (MERGE) operation. In distributed systems (Spark/Snowflake), MERGE requires full table scans to find matches. Optimize by partitioning the dimension by date (e.g., <code>start_date</code> year/month) or using clustering keys on the natural key.</li>
            <li><strong>Checksums / Hashes:</strong> Instead of comparing every column to detect changes during ELT, compute an MD5/SHA256 hash of all tracked attributes in the source data and compare it to the hash in the current dimension row. Significantly speeds up change detection.</li>
          </ul>
        `
      },
      {
        id: "interview-patterns",
        title: "High-Frequency Interview Patterns",
        icon: "🧠",
        content: `
          <ul>
            <li><strong>Implement SCD2 in SQL:</strong> Expect to write a <code>MERGE</code> statement.
<pre><code>MERGE INTO dim_customer target
USING (
  -- Requires complex logic to identify new, changed, and unchanged rows
  SELECT * FROM stg_customer
) source
ON target.customer_id = source.customer_id
WHEN MATCHED AND target.hash != source.hash AND target.is_current = TRUE THEN
  UPDATE SET end_date = CURRENT_DATE, is_current = FALSE
WHEN NOT MATCHED THEN
  INSERT (surrogate_key, customer_id, name, start_date, end_date, is_current)
  VALUES (seq.nextval, source.customer_id, source.name, CURRENT_DATE, '9999-12-31', TRUE);
-- Note: A second insert is needed for the new version of changed rows in standard SQL.
</code></pre>
            </li>
            <li><strong>SCD2 in dbt:</strong> dbt handles SCD2 out-of-the-box using the <code>snapshots</code> feature. You just define a <code>strategy: 'check'</code> or <code>strategy: 'timestamp'</code> in the config block.</li>
            <li><strong>Implement in Spark/Delta Lake:</strong> Delta Lake simplifies SCD2 via <code>MERGE INTO</code> combined with ACID transactions. It handles the two-step (update old, insert new) pattern natively in some APIs.</li>
          </ul>
        `
      },
      {
        id: "interview-traps",
        title: "Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>Missing Surrogate Keys:</strong> Natural keys are not unique in an SCD2 table (because one customer has multiple rows). You MUST use a surrogate key as the primary key.</li>
            <li><strong>Overlapping Dates:</strong> Ensure exactly zero overlap between versions. If row 1 ends at <code>2023-01-01 12:00:00</code>, row 2 must start at <code>2023-01-01 12:00:01</code>. Failing this causes duplicate joins in fact tables.</li>
            <li><strong>Timezone Handling:</strong> Always enforce UTC for <code>start_date</code> and <code>end_date</code> columns to prevent chronological paradoxes in distributed pipelines.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "cdc",
    title: "Change Data Capture (CDC)",
    sections: [
      {
        id: "architecture-core-internals",
        title: "Architecture & Core Internals",
        icon: "🏛️",
        content: `
          <ul>
            <li><strong>Definition:</strong> Identifying and capturing changes made to database data (Inserts, Updates, Deletes) and delivering those changes in real-time to downstream systems (DW, Kafka, Data Lake).</li>
            <li><strong>Log-Based CDC (The Gold Standard):</strong> Reads the database's internal transaction log (Write-Ahead Log (WAL) in Postgres, Binlog in MySQL). Zero impact on production query performance. Captures every single change, including hard deletes.</li>
            <li><strong>Query-Based CDC:</strong> Periodically polling a table via SQL using an <code>updated_at</code> timestamp column (e.g., <code>SELECT * WHERE updated_at > last_run</code>). Places load on the source DB. Cannot detect hard deletes (unless soft-deletes are used). Cannot capture multiple updates happening between polls.</li>
            <li><strong>Trigger-Based CDC:</strong> Database triggers fire on DML events to insert records into an audit table. Extremely high performance overhead on the source DB. Rarely recommended in modern architectures.</li>
          </ul>
        `
      },
      {
        id: "key-mechanics",
        title: "Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Debezium Architecture:</strong> The industry standard open-source Log-based CDC tool. 
              <br/><em>Flow:</em> Source DB (MySQL) -> Debezium Source Connector (Kafka Connect) -> Kafka Topics (one topic per table) -> Kafka Sink Connector / Spark Structured Streaming -> Data Warehouse / Data Lake.</li>
            <li><strong>Schema Registry:</strong> Crucial for CDC pipelines. Integrates with Kafka to version and enforce the schema (Avro/Protobuf) of the CDC stream. If the source DB adds a column, Schema Registry manages the schema evolution gracefully downstream.</li>
            <li><strong>Delivery Semantics:</strong> Log-based CDC combined with Kafka provides <span style='color:#6366f1'>At-Least-Once</span> delivery by default. <span style='color:#6366f1'>Exactly-Once</span> semantics require idempotency in the downstream sink (using upserts based on primary keys).</li>
            <li><strong>Offset Management:</strong> Kafka Connect tracks the specific position (offset) in the database transaction log. If the connector crashes, it resumes reading from the last committed offset, ensuring no data loss.</li>
          </ul>
        `
      },
      {
        id: "performance-tuning",
        title: "Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Backpressure Management:</strong> If the downstream sink (e.g., Snowflake) is slower than the source DB changes, Kafka acts as a shock absorber. However, tuning Kafka retention policies is critical so events aren't dropped before the sink catches up.</li>
            <li><strong>Handling High-Throughput:</strong> For massive tables, a single Debezium task might bottleneck. Partitioning Kafka topics by the primary key ensures parallel processing downstream while maintaining strict chronological ordering of events for a specific row.</li>
            <li><strong>Snapshotting:</strong> When initiating CDC on an existing 5TB table, you can't just read the log (logs expire). You must perform an initial consistent snapshot. Debezium handles this automatically via locks and <code>SELECT *</code>, then seamlessly transitions to reading the log. Watermark-based incremental snapshotting avoids long table locks.</li>
          </ul>
        `
      },
      {
        id: "interview-patterns",
        title: "High-Frequency Interview Patterns",
        icon: "🧠",
        content: `
          <ul>
            <li><strong>CDC Extraction Patterns Comparison:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Pattern</th><th>Database Overhead</th><th>Delete Detection</th><th>Schema Evolution</th><th>Latency</th></tr>
                <tr><td><strong>Log-Based (Debezium/WAL)</strong></td><td>Near zero (reads binary logs directly)</td><td>Native (captures hard deletes & tombstones)</td><td>Native with Schema Registry</td><td>Sub-second (Real-time)</td></tr>
                <tr><td><strong>Query-Based (Timestamp Polling)</strong></td><td>High (Frequent <code>SELECT</code> scans lock tables)</td><td>Cannot detect hard deletes</td><td>Requires manual DDL migration</td><td>Minutes to hours (Batch polling)</td></tr>
                <tr><td><strong>Trigger-Based</strong></td><td>Severe (Fires synchronous inserts on every write)</td><td>Captures deletes via audit tables</td><td>Fragile; breaks on table schema alters</td><td>Real-time but degrades source TPS by 30-50%</td></tr>
              </table>
            </li>
            <li><strong>Production Debezium Kafka Connect Configuration (PostgreSQL WAL):</strong>
<pre><code>{
  "name": "postgres-cdc-orders-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",
    "plugin.name": "pgoutput",
    "database.hostname": "postgres-prod.internal",
    "database.port": "5432",
    "database.user": "debezium_cdc_user",
    "database.password": "\${file:/secrets/db-credentials.properties:password}",
    "database.dbname": "production",
    "database.server.name": "prod_db",
    "table.include.list": "public.orders,public.order_items",
    "tombstones.on.delete": "true",
    "decimal.handling.mode": "double",
    "key.converter": "io.confluent.connect.avro.AvroConverter",
    "key.converter.schema.registry.url": "http://schema-registry:8081",
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "value.converter.schema.registry.url": "http://schema-registry:8081"
  }
}</code></pre>
            </li>
            <li><strong>Handling Deletes & Tombstones:</strong> Log-based CDC emits an event with <code>op: "d"</code> and a null payload (Tombstone). Downstream streaming merges must evaluate <code>whenMatchedDelete()</code> or soft-delete (<code>is_deleted = true</code>) in the Silver layer.</li>
            <li><strong>Out-of-Order Events:</strong> Rely on the database transaction sequence (PostgreSQL LSN or MySQL GTID) rather than network arrival time. Always apply the change event with the highest sequence number.</li>
          </ul>
        `
      },
      {
        id: "interview-traps",
        title: "Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>Compacted Topics:</strong> Kafka topic compaction deletes older records with the same key, keeping only the latest. If downstream systems rely on seeing <em>every single historical change</em> (for SCD2), compaction will destroy the history. You must use standard retention for SCD2 feeds.</li>
            <li><strong>Schema Evolution Breaking Consumers:</strong> If a source DB changes a column type from INT to VARCHAR without coordination, the CDC connector might crash, or downstream parsers will fail. Schema Registry with strict compatibility rules prevents bad data from entering Kafka.</li>
            <li><strong>Tombstone Record Issues:</strong> If Kafka compaction is enabled, tombstone (delete) records eventually get purged. If a new consumer tries to bootstrap from the topic after purging, it won't know the record was deleted and will assume it still exists.</li>
          </ul>
        `
      }
    ]
  }
];
