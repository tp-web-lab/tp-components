# <tp-icon name="datefield" library="components" size="1.25em"></tp-icon> Date field

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-datefield>` element implements the <tp-icon name="datefield" library="components" size="1.25em"></tp-icon> Date field functionality: native date field with labels, constraints, picker access, and clearing.

<tp-datefield label="Date" value="2026-09-03" clearable></tp-datefield>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Type a date or use the browser's date picker. |
| Using the component | The display follows your locale. |
| Using the component | Use the clear control when available to remove the selected date. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Typing | Enter or edit the value using the field controls; read-only and disabled fields cannot be edited. |
| Enter / Space on Clear | Activate the clear button when available. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

All fields use the same inline convention: `:tp-datefield:\`identifier\`{value="2026-10-05" placeholder="…"}`. The inline content initializes `name` only; it never sets `id`, `label` or `value`. An explicit `name` takes precedence. Use `value` for initial content and `placeholder` for a hint; omitting `value` keeps the component's normal default. The HTML equivalent is `<tp-datefield name="identifier" value="2026-10-05" placeholder="…"></tp-datefield>`.

Native date and time controls may ignore `placeholder` and show their browser-provided date/time hint instead.


Use `value`, `min`, and `max` with the native `YYYY-MM-DD` format. The browser displays and edits the date according to the user's locale. `step` expresses an interval in days.

Set `label` to associate a visible label with the date input. `label-position` accepts `top`, `bottom`, `start`, and `end`. Add `clearable` to let the user remove the selected date. A required field displays a colored `*` after its label, or inside the start corner of the control when no label is present. Native form validation remains active in both cases.

#### Events and programmatic interactions

| Interaction | Result |
| --- | --- |
| Select or type a date | Updates `value` and emits `input`. |
| Commit the date | Emits `change`. |
| Select the calendar button | Opens the browser's native date picker. |
| Select the clear button | Clears `value` and emits `input`, `change`, and `tp-clear`. |

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Choose or enter a date using the field and its date controls.

Attributes
: Combine all attribute settings on one preview, initialized at the documented defaults, then use Reset defaults to restore them. Test date limits and the step in days using YYYY-MM-DD values; invalid settings leave the last valid value unchanged.

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
<!-- tp-docgen:api TpDatefield -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>autocomplete</code> | <code>string</code> | <code>&quot;&quot;</code> | Native autocomplete hint. |
  | <code>clearable</code> | <code>boolean</code> | <code>false</code> | Shows an embedded clear button while the field has a value. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables the field and its action buttons. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Visible label associated with the native date input. |
  | <code>label-position</code> | <code>string</code> | <code>&quot;top&quot;</code> | Label position (`top`, `bottom`, `start`, or `end`). |
  | <code>max</code> | <code>string</code> | <code>&quot;&quot;</code> | Latest selectable date in `YYYY-MM-DD` format. |
  | <code>min</code> | <code>string</code> | <code>&quot;&quot;</code> | Earliest selectable date in `YYYY-MM-DD` format. |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Name submitted with the containing form; defaults to the initial inline content when omitted. |
  | <code>placeholder</code> | <code>string</code> | <code>&quot;&quot;</code> | Hint forwarded to the native input; browsers may ignore it for date and time controls. |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Prevents value editing. |
  | <code>required</code> | <code>boolean</code> | <code>false</code> | Marks the field as required. |
  | <code>step</code> | <code>number</code> | <code>1</code> | Date interval in days. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Selected date in `YYYY-MM-DD` format. |
  [Attributes of `<tp-datefield>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>clear</code> | <code>clear(): void</code> | Clears the selected date and emits `input`, `change`, and `tp-clear`. |
  | <code>focus</code> | <code>focus(options?: FocusOptions): void</code> | Focuses the native date input. |
  | <code>showPicker</code> | <code>showPicker(): void</code> | Opens the native date picker when supported by the browser. |
  [Public methods of `TpDatefield`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>change</code> | <code>void</code> | Emitted when the selected date is committed. |
  | <code>input</code> | <code>void</code> | Emitted when the selected date changes while editing. |
  | <code>tp-clear</code> | <code>void</code> | Emitted after the embedded button clears the value. |
  [Events emitted by `<tp-datefield>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-datefield-background</code> | <code>var(&#45;&#45;tp-paper-color)</code> | Controls the background. |
  | <code>&#45;&#45;tp-datefield-border-color</code> | <code>var(&#45;&#45;tp-neutral-stroke-soft)</code> | Controls the border color. |
  | <code>&#45;&#45;tp-datefield-focus-color</code> | <code>var(&#45;&#45;tp-brand-text-colorful)</code> | Controls the focus color. |
  | <code>&#45;&#45;tp-datefield-inline-size</code> | <code>12.5em</code> | Controls the inline size. |
  | <code>&#45;&#45;tp-datefield-label-font-weight</code> | <code>500</code> | Controls the label font weight. |
  | <code>&#45;&#45;tp-datefield-label-gap</code> | <code>0.35em</code> | Controls the label gap. |
  | <code>&#45;&#45;tp-datefield-padding-block</code> | <code>0.6em</code> | Controls the padding block. |
  | <code>&#45;&#45;tp-datefield-padding-inline</code> | <code>0.75em</code> | Controls the padding inline. |
  | <code>&#45;&#45;tp-datefield-radius</code> | <code>var(&#45;&#45;tp-border-radius-sm)</code> | Controls the radius. |
  | <code>&#45;&#45;tp-datefield-required-color</code> | <code>var(&#45;&#45;tp-danger-text-colorful)</code> | Controls the required color. |
  | <code>&#45;&#45;tp-datefield-value-font-weight</code> | <code>400</code> | Controls the value font weight. |
  [CSS properties of `<tp-datefield>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_datefield.TpDatefield.html)
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
  <script type="module" src="/path/to/components/datefield/datefield.js"></script>
  ```

import
: ```js
  import "/path/to/components/datefield/datefield.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/datefield/datefield.js";
  ```
:::

## Dependencies

### Internal

All tp-components used by `<tp-datefield>` are loaded automatically by this component if they have not already been loaded by another component.

- [`<tp-base>`](../base/index.md): Shared base class for tp-* components.
- [`<tp-icon-button>`](../icon-button/index.md): Accessible icon button component.

### External

No external dependency

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-datefield>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
