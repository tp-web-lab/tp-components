# Quizzes component quality

> Latest recorded executions: **2 distinct failing tests affect this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This family report applies the [component quality procedure](index.md) to the four implemented components listed under **Quizzes**.

The 16 dedicated test files were executed; failures are recorded above. 2 of 13 implemented components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-fill-blank-question` | 34 | 88.29% | 86.43% | 98.43% | 72.69% | Follow-up: lines, statements, branches |
| `tp-javascript-playground-question` | 1 | 100% | 100% | 100% | 50% | Follow-up: branches |
| `tp-javascript-viewer-question` | 1 | 100% | 100% | 100% | 50% | Follow-up: branches |
| `tp-matching-question` | 8 | 100% | 100% | 100% | 92.53% | Target met |
| `tp-multi-choice-question` | 21 | 90.56% | 87.91% | 80.39% | 77.02% | Follow-up: statements, functions, branches |
| `tp-playground-question` | 5 | 100% | 100% | 100% | 100% | Target met |
| `tp-prolog-playground-question` | 1 | 100% | 100% | 100% | 50% | Follow-up: branches |
| `tp-prolog-viewer-question` | 1 | 100% | 100% | 100% | 50% | Follow-up: branches |
| `tp-python-playground-question` | 1 | 100% | 100% | 100% | 50% | Follow-up: branches |
| `tp-python-viewer-question` | 1 | 100% | 100% | 100% | 50% | Follow-up: branches |
| `tp-single-choice-question` | 18 | 92.85% | 90.2% | 96.29% | 77.62% | Follow-up: branches |
| `tp-typescript-playground-question` | 1 | 100% | 100% | 100% | 50% | Follow-up: branches |
| `tp-typescript-viewer-question` | 1 | 100% | 100% | 100% | 50% | Follow-up: branches |
| **Total (weighted averages)** | **94** | **90.9%** | **88.94%** | **92.89%** | **76.21%** | **Follow-up: statements, branches** |

Run `pnpm quality:quizzes` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
