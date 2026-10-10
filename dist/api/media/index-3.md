# Accessibility review

<tp-toc position="end" expand-all open brand></tp-toc>

This report is the transversal accessibility inventory for the `tp-components` library. It targets the Standard profile of [A11Y.md](https://github.com/fecarrico/A11Y.md/blob/main/docs/en/A11Y.md), based on [WCAG 2.2](https://www.w3.org/TR/WCAG22/) Level AA.

It records static implementation evidence, not a certification. Keyboard paths, accessible names in context, 200% zoom, 320 CSS px reflow, computed contrast, voice control, screen readers, and other assistive technologies still require browser and human validation.

## Coverage

| Measure | Result |
| --- | --- |
| Documented component pages | 175 |
| Detailed accessibility contracts | 45 |
| Static implementation reviews | 175 |
| Component implementations with detected dedicated or shared test coverage | 173 |
| Components containing keyboard handling | 28 |

### Source of semantics

These categories are mutually exclusive and cover all 175 documented entries. Components in the first category may also use native or library controls.

| Static classification | Components |
| --- | ---: |
| Explicit ARIA markup or state in the primary source | 88 |
| Native HTML or accessible library controls, without local ARIA | 13 |
| Component-owned pointer interaction without detected semantics | 1 |
| No direct component-owned pointer interaction or exposed control detected | 71 |
| Documentation aliases without a primary implementation file | 2 |

For context, 77 components use a detected native HTML control or an accessible library control, including 64 that also contain explicit ARIA. ARIA is not a compliance score: native semantics should be preferred when sufficient, and delegated semantics may live in a composed component or dependency.

Accessibility reporting is centralized in this appendix. Component pages do not repeat a generic Accessibility section. Source metadata retains implementation guarantees, consumer responsibilities, and keyboard behavior; automated checks do not replace human validation.

## Method

The review inspects each primary TypeScript source, component stylesheet, dedicated unit test, and generated documentation page. It records native and library controls, explicit ARIA, keyboard and focus handling, live feedback, motion, focus-outline removal, small text, and missing component tests. The static classification does not inspect the rendered accessibility tree and cannot by itself distinguish a deliberately non-interactive component from every form of delegated interaction. Pattern-specific guarantees are documented only when confirmed directly in the implementation.

The signals below are triage indicators. They identify where targeted inspection or tests are required; they are not, by themselves, confirmed WCAG failures.

## Automated browser checks

The browser matrix uses [Playwright](https://playwright.dev/docs/accessibility-testing) with [axe-core](https://github.com/dequelabs/axe-core).

Semantic foreground/background pairs are declared in `config/accessibility-color-contract.json` and checked in the light and dark themes by the same three browser engines. This prevents a shared token change from silently introducing contrast regressions across multiple components.

Last axe scan: 2026-09-20T11:13:35.695Z  


Ruleset: WCAG 2.2 A and AA. WebKit approximates Safari's rendering engine but does not replace periodic testing in Safari on macOS.

| Browser engine | Component examples | Complete | Violations | Incomplete checks | Scan errors |
| --- | ---: | --- | ---: | ---: | ---: |
| chromium | 171/171 | Yes | 6 | 123 | 0 |
| firefox | 171/171 | No | 5 | 124 | 2 |
| webkit | 171/171 | No | 6 | 118 | 1 |

### Understanding incomplete checks

An incomplete check is a rule for which axe-core found relevant content but could not determine a pass or failure with sufficient certainty. Typical causes include contrast over images or gradients, content hidden behind another element, complex stacking or clipping, and conditions that require visual or semantic judgement. It is not a confirmed violation, but it is also not a pass.

The number in the table is the sum of incomplete axe rule results across all component-example scans for that browser engine, not a count of inaccessible components. Different rendering engines can therefore report slightly different totals. These items form a manual-review queue: inspect the affected node and rule, decide whether it passes, fails, or is not applicable, record the evidence, and fix confirmed failures. A complete browser scan can legitimately contain incomplete checks; `Complete` only means that every expected example ran without a scan error.


### Color and contrast management

The base theme derives color scales from seed tokens, but components consume semantic tokens describing a role and a surface rather than using an arbitrary palette step as text color. For example, a soft brand surface uses the paired `--tp-brand-fill-soft` and `--tp-brand-text-on-soft` tokens; buttons use the guaranteed `fill-loud` / `text-on-loud` pairs. Inline code inherits the surrounding semantic foreground so that it remains valid inside callouts, cards, buttons, and inverted surfaces.

The foreground/background pairs that form the library contract are declared in `config/accessibility-color-contract.json`. A dedicated [Playwright](https://playwright.dev/docs/accessibility-testing) test renders every pair in both `tp-light` and `tp-dark`, then delegates the assessment of the computed browser colors to [axe-core](https://github.com/dequelabs/axe-core). The full component matrix separately checks composed states such as CodeMirror active lines, placeholders, buttons, callouts, graphs, and nested themes.

Text pairs target the [WCAG 2.2 contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum) of 4.5:1 for ordinary text. Essential graphical objects and user-interface boundaries target the [non-text contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast) threshold of 3:1. The color and icon inspectors choose the higher-contrast black or white foreground for arbitrary preview swatches. The library does not otherwise alter author colors dynamically at runtime: a failing shared pair must be corrected in its semantic token and visually reviewed.

Run `pnpm test:a11y:colors` for the color-token contract or `pnpm test:a11y` for the contract plus every documented component example. The latter also regenerates this transversal report.


### Detected violations

::::::::: tp-tabs
Chromium
: | Component | Rule | Impact |
  | --- | --- | --- |
  | `tp-datefield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |
  | `tp-flip-card` | [scrollable-region-focusable](https://dequeuniversity.com/rules/axe/4.13/scrollable-region-focusable?application=playwright) | serious |
  | `tp-numberfield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |
  | `tp-restructuredtext-playground` | [scrollable-region-focusable](https://dequeuniversity.com/rules/axe/4.13/scrollable-region-focusable?application=playwright) | serious |
  | `tp-textfield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |
  | `tp-timefield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |

Firefox
: | Component | Rule | Impact |
  | --- | --- | --- |
  | `tp-datefield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |
  | `tp-flip-card` | [scrollable-region-focusable](https://dequeuniversity.com/rules/axe/4.13/scrollable-region-focusable?application=playwright) | serious |
  | `tp-numberfield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |
  | `tp-textfield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |
  | `tp-timefield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |

WebKit
: | Component | Rule | Impact |
  | --- | --- | --- |
  | `tp-datefield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |
  | `tp-flip-card` | [scrollable-region-focusable](https://dequeuniversity.com/rules/axe/4.13/scrollable-region-focusable?application=playwright) | serious |
  | `tp-markdown-playground` | [scrollable-region-focusable](https://dequeuniversity.com/rules/axe/4.13/scrollable-region-focusable?application=playwright) | serious |
  | `tp-numberfield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |
  | `tp-textfield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |
  | `tp-timefield` | [label](https://dequeuniversity.com/rules/axe/4.13/label?application=playwright) | critical |
:::::::::

### Scan errors

| Component | Browser | Error |
| --- | --- | --- |
| `tp-emoji-picker` | firefox | Test timeout of 60000ms exceeded. |
| `tp-emoji-picker` | webkit | Test timeout of 60000ms exceeded. |
| `tp-symbol-picker` | firefox | Test timeout of 60000ms exceeded. |

## Cross-cutting findings

### High priority

- The axe browser matrix has not completed for every component example in Chromium, Firefox, and WebKit.
- Image insertion in `tp-prose-editor` permits an empty alternative without recording a human-confirmed decorative decision.
- Audio and video insertion does not establish captions, transcript, audio-description, or autoplay evidence.

### Triage queues

Each queue groups components where the static review still detects a specific risk pattern: missing keyboard equivalence, unmitigated motion, a removed focus outline without a visible replacement, undersized text, or missing test coverage. An empty queue means that no corresponding source-code pattern remains detected; it does not replace browser, assistive-technology, or human validation.

- Keyboard-equivalence review: [`tp-typewriting`](../../components/typewriting/index.md)
- Reduced-motion review: None identified.
- Focus-indicator review: None identified.
- Small-text review: [`tp-avatar`](../../components/avatar/index.md)
- Missing detected component test coverage: None identified.

## Future components

Authors should add repeatable `@accessibility`, `@accessibilityresponsibility`, and `@keyboard {Key}` tags to the component class. Keep reporting in this appendix and explain relevant user interactions in Usage rather than adding a generic Accessibility section to each component page.

Author-facing `ul`, `ol`, and `dl` structures are treated as a simple declarative input format. A component may transform that source into a different runtime structure when required by the accessible interaction pattern, while preserving content, order, and relationships. Runtime controls must reuse an existing `tp-*` component whenever one provides the required semantics; a native element is introduced directly only when no suitable library component exists.

A new interactive component is not considered accessibility-reviewed until its detailed contract replaces the static observations and its browser and human verification requirements are recorded here or in the project accessibility report.

## Component inventory

| Component | Contract | Tests | Static evidence | Required follow-up |
| --- | --- | --- | --- | --- |
| [`tp-accordion`](../../components/accordion/index.md) | Detailed | Yes | ARIA, keyboard handling | browser and human validation |
| [`tp-alarm`](../../components/alarm/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-animation`](../../components/animation/index.md) | Detailed | Yes | ARIA, keyboard handling | browser and human validation |
| [`tp-asciidoc`](../../components/asciidoc/index.md) | Static | Yes | ARIA | browser and human validation |
| [`tp-asciidoc-multi-pages`](../../components/asciidoc-multi-pages/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-asciidoc-multi-slides`](../../components/asciidoc-multi-slides/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-asciidoc-playground`](../../components/asciidoc-playground/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-asciidoc-single-page`](../../components/asciidoc-single-page/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-asciidoc-viewer`](../../components/asciidoc-viewer/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-asciidoc-viewer-question`](../../components/asciidoc-viewer-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-avatar`](../../components/avatar/index.md) | Detailed | Yes | ARIA | small text |
| [`tp-avatar-group`](../../components/avatar-group/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-badge`](../../components/badge/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-base`](../../components/base/index.md) | Static | Yes | ARIA, keyboard handling | browser and human validation |
| [`tp-binary`](../../components/binary/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-blank`](../../components/blank/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-box`](../../components/box/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-button`](../../components/button/index.md) | Detailed | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-button-group`](../../components/button-group/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-callout`](../../components/callout/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-card`](../../components/card/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-center`](../../components/center/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-checkbox-list`](../../components/checkbox-list/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-chronometer`](../../components/chronometer/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-clock`](../../components/clock/index.md) | Static | Yes | ARIA | browser and human validation |
| [`tp-cluster`](../../components/cluster/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-code-comment`](../../components/code-comment/index.md) | Detailed | Yes | ARIA | browser and human validation |
| [`tp-code-editor`](../../components/code-editor/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-color`](../../components/color/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-color-picker`](../../components/color-picker/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-compare`](../../components/compare/index.md) | Detailed | Yes | ARIA, keyboard handling | browser and human validation |
| [`tp-console`](../../components/console/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-contextmenu`](../../components/contextmenu/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-copy-code`](../../components/copy-code/index.md) | Static | Yes | ARIA, keyboard handling | browser and human validation |
| [`tp-cover`](../../components/cover/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-crossword`](../../components/crossword/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-cryptarithm`](../../components/cryptarithm/index.md) | Detailed | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-csv-table`](../../components/csv-table/index.md) | Detailed | Yes | ARIA | browser and human validation |
| [`tp-datefield`](../../components/datefield/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-diagram`](../../components/diagram/index.md) | Detailed | Yes | ARIA | browser and human validation |
| [`tp-dialog`](../../components/dialog/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-dir`](../../components/dir/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-divider`](../../components/divider/index.md) | Static | Yes | ARIA | browser and human validation |
| [`tp-dragdrop`](../../components/dragdrop/index.md) | Detailed | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-drawer`](../../components/drawer/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-dropdown`](../../components/dropdown/index.md) | Detailed | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-emoji-picker`](../../components/emoji-picker/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-file-tree`](../../components/file-tree/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-filesystem`](../../components/filesystem/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-fill-blank`](../../components/fill-blank/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-fill-blank-question`](../../components/fill-blank-question/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-flip-card`](../../components/flip-card/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-formula-picker`](../../components/formula-picker/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-frame`](../../components/frame/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-fullscreen`](../../components/fullscreen/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-game-life`](../../components/game-life/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-graph-analog-circuit`](../../components/graph-analog-circuit/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-graph-dfa`](../../components/graph-dfa/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-graph-editor`](../../components/graph-editor/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-graph-geometric-optics`](../../components/graph-geometric-optics/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-graph-logical-circuit`](../../components/graph-logical-circuit/index.md) | Detailed | Yes | native or library controls, keyboard handling | browser and human validation |
| [`tp-graph-nfa`](../../components/graph-nfa/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-graph-petri`](../../components/graph-petri/index.md) | Detailed | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-graph-query-tree`](../../components/graph-query-tree/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-graph-sequential-circuit`](../../components/graph-sequential-circuit/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-grid`](../../components/grid/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-html-multi-pages`](../../components/html-multi-pages/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-html-multi-slides`](../../components/html-multi-slides/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-html-playground`](../../components/html-playground/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-html-single-page`](../../components/html-single-page/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-html-viewer`](../../components/html-viewer/index.md) | Static | Yes | ARIA | browser and human validation |
| [`tp-html-viewer-question`](../../components/html-viewer-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-icon`](../../components/icon/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-icon-button`](../../components/icon-button/index.md) | Detailed | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-icon-picker`](../../components/icon-picker/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-iframe`](../../components/iframe/index.md) | Static | Yes | ARIA | browser and human validation |
| [`tp-include`](../../components/include/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-inline`](../../components/inline/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-javascript-notebook`](../../components/javascript-notebook/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-javascript-playground`](../../components/javascript-playground/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-javascript-playground-question`](../../components/javascript-playground-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-javascript-viewer`](../../components/javascript-viewer/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-javascript-viewer-question`](../../components/javascript-viewer-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-lang`](../../components/lang/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-list-table`](../../components/list-table/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-lorem-ipsum`](../../components/lorem-ipsum/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-loto`](../../components/loto/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-lsystem`](../../components/lsystem/index.md) | Detailed | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-map`](../../components/map/index.md) | Detailed | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-markdown`](../../components/markdown/index.md) | Static | Yes | ARIA | browser and human validation |
| [`tp-markdown-multi-pages`](../../components/markdown-multi-pages/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-markdown-multi-slides`](../../components/markdown-multi-slides/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-markdown-playground`](../../components/markdown-playground/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-markdown-single-page`](../../components/markdown-single-page/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-markdown-viewer`](../../components/markdown-viewer/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-markdown-viewer-question`](../../components/markdown-viewer-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-markup-multi-pages`](../../components/markup-multi-pages/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-markup-multi-slides`](../../components/markup-multi-slides/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-markup-single-page`](../../components/markup-single-page/index.md) | Static | Yes | ARIA | browser and human validation |
| [`tp-markup-viewer-question`](../../components/markup-viewer-question/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-mastermind`](../../components/mastermind/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-matching`](../../components/matching/index.md) | Detailed | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-matching-question`](../../components/matching-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-math`](../../components/math/index.md) | Detailed | Yes | ARIA | browser and human validation |
| [`tp-mathfield`](../../components/mathfield/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-memory`](../../components/memory/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-menu`](../../components/menu/index.md) | Static | Yes | ARIA, keyboard handling | browser and human validation |
| [`tp-modal`](../../components/modal/index.md) | Detailed | Yes | ARIA, keyboard handling | browser and human validation |
| [`tp-multi-asciidoc`](../../components/multi-asciidoc/index.md) | Static | N/A | no component-owned interaction detected | documentation alias |
| [`tp-multi-choice-question`](../../components/multi-choice-question/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-multi-restructuredtext`](../../components/multi-restructuredtext/index.md) | Static | N/A | no component-owned interaction detected | documentation alias |
| [`tp-notebook`](../../components/notebook/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-numberfield`](../../components/numberfield/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-object-tree`](../../components/object-tree/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-playground-question`](../../components/playground-question/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-popover`](../../components/popover/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-post-it`](../../components/post-it/index.md) | Detailed | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-post-it-editor`](../../components/post-it-editor/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-prolog-notebook`](../../components/prolog-notebook/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-prolog-playground`](../../components/prolog-playground/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-prolog-playground-question`](../../components/prolog-playground-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-prolog-viewer`](../../components/prolog-viewer/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-prolog-viewer-question`](../../components/prolog-viewer-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-prose-editor`](../../components/prose-editor/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-python-notebook`](../../components/python-notebook/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-python-playground`](../../components/python-playground/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-python-playground-question`](../../components/python-playground-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-python-viewer`](../../components/python-viewer/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-python-viewer-question`](../../components/python-viewer-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-question`](../../components/question/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-radio-list`](../../components/radio-list/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-restructuredtext`](../../components/restructuredtext/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-restructuredtext-multi-pages`](../../components/restructuredtext-multi-pages/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-restructuredtext-multi-slides`](../../components/restructuredtext-multi-slides/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-restructuredtext-playground`](../../components/restructuredtext-playground/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-restructuredtext-single-page`](../../components/restructuredtext-single-page/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-restructuredtext-viewer`](../../components/restructuredtext-viewer/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-restructuredtext-viewer-question`](../../components/restructuredtext-viewer-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-save-image`](../../components/save-image/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-sidebar`](../../components/sidebar/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-single-choice-question`](../../components/single-choice-question/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-skeleton`](../../components/skeleton/index.md) | Detailed | Yes | ARIA | browser and human validation |
| [`tp-slider`](../../components/slider/index.md) | Static | Yes | keyboard handling | browser and human validation |
| [`tp-solitaire`](../../components/solitaire/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-source`](../../components/source/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-speech-to-text`](../../components/speech-to-text/index.md) | Detailed | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-splitter`](../../components/splitter/index.md) | Detailed | Yes | ARIA, keyboard handling | browser and human validation |
| [`tp-spreadsheet-editor`](../../components/spreadsheet-editor/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-sql-notebook`](../../components/sql-notebook/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-sql-playground`](../../components/sql-playground/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-sql-viewer`](../../components/sql-viewer/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-stack`](../../components/stack/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-sudoku`](../../components/sudoku/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-switcher`](../../components/switcher/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-symbol-picker`](../../components/symbol-picker/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-tabs`](../../components/tabs/index.md) | Detailed | Yes | ARIA, keyboard handling | browser and human validation |
| [`tp-text-to-speech`](../../components/text-to-speech/index.md) | Detailed | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-textfield`](../../components/textfield/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-theme`](../../components/theme/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-timefield`](../../components/timefield/index.md) | Static | Yes | native or library controls | browser and human validation |
| [`tp-timeline`](../../components/timeline/index.md) | Detailed | Yes | ARIA, keyboard handling | browser and human validation |
| [`tp-timer`](../../components/timer/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-toc`](../../components/toc/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-toolbar`](../../components/toolbar/index.md) | Static | Yes | ARIA | browser and human validation |
| [`tp-tooltip`](../../components/tooltip/index.md) | Detailed | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-tree`](../../components/tree/index.md) | Static | Yes | native or library controls, ARIA, keyboard handling | browser and human validation |
| [`tp-turtle`](../../components/turtle/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-typescript-notebook`](../../components/typescript-notebook/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-typescript-playground`](../../components/typescript-playground/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-typescript-playground-question`](../../components/typescript-playground-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-typescript-viewer`](../../components/typescript-viewer/index.md) | Static | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-typescript-viewer-question`](../../components/typescript-viewer-question/index.md) | Detailed | Yes | no component-owned interaction detected | browser and human validation |
| [`tp-typewriting`](../../components/typewriting/index.md) | Detailed | Yes | no component-owned interaction detected | keyboard equivalence |
| [`tp-xy-plot`](../../components/xy-plot/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
| [`tp-yakazu`](../../components/yakazu/index.md) | Static | Yes | native or library controls, ARIA | browser and human validation |
