// Auto-generated module: unixShell
// Primary questions count: 6

export const unixShellQuestions = [
  {
    "id": "unix-log-parsing-awk-sed-grep-oneliners",
    "qNo": 124,
    "q": "Data Engineering with the Unix Toolchain: Write real-world command-line one-liners using awk, sed, grep, sort, and uniq to parse massive web server logs and extract metrics.",
    "a": "While distributed engines like Spark and BigQuery handle enterprise workloads, senior data engineers rely on the Unix toolchain for instantaneous ad-hoc analysis, log debugging, and quick data validation directly on remote servers.\n\n### 1. Real-World Scenario: Analyzing Nginx Access Logs\nSample log line:\n```text\n192.168.1.50 - - [10/Oct/2024:14:32:10 +0000] \"POST /api/v1/checkout HTTP/1.1\" 500 2412 \"https://store.com\" \"Mozilla/5.0\"\n```\n\n#### Task 1: Find Top 10 IP Addresses Hitting the API with 5xx Server Errors\n```bash\n# Filter 5xx status codes, extract IP (field 1), count occurrences, sort descending\nawk '$9 ~ /^50/ { print $1 }' access.log | sort | uniq -c | sort -rn | head -n 10\n```\n- `$9 ~ /^50/`: Evaluates column 9 (HTTP status code) against regex matching 500, 502, 503, 504.\n- `sort | uniq -c`: Groups identical IPs and prepends frequency count.\n- `sort -rn | head -n 10`: Sorts numerically descending and outputs the top 10 culprits.\n\n#### Task 2: Calculate Average Response Size (Bytes) for POST Requests\n```bash\n# Field $6 is HTTP verb, Field $10 is response byte size\nawk '$6 == \"\"POST\" && $10 ~ /^[0-9]+$/ { sum += $10; count++ } END { if (count > 0) print \"Average POST bytes:\", sum / count; else print \"No records\" }' access.log\n```\n\n#### Task 3: Sanitizing & Masking PII using sed\nMask credit card / SSN patterns (`XXX-XX-XXXX`) with `REDACTED` before streaming to analytics:\n```bash\nsed -E 's/[0-9]{3}-[0-9]{2}-[0-9]{4}/REDACTED/g' raw_stream.txt > clean_stream.txt\n```\n\n#### Task 4: Extracting JSON payloads and sorting by timestamp with grep & jq\n```bash\n# Extract only lines containing JSON payload, parse event_name and count frequencies\ngrep -o '{.*}' application.log | jq -r '.event_name' | sort | uniq -c | sort -rn\n```",
    "complexity": "Basic",
    "topics": [
      "unix-shell"
    ],
    "tags": [
      "awk",
      "sed",
      "grep",
      "log-parsing",
      "regex-extraction",
      "sort-uniq",
      "cli-analytics"
    ],
    "codeSnippet": "# Top 10 error endpoints in Nginx access log\nawk '$9 >= 400 { print $7 }' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -n 10"
  },
  {
    "id": "unix-bash-scripting-robust-etl-pipelines",
    "qNo": 125,
    "q": "How do you write production-grade, resilient Bash scripts for data pipelines? Explain `set -euo pipefail`, signal traps, logging functions, and exit code propagation.",
    "a": "Writing bash scripts for data engineering requires strict defensive programming. A poorly written shell script will fail silently halfway through an ETL run, creating corrupted data and masked failures.\n\n### 1. The Holy Grail: `set -euo pipefail`\nEvery production bash script must start with:\n```bash\n#!/usr/bin/env bash\nset -euo pipefail\nIFS=$'\\n\\t'\n```\n1. **`-e` (errexit):** Immediately aborts script execution if any command exits with a non-zero status code.\n2. **`-u` (nounset):** Treats uninitialized variables as errors and exits immediately (prevents catastrophic commands like `rm -rf ${DEST_DIR}/` if `DEST_DIR` was accidentally not set!).\n3. **`-o pipefail`:** In a pipeline like `cmd1 | cmd2 | cmd3`, bash normally returns the exit status of `cmd3` alone. With `pipefail`, the pipeline fails if **any** command in the chain fails!\n4. **`IFS=$'\\n\\t'`:** Sets Internal Field Separator to newline and tab, preventing spaces in filenames from breaking for-loops.\n\n### 2. Signal Handling with `trap` (Deterministic Cleanup)\nIf a script fails, crashes, or is killed via `SIGTERM` (kill signal), temporary files or locked resources must be cleaned up:\n```bash\n# Define a cleanup function\ncleanup() {\n    local exit_code=$?\n    echo \"[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] Cleaning up temporary files...\"\n    rm -f /tmp/staging_data_*.csv\n    if [ $exit_code -ne 0 ]; then\n        echo \"[ERROR] Pipeline failed with exit code $exit_code!\"\n        # Send Slack or PagerDuty alert here\n    fi\n    exit $exit_code\n}\n\n# Trap EXIT and system signals\ntrap cleanup EXIT INT TERM\n```\n\n### 3. Production ETL Script Template\n```bash\n#!/usr/bin/env bash\nset -euo pipefail\nIFS=$'\\n\\t'\n\nLOG_FILE=\"/var/log/etl_$(date +%Y%m%d).log\"\nexec > >(tee -a \"${LOG_FILE}\") 2>&1\n\nlog() {\n    echo \"[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] [INFO] $*\"\n}\n\nTMP_FILE=$(mktemp /tmp/etl_extract_XXXXXX.csv)\ntrap 'rm -f \"${TMP_FILE}\"' EXIT\n\nlog \"Starting extraction from database...\"\npython3 -m pipelines.extract --output \"${TMP_FILE}\"\n\nlog \"Validating record count...\"\nROW_COUNT=$(wc -l < \"${TMP_FILE}\")\nif [ \"${ROW_COUNT}\" -le 1 ]; then\n    echo \"[ERROR] Extracted file is empty!\" >&2\n    exit 1\nfi\n\nlog \"Loading ${ROW_COUNT} records to Cloud Storage...\"\ngsutil cp \"${TMP_FILE}\" \"gs://my-bucket/lake/$(date +%Y/%m/%d)/orders.csv\"\nlog \"ETL completed successfully.\"\n```",
    "complexity": "Intermediate",
    "topics": [
      "unix-shell",
      "cicd-devops"
    ],
    "tags": [
      "set-euo-pipefail",
      "trap-handlers",
      "error-logging",
      "bash-etl",
      "exit-codes",
      "defensive-scripting"
    ],
    "codeSnippet": "#!/usr/bin/env bash\nset -euo pipefail\nIFS=$'\\n\\t'\n\ntrap 'echo \"Script interrupted. Cleaning up...\"; rm -f /tmp/lock.file; exit 1' INT TERM EXIT"
  },
  {
    "id": "unix-cron-routines-flock-locking-vs-orchestrators",
    "qNo": 126,
    "q": "How does Linux Cron work for scheduled data jobs? How do you prevent overlapping runs using `flock`, and when should you migrate from Cron to Apache Airflow?",
    "a": "Cron is the Unix daemon that executes scheduled commands at specified intervals defined in a `crontab` file.\n\n### 1. Crontab Syntax & Environment Pitfalls\n```text\n# ┌───────────── Minute (0 - 59)\n# │ ┌─────────── Hour (0 - 23)\n# │ │ ┌───────── Day of month (1 - 31)\n# │ │ │ ┌─────── Month (1 - 12)\n# │ │ │ │ ┌───── Day of week (0 - 6) (0 = Sunday)\n# * * * * * command_to_execute\n  0 2 * * * /usr/local/bin/daily_sync.sh >> /var/log/sync.log 2>&1\n```\n- **The #1 Cron Pitfall: Stripped Environment Variables:** Cron runs in a stripped, non-interactive shell without loading `~/.bashrc` or `~/.profile`. Variables like `$PATH`, `$PYTHONPATH`, or `$JAVA_HOME` are missing. Always source your environment explicitly or use absolute executable paths:\n```bash\n0 2 * * * . /home/de/.env; /home/de/venv/bin/python /home/de/etl.py\n```\n\n### 2. Preventing Overlapping Jobs with `flock`\nIf a batch ETL job scheduled to run every 15 minutes takes 25 minutes to complete due to high data volume, a second instance will start while the first is still running, causing race conditions and database deadlocks!\n- **Solution:** Use Linux **`flock`** (file lock) to guarantee atomic single-instance execution:\n```bash\n*/15 * * * * /usr/bin/flock -n /var/lock/etl_hourly.lock /home/de/scripts/run_etl.sh\n```\n  - `-n` (non-blocking): If the lock file is already held by a running process, `flock` exits immediately with code 1 instead of waiting or executing a second instance.\n\n### 3. When to Migrate from Cron to Modern Orchestrators (Airflow/Dagster)\nMigrate when you encounter:\n1. **Complex Dependencies (DAGs):** Job B must run only after Job A succeeds, and Job C needs both A and B. In Cron, you guess time offsets (Job A at 2 AM, Job B at 3 AM), leading to fragile race conditions.\n2. **Backfills & Historical Reruns:** Rerunning a pipeline for a specific date 6 months ago is painful in Cron.\n3. **Task Failure Alerting & Retries:** Airflow provides automatic exponential backoff retries, SLA monitoring, and alerting out of the box.\n4. **Visibility & Lineage:** Airflow provides a rich UI displaying execution durations, Gantt charts, logs, and task dependencies.",
    "complexity": "Intermediate",
    "topics": [
      "unix-shell",
      "cloud-composer"
    ],
    "tags": [
      "cron-jobs",
      "flock-locking",
      "overlapping-runs",
      "environment-variables",
      "cron-vs-airflow",
      "orchestration"
    ],
    "codeSnippet": "# Using flock in crontab to prevent concurrent executions\n*/10 * * * * flock -n /tmp/etl.lock -c \"/usr/bin/python3 /opt/etl/sync_tables.py >> /var/log/sync.log 2>&1\""
  },
  {
    "id": "unix-linux-process-memory-oom-killer-debugging",
    "qNo": 127,
    "q": "How do you debug high CPU, memory leaks, and I/O bottlenecks in Linux? Explain `top`, `htop`, `iotop`, `vmstat`, and the mechanics of the Linux Out-Of-Memory (OOM) Killer.",
    "a": "When distributed workers or ETL servers crash or hang, data engineers must understand system-level performance diagnostics to identify whether the bottleneck is CPU starvation, memory exhaustion, disk I/O wait, or network saturation.\n\n### 1. The Linux Performance Diagnostics Toolkit\n1. **`top` / `htop` (CPU & Process Monitoring):**\n   - **Load Average (1, 5, 15 min):** Measures number of runnable processes. If load average > number of CPU cores, the CPU is saturated and tasks are queueing.\n   - **`%wa` (I/O Wait):** Percentage of time the CPU is idling waiting for disk I/O or network responses. If `%wa > 25%`, your database or disk drive is the bottleneck, not your Python code!\n2. **`vmstat 1` (Virtual Memory & Swapping):**\n   - Columns `si` (swap in) and `so` (swap out).\n   - If `si` and `so` are non-zero and growing, your physical RAM is completely exhausted and the Linux kernel is swapping memory pages to disk, causing performance to drop by 1,000x!\n3. **`iotop -o` (Disk I/O per Process):**\n   - Shows real-time disk read/write throughput per process to pinpoint rogue processes thrashing the drive.\n4. **`dmesg -T | grep -i oom` (Diagnosing the Linux OOM Killer):**\n   - When the Linux kernel completely runs out of physical RAM and swap space, it invokes the **Out-Of-Memory (OOM) Killer**.\n\n### 2. How the Linux OOM Killer Works\nThe kernel assigns an **`oom_score`** (0 to 1,000) to every running process based on memory usage:\n$$\\text{Score} \\propto \\frac{\\text{Process RSS RAM}}{\\text{Total System RAM}}$$\n- The kernel picks the process with the highest score and sends **`SIGKILL (9)`** to instantaneously reclaim memory.\n- In data engineering, the victim is almost always your heavy PySpark worker, Python Pandas script, or Java JVM!\n- The process dies immediately with exit code **137** ($128 + 9$).\n\n### 3. Inspecting a Process in `/proc`\n```bash\n# Check memory limits and OOM score for process PID 4512\ncat /proc/4512/oom_score\ncat /proc/4512/status | grep -E \"VmRSS|VmSwap|VmPeak\"\n```",
    "complexity": "Intermediate",
    "topics": [
      "unix-shell",
      "distributed-systems"
    ],
    "tags": [
      "top-htop",
      "oom-killer",
      "vmstat",
      "proc-filesystem",
      "memory-leaks",
      "resource-debugging",
      "exit-code-137"
    ],
    "codeSnippet": "# Check kernel logs for OOM killer executions\ndmesg -T | grep -i -E \"oom-killer|out of memory|killed process\"\n# Output sample:\n# [Wed Oct 10 14:22:01 2024] Out of memory: Kill process 12415 (python) score 852 or sacrifice child"
  },
  {
    "id": "unix-streaming-pipes-fifos-xargs-large-files",
    "qNo": 128,
    "q": "How do Unix Pipes, Named Pipes (FIFOs), and `xargs` enable processing multi-gigabyte datasets without memory exhaustion? Provide real ETL pipeline examples.",
    "a": "One of the most powerful paradigms in computer science is the **Unix Pipeline Philosophy**: write programs that do one thing well and communicate via standard text streams (`stdin`, `stdout`).\n\n### 1. Anonymous Pipes (`|`) & Memory Efficiency\nWhen you run `cat massive.csv | grep \"ERROR\" | cut -d',' -f1,3 > errors.csv`:\n- Linux does **not** load the entire file into RAM, nor does it write intermediate results to disk.\n- Data flows through a 64KB kernel memory buffer (pipe buffer).\n- When the buffer fills, the upstream process (`cat`) is paused by the kernel until the downstream process (`grep`) consumes the data, providing automatic **backpressure**!\n\n### 2. Named Pipes (FIFOs) for Diskless ETL\nA **Named Pipe (FIFO - First In, First Out)** is an inter-process communication mechanism that appears as a physical file on the filesystem (`mkfifo /tmp/my_pipe`), but stores zero bytes on disk:\n- When Process A writes to the FIFO, it blocks until Process B reads from it.\n- **Enterprise Use Case:** Loading a 100GB compressed `.gz` file into a database that cannot read compressed files without decompressing 500GB of uncompressed data onto disk:\n```bash\n# Create the named pipe\nmkfifo /tmp/stream_pipe\n\n# Background decompressor writes uncompressed stream to the pipe\ngzip -dc /mnt/storage/raw_dump.csv.gz > /tmp/stream_pipe &\n\n# Database loader reads directly from the FIFO as if it were a normal file!\npsql -c \"copy table_name FROM '/tmp/stream_pipe' WITH CSV HEADER;\"\n\n# Cleanup\nrm -f /tmp/stream_pipe\n```\nThe operation completes at memory-stream speeds using zero extra disk space!\n\n### 3. Parallel Processing with `xargs -P`\nProcess hundreds of files concurrently using all available CPU cores without writing multithreaded code:\n```bash\n# Compress 100 log files using 8 parallel worker processes\nfind /var/logs/ -name \"*.log\" | xargs -P 8 -I {} gzip {}\n\n# Concurrently download files from a list of URLs using 16 parallel threads\ncat file_urls.txt | xargs -P 16 -n 1 curl -O\n```",
    "complexity": "Intermediate",
    "topics": [
      "unix-shell",
      "python"
    ],
    "tags": [
      "unix-pipes",
      "fifos",
      "named-pipes",
      "xargs-parallel",
      "streaming-processing",
      "memory-efficiency",
      "backpressure"
    ],
    "codeSnippet": "# Creating and using a FIFO for diskless streaming\nmkfifo /tmp/etl_fifo\ngzip -dc massive_data.csv.gz > /tmp/etl_fifo &\npython3 process_stream.py < /tmp/etl_fifo\nrm /tmp/etl_fifo"
  },
  {
    "id": "unix-data-transfer-rsync-curl-checksum-verification",
    "qNo": 129,
    "q": "How do you reliably automate file transfers in data pipelines using `rsync`, `curl`, and checksum verification (`sha256sum`)?",
    "a": "Transferring multi-gigabyte data dumps between on-prem servers, FTP gateways, and cloud endpoints is a recurring ETL task. Doing this reliably requires resume capabilities, bandwidth controls, and mathematical data integrity verification.\n\n### 1. Robust File Synchronization with `rsync`\n```bash\nrsync -avzP --partial --bwlimit=50000 /data/export/ user@remote:/data/incoming/\n```\n- **`-a` (archive):** Recursively copies directories while preserving file permissions, timestamps, owner, and symlinks.\n- **`-v` (verbose) & `-z` (compress):** Compresses data blocks in flight across the network, drastically speeding up transfer of CSV/JSON files.\n- **`--partial` / `-P`:** If the network connection drops halfway through a 50GB file transfer, `rsync` retains the partial chunk and **resumes where it left off** rather than restarting from 0!\n- **`--bwlimit=50000`:** Limits transfer bandwidth to 50MB/s, preventing your batch ETL transfer from choking production network traffic.\n\n### 2. Resilient API Downloads with `curl`\n```bash\ncurl -fSL --retry 5 --retry-delay 10 --retry-max-time 300 -o data.json \"https://api.partner.com/export\"\n```\n- **`-f` (fail):** Fails silently on HTTP 4xx/5xx errors instead of saving the error HTML page as `data.json`.\n- **`-S` & `-L`:** Shows error messages and automatically follows HTTP 301/302 redirects.\n- **`--retry 5`:** Automatically retries up to 5 times on transient network failures or 5xx server responses using exponential backoff.\n\n### 3. Mathematical Verification with `sha256sum`\nNever trust network transfers blindly; silent bit rot or truncated downloads corrupt analytics downstream:\n```bash\n# Sender generates checksums\nsha256sum /data/export/orders_2024.parquet > checksums.sha256\n\n# Receiver transfers both files and validates mathematically\nsha256sum -c checksums.sha256\n# Returns: orders_2024.parquet: OK\n```",
    "complexity": "Basic",
    "topics": [
      "unix-shell",
      "cicd-devops"
    ],
    "tags": [
      "rsync",
      "curl-retry",
      "sftp-automation",
      "checksums-sha256",
      "atomic-file-transfers",
      "data-integrity"
    ],
    "codeSnippet": "# Automated transfer script with SHA256 integrity verification\nrsync -avz --partial /exports/data.csv remote:/landing/\nssh remote \"cd /landing && sha256sum -c data.csv.sha256\""
  }
];
