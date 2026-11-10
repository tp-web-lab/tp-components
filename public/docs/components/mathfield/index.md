<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="mathfield" library="components" size="1.25em"></tp-icon> Math field

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-mathfield>` element provides a mathematical expression field with live LaTeX or AsciiMath rendering.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-mathfield label="Formula" value="E = mc^2" clearable=""></tp-mathfield>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-mathfield" src="/docs/components/mathfield/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

Click the mathfield mark to choose `latexmath` or `asciimath`. A check marks the active notation. Changing notation updates `mode` and the preview without converting the expression source; the selector is disabled when the field is readonly or disabled.

### Authoring

All fields use the same inline convention: ``:tp-mathfield:`identifier`{value="E = mc^2" placeholder="…"}``. The inline content initializes `name` only; it never sets `id`, `label` or `value`. An explicit `name` takes precedence. Use `value` for initial content and `placeholder` for a hint; omitting `value` keeps the component's normal default. The HTML equivalent is `<tp-mathfield name="identifier" value="E = mc^2" placeholder="…"></tp-mathfield>`.

The `mathfield-mark` icon on the right is a button that opens a `tp-dropdown` notation menu. Its `latexmath` and `asciimath` entries show a check before the active mode. The check also follows programmatic changes to `mode`. Add `clearable` to show its clear button; without this attribute the button is hidden. When visible, the button is disabled if the expression is empty, readonly or disabled. Preview and copy controls remain available alongside these markers.

The default `mode="latexmath"` interprets the value as LaTeX and displays the placeholder `Type LaTeX formula...`. Set `mode="asciimath"` to enter an AsciiMath expression and use the corresponding default placeholder. The source remains editable in a `tp-textfield`. A `tp-copy-code` action copies the formula source between the optional Clear button and the always-visible Eye button. Select Eye, or set `preview`, to reveal a MathJax rendering prepared in advance through `tp-markdown`; its own copy action copies the generated SVG. The preview shows the formula and its copy action, without a notation prefix. With `multiline`, the panel appears below the field.

Add `mathlive` to offer a pencil icon button between source copy and Eye in LaTeX mode. It opens a MathLive `<math-field>` with a virtual keyboard; edits update the LaTeX source and preview immediately, and source edits update the visual editor. MathLive and its fonts load locally on the first opening. The icon changes to a crossed-out pencil while the editor is open. Close it using that icon or Escape. Changing to AsciiMath, removing `mathlive`, or making the field readonly or disabled closes it.

The preview uses MathJax through `tp-markdown`; visual editing uses MathLive. When the field belongs to an open [`tp-fill-blank-question`](../fill-blank-question/index.md), mathematical answer checking is handled by that question using CortexJS Compute Engine, loaded only when a mathematical answer is checked. A standalone `tp-mathfield` does not load Compute Engine.

Without `multiline`, the editor is single-line, the formula is rendered inline, and the component can occur inside a prose line. Add `multiline` to use an automatically growing editor and display-style mathematical rendering.

The field also supports `label`, `label-position`, `placeholder`, `required`, `readonly`, `disabled`, and `clearable` in the same way as `tp-textfield`.

### Events and programmatic interactions

| Interaction | Result |
| --- | --- |
| Edit the expression | Updates `value`, emits `input`, and refreshes the MathJax preview. |
| Commit the expression | Emits `change`. |
| Choose a different notation in the menu | Updates `mode`, refreshes the placeholder and preview, and emits `change`. The source in `value` is preserved; no LaTeX/AsciiMath conversion is performed. |
| Set `mode` programmatically | Updates the menu check, default placeholder and preview without emitting `change`. An explicit `placeholder` is preserved. |
| Select the clear button | Clears the expression and emits `input`, `change`, and `tp-clear`. |
| Select the formula copy button | Copies the mathematical source. |
| Select the Eye button | Opens or closes the rendered preview panel. Inline formulas are aligned to the start; multiline formulas are centered. |
| Select the rendered copy button | Copies the generated MathJax SVG. |
| MathJax finishes rendering | Emits `tp-math-rendered`. |

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/mathfield/mathfield.js"></script>
  ```

import
: ```js
  import "/path/to/components/mathfield/mathfield.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/mathfield/mathfield.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit the expression, open the mathfield mark menu and choose latexmath or asciimath. Observe the active check and open the preview; changing notation preserves the source text.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Inline in prose
: Edit the mathematical field embedded directly in a sentence.

Inline named field
: Edit the inline field. Its role content supplies the form name, while value supplies the initial data; inspect the source to compare the shared convention across markup languages.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
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
@tp-dependency tp-copy-code
@summary Copy-to-clipboard button component.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-copy-code>`](#/components/copy-code/index.md) : Copy-to-clipboard button component.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-textfield>`](#/components/textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@credit MathJax https://www.mathjax.org/
@summary Mathematical notation rendering.
-->
<!--
@credit MathLive https://mathlive.io/
@summary Visual LaTeX editing and mathematical keyboard, loaded on demand.
-->
<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [MathJax](https://www.mathjax.org/) : Mathematical notation rendering.
- [MathLive](https://mathlive.io/) : Visual LaTeX editing and mathematical keyboard, loaded on demand.
- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
