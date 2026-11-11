<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="diagram" library="components" size="1.25em"></tp-icon> Diagram

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-diagram>` element renders flowcharts, sequence diagrams, class diagrams and the other diagram types supported by [Mermaid](https://mermaid.js.org/).

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-diagram label="Request flow">
  <script type="tp/diagram">
    flowchart LR
      Browser --> Server
      Server --> Database
  </script>
</tp-diagram>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-diagram" src="/docs/components/diagram/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-diagram></tp-diagram>
  ```

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

external file
: ```html
  <tp-diagram src="/docs/components/diagram/examples/initial-content.txt"></tp-diagram>
  ```
:::

### Rendering engine

Pele is the default renderer. Use `engine="mermaid"` to load Mermaid on demand, or `engine="pele"` to select Pele explicitly. Changing the attribute redraws the same source. Missing, empty or unsupported values use Pele and do not load Mermaid.

Pele keeps Mermaid syntax but uses its own layout and CSS theme variables. Pele does not render arbitrary HTML labels or JavaScript callbacks; this component disables Pele links and images. Math labels require a typesetter and currently remain TeX source with Pele.

### Authoring

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

### Importing

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

<!-- -->
## Examples

The same examples are provided in every markup language and cover every diagram syntax exposed by the installed Mermaid version. Each specific diagram example displays the same source twice: Mermaid first with `engine="mermaid"`, then Pele with `engine="pele"`.

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the diagram rendered from the embedded Mermaid source.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

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
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
