// Auto-generated module: advancedSql
// Primary questions count: 16

export const advancedSqlQuestions = [
  {
    "id": "sql-delete-duplicates",
    "qNo": 1,
    "q": "How do you delete duplicate records from a table while keeping the original record intact?",
    "a": "There are multiple ways to handle duplicate deletion depending on your database engine. Understanding the performance tradeoff is key.\n\n**1. Using ROW_NUMBER() (Standard & Most Robust):**\nAssign a sequential integer to each row partitioned by the duplicate-defining columns. Keep the row where the number is 1 and delete the rest. This requires a full table scan and sort, but works universally.\n\n```sql\nWITH CTE AS (\n    SELECT *, \n           ROW_NUMBER() OVER(PARTITION BY model_name, brand ORDER BY model_id) as rn\n    FROM cars\n)\nDELETE FROM cars \nWHERE model_id IN (SELECT model_id FROM CTE WHERE rn > 1);\n```\n\n**2. Using CTID / ROWID (PostgreSQL / Oracle specific):**\n`ctid` (or `ROWID`) represents the physical location of the row on disk. You can efficiently keep the row with the maximum physical ID without needing window functions.\n```sql\nDELETE FROM cars\nWHERE ctid NOT IN (\n    SELECT max(ctid) FROM cars GROUP BY model_name, brand\n);\n```",
    "complexity": "Basic",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "duplicates",
      "row-number",
      "ctid",
      "window-functions",
      "query-optimization"
    ],
    "codeSnippet": "WITH CTE AS (\n    SELECT *, ROW_NUMBER() OVER(PARTITION BY model_name, brand ORDER BY model_id) as rn\n    FROM cars\n)\nDELETE FROM cars WHERE model_id IN (SELECT model_id FROM CTE WHERE rn > 1);"
  },
  {
    "id": "sql-highest-lowest-salary-window",
    "qNo": 2,
    "q": "How do you find the highest and lowest salary in each department, while simultaneously displaying those values next to every individual employee record?",
    "a": "You can achieve this using Window Functions. \n\n**1. Using MIN() and MAX() OVER() (Most Efficient):**\nThis allows you to aggregate data without collapsing the rows like a traditional `GROUP BY` would.\n```sql\nSELECT \n    id, name, dept, salary,\n    MAX(salary) OVER(PARTITION BY dept) AS highest_sal,\n    MIN(salary) OVER(PARTITION BY dept) AS lowest_sal\nFROM employee;\n```\n\n**2. Alternative using FIRST_VALUE and LAST_VALUE:**\nWhile MIN/MAX are easier, interviewers often ask for `FIRST_VALUE`. Note the use of the `ROWS BETWEEN` framing clause to ensure `LAST_VALUE` doesn't stop at the current row.\n```sql\nSELECT \n    id, name, dept, salary,\n    FIRST_VALUE(salary) OVER(PARTITION BY dept ORDER BY salary DESC) as highest_sal,\n    LAST_VALUE(salary) OVER(PARTITION BY dept ORDER BY salary DESC \n        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as lowest_sal\nFROM employee;\n```",
    "complexity": "Basic",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "window-functions",
      "first-value",
      "last-value",
      "min-max-over",
      "framing"
    ],
    "codeSnippet": "SELECT id, name, dept, salary,\n    MAX(salary) OVER(PARTITION BY dept) AS highest_sal,\n    MIN(salary) OVER(PARTITION BY dept) AS lowest_sal\nFROM employee;"
  },
  {
    "id": "sql-cumulative-distance-lag",
    "qNo": 3,
    "q": "Given a table tracking the 'cumulative distance' travelled by cars per day, write a query to extract the exact distance travelled on each specific day.",
    "a": "You can use the `LAG()` window function to peek at the previous day's cumulative distance and subtract it from the current day's cumulative distance.\n\n```sql\nSELECT \n    cars, \n    days, \n    cumulative_distance,\n    cumulative_distance - LAG(cumulative_distance, 1, 0) \n        OVER(PARTITION BY cars ORDER BY days) AS actual_distance\nFROM car_travels;\n```\n*Note: `LAG(col, offset, default)` is utilized here. We pass `0` as the default value so the calculation for the very first day correctly evaluates to the current cumulative distance instead of `NULL`.*",
    "complexity": "Basic",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "lag",
      "window-functions",
      "cumulative-metrics",
      "offset"
    ],
    "codeSnippet": "SELECT cars, days, cumulative_distance,\n    cumulative_distance - LAG(cumulative_distance, 1, 0) \n        OVER(PARTITION BY cars ORDER BY days) AS actual_distance\nFROM car_travels;"
  },
  {
    "id": "sql-rank-dense-rank-row-number",
    "qNo": 4,
    "q": "Explain the differences between the Window Functions: Rank vs Dense_Rank vs Row_Number.",
    "a": "Window functions perform calculations across a set of table rows related to the current row, without collapsing them (unlike `GROUP BY`).\n\nImagine ranking a list of salaries: [100k, 100k, 90k, 80k]\n- **ROW_NUMBER():** Gives a strictly unique sequential integer, regardless of ties. \n  *Result: 1, 2, 3, 4*\n- **RANK():** Gives the same rank for ties, but skips subsequent ranks proportionally.\n  *Result: 1, 1, 3, 4 (Notice rank 2 is skipped)*\n- **DENSE_RANK():** Gives the same rank for ties, and does NOT skip subsequent ranks.\n  *Result: 1, 1, 2, 3*",
    "complexity": "Basic",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "rank",
      "dense-rank",
      "row-number",
      "window-functions",
      "tie-breaking"
    ],
    "codeSnippet": "SELECT salary,\n    ROW_NUMBER() OVER(ORDER BY salary DESC) as row_num,\n    RANK() OVER(ORDER BY salary DESC) as rnk,\n    DENSE_RANK() OVER(ORDER BY salary DESC) as dense_rnk\nFROM employees;"
  },
  {
    "id": "sql-oltp-vs-olap",
    "qNo": 5,
    "q": "What is the architectural difference between OLTP and OLAP systems?",
    "a": "**OLTP (Online Transaction Processing):**\n- **Purpose:** Day-to-day operations and high-volume, fast transactions (Inserts/Updates/Deletes).\n- **Design:** Highly normalized (3NF) to prevent data redundancy and ensure ACID compliance. Queries usually return a few specific records.\n- **Examples:** Banking core systems, E-commerce checkout, MySQL, PostgreSQL.\n\n**OLAP (Online Analytical Processing):**\n- **Purpose:** Complex queries, analytics, and business intelligence. Optimized for reading massive amounts of historical data.\n- **Design:** Denormalized (Star or Snowflake schemas) to reduce expensive table joins. Data is heavily indexed and partitioned.\n- **Examples:** Data Warehouses (Snowflake, BigQuery, Redshift).",
    "complexity": "Basic",
    "topics": [
      "advanced-sql",
      "distributed-systems",
      "data-modeling"
    ],
    "tags": [
      "oltp",
      "olap",
      "architecture",
      "normalization",
      "denormalization",
      "star-schema"
    ],
    "codeSnippet": "-- OLTP: Normalized (3NF) fast updates\n-- OLAP: Denormalized columnar storage for aggregations"
  },
  {
    "id": "sql-bidirectional-routes-dedup",
    "qNo": 6,
    "q": "Given a table of bidirectional travel routes (e.g., Bangalore to Hyderabad, Hyderabad to Bangalore), how do you return a deduplicated list of unique routes irrespective of the travel direction?",
    "a": "There are two ways to solve this. Using standard aggregation is generally the most efficient.\n\n**1. Using LEAST() and GREATEST() (Most Efficient):**\nThese scalar functions evaluate multiple columns in a single row and return the smallest/largest value. By forcing the alphabetically smaller city to always be the 'source', natural duplicates are created which are easily removed using `DISTINCT`. This avoids expensive joins.\n```sql\nSELECT DISTINCT \n    LEAST(source, destination) AS source,\n    GREATEST(source, destination) AS destination,\n    distance\nFROM src_dest_distance;\n```\n\n**2. Using a Self-Join & ROW_NUMBER:**\nWhile functional, this requires assigning row numbers and joining the table back to itself to filter out the reversed pair. It requires more compute overhead than the scalar function approach.",
    "complexity": "Intermediate",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "least-greatest",
      "deduplication",
      "self-join",
      "routes"
    ],
    "codeSnippet": "SELECT DISTINCT \n    LEAST(source, destination) AS source,\n    GREATEST(source, destination) AS destination,\n    distance\nFROM src_dest_distance;"
  },
  {
    "id": "sql-round-robin-tournament-self-join",
    "qNo": 7,
    "q": "Write a SQL query such that each team plays a match with every other team exactly once. Then, write a query where they play each other twice.",
    "a": "This requires joining a table to itself (Self Join) using inequality operators.\n\n**Play JUST ONCE:**\nUse the `<` (or `>`) operator. This ensures 'Team A vs Team B' is selected, but filters out 'Team B vs Team A', and 'Team A vs Team A'.\n```sql\nSELECT t1.team_name AS team, t2.team_name AS opponent\nFROM teams t1\nJOIN teams t2 ON t1.team_name < t2.team_name;\n```\n\n**Play TWICE (Home & Away):**\nUse the `<>` (not equal) operator. This ensures Team A plays Team B, and Team B plays Team A, but ensures a team doesn't play itself.\n```sql\nSELECT t1.team_name AS team, t2.team_name AS opponent\nFROM teams t1\nJOIN teams t2 ON t1.team_name <> t2.team_name;\n```",
    "complexity": "Intermediate",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "self-join",
      "inequality-join",
      "combinatorics",
      "cross-join"
    ],
    "codeSnippet": "SELECT t1.team_name AS team, t2.team_name AS opponent\nFROM teams t1\nJOIN teams t2 ON t1.team_name < t2.team_name;"
  },
  {
    "id": "sql-pivot-rows-to-columns",
    "qNo": 8,
    "q": "How do you Pivot row-level data into columns? (e.g., Transforming a single 'month' column with 12 rows into 12 separate columns for each month)",
    "a": "While some databases like Oracle or SQL Server have a dedicated `PIVOT` keyword, the most universally standard and robust approach (which works across PostgreSQL, MySQL, BigQuery, Spark) is using Conditional Aggregation (`SUM` + `CASE WHEN`).\n\n```sql\nSELECT customer_id,\n    SUM(CASE WHEN order_month = 'Jan-21' THEN amount ELSE 0 END) AS \"Jan-21\",\n    SUM(CASE WHEN order_month = 'Feb-21' THEN amount ELSE 0 END) AS \"Feb-21\"\n    -- Add remaining months...\nFROM sales_data\nGROUP BY customer_id;\n```",
    "complexity": "Intermediate",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "pivot",
      "conditional-aggregation",
      "case-when",
      "crosstab"
    ],
    "codeSnippet": "SELECT customer_id,\n    SUM(CASE WHEN order_month = 'Jan-21' THEN amount ELSE 0 END) AS \"Jan-21\",\n    SUM(CASE WHEN order_month = 'Feb-21' THEN amount ELSE 0 END) AS \"Feb-21\"\nFROM sales_data GROUP BY customer_id;"
  },
  {
    "id": "sql-monthly-sales-difference-cte",
    "qNo": 9,
    "q": "Write a query to calculate the difference in average sales for each month between the years 2003 and 2004.",
    "a": "You can isolate the aggregations for each year using a Common Table Expression (CTE) and then self-join them on the month. This ensures you are calculating aggregates before joining, which prevents Cartesian explosions.\n\n```sql\nWITH MonthlySales AS (\n    SELECT \n        EXTRACT(YEAR FROM order_date) AS order_year, \n        EXTRACT(MONTH FROM order_date) AS order_month, \n        AVG(sales) AS avg_sales\n    FROM sales_order\n    WHERE EXTRACT(YEAR FROM order_date) IN (2003, 2004)\n    GROUP BY 1, 2\n)\nSELECT \n    y03.order_month,\n    ROUND(ABS(y03.avg_sales - y04.avg_sales), 2) AS diff\nFROM MonthlySales y03\nJOIN MonthlySales y04 ON y03.order_month = y04.order_month\nWHERE y03.order_year = 2003 AND y04.order_year = 2004\nORDER BY y03.order_month;\n```",
    "complexity": "Intermediate",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "ctes",
      "self-join",
      "date-functions",
      "aggregations",
      "year-over-year"
    ],
    "codeSnippet": "WITH MonthlySales AS (\n    SELECT EXTRACT(YEAR FROM order_date) AS order_year, \n           EXTRACT(MONTH FROM order_date) AS order_month, \n           AVG(sales) AS avg_sales\n    FROM sales_order WHERE EXTRACT(YEAR FROM order_date) IN (2003, 2004)\n    GROUP BY 1, 2\n)\nSELECT y03.order_month, ROUND(ABS(y03.avg_sales - y04.avg_sales), 2) AS diff\nFROM MonthlySales y03 JOIN MonthlySales y04 ON y03.order_month = y04.order_month\nWHERE y03.order_year = 2003 AND y04.order_year = 2004;"
  },
  {
    "id": "sql-order-batch-status-aggregation",
    "qNo": 10,
    "q": "Suppose a pizza company tracks individual pizzas ordered by customers. A single customer can place multiple orders at once, and each individual order has a status of 'CREATED', 'SUBMITTED', or 'DELIVERED'. Write a query to determine the final overall status of each customer's complete batch based on the following rules:\n1) If ALL orders are DELIVERED -> 'COMPLETED'.\n2) If SOME (but not all) are DELIVERED -> 'IN PROGRESS'.\n3) If ALL are SUBMITTED -> 'AWAITING PROGRESS'.\n4) Otherwise -> 'AWAITING SUBMISSION'.",
    "a": "There are two main ways to solve this. Conditional Aggregation is generally preferred for performance.\n\n**1. Conditional Aggregation (Most Efficient - O(N)):**\nWe group by the customer and calculate the occurrences of each status using `SUM(CASE...)` compared to the `COUNT(*)` of total orders. This requires only a **single pass** over the table, making it highly optimized.\n```sql\nSELECT cust_name AS customer_name,\n    CASE \n        WHEN SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) = COUNT(*) \n            THEN 'COMPLETED'\n        WHEN SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) > 0 \n            THEN 'IN PROGRESS'\n        WHEN SUM(CASE WHEN status = 'SUBMITTED' THEN 1 ELSE 0 END) = COUNT(*) \n            THEN 'AWAITING PROGRESS'\n        ELSE 'AWAITING SUBMISSION'\n    END AS final_status\nFROM cust_orders\nGROUP BY cust_name;\n```\n\n**2. Correlated Subqueries (Using NOT EXISTS):**\nThis approach checks for the existence of conflicting statuses. While logically readable, it can be slower on massive tables because the database engine may have to execute the subquery multiple times per customer record.\n```sql\nSELECT DISTINCT cust_name, 'COMPLETED' as status \nFROM cust_orders c1\nWHERE status = 'DELIVERED' \nAND NOT EXISTS (SELECT 1 FROM cust_orders c2 WHERE c1.cust_name = c2.cust_name AND status != 'DELIVERED')\n-- (UNION other statuses...)\n```",
    "complexity": "Intermediate",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "conditional-aggregation",
      "case-when",
      "correlated-subqueries",
      "business-logic"
    ],
    "codeSnippet": "SELECT cust_name AS customer_name,\n    CASE \n        WHEN SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) = COUNT(*) THEN 'COMPLETED'\n        WHEN SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) > 0 THEN 'IN PROGRESS'\n        WHEN SUM(CASE WHEN status = 'SUBMITTED' THEN 1 ELSE 0 END) = COUNT(*) THEN 'AWAITING PROGRESS'\n        ELSE 'AWAITING SUBMISSION'\n    END AS final_status\nFROM cust_orders GROUP BY cust_name;"
  },
  {
    "id": "sql-consecutive-numbers-lead-lag",
    "qNo": 11,
    "q": "Write a query to identify numbers appearing three times consecutively in a table.",
    "a": "There are two approaches: using a Self-Join or using Window Functions. The Window Function approach is significantly faster.\n\n**1. Using LEAD and LAG (Most Efficient):**\nThis approach scans the table only once. We peek at the adjacent rows (`LEAD` looks forward, `LAG` looks backwards) based on the ID sorting.\n```sql\nWITH NumberSequences AS (\n    SELECT \n        id, \n        num,\n        LAG(num) OVER (ORDER BY id) as prev_num,\n        LEAD(num) OVER (ORDER BY id) as next_num\n    FROM Logs\n)\nSELECT DISTINCT num AS ConsecutiveNums\nFROM NumberSequences\nWHERE num = prev_num AND num = next_num;\n```\n\n**2. Using a 3-way Self-Join (Less Efficient):**\n```sql\nSELECT DISTINCT l1.num \nFROM Logs l1, Logs l2, Logs l3\nWHERE l1.id = l2.id - 1 AND l2.id = l3.id - 1\nAND l1.num = l2.num AND l2.num = l3.num;\n```\n*Why it's worse:* This requires the database engine to perform a Cartesian join on the table against itself three times, resulting in exponential computational overhead on large datasets.",
    "complexity": "Intermediate",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "lead",
      "lag",
      "consecutive-values",
      "window-functions",
      "gaps-and-islands"
    ],
    "codeSnippet": "WITH NumberSequences AS (\n    SELECT id, num, LAG(num) OVER (ORDER BY id) as prev_num, LEAD(num) OVER (ORDER BY id) as next_num\n    FROM Logs\n)\nSELECT DISTINCT num AS ConsecutiveNums FROM NumberSequences WHERE num = prev_num AND num = next_num;"
  },
  {
    "id": "sql-recursive-cte-ungroup-items",
    "qNo": 12,
    "q": "How do you completely 'Ungroup' aggregated data? (e.g., turning one row '{item: Apple, count: 4}' into four separate '{item: Apple}' rows)",
    "a": "You can achieve this using a **Recursive Common Table Expression (CTE)** to dynamically generate rows iteratively by decrementing the count column until it hits 1.\n\n```sql\nWITH RECURSIVE UngroupedItems AS (\n    -- Base Case: Start with the given item and its original count\n    SELECT id, item_name, total_count, 1 as level\n    FROM travel_items\n    \n    UNION ALL\n    \n    -- Recursive Step: Join against itself, decrementing the count by 1\n    SELECT u.id, u.item_name, u.total_count - 1, u.level + 1\n    FROM UngroupedItems u\n    JOIN travel_items t ON t.id = u.id\n    WHERE u.total_count > 1 -- Stop condition\n)\nSELECT id, item_name \nFROM UngroupedItems\nORDER BY id;\n```",
    "complexity": "Complex",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "recursive-cte",
      "data-transformation",
      "unnest",
      "row-generation"
    ],
    "codeSnippet": "WITH RECURSIVE UngroupedItems AS (\n    SELECT id, item_name, total_count, 1 as level FROM travel_items\n    UNION ALL\n    SELECT u.id, u.item_name, u.total_count - 1, u.level + 1\n    FROM UngroupedItems u JOIN travel_items t ON t.id = u.id WHERE u.total_count > 1\n)\nSELECT id, item_name FROM UngroupedItems ORDER BY id;"
  },
  {
    "id": "sql-recursive-cte-org-hierarchy",
    "qNo": 13,
    "q": "Write a query to find the entire reporting hierarchy of employees under a specific manager (e.g., 'Asha').",
    "a": "Hierarchical data modeling (like org charts or bill-of-materials) is the classic use case for **Recursive CTEs**. You start with the base anchor (the manager) and recursively join the table on `employee.manager_id = recursive_cte.employee_id` to traverse downwards.\n\n```sql\nWITH RECURSIVE HierarchyCTE AS (\n    -- Anchor member: Select the target manager\n    SELECT id, name, manager_id, designation, 1 as level\n    FROM emp_details \n    WHERE name = 'Asha'\n    \n    UNION ALL\n    \n    -- Recursive member: Find employees whose manager is in the CTE (traversing down)\n    SELECT e.id, e.name, e.manager_id, e.designation, h.level + 1\n    FROM emp_details e\n    JOIN HierarchyCTE h ON e.manager_id = h.id\n)\nSELECT * FROM HierarchyCTE;\n```",
    "complexity": "Complex",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "recursive-cte",
      "hierarchical-data",
      "graph-traversal",
      "org-chart"
    ],
    "codeSnippet": "WITH RECURSIVE HierarchyCTE AS (\n    SELECT id, name, manager_id, designation, 1 as level FROM emp_details WHERE name = 'Asha'\n    UNION ALL\n    SELECT e.id, e.name, e.manager_id, e.designation, h.level + 1\n    FROM emp_details e JOIN HierarchyCTE h ON e.manager_id = h.id\n)\nSELECT * FROM HierarchyCTE;"
  },
  {
    "id": "sql-cte-vs-temp-table-performance",
    "qNo": 14,
    "q": "Deep Dive: CTEs (Common Table Expressions) vs. Temporary Tables. What is the performance difference and when do you use each?",
    "a": "**CTE (`WITH` clause):**\n- **How it works:** A CTE is generally evaluated as an inline view. It does *not* store data physically. In many databases (like PostgreSQL), if you reference the same CTE three times in your main query, the database engine will re-calculate the CTE three separate times.\n- **Use Case:** Great for readability, recursive queries (hierarchies), and organizing complex logic into manageable steps.\n\n**Temporary Table (`CREATE TEMP TABLE`):**\n- **How it works:** A Temp Table physically materializes the data into disk/memory for the duration of the session. You can build indexes on it.\n- **Use Case:** Crucial for massive datasets where you need to reference the intermediate result multiple times. By materializing it once, you pay the compute cost once. If a CTE takes 5 minutes to run and you reference it 4 times, the query takes 20 minutes. A Temp table runs in 5 minutes, and subsequent reads take milliseconds.",
    "complexity": "Complex",
    "topics": [
      "advanced-sql",
      "bigquery"
    ],
    "tags": [
      "ctes",
      "temp-tables",
      "query-optimization",
      "materialization",
      "spilling"
    ],
    "codeSnippet": "-- CTE: Inline view evaluated per reference\n-- Temp Table: Physically materialized in tempdb with index support"
  },
  {
    "id": "sql-btree-vs-columnar-storage",
    "qNo": 15,
    "q": "Explain B-Tree Indexes vs Columnar Storage formats (like Parquet). Why are B-Trees highly inefficient for OLAP Data Warehouses?",
    "a": "**B-Tree (Row-Based OLTP):**\n- The default index in MySQL/PostgreSQL. It organizes row locators in a balanced tree. \n- **Why it's bad for OLAP:** B-Trees are optimized for 'needle in a haystack' point lookups (e.g., `SELECT * WHERE user_id = 123`). In OLAP, you rarely fetch one row. You run aggregates on millions of rows (`SUM(revenue) GROUP BY month`). A B-Tree forces the engine to read the entire row (all columns) from disk just to get the revenue value, resulting in massive wasted I/O.\n\n**Columnar Storage (OLAP):**\n- Stores values column-by-column contiguously on disk. \n- **Why it's great for OLAP:** If you run `SUM(revenue)`, the engine only reads the contiguous 'revenue' data blocks from disk, completely ignoring the other 100 columns. Furthermore, because column values are highly similar (e.g., millions of repeated 'USD' currency codes), columnar storage compresses beautifully (Snappy, Zstd), drastically reducing disk I/O.",
    "complexity": "Complex",
    "topics": [
      "advanced-sql",
      "hadoop-hive",
      "pyspark",
      "bigquery"
    ],
    "tags": [
      "b-tree",
      "columnar-storage",
      "parquet",
      "indexing",
      "file-formats",
      "olap",
      "io-optimization"
    ],
    "codeSnippet": "-- B-Tree: Row-oriented point lookups (OLTP)\n-- Columnar (Parquet/ORC): Vectorized column projection & Snappy compression (OLAP)"
  },
  {
    "id": "sql-explain-plan-bottlenecks",
    "qNo": 16,
    "q": "How do you analyze a Query Execution Plan (`EXPLAIN`)? What specific bottlenecks are you looking for?",
    "a": "An execution plan is the physical strategy the database optimizer chooses to execute your query.\n\n**Red Flags to look for:**\n1. **Sequential Scans / Full Table Scans:** The engine is reading every single row in the table because it couldn't find an index or partition to prune data. Fine for tiny tables, disastrous for billion-row fact tables.\n2. **Nested Loop Joins on large datasets:** Nested Loops iterate over every row in Table A and search for a match in Table B (O(N*M) complexity). Excellent for joining a 10-row table, but if you see a Nested Loop between two 1M-row tables, the query will hang forever. The optimizer should be using a **Hash Join** or **Sort-Merge Join** instead.\n3. **Hash Aggregates spilling to disk:** If your `GROUP BY` has too many high-cardinality groups, the hash table won't fit in memory and will spill to temp disk space, slowing performance to a crawl.",
    "complexity": "Complex",
    "topics": [
      "advanced-sql",
      "bigquery",
      "distributed-systems"
    ],
    "tags": [
      "explain-plan",
      "query-optimization",
      "hash-join",
      "nested-loops",
      "indexing",
      "full-table-scan"
    ],
    "codeSnippet": "EXPLAIN ANALYZE SELECT c.customer_name, SUM(o.total_amount)\nFROM customers c JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.order_date >= '2023-01-01' GROUP BY c.customer_name;"
  },
  {
    "id": "sql-pairwise-highest-lowest-cross-join",
    "qNo": 142,
    "q": "SQL Pairwise Ranking: Given a table of products and prices, write a query to generate all unique pairs displaying the highest and lowest priced item in each pair.",
    "a": "This is a classic query interview problem (asked at top financial institutions like Standard Chartered) testing self-joins, Cartesian products, and conditional logic.\n\n### Problem Statement\nInput Table A:\n```text\nproduct  | price\nlaptop   | 1500\nkeyboard | 1000\nmouse    | 500\n```\nExpected Output:\n```text\nhighest  | lowest\nlaptop   | keyboard\nlaptop   | mouse\nkeyboard | mouse\n```\n\n### Solution 1: CROSS JOIN with CASE Expressions & Inequality Filtering\n```sql\nSELECT\n    CASE\n        WHEN a1.price > a2.price THEN a1.product\n        ELSE a2.product\n    END AS highest,\n    CASE\n        WHEN a1.price < a2.price THEN a1.product\n        ELSE a2.product\n    END AS lowest\nFROM A AS a1\nCROSS JOIN A AS a2\nWHERE a1.product <> a2.product\n  AND a1.price > a2.price; -- Filters out duplicate inverted pairs (e.g. keyboard/laptop)\n```\n\n### Solution 2: Direct Theta Self-Join (Most Performant)\n```sql\nSELECT\n    a1.product AS highest,\n    a2.product AS lowest\nFROM A AS a1\nJOIN A AS a2 ON a1.price > a2.price;\n```\n*Why Solution 2 is preferred by optimizers:* By expressing the condition `ON a1.price > a2.price` directly in the join condition, the query optimizer avoids generating the full N*N Cartesian product in memory, directly streaming matching ordered pairs without post-filtering.",
    "complexity": "Intermediate",
    "topics": [
      "advanced-sql"
    ],
    "tags": [
      "cross-join",
      "self-join",
      "case-when",
      "pairwise-comparison",
      "ranking"
    ],
    "codeSnippet": "SELECT\n    CASE WHEN a1.price > a2.price THEN a1.product ELSE a2.product END AS highest,\n    CASE WHEN a1.price < a2.price THEN a1.product ELSE a2.product END AS lowest\nFROM A AS a1 CROSS JOIN A AS a2\nWHERE a1.product <> a2.product AND a1.price > a2.price;"
  }
];
