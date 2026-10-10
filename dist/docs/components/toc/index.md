# <tp-icon name="toc" library="components" size="1.25em"></tp-icon> Table of contents

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-toc>` element implements the <tp-icon name="toc" library="components" size="1.25em"></tp-icon> Table of contents functionality: table of contents generated from page headings.

<tp-box data-tp-toc-scope>
  <tp-toc label="On this page" open expand-all></tp-toc>
  <h2>Getting started</h2>
  <p>Choose a heading in the table of contents to jump to its section.</p>
  <h3>Installation</h3><p>Install the library in your project.</p>
  <h3>First component</h3><p>Add your first interactive component.</p>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Select | Select a heading in the table of contents to navigate to that section. |
| Using the component | Expand or collapse branches to show or hide nested headings. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

The custom `<tp-toc>` element generates a table of contents from the headings in the current document and renders its hierarchy with `<tp-tree>`.

Place the component in a document containing headings. It assigns missing heading IDs and updates when the document structure changes.

Use `position` to place it at the start, at the end, or in the center. The `open` attribute opens the panel and `expand-all` expands every nested section.
Use `brand` to apply the soft brand background, contrasting brand text, and brand border colors.

```html
<tp-toc label="On this page" open position="start"></tp-toc>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select a heading in the table of contents to jump to its section.

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
<!-- tp-docgen:api TpToc -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>brand</code> | <code>boolean</code> | <code>false</code> | Uses the soft brand background and contrasting brand text colors. |
  | <code>expand-all</code> | <code>boolean</code> | <code>false</code> | Expands every table of contents subtree. |
  | <code>label</code> | <code>string</code> | <code>&quot;Contents&quot;</code> | Visible summary label. |
  | <code>open</code> | <code>boolean</code> | <code>false</code> | Opens the table of contents panel. |
  | <code>position</code> | <code>string</code> | <code>&quot;center&quot;</code> | Placement (`start`, `end`, `center`). |
  [Attributes of `<tp-toc>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpToc`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-toc>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-toc-background</code> | <code>var(&#45;&#45;tp-brand-fill-softer)</code> | Panel background color. |
  | <code>&#45;&#45;tp-toc-border-color</code> | <code>var(&#45;&#45;tp-brand-stroke-soft)</code> | Panel border color. |
  | <code>&#45;&#45;tp-toc-color</code> | <code>var(&#45;&#45;tp-brand-text-on-soft)</code> | Panel text color. |
  [CSS properties of `<tp-toc>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_toc.TpToc.html)
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
  <script type="module" src="/path/to/components/toc/toc.js"></script>
  ```

import
: ```js
  import "/path/to/components/toc/toc.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/toc/toc.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-toc>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-tree
@summary Generic tree component for interactive hierarchical editing.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-tree>`](../tree/index.md) : Generic tree component for interactive hierarchical editing.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
