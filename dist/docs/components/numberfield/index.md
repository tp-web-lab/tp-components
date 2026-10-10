# <tp-icon name="numberfield" library="components" size="1.25em"></tp-icon> Number field

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-numberfield>` element implements the <tp-icon name="numberfield" library="components" size="1.25em"></tp-icon> Number field functionality: numeric field with an optional native range slider.

<tp-cluster>
  <tp-numberfield label="Quantity" value="3" min="0" max="10" clearable></tp-numberfield>
  <tp-numberfield label="Level" value="40" min="0" max="100" step="5" range clearable></tp-numberfield>
</tp-cluster>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Number field | Click to enter a number, or use the browser's increment/decrement controls. |
| Slider | Drag the thumb to change the value shown next to the # marker. |
| Clear button | Empty a number field; for a slider, restore the native midpoint rounded to an allowed step. |
| Unavailable field | Read-only and disabled fields cannot be edited. Number formatting follows the browser's locale. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Typing in number mode | Enter or edit the number. |
| Arrow keys | Adjust the number or the focused slider. |
| Home / End in slider mode | Reach the minimum or maximum. |
| Enter / Space on Clear | Activate the available clear/reset button. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

All fields use the same inline convention: `:tp-numberfield:\`identifier\`{value="12" placeholder="…"}`. The inline content initializes `name` only; it never sets `id`, `label` or `value`. An explicit `name` takes precedence. Use `value` for initial content and `placeholder` for a hint; omitting `value` keeps the component's normal default. The HTML equivalent is `<tp-numberfield name="identifier" value="12" placeholder="…"></tp-numberfield>`.


Declare `<tp-numberfield>` in HTML or use the native component extension in `@tp/tp-markdown`, `@tp/tp-asciidoc` or `@tp/tp-restructuredtext`. See [Examples](#examples) for all four languages. Boolean attributes are true when present and false when absent.

The default editor is `<input type="number">`. Add `range` to use `<input type="range">` (there is no HTML `<range>` element). Use `min`, `max` and `step` for both representations; `step="any"` permits unrestricted fractional values. Supply numeric strings with a decimal point in attributes. Number inputs preserve out-of-bounds values for native form validation; sliders clamp their values to their limits.

The number field starts empty. Following the [native range rules](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/range), a slider always has a value: its default bounds are 0 and 100 and its initial value is 50. An empty value resets it to the midpoint of its current bounds. `placeholder` and `required` apply only to number mode. A readonly slider is disabled internally, with a hidden input preserving its value for form submission; `disabled` excludes it from submission entirely.

Set `label` or `aria-label` for an accessible name, and optionally `label-position` to `top`, `bottom`, `start` or `end`. Add `clearable` to show the clear/reset button. Use `name` for form submission. The native editor is retained when changing settings.

Edits update `value` and emit `input`; committing an edit emits `change`. Clearing/resetting emits `input`, `change` and `tp-clear`. Programmatic assignments update the display without emitting user-edit events. The public `focus()` and `clear()` methods are also available.

## Examples

Set `list` to the ID of an external `<datalist>` to provide numeric suggestions or native slider tick marks. In the Attributes example, enter `numberfield-ticks` in `list` and enable `range` to show marks at 0, 25, 50, 75 and 100. Tick appearance follows the browser. Range mode has no surrounding border; its keyboard focus outline remains visible.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter a quantity with the number field and adjust the level with the slider. Try the clear and reset controls.

Attributes
: Combine all attribute settings on one preview, initialized at the documented defaults, then use Reset defaults to restore them. Switch between number and range, test numeric bounds and increments, and observe native validation and the synchronized value.

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
<!-- tp-docgen:api TpNumberfield -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>aria-label</code> | <code>string</code> | <code>&quot;&quot;</code> | Accessible name when a visible label is not supplied. |
  | <code>clearable</code> | <code>boolean</code> | <code>false</code> | Shows a button that empties a number or resets a slider to its native midpoint. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables editing, clearing and form submission. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Visible label associated with the native input. |
  | <code>label-position</code> | <code>string</code> | <code>&quot;top&quot;</code> | Label position (`top`, `bottom`, `start`, or `end`). |
  | <code>list</code> | <code>string</code> | <code>&quot;&quot;</code> | ID of an external datalist supplying numeric suggestions or slider tick marks. |
  | <code>max</code> | <code>string</code> | <code>&quot;&quot;</code> | Upper bound; native range inputs default to 100. |
  | <code>min</code> | <code>string</code> | <code>&quot;&quot;</code> | Lower bound; native range inputs default to 0. |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Name submitted with the containing form; defaults to the initial inline content when omitted. |
  | <code>placeholder</code> | <code>string</code> | <code>&quot;&quot;</code> | Hint shown by the empty number input; ignored in range mode. |
  | <code>range</code> | <code>boolean</code> | <code>false</code> | Uses input type range instead of input type number. |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Prevents editing; a readonly slider is disabled with a hidden submission mirror. |
  | <code>required</code> | <code>boolean</code> | <code>false</code> | Requires a value in number mode; ignored by native range inputs. |
  | <code>step</code> | <code>string</code> | <code>&quot;1&quot;</code> | Positive numeric increment, or `any` for unrestricted fractional values. |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Numeric value; range mode normalizes it to a nonempty value within its limits. |
  [Attributes of `<tp-numberfield>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>clear</code> | <code>clear(): void</code> | Empty a number or reset a slider to its native midpoint and notify consumers. |
  | <code>focus</code> | <code>focus(options?: FocusOptions): void</code> | Focus the native number input or slider. |
  [Public methods of `TpNumberfield`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>change</code> | <code>void</code> | Emitted when the value is committed or cleared. |
  | <code>input</code> | <code>void</code> | Emitted when the value changes during editing or clearing. |
  | <code>tp-clear</code> | <code>void</code> | Emitted after clearing a number or resetting the slider. |
  [Events emitted by `<tp-numberfield>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-numberfield>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_numberfield.TpNumberfield.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-numberfield>` are loaded automatically by this component if they have not already been loaded by another component.

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
