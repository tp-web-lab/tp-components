# Editors component quality

> Latest recorded executions: **4 distinct failing tests affect this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This family report applies the [component quality procedure](index.md) to every component listed under **Editors** in the documentation. It measures all production TypeScript files owned by each component, including editor-specific language and schema helpers.

The 9 dedicated test files were executed; failures are recorded above. 4 of 6 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-code-comment` | 8 | 100% | 100% | 100% | 95.23% | Target met |
| `tp-code-editor` | 50 | 94.72% | 93.72% | 97.82% | 81.42% | Target met |
| `tp-graph-editor` | 59 | 90.54% | 87.89% | 92.59% | 72.54% | Follow-up: statements, branches |
| `tp-post-it-editor` | 2 | 100% | 100% | 100% | 89.28% | Target met |
| `tp-prose-editor` | 77 | 87.66% | 87.54% | 91.54% | 74.19% | Follow-up: lines, statements, branches |
| `tp-spreadsheet-editor` | 19 | 97.49% | 93.9% | 98.79% | 83.38% | Target met |
| **Total (weighted averages)** | **215** | **91.01%** | **89.65%** | **93.84%** | **75.85%** | **Follow-up: statements, branches** |

Run `pnpm quality:editors` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
