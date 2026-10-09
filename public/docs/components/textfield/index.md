# <tp-icon name="textfield" library="components" size="1.25em"></tp-icon> Text field

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-textfield>` element implements the <tp-icon name="textfield" library="components" size="1.25em"></tp-icon> Text field functionality: single-line and automatically growing multiline text field.

<tp-textfield label="Single line" placeholder="Type some text..." clearable></tp-textfield>

<tp-textfield label="Multiline" multiline placeholder="Type some text..." clearable value="An example of text that has already been entered in the field"></tp-textfield>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Type or edit text in the field. |
| Using the component | The trailing clear button removes its contents when clearing is available. |
| Using the component | A required-field marker means you must provide a value before submitting the form. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Typing | Enter or edit the value using the field controls; read-only and disabled fields cannot be edited. |
| Enter / Space on Clear | Activate the clear button when available. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

All fields use the same inline convention: `:tp-textfield:\`identifier\`{value="Ada" placeholder="…"}`. The inline content initializes `name` only; it never sets `id`, `label` or `value`. An explicit `name` takes precedence. Use `value` for initial content and `placeholder` for a hint; omitting `value` keeps the component's normal default. The HTML equivalent is `<tp-textfield name="identifier" value="Ada" placeholder="…"></tp-textfield>`.


Use the component without `multiline` for an inline native text input. Its width follows its intrinsic content width and can be changed with `width`, `inline-size`, or `--tp-textfield-inline-size`. The `type` attribute accepts `text`, `email`, `password`, `search`, `tel`, and `url`.

Add `multiline` to create a textarea whose width fills its container and whose height follows its content. `rows` defines its initial minimum height.

`aria-label` is forwarded to the native input or textarea to give it an accessible name when no visible label is supplied. It does not display text. Prefer a visible `label` when possible; the example reads back the native attribute so you can verify its propagation.

[`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete) guides browser autofill: `email` identifies an email address, `on` allows generic suggestions, and `off` requests that saved values not be suggested. Other tokens describe names, addresses and similar information. Suggestions depend on the browser, its settings and saved data, and may be unavailable in an embedded viewer; some browsers ignore `off` in particular cases. This is not a custom suggestion list, nor a validation rule. The example displays the hint actually received by the native input.

Set `icon` and optionally `icon-library` to display a prefix. A permanent `t` marker identifies the text field on the right. Add `clearable` to show the clear button beside it; without this attribute the button is hidden. When visible, the button is disabled if the field is empty, readonly or disabled.

Set `label` to display a visible label natively associated with the input or textarea. Selecting the label focuses its field. Use `label-position="top"`, `bottom`, `start`, or `end` to place it around the field; the default is `top`. The logical `start` and `end` positions follow the document writing direction.

A required field displays a colored `*` after its label. Without a label, the marker appears inside the start corner of the control. Native form validation remains active in both cases.

#### Events and programmatic interactions

| Interaction | Result |
| --- | --- |
| Type in the field | Updates `value` and emits `input`. |
| <kbd>Ctrl</kbd>/<kbd>Command</kbd> + <kbd>Z</kbd> | Undoes the last native text edit. |
| <kbd>Ctrl</kbd>/<kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>, or <kbd>Ctrl</kbd> + <kbd>Y</kbd> | Redoes the last undone text edit. |
| Commit the value | Emits `change`. |
| Select the clear button | Clears the value and emits `input`, `change`, and `tp-clear`. |
| Call `focus()` | Focuses the native input or textarea. |
| Call `select()` | Selects the complete value. |

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter and edit text in the field using its available controls.

Attributes
: Combine boolean, enumerated and text settings on one preview, starting from the documented defaults. Inspect the native accessible name and autocomplete hint, try editing the preview, and restore the defaults with Reset defaults.

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
<!-- tp-docgen:api TpTextfield -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>aria-label</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the aria label. |
  | <code>autocomplete</code> | <code>string</code> | <code>&quot;&quot;</code> | Native autocomplete hint. |
  | <code>clearable</code> | <code>boolean</code> | <code>false</code> | Shows the clear button; it is disabled when empty, readonly or disabled. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables the field and its clear button. |
  | <code>icon</code> | <code>string</code> | <code>&quot;&quot;</code> | Prefix icon name. |
  | <code>icon-library</code> | <code>string</code> | <code>&quot;tp&quot;</code> | Prefix icon library. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Visible label associated with the native input or textarea. |
  | <code>label-position</code> | <code>string</code> | <code>&quot;top&quot;</code> | Label position (`top`, `bottom`, `start`, or `end`). |
  | <code>multiline</code> | <code>boolean</code> | <code>false</code> | Uses an automatically growing textarea instead of an input. |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Name submitted with the containing form; defaults to the initial inline content when omitted. |
  | <code>placeholder</code> | <code>string</code> | <code>&quot;&quot;</code> | Placeholder shown while the field is empty. |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Prevents value editing. |
  | <code>required</code> | <code>boolean</code> | <code>false</code> | Marks the field as required. |
  | <code>rows</code> | <code>number</code> | <code>3</code> | Minimum number of rows in multiline mode. |
  | <code>type</code> | <code>string</code> | <code>&quot;text&quot;</code> | Input type (`text`, `email`, `password`, `search`, `tel`, or `url`). |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Current field value. |
  [Attributes of `<tp-textfield>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>clear</code> | <code>clear(): void</code> | Clears the field and emits `input`, `change`, and `tp-clear`. |
  | <code>focus</code> | <code>focus(options?: FocusOptions): void</code> | Focuses the native input or textarea. |
  | <code>select</code> | <code>select(): void</code> | Selects the complete field value. |
  [Public methods of `TpTextfield`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>change</code> | <code>void</code> | Emitted when the edited value is committed. |
  | <code>input</code> | <code>void</code> | Emitted when the value changes while editing. |
  | <code>tp-clear</code> | <code>void</code> | Emitted after the embedded button clears the value. |
  [Events emitted by `<tp-textfield>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-textfield-background</code> | <code>var(&#45;&#45;tp-paper-color)</code> | Controls the background. |
  | <code>&#45;&#45;tp-textfield-border-color</code> | <code>var(&#45;&#45;tp-neutral-stroke-soft)</code> | Controls the border color. |
  | <code>&#45;&#45;tp-textfield-focus-color</code> | <code>var(&#45;&#45;tp-brand-text-colorful)</code> | Controls the focus color. |
  | <code>&#45;&#45;tp-textfield-inline-size</code> | <code>20ch</code> | Controls the inline size. |
  | <code>&#45;&#45;tp-textfield-label-font-weight</code> | <code>500</code> | Controls the label font weight. |
  | <code>&#45;&#45;tp-textfield-label-gap</code> | <code>0.35em</code> | Controls the label gap. |
  | <code>&#45;&#45;tp-textfield-padding-block</code> | <code>0.6em</code> | Controls the padding block. |
  | <code>&#45;&#45;tp-textfield-padding-inline</code> | <code>0.75em</code> | Controls the padding inline. |
  | <code>&#45;&#45;tp-textfield-radius</code> | <code>var(&#45;&#45;tp-border-radius-sm)</code> | Controls the radius. |
  | <code>&#45;&#45;tp-textfield-required-color</code> | <code>var(&#45;&#45;tp-danger-text-colorful)</code> | Controls the required color. |
  | <code>&#45;&#45;tp-textfield-value-font-weight</code> | <code>400</code> | Controls the value font weight. |
  [CSS properties of `<tp-textfield>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_textfield.TpTextfield.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-textfield>` are loaded automatically by this component if they have not already been loaded by another component.

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

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
