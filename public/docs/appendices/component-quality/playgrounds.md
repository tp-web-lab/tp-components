# Playgrounds component quality

> Latest recorded executions: **1 distinct failing test affects this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This report covers the nine public components in the **Playgrounds** catalogue. Coverage includes every production TypeScript file owned by each component, including its project model and execution-document builders; shared integration suites are not attributed repeatedly in the Tests column.

The 16 test files were executed; failures are recorded above. 9 of 9 measured components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-asciidoc-playground` | 2 | 100% | 100% | 100% | 87.71% | Target met |
| `tp-html-playground` | 3 | 97.14% | 97.27% | 100% | 87.87% | Target met |
| `tp-javascript-playground` | 1 | 91.93% | 91.93% | 96% | 83.78% | Target met |
| `tp-markdown-playground` | 5 | 93.65% | 93.65% | 93.54% | 86.66% | Target met |
| `tp-prolog-playground` | 8 | 93.8% | 93.85% | 94.11% | 84.54% | Target met |
| `tp-python-playground` | 3 | 98.71% | 98.71% | 96.55% | 88.33% | Target met |
| `tp-restructuredtext-playground` | 3 | 96.92% | 96.92% | 97.14% | 84.9% | Target met |
| `tp-sql-playground` | 2 | 100% | 100% | 100% | 81.17% | Target met |
| `tp-typescript-playground` | 1 | 96.49% | 96.49% | 100% | 82.92% | Target met |
| **Total (weighted averages)** | **28** | **96.42%** | **96.47%** | **97.18%** | **85.34%** | **Target met** |

Run `pnpm quality:playgrounds` to execute the family suite, refresh V8 coverage, and regenerate this page. Targets are advisory; failing tests remain technical failures.
