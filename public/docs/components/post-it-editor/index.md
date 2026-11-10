<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="post-it-editor" library="components" size="1.25em"></tp-icon> Post-it editor

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-post-it-editor>` element creates and edits persistent personal annotations attached to document elements.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box id="post-it-editor-example">
  <p>Select this first paragraph to attach a note about the introduction.</p>
  <p>Or select this second paragraph to attach a different note. Reload this page to restore saved notes.</p>
</tp-box>
<tp-post-it-editor for="#post-it-editor-example" page="post-it-editor-example"></tp-post-it-editor>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-post-it-editor" src="/docs/components/post-it-editor/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Markup language

Use `markup="html|markdown|asciidoc|restructuredtext|none"` to choose the language for new notes. The default, `none`, displays literal text. Unknown values also fall back to `none`. For example, `markup="markdown"` renders `**Important**` as bold text after saving.

The header’s language icon opens a `tp-dropdown` containing the five languages, with a check beside the current choice. Choosing a language updates `markup` and the active draft; changing the attribute also updates the dropdown without discarding typed text. Each saved note retains its own language. Opening an older note restores that language; notes without stored language remain plain text. Rendering occurs on Save, while the editor always keeps the original source.

### Mathematical formulas

Choose Markdown in the language menu and write, for example, ``:tp-math:`x^2`{}``. After Save, the note renders the formula with MathJax. HTML notes can use `<tp-math value="x^2"></tp-math>`; add `displaystyle` for a centered block or `mode="asciimath"` for AsciiMath. Parser-generated LaTeX and AsciiMath placeholders are also rendered. Plain text (`markup="none"`) keeps the source literal.

### Authoring

Set `for` to a CSS selector identifying the document container. Alternatively, call `setTarget(element)` after creating the editor. `page` provides a stable storage identifier; without it, the current URL without its fragment is used. The single-page and multi-page components use this editor automatically and switch its storage scope when navigating.

`for` defines the selectable area, not the individual annotation target. In Basic usage, the box contains two paragraphs: use + and choose which paragraph should receive the note. The floating editor is positioned over the document column, including its table of contents, rather than constrained to the selectable box.

The open editor recalculates its width and right edge when the viewport or document column changes size, including when the multi-page sidebar is toggled. Attached notes follow the document layout; drag an expanded note by its header, excluding the pin and Reset buttons.

In the Attributes example, enter `#post-it-editor-example` in the `for` field to activate the editor for the sample paragraph. Clearing it disconnects the editor from that paragraph. Change `page` to try an independent set of locally saved notes.

Notes are stored only in this browser's localStorage, not on a server. Clearing browser data removes them. The original source and chosen language are retained when editing. Existing annotations without a language remain plain text (`txt`). The editor uses the library's Markdown, AsciiDoc and reStructuredText parsers; HTML and parser output are sanitized before display. Scripts, event handlers, embedded frames and custom elements other than `tp-math` are not executed. Formula source URLs are not loaded. If conversion fails, the source remains visible with an error message.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Open Personal annotations, use + and choose either paragraph inside the box. The for attribute limits the selectable area, while your click chooses the individual target; write and save a note, then reload to restore it.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

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
@summary Component `<tp-post-it>`.
-->
<!--
@tp-dependency tp-stack
@summary Vertical stack layout component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-box>`](#/components/box/index.md) : Simple box layout component.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](#/components/button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-cluster>`](#/components/cluster/index.md) : Flexible cluster layout component.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-numberfield>`](#/components/numberfield/index.md) : Numeric field with an optional native range slider.
- [`<tp-post-it>`](#/components/post-it/index.md) : Component `<tp-post-it>`.
- [`<tp-stack>`](#/components/stack/index.md) : Vertical stack layout component.
- [`<tp-textfield>`](#/components/textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@credit DOMPurify https://github.com/cure53/DOMPurify
@summary HTML sanitization.
-->

- [DOMPurify](https://github.com/cure53/DOMPurify) : HTML sanitization.
<!-- tp-docgen:dependencies:end -->
