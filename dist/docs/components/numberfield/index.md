<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="numberfield" library="components" size="1.25em"></tp-icon> Number field

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-numberfield>` element provides a numeric field with an optional native range slider.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-cluster>
  <tp-numberfield label="Quantity" value="3" min="0" max="10" clearable=""></tp-numberfield>
  <tp-numberfield label="Level" value="40" min="0" max="100" step="5" range="" clearable=""></tp-numberfield>
</tp-cluster>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-numberfield" src="/docs/components/numberfield/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

All fields use the same inline convention: `:tp-numberfield:\`identifier\`{value="12" placeholder="…"}`. The inline content initializes `name` only; it never sets `id`, `label` or `value`. An explicit `name` takes precedence. Use `value` for initial content and `placeholder` for a hint; omitting `value` keeps the component's normal default. The HTML equivalent is `<tp-numberfield name="identifier" value="12" placeholder="…"></tp-numberfield>`.

Declare `<tp-numberfield>` in HTML or use the native component extension in `@tp/tp-markdown`, `@tp/tp-asciidoc` or `@tp/tp-restructuredtext`. See [Examples](#examples) for all four languages. Boolean attributes are true when present and false when absent.

The default editor is `<input type="number">`. Add `range` to use `<input type="range">` (there is no HTML `<range>` element). Use `min`, `max` and `step` for both representations; `step="any"` permits unrestricted fractional values. Supply numeric strings with a decimal point in attributes. Number inputs preserve out-of-bounds values for native form validation; sliders clamp their values to their limits.

The number field starts empty. Following the [native range rules](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range), a slider always has a value: its default bounds are 0 and 100 and its initial value is 50. An empty value resets it to the midpoint of its current bounds. `placeholder` and `required` apply only to number mode. A readonly slider is disabled internally, with a hidden input preserving its value for form submission; `disabled` excludes it from submission entirely.

Set `label` or `aria-label` for an accessible name, and optionally `label-position` to `top`, `bottom`, `start` or `end`. Add `clearable` to show the clear/reset button. Use `name` for form submission. The native editor is retained when changing settings.

Edits update `value` and emit `input`; committing an edit emits `change`. Clearing/resetting emits `input`, `change` and `tp-clear`. Programmatic assignments update the display without emitting user-edit events. The public `focus()` and `clear()` methods are also available.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/numberfield/numberfield.js"></script>
  ```

import
: ```js
  import "/path/to/components/numberfield/numberfield.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/numberfield/numberfield.js";
  ```
:::

<!-- -->
## Examples

Set `list` to the ID of an external `<datalist>` to provide numeric suggestions or native slider tick marks. In the Attributes example, enter `numberfield-ticks` in `list` and enable `range` to show marks at 0, 25, 50, 75 and 100. Tick appearance follows the browser. Range mode has no surrounding border; its keyboard focus outline remains visible.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter a quantity with the number field and adjust the level with the slider. Try the clear and reset controls.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

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
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
