export const bigDataNotes = [
  {
    id: "hadoop",
    title: "Hadoop",
    sections: [
      {
        id: "hadoop-arch",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <p><strong>HDFS (Hadoop Distributed File System) Internals:</strong></p>
          <ul>
            <li><span style='color:#6366f1'>NameNode:</span> Manages the filesystem namespace and maps files to blocks. Stores metadata entirely in RAM. Uses <code>fsimage</code> (point-in-time snapshot) and <code>edits</code> (write-ahead log).</li>
            <li><span style='color:#6366f1'>DataNode:</span> Stores actual block data. Periodically sends heartbeats and block reports to the NameNode.</li>
            <li><span style='color:#6366f1'>Block Replication:</span> Default block size is 128MB. Default replication factor is 3 to ensure fault tolerance.</li>
            <li><span style='color:#6366f1'>Rack Awareness:</span> Replica placement policy ensures fault tolerance: 1st replica on the local node (or random node), 2nd replica on a different rack, 3rd replica on the same rack as the 2nd but a different node. This minimizes cross-rack network traffic and protects against single-rack failure.</li>
            <li><span style='color:#6366f1'>High Availability (HA):</span> Solves the Single Point of Failure (SPOF). Uses Active and Standby NameNodes. Edits are shared via a quorum of <strong>JournalNodes</strong>. <strong>ZKFailoverController (ZKFC)</strong> runs on each NameNode and uses ZooKeeper for automatic leader election and failover.</li>
          </ul>
          <br/>
          <p><strong>YARN (Yet Another Resource Negotiator) Internals:</strong></p>
          <ul>
            <li><span style='color:#6366f1'>ResourceManager (RM):</span> The ultimate authority that arbitrates resources among all applications. Consists of a Pluggable Scheduler and ApplicationsManager.</li>
            <li><span style='color:#6366f1'>NodeManager (NM):</span> Per-machine agent responsible for containers, monitoring resource usage (CPU, memory, disk, network), and reporting to the RM.</li>
            <li><span style='color:#6366f1'>ApplicationMaster (AM):</span> A per-application, framework-specific library tasked with negotiating resources from the RM and working with NMs to execute and monitor tasks.</li>
            <li><span style='color:#6366f1'>Container Allocation:</span> The fundamental unit of resource allocation in YARN, encapsulating CPU vCores and memory.</li>
          </ul>
        `
      },
      {
        id: "hadoop-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <p><strong>MapReduce Execution Model:</strong></p>
          <ul>
            <li><span style='color:#6366f1'>InputSplits:</span> The logical representation of data to be processed by a single Mapper. HDFS blocks are physical; InputSplits are logical. Usually, 1 Split = 1 Block to preserve data locality.</li>
            <li><span style='color:#6366f1'>Combiners:</span> Mini-reducers that run locally on the Map output before it's sent over the network. They dramatically reduce shuffle network traffic. Combiner functions must be commutative and associative.</li>
            <li><span style='color:#6366f1'>Partitioners:</span> Determine which Reducer receives which key-value pair. Default is <code>HashPartitioner</code>: <code>hash(key) % num_reducers</code>. Custom partitioners are used to route specific keys to specific reducers (e.g., secondary sorting).</li>
            <li><span style='color:#6366f1'>Shuffle & Sort:</span> The most expensive phase. Map outputs are sorted by key, written to local disk, merged, fetched by Reducers over HTTP, and merged again before being fed to the <code>reduce()</code> function.</li>
            <li><span style='color:#6366f1'>Speculative Execution:</span> If a task is running significantly slower than others (straggler), Hadoop launches a duplicate task on another node. The first to finish wins; the other is killed.</li>
          </ul>
        `
      },
      {
        id: "hadoop-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "⚡",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Data Locality:</span> Moving computation to data is cheaper than moving data to computation. Delay scheduling can be used in YARN to wait a few seconds for a local node to free up before falling back to rack-local or off-rack.</li>
            <li><span style='color:#6366f1'>Block Size Tuning:</span> Increasing block size (e.g., 256MB or 512MB) reduces NameNode memory footprint and minimizes map task overhead for huge files, but reduces parallelism.</li>
            <li><span style='color:#6366f1'>Compression Codecs:</span> Compressing map outputs reduces shuffle time. Use fast codecs like Snappy or LZO for intermediate data. For final output, Gzip or Bzip2 might be used depending on storage vs CPU tradeoffs. Note: Gzip is not splittable.</li>
            <li><span style='color:#6366f1'>JVM Reuse:</span> Reusing JVMs for subsequent tasks on the same node avoids the startup overhead of spinning up a new JVM per task.</li>
            <li><span style='color:#6366f1'>Schedulers:</span> 
              <ul>
                <li><strong>Capacity Scheduler:</strong> Guarantees minimum cluster capacity to distinct queues, allowing burstability.</li>
                <li><strong>Fair Scheduler:</strong> Dynamically balances resources so all running jobs get an equal share of resources over time.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "hadoop-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🧠",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Engine Architecture Comparison:</span>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Feature</th><th>MapReduce (Hadoop)</th><th>Apache Tez (Hive)</th><th>Apache Spark</th></tr>
                <tr><td><strong>Execution Model</strong></td><td>Two-stage (Map &rarr; Disk &rarr; Reduce)</td><td>Arbitrary DAG of tasks in-memory/disk</td><td>General DAG with in-memory pipeline</td></tr>
                <tr><td><strong>Intermediate I/O</strong></td><td>Hard writes to local disk after every Map and Reduce</td><td>Pipelined in memory; spill to disk on memory pressure</td><td>Kept in RAM (Tungsten); spills on memory pressure</td></tr>
                <tr><td><strong>Fault Tolerance</strong></td><td>Re-runs failed task; intermediate state on disk</td><td>Re-runs failed DAG node; intermediate state staged</td><td>Re-computes partition via RDD Lineage DAG</td></tr>
                <tr><td><strong>Latency Profile</strong></td><td>Minutes to hours (High batch latency)</td><td>Seconds to minutes (Optimized SQL)</td><td>Sub-second to minutes (Interactive & batch)</td></tr>
              </table>
            </li>
            <li><span style='color:#6366f1'>Word Count with Combiner Pattern (Python Hadoop Streaming):</span>
<pre><code># mapper.py
import sys
for line in sys.stdin:
    for word in line.strip().split():
        print(f"{word}\t1")

# reducer.py (combines local counts before final reduce)
import sys
curr_word, curr_count = None, 0
for line in sys.stdin:
    word, count = line.strip().split('\t', 1)
    count = int(count)
    if curr_word == word:
        curr_count += count
    else:
        if curr_word:
            print(f"{curr_word}\t{curr_count}")
        curr_word, curr_count = word, count
if curr_word:
    print(f"{curr_word}\t{curr_count}")</code></pre>
            </li>
            <li><span style='color:#6366f1'>Joins in MapReduce:</span>
              <ul>
                <li><strong>Reduce-Side Join:</strong> Emit records from both datasets in Mappers. Reducer receives records from both, uses tags to distinguish them, and performs the join. Scalable but requires massive network shuffling.</li>
                <li><strong>Map-Side Join:</strong> One dataset is small enough to be loaded into memory via <code>DistributedCache</code>. The Mapper loads it into a hash map and streams the large dataset through it, completely bypassing the Reducer and shuffle.</li>
              </ul>
            </li>
            <li><span style='color:#6366f1'>Secondary Sort:</span> Custom partitioner routes by natural key, but records arrive sorted by value via a composite key comparator.</li>
          </ul>
        `
      },
      {
        id: "hadoop-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><span style='color:#6366f1'>The Small Files Problem:</span> HDFS struggles with millions of small files because each file, block, and directory takes ~150 bytes in NameNode RAM. A million tiny files consume 150MB of precious heap, causing OOM. <strong>Solution:</strong> Use Hadoop Archives (HAR), SequenceFiles, HBase, or compact small files.</li>
            <li><span style='color:#6366f1'>Data Skew in Reducers:</span> If 90% of data has the same key (e.g., NULLs), one Reducer gets overloaded while others sit idle. <strong>Solution:</strong> Salting (appending random numbers to keys during map phase), using a two-stage MapReduce (local aggregation then global), or filtering skew keys.</li>
            <li><span style='color:#6366f1'>SPOF (Pre-HA):</span> Explaining what happened if the NameNode died before HA (cluster downtime, manual intervention with SecondaryNameNode which is NOT a hot standby).</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "hive",
    title: "Hive",
    sections: [
      {
        id: "hive-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Metastore:</span> Central repository for Hive metadata (schemas, partition locations). Often backed by an RDBMS like MySQL or Postgres for production, as the default Derby database only supports a single concurrent connection.</li>
            <li><span style='color:#6366f1'>HiveServer2 (HS2):</span> Enables remote clients to execute queries against Hive. Provides multi-client concurrency, authentication, and JDBC/ODBC support.</li>
            <li><span style='color:#6366f1'>Execution Engines:</span> Originally MapReduce (slow, write-heavy). Now uses <strong>Tez</strong> (creates direct DAGs, eliminates unnecessary HDFS writes between stages) or Spark.</li>
            <li><span style='color:#6366f1'>LLAP (Live Long and Process):</span> Sub-second SQL execution in Hive via persistent daemon processes on worker nodes. Caches data in memory and avoids container startup overhead, enabling interactive BI queries.</li>
          </ul>
        `
      },
      {
        id: "hive-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <table style='width:100%; text-align:left; border-collapse:collapse;'>
            <tr>
              <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Feature</th>
              <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Managed Table</th>
              <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>External Table</th>
            </tr>
            <tr>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Data Ownership</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Hive manages both data and metadata.</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Hive manages metadata; HDFS manages data.</td>
            </tr>
            <tr>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>DROP Behavior</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Deletes metadata AND underlying HDFS data.</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Deletes metadata ONLY. Data remains safe.</td>
            </tr>
          </table>
          <br/>
          <ul>
            <li><span style='color:#6366f1'>Partitioning:</span> Organizes tables into sub-directories based on column values (e.g., <code>/year=2023/month=10</code>). Excellent for coarse-grained filtering.</li>
            <li><span style='color:#6366f1'>Bucketing:</span> Decomposes data into a fixed number of files (buckets) using a hash function on a column. Great for sampling and optimized map-side joins.</li>
            <li><span style='color:#6366f1'>SerDe (Serializer/Deserializer):</span> Instructs Hive how to read/write records. E.g., OpenCSVSerde, RegexSerDe, ParquetHiveSerDe.</li>
            <li><span style='color:#6366f1'>UDFs:</span> <strong>UDF</strong> (1 row in, 1 out), <strong>UDAF</strong> (Many rows in, 1 out, e.g., SUM), <strong>UDTF</strong> (1 row in, many rows out, e.g., explode).</li>
          </ul>
        `
      },
      {
        id: "hive-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "⚡",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Partition Pruning:</span> Pushing <code>WHERE</code> clause filters on partition columns to the metadata layer. Skips scanning entire directories of irrelevant data.</li>
            <li><span style='color:#6366f1'>Predicate Pushdown (PPD):</span> Pushing filters down to the storage format level (like Parquet/ORC) so that irrelevant row groups or stripes are skipped before data is even deserialized.</li>
            <li><span style='color:#6366f1'>Vectorized Execution:</span> Processes batches of 1024 rows at a time instead of row-by-row. Greatly improves CPU cache utilization and reduces virtual method calls.</li>
            <li><span style='color:#6366f1'>Cost-Based Optimizer (CBO):</span> Uses table statistics (number of rows, column histograms) to generate optimal query plans (e.g., deciding join order, choosing between Map Join vs Sort-Merge Join). Powered by Apache Calcite.</li>
            <li><span style='color:#6366f1'>Tez Container Reuse:</span> Tez keeps JVM containers alive across task executions within the same query DAG, removing YARN container spin-up overhead.</li>
          </ul>
        `
      },
      {
        id: "hive-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🧠",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Schema-on-Read vs Schema-on-Write:</span> RDBMS uses schema-on-write (data is validated upon insertion). Hive uses schema-on-read (data is written blindly to HDFS; schema is applied only when queried). If data doesn't match the schema, Hive returns NULLs rather than failing.</li>
            <li><span style='color:#6366f1'>Dynamic Partitioning:</span>
              <pre><code>SET hive.exec.dynamic.partition=true;
SET hive.exec.dynamic.partition.mode=nonstrict;
INSERT INTO TABLE sales PARTITION (year, month)
SELECT id, amount, year, month FROM raw_sales;</code></pre>
            </li>
            <li><span style='color:#6366f1'>CTAS (Create Table As Select):</span> Used for materializing query results or converting file formats (e.g., CSV to Parquet).</li>
          </ul>
        `
      },
      {
        id: "hive-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Small Files from Dynamic Partitioning:</span> A reducer might write to many partitions simultaneously. If you have 100 reducers writing to 100 partitions, you get 10,000 small files. <strong>Fix:</strong> Use <code>DISTRIBUTE BY partition_col</code> before inserting to ensure one reducer writes to one partition.</li>
            <li><span style='color:#6366f1'>Cartesian Joins:</span> Leaving out a join condition causes a massive cross-join. Prevent this with <code>SET hive.mapred.mode=strict;</code>.</li>
            <li><span style='color:#6366f1'>Skew in GROUP BY:</span> If one key is extremely common, one reducer gets all the load. <strong>Fix:</strong> <code>SET hive.groupby.skewindata=true;</code>. This triggers a two-stage job: the first distributes keys randomly to pre-aggregate, the second does the final aggregation.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "spark",
    title: "Spark",
    sections: [
      {
        id: "spark-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Driver:</span> The master process. Maintains the SparkContext, translates user code into logical/physical DAGs, schedules tasks, and coordinates with the Cluster Manager.</li>
            <li><span style='color:#6366f1'>Executor:</span> Worker processes running on cluster nodes. They execute tasks, store data in memory/disk (Block Manager), and return results to the Driver.</li>
            <li><span style='color:#6366f1'>Cluster Manager:</span> Allocates physical resources (YARN, Mesos, Kubernetes, Standalone).</li>
            <li><span style='color:#6366f1'>DAG Scheduler & Task Scheduler:</span> DAG Scheduler converts the logical plan into stages of tasks (split by shuffles). Task Scheduler assigns these tasks to Executors based on data locality.</li>
            <li><span style='color:#6366f1'>Unified Memory Model:</span> Divides heap into <strong>Execution Memory</strong> (shuffles, joins, sorts) and <strong>Storage Memory</strong> (cached RDDs/DataFrames). The boundary is flexible; execution can evict storage if needed, but not vice versa.</li>
            <li><span style='color:#6366f1'>Project Tungsten:</span> Optimizes CPU and Memory. Operates directly on off-heap memory using binary data formats to bypass JVM garbage collection overhead.</li>
          </ul>
        `
      },
      {
        id: "spark-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><span style='color:#6366f1'>RDD vs DataFrame vs Dataset:</span>
              <ul>
                <li><strong>RDD:</strong> Low-level, schema-less, JVM objects. Best for unstructured data. No optimization engine.</li>
                <li><strong>DataFrame:</strong> Distributed collection organized into named columns. Uses Catalyst optimizer. Untyped at compile-time.</li>
                <li><strong>Dataset:</strong> Strongly typed, uses Encoders. Best of both worlds (type safety of RDD, performance of DataFrame). Only in Java/Scala.</li>
              </ul>
            </li>
            <li><span style='color:#6366f1'>Lazy Evaluation & Actions:</span> Transformations (e.g., <code>map</code>, <code>filter</code>) only build the lineage DAG. Execution only begins when an Action (e.g., <code>count</code>, <code>collect</code>, <code>write</code>) is called.</li>
            <li><span style='color:#6366f1'>Narrow vs Wide Transformations:</span> Narrow (e.g., <code>map</code>) requires data from only one parent partition (pipelined in one stage). Wide (e.g., <code>groupBy</code>, <code>join</code>) requires data from multiple parent partitions, triggering a <strong>Shuffle</strong> and defining a <strong>Stage Boundary</strong>.</li>
            <li><span style='color:#6366f1'>Catalyst Optimizer (4 Phases):</span> 1. Analysis (resolves column names via Catalog), 2. Logical Optimization (predicate pushdown, constant folding), 3. Physical Planning (generates multiple plans, picks cheapest), 4. Code Generation.</li>
            <li><span style='color:#6366f1'>Whole-Stage Code Gen:</span> Fuses multiple physical operators into a single Java function, eliminating virtual function calls and leveraging CPU registers.</li>
            <li><span style='color:#6366f1'>Shared Variables:</span> <strong>Broadcast Variables</strong> (read-only, sent once per executor to avoid shipping large lookups with tasks) and <strong>Accumulators</strong> (write-only, used for distributed counters).</li>
          </ul>
        `
      },
      {
        id: "spark-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "⚡",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Handling Data Skew:</span>
              <ul>
                <li><strong>Salting:</strong> Add a random integer (1-10) to the skewed join key to distribute it across multiple partitions, then replicate the smaller table.</li>
                <li><strong>Adaptive Query Execution (AQE):</strong> Spark 3.x feature that dynamically optimizes query plans at runtime. Features include dynamic coalescing of shuffle partitions, dynamic switching of join strategies, and dynamic optimization of skewed joins.</li>
              </ul>
            </li>
            <li><span style='color:#6366f1'>Join Strategies:</span>
              <ul>
                <li><strong>Broadcast Hash Join (BHJ):</strong> Smallest table is broadcasted to all executors. Fastest. No shuffle.</li>
                <li><strong>Sort Merge Join (SMJ):</strong> Default for large tables. Both sides are partitioned, sorted, and merged. Requires heavy shuffling.</li>
                <li><strong>Shuffle Hash Join (SHJ):</strong> Partitions both tables using a hash, builds a hash table on the smaller side partition, and streams the larger.</li>
              </ul>
            </li>
            <li><span style='color:#6366f1'>Caching/Persistence:</span> Use <code>cache()</code> (MEMORY_AND_DISK default for DF) to avoid recomputing expensive DAGs. Unpersist when done to free memory.</li>
            <li><span style='color:#6366f1'>Dynamic Allocation:</span> Dynamically scale executors up/down based on workload. Requires an external shuffle service to preserve shuffle files when executors are killed.</li>
          </ul>
        `
      },
      {
        id: "spark-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🧠",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Spark Join Strategies Comparison:</span>
              <table style="border-collapse:collapse; margin-top:8px;">
                <tr><th>Join Strategy</th><th>Shuffle Required?</th><th>Sort Required?</th><th>Memory Requirement</th><th>Best Use Case</th></tr>
                <tr><td><strong>Broadcast Hash Join (BHJ)</strong></td><td>No</td><td>No</td><td>Small table must fit in Driver & Executor memory</td><td>One table &lt; 10MB (<code>spark.sql.autoBroadcastJoinThreshold</code>)</td></tr>
                <tr><td><strong>Shuffle Hash Join (SHJ)</strong></td><td>Yes</td><td>No</td><td>Smaller partition must fit in executor memory</td><td>One table much smaller than other, but &gt; broadcast threshold</td></tr>
                <tr><td><strong>Sort-Merge Join (SMJ)</strong></td><td>Yes</td><td>Yes</td><td>Low memory (spills gracefully to disk)</td><td>Default for two massive tables; robust against OOM</td></tr>
                <tr><td><strong>Broadcast Nested Loop Join</strong></td><td>No</td><td>No</td><td>Extreme CPU overhead: $O(N \times M)$</td><td>Non-equi joins (e.g. <code>t1.val &gt; t2.val</code>)</td></tr>
              </table>
            </li>
            <li><span style='color:#6366f1'>Production PySpark: Handling Extreme Skew with Salting & AQE:</span>
<pre><code>from pyspark.sql import SparkSession
from pyspark.sql.functions import col, concat, lit, rand, floor, explode, array

spark = SparkSession.builder \\
    .appName("SkewJoinOptimization") \\
    .config("spark.sql.adaptive.enabled", "true") \\
    .config("spark.sql.adaptive.skewJoin.enabled", "true") \\
    .config("spark.sql.adaptive.skewJoin.skewedPartitionFactor", "5") \\
    .config("spark.sql.adaptive.skewJoin.skewedPartitionThresholdInBytes", "268435456") \\
    .getOrCreate()

# If AQE cannot resolve extreme skew on an older engine, apply manual SALTING:
NUM_SALTS = 10

# 1. Salt the large skewed table with random integers 0..9
large_salted = large_df.withColumn(
    "salted_key",
    concat(col("skewed_join_key"), lit("_"), floor(rand() * NUM_SALTS))
)

# 2. Replicate the small dimension table across all salt values (0..9)
salt_array = array([lit(i) for i in range(NUM_SALTS)])
small_replicated = small_df \\
    .withColumn("salt", explode(salt_array)) \\
    .withColumn("salted_key", concat(col("join_key"), lit("_"), col("salt")))

# 3. Perform even, parallel Sort-Merge Join with zero partition stragglers
balanced_joined_df = large_salted.join(
    small_replicated,
    on="salted_key",
    how="inner"
).drop("salted_key", "salt")</code></pre>
            </li>
            <li><span style='color:#6366f1'>Repartition vs Coalesce:</span> <code>repartition(n)</code> triggers a full shuffle and creates equal-sized partitions (good for increasing parallelism). <code>coalesce(n)</code> avoids a full shuffle by merging existing partitions locally (good for decreasing partitions before writing to storage).</li>
            <li><span style='color:#6366f1'>Checkpointing vs Caching:</span> Caching keeps data in memory/disk and retains lineage. Checkpointing writes data to HDFS/GCS and <strong>truncates the lineage DAG</strong>, eliminating StackOverflow in deep recursive pipelines.</li>
          </ul>
        `
      },
      {
        id: "spark-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Driver OOM from collect():</span> Calling <code>.collect()</code> on a billion-row DataFrame sends everything to the Driver's limited heap, crashing the application. Use <code>.take(n)</code>, <code>.show()</code>, or write to storage.</li>
            <li><span style='color:#6366f1'>Task Serialization Errors (NotSerializableException):</span> Occurs when passing a non-serializable object (like a database connection or un-serializable class) inside a map function or UDF to executors. Initialize connections inside <code>mapPartitions</code> instead.</li>
            <li><span style='color:#6366f1'>UDF Performance:</span> Standard Python UDFs serialize data back and forth between the JVM and Python processes (extremely slow). <strong>Trap:</strong> Never use a Python UDF if a built-in Spark SQL function exists. If you must, use Pandas UDFs (Vectorized UDFs) powered by Apache Arrow.</li>
            <li><span style='color:#6366f1'>Driver OOM from Broadcasts:</span> Broadcasting a table that is technically under the <code>autoBroadcastJoinThreshold</code> (10MB default) but decompresses to gigabytes in memory can crash the Driver during the broadcast phase.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "storage-formats",
    title: "Storage Formats (Parquet, ORC, Avro, Delta, Iceberg)",
    sections: [
      {
        id: "storage-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Row vs Columnar:</span> Row formats (CSV, Avro) store data row-by-row; great for writes and fetching entire records. Columnar formats (Parquet, ORC) store columns together; excellent for analytical queries (OLAP) as you only read required columns (I/O savings).</li>
            <li><span style='color:#6366f1'>Parquet:</span> Columnar. Files contain Row Groups. Row Groups contain Column Chunks. Column Chunks contain Pages (the smallest unit of compression/reading). Footer contains critical metadata (min/max stats, schema) enabling predicate pushdown. Supports advanced encodings like Dictionary and Run-Length Encoding (RLE).</li>
            <li><span style='color:#6366f1'>ORC (Optimized Row Columnar):</span> Columnar, optimized specifically for Hive. Divided into Stripes, containing Index Data, Row Data, and Stripe Footer. Built-in Bloom Filters for hyper-fast data skipping.</li>
            <li><span style='color:#6366f1'>Avro:</span> Row-based. Schema is stored in JSON within the file header, data is stored in compact binary. Unbeatable for schema evolution and streaming pipelines (Kafka).</li>
            <li><span style='color:#6366f1'>Delta Lake:</span> An open-source storage layer on top of Parquet. Uses a transaction log (<code>_delta_log</code>) of JSON files and Parquet checkpoints to provide ACID guarantees, scalable metadata handling, and time travel.</li>
            <li><span style='color:#6366f1'>Apache Iceberg:</span> Table format providing ACID. Architecture uses a Catalog pointing to a Metadata file, which points to Manifest Lists, which point to Manifest Files, which track individual data files. Exceptional for tracking enormous tables without costly directory listings.</li>
          </ul>
        `
      },
      {
        id: "storage-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Predicate Pushdown / Data Skipping:</span> Parquet/ORC store min/max statistics per chunk. If a query is <code>WHERE id = 500</code>, and chunk stats say <code>min=1000, max=2000</code>, the engine skips reading that chunk entirely.</li>
            <li><span style='color:#6366f1'>Column Pruning:</span> Because columns are stored separately, a <code>SELECT A, B</code> query only pays I/O to read files for A and B. It ignores columns C to Z completely.</li>
            <li><span style='color:#6366f1'>Compression Tradeoffs:</span>
              <ul>
                <li><strong>Snappy:</strong> Fast compression/decompression, moderate ratio. Default for Parquet/Spark.</li>
                <li><strong>Zstd:</strong> Modern codec offering high compression ratio and fast speed. Becoming the new standard.</li>
                <li><strong>Gzip:</strong> High compression ratio, but slow and not splittable in MapReduce.</li>
              </ul>
            </li>
            <li><span style='color:#6366f1'>Schema Evolution:</span> Modifying table structure over time. Avro excels at handling missing/added fields. Delta and Iceberg support robust, safe schema evolution (adding, renaming, reordering columns without rewriting data).</li>
          </ul>
        `
      },
      {
        id: "storage-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "⚡",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Optimal File Sizes:</span> Cloud storage and Big Data engines prefer files between 128MB - 1GB. Too small = metadata overhead. Too big = lack of parallelism.</li>
            <li><span style='color:#6366f1'>Compaction / Bin-Packing:</span> Over time, streaming inserts create small files. Delta Lake provides <code>OPTIMIZE table_name</code> to asynchronously merge small Parquet files into optimally sized files.</li>
            <li><span style='color:#6366f1'>Z-Ordering:</span> A technique to co-locate related information in the same set of files based on multiple columns. Dramatically improves data skipping effectiveness for multi-column queries compared to standard linear sorting.</li>
            <li><span style='color:#6366f1'>Data Retention (VACUUM):</span> In Delta/Iceberg, updates/deletes don't remove old files immediately (enabling Time Travel). The <code>VACUUM</code> command physically deletes files no longer referenced by active snapshots to save storage costs.</li>
          </ul>
        `
      },
      {
        id: "storage-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🧠",
        content: `
          <table style='width:100%; text-align:left; border-collapse:collapse; margin-top:8px;'>
            <tr>
              <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Format</th>
              <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Layout</th>
              <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Metadata Location</th>
              <th style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Best Use Case</th>
            </tr>
            <tr>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>Avro</strong></td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Row-based</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>File Header (JSON Schema)</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Kafka streaming, CDC pipelines, message serialization</td>
            </tr>
            <tr>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>Parquet</strong></td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Columnar</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>File Footer (Row Group min/max stats)</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Analytical queries (OLAP), Spark, BigQuery, Snowflake</td>
            </tr>
            <tr>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>ORC</strong></td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Columnar</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Postscript + Stripe Footers (Bloom Filters)</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Hive/Trino workloads, enterprise ACID in Hive Metastore</td>
            </tr>
            <tr>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'><strong>Delta / Iceberg</strong></td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Open Table Format</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Centralized ACID log / Snapshot tree</td>
              <td style='padding:8px 12px; border:1px solid rgba(255,255,255,0.1);'>Data Lakehouse, ACID transactions, Upserts, Time Travel</td>
            </tr>
          </table>
          <br/>
          <ul>
            <li><span style='color:#6366f1'>Production PySpark / Delta Lake Upsert & Time-Travel Pattern:</span>
<pre><code>from delta.tables import DeltaTable

# 1. Atomic MERGE (UPSERT) into Delta Lake Table
target_table = DeltaTable.forPath(spark, "gs://lakehouse/silver/customers")

target_table.alias("target").merge(
    source=incoming_cdc_df.alias("updates"),
    condition="target.customer_id = updates.customer_id"
).whenMatchedUpdate(set={
    "name": "updates.name",
    "email": "updates.email",
    "updated_at": "updates.updated_at"
}).whenNotMatchedInsert(values={
    "customer_id": "updates.customer_id",
    "name": "updates.name",
    "email": "updates.email",
    "created_at": "updates.updated_at",
    "updated_at": "updates.updated_at"
}).execute()

# 2. Time-Travel Query (Querying exact table state from 24 hours ago)
df_historical = spark.read.format("delta") \\
    .option("timestampAsOf", "2026-03-01 00:00:00") \\
    .load("gs://lakehouse/silver/customers")</code></pre>
            </li>
            <li><span style='color:#6366f1'>Delta Lake vs. Apache Iceberg:</span> Delta logs operations linearly via forward JSON commits and periodic checkpoints. Iceberg organizes metadata as a hierarchical tree (Catalog &rarr; Metadata &rarr; Manifest List &rarr; Manifest Files &rarr; Data Files), completely decoupling metadata from file directory layouts and providing true partition evolution.</li>
          </ul>
        `
      },
      {
        id: "storage-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><span style='color:#6366f1'>Reading Delta without the Log:</span> If an engine queries the raw Parquet directory of a Delta table without reading the <code>_delta_log</code>, it will read duplicate records and logically deleted data, returning completely incorrect results.</li>
            <li><span style='color:#6366f1'>Nested Schema Evolution:</span> Evolving deeply nested JSON structs in Parquet can be problematic. Iceberg handles column renaming and nested schema evolution uniquely by tracking columns by ID rather than name.</li>
            <li><span style='color:#6366f1'>Schema Merging Pitfalls:</span> In Spark Parquet, reading files with different schemas requires <code>.option("mergeSchema", "true")</code>, which is an expensive operation that forces Spark to read the footers of ALL files to resolve the global schema.</li>
          </ul>
        `
      }
    ]
  }
];
