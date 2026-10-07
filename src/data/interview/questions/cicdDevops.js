// Auto-generated module: cicdDevops
// Primary questions count: 6

export const cicdDevopsQuestions = [
  {
    "id": "devops-end-to-end-de-cicd-pipeline-github-actions",
    "qNo": 130,
    "q": "Design an end-to-end CI/CD pipeline for a modern data engineering platform (dbt, PySpark, Airflow) using GitHub Actions. What are the specific stages from PR to production deployment?",
    "a": "Modern Data DevOps (DataOps) applies software engineering best practices to data pipelines: automated linting, unit testing, PR previews, and zero-downtime deployment.\n\n### 1. Architecture of a DataOps Pipeline\n```\n[ Developer Branch ]\n         |\n         +--> PR Created:\n         |    Stage 1: Linting & Static Analysis (Black, Flake8, SQLFluff)\n         |    Stage 2: Unit Testing (pytest, Chispa for PySpark)\n         |    Stage 3: dbt Slim CI (Build only modified models against ephemeral PR schema)\n         |    Stage 4: Airflow DAG Integrity Tests\n         |\n         v\n[ Merge to Main ]\n         |\n         +--> Stage 5: Build & Push Docker Images (Artifact Registry / ECR)\n         +--> Stage 6: Deploy dbt Docs & Lineage\n         +--> Stage 7: Sync DAGs to Production Composer / Airflow Bucket\n```\n\n### 2. GitHub Actions Workflow Configuration\n```yaml\nname: Data Engineering CI/CD\n\non:\n  pull_request:\n    branches: [ main ]\n  push:\n    branches: [ main ]\n\njobs:\n  lint-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n\n      - name: Set up Python\n        uses: actions/setup-python@v4\n        with:\n          python-version: '3.10'\n          cache: 'pip'\n\n      - name: Install Dependencies\n        run: |\n          pip install black flake8 sqlfluff pytest chispa dbt-bigquery\n\n      - name: SQL & Python Linting\n        run: |\n          black --check src/\n          flake8 src/\n          sqlfluff lint models/ --dialect bigquery\n\n      - name: PySpark Unit Tests\n        run: |\n          pytest tests/unit/\n\n      - name: Airflow DAG Integrity Test\n        run: |\n          pytest tests/test_dag_integrity.py\n\n  dbt-slim-ci:\n    needs: lint-and-test\n    if: github.event_name == 'pull_request'\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Run dbt Slim CI against PR Schema\n        env:\n          DBT_SCHEMA: pr_${{ github.event.number }}\n        run: |\n          dbt deps\n          # Compile and run ONLY modified models and their first-order children\n          dbt build --select state:modified+ --defer --state ./prod-manifest/\n\n  deploy-prod:\n    needs: lint-and-test\n    if: github.event_name == 'push' && github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Authenticate to GCP\n        uses: google-github-actions/auth@v1\n        with:\n          credentials_json: ${{ secrets.GCP_SA_KEY }}\n\n      - name: Sync Airflow DAGs to Composer Bucket\n        run: |\n          gsutil -m rsync -r -d ./dags/ gs://my-composer-bucket/dags/\n```",
    "complexity": "Complex",
    "topics": [
      "cicd-devops",
      "dbt",
      "cloud-composer"
    ],
    "tags": [
      "ci-cd-pipelines",
      "github-actions",
      "sqlfluff",
      "dbt-ci",
      "airflow-dag-validation",
      "automated-deployment"
    ],
    "codeSnippet": "# Airflow DAG Integrity Test to catch syntax/import bugs in CI\ndef test_no_import_errors():\n    from airflow.models import DagBag\n    dag_bag = DagBag(dag_folder=\"dags/\", include_examples=False)\n    assert len(dag_bag.import_errors) == 0, f\"DAG import errors: {dag_bag.import_errors}\""
  },
  {
    "id": "devops-data-pipeline-testing-py-spark-dbt-ephemeral",
    "qNo": 131,
    "q": "Explain testing pyramids in Data Engineering. How do you implement Unit Tests for PySpark (using Chispa/pytest), Integration Tests with ephemeral schemas, and dbt Slim CI?",
    "a": "Testing data pipelines requires validating business logic, schema contracts, and data quality across different granularities.\n\n### 1. The Data Testing Pyramid\n```\n          /\\\n         /  \\      End-to-End Tests (Full pipeline run against staging environment)\n        /----\\\n       /      \\    Integration Tests (Ephemeral PR schemas, Testcontainers)\n      /--------\\\n     /          \\  Unit Tests (PySpark transform functions on synthetic DataFrames)\n    /------------\\\n```\n\n### 2. Unit Testing PySpark with `pytest` and `chispa`\nUnit testing in data engineering should test **pure transformation functions** without connecting to real databases:\n```python\nimport pytest\nfrom pyspark.sql import SparkSession\nfrom chispa.dataframe_comparer import assert_df_equality\nfrom src.transforms import calculate_customer_tiers\n\n@pytest.fixture(scope=\"session\")\ndef spark():\n    return SparkSession.builder.master(\"local[2]\").appName(\"unit-tests\").getOrCreate()\n\ndef test_calculate_customer_tiers(spark):\n    # Arrange: Create minimal synthetic input DataFrame\n    input_data = [(\"Alice\", 1500.0), (\"Bob\", 200.0), (\"Charlie\", 50.0)]\n    input_df = spark.createDataFrame(input_data, [\"customer_name\", \"total_spend\"])\n\n    # Act: Call pure transformation function\n    actual_df = calculate_customer_tiers(input_df)\n\n    # Assert: Compare against expected DataFrame\n    expected_data = [(\"Alice\", \"PLATINUM\"), (\"Bob\", \"GOLD\"), (\"Charlie\", \"BRONZE\")]\n    expected_df = spark.createDataFrame(expected_data, [\"customer_name\", \"tier\"])\n\n    assert_df_equality(actual_df, expected_df, ignore_nullable=True)\n```\n\n### 3. dbt Slim CI (Fast, Cost-Effective PR Testing)\nIn a project with 1,000 dbt models, running `dbt build` on every PR would take 45 minutes and cost hundreds of dollars in BigQuery/Snowflake compute.\n- **Slim CI Mechanism:**\n  1. Download the production `manifest.json` from the latest production deployment.\n  2. Run dbt with the **`state:modified+`** selector and the **`--defer`** flag:\n```bash\ndbt build --select state:modified+ --defer --state ./prod_manifest/\n```\n  3. **How Defer Works:** If Model C depends on Model B, and only Model B was changed in the PR, dbt builds Model B into an isolated PR schema (`pr_123.model_b`). When building Model C, dbt reads directly from production Model A without rebuilding it!",
    "complexity": "Intermediate",
    "topics": [
      "cicd-devops",
      "data-governance",
      "dbt"
    ],
    "tags": [
      "unit-testing-spark",
      "chispa",
      "testcontainers",
      "dbt-slim-ci",
      "regression-testing",
      "testing-pyramid"
    ],
    "codeSnippet": "# dbt Slim CI command in GitHub Actions\ndbt build --select state:modified+ --defer --state ./prod-manifest/ --target ci"
  },
  {
    "id": "devops-docker-containerization-for-data-workloads",
    "qNo": 132,
    "q": "How do you design optimized Docker containers for data workloads (Airflow, Spark)? Detail multi-stage builds, dependency isolation, and image size optimization.",
    "a": "Data engineering container images often suffer from bloat, ballooning past 5GB due to heavy Python packages (Pandas, PySpark, NumPy, Torch), Java JDKs, and compilation toolchains. Bloated images slow down CI/CD builds and Kubernetes pod auto-scaling times.\n\n### 1. Multi-Stage Dockerfile Strategy\nUse **multi-stage builds** to compile C-extensions and wheels in a heavy build container, copying only the final compiled artifacts into a slim runtime image:\n\n```dockerfile\n# ==========================================\n# Stage 1: Build stage (heavy build tools)\n# ==========================================\nFROM python:3.10-slim AS builder\n\nWORKDIR /build\n\nRUN apt-get update && apt-get install -y --no-install-recommends \\\n    gcc \\\n    g++ \\\n    libpq-dev \\\n    && rm -rf /var/lib/apt/lists/*\n\nCOPY requirements.txt .\n# Compile wheels locally into a wheelhouse\nRUN pip wheel --no-cache-dir --wheel-dir=/build/wheels -r requirements.txt\n\n# ==========================================\n# Stage 2: Minimal Runtime Image\n# ==========================================\nFROM python:3.10-slim AS runner\n\nWORKDIR /app\n\n# Install minimal system dependencies (e.g. OpenJDK headless for Spark)\nRUN apt-get update && apt-get install -y --no-install-recommends \\\n    openjdk-17-jre-headless \\\n    libpq5 \\\n    && rm -rf /var/lib/apt/lists/*\n\n# Copy pre-compiled wheels from builder stage\nCOPY --from=builder /build/wheels /wheels\nRUN pip install --no-cache-dir /wheels/* && rm -rf /wheels\n\n# Create non-root user for security compliance\nRUN useradd -m -u 1000 appuser\nUSER appuser\n\nCOPY --chown=appuser:appuser src/ /app/src/\n\nENV PYTHONPATH=\"/app\"\nENTRYPOINT [\"python\", \"-m\", \"src.main\"]\n```\n\n### 2. Best Practices for Data Images\n1. **Never Run as Root:** Always configure `USER appuser` to prevent container escape vulnerabilities.\n2. **Combine RUN Commands:** Every `RUN` instruction adds a filesystem layer. Combine package installation and cache cleanup in a single statement (`apt-get install ... && rm -rf /var/lib/apt/lists/*`).\n3. **Pin Dependencies Strictly:** Use `pip-tools` or `Poetry` (`poetry.lock`) to guarantee identical dependencies across dev, CI, and production.",
    "complexity": "Intermediate",
    "topics": [
      "cicd-devops",
      "pyspark",
      "cloud-composer"
    ],
    "tags": [
      "docker",
      "multi-stage-builds",
      "spark-images",
      "cve-scanning",
      "container-size-optimization",
      "security"
    ],
    "codeSnippet": "# Checking image layer sizes to identify container bloat\ndocker history --human --format \"{{.Size}}\t{{.CreatedBy}}\" my-spark-image:latest"
  },
  {
    "id": "devops-git-branching-trunk-based-vs-gitflow-data",
    "qNo": 133,
    "q": "Compare Trunk-Based Development vs. GitFlow in Analytics and Data Engineering. How do ephemeral schemas and feature flags prevent integration hell in dbt and data pipelines?",
    "a": "Choosing the right branching strategy dictates how quickly data teams can ship changes to warehouse models without breaking production dashboards.\n\n### 1. GitFlow vs. Trunk-Based Development\n\n| Dimension | GitFlow | Trunk-Based Development (Modern DataOps) |\n| :--- | :--- | :--- |\n| **Branches** | `feature`, `develop`, `release`, `hotfix`, `main` | Short-lived `feature` branches, single `main` branch |\n| **Branch Lifetime** | Weeks to months | 1 to 2 days maximum |\n| **Merge Overhead** | High (\"Merge Hell\", resolving massive SQL conflicts) | Low (small, frequent merges) |\n| **Environment Link**| `develop` $\\rightarrow$ Dev, `release` $\\rightarrow$ Stage, `main` $\\rightarrow$ Prod | Ephemeral PR schemas for testing, `main` $\\rightarrow$ Prod |\n\n### 2. Why GitFlow Fails for Data Engineering\nIn traditional software, code can run in isolation on a test server. In data engineering, **code is tightly coupled to massive datasets**:\n- If a developer maintains a feature branch for 3 weeks changing a core customer staging model in dbt, other engineers continue building models on top of the old staging schema in `develop`.\n- Merging after a month causes semantic data drift, schema mismatches, and broken downstream dashboards.\n\n### 3. Trunk-Based Development with Ephemeral Schemas\n1. **Short-Lived Branches:** A developer creates a branch for a single atomic task (e.g. `add-churn-score-to-customers`).\n2. **Ephemeral PR Schemas:** CI deploys the modified model into a temporary schema (`analytics_pr_412`). Data analysts review the output and run automated schema checks.\n3. **Merge and Destroy:** When the PR is merged to `main`, GitHub Actions runs the deployment to production and immediately drops `analytics_pr_412`.\n4. **Feature Flags in SQL:** Use dbt Jinja variables as feature flags to safely deploy half-finished features without breaking production queries:\n```sql\nSELECT\n    order_id,\n    customer_id,\n    {% if var('enable_new_pricing_engine', false) %}\n        new_price_calculated AS final_price\n    {% else %}\n        standard_price AS final_price\n    {% endif %}\nFROM raw_orders\n```",
    "complexity": "Intermediate",
    "topics": [
      "cicd-devops",
      "dbt"
    ],
    "tags": [
      "trunk-based-development",
      "gitflow",
      "analytics-engineering-pr",
      "feature-flags",
      "merge-strategies",
      "ephemeral-schemas"
    ],
    "codeSnippet": "-- Feature flag implementation in dbt model\n{{ config(materialized='table') }}\nSELECT order_id,\n{% if var('use_experimental_feature', false) %}\n    ai_calculated_score\n{% else %}\n    rule_based_score\n{% endif %} AS risk_score\nFROM {{ ref('stg_transactions') }}"
  },
  {
    "id": "devops-iac-terraform-and-cloud-secrets-management",
    "qNo": 134,
    "q": "How do you manage data infrastructure and security using Terraform and Cloud Secret Managers? Demonstrate declarative IaC for cloud storage and secret injection.",
    "a": "Infrastructure as Code (IaC) ensures data platforms are reproducible, auditable, and version-controlled. Manual clicking in cloud consoles leads to configuration drift, security gaps, and lost deployment history.\n\n### 1. Terraform Architecture for Data Platforms\n1. **Remote State Locking:** Store the `terraform.tfstate` file in an encrypted cloud bucket (GCS/S3) with state locking via Cloud Storage or DynamoDB to prevent concurrent modifications.\n2. **Modular Architecture:** Split infrastructure into decoupled modules:\n   - `modules/storage`: ADLS Gen2 containers / GCS buckets with lifecycle policies.\n   - `modules/warehouse`: BigQuery datasets, Snowflake databases, or Synapse workspaces.\n   - `modules/iam`: Service accounts, least-privilege role bindings.\n   - `modules/orchestration`: Cloud Composer / Managed Airflow environments.\n\n### 2. Declarative Terraform Snippet (GCP Data Infrastructure)\n```hcl\n# Provisioning a Data Lake storage bucket with lifecycle compaction and CMEK\nresource \"google_storage_bucket\" \"data_lake_silver\" {\n  name          = \"enterprise-lakehouse-silver-prod\"\n  location      = \"US\"\n  storage_class = \"STANDARD\"\n\n  uniform_bucket_level_access = true\n\n  versioning {\n    enabled = true\n  }\n\n  lifecycle_rule {\n    condition {\n      age = 90\n    }\n    action {\n      type          = \"SetStorageClass\"\n      storage_class = \"NEARLINE\"\n    }\n  }\n}\n\n# Provisioning BigQuery Dataset with strict access controls\nresource \"google_bigquery_dataset\" \"analytics_dw\" {\n  dataset_id                  = \"analytics_dw\"\n  friendly_name               = \"Production Analytics DW\"\n  location                    = \"US\"\n  default_table_expiration_ms = null\n\n  access {\n    role          = \"OWNER\"\n    user_by_email = google_service_account.pipeline_sa.email\n  }\n}\n```\n\n### 3. Zero Credential Leaks with Cloud Secrets Management\n- **Anti-Pattern:** Storing database passwords in `terraform.tfvars` or environment variables checked into Git.\n- **Pattern:** Provision a Secret Manager secret resource. Inject the secret value dynamically via an external CI/CD vault or automated rotation pipeline, ensuring plain-text credentials never touch repository code.",
    "complexity": "Intermediate",
    "topics": [
      "cicd-devops",
      "azure",
      "data-governance"
    ],
    "tags": [
      "terraform",
      "iac",
      "secret-manager",
      "key-vault",
      "zero-credential-leaks",
      "drift-detection",
      "infrastructure-as-code"
    ],
    "codeSnippet": "# Fetching secret securely in Terraform without hardcoding\ndata \"google_secret_manager_secret_version\" \"db_password\" {\n  secret  = \"rds-postgres-prod-password\"\n  version = \"latest\"\n}"
  },
  {
    "id": "devops-zero-downtime-schema-evolution-blue-green",
    "qNo": 135,
    "q": "How do you execute Zero-Downtime Data Deployments and Schema Migrations for 24/7 analytics? Explain Blue/Green Schemas, View Layer Abstraction, and Shadow Pipelines.",
    "a": "In mission-critical enterprise environments, dropping a column or modifying a table schema cannot take down downstream executive dashboards or customer-facing reporting APIs.\n\n### 1. View Layer Abstraction (Logical vs. Physical Decoupling)\nNever allow BI tools, microservices, or analysts to query physical tables directly. Always place a **View Layer** in front of physical tables:\n```\n[ BI Dashboards / APIs ]\n           |\n           v\n[ Logical View: v_orders ] (Stable API Contract)\n           |\n           v\n[ Physical Table: orders_v2 ]\n```\n- If you need to refactor the underlying physical table (re-clustering, altering data types, changing partitioning), you build the new physical table in the background.\n- Once populated, you execute an instantaneous atomic update to the view definition (`CREATE OR REPLACE VIEW v_orders AS SELECT ... FROM orders_v2`). Downstream consumers experience zero downtime.\n\n### 2. Blue/Green Schema Deployments\nWhen a major release requires rewriting an entire suite of dimensional models:\n1. **Blue Environment (Active):** Production queries currently read from `prod_dw_blue`.\n2. **Green Environment (Staging):** The CI/CD pipeline builds the entire updated data warehouse into an identical schema called `prod_dw_green`.\n3. **Data Quality & Parity Audit:** Automated regression tests run comparing row counts, financial metric sums, and null counts between Blue and Green.\n4. **The Atomic Switch:** Switch database synonyms or pointer views from Blue to Green. If any unforeseen error emerges post-switch, rolling back is an instantaneous pointer change back to Blue!\n\n### 3. Safe Schema Evolution Rules\n- **Additive Changes are Safe:** Adding a new nullable column or adding a column with a default value does not break existing `SELECT colA, colB` queries.\n- **Breaking Changes Require Deprecation Periods:**\n  - Never drop or rename a column immediately.\n  - Phase 1: Add the new column (`customer_uuid`). Populate both `customer_id` and `customer_uuid`.\n  - Phase 2: Announce deprecation via data contracts and metadata catalogs.\n  - Phase 3: Monitor query access logs for 30 days. When queries on the old column hit zero, drop the legacy column.",
    "complexity": "Complex",
    "topics": [
      "cicd-devops",
      "data-modeling",
      "bigquery"
    ],
    "tags": [
      "zero-downtime-deployments",
      "blue-green-schemas",
      "shadow-pipelines",
      "backward-compatibility",
      "schema-evolution",
      "view-layer"
    ],
    "codeSnippet": "-- Zero-downtime atomic swap using BigQuery table copy / pointer view\nCREATE OR REPLACE VIEW analytics.orders AS\nSELECT\n    order_id,\n    customer_id,\n    total_amount,\n    COALESCE(new_tax_col, old_tax_col) AS tax_amount\nFROM analytics_physical.orders_v2;"
  }
];
