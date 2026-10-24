# <tp-icon name="diagram" library="components" size="1.25em"></tp-icon> Diagram

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-diagram>` element renders flowcharts, sequence diagrams, class diagrams and the other diagram types supported by [Mermaid](https://mermaid.js.org/).

<tp-diagram label="Request flow">
  <script type="tp/diagram">
    flowchart LR
      Browser --> Server
      Server --> Database
  </script>
</tp-diagram>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | Read the rendered diagram. |
| Using the component | Any links in the diagram behave according to the page's security and interaction settings; the component does not provide a source editor. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Rendering engine

Pele is the default renderer. Use `engine="mermaid"` to load Mermaid on demand, or `engine="pele"` to select Pele explicitly. Changing the attribute redraws the same source. Missing, empty or unsupported values use Pele and do not load Mermaid.

Pele keeps Mermaid syntax but uses its own layout and CSS theme variables. Pele does not render arbitrary HTML labels or JavaScript callbacks; this component disables Pele links and images. Math labels require a typesetter and currently remain TeX source with Pele.

### Author directives

::: tp-tabs
internal script
: ```html
  <tp-diagram label="Request flow">
    <script type="tp/diagram">
      flowchart LR
        Browser --> Server
        Server --> Database
    </script>
  </tp-diagram>
  ```
  As for every declarative component source, the script type follows the library’s `tp/` namespace convention.

external file
: ```html
  <tp-diagram
    src="architecture.mmd"
    label="Application architecture">
  </tp-diagram>
  ```
  Mermaid source files conventionally use the `.mmd` extension.
:::

Relative URLs are resolved from the containing documentation source, including documents loaded through `tp-include`, `tp-markup-single-page`, or `tp-markup-multi-pages`.

## Examples

The same examples are provided in every markup language and cover every diagram syntax exposed by the installed Mermaid version. Each specific diagram example displays the same source twice: Mermaid first with `engine="mermaid"`, then Pele with `engine="pele"`.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the diagram rendered from the embedded Mermaid source.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Architecture diagram
: Compare the architecture diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Block diagram
: Compare the block diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

C4 diagram
: Compare the c4 diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Class diagram
: Compare the class diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Cynefin framework
: Compare the cynefin framework rendered from the same source: Mermaid first, then Pele (engine="pele").

Entity relationship diagram
: Compare the entity relationship diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Event modeling diagram
: Compare the event modeling diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Flowchart
: Compare the flowchart rendered from the same source: Mermaid first, then Pele (engine="pele").

Gantt diagram
: Compare the gantt diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Git graph
: Compare the git graph rendered from the same source: Mermaid first, then Pele (engine="pele").

Ishikawa diagram
: Compare the ishikawa diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Kanban diagram
: Compare the kanban diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Mind map
: Compare the mind map rendered from the same source: Mermaid first, then Pele (engine="pele").

Packet diagram
: Compare the packet diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Pie chart
: Compare the pie chart rendered from the same source: Mermaid first, then Pele (engine="pele").

Quadrant chart
: Compare the quadrant chart rendered from the same source: Mermaid first, then Pele (engine="pele").

Radar chart
: Compare the radar chart rendered from the same source: Mermaid first, then Pele (engine="pele").

Requirement diagram
: Compare the requirement diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Sankey diagram
: Compare the sankey diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Sequence diagram
: Compare the sequence diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

State diagram
: Compare the state diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Swimlanes diagram
: Compare the swimlanes diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Timeline
: Compare the timeline rendered from the same source: Mermaid first, then Pele (engine="pele").

TreeView diagram
: Compare the treeview diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Treemap
: Compare the treemap rendered from the same source: Mermaid first, then Pele (engine="pele").

User journey
: Compare the user journey rendered from the same source: Mermaid first, then Pele (engine="pele").

Venn diagram
: Compare the venn diagram rendered from the same source: Mermaid first, then Pele (engine="pele").

Wardley map
: Compare the wardley map rendered from the same source: Mermaid first, then Pele (engine="pele").

XY chart
: Compare the xy chart rendered from the same source: Mermaid first, then Pele (engine="pele").
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
<!-- tp-docgen:api TpDiagram -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>engine</code> | <code>&quot;mermaid&quot; \| &quot;pele&quot;</code> | <code>&quot;pele&quot;</code> | Rendering engine; only the explicit mermaid value loads Mermaid. |
  | <code>label</code> | <code>string</code> | <code>&quot;Diagram&quot;</code> | Accessible name applied to the rendered SVG. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Mermaid source file loaded relative to the containing document. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-diagram>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpDiagram`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-diagram-rendered</code> | <code>&#123; src: string &#125;</code> | Emitted after the selected engine has rendered the diagram. |
  [Events emitted by `<tp-diagram>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-diagram>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_diagram.TpDiagram.html)
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
  <script type="module" src="/path/to/components/diagram/diagram.js"></script>
  ```

import
: ```js
  import "/path/to/components/diagram/diagram.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/diagram/diagram.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-diagram>` are loaded automatically by this component if they have not already been loaded by another component.

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
