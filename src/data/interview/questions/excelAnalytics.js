// Modular question module: excelAnalytics (Excel & Analytics)
// Primary questions count: 5

export const excelAnalyticsQuestions = [
  {
    "id": "excel-vlookup-xlookup-index-match",
    "qNo": 167,
    "q": "VLOOKUP vs XLOOKUP vs INDEX/MATCH: What are the fundamental limitations of VLOOKUP, how does INDEX/MATCH solve them, and why is XLOOKUP the modern standard?",
    "a": "Lookup functions are the bread-and-butter of spreadsheet data manipulation.\n\n### 1. The Critical Limitations of VLOOKUP\n- **Right-to-Left Inability:** `VLOOKUP` can only look for values to the *right* of the lookup column. If the lookup key is in Column C and the target return value is in Column A, `VLOOKUP` fails without reorganizing the sheet.\n- **Column Insertion Fragility:** `VLOOKUP` uses a hardcoded integer column index (e.g. `col_index_num = 4`). If a stakeholder inserts or deletes a column in the source table, the formula returns the wrong data silently.\n- **Performance:** `VLOOKUP` loads the entire rectangular table range into memory rather than scanning only the two target vectors.\n\n### 2. The INDEX/MATCH Advantage (Two-Dimensional Flexibility)\n- `INDEX(array, row_num, [col_num])` retrieves a value from a specified coordinate.\n- `MATCH(lookup_value, lookup_array, 0)` finds the exact 1D row position.\n- Combining them: `=INDEX(A:A, MATCH(\"Alice\", C:C, 0))` allows left-lookups and is impervious to column insertions!\n- Also supports **Two-Way Matrix Lookups**:\n  `=INDEX(B2:E10, MATCH(\"Q3\", A2:A10, 0), MATCH(\"East Region\", B1:E1, 0))`.\n\n### 3. XLOOKUP: The Modern Standard (Excel 365+)\n`XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])`:\n- Defaults to **Exact Match** (no more accidentally omitting `FALSE` in VLOOKUP!).\n- Seamless Left & Right lookups with two distinct array arguments.\n- Built-in `#N/A` error handling via `[if_not_found]` argument (no outer `IFERROR` needed).\n- Supports reverse searches (bottom-to-top) and binary search on sorted data.",
    "complexity": "Basic",
    "topics": [
      "excel-analytics"
    ],
    "tags": [
      "vlookup",
      "xlookup",
      "index-match",
      "lookups",
      "excel-formulas",
      "spreadsheets"
    ],
    "codeSnippet": "// Modern XLOOKUP syntax with fallback handling\n=XLOOKUP(E2, A2:A1000, C2:C1000, \"Not Found\", 0)\n// Classic resilient INDEX/MATCH left lookup\n=INDEX(A2:A1000, MATCH(E2, C2:C1000, 0))"
  },
  {
    "id": "excel-pivot-tables-calculated-fields-grouping",
    "qNo": 168,
    "q": "Pivot Tables in Excel: How do you build multi-dimensional summary reports, group dates into fiscal quarters, create Calculated Fields, and connect interactive Slicers?",
    "a": "Pivot Tables provide instantaneous aggregation, slicing, and dicing of tabular datasets without writing formulas.\n\n### 1. Grouping Timestamps and Dates\n- Raw transaction timestamps (`2024-03-15 14:23:00`) overwhelm pivot columns.\n- **Date Grouping:** Right-click any date cell in the Pivot Table -> select **Group** -> select **Years, Quarters, and Months**. Excel creates synthetic hierarchy levels automatically.\n- *Tip:* Ensure there are zero blank cells or text values in the date column; a single non-date cell disables grouping.\n\n### 2. Calculated Fields vs Calculated Items\n- **Calculated Field:** Creates a new summary metric using aggregations of existing fields. Operates on the **sum of underlying data**:\n  `Formula: = 'Revenue' - 'Cost'` (Profit Margin: `='Profit' / 'Revenue'`).\n  *Warning:* Never use `=AVERAGE(Score)` inside a calculated field; calculated fields always operate on `SUM` of components.\n- **Calculated Item:** Creates a new row/item inside an existing dimension field (e.g. creating a synthetic row `'Europe'` combining `'UK' + 'Germany' + 'France'`).\n\n### 3. Connecting Multi-Table Slicers\n- Add a Slicer (e.g., Region, Department).\n- Right-click the Slicer -> **Report Connections** -> check all Pivot Tables in the workbook built from the same data source.\n- Now, clicking a region in the slicer simultaneously updates all executive pivot charts across the entire dashboard.",
    "complexity": "Basic",
    "topics": [
      "excel-analytics",
      "data-viz-bi"
    ],
    "tags": [
      "pivot-tables",
      "calculated-fields",
      "date-grouping",
      "slicers",
      "data-summarization"
    ],
    "codeSnippet": "// Calculated Field formula in Excel Pivot Table\n= 'Total Revenue' * (1 - 'Discount Rate')\n// Extracting pivot value with GETPIVOTDATA\n=GETPIVOTDATA(\"Revenue\", $A$3, \"Region\", \"West\", \"Quarter\", \"Q1\")"
  },
  {
    "id": "excel-formulas-sumifs-countifs-conditional-logic",
    "qNo": 169,
    "q": "Advanced Excel Formulas: Compare `SUMIFS` vs `COUNTIFS` vs `AVERAGEIFS`. How do dynamic array formulas (`FILTER`, `UNIQUE`, `SORT`) revolutionize data processing?",
    "a": "Multi-conditional formula evaluation is the foundation for automated spreadsheet reconciliations and data validation checks.\n\n### 1. Multi-Criteria Aggregations: `SUMIFS` & `COUNTIFS`\n- **Syntax Rules:**\n  - `=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)`\n  - Unlike `SUMIF`, the `sum_range` is **always the first argument** in `SUMIFS`.\n- **Date & Threshold Evaluation:** Operators are passed as quoted strings combined with cell references using `&`:\n  `=SUMIFS(D:D, B:B, \"Complete\", C:C, \">=\" & DATE(2024, 1, 1))`.\n- **Wildcard Matching:** Supports `?` (single char) and `*` (multi char):\n  `=COUNTIFS(A:A, \"*Data*\")` counts all cells containing the word 'Data'.\n\n### 2. Modern Dynamic Array Formulas (Spill Ranges)\nIn modern Excel, formulas that evaluate to multiple values automatically **spill** into neighboring cells (`#SPILL!` error if blocked):\n- **`UNIQUE(array)`:** Returns distinct values from a column (equivalent to SQL `SELECT DISTINCT`).\n- **`FILTER(array, include, [if_empty])`:** Returns all rows meeting conditional criteria without modifying source data (equivalent to SQL `WHERE`):\n  `=FILTER(A2:D100, (B2:B100=\"West\") * (C2:C100>5000), \"No records\")`\n  *Note:* The `*` operator performs boolean `AND`, while `+` performs boolean `OR`.\n- **`SORT(array, [sort_index], [sort_order])`:** Dynamically orders arrays ascending (1) or descending (-1).",
    "complexity": "Basic",
    "topics": [
      "excel-analytics"
    ],
    "tags": [
      "sumifs",
      "countifs",
      "filter-formula",
      "unique",
      "dynamic-arrays",
      "spill-ranges"
    ],
    "codeSnippet": "// Dynamic Filter with multiple criteria and automatic spilling\n=SORT(FILTER(A2:D100, (B2:B100=\"APAC\") * (D2:D100>100000), \"N/A\"), 4, -1)\n// Multi-condition conditional aggregation\n=SUMIFS(Amount_Col, Status_Col, \"Active\", Region_Col, \"North\")"
  },
  {
    "id": "excel-filtering-sorting-conditional-formatting",
    "qNo": 170,
    "q": "Data Hygiene & Formatting: How do you configure multi-level custom sorting, advanced autofilters with wildcards, and formula-based Conditional Formatting?",
    "a": "Data cleaning and visual anomaly highlighting are crucial for audit readiness.\n\n### 1. Multi-Level Custom Sorting\n- Standard sorting is alphabetical or numerical.\n- **Custom List Sorting:** Go to Data -> Sort -> Add Level. Choose **Custom List** to order categorical dimensions logically rather than alphabetically (e.g. `'Low' -> 'Medium' -> 'High' -> 'Critical'`, or `'Jan' -> 'Feb' -> ...`).\n\n### 2. Advanced AutoFilters with Wildcards\n- Click filter dropdown -> **Text Filters** -> **Contains** / **Custom Filter**.\n- `*corp*`: Matches any string containing 'corp'.\n- `~?` or `~*`: Escapes the literal question mark or asterisk character.\n\n### 3. Formula-Driven Conditional Formatting\nRather than simple cell value rules, applying formatting based on entire row logic requires custom formulas:\n- Select entire data range (e.g., `A2:G500`).\n- Go to Conditional Formatting -> **New Rule** -> **Use a formula to determine which cells to format**.\n- Enter formula with **column-locking ($) and relative row**:\n  `=$E2 > 10000` (Highlights the **entire row** whenever column E exceeds 10,000).\n- *Why the dollar sign matters:* `$E2` locks evaluation to column E across all cells in that row, while allowing the row number `2` to dynamically increment for rows 3, 4, etc.\n- For highlighting duplicate records: `=COUNTIF($A$2:$A$500, $A2) > 1`.",
    "complexity": "Basic",
    "topics": [
      "excel-analytics",
      "data-governance"
    ],
    "tags": [
      "conditional-formatting",
      "custom-sorting",
      "autofilters",
      "data-hygiene",
      "row-highlighting"
    ],
    "codeSnippet": "// Formula for conditional formatting highlighting overdue invoices\n=AND($D2=\"Unpaid\", $E2 < TODAY())\n// Highlighting duplicate business keys\n=COUNTIF($A$2:$A$1000, $A2) > 1"
  },
  {
    "id": "excel-charts-dashboards-visual-analytics",
    "qNo": 171,
    "q": "Charting & Dashboard Design: Compare Waterfall, Pareto (80/20), and Combo Secondary-Axis charts. How do you design executive KPI dashboards in Excel?",
    "a": "Effective spreadsheet dashboards present high-density business metrics cleanly without cognitive clutter.\n\n### 1. Chart Types and Strategic Use Cases\n- **Waterfall Chart (Bridge Chart):**\n  - Visualizes how an initial starting value increases or decreases across positive/negative variance components to reach a final total (e.g. Operating Income -> Revenue additions -> COGS -> Tax -> Net Income).\n  - In Excel: Right-click summary columns and select **Set as Total** to anchor baseline bars.\n- **Pareto Chart (80/20 Principle):**\n  - Combines individual category frequencies (sorted descending in columns) with an overlaid cumulative percentage line on a secondary axis.\n  - Pinpoints the \"vital few\" inputs causing the majority of outcomes (e.g. 20% of customers driving 80% of total returns).\n- **Combo Secondary-Axis Chart:**\n  - Pairs metrics of vastly different magnitudes (e.g. Revenue in millions on Left Primary Axis as Clustered Column, paired with Profit Margin % on Right Secondary Axis as a Line).\n\n### 2. Executive KPI Dashboard Architecture\n1. **Data Model Layer:** Raw transactional data stored in an Excel Table (`Ctrl + T`) named `tbl_transactions` (never raw unbounded sheets).\n2. **Calculation Layer:** Hidden backend tab housing Pivot Tables and dynamic array summaries.\n3. **Presentation Layer:** Clean canvas with gridlines turned off (`View -> uncheck Gridlines`), prominent KPI metric cards, connected slicers, and dynamic charts.",
    "complexity": "Basic",
    "topics": [
      "excel-analytics",
      "data-viz-bi"
    ],
    "tags": [
      "excel-charts",
      "waterfall-chart",
      "pareto-chart",
      "kpi-dashboards",
      "secondary-axis"
    ],
    "codeSnippet": "// Dynamic Chart Title referencing KPI cell\n=\"FY26 Regional Performance — Total Volume: \" & TEXT(SUM(tbl_sales[Revenue]), \"$#,##0\")"
  }
];
