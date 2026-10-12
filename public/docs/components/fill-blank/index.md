# <tp-icon name="fill-blank" library="components" size="1.25em"></tp-icon> Fill in blank

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-fill-blank>` element implements the <tp-icon name="fill-blank" library="components" size="1.25em"></tp-icon> Fill in blank functionality: manages inline fields and rich blanks and exposes their values as `FormData`.

<tp-fill-blank>
  <p>The capital of France is <tp-textfield name="capital" placeholder="City name" aria-label="Capital of France" clearable></tp-textfield>.</p>
</tp-fill-blank>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Answer choices in the example | Click a shape or drag it onto the blank to assign it. |
| Using the component | Type in editable fields, or use the answer choices provided by the surrounding exercise for closed blanks. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use named `<tp-textfield>` controls (or other library fields exposing a light DOM input), selects or rich `<tp-blank>` controls inside the sentence. Missing names are generated automatically. On connection, blanks are cleared and selects receive an empty option if needed. The component collects values; it does not grade answers.

`value` is a JavaScript property of type `FormData`, **not an HTML attribute**. See [Programming](#programming) to read or update the answers.

The “Selected answer with tp-blank” example offers two SVG images, a triangle and a square, to assign an answer with `blank.setAnswer(value, content)`. Unlike a textfield, `tp-blank` is not editable: it displays the selected image and provides a clear button. The surrounding `tp-fill-blank` includes the selected identity (`triangle` or `square`) in its `FormData` under the name `shape`, independently of the displayed SVG image. This example connects `tp-dragdrop` to the answer choices and the blank. Click a shape or drag its image onto the blank; both interactions call `blank.setAnswer(value, content)` and emit the same change event.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Type a city name into the textfield to complete the sentence, then use its clear button to empty it.

Selected answer with tp-blank
: Select the triangle or square, or drag its image onto the blank, then clear it. Observe each tp-fill-blank-change event, including the stored value and the FormData entries.
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

### Value property

`element.value` returns a new `FormData` snapshot, with one entry per named blank in document order. Duplicate names are preserved. Editing this snapshot does not change the fields until it is assigned back.

```js
const blanks = document.querySelector("tp-fill-blank");
if (blanks) {
  const answers = blanks.value;
  answers.set("capital", "Paris");
  blanks.value = answers;
}
```

Assignment uses the first string entry for each name, ignores file entries and clears fields missing from the supplied data. An unmatched select value leaves no selection. Assigning `value` or calling `reset()` does not emit change events. `reset()` restores the cleared initialization state, not authored prefilled values.

### API
<!-- tp-docgen:api TpFillBlank -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-fill-blank>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>reset</code> | <code>reset(): void</code> | Resets all blanks to initial values. |
  [Public methods of `TpFillBlank`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-fill-blank-change</code> | <code>&#123; value: Record&lt;string, string&gt;; formData: FormData &#125;</code> | Fired in response to an input or change event from a blank; bubbles and crosses shadow boundaries. The detail contains a plain object of values and a FormData snapshot. For duplicate names, the object keeps the last value while FormData preserves all entries. |
  [Events emitted by `<tp-fill-blank>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-fill-blank>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_fill-blank.TpFillBlank.html)
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
  <script type="module" src="/path/to/components/fill-blank/fill-blank.js"></script>
  ```

import
: ```js
  import "/path/to/components/fill-blank/fill-blank.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/fill-blank/fill-blank.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-fill-blank>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-blank
@summary displays a text, SVG or image answer in a focusable blank.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-blank>`](../blank/index.md) : displays a text, SVG or image answer in a focusable blank.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
