# <tp-icon name="graph-sequential-circuit" library="components" size="1.25em"></tp-icon> Sequential logical circuit

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-sequential-circuit>` element implements the <tp-icon name="graph-sequential-circuit" library="components" size="1.25em"></tp-icon> Sequential logical circuit functionality: edits and simulates synchronous sequential logic circuits.

<tp-graph-sequential-circuit id="sequential-counter" grid="" grid-size="20" message="Hubs distribute CLK, Q0, and Q1 along separate orthogonal lanes." src="/docs/components/graph-sequential-circuit/examples/two-bit-counter.json"></tp-graph-sequential-circuit>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reset sequential state | The lower toolbar provides **Reset sequential state**, **Stop clock**, **Run clock**, and **Clock step**. |
| Using the component | A clock step first evaluates the complete combinational network from the current state, samples every D input, applies all Q values simultaneously, and evaluates the combinational outputs again. |
| Using the component | This two-phase update makes the result independent of flip-flop ordering. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-graph-sequential-circuit>` as shown below.

```html
<tp-graph-sequential-circuit id="sequential-counter" grid grid-size="20" message="Hubs distribute CLK, Q0, and Q1 along separate orthogonal lanes." src="/docs/components/graph-sequential-circuit/examples/two-bit-counter.json"></tp-graph-sequential-circuit>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied sequential logic circuit and try the simulator’s available controls.
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
<!-- tp-docgen:api TpGraphSequentialCircuit -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-graph-sequential-circuit>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>clockStep</code> | <code>clockStep(): void</code> | Clock step. |
  | <code>evaluate</code> | <code>evaluate(): void</code> | Evaluate. |
  | <code>resetSequentialState</code> | <code>resetSequentialState(): void</code> | Resets sequential state. |
  | <code>run</code> | <code>run(period = 700): void</code> | Run. |
  | <code>stop</code> | <code>stop(): void</code> | Stop. |
  | <code>toggle</code> | <code>toggle(id: string, propagate = true): boolean</code> | Toggle. |
  [Public methods of `TpGraphSequentialCircuit`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-logic-evaluate</code> | <code>&#123; graph: unknown &#125;</code> | Emitted when logic evaluate occurs. |
  | <code>tp-logic-toggle</code> | <code>&#123; id: unknown; value: string; graph: unknown &#125;</code> | Emitted when logic toggle occurs. |
  | <code>tp-sequential-clock</code> | <code>&#123; values: unknown; graph: unknown &#125;</code> | Emitted when sequential clock occurs. |
  | <code>tp-sequential-reset</code> | <code>&#123; graph: unknown &#125;</code> | Emitted when sequential reset occurs. |
  [Events emitted by `<tp-graph-sequential-circuit>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-sequential-circuit>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_graph-sequential-circuit.TpGraphSequentialCircuit.html)
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
  <script type="module" src="/path/to/components/graph-sequential-circuit/graph-sequential-circuit.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-sequential-circuit/graph-sequential-circuit.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-sequential-circuit/graph-sequential-circuit.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-graph-sequential-circuit>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-graph-editor
@summary Extensible interactive graph editor.
-->
<!--
@tp-dependency tp-graph-logical-circuit
@summary Interactive combinational logic circuit editor and simulator.
-->

- [`<tp-graph-editor>`](../graph-editor/index.md) : Extensible interactive graph editor.
- [`<tp-graph-logical-circuit>`](../graph-logical-circuit/index.md) : Interactive combinational logic circuit editor and simulator.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
