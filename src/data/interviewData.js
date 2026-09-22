export const interviewCategories = [
    {
        "id": "sql-databases",
        "title": "SQL & Databases",
        "questions": [
            {
                "q": "How do you delete duplicate records from a table while keeping the original record intact?",
                "a": "There are multiple ways to handle duplicate deletion depending on your database engine. Understanding the performance tradeoff is key.\n\n**1. Using ROW_NUMBER() (Standard & Most Robust):**\nAssign a sequential integer to each row partitioned by the duplicate-defining columns. Keep the row where the number is 1 and delete the rest. This requires a full table scan and sort, but works universally.\n\n```sql\nWITH CTE AS (\n    SELECT *, \n           ROW_NUMBER() OVER(PARTITION BY model_name, brand ORDER BY model_id) as rn\n    FROM cars\n)\nDELETE FROM cars \nWHERE model_id IN (SELECT model_id FROM CTE WHERE rn > 1);\n```\n\n**2. Using CTID / ROWID (PostgreSQL / Oracle specific):**\n`ctid` (or `ROWID`) represents the physical location of the row on disk. You can efficiently keep the row with the maximum physical ID without needing window functions.\n```sql\nDELETE FROM cars\nWHERE ctid NOT IN (\n    SELECT max(ctid) FROM cars GROUP BY model_name, brand\n);\n```",
                "complexity": "Basic",
                "qNo": 1
            },
            {
                "q": "How do you find the highest and lowest salary in each department, while simultaneously displaying those values next to every individual employee record?",
                "a": "You can achieve this using Window Functions. \n\n**1. Using MIN() and MAX() OVER() (Most Efficient):**\nThis allows you to aggregate data without collapsing the rows like a traditional `GROUP BY` would.\n```sql\nSELECT \n    id, name, dept, salary,\n    MAX(salary) OVER(PARTITION BY dept) AS highest_sal,\n    MIN(salary) OVER(PARTITION BY dept) AS lowest_sal\nFROM employee;\n```\n\n**2. Alternative using FIRST_VALUE and LAST_VALUE:**\nWhile MIN/MAX are easier, interviewers often ask for `FIRST_VALUE`. Note the use of the `ROWS BETWEEN` framing clause to ensure `LAST_VALUE` doesn't stop at the current row.\n```sql\nSELECT \n    id, name, dept, salary,\n    FIRST_VALUE(salary) OVER(PARTITION BY dept ORDER BY salary DESC) as highest_sal,\n    LAST_VALUE(salary) OVER(PARTITION BY dept ORDER BY salary DESC \n        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as lowest_sal\nFROM employee;\n```",
                "complexity": "Basic",
                "qNo": 2
            },
            {
                "q": "Given a table tracking the 'cumulative distance' travelled by cars per day, write a query to extract the exact distance travelled on each specific day.",
                "a": "You can use the `LAG()` window function to peek at the previous day's cumulative distance and subtract it from the current day's cumulative distance.\n\n```sql\nSELECT \n    cars, \n    days, \n    cumulative_distance,\n    cumulative_distance - LAG(cumulative_distance, 1, 0) \n        OVER(PARTITION BY cars ORDER BY days) AS actual_distance\nFROM car_travels;\n```\n*Note: `LAG(col, offset, default)` is utilized here. We pass `0` as the default value so the calculation for the very first day correctly evaluates to the current cumulative distance instead of `NULL`.*",
                "complexity": "Basic",
                "qNo": 3
            },
            {
                "q": "Explain the differences between the Window Functions: Rank vs Dense_Rank vs Row_Number.",
                "a": "Window functions perform calculations across a set of table rows related to the current row, without collapsing them (unlike `GROUP BY`).\n\nImagine ranking a list of salaries: [100k, 100k, 90k, 80k]\n- **ROW_NUMBER():** Gives a strictly unique sequential integer, regardless of ties. \n  *Result: 1, 2, 3, 4*\n- **RANK():** Gives the same rank for ties, but skips subsequent ranks proportionally.\n  *Result: 1, 1, 3, 4 (Notice rank 2 is skipped)*\n- **DENSE_RANK():** Gives the same rank for ties, and does NOT skip subsequent ranks.\n  *Result: 1, 1, 2, 3*",
                "complexity": "Basic",
                "qNo": 4
            },
            {
                "q": "What is the architectural difference between OLTP and OLAP systems?",
                "a": "**OLTP (Online Transaction Processing):**\n- **Purpose:** Day-to-day operations and high-volume, fast transactions (Inserts/Updates/Deletes).\n- **Design:** Highly normalized (3NF) to prevent data redundancy and ensure ACID compliance. Queries usually return a few specific records.\n- **Examples:** Banking core systems, E-commerce checkout, MySQL, PostgreSQL.\n\n**OLAP (Online Analytical Processing):**\n- **Purpose:** Complex queries, analytics, and business intelligence. Optimized for reading massive amounts of historical data.\n- **Design:** Denormalized (Star or Snowflake schemas) to reduce expensive table joins. Data is heavily indexed and partitioned.\n- **Examples:** Data Warehouses (Snowflake, BigQuery, Redshift).",
                "complexity": "Basic",
                "qNo": 5
            },
            {
                "q": "Given a table of bidirectional travel routes (e.g., Bangalore to Hyderabad, Hyderabad to Bangalore), how do you return a deduplicated list of unique routes irrespective of the travel direction?",
                "a": "There are two ways to solve this. Using standard aggregation is generally the most efficient.\n\n**1. Using LEAST() and GREATEST() (Most Efficient):**\nThese scalar functions evaluate multiple columns in a single row and return the smallest/largest value. By forcing the alphabetically smaller city to always be the 'source', natural duplicates are created which are easily removed using `DISTINCT`. This avoids expensive joins.\n```sql\nSELECT DISTINCT \n    LEAST(source, destination) AS source,\n    GREATEST(source, destination) AS destination,\n    distance\nFROM src_dest_distance;\n```\n\n**2. Using a Self-Join & ROW_NUMBER:**\nWhile functional, this requires assigning row numbers and joining the table back to itself to filter out the reversed pair. It requires more compute overhead than the scalar function approach.",
                "complexity": "Intermediate",
                "qNo": 6
            },
            {
                "q": "Write a SQL query such that each team plays a match with every other team exactly once. Then, write a query where they play each other twice.",
                "a": "This requires joining a table to itself (Self Join) using inequality operators.\n\n**Play JUST ONCE:**\nUse the `<` (or `>`) operator. This ensures 'Team A vs Team B' is selected, but filters out 'Team B vs Team A', and 'Team A vs Team A'.\n```sql\nSELECT t1.team_name AS team, t2.team_name AS opponent\nFROM teams t1\nJOIN teams t2 ON t1.team_name < t2.team_name;\n```\n\n**Play TWICE (Home & Away):**\nUse the `<>` (not equal) operator. This ensures Team A plays Team B, and Team B plays Team A, but ensures a team doesn't play itself.\n```sql\nSELECT t1.team_name AS team, t2.team_name AS opponent\nFROM teams t1\nJOIN teams t2 ON t1.team_name <> t2.team_name;\n```",
                "complexity": "Intermediate",
                "qNo": 7
            },
            {
                "q": "How do you Pivot row-level data into columns? (e.g., Transforming a single 'month' column with 12 rows into 12 separate columns for each month)",
                "a": "While some databases like Oracle or SQL Server have a dedicated `PIVOT` keyword, the most universally standard and robust approach (which works across PostgreSQL, MySQL, BigQuery, Spark) is using Conditional Aggregation (`SUM` + `CASE WHEN`).\n\n```sql\nSELECT customer_id,\n    SUM(CASE WHEN order_month = 'Jan-21' THEN amount ELSE 0 END) AS \"Jan-21\",\n    SUM(CASE WHEN order_month = 'Feb-21' THEN amount ELSE 0 END) AS \"Feb-21\"\n    -- Add remaining months...\nFROM sales_data\nGROUP BY customer_id;\n```",
                "complexity": "Intermediate",
                "qNo": 8
            },
            {
                "q": "Write a query to calculate the difference in average sales for each month between the years 2003 and 2004.",
                "a": "You can isolate the aggregations for each year using a Common Table Expression (CTE) and then self-join them on the month. This ensures you are calculating aggregates before joining, which prevents Cartesian explosions.\n\n```sql\nWITH MonthlySales AS (\n    SELECT \n        EXTRACT(YEAR FROM order_date) AS order_year, \n        EXTRACT(MONTH FROM order_date) AS order_month, \n        AVG(sales) AS avg_sales\n    FROM sales_order\n    WHERE EXTRACT(YEAR FROM order_date) IN (2003, 2004)\n    GROUP BY 1, 2\n)\nSELECT \n    y03.order_month,\n    ROUND(ABS(y03.avg_sales - y04.avg_sales), 2) AS diff\nFROM MonthlySales y03\nJOIN MonthlySales y04 ON y03.order_month = y04.order_month\nWHERE y03.order_year = 2003 AND y04.order_year = 2004\nORDER BY y03.order_month;\n```",
                "complexity": "Intermediate",
                "qNo": 9
            },
            {
                "q": "Suppose a pizza company tracks individual pizzas ordered by customers. A single customer can place multiple orders at once, and each individual order has a status of 'CREATED', 'SUBMITTED', or 'DELIVERED'. Write a query to determine the final overall status of each customer's complete batch based on the following rules:\n1) If ALL orders are DELIVERED -> 'COMPLETED'.\n2) If SOME (but not all) are DELIVERED -> 'IN PROGRESS'.\n3) If ALL are SUBMITTED -> 'AWAITING PROGRESS'.\n4) Otherwise -> 'AWAITING SUBMISSION'.",
                "a": "There are two main ways to solve this. Conditional Aggregation is generally preferred for performance.\n\n**1. Conditional Aggregation (Most Efficient - O(N)):**\nWe group by the customer and calculate the occurrences of each status using `SUM(CASE...)` compared to the `COUNT(*)` of total orders. This requires only a **single pass** over the table, making it highly optimized.\n```sql\nSELECT cust_name AS customer_name,\n    CASE \n        WHEN SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) = COUNT(*) \n            THEN 'COMPLETED'\n        WHEN SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) > 0 \n            THEN 'IN PROGRESS'\n        WHEN SUM(CASE WHEN status = 'SUBMITTED' THEN 1 ELSE 0 END) = COUNT(*) \n            THEN 'AWAITING PROGRESS'\n        ELSE 'AWAITING SUBMISSION'\n    END AS final_status\nFROM cust_orders\nGROUP BY cust_name;\n```\n\n**2. Correlated Subqueries (Using NOT EXISTS):**\nThis approach checks for the existence of conflicting statuses. While logically readable, it can be slower on massive tables because the database engine may have to execute the subquery multiple times per customer record.\n```sql\nSELECT DISTINCT cust_name, 'COMPLETED' as status \nFROM cust_orders c1\nWHERE status = 'DELIVERED' \nAND NOT EXISTS (SELECT 1 FROM cust_orders c2 WHERE c1.cust_name = c2.cust_name AND status != 'DELIVERED')\n-- (UNION other statuses...)\n```",
                "complexity": "Intermediate",
                "qNo": 10
            },
            {
                "q": "Write a query to identify numbers appearing three times consecutively in a table.",
                "a": "There are two approaches: using a Self-Join or using Window Functions. The Window Function approach is significantly faster.\n\n**1. Using LEAD and LAG (Most Efficient):**\nThis approach scans the table only once. We peek at the adjacent rows (`LEAD` looks forward, `LAG` looks backwards) based on the ID sorting.\n```sql\nWITH NumberSequences AS (\n    SELECT \n        id, \n        num,\n        LAG(num) OVER (ORDER BY id) as prev_num,\n        LEAD(num) OVER (ORDER BY id) as next_num\n    FROM Logs\n)\nSELECT DISTINCT num AS ConsecutiveNums\nFROM NumberSequences\nWHERE num = prev_num AND num = next_num;\n```\n\n**2. Using a 3-way Self-Join (Less Efficient):**\n```sql\nSELECT DISTINCT l1.num \nFROM Logs l1, Logs l2, Logs l3\nWHERE l1.id = l2.id - 1 AND l2.id = l3.id - 1\nAND l1.num = l2.num AND l2.num = l3.num;\n```\n*Why it's worse:* This requires the database engine to perform a Cartesian join on the table against itself three times, resulting in exponential computational overhead on large datasets.",
                "complexity": "Intermediate",
                "qNo": 11
            },
            {
                "q": "How do you completely 'Ungroup' aggregated data? (e.g., turning one row '{item: Apple, count: 4}' into four separate '{item: Apple}' rows)",
                "a": "You can achieve this using a **Recursive Common Table Expression (CTE)** to dynamically generate rows iteratively by decrementing the count column until it hits 1.\n\n```sql\nWITH RECURSIVE UngroupedItems AS (\n    -- Base Case: Start with the given item and its original count\n    SELECT id, item_name, total_count, 1 as level\n    FROM travel_items\n    \n    UNION ALL\n    \n    -- Recursive Step: Join against itself, decrementing the count by 1\n    SELECT u.id, u.item_name, u.total_count - 1, u.level + 1\n    FROM UngroupedItems u\n    JOIN travel_items t ON t.id = u.id\n    WHERE u.total_count > 1 -- Stop condition\n)\nSELECT id, item_name \nFROM UngroupedItems\nORDER BY id;\n```",
                "complexity": "Complex",
                "qNo": 12
            },
            {
                "q": "Write a query to find the entire reporting hierarchy of employees under a specific manager (e.g., 'Asha').",
                "a": "Hierarchical data modeling (like org charts or bill-of-materials) is the classic use case for **Recursive CTEs**. You start with the base anchor (the manager) and recursively join the table on `employee.manager_id = recursive_cte.employee_id` to traverse downwards.\n\n```sql\nWITH RECURSIVE HierarchyCTE AS (\n    -- Anchor member: Select the target manager\n    SELECT id, name, manager_id, designation, 1 as level\n    FROM emp_details \n    WHERE name = 'Asha'\n    \n    UNION ALL\n    \n    -- Recursive member: Find employees whose manager is in the CTE (traversing down)\n    SELECT e.id, e.name, e.manager_id, e.designation, h.level + 1\n    FROM emp_details e\n    JOIN HierarchyCTE h ON e.manager_id = h.id\n)\nSELECT * FROM HierarchyCTE;\n```",
                "complexity": "Complex",
                "qNo": 13
            },
            {
                "q": "Deep Dive: CTEs (Common Table Expressions) vs. Temporary Tables. What is the performance difference and when do you use each?",
                "a": "**CTE (`WITH` clause):**\n- **How it works:** A CTE is generally evaluated as an inline view. It does *not* store data physically. In many databases (like PostgreSQL), if you reference the same CTE three times in your main query, the database engine will re-calculate the CTE three separate times.\n- **Use Case:** Great for readability, recursive queries (hierarchies), and organizing complex logic into manageable steps.\n\n**Temporary Table (`CREATE TEMP TABLE`):**\n- **How it works:** A Temp Table physically materializes the data into disk/memory for the duration of the session. You can build indexes on it.\n- **Use Case:** Crucial for massive datasets where you need to reference the intermediate result multiple times. By materializing it once, you pay the compute cost once. If a CTE takes 5 minutes to run and you reference it 4 times, the query takes 20 minutes. A Temp table runs in 5 minutes, and subsequent reads take milliseconds.",
                "complexity": "Complex",
                "qNo": 14
            },
            {
                "q": "Explain B-Tree Indexes vs Columnar Storage formats (like Parquet). Why are B-Trees highly inefficient for OLAP Data Warehouses?",
                "a": "**B-Tree (Row-Based OLTP):**\n- The default index in MySQL/PostgreSQL. It organizes row locators in a balanced tree. \n- **Why it's bad for OLAP:** B-Trees are optimized for 'needle in a haystack' point lookups (e.g., `SELECT * WHERE user_id = 123`). In OLAP, you rarely fetch one row. You run aggregates on millions of rows (`SUM(revenue) GROUP BY month`). A B-Tree forces the engine to read the entire row (all columns) from disk just to get the revenue value, resulting in massive wasted I/O.\n\n**Columnar Storage (OLAP):**\n- Stores values column-by-column contiguously on disk. \n- **Why it's great for OLAP:** If you run `SUM(revenue)`, the engine only reads the contiguous 'revenue' data blocks from disk, completely ignoring the other 100 columns. Furthermore, because column values are highly similar (e.g., millions of repeated 'USD' currency codes), columnar storage compresses beautifully (Snappy, Zstd), drastically reducing disk I/O.",
                "complexity": "Complex",
                "qNo": 15
            },
            {
                "q": "How do you analyze a Query Execution Plan (`EXPLAIN`)? What specific bottlenecks are you looking for?",
                "a": "An execution plan is the physical strategy the database optimizer chooses to execute your query.\n\n**Red Flags to look for:**\n1. **Sequential Scans / Full Table Scans:** The engine is reading every single row in the table because it couldn't find an index or partition to prune data. Fine for tiny tables, disastrous for billion-row fact tables.\n2. **Nested Loop Joins on large datasets:** Nested Loops iterate over every row in Table A and search for a match in Table B (O(N*M) complexity). Excellent for joining a 10-row table, but if you see a Nested Loop between two 1M-row tables, the query will hang forever. The optimizer should be using a **Hash Join** or **Sort-Merge Join** instead.\n3. **Hash Aggregates spilling to disk:** If your `GROUP BY` has too many high-cardinality groups, the hash table won't fit in memory and will spill to temp disk space, slowing performance to a crawl.",
                "complexity": "Complex",
                "qNo": 16
            }
        ]
    },
    {
        "id": "data-modeling",
        "title": "Data Modeling",
        "questions": [
            {
                "q": "What is data modeling, and explain the difference between conceptual, logical, and physical data models.",
                "a": "Data modeling is the process of defining how data is structured, stored, and related across your system to balance query performance with maintainability.\n\n- **Conceptual Model:** Defines high-level entities and relationships (e.g., 'Customer places Order'). Built for business stakeholders.\n- **Logical Model:** Adds attributes, data types, and primary/foreign keys without worrying about a specific database engine (e.g., specifying that Customer has an 'email' string).\n- **Physical Model:** The actual implementation code (DDL). Includes database-specific column types (VARCHAR vs STRING), indexes, partitions, and storage formats.",
                "complexity": "Basic",
                "qNo": 17
            },
            {
                "q": "What is normalization? Walk through 1NF, 2NF, and 3NF, and explain when you should denormalize.",
                "a": "**Normalization** organizes data to reduce redundancy and enforce integrity.\n- **1NF:** Atomic column values and no repeating groups (e.g., no comma-separated lists in a column).\n- **2NF:** Eliminates partial dependencies. Every non-key column must depend on the *entire* primary key, not just part of a composite key.\n- **3NF:** Removes transitive dependencies. If Column C depends on Column B, which depends on Primary Key A, then C should live in a separate table.\n\n**Denormalization** adds deliberate redundancy to reduce expensive JOINs at query time. It is typically used in Data Warehouses (OLAP) where read performance is critical and writes/updates are infrequent.",
                "complexity": "Basic",
                "qNo": 18
            },
            {
                "q": "What is a Star Schema, and how does it differ from a Snowflake Schema?",
                "a": "**Star Schema:** A central Fact table connects directly to multiple denormalized Dimension tables. It looks like a star. It minimizes JOINs (one hop) and is the default choice for modern analytics and BI tools.\n\n**Snowflake Schema:** A variation where the dimension tables are normalized into sub-dimensions (e.g., a `dim_product` table links to a `dim_category` table). This saves storage space by reducing redundancy but introduces multiple JOINs. \n\n*In modern columnar databases (BigQuery, Snowflake), storage is cheap but JOINs are expensive, making Star schemas generally preferred over Snowflake schemas.*",
                "complexity": "Basic",
                "qNo": 19
            },
            {
                "q": "What is the difference between a Fact table and a Dimension table?",
                "a": "**Fact Table:** Stores measurable, quantitative events or transactions (e.g., `order_amount`, `click_count`, `shipment_weight`). Facts are typically numeric and additive. They contain foreign keys pointing to dimension tables.\n\n**Dimension Table:** Stores descriptive context—the 'who, what, where, when, why' of an event (e.g., `customer_name`, `product_category`, `store_location`). Dimensions are wide and short, while facts are skinny and extremely long.",
                "complexity": "Basic",
                "qNo": 20
            },
            {
                "q": "What is a Surrogate Key, and why is it preferred over a Natural Key in Data Warehousing?",
                "a": "**Natural Key:** A unique identifier that exists in the business data (e.g., `email`, `SSN`, `order_number`).\n\n**Surrogate Key:** A system-generated, auto-incrementing integer or UUID with absolutely no business meaning. \n\nSurrogate keys are heavily preferred in Data Warehouses because natural keys change over time (companies merge, users change emails, SKUs get reassigned). Surrogate keys insulate the warehouse from upstream business changes. Furthermore, joining on integer surrogate keys is significantly faster than joining on string-based natural keys.",
                "complexity": "Basic",
                "qNo": 21
            },
            {
                "q": "What is 'Grain' in dimensional modeling, and why is it the most important decision?",
                "a": "**Grain** defines the exact level of detail stored in a single row of a fact table. \n\nFor example, the grain could be 'one row per order', 'one row per order line item', or 'one row per daily store inventory'.\n\nGetting the grain wrong is disastrous. If it's too coarse (e.g., aggregated to weekly sales), you lose the ability to drill down into daily trends. If it's undefined or mixed, you risk massive data duplication (fan-outs) and silently inflating business metrics.",
                "complexity": "Intermediate",
                "qNo": 22
            },
            {
                "q": "Explain the three main types of Fact Tables.",
                "a": "1. **Transaction Fact Table:** Records individual events. One row per action (e.g., one row per checkout). Highly granular but can grow massive.\n2. **Periodic Snapshot Fact Table:** Captures the state of entities at regular intervals. One row per entity per time period (e.g., a daily snapshot of a user's bank account balance or store inventory). Ideal for tracking trends over time.\n3. **Accumulating Snapshot Fact Table:** Tracks a workflow process with a defined beginning and end. One row per entity, with multiple timestamp columns updated as it moves through stages (e.g., order_placed_date, shipped_date, delivered_date).",
                "complexity": "Intermediate",
                "qNo": 23
            },
            {
                "q": "What are Conformed Dimensions?",
                "a": "Conformed dimensions are dimension tables that are shared identically across multiple fact tables or data marts. \n\nFor example, a `dim_date` or `dim_customer` table used by both the Sales department's fact tables and the Support department's fact tables. This ensures enterprise-wide consistency, avoiding a scenario where Sales reports 50,000 customers but Marketing reports 48,000 due to different filtering logic.",
                "complexity": "Intermediate",
                "qNo": 24
            },
            {
                "q": "Explain Junk, Degenerate, and Role-Playing Dimensions.",
                "a": "- **Degenerate Dimension:** A dimension key that lives directly in the fact table without a corresponding dimension table. Typically a transaction identifier like an `order_number` or `invoice_id` that provides grouping context but has no extra descriptive attributes.\n- **Junk Dimension:** A single dimension table that groups together miscellaneous, low-cardinality binary flags (e.g., `is_gift_wrapped`, `is_expedited`) to prevent cluttering the massive fact table with dozens of boolean columns.\n- **Role-Playing Dimension:** A single physical dimension table joined multiple times to the same fact table under different aliases. E.g., `dim_date` playing the role of `order_date`, `ship_date`, and `delivery_date`.",
                "complexity": "Intermediate",
                "qNo": 25
            },
            {
                "q": "What are Slowly Changing Dimensions (SCDs)? Explain Type 1, Type 2, and Type 3.",
                "a": "SCDs handle updates to dimension attributes over time (e.g., a customer moving from NY to CA).\n- **Type 1 (Overwrite):** Overwrites the old value with the new one. No historical record is kept. Simple, but breaks historical reporting.\n- **Type 2 (Add New Row):** Preserves full history. The old row is expired (setting an `end_date` and `is_current = false`), and a new row is inserted with the new value, `start_date`, and a new surrogate key. Most common approach in modern warehouses.\n- **Type 3 (Add Column):** Adds a 'previous_value' column alongside the 'current_value' column. Only keeps track of the single most recent change, rather than a full audit log. Rarely used.",
                "complexity": "Intermediate",
                "qNo": 26
            },
            {
                "q": "How do you handle many-to-many relationships in a star schema?",
                "a": "You use a **Bridge Table** (also known as a Factless Fact Table). \n\nFor example, a patient can have multiple diagnoses, and a single diagnosis applies to multiple patients. You insert a bridge table containing `patient_key` and `diagnosis_key` between the Fact and Dimension tables. This resolves the many-to-many relationship into two one-to-many relationships. \n\n*Caution:* When joining through bridge tables, you must apply weighting factors or distinct counts to prevent Cartesian explosion and double-counting metrics.",
                "complexity": "Intermediate",
                "qNo": 27
            },
            {
                "q": "Explain the Kimball vs Inmon approaches to Data Warehousing.",
                "a": "**Kimball (Bottom-Up):** Focuses on building dimensional data marts (Star Schemas) specific to business processes first. These marts are integrated later via conformed dimensions. It delivers business value much faster and is heavily adopted in modern cloud environments.\n\n**Inmon (Top-Down):** Focuses on building a centralized, highly normalized (3NF) Enterprise Data Warehouse (EDW) as a single source of truth first. Dimensional data marts are then derived from this EDW. Slower to build, but strictly governed.",
                "complexity": "Intermediate",
                "qNo": 28
            },
            {
                "q": "How do you implement SCD Type 2 in SQL?",
                "a": "SCD Type 2 relies on comparing incoming staging data with the current dimension data to detect changes, expire old rows, and insert new ones.\n\n1. **Detect Changes:** Join the incoming staging data against `dim_table` where `is_current = TRUE` to find mismatched attributes (e.g., `staging.city != dim.city`).\n2. **Expire Old Rows:** Use an `UPDATE` statement on the mismatched records, setting `end_date = CURRENT_DATE` and `is_current = FALSE`.\n3. **Insert New Rows:** Use an `INSERT` statement to append the new incoming records, setting `start_date = CURRENT_DATE`, `end_date = '9999-12-31'`, and `is_current = TRUE`.",
                "complexity": "Complex",
                "qNo": 29
            },
            {
                "q": "What is Data Vault modeling?",
                "a": "Data Vault is a highly scalable modeling methodology optimized for auditability and agile enterprise integrations. It separates structure from content using three core tables:\n- **Hubs:** Store unique business keys (e.g., Customer ID) and load metadata.\n- **Links:** Store relationships (many-to-many associations) between Hubs.\n- **Satellites:** Store the descriptive attributes and historical changes (like an SCD Type 2) for a Hub or Link.\n\n*Pros:* Highly resilient to upstream schema changes. \n*Cons:* Massive table proliferation. A simple 5-table star schema might require 15+ Data Vault tables. It is typically used only for the raw/integration layer, with Star Schemas built as virtual views on top for business consumption.",
                "complexity": "Complex",
                "qNo": 30
            },
            {
                "q": "How do you handle 'Late-Arriving Dimensions'?",
                "a": "A late-arriving dimension happens when a fact record (transaction) arrives in the pipeline before its corresponding master dimension data (e.g., an order arrives for a customer ID that hasn't been ingested yet).\n\nIf you simply drop the fact, you lose revenue data. If you insert a NULL foreign key, you break inner joins.\n\n**Solution:** Insert a 'stub' or 'dummy' row into the dimension table. Assign it a valid surrogate key, the missing natural key, and placeholder values (e.g., 'Unknown'). Link the fact table to this surrogate key. When the actual dimension data finally arrives, update the dummy row with the real attributes.",
                "complexity": "Complex",
                "qNo": 31
            },
            {
                "q": "What is a Mini-Dimension, and when would you use it?",
                "a": "If you have a massive dimension table (e.g., 100 million customers) and certain attributes change very frequently (e.g., `loyalty_points_tier`, `credit_score_band`), applying standard SCD Type 2 would cause the table to explode in size due to constant versioning.\n\n**Solution:** Extract the volatile attributes into a separate, smaller table called a **Mini-Dimension**. This table contains every possible combination of those volatile attributes. The Fact table is then updated to hold two foreign keys: one pointing to the main static `dim_customer` and one pointing to the volatile `dim_customer_profile`.",
                "complexity": "Complex",
                "qNo": 32
            },
            {
                "q": "Write a SQL query to identify grain violations (duplicate rows) in a fact table.",
                "a": "Grain violations are the #1 cause of silently inflated metrics. To check for them, group by the columns that define your grain (e.g., `order_id` and `product_id` for an order-line grain) and filter for counts greater than 1.\n\n```sql\nSELECT \n    order_id, \n    product_id, \n    COUNT(*) as row_count \nFROM fact_sales \nGROUP BY \n    order_id, \n    product_id \nHAVING COUNT(*) > 1 \nORDER BY row_count DESC;\n```\nIf this returns any rows, your ETL pipeline has a fanning issue or missing deduplication logic.",
                "complexity": "Complex",
                "qNo": 33
            }
        ]
    },
    {
        "id": "dbt-data-build-tool",
        "title": "dbt (Data Build Tool)",
        "questions": [
            {
                "q": "What is dbt, and what problem does it solve for data teams?",
                "a": "**dbt (data build tool)** is an open-source transformation workflow that lets analysts and engineers write modular SQL `SELECT` statements, while dbt handles the underlying DDL/DML to materialize them in the data warehouse.\n\n**Problem solved:** Before dbt, teams maintained hundreds of hand-written `CREATE TABLE` and `INSERT` statements via CRON jobs with no version control, automated testing, or lineage. dbt treats SQL transformations as software engineering by providing built-in Git integration, CI/CD, documentation, testing, and dependency graphs (DAG). \n\n*Note: dbt does not extract or load data (it is the 'T' in ELT); it only transforms what is already in the warehouse.*",
                "complexity": "Basic",
                "qNo": 34
            },
            {
                "q": "What is a dbt model?",
                "a": "A model is simply a single SQL `SELECT` statement saved as a `.sql` file in your `models/` directory.\n\nWhen you execute `dbt run`, dbt automatically wraps that `SELECT` statement in the appropriate DDL (like `CREATE TABLE`, `CREATE VIEW`, `MERGE`, etc.) based on your materialization configuration. Models are the atomic unit of transformation in dbt; every other feature (tests, documentation, lineage) attaches to these models.",
                "complexity": "Basic",
                "qNo": 35
            },
            {
                "q": "What are the four built-in materializations in dbt, and when do you use each?",
                "a": "1. **view:** Used for lightweight transformations that don't need to persist data on disk. The warehouse re-executes the SQL on every query. Good for staging layers.\n2. **table:** Rebuilds the entire table from scratch on every run. Used when downstream consumers need fast reads, and the dataset is small enough that a full rebuild isn't too expensive.\n3. **incremental:** Used for massive fact tables where rebuilding every time is too slow or costly. It only transforms and loads 'new' or 'changed' records.\n4. **ephemeral:** Used for reusable CTEs that you never want materialized as their own physical object in the database. dbt directly inlines the SQL into the downstream model's compiled query.",
                "complexity": "Basic",
                "qNo": 36
            },
            {
                "q": "What does the `ref()` function do, and why is it critical?",
                "a": "`{{ ref('model_name') }}` resolves to the fully qualified table name of another dbt model in your warehouse, and simultaneously registers a dependency in the dbt Directed Acyclic Graph (DAG).\n\nWithout `ref()`, dbt has no idea that Model B depends on Model A. It might run them in the wrong order or in parallel, causing query failures or stale data. You should *never* hardcode schema-qualified table names in your SQL; always use `ref()`.",
                "complexity": "Basic",
                "qNo": 37
            },
            {
                "q": "What is `source()` and how does it differ from `ref()`?",
                "a": "`{{ source('source_name', 'table_name') }}` points to raw tables that already exist in your warehouse but are *not* managed by dbt (e.g., data landed by Fivetran or Airbyte).\n\n**Difference:**\n- `ref()` points to dbt-managed models (your transformations).\n- `source()` points to external raw tables.\n\nDefining sources (in a `schema.yml` file) allows you to use the `source()` function in your SQL, adding the raw tables to your DAG and enabling automated **source freshness checks**.",
                "complexity": "Basic",
                "qNo": 38
            },
            {
                "q": "Explain the difference between `dbt run` and `dbt build`.",
                "a": "- **`dbt run`:** Executes *only* the models. It does not run tests.\n- **`dbt build`:** Runs models, tests, snapshots, and seeds in strictly DAG order. This means it runs a model, immediately runs its tests, and *only* continues to downstream models if those tests pass.\n\n`dbt build` is the safer default for CI/CD pipelines because it catches test failures before they cascade downstream.",
                "complexity": "Basic",
                "qNo": 39
            },
            {
                "q": "What is the dbt DAG, and why does execution order matter?",
                "a": "The DAG (Directed Acyclic Graph) is the dependency graph built dynamically from every `ref()` and `source()` call across your dbt project.\n\ndbt uses the DAG to determine the exact execution order. Models with no upstream dependencies run first, and dbt parallelizes independent branches to optimize performance. If you break the DAG (e.g., by hardcoding table names instead of using `ref()`), dbt will process models out of order, leading to failures or propagating stale data.",
                "complexity": "Intermediate",
                "qNo": 40
            },
            {
                "q": "What are schema tests in dbt, and what are the built-in tests?",
                "a": "Schema tests are assertions declared in YAML (`schema.yml`) that dbt compiles into SQL queries to run against your models. If the test query returns any rows (count > 0), the test fails.\n\nThere are four built-in schema tests:\n1. **`unique`:** Ensures all values in a column are unique.\n2. **`not_null`:** Ensures no values in a column are NULL.\n3. **`accepted_values`:** Ensures all values in a column match a predefined list (e.g., ['placed', 'shipped', 'delivered']).\n4. **`relationships`:** Enforces referential integrity (similar to a Foreign Key) by ensuring a value exists in another model.",
                "complexity": "Intermediate",
                "qNo": 41
            },
            {
                "q": "What is the difference between Schema tests and Data (singular) tests?",
                "a": "- **Schema tests:** Configured in YAML. They are highly reusable and apply to specific columns or models (e.g., `not_null`, `unique`).\n- **Data (singular) tests:** Standalone SQL files placed in your `tests/` directory. They are used for complex business logic assertions that don't fit a generic YAML format (e.g., `SELECT * FROM {{ ref('orders') }} WHERE order_date > ship_date`). If the SQL returns any rows, the test fails.",
                "complexity": "Intermediate",
                "qNo": 42
            },
            {
                "q": "How do you write a custom generic test in dbt?",
                "a": "You can create a SQL file in `tests/generic/` (or `macros/`) that accepts arguments and returns failing rows. \n\nFor example:\n```sql\n{% test is_positive(model, column_name) %}\n    SELECT * \n    FROM {{ model }} \n    WHERE {{ column_name }} < 0\n{% endtest %}\n```\nOnce defined, you can apply it instantly in your YAML file under any column's tests block just like a built-in test:\n```yaml\ntests:\n  - is_positive\n```\nThis allows you to scale custom data quality checks across hundreds of models effortlessly.",
                "complexity": "Intermediate",
                "qNo": 43
            },
            {
                "q": "What is source freshness, and how do you configure it?",
                "a": "Source freshness checks whether raw tables have been updated recently, preventing dbt from transforming stale data.\n\nYou configure it in your `sources.yml` by defining a `loaded_at_field` (a timestamp column) and setting freshness thresholds (`warn_after` and `error_after`). \n\nWhen you run `dbt source freshness`, dbt checks if the maximum timestamp in the raw table is older than the threshold and throws an alert before your pipeline even runs.",
                "complexity": "Intermediate",
                "qNo": 44
            },
            {
                "q": "What are exposures in dbt?",
                "a": "Exposures are YAML declarations of the downstream consumers of your dbt models (e.g., a Tableau Dashboard, a Machine Learning model, or a Reverse ETL sync).\n\nBy defining exposures, they appear at the very end of your lineage graph. This allows data engineers to perform impact analysis before refactoring a model. Without exposures, someone might alter a model like `fct_revenue` without realizing it will break the CEO's primary dashboard.",
                "complexity": "Intermediate",
                "qNo": 45
            },
            {
                "q": "How does an incremental model work under the hood?",
                "a": "On the first run (or during a `--full-refresh`), dbt creates the table with a standard full `SELECT` statement.\n\nOn subsequent runs, dbt compiles your code into a `MERGE`, `INSERT`, or `DELETE+INSERT` statement that only processes new or changed rows. You control which rows are considered \"new\" by using the `is_incremental()` macro to filter on a timestamp or event ID. Under the hood, dbt is just compiling standard DML statements that your specific data warehouse executes natively.",
                "complexity": "Complex",
                "qNo": 46
            },
            {
                "q": "What is the `is_incremental()` macro, and how is it typically used?",
                "a": "`is_incremental()` is a Jinja macro that evaluates to `True` only if the model already exists as a table in the database and the current run is *not* a full refresh.\n\nIt is used to dynamically inject a `WHERE` clause to filter for new data:\n```sql\nSELECT * \nFROM {{ source('raw', 'events') }}\n\n{% if is_incremental() %}\n  WHERE event_timestamp > (SELECT MAX(event_timestamp) FROM {{ this }})\n{% endif %}\n```\n*Note: `{{ this }}` is a special variable referring to the already-materialized table in the database.*",
                "complexity": "Complex",
                "qNo": 47
            },
            {
                "q": "What are the four incremental strategies, and when do you pick each?",
                "a": "1. **append:** Blindly adds new rows. Use when you are certain there are no late-arriving duplicates (e.g., immutable event logs).\n2. **merge:** Performs an upsert based on a `unique_key`. Use when rows can be updated (e.g., an order status changing from 'pending' to 'shipped').\n3. **delete+insert:** Deletes matching rows first, then inserts. Use on warehouses where `MERGE` is computationally expensive or unsupported.\n4. **insert_overwrite:** Replaces entire partitions efficiently. Highly recommended for partition-aware warehouses like BigQuery or Spark when processing massive daily batches.",
                "complexity": "Complex",
                "qNo": 48
            },
            {
                "q": "What happens if you forget to set a `unique_key` on a merge incremental model?",
                "a": "If you configure an incremental model to use the `merge` strategy but forget to define the `unique_key` in the configuration block, dbt has no way to identify matching rows for upserts.\n\nAs a result, dbt falls back to essentially doing an `INSERT`, meaning every row processed by the incremental SELECT will be blindly appended, even if those rows already exist in the target table. This leads to compounding duplicates on every run—one of the most common production bugs in dbt.",
                "complexity": "Complex",
                "qNo": 49
            }
        ]
    },
    {
        "id": "spark-databricks",
        "title": "Spark & Databricks",
        "questions": [
            {
                "q": "Explain the Spark Architecture (Driver, Executors, Stages, and Tasks).",
                "a": "Apache Spark follows a master-slave architecture. \n\n**1. Driver (Master):** The brain of the application. It runs the `main()` function, converts your code into a logical and physical execution plan (DAG), and negotiates resources with the cluster manager (YARN/Kubernetes).\n**2. Cluster Manager:** Allocates resources (CPU/Memory) across the cluster.\n**3. Executors (Slaves):** Worker nodes that run the actual computations and store data in memory (cache/persist).\n\nWhen you submit a job, Spark breaks it down into:\n- **Jobs:** Triggered by an Action (e.g., `.count()`).\n- **Stages:** Created whenever there is a wide transformation (Shuffle). Data must move across the network.\n- **Tasks:** The smallest unit of work, executed by a core on an executor. One task processes one partition of data.",
                "complexity": "Basic",
                "qNo": 50
            },
            {
                "q": "What is the difference between Narrow and Wide Transformations?",
                "a": "Transformations in Spark are lazy (they don't compute until an action is called). They are divided into two types based on data movement:\n\n**1. Narrow Transformations:** Data required to compute the records in a single partition reside in at most one partition of the parent dataset. No data is sent over the network (No Shuffle). \n*Examples:* `map()`, `filter()`, `withColumn()`.\n\n**2. Wide Transformations:** Data required to compute the records in a single partition may reside in many partitions of the parent dataset. This requires a **Shuffle** (moving data across the network between executors), which is expensive and slow.\n*Examples:* `groupBy()`, `join()`, `orderBy()`, `repartition()`.\n\nBecause wide transformations require a shuffle, they form the boundaries for Spark **Stages**.",
                "complexity": "Basic",
                "qNo": 51
            },
            {
                "q": "What is the difference between repartition() and coalesce()?",
                "a": "Both are used to change the number of partitions in a DataFrame.\n\n**repartition(n):** Can increase or decrease partitions. It does a full data **shuffle** across the network to ensure data is evenly distributed. Used when you need balanced partitions for heavy downstream processing.\n\n**coalesce(n):** Can *only decrease* partitions. It avoids a full shuffle by safely moving data from one partition into an existing one on the same node (where possible). It is much faster but can result in unevenly sized partitions. Typically used right before writing data to disk to reduce the number of output files.",
                "complexity": "Basic",
                "qNo": 52
            },
            {
                "q": "How does the Catalyst Optimizer work?",
                "a": "The Catalyst Optimizer is the core engine in Spark SQL and DataFrames that automatically optimizes your queries. It operates in 4 phases:\n\n1. **Analysis:** Resolves column names and table names against the Catalog (Metadata). (Yields a Resolved Logical Plan)\n2. **Logical Optimization:** Applies rule-based optimizations like *Predicate Pushdown* (filtering data as early as possible before joins/shuffles) and *Column Pruning* (dropping unused columns). (Yields an Optimized Logical Plan)\n3. **Physical Planning:** Uses Cost-Based Optimization (CBO) to generate multiple physical plans and selects the cheapest one (e.g., choosing a Broadcast Join over a Sort-Merge Join based on table size).\n4. **Code Generation:** Uses Tungsten to generate highly optimized Java bytecode for execution.",
                "complexity": "Intermediate",
                "qNo": 53
            },
            {
                "q": "What are Broadcast Joins vs Shuffle Sort-Merge Joins?",
                "a": "**Broadcast Hash Join (BHJ):** Used when joining a massive table with a very small table (default < 10MB). Spark sends (broadcasts) the entire small table to every executor. This completely avoids a network shuffle of the large table, making it extremely fast.\n\n**Shuffle Sort-Merge Join (SMJ):** The default join for two large tables. Spark shuffles both tables across the network so that matching keys end up on the same executor, sorts them, and then merges them. It is highly robust for large data but very slow due to the network I/O.",
                "complexity": "Intermediate",
                "qNo": 54
            },
            {
                "q": "What is Adaptive Query Execution (AQE)?",
                "a": "Introduced in Spark 3.0, AQE allows Spark to re-optimize query plans *at runtime* based on exact data statistics gathered during shuffles, rather than relying solely on static estimates. \n\nIt does 3 main things:\n1. **Dynamically coalesces shuffle partitions:** If Spark creates 200 partitions but many are tiny, AQE merges them to avoid the small-file/scheduling overhead.\n2. **Dynamically switches join strategies:** If a table gets heavily filtered during runtime and becomes small enough, AQE downgrades a slow Sort-Merge Join into a fast Broadcast Join.\n3. **Dynamically handles skew:** If AQE detects a heavily skewed partition during a join, it automatically splits the skewed partition into smaller sub-partitions.",
                "complexity": "Intermediate",
                "qNo": 55
            },
            {
                "q": "How do OPTIMIZE, Z-Order, and VACUUM work in Delta Lake?",
                "a": "**OPTIMIZE (Bin-packing):** Solves the \"Small Files Problem\". Streaming or frequent small batch jobs write thousands of tiny Parquet files. `OPTIMIZE` reads these tiny files and rewrites them into larger, optimal-sized files (usually 1GB), massively improving read performance.\n\n**Z-Order (Multi-dimensional Clustering):** Used alongside OPTIMIZE. It physically sorts the data in the storage files based on frequently filtered columns. This allows Delta Lake to use \"Data Skipping\" to ignore entire files that don't contain the requested data, dramatically speeding up `WHERE` clauses.\n\n**VACUUM:** Delta Lake keeps older versions of files for Time Travel (querying historical states). `VACUUM` permanently deletes files that are no longer referenced by the current Delta log and are older than the retention threshold (default 7 days), freeing up storage space.",
                "complexity": "Intermediate",
                "qNo": 56
            },
            {
                "q": "What is Data Skew in Spark, and how do you fix it (Salting)?",
                "a": "Data Skew happens when data is unevenly distributed across partitions. During a shuffle (like a `groupBy` or `join`), one executor might receive 90% of the data while others get 10%. The entire stage waits for that single \"straggler\" task to finish, or it crashes with an OutOfMemory (OOM) error.\n\n**How to fix it (Salting):**\nSalting is a technique to artificially distribute the skewed key.\n1. **Add a random number (Salt):** Append a random integer (e.g., 1 to 10) to the skewed key in the large table (`key_1`, `key_2`).\n2. **Replicate the small table:** Explode the small table so it contains every possible salt variant of the key.\n3. **Join:** Now, the skewed key is broken into 10 smaller, evenly distributed keys, allowing Spark to process the join in parallel without OOMing.\n\n*(Note: If using Spark 3+, Adaptive Query Execution (AQE) can often handle data skew automatically if skew hints are enabled).*.",
                "complexity": "Complex",
                "qNo": 57
            },
            {
                "q": "Deep Dive: What is Unity Catalog? How does it fundamentally change data governance in Databricks?",
                "a": "Historically, Databricks relied on the Hive Metastore (HMS), which was bound to a specific workspace. If you had 5 workspaces, you had 5 siloed metastores. Permissions were managed via complex cloud IAM roles, and table-level ACLs were notoriously difficult.\n\n**Unity Catalog (UC)** is a centralized, account-level governance layer:\n1. **Centralized Metastore:** One metastore governs all workspaces across your entire organization. Data is strictly referenced hierarchically: `catalog.schema.table`.\n2. **Standardized SQL ACLs:** Instead of cloud IAM roles, you grant permissions using standard ANSI SQL: `GRANT SELECT ON TABLE my_table TO group_data_scientists;`. UC translates this natively to the cloud storage layer.\n3. **Fine-Grained Governance:** UC enables Row-Level Security (RLS) and Column-Level Masking out of the box, preventing PII exposure without duplicating datasets.\n4. **Automated Lineage:** UC automatically tracks data lineage at the table and column level across all languages (SQL, Python, Scala) and displays it visually.",
                "complexity": "Complex",
                "qNo": 58
            },
            {
                "q": "Deep Dive: Explain the Delta Lake Transaction Log (_delta_log). How does it achieve ACID transactions on Cloud Object Storage?",
                "a": "Cloud Object Storage (S3, ADLS) is immutable. You cannot natively 'update' an object. Delta Lake achieves ACID transactions by managing a specialized folder called `_delta_log`.\n\n**How it works:**\n1. Every time you write, update, or delete data, Delta doesn't mutate existing Parquet files. It writes brand new Parquet files.\n2. Simultaneously, it writes a JSON commit file (e.g., `000001.json`) to the `_delta_log` directory. This JSON explicitly lists which Parquet files were `add`ed and which were `remove`d (logically deleted).\n3. When a reader queries the table, the Spark engine first reads the `_delta_log`. It computes the current state of the table by reconciling all the `add` and `remove` actions, and *only* reads the valid Parquet files, ignoring the tombstoned ones.\n\n**Checkpoints:** Reading thousands of JSON files would be slow. Every 10 commits, Delta automatically generates a Parquet Checkpoint file in the log, summarizing the entire table state. The reader just reads the latest checkpoint + any newer JSONs.",
                "complexity": "Complex",
                "qNo": 59
            },
            {
                "q": "Databricks Photon Engine vs standard Spark. How does vectorized execution work?",
                "a": "**Standard Spark** runs on the JVM (Java Virtual Machine). It processes data row-by-row (or using Tungsten's whole-stage code generation). While highly optimized, the JVM still suffers from garbage collection overhead and virtual method dispatching.\n\n**Photon** is a custom, native execution engine written entirely in **C++** that integrates seamlessly under Spark.\n- **Vectorized Execution:** Instead of processing one row at a time, Photon processes batches of data (vectors) simultaneously, utilizing modern CPU architectures (SIMD instructions - Single Instruction, Multiple Data).\n- **Bypass JVM:** For supported operations (like Aggregations, Joins, and string manipulations), the execution completely bypasses the JVM, eliminating garbage collection pauses and massively accelerating performance. If an operation isn't supported in C++, it seamlessly falls back to the JVM.",
                "complexity": "Complex",
                "qNo": 60
            },
            {
                "q": "Structured Streaming vs Databricks Auto Loader. When and why should you use Auto Loader?",
                "a": "If you want to ingest thousands of new files landing in S3 into a Delta Table, you have two options.\n\n**Standard Structured Streaming:**\n- Uses file listing (e.g., `spark.readStream.json('s3://bucket/')`). \n- *The Problem:* To find new files, Spark has to list the entire directory on every micro-batch. If your directory has 5 million files, the `ls` API call takes minutes, causing extreme bottlenecks.\n\n**Databricks Auto Loader (`cloudFiles`):**\n- Specifically engineered to ingest millions of files from cloud storage efficiently.\n- **File Notification Mode:** Instead of listing directories, Auto Loader automatically sets up Cloud Event Notifications (e.g., AWS SNS/SQS). When a file lands, an event is pushed to the queue. Auto Loader just reads the queue to know exactly which files are new. Zero directory listing required.\n- **Schema Evolution:** Auto Loader automatically detects schema changes (new columns, data type changes) and handles them gracefully using a schema location path, preventing the stream from crashing.",
                "complexity": "Intermediate",
                "qNo": 61
            },
            {
                "q": "Deep Dive: You get an OutOfMemory (OOM) error on the Spark Driver. What causes it, and how do you fix it?",
                "a": "Driver OOMs are usually caused by bad coding practices that force massive amounts of data back to the master node, overwhelming its limited memory (e.g., 4GB-8GB).\n\n**Common Causes & Fixes:**\n1. **`df.collect()`:** This pulls the entire distributed DataFrame from all Executors directly into the Driver's RAM. *Fix:* Never use `collect()` on large datasets. Use `take()`, `show()`, or write directly to storage.\n2. **Massive Broadcast Joins:** If you explicitly broadcast a table that is larger than the Driver's memory limit (or `spark.sql.autoBroadcastJoinThreshold`), the Driver will OOM while trying to collect and broadcast the table. *Fix:* Disable broadcast join or increase driver memory.\n3. **Too many partitions / Large DAG:** If you have 100,000 partitions or an extremely complex lineage, the metadata the Driver tracks for task scheduling becomes so large it exhausts the JVM heap. *Fix:* Coalesce partitions, or truncate lineage by using `df.checkpoint()`.",
                "complexity": "Complex",
                "qNo": 62
            },
            {
                "q": "Deep Dive: You get an OOM on a Spark Executor during a Shuffle (e.g., a massive GroupBy or Join). How do you troubleshoot?",
                "a": "Executor OOMs during a shuffle are primarily caused by **Data Skew** or insufficient memory per core.\n\n**Troubleshooting & Fixes:**\n1. **Identify Data Skew:** Look at the Spark UI's 'Tasks' tab. If 199 tasks finish in 5 seconds, and 1 task takes 20 minutes (or OOMs), you have skew. A single executor is choking on a massive partition (e.g., `null` values or a default 'Unknown' key). *Fix:* Filter out nulls, use Salting, or enable AQE Skew Join.\n2. **Memory per Core Ratio:** If an executor has 16GB RAM and 8 cores, each task only gets 2GB of RAM. If you are processing wide rows, they will OOM. *Fix:* Lower `spark.executor.cores` (e.g., to 4), effectively doubling the RAM available per task (4GB).\n3. **High Concurrency / Partition Size:** If partitions are too large, they won't fit in execution memory. *Fix:* Increase `spark.sql.shuffle.partitions` (default is 200) to e.g., 1000, ensuring each task processes a much smaller chunk of data.",
                "complexity": "Complex",
                "qNo": 63
            },
            {
                "q": "Explain Spark's Unified Memory Management. What is the difference between Execution Memory and Storage Memory?",
                "a": "Spark's JVM heap is divided into distinct regions. The most critical is the Unified Memory region, which dynamically shares space between Execution and Storage.\n\n**Execution Memory:**\nUsed for short-lived data during computations (Shuffles, Joins, Sorts, Aggregations). If it runs out of space, it spills to the local disk, which severely impacts performance.\n\n**Storage Memory:**\nUsed for long-lived data that you explicitly cache/persist (e.g., `df.cache()`) or broadcast variables.\n\n**The Dynamic Boundary:**\nThey share a boundary. If Execution needs memory, it can evict cached blocks from Storage Memory (forcing them to disk or dropping them entirely). However, Storage Memory *cannot* evict Execution Memory, because dropping active computation data would crash the job. \n\n*5 YOE Insight:* If your Spark job is heavily caching DataFrames but suddenly starts running incredibly slowly during a complex join, it's because Execution memory stole the space and evicted your cache to disk.",
                "complexity": "Complex",
                "qNo": 64
            },
            {
                "q": "How does Adaptive Query Execution (AQE) dynamically handle Data Skew?",
                "a": "Data Skew occurs when one join key has millions of records while others have tens. Standard Spark maps the massive key to a single partition, crushing a single executor.\n\n**AQE Skew Join Optimization:**\nAQE inspects data statistics *at runtime* during the shuffle stage. If it detects a partition that is significantly larger than the median partition size (based on `spark.sql.adaptive.skewJoin.skewedPartitionFactor`), it intervenes:\n\n1. AQE dynamically splits the massive skewed partition into multiple smaller sub-partitions.\n2. It then replicates the corresponding matching key from the other table (the smaller table) to match these new sub-partitions.\n3. The join is then processed in parallel across multiple tasks, rather than bottlenecking on one executor. This entirely eliminates the need for manual 'Salting'.",
                "complexity": "Complex",
                "qNo": 65
            }
        ]
    },
    {
        "id": "architecture",
        "title": "Architecture & System Design",
        "questions": [
            {
                "q": "Explain CAP theorem and its relevance in distributed data systems.",
                "a": "The CAP theorem states that a distributed system can only guarantee two out of the following three properties simultaneously:\n\n1. **Consistency (C):** Every read receives the most recent write or an error. (All nodes see the same data).\n2. **Availability (A):** Every request receives a non-error response, without guaranteeing it contains the most recent write.\n3. **Partition Tolerance (P):** The system continues to operate despite network failures dropping messages between nodes.\n\n**Relevance:** Because network partitions (P) are inevitable in the cloud, databases must choose between C and A.\n- **CP Systems (HBase, MongoDB):** If a node fails, they shut down access to prevent reading stale data. Good for financial ledgers.\n- **AP Systems (Cassandra, DynamoDB):** If a node fails, they keep serving reads, even if the data might be slightly outdated (Eventual Consistency). Good for social media feeds or shopping carts.",
                "complexity": "Basic",
                "qNo": 66
            },
            {
                "q": "How would you design a real-time streaming system using Kafka?",
                "a": "A typical real-time architecture (Lambda or Kappa) involves:\n\n1. **Ingestion (Kafka):** Source systems (databases via CDC, application logs, IoT devices) publish events as messages to Kafka Topics. Kafka acts as a high-throughput, fault-tolerant message buffer.\n2. **Processing (Spark Structured Streaming / Flink):** Consumes messages from Kafka in real-time. Here we apply stateful transformations (e.g., tumbling windows), enrich the data by joining it with static dimension tables, and handle late-arriving data using Watermarks.\n3. **Storage (Data Lakehouse/NoSQL):** Processed streams are written to a low-latency NoSQL database (Cassandra/DynamoDB) for instant API serving, and simultaneously to a Delta Lake/Iceberg for historical batch analytics.\n4. **Serving:** Microservices or BI dashboards query the NoSQL/Lakehouse layer.",
                "complexity": "Intermediate",
                "qNo": 67
            },
            {
                "q": "What is Change Data Capture (CDC) and how do you implement it?",
                "a": "CDC is a design pattern used to track and capture row-level changes (Inserts, Updates, Deletes) in a source database so they can be replicated downstream in near real-time.\n\n**How to implement it:**\nInstead of doing heavy daily `SELECT *` batch loads, we use a tool like **Debezium**. Debezium reads the database's internal transaction log (e.g., MySQL's `binlog` or PostgreSQL's `WAL`). \nEvery time a row changes, Debezium streams that exact change event to an Apache Kafka topic. Downstream pipelines (like Spark) consume these events to apply the exact UPSERT/DELETE operations to the Data Warehouse (using Delta Lake/Hudi), keeping systems perfectly in sync with minimal overhead.",
                "complexity": "Intermediate",
                "qNo": 68
            },
            {
                "q": "How do you handle late-arriving data in streaming pipelines?",
                "a": "In distributed systems, an event generated at 12:00 PM might not reach the processing engine until 12:05 PM due to network lag. We handle this using **Event Time and Watermarks** in Spark/Flink.\n\n- **Event Time:** We group data based on the timestamp *inside* the payload (when it happened), not the Processing Time (when the server received it).\n- **Watermarks:** A threshold defining how long the system will wait for late data before finalizing a time window. If a watermark is set to 10 minutes, an event arriving 5 minutes late is included in its correct window. An event arriving 15 minutes late is dropped (or routed to a Dead Letter Queue) to prevent state memory from growing infinitely.",
                "complexity": "Complex",
                "qNo": 69
            }
        ]
    },
    {
        "id": "python",
        "title": "Python & Core CS",
        "questions": [
            {
                "q": "Explain Deep Copy vs. Shallow Copy.",
                "a": "In Python, assigning a list to a new variable just copies the *reference*, not the object.\n\n**Shallow Copy (`copy.copy()`)**: Creates a new object, but inserts *references* into it to the objects found in the original. If you have nested objects (like a list of lists), modifying a nested element in the copied list *will* affect the original list.\n\n**Deep Copy (`copy.deepcopy()`)**: Creates a new object and recursively inserts *copies* of the objects found in the original. Modifying anything in the deep copy (even nested elements) will completely leave the original intact.",
                "complexity": "Basic",
                "qNo": 70
            },
            {
                "q": "What are Python Decorators and how do they work?",
                "a": "A decorator is a design pattern in Python that allows you to add or modify the behavior of a function or class without permanently changing its source code. Functions are \"first-class citizens\" in Python, meaning they can be passed as arguments.\n\nA decorator is simply a function that takes another function as an argument, wraps it in an inner function to add behavior (like logging, timing, or authentication), and returns the new wrapped function.\n\n```python\ndef my_timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f\"Executed in {time.time() - start}s\")\n        return result\n    return wrapper\n\n@my_timer\ndef process_data():\n    pass # Function logic\n```",
                "complexity": "Intermediate",
                "qNo": 71
            },
            {
                "q": "What is the difference between Multithreading and Multiprocessing in Python?",
                "a": "**Multithreading:**\n- Uses multiple threads within a *single process*. They share the same memory space.\n- **The Catch:** Python has the GIL (Global Interpreter Lock), which prevents multiple threads from executing Python bytecode at the exact same time.\n- **Use Case:** Best for **I/O-bound tasks** (e.g., making API calls, downloading files, reading from disk) where the program spends most of its time waiting.\n\n**Multiprocessing:**\n- Spawns entirely new, independent Python *processes*. Each process has its own memory space and its own GIL.\n- **Use Case:** Best for **CPU-bound tasks** (e.g., heavy mathematical computations, image processing, massive data transformations) because it truly runs operations in parallel across multiple CPU cores.",
                "complexity": "Intermediate",
                "qNo": 72
            },
            {
                "q": "Generators vs. Lists. How would you process a 50GB CSV file in Python on a container with only 2GB of RAM?",
                "a": "If you attempt to load a 50GB CSV using `pandas.read_csv()` or `list.readlines()`, Python will load the entire file into memory at once. The container will instantly hit its 2GB limit and the OS will kill the process (OOMKilled).\n\n**The Solution: Generators**\nGenerators (`yield` keyword) utilize lazy evaluation. They maintain internal state and only yield one row (or chunk) into memory at a time, pausing execution until the next row is requested.\n\n```python\ndef read_large_file(file_path):\n    with open(file_path, 'r') as file:\n        for line in file:\n            yield process(line)\n\nfor processed_row in read_large_file('50gb_data.csv'):\n    write_to_db(processed_row)\n```\nThis reduces memory complexity from O(N) to O(1). The memory footprint remains in the megabytes regardless of whether the file is 5GB or 500GB.",
                "complexity": "Intermediate",
                "qNo": 73
            },
            {
                "q": "Deep Dive: Explain the Global Interpreter Lock (GIL). How does it dictate your choice between Multithreading and Multiprocessing for data pipelines?",
                "a": "The GIL is a mutex in CPython that ensures only one thread executes Python bytecode at any given moment. This makes CPython thread-safe but prevents true parallel execution on multi-core CPUs.\n\n**When to use Multithreading:**\nBest for **I/O Bound** tasks (e.g., fetching data from 100 API endpoints, downloading files from S3). When Thread A makes an HTTP request, it releases the GIL while waiting for the network response. Thread B can instantly acquire the GIL and send its own HTTP request. This provides massive speedups.\n\n**When to use Multiprocessing:**\nBest for **CPU Bound** tasks (e.g., heavy regex parsing, matrix multiplications, image transformations). Because of the GIL, multithreading CPU tasks will actually be *slower* due to context switching. Multiprocessing bypasses the GIL entirely by spawning completely independent Python processes, each with its own memory space and its own GIL, allowing true parallel utilization of all CPU cores.",
                "complexity": "Complex",
                "qNo": 74
            },
            {
                "q": "What is `__slots__` in Python, and how does it optimize memory for large datasets?",
                "a": "By default, every custom object in Python stores its instance attributes in a dynamic dictionary (`__dict__`). Dictionaries have significant memory overhead because they allocate extra space to allow dynamic attribute addition at runtime.\n\nIf you are instantiating 10 million `Row` objects in a memory-constrained environment, this `__dict__` overhead is catastrophic.\n\nBy explicitly defining `__slots__ = ['id', 'name', 'value']` inside your class, you tell Python *not* to use a dynamic dictionary. Instead, Python uses a fixed-size array in C to store the attributes. This prevents the dynamic addition of new attributes, but reduces the RAM usage of millions of objects by 40% to 50%, while also slightly speeding up attribute access.",
                "complexity": "Complex",
                "qNo": 75
            },
            {
                "q": "How do you optimize the memory usage of a massive Pandas DataFrame before attempting transformations?",
                "a": "Pandas notoriously defaults to heavy 64-bit data types. A 10GB dataset on disk can easily balloon to 30GB+ in Pandas RAM.\n\n**Optimization Strategies:**\n1. **Downcasting Numerics:** Pandas loads all integers as `int64` and floats as `float64`. If your integer column represents 'age' (0-100), you can safely downcast it to `int8`, reducing the memory footprint of that column by 87.5%.\n2. **Categorical Data Types:** If you have a string column with low cardinality (e.g., a 'Status' column with only 'Pending', 'Shipped', 'Delivered', but repeated 50 million times), Pandas stores 50 million full strings. Converting this to `.astype('category')` creates an internal mapping dictionary (0, 1, 2). It stores the lightweight integers instead of the heavy strings, drastically cutting memory usage and vastly accelerating group-by operations.\n3. **Chunking:** Use `pd.read_csv(chunksize=10000)` to process the data iteratively rather than loading it entirely into memory.",
                "complexity": "Intermediate",
                "qNo": 76
            }
        ]
    },
    {
        "id": "azure-adf",
        "title": "Azure & Data Factory",
        "questions": [
            {
                "q": "An ADF pipeline succeeds, but the target table contains 0 records. How would you troubleshoot it?",
                "a": "1. **Check Copy Activity Details:** Open the ADF monitoring view and click the \"spectacles\" icon on the Copy Activity. Check the `RowsRead` and `RowsCopied` metrics. If `RowsRead` is 0, the source query or dataset is empty.\n2. **Check Source Filters:** If the source is a SQL database, verify that the dynamic query (e.g., checking for new `last_modified_date`) isn't resolving to a future date or an incorrect timeframe.\n3. **Check File Paths:** If the source is ADLS/Blob Storage, ensure the parameterized file path or wildcard isn't pointing to an empty or incorrect directory.\n4. **Check Upsert/Sink Logic:** If using a Data Flow with an Alter Row transformation, ensure the logic isn't accidentally flagging all records as 'Delete' or 'Ignore'.",
                "complexity": "Intermediate",
                "qNo": 77
            },
            {
                "q": "How would you design an ADF pipeline that can restart from the failed point instead of processing everything again?",
                "a": "To achieve modularity and restartability (Idempotency):\n1. **Decouple Activities:** Break large pipelines down into smaller, atomic child pipelines using the `Execute Pipeline` activity.\n2. **State Tracking (Watermarking):** Create a control table in SQL Server that logs the status of each batch (`Batch_ID`, `Status=Running/Failed/Completed`). \n3. **Design for Idempotency:** Ensure sink activities can be rerun safely. For SQL, use `UPSERT` (Merge) instead of `INSERT` to avoid duplicates. For Data Lakes, use dynamic file names or overwrite specific partition folders.\n4. **Failure Routing:** If a child activity fails, use ADF's `On Failure` path to update the control table status to 'Failed'. On the next trigger, a Lookup activity checks the control table and only executes batches not marked as 'Completed'.",
                "complexity": "Complex",
                "qNo": 78
            }
        ]
    },
    {
        "id": "system-design-deep-dive",
        "title": "System Design (Deep Dives)",
        "questions": [
            {
                "q": "Design a real-time fraud detection pipeline for a global payment processor (e.g., Stripe/Visa). It processes 50,000 transactions/sec, must evaluate ML models and block fraud in <50ms, and simultaneously sync data to a warehouse for offline training.",
                "a": "This requires a highly decoupled, real-time event-driven architecture (Kappa or Lambda pattern) to handle the massive throughput and sub-50ms SLA.\n\n### 1. Ingestion Layer\n- **API Gateway -> Apache Kafka:** Incoming transactions hit the gateway and are published to a Kafka topic. \n- **Partitioning Strategy:** Partition by `Merchant_ID` or `User_ID` to ensure strict ordering of events per user and enable massive parallel consumption.\n\n### 2. Stream Processing (The 50ms SLA)\n- **Engine:** Use **Apache Flink** rather than Spark Streaming. Flink offers true event-by-event processing (microsecond latency) with advanced state management, whereas Spark uses micro-batching which struggles with strict sub-50ms SLAs.\n- **Feature Hydration:** Flink reads the raw transaction and queries a **Low-Latency Feature Store (Redis / ScyllaDB)** to pull historical aggregates (e.g., 'total spending in last 5 minutes', 'IP address risk score'). \n- **Inference:** Flink bundles the raw data and historical features, making a gRPC call to a served ML Model (e.g., via NVIDIA Triton or AWS SageMaker). Based on the score, Flink publishes a 'Block' or 'Allow' event to a downstream Kafka topic.\n\n### 3. State Management & Checkpointing\n- Flink maintains internal state (e.g., tumbling windows for 5-minute aggregates) using the **RocksDB State Backend**. It periodically checkpoints this state to S3/ADLS to ensure **Exactly-Once Processing** in case a worker node crashes.\n\n### 4. Offline Sync & Retraining\n- **Kafka Connect:** A sink connector asynchronously dumps the raw Kafka streams into an object store (S3) in Parquet format, orchestrated into an **Apache Iceberg or Delta Lake** table.\n- **Batch Jobs:** Daily Spark/dbt jobs compute complex features (e.g., '30-day average transaction value') and bulk-upsert them back into the Redis Feature Store for tomorrow's real-time inference.",
                "complexity": "Complex",
                "qNo": 79
            },
            {
                "q": "Design a Machine Learning Feature Store platform (like Uber's Michelangelo). It must serve real-time features for inference at <10ms, while ensuring 'Point-in-Time Correctness' for offline model training to prevent data leakage.",
                "a": "A Feature Store abstracts feature engineering from model deployment, providing a unified access layer for both training (offline) and inference (online).\n\n### 1. Dual-Storage Architecture\n- **Online Store (Redis / DynamoDB):** Optimized for low-latency row lookups by a primary key (e.g., `user_id = 123`). It stores *only the latest* feature values.\n- **Offline Store (Snowflake / Delta Lake):** Optimized for high-throughput batch scans. It acts as an append-only log, storing every historical change to a feature alongside a timestamp.\n\n### 2. Pipeline Design\n- **Batch Features:** Airflow schedules Spark jobs to compute heavy metrics (e.g., 'total rides last week'). It writes to the Offline Store, and a synchronization job (or reverse ETL) pushes the latest state to the Online Store.\n- **Streaming Features:** Flink consumes a Kafka event stream, calculates real-time windows (e.g., 'rides in last 5 mins'), and **dual-writes**: it updates the Online Store for instant serving and appends to the Offline Store for auditability.\n\n### 3. Solving Data Leakage (Point-in-Time Correctness)\n- **The Problem:** If a data scientist generates a training dataset for an event that happened at `t1`, but joins it with a feature value that was computed at `t2` (where `t2 > t1`), the model 'cheats' by looking into the future. This ruins production performance.\n- **The Solution:** The Feature Store API must perform an **AS OF Join** (Time-Travel Join). When constructing the training set, the offline store joins the label data with the feature data exactly as it existed immediately prior to the event timestamp, ignoring all newer rows.",
                "complexity": "Complex",
                "qNo": 80
            },
            {
                "q": "Design an Enterprise RAG (Retrieval-Augmented Generation) pipeline that ingests 10 million unstructured PDFs daily into a Vector Database to power a chatbot. How do you handle document updates, deletions, and embedding model versioning?",
                "a": "This is a specialized ELT pipeline designed for semantic search, heavily utilizing distributed processing to handle the massive compute required for embeddings.\n\n### 1. Ingestion & Change Data Tracking\n- **Event Triggers:** S3 object creation events or Confluence webhooks trigger an Airflow DAG or Kafka topic.\n- **Metadata State Table:** You must maintain a relational table (PostgreSQL) tracking `document_id`, `file_hash`, and `processing_status`. If a file is uploaded but its hash hasn't changed, the pipeline skips it, saving massive API costs.\n\n### 2. Processing (Chunking & Embedding)\n- **Engine:** Apache Spark (Databricks) or Ray.\n- **Chunking:** Unstructured text is extracted (via OCR/PyPDF) and split into semantic chunks (e.g., 512 tokens with a 50-token overlap). Overlaps prevent sentences from being cut in half, losing context.\n- **Embedding Generation:** Spark UDFs distribute API calls to the embedding model (e.g., OpenAI `text-embedding-3`). You must implement robust rate-limiting and exponential backoff to avoid HTTP 429 (Too Many Requests) errors.\n\n### 3. Managing Vector Database State (The 5 YOE Differentiator)\n- **Updates/Deletes:** Unlike relational databases, you cannot easily 'upsert' chunks if the chunk boundaries changed. If a PDF is updated, the pipeline must explicitly execute a `DELETE` query in the Vector DB (e.g., Milvus, Pinecone) using the metadata tag `document_id`, and then `INSERT` the newly generated chunks.\n- **Model Versioning:** If you upgrade your embedding model from v1 to v2, the dimensionality (e.g., 768 to 1536) and vector space completely change. You cannot mix them. You must create a *new collection* in the Vector DB, run a backfill batch job to re-embed all 10 million documents with v2, and then atomically hot-swap the chatbot's routing to the new collection.",
                "complexity": "Complex",
                "qNo": 81
            },
            {
                "q": "You have a monolithic MySQL database handling millions of e-commerce orders. Complex analytical queries are degrading production performance. Design a real-time CDC pipeline to replicate this to a Lakehouse. How do you handle schema evolution and deduplication?",
                "a": "A Change Data Capture (CDC) architecture decouples the analytical workload from the operational database with zero performance penalty.\n\n### 1. CDC Extraction\n- Deploy **Debezium**, which reads directly from MySQL's write-ahead log (`binlog`). Unlike JDBC polling (which executes `SELECT` statements and strains the DB), reading the binlog is virtually free. \n- Debezium translates every `INSERT`, `UPDATE`, and `DELETE` into an event payload and publishes it to Apache Kafka.\n\n### 2. Schema Evolution\n- Implement a **Schema Registry** (e.g., Confluent). \n- If a backend engineer runs an `ALTER TABLE` to add a new column in MySQL, Debezium detects the DDL change, registers the new Avro/Protobuf schema in the Registry, and the downstream consumers dynamically adapt to the new payload structure without breaking.\n\n### 3. Streaming Ingestion & Deduplication\n- **Engine:** Spark Structured Streaming or Flink consumes the Kafka topics.\n- **Lakehouse Merges:** Data is written to an **Apache Iceberg or Delta Lake** table. Because a single order might be updated 5 times in one minute (e.g., pending -> paid -> shipped), the streaming micro-batch must group by `order_id`, extract the row with the latest `updated_at` timestamp (or highest Kafka offset), and execute a `MERGE INTO` (Upsert) operation against the Lakehouse. This guarantees deduplication.\n\n### 4. Compaction (The Small Files Problem)\n- Real-time streaming creates thousands of tiny Parquet files on S3. Reading these is catastrophically slow due to I/O overhead.\n- **Solution:** Schedule an asynchronous background Airflow job to run `OPTIMIZE` and `ZORDER` (Delta Lake) or `RewriteDataFiles` (Iceberg). This compacts the tiny files into optimally sized ~1GB chunks, massively improving analytical read performance.",
                "complexity": "Complex",
                "qNo": 82
            },
            {
                "q": "Design a customer-facing analytics API (Serving Layer) that allows thousands of merchants to query their live sales dashboards. The raw data is billions of rows in Snowflake, but the dashboard must load in <500ms and support custom filtering.",
                "a": "Pointing a customer-facing API directly at a Data Warehouse (Snowflake/BigQuery) is a massive anti-pattern. They are designed for high-throughput, low-concurrency workloads and will suffer from queuing delays, high latency, and astronomical compute costs.\n\n### 1. The Pre-Aggregation Layer (Transformation)\n- Use **dbt** to build daily and hourly aggregate tables (e.g., `sales_by_merchant_day_product`) inside Snowflake. This reduces billions of raw rows down to millions of summarized rows.\n\n### 2. The Speed Layer (Real-Time OLAP)\n- Export the aggregated data from Snowflake and ingest it into a real-time analytical database engineered specifically for high-concurrency, sub-second latency. Standard choices are **Apache Druid, ClickHouse, or Apache Pinot**.\n- **Hybrid Ingestion:** \n  - *Historical Data:* Bulk-exported from Snowflake to S3, then loaded into ClickHouse.\n  - *Intra-day Data:* ClickHouse directly subscribes to the upstream Kafka sales topics, appending real-time events seamlessly alongside the historical batch data.\n\n### 3. The API Serving Layer\n- A lightweight Go or Node.js microservice receives the HTTP requests from the merchant dashboard.\n- It translates the user's dashboard filters (Date, Region, Product) into a highly optimized ClickHouse SQL query.\n- **Caching:** Implement a **Redis** caching layer in front of the API. When a merchant logs in, the dashboard typically queries the exact same default view ('This Month's Sales'). Caching this payload with a 5-minute TTL intercepts 80% of database hits, driving latency down to <10ms and protecting the database from traffic spikes.",
                "complexity": "Complex",
                "qNo": 83
            },
            {
                "q": "What are Data Contracts? How do they solve the 'silent schema change' problem between Software Engineers and Data Engineers?",
                "a": "The most common friction point in data pipelines is when upstream Software Engineers change a database schema (e.g., dropping a column, changing a status string from 'shipped' to 'Shipped') without telling the Data Team, instantly breaking downstream dashboards and ML models.\n\n**Data Contracts** solve this.\nA Data Contract is a formalized agreement (usually defined in YAML/JSON Schema) between data producers and data consumers. It defines the exact schema, data types, and semantic expectations of the data.\n\n**Enforcement:**\nThe contract is enforced in the CI/CD pipeline of the *Software Engineer's* application. If a software engineer tries to deploy a PR that renames the `user_id` column to `account_id`, the CI/CD pipeline runs a test against the Data Contract, fails the build, and prevents the code from reaching production. Producers become accountable for the data they emit.",
                "complexity": "Complex",
                "qNo": 84
            },
            {
                "q": "Lambda vs Kappa Architecture. Why is the industry slowly migrating toward Kappa?",
                "a": "**Lambda Architecture:**\nMaintains two entirely separate paths for data processing:\n1. A **Batch Layer** (e.g., Spark, Airflow) that processes massive historical data accurately (the source of truth).\n2. A **Speed Layer** (e.g., Flink, Kafka) that provides low-latency approximations for real-time dashboards.\n*The Problem:* You have to write, maintain, and debug two completely different codebases (e.g., SQL for batch, Java/Scala for streaming) that do the exact same logic. \n\n**Kappa Architecture:**\nEliminates the Batch layer entirely. **Everything is a stream.**\nData is ingested into a massively scalable messaging system with infinite retention (like Kafka or Apache Pulsar). Both real-time processing and historical backfills are executed by the exact same stream processing engine using the exact same codebase. You simply rewind the Kafka offset to the beginning of time to perform 'batch' reprocessing.",
                "complexity": "Intermediate",
                "qNo": 85
            }
        ]
    },
    {
        "id": "apache-airflow",
        "title": "Apache Airflow",
        "questions": [
            {
                "q": "Explain Airflow's Architecture. How do the Scheduler, Webserver, Executor, and Workers interact?",
                "a": "Airflow's architecture is deeply decoupled to scale horizontally:\n\n1. **Metadata Database (PostgreSQL/MySQL):** The source of truth. Stores DAG definitions, task states, XComs, and connection credentials.\n2. **Scheduler:** The brain. It continuously parses the DAG directory, checks the metadata DB for tasks whose dependencies are met, and sends them to the Executor.\n3. **Executor:** The message broker. It dictates *how* tasks run. It doesn't run code itself; it hands tasks to workers (e.g., pushing to a Redis/RabbitMQ queue for Celery, or calling the Kubernetes API).\n4. **Workers:** The actual compute nodes that pull tasks from the queue, execute the Python code, and report the status back to the Metadata DB.\n5. **Webserver:** The UI. It reads from the Metadata DB to display task states and logs. It does *not* interact directly with the Scheduler or Workers.",
                "complexity": "Intermediate",
                "qNo": 86
            },
            {
                "q": "Deep Dive: Celery Executor vs. Kubernetes Executor. When would you choose one over the other?",
                "a": "**Celery Executor:**\n- **How it works:** Uses a static pool of standing worker nodes reading from a message queue (Redis/RabbitMQ).\n- **Pros:** Ultra-low latency for task startup (workers are already warm). Great for high-throughput, short-lived tasks.\n- **Cons:** Dependency hell. Every worker must have all Python packages installed for *every* DAG. If DAG A needs Pandas 1.0 and DAG B needs Pandas 2.0, you have a conflict.\n\n**Kubernetes Executor:**\n- **How it works:** Spawns a brand new, isolated Kubernetes Pod for every single task. Once the task finishes, the Pod dies.\n- **Pros:** Perfect isolation. Each task can use a completely different Docker image (DAG A runs Python 3.8, DAG B runs Spark). Zero wasted compute when idle.\n- **Cons:** High latency. Spinning up a Pod takes 5-15 seconds. If you have thousands of 2-second tasks, the overhead is catastrophic.\n\n*5 YOE Verdict:* Modern stacks often use the **CeleryKubernetesExecutor** (hybrid) to route lightweight tasks to Celery and heavy/isolated tasks to Kubernetes.",
                "complexity": "Complex",
                "qNo": 87
            },
            {
                "q": "What are Deferrable Operators (Async Operators) and why are they critical for Airflow scalability?",
                "a": "Historically, if you used a `Sensor` to wait for a file in S3, that task occupied an entire Airflow Worker slot and just slept (`time.sleep()`). If you had 100 sensors waiting, your entire cluster would deadlock, unable to run real tasks.\n\n**Deferrable Operators** solve this. When an operator needs to wait, it suspends itself and hands execution over to a highly efficient centralized process called the **Triggerer** (built on Python `asyncio`). \n\nA single Triggerer process can efficiently monitor tens of thousands of asynchronous events concurrently. Once the condition is met (e.g., S3 file lands), the Triggerer wakes up the task and puts it back in the queue to finish executing on a standard worker. This frees up 99% of your worker compute resources.",
                "complexity": "Complex",
                "qNo": 88
            },
            {
                "q": "How do you handle data passing between tasks? What are the limits and dangers of XComs?",
                "a": "Tasks in Airflow are designed to be idempotent and distributed—they might run on completely different servers. \n\n**XComs (Cross-Communications):**\n- Allows tasks to push/pull small metadata (e.g., passing a generated `job_id` to the next task).\n- *The Danger:* XComs are serialized and stored directly in the Airflow Metadata Database. If you try to pass a 500MB Pandas DataFrame through XCom, you will instantly crash the Airflow PostgreSQL database.\n\n**Best Practice for Big Data:**\nAirflow is an orchestrator, not an execution engine. Task A should write the DataFrame to an object store (S3/GCS) and push the *URI string* (e.g., `s3://bucket/data_2026_01.csv`) to XCom. Task B pulls the URI from XCom and downloads the data itself.",
                "complexity": "Intermediate",
                "qNo": 89
            },
            {
                "q": "What is Idempotency in Data Engineering, and how do you ensure an Airflow DAG is idempotent?",
                "a": "An idempotent task produces the exact same final state regardless of whether it is run once, twice, or fifty times. This is the holy grail of data engineering because it allows you to hit 'Clear & Rerun' after a failure without corrupting data.\n\n**How to ensure idempotency:**\n1. **Never use `INSERT` blindly:** Use `MERGE` (Upsert) or `INSERT OVERWRITE` based on partitions. \n2. **Idempotent File Writes:** If writing to S3, overwrite the specific partition prefix (e.g., `/year=2026/month=01/`) rather than appending files dynamically.\n3. **Rely on Execution Dates:** Always use Airflow's logical date variables (`{{ ds }}` or `{{ data_interval_start }}`) in your queries instead of `CURRENT_DATE()`. If a DAG fails and you rerun it 3 days later, `CURRENT_DATE()` will fetch the wrong data, breaking idempotency. `{{ ds }}` will correctly simulate the past execution time.",
                "complexity": "Complex",
                "qNo": 90
            }
        ]
    }
];
