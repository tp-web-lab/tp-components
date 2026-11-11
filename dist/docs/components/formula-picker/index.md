<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="formula-picker" library="components" size="1.25em"></tp-icon> Formula picker

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-formula-picker>` element browses and selects spreadsheet functions.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-formula-picker></tp-formula-picker>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-formula-picker" src="/docs/components/formula-picker/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Listen for `tp-formula-picker-select` to insert the selected formula into an input or an editor. The event provides the complete formula and the range occupied by its parameters.

```html
<tp-formula-picker id="formula-picker"></tp-formula-picker>
<input id="formula" aria-label="Formula" />

<script type="module">
  const picker = document.querySelector("#formula-picker");
  const input = document.querySelector("#formula");

  picker.addEventListener("tp-formula-picker-select", (event) => {
    const { formula, selectionStart, selectionEnd } = event.detail;
    input.value = formula;
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  });
</script>
```

For example, selecting `ABS(number)` produces `=ABS(number)` and selects `number`. Variadic functions use descriptive placeholders such as `=SUM(number1, …)`. This lets the user immediately replace the proposed arguments.

The picker is integrated into `<tp-spreadsheet-editor>`, where the selected signature is inserted into the formula bar.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/formula-picker/formula-picker.js"></script>
  ```

import
: ```js
  import "/path/to/components/formula-picker/formula-picker.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/formula-picker/formula-picker.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Browse the formulas and select one using the picker controls.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Selection event
: Select a formula to copy the emitted formula text into a clearable textfield.
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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit Formula.js https://formulajs.info/
@summary Excel-compatible formula functions.
-->

- [Formula.js](https://formulajs.info/) : Excel-compatible formula functions.
<!-- tp-docgen:dependencies:end -->
