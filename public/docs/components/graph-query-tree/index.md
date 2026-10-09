# <tp-icon name="graph-query-tree" library="components" size="1.25em"></tp-icon> Relational query trees

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-query-tree>` element implements the <tp-icon name="graph-query-tree" library="components" size="1.25em"></tp-icon> Relational query trees functionality: edits relational algebra trees and generates equivalent SQL.

<tp-graph-query-tree grid="" grid-size="20" message="Select an operator to edit its relational expression." src="/docs/components/graph-query-tree/examples/employees-departments.json"></tp-graph-query-tree>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Select | Select a node to edit its relevant properties in the lower toolbar. |
| Table | Relations expose **Table** and **Alias**. |
| Select | Selection, projection, aggregation, sort, and join nodes expose their expression. |
| Group by | Aggregation also exposes **Group by**, while joins offer inner, left, right, and full variants. |
| Using the component | The generated SQL uses nested derived tables so that every relational operator remains visible in the translation. |
| Using the component | For binary operators, the left and right operands are determined by their horizontal positions in the graph. |
| Using the component | An incomplete tree displays a precise message instead of SQL. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-graph-query-tree>` as shown below.

```html
<tp-graph-query-tree grid grid-size="20" message="Select an operator to edit its relational expression." src="/docs/components/graph-query-tree/examples/employees-departments.json"></tp-graph-query-tree>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied query tree and try the simulator’s available controls.
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
<!-- tp-docgen:api TpGraphQueryTree -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-graph-query-tree>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addEdge</code> | <code>addEdge(source: string, target: string, type = TP_QUERY_EDGE, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = &#39;forward&#39;): TpGraphEdge</code> | Adds edge. |
  | <code>addNode</code> | <code>addNode(type: string, point: TpGraphPoint, nodeLabel?: string): TpGraphNode</code> | Adds node. |
  | <code>setGraph</code> | <code>setGraph(graph: TpGraphDocument): void</code> | Sets graph. |
  | <code>toSql</code> | <code>toSql(): string</code> | To sql. |
  [Public methods of `TpGraphQueryTree`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-graph-query-tree>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-query-tree>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_graph-query-tree.TpGraphQueryTree.html)
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
  <script type="module" src="/path/to/components/graph-query-tree/graph-query-tree.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-query-tree/graph-query-tree.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-query-tree/graph-query-tree.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-graph-query-tree>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-graph-editor
@summary Extensible interactive graph editor.
-->

- [`<tp-graph-editor>`](../graph-editor/index.md) : Extensible interactive graph editor.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
