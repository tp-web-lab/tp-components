# Markup viewer question

`TpMarkupViewerQuestion<TViewer>` is an abstract base inheriting the shared question lifecycle through `TpEditorQuestion`. It reuses an existing markup viewer and tests the HTML produced by its parser. It does not register a custom element.

| Source language | Concrete component |
| --- | --- |
| AsciiDoc | [tp-asciidoc-viewer-question](../asciidoc-viewer-question/index.md) |
| HTML | [tp-html-viewer-question](../html-viewer-question/index.md) |
| Markdown | [tp-markdown-viewer-question](../markdown-viewer-question/index.md) |
| reStructuredText | [tp-restructuredtext-viewer-question](../restructuredtext-viewer-question/index.md) |

## Shared contract

| Attribute | Default | Role |
| --- | --- | --- |
| `src` | <code>""</code> | One external markup source file to edit in the viewer. |
| `test` | <code>""</code> | Trusted JavaScript tests loaded on each submission. |
| `open` | <code>false</code> | Expand the question initially when present. |

Title, Prompt and Solution use the normal question definition list. Form is the fixed language viewer. Feedback contains the test console and report. `tp-question-submit` exposes the current source string as `detail.value`.

## Testing rendered HTML

The current source is rendered again on each submission, even if the learner has not clicked Run. Tests use Mocha/Chai via `@tp/test`. Their `document` is an isolated HTML snapshot, not the documentation page or the viewer toolbar. Author scripts are removed from this test document; this workflow checks rendered markup, not application JavaScript or runtime-only extensions. Supply trusted sources and tests. Browser-side tests are formative, not secure grading, and have no execution timeout.

```js
import { describe, expect, it } from "@tp/test";

describe("Semantic HTML", () => {
  it("contains strong emphasis", () => {
    expect(document.querySelector("strong")?.textContent.trim()).to.equal("Hello");
  });
});
```

Equivalent strong-emphasis syntax in HTML, Markdown, AsciiDoc or reStructuredText passes the same assertion. Tests can similarly inspect links, lists, tables or attributes without demanding one exact source spelling.

Reset restores the original source. Reset, disconnection or source reconfiguration cancels pending work and prevents stale results from replacing a newer report. The implementation shares this lifecycle with [programming questions](../playground-question/index.md), while retaining separate viewer and playground type constraints.
