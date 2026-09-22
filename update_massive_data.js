import fs from 'fs';
import { interviewCategories } from './src/data/interviewData.js';

const airflowQuestions = [
    {
        q: "Explain Airflow's Architecture. How do the Scheduler, Webserver, Executor, and Workers interact?",
        a: "Airflow's architecture is deeply decoupled to scale horizontally:\n\n1. **Metadata Database (PostgreSQL/MySQL):** The source of truth. Stores DAG definitions, task states, XComs, and connection credentials.\n2. **Scheduler:** The brain. It continuously parses the DAG directory, checks the metadata DB for tasks whose dependencies are met, and sends them to the Executor.\n3. **Executor:** The message broker. It dictates *how* tasks run. It doesn't run code itself; it hands tasks to workers (e.g., pushing to a Redis/RabbitMQ queue for Celery, or calling the Kubernetes API).\n4. **Workers:** The actual compute nodes that pull tasks from the queue, execute the Python code, and report the status back to the Metadata DB.\n5. **Webserver:** The UI. It reads from the Metadata DB to display task states and logs. It does *not* interact directly with the Scheduler or Workers.",
        complexity: "Intermediate"
    },
    {
        q: "Deep Dive: Celery Executor vs. Kubernetes Executor. When would you choose one over the other?",
        a: "**Celery Executor:**\n- **How it works:** Uses a static pool of standing worker nodes reading from a message queue (Redis/RabbitMQ).\n- **Pros:** Ultra-low latency for task startup (workers are already warm). Great for high-throughput, short-lived tasks.\n- **Cons:** Dependency hell. Every worker must have all Python packages installed for *every* DAG. If DAG A needs Pandas 1.0 and DAG B needs Pandas 2.0, you have a conflict.\n\n**Kubernetes Executor:**\n- **How it works:** Spawns a brand new, isolated Kubernetes Pod for every single task. Once the task finishes, the Pod dies.\n- **Pros:** Perfect isolation. Each task can use a completely different Docker image (DAG A runs Python 3.8, DAG B runs Spark). Zero wasted compute when idle.\n- **Cons:** High latency. Spinning up a Pod takes 5-15 seconds. If you have thousands of 2-second tasks, the overhead is catastrophic.\n\n*5 YOE Verdict:* Modern stacks often use the **CeleryKubernetesExecutor** (hybrid) to route lightweight tasks to Celery and heavy/isolated tasks to Kubernetes.",
        complexity: "Complex"
    },
    {
        q: "What are Deferrable Operators (Async Operators) and why are they critical for Airflow scalability?",
        a: "Historically, if you used a `Sensor` to wait for a file in S3, that task occupied an entire Airflow Worker slot and just slept (`time.sleep()`). If you had 100 sensors waiting, your entire cluster would deadlock, unable to run real tasks.\n\n**Deferrable Operators** solve this. When an operator needs to wait, it suspends itself and hands execution over to a highly efficient centralized process called the **Triggerer** (built on Python `asyncio`). \n\nA single Triggerer process can efficiently monitor tens of thousands of asynchronous events concurrently. Once the condition is met (e.g., S3 file lands), the Triggerer wakes up the task and puts it back in the queue to finish executing on a standard worker. This frees up 99% of your worker compute resources.",
        complexity: "Complex"
    },
    {
        q: "How do you handle data passing between tasks? What are the limits and dangers of XComs?",
        a: "Tasks in Airflow are designed to be idempotent and distributed—they might run on completely different servers. \n\n**XComs (Cross-Communications):**\n- Allows tasks to push/pull small metadata (e.g., passing a generated `job_id` to the next task).\n- *The Danger:* XComs are serialized and stored directly in the Airflow Metadata Database. If you try to pass a 500MB Pandas DataFrame through XCom, you will instantly crash the Airflow PostgreSQL database.\n\n**Best Practice for Big Data:**\nAirflow is an orchestrator, not an execution engine. Task A should write the DataFrame to an object store (S3/GCS) and push the *URI string* (e.g., `s3://bucket/data_2026_01.csv`) to XCom. Task B pulls the URI from XCom and downloads the data itself.",
        complexity: "Intermediate"
    },
    {
        q: "What is Idempotency in Data Engineering, and how do you ensure an Airflow DAG is idempotent?",
        a: "An idempotent task produces the exact same final state regardless of whether it is run once, twice, or fifty times. This is the holy grail of data engineering because it allows you to hit 'Clear & Rerun' after a failure without corrupting data.\n\n**How to ensure idempotency:**\n1. **Never use `INSERT` blindly:** Use `MERGE` (Upsert) or `INSERT OVERWRITE` based on partitions. \n2. **Idempotent File Writes:** If writing to S3, overwrite the specific partition prefix (e.g., `/year=2026/month=01/`) rather than appending files dynamically.\n3. **Rely on Execution Dates:** Always use Airflow's logical date variables (`{{ ds }}` or `{{ data_interval_start }}`) in your queries instead of `CURRENT_DATE()`. If a DAG fails and you rerun it 3 days later, `CURRENT_DATE()` will fetch the wrong data, breaking idempotency. `{{ ds }}` will correctly simulate the past execution time.",
        complexity: "Complex"
    }
];

const databricksQuestions = [
    {
        q: "Deep Dive: What is Unity Catalog? How does it fundamentally change data governance in Databricks?",
        a: "Historically, Databricks relied on the Hive Metastore (HMS), which was bound to a specific workspace. If you had 5 workspaces, you had 5 siloed metastores. Permissions were managed via complex cloud IAM roles, and table-level ACLs were notoriously difficult.\n\n**Unity Catalog (UC)** is a centralized, account-level governance layer:\n1. **Centralized Metastore:** One metastore governs all workspaces across your entire organization. Data is strictly referenced hierarchically: `catalog.schema.table`.\n2. **Standardized SQL ACLs:** Instead of cloud IAM roles, you grant permissions using standard ANSI SQL: `GRANT SELECT ON TABLE my_table TO group_data_scientists;`. UC translates this natively to the cloud storage layer.\n3. **Fine-Grained Governance:** UC enables Row-Level Security (RLS) and Column-Level Masking out of the box, preventing PII exposure without duplicating datasets.\n4. **Automated Lineage:** UC automatically tracks data lineage at the table and column level across all languages (SQL, Python, Scala) and displays it visually.",
        complexity: "Complex"
    },
    {
        q: "Deep Dive: Explain the Delta Lake Transaction Log (_delta_log). How does it achieve ACID transactions on Cloud Object Storage?",
        a: "Cloud Object Storage (S3, ADLS) is immutable. You cannot natively 'update' an object. Delta Lake achieves ACID transactions by managing a specialized folder called `_delta_log`.\n\n**How it works:**\n1. Every time you write, update, or delete data, Delta doesn't mutate existing Parquet files. It writes brand new Parquet files.\n2. Simultaneously, it writes a JSON commit file (e.g., `000001.json`) to the `_delta_log` directory. This JSON explicitly lists which Parquet files were `add`ed and which were `remove`d (logically deleted).\n3. When a reader queries the table, the Spark engine first reads the `_delta_log`. It computes the current state of the table by reconciling all the `add` and `remove` actions, and *only* reads the valid Parquet files, ignoring the tombstoned ones.\n\n**Checkpoints:** Reading thousands of JSON files would be slow. Every 10 commits, Delta automatically generates a Parquet Checkpoint file in the log, summarizing the entire table state. The reader just reads the latest checkpoint + any newer JSONs.",
        complexity: "Complex"
    },
    {
        q: "Databricks Photon Engine vs standard Spark. How does vectorized execution work?",
        a: "**Standard Spark** runs on the JVM (Java Virtual Machine). It processes data row-by-row (or using Tungsten's whole-stage code generation). While highly optimized, the JVM still suffers from garbage collection overhead and virtual method dispatching.\n\n**Photon** is a custom, native execution engine written entirely in **C++** that integrates seamlessly under Spark.\n- **Vectorized Execution:** Instead of processing one row at a time, Photon processes batches of data (vectors) simultaneously, utilizing modern CPU architectures (SIMD instructions - Single Instruction, Multiple Data).\n- **Bypass JVM:** For supported operations (like Aggregations, Joins, and string manipulations), the execution completely bypasses the JVM, eliminating garbage collection pauses and massively accelerating performance. If an operation isn't supported in C++, it seamlessly falls back to the JVM.",
        complexity: "Complex"
    },
    {
        q: "Structured Streaming vs Databricks Auto Loader. When and why should you use Auto Loader?",
        a: "If you want to ingest thousands of new files landing in S3 into a Delta Table, you have two options.\n\n**Standard Structured Streaming:**\n- Uses file listing (e.g., `spark.readStream.json('s3://bucket/')`). \n- *The Problem:* To find new files, Spark has to list the entire directory on every micro-batch. If your directory has 5 million files, the `ls` API call takes minutes, causing extreme bottlenecks.\n\n**Databricks Auto Loader (`cloudFiles`):**\n- Specifically engineered to ingest millions of files from cloud storage efficiently.\n- **File Notification Mode:** Instead of listing directories, Auto Loader automatically sets up Cloud Event Notifications (e.g., AWS SNS/SQS). When a file lands, an event is pushed to the queue. Auto Loader just reads the queue to know exactly which files are new. Zero directory listing required.\n- **Schema Evolution:** Auto Loader automatically detects schema changes (new columns, data type changes) and handles them gracefully using a schema location path, preventing the stream from crashing.",
        complexity: "Intermediate"
    }
];

const advancedSparkQuestions = [
    {
        q: "Deep Dive: You get an OutOfMemory (OOM) error on the Spark Driver. What causes it, and how do you fix it?",
        a: "Driver OOMs are usually caused by bad coding practices that force massive amounts of data back to the master node, overwhelming its limited memory (e.g., 4GB-8GB).\n\n**Common Causes & Fixes:**\n1. **`df.collect()`:** This pulls the entire distributed DataFrame from all Executors directly into the Driver's RAM. *Fix:* Never use `collect()` on large datasets. Use `take()`, `show()`, or write directly to storage.\n2. **Massive Broadcast Joins:** If you explicitly broadcast a table that is larger than the Driver's memory limit (or `spark.sql.autoBroadcastJoinThreshold`), the Driver will OOM while trying to collect and broadcast the table. *Fix:* Disable broadcast join or increase driver memory.\n3. **Too many partitions / Large DAG:** If you have 100,000 partitions or an extremely complex lineage, the metadata the Driver tracks for task scheduling becomes so large it exhausts the JVM heap. *Fix:* Coalesce partitions, or truncate lineage by using `df.checkpoint()`.",
        complexity: "Complex"
    },
    {
        q: "Deep Dive: You get an OOM on a Spark Executor during a Shuffle (e.g., a massive GroupBy or Join). How do you troubleshoot?",
        a: "Executor OOMs during a shuffle are primarily caused by **Data Skew** or insufficient memory per core.\n\n**Troubleshooting & Fixes:**\n1. **Identify Data Skew:** Look at the Spark UI's 'Tasks' tab. If 199 tasks finish in 5 seconds, and 1 task takes 20 minutes (or OOMs), you have skew. A single executor is choking on a massive partition (e.g., `null` values or a default 'Unknown' key). *Fix:* Filter out nulls, use Salting, or enable AQE Skew Join.\n2. **Memory per Core Ratio:** If an executor has 16GB RAM and 8 cores, each task only gets 2GB of RAM. If you are processing wide rows, they will OOM. *Fix:* Lower `spark.executor.cores` (e.g., to 4), effectively doubling the RAM available per task (4GB).\n3. **High Concurrency / Partition Size:** If partitions are too large, they won't fit in execution memory. *Fix:* Increase `spark.sql.shuffle.partitions` (default is 200) to e.g., 1000, ensuring each task processes a much smaller chunk of data.",
        complexity: "Complex"
    },
    {
        q: "Explain Spark's Unified Memory Management. What is the difference between Execution Memory and Storage Memory?",
        a: "Spark's JVM heap is divided into distinct regions. The most critical is the Unified Memory region, which dynamically shares space between Execution and Storage.\n\n**Execution Memory:**\nUsed for short-lived data during computations (Shuffles, Joins, Sorts, Aggregations). If it runs out of space, it spills to the local disk, which severely impacts performance.\n\n**Storage Memory:**\nUsed for long-lived data that you explicitly cache/persist (e.g., `df.cache()`) or broadcast variables.\n\n**The Dynamic Boundary:**\nThey share a boundary. If Execution needs memory, it can evict cached blocks from Storage Memory (forcing them to disk or dropping them entirely). However, Storage Memory *cannot* evict Execution Memory, because dropping active computation data would crash the job. \n\n*5 YOE Insight:* If your Spark job is heavily caching DataFrames but suddenly starts running incredibly slowly during a complex join, it's because Execution memory stole the space and evicted your cache to disk.",
        complexity: "Complex"
    },
    {
        q: "How does Adaptive Query Execution (AQE) dynamically handle Data Skew?",
        a: "Data Skew occurs when one join key has millions of records while others have tens. Standard Spark maps the massive key to a single partition, crushing a single executor.\n\n**AQE Skew Join Optimization:**\nAQE inspects data statistics *at runtime* during the shuffle stage. If it detects a partition that is significantly larger than the median partition size (based on `spark.sql.adaptive.skewJoin.skewedPartitionFactor`), it intervenes:\n\n1. AQE dynamically splits the massive skewed partition into multiple smaller sub-partitions.\n2. It then replicates the corresponding matching key from the other table (the smaller table) to match these new sub-partitions.\n3. The join is then processed in parallel across multiple tasks, rather than bottlenecking on one executor. This entirely eliminates the need for manual 'Salting'.",
        complexity: "Complex"
    }
];

const advancedPythonQuestions = [
    {
        q: "Generators vs. Lists. How would you process a 50GB CSV file in Python on a container with only 2GB of RAM?",
        a: "If you attempt to load a 50GB CSV using `pandas.read_csv()` or `list.readlines()`, Python will load the entire file into memory at once. The container will instantly hit its 2GB limit and the OS will kill the process (OOMKilled).\n\n**The Solution: Generators**\nGenerators (`yield` keyword) utilize lazy evaluation. They maintain internal state and only yield one row (or chunk) into memory at a time, pausing execution until the next row is requested.\n\n```python\ndef read_large_file(file_path):\n    with open(file_path, 'r') as file:\n        for line in file:\n            yield process(line)\n\nfor processed_row in read_large_file('50gb_data.csv'):\n    write_to_db(processed_row)\n```\nThis reduces memory complexity from O(N) to O(1). The memory footprint remains in the megabytes regardless of whether the file is 5GB or 500GB.",
        complexity: "Intermediate"
    },
    {
        q: "Deep Dive: Explain the Global Interpreter Lock (GIL). How does it dictate your choice between Multithreading and Multiprocessing for data pipelines?",
        a: "The GIL is a mutex in CPython that ensures only one thread executes Python bytecode at any given moment. This makes CPython thread-safe but prevents true parallel execution on multi-core CPUs.\n\n**When to use Multithreading:**\nBest for **I/O Bound** tasks (e.g., fetching data from 100 API endpoints, downloading files from S3). When Thread A makes an HTTP request, it releases the GIL while waiting for the network response. Thread B can instantly acquire the GIL and send its own HTTP request. This provides massive speedups.\n\n**When to use Multiprocessing:**\nBest for **CPU Bound** tasks (e.g., heavy regex parsing, matrix multiplications, image transformations). Because of the GIL, multithreading CPU tasks will actually be *slower* due to context switching. Multiprocessing bypasses the GIL entirely by spawning completely independent Python processes, each with its own memory space and its own GIL, allowing true parallel utilization of all CPU cores.",
        complexity: "Complex"
    },
    {
        q: "What is `__slots__` in Python, and how does it optimize memory for large datasets?",
        a: "By default, every custom object in Python stores its instance attributes in a dynamic dictionary (`__dict__`). Dictionaries have significant memory overhead because they allocate extra space to allow dynamic attribute addition at runtime.\n\nIf you are instantiating 10 million `Row` objects in a memory-constrained environment, this `__dict__` overhead is catastrophic.\n\nBy explicitly defining `__slots__ = ['id', 'name', 'value']` inside your class, you tell Python *not* to use a dynamic dictionary. Instead, Python uses a fixed-size array in C to store the attributes. This prevents the dynamic addition of new attributes, but reduces the RAM usage of millions of objects by 40% to 50%, while also slightly speeding up attribute access.",
        complexity: "Complex"
    },
    {
        q: "How do you optimize the memory usage of a massive Pandas DataFrame before attempting transformations?",
        a: "Pandas notoriously defaults to heavy 64-bit data types. A 10GB dataset on disk can easily balloon to 30GB+ in Pandas RAM.\n\n**Optimization Strategies:**\n1. **Downcasting Numerics:** Pandas loads all integers as `int64` and floats as `float64`. If your integer column represents 'age' (0-100), you can safely downcast it to `int8`, reducing the memory footprint of that column by 87.5%.\n2. **Categorical Data Types:** If you have a string column with low cardinality (e.g., a 'Status' column with only 'Pending', 'Shipped', 'Delivered', but repeated 50 million times), Pandas stores 50 million full strings. Converting this to `.astype('category')` creates an internal mapping dictionary (0, 1, 2). It stores the lightweight integers instead of the heavy strings, drastically cutting memory usage and vastly accelerating group-by operations.\n3. **Chunking:** Use `pd.read_csv(chunksize=10000)` to process the data iteratively rather than loading it entirely into memory.",
        complexity: "Intermediate"
    }
];

const advancedSqlQuestions = [
    {
        q: "Deep Dive: CTEs (Common Table Expressions) vs. Temporary Tables. What is the performance difference and when do you use each?",
        a: "**CTE (`WITH` clause):**\n- **How it works:** A CTE is generally evaluated as an inline view. It does *not* store data physically. In many databases (like PostgreSQL), if you reference the same CTE three times in your main query, the database engine will re-calculate the CTE three separate times.\n- **Use Case:** Great for readability, recursive queries (hierarchies), and organizing complex logic into manageable steps.\n\n**Temporary Table (`CREATE TEMP TABLE`):**\n- **How it works:** A Temp Table physically materializes the data into disk/memory for the duration of the session. You can build indexes on it.\n- **Use Case:** Crucial for massive datasets where you need to reference the intermediate result multiple times. By materializing it once, you pay the compute cost once. If a CTE takes 5 minutes to run and you reference it 4 times, the query takes 20 minutes. A Temp table runs in 5 minutes, and subsequent reads take milliseconds.",
        complexity: "Complex"
    },
    {
        q: "Explain B-Tree Indexes vs Columnar Storage formats (like Parquet). Why are B-Trees highly inefficient for OLAP Data Warehouses?",
        a: "**B-Tree (Row-Based OLTP):**\n- The default index in MySQL/PostgreSQL. It organizes row locators in a balanced tree. \n- **Why it's bad for OLAP:** B-Trees are optimized for 'needle in a haystack' point lookups (e.g., `SELECT * WHERE user_id = 123`). In OLAP, you rarely fetch one row. You run aggregates on millions of rows (`SUM(revenue) GROUP BY month`). A B-Tree forces the engine to read the entire row (all columns) from disk just to get the revenue value, resulting in massive wasted I/O.\n\n**Columnar Storage (OLAP):**\n- Stores values column-by-column contiguously on disk. \n- **Why it's great for OLAP:** If you run `SUM(revenue)`, the engine only reads the contiguous 'revenue' data blocks from disk, completely ignoring the other 100 columns. Furthermore, because column values are highly similar (e.g., millions of repeated 'USD' currency codes), columnar storage compresses beautifully (Snappy, Zstd), drastically reducing disk I/O.",
        complexity: "Complex"
    },
    {
        q: "How do you analyze a Query Execution Plan (`EXPLAIN`)? What specific bottlenecks are you looking for?",
        a: "An execution plan is the physical strategy the database optimizer chooses to execute your query.\n\n**Red Flags to look for:**\n1. **Sequential Scans / Full Table Scans:** The engine is reading every single row in the table because it couldn't find an index or partition to prune data. Fine for tiny tables, disastrous for billion-row fact tables.\n2. **Nested Loop Joins on large datasets:** Nested Loops iterate over every row in Table A and search for a match in Table B (O(N*M) complexity). Excellent for joining a 10-row table, but if you see a Nested Loop between two 1M-row tables, the query will hang forever. The optimizer should be using a **Hash Join** or **Sort-Merge Join** instead.\n3. **Hash Aggregates spilling to disk:** If your `GROUP BY` has too many high-cardinality groups, the hash table won't fit in memory and will spill to temp disk space, slowing performance to a crawl.",
        complexity: "Complex"
    }
];

const generalDeQuestions = [
    {
        q: "What are Data Contracts? How do they solve the 'silent schema change' problem between Software Engineers and Data Engineers?",
        a: "The most common friction point in data pipelines is when upstream Software Engineers change a database schema (e.g., dropping a column, changing a status string from 'shipped' to 'Shipped') without telling the Data Team, instantly breaking downstream dashboards and ML models.\n\n**Data Contracts** solve this.\nA Data Contract is a formalized agreement (usually defined in YAML/JSON Schema) between data producers and data consumers. It defines the exact schema, data types, and semantic expectations of the data.\n\n**Enforcement:**\nThe contract is enforced in the CI/CD pipeline of the *Software Engineer's* application. If a software engineer tries to deploy a PR that renames the `user_id` column to `account_id`, the CI/CD pipeline runs a test against the Data Contract, fails the build, and prevents the code from reaching production. Producers become accountable for the data they emit.",
        complexity: "Complex"
    },
    {
        q: "Lambda vs Kappa Architecture. Why is the industry slowly migrating toward Kappa?",
        a: "**Lambda Architecture:**\nMaintains two entirely separate paths for data processing:\n1. A **Batch Layer** (e.g., Spark, Airflow) that processes massive historical data accurately (the source of truth).\n2. A **Speed Layer** (e.g., Flink, Kafka) that provides low-latency approximations for real-time dashboards.\n*The Problem:* You have to write, maintain, and debug two completely different codebases (e.g., SQL for batch, Java/Scala for streaming) that do the exact same logic. \n\n**Kappa Architecture:**\nEliminates the Batch layer entirely. **Everything is a stream.**\nData is ingested into a massively scalable messaging system with infinite retention (like Kafka or Apache Pulsar). Both real-time processing and historical backfills are executed by the exact same stream processing engine using the exact same codebase. You simply rewind the Kafka offset to the beginning of time to perform 'batch' reprocessing.",
        complexity: "Intermediate"
    }
];

// Append to respective categories or create new ones
const mergeQuestions = (categoryId, title, questions) => {
    let catIndex = interviewCategories.findIndex(c => c.id === categoryId);
    if (catIndex >= 0) {
        // Filter out duplicates based on exact question string just in case
        const existingQs = new Set(interviewCategories[catIndex].questions.map(q => q.q));
        const toAdd = questions.filter(q => !existingQs.has(q.q));
        interviewCategories[catIndex].questions.push(...toAdd);
    } else {
        interviewCategories.push({
            id: categoryId,
            title: title,
            questions: questions
        });
    }
};

mergeQuestions("apache-airflow", "Apache Airflow", airflowQuestions);
mergeQuestions("spark-databricks", "Spark & Databricks", databricksQuestions);
mergeQuestions("spark-databricks", "Spark & Databricks", advancedSparkQuestions); // merging databricks and spark together
mergeQuestions("python", "Python & Core CS", advancedPythonQuestions);
mergeQuestions("sql-databases", "SQL & Databases", advancedSqlQuestions);
mergeQuestions("system-design-deep-dive", "System Design (Deep Dives)", generalDeQuestions);

const jsContent = `export const interviewCategories = ${JSON.stringify(interviewCategories, null, 4)};\n`;
fs.writeFileSync('./src/data/interviewData.js', jsContent, 'utf-8');
console.log("Massive dataset updated with 5 YOE deep-dives across all 6 topics.");
