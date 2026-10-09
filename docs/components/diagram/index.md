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
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

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

The same examples are provided in every markup language and cover every diagram syntax exposed by the installed Mermaid version.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the diagram rendered from the embedded Mermaid source.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Architecture diagram
: Inspect the architecture diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Block diagram
: Inspect the block diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

C4 diagram
: Inspect the c4 diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Class diagram
: Inspect the class diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Cynefin framework
: Inspect the cynefin framework rendered from its Mermaid source and compare the source with the resulting visual structure.

Entity relationship diagram
: Inspect the entity relationship diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Event modeling diagram
: Inspect the event modeling diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Flowchart
: Inspect the flowchart rendered from its Mermaid source and compare the source with the resulting visual structure.

Gantt diagram
: Inspect the gantt diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Git graph
: Inspect the git graph rendered from its Mermaid source and compare the source with the resulting visual structure.

Ishikawa diagram
: Inspect the ishikawa diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Kanban diagram
: Inspect the kanban diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Mind map
: Inspect the mind map rendered from its Mermaid source and compare the source with the resulting visual structure.

Packet diagram
: Inspect the packet diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Pie chart
: Inspect the pie chart rendered from its Mermaid source and compare the source with the resulting visual structure.

Quadrant chart
: Inspect the quadrant chart rendered from its Mermaid source and compare the source with the resulting visual structure.

Radar chart
: Inspect the radar chart rendered from its Mermaid source and compare the source with the resulting visual structure.

Requirement diagram
: Inspect the requirement diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Sankey diagram
: Inspect the sankey diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Sequence diagram
: Inspect the sequence diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

State diagram
: Inspect the state diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Swimlanes diagram
: Inspect the swimlanes diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Timeline
: Inspect the timeline rendered from its Mermaid source and compare the source with the resulting visual structure.

TreeView diagram
: Inspect the treeview diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Treemap
: Inspect the treemap rendered from its Mermaid source and compare the source with the resulting visual structure.

User journey
: Inspect the user journey rendered from its Mermaid source and compare the source with the resulting visual structure.

Venn diagram
: Inspect the venn diagram rendered from its Mermaid source and compare the source with the resulting visual structure.

Wardley map
: Inspect the wardley map rendered from its Mermaid source and compare the source with the resulting visual structure.

XY chart
: Inspect the xy chart rendered from its Mermaid source and compare the source with the resulting visual structure.

ZenUML diagram
: Inspect the zenuml diagram rendered from its Mermaid source and compare the source with the resulting visual structure.
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
  | <code>label</code> | <code>string</code> | <code>&quot;Diagram&quot;</code> | Accessible name applied to the rendered SVG. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Mermaid source file loaded relative to the containing document. |
  [Attributes of `<tp-diagram>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpDiagram`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-diagram-rendered</code> | <code>&#123; src: string &#125;</code> | Emitted after Mermaid has rendered the diagram. |
  [Events emitted by `<tp-diagram>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-diagram>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_diagram.TpDiagram.html)
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
