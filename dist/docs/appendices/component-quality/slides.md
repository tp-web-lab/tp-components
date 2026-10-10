# Slides component quality

> Latest recorded executions: **1 distinct failing test affects this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This family report applies the [component quality procedure](index.md) to all slide presentation components. `tp-markup-multi-slides` owns progressive disclosure, keyboard and pointer navigation, slide controls, progress state, and cleanup. The four format-specific components fix the inherited markup language; their small surface is tested separately so registration and specialization remain visible rather than being credited to the generic engine.

The 6 dedicated test files were executed; failures are recorded above. 4 of 5 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-asciidoc-multi-slides` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-html-multi-slides` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-markdown-multi-slides` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-markup-multi-slides` | 12 | 72.82% | 70.05% | 62.06% | 58.82% | Follow-up: lines, statements, functions, branches |
| `tp-restructuredtext-multi-slides` | 1 | 100% | 100% | 100% | 100% | Target met |
| **Total (weighted averages)** | **16** | **74.48%** | **71.77%** | **66.66%** | **62.36%** | **Follow-up: lines, statements, functions, branches** |

Run `pnpm quality:slides` to execute the complete family suite, refresh V8 coverage, and regenerate this page. Coverage targets remain advisory, while test failures remain technical failures.
