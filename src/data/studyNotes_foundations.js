export const foundationsNotes = [
  {
    id: "advanced-sql",
    title: "Advanced SQL",
    sections: [
      {
        id: "sql-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>Query Execution Engine:</strong>
              <ul>
                <li><span style='color:#6366f1'>Parser:</span> Checks syntax, validates schema (semantic analysis), and generates a parse tree.</li>
                <li><span style='color:#6366f1'>Optimizer:</span> Converts parse tree to physical execution plan. Uses Cost-Based Optimizer (CBO) evaluating CPU, I/O, and memory based on statistics. Evaluates join orders and index paths.</li>
                <li><span style='color:#6366f1'>Executor:</span> Runs the execution plan often using a Volcano model (pull-based, node-by-node) or vectorized execution.</li>
              </ul>
            </li>
            <li><strong>Storage Models:</strong>
              <br/>
              <table style="border-collapse:collapse; margin-top:8px; border:1px solid rgba(255,255,255,0.1)">
                <tr><th style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">Row-Oriented (OLTP)</th><th style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">Columnar (OLAP)</th></tr>
                <tr><td style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">Data stored contiguously by row (PostgreSQL, MySQL). Fast for single-record CRUD.</td><td style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">Data stored contiguously by column (Snowflake, BigQuery). Exceptional compression and aggregations.</td></tr>
              </table>
            </li>
            <li><strong>Index Structures:</strong>
              <ul>
                <li><span style='color:#6366f1'>B-Tree:</span> Balanced tree structure. O(log N) lookups, range scans, and sorting. Best for high-cardinality data.</li>
                <li><span style='color:#6366f1'>Hash:</span> O(1) exact match lookups. Cannot be used for range queries.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "sql-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Window Functions:</strong> Operate on a set of rows related to the current row without collapsing them (unlike GROUP BY).
              <ul>
                <li><span style='color:#6366f1'>Frame Specs:</span> Control the sliding window. Default is <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>. Be careful; if sorting, use <code>ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING</code>.</li>
              </ul>
            </li>
            <li><strong>Common Table Expressions (CTEs):</strong> Provide readability. Recursive CTEs are used for hierarchical data (graphs, org charts).
<pre><code>WITH RECURSIVE subordinates AS (
  SELECT id, manager_id, name, 1 as level FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.manager_id, e.name, s.level + 1
  FROM employees e JOIN subordinates s ON e.manager_id = s.id
)
SELECT * FROM subordinates;</code></pre>
            </li>
            <li><strong>Transactions & Isolation Levels:</strong>
              <ul>
                <li><span style='color:#6366f1'>READ UNCOMMITTED:</span> Dirty reads allowed.</li>
                <li><span style='color:#6366f1'>READ COMMITTED:</span> No dirty reads. Default in many RDBMS. Non-repeatable reads possible.</li>
                <li><span style='color:#6366f1'>REPEATABLE READ:</span> Prevents non-repeatable reads. Phantoms might occur (except in Postgres/InnoDB where MVCC handles it).</li>
                <li><span style='color:#6366f1'>SERIALIZABLE:</span> Strict serial execution. Prevents phantom reads. Highest locking overhead.</li>
              </ul>
            </li>
            <li><strong>MERGE / UPSERT:</strong> Standard <code>MERGE INTO</code> or <code>INSERT ... ON CONFLICT</code> handles inserting new records or updating existing ones in a single atomic operation.</li>
          </ul>
        `
      },
      {
        id: "sql-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "⚡",
        content: `
          <ul>
            <li><strong>Query Plan Analysis:</strong> Always use <code>EXPLAIN ANALYZE</code>. Look for <code>Seq Scan</code> (full table scan) on large tables, nested loop joins (if unindexed), and memory disk spillage (Sort/Hash spilling to disk).</li>
            <li><strong>Index Strategies:</strong>
              <ul>
                <li><span style='color:#6366f1'>Composite Indexes:</span> Order matters (Leftmost prefix rule). Index on <code>(A, B, C)</code> helps <code>A</code>, <code>A,B</code>, and <code>A,B,C</code> queries.</li>
                <li><span style='color:#6366f1'>Covering Indexes:</span> When an index contains all columns requested by the query, eliminating the need to fetch actual row data (Index Only Scan).</li>
                <li><span style='color:#6366f1'>Partial Indexes:</span> <code>CREATE INDEX idx_active ON users(id) WHERE status = 'active';</code></li>
              </ul>
            </li>
            <li><strong>Partition Pruning:</strong> Splitting huge tables by range (e.g., date) or list. Queries filtering on partition keys will automatically prune (skip) irrelevant partitions, vastly reducing I/O.</li>
            <li><strong>Statistics & Cardinality:</strong> If queries run slow suddenly, stats might be stale. Running <code>ANALYZE</code> (or <code>VACUUM ANALYZE</code> in Postgres) updates histograms used by the CBO.</li>
          </ul>
        `
      },
      {
        id: "sql-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🧩",
        content: `
          <ul>
            <li><strong>Top-N per Group:</strong> Use <code>ROW_NUMBER()</code> or <code>RANK()</code>.
<pre><code>SELECT * FROM (
  SELECT dept_id, emp_id, salary,
         RANK() OVER(PARTITION BY dept_id ORDER BY salary DESC) as rnk
  FROM employees
) WHERE rnk &lt;= 3;</code></pre>
            </li>
            <li><strong>Gap-and-Island:</strong> Identifying contiguous sequences. Assign a row number, then subtract from a sequence to find the invariant "island" identifier.</li>
            <li><strong>Running Totals:</strong> <code>SUM(value) OVER(ORDER BY date_col)</code>.</li>
            <li><strong>Self-Joins & Anti-Joins:</strong>
              <ul>
                <li><span style='color:#6366f1'>Self-Join:</span> Comparing rows within the same table (e.g., finding employees earning more than their managers).</li>
                <li><span style='color:#6366f1'>Anti-Join:</span> Finding missing data. Use <code>LEFT JOIN ... WHERE right.id IS NULL</code> or <code>NOT EXISTS</code>. Highly preferred over <code>NOT IN</code>.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "sql-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>NULL Handling:</strong>
              <ul>
                <li><code>NOT IN</code> fails completely if the subquery contains a single <code>NULL</code>. Always use <code>NOT EXISTS</code>.</li>
                <li><code>COUNT(column)</code> ignores NULLs, while <code>COUNT(*)</code> counts all rows.</li>
                <li>Comparisons with NULL yield UNKNOWN (e.g., <code>NULL = NULL</code> is false). Use <code>IS NULL</code>.</li>
              </ul>
            </li>
            <li><strong>GROUP BY with HAVING vs WHERE:</strong> <code>WHERE</code> filters rows <em>before</em> aggregation. <code>HAVING</code> filters <em>after</em> aggregation. Pushing filters to <code>WHERE</code> is much more performant.</li>
            <li><strong>Window Function Default Frame:</strong> If <code>ORDER BY</code> is present, the default frame is unbounded preceding to current row. This causes unintended running totals if you meant whole-partition aggregation.</li>
            <li><strong>Implicit Type Casting:</strong> Joining string to int columns bypasses indexes (causes full table scans).</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "python",
    title: "Python",
    sections: [
      {
        id: "py-architecture",
        title: "1. Architecture & Core Internals",
        icon: "🏗️",
        content: `
          <ul>
            <li><strong>CPython Internals:</strong>
              <ul>
                <li><span style='color:#6366f1'>Compilation:</span> Source code is compiled to bytecode (<code>.pyc</code>), which is then interpreted by the Python Virtual Machine (PVM), a stack-based machine.</li>
                <li><span style='color:#6366f1'>GIL (Global Interpreter Lock):</span> A mutex that prevents multiple native threads from executing Python bytecodes at once. CPU-bound multi-threading is ineffective in Python. I/O-bound multithreading works well because the GIL is released during I/O operations.</li>
              </ul>
            </li>
            <li><strong>Memory Management:</strong>
              <ul>
                <li><span style='color:#6366f1'>Reference Counting:</span> Primary memory management. An object is deallocated instantly when its refcount hits 0.</li>
                <li><span style='color:#6366f1'>Generational Garbage Collector:</span> Background process that detects and cleans up circular references (e.g., node A points to node B, and B to A) which reference counting misses.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "py-mechanics",
        title: "2. Key Mechanics & Features",
        icon: "⚙️",
        content: `
          <ul>
            <li><strong>Generators / Iterators:</strong> Memory-efficient way to process large datasets using <code>yield</code>. State is suspended and resumed.
<pre><code>def read_large_file(file_obj):
    for line in file_obj:
        yield line.strip()</code></pre>
            </li>
            <li><strong>Decorators:</strong> Higher-order functions that wrap other functions to modify behavior (e.g., timing, logging). Heavily uses closures.</li>
            <li><strong>Context Managers:</strong> <code>with</code> statement handles setup/teardown via <code>__enter__</code> and <code>__exit__</code> (crucial for file/DB connections).</li>
            <li><strong>Dataclasses & __slots__:</strong>
              <ul>
                <li><code>@dataclass</code> auto-generates boilerplate like <code>__init__</code>, <code>__repr__</code>, <code>__eq__</code>.</li>
                <li><code>__slots__ = ['x', 'y']</code> prevents dynamic dict creation per instance, saving massive memory in large collections of objects.</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "py-performance",
        title: "3. Performance Tuning & Optimization",
        icon: "⚡",
        content: `
          <ul>
            <li><strong>Concurrency Models:</strong>
              <br/>
              <table style="border-collapse:collapse; margin-top:8px; border:1px solid rgba(255,255,255,0.1)">
                <tr><th style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">Model</th><th style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">Use Case</th><th style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">GIL Impact</th></tr>
                <tr><td style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">Multiprocessing</td><td style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">CPU-bound tasks (math, ETL)</td><td style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">Bypasses GIL (creates new processes)</td></tr>
                <tr><td style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">Threading / Asyncio</td><td style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">I/O-bound tasks (network, disk)</td><td style="padding:8px 12px; border:1px solid rgba(255,255,255,0.1)">Subject to GIL, released on I/O wait</td></tr>
              </table>
            </li>
            <li><strong>Pandas Optimization:</strong> Use <code>pd.Categorical</code> for low-cardinality strings. Downcast numeric types (float64 -> float32). Process larger-than-RAM files using <code>chunksize</code>.</li>
            <li><strong>Cython/Numba:</strong> JIT compilation frameworks (Numba via LLVM) or C-extensions (Cython) to achieve C-like speeds for math-heavy Python loops.</li>
          </ul>
        `
      },
      {
        id: "py-patterns",
        title: "4. High-Frequency Interview Patterns",
        icon: "🧩",
        content: `
          <ul>
            <li><strong>Retry with Exponential Backoff:</strong> Critical for distributed systems API calls.
<pre><code>import time, random
def retry_backoff(func, retries=3, backoff_in_sec=1):
    for i in range(retries):
        try:
            return func()
        except Exception as e:
            if i == retries - 1: raise e
            sleep_time = (backoff_in_sec * 2 ** i) + random.uniform(0, 1)
            time.sleep(sleep_time)</code></pre>
            </li>
            <li><strong>API Pagination & Generators:</strong> Yielding results transparently from paginated endpoints without loading all pages into memory simultaneously.</li>
            <li><strong>Connection Pooling:</strong> Reusing DB connections rather than establishing new ones per request, typically handled via <code>sqlalchemy</code> or <code>psycopg2</code> pools.</li>
          </ul>
        `
      },
      {
        id: "py-traps",
        title: "5. Critical Interview Traps & Edge Cases",
        icon: "⚠️",
        content: `
          <ul>
            <li><strong>Mutable Default Arguments:</strong> <code>def foo(arr=[])</code> evaluates the default <em>once</em> at parse time. Subsequent calls mutate the same list. Use <code>arr=None</code> and instantiate inside.</li>
            <li><strong>Late Binding Closures:</strong> Loop variables in lambdas bind to the last value of the loop. Fix by passing as default arg: <code>lambda x=x: x</code>.</li>
            <li><strong>Deep vs Shallow Copy:</strong>
              <ul>
                <li><code>copy()</code> creates a new object but inserts references to the original nested objects.</li>
                <li><code>deepcopy()</code> recursively copies all nested structures.</li>
              </ul>
            </li>
            <li><strong>is vs == :</strong> <code>==</code> checks value equality (calls <code>__eq__</code>), <code>is</code> checks identity (memory address). String & small integer interning (-5 to 256) can make <code>is</code> behave confusingly if not understood.</li>
            <li><strong>Float Precision:</strong> <code>0.1 + 0.2 == 0.3</code> is <code>False</code>. Use the <code>decimal</code> module or <code>math.isclose()</code> for monetary/precise values.</li>
          </ul>
        `
      }
    ]
  }
];
