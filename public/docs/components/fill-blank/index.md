<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="fill-blank" library="components" size="1.25em"></tp-icon> Fill in blank

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-fill-blank>` element collects answers in text fields and rich-content blanks.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-fill-blank>
  <p>The capital of France is <tp-textfield name="capital" placeholder="City name" aria-label="Capital of France" clearable=""></tp-textfield>.</p>
</tp-fill-blank>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-fill-blank" src="/docs/components/fill-blank/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use named `<tp-textfield>` controls including `multiline` textfields (or other library fields exposing a light DOM input or textarea), selects or rich `<tp-blank>` controls inside the sentence. Missing names are generated automatically. On connection, blanks are cleared and selects receive an empty option if needed. The component collects values; it does not grade answers.

`value` is a JavaScript property of type `FormData`, **not an HTML attribute**. See [Programming](#programming) to read or update the answers.

The “Selected answer with tp-blank” example offers two SVG images, a triangle and a square, to assign an answer with `blank.setAnswer(value, content)`. Unlike a textfield, `tp-blank` is not editable: it displays the selected image and provides a clear button. The surrounding `tp-fill-blank` includes the selected identity (`triangle` or `square`) in its `FormData` under the name `shape`, independently of the displayed SVG image. This example connects `tp-dragdrop` to the answer choices and the blank. Click a shape or drag its image onto the blank; both interactions call `blank.setAnswer(value, content)` and emit the same change event.

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

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Type a city name into the textfield to complete the sentence, then use its clear button to empty it.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Selected answer with tp-blank
: Select the triangle or square, or drag its image onto the blank, then clear it. Observe each tp-fill-blank-change event, including the stored value and the FormData entries.
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
@tp-dependency tp-blank
@summary Component `<tp-blank>`.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-blank>`](#/components/blank/index.md) : Component `<tp-blank>`.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
