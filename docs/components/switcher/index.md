# <tp-icon name="switcher" library="components" size="1.25em"></tp-icon> Switcher

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-switcher>` element implements the <tp-icon name="switcher" library="components" size="1.25em"></tp-icon> Switcher functionality: switches between horizontal and vertical layouts based on available space.

<tp-switcher threshold="35rem" gap="1rem">
  <tp-box>1. Plan the content.</tp-box>
  <tp-box>2. Write a draft.</tp-box>
  <tp-box>3. Review the text.</tp-box>
  <tp-box>4. Add illustrations.</tp-box>
  <tp-box>5. Publish the result.</tp-box>
</tp-switcher>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | This component organizes or presents content. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Embedded controls, when present | Use their normal keyboard interactions. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

The default gap is `1rem`, and the default width threshold is `30rem`. Below this available width, the items stack vertically. CSS properties can override these defaults.

`max-horizontal` is absent by default (`""` in the attribute table): there is no per-row limit, and the JavaScript property `maxHorizontal` returns `null`. A positive integer limits the number of items on each row; additional items wrap onto subsequent rows. With five panels, `3` gives a row of three followed by a row of two, and `2` gives rows of two, two and one, provided enough width is available. Items on the last row expand to share its available width. Below `threshold`, the layout still becomes a single column. In Attributes, try `3`, then `2`, and clear the field to remove the per-row limit.

```html
<tp-switcher></tp-switcher>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the example to switch the panels between a shared row and a vertical stack.

Attributes
: Drag the splitter divider to narrow or widen the switcher in the left panel, without resizing the browser window. Change the gap and threshold, then try max-horizontal at 3 or 2: it limits items per row above the threshold, while narrower panels use one column.
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
<!-- tp-docgen:api TpSwitcher -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>gap</code> | <code>string</code> | <code>&quot;1rem&quot;</code> | Gap between switcher items, using --tp-switcher-gap when absent. |
  | <code>max-horizontal</code> | <code>number</code> | <code>&quot;&quot;</code> | Maximum number of items per row; additional items wrap onto following rows. Below threshold, items still stack vertically. Absent by default: no per-row limit (the maxHorizontal property returns null). |
  | <code>threshold</code> | <code>string</code> | <code>&quot;30rem&quot;</code> | Available-width threshold below which the items stack vertically, using --tp-switcher-threshold when absent. |
  [Attributes of `<tp-switcher>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpSwitcher`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-switcher>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-switcher-gap</code> | <code>1rem</code> | Default gap between switcher items. |
  | <code>&#45;&#45;tp-switcher-threshold</code> | <code>30rem</code> | Default switch threshold. |
  [CSS properties of `<tp-switcher>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_switcher_switcher.TpSwitcher.html)
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
  <script type="module" src="/path/to/components/switcher/switcher.js"></script>
  ```

import
: ```js
  import "/path/to/components/switcher/switcher.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/switcher/switcher.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-switcher>` are loaded automatically by this component if they have not already been loaded by another component.

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
