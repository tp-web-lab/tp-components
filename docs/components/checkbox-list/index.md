# <tp-icon name="checkbox-list" library="components" size="1.25em"></tp-icon> Checkbox list

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-checkbox-list>` element implements the <tp-icon name="checkbox-list" library="components" size="1.25em"></tp-icon> Checkbox list functionality: transforms list items into checkbox options.

<tp-checkbox-list name="topics" value="1,3">
    <ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul>
  </tp-checkbox-list>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Option | Click to select or clear it; several options can be selected. |
| Hover | Highlights an enabled option without changing its selection. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Focus a checkbox. |
| Space | Select or clear the focused checkbox. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Set `label` to display a name for the whole group. `label-position` accepts `top` (default), `bottom`, `start`, or `end`; use `label-position="start"` to place it beside the choices. Start and end follow the writing direction. The label names the group through `aria-labelledby`, and clicking it focuses the selected option or the first available option. No `fieldset` is created; keep the choices in the component's direct `ul`. Removing `label` restores the unlabeled layout without changing the selection.

The `value` attribute contains comma-separated, one-based item indexes. Listen for `tp-checkbox-list-change` to receive the current value and label.

```html
<tp-checkbox-list name="topics" value="1,3">
  <ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul>
</tp-checkbox-list>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select and clear several web-language choices independently.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
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
<!-- tp-docgen:api TpCheckboxList -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Visible accessible group label; no fieldset is created. |
  | <code>label-position</code> | <code>string</code> | <code>&quot;top&quot;</code> | Group label position (`top`, `bottom`, `start`, or `end`). |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Checkbox group name used on generated inputs. |
  | <code>orientation</code> | <code>string</code> | <code>&quot;vertical&quot;</code> | Item layout direction (`vertical` or `horizontal`). |
  | <code>value</code> | <code>string</code> | <code>&quot;&quot;</code> | Comma-separated 1-based indexes of checked items (e.g. `"2,4"`). |
  [Attributes of `<tp-checkbox-list>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>reset</code> | <code>reset(): void</code> | Resets checked items to the initial value. |
  [Public methods of `TpCheckboxList`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-checkbox-list-change</code> | <code>&#123; value: string; label: unknown &#125;</code> | Emitted when selection changes (`detail: { value, label }`). |
  [Events emitted by `<tp-checkbox-list>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-checkbox-list-marker-gap</code> | <code>0.5em</code> | Controls the marker gap. |
  | <code>&#45;&#45;tp-checkbox-list-marker-width</code> | <code>2ch</code> | Controls the marker width. |
  [CSS properties of `<tp-checkbox-list>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_checkbox-list.TpCheckboxList.html)
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
  <script type="module" src="/path/to/components/checkbox-list/checkbox-list.js"></script>
  ```

import
: ```js
  import "/path/to/components/checkbox-list/checkbox-list.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/checkbox-list/checkbox-list.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-checkbox-list>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
