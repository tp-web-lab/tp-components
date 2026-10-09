# Feedback component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Feedbacks** in the documentation. It measures all production TypeScript files owned by each component, including helper modules.

The 4 dedicated test files currently pass together. 4 of 4 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-badge` | 11 | 100% | 100% | 100% | 91.66% | Target met |
| `tp-callout` | 21 | 99% | 99% | 100% | 95% | Target met |
| `tp-console` | 5 | 96.04% | 96.09% | 97.91% | 88.03% | Target met |
| `tp-post-it` | 16 | 94.77% | 91.9% | 95.74% | 82.81% | Target met |
| **Total (weighted averages)** | **53** | **96.08%** | **94.77%** | **97.79%** | **85.85%** | **Target met** |

Run `pnpm quality:feedbacks` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
