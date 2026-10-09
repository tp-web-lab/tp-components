# <tp-icon name="splitter" library="components" size="1.25em"></tp-icon> Splitter

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-splitter>` element implements the <tp-icon name="splitter" library="components" size="1.25em"></tp-icon> Splitter functionality: splitter layout with two resizable panels.

<tp-splitter position="40%">
  <dl>
    <dt>start</dt><dd><tp-box>Drag the divider to resize this panel.</tp-box></dd>
    <dt>end</dt><dd><tp-box>This panel uses the remaining space.</tp-box></dd>
  </dl>
</tp-splitter>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Drag | Drag the separator to resize the two panels. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Focus the separator. |
| Arrow keys | Moves the divider by 1%, or by 10% while Shift is held. |
| Home / End | Moves the divider to its minimum or maximum position. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Declare two panels in a definition list, labelled `start` and `end`. Use `axis="horizontal"` for side-by-side panels (the default), or `axis="vertical"` for stacked panels. Give vertical splitters a height so the divider has room to move. A panel can contain another splitter with its own axis and position.

`storage-key` is the name of an entry in the browser's `localStorage`, not a file path. When set, it saves the position after resizing and restores it when the component is loaded again, including after a page reload. Its default is the empty string (`""`): nothing is saved or restored, so the empty field in Attributes is intentional. Use a distinct key for each independent splitter, such as `workspace-main-split`; reusing a key makes splitters read the same saved position. A saved position takes precedence over the declared `position`. If browser storage is unavailable, resizing still works without persistence.

```html
<tp-splitter position="40%" storage-key="workspace-main-split">
  <dl>
    <dt>start</dt><dd><tp-box>Navigation</tp-box></dd>
    <dt>end</dt><dd><tp-box>Content</tp-box></dd>
  </dl>
</tp-splitter>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Drag the divider to resize the two adjacent panels.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Nested splitters
: Resize the side-by-side panels, then resize the vertically stacked panels inside the right-hand panel. Each divider works independently, with both pointer and keyboard controls.
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
<!-- tp-docgen:api TpSplitter -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>axis</code> | <code>TpSplitterAxis</code> | <code>horizontal</code> | Split direction (`horizontal` or `vertical`). |
  | <code>position</code> | <code>string</code> | <code>50%</code> | Divider position as a percentage. |
  | <code>storage-key</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional localStorage key used to save and restore the divider position. Empty by default: persistence is disabled. Use a distinct key for each independent splitter. |
  [Attributes of `<tp-splitter>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>reset</code> | <code>reset(): void</code> | Restores the divider to its initial position. |
  [Public methods of `TpSplitter`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-splitter-change</code> | <code>&#123; axis: &quot;horizontal&quot; \| &quot;vertical&quot;; position: string; storageKey: string &#125;</code> | Emitted when the divider position changes. |
  [Events emitted by `<tp-splitter>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-splitter-divider-color</code> | <code>var(&#45;&#45;tp-brand-fill-mid, #2563eb)</code> | Controls the divider color. |
  | <code>&#45;&#45;tp-splitter-divider-size</code> | <code>0.75rem</code> | Controls the divider size. |
  | <code>&#45;&#45;tp-splitter-position</code> | <code>50%</code> | Controls the position. |
  [CSS properties of `<tp-splitter>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_splitter.TpSplitter.html)
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
  <script type="module" src="/path/to/components/splitter/splitter.js"></script>
  ```

import
: ```js
  import "/path/to/components/splitter/splitter.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/splitter/splitter.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-splitter>` are loaded automatically by this component if they have not already been loaded by another component.

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
