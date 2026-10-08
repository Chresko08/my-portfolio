// Modular question module: dataVizBi (Data Visualization & BI)
// Primary questions count: 5

export const dataVizBiQuestions = [
  {
    "id": "bi-tableau-vs-power-bi-architecture",
    "qNo": 172,
    "q": "Power BI vs. Tableau: Compare their underlying architectures, storage engines (VertiPaq vs Hyper), data modeling capabilities, and enterprise governance workflows.",
    "a": "Power BI and Tableau are the two dominant enterprise Business Intelligence and visualization platforms.\n\n### 1. Comparative Architecture Matrix\n| Architectural Layer | Microsoft Power BI | Tableau (Salesforce) |\n|---|---|---|\n| **Core Engine** | **VertiPaq Engine:** In-memory columnar database with aggressive dictionary encoding and run-length compression. | **Hyper Engine:** Fast in-memory query processing and columnar extraction engine. |\n| **Data Modeling** | Native relational modeling: Kimball Star schemas, 1-to-many relationships, composite models, and DAX calculations. | Historically worksheet-centric; now uses \"Noodles\" (logical multi-table model) and physical joins. |\n| **Calculation Language** | **DAX** (Data Analysis Expressions) for measures + **Power Query (M)** for ETL. | Table calculations and Tableau Calculation syntax (including LOD expressions). |\n| **Enterprise Governance** | Microsoft Fabric integration, Workspace deployment pipelines, Git integration, Sensitivity labels. | Tableau Cloud / Server projects, data source certifications, Tableau Prep pipelines. |\n\n### 2. When to Choose Which?\n- **Power BI:** Ideal for organizations invested in the Microsoft 365 / Azure ecosystem, enterprise data warehouses requiring heavy semantic modeling (star schemas), and cost-sensitive multi-user deployments.\n- **Tableau:** Superior for open-ended visual analytics, ad-hoc exploratory analysis, geographic mapping, and highly customized visual dashboards.",
    "complexity": "Intermediate",
    "topics": [
      "data-viz-bi",
      "data-modeling"
    ],
    "tags": [
      "power-bi",
      "tableau",
      "vertipaq",
      "hyper-engine",
      "bi-architecture",
      "dashboards"
    ],
    "codeSnippet": "// Power BI DAX vs Tableau LOD comparison\n// DAX:\nSales Share = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(dim_geography)))\n// Tableau LOD:\n{ FIXED : SUM([Sales]) }"
  },
  {
    "id": "bi-dax-calculated-columns-vs-measures-calculate",
    "qNo": 173,
    "q": "Power BI DAX: Explain the fundamental difference between Calculated Columns and Measures. How do Row Context, Filter Context, and Context Transition work in `CALCULATE()`?",
    "a": "Mastering DAX (Data Analysis Expressions) requires understanding execution contexts rather than formula syntax.\n\n### 1. Calculated Columns vs Measures\n- **Calculated Columns:** Computed **at data refresh time** and materialized into RAM inside the VertiPaq database for each row. Consumes physical memory and does not react to slicer interactions.\n  *Rule of thumb:* Only create calculated columns if needed as a **slicer or filter dimension**.\n- **Measures:** Computed **on-the-fly at query time** in response to visual interactions, filters, and slicers. Consumes zero RAM on disk, evaluating dynamically based on the current filter context.\n\n### 2. The Context Concepts: Row vs Filter Context\n- **Row Context:** Exists during iteration (e.g. inside a calculated column or an `X`-iterator like `SUMX`). Knows about values in the current row, but **knows nothing about other rows or visual slicers**.\n- **Filter Context:** The set of active filters applied to the data model from slicers, visual axes, matrix rows/columns, and report-level filters.\n\n### 3. Context Transition and `CALCULATE()`\n- **`CALCULATE(expression, filter1, filter2, ...)`** is the only DAX function capable of **modifying the filter context**:\n```dax\n-- Computes Year-to-Date sales overriding date filter\nSales_YTD = CALCULATE(\n    [Total Sales],\n    DATESYTD(dim_date[date_key])\n)\n\n-- Computes Percentage of Total Region Sales by clearing city filter\nRegion_Share = DIVIDE(\n    [Total Sales],\n    CALCULATE([Total Sales], ALL(dim_customer[city]))\n)\n```\n- **Context Transition:** When `CALCULATE()` is executed within an active row context (or when calling a Measure inside a row iterator), it automatically converts the current row's unique values into an active filter context!",
    "complexity": "Complex",
    "topics": [
      "data-viz-bi"
    ],
    "tags": [
      "dax",
      "power-bi",
      "calculate",
      "row-context",
      "filter-context",
      "measures-vs-columns"
    ],
    "codeSnippet": "-- Context Transition in DAX Measure\nRevenue_YoY_Growth = \nVAR CurrentSales = [Total Sales]\nVAR PriorSales = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(dim_date[date]))\nRETURN DIVIDE(CurrentSales - PriorSales, PriorSales)"
  },
  {
    "id": "bi-data-modeling-star-schema-relationships",
    "qNo": 174,
    "q": "Data Modeling for BI: Why is Kimball's Star Schema the optimal model for Power BI? Explain relationship cardinality, bidirectional cross-filtering hazards, and role-playing dimensions.",
    "a": "Data modeling in Power BI is the foundation of report performance. A poorly structured model causes sluggish visuals and circular DAX dependencies.\n\n### 1. Why VertiPaq Loves Star Schemas\n- The VertiPaq engine achieves maximum compression by dictionary-encoding isolated columns.\n- **Star Schema** (central Fact table surrounded by single-hop 1-to-Many Dimension tables) enables VertiPaq to execute blazing-fast hash lookups across single foreign keys.\n- In contrast, wide flattened denormalized tables (single 100-column flat table) waste gigabytes of RAM due to duplicate textual attributes, while highly normalized Snowflake schemas require multi-hop joins that degrade query speed.\n\n### 2. Bidirectional Cross-Filtering Hazards\n- By default, relationships filter from the 1-side (Dimension) to the Many-side (Fact).\n- Enabling **Both (Bidirectional)** cross-filtering allows filters from one fact table to propagate through dimensions to another fact table.\n- *Danger:* Introduces **ambiguous filter paths**, severe visual query latency, and unexpected totals. In enterprise modeling, keep cross-filter direction set to **Single**, using DAX `CROSSFILTER()` only for targeted specific measures.\n\n### 3. Role-Playing Dimensions & `USERELATIONSHIP()`\n- When a Fact table has multiple date keys (e.g. `order_date`, `shipping_date`, `delivery_date`):\n- Do not duplicate the `dim_date` table 3 times. Create one inactive relationship and activate it inside DAX:\n```dax\nSales_By_Shipping_Date = CALCULATE(\n    [Total Sales],\n    USERELATIONSHIP(fact_orders[shipping_date_key], dim_date[date_key])\n)\n```",
    "complexity": "Intermediate",
    "topics": [
      "data-viz-bi",
      "data-modeling"
    ],
    "tags": [
      "data-modeling-bi",
      "star-schema",
      "bidirectional-filtering",
      "userelationship",
      "role-playing-dimensions",
      "power-bi"
    ],
    "codeSnippet": "-- Activating inactive relationship for role-playing date dimension\nShippedRevenue = CALCULATE([TotalRevenue], USERELATIONSHIP(fact_sales[shipping_date], dim_calendar[date]))"
  },
  {
    "id": "bi-row-level-security-incremental-refresh",
    "qNo": 175,
    "q": "Enterprise BI Governance: How do you implement Dynamic Row-Level Security (RLS) using DAX (`USERPRINCIPALNAME`) and configure Incremental Refresh policies?",
    "a": "Enterprise deployments require strict access control and efficient data refreshes for multi-billion row fact tables.\n\n### 1. Dynamic Row-Level Security (RLS) with DAX\nInstead of creating static roles for every branch or territory, dynamic RLS uses the authenticated user's Azure Active Directory email:\n1. Model a security table: `security_mapping(email, department_id)`.\n2. Create a 1-to-many relationship from `security_mapping` to `dim_department`.\n3. In Power BI Desktop -> **Manage Roles** -> create a role `UserDepartmentSecurity`:\n```dax\n-- Applied on security_mapping table\n[email] = USERPRINCIPALNAME()\n```\n4. When John (`john@company.com`) logs into the Power BI service, VertiPaq filters `security_mapping` to only John's assigned departments, which automatically filters the fact tables.\n\n### 2. Incremental Refresh Configuration\nFor fact tables exceeding 50 million rows, full daily refreshes choke database connections and exceed gateway timeouts:\n- **Parameters:** Define two mandatory DateTime parameters: `RangeStart` and `RangeEnd` in Power Query.\n- **Policy Configuration:** In Power BI Desktop, right-click the fact table -> **Incremental Refresh**:\n  - *Archive data starting:* 3 Years (retained in historical read-only partitions).\n  - *Incrementally refresh data starting:* 7 Days (only the last 7 days are re-queried during the scheduled refresh!).\n  - *Detect data changes:* Check a `last_modified_date` column so unchanged historical records are untouched.",
    "complexity": "Intermediate",
    "topics": [
      "data-viz-bi",
      "data-governance"
    ],
    "tags": [
      "rls",
      "userprincipalname",
      "incremental-refresh",
      "governance",
      "power-bi-service",
      "security"
    ],
    "codeSnippet": "-- Dynamic RLS Filter Expression\n[user_email] = USERPRINCIPALNAME()"
  },
  {
    "id": "bi-tableau-lod-expressions-parameters",
    "qNo": 176,
    "q": "Tableau Level of Detail (LOD) Expressions: Explain the differences between FIXED, INCLUDE, and EXCLUDE, and demonstrate how to build scenario modeling parameters.",
    "a": "In Tableau, the level of detail of a visualization is dictated by the dimensions placed on the Rows, Columns, and Marks shelves. **LOD (Level of Detail) Expressions** allow you to compute values at dimensions independent of the view.\n\n### 1. LOD Types: FIXED vs INCLUDE vs EXCLUDE\n- **`{ FIXED [Region] : SUM([Sales]) }`:**\n  - Computes the aggregation at the exact dimension specified, completely ignoring the dimensions in the visualization.\n  - *Filter Pipeline Note:* Evaluates **before Dimension Filters** (only affected by Context Filters and Extract Filters).\n- **`{ INCLUDE [Customer ID] : AVG([Order Value]) }`:**\n  - Computes aggregation at a **finer / lower level of detail** than what is shown on the visualization (e.g. displaying average customer spend per state).\n- **`{ EXCLUDE [Region] : SUM([Sales]) }`:**\n  - Computes aggregation at a **coarser / higher level of detail** by omitting a dimension that is present on the shelf.\n\n### 2. Interactive Scenario Modeling using Parameters\n- Create a Parameter: `[Target Growth Rate %]` (Float list or range, -20% to +50%).\n- Create a Calculated Field referencing the parameter:\n  `[Forecasted Revenue] = SUM([Base Revenue]) * (1 + [Target Growth Rate %])`\n- Expose the Parameter Control on the dashboard for executive interactive what-if simulations.",
    "complexity": "Intermediate",
    "topics": [
      "data-viz-bi"
    ],
    "tags": [
      "tableau",
      "lod-expressions",
      "fixed-include-exclude",
      "parameters",
      "what-if-analysis"
    ],
    "codeSnippet": "// Tableau FIXED LOD for Customer First Purchase Date\n{ FIXED [Customer ID] : MIN([Order Date]) }\n// Percentage of Total Sales LOD\nSUM([Sales]) / ATTR({ FIXED : SUM([Sales]) })"
  }
];
