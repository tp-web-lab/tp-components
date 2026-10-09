# Controller component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Controllers** in the documentation. It measures all production TypeScript files owned by each component, including helper modules.

The 5 dedicated test files currently pass together. 5 of 5 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-color` | 18 | 92.54% | 92.54% | 96.96% | 81.57% | Target met |
| `tp-dir` | 28 | 92.3% | 92.3% | 97.05% | 82.35% | Target met |
| `tp-fullscreen` | 11 | 92.95% | 93% | 100% | 80.45% | Target met |
| `tp-lang` | 14 | 96.55% | 95.79% | 100% | 80.43% | Target met |
| `tp-theme` | 21 | 91.03% | 91.03% | 90.24% | 82.38% | Target met |
| **Total (weighted averages)** | **92** | **92.98%** | **92.85%** | **96.59%** | **81.52%** | **Target met** |

Run `pnpm quality:controllers` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
