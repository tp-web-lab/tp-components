# <tp-icon name="graph-analog-circuit" library="components" size="1.25em"></tp-icon> Analog circuits

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-analog-circuit>` element implements the <tp-icon name="graph-analog-circuit" library="components" size="1.25em"></tp-icon> Analog circuits functionality: interactive analog-circuit editor and transient simulator.

<tp-graph-analog-circuit grid="" grid-size="20" message="Run the transient analysis and inspect Vin and Vout." src="/tp-components/docs/components/graph-analog-circuit/examples/rc-filter.json"></tp-graph-analog-circuit>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | The introductory circuit is an RC low-pass filter driven by a square-wave voltage source. |
| Using the component | Its named `Vin` and `Vout` measurement points are the oscilloscope channels. |
| Measurement | Drag **Measurement** from the **Annotations** palette onto any wire, then give it a label to add another channel. |
| Run transient analysis | Press **Run transient analysis** to refresh the oscilloscope. |
| Using the component | Wires merge connected terminals into electrical nodes, and every simulatable circuit needs a ground reference. |
| Hub | A four-port **Hub** creates an electrical junction for clean branch layouts; all four ports share exactly the same potential. |
| Using the component | The oscilloscope header provides independent time and voltage calibration controls. |
| Using the component | The displayed values use `ms/div` and `V/div`; the center button restores both automatic scales. |
| Using the component | Use the `V / A` selector in the oscilloscope header to display either node voltage or signed branch current at every named measurement point. |
| Using the component | Current mode changes the legend and vertical scale to amperes. |
| Using the component | A current point placed on a direct component wire uses the component terminal as its sign reference; a point on an electrically ambiguous junction branch reports zero until it is moved to a wire adjoining a component. |
| Links | The **Links** palette provides straight and orthogonal wires without arrowheads. |
| Using the component | Analog self-links are rejected because a component terminal cannot be wired back to the same component through a single editor link. |
| Hub | The **Hub** is the single four-way equipotential junction used to lay out branches. |
| Open or close selected switch | A switch can be open or closed; select it and use **Open or close selected switch** in the lower toolbar. |
| Using the component | An open switch has a very high resistance, while a closed switch behaves as an ideal conductor. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-graph-analog-circuit>` as shown below.

```html
<tp-graph-analog-circuit grid grid-size="20" message="Run the transient analysis and inspect Vin and Vout." src="/tp-components/docs/components/graph-analog-circuit/examples/rc-filter.json"></tp-graph-analog-circuit>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied analog circuit and try the simulator’s available controls.
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
<!-- tp-docgen:api TpGraphAnalogCircuit -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-graph-analog-circuit>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addEdge</code> | <code>addEdge(source: string, target: string, type = TP_ANALOG_WIRE, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = &#39;none&#39;, routing: TpGraphEdgeRouting = &#39;straight&#39;): TpGraphEdge</code> | Adds edge. |
  | <code>addNode</code> | <code>addNode(type: string, point: TpGraphPoint, nodeLabel?: string): TpGraphNode</code> | Adds node. |
  | <code>rotateSelected</code> | <code>rotateSelected(): void</code> | Rotate selected. |
  | <code>setGraph</code> | <code>setGraph(graph: TpGraphDocument): void</code> | Sets graph. |
  | <code>simulate</code> | <code>simulate(duration?: number, step?: number): TpAnalogSimulation</code> | Simulate. |
  | <code>toggleSwitch</code> | <code>toggleSwitch(): void</code> | Toggles switch. |
  [Public methods of `TpGraphAnalogCircuit`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-analog-simulate</code> | <code>unknown</code> | Emitted when analog simulate occurs. |
  [Events emitted by `<tp-graph-analog-circuit>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-analog-circuit>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_graph-analog-circuit.TpGraphAnalogCircuit.html)
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
  <script type="module" src="/path/to/components/graph-analog-circuit/graph-analog-circuit.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-analog-circuit/graph-analog-circuit.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-analog-circuit/graph-analog-circuit.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-graph-analog-circuit>` are loaded automatically by this component if they have not already been loaded by another component.

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
