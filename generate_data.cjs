const fs = require('fs');

const dataObj = [
    {
        id: "sql-databases",
        title: "SQL & Databases",
        questions: [
            {
                q: "How do you delete duplicate records from a table while keeping the original record intact?",
                a: "There are multiple ways to handle duplicate deletion depending on your database engine. Understanding the performance tradeoff is key.\n\n**1. Using ROW_NUMBER() (Standard & Most Robust):**\nAssign a sequential integer to each row partitioned by the duplicate-defining columns. Keep the row where the number is 1 and delete the rest. This requires a full table scan and sort, but works universally.\n\n```sql\nWITH CTE AS (\n    SELECT *, \n           ROW_NUMBER() OVER(PARTITION BY model_name, brand ORDER BY model_id) as rn\n    FROM cars\n)\nDELETE FROM cars \nWHERE model_id IN (SELECT model_id FROM CTE WHERE rn > 1);\n```\n\n**2. Using CTID / ROWID (PostgreSQL / Oracle specific):**\n`ctid` (or `ROWID`) represents the physical location of the row on disk. You can efficiently keep the row with the maximum physical ID without needing window functions.\n```sql\nDELETE FROM cars\nWHERE ctid NOT IN (\n    SELECT max(ctid) FROM cars GROUP BY model_name, brand\n);\n```",
                complexity: "Basic"
            },
            {
                q: "How do you find the highest and lowest salary in each department, while simultaneously displaying those values next to every individual employee record?",
                a: "You can achieve this using Window Functions. \n\n**1. Using MIN() and MAX() OVER() (Most Efficient):**\nThis allows you to aggregate data without collapsing the rows like a traditional `GROUP BY` would.\n```sql\nSELECT \n    id, name, dept, salary,\n    MAX(salary) OVER(PARTITION BY dept) AS highest_sal,\n    MIN(salary) OVER(PARTITION BY dept) AS lowest_sal\nFROM employee;\n```\n\n**2. Alternative using FIRST_VALUE and LAST_VALUE:**\nWhile MIN/MAX are easier, interviewers often ask for `FIRST_VALUE`. Note the use of the `ROWS BETWEEN` framing clause to ensure `LAST_VALUE` doesn't stop at the current row.\n```sql\nSELECT \n    id, name, dept, salary,\n    FIRST_VALUE(salary) OVER(PARTITION BY dept ORDER BY salary DESC) as highest_sal,\n    LAST_VALUE(salary) OVER(PARTITION BY dept ORDER BY salary DESC \n        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as lowest_sal\nFROM employee;\n```",
                complexity: "Basic"
            },
            {
                q: "Given a table tracking the 'cumulative distance' travelled by cars per day, write a query to extract the exact distance travelled on each specific day.",
                a: "You can use the `LAG()` window function to peek at the previous day's cumulative distance and subtract it from the current day's cumulative distance.\n\n```sql\nSELECT \n    cars, \n    days, \n    cumulative_distance,\n    cumulative_distance - LAG(cumulative_distance, 1, 0) \n        OVER(PARTITION BY cars ORDER BY days) AS actual_distance\nFROM car_travels;\n```\n*Note: `LAG(col, offset, default)` is utilized here. We pass `0` as the default value so the calculation for the very first day correctly evaluates to the current cumulative distance instead of `NULL`.*",
                complexity: "Basic"
            },
            {
                q: "Explain the differences between the Window Functions: Rank vs Dense_Rank vs Row_Number.",
                a: "Window functions perform calculations across a set of table rows related to the current row, without collapsing them (unlike `GROUP BY`).\n\nImagine ranking a list of salaries: [100k, 100k, 90k, 80k]\n- **ROW_NUMBER():** Gives a strictly unique sequential integer, regardless of ties. \n  *Result: 1, 2, 3, 4*\n- **RANK():** Gives the same rank for ties, but skips subsequent ranks proportionally.\n  *Result: 1, 1, 3, 4 (Notice rank 2 is skipped)*\n- **DENSE_RANK():** Gives the same rank for ties, and does NOT skip subsequent ranks.\n  *Result: 1, 1, 2, 3*",
                complexity: "Basic"
            },
            {
                q: "What is the architectural difference between OLTP and OLAP systems?",
                a: "**OLTP (Online Transaction Processing):**\n- **Purpose:** Day-to-day operations and high-volume, fast transactions (Inserts/Updates/Deletes).\n- **Design:** Highly normalized (3NF) to prevent data redundancy and ensure ACID compliance. Queries usually return a few specific records.\n- **Examples:** Banking core systems, E-commerce checkout, MySQL, PostgreSQL.\n\n**OLAP (Online Analytical Processing):**\n- **Purpose:** Complex queries, analytics, and business intelligence. Optimized for reading massive amounts of historical data.\n- **Design:** Denormalized (Star or Snowflake schemas) to reduce expensive table joins. Data is heavily indexed and partitioned.\n- **Examples:** Data Warehouses (Snowflake, BigQuery, Redshift).",
                complexity: "Basic"
            },
            {
                q: "Given a table of bidirectional travel routes (e.g., Bangalore to Hyderabad, Hyderabad to Bangalore), how do you return a deduplicated list of unique routes irrespective of the travel direction?",
                a: "There are two ways to solve this. Using standard aggregation is generally the most efficient.\n\n**1. Using LEAST() and GREATEST() (Most Efficient):**\nThese scalar functions evaluate multiple columns in a single row and return the smallest/largest value. By forcing the alphabetically smaller city to always be the 'source', natural duplicates are created which are easily removed using `DISTINCT`. This avoids expensive joins.\n```sql\nSELECT DISTINCT \n    LEAST(source, destination) AS source,\n    GREATEST(source, destination) AS destination,\n    distance\nFROM src_dest_distance;\n```\n\n**2. Using a Self-Join & ROW_NUMBER:**\nWhile functional, this requires assigning row numbers and joining the table back to itself to filter out the reversed pair. It requires more compute overhead than the scalar function approach.",
                complexity: "Intermediate"
            },
            {
                q: "Write a SQL query such that each team plays a match with every other team exactly once. Then, write a query where they play each other twice.",
                a: "This requires joining a table to itself (Self Join) using inequality operators.\n\n**Play JUST ONCE:**\nUse the `<` (or `>`) operator. This ensures 'Team A vs Team B' is selected, but filters out 'Team B vs Team A', and 'Team A vs Team A'.\n```sql\nSELECT t1.team_name AS team, t2.team_name AS opponent\nFROM teams t1\nJOIN teams t2 ON t1.team_name < t2.team_name;\n```\n\n**Play TWICE (Home & Away):**\nUse the `<>` (not equal) operator. This ensures Team A plays Team B, and Team B plays Team A, but ensures a team doesn't play itself.\n```sql\nSELECT t1.team_name AS team, t2.team_name AS opponent\nFROM teams t1\nJOIN teams t2 ON t1.team_name <> t2.team_name;\n```",
                complexity: "Intermediate"
            },
            {
                q: "How do you Pivot row-level data into columns? (e.g., Transforming a single 'month' column with 12 rows into 12 separate columns for each month)",
                a: "While some databases like Oracle or SQL Server have a dedicated `PIVOT` keyword, the most universally standard and robust approach (which works across PostgreSQL, MySQL, BigQuery, Spark) is using Conditional Aggregation (`SUM` + `CASE WHEN`).\n\n```sql\nSELECT customer_id,\n    SUM(CASE WHEN order_month = 'Jan-21' THEN amount ELSE 0 END) AS \"Jan-21\",\n    SUM(CASE WHEN order_month = 'Feb-21' THEN amount ELSE 0 END) AS \"Feb-21\"\n    -- Add remaining months...\nFROM sales_data\nGROUP BY customer_id;\n```",
                complexity: "Intermediate"
            },
            {
                q: "Write a query to calculate the difference in average sales for each month between the years 2003 and 2004.",
                a: "You can isolate the aggregations for each year using a Common Table Expression (CTE) and then self-join them on the month. This ensures you are calculating aggregates before joining, which prevents Cartesian explosions.\n\n```sql\nWITH MonthlySales AS (\n    SELECT \n        EXTRACT(YEAR FROM order_date) AS order_year, \n        EXTRACT(MONTH FROM order_date) AS order_month, \n        AVG(sales) AS avg_sales\n    FROM sales_order\n    WHERE EXTRACT(YEAR FROM order_date) IN (2003, 2004)\n    GROUP BY 1, 2\n)\nSELECT \n    y03.order_month,\n    ROUND(ABS(y03.avg_sales - y04.avg_sales), 2) AS diff\nFROM MonthlySales y03\nJOIN MonthlySales y04 ON y03.order_month = y04.order_month\nWHERE y03.order_year = 2003 AND y04.order_year = 2004\nORDER BY y03.order_month;\n```",
                complexity: "Intermediate"
            },
            {
                q: "Suppose a pizza company tracks individual pizzas ordered by customers. A single customer can place multiple orders at once, and each individual order has a status of 'CREATED', 'SUBMITTED', or 'DELIVERED'. Write a query to determine the final overall status of each customer's complete batch based on the following rules:\n1) If ALL orders are DELIVERED -> 'COMPLETED'.\n2) If SOME (but not all) are DELIVERED -> 'IN PROGRESS'.\n3) If ALL are SUBMITTED -> 'AWAITING PROGRESS'.\n4) Otherwise -> 'AWAITING SUBMISSION'.",
                a: "There are two main ways to solve this. Conditional Aggregation is generally preferred for performance.\n\n**1. Conditional Aggregation (Most Efficient - O(N)):**\nWe group by the customer and calculate the occurrences of each status using `SUM(CASE...)` compared to the `COUNT(*)` of total orders. This requires only a **single pass** over the table, making it highly optimized.\n```sql\nSELECT cust_name AS customer_name,\n    CASE \n        WHEN SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) = COUNT(*) \n            THEN 'COMPLETED'\n        WHEN SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) > 0 \n            THEN 'IN PROGRESS'\n        WHEN SUM(CASE WHEN status = 'SUBMITTED' THEN 1 ELSE 0 END) = COUNT(*) \n            THEN 'AWAITING PROGRESS'\n        ELSE 'AWAITING SUBMISSION'\n    END AS final_status\nFROM cust_orders\nGROUP BY cust_name;\n```\n\n**2. Correlated Subqueries (Using NOT EXISTS):**\nThis approach checks for the existence of conflicting statuses. While logically readable, it can be slower on massive tables because the database engine may have to execute the subquery multiple times per customer record.\n```sql\nSELECT DISTINCT cust_name, 'COMPLETED' as status \nFROM cust_orders c1\nWHERE status = 'DELIVERED' \nAND NOT EXISTS (SELECT 1 FROM cust_orders c2 WHERE c1.cust_name = c2.cust_name AND status != 'DELIVERED')\n-- (UNION other statuses...)\n```",
                complexity: "Intermediate"
            },
            {
                q: "Write a query to identify numbers appearing three times consecutively in a table.",
                a: "There are two approaches: using a Self-Join or using Window Functions. The Window Function approach is significantly faster.\n\n**1. Using LEAD and LAG (Most Efficient):**\nThis approach scans the table only once. We peek at the adjacent rows (`LEAD` looks forward, `LAG` looks backwards) based on the ID sorting.\n```sql\nWITH NumberSequences AS (\n    SELECT \n        id, \n        num,\n        LAG(num) OVER (ORDER BY id) as prev_num,\n        LEAD(num) OVER (ORDER BY id) as next_num\n    FROM Logs\n)\nSELECT DISTINCT num AS ConsecutiveNums\nFROM NumberSequences\nWHERE num = prev_num AND num = next_num;\n```\n\n**2. Using a 3-way Self-Join (Less Efficient):**\n```sql\nSELECT DISTINCT l1.num \nFROM Logs l1, Logs l2, Logs l3\nWHERE l1.id = l2.id - 1 AND l2.id = l3.id - 1\nAND l1.num = l2.num AND l2.num = l3.num;\n```\n*Why it's worse:* This requires the database engine to perform a Cartesian join on the table against itself three times, resulting in exponential computational overhead on large datasets.",
                complexity: "Intermediate"
            },
            {
                q: "How do you completely 'Ungroup' aggregated data? (e.g., turning one row '{item: Apple, count: 4}' into four separate '{item: Apple}' rows)",
                a: "You can achieve this using a **Recursive Common Table Expression (CTE)** to dynamically generate rows iteratively by decrementing the count column until it hits 1.\n\n```sql\nWITH RECURSIVE UngroupedItems AS (\n    -- Base Case: Start with the given item and its original count\n    SELECT id, item_name, total_count, 1 as level\n    FROM travel_items\n    \n    UNION ALL\n    \n    -- Recursive Step: Join against itself, decrementing the count by 1\n    SELECT u.id, u.item_name, u.total_count - 1, u.level + 1\n    FROM UngroupedItems u\n    JOIN travel_items t ON t.id = u.id\n    WHERE u.total_count > 1 -- Stop condition\n)\nSELECT id, item_name \nFROM UngroupedItems\nORDER BY id;\n```",
                complexity: "Complex"
            },
            {
                q: "Write a query to find the entire reporting hierarchy of employees under a specific manager (e.g., 'Asha').",
                a: "Hierarchical data modeling (like org charts or bill-of-materials) is the classic use case for **Recursive CTEs**. You start with the base anchor (the manager) and recursively join the table on `employee.manager_id = recursive_cte.employee_id` to traverse downwards.\n\n```sql\nWITH RECURSIVE HierarchyCTE AS (\n    -- Anchor member: Select the target manager\n    SELECT id, name, manager_id, designation, 1 as level\n    FROM emp_details \n    WHERE name = 'Asha'\n    \n    UNION ALL\n    \n    -- Recursive member: Find employees whose manager is in the CTE (traversing down)\n    SELECT e.id, e.name, e.manager_id, e.designation, h.level + 1\n    FROM emp_details e\n    JOIN HierarchyCTE h ON e.manager_id = h.id\n)\nSELECT * FROM HierarchyCTE;\n```",
                complexity: "Complex"
            }
        ]
    },
    {
        id: "spark-databricks",
        title: "Spark & Databricks",
        questions: [
            {
                q: "Explain the Spark Architecture (Driver, Executors, Stages, and Tasks).",
                a: "Apache Spark follows a master-slave architecture. \n\n**1. Driver (Master):** The brain of the application. It runs the `main()` function, converts your code into a logical and physical execution plan (DAG), and negotiates resources with the cluster manager (YARN/Kubernetes).\n**2. Cluster Manager:** Allocates resources (CPU/Memory) across the cluster.\n**3. Executors (Slaves):** Worker nodes that run the actual computations and store data in memory (cache/persist).\n\nWhen you submit a job, Spark breaks it down into:\n- **Jobs:** Triggered by an Action (e.g., `.count()`).\n- **Stages:** Created whenever there is a wide transformation (Shuffle). Data must move across the network.\n- **Tasks:** The smallest unit of work, executed by a core on an executor. One task processes one partition of data.",
                complexity: "Basic"
            },
            {
                q: "What is the difference between Narrow and Wide Transformations?",
                a: "Transformations in Spark are lazy (they don't compute until an action is called). They are divided into two types based on data movement:\n\n**1. Narrow Transformations:** Data required to compute the records in a single partition reside in at most one partition of the parent dataset. No data is sent over the network (No Shuffle). \n*Examples:* `map()`, `filter()`, `withColumn()`.\n\n**2. Wide Transformations:** Data required to compute the records in a single partition may reside in many partitions of the parent dataset. This requires a **Shuffle** (moving data across the network between executors), which is expensive and slow.\n*Examples:* `groupBy()`, `join()`, `orderBy()`, `repartition()`.\n\nBecause wide transformations require a shuffle, they form the boundaries for Spark **Stages**.",
                complexity: "Basic"
            },
            {
                q: "What is the difference between repartition() and coalesce()?",
                a: "Both are used to change the number of partitions in a DataFrame.\n\n**repartition(n):** Can increase or decrease partitions. It does a full data **shuffle** across the network to ensure data is evenly distributed. Used when you need balanced partitions for heavy downstream processing.\n\n**coalesce(n):** Can *only decrease* partitions. It avoids a full shuffle by safely moving data from one partition into an existing one on the same node (where possible). It is much faster but can result in unevenly sized partitions. Typically used right before writing data to disk to reduce the number of output files.",
                complexity: "Basic"
            },
            {
                q: "How does the Catalyst Optimizer work?",
                a: "The Catalyst Optimizer is the core engine in Spark SQL and DataFrames that automatically optimizes your queries. It operates in 4 phases:\n\n1. **Analysis:** Resolves column names and table names against the Catalog (Metadata). (Yields a Resolved Logical Plan)\n2. **Logical Optimization:** Applies rule-based optimizations like *Predicate Pushdown* (filtering data as early as possible before joins/shuffles) and *Column Pruning* (dropping unused columns). (Yields an Optimized Logical Plan)\n3. **Physical Planning:** Uses Cost-Based Optimization (CBO) to generate multiple physical plans and selects the cheapest one (e.g., choosing a Broadcast Join over a Sort-Merge Join based on table size).\n4. **Code Generation:** Uses Tungsten to generate highly optimized Java bytecode for execution.",
                complexity: "Intermediate"
            },
            {
                q: "What are Broadcast Joins vs Shuffle Sort-Merge Joins?",
                a: "**Broadcast Hash Join (BHJ):** Used when joining a massive table with a very small table (default < 10MB). Spark sends (broadcasts) the entire small table to every executor. This completely avoids a network shuffle of the large table, making it extremely fast.\n\n**Shuffle Sort-Merge Join (SMJ):** The default join for two large tables. Spark shuffles both tables across the network so that matching keys end up on the same executor, sorts them, and then merges them. It is highly robust for large data but very slow due to the network I/O.",
                complexity: "Intermediate"
            },
            {
                q: "What is Adaptive Query Execution (AQE)?",
                a: "Introduced in Spark 3.0, AQE allows Spark to re-optimize query plans *at runtime* based on exact data statistics gathered during shuffles, rather than relying solely on static estimates. \n\nIt does 3 main things:\n1. **Dynamically coalesces shuffle partitions:** If Spark creates 200 partitions but many are tiny, AQE merges them to avoid the small-file/scheduling overhead.\n2. **Dynamically switches join strategies:** If a table gets heavily filtered during runtime and becomes small enough, AQE downgrades a slow Sort-Merge Join into a fast Broadcast Join.\n3. **Dynamically handles skew:** If AQE detects a heavily skewed partition during a join, it automatically splits the skewed partition into smaller sub-partitions.",
                complexity: "Intermediate"
            },
            {
                q: "How do OPTIMIZE, Z-Order, and VACUUM work in Delta Lake?",
                a: "**OPTIMIZE (Bin-packing):** Solves the \"Small Files Problem\". Streaming or frequent small batch jobs write thousands of tiny Parquet files. `OPTIMIZE` reads these tiny files and rewrites them into larger, optimal-sized files (usually 1GB), massively improving read performance.\n\n**Z-Order (Multi-dimensional Clustering):** Used alongside OPTIMIZE. It physically sorts the data in the storage files based on frequently filtered columns. This allows Delta Lake to use \"Data Skipping\" to ignore entire files that don't contain the requested data, dramatically speeding up `WHERE` clauses.\n\n**VACUUM:** Delta Lake keeps older versions of files for Time Travel (querying historical states). `VACUUM` permanently deletes files that are no longer referenced by the current Delta log and are older than the retention threshold (default 7 days), freeing up storage space.",
                complexity: "Intermediate"
            },
            {
                q: "What is Data Skew in Spark, and how do you fix it (Salting)?",
                a: "Data Skew happens when data is unevenly distributed across partitions. During a shuffle (like a `groupBy` or `join`), one executor might receive 90% of the data while others get 10%. The entire stage waits for that single \"straggler\" task to finish, or it crashes with an OutOfMemory (OOM) error.\n\n**How to fix it (Salting):**\nSalting is a technique to artificially distribute the skewed key.\n1. **Add a random number (Salt):** Append a random integer (e.g., 1 to 10) to the skewed key in the large table (`key_1`, `key_2`).\n2. **Replicate the small table:** Explode the small table so it contains every possible salt variant of the key.\n3. **Join:** Now, the skewed key is broken into 10 smaller, evenly distributed keys, allowing Spark to process the join in parallel without OOMing.\n\n*(Note: If using Spark 3+, Adaptive Query Execution (AQE) can often handle data skew automatically if skew hints are enabled).*.",
                complexity: "Complex"
            }
        ]
    },
    {
        id: "architecture",
        title: "Architecture & System Design",
        questions: [
            {
                q: "Explain CAP theorem and its relevance in distributed data systems.",
                a: "The CAP theorem states that a distributed system can only guarantee two out of the following three properties simultaneously:\n\n1. **Consistency (C):** Every read receives the most recent write or an error. (All nodes see the same data).\n2. **Availability (A):** Every request receives a non-error response, without guaranteeing it contains the most recent write.\n3. **Partition Tolerance (P):** The system continues to operate despite network failures dropping messages between nodes.\n\n**Relevance:** Because network partitions (P) are inevitable in the cloud, databases must choose between C and A.\n- **CP Systems (HBase, MongoDB):** If a node fails, they shut down access to prevent reading stale data. Good for financial ledgers.\n- **AP Systems (Cassandra, DynamoDB):** If a node fails, they keep serving reads, even if the data might be slightly outdated (Eventual Consistency). Good for social media feeds or shopping carts.",
                complexity: "Basic"
            },
            {
                q: "How would you design a real-time streaming system using Kafka?",
                a: "A typical real-time architecture (Lambda or Kappa) involves:\n\n1. **Ingestion (Kafka):** Source systems (databases via CDC, application logs, IoT devices) publish events as messages to Kafka Topics. Kafka acts as a high-throughput, fault-tolerant message buffer.\n2. **Processing (Spark Structured Streaming / Flink):** Consumes messages from Kafka in real-time. Here we apply stateful transformations (e.g., tumbling windows), enrich the data by joining it with static dimension tables, and handle late-arriving data using Watermarks.\n3. **Storage (Data Lakehouse/NoSQL):** Processed streams are written to a low-latency NoSQL database (Cassandra/DynamoDB) for instant API serving, and simultaneously to a Delta Lake/Iceberg for historical batch analytics.\n4. **Serving:** Microservices or BI dashboards query the NoSQL/Lakehouse layer.",
                complexity: "Intermediate"
            },
            {
                q: "What is Change Data Capture (CDC) and how do you implement it?",
                a: "CDC is a design pattern used to track and capture row-level changes (Inserts, Updates, Deletes) in a source database so they can be replicated downstream in near real-time.\n\n**How to implement it:**\nInstead of doing heavy daily `SELECT *` batch loads, we use a tool like **Debezium**. Debezium reads the database's internal transaction log (e.g., MySQL's `binlog` or PostgreSQL's `WAL`). \nEvery time a row changes, Debezium streams that exact change event to an Apache Kafka topic. Downstream pipelines (like Spark) consume these events to apply the exact UPSERT/DELETE operations to the Data Warehouse (using Delta Lake/Hudi), keeping systems perfectly in sync with minimal overhead.",
                complexity: "Intermediate"
            },
            {
                q: "How do you handle late-arriving data in streaming pipelines?",
                a: "In distributed systems, an event generated at 12:00 PM might not reach the processing engine until 12:05 PM due to network lag. We handle this using **Event Time and Watermarks** in Spark/Flink.\n\n- **Event Time:** We group data based on the timestamp *inside* the payload (when it happened), not the Processing Time (when the server received it).\n- **Watermarks:** A threshold defining how long the system will wait for late data before finalizing a time window. If a watermark is set to 10 minutes, an event arriving 5 minutes late is included in its correct window. An event arriving 15 minutes late is dropped (or routed to a Dead Letter Queue) to prevent state memory from growing infinitely.",
                complexity: "Complex"
            }
        ]
    },
    {
        id: "python",
        title: "Python & Core CS",
        questions: [
            {
                q: "Explain Deep Copy vs. Shallow Copy.",
                a: "In Python, assigning a list to a new variable just copies the *reference*, not the object.\n\n**Shallow Copy (`copy.copy()`)**: Creates a new object, but inserts *references* into it to the objects found in the original. If you have nested objects (like a list of lists), modifying a nested element in the copied list *will* affect the original list.\n\n**Deep Copy (`copy.deepcopy()`)**: Creates a new object and recursively inserts *copies* of the objects found in the original. Modifying anything in the deep copy (even nested elements) will completely leave the original intact.",
                complexity: "Basic"
            },
            {
                q: "What are Python Decorators and how do they work?",
                a: "A decorator is a design pattern in Python that allows you to add or modify the behavior of a function or class without permanently changing its source code. Functions are \"first-class citizens\" in Python, meaning they can be passed as arguments.\n\nA decorator is simply a function that takes another function as an argument, wraps it in an inner function to add behavior (like logging, timing, or authentication), and returns the new wrapped function.\n\n```python\ndef my_timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f\"Executed in {time.time() - start}s\")\n        return result\n    return wrapper\n\n@my_timer\ndef process_data():\n    pass # Function logic\n```",
                complexity: "Intermediate"
            },
            {
                q: "What is the difference between Multithreading and Multiprocessing in Python?",
                a: "**Multithreading:**\n- Uses multiple threads within a *single process*. They share the same memory space.\n- **The Catch:** Python has the GIL (Global Interpreter Lock), which prevents multiple threads from executing Python bytecode at the exact same time.\n- **Use Case:** Best for **I/O-bound tasks** (e.g., making API calls, downloading files, reading from disk) where the program spends most of its time waiting.\n\n**Multiprocessing:**\n- Spawns entirely new, independent Python *processes*. Each process has its own memory space and its own GIL.\n- **Use Case:** Best for **CPU-bound tasks** (e.g., heavy mathematical computations, image processing, massive data transformations) because it truly runs operations in parallel across multiple CPU cores.",
                complexity: "Intermediate"
            }
        ]
    },
    {
        id: "azure-adf",
        title: "Azure & Data Factory",
        questions: [
            {
                q: "An ADF pipeline succeeds, but the target table contains 0 records. How would you troubleshoot it?",
                a: "1. **Check Copy Activity Details:** Open the ADF monitoring view and click the \"spectacles\" icon on the Copy Activity. Check the `RowsRead` and `RowsCopied` metrics. If `RowsRead` is 0, the source query or dataset is empty.\n2. **Check Source Filters:** If the source is a SQL database, verify that the dynamic query (e.g., checking for new `last_modified_date`) isn't resolving to a future date or an incorrect timeframe.\n3. **Check File Paths:** If the source is ADLS/Blob Storage, ensure the parameterized file path or wildcard isn't pointing to an empty or incorrect directory.\n4. **Check Upsert/Sink Logic:** If using a Data Flow with an Alter Row transformation, ensure the logic isn't accidentally flagging all records as 'Delete' or 'Ignore'.",
                complexity: "Intermediate"
            },
            {
                q: "How would you design an ADF pipeline that can restart from the failed point instead of processing everything again?",
                a: "To achieve modularity and restartability (Idempotency):\n1. **Decouple Activities:** Break large pipelines down into smaller, atomic child pipelines using the `Execute Pipeline` activity.\n2. **State Tracking (Watermarking):** Create a control table in SQL Server that logs the status of each batch (`Batch_ID`, `Status=Running/Failed/Completed`). \n3. **Design for Idempotency:** Ensure sink activities can be rerun safely. For SQL, use `UPSERT` (Merge) instead of `INSERT` to avoid duplicates. For Data Lakes, use dynamic file names or overwrite specific partition folders.\n4. **Failure Routing:** If a child activity fails, use ADF's `On Failure` path to update the control table status to 'Failed'. On the next trigger, a Lookup activity checks the control table and only executes batches not marked as 'Completed'.",
                complexity: "Complex"
            }
        ]
    }
];

const jsContent = `export const interviewCategories = ${JSON.stringify(dataObj, null, 4)};\n`;

fs.writeFileSync('/Users/shubhamsrivastava/Documents/my-portfolio/src/data/interviewData.js', jsContent, 'utf-8');
console.log('File successfully generated with updated descriptions and alternative solutions.');
