# Simulators component quality

> Latest recorded executions: **1 distinct failing test affects this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This report covers the eight components in the **Simulators** catalogue: finite automata, logical and analog circuits, Petri nets, geometric optics, and relational query trees.

The 8 dedicated test files were executed; failures are recorded above. 0 of 8 measured components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-graph-analog-circuit` | 15 | 92.4% | 85.42% | 91.86% | 66.39% | Follow-up: statements, branches |
| `tp-graph-dfa` | 8 | 92.08% | 87.79% | 95.55% | 80.27% | Follow-up: statements |
| `tp-graph-geometric-optics` | 25 | 93.82% | 87.01% | 93.42% | 70.67% | Follow-up: statements, branches |
| `tp-graph-logical-circuit` | 18 | 93.11% | 87.06% | 95.55% | 75.88% | Follow-up: statements, branches |
| `tp-graph-nfa` | 5 | 93.4% | 88.3% | 96.82% | 76.87% | Follow-up: statements, branches |
| `tp-graph-petri` | 13 | 92.98% | 88.55% | 95.18% | 78.73% | Follow-up: statements, branches |
| `tp-graph-query-tree` | 4 | 93.96% | 85.28% | 95.23% | 68.82% | Follow-up: statements, branches |
| `tp-graph-sequential-circuit` | 9 | 98.54% | 94.8% | 96.77% | 77.6% | Follow-up: branches |
| **Total (weighted averages)** | **97** | **93.76%** | **87.47%** | **94.45%** | **72.69%** | **Follow-up: statements, branches** |

Run `pnpm quality:simulators` to execute the family suite, refresh V8 coverage, and regenerate this page. Targets are advisory; failing tests remain technical failures.
