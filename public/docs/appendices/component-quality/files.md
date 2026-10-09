# Files component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Files** in the documentation. It measures all production TypeScript files owned by each component, including helper modules.

The 5 dedicated test files currently pass together. 4 of 4 implemented components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-file-tree` | 4 | 91.86% | 91.9% | 97.22% | 83.47% | Target met |
| `tp-filesystem` | 5 | 97.88% | 97.97% | 100% | 80.76% | Target met |
| `tp-iframe` | 32 | 95.6% | 95.63% | 95% | 86.14% | Target met |
| `tp-include` | 33 | 90.64% | 90.78% | 100% | 86.66% | Target met |
| **Total (weighted averages)** | **74** | **94.48%** | **94.58%** | **97.83%** | **84.33%** | **Target met** |

Run `pnpm quality:files` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
