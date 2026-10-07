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
  }
];
