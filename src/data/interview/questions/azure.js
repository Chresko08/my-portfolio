// Auto-generated module: azure
// Primary questions count: 6

export const azureQuestions = [
  {
    "id": "azure-adf-zero-record-sink-troubleshooting",
    "qNo": 77,
    "q": "An ADF pipeline succeeds, but the target table contains 0 records. How would you troubleshoot it?",
    "a": "1. **Check Copy Activity Details:** Open the ADF monitoring view and click the \"spectacles\" icon on the Copy Activity. Check the `RowsRead` and `RowsCopied` metrics. If `RowsRead` is 0, the source query or dataset is empty.\n2. **Check Source Filters:** If the source is a SQL database, verify that the dynamic query (e.g., checking for new `last_modified_date`) isn't resolving to a future date or an incorrect timeframe.\n3. **Check File Paths:** If the source is ADLS/Blob Storage, ensure the parameterized file path or wildcard isn't pointing to an empty or incorrect directory.\n4. **Check Upsert/Sink Logic:** If using a Data Flow with an Alter Row transformation, ensure the logic isn't accidentally flagging all records as 'Delete' or 'Ignore'.",
    "complexity": "Intermediate",
    "topics": [
      "azure"
    ],
    "tags": [
      "adf",
      "troubleshooting",
      "mapping-data-flows",
      "schema-drift",
      "partition-pruning",
      "sink-configuration"
    ]
  },
  {
    "id": "azure-adf-resilient-restart-from-failure-checkpoints",
    "qNo": 78,
    "q": "How would you design an ADF pipeline that can restart from the failed point instead of processing everything again?",
    "a": "To achieve modularity and restartability (Idempotency):\n1. **Decouple Activities:** Break large pipelines down into smaller, atomic child pipelines using the `Execute Pipeline` activity.\n2. **State Tracking (Watermarking):** Create a control table in SQL Server that logs the status of each batch (`Batch_ID`, `Status=Running/Failed/Completed`). \n3. **Design for Idempotency:** Ensure sink activities can be rerun safely. For SQL, use `UPSERT` (Merge) instead of `INSERT` to avoid duplicates. For Data Lakes, use dynamic file names or overwrite specific partition folders.\n4. **Failure Routing:** If a child activity fails, use ADF's `On Failure` path to update the control table status to 'Failed'. On the next trigger, a Lookup activity checks the control table and only executes batches not marked as 'Completed'.",
    "complexity": "Complex",
    "topics": [
      "azure"
    ],
    "tags": [
      "adf-resilience",
      "checkpoints",
      "pipeline-idempotency",
      "metadata-driven-etl",
      "until-activity"
    ]
  },
  {
    "id": "azure-adls-gen2-hierarchical-namespace-posix-acls",
    "qNo": 104,
    "q": "Explain Azure Data Lake Storage Gen2 (ADLS Gen2). How does the Hierarchical Namespace (HNS) differ from flat Blob Storage, and why is it crucial for big data performance and security?",
    "a": "ADLS Gen2 converges the massive scalability and low cost of Azure Blob Storage with the high-performance filesystem semantics of Hadoop/HDFS.\n\n### 1. Hierarchical Namespace (HNS) vs. Flat Blob Storage\n- **Flat Blob Storage:** Object stores (like standard AWS S3 or Azure Blob) do not have real directories. A path like `container/raw/2024/01/data.parquet` is simply a flat key with forward slashes in the object name.\n  - **Directory Rename Penalty:** Renaming a directory containing 100,000 files requires the storage system to copy each object to a new key and delete the old object ($O(N)$ operations). In Spark or Hadoop pipelines where atomic job commits rename `_temporary/` folders to final paths, this causes jobs to freeze for hours!\n- **ADLS Gen2 with HNS Enabled:** Introduces a true hierarchical filesystem structure where directories are first-class filesystem objects with metadata inodes.\n  - **Atomic Renames ($O(1)$):** Renaming a folder containing millions of files is an instantaneous pointer change on the directory metadata, just like a Linux `mv` command.\n  - **Atomic Deletes:** Dropping a directory is a single atomic metadata operation rather than issuing thousands of individual file delete REST requests.\n\n### 2. POSIX-Compliant Access Control Lists (ACLs)\nStandard Blob storage provides only container-level role-based access control (RBAC). ADLS Gen2 enables fine-grained **POSIX ACLs** at the directory and individual file levels:\n- **Inheritance:** Default ACLs set on a parent directory are automatically applied to child files and folders upon creation.\n- **Security Integration:** Pairs with **Microsoft Entra ID (formerly Azure AD)**. Data engineers can grant read/write/execute permissions to specific security groups or service principals on specific folders (`/bronze`, `/silver`, `/gold`) without granting access to the entire storage account.\n\n### 3. Big Data Driver Optimization\nADLS Gen2 leverages the **ABFS (Azure Blob File System)** driver (`abfss://<container>@<account>.dfs.core.windows.net/`). ABFS is heavily optimized for Spark, Databricks, and Synapse, providing multi-threaded read-ahead caching and high-throughput streaming.",
    "complexity": "Intermediate",
    "topics": [
      "azure",
      "databricks",
      "hadoop-hive"
    ],
    "tags": [
      "adls-gen2",
      "hierarchical-namespace",
      "posix-acls",
      "blob-storage",
      "lakehouse-storage",
      "abfss-driver"
    ],
    "codeSnippet": "# Accessing ADLS Gen2 in PySpark via the optimized ABFS driver\nspark.conf.set(\n    \"fs.azure.account.auth.type.<account>.dfs.core.windows.net\", \"OAuth\"\n)\nspark.conf.set(\n    \"fs.azure.account.oauth.provider.type.<account>.dfs.core.windows.net\",\n    \"org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider\"\n)\n\ndf = spark.read.parquet(\"abfss://curated@myadlsgen2.dfs.core.windows.net/finance/orders/\")"
  },
  {
    "id": "azure-adf-integration-runtimes-shir-azure-ssis",
    "qNo": 105,
    "q": "Compare Azure Data Factory (ADF) Integration Runtimes: Azure IR vs. Self-Hosted IR (SHIR) vs. Azure-SSIS IR. How do you scale and secure a SHIR in a hybrid enterprise environment?",
    "a": "The **Integration Runtime (IR)** is the compute infrastructure that powers data movement, pipeline orchestration, and data transformation activities in Azure Data Factory (ADF) and Synapse Pipelines.\n\n### 1. Integration Runtime Comparison\n\n| Feature | Azure IR (Default) | Self-Hosted IR (SHIR) | Azure-SSIS IR |\n| :--- | :--- | :--- | :--- |\n| **Hosting Model** | Fully managed, serverless multi-tenant Azure compute | Customer-managed VM (On-premise or Azure IaaS) | Dedicated cluster of Azure VMs managed by Microsoft |\n| **Network Reach** | Public endpoints or Azure VNet (Managed VNet with private endpoints) | On-premise private networks, corporate VPNs, private clouds (AWS/GCP) | Hybrid or Azure VNets |\n| **Data Movement** | Cloud-to-cloud data copies | On-premise $\\leftrightarrow$ Cloud, or cross-network private databases | Runs legacy SSIS packages (.dtsx) |\n| **Data Flow Compute**| Supports Mapping Data Flows (Spark clusters behind the scenes) | Dispatches activities only; cannot directly execute Data Flows | Does not run Data Flows |\n\n---\n\n### 2. Deep Dive: Self-Hosted IR (SHIR) Architecture & Security\nA SHIR acts as an outbound-only secure gateway between internal enterprise networks (e.g., on-premises Oracle, SAP, Teradata) and the cloud.\n- **Outbound-Only Communication:** The SHIR agent communicates with ADF over port 443 (HTTPS). It **never requires opening inbound firewall ports**, keeping internal networks secure.\n- **Credential Storage:** When configuring linked services to on-prem databases, credentials can be encrypted and stored locally on the SHIR machine, ensuring database passwords never leave the corporate boundary.\n\n### 3. Scaling & High Availability (HA)\nA single node SHIR represents a single point of failure (SPOF). In production:\n1. **High Availability Clustering:** Install the SHIR software on up to 4 on-premise Windows Server VMs and link them to the same ADF SHIR gateway.\n2. **Failover & Load Balancing:** ADF automatically distributes concurrent data transfer activities across all active nodes. If Node 1 crashes or goes down for OS patching, Node 2 immediately assumes the workload without failing scheduled pipelines.\n3. **Concurrent Job Limits:** Adjust the `Concurrent Jobs Limit` setting per node based on CPU and RAM capacity to prevent memory thrashing during large multi-table extraction pipelines.",
    "complexity": "Intermediate",
    "topics": [
      "azure",
      "cicd-devops"
    ],
    "tags": [
      "integration-runtime",
      "self-hosted-ir",
      "azure-ir",
      "high-availability",
      "hybrid-cloud",
      "adf-security"
    ],
    "codeSnippet": "# Azure CLI: Registering and retrieving authentication keys for a Self-Hosted IR\naz datafactory integration-runtime self-hosted create \\\n    --factory-name \"adf-enterprise-prod\" \\\n    --integration-runtime-name \"shir-onprem-gateway\" \\\n    --resource-group \"rg-data-platform\"\n\naz datafactory integration-runtime get-monitoring-data \\\n    --factory-name \"adf-enterprise-prod\" \\\n    --integration-runtime-name \"shir-onprem-gateway\" \\\n    --resource-group \"rg-data-platform\""
  },
  {
    "id": "azure-synapse-dedicated-serverless-spark-pools",
    "qNo": 106,
    "q": "Explain Azure Synapse Analytics compute engines: Dedicated SQL Pools vs. Serverless SQL Pools vs. Apache Spark Pools. When should you use each?",
    "a": "Azure Synapse Analytics brings together enterprise data warehousing, big data processing, and serverless data lake exploration under a single unified platform.\n\n### 1. The Three Compute Engines\n\n#### A. Dedicated SQL Pools (Formerly Azure SQL Data Warehouse)\n- **Architecture:** Massively Parallel Processing (MPP) architecture with a Control Node distributing queries across 60 underlying storage distributions and a pool of Compute Nodes (scaled via Data Warehouse Units - DWUs).\n- **Data Distribution Options:**\n  - **Hash Distributed:** Distributes rows based on the hash of a chosen column (best for large Fact tables joined on that key, eliminating data movement across compute nodes).\n  - **Round-Robin:** Evenly distributes rows across all 60 distributions (default; ideal for staging tables).\n  - **Replicated:** Replicates the entire table onto every compute node (ideal for small Dimension tables <2GB, allowing local joins with zero network shuffle).\n- **Best For:** Enterprise BI serving layers, predictable high-concurrency reporting, star schemas requiring strict governance.\n\n#### B. Serverless SQL Pools (Pay-Per-Query)\n- **Architecture:** True serverless query engine that executes T-SQL queries directly against data sitting in ADLS Gen2 (Parquet, Delta, CSV, JSON) without provisioning servers. Charged per TB of data scanned (~$5/TB).\n- **Best For:** Ad-hoc exploratory queries on the data lake, creating logical views over raw Parquet/Delta files, and lightweight data transformation before loading to downstream tools.\n```sql\n-- Serverless SQL querying Delta Lake directly in ADLS Gen2\nSELECT customer_id, SUM(amount) AS total_spend\nFROM OPENROWSET(\n    BULK 'https://myadls.dfs.core.windows.net/lake/gold/orders/',\n    FORMAT = 'DELTA'\n) AS [orders]\nGROUP BY customer_id;\n```\n\n#### C. Apache Synapse Spark Pools\n- **Architecture:** Managed Apache Spark cluster integration with autoscaling and dynamic resource allocation.\n- **Best For:** Complex data cleansing, feature engineering, machine learning pipelines, and preparing large-scale unstructured/semi-structured datasets for analytics.\n\n### 2. Unified Enterprise Pattern\nA common enterprise architecture uses **Spark Pools** to ingest and process raw data into Bronze and Silver Delta layers, **Serverless SQL** to create fast logical views for data analysts, and **Dedicated SQL Pools** to host the high-performance Gold dimensional models for Power BI executive dashboards.",
    "complexity": "Complex",
    "topics": [
      "azure",
      "data-modeling",
      "bigquery"
    ],
    "tags": [
      "synapse-analytics",
      "dedicated-sql-pools",
      "serverless-sql",
      "mpp-architecture",
      "hash-distribution",
      "openrowset"
    ],
    "codeSnippet": "-- Dedicated SQL Pool: Creating a Hash-Distributed Fact Table\nCREATE TABLE fact_sales (\n    order_id BIGINT NOT NULL,\n    customer_id INT NOT NULL,\n    store_id INT NOT NULL,\n    sale_amount DECIMAL(18,2)\n)\nWITH (\n    DISTRIBUTION = HASH(customer_id),\n    CLUSTERED COLUMNSTORE INDEX\n);"
  },
  {
    "id": "azure-secure-data-pipelines-managed-identities-private-endpoints",
    "qNo": 107,
    "q": "How do you design a zero-trust, secure data platform in Azure? Detail Managed Identities (System vs User), Azure Key Vault, and Private Endpoints for data pipelines.",
    "a": "Securing cloud data architectures requires eliminating hardcoded passwords, enforcing least-privilege role-based access control, and keeping network traffic off the public internet.\n\n### 1. Managed Identities: Zero Hardcoded Credentials\nInstead of storing database passwords or storage access keys in config files, Azure resources authenticate to other Azure services using **Microsoft Entra Managed Identities**.\n- **System-Assigned Managed Identity:** Tied directly to the lifecycle of the Azure resource (e.g. an ADF instance or Synapse workspace). If the ADF instance is deleted, Azure automatically cleans up the identity in Entra ID.\n- **User-Assigned Managed Identity:** Standalone identity lifecycle managed independently. Can be assigned to multiple resources (e.g., sharing a single identity across 5 ADF pipelines or Databricks clusters).\n- **How ADF Uses It:** ADF authenticates to ADLS Gen2 or Azure SQL by presenting its own identity token. You simply grant the ADF Managed Identity the `Storage Blob Data Contributor` role on the storage container.\n\n### 2. Azure Key Vault Integration\nFor external third-party endpoints (e.g. Salesforce APIs, Snowflake passwords, SFTP servers) that cannot use Managed Identities:\n1. Store credentials securely inside **Azure Key Vault**.\n2. Grant ADF's Managed Identity the `Key Vault Secrets User` role.\n3. In ADF, use a **Web Activity** or native Key Vault Linked Service to retrieve the secret dynamically at runtime and pass it into downstream activities with **Secure Input / Secure Output** checked to prevent secrets from leaking in execution logs.\n\n### 3. Network Isolation with Private Endpoints & Managed VNets\nBy default, cloud PaaS services (ADLS Gen2, Synapse, SQL DB) have public IP endpoints. In enterprise production:\n1. **Managed Virtual Network (Managed VNet):** Provision ADF with a Managed VNet enabled. All data integration compute runs inside an isolated network.\n2. **Private Endpoints (Private Link):** Create Private Endpoints from the ADF Managed VNet to ADLS Gen2, Azure SQL, and Key Vault.\n3. **Firewall Lockdown:** Completely disable public internet access on the storage accounts (`Deny Public Network Access`). Traffic traverses exclusively through private IP interfaces over Microsoft's internal backbone network.",
    "complexity": "Complex",
    "topics": [
      "azure",
      "data-governance",
      "cicd-devops"
    ],
    "tags": [
      "managed-identity",
      "key-vault",
      "private-endpoints",
      "vnet-isolation",
      "rbac",
      "zero-trust"
    ],
    "codeSnippet": "# Granting ADF Managed Identity permissions on ADLS Gen2 via Azure CLI\nADF_PRINCIPAL_ID=$(az datafactory show --name \"adf-enterprise-prod\" --resource-group \"rg-data\" --query \"identity.principalId\" -o tsv)\nSTORAGE_ID=$(az storage account show --name \"adlsgen2prod\" --resource-group \"rg-data\" --query \"id\" -o tsv)\n\naz role assignment create \\\n    --assignee \"$ADF_PRINCIPAL_ID\" \\\n    --role \"Storage Blob Data Contributor\" \\\n    --scope \"$STORAGE_ID\""
  }
];
