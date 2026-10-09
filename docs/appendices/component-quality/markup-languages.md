# Markup Languages component quality

This family report applies the [component quality procedure](index.md) to the three language renderers listed under **Markup Languages** in the documentation.

The 5 dedicated test files currently pass together. 3 of 3 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-asciidoc` | 6 | 93.23% | 91.27% | 90.62% | 81.33% | Target met |
| `tp-markdown` | 8 | 96.49% | 93.82% | 91.42% | 82.25% | Target met |
| `tp-restructuredtext` | 7 | 95.83% | 93.12% | 92% | 83.33% | Target met |
| **Total (weighted averages)** | **21** | **95.28%** | **92.79%** | **91.3%** | **82.23%** | **Target met** |

Run `pnpm quality:markup-languages` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
