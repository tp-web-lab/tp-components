# Pickers component quality

> Latest recorded executions: **1 distinct failing test affects this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This family report applies the [component quality procedure](index.md) to every component listed under **Pickers** in the documentation.

The 5 dedicated test files were executed; failures are recorded above. 5 of 5 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-color-picker` | 24 | 94.72% | 94.79% | 100% | 87.5% | Target met |
| `tp-emoji-picker` | 11 | 98.56% | 98.13% | 96.96% | 86.36% | Target met |
| `tp-formula-picker` | 2 | 100% | 100% | 100% | 92.85% | Target met |
| `tp-icon-picker` | 24 | 96.04% | 95.22% | 100% | 81.33% | Target met |
| `tp-symbol-picker` | 8 | 98.97% | 99% | 96.77% | 85.71% | Target met |
| **Total (weighted averages)** | **69** | **96.62%** | **96.32%** | **98.79%** | **84.72%** | **Target met** |

Run `pnpm quality:pickers` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
