// Auto-generated module: cloudComposer
// Primary questions count: 8

export const cloudComposerQuestions = [
  {
    "id": "airflow-architecture-scheduler-webserver-executors",
    "qNo": 86,
    "q": "Explain Airflow's Architecture. How do the Scheduler, Webserver, Executor, and Workers interact?",
    "a": "Airflow's architecture is deeply decoupled to scale horizontally:\n\n1. **Metadata Database (PostgreSQL/MySQL):** The source of truth. Stores DAG definitions, task states, XComs, and connection credentials.\n2. **Scheduler:** The brain. It continuously parses the DAG directory, checks the metadata DB for tasks whose dependencies are met, and sends them to the Executor.\n3. **Executor:** The message broker. It dictates *how* tasks run. It doesn't run code itself; it hands tasks to workers (e.g., pushing to a Redis/RabbitMQ queue for Celery, or calling the Kubernetes API).\n4. **Workers:** The actual compute nodes that pull tasks from the queue, execute the Python code, and report the status back to the Metadata DB.\n5. **Webserver:** The UI. It reads from the Metadata DB to display task states and logs. It does *not* interact directly with the Scheduler or Workers.",
    "complexity": "Intermediate",
    "topics": [
      "cloud-composer"
    ],
    "tags": [
      "airflow-architecture",
      "scheduler",
      "webserver",
      "metadata-database",
      "dag-parsing",
      "heartbeat"
    ]
  },
  {
    "id": "airflow-celery-vs-kubernetes-executors",
    "qNo": 87,
    "q": "Deep Dive: Celery Executor vs. Kubernetes Executor. When would you choose one over the other?",
    "a": "**Celery Executor:**\n- **How it works:** Uses a static pool of standing worker nodes reading from a message queue (Redis/RabbitMQ).\n- **Pros:** Ultra-low latency for task startup (workers are already warm). Great for high-throughput, short-lived tasks.\n- **Cons:** Dependency hell. Every worker must have all Python packages installed for *every* DAG. If DAG A needs Pandas 1.0 and DAG B needs Pandas 2.0, you have a conflict.\n\n**Kubernetes Executor:**\n- **How it works:** Spawns a brand new, isolated Kubernetes Pod for every single task. Once the task finishes, the Pod dies.\n- **Pros:** Perfect isolation. Each task can use a completely different Docker image (DAG A runs Python 3.8, DAG B runs Spark). Zero wasted compute when idle.\n- **Cons:** High latency. Spinning up a Pod takes 5-15 seconds. If you have thousands of 2-second tasks, the overhead is catastrophic.\n\n*5 YOE Verdict:* Modern stacks often use the **CeleryKubernetesExecutor** (hybrid) to route lightweight tasks to Celery and heavy/isolated tasks to Kubernetes.",
    "complexity": "Complex",
    "topics": [
      "cloud-composer",
      "distributed-systems"
    ],
    "tags": [
      "celery-executor",
      "kubernetes-executor",
      "worker-isolation",
      "resource-management",
      "k8s-pod-operator"
    ]
  },
  {
    "id": "airflow-deferrable-async-operators",
    "qNo": 88,
    "q": "What are Deferrable Operators (Async Operators) and why are they critical for Airflow scalability?",
    "a": "Historically, if you used a `Sensor` to wait for a file in S3, that task occupied an entire Airflow Worker slot and just slept (`time.sleep()`). If you had 100 sensors waiting, your entire cluster would deadlock, unable to run real tasks.\n\n**Deferrable Operators** solve this. When an operator needs to wait, it suspends itself and hands execution over to a highly efficient centralized process called the **Triggerer** (built on Python `asyncio`). \n\nA single Triggerer process can efficiently monitor tens of thousands of asynchronous events concurrently. Once the condition is met (e.g., S3 file lands), the Triggerer wakes up the task and puts it back in the queue to finish executing on a standard worker. This frees up 99% of your worker compute resources.",
    "complexity": "Complex",
    "topics": [
      "cloud-composer"
    ],
    "tags": [
      "deferrable-operators",
      "triggerer",
      "asyncio",
      "worker-slot-optimization",
      "sensors"
    ]
  },
  {
    "id": "airflow-data-passing-xcoms-vs-external-storage",
    "qNo": 89,
    "q": "How do you handle data passing between tasks? What are the limits and dangers of XComs?",
    "a": "Tasks in Airflow are designed to be idempotent and distributed—they might run on completely different servers. \n\n**XComs (Cross-Communications):**\n- Allows tasks to push/pull small metadata (e.g., passing a generated `job_id` to the next task).\n- *The Danger:* XComs are serialized and stored directly in the Airflow Metadata Database. If you try to pass a 500MB Pandas DataFrame through XCom, you will instantly crash the Airflow PostgreSQL database.\n\n**Best Practice for Big Data:**\nAirflow is an orchestrator, not an execution engine. Task A should write the DataFrame to an object store (S3/GCS) and push the *URI string* (e.g., `s3://bucket/data_2026_01.csv`) to XCom. Task B pulls the URI from XCom and downloads the data itself.",
    "complexity": "Intermediate",
    "topics": [
      "cloud-composer"
    ],
    "tags": [
      "xcoms",
      "custom-xcom-backends",
      "gcs-s3-staging",
      "data-contracts",
      "metadata-overhead"
    ]
  },
  {
    "id": "airflow-idempotency-and-backfill-patterns",
    "qNo": 90,
    "q": "What is Idempotency in Data Engineering, and how do you ensure an Airflow DAG is idempotent?",
    "a": "An idempotent task produces the exact same final state regardless of whether it is run once, twice, or fifty times. This is the holy grail of data engineering because it allows you to hit 'Clear & Rerun' after a failure without corrupting data.\n\n**How to ensure idempotency:**\n1. **Never use `INSERT` blindly:** Use `MERGE` (Upsert) or `INSERT OVERWRITE` based on partitions. \n2. **Idempotent File Writes:** If writing to S3, overwrite the specific partition prefix (e.g., `/year=2026/month=01/`) rather than appending files dynamically.\n3. **Rely on Execution Dates:** Always use Airflow's logical date variables (`{{ ds }}` or `{{ data_interval_start }}`) in your queries instead of `CURRENT_DATE()`. If a DAG fails and you rerun it 3 days later, `CURRENT_DATE()` will fetch the wrong data, breaking idempotency. `{{ ds }}` will correctly simulate the past execution time.",
    "complexity": "Complex",
    "topics": [
      "cloud-composer",
      "data-modeling"
    ],
    "tags": [
      "idempotency",
      "backfills",
      "execution-date",
      "insert-overwrite",
      "atomic-transactions"
    ]
  },
  {
    "id": "composer-ephemeral-dataproc-clusters-orchestration",
    "qNo": 92,
    "q": "Cloud Composer & Ephemeral Clusters: How do you design an Airflow DAG to reliably orchestrate a PySpark job and load it to BigQuery while minimizing GCP costs?",
    "a": "Running long-lived Dataproc clusters is a massive waste of money for batch ETL. The best practice is using **Ephemeral Clusters** orchestrated via Cloud Composer.\n\n**The DAG Pattern:**\n1. **`DataprocCreateClusterOperator`**: Spins up a perfectly sized cluster dynamically. You configure it with preemptible (Spot) worker nodes to save up to 80% on compute costs.\n2. **`DataprocSubmitJobOperator`**: Submits the PySpark script (stored in GCS) to the newly created cluster. The script processes data from GCS and writes intermediate Parquet files back to GCS.\n3. **`GCSToBigQueryOperator`**: Safely loads the processed Parquet files from GCS into BigQuery.\n4. **`DataprocDeleteClusterOperator`**: Tears down the cluster. **Crucially**, set `trigger_rule='all_done'` so the cluster deletes even if the Spark job fails, preventing orphan clusters from racking up bills.",
    "complexity": "Intermediate",
    "topics": [
      "cloud-composer",
      "dataproc",
      "bigquery"
    ],
    "tags": [
      "cloud-composer",
      "ephemeral-clusters",
      "dataproc",
      "preemptible-vms",
      "cost-optimization",
      "gcs-staging"
    ],
    "codeSnippet": "create_cluster = DataprocCreateClusterOperator(\n    task_id=\"create_cluster\",\n    cluster_config=CLUSTER_CONFIG,\n    cluster_name=CLUSTER_NAME\n)\ndelete_cluster = DataprocDeleteClusterOperator(\n    task_id=\"delete_cluster\",\n    cluster_name=CLUSTER_NAME,\n    trigger_rule=\"all_done\"\n)"
  },
  {
    "id": "composer-gke-architecture-autoscaling-dag-sync",
    "qNo": 118,
    "q": "Explain the internal architecture of Google Cloud Composer 2. How do GKE Autopilot, the Airflow Scheduler, Celery Workers, Cloud SQL, and GCS DAG Bucket synchronization interact?",
    "a": "Google Cloud Composer 2 is a fully managed workflow orchestration service built on **Apache Airflow 2** deployed on top of a managed **Google Kubernetes Engine (GKE) Autopilot** cluster.\n\n### 1. Architectural Anatomy of Composer 2\n\n```\n+------------------ Google-Managed Tenant Project -------------------+\n|  [ Airflow Webserver UI ]  <-->  [ Cloud SQL (Metadata DB) ]       |\n+--------------------------------------------------------------------+\n                                 ^\n                                 | (VPC Peering / Private Service Access)\n                                 v\n+------------------ Customer Project (GKE Cluster) ------------------+\n|  [ Cloud Storage Bucket ] (dags/)  <-- gcsfuse sync (every 60s)    |\n|             |                                                      |\n|             +---------> [ Airflow Schedulers (HA) ]                |\n|                                     |                              |\n|                          Celery / K8s Executor                     |\n|                                     v                              |\n|                         [ Autoscaling Airflow Workers ]            |\n+--------------------------------------------------------------------+\n```\n\n1. **Airflow Schedulers & Workers (Customer GKE):**\n   - The Schedulers, Celery Workers, and Triggerer daemons run as Kubernetes Pods inside a GKE cluster hosted in your customer project.\n   - **Worker Autoscaling:** Composer 2 dynamically scales worker pods between `min_workers` and `max_workers` based on CPU and memory queue utilization metrics.\n2. **Metadata Database (Cloud SQL):**\n   - A fully managed PostgreSQL database running in a Google-managed tenant project.\n   - Connected securely via VPC Peering or Private Service Access. Stores task states, variables, connections, and historical runs.\n3. **Airflow Webserver:**\n   - Hosted in the Google-managed tenant project and protected by **Identity-Aware Proxy (IAP)**, enabling zero-trust IAM authentication without exposing public IP addresses.\n\n### 2. GCS DAG Bucket Sync Mechanism & Pitfalls\n- Every Composer environment is automatically paired with a GCS bucket (`gs://<env-name>-bucket/dags/`).\n- An open-source daemon based on **`gcsfuse`** continuously syncs files from this GCS bucket to local pod storage across all Schedulers and Workers.\n- **Latency & Pitfalls:**\n  - Sync frequency is typically ~30 to 60 seconds. Uploading a DAG does not register instantly.\n  - **Top-Level Code Anti-Pattern:** The Airflow Scheduler parses every Python file in the DAG directory every 30 seconds. Placing database queries, HTTP requests, or heavy imports at the top-level of a DAG file causes scheduler heartbeat starvation and timeouts!",
    "complexity": "Intermediate",
    "topics": [
      "cloud-composer"
    ],
    "tags": [
      "cloud-composer-2",
      "gke-autopilot",
      "worker-autoscaling",
      "dag-processor",
      "cloud-sql",
      "gcsfuse"
    ],
    "codeSnippet": "# Creating an enterprise Cloud Composer 2 environment with worker autoscaling\ngcloud composer environments create composer-prod-us \\\n    --location us-central1 \\\n    --image-version composer-2.6.0-airflow-2.7.3 \\\n    --environment-size medium \\\n    --min-workers 3 \\\n    --max-workers 12 \\\n    --scheduler-count 2 \\\n    --storage-bucket my-composer-dags-bucket"
  },
  {
    "id": "airflow-smart-sensors-reschedule-deferrable-patterns",
    "qNo": 119,
    "q": "What is the Worker Slot Exhaustion problem caused by Airflow Sensors? Compare Poke Mode vs. Reschedule Mode vs. Deferrable Operators (Triggerer).",
    "a": "Sensors in Airflow are specialized operators that wait for an external condition to occur (e.g., a file to land in S3/GCS, a partition to register in Hive, or an upstream job to finish) before allowing downstream tasks to execute.\n\n### 1. The Worker Slot Exhaustion Bottleneck (Poke Mode Anti-Pattern)\n- By default, sensors run in **`mode='poke'`**.\n- In `poke` mode, the sensor task occupies an Airflow worker execution slot and continuously executes a loop: check condition $\\rightarrow$ sleep (e.g. 60s) $\\rightarrow$ check condition.\n- **The Disaster:** If you have 32 total worker slots and 32 sensors waiting for a file arriving in 4 hours, **all 32 worker slots are 100% blocked!** No other data processing tasks can run in the entire company, deadlocking the cluster.\n\n### 2. Mode 2: Reschedule Mode\n- Configured via `mode='reschedule'`.\n- When the sensor pokes the external system and the condition is not met, the task **actively yields its worker slot**.\n- It changes its state to `UP_FOR_RESCHEDULE` and terminates its process, freeing the worker slot for real work.\n- The Airflow Scheduler reschedules the task after `poke_interval` seconds pass.\n- **Trade-off:** Eliminates slot blocking, but still generates database read/write churn on the Airflow metadata DB every poke interval.\n\n### 3. Mode 3: Deferrable Operators (The Modern Standard)\nIntroduced in Airflow 2.2+, **Deferrable Operators** (Async Operators) leverage Python's `asyncio` and a lightweight daemon called the **Triggerer**:\n```\n[ Airflow Worker ] ---> Task initiates deferral ---> Yields slot immediately (0 slots used)\n                                                            |\n                                                            v\n                                            [ Airflow Triggerer Daemon ]\n                                            (Single async event loop tracking\n                                             thousands of waiting tasks)\n                                                            |\n                                                 Condition met!\n                                                            v\n[ Airflow Worker ] <--- Resume task on worker <-------------+\n```\n- A single Triggerer process running `asyncio` can monitor **thousands of concurrent waiting tasks** using only a few megabytes of RAM.\n- Worker slots are occupied for only milliseconds during task initialization and completion.",
    "complexity": "Complex",
    "topics": [
      "cloud-composer"
    ],
    "tags": [
      "sensors",
      "poke-vs-reschedule",
      "deferrable-sensors",
      "triggerer-service",
      "sla-monitoring",
      "worker-slot-exhaustion"
    ],
    "codeSnippet": "from airflow.providers.google.cloud.sensors.gcs import GCSObjectExistenceSensor\n\n# Modern Deferrable GCS Sensor: Zero worker slots consumed while waiting!\nwait_for_file = GCSObjectExistenceSensor(\n    task_id=\"wait_for_daily_file\",\n    bucket=\"landing-zone\",\n    object=\"data/daily_sales_{{ ds }}.parquet\",\n    deferrable=True,      # Hands execution over to Airflow Triggerer\n    timeout=60 * 60 * 6   # 6 hour timeout\n)"
  }
];
