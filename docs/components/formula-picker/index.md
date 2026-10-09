# <tp-icon name="formula-picker" library="components" size="1.25em"></tp-icon> Formula picker

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-formula-picker>` element implements the <tp-icon name="formula-picker" library="components" size="1.25em"></tp-icon> Formula picker functionality: selects an Excel-compatible Formula.js function. *

<tp-formula-picker></tp-formula-picker>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Browse or search for a formula, then select it. |
| Using the component | In an editor, the selected formula is inserted into the current field; replace its selected parameters with your own values. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

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

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Browse the formulas and select one using the picker controls.

Selection event
: Select a formula to copy the emitted formula text into a clearable textfield.
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
<!-- tp-docgen:api TpFormulaPicker -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-formula-picker>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpFormulaPicker`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-formula-picker-select</code> | <code>&#123; name: unknown; formula: unknown; selectionStart: unknown; selectionEnd: unknown &#125;</code> | Emitted when formula picker select occurs. |
  [Events emitted by `<tp-formula-picker>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-formula-picker>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_formula-picker.TpFormulaPicker.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-formula-picker>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit Formula.js https://formulajs.info/
@summary Excel-compatible formula functions.
-->

- [Formula.js](https://formulajs.info/) : Excel-compatible formula functions.
<!-- tp-docgen:dependencies:end -->
