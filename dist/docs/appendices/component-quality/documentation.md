# Documentation component quality

This family report applies the [component quality procedure](index.md) to every component listed under **Documentations** in the component catalogue. `tp-markup-single-page` and `tp-markup-multi-pages` own the generic single-page and multi-page engines. `tp-markdown-multi-pages` now directly owns the Markdown documentation engine that was formerly exposed as `tp-multi-markdown`; its coverage therefore measures the real loading, rendering, navigation, language, theme, and error paths. The other language-specific components remain deliberately thin specializations; a 100% result for one of them means that all code owned by that specialization is exercised, while inherited engine behavior is measured on its canonical `tp-markup-*` component.

The 10 dedicated test files currently pass together. 9 of 10 components meet every advisory target: 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-asciidoc-multi-pages` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-asciidoc-single-page` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-html-multi-pages` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-html-single-page` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-markdown-multi-pages` | 27 | 79.69% | 76.87% | 80.43% | 64.46% | Follow-up: lines, statements, functions, branches |
| `tp-markdown-single-page` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-markup-multi-pages` | 24 | 94.57% | 93.31% | 97.61% | 83.8% | Target met |
| `tp-markup-single-page` | 14 | 95.83% | 94.02% | 100% | 85.36% | Target met |
| `tp-restructuredtext-multi-pages` | 1 | 100% | 100% | 100% | 100% | Target met |
| `tp-restructuredtext-single-page` | 1 | 100% | 100% | 100% | 100% | Target met |
| **Total (weighted averages)** | **72** | **89.31%** | **87.59%** | **91.39%** | **77.88%** | **Follow-up: lines, statements, branches** |

Run `pnpm quality:documentation` to execute the full family suite, refresh V8 coverage, and regenerate this page. Targets remain advisory while gaps are being reduced, but test failures remain technical failures.
