# Base component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Base** in the documentation. It measures all production TypeScript files owned by each component. The two suites run in isolated Vitest processes because `tp-base` dynamically loads help components whose custom-element registrations would otherwise leak into the `tp-question` suite.

The 2 dedicated test files currently pass independently. 0 of 2 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches. Remaining gaps are explicit follow-up work; the targets do not block changes while this foundational family is being expanded.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-base` | 24 | 72.43% | 72.27% | 87.35% | 59.73% | Follow-up: lines, statements, functions, branches |
| `tp-question` | 27 | 65.26% | 64.27% | 62.96% | 48.69% | Follow-up: lines, statements, functions, branches |
| **Total (weighted averages)** | **51** | **68.62%** | **67.95%** | **75.59%** | **54.92%** | **Follow-up: lines, statements, functions, branches** |

Run `pnpm quality:base` to execute both isolated suites, refresh V8 coverage, and regenerate this page. Test failures remain technical failures even while coverage targets are advisory.
