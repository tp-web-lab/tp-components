# Time component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Time** in the documentation. It measures all production TypeScript files owned by each component, including helper modules.

The 4 dedicated test files currently pass together. 4 of 4 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-alarm` | 12 | 96.52% | 96.55% | 96.42% | 83.05% | Target met |
| `tp-chronometer` | 7 | 97.18% | 97.18% | 100% | 83.33% | Target met |
| `tp-clock` | 6 | 96.89% | 96.89% | 100% | 84.37% | Target met |
| `tp-timer` | 12 | 96.45% | 96.47% | 96.29% | 82.6% | Target met |
| **Total (weighted averages)** | **37** | **96.7%** | **96.71%** | **97.67%** | **83.22%** | **Target met** |

Run `pnpm quality:time` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
