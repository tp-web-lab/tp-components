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
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

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
  | <code>grid</code> | <code>boolean</code> | <code>false</code> | Displays and uses the snapping grid. *(inherited from <code>tp-graph-editor</code>)* |
  | <code>grid-size</code> | <code>number</code> | <code>20</code> | Grid spacing in graph units. *(inherited from <code>tp-graph-editor</code>)* |
  | <code>message</code> | <code>string</code> | <code>&quot;&quot;</code> | Status message displayed by the graph editor. *(inherited from <code>tp-graph-editor</code>)* |
  | <code>ports-visible</code> | <code>boolean</code> | <code>false</code> | Keeps attachment plots visible instead of showing them only on hover. *(inherited from <code>tp-graph-editor</code>)* |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Prevents graph editing while keeping navigation available. *(inherited from <code>tp-graph-editor</code>)* |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of a tp/graph JSON document loaded at initialization. *(inherited from <code>tp-graph-editor</code>)* |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-graph-sequential-circuit>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>clockStep</code> | <code>clockStep(): void</code> | Advances a clock cycle, updates memory elements and combinational outputs, and records the resulting timeline samples. |
  | <code>evaluate</code> | <code>evaluate(): void</code> | Recomputes combinational outputs without advancing the clock, records a timeline sample and emits tp-logic-evaluate. |
  | <code>resetSequentialState</code> | <code>resetSequentialState(): void</code> | Restores memory elements to their initial Boolean states, clears the timeline, recomputes outputs and emits tp-sequential-reset. |
  | <code>run</code> | <code>run(period = 700): void</code> | Starts repeated clock steps every period milliseconds, clamped to at least 100. Does nothing if already running; nonfinite periods use 700. |
  | <code>stop</code> | <code>stop(): void</code> | Stops automatic clock stepping while preserving the current circuit state and timeline. |
  | <code>toggle</code> | <code>toggle(id: string, propagate = true): boolean</code> | Inverts input or output id and returns its new Boolean value. Optionally propagates input changes through combinational logic and records a timeline sample; unsupported nodes throw. |
  [Public methods of `TpGraphSequentialCircuit`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-logic-evaluate</code> | <code>&#123; graph: TpGraphDocument &#125;</code> | Emitted after combinational outputs are recomputed without advancing the clock; graph contains the resulting snapshot. |
  | <code>tp-logic-toggle</code> | <code>&#123; id: string; value: boolean; graph: TpGraphDocument &#125;</code> | Emitted after an input node is toggled; id identifies the input, value is its new Boolean level, and graph contains the resulting snapshot. |
  | <code>tp-sequential-clock</code> | <code>&#123; values: Record&lt;string, boolean&gt;; graph: TpGraphDocument &#125;</code> | Emitted after a clock cycle has updated memory and settled combinational outputs. values maps memory-element IDs to their new Boolean states. |
  | <code>tp-sequential-reset</code> | <code>&#123; graph: TpGraphDocument &#125;</code> | Emitted after memory elements return to their initial states and the timeline is cleared; graph contains the reset snapshot. |
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
@tp-dependency tp-graph-logical-circuit
@summary Interactive combinational logic circuit editor and simulator.
-->

- [`<tp-graph-logical-circuit>`](../graph-logical-circuit/index.md) : Interactive combinational logic circuit editor and simulator.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
