# Viewers component quality

> Latest recorded executions: **4 distinct failing tests affect this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This report covers the ten public components in the **Viewers** catalogue and the internal `tp-markup-viewer` foundation that owns their shared editing, layout, rendering, iframe, and cleanup behavior. Measuring the foundation explicitly prevents inherited behavior from disappearing from the assessment. Programming viewers are also checked through their compact playground integration.

The 18 test files were executed; failures are recorded above, including shared integration suites that exercise programming, Markdown, and AsciiDoc behavior across component boundaries. 11 of 11 measured components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches. The per-component Tests column counts only tests with a single directory owner; shared integration tests are deliberately not attributed repeatedly.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-asciidoc-viewer` | 2 | 100% | 100% | 100% | 85.29% | Target met |
| `tp-html-viewer` | 14 | 90.87% | 90.97% | 98.24% | 82.82% | Target met |
| `tp-javascript-viewer` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-markdown-viewer` | 2 | 100% | 100% | 100% | 81.57% | Target met |
| `tp-markup-viewer` | 25 | 96.33% | 95.34% | 95.34% | 86.63% | Target met |
| `tp-object-tree` | 6 | 93.87% | 92.03% | 96.66% | 80.8% | Target met |
| `tp-prolog-viewer` | 2 | 94.44% | 94.59% | 100% | 81.57% | Target met |
| `tp-python-viewer` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-restructuredtext-viewer` | 7 | 100% | 100% | 100% | 86.36% | Target met |
| `tp-sql-viewer` | 2 | 100% | 100% | 100% | 90.9% | Target met |
| `tp-typescript-viewer` | 1 | 100% | 100% | 100% | 100% | Target met |
| **Total (weighted averages)** | **63** | **95.05%** | **94.44%** | **97.14%** | **83.92%** | **Target met** |

Run `pnpm quality:viewers` to execute the family suite, refresh V8 coverage, and regenerate this page. Targets are advisory; failing tests remain technical failures.
