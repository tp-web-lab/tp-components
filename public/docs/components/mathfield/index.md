# <tp-icon name="mathfield" library="components" size="1.25em"></tp-icon> Math field

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-mathfield>` element implements the <tp-icon name="mathfield" library="components" size="1.25em"></tp-icon> Math field functionality: mathematical expression field with live LaTeX or AsciiMath rendering.

<tp-mathfield label="Formula" value="E = mc^2" clearable></tp-mathfield>

## Usage

Click the mathfield mark to choose `latexmath` or `asciimath`. A check marks the active notation. Changing notation updates `mode` and the preview without converting the expression source; the selector is disabled when the field is readonly or disabled.

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Mathfield mark | Open the notation menu; choose latexmath or asciimath. A check identifies the active mode. |
| Using the component | Use the trailing clear button when available to remove the expression. |
| Using the component | A required-field marker means an answer is needed. |
| Using the component | The formula copy button copies the mathematical source. |
| Using the component | Eye opens or closes the rendered preview; its copy button copies the rendered SVG. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Enter / Space on the mathfield mark | Open the notation menu. Use Up / Down to navigate, Enter / Space to select, and Escape to close it. |
| Tab / Shift+Tab | Move between the available controls. |
| Typing | Enter or edit the value using the field controls; read-only and disabled fields cannot be edited. |
| Enter / Space on Clear | Activate the clear button when available. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

All fields use the same inline convention: `:tp-mathfield:\`identifier\`{value="E = mc^2" placeholder="…"}`. The inline content initializes `name` only; it never sets `id`, `label` or `value`. An explicit `name` takes precedence. Use `value` for initial content and `placeholder` for a hint; omitting `value` keeps the component's normal default. The HTML equivalent is `<tp-mathfield name="identifier" value="E = mc^2" placeholder="…"></tp-mathfield>`.


The `mathfield-mark` icon on the right is a button that opens a `tp-dropdown` notation menu. Its `latexmath` and `asciimath` entries show a check before the active mode. The check also follows programmatic changes to `mode`. Add `clearable` to show its clear button; without this attribute the button is hidden. When visible, the button is disabled if the expression is empty, readonly or disabled. Preview and copy controls remain available alongside these markers.

The default `mode="latexmath"` interprets the value as LaTeX and displays the placeholder `Type LaTeX formula...`. Set `mode="asciimath"` to enter an AsciiMath expression and use the corresponding default placeholder. The source remains editable in a `tp-textfield`. A `tp-copy-code` action copies the formula source between the optional Clear button and the always-visible Eye button. Select Eye, or set `preview`, to reveal a MathJax rendering prepared in advance through `tp-markdown`; its own copy action copies the generated SVG. In inline mode the mode name, a vertical `tp-divider`, and the SVG rendering share one line after the field. With `multiline`, the panel keeps its vertical disposition below the field, with a horizontal divider.

Without `multiline`, the editor is single-line, the formula is rendered inline, and the component can occur inside a prose line. Add `multiline` to use an automatically growing editor and display-style mathematical rendering.

The field also supports `label`, `label-position`, `placeholder`, `required`, `readonly`, `disabled`, and `clearable` in the same way as `tp-textfield`.


#### Events and programmatic interactions

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

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Edit the expression, open the mathfield mark menu and choose latexmath or asciimath. Observe the active check and open the preview; changing notation preserves the source text.

Attributes
: Combine all attribute settings on one preview, initialized at the documented defaults, then use Reset defaults to restore them. Try the two notation modes, multiline editing and formula preview; changes made with the preview button are reflected in the checkbox.

Inline in prose
: Edit the mathematical field embedded directly in a sentence.

Inline named field
: Edit the inline field. Its role content supplies the form name, while value supplies the initial data; inspect the source to compare the shared convention across markup languages.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpMathfield -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>autocomplete</code> | <code>string</code> | <code>&quot;&quot;</code> | Native autocomplete hint. |
  | <code>clearable</code> | <code>boolean</code> | <code>false</code> | Shows the clear button; it is disabled when empty, readonly or disabled. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables the field. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Visible label associated with the editing field. |
  | <code>label-position</code> | <code>string</code> | <code>&quot;top&quot;</code> | Label position (`top`, `bottom`, `start`, or `end`). |
  | <code>mode</code> | <code>string</code> | <code>&quot;latexmath&quot;</code> | Mathematical notation (`latexmath` or `asciimath`). |
  | <code>multiline</code> | <code>boolean</code> | <code>false</code> | Uses a multiline editor and display-style rendering. |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Name submitted with the containing form; defaults to the initial inline content when omitted. |
  | <code>placeholder</code> | <code>string</code> | <code>&quot;Type LaTeX formula...&quot;</code> | Placeholder shown while the field is empty; defaults to the active notation mode. |
  | <code>preview</code> | <code>boolean</code> | <code>false</code> | Opens the rendered MathJax preview panel. |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Prevents value editing. |
  | <code>required</code> | <code>boolean</code> | <code>false</code> | Marks the field as required. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Mathematical expression source. |
  [Attributes of `<tp-mathfield>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>clear</code> | <code>clear(): void</code> | Clears the expression and emits `input`, `change`, and `tp-clear`. |
  | <code>focus</code> | <code>focus(options?: FocusOptions): void</code> | Focuses the expression editor. |
  | <code>getValue</code> | <code>getValue(): string</code> | Returns the mathematical expression source. |
  [Public methods of `TpMathfield`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>change</code> | <code>void</code> | Emitted when the expression is committed or a different notation is selected in the menu. |
  | <code>input</code> | <code>void</code> | Emitted when the expression changes while editing. |
  | <code>tp-clear</code> | <code>void</code> | Emitted after the embedded button clears the expression. |
  | <code>tp-math-rendered</code> | <code>&#123; mode: unknown; value: string &#125;</code> | Emitted after MathJax finishes rendering the expression. |
  [Events emitted by `<tp-mathfield>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-mathfield-inline-size</code> | <code>28rem</code> | Controls the inline size. |
  | <code>&#45;&#45;tp-mathfield-preview-background</code> | <code>Canvas</code> | Controls the preview background. |
  | <code>&#45;&#45;tp-mathfield-preview-border-color</code> | <code>var(&#45;&#45;tp-neutral-stroke-soft)</code> | Controls the preview border color. |
  | <code>&#45;&#45;tp-mathfield-preview-padding</code> | <code>0.75rem</code> | Controls the preview padding. |
  [CSS properties of `<tp-mathfield>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_mathfield.TpMathfield.html)
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

## Dependencies

### Internal

All tp-components used by `<tp-mathfield>` are loaded automatically by this component if they have not already been loaded by another component.

- [`<tp-base>`](../base/index.md): Shared base class for tp-* components.
- [`<tp-copy-code>`](../copy-code/index.md): Copies the textual content of a target component to the clipboard.
- [`<tp-divider>`](../divider/index.md): Visual separator.
- [`<tp-icon-button>`](../icon-button/index.md): Accessible icon button component.
- [`<tp-markdown>`](../markdown/index.md): Markdown rendering component.
- [`<tp-textfield>`](../textfield/index.md): Single-line and automatically growing multiline text field.

### External

- [MathJax](https://www.mathjax.org/): Mathematical notation rendering.

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-mathfield>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-copy-code
@summary Copy-to-clipboard button component.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
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
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-copy-code>`](../copy-code/index.md) : Copy-to-clipboard button component.
- [`<tp-divider>`](../divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](../dropdown/index.md) : Dropdown menu component.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-markdown>`](../markdown/index.md) : Markdown rendering component.
- [`<tp-textfield>`](../textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
