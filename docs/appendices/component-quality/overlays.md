# Overlay component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Overlays** in the documentation. It measures all production TypeScript files owned by each component, including trigger and helper modules.

The 12 dedicated test files currently pass together. 7 of 7 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-contextmenu` | 20 | 91.83% | 91.83% | 100% | 80.2% | Target met |
| `tp-dialog` | 5 | 100% | 100% | 100% | 81.48% | Target met |
| `tp-drawer` | 54 | 97.71% | 96.86% | 97.61% | 89.38% | Target met |
| `tp-dropdown` | 45 | 90.49% | 90.49% | 98.14% | 80.1% | Target met |
| `tp-modal` | 42 | 96.27% | 96.27% | 100% | 86.66% | Target met |
| `tp-popover` | 44 | 91.35% | 91.35% | 92.1% | 82.67% | Target met |
| `tp-tooltip` | 30 | 95.83% | 95.83% | 97.36% | 88.28% | Target met |
| **Total (weighted averages)** | **240** | **94.01%** | **93.88%** | **97.59%** | **84.02%** | **Target met** |

Run `pnpm quality:overlays` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
