# <tp-icon name="graph-logical-circuit" library="components" size="1.25em"></tp-icon> Logical circuit

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-logical-circuit>` element implements the <tp-icon name="graph-logical-circuit" library="components" size="1.25em"></tp-icon> Logical circuit functionality: edits and simulates combinational logic circuits.

<tp-graph-logical-circuit id="logic-example" grid="" grid-size="20" src="/docs/components/graph-logical-circuit/examples/xor.json"></tp-graph-logical-circuit>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Click | Click an input to toggle it and immediately propagate the new signal through the circuit. |
| Using the component | Inputs, outputs, and gates use `success` when their value is `true` and `danger` when it is `false`. |
| Using the component | Outputs can also be clicked to inspect or override their displayed state; the next evaluation restores the value computed from their incoming wire. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Enter / Space | Toggles the focused input or output terminal. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-graph-logical-circuit>` as shown below.

```html
<tp-graph-logical-circuit id="logic-example" grid grid-size="20" src="/docs/components/graph-logical-circuit/examples/xor.json"></tp-graph-logical-circuit>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied logic circuit and try the simulator’s available controls.
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
<!-- tp-docgen:api TpGraphLogicalCircuit -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-graph-logical-circuit>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addEdge</code> | <code>addEdge(source: string, target: string, type = TP_LOGIC_WIRE, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = &#39;forward&#39;): TpGraphEdge</code> | Adds edge. |
  | <code>addNode</code> | <code>addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode</code> | Adds node. |
  | <code>evaluate</code> | <code>evaluate(): void</code> | Evaluate. |
  | <code>reconnectEdge</code> | <code>reconnectEdge(edgeId: string, endpoint: &#39;source&#39; \| &#39;target&#39;, nodeId: string, port: TpGraphPort): TpGraphEdge</code> | Reconnect edge. |
  | <code>setGraph</code> | <code>setGraph(graph: TpGraphDocument): void</code> | Sets graph. |
  | <code>toggle</code> | <code>toggle(id: string, propagate = true): boolean</code> | Toggle. |
  | <code>toggleEquationNotation</code> | <code>toggleEquationNotation(): TpLogicalEquationNotation</code> | Toggles equation notation. |
  | <code>toggleRepresentation</code> | <code>toggleRepresentation(): TpLogicGateRepresentation</code> | Toggles representation. |
  [Public methods of `TpGraphLogicalCircuit`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-logic-evaluate</code> | <code>&#123; graph: unknown &#125;</code> | Emitted when logic evaluate occurs. |
  | <code>tp-logic-toggle</code> | <code>&#123; id: unknown; value: string; graph: unknown &#125;</code> | Emitted when logic toggle occurs. |
  [Events emitted by `<tp-graph-logical-circuit>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-logical-circuit>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_graph-logical-circuit.TpGraphLogicalCircuit.html)
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
  <script type="module" src="/path/to/components/graph-logical-circuit/graph-logical-circuit.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-logical-circuit/graph-logical-circuit.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-logical-circuit/graph-logical-circuit.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-graph-logical-circuit>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-graph-editor
@summary Extensible interactive graph editor.
-->
<!--
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->

- [`<tp-graph-editor>`](../graph-editor/index.md) : Extensible interactive graph editor.
- [`<tp-markdown>`](../markdown/index.md) : Markdown rendering component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
