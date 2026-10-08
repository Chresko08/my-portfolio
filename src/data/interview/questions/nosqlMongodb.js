// Modular question module: nosqlMongodb (NoSQL & MongoDB)
// Primary questions count: 5

export const nosqlMongodbQuestions = [
  {
    "id": "nosql-mongodb-document-model-bson-vs-rdbms",
    "qNo": 162,
    "q": "MongoDB Document Model & BSON: How does MongoDB differ from relational RDBMS? Explain Embedding vs Referencing (Denormalization vs Normalization) and the internal structure of ObjectId.",
    "a": "MongoDB is a distributed, schema-flexible Document database that stores data in **BSON (Binary JSON)**, combining the developer ergonomics of JSON with high-performance binary encoding.\n\n### 1. MongoDB Document Model vs Relational RDBMS\n| Feature | Relational RDBMS (PostgreSQL / MySQL) | MongoDB Document Store |\n|---|---|---|\n| **Data Format** | Tables, rows, fixed column schemas | Collections, polymorphic BSON documents |\n| **Relationships** | Enforced Foreign Keys & relational JOINs | Embedded subdocuments or normalized ObjectIds |\n| **Schema Flexibility** | Strict DDL migrations required for alterations | Dynamic schema; documents in same collection can differ |\n| **Scaling Model** | Vertical scaling (Scale-up) primarily | Native horizontal scaling (Sharding / Scale-out) |\n\n### 2. Data Modeling: Embedding vs Referencing\n- **Embedding (Denormalization - \"Data that is accessed together is stored together\"):**\n  - Nest related records directly inside an array or subdocument (e.g. embedding `addresses: [{ street, city }]` inside a `user` document).\n  - *Pros:* Atomic updates, single disk read fetches entire hierarchy with **zero JOINs**.\n  - *When to use:* 1-to-1 or bounded 1-to-few relationships (e.g. max 5 addresses per user).\n- **Referencing (Normalization):**\n  - Store `_id` references across separate collections and join via `$lookup` or application-level queries.\n  - *When to use:* 1-to-Many with unbounded growth (e.g. millions of log events per user, avoiding MongoDB's **16MB maximum document size limit**), or Many-to-Many relationships.\n\n### 3. The 12-Byte ObjectId Structure (`_id`)\nEvery MongoDB document has a unique `_id`. By default, MongoDB generates a 12-byte `ObjectId`:\n- **4 bytes:** Unix epoch timestamp in seconds (allows natural time-based sorting!).\n- **5 bytes:** Random process identifier unique to the machine and process.\n- **3 bytes:** Incrementing counter starting at a random value.",
    "complexity": "Basic",
    "topics": [
      "nosql-mongodb",
      "data-modeling"
    ],
    "tags": [
      "mongodb",
      "nosql",
      "bson",
      "embedding-vs-referencing",
      "objectid",
      "document-database"
    ],
    "codeSnippet": "// BSON Document with Embedded Addresses and Referenced Orders\n{\n  \"_id\": ObjectId(\"6522c1b8f8a123456789abcd\"),\n  \"name\": \"Alice\",\n  \"addresses\": [{ \"city\": \"Seattle\", \"type\": \"Home\" }],\n  \"recent_order_ids\": [ObjectId(\"6522c1c0f8a123456789abce\")]\n}"
  },
  {
    "id": "nosql-mongodb-aggregation-pipeline-stages",
    "qNo": 163,
    "q": "MongoDB Aggregation Pipeline: Explain the multi-stage pipeline architecture. Write an aggregation query using `$match`, `$project`, `$group`, `$unwind`, and `$lookup` (Left Outer Join).",
    "a": "The Aggregation Pipeline is MongoDB's declarative multi-stage data processing framework, conceptually similar to Unix pipes or SQL CTE sequences.\n\n### 1. Key Pipeline Stages\n- **`$match`:** Filters documents (should always be placed first to utilize indexes and reduce downstream memory).\n- **`$project` / `$addFields`:** Reshapes documents, computes new columns, or suppresses fields (`_id: 0`).\n- **`$unwind`:** Deconstructs an array field from the input documents to output a document for *each* element.\n- **`$group`:** Groups input documents by a specified identifier (`_id`) and applies accumulator expressions (`$sum`, `$avg`, `$push`).\n- **`$lookup`:** Performs an equality join with another collection (equivalent to SQL `LEFT OUTER JOIN`).\n\n### 2. Production Aggregation Pipeline Query\n*Scenario:* Calculate total spend per customer by joining `orders` with `customers`, filtering completed orders, and unwinding purchased items:\n\n```javascript\ndb.orders.aggregate([\n  // Stage 1: Filter active completed orders (Index-covered)\n  {\n    $match: {\n      status: \"COMPLETED\",\n      order_date: { $gte: ISODate(\"2024-01-01\") }\n    }\n  },\n  // Stage 2: Left Join to customers collection\n  {\n    $lookup: {\n      from: \"customers\",\n      localField: \"customer_id\",\n      foreignField: \"_id\",\n      as: \"customer_info\"\n    }\n  },\n  // Stage 3: Flatten customer array (1-to-1 match)\n  {\n    $unwind: \"$customer_info\"\n  },\n  // Stage 4: Group by Customer to aggregate totals\n  {\n    $group: {\n      _id: \"$customer_info.email\",\n      total_spent: { $sum: \"$total_amount\" },\n      order_count: { $sum: 1 },\n      items_bought: { $push: \"$items.sku\" }\n    }\n  },\n  // Stage 5: Sort and limit top spenders\n  { $sort: { total_spent: -1 } },\n  { $limit: 10 }\n]);\n```\n*Pipeline Memory Limit:* Each stage has a default **100MB RAM limit**. If a stage exceeds this, MongoDB throws an error unless `allowDiskUse: true` is passed.",
    "complexity": "Intermediate",
    "topics": [
      "nosql-mongodb",
      "advanced-sql"
    ],
    "tags": [
      "aggregation-pipeline",
      "lookup-join",
      "unwind",
      "group",
      "match",
      "analytics"
    ],
    "codeSnippet": "db.orders.aggregate([\n  { $match: { status: 'COMPLETED' } },\n  { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },\n  { $unwind: '$user' },\n  { $group: { _id: '$user.country', revenue: { $sum: '$amount' } } }\n]);"
  },
  {
    "id": "nosql-mongodb-indexing-esr-rule-compound",
    "qNo": 164,
    "q": "MongoDB Indexing Strategies: Explain Compound Indexes, Multikey Indexes, TTL Indexes, and how the ESR (Equality, Sort, Range) rule guarantees optimal query performance.",
    "a": "Without indexes, MongoDB must perform a `COLLSCAN` (collection scan), reading every single document from disk into RAM. Indexes (`IXSCAN`) use B-Trees to provide logarithmic lookups.\n\n### 1. Types of MongoDB Indexes\n- **Single Field Index:** `db.users.createIndex({ email: 1 })`.\n- **Compound Index:** Multiple fields combined: `db.orders.createIndex({ customerId: 1, createdAt: -1 })`.\n- **Multikey Index:** Automatically created when indexing an **array** field. MongoDB creates separate index entries for every element in the array.\n- **TTL (Time-To-Live) Index:** Automatically deletes documents after a specified time interval: `db.sessions.createIndex({ lastActivity: 1 }, { expireAfterSeconds: 3600 })`.\n- **Partial / Sparse Index:** Indexes only documents satisfying a filter expression, drastically cutting index size in RAM.\n\n### 2. The Golden Rule: The ESR Rule (Equality, Sort, Range)\nWhen designing a compound index for a query that contains equality matches, sorting, and range filters, define the index fields in the exact order: **Equality -> Sort -> Range**:\n\n*Example Query:*\n```javascript\ndb.orders.find({\n  status: \"SHIPPED\",         // Equality\n  total_amount: { $gte: 100 } // Range\n}).sort({ order_date: -1 })  // Sort\n```\n- **Correct ESR Index:** `{ status: 1, order_date: -1, total_amount: 1 }`\n  1. **E (`status`):** Filters down index entries to only matching status.\n  2. **S (`order_date`):** Directly walks the sorted B-tree leaf nodes without executing an expensive in-memory sort (`SORT_KEY_GENERATOR`).\n  3. **R (`total_amount`):** Performs range bounds scan on the sorted stream.\n- *Explain Plan Validation:* Run `.explain(\"executionStats\")` and ensure `totalDocsExamined == nReturned` (zero unindexed document scans).",
    "complexity": "Intermediate",
    "topics": [
      "nosql-mongodb",
      "advanced-sql"
    ],
    "tags": [
      "indexing",
      "esr-rule",
      "compound-index",
      "multikey-index",
      "ttl-index",
      "query-optimization"
    ],
    "codeSnippet": "// Creating ESR compliant compound index\ndb.orders.createIndex({ status: 1, order_date: -1, total_amount: 1 });\n// Validating index usage\ndb.orders.find({ status: 'SHIPPED', total_amount: { $gt: 50 } }).sort({ order_date: -1 }).explain('executionStats');"
  },
  {
    "id": "nosql-mongodb-replica-sets-sharding-high-availability",
    "qNo": 165,
    "q": "MongoDB High Availability & Horizontal Scaling: Explain Replica Sets (Oplog, Elections, Write Concerns) versus Sharded Clusters (Mongos, Shard Keys, Chunk Balancing).",
    "a": "MongoDB achieves high availability through **Replica Sets** and horizontal throughput scaling through **Sharded Clusters**.\n\n### 1. Replica Sets (High Availability & Redundancy)\n- **Topology:** Typically 3 nodes: **1 Primary** and **2 Secondaries** (or 1 Secondary + 1 Arbiter).\n- **Write Flow:** All writes go to the Primary. The Primary records modifications in its **Oplog (Operations Log)**, an idempotent capped collection.\n- **Replication:** Secondaries asynchronously read the Primary's Oplog and apply modifications locally.\n- **Automatic Failover:** If the Primary crashes, remaining members hold a Raft-like election; the secondary with the most up-to-date Oplog becomes the new Primary in < 2 seconds.\n- **Write Concern (`w`):**\n  - `w: 1`: Acknowledged once written to Primary memory.\n  - `w: \"majority\"`: Acknowledged only after written to a majority of replica members (prevents data loss if Primary fails).\n\n### 2. Sharded Clusters (Horizontal Scaling / Partitioning)\n- **Components:**\n  - **`mongos` (Query Router):** Stateless routing proxy that clients connect to. It inspects queries and routes them directly to target shards.\n  - **Config Servers:** 3-node replica set storing cluster metadata, shard ranges, and chunk distributions.\n  - **Shards:** Independent replica sets that hold a horizontal slice (partition) of data.\n- **Shard Key Selection:** Critical architectural decision. Must have **high cardinality**, balanced write frequency, and avoid monotonically increasing keys (which create hot-spotting on the max chunk).",
    "complexity": "Intermediate",
    "topics": [
      "nosql-mongodb",
      "distributed-systems"
    ],
    "tags": [
      "replica-sets",
      "sharding",
      "oplog",
      "high-availability",
      "write-concern",
      "shard-key"
    ],
    "codeSnippet": "// Setting write concern to majority with timeout\ndb.orders.insertOne(\n  { orderId: 101, amount: 250 },\n  { writeConcern: { w: \"majority\", wtimeout: 5000 } }\n);"
  },
  {
    "id": "nosql-mongodb-acid-transactions-cap-theorem",
    "qNo": 166,
    "q": "MongoDB ACID Transactions & CAP Theorem: How does MongoDB support Multi-Document ACID Transactions? Where does MongoDB land in the CAP Theorem?",
    "a": "A common misconception is that NoSQL databases cannot provide ACID transactions. MongoDB has supported multi-document ACID transactions since version 4.0 (and distributed multi-shard transactions since 4.2).\n\n### 1. Multi-Document ACID Transactions\n- Single document operations in MongoDB are always atomic.\n- For workflows requiring multi-document updates (e.g. transferring money between two bank account documents), MongoDB provides snapshot-isolated sessions:\n```javascript\nconst session = db.getMongo().startSession();\nsession.startTransaction({\n  readConcern: { level: \"snapshot\" },\n  writeConcern: { w: \"majority\" }\n});\n\ntry {\n  const accounts = session.getDatabase(\"bank\").accounts;\n  accounts.updateOne({ _id: \"A\" }, { $inc: { balance: -100 } });\n  accounts.updateOne({ _id: \"B\" }, { $inc: { balance: 100 } });\n  session.commitTransaction();\n} catch (err) {\n  session.abortTransaction();\n} finally {\n  session.endSession();\n}\n```\n*Mechanics:* Uses a two-phase commit protocol across replica set WiredTiger storage engines, with transaction locks aborting automatically after 60 seconds to avoid deadlocks.\n\n### 2. CAP Theorem Classification: MongoDB is a CP System\nIn Eric Brewer's CAP Theorem (Consistency, Availability, Partition Tolerance):\n- **MongoDB is a CP System (Consistent & Partition Tolerant):**\n  - In the event of a network partition, if a minority partition of nodes cannot reach the majority, it rejects writes. The majority partition elects a Primary and continues.\n  - During the brief election window (~2 seconds), writes to the cluster are paused to guarantee consistency and prevent split-brain anomalies.",
    "complexity": "Intermediate",
    "topics": [
      "nosql-mongodb",
      "distributed-systems"
    ],
    "tags": [
      "acid-transactions",
      "cap-theorem",
      "two-phase-commit",
      "snapshot-isolation",
      "cp-system"
    ],
    "codeSnippet": "const session = client.startSession();\nsession.startTransaction();\n// Execute transactional updates\nawait session.commitTransaction();\nsession.endSession();"
  }
];
