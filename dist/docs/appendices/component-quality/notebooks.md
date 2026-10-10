# Notebooks component quality

> Latest recorded executions: **1 distinct failing test affects this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This family report applies the [component quality procedure](index.md) to every component listed under **Notebooks** in the documentation. The generic notebook owns the shared loading, editing, execution, preview, import, and export behavior; the five specialized components constrain its programming language. Their 100% coverage is explained by this deliberately thin design: each specialized component only sets its default language, preserves an explicit language, and delegates every other behavior to `tp-notebook`, and its dedicated test exercises all of those component-specific paths.

The 6 dedicated test files were executed; failures are recorded above. 6 of 6 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-javascript-notebook` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-notebook` | 15 | 94.86% | 93.08% | 93.42% | 82.22% | Target met |
| `tp-prolog-notebook` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-python-notebook` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-sql-notebook` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-typescript-notebook` | 1 | 100% | 100% | 100% | 100% | Target met |
| **Total (weighted averages)** | **20** | **94.96%** | **93.39%** | **93.82%** | **83.38%** | **Target met** |

Run `pnpm quality:notebooks` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
