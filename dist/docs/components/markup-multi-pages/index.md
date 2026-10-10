# <tp-icon name="markup-multi-pages" library="components" size="1.25em"></tp-icon> Markup multi-pages

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-markup-multi-pages>` element implements the <tp-icon name="markup-multi-pages" library="components" size="1.25em"></tp-icon> Markup multi-pages functionality: renders navigable Markdown, AsciiDoc, reStructuredText and HTML pages. *

<tp-iframe src="/docs/components/markup-multi-pages/examples/introduction-frame.html" title="tp-markup-multi-pages — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>

## Usage

### User interactions

Personal annotations are saved per document in this browser's localStorage, without account synchronization. Clearing site data removes them. The [Post-it editor](../post-it-editor/index.md) offers an Annotation language dropdown: adoc, html, md, rst or txt (default). Source and language are saved together; rendered markup is sanitized and scripts are not executed. If a target changes or disappears, use Reattach from the annotations list; no guessed replacement is silently selected. Storage errors are displayed in the editor. Elements inside embedded iframes are outside this page's annotation scope.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Calculator (between Code and Personal annotations) | Open or close the scientific calculator. Calculations are retained when closing the panel or navigating between pages. |
| Personal annotations (comment with pencil in the toolbar) | Open the annotation list. The button is immediately after Calculator. Use the large + button to add an annotation, select a document element, enter text and Save. The close icon is at the right of the panel title. |
| Annotation pin | Click to open the note, or drag it to another document element. Its attachment is saved. |
| Edit / Reattach / Delete | Update the selected annotation, choose a new target, or remove it from this browser. Each note has pencil (Edit) and delete-outline (Delete) icon buttons in its bottom-right footer. |
| Annotation appearance | Choose color, heading, opacity (0–1) and rotation (−12–12°). Save stores these settings with the text; Cancel discards edits. Reset appearance defaults restores yellow, an empty heading, opacity 1 and rotation 0 without changing the text. |
| Using the component | Choose a page in the navigation menu or follow a document link. |
| Using the component | The selected page replaces the current content. |
| Using the component | Use the available table of contents and document controls to navigate within it. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Selecting an annotation target | Tab to a paragraph, heading or other available target, then Enter to select it. Escape cancels. |
| Annotation pin arrows | Move the folded annotation; Shift uses smaller steps. Enter or Space opens it. |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-markup-multi-pages>` as shown below.

```html
<tp-markup-multi-pages repository="/docs/components/markup-multi-pages/docs"></tp-markup-multi-pages>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Navigate between the markup documentation pages and observe dynamic page loading inside the isolated example.

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
<!-- tp-docgen:api TpMarkupMultiPages -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>brand</code> | <code>string</code> | <code>&quot;tp-default&quot;</code> | Controls the brand. |
  | <code>git</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the git. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the label. |
  | <code>langs</code> | <code>string</code> | <code>&quot;en,fr&quot;</code> | Controls the langs. |
  | <code>menu</code> | <code>boolean</code> | <code>false</code> | Controls the menu. |
  | <code>repository</code> | <code>string</code> | <code>&quot;/docs&quot;</code> | Controls the repository. |
  | <code>theme</code> | <code>TpMarkupMultiPagesTheme</code> | <code>&quot;&quot;</code> | Controls the theme. |
  [Attributes of `<tp-markup-multi-pages>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpMarkupMultiPages`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-markup-multi-pages>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-markup-multi-pages-sidebar-width</code> | <code>var(&#45;&#45;tp-markup-multi-pages-sidebar-width, 12rem)</code> | Controls the sidebar width. |
  [CSS properties of `<tp-markup-multi-pages>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_markup-multi-pages.TpMarkupMultiPages.html)
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
  <script type="module" src="/path/to/components/markup-multi-pages/markup-multi-pages.js"></script>
  ```

import
: ```js
  import "/path/to/components/markup-multi-pages/markup-multi-pages.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markup-multi-pages/markup-multi-pages.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-markup-multi-pages>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-calculator
@summary Scientific calculator with an editable expression and degree/radian modes.
-->
<!--
@tp-dependency tp-clock
@summary Live clock component with digital or analogic display and date tooltip.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-drawer
@summary Drawer overlay component.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-lang
@summary Documentation language selector.
-->
<!--
@tp-dependency tp-post-it-editor
@summary creates and edits persistent personal annotations attached to document elements.
-->
<!--
@tp-dependency tp-source
@summary Source repository link button.
-->
<!--
@tp-dependency tp-splitter
@summary Splitter component with two resizable panels.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->
<!--
@tp-dependency tp-tree
@summary Generic tree component for interactive hierarchical editing.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-calculator>`](../calculator/index.md) : Scientific calculator with an editable expression and degree/radian modes.
- [`<tp-clock>`](../clock/index.md) : Live clock component with digital or analogic display and date tooltip.
- [`<tp-color>`](../color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-drawer>`](../drawer/index.md) : Drawer overlay component.
- [`<tp-fullscreen>`](../fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-lang>`](../lang/index.md) : Documentation language selector.
- [`<tp-post-it-editor>`](../post-it-editor/index.md) : creates and edits persistent personal annotations attached to document elements.
- [`<tp-source>`](../source/index.md) : Source repository link button.
- [`<tp-splitter>`](../splitter/index.md) : Splitter component with two resizable panels.
- [`<tp-theme>`](../theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](../toolbar/index.md) : Sticky toolbar with start / center / end sections,
- [`<tp-tree>`](../tree/index.md) : Generic tree component for interactive hierarchical editing.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
