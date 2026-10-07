// Auto-generated module: dataflow
// Primary questions count: 5

export const dataflowQuestions = [
  {
    "id": "dataflow-handling-late-arriving-data-streaming",
    "qNo": 69,
    "q": "How do you handle late-arriving data in streaming pipelines?",
    "a": "In distributed systems, an event generated at 12:00 PM might not reach the processing engine until 12:05 PM due to network lag. We handle this using **Event Time and Watermarks** in Spark/Flink.\n\n- **Event Time:** We group data based on the timestamp *inside* the payload (when it happened), not the Processing Time (when the server received it).\n- **Watermarks:** A threshold defining how long the system will wait for late data before finalizing a time window. If a watermark is set to 10 minutes, an event arriving 5 minutes late is included in its correct window. An event arriving 15 minutes late is dropped (or routed to a Dead Letter Queue) to prevent state memory from growing infinitely.",
    "complexity": "Complex",
    "topics": [
      "dataflow",
      "pubsub-kafka",
      "distributed-systems"
    ],
    "tags": [
      "late-arriving-data",
      "watermarks",
      "triggers",
      "allowed-lateness",
      "dead-letter-queue",
      "windowing"
    ]
  },
  {
    "id": "dataflow-apache-beam-execution-model-pcollections-ptransforms",
    "qNo": 114,
    "q": "Explain the Apache Beam Execution Model underlying Google Cloud Dataflow. What are PCollections, PTransforms, and ParDo, and how does the Pipeline Runner abstraction work?",
    "a": "Google Cloud Dataflow is the fully managed, serverless execution service for **Apache Beam** pipelines. Apache Beam provides a unified programming model that handles both batch and streaming pipelines using the exact same code and APIs.\n\n### 1. Core Beam Building Blocks\n```\n[ PCollection (Input) ] ---> [ PTransform (e.g. ParDo) ] ---> [ PCollection (Output) ]\n```\n1. **Pipeline:** Encapsulates the entire DAG of data processing tasks from read to write.\n2. **PCollection (Parallel Collection):**\n   - Represents a multi-element distributed dataset.\n   - **Immutable:** Once created, you cannot modify elements in place; transforms create a new PCollection.\n   - **Bounded vs. Unbounded:** A batch dataset is bounded (finite size); a streaming dataset from Pub/Sub or Kafka is unbounded (infinite).\n3. **PTransform (Parallel Transform):**\n   - Represents a data processing operation. Takes one or more PCollections as input and produces one or more PCollections as output.\n   - Examples: `Map`, `Filter`, `GroupByKey`, `Combine`, `WindowInto`.\n\n### 2. ParDo and the DoFn Lifecycle\n`ParDo` is the core parallel transformation primitive in Beam (analogous to Spark's `flatMap`):\n- It invokes a user-defined function class called **`DoFn`** on every element in the input PCollection.\n- **DoFn Lifecycle Methods:**\n  - `setup()`: Called once per worker instance during initialization (e.g., instantiate an HTTP client or database pool).\n  - `startBundle()`: Called before processing a batch of elements.\n  - `process(element)`: The core processing logic executed for each input item.\n  - `finishBundle()`: Called after processing the bundle (e.g., flush batch buffer to BigQuery).\n  - `teardown()`: Cleanup connections before the worker is destroyed.\n\n### 3. The Runner Abstraction\nApache Beam decouples the **Pipeline Code** from the **Execution Engine**:\n- You write code in Python, Java, or Go using Beam SDK.\n- You configure the **Runner**:\n  - `DirectRunner`: Executes locally on your laptop for unit testing and debugging.\n  - `DataflowRunner`: Compiles the Beam DAG into Google Cloud Dataflow's execution graph, which automatically provisions Compute Engine VMs, autotunes streaming worker counts, and handles checkpointing.\n  - `SparkRunner` / `FlinkRunner`: Executes the exact same pipeline on Apache Spark or Apache Flink clusters on-premises!",
    "complexity": "Intermediate",
    "topics": [
      "dataflow",
      "distributed-systems"
    ],
    "tags": [
      "apache-beam",
      "pcollections",
      "ptransforms",
      "pardo",
      "dofn",
      "runner-execution",
      "batch-and-streaming"
    ],
    "codeSnippet": "import apache_beam as beam\n\nclass ParseAndFilterLogs(beam.DoFn):\n    def process(self, element):\n        # element is a raw log string\n        fields = element.split(',')\n        if len(fields) == 4 and fields[2] == 'ERROR':\n            yield {'timestamp': fields[0], 'user_id': fields[1], 'message': fields[3]}\n\nwith beam.Pipeline(runner='DataflowRunner', options=pipeline_options) as p:\n    (p | \"ReadFromPubSub\" >> beam.io.ReadFromPubSub(subscription=sub_path)\n       | \"FilterErrors\" >> beam.ParDo(ParseAndFilterLogs())\n       | \"WriteToBigQuery\" >> beam.io.WriteToBigQuery(\"my_project:logs.errors\"))"
  },
  {
    "id": "dataflow-windowing-strategies-fixed-sliding-session",
    "qNo": 115,
    "q": "Compare Windowing Strategies in streaming Dataflow: Fixed (Tumbling), Sliding (Hopping), and Session Windows. How do you handle dynamic gaps and session timeouts in user journey analysis?",
    "a": "In streaming pipelines processing unbounded datasets, aggregations like `COUNT` or `SUM` cannot operate on the entire stream (since the stream never ends). Windowing divides unbounded data into logical, bounded temporal chunks based on **Event Time**.\n\n### 1. The Three Windowing Types\n\n```\n1. Fixed Windows (Tumbling): Non-overlapping, fixed duration\n   [ 00:00 - 00:05 ] [ 00:05 - 00:10 ] [ 00:10 - 00:15 ]\n\n2. Sliding Windows (Hopping): Overlapping, fixed duration + slide frequency\n   [ 00:00 - 00:10 ]\n         [ 00:05 - 00:15 ]\n               [ 00:10 - 00:20 ]\n\n3. Session Windows: Per-key, dynamic duration bounded by inactivity gaps\n   Key A: [=== Event === Event ===] (30m gap) [=== Event ===]\n   Key B:         [=== Event ===] (30m gap)         [=== Event ===]\n```\n\n1. **Fixed (Tumbling) Windows:**\n   - Elements fall into exactly one non-overlapping time interval (e.g. hourly metric aggregations).\n   - Beam: `beam.WindowInto(window.FixedWindows(60))` (60 seconds).\n2. **Sliding (Hopping) Windows:**\n   - Windows have a fixed duration and a slide frequency. Each element can belong to multiple concurrent windows.\n   - Example: Calculating a 10-minute moving average recalculated every 1 minute.\n   - Beam: `beam.WindowInto(window.SlidingWindows(size=600, period=60))`.\n3. **Session Windows:**\n   - Driven by **inactivity gaps** rather than fixed clock time.\n   - Scoped strictly **per key** (e.g. `user_id`).\n   - If user events arrive within the inactivity threshold (e.g. 15 minutes of each other), they are continuously merged into the active session. If 15 minutes pass with no activity, the session window closes. If a late event arrives that bridges two previously separate sessions, Beam dynamically **merges** the two windows into one!\n\n### 2. Session Windowing for User Journeys in PyBeam\n```python\nfrom apache_beam import window\n\nsessioned_events = (\n    raw_user_clicks\n    | \"PairWithKey\" >> beam.Map(lambda event: (event['user_id'], event))\n    | \"WindowIntoSessions\" >> beam.WindowInto(\n        window.Sessions(gap_size=1800), # 30-minute inactivity gap\n        trigger=trigger.AfterWatermark(),\n        accumulation_mode=trigger.AccumulationMode.DISCARDING\n    )\n    | \"CalculateSessionDuration\" >> beam.CombinePerKey(SessionMetricsCombiner())\n)\n```",
    "complexity": "Complex",
    "topics": [
      "dataflow",
      "pubsub-kafka"
    ],
    "tags": [
      "windowing",
      "fixed-windows",
      "sliding-windows",
      "session-windows",
      "dynamic-gap-duration",
      "user-journey"
    ],
    "codeSnippet": "# Session windowing in Apache Beam\nbeam.WindowInto(\n    window.Sessions(gap_size=30 * 60), # 30 min inactivity timeout\n    allowed_lateness=window.Duration(seconds=3600)\n)"
  },
  {
    "id": "dataflow-watermarks-triggers-accumulation-modes",
    "qNo": 116,
    "q": "How do Watermarks, Triggers, and Accumulation Modes work together in Apache Beam / Dataflow? How do you balance latency, completeness, and cost for late-arriving data?",
    "a": "In distributed streaming, network partitions, mobile reconnections, and device clock skew mean data arrives out of order. **Event Time** (when the event occurred in the real world) almost never matches **Processing Time** (when the event reaches your pipeline).\n\nBeam solves this via the trinity: **Watermarks**, **Triggers**, and **Accumulation Modes**.\n\n### 1. Watermarks: The Clock of Event Time Completeness\nThe **Watermark** is a monotonically increasing timestamp representing the system's heuristic assertion: *\"We believe all data with an event timestamp $\\le T$ has now been observed.\"*\n- **Heuristic Watermark:** If the watermark reaches 12:00 PM, Dataflow expects no further data from 11:59 AM.\n- **Late Data:** Any element arriving with an Event Timestamp $< \\text{Current Watermark}$ is explicitly classified as **Late Data**.\n\n### 2. Triggers: Deciding WHEN to Emit Output\nTriggers determine precisely when a window's partial or final results are emitted:\n1. **At-Watermark Trigger (Default):** Emits when the watermark passes the end of the window.\n2. **Early Triggers (Speculative):** Emits intermediate speculative results before the watermark arrives to satisfy low-latency dashboard requirements (e.g. every 10 seconds).\n3. **Late Triggers:** Emits updated results whenever late-arriving data lands after the watermark has passed, up until the **`allowed_lateness`** cutoff.\n\n### 3. Accumulation Modes: WHAT to Emit\nWhen a trigger fires multiple times for the same window, how should the new pane relate to previous panes?\n- **Accumulating Panes:** Each firing includes the accumulated total of all prior data plus the new data (e.g. Pane 1: $100, Pane 2: $150). Ideal when downstream sinks are idempotent upserts (like BigQuery or Elasticsearch).\n- **Discarding Panes:** Each firing contains only the delta changes that arrived since the last pane was emitted (e.g. Pane 1: $100, Pane 2: $50). Ideal when downstream sinks are message queues (like Pub/Sub or Kafka) performing incremental increments.\n\n### 4. Code Pattern\n```python\nfrom apache_beam.transforms.trigger import (\n    AfterWatermark, AfterProcessingTime, AfterCount, Repeatedly, AccumulationMode\n)\n\nwindowed_clicks = events | beam.WindowInto(\n    window.FixedWindows(300), # 5-minute event-time window\n    trigger=AfterWatermark(\n        early=Repeatedly(AfterProcessingTime(10)), # Emit speculative results every 10s\n        late=Repeatedly(AfterCount(1))             # Emit instantly on every late record\n    ),\n    allowed_lateness=86400, # Accept late data up to 24 hours\n    accumulation_mode=AccumulationMode.ACCUMULATING\n)\n```",
    "complexity": "Complex",
    "topics": [
      "dataflow",
      "pubsub-kafka"
    ],
    "tags": [
      "event-time-watermark",
      "processing-time",
      "early-triggers",
      "late-data",
      "accumulating-panes",
      "discarding-panes"
    ],
    "codeSnippet": "beam.WindowInto(\n    window.FixedWindows(60),\n    trigger=AfterWatermark(\n        early=AfterProcessingTime(5),\n        late=AfterCount(1)\n    ),\n    allowed_lateness=3600,\n    accumulation_mode=AccumulationMode.ACCUMULATING\n)"
  },
  {
    "id": "dataflow-exactly-once-semantics-and-deduplication",
    "qNo": 117,
    "q": "How does Google Cloud Dataflow achieve Exactly-Once Processing Semantics across streaming sources and sinks (Pub/Sub to BigQuery)?",
    "a": "Achieving **Exactly-Once Semantics (EOS)** across a distributed streaming architecture requires coordinated guarantees across the **Source**, the **Processing Engine (Dataflow)**, and the **Sink**.\n\n### 1. Source Level: Pub/Sub Integration & Message IDs\n- Standard Pub/Sub guarantees **at-least-once** delivery; network timeouts can cause Pub/Sub to redeliver messages.\n- **Deduplication via Record IDs:** When Dataflow consumes from Pub/Sub, it tracks the globally unique `message_id` (or a custom business ID attached via `with_id_attribute`). Dataflow maintains an internal distributed bloom filter and state store to discard redelivered duplicate messages within a 10-minute sliding window.\n\n### 2. Processing Engine: Dataflow Deterministic Checkpointing\nDataflow uses a distributed snapshotting and checkpointing mechanism inspired by the MillWheel engine:\n1. **State and Timer Tracking:** State (like window accumulators) is checkpointed atomically to persistent storage alongside the consumer offsets.\n2. **Deterministic Replay:** If a Dataflow worker crashes midway through executing a bundle of records, the uncommitted work is re-executed on another worker. Because state transitions are recorded atomically with input acknowledgments, side effects are never applied twice to the internal state.\n\n### 3. Sink Level: Idempotency & BigQuery Storage Write API\nThe hardest part of EOS is writing to the destination sink without duplicates upon retry:\n1. **BigQuery Storage Write API (Default in modern Dataflow):**\n   - Operates using **Pending Streams**. Dataflow writes records into a staged stream.\n   - Once a bundle of records is fully processed and checkpointed, Dataflow issues an atomic **Commit** operation on the stream.\n   - The commit includes stream offsets. If a worker retried and attempted to commit duplicate offsets, BigQuery automatically rejects the duplicate writes, guaranteeing zero duplicate rows in the final analytics table.\n2. **Idempotent Upserts:**\n   - When writing to databases, Dataflow leverages deterministic record IDs as primary keys with `INSERT ... ON CONFLICT (id) DO UPDATE` or `MERGE` semantics.",
    "complexity": "Complex",
    "topics": [
      "dataflow",
      "distributed-systems"
    ],
    "tags": [
      "exactly-once",
      "idempotent-sinks",
      "deduplication",
      "pubsub-integration",
      "bigquery-streaming",
      "storage-write-api"
    ],
    "codeSnippet": "# Ensuring exactly-once streaming writes from Pub/Sub to BigQuery in Beam\n(p | \"ReadPubSub\" >> beam.io.ReadFromPubSub(\n        subscription=sub_path,\n        id_label=\"event_id\" # Use business event_id for source deduplication\n     )\n   | \"Transform\" >> beam.ParDo(TransformEvents())\n   | \"WriteBigQuery\" >> beam.io.WriteToBigQuery(\n        table_spec,\n        method=beam.io.WriteToBigQuery.Method.STORAGE_WRITE_API, # Exactly-once stream\n        create_disposition=beam.io.BigQueryDisposition.CREATE_NEVER\n     ))"
  }
];
