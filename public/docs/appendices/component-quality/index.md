# Component quality

This appendix defines the common test procedure expected of every component. It complements the [accessibility review](../accessibility/index.md): accessibility is part of component quality, but code coverage alone neither proves accessibility nor product correctness.

See [Tests](../tests.md) for the current suite inventory, commands and review results. Coverage measurements retain their own dates; a later test run without coverage does not refresh them.

## Procedure

For a new or changed component, the author should:

1. exercise its public API, rendering, events, keyboard behavior, error states, cleanup, and important edge cases with dedicated unit tests;
2. run the automated accessibility scenarios in the three browser engines when the component has a rendered example;
3. review the generated documentation and examples from an author's point of view;
4. measure statement, line, function, and branch coverage, then explain or test meaningful gaps;
5. record manual checks that automation cannot establish, such as usability with a screen reader, zoom, forced colours, or real content.

The procedure applies to future components from their introduction. Existing components enter it progressively, starting with the pilot below.

## What blocks a change

A broken test runner, a failing test, or an invalid generated report is a technical failure and should block. Coverage targets and manual-review gaps are initially **advisory**: they create visible follow-up work without rejecting a change automatically. A target may become blocking later, component by component, once its suite is mature and stable.

This distinction prevents a percentage from replacing engineering judgement. In particular, 100% coverage can still miss an incorrect assertion, an integration failure, or an inaccessible interaction.

## Reading coverage

The four coverage columns describe complementary aspects of the production code exercised while the tests run:

- **Lines**: the proportion of executable source lines that were executed at least once.
- **Statements**: the proportion of individual instructions or expressions that were executed; several statements may appear on the same source line.
- **Functions**: the proportion of declared functions, methods, getters, setters, and callbacks that were called.
- **Branches**: the proportion of alternative control-flow paths that were taken, such as both outcomes of a condition, the cases of a switch, or fallback expressions.

Coverage records execution, not correctness: a covered path still needs a meaningful assertion. Unless a report explicitly mentions a failure, timeout, skip, or expected failure, **100% of the tests counted in its tables completed successfully without error**. A coverage percentage below 100% therefore describes production paths that were not exercised; it does not mean that the corresponding proportion of tests failed.

## Pilot

The pilot runs 6 dedicated test files for 4 components. The current advisory targets are 90% lines, 90% statements, 90% functions, and 80% branches.

| Component | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `tp-animation` | 43 | 92.77% | 92.77% | 93.84% | 83.49% | Target met |
| `tp-code-editor` | 45 | 85.23% | 84.25% | 83.33% | 74.29% | Follow-up: lines, statements, functions, branches |
| `tp-compare` | 31 | 94.04% | 93.56% | 100% | 80% | Target met |
| `tp-modal` | 42 | 96.27% | 96.27% | 100% | 86.66% | Target met |
| **Total (weighted averages)** | **161** | **88.67%** | **87.98%** | **89.84%** | **78.26%** | **Follow-up: lines, statements, functions, branches** |

The complete family reports apply the same procedure to [Base](base.md), [Controllers](controllers.md), [Documentation](documentation.md), [Editors](editors.md), [Feedbacks](feedbacks.md), [Files](files.md), [Forms](forms.md), [Games](games.md), [Layouts](layouts.md), [Markup Languages](markup-languages.md), [Notebooks](notebooks.md), [Overlays](overlays.md), [Pickers](pickers.md), [Playgrounds](playgrounds.md), [Plots](plots.md), [Quizzes](quizzes.md), [Simulators](simulators.md), [Slides](slides.md), [Time](time.md), [Utilities](utilities.md), and [Viewers](viewers.md).

## Complete test assessment

This consolidated view covers every component in the completed family reports. **Components meeting targets** requires each component to reach all four advisory thresholds; family and total percentages are weighted by the measured code units rather than averaged component percentages. Under the convention above, all tests shown here passed without error unless the report explicitly says otherwise.

The current totals distinguish 185 registered public components from 2 shared implementation units (`tp-markup-viewer`, `tp-playground-question`). Shared implementations are included because their production code must remain visible to coverage, but they are not additional custom elements.

| Family | Components | Components meeting targets | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| [Base](base.md) | 2 | 0 | 147 | 68.62% | 67.95% | 75.59% | 54.92% | Follow-up: lines, statements, functions, branches |
| [Controllers](controllers.md) | 5 | 5 | 92 | 92.98% | 92.85% | 96.59% | 81.52% | Target met |
| [Documentation](documentation.md) | 10 | 9 | 100 | 89.31% | 87.59% | 91.39% | 77.88% | Follow-up: lines, statements, branches |
| [Editors](editors.md) | 6 | 4 | 244 | 91.01% | 89.65% | 93.84% | 75.85% | Follow-up: statements, branches |
| [Feedbacks](feedbacks.md) | 4 | 4 | 53 | 96.08% | 94.77% | 97.79% | 85.85% | Target met |
| [Files](files.md) | 4 | 4 | 74 | 94.48% | 94.58% | 97.83% | 84.33% | Target met |
| [Forms](forms.md) | 13 | 11 | 190 | 96.2% | 95.67% | 97.46% | 88.66% | Target met |
| [Games](games.md) | 10 | 10 | 111 | 97.73% | 96.11% | 98.11% | 81.89% | Target met |
| [Layouts](layouts.md) | 21 | 20 | 368 | 95.9% | 95.67% | 99.59% | 84.86% | Target met |
| [Markup Languages](markup-languages.md) | 3 | 3 | 22 | 95.28% | 92.79% | 91.3% | 82.23% | Target met |
| [Notebooks](notebooks.md) | 6 | 6 | 20 | 94.96% | 93.39% | 93.82% | 83.38% | Target met |
| [Overlays](overlays.md) | 7 | 7 | 240 | 94.01% | 93.88% | 97.59% | 84.02% | Target met |
| [Pickers](pickers.md) | 5 | 5 | 69 | 96.62% | 96.32% | 98.79% | 84.72% | Target met |
| [Playgrounds](playgrounds.md) | 9 | 9 | 37 | 96.42% | 96.47% | 97.18% | 85.34% | Target met |
| [Plots](plots.md) | 5 | 5 | 195 | 99.75% | 98.12% | 98.7% | 89.4% | Target met |
| [Quizzes](quizzes.md) | 13 | 2 | 134 | 90.9% | 88.94% | 92.89% | 76.21% | Follow-up: statements, branches |
| [Simulators](simulators.md) | 8 | 0 | 97 | 93.76% | 87.47% | 94.45% | 72.69% | Follow-up: statements, branches |
| [Slides](slides.md) | 5 | 4 | 16 | 74.48% | 71.77% | 66.66% | 62.36% | Follow-up: lines, statements, functions, branches |
| [Time](time.md) | 4 | 4 | 38 | 96.7% | 96.71% | 97.67% | 83.22% | Target met |
| [Utilities](utilities.md) | 18 | 18 | 370 | 97.27% | 96.61% | 98.52% | 88.95% | Target met |
| [Viewers](viewers.md) | 11 | 11 | 67 | 95.05% | 94.44% | 97.14% | 83.92% | Target met |
| **Total (weighted averages)** | **169** | **141** | **2684** | **93.38%** | **91.92%** | **95.55%** | **80.08%** | **Target met** |

Run `pnpm quality:pilot` to execute the pilot, collect V8 coverage, and regenerate this page. Run `pnpm quality:report:check` to verify that the committed page matches the latest coverage data. The CI pilot is explicitly non-blocking while the procedure is being calibrated; its report is still retained as an artifact for review.

## Latest global execution

Executed at 2026-10-29T10:15:55.510Z. The full Vitest suite reports **3447 passed, 0 failed, 0 skipped/pending** out of 3447 tests, plus **0 unhandled errors**. These are execution results, not the static test counts in the family tables.

Coverage below was measured at 2026-10-29T10:15:55.510Z during this complete-suite execution over production files in `src/components/`. Family tables retain their separate historical family-scoped measurements.



| Lines | Statements | Functions | Branches |
| ---: | ---: | ---: | ---: |
| 94.05% | 92.4% | 95.45% | 81.93% |

No failing tests.




## Extending the pilot

Add the component and its dedicated tests to `config/component-quality-pilot.json`. Include all production files owned by the component, including trigger or helper modules: an untested helper must remain visible rather than disappearing from the denominator. Expand the pilot in small groups so weak assertions and obsolete tests are corrected deliberately instead of being hidden by a repository-wide percentage.
