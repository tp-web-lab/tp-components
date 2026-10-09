# Games component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Games** in the documentation. It measures all production TypeScript files owned by each component.

The 10 dedicated test files currently pass together. 10 of 10 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-binary` | 10 | 94.44% | 92.39% | 100% | 80.7% | Target met |
| `tp-crossword` | 15 | 98.75% | 96.41% | 100% | 80% | Target met |
| `tp-cryptarithm` | 7 | 94.26% | 94.26% | 100% | 80.89% | Target met |
| `tp-game-life` | 7 | 97.97% | 93.1% | 100% | 84.28% | Target met |
| `tp-loto` | 8 | 98.13% | 96.63% | 94.44% | 82.81% | Target met |
| `tp-mastermind` | 15 | 99.5% | 99.54% | 100% | 81.95% | Target met |
| `tp-memory` | 12 | 97.26% | 96.25% | 95.23% | 86.95% | Target met |
| `tp-solitaire` | 18 | 98.01% | 96.06% | 95.91% | 81.69% | Target met |
| `tp-sudoku` | 10 | 98.05% | 96.19% | 100% | 83.07% | Target met |
| `tp-yakazu` | 9 | 98.03% | 96.15% | 100% | 81.25% | Target met |
| **Total (weighted averages)** | **111** | **97.73%** | **96.11%** | **98.11%** | **81.89%** | **Target met** |

Run `pnpm quality:games` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
