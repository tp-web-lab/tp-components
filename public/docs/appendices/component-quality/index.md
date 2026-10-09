# Component quality

This appendix defines the common test procedure expected of every component. It complements the [accessibility review](../accessibility/index.md): accessibility is part of component quality, but code coverage alone neither proves accessibility nor product correctness.

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

The current totals distinguish 171 registered public components from 2 shared implementation units (`tp-markup-viewer`, `tp-playground-question`). Shared implementations are included because their production code must remain visible to coverage, but they are not additional custom elements.

| Family | Components | Components meeting targets | Tests | Lines | Statements | Functions | Branches | Advisory result |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| [Base](base.md) | 2 | 0 | 51 | 68.62% | 67.95% | 75.59% | 54.92% | Follow-up: lines, statements, functions, branches |
| [Controllers](controllers.md) | 5 | 5 | 92 | 92.98% | 92.85% | 96.59% | 81.52% | Target met |
| [Documentation](documentation.md) | 10 | 9 | 72 | 89.31% | 87.59% | 91.39% | 77.88% | Follow-up: lines, statements, branches |
| [Editors](editors.md) | 6 | 4 | 215 | 91.01% | 89.65% | 93.84% | 75.85% | Follow-up: statements, branches |
| [Feedbacks](feedbacks.md) | 4 | 4 | 53 | 96.08% | 94.77% | 97.79% | 85.85% | Target met |
| [Files](files.md) | 4 | 4 | 74 | 94.48% | 94.58% | 97.83% | 84.33% | Target met |
| [Forms](forms.md) | 13 | 11 | 177 | 96.2% | 95.67% | 97.46% | 88.66% | Target met |
| [Games](games.md) | 10 | 10 | 111 | 97.73% | 96.11% | 98.11% | 81.89% | Target met |
| [Layouts](layouts.md) | 21 | 20 | 367 | 95.9% | 95.67% | 99.59% | 84.86% | Target met |
| [Markup Languages](markup-languages.md) | 3 | 3 | 21 | 95.28% | 92.79% | 91.3% | 82.23% | Target met |
| [Notebooks](notebooks.md) | 6 | 6 | 20 | 94.96% | 93.39% | 93.82% | 83.38% | Target met |
| [Overlays](overlays.md) | 7 | 7 | 240 | 94.01% | 93.88% | 97.59% | 84.02% | Target met |
| [Pickers](pickers.md) | 5 | 5 | 69 | 96.62% | 96.32% | 98.79% | 84.72% | Target met |
| [Playgrounds](playgrounds.md) | 9 | 9 | 28 | 96.42% | 96.47% | 97.18% | 85.34% | Target met |
| [Plots](plots.md) | 5 | 5 | 76 | 99.75% | 98.12% | 98.7% | 89.4% | Target met |
| [Quizzes](quizzes.md) | 13 | 2 | 94 | 90.9% | 88.94% | 92.89% | 76.21% | Follow-up: statements, branches |
| [Simulators](simulators.md) | 8 | 0 | 97 | 93.76% | 87.47% | 94.45% | 72.69% | Follow-up: statements, branches |
| [Slides](slides.md) | 5 | 4 | 16 | 74.48% | 71.77% | 66.66% | 62.36% | Follow-up: lines, statements, functions, branches |
| [Time](time.md) | 4 | 4 | 37 | 96.7% | 96.71% | 97.67% | 83.22% | Target met |
| [Utilities](utilities.md) | 18 | 18 | 332 | 97.27% | 96.61% | 98.52% | 88.95% | Target met |
| [Viewers](viewers.md) | 11 | 11 | 63 | 95.05% | 94.44% | 97.14% | 83.92% | Target met |
| **Total (weighted averages)** | **169** | **141** | **2305** | **93.38%** | **91.92%** | **95.55%** | **80.08%** | **Target met** |

Run `pnpm quality:pilot` to execute the pilot, collect V8 coverage, and regenerate this page. Run `pnpm quality:report:check` to verify that the committed page matches the latest coverage data. The CI pilot is explicitly non-blocking while the procedure is being calibrated; its report is still retained as an artifact for review.

## Latest global execution

Executed at 2026-09-20T11:19:02.877Z. The full Vitest suite reports **2486 passed, 24 failed, 0 skipped/pending** out of 2510 tests, plus **0 unhandled errors**. These are execution results, not the static test counts in the family tables.

Coverage below comes from a single complete-suite run over production files in `src/components/`, including components not yet assigned to a family report. Family tables retain their separate family-scoped measurements. The runner retains coverage even when tests fail; coverage alone does not demonstrate that tests passed.

Separate family-scoped reruns reported failures in: `layouts` (2), `utilities` (4), `forms` (7), `quizzes` (2), `pickers` (1), `notebooks` (1), `slides` (1), `viewers` (4), `simulators` (1), `playgrounds` (2). These reruns overlap the complete suite and must not be added to its test totals.

| Lines | Statements | Functions | Branches |
| ---: | ---: | ---: | ---: |
| 93.46% | 92.05% | 95.54% | 80.84% |

### Failing tests

| Component | Failure | Test |
| --- | --- | --- |
| Shared tests | Assertion | markdown components migration removes internal tp CSS variables from tp-html-viewer source display |
| Shared tests | Assertion | markdown components migration removes generated theme classes from tp-theme examples |
| Shared tests | Timeout | programming viewers renders the compact tp-sql-viewer interface |
| Shared tests | Timeout | programming viewers shows the SQL tables and query in tabs |
| `tp-accordion` | Assertion | &lt;tp-accordion&gt; defines default, outlined, and filled appearance styles |
| `tp-blank` | Assertion | offers Basic usage followed by the same four named exercises in html |
| `tp-blank` | Assertion | offers Basic usage followed by the same four named exercises in md |
| `tp-blank` | Assertion | offers Basic usage followed by the same four named exercises in adoc |
| `tp-blank` | Assertion | offers Basic usage followed by the same four named exercises in rst |
| `tp-blank` | Assertion | declares the equivalent reStructuredText directive without requiring Pyodide in unit tests |
| `tp-blank` | Assertion | renders the md example with the library markup parser |
| `tp-blank` | Assertion | renders the adoc example with the library markup parser |
| `tp-flip-card` | Assertion | uses shared components for both playing-card faces without image paragraph wrappers |
| `tp-markup-multi-slides` | Assertion | &lt;tp-markup-multi-slides&gt; reuses multi-pages loading and replaces page links with slide controls |
| `tp-multi-choice-question` | Assertion | multi-choice documentation uses content-free RST icon directives with accessible labels |
| `tp-notebook` | Assertion | &lt;tp-notebook&gt; shows only markup output and keeps programming viewers intact |
| `tp-prose-editor` | Timeout | &lt;tp-prose-editor&gt; charge un fichier local dans un bloc de code depuis son menu file |
| `tp-prose-editor` | Timeout | &lt;tp-prose-editor&gt; préserve les code editors dans le rendu HTML |
| `tp-prose-editor` | Timeout | &lt;tp-prose-editor&gt; affiche les formules Markdown dans le rendu HTML |
| `tp-prose-editor` | Timeout | &lt;tp-prose-editor&gt; sélectionne le rendu HTML visible avec le bouton select-all |
| `tp-speech-to-text` | Assertion | provides five HTML examples with Basic usage first |
| `tp-speech-to-text` | Assertion | renders equivalent md examples |
| `tp-speech-to-text` | Assertion | renders equivalent adoc examples |
| `tp-speech-to-text` | Assertion | preserves the reStructuredText examples |

### Family execution results

These separate reruns are not additional tests in the global total. A successful family rerun does not erase a failure recorded in the full suite.

| Family | Passed | Failed | Completed at (UTC) |
| --- | ---: | ---: | --- |
| base | 38 | 0 | 2026-09-20T11:08:30.278Z |
| controllers | 92 | 0 | 2026-09-20T11:08:54.067Z |
| documentation | 72 | 0 | 2026-09-20T11:37:56.726Z |
| editors | 215 | 0 | 2026-09-20T11:20:58.119Z |
| feedbacks | 53 | 0 | 2026-09-20T11:09:12.716Z |
| files | 74 | 0 | 2026-09-20T11:09:35.980Z |
| forms | 170 | 7 | 2026-09-20T11:11:07.913Z |
| games | 111 | 0 | 2026-09-20T11:15:17.062Z |
| layouts | 365 | 2 | 2026-09-20T11:06:17.415Z |
| markup-languages | 21 | 0 | 2026-09-20T11:21:03.715Z |
| notebooks | 19 | 1 | 2026-09-20T11:37:39.509Z |
| overlays | 240 | 0 | 2026-09-20T11:08:10.467Z |
| pickers | 68 | 1 | 2026-09-20T11:37:12.037Z |
| pilot | 161 | 0 | 2026-09-20T11:05:25.675Z |
| playgrounds | 69 | 2 | 2026-09-20T13:01:04.315Z |
| plots | 76 | 0 | 2026-09-20T11:12:15.541Z |
| quizzes | 92 | 2 | 2026-09-20T11:15:01.167Z |
| simulators | 96 | 1 | 2026-09-20T12:44:17.936Z |
| slides | 15 | 1 | 2026-09-20T11:38:02.575Z |
| time | 37 | 0 | 2026-09-20T11:07:38.345Z |
| utilities | 328 | 4 | 2026-09-20T13:14:19.853Z |
| viewers | 156 | 4 | 2026-09-20T12:12:13.198Z |

### Failing tests in family reruns

| Family | Component | Failure | Test |
| --- | --- | --- | --- |
| forms | `tp-blank` | Assertion | offers Basic usage followed by the same four named exercises in html |
| forms | `tp-blank` | Assertion | offers Basic usage followed by the same four named exercises in md |
| forms | `tp-blank` | Assertion | offers Basic usage followed by the same four named exercises in adoc |
| forms | `tp-blank` | Assertion | offers Basic usage followed by the same four named exercises in rst |
| forms | `tp-blank` | Assertion | declares the equivalent reStructuredText directive without requiring Pyodide in unit tests |
| forms | `tp-blank` | Assertion | renders the md example with the library markup parser |
| forms | `tp-blank` | Assertion | renders the adoc example with the library markup parser |
| layouts | `tp-accordion` | Assertion | &lt;tp-accordion&gt; defines default, outlined, and filled appearance styles |
| layouts | `tp-flip-card` | Assertion | uses shared components for both playing-card faces without image paragraph wrappers |
| notebooks | `tp-notebook` | Assertion | &lt;tp-notebook&gt; shows only markup output and keeps programming viewers intact |
| pickers | `tp-icon-picker` | Timeout | &lt;tp-icon-picker&gt; copies the icon as svg |
| playgrounds | `tp-notebook` | Assertion | &lt;tp-notebook&gt; shows only markup output and keeps programming viewers intact |
| playgrounds | `tp-python-playground` | Timeout | covers Python project, runtime and playground contracts |
| quizzes | `tp-multi-choice-question` | Assertion | multi-choice documentation uses content-free RST icon directives with accessible labels |
| quizzes | `tp-playground-question` | Timeout | forwards src and waits for the current control to finish loading |
| simulators | `tp-graph-geometric-optics` | Timeout | &lt;tp-graph-geometric-optics&gt; orients the point-source emission cone from the horizontal axis |
| slides | `tp-markup-multi-slides` | Assertion | &lt;tp-markup-multi-slides&gt; reuses multi-pages loading and replaces page links with slide controls |
| utilities | `tp-speech-to-text` | Assertion | provides five HTML examples with Basic usage first |
| utilities | `tp-speech-to-text` | Assertion | renders equivalent md examples |
| utilities | `tp-speech-to-text` | Assertion | renders equivalent adoc examples |
| utilities | `tp-speech-to-text` | Assertion | preserves the reStructuredText examples |
| viewers | Shared tests | Assertion | markdown components migration removes internal tp CSS variables from tp-html-viewer source display |
| viewers | Shared tests | Timeout | markdown components migration removes generated theme classes from component examples |
| viewers | Shared tests | Assertion | markdown components migration removes generated theme classes from tp-theme examples |
| viewers | `tp-sql-viewer` | Timeout | covers SQL viewer file resolution fallbacks |


## Extending the pilot

Add the component and its dedicated tests to `config/component-quality-pilot.json`. Include all production files owned by the component, including trigger or helper modules: an untested helper must remain visible rather than disappearing from the denominator. Expand the pilot in small groups so weak assertions and obsolete tests are corrected deliberately instead of being hidden by a repository-wide percentage.
