# <tp-icon name="graph-dfa" library="components" size="1.25em"></tp-icon> Deterministic finite automaton

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-dfa>` element implements the <tp-icon name="graph-dfa" library="components" size="1.25em"></tp-icon> Deterministic finite automaton functionality: edits and simulates deterministic finite automata.

<tp-graph-dfa id="dfa-starts-with-ab" grid="" grid-size="20" src="/docs/components/graph-dfa/examples/starts-with-ab.json"></tp-graph-dfa>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Component itself | No dedicated pointer control; use any displayed child controls normally. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Play | Enter a word in the toolbar below the canvas. **Play** consumes the next symbol and highlights the active transition and state. **Run word** reads the complete word automatically with a visible 600 ms interval between transitions. **Reset** returns to the initial state. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-graph-dfa>` as shown below.

```html
<tp-graph-dfa id="dfa-starts-with-ab" grid grid-size="20" src="/docs/components/graph-dfa/examples/starts-with-ab.json"></tp-graph-dfa>
```

Programmatically, `run()` consumes the complete remaining input.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied deterministic finite automaton and try the simulator’s available controls.
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
<!-- tp-docgen:api TpGraphDfa -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-graph-dfa>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addEdge</code> | <code>addEdge(source: string, target: string, type = TP_DFA_TRANSITION, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = &#39;forward&#39;): TpGraphEdge</code> | Adds edge. |
  | <code>addNode</code> | <code>addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode</code> | Adds node. |
  | <code>readNext</code> | <code>readNext(duration = 300): Promise&lt;boolean&gt;</code> | Reads next. |
  | <code>reset</code> | <code>reset(word = this.inputWord): void</code> | Reset. |
  | <code>run</code> | <code>run(duration = 600): Promise&lt;boolean&gt;</code> | Run. |
  | <code>setGraph</code> | <code>setGraph(graph: TpGraphDocument): void</code> | Sets graph. |
  [Public methods of `TpGraphDfa`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-dfa-reset</code> | <code>&#123; word: unknown; stateId: unknown; graph: unknown &#125;</code> | Fired after the input and active state are reset. |
  | <code>tp-dfa-step</code> | <code>&#123; symbol: unknown; position: unknown; stateId: unknown; accepted: unknown; rejected: unknown; graph: unknown &#125;</code> | Fired after one input symbol is consumed. |
  [Events emitted by `<tp-graph-dfa>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-dfa>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_graph-dfa.TpGraphDfa.html)
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
  <script type="module" src="/path/to/components/graph-dfa/graph-dfa.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-dfa/graph-dfa.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-dfa/graph-dfa.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-graph-dfa>` are loaded automatically by this component if they have not already been loaded by another component.

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
