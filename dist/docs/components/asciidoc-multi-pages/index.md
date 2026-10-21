# <tp-icon name="asciidoc-multi-pages" library="components" size="1.25em"></tp-icon> AsciiDoc multi-pages

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-asciidoc-multi-pages>` element implements the <tp-icon name="asciidoc-multi-pages" library="components" size="1.25em"></tp-icon> AsciiDoc multi-pages functionality: renders a navigable repository with tp-asciidoc. *

<tp-iframe src="/docs/components/asciidoc-multi-pages/examples/introduction-frame.html" title="tp-asciidoc-multi-pages — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>

The language selector appears only when `langs` declares at least two distinct comma-separated language codes (for example, `langs="fr,en"`). Without `langs`, or with a single language, it stays hidden. Changes to `langs` update the selector immediately; translation-file availability does not control its visibility.

## Usage

### User interactions

Personal annotations are saved per document in this browser's localStorage, without account synchronization. Clearing site data removes them. The [Post-it editor](../post-it-editor/index.md) offers an Annotation language dropdown: adoc, html, md, rst or txt (default). Source and language are saved together; rendered markup is sanitized and scripts are not executed. If a target changes or disappears, use Reattach from the annotations list; no guessed replacement is silently selected. Storage errors are displayed in the editor. Elements inside embedded iframes are outside this page's annotation scope.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Expand all / Collapse all (sidebar) | Open or close every branch of the global table of contents. Page order stays unchanged. |
| Widen table of contents / Restore width | Fit the sidebar to the longest title, including nested titles, on one line. Click again to restore the previous divider position. On small screens, width is limited to the viewport and long titles can scroll horizontally. |
| Search (left of the sidebar controls) | Show or hide a clearable search field. Matching titles are highlighted, their ancestor branches open automatically, and the sidebar scrolls to the first result below the search controls; the displayed page does not change. Search ignores case and accents. A search with no matches displays “0 results” in the danger color. |
| Clear search | Remove highlights and the result count; branches opened by the search remain open. |
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
| Enter / Space on a sidebar button | Expand/collapse branches, toggle the sidebar width, or open/close search. |
| Typing in sidebar search | Update matching titles and open their ancestors. |
| Enter in sidebar search | Scroll to the next result, wrapping to the first. |
| Escape in sidebar search | Close and clear search, then return focus to its button. |
| Selecting an annotation target | Tab to a paragraph, heading or other available target, then Enter to select it. Escape cancels. |
| Annotation pin arrows | Move the folded annotation; Shift uses smaller steps. Enter or Space opens it. |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-asciidoc-multi-pages>` as shown below.

```html
<tp-asciidoc-multi-pages></tp-asciidoc-multi-pages>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Navigate between the asciidoc documentation pages and observe dynamic page loading inside the isolated example.
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
<!-- tp-docgen:api TpAsciidocMultiPages -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>brand</code> | <code>string</code> | <code>&quot;tp-default&quot;</code> | Controls the brand. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>git</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the git. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the label. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>langs</code> | <code>string</code> | <code>&quot;&quot;</code> | Comma-separated language codes. The selector is hidden when absent, empty or limited to one distinct language; otherwise it displays the declared languages. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>menu</code> | <code>boolean</code> | <code>false</code> | Controls the menu. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>repository</code> | <code>string</code> | <code>&quot;/docs&quot;</code> | Controls the repository. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>theme</code> | <code>TpMarkupMultiPagesTheme</code> | <code>&quot;&quot;</code> | Controls the theme. *(inherited from <code>tp-markup-multi-pages</code>)* |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-asciidoc-multi-pages>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpAsciidocMultiPages`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-asciidoc-multi-pages>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-asciidoc-multi-pages>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_asciidoc-multi-pages.TpAsciidocMultiPages.html)
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
  <script type="module" src="/path/to/components/asciidoc-multi-pages/asciidoc-multi-pages.js"></script>
  ```

import
: ```js
  import "/path/to/components/asciidoc-multi-pages/asciidoc-multi-pages.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/asciidoc-multi-pages/asciidoc-multi-pages.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-asciidoc-multi-pages>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-markup-multi-pages
@summary Multi-page documentation with support for multiple markup languages.
-->

- [`<tp-markup-multi-pages>`](../markup-multi-pages/index.md) : Multi-page documentation with support for multiple markup languages.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
