<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="textfield" library="components" size="1.25em"></tp-icon> Text field

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-textfield>` element provides a single-line and automatically growing multiline text field.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-textfield label="Single line" placeholder="Type some text..." clearable=""></tp-textfield>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-textfield" src="/docs/components/textfield/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

All fields use the same inline convention: ``:tp-textfield:`identifier`{value="Ada" placeholder="…"}``. The inline content initializes `name` only; it never sets `id`, `label` or `value`. An explicit `name` takes precedence. Use `value` for initial content and `placeholder` for a hint; omitting `value` keeps the component's normal default. The HTML equivalent is `<tp-textfield name="identifier" value="Ada" placeholder="…"></tp-textfield>`.

Use the component without `multiline` for an inline native text input. Its default width reserves space for text and the trailing buttons (`calc(20ch + 5rem)`) and can be changed with `width`, `inline-size`, or `--tp-textfield-inline-size`. The `type` attribute accepts `text`, `email`, `password`, `search`, `tel`, and `url`.

Add `multiline` to create a textarea whose width fills its container and whose height follows its content. `rows` defines its initial minimum height.

`aria-label` is forwarded to the native input or textarea to give it an accessible name when no visible label is supplied. It does not display text. Prefer a visible `label` when possible; the example reads back the native attribute so you can verify its propagation.

[`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete) guides browser autofill: `email` identifies an email address, `on` allows generic suggestions, and `off` requests that saved values not be suggested. Other tokens describe names, addresses and similar information. Suggestions depend on the browser, its settings and saved data, and may be unavailable in an embedded viewer; some browsers ignore `off` in particular cases. This is not a custom suggestion list, nor a validation rule. The example displays the hint actually received by the native input.

Set `icon` and optionally `icon-library` to display a prefix. A permanent `t` marker identifies the text field on the right. Add `clearable` to show the clear button beside it; without this attribute the button is hidden. When visible, the button is disabled if the field is empty, readonly or disabled.

Set `label` to display a visible label natively associated with the input or textarea. Selecting the label focuses its field. Use `label-position="top"`, `bottom`, `start`, or `end` to place it around the field; the default is `top`. The logical `start` and `end` positions follow the document writing direction.

A required field displays a colored `*` after its label. Without a label, the marker appears inside the start corner of the control. Native form validation remains active in both cases.

### Events and programmatic interactions

| Interaction | Result |
| --- | --- |
| Type in the field | Updates `value` and emits `input`. |
| <kbd>Ctrl</kbd>/<kbd>Command</kbd> + <kbd>Z</kbd> | Undoes the last native text edit. |
| <kbd>Ctrl</kbd>/<kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>, or <kbd>Ctrl</kbd> + <kbd>Y</kbd> | Redoes the last undone text edit. |
| Commit the value | Emits `change`. |
| Select the clear button | Clears the value and emits `input`, `change`, and `tp-clear`. |
| Call `focus()` | Focuses the native input or textarea. |
| Call `select()` | Selects the complete value. |

### Answer matching in open questions

Set `regexp="colou?r"` on a field in an open `tp-fill-blank-question` to accept either “color” or “colour”. Supply the expression without slash delimiters or flags. The question matches the whole trimmed response and applies its `case-sensitive` setting. Keep the expected solution in the question's Answers list for correction display. Without `regexp`, the question compares the trimmed response with that solution. An accepted wording variant receives a comment and the expected answer; differences only in ignored case or outer spaces do not add that comment. An invalid expression reports an author configuration error without grading the response. This attribute does not set native HTML `pattern` validation outside a question.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/textfield/textfield.js"></script>
  ```

import
: ```js
  import "/path/to/components/textfield/textfield.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/textfield/textfield.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter and edit text in the field using its available controls.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Inline named field
: Edit the inline field. Its role content supplies the form name, while value supplies the initial data; inspect the source to compare the shared convention across markup languages.

Clearable search
: Edit the search text, then use Clear to empty the field.
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
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-copy-code>`](#/components/copy-code/index.md) : Copy-to-clipboard button component.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
