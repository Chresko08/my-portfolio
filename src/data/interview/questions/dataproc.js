// Auto-generated module: dataproc
// Primary questions count: 6

export const dataprocQuestions = [
  {
    "id": "dataproc-vs-dataflow-architectural-decision",
    "qNo": 91,
    "q": "GCP Architecture: This role requires both Dataproc and Dataflow. How do you decide whether to run pipelines on Dataproc (PySpark) or Dataflow (Apache Beam)?",
    "a": "As a senior data engineer, the choice comes down to ecosystem, workload type, and existing codebase:\n\n**Dataproc (PySpark):**\n- **Use Case:** Best for lifting-and-shifting existing Spark codebases, or when the team is highly skilled in PySpark.\n- **Pros:** Full control over cluster configuration, massive open-source ecosystem, excellent for batch processing and complex ML pipelines (Spark MLlib).\n- **Cons:** You have to manage cluster sizing (even with autoscaling), and true streaming latency is limited to micro-batches.\n\n**Dataflow (Apache Beam):**\n- **Use Case:** Best for unified batch and real-time streaming architectures where sub-second latency is required.\n- **Pros:** True serverless execution (Google handles all worker scaling invisibly). Exactly-once processing semantics for streaming are natively handled much better than Spark Structured Streaming.\n- **Cons:** Vendor lock-in (if relying heavily on GCP-specific I/O), and a steeper learning curve compared to PySpark.",
    "complexity": "Complex",
    "topics": [
      "dataproc",
      "dataflow",
      "pyspark"
    ],
    "tags": [
      "dataproc",
      "dataflow",
      "pyspark",
      "apache-beam",
      "batch-vs-streaming",
      "serverless",
      "vendor-lock-in"
    ]
  },
  {
    "id": "dataproc-pyspark-oom-skew-troubleshooting",
    "qNo": 95,
    "q": "Pipeline Reliability: A PySpark job on Dataproc is failing with OOM errors during a massive join. Walk me through your troubleshooting process.",
    "a": "This is a classic Data Skew and Memory Tuning scenario.\n\n**1. Identify the Bottleneck:** I would check the Spark History Server UI. If I see 199 tasks finishing quickly and 1 task hanging or throwing the OOM, it's Data Skew (a massive key imbalance).\n**2. Skew Mitigation:** \n- If the skewed key is `NULL`, I'd filter out nulls before the join.\n- If it's a valid key, I'd enable **Adaptive Query Execution (AQE)** (`spark.sql.adaptive.skewJoin.enabled = true`), which dynamically splits skewed partitions at runtime.\n- If the table being joined is small (<8GB), I would enforce a **BroadcastHashJoin** to broadcast it to all executors, completely avoiding the shuffle.\n**3. Memory Tuning:** If it's not skew, the executors simply lack RAM. I would reduce `spark.executor.cores` to give each task more memory overhead, or increase `spark.sql.shuffle.partitions` (e.g., from 200 to 1000) so each task processes a much smaller chunk of data.",
    "complexity": "Complex",
    "topics": [
      "dataproc",
      "pyspark"
    ],
    "tags": [
      "dataproc-troubleshooting",
      "oom-errors",
      "spark-ui",
      "aqe",
      "data-skew",
      "broadcast-joins",
      "shuffle-partitions"
    ]
  },
  {
    "id": "dataproc-ephemeral-vs-persistent-cluster-lifecycle",
    "qNo": 110,
    "q": "Compare Ephemeral (Job-Scoped) vs. Persistent (Long-Lived) Dataproc Clusters. How do initialization actions, GCS staging, and cost optimization dictate this choice?",
    "a": "On Google Cloud Platform, Dataproc manages Apache Spark and Hadoop clusters. Deciding between Ephemeral and Long-Lived clusters is the fundamental architectural trade-off between operational simplicity and cloud cost efficiency.\n\n### 1. Architectural Comparison\n\n| Dimension | Ephemeral Clusters | Persistent Clusters |\n| :--- | :--- | :--- |\n| **Lifecycle** | Provisioned specifically for a single job/workflow and immediately deleted | Runs 24/7 or for weeks at a time serving multiple scheduled jobs |\n| **Cost Model** | Pay only for exact minutes of job execution; heavy use of Preemptible VMs | Constant compute and license spend even during idle periods |\n| **Failure Blast Radius**| Isolated to the single job; cannot affect other team workloads | Multi-tenant contention; one rogue query can cause cluster-wide OOM |\n| **Startup Overhead** | 90–120 seconds provisioning delay per job | Instantaneous job submission (zero cluster startup delay) |\n| **State & Storage** | Zero local state; all data lives in GCS and BigQuery | Intermediate shuffle files or local HDFS can persist between jobs |\n\n---\n\n### 2. Ephemeral Cluster Architecture with Cloud Composer\nIn enterprise GCP pipelines, **Ephemeral clusters are the gold standard for batch processing**:\n1. **Cloud Composer / Airflow Orchestration:**\n   - Airflow executes `DataprocCreateClusterOperator` dynamically spinning up a cluster tuned specifically for that job's memory requirements.\n   - Runs `DataprocSubmitJobOperator` to execute the PySpark script.\n   - Runs `DataprocDeleteClusterOperator` with `trigger_rule='all_done'` to guarantee teardown even if the PySpark job fails.\n2. **Initialization Actions (Init Scripts):**\n   - Stored in a secured GCS bucket (e.g. `gs://my-bucket/scripts/install_pip_packages.sh`).\n   - Run during cluster boot to configure custom Python libraries (e.g. `pip install great-expectations`), JVM settings, or Cloud Monitoring agents.\n3. **Storage-Compute Decoupling:**\n   - Ephemeral clusters do not use local HDFS for persistent data. They leverage the **Google Cloud Storage Connector for Spark/Hadoop** (`gs://`), reading and writing directly to GCS buckets.",
    "complexity": "Intermediate",
    "topics": [
      "dataproc",
      "cloud-composer"
    ],
    "tags": [
      "ephemeral-clusters",
      "initialization-actions",
      "gcs-connectors",
      "cluster-lifecycle",
      "cost-efficiency"
    ],
    "codeSnippet": "# Cloud Composer DAG definition for Ephemeral Dataproc Cluster\ncreate_cluster = DataprocCreateClusterOperator(\n    task_id=\"create_cluster\",\n    project_id=PROJECT_ID,\n    region=REGION,\n    cluster_name=CLUSTER_NAME,\n    cluster_config={\n        \"master_config\": {\"num_instances\": 1, \"machine_type_uri\": \"n2-standard-4\"},\n        \"worker_config\": {\"num_instances\": 2, \"machine_type_uri\": \"n2-standard-8\"},\n        \"secondary_worker_config\": {\"num_instances\": 6, \"is_preemptible\": True}, # 80% discount!\n        \"initialization_actions\": [{\"executable_file\": \"gs://my-bucket/init-actions.sh\"}]\n    }\n)"
  },
  {
    "id": "dataproc-autoscaling-graceful-decommissioning",
    "qNo": 111,
    "q": "How does Dataproc Autoscaling work? Explain Graceful Decommissioning and how it prevents data loss during Spark shuffle operations.",
    "a": "Dataproc Autoscaling automatically adjusts the number of worker nodes in a cluster based on workload resource demand, eliminating manual capacity planning.\n\n### 1. Autoscaling Algorithm & Metrics\nDataproc collects metrics every heartbeat from the **YARN ResourceManager**:\n- **Pending Memory & Vcores:** If jobs have tasks queued waiting for memory or cores, the autoscaler initiates a scale-up event.\n- **Scale-Up / Scale-Down Factors:** You configure how aggressively the cluster adds or removes nodes:\n```yaml\nworkerConfig:\n  minInstances: 2\n  maxInstances: 50\nautoscalingPolicy:\n  basicAlgorithm:\n    yarnConfig:\n      scaleUpFactor: 0.5\n      scaleDownFactor: 0.2\n      gracefulDecommissionTimeout: 1h\n```\n\n### 2. The Danger of Scaling Down: Lost Shuffle Data\nIn Spark, when a mapper finishes, it writes intermediate shuffle files to the local disk of its worker node. During the subsequent Reduce phase, downstream executors fetch these partitions over the network.\n- **The Problem:** If the Autoscaler abruptly kills a worker node because its CPU utilization dropped, all intermediate shuffle files stored on that node's disk are vaporized!\n- Downstream tasks will fail with **`FetchFailedException`**, forcing Spark to resubmit the upstream stages from scratch or causing the entire job to crash after multiple failed attempts.\n\n### 3. Graceful Decommissioning Solution\nTo eliminate shuffle loss, Dataproc enforces **Graceful Decommissioning**:\n1. When YARN determines a worker node should be removed, it marks the node as `DECOMMISSIONING`.\n2. The NodeManager stops accepting new tasks, but running tasks are allowed to complete.\n3. Crucially, **active shuffle files are preserved** on that node until downstream reducers have finished reading them, OR until the configured **`gracefulDecommissionTimeout`** (e.g., 3600s) expires.\n4. Only when no active tasks rely on that node's local storage does Dataproc safely terminate the underlying Google Compute Engine instance.",
    "complexity": "Complex",
    "topics": [
      "dataproc",
      "distributed-systems"
    ],
    "tags": [
      "autoscaling-policy",
      "graceful-decommissioning",
      "shuffle-data-loss",
      "yarn-resourcemanager",
      "fetch-failed-exception"
    ],
    "codeSnippet": "# Defining an Autoscaling Policy with Graceful Decommissioning via gcloud CLI\ngcloud dataproc autoscaling-policies import prod-autoscale-policy \\\n    --source=policy.yaml \\\n    --region=us-central1\n\n# policy.yaml content:\n# basicAlgorithm:\n#   yarnConfig:\n#     scaleUpFactor: 0.8\n#     scaleDownFactor: 0.3\n#     gracefulDecommissionTimeout: 3600s"
  },
  {
    "id": "dataproc-preemptible-spot-vms-fault-tolerance",
    "qNo": 112,
    "q": "How do you reliably use Preemptible VMs (Spot Instances) on Dataproc to save 60-80% on compute costs without failing Spark pipelines?",
    "a": "Preemptible VMs (and Spot VMs) are excess Compute Engine capacity available at a 60–80% discount compared to on-demand pricing. However, Google can reclaim them at any time with only a **30-second warning notice**.\n\n### 1. The Rules of Preemptible Dataproc Architecture\nTo run Spot instances reliably without pipeline failures, you must follow strict architectural rules:\n\n1. **Master Nodes Must NEVER Be Preemptible:**\n   If the Master node is reclaimed, the YARN ResourceManager and Spark Driver die, immediately failing the entire job. Master nodes must always be standard, reliable instances.\n2. **Maintain a Baseline of Standard Primary Workers:**\n   Always provision at least 2 standard, non-preemptible primary workers. Primary workers participate in HDFS block replication (if local HDFS is used) and provide stable capacity for the cluster.\n3. **Use Preemptible Instances Exclusively as Secondary Workers:**\n   Dataproc categorizes preemptible nodes as **Secondary Workers**. Secondary workers do not store HDFS data blocks; they only execute compute tasks. If a secondary worker is terminated, no persistent HDFS data is corrupted.\n\n### 2. Handling the 30-Second Preemption Event\nWhen Google reclaims a Spot VM:\n- The node receives an ACPI shutdown signal.\n- The Dataproc agent detects the signal and immediately notifies the YARN ResourceManager to mark the node as lost.\n- **Spark Fault Tolerance in Action:** Spark's DAG scheduler catches the failed tasks that were running on the lost node and automatically resubmits them onto remaining surviving workers based on the RDD lineage graph.\n- **Mitigating Shuffle File Loss:** For heavy shuffle jobs, configure **Enhanced Flexibility Mode (EFM)** on Dataproc, which segregates shuffle storage onto primary workers, ensuring secondary worker preemption does not cause `FetchFailed` errors.",
    "complexity": "Intermediate",
    "topics": [
      "dataproc"
    ],
    "tags": [
      "preemptible-vms",
      "spot-instances",
      "fault-tolerance",
      "primary-vs-secondary-workers",
      "cost-reduction",
      "efm"
    ],
    "codeSnippet": "# Creating a Dataproc cluster with 2 Standard workers and 10 Preemptible workers\ngcloud dataproc clusters create cost-optimized-cluster \\\n    --region=us-central1 \\\n    --num-masters=1 \\\n    --master-machine-type=n2-standard-4 \\\n    --num-workers=2 \\\n    --worker-machine-type=n2-standard-8 \\\n    --num-secondary-workers=10 \\\n    --secondary-worker-type=spot \\\n    --image-version=2.1-debian11"
  },
  {
    "id": "dataproc-serverless-spark-architecture",
    "qNo": 113,
    "q": "What is Dataproc Serverless for Spark? How does its execution model differ from standard Dataproc clusters, and when should you adopt it?",
    "a": "Historically, running Spark on Dataproc required managing a cluster: sizing master/worker machines, tuning autoscaling policies, and managing YARN daemons. **Dataproc Serverless** eliminates cluster management entirely.\n\n### 1. How Dataproc Serverless Works\nInstead of creating a cluster, you submit Spark batch workloads directly to the Dataproc Serverless service:\n```bash\ngcloud dataproc batches submit pyspark gs://my-bucket/scripts/etl_job.py \\\n    --project=my-project \\\n    --region=us-central1 \\\n    --deps-bucket=gs://my-bucket/staging/\n```\n1. **Dynamic Ephemeral Execution:** Google automatically provisions, configures, and scales an isolated, single-tenant compute environment sized to your workload.\n2. **Zero Cluster Idle Waste:** Billing is metered down to the sub-second based solely on Data Compute Units (DCUs) consumed during job execution. There is zero idle cost.\n3. **Automated Spark Tuning:** Spark properties such as driver memory, executor cores, dynamic allocation, and shuffle partitions are dynamically auto-tuned by Google based on workload characteristics.\n\n### 2. Key Differences from Standard Dataproc\n\n| Dimension | Standard Dataproc | Dataproc Serverless |\n| :--- | :--- | :--- |\n| **Abstraction** | Infrastructure (VMs, YARN, SSH access) | Workload-level (Batches, Sessions) |\n| **Cluster Management**| Sizing, OS patches, init actions | Zero cluster management |\n| **Startup Time** | 90–120 seconds | 30–60 seconds |\n| **Metastore** | Self-hosted or Dataproc Metastore (DPMS) | Directly integrates with Dataproc Metastore (DPMS) |\n| **Custom Libraries** | Init actions or custom VM images | Custom Docker container images stored in Artifact Registry |\n\n### 3. Using Custom Containers in Serverless\nWhen your Spark job requires complex Python libraries (e.g. specialized C++ compiled wheels), Dataproc Serverless allows you to specify a custom Docker container:\n```bash\ngcloud dataproc batches submit pyspark job.py \\\n    --container-image=us-central1-docker.pkg.dev/my-proj/repo/spark-custom:v1\n```",
    "complexity": "Intermediate",
    "topics": [
      "dataproc",
      "pyspark"
    ],
    "tags": [
      "dataproc-serverless",
      "spark-batches",
      "dynamic-workload-sizing",
      "metastore-service",
      "docker-containers"
    ],
    "codeSnippet": "# Submitting a Dataproc Serverless batch with custom memory and Metastore settings\ngcloud dataproc batches submit pyspark gs://my-bucket/process_orders.py \\\n    --region=us-central1 \\\n    --metastore-service=projects/my-proj/locations/us-central1/services/dpms-prod \\\n    --properties=\"spark.dynamicAllocation.maxExecutors=30,spark.driver.memory=4g\""
  }
];
