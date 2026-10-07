// Auto-generated module: dataModeling
// Primary questions count: 17

export const dataModelingQuestions = [
  {
    "id": "dm-conceptual-logical-physical",
    "qNo": 17,
    "q": "What is data modeling, and explain the difference between conceptual, logical, and physical data models.",
    "a": "Data modeling is the process of defining how data is structured, stored, and related across your system to balance query performance with maintainability.\n\n- **Conceptual Model:** Defines high-level entities and relationships (e.g., 'Customer places Order'). Built for business stakeholders.\n- **Logical Model:** Adds attributes, data types, and primary/foreign keys without worrying about a specific database engine (e.g., specifying that Customer has an 'email' string).\n- **Physical Model:** The actual implementation code (DDL). Includes database-specific column types (VARCHAR vs STRING), indexes, partitions, and storage formats.",
    "complexity": "Basic",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "conceptual-model",
      "logical-model",
      "physical-model",
      "erd",
      "schema-design"
    ]
  },
  {
    "id": "dm-normalization-1nf-2nf-3nf",
    "qNo": 18,
    "q": "What is normalization? Walk through 1NF, 2NF, and 3NF, and explain when you should denormalize.",
    "a": "**Normalization** organizes data to reduce redundancy and enforce integrity.\n- **1NF:** Atomic column values and no repeating groups (e.g., no comma-separated lists in a column).\n- **2NF:** Eliminates partial dependencies. Every non-key column must depend on the *entire* primary key, not just part of a composite key.\n- **3NF:** Removes transitive dependencies. If Column C depends on Column B, which depends on Primary Key A, then C should live in a separate table.\n\n**Denormalization** adds deliberate redundancy to reduce expensive JOINs at query time. It is typically used in Data Warehouses (OLAP) where read performance is critical and writes/updates are infrequent.",
    "complexity": "Basic",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "normalization",
      "1nf",
      "2nf",
      "3nf",
      "oltp-modeling",
      "anomalies"
    ]
  },
  {
    "id": "dm-star-vs-snowflake-schema",
    "qNo": 19,
    "q": "What is a Star Schema, and how does it differ from a Snowflake Schema?",
    "a": "**Star Schema:** A central Fact table connects directly to multiple denormalized Dimension tables. It looks like a star. It minimizes JOINs (one hop) and is the default choice for modern analytics and BI tools.\n\n**Snowflake Schema:** A variation where the dimension tables are normalized into sub-dimensions (e.g., a `dim_product` table links to a `dim_category` table). This saves storage space by reducing redundancy but introduces multiple JOINs. \n\n*In modern columnar databases (BigQuery, Snowflake), storage is cheap but JOINs are expensive, making Star schemas generally preferred over Snowflake schemas.*",
    "complexity": "Basic",
    "topics": [
      "data-modeling",
      "bigquery"
    ],
    "tags": [
      "star-schema",
      "snowflake-schema",
      "dimensional-modeling",
      "kimball",
      "denormalization"
    ]
  },
  {
    "id": "dm-fact-vs-dimension-tables",
    "qNo": 20,
    "q": "What is the difference between a Fact table and a Dimension table?",
    "a": "**Fact Table:** Stores measurable, quantitative events or transactions (e.g., `order_amount`, `click_count`, `shipment_weight`). Facts are typically numeric and additive. They contain foreign keys pointing to dimension tables.\n\n**Dimension Table:** Stores descriptive context—the 'who, what, where, when, why' of an event (e.g., `customer_name`, `product_category`, `store_location`). Dimensions are wide and short, while facts are skinny and extremely long.",
    "complexity": "Basic",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "fact-table",
      "dimension-table",
      "metrics",
      "attributes",
      "cardinality"
    ]
  },
  {
    "id": "dm-surrogate-vs-natural-key",
    "qNo": 21,
    "q": "What is a Surrogate Key, and why is it preferred over a Natural Key in Data Warehousing?",
    "a": "**Natural Key:** A unique identifier that exists in the business data (e.g., `email`, `SSN`, `order_number`).\n\n**Surrogate Key:** A system-generated, auto-incrementing integer or UUID with absolutely no business meaning. \n\nSurrogate keys are heavily preferred in Data Warehouses because natural keys change over time (companies merge, users change emails, SKUs get reassigned). Surrogate keys insulate the warehouse from upstream business changes. Furthermore, joining on integer surrogate keys is significantly faster than joining on string-based natural keys.",
    "complexity": "Basic",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "surrogate-keys",
      "natural-keys",
      "dw-design",
      "scd-type-2",
      "identity"
    ]
  },
  {
    "id": "dm-grain-in-dimensional-modeling",
    "qNo": 22,
    "q": "What is 'Grain' in dimensional modeling, and why is it the most important decision?",
    "a": "**Grain** defines the exact level of detail stored in a single row of a fact table. \n\nFor example, the grain could be 'one row per order', 'one row per order line item', or 'one row per daily store inventory'.\n\nGetting the grain wrong is disastrous. If it's too coarse (e.g., aggregated to weekly sales), you lose the ability to drill down into daily trends. If it's undefined or mixed, you risk massive data duplication (fan-outs) and silently inflating business metrics.",
    "complexity": "Intermediate",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "grain",
      "dimensional-modeling",
      "atomic-data",
      "business-process"
    ]
  },
  {
    "id": "dm-fact-table-types",
    "qNo": 23,
    "q": "Explain the three main types of Fact Tables.",
    "a": "1. **Transaction Fact Table:** Records individual events. One row per action (e.g., one row per checkout). Highly granular but can grow massive.\n2. **Periodic Snapshot Fact Table:** Captures the state of entities at regular intervals. One row per entity per time period (e.g., a daily snapshot of a user's bank account balance or store inventory). Ideal for tracking trends over time.\n3. **Accumulating Snapshot Fact Table:** Tracks a workflow process with a defined beginning and end. One row per entity, with multiple timestamp columns updated as it moves through stages (e.g., order_placed_date, shipped_date, delivered_date).",
    "complexity": "Intermediate",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "transaction-fact",
      "periodic-snapshot",
      "accumulating-snapshot",
      "fact-types"
    ]
  },
  {
    "id": "dm-conformed-dimensions",
    "qNo": 24,
    "q": "What are Conformed Dimensions?",
    "a": "Conformed dimensions are dimension tables that are shared identically across multiple fact tables or data marts. \n\nFor example, a `dim_date` or `dim_customer` table used by both the Sales department's fact tables and the Support department's fact tables. This ensures enterprise-wide consistency, avoiding a scenario where Sales reports 50,000 customers but Marketing reports 48,000 due to different filtering logic.",
    "complexity": "Intermediate",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "conformed-dimensions",
      "data-bus-matrix",
      "enterprise-dw",
      "bus-architecture"
    ]
  },
  {
    "id": "dm-junk-degenerate-roleplaying-dims",
    "qNo": 25,
    "q": "Explain Junk, Degenerate, and Role-Playing Dimensions.",
    "a": "- **Degenerate Dimension:** A dimension key that lives directly in the fact table without a corresponding dimension table. Typically a transaction identifier like an `order_number` or `invoice_id` that provides grouping context but has no extra descriptive attributes.\n- **Junk Dimension:** A single dimension table that groups together miscellaneous, low-cardinality binary flags (e.g., `is_gift_wrapped`, `is_expedited`) to prevent cluttering the massive fact table with dozens of boolean columns.\n- **Role-Playing Dimension:** A single physical dimension table joined multiple times to the same fact table under different aliases. E.g., `dim_date` playing the role of `order_date`, `ship_date`, and `delivery_date`.",
    "complexity": "Intermediate",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "junk-dimension",
      "degenerate-dimension",
      "role-playing-dimension",
      "flags-indicators"
    ]
  },
  {
    "id": "dm-scd-type-1-2-3",
    "qNo": 26,
    "q": "What are Slowly Changing Dimensions (SCDs)? Explain Type 1, Type 2, and Type 3.",
    "a": "SCDs handle updates to dimension attributes over time (e.g., a customer moving from NY to CA).\n- **Type 1 (Overwrite):** Overwrites the old value with the new one. No historical record is kept. Simple, but breaks historical reporting.\n- **Type 2 (Add New Row):** Preserves full history. The old row is expired (setting an `end_date` and `is_current = false`), and a new row is inserted with the new value, `start_date`, and a new surrogate key. Most common approach in modern warehouses.\n- **Type 3 (Add Column):** Adds a 'previous_value' column alongside the 'current_value' column. Only keeps track of the single most recent change, rather than a full audit log. Rarely used.",
    "complexity": "Intermediate",
    "topics": [
      "data-modeling",
      "dbt",
      "databricks"
    ],
    "tags": [
      "scd",
      "scd-type-1",
      "scd-type-2",
      "scd-type-3",
      "history-tracking",
      "slowly-changing-dimensions"
    ]
  },
  {
    "id": "dm-many-to-many-bridge-tables",
    "qNo": 27,
    "q": "How do you handle many-to-many relationships in a star schema?",
    "a": "You use a **Bridge Table** (also known as a Factless Fact Table). \n\nFor example, a patient can have multiple diagnoses, and a single diagnosis applies to multiple patients. You insert a bridge table containing `patient_key` and `diagnosis_key` between the Fact and Dimension tables. This resolves the many-to-many relationship into two one-to-many relationships. \n\n*Caution:* When joining through bridge tables, you must apply weighting factors or distinct counts to prevent Cartesian explosion and double-counting metrics.",
    "complexity": "Intermediate",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "many-to-many",
      "bridge-tables",
      "star-schema",
      "weighting-factors"
    ]
  },
  {
    "id": "dm-kimball-vs-inmon",
    "qNo": 28,
    "q": "Explain the Kimball vs Inmon approaches to Data Warehousing.",
    "a": "**Kimball (Bottom-Up):** Focuses on building dimensional data marts (Star Schemas) specific to business processes first. These marts are integrated later via conformed dimensions. It delivers business value much faster and is heavily adopted in modern cloud environments.\n\n**Inmon (Top-Down):** Focuses on building a centralized, highly normalized (3NF) Enterprise Data Warehouse (EDW) as a single source of truth first. Dimensional data marts are then derived from this EDW. Slower to build, but strictly governed.",
    "complexity": "Intermediate",
    "topics": [
      "data-modeling",
      "distributed-systems"
    ],
    "tags": [
      "kimball",
      "inmon",
      "dw-architecture",
      "bottom-up-vs-top-down",
      "data-marts"
    ]
  },
  {
    "id": "dm-implement-scd-type-2-sql",
    "qNo": 29,
    "q": "How do you implement SCD Type 2 in SQL?",
    "a": "SCD Type 2 relies on comparing incoming staging data with the current dimension data to detect changes, expire old rows, and insert new ones.\n\n1. **Detect Changes:** Join the incoming staging data against `dim_table` where `is_current = TRUE` to find mismatched attributes (e.g., `staging.city != dim.city`).\n2. **Expire Old Rows:** Use an `UPDATE` statement on the mismatched records, setting `end_date = CURRENT_DATE` and `is_current = FALSE`.\n3. **Insert New Rows:** Use an `INSERT` statement to append the new incoming records, setting `start_date = CURRENT_DATE`, `end_date = '9999-12-31'`, and `is_current = TRUE`.",
    "complexity": "Complex",
    "topics": [
      "data-modeling",
      "advanced-sql",
      "dbt"
    ],
    "tags": [
      "scd-type-2",
      "merge-statement",
      "effective-dates",
      "sql-implementation",
      "current-flag"
    ],
    "codeSnippet": "MERGE INTO dim_customer target\nUSING staged_customer source\nON target.customer_id = source.customer_id AND target.is_current = TRUE\nWHEN MATCHED AND (target.address <> source.address) THEN\n    UPDATE SET target.end_date = CURRENT_DATE, target.is_current = FALSE;"
  },
  {
    "id": "dm-data-vault-modeling",
    "qNo": 30,
    "q": "What is Data Vault modeling?",
    "a": "Data Vault is a highly scalable modeling methodology optimized for auditability and agile enterprise integrations. It separates structure from content using three core tables:\n- **Hubs:** Store unique business keys (e.g., Customer ID) and load metadata.\n- **Links:** Store relationships (many-to-many associations) between Hubs.\n- **Satellites:** Store the descriptive attributes and historical changes (like an SCD Type 2) for a Hub or Link.\n\n*Pros:* Highly resilient to upstream schema changes. \n*Cons:* Massive table proliferation. A simple 5-table star schema might require 15+ Data Vault tables. It is typically used only for the raw/integration layer, with Star Schemas built as virtual views on top for business consumption.",
    "complexity": "Complex",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "data-vault",
      "hubs",
      "links",
      "satellites",
      "enterprise-dw",
      "auditability"
    ]
  },
  {
    "id": "dm-late-arriving-dimensions",
    "qNo": 31,
    "q": "How do you handle 'Late-Arriving Dimensions'?",
    "a": "A late-arriving dimension happens when a fact record (transaction) arrives in the pipeline before its corresponding master dimension data (e.g., an order arrives for a customer ID that hasn't been ingested yet).\n\nIf you simply drop the fact, you lose revenue data. If you insert a NULL foreign key, you break inner joins.\n\n**Solution:** Insert a 'stub' or 'dummy' row into the dimension table. Assign it a valid surrogate key, the missing natural key, and placeholder values (e.g., 'Unknown'). Link the fact table to this surrogate key. When the actual dimension data finally arrives, update the dummy row with the real attributes.",
    "complexity": "Complex",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "late-arriving-dimensions",
      "fact-processing",
      "placeholder-records",
      "backfills"
    ]
  },
  {
    "id": "dm-mini-dimension-rapid-changes",
    "qNo": 32,
    "q": "What is a Mini-Dimension, and when would you use it?",
    "a": "If you have a massive dimension table (e.g., 100 million customers) and certain attributes change very frequently (e.g., `loyalty_points_tier`, `credit_score_band`), applying standard SCD Type 2 would cause the table to explode in size due to constant versioning.\n\n**Solution:** Extract the volatile attributes into a separate, smaller table called a **Mini-Dimension**. This table contains every possible combination of those volatile attributes. The Fact table is then updated to hold two foreign keys: one pointing to the main static `dim_customer` and one pointing to the volatile `dim_customer_profile`.",
    "complexity": "Complex",
    "topics": [
      "data-modeling"
    ],
    "tags": [
      "mini-dimension",
      "rapidly-changing-attributes",
      "profiling",
      "banding"
    ]
  },
  {
    "id": "dm-sql-grain-violation-check",
    "qNo": 33,
    "q": "Write a SQL query to identify grain violations (duplicate rows) in a fact table.",
    "a": "Grain violations are the #1 cause of silently inflated metrics. To check for them, group by the columns that define your grain (e.g., `order_id` and `product_id` for an order-line grain) and filter for counts greater than 1.\n\n```sql\nSELECT \n    order_id, \n    product_id, \n    COUNT(*) as row_count \nFROM fact_sales \nGROUP BY \n    order_id, \n    product_id \nHAVING COUNT(*) > 1 \nORDER BY row_count DESC;\n```\nIf this returns any rows, your ETL pipeline has a fanning issue or missing deduplication logic.",
    "complexity": "Complex",
    "topics": [
      "data-modeling",
      "advanced-sql"
    ],
    "tags": [
      "grain-violations",
      "data-quality",
      "sql-assertions",
      "group-by-having"
    ],
    "codeSnippet": "SELECT order_id, product_id, COUNT(*) as duplicate_count\nFROM fact_order_lines\nGROUP BY order_id, product_id\nHAVING COUNT(*) > 1;"
  }
];
