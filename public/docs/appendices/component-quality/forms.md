# Forms component quality

> Latest recorded executions: **7 distinct failing tests affect this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This family report applies the [component quality procedure](index.md) to every component listed under **Forms** in the documentation. It measures all production TypeScript files owned by each component.

The 17 dedicated test files were executed; failures are recorded above. 11 of 13 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-blank` | 20 | 100% | 100% | 100% | 94.44% | Target met |
| `tp-button` | 28 | 95.9% | 95.9% | 100% | 90% | Target met |
| `tp-button-group` | 4 | 100% | 100% | 100% | 90% | Target met |
| `tp-checkbox-list` | 21 | 89.95% | 89.95% | 90.69% | 81.48% | Follow-up: lines, statements |
| `tp-datefield` | 6 | 99.09% | 95.86% | 100% | 84.61% | Target met |
| `tp-fill-blank` | 14 | 91.66% | 91.66% | 93.75% | 83.67% | Target met |
| `tp-icon-button` | 4 | 96.47% | 96.51% | 97.14% | 95.23% | Target met |
| `tp-matching` | 12 | 100% | 99.31% | 100% | 95.42% | Target met |
| `tp-mathfield` | 14 | 100% | 99.28% | 100% | 87.93% | Target met |
| `tp-numberfield` | 7 | 100% | 100% | 100% | 98.18% | Target met |
| `tp-radio-list` | 27 | 90.69% | 90.82% | 89.18% | 82.44% | Follow-up: functions |
| `tp-textfield` | 14 | 96.26% | 95.23% | 95.45% | 91.04% | Target met |
| `tp-timefield` | 6 | 99.09% | 95.86% | 100% | 84.61% | Target met |
| **Total (weighted averages)** | **177** | **96.2%** | **95.67%** | **97.46%** | **88.66%** | **Target met** |

Run `pnpm quality:forms` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
