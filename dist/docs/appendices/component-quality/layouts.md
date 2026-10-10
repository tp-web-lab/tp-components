# Layout component quality

> Latest recorded executions: **2 distinct failing tests affect this family** in the global run or its separate family reruns. Coverage was collected despite failures and is not evidence of a passing suite. See the [execution results](index.md#latest-global-execution) for both scopes.

This family report applies the [component quality procedure](index.md) to every component listed under **Layouts** in the documentation. It measures all production TypeScript files owned by each component, including helper modules.

The 27 dedicated test files were executed; failures are recorded above. 20 of 21 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-accordion` | 20 | 90.83% | 90.98% | 100% | 81.08% | Target met |
| `tp-box` | 19 | 100% | 100% | 100% | 95.83% | Target met |
| `tp-card` | 8 | 91.66% | 91.66% | 100% | 80.85% | Target met |
| `tp-center` | 15 | 100% | 100% | 100% | 94.44% | Target met |
| `tp-cluster` | 14 | 100% | 100% | 100% | 95.45% | Target met |
| `tp-cover` | 17 | 100% | 100% | 100% | 91.3% | Target met |
| `tp-flip-card` | 14 | 100% | 100% | 100% | 80.3% | Target met |
| `tp-frame` | 13 | 95.12% | 95.12% | 100% | 88.46% | Target met |
| `tp-grid` | 8 | 100% | 100% | 100% | 95.83% | Target met |
| `tp-inline` | 10 | 100% | 100% | 100% | 95.83% | Target met |
| `tp-menu` | 25 | 95.5% | 95.5% | 100% | 84.25% | Target met |
| `tp-sidebar` | 10 | 100% | 100% | 100% | 96.66% | Target met |
| `tp-slider` | 26 | 99.04% | 99.05% | 96% | 95.23% | Target met |
| `tp-splitter` | 40 | 95.16% | 94.81% | 97.36% | 82.83% | Target met |
| `tp-stack` | 10 | 100% | 100% | 100% | 95% | Target met |
| `tp-switcher` | 6 | 98.55% | 98.55% | 100% | 94.11% | Target met |
| `tp-tabs` | 33 | 93.61% | 93.41% | 100% | 79.65% | Follow-up: branches |
| `tp-timeline` | 12 | 100% | 100% | 100% | 87.27% | Target met |
| `tp-toc` | 15 | 97.19% | 94.56% | 100% | 80.73% | Target met |
| `tp-toolbar` | 28 | 97.43% | 97.46% | 100% | 92.06% | Target met |
| `tp-tree` | 24 | 93.52% | 93.53% | 100% | 80.84% | Target met |
| **Total (weighted averages)** | **367** | **95.9%** | **95.67%** | **99.59%** | **84.86%** | **Target met** |

Run `pnpm quality:layouts` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
