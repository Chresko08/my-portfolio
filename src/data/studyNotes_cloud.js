export const cloudNotes = [
  {
    id: "apache-airflow",
    title: "Apache Airflow (Orchestration)",
    sections: [
      {
        id: "af-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>Core Topology:</strong>
              <ul>
                <li><span style='color:#6366f1'>Metadata Database:</span> PostgreSQL or MySQL. The single source of truth storing DAG metadata, DAG runs, task instances, XComs, connections, and variables.</li>
                <li><span style='color:#6366f1'>Scheduler:</span> Continuous multithreaded daemon running the <code>DagFileProcessor</code> loop. Parses DAG files, checks task dependencies in the DB, and transitions tasks from <code>SCHEDULED</code> to <code>QUEUED</code>.</li>
                <li><span style='color:#6366f1'>Executor:</span> Pluggable worker management layer. Dictates *where* and *how* queued tasks execute (e.g., Celery, Kubernetes, Local).</li>
                <li><span style='color:#6366f1'>Workers:</span> Compute agents that pull tasks from the queue, execute operator logic, and update status back to the metadata DB.</li>
                <li><span style='color:#6366f1'>Triggerer:</span> Single-process async event loop (Python <code>asyncio</code>) introduced in Airflow 2.2 for Deferrable Operators. Allows thousands of waiting tasks (sensors, external jobs) to sleep without occupying worker slots.</li>
                <li><span style='color:#6366f1'>Webserver:</span> Flask-based UI reading directly from the metadata DB. Completely decoupled from execution.</li>
              </ul>
            </li>
            <li><strong>Task Lifecycle:</strong>
              <ul>
                <li><code>None</code> &rarr; <code>SCHEDULED</code> (Dependencies met) &rarr; <code>QUEUED</code> (Sent to executor) &rarr; <code>RUNNING</code> (Picked up by worker) &rarr; <code>SUCCESS</code> / <code>FAILED</code> / <code>UP_FOR_RETRY</code>.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "af-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>TaskFlow API (Airflow 2.0+):</strong> Uses Python decorators (<code>@dag</code>, <code>@task</code>) to turn standard Python functions into Airflow tasks with automatic XCom arg passing.</li>
            <li><strong>Deferrable Operators (Async Operators):</strong>
              <ul>
                <li>Standard sensors occupy a worker slot while polling (<code>mode='poke'</code> or <code>mode='reschedule'</code>).</li>
                <li>Deferrable operators yield execution to the <strong>Triggerer</strong> via a lightweight asyncio coroutine, releasing the worker thread entirely until triggered.</li>
              </ul>
            </li>
            <li><strong>Dynamic Task Mapping:</strong> Runtime task expansion using <code>.expand()</code> and <code>.partial()</code> to spawn variable numbers of tasks based on upstream outputs without modifying DAG definitions.</li>
            <li><strong>Trigger Rules:</strong> Control task execution beyond simple upstream success:
              <ul>
                <li><code>all_success</code> (default): All direct upstreams succeeded.</li>
                <li><code>all_done</code>: All direct upstreams completed (used for cleanup / tear-down tasks).</li>
                <li><code>one_success</code> / <code>none_failed</code>: Dynamic branch convergence.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "af-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Scheduler Throughput Tuning:</strong>
              <ul>
                <li><code>scheduler.dag_dir_list_interval</code>: Frequency of discovering new files (default 300s). Increase to reduce disk I/O.</li>
                <li><code>scheduler.min_file_process_interval</code>: How often each DAG file is parsed (default 30s). Increase to 60-120s in large repositories.</li>
                <li><code>scheduler.parsing_processes</code>: Match to available CPU cores on the scheduler node.</li>
              </ul>
            </li>
            <li><strong>Concurrency Controls:</strong>
              <ul>
                <li><code>parallelism</code>: Cluster-wide maximum active task instances across all DAGs.</li>
                <li><code>max_active_runs_per_dag</code>: Limits concurrent execution runs per DAG (prevents backfill stampedes).</li>
                <li><code>max_active_tasks_per_dag</code>: Maximum concurrent tasks running for a specific DAG.</li>
              </ul>
            </li>
            <li><strong>Top-Level Code Avoidance:</strong> Never put database queries, HTTP requests, or heavy imports at top-level scope in DAG files. The scheduler parses every DAG file every few seconds; top-level I/O causes catastrophic scheduler lag.</li>
          </ul>
        `
      },
      {
        id: "af-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>Executor Comparison:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Executor</th><th>Architecture</th><th>Pros</th><th>Cons</th><th>Best For</th></tr>
                <tr><td><strong>CeleryExecutor</strong></td><td>Fixed pool of workers listening on Redis/RabbitMQ</td><td>Zero startup latency; high throughput for micro-tasks</td><td>Shared worker environments; dependency conflicts</td><td>High-frequency, short ETL tasks</td></tr>
                <tr><td><strong>KubernetesExecutor</strong></td><td>Spawns a dedicated K8s Pod per task instance</td><td>Complete process/dependency isolation; scales to zero</td><td>Pod startup latency (10-30s overhead)</td><td>Resource-heavy, polyglot ML & Spark jobs</td></tr>
                <tr><td><strong>CeleryKubernetesExecutor</strong></td><td>Hybrid: routes tasks based on queue</td><td>Best of both worlds</td><td>High operational complexity</td><td>Mixed enterprise workloads</td></tr>
              </table>
            </li>
            <li><strong>Production Idempotent DAG Pattern (TaskFlow + Deferrable Sensor):</strong>
<pre><code>from airflow.decorators import dag, task
from airflow.providers.google.cloud.sensors.gcs import GCSObjectExistenceAsyncSensor
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator
from datetime import datetime, timedelta

@dag(
    schedule_interval="@daily",
    start_date=datetime(2026, 1, 1),
    catchup=False,
    max_active_runs=1,
    default_args={"retries": 2, "retry_delay": timedelta(minutes=5)}
)
def idempotent_lakehouse_pipeline():
    # 1. Async non-blocking file arrival check
    wait_for_landing_file = GCSObjectExistenceAsyncSensor(
        task_id="wait_for_file",
        bucket="raw-landing-bucket",
        object="sales/{{ ds }}/transactions.parquet"
    )

    # 2. Idempotent BigQuery write using partition replacement
    load_to_trusted = BigQueryInsertJobOperator(
        task_id="load_trusted",
        configuration={
            "query": {
                "query": """
                    MERGE INTO prod.fct_sales T
                    USING (
                        SELECT * FROM EXTERNAL_QUERY(...)
                        WHERE transaction_date = '{{ ds }}'
                    ) S
                    ON T.transaction_id = S.transaction_id
                    WHEN MATCHED THEN UPDATE SET ...
                    WHEN NOT MATCHED THEN INSERT ROW;
                """,
                "useLegacySql": False
            }
        }
    )

    wait_for_landing_file >> load_to_trusted

idempotent_lakehouse_pipeline()</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "af-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>The XCom Crash Anti-Pattern:</strong> Storing large DataFrames or datasets directly in XCom. XCom serializes data into the metadata database (Postgres/MySQL). Passing >10MB will bloat database tables and crash the scheduler. <em>Rule:</em> Store data in cloud storage (GCS/S3) and pass only the URI path through XCom.</li>
            <li><strong>The Execution Date / Logical Date Trap:</strong> In Airflow, <code>{{ ds }}</code> represents the <em>start</em> of the data interval, NOT the wall-clock execution time. An '@daily' DAG running on '2026-03-02' processes data for '2026-03-01'. Never use Python's <code>datetime.now()</code> inside task logic; it breaks backfill determinism.</li>
            <li><strong>Sensor Deadlock:</strong> Running multiple <code>mode='poke'</code> sensors on a cluster where the number of waiting sensors equals the maximum worker capacity. All worker slots are occupied by sleeping sensors, preventing upstream tasks from ever executing. <em>Fix:</em> Use Deferrable Operators or <code>mode='reschedule'</code>.</li>
            <li><strong>Dynamic DAG Generation Pitfall:</strong> Generating DAGs in a loop that connects to an external DB/API at file read time. If the external API times out, the scheduler deletes all DAGs from memory.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "google-bigquery",
    title: "Google BigQuery",
    sections: [
      {
        id: "bq-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>Separation of Compute & Storage:</strong> Compute (Dremel) and Storage (Colossus) scale independently with zero co-location requirements.
              <ul>
                <li><span style='color:#6366f1'>Dremel Execution Engine:</span> Multi-level execution tree (Root server &rarr; Intermediate Mixers &rarr; Leaf Execution Nodes). Distributes queries into thousands of parallel dynamic shards.</li>
                <li><span style='color:#6366f1'>Colossus & Capacitor:</span> Google's global distributed file system. Data is persisted in <strong>Capacitor</strong>, a proprietary columnar format supporting dictionary encoding, run-length encoding, and embedded min/max zone maps.</li>
                <li><span style='color:#6366f1'>Jupiter Network:</span> Petabit-scale bisection bandwidth network fabric that transfers terabytes between Colossus storage servers and Dremel worker nodes in milliseconds.</li>
                <li><span style='color:#6366f1'>Borg Container Architecture:</span> Allocates compute slices (Slots) dynamically across thousands of shared multi-tenant machines.</li>
              </ul>
            </li>
            <li><strong>The BigQuery "Slot":</strong> A virtual CPU (vCPU + RAM + network) unit of compute capacity. Query complexity and shuffle data volume dictate dynamic slot allocation.</li>
          </ul>
        `
      },
      {
        id: "bq-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Partitioning:</strong> Physically splits table data into separate storage partitions. Limits query bytes scanned:
              <ul>
                <li><em>Time-unit partitioning:</em> <code>DATE</code>, <code>DATETIME</code>, or <code>TIMESTAMP</code> columns (Hourly, Daily, Monthly, Yearly).</li>
                <li><em>Ingestion-time partitioning:</em> Pseudo-column <code>_PARTITIONDATE</code> / <code>_PARTITIONTIME</code> automatically populated upon write.</li>
                <li><em>Integer-range partitioning:</em> Ranges defined by start, end, and interval (e.g., customer_id bands).</li>
                <li><em>Limit:</em> Up to 10,000 partitions per table.</li>
              </ul>
            </li>
            <li><strong>Clustering:</strong> Colocates related data within each partition based on the values of up to 4 columns.
              <ul>
                <li>Unlike partitioning, clustering does not enforce discrete segment boundaries; it sorts and blocks data blocks into ~1GB files with metadata zone maps.</li>
                <li>Ideal for high-cardinality keys, frequent filter predicates, and equality/range filters.</li>
              </ul>
            </li>
            <li><strong>Denormalization via STRUCT and ARRAY:</strong>
              <ul>
                <li><code>STRUCT</code>: Represents nested key-value objects (1-to-1 relationships).</li>
                <li><code>ARRAY</code>: Represents repeated records (1-to-many relationships). Eliminates the need for expensive network shuffles and joins by embedding child items in the parent row.</li>
              </ul>
            </li>
            <li><strong>BI Engine:</strong> Built-in in-memory analysis service that accelerates dashboard queries to sub-second latencies with zero query refactoring.</li>
          </ul>
        `
      },
      {
        id: "bq-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Partition Pruning:</strong> Always filter on the partition column in the <code>WHERE</code> clause. Enable <em>"Require partition filter"</em> in table settings to prevent unintended full table scans.</li>
            <li><strong>Cluster Pruning:</strong> Order columns in the cluster definition by query frequency. Filters on the first cluster column prune blocks first; secondary columns prune within those blocks.</li>
            <li><strong>Avoiding Anti-Patterns:</strong>
              <ul>
                <li>Avoid <code>SELECT *</code>: BigQuery charges by bytes read from disk. Reading unused columns burns money.</li>
                <li>Avoid <code>LIMIT</code> as a cost-saving tool: <code>SELECT * FROM table LIMIT 10</code> still performs a FULL table scan; <code>LIMIT</code> only truncates the final output stage.</li>
                <li>Avoid self-joins on high-cardinality keys: Use window functions (<code>LEAD</code>, <code>LAG</code>) instead of self-joining large tables.</li>
              </ul>
            </li>
            <li><strong>Slot Spilling Mitigation:</strong> If intermediate query stages exceed allocated slot RAM, BigQuery spills intermediate data to Colossus disk, degrading query speed. Split massive queries into materialized staging tables.</li>
          </ul>
        `
      },
      {
        id: "bq-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>Partitioning vs. Clustering Comparison:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Feature</th><th>Partitioning</th><th>Clustering</th></tr>
                <tr><td><strong>Cost Guarantee</strong></td><td>Guaranteed upfront query cost estimation</td><td>Cost reduction cannot be estimated before query runs</td></tr>
                <tr><td><strong>Cardinality</strong></td><td>Low-to-medium cardinality (&le; 10,000 distinct values)</td><td>High cardinality (millions of unique keys, UUIDs, IDs)</td></tr>
                <tr><td><strong>Column Limits</strong></td><td>Exactly 1 column per table</td><td>Up to 4 columns ordered hierarchically</td></tr>
                <tr><td><strong>Maintenance</strong></td><td>Static boundaries</td><td>Automatic background re-clustering by Google</td></tr>
              </table>
            </li>
            <li><strong>Production BigQuery SQL (Denormalization + UNNEST + Window Function):</strong>
<pre><code>-- Analyzing multi-item orders without joining an order_items table
SELECT 
    order_id,
    customer_id,
    order_date,
    item.item_id,
    item.quantity,
    item.price,
    SUM(item.price * item.quantity) OVER(
        PARTITION BY customer_id 
        ORDER BY order_date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as customer_cumulative_spend
FROM production.orders AS o,
UNNEST(o.line_items) AS item
WHERE order_date BETWEEN '2026-01-01' AND '2026-03-31'
  AND item.category = 'Electronics';</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "bq-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>The Streaming Buffer Lockout:</strong> When records are inserted via the BigQuery Storage Write API or legacy streaming, they land in an in-memory streaming buffer. While immediately queryable via <code>SELECT</code>, they CANNOT be modified or updated via <code>UPDATE</code>, <code>DELETE</code>, or <code>MERGE</code> for up to 90 minutes until flushed to Colossus.</li>
            <li><strong>Pricing Model Mismatch:</strong>
              <ul>
                <li><em>On-Demand ($6.25 per TB scanned):</em> Best for unpredictable, ad-hoc, or low-frequency batch queries.</li>
                <li><em>BigQuery Editions (Standard, Enterprise, Enterprise Plus):</em> Slot-hour reservation model with autoscaling. Critical for enterprises with steady-state workloads where on-demand queries can trigger unbounded bills.</li>
              </ul>
            </li>
            <li><strong>DML Quota Limits:</strong> BigQuery restricts concurrent mutating DML statements (<code>UPDATE</code>, <code>DELETE</code>, <code>MERGE</code>) to 20 concurrent queries per table. Firing individual updates from microservices leads to <code>RESOURCE_EXHAUSTED</code> errors. Always batch mutations into scheduled append-only staging merges.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "google-dataflow",
    title: "Google Dataflow (Apache Beam)",
    sections: [
      {
        id: "df-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>The Unified Beam Model:</strong> Apache Beam provides a single programming abstraction (Pipelines, PCollections, PTransforms) that executes on multiple runners. Google Dataflow is the fully managed, serverless execution runner.</li>
            <li><strong>Architecture Components:</strong>
              <ul>
                <li><span style='color:#6366f1'>Dataflow Job Manager:</span> Cloud orchestrator that translates the Beam DAG into an optimized physical execution graph.</li>
                <li><span style='color:#6366f1'>Worker VMs:</span> Compute Engine instances that run harness daemons executing transforms on data partitions.</li>
                <li><span style='color:#6366f1'>Streaming Engine:</span> Decouples state storage and streaming shuffle from worker VMs into a specialized Google-managed backend service, dramatically accelerating autoscaling and reducing worker memory pressure.</li>
                <li><span style='color:#6366f1'>Dynamic Work Rebalancing:</span> Automatically splits lagging work items among idle workers in real-time, eliminating the "straggler problem" common in MapReduce/Spark.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "df-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>The 4 Dimensions of Stream Processing:</strong>
              <ul>
                <li><span style='color:#6366f1'>What</span> is being computed? (Transformations: Sum, Count, ML inference).</li>
                <li><span style='color:#6366f1'>Where</span> in event time? (Windowing: Fixed, Sliding, Session).</li>
                <li><span style='color:#6366f1'>When</span> in processing time are results materialized? (Watermarks & Triggers).</li>
                <li><span style='color:#6366f1'>How</span> do results relate? (Accumulation: Discarding, Accumulating, Retracting).</li>
              </ul>
            </li>
            <li><strong>Watermarks:</strong> A monotonic timestamp indicating the system's progress. A watermark at timestamp $T$ asserts: "The pipeline expects no more records with event time $t < T$."
              <ul>
                <li><em>Heuristic Watermarks:</em> Used when ingesting unbounded out-of-order streams (e.g., mobile event logs).</li>
              </ul>
            </li>
            <li><strong>Triggers & Late Data:</strong>
              <ul>
                <li><em>Early Triggers:</em> Speculative results emitted before the watermark passes.</li>
                <li><em>On-Time Triggers:</em> Standard emission when the watermark passes the window end.</li>
                <li><em>Late Triggers:</em> Fired whenever records arrive with timestamps older than the watermark, up to an allowed lateness threshold.</li>
              </ul>
            </li>
            <li><strong>Side Inputs:</strong> Additional PCollections passed into a <code>ParDo</code> as read-only lookup data (e.g., streaming transactions joined with a slowly changing fraud threshold table).</li>
          </ul>
        `
      },
      {
        id: "df-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Fusion Optimization:</strong> Dataflow optimizes execution by fusing consecutive <code>ParDo</code> steps into a single execution step to avoid serialization overhead.
              <ul>
                <li><em>Fusion Breakdown:</em> If a transform creates a massive fan-out (e.g., 1 row &rarr; 100,000 rows) followed by heavy computation, fusion prevents Dataflow from parallelizing the downstream step.</li>
                <li><em>Fix:</em> Insert a <code>Reshuffle</code> transform or a group-by operation to force Dataflow to break fusion and distribute work across all available worker nodes.</li>
              </ul>
            </li>
            <li><strong>Combiner Lifting:</strong> Beam automatically lifts commutative/associative combiners before the shuffle step (similar to a MapReduce Combiner), aggregating rows in worker memory before network transmission.</li>
            <li><strong>Autoscaling Optimization:</strong> In streaming mode, enable <code>--enable_streaming_engine</code> to avoid VM disk bottlenecks and achieve sub-second scale up/down.</li>
          </ul>
        `
      },
      {
        id: "df-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>Dataflow (Beam) vs. Spark Structured Streaming:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Dimension</th><th>Apache Beam (Dataflow)</th><th>Spark Structured Streaming</th></tr>
                <tr><td><strong>Execution Model</strong></td><td>Native record-by-record streaming</td><td>Micro-batching (default) or Continuous Processing</td></tr>
                <tr><td><strong>Event-Time Windowing</strong></td><td>Native first-class concept (out-of-the-box Session/Sliding)</td><td>Supported via Watermarking, but sessions require complex flatMapGroupsWithState</td></tr>
                <tr><td><strong>Infrastructure</strong></td><td>Serverless (zero cluster sizing/management)</td><td>Cluster-based (Dataproc/EKS/YARN sizing required)</td></tr>
                <tr><td><strong>Multi-Language</strong></td><td>Unified SDK across Java, Python, Go</td><td>Scala, Python, Java, R</td></tr>
              </table>
            </li>
            <li><strong>Production Beam Pipeline (Fixed Windows + Allowed Lateness + Dead Letter Queue):</strong>
<pre><code>import apache_beam as beam
from apache_beam.transforms.window import FixedWindows
from apache_beam.transforms.trigger import AfterWatermark, AfterCount, AccumulationMode

class ParseEventFn(beam.DoFn):
    OUTPUT_TAG_VALID = 'valid'
    OUTPUT_TAG_DEAD_LETTER = 'dead_letter'

    def process(self, element):
        try:
            record = json.loads(element)
            yield beam.pvalue.TaggedOutput(self.OUTPUT_TAG_VALID, record)
        except Exception as e:
            yield beam.pvalue.TaggedOutput(self.OUTPUT_TAG_DEAD_LETTER, {'raw': element, 'error': str(e)})

# Pipeline definition
with beam.Pipeline(options=pipeline_options) as p:
    events = (
        p 
        | "ReadFromPubSub" >> beam.io.ReadFromPubSub(subscription="projects/my-p/subscriptions/sub")
        | "ValidateJson" >> beam.ParDo(ParseEventFn()).with_outputs(
            ParseEventFn.OUTPUT_TAG_VALID, 
            ParseEventFn.OUTPUT_TAG_DEAD_LETTER
        )
    )

    # Windowing valid records with 10-minute allowed lateness
    windowed_aggregates = (
        events[ParseEventFn.OUTPUT_TAG_VALID]
        | "AssignTimestamps" >> beam.Map(lambda x: beam.window.TimestampedValue(x, x['timestamp']))
        | "Window5Min" >> beam.WindowInto(
            FixedWindows(300),
            trigger=AfterWatermark(early=AfterCount(100)),
            accumulation_mode=AccumulationMode.ACCUMULATING,
            allowed_lateness=600
        )
        | "SumAmounts" >> beam.CombinePerKey(sum)
        | "WriteBigQuery" >> beam.io.WriteToBigQuery("prod.sales_windowed")
    )

    # Route bad records to dead letter queue
    events[ParseEventFn.OUTPUT_TAG_DEAD_LETTER] | "DeadLetterToGCS" >> beam.io.WriteToText("gs://bucket/dlq/")</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "df-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>Hot Key Bottlenecks in GroupByKey:</strong> If millions of records share the same key (e.g., <code>NULL</code> or a default tenant ID), all data for that key is routed to a single worker thread, causing OutOfMemory errors and pipeline stalling. <em>Fix:</em> Salt keys with random integers prior to grouping, or use Beam's <code>Combine.PerKey</code> which aggregates locally before the shuffle.</li>
            <li><strong>Side Input Memory Exhaustion:</strong> Passing an unbounded or multi-gigabyte PCollection as a side input into a <code>ParDo</code>. Side inputs are held entirely in worker RAM. If the dataset exceeds available memory, workers crash with OOMKilled. <em>Fix:</em> Store large lookup datasets in Bigtable or Redis and perform batch lookups.</li>
            <li><strong>Stalled Watermarks on Empty Partitions:</strong> In streaming pipelines reading from Kafka/PubSub, if a single partition stops receiving data, its local watermark stops advancing. The global watermark (which is the minimum across all partitions) gets stuck, preventing time windows from ever closing and firing.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "google-cloud-composer",
    title: "Google Cloud Composer",
    sections: [
      {
        id: "composer-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>Managed Airflow on GCP Infrastructure:</strong>
              <ul>
                <li><span style='color:#6366f1'>GKE Cluster:</span> Airflow components (Scheduler, Webserver, Workers, Triggerers) run as containerized pods inside a Google Kubernetes Engine cluster.</li>
                <li><span style='color:#6366f1'>Cloud SQL:</span> Managed PostgreSQL database storing the Airflow metadata.</li>
                <li><span style='color:#6366f1'>Cloud Storage Bucket:</span> Mounted to Airflow pods via <code>gcsfuse</code>. Dropping a DAG file into the <code>/dags</code> bucket directory automatically syncs it across all scheduler and worker pods.</li>
                <li><span style='color:#6366f1'>Artifact Registry:</span> Custom Docker images containing pre-compiled system binaries and dependencies.</li>
              </ul>
            </li>
            <li><strong>Composer 1 vs. Composer 2:</strong>
              <ul>
                <li><em>Composer 1:</em> Static GKE node pools. Fixed VM infrastructure; you pay for underlying Compute Engine instances whether DAGs are running or idle.</li>
                <li><em>Composer 2:</em> GKE Autopilot architecture. Dynamic, independent autoscaling for Airflow workers and schedulers. Zero node management; billed strictly for active CPU and memory allocation.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "composer-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Private IP Architecture:</strong> Critical enterprise security requirement. Composer environments deployed with Private IP have no public IP addresses on GKE worker nodes. Communication with GCP services occurs via Private Google Access, and connections to corporate on-prem systems route through Cloud Interconnect or Cloud VPN.</li>
            <li><strong>Airflow Configuration Overrides:</strong> Environment settings mapped directly into Airflow configuration blocks (e.g., <code>core.dag_file_processor_timeout</code>, <code>celery.worker_autoscale</code>) managed declaratively via Terraform or gcloud.</li>
            <li><strong>Environment Snapshots:</strong> Full state capture enabling backup and restore of the Airflow metadata database, DAG files, plugins, and environment variables across GCP regions.</li>
          </ul>
        `
      },
      {
        id: "composer-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Composer 2 Autoscaling Parameters:</strong>
              <ul>
                <li>Configure <code>min_workers</code> (e.g., 1) and <code>max_workers</code> (e.g., 10) to scale compute dynamically.</li>
                <li>Tune <code>worker_cpu</code> and <code>worker_memory</code> based on whether tasks execute in-process Python logic or simply trigger remote API jobs (BigQuery/Dataproc).</li>
              </ul>
            </li>
            <li><strong>Mitigating gcsfuse Latency:</strong> The DAGs folder is mounted via Cloud Storage FUSE. FUSE has high latency for deep directory traversals. Keep DAG directories flat, avoid importing custom Python modules from deep subfolders, and use <code>.airflowignore</code> to skip test files and documentation.</li>
            <li><strong>Cloud SQL Connection Saturation:</strong> In large environments with multiple schedulers and dozens of workers, database connection limits can be reached. Tune <code>AIRFLOW__DATABASE__SQL_ALCHEMY_POOL_SIZE</code> and <code>SQL_ALCHEMY_MAX_OVERFLOW</code>.</li>
          </ul>
        `
      },
      {
        id: "composer-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>The Cloud Orchestration Triad:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Service</th><th>Primary Responsibility</th><th>Compute Paradigm</th><th>Cost Optimization</th></tr>
                <tr><td><strong>Cloud Composer</strong></td><td>DAG orchestration, SLA tracking, error alerts</td><td>Zero data processing; triggers external APIs</td><td>Size workers small (0.5 vCPU); use Triggerers</td></tr>
                <tr><td><strong>Dataproc</strong></td><td>Heavy ETL, PySpark, MapReduce compute</td><td>Ephemeral clusters created/deleted in DAG</td><td>Preemptible/Spot VM workers</td></tr>
                <tr><td><strong>BigQuery</strong></td><td>OLAP aggregation, SQL transforms, serving</td><td>Serverless SQL queries</td><td>Partitioning & Clustering pruning</td></tr>
              </table>
            </li>
            <li><strong>Production Terraform Architecture for Private Composer 2:</strong>
<pre><code>resource "google_composer_environment" "prod_composer" {
  name   = "composer-2-prod"
  region = "us-central1"

  config {
    software_config {
      image_version = "composer-2.6.0-airflow-2.7.3"
      airflow_config_overrides = {
        "core-dags_are_paused_at_creation" = "true"
        "scheduler-min_file_process_interval" = "60"
      }
      pypi_packages = {
        "great-expectations" = "==0.18.0"
        "google-cloud-bigquery-storage" = "==2.24.0"
      }
    }
    workloads_config {
      scheduler {
        cpu        = 1.5
        memory_gb  = 4
        count      = 2
      }
      web_server {
        cpu        = 1
        memory_gb  = 2
      }
      worker {
        cpu        = 1
        memory_gb  = 4
        min_count  = 1
        max_count  = 8
      }
    }
    environment_size = "ENVIRONMENT_SIZE_MEDIUM"
    private_environment_config {
      enable_private_endpoint = false
    }
  }
}</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "composer-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>Package Installation Failures Locking the Environment:</strong> Specifying conflicting Python packages in the PyPI dependencies causes Composer's update script to fail. In Composer 1, this could leave the environment in an unrecoverable "Error" state requiring recreation. <em>Rule:</em> Test PyPI compatibility locally using the official Composer Docker image before applying changes in production.</li>
            <li><strong>Heavy In-Worker Computation Anti-Pattern:</strong> Running heavy Pandas or PySpark computations directly inside the Composer Airflow worker container. Composer is an orchestrator, NOT an execution engine. Worker memory leaks will trigger Kubernetes OOMKilled events, taking down the worker and causing all concurrent tasks to fail. <em>Rule:</em> Delegate heavy compute to Dataproc, Dataflow, or BigQuery.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "google-dataproc",
    title: "Google Dataproc",
    sections: [
      {
        id: "dataproc-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>Managed Hadoop & Spark on GCP:</strong> Deploys open-source distributed compute clusters (Apache Spark, Hadoop HDFS, YARN, Hive, Presto/Trino) on Compute Engine VMs in under 90 seconds.
              <ul>
                <li><span style='color:#6366f1'>Master Node:</span> Runs YARN ResourceManager, HDFS NameNode, and the Spark History Server.</li>
                <li><span style='color:#6366f1'>Primary Workers:</span> Run YARN NodeManager and HDFS DataNode daemons on persistent Compute Engine instances. Maintain cluster state.</li>
                <li><span style='color:#6366f1'>Secondary Workers (Preemptible/Spot):</span> Stateless worker nodes running only YARN NodeManager (no HDFS storage). Can be preempted by Google at any second with 30 seconds notice.</li>
                <li><span style='color:#6366f1'>Cloud Storage Connector (GCS):</span> Native Java connector allowing Spark and Hadoop to read/write directly to <code>gs://</code> buckets instead of running local HDFS. Enables complete separation of compute and storage.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "dataproc-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Ephemeral Clusters vs. Long-Running Clusters:</strong>
              <ul>
                <li><em>Long-Running (Anti-Pattern for Batch):</em> 24/7 static cluster. Incurs massive idle costs; prone to resource fragmentation and dependency drift.</li>
                <li><em>Ephemeral Clusters (Best Practice):</em> Created dynamically by an orchestrator (Cloud Composer) right before job execution, processes data, writes outputs to GCS/BigQuery, and terminates immediately upon completion.</li>
              </ul>
            </li>
            <li><strong>Dataproc Serverless:</strong> Eliminates cluster provisioning entirely. You submit PySpark or Spark SQL code directly to Google; Dataproc dynamically allocates, scales, and tears down containerized compute units (DCUs) automatically.</li>
            <li><strong>Initialization Actions:</strong> Bash scripts executed on all cluster nodes during creation to install custom system libraries, configure logging daemons, or tune JVM flags.</li>
            <li><strong>Autoscaling Policies:</strong> Dynamically adds or removes primary and secondary workers based on YARN pending memory and container wait metrics.</li>
          </ul>
        `
      },
      {
        id: "dataproc-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Cost Optimization via Spot Instances:</strong>
              <ul>
                <li>Configure up to 80% of cluster worker capacity as <strong>Secondary Preemptible/Spot VMs</strong> to reduce compute costs by 60-80%.</li>
                <li>Ensure primary workers (1-2 nodes) are standard VMs to prevent loss of critical coordinator state.</li>
                <li>Enable <strong>Graceful Decommissioning</strong>: Prevents jobs from crashing when a spot node is preempted by staging shuffle outputs to disk and safely migrating active tasks.</li>
              </ul>
            </li>
            <li><strong>Local SSDs for Spark Shuffle:</strong> Attach NVMe Local SSDs to worker nodes. Configure Spark's local scratch directory (<code>spark.local.dir</code>) to point to the NVMe disk. Eliminates I/O bottlenecks during heavy shuffles and spills.</li>
            <li><strong>Tuning GCS I/O:</strong> Use <code>parquet.enable.summary-metadata=false</code> to prevent Spark from scanning every Parquet footer upon write. Configure GCS connector buffer sizes (<code>fs.gs.outputstream.upload.cache.size</code>) for high-throughput network writes.</li>
          </ul>
        `
      },
      {
        id: "dataproc-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>Cluster Deployment Models Comparison:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Pattern</th><th>Startup Latency</th><th>Cost Profile</th><th>Fault Isolation</th><th>Best Use Case</th></tr>
                <tr><td><strong>Ephemeral Cluster</strong></td><td>60-90 seconds</td><td>Ultra-low (billed only during job runtime)</td><td>Complete isolation per pipeline run</td><td>Daily/hourly batch ETL jobs</td></tr>
                <tr><td><strong>Dataproc Serverless</strong></td><td>30-45 seconds</td><td>Pay per DCU-minute</td><td>Individual job sandbox</td><td>Ad-hoc data science & micro-batching</td></tr>
                <tr><td><strong>Long-Running Cluster</strong></td><td>Instant (already warm)</td><td>High (idle VM costs)</td><td>Shared cluster; noisy neighbor risk</td><td>Multi-tenant interactive notebooks</td></tr>
              </table>
            </li>
            <li><strong>Production Cloud Composer DAG (Ephemeral Dataproc Lifecycle):</strong>
<pre><code>from airflow import DAG
from airflow.providers.google.cloud.operators.dataproc import (
    DataprocCreateClusterOperator,
    DataprocSubmitJobOperator,
    DataprocDeleteClusterOperator
)
from datetime import datetime

CLUSTER_CONFIG = {
    "master_config": {"num_instances": 1, "machine_type_uri": "n2-standard-4"},
    "worker_config": {"num_instances": 2, "machine_type_uri": "n2-standard-4"},
    "secondary_worker_config": {
        "num_instances": 6,
        "machine_type_uri": "n2-standard-4",
        "is_preemptible": True
    },
    "software_config": {"image_version": "2.1-debian11"}
}

with DAG("dataproc_ephemeral_etl", start_date=datetime(2026, 1, 1), schedule_interval="@daily", catchup=False) as dag:
    create_cluster = DataprocCreateClusterOperator(
        task_id="create_dataproc_cluster",
        project_id="my-gcp-project",
        region="us-central1",
        cluster_name="ephemeral-spark-{{ ds_nodash }}",
        cluster_config=CLUSTER_CONFIG
    )

    submit_pyspark = DataprocSubmitJobOperator(
        task_id="submit_pyspark_job",
        project_id="my-gcp-project",
        region="us-central1",
        job={
            "placement": {"cluster_name": "ephemeral-spark-{{ ds_nodash }}"},
            "pyspark_job": {"main_python_file_uri": "gs://my-bucket/scripts/heavy_transform.py"}
        }
    )

    # CRITICAL: trigger_rule="all_done" guarantees teardown even if the PySpark job crashes
    delete_cluster = DataprocDeleteClusterOperator(
        task_id="delete_dataproc_cluster",
        project_id="my-gcp-project",
        region="us-central1",
        cluster_name="ephemeral-spark-{{ ds_nodash }}",
        trigger_rule="all_done"
    )

    create_cluster >> submit_pyspark >> delete_cluster</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "dataproc-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>The Orphan Cluster Trap:</strong> Creating an ephemeral cluster in Airflow, but failing to specify <code>trigger_rule='all_done'</code> on the delete operator. If the PySpark job throws an OutOfMemory error, the DAG fails immediately and skips the delete task. An 8-node cluster will remain running indefinitely, generating thousands of dollars in wasted cloud spend.</li>
            <li><strong>Hardcoded HDFS URIs:</strong> Writing output files to <code>hdfs:///data/output</code> instead of <code>gs://bucket/output</code> in an ephemeral cluster. When the cluster terminates, the local HDFS storage is destroyed permanently, losing all processed data.</li>
            <li><strong>Spot Preemption Shuffle Storms:</strong> Using 100% preemptible workers without configuring external shuffle services or GCS storage. If multiple spot nodes are reclaimed simultaneously during a massive Sort-Merge join, Spark will recompute all lost shuffle map stages from scratch (Cascading Stage Retries), eventually causing the job to fail.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "dbt-data-build-tool",
    title: "dbt (Data Build Tool)",
    sections: [
      {
        id: "dbt-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>The "T" in ELT:</strong> dbt does NOT extract or load data; it transforms data already residing inside modern cloud data warehouses (BigQuery, Snowflake, Redshift, Databricks).</li>
            <li><strong>Compilation Engine Internals:</strong>
              <ul>
                <li><span style='color:#6366f1'>Jinja Templating Engine:</span> Evaluates code macros, variables, and loops within <code>.sql</code> files.</li>
                <li><span style='color:#6366f1'>DAG Compiler:</span> Inspects all <code>{{ ref('model_name') }}</code> and <code>{{ source('source_name', 'table_name') }}</code> functions to build a global Directed Acyclic Graph (DAG) representing lineage and execution dependencies.</li>
                <li><span style='color:#6366f1'>SQL Generator:</span> Wraps standard <code>SELECT</code> statements in warehouse-specific DDL/DML (e.g., <code>CREATE OR REPLACE TABLE AS</code>, <code>MERGE INTO</code>, <code>CREATE VIEW</code>).</li>
                <li><span style='color:#6366f1'>Connection Pooler:</span> Submits compiled SQL statements concurrently to the warehouse across parallel threads (configured in <code>profiles.yml</code>).</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "dbt-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Materializations:</strong>
              <ul>
                <li><code>view</code>: Lightweight; re-executes on query. Best for staging/cleansing layers.</li>
                <li><code>table</code>: Physical table dropped and recreated on every run. Best for small-to-medium marts.</li>
                <li><code>incremental</code>: Inserts/updates only new or modified records since the last run. Essential for billion-row fact tables.</li>
                <li><code>ephemeral</code>: Compiles as a Common Table Expression (CTE) injected directly into downstream queries; never materialized physically in the database.</li>
              </ul>
            </li>
            <li><strong>Data Quality & Testing:</strong>
              <ul>
                <li><em>Generic Schema Tests:</em> Declared in YAML (<code>unique</code>, <code>not_null</code>, <code>accepted_values</code>, <code>relationships</code>).</li>
                <li><em>Singular Tests:</em> Custom SQL queries placed in <code>tests/</code>. If the query returns >0 rows, the test fails.</li>
              </ul>
            </li>
            <li><strong>dbt Snapshots (SCD Type 2):</strong> Built-in mechanism to capture point-in-time state changes of mutating source tables using either a <code>timestamp</code> or a <code>check</code> (hash of columns) strategy, automatically maintaining <code>dbt_valid_from</code> and <code>dbt_valid_to</code> columns.</li>
          </ul>
        `
      },
      {
        id: "dbt-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "🚀",
        content: `
          <ul>
            <li><strong>Incremental Strategies:</strong>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Strategy</th><th>Warehouse Support</th><th>Mechanics</th><th>Best Use Case</th></tr>
                <tr><td><strong>merge</strong> (Default)</td><td>Snowflake, BigQuery, Databricks</td><td>Performs an atomic <code>MERGE</code> on a <code>unique_key</code></td><td>Tables with frequent row updates & inserts</td></tr>
                <tr><td><strong>insert_overwrite</strong></td><td>BigQuery, Spark, Databricks</td><td>Replaces entire partitions atomically</td><td>Partition-dated fact tables (Daily batch ETL)</td></tr>
                <tr><td><strong>append</strong></td><td>All</td><td>Blind <code>INSERT</code> with zero duplicate checks</td><td>Immutable, append-only clickstream/IoT logs</td></tr>
                <tr><td><strong>delete+insert</strong></td><td>Postgres, Redshift</td><td>Deletes matching keys, then inserts new rows</td><td>Warehouses where MERGE is slow or unavailable</td></tr>
              </table>
            </li>
            <li><strong>Slim CI with State Comparison:</strong> In CI/CD pipelines, avoid running the entire warehouse. Use <code>dbt build --select state:modified+ --defer --state path/to/prod/manifest</code> to compile and test ONLY modified models and their downstream dependencies against production state.</li>
          </ul>
        `
      },
      {
        id: "dbt-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🎯",
        content: `
          <ul>
            <li><strong>Production Incremental Model (BigQuery Partition Overwrite Strategy):</strong>
<pre><code>{{
  config(
    materialized = 'incremental',
    incremental_strategy = 'insert_overwrite',
    partition_by = {
      'field': 'transaction_date',
      'data_type': 'date',
      'granularity': 'day'
    },
    cluster_by = ['customer_id', 'status']
  )
}}

WITH source_data AS (
    SELECT 
        transaction_id,
        customer_id,
        status,
        amount,
        DATE(transaction_timestamp) AS transaction_date,
        transaction_timestamp
    FROM {{ source('raw_store', 'transactions') }}
    
    {% if is_incremental() %}
    -- Dynamically look back 3 days to capture late-arriving updates without scanning full history
    WHERE DATE(transaction_timestamp) >= DATE_SUB(_dbt_max_partition, INTERVAL 3 DAY)
    {% endif %}
)

SELECT * FROM source_data;</code></pre>
            </li>
            <li><strong>Custom Generic Test Pattern (e.g., Asserting Non-Negative Currency):</strong>
<pre><code>-- macros/test_is_positive.sql
{% test is_positive(model, column_name) %}
SELECT 
    {{ column_name }} AS failing_value
FROM {{ model }}
WHERE {{ column_name }} < 0
{% endtest %}

-- models/schema.yml
version: 2
models:
  - name: fct_orders
    columns:
      - name: order_amount
        tests:
          - not_null
          - is_positive</code></pre>
            </li>
          </ul>
        `
      },
      {
        id: "dbt-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>The Missing <code>unique_key</code> Merge Trap:</strong> Configuring an incremental model with <code>incremental_strategy='merge'</code> but failing to specify a <code>unique_key</code>. Without a key to match against, dbt falls back to blind <code>INSERT</code>, silently duplicating millions of rows on every pipeline execution.</li>
            <li><strong>Late-Arriving Data Loss in Incremental Models:</strong> Filtering incremental runs strictly with <code>WHERE created_at > (SELECT MAX(created_at) FROM {{ this }})</code>. If an order from 2 days ago arrives late, it is silently ignored and permanently dropped from the reporting model. <em>Fix:</em> Always add a lookback buffer (e.g., <code>INTERVAL 3 DAY</code>) and use a merge or partition overwrite strategy.</li>
            <li><strong>Ephemeral Model Proliferation:</strong> Chaining 5 ephemeral models into multiple downstream models. Because ephemeral models are injected as inline CTEs, the warehouse compiles and computes the same underlying CTE multiple times, causing exponential query complexity and execution timeouts.</li>
          </ul>
        `
      }
    ]
  }
];
