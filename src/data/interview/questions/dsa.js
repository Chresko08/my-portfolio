// Modular question module: dsa (Data Structures & Algorithms)
// Primary questions count: 6

export const dsaQuestions = [
  {
    "id": "dsa-arrays-two-pointers-sliding-window",
    "qNo": 156,
    "q": "Arrays & Strings: Master Two Pointers and Sliding Window patterns. Demonstrate solving 'Longest Substring Without Repeating Characters' in O(N) time.",
    "a": "Two Pointers and Sliding Window are the most foundational algorithmic patterns tested in software engineering loops (FAANG, product tech, and high-bar data platforms).\n\n### 1. Two Pointers vs Sliding Window\n- **Two Pointers:** Typically used on sorted arrays or palindromes (e.g., one pointer at `left=0`, another at `right=len-1` moving towards each other, or slow/fast cycle detection).\n- **Sliding Window:** Used for contiguous subarray or substring problems where a window expands to include valid elements and contracts from the left when constraints are violated.\n\n### 2. LeetCode #3: Longest Substring Without Repeating Characters (O(N))\n- **Problem:** Given string `s`, find the length of the longest substring without repeating characters.\n- **Approach:** Maintain a sliding window `[left, right]` and a hash map storing the **last seen index** of each character. When `s[right]` is already in the map and within the current window (`char_map[char] >= left`), contract the window by jumping `left = char_map[char] + 1`.\n\n```python\ndef length_of_longest_substring(s: str) -> int:\n    char_last_seen = {}\n    max_len = 0\n    left = 0\n    \n    for right, char in enumerate(s):\n        if char in char_last_seen and char_last_seen[char] >= left:\n            left = char_last_seen[char] + 1\n        char_last_seen[char] = right\n        max_len = max(max_len, right - left + 1)\n        \n    return max_len\n\n# Verification\nassert length_of_longest_substring(\"abcabcbb\") == 3 # \"abc\"\nassert length_of_longest_substring(\"pwwkew\") == 3    # \"wke\"\n```\n- **Complexity:** Time: $O(N)$ (each character visited at most twice); Space: $O(\\min(N, \\Sigma))$ auxiliary hash map where $\\Sigma$ is the alphabet size.",
    "complexity": "Intermediate",
    "topics": [
      "dsa",
      "python"
    ],
    "tags": [
      "two-pointers",
      "sliding-window",
      "strings",
      "arrays",
      "hash-map",
      "leetcode-3"
    ],
    "codeSnippet": "def length_of_longest_substring(s: str) -> int:\n    seen, left, max_len = {}, 0, 0\n    for right, ch in enumerate(s):\n        if ch in seen and seen[ch] >= left:\n            left = seen[ch] + 1\n        seen[ch] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len"
  },
  {
    "id": "dsa-searching-binary-search-rotated-array",
    "qNo": 157,
    "q": "Searching Algorithms: Explain Binary Search boundary conditions and demonstrate searching an element in a Rotated Sorted Array in O(log N) time (LeetCode 33).",
    "a": "Binary Search ($O(\\log N)$) is the cornerstone of logarithmic searching. The critical test of mastery is handling arrays rotated around an unknown pivot.\n\n### 1. Binary Search Invariants\n- Use `mid = left + (right - left) // 2` to prevent 32-bit integer overflow.\n- Standard search requires a monotonically sorted space. However, in a **rotated sorted array** (e.g. `[4, 5, 6, 7, 0, 1, 2]`), at least one half of the array (`[left, mid]` or `[mid, right]`) is **always normally sorted**!\n\n### 2. LeetCode #33: Search in Rotated Sorted Array\n- **Algorithm:**\n  1. Calculate `mid`.\n  2. If `nums[mid] == target`, return `mid`.\n  3. Check which half is sorted:\n     - If `nums[left] <= nums[mid]`: Left half is normally sorted.\n       - If `nums[left] <= target < nums[mid]`: Target lies inside left half -> `right = mid - 1`.\n       - Else: Target must be in right half -> `left = mid + 1`.\n     - Else (`nums[mid] < nums[right]`): Right half is normally sorted.\n       - If `nums[mid] < target <= nums[right]`: Target lies inside right half -> `left = mid + 1`.\n       - Else: Target must be in left half -> `right = mid - 1`.\n\n```python\ndef search_rotated(nums: list[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        \n        # Left half is sorted\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        # Right half is sorted\n        else:\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n    return -1\n\n# Verification\nassert search_rotated([4, 5, 6, 7, 0, 1, 2], 0) == 4\nassert search_rotated([4, 5, 6, 7, 0, 1, 2], 3) == -1\n```",
    "complexity": "Intermediate",
    "topics": [
      "dsa",
      "python"
    ],
    "tags": [
      "binary-search",
      "rotated-array",
      "logarithmic-search",
      "divide-and-conquer",
      "leetcode-33"
    ],
    "codeSnippet": "def search_rotated(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = l + (r - l) // 2\n        if nums[m] == target: return m\n        if nums[l] <= nums[m]:\n            if nums[l] <= target < nums[m]: r = m - 1\n            else: l = m + 1\n        else:\n            if nums[m] < target <= nums[r]: l = m + 1\n            else: r = m - 1\n    return -1"
  },
  {
    "id": "dsa-sorting-quicksort-mergesort-heapsort",
    "qNo": 158,
    "q": "Sorting Algorithms Deep Dive: Compare QuickSort, MergeSort, and HeapSort across time complexity, space complexity, stability, and production systems usage.",
    "a": "Understanding sorting internals is critical both for algorithmic interviews and for distributed engines (Spark/MapReduce shuffle sorts).\n\n### 1. Comparison Matrix\n| Algorithm | Best Time | Average Time | Worst Time | Space | Stable? | In-Place? |\n|---|---|---|---|---|---|---|\n| **QuickSort** | $O(N \\log N)$ | $O(N \\log N)$ | $O(N^2)$ (sorted data) | $O(\\log N)$ | No | Yes |\n| **MergeSort** | $O(N \\log N)$ | $O(N \\log N)$ | $O(N \\log N)$ | $O(N)$ | **Yes** | No |\n| **HeapSort** | $O(N \\log N)$ | $O(N \\log N)$ | $O(N \\log N)$ | $O(1)$ | No | Yes |\n| **Timsort** (Python/Java) | $O(N)$ | $O(N \\log N)$ | $O(N \\log N)$ | $O(N)$ | **Yes** | No |\n\n### 2. When to Use Which?\n- **MergeSort:** Guarantees $O(N \\log N)$ in all cases and preserves relative order of identical elements (**stable**). Ideal for **external sorting** (sorting datasets on disk that exceed RAM) and distributed shuffles where records stream into external runs.\n- **QuickSort:** In-place and has small constant factors due to high CPU cache locality. Standard for in-memory primitive sorting (randomized pivot mitigates $O(N^2)$ worst-case).\n- **HeapSort:** Guarantees $O(1)$ auxiliary space and $O(N \\log N)$ worst-case, but poor cache locality (jumping across array children) makes it slower than QuickSort in practice.\n- **Python's `sorted()` (Timsort):** A hybrid of MergeSort and InsertionSort designed to take advantage of naturally existing sorted runs in real-world data ($O(N)$ best case).",
    "complexity": "Intermediate",
    "topics": [
      "dsa",
      "distributed-systems"
    ],
    "tags": [
      "sorting",
      "quicksort",
      "mergesort",
      "heapsort",
      "stability",
      "timsort",
      "time-complexity"
    ],
    "codeSnippet": "# Python Timsort: Adaptive, stable O(N log N) sorting with O(N) best case\ndata = [42, 12, 88, 3, 21]\ndata.sort() # In-place Timsort"
  },
  {
    "id": "dsa-recursion-backtracking-subsets-permutations",
    "qNo": 159,
    "q": "Recursion & Backtracking: Explain base case design, call stack growth, and implement generating all Subsets (Power Set) and Permutations of a list.",
    "a": "Backtracking is an algorithmic paradigm that systematically searches the solution space by incrementally building candidates and abandoning (\"backtracking\") a candidate as soon as it determines it cannot possibly lead to a valid solution.\n\n### 1. The Backtracking Blueprint\nEvery backtracking function follows a 3-step cadence:\n1. **Base Case:** If current state satisfies terminal condition, record solution.\n2. **Iterate & Choose:** For each candidate choice, make the move (append to path).\n3. **Recurse & Unchoose (Backtrack):** Recurse to next depth, then undo the move (pop from path).\n\n### 2. Subsets (Power Set — LeetCode 78)\n- Generates all $2^N$ combinations. At each index, we decide to either include or exclude the element.\n```python\ndef subsets(nums: list[int]) -> list[list[int]]:\n    result = []\n    \n    def backtrack(start: int, path: list[int]):\n        result.append(list(path))\n        for i in range(start, len(nums)):\n            path.append(nums[i])      # Choose\n            backtrack(i + 1, path)    # Explore\n            path.pop()                # Backtrack / Unchoose\n            \n    backtrack(0, [])\n    return result\n\n# Verification\nassert len(subsets([1, 2, 3])) == 8 # 2^3 subsets\n```\n\n### 3. Permutations (LeetCode 46)\n- Generates all $N!$ orderings. Uses a `used` boolean array or set tracking elements included in the current branch.\n- Complexity: Time: $O(N \\times N!)$, Space: $O(N)$ recursion depth.",
    "complexity": "Intermediate",
    "topics": [
      "dsa",
      "python"
    ],
    "tags": [
      "recursion",
      "backtracking",
      "subsets",
      "permutations",
      "call-stack",
      "leetcode-78"
    ],
    "codeSnippet": "def subsets(nums):\n    res = []\n    def dfs(start, path):\n        res.append(list(path))\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            dfs(i + 1, path)\n            path.pop()\n    dfs(0, [])\n    return res"
  },
  {
    "id": "dsa-hashing-two-sum-collision-resolution",
    "qNo": 160,
    "q": "Hashing Internals & Algorithms: How do Hash Maps achieve O(1) lookups? Solve the 'Two Sum' problem in O(N) time and explain Hash Collision resolution.",
    "a": "Hash Tables are the workhorse data structure for $O(1)$ constant-time key-value mapping.\n\n### 1. Hash Collision Resolution Mechanisms\nWhen different keys hash to the same bucket index (`hash(k1) % capacity == hash(k2) % capacity`):\n- **Separate Chaining (Used in Java HashMap):** Each bucket is a linked list (or Red-Black tree when size exceeds 8). Collisions simply append to the list. Degradation to $O(N)$ if hash distribution is poor.\n- **Open Addressing (Used in Python Dicts):** All elements reside directly in the bucket array. On collision, probe alternative slots via:\n  - *Linear Probing:* Check `index + 1`, `index + 2` (causes primary clustering).\n  - *Quadratic / Perturbation Probing:* Checks pseudo-random spread across empty slots.\n\n### 2. LeetCode #1: Two Sum in O(N) Time\n- **Problem:** Given array `nums` and integer `target`, return indices of two numbers that add up to `target`.\n- **Brute Force:** Nested loops testing every pair -> $O(N^2)$ time.\n- **Hash Map Solution ($O(N)$ time, $O(N)$ space):** As you iterate through `nums`, compute `complement = target - num`. If `complement` exists in the hash map, return its stored index and current index. Otherwise, record `seen[num] = i`.\n\n```python\ndef two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {} # value -> index\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\n# Verification\nassert two_sum([2, 7, 11, 15], 9) == [0, 1]\n```",
    "complexity": "Basic",
    "topics": [
      "dsa",
      "python"
    ],
    "tags": [
      "hashing",
      "two-sum",
      "hash-collisions",
      "chaining",
      "open-addressing",
      "leetcode-1"
    ],
    "codeSnippet": "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen: return [seen[diff], i]\n        seen[n] = i\n    return []"
  },
  {
    "id": "dsa-dynamic-programming-memoization-tabulation",
    "qNo": 161,
    "q": "Dynamic Programming (DP): Explain Top-Down Memoization vs Bottom-Up Tabulation. Demonstrate solving the 'Coin Change' problem (LeetCode 322).",
    "a": "Dynamic Programming solves complex problems by breaking them into overlapping subproblems and optimal substructure, caching intermediate results to avoid redundant exponential re-computation.\n\n### 1. Top-Down (Memoization) vs Bottom-Up (Tabulation)\n- **Top-Down (Memoization):** Natural recursive approach starting at the original problem. Uses a hash map or cache (`@functools.lru_cache`) to store results of subproblems. *Trade-off:* Elegant and visits only reachable states, but incurs recursion call stack overhead.\n- **Bottom-Up (Tabulation):** Iterative approach starting at base cases (e.g. `dp[0]`) and systematically filling a DP table up to target `dp[n]`. *Trade-off:* No recursion depth limits, optimal cache locality, and allows space optimization (rolling array).\n\n### 2. LeetCode #322: Coin Change (Minimum Coins to Make Amount)\n- **Problem:** Given coins `[1, 2, 5]` and `amount = 11`, find fewest coins needed to make `amount`.\n- **DP State Definition:** `dp[i]` = minimum coins required to make amount `i`.\n- **Base Case:** `dp[0] = 0` (0 coins to make amount 0).\n- **Recurrence Relation:** For every coin in coins: `dp[i] = min(dp[i], dp[i - coin] + 1)`.\n\n```python\ndef coin_change(coins: list[int], amount: int) -> int:\n    # Initialize dp array with infinity\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    \n    for i in range(1, amount + 1):\n        for coin in coins:\n            if i - coin >= 0:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n                \n    return dp[amount] if dp[amount] != float('inf') else -1\n\n# Verification\nassert coin_change([1, 2, 5], 11) == 3 # 5 + 5 + 1\nassert coin_change([2], 3) == -1\n```\n- **Complexity:** Time: $O(N \\times \\text{amount})$ where $N$ is number of coin denominations; Space: $O(\\text{amount})$ DP array.",
    "complexity": "Intermediate",
    "topics": [
      "dsa",
      "python"
    ],
    "tags": [
      "dynamic-programming",
      "memoization",
      "tabulation",
      "coin-change",
      "knapsack",
      "leetcode-322"
    ],
    "codeSnippet": "def coin_change(coins, amount):\n    dp = [0] + [float('inf')] * amount\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i - c >= 0: dp[i] = min(dp[i], dp[i - c] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1"
  }
];
