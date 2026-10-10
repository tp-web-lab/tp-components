# Plots component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Plots** in the documentation. It measures all production TypeScript files owned by each component.

The 7 dedicated test files currently pass together. 5 of 5 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-diagram` | 8 | 100% | 95.91% | 100% | 81.57% | Target met |
| `tp-lsystem` | 18 | 100% | 99.32% | 100% | 93.18% | Target met |
| `tp-map` | 34 | 99.7% | 99.72% | 100% | 92.48% | Target met |
| `tp-turtle` | 8 | 100% | 97.19% | 96.29% | 83% | Target met |
| `tp-xy-plot` | 8 | 98.68% | 94.18% | 94.73% | 88.46% | Target met |
| **Total (weighted averages)** | **76** | **99.75%** | **98.12%** | **98.7%** | **89.4%** | **Target met** |

Run `pnpm quality:plots` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
