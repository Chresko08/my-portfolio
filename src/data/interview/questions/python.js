// Auto-generated module: python
// Primary questions count: 8

export const pythonQuestions = [
  {
    "id": "py-deep-copy-vs-shallow-copy",
    "qNo": 70,
    "q": "Explain Deep Copy vs. Shallow Copy.",
    "a": "In Python, assigning a list to a new variable just copies the *reference*, not the object.\n\n**Shallow Copy (`copy.copy()`)**: Creates a new object, but inserts *references* into it to the objects found in the original. If you have nested objects (like a list of lists), modifying a nested element in the copied list *will* affect the original list.\n\n**Deep Copy (`copy.deepcopy()`)**: Creates a new object and recursively inserts *copies* of the objects found in the original. Modifying anything in the deep copy (even nested elements) will completely leave the original intact.",
    "complexity": "Basic",
    "topics": [
      "python"
    ],
    "tags": [
      "shallow-copy",
      "deep-copy",
      "mutability",
      "memory-references",
      "copy-module"
    ],
    "codeSnippet": "import copy\noriginal = [[1, 2, 3], [4, 5, 6]]\nshallow = copy.copy(original)\ndeep = copy.deepcopy(original)"
  },
  {
    "id": "py-decorators-mechanics-and-usecases",
    "qNo": 71,
    "q": "What are Python Decorators and how do they work?",
    "a": "A decorator is a design pattern in Python that allows you to add or modify the behavior of a function or class without permanently changing its source code. Functions are \"first-class citizens\" in Python, meaning they can be passed as arguments.\n\nA decorator is simply a function that takes another function as an argument, wraps it in an inner function to add behavior (like logging, timing, or authentication), and returns the new wrapped function.\n\n```python\ndef my_timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f\"Executed in {time.time() - start}s\")\n        return result\n    return wrapper\n\n@my_timer\ndef process_data():\n    pass # Function logic\n```",
    "complexity": "Intermediate",
    "topics": [
      "python"
    ],
    "tags": [
      "decorators",
      "closures",
      "higher-order-functions",
      "logging-retry",
      "functools-wraps"
    ],
    "codeSnippet": "from functools import wraps\nimport time\n\ndef retry_etl(max_retries=3, delay=1):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, max_retries + 1):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as e:\n                    if attempt == max_retries: raise\n                    time.sleep(delay)\n        return wrapper\n    return decorator"
  },
  {
    "id": "py-multithreading-vs-multiprocessing",
    "qNo": 72,
    "q": "What is the difference between Multithreading and Multiprocessing in Python?",
    "a": "**Multithreading:**\n- Uses multiple threads within a *single process*. They share the same memory space.\n- **The Catch:** Python has the GIL (Global Interpreter Lock), which prevents multiple threads from executing Python bytecode at the exact same time.\n- **Use Case:** Best for **I/O-bound tasks** (e.g., making API calls, downloading files, reading from disk) where the program spends most of its time waiting.\n\n**Multiprocessing:**\n- Spawns entirely new, independent Python *processes*. Each process has its own memory space and its own GIL.\n- **Use Case:** Best for **CPU-bound tasks** (e.g., heavy mathematical computations, image processing, massive data transformations) because it truly runs operations in parallel across multiple CPU cores.",
    "complexity": "Intermediate",
    "topics": [
      "python"
    ],
    "tags": [
      "multithreading",
      "multiprocessing",
      "cpu-bound",
      "io-bound",
      "gil",
      "concurrent-futures"
    ]
  },
  {
    "id": "py-generators-vs-lists-large-file-streaming",
    "qNo": 73,
    "q": "Generators vs. Lists. How would you process a 50GB CSV file in Python on a container with only 2GB of RAM?",
    "a": "If you attempt to load a 50GB CSV using `pandas.read_csv()` or `list.readlines()`, Python will load the entire file into memory at once. The container will instantly hit its 2GB limit and the OS will kill the process (OOMKilled).\n\n**The Solution: Generators**\nGenerators (`yield` keyword) utilize lazy evaluation. They maintain internal state and only yield one row (or chunk) into memory at a time, pausing execution until the next row is requested.\n\n```python\ndef read_large_file(file_path):\n    with open(file_path, 'r') as file:\n        for line in file:\n            yield process(line)\n\nfor processed_row in read_large_file('50gb_data.csv'):\n    write_to_db(processed_row)\n```\nThis reduces memory complexity from O(N) to O(1). The memory footprint remains in the megabytes regardless of whether the file is 5GB or 500GB.",
    "complexity": "Intermediate",
    "topics": [
      "python"
    ],
    "tags": [
      "generators",
      "yield",
      "memory-streaming",
      "chunked-processing",
      "lazy-evaluation"
    ],
    "codeSnippet": "def stream_large_csv(filepath, chunk_size=10000):\n    with open(filepath, 'r') as f:\n        header = f.readline().strip().split(',')\n        batch = []\n        for line in f:\n            batch.append(dict(zip(header, line.strip().split(','))))\n            if len(batch) >= chunk_size:\n                yield batch\n                batch = []\n        if batch:\n            yield batch"
  },
  {
    "id": "py-global-interpreter-lock-gil-deep-dive",
    "qNo": 74,
    "q": "Deep Dive: Explain the Global Interpreter Lock (GIL). How does it dictate your choice between Multithreading and Multiprocessing for data pipelines?",
    "a": "The GIL is a mutex in CPython that ensures only one thread executes Python bytecode at any given moment. This makes CPython thread-safe but prevents true parallel execution on multi-core CPUs.\n\n**When to use Multithreading:**\nBest for **I/O Bound** tasks (e.g., fetching data from 100 API endpoints, downloading files from S3). When Thread A makes an HTTP request, it releases the GIL while waiting for the network response. Thread B can instantly acquire the GIL and send its own HTTP request. This provides massive speedups.\n\n**When to use Multiprocessing:**\nBest for **CPU Bound** tasks (e.g., heavy regex parsing, matrix multiplications, image transformations). Because of the GIL, multithreading CPU tasks will actually be *slower* due to context switching. Multiprocessing bypasses the GIL entirely by spawning completely independent Python processes, each with its own memory space and its own GIL, allowing true parallel utilization of all CPU cores.",
    "complexity": "Complex",
    "topics": [
      "python"
    ],
    "tags": [
      "gil",
      "cpython",
      "memory-management",
      "concurrency",
      "no-gil-python313",
      "multiprocessing"
    ]
  },
  {
    "id": "py-slots-memory-optimization-for-objects",
    "qNo": 75,
    "q": "What is `__slots__` in Python, and how does it optimize memory for large datasets?",
    "a": "By default, every custom object in Python stores its instance attributes in a dynamic dictionary (`__dict__`). Dictionaries have significant memory overhead because they allocate extra space to allow dynamic attribute addition at runtime.\n\nIf you are instantiating 10 million `Row` objects in a memory-constrained environment, this `__dict__` overhead is catastrophic.\n\nBy explicitly defining `__slots__ = ['id', 'name', 'value']` inside your class, you tell Python *not* to use a dynamic dictionary. Instead, Python uses a fixed-size array in C to store the attributes. This prevents the dynamic addition of new attributes, but reduces the RAM usage of millions of objects by 40% to 50%, while also slightly speeding up attribute access.",
    "complexity": "Complex",
    "topics": [
      "python"
    ],
    "tags": [
      "__slots__",
      "memory-optimization",
      "dict-overhead",
      "object-footprint",
      "data-classes"
    ],
    "codeSnippet": "class EventRecord:\n    __slots__ = ['event_id', 'user_id', 'timestamp', 'payload']\n    def __init__(self, event_id, user_id, timestamp, payload):\n        self.event_id = event_id\n        self.user_id = user_id\n        self.timestamp = timestamp\n        self.payload = payload"
  },
  {
    "id": "py-pandas-dataframe-memory-optimization",
    "qNo": 76,
    "q": "How do you optimize the memory usage of a massive Pandas DataFrame before attempting transformations?",
    "a": "Pandas notoriously defaults to heavy 64-bit data types. A 10GB dataset on disk can easily balloon to 30GB+ in Pandas RAM.\n\n**Optimization Strategies:**\n1. **Downcasting Numerics:** Pandas loads all integers as `int64` and floats as `float64`. If your integer column represents 'age' (0-100), you can safely downcast it to `int8`, reducing the memory footprint of that column by 87.5%.\n2. **Categorical Data Types:** If you have a string column with low cardinality (e.g., a 'Status' column with only 'Pending', 'Shipped', 'Delivered', but repeated 50 million times), Pandas stores 50 million full strings. Converting this to `.astype('category')` creates an internal mapping dictionary (0, 1, 2). It stores the lightweight integers instead of the heavy strings, drastically cutting memory usage and vastly accelerating group-by operations.\n3. **Chunking:** Use `pd.read_csv(chunksize=10000)` to process the data iteratively rather than loading it entirely into memory.",
    "complexity": "Intermediate",
    "topics": [
      "python"
    ],
    "tags": [
      "pandas",
      "downcasting",
      "categorical-types",
      "memory-reduction",
      "chunksize",
      "arrow-backend"
    ],
    "codeSnippet": "def optimize_dtypes(df):\n    for col in df.select_dtypes(include=['int64']).columns:\n        df[col] = pd.to_numeric(df[col], downcast='integer')\n    for col in df.select_dtypes(include=['float64']).columns:\n        df[col] = pd.to_numeric(df[col], downcast='float')\n    for col in df.select_dtypes(include=['object']).columns:\n        if df[col].nunique() / len(df) < 0.5:\n            df[col] = df[col].astype('category')\n    return df"
  },
  {
    "id": "py-oop-etl-pipeline-design-and-iterators",
    "qNo": 103,
    "q": "How do you design an Object-Oriented, memory-efficient ETL pipeline in Python? Demonstrate custom context managers, batch iterators, and __slots__ for high-throughput ingestion.",
    "a": "Production data engineering requires Python pipelines that are robust, testable, and memory-safe. Rather than writing monolithic procedural scripts, an Object-Oriented design with custom iterators and context managers enforces separation of concerns and deterministic resource cleanup.\n\n### 1. Key Architectural Patterns\n1. **Context Managers (`__enter__` / `__exit__`):** Guarantees connections to databases or object stores close cleanly even if downstream transformations throw unhandled exceptions.\n2. **Generators & Chunked Iterators:** Prevents loading multi-gigabyte payloads into RAM by yielding records in streaming batches.\n3. **Memory Optimization with `__slots__`:** Suppresses the default instance `__dict__`, slashing per-record memory footprint by ~60%.\n\n### 2. Production Code Implementation\n```python\nimport csv\nfrom typing import Generator, List, Dict, Any\n\nclass IngestRecord:\n    \"\"\"Memory-optimized data holder using __slots__\"\"\"\n    __slots__ = ('record_id', 'user_id', 'metric_value', 'timestamp')\n\n    def __init__(self, record_id: str, user_id: str, metric_value: float, timestamp: str):\n        self.record_id = record_id\n        self.user_id = user_id\n        self.metric_value = float(metric_value)\n        self.timestamp = timestamp\n\n    def to_dict(self) -> Dict[str, Any]:\n        return {slot: getattr(self, slot) for slot in self.__slots__}\n\n\nclass StreamingBatchExtractor:\n    \"\"\"Context-managed extractor that streams CSV rows in memory-bounded batches\"\"\"\n    def __init__(self, filepath: str, batch_size: int = 5000):\n        self.filepath = filepath\n        self.batch_size = batch_size\n        self._file = None\n\n    def __enter__(self):\n        self._file = open(self.filepath, mode='r', encoding='utf-8')\n        return self\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        if self._file:\n            self._file.close()\n\n    def stream_batches(self) -> Generator[List[IngestRecord], None, None]:\n        reader = csv.DictReader(self._file)\n        batch: List[IngestRecord] = []\n        for row in reader:\n            record = IngestRecord(\n                record_id=row['id'],\n                user_id=row['user_id'],\n                metric_value=row['metric'],\n                timestamp=row['ts']\n            )\n            batch.append(record)\n            if len(batch) >= self.batch_size:\n                yield batch\n                batch = []\n        if batch:\n            yield batch\n```\n\n### 3. Usage & Pipeline Pipeline Flow\n```python\n# Execution remains constant in memory (~20MB) even for a 50GB input file\nwith StreamingBatchExtractor('/data/massive_raw_log.csv', batch_size=10000) as extractor:\n    for batch_idx, record_batch in enumerate(extractor.stream_batches()):\n        # Downstream bulk insert or transformation\n        transformed = [r.to_dict() for r in record_batch if r.metric_value > 0]\n        bulk_load_to_staging(transformed)\n```",
    "complexity": "Intermediate",
    "topics": [
      "python",
      "cicd-devops"
    ],
    "tags": [
      "oop-etl",
      "context-managers",
      "custom-iterators",
      "generator-pipelines",
      "clean-code",
      "__slots__"
    ],
    "codeSnippet": "class StreamingBatchExtractor:\n    def __enter__(self):\n        self._file = open(self.filepath, 'r')\n        return self\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        if self._file: self._file.close()"
  },
  {
    "id": "py-kth-largest-element-min-heap-quickselect",
    "qNo": 146,
    "q": "Find Kth Largest Element in an Array (LeetCode 215): How do you solve this using a Min-Heap versus QuickSelect in Python? Explain why this problem is a classic tier-1 product company elimination gate.",
    "a": "This is one of the most frequently asked algorithmic screening problems at tier-1 product companies (ServiceNow, Uber, Amazon, Meta). In live technical rounds, failing to produce at least the min-heap approach is often an immediate elimination gate that basic SQL queries cannot rescue.\n\n### 1. Approach A: Min-Heap / Priority Queue (Industry Standard)\n- **Concept:** Maintain a min-heap containing only `k` elements. Iterate through the array. For each element, push to the heap. Whenever the heap size exceeds `k`, pop the smallest element via `heapq.heappop()`. After checking all `N` elements, the top of the min-heap holds the `k`-th largest element.\n- **Time Complexity:** $O(N \\log k)$ — significantly faster than sorting $O(N \\log N)$ when $k \\ll N$.\n- **Space Complexity:** $O(k)$ auxiliary memory.\n\n```python\nimport heapq\n\ndef find_kth_largest_heap(nums: list[int], k: int) -> int:\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if len(min_heap) > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]\n\n# Verification\narr = [10, 40, 20, 30, 50, 60, 5, 4]\nassert find_kth_largest_heap(arr, 3) == 40\n```\n\n### 2. Approach B: QuickSelect (Hoare's Selection Algorithm — Optimal Average Time)\n- **Concept:** Partition the array around a random pivot identical to QuickSort. If the pivot index lands exactly on `len(nums) - k` (the target index for $k$-th largest in ascending order), return that value. Otherwise, recurse solely into the partition half containing the target index.\n- **Time Complexity:** Average $O(N)$, Worst-case $O(N^2)$ (mitigated with randomized pivot).\n- **Space Complexity:** $O(1)$ iterative auxiliary memory.\n\n```python\nimport random\n\ndef find_kth_largest_quickselect(nums: list[int], k: int) -> int:\n    target_idx = len(nums) - k\n\n    def quick_select(left: int, right: int) -> int:\n        pivot_idx = random.randint(left, right)\n        pivot = nums[pivot_idx]\n        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]\n\n        store_idx = left\n        for i in range(left, right):\n            if nums[i] < pivot:\n                nums[store_idx], nums[i] = nums[i], nums[store_idx]\n                store_idx += 1\n        nums[store_idx], nums[right] = nums[right], nums[store_idx]\n\n        if store_idx == target_idx:\n            return nums[store_idx]\n        elif store_idx < target_idx:\n            return quick_select(store_idx + 1, right)\n        else:\n            return quick_select(left, store_idx - 1)\n\n    return quick_select(0, len(nums) - 1)\n```\n\n### 3. Critical Interview Takeaway: Never Skip Heaps\nCandidates frequently revise Arrays, Hash Maps, and Trees while neglecting Heaps assuming they are rare. However, Min/Max-Heaps are fundamental to top-K streaming data, priority task scheduling, and real-time top-percentile pipelines. In live coding interviews, always state the brute force sorting approach ($O(N \\log N)$) first, then transition to $O(N \\log k)$ min-heap before coding.",
    "complexity": "Intermediate",
    "topics": [
      "python",
      "distributed-systems",
      "dsa"
    ],
    "tags": [
      "heapq",
      "min-heap",
      "priority-queue",
      "quickselect",
      "kth-largest",
      "leetcode-215",
      "algorithms"
    ],
    "codeSnippet": "import heapq\ndef find_kth_largest(nums, k):\n    heap = []\n    for n in nums:\n        heapq.heappush(heap, n)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return heap[0]"
  },
  {
    "id": "py-numpy-vectorization-broadcasting-memory",
    "qNo": 152,
    "q": "Why is NumPy drastically faster than native Python lists for numeric computations? Explain contiguous memory buffers, SIMD vectorization, and NumPy broadcasting rules.",
    "a": "Data pipelines often encounter heavy mathematical transformations where raw Python loops choke under high volume.\n\n### 1. Memory Architecture: Python Lists vs NumPy Arrays\n- **Python Lists (`list`):** A list of pointers to scattered heap objects. Each integer in Python is an object (`PyObject`) with a reference count, type info, and 28+ bytes of memory overhead. Iterating over a list causes constant CPU cache misses (pointer dereferencing).\n- **NumPy `ndarray`:** Stores data in a **single contiguous block of C-memory** (`C_CONTIGUOUS`). All elements share a single uniform C data type (e.g. `int64`, 8 bytes), eliminating pointer indirection and maximizing CPU L1/L2 cache locality.\n\n### 2. SIMD Vectorization\nNumPy delegates computations to low-level compiled C/Fortran libraries (BLAS/LAPACK). This unlocks **Single Instruction, Multiple Data (SIMD)** CPU instructions (e.g. AVX-512), allowing the CPU to perform additions/multiplications across 8 to 16 numeric elements in a single CPU cycle rather than looping.\n\n### 3. Broadcasting Rules\nBroadcasting allows NumPy to perform arithmetic operations on arrays with differing shapes without copying data in memory:\n1. Compare shapes element-wise starting from the trailing (rightmost) dimensions.\n2. Two dimensions are compatible if **they are equal**, or **one of them is 1**.\n3. The array with dimension 1 is virtually stretched to match the larger dimension without memory allocation.",
    "complexity": "Intermediate",
    "topics": [
      "python"
    ],
    "tags": [
      "numpy",
      "vectorization",
      "broadcasting",
      "memory-locality",
      "simd",
      "c-buffers"
    ],
    "codeSnippet": "import numpy as np\n# Broadcasting: (3, 1) + (1, 4) -> (3, 4) without allocating intermediate copies\na = np.array([[10], [20], [30]])\nb = np.array([1, 2, 3, 4])\nresult = a + b"
  },
  {
    "id": "py-pandas-loc-iloc-vectorize-apply-merges",
    "qNo": 153,
    "q": "Pandas Data Wrangling: Explain `.loc` vs `.iloc`, the performance penalty of `.apply()` vs vectorization, and compare `merge()`, `join()`, and `concat()`.",
    "a": "Pandas is the core operational library for analytical scripting and exploratory data science.\n\n### 1. `.loc` vs `.iloc` Indexing\n- **`.loc` (Label-based):** Selects rows and columns by their index/column **labels**. Slicing with `.loc['a':'c']` is inclusive of the endpoint `'c'`.\n- **`.iloc` (Integer position-based):** Selects by 0-indexed physical position (`0, 1, ...`). Slicing with `.iloc[0:3]` is exclusive of index 3 (standard Python slice behavior).\n\n### 2. The Performance Penalty of `.apply()`\n- `.apply(lambda x: ...)` is essentially a glorified Python `for` loop executing at Python interpreter speed, serializing every row through Python function call overhead.\n- **Optimized Alternatives:**\n  1. **Built-in Vectorized Operations:** `df['c'] = df['a'] + df['b']` (compiled C speed).\n  2. **NumPy Vectorization (`np.where`):** `df['status'] = np.where(df['age'] >= 18, 'Adult', 'Minor')` (~50-100x faster than `.apply()`).\n\n### 3. Combining Datasets: `merge` vs `join` vs `concat`\n- **`pd.merge(df1, df2, on='key', how='inner')`:** Relational SQL-style joins on arbitrary column keys.\n- **`df1.join(df2, on='key')`:** Specialized join combining DataFrames primarily on their **Index**.\n- **`pd.concat([df1, df2], axis=0)`:** Stacks datasets vertically (`axis=0`, union all) or horizontally (`axis=1`, column bind) without relational key matching.",
    "complexity": "Basic",
    "topics": [
      "python"
    ],
    "tags": [
      "pandas",
      "loc-vs-iloc",
      "apply-vs-vectorize",
      "merge-join-concat",
      "data-wrangling"
    ],
    "codeSnippet": "import pandas as pd\nimport numpy as np\n# Vectorized conditional evaluation without slow .apply()\ndf['category'] = np.where(df['amount'] > 1000, 'Enterprise', 'Retail')"
  },
  {
    "id": "py-matplotlib-visual-analytics-subplots",
    "qNo": 154,
    "q": "Explain the Matplotlib Figure vs Axes object hierarchy. How do you construct multi-panel subplots and visualize data distributions?",
    "a": "Understanding the object-oriented API of Matplotlib is critical for building reproducible analytics reports and pipeline health charts.\n\n### 1. Object Hierarchy: Figure vs Axes\n- **Figure:** The overall canvas/window containing all drawing elements, titles, legends, and subplots.\n- **Axes (Plot Area):** The actual bounded plotting region where data curves, scatter points, bar charts, and axis ticks live. A single Figure can contain multiple Axes objects (e.g., a 2x2 grid of subplots).\n\n### 2. Best Practice: Object-Oriented Subplot Pattern\nAvoid using the legacy state-machine `plt.subplot()` API in production scripts. Prefer the explicit OO pattern:\n```python\nimport matplotlib.pyplot as plt\nimport numpy as np\n\n# Generate sample pipeline metrics\ndates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']\nrecords_processed = [120000, 145000, 132000, 160000, 155000]\nlatency_ms = [42, 38, 45, 36, 40]\n\n# Instantiate Figure with 1 row, 2 columns\nfig, (ax1, ax2) = plt.subplots(nrows=1, ncols=2, figsize=(12, 5))\n\n# Panel 1: Throughput bar chart\nax1.bar(dates, records_processed, color='#3b82f6')\nax1.set_title('ETL Pipeline Daily Volume')\nax1.set_ylabel('Records Ingested')\nax1.grid(axis='y', linestyle='--', alpha=0.7)\n\n# Panel 2: Latency trend line\nax2.plot(dates, latency_ms, marker='o', color='#10b981', linewidth=2)\nax2.set_title('End-to-End Processing Latency')\nax2.set_ylabel('Latency (ms)')\nax2.grid(True, linestyle='--', alpha=0.7)\n\nplt.tight_layout()\nplt.savefig('pipeline_health.png', dpi=300)\nplt.close(fig)\n```",
    "complexity": "Basic",
    "topics": [
      "python"
    ],
    "tags": [
      "matplotlib",
      "data-visualization",
      "figure-axes",
      "subplots",
      "visual-analytics"
    ],
    "codeSnippet": "fig, ax = plt.subplots(figsize=(8, 4))\nax.hist(df['latency'], bins=30, color='#6366f1')\nax.set_title('Distribution of Query Latency')\nplt.tight_layout()"
  },
  {
    "id": "py-lists-dicts-hashmap-args-kwargs",
    "qNo": 155,
    "q": "Explain Python List vs. Dictionary internal data structures. How do Python Hash Tables handle collisions, and what is the mechanics of `*args` and `**kwargs`?",
    "a": "This fundamental question evaluates understanding of Python runtime internals, memory allocations, and variable unpacking.\n\n### 1. Internal Implementations: Lists vs. Dicts\n- **List (`PyListObject`):** A dynamically resizable array of memory pointers. Random access by index (`lst[i]`) is $O(1)$. Appending (`lst.append()`) is amortized $O(1)$ due to overallocation growth patterns ($0, 4, 8, 16, 25, 35\\dots$). Searching (`x in lst`) is $O(N)$ linear scan.\n- **Dictionary (`PyDictObject`):** A compact hash table using open addressing with quadratic pseudo-random probing. Lookups (`d[k]`), insertions, and deletions are average $O(1)$.\n\n### 2. Hash Table Collision Resolution in Python\nPython dictionaries evaluate `hash(key)`. When two keys evaluate to the same table index (collision):\n- CPython uses **Open Addressing with Perturbation Probing**:\n  `probe = ((5 * probe) + 1 + perturb) & mask`\n- The perturbation value incorporates high-order hash bits, systematically scattering probes across unused slots to prevent primary clustering.\n\n### 3. Function Argument Unpacking: `*args` and `**kwargs`\n- **`*args` (Positional Unpacking):** Collects extra positional arguments into an immutable **tuple**.\n- **`**kwargs` (Keyword Unpacking):** Collects extra named arguments into a mutable **dictionary**.\n- Commonly used in custom ETL decorators, Airflow custom operators, and PySpark wrapper utilities.",
    "complexity": "Basic",
    "topics": [
      "python",
      "dsa"
    ],
    "tags": [
      "lists-dicts",
      "hashmap-internals",
      "args-kwargs",
      "collision-resolution",
      "open-addressing"
    ],
    "codeSnippet": "def etl_hook(step_name, *args, **kwargs):\n    print(f'Executing {step_name} with {len(args)} args and options: {kwargs}')\n\netl_hook('ingest', 'source.csv', batch_size=1000, retry=True)"
  }
];
