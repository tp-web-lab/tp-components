# <tp-icon name="post-it-editor" library="components" size="1.25em"></tp-icon> Post-it editor

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-post-it-editor>` element creates and edits persistent personal annotations attached to document elements.

<tp-box id="post-it-editor-example">
  <p>Select this first paragraph to attach a note about the introduction.</p>
  <p>Or select this second paragraph to attach a different note. Reload this page to restore saved notes.</p>
</tp-box>
<tp-post-it-editor for="#post-it-editor-example" page="post-it-editor-example"></tp-post-it-editor>

## Usage

### User interactions

#### Mouse interactions

| Control | Result |
| --- | --- |
| Personal annotations | Open the annotation manager. |
| + | Keep the editor open and select an element in the document. The pointer becomes a crosshair and hovered paragraphs, headings and other selectable content receive a dotted outline. Selecting a target opens the note fields in the same panel. |
| Annotation language | In the header before Close, choose AsciiDoc, HTML, Markdown, reStructuredText or Plain text (default). Each menu entry has an icon and the selected entry has a check. The tp-icon-button trigger shows only the current language icon; the full name remains available in the menu and accessible description. Language and color settings are enabled while editing a note. |
| Annotation text | Write the source; the clear button empties the field. |
| Heading, color, opacity and rotation | Customize the note before saving. The tp-color palette button is in the header, between the language trigger and Close. The choice affects only this draft until Save, not the document's colors. Cancel discards it and Reset appearance defaults restores yellow. |
| Save / Cancel | Save locally or discard draft changes. |
| Pin | Open or fold a note; drag it to move its attachment within the selected document container. A drop outside this area restores the previous attachment. |
| Pencil / Delete | Edit or delete the chosen saved note. |
| Reattach | Choose a new target, including when the original target has disappeared. |

A post-it can only be repositioned inside the element selected as the editor's document container (`for` or `setTarget`). Its pin must be dropped on content inside that container, not elsewhere on the page. It may move between paragraphs within this area; the expanded note itself can overlap its edges.

#### Keyboard interactions

| Key | Result |
| --- | --- |
| Tab / Shift+Tab | Navigate editor controls and document targets during selection. |
| Enter / Space | Activate a focused button. Enter selects a focused document target. |
| Arrow keys in the language dropdown | Navigate language choices; Enter selects one. |
| Arrow keys on a pin or header | Move the note by 10 pixels, or 1 pixel with Shift. |
| Escape | Cancel target selection while keeping the editor open, or close the language dropdown. |
| Ctrl+? | Open User Help for the hovered or focused component. |

### Markup language

Use `markup="html|markdown|asciidoc|restructuredtext|none"` to choose the language for new notes. The default, `none`, displays literal text. Unknown values also fall back to `none`. For example, `markup="markdown"` renders `**Important**` as bold text after saving.

The header’s language icon opens a `tp-dropdown` containing the five languages, with a check beside the current choice. Choosing a language updates `markup` and the active draft; changing the attribute also updates the dropdown without discarding typed text. Each saved note retains its own language. Opening an older note restores that language; notes without stored language remain plain text. Rendering occurs on Save, while the editor always keeps the original source.

### Mathematical formulas

Choose Markdown in the language menu and write, for example, ``:tp-math:`x^2`{}``. After Save, the note renders the formula with MathJax. HTML notes can use `<tp-math value="x^2"></tp-math>`; add `displaystyle` for a centered block or `mode="asciimath"` for AsciiMath. Parser-generated LaTeX and AsciiMath placeholders are also rendered. Plain text (`markup="none"`) keeps the source literal.

### Author directives

Set `for` to a CSS selector identifying the document container. Alternatively, call `setTarget(element)` after creating the editor. `page` provides a stable storage identifier; without it, the current URL without its fragment is used. The single-page and multi-page components use this editor automatically and switch its storage scope when navigating.

`for` defines the selectable area, not the individual annotation target. In Basic usage, the box contains two paragraphs: use + and choose which paragraph should receive the note. The floating editor is positioned over the document column, including its table of contents, rather than constrained to the selectable box.

The open editor recalculates its width and right edge when the viewport or document column changes size, including when the multi-page sidebar is toggled. Attached notes follow the document layout; drag an expanded note by its header, excluding the pin and Reset buttons.

In the Attributes example, enter `#post-it-editor-example` in the `for` field to activate the editor for the sample paragraph. Clearing it disconnects the editor from that paragraph. Change `page` to try an independent set of locally saved notes.

Notes are stored only in this browser's localStorage, not on a server. Clearing browser data removes them. The original source and chosen language are retained when editing. Existing annotations without a language remain plain text (`txt`). The editor uses the library's Markdown, AsciiDoc and reStructuredText parsers; HTML and parser output are sanitized before display. Scripts, event handlers, embedded frames and custom elements other than `tp-math` are not executed. Formula source URLs are not loaded. If conversion fails, the source remains visible with an error message.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open Personal annotations, use + and choose either paragraph inside the box. The for attribute limits the selectable area, while your click chooses the individual target; write and save a note, then reload to restore it.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API

<!-- tp-docgen:api TpPostItEditor -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>for</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector of the document container to annotate; without it, use setTarget(). |
  | <code>markup</code> | <code>&quot;html&quot; \| &quot;markdown&quot; \| &quot;asciidoc&quot; \| &quot;restructuredtext&quot; \| &quot;none&quot;</code> | <code>&quot;none&quot;</code> | Default language for new notes; changes also apply to the active draft. |
  | <code>page</code> | <code>string</code> | <code>&quot;&quot;</code> | Stable document identifier for localStorage; defaults to the current URL without its fragment. |
  [Attributes of `<tp-post-it-editor>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>dispose</code> | <code>dispose(): void</code> | Explicit cleanup for consumers replacing their document shell. |
  | <code>setPage</code> | <code>setPage(page: string): void</code> | Changes storage scope; an empty value suspends annotation creation in source mode. |
  | <code>setTarget</code> | <code>setTarget(target: HTMLElement): void</code> | Supplies a target without relying on a document-wide selector. |
  [Public methods of `TpPostItEditor`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-post-it-editor>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-post-it-editor>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_post-it-editor.TpPostItEditor.html)
<!-- tp-docgen:typedoc:end -->



































































































### Imports

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/post-it-editor/post-it-editor.js"></script>
  ```

import
: ```js
  import "/path/to/components/post-it-editor/post-it-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/post-it-editor/post-it-editor.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-post-it-editor>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-box
@summary Simple box layout component.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-cluster
@summary Flexible cluster layout component.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-numberfield
@summary Numeric field with an optional native range slider.
-->
<!--
@tp-dependency tp-post-it
@summary displays a movable floating paper note that folds into a pushpin.
-->
<!--
@tp-dependency tp-stack
@summary Vertical stack layout component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-box>`](../box/index.md) : Simple box layout component.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-cluster>`](../cluster/index.md) : Flexible cluster layout component.
- [`<tp-color>`](../color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-dropdown>`](../dropdown/index.md) : Dropdown menu component.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-numberfield>`](../numberfield/index.md) : Numeric field with an optional native range slider.
- [`<tp-post-it>`](../post-it/index.md) : displays a movable floating paper note that folds into a pushpin.
- [`<tp-stack>`](../stack/index.md) : Vertical stack layout component.
- [`<tp-textfield>`](../textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@credit DOMPurify https://github.com/cure53/DOMPurify
@summary HTML sanitization.
-->

- [DOMPurify](https://github.com/cure53/DOMPurify) : HTML sanitization.
<!-- tp-docgen:dependencies:end -->
