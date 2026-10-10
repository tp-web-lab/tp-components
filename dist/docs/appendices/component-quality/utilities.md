# Utility component quality

> Latest recorded executions: **4 distinct failing tests affect this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This family report applies the [component quality procedure](index.md) to every component listed under **Utilities** in the documentation. It measures all production TypeScript files owned by each component, including helper modules.

The 28 dedicated test files were executed; failures are recorded above. 18 of 18 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-animation` | 43 | 92.77% | 92.77% | 93.84% | 83.49% | Target met |
| `tp-avatar` | 7 | 100% | 100% | 100% | 97.22% | Target met |
| `tp-avatar-group` | 6 | 100% | 100% | 100% | 95% | Target met |
| `tp-compare` | 31 | 94.04% | 93.56% | 100% | 80% | Target met |
| `tp-copy-code` | 27 | 96.11% | 96.11% | 100% | 87.28% | Target met |
| `tp-csv-table` | 7 | 100% | 100% | 100% | 98.43% | Target met |
| `tp-divider` | 5 | 94.73% | 94.73% | 100% | 83.33% | Target met |
| `tp-dragdrop` | 39 | 95.87% | 93.91% | 100% | 84.71% | Target met |
| `tp-icon` | 59 | 95.66% | 95.2% | 98.33% | 90.81% | Target met |
| `tp-list-table` | 5 | 100% | 100% | 100% | 97.22% | Target met |
| `tp-lorem-ipsum` | 5 | 98.19% | 98.26% | 100% | 91.02% | Target met |
| `tp-math` | 9 | 100% | 100% | 100% | 97.72% | Target met |
| `tp-save-image` | 16 | 97.82% | 95.91% | 91.42% | 89.83% | Target met |
| `tp-skeleton` | 13 | 100% | 97.43% | 100% | 90.9% | Target met |
| `tp-source` | 10 | 100% | 97.77% | 100% | 90% | Target met |
| `tp-speech-to-text` | 9 | 100% | 99.31% | 100% | 83.58% | Target met |
| `tp-text-to-speech` | 33 | 100% | 98.05% | 100% | 88.09% | Target met |
| `tp-typewriting` | 8 | 100% | 100% | 100% | 97.89% | Target met |
| **Total (weighted averages)** | **332** | **97.27%** | **96.61%** | **98.52%** | **88.95%** | **Target met** |

Run `pnpm quality:utilities` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
