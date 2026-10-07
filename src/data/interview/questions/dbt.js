// Auto-generated module: dbt
// Primary questions count: 16

export const dbtQuestions = [
  {
    "id": "dbt-overview-and-problem-solved",
    "qNo": 34,
    "q": "What is dbt, and what problem does it solve for data teams?",
    "a": "**dbt (data build tool)** is an open-source transformation workflow that lets analysts and engineers write modular SQL `SELECT` statements, while dbt handles the underlying DDL/DML to materialize them in the data warehouse.\n\n**Problem solved:** Before dbt, teams maintained hundreds of hand-written `CREATE TABLE` and `INSERT` statements via CRON jobs with no version control, automated testing, or lineage. dbt treats SQL transformations as software engineering by providing built-in Git integration, CI/CD, documentation, testing, and dependency graphs (DAG). \n\n*Note: dbt does not extract or load data (it is the 'T' in ELT); it only transforms what is already in the warehouse.*",
    "complexity": "Basic",
    "topics": [
      "dbt"
    ],
    "tags": [
      "dbt-core",
      "elt-framework",
      "analytics-engineering",
      "sql-compilation"
    ]
  },
  {
    "id": "dbt-model-definition-and-sql",
    "qNo": 35,
    "q": "What is a dbt model?",
    "a": "A model is simply a single SQL `SELECT` statement saved as a `.sql` file in your `models/` directory.\n\nWhen you execute `dbt run`, dbt automatically wraps that `SELECT` statement in the appropriate DDL (like `CREATE TABLE`, `CREATE VIEW`, `MERGE`, etc.) based on your materialization configuration. Models are the atomic unit of transformation in dbt; every other feature (tests, documentation, lineage) attaches to these models.",
    "complexity": "Basic",
    "topics": [
      "dbt"
    ],
    "tags": [
      "models",
      "select-statements",
      "transformations",
      "dry-code"
    ]
  },
  {
    "id": "dbt-materializations-comparison",
    "qNo": 36,
    "q": "What are the four built-in materializations in dbt, and when do you use each?",
    "a": "1. **view:** Used for lightweight transformations that don't need to persist data on disk. The warehouse re-executes the SQL on every query. Good for staging layers.\n2. **table:** Rebuilds the entire table from scratch on every run. Used when downstream consumers need fast reads, and the dataset is small enough that a full rebuild isn't too expensive.\n3. **incremental:** Used for massive fact tables where rebuilding every time is too slow or costly. It only transforms and loads 'new' or 'changed' records.\n4. **ephemeral:** Used for reusable CTEs that you never want materialized as their own physical object in the database. dbt directly inlines the SQL into the downstream model's compiled query.",
    "complexity": "Basic",
    "topics": [
      "dbt",
      "bigquery",
      "data-modeling"
    ],
    "tags": [
      "materializations",
      "view",
      "table",
      "incremental",
      "ephemeral",
      "cost-tradeoffs"
    ]
  },
  {
    "id": "dbt-ref-function-dag",
    "qNo": 37,
    "q": "What does the `ref()` function do, and why is it critical?",
    "a": "`{{ ref('model_name') }}` resolves to the fully qualified table name of another dbt model in your warehouse, and simultaneously registers a dependency in the dbt Directed Acyclic Graph (DAG).\n\nWithout `ref()`, dbt has no idea that Model B depends on Model A. It might run them in the wrong order or in parallel, causing query failures or stale data. You should *never* hardcode schema-qualified table names in your SQL; always use `ref()`.",
    "complexity": "Basic",
    "topics": [
      "dbt"
    ],
    "tags": [
      "ref",
      "lineage",
      "dag-orchestration",
      "dependencies",
      "environment-switching"
    ],
    "codeSnippet": "SELECT customer_id, SUM(order_total) AS lifetime_value\nFROM {{ ref('stg_orders') }}\nGROUP BY customer_id"
  },
  {
    "id": "dbt-source-vs-ref",
    "qNo": 38,
    "q": "What is `source()` and how does it differ from `ref()`?",
    "a": "`{{ source('source_name', 'table_name') }}` points to raw tables that already exist in your warehouse but are *not* managed by dbt (e.g., data landed by Fivetran or Airbyte).\n\n**Difference:**\n- `ref()` points to dbt-managed models (your transformations).\n- `source()` points to external raw tables.\n\nDefining sources (in a `schema.yml` file) allows you to use the `source()` function in your SQL, adding the raw tables to your DAG and enabling automated **source freshness checks**.",
    "complexity": "Basic",
    "topics": [
      "dbt",
      "data-governance"
    ],
    "tags": [
      "source",
      "ref",
      "raw-data-governance",
      "source-freshness"
    ]
  },
  {
    "id": "dbt-run-vs-dbt-build",
    "qNo": 39,
    "q": "Explain the difference between `dbt run` and `dbt build`.",
    "a": "- **`dbt run`:** Executes *only* the models. It does not run tests.\n- **`dbt build`:** Runs models, tests, snapshots, and seeds in strictly DAG order. This means it runs a model, immediately runs its tests, and *only* continues to downstream models if those tests pass.\n\n`dbt build` is the safer default for CI/CD pipelines because it catches test failures before they cascade downstream.",
    "complexity": "Basic",
    "topics": [
      "dbt",
      "cicd-devops"
    ],
    "tags": [
      "dbt-run",
      "dbt-build",
      "execution-lifecycle",
      "ci-cd",
      "fail-fast"
    ]
  },
  {
    "id": "dbt-dag-and-execution-order",
    "qNo": 40,
    "q": "What is the dbt DAG, and why does execution order matter?",
    "a": "The DAG (Directed Acyclic Graph) is the dependency graph built dynamically from every `ref()` and `source()` call across your dbt project.\n\ndbt uses the DAG to determine the exact execution order. Models with no upstream dependencies run first, and dbt parallelizes independent branches to optimize performance. If you break the DAG (e.g., by hardcoding table names instead of using `ref()`), dbt will process models out of order, leading to failures or propagating stale data.",
    "complexity": "Intermediate",
    "topics": [
      "dbt"
    ],
    "tags": [
      "dag",
      "concurrency",
      "topological-sort",
      "thread-allocation"
    ]
  },
  {
    "id": "dbt-schema-tests-built-in",
    "qNo": 41,
    "q": "What are schema tests in dbt, and what are the built-in tests?",
    "a": "Schema tests are assertions declared in YAML (`schema.yml`) that dbt compiles into SQL queries to run against your models. If the test query returns any rows (count > 0), the test fails.\n\nThere are four built-in schema tests:\n1. **`unique`:** Ensures all values in a column are unique.\n2. **`not_null`:** Ensures no values in a column are NULL.\n3. **`accepted_values`:** Ensures all values in a column match a predefined list (e.g., ['placed', 'shipped', 'delivered']).\n4. **`relationships`:** Enforces referential integrity (similar to a Foreign Key) by ensuring a value exists in another model.",
    "complexity": "Intermediate",
    "topics": [
      "dbt",
      "data-governance"
    ],
    "tags": [
      "schema-tests",
      "unique",
      "not-null",
      "accepted-values",
      "relationships"
    ]
  },
  {
    "id": "dbt-schema-vs-data-singular-tests",
    "qNo": 42,
    "q": "What is the difference between Schema tests and Data (singular) tests?",
    "a": "- **Schema tests:** Configured in YAML. They are highly reusable and apply to specific columns or models (e.g., `not_null`, `unique`).\n- **Data (singular) tests:** Standalone SQL files placed in your `tests/` directory. They are used for complex business logic assertions that don't fit a generic YAML format (e.g., `SELECT * FROM {{ ref('orders') }} WHERE order_date > ship_date`). If the SQL returns any rows, the test fails.",
    "complexity": "Intermediate",
    "topics": [
      "dbt",
      "data-governance"
    ],
    "tags": [
      "singular-tests",
      "generic-tests",
      "data-quality",
      "assertion-queries"
    ]
  },
  {
    "id": "dbt-custom-generic-tests",
    "qNo": 43,
    "q": "How do you write a custom generic test in dbt?",
    "a": "You can create a SQL file in `tests/generic/` (or `macros/`) that accepts arguments and returns failing rows. \n\nFor example:\n```sql\n{% test is_positive(model, column_name) %}\n    SELECT * \n    FROM {{ model }} \n    WHERE {{ column_name }} < 0\n{% endtest %}\n```\nOnce defined, you can apply it instantly in your YAML file under any column's tests block just like a built-in test:\n```yaml\ntests:\n  - is_positive\n```\nThis allows you to scale custom data quality checks across hundreds of models effortlessly.",
    "complexity": "Intermediate",
    "topics": [
      "dbt",
      "data-governance"
    ],
    "tags": [
      "custom-tests",
      "macros",
      "test-automation",
      "jinja"
    ],
    "codeSnippet": "{% test is_positive(model, column_name) %}\nSELECT {{ column_name }}\nFROM {{ model }}\nWHERE {{ column_name }} <= 0\n{% endtest %}"
  },
  {
    "id": "dbt-source-freshness",
    "qNo": 44,
    "q": "What is source freshness, and how do you configure it?",
    "a": "Source freshness checks whether raw tables have been updated recently, preventing dbt from transforming stale data.\n\nYou configure it in your `sources.yml` by defining a `loaded_at_field` (a timestamp column) and setting freshness thresholds (`warn_after` and `error_after`). \n\nWhen you run `dbt source freshness`, dbt checks if the maximum timestamp in the raw table is older than the threshold and throws an alert before your pipeline even runs.",
    "complexity": "Intermediate",
    "topics": [
      "dbt",
      "data-governance"
    ],
    "tags": [
      "source-freshness",
      "sla-monitoring",
      "data-staleness",
      "loaded-at-field"
    ]
  },
  {
    "id": "dbt-exposures-downstream-lineage",
    "qNo": 45,
    "q": "What are exposures in dbt?",
    "a": "Exposures are YAML declarations of the downstream consumers of your dbt models (e.g., a Tableau Dashboard, a Machine Learning model, or a Reverse ETL sync).\n\nBy defining exposures, they appear at the very end of your lineage graph. This allows data engineers to perform impact analysis before refactoring a model. Without exposures, someone might alter a model like `fct_revenue` without realizing it will break the CEO's primary dashboard.",
    "complexity": "Intermediate",
    "topics": [
      "dbt",
      "data-governance"
    ],
    "tags": [
      "exposures",
      "bi-tools",
      "lineage-tracking",
      "impact-analysis"
    ]
  },
  {
    "id": "dbt-incremental-models-under-the-hood",
    "qNo": 46,
    "q": "How does an incremental model work under the hood?",
    "a": "On the first run (or during a `--full-refresh`), dbt creates the table with a standard full `SELECT` statement.\n\nOn subsequent runs, dbt compiles your code into a `MERGE`, `INSERT`, or `DELETE+INSERT` statement that only processes new or changed rows. You control which rows are considered \"new\" by using the `is_incremental()` macro to filter on a timestamp or event ID. Under the hood, dbt is just compiling standard DML statements that your specific data warehouse executes natively.",
    "complexity": "Complex",
    "topics": [
      "dbt",
      "advanced-sql"
    ],
    "tags": [
      "incremental-models",
      "merge",
      "temp-tables",
      "idempotency",
      "watermark"
    ]
  },
  {
    "id": "dbt-is-incremental-macro",
    "qNo": 47,
    "q": "What is the `is_incremental()` macro, and how is it typically used?",
    "a": "`is_incremental()` is a Jinja macro that evaluates to `True` only if the model already exists as a table in the database and the current run is *not* a full refresh.\n\nIt is used to dynamically inject a `WHERE` clause to filter for new data:\n```sql\nSELECT * \nFROM {{ source('raw', 'events') }}\n\n{% if is_incremental() %}\n  WHERE event_timestamp > (SELECT MAX(event_timestamp) FROM {{ this }})\n{% endif %}\n```\n*Note: `{{ this }}` is a special variable referring to the already-materialized table in the database.*",
    "complexity": "Complex",
    "topics": [
      "dbt"
    ],
    "tags": [
      "is_incremental",
      "jinja",
      "high-watermark",
      "filtering"
    ],
    "codeSnippet": "{{ config(materialized='incremental', unique_key='order_id') }}\nSELECT * FROM {{ ref('stg_orders') }}\n{% if is_incremental() %}\n  WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})\n{% endif %}"
  },
  {
    "id": "dbt-incremental-strategies",
    "qNo": 48,
    "q": "What are the four incremental strategies, and when do you pick each?",
    "a": "1. **append:** Blindly adds new rows. Use when you are certain there are no late-arriving duplicates (e.g., immutable event logs).\n2. **merge:** Performs an upsert based on a `unique_key`. Use when rows can be updated (e.g., an order status changing from 'pending' to 'shipped').\n3. **delete+insert:** Deletes matching rows first, then inserts. Use on warehouses where `MERGE` is computationally expensive or unsupported.\n4. **insert_overwrite:** Replaces entire partitions efficiently. Highly recommended for partition-aware warehouses like BigQuery or Spark when processing massive daily batches.",
    "complexity": "Complex",
    "topics": [
      "dbt",
      "bigquery",
      "databricks"
    ],
    "tags": [
      "incremental-strategies",
      "merge",
      "delete-insert",
      "append",
      "insert-overwrite",
      "partitions"
    ]
  },
  {
    "id": "dbt-missing-unique-key-merge",
    "qNo": 49,
    "q": "What happens if you forget to set a `unique_key` on a merge incremental model?",
    "a": "If you configure an incremental model to use the `merge` strategy but forget to define the `unique_key` in the configuration block, dbt has no way to identify matching rows for upserts.\n\nAs a result, dbt falls back to essentially doing an `INSERT`, meaning every row processed by the incremental SELECT will be blindly appended, even if those rows already exist in the target table. This leads to compounding duplicates on every run—one of the most common production bugs in dbt.",
    "complexity": "Complex",
    "topics": [
      "dbt"
    ],
    "tags": [
      "unique-key",
      "merge-failure",
      "duplicate-records",
      "append-fallback"
    ]
  }
];
