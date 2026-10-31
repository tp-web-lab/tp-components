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
| Play | <kbd>Enter</kbd> a word in the toolbar below the canvas. **Play** consumes the next symbol and highlights the active transition and state. **Run word** reads the complete word automatically with a visible 600 ms interval between transitions. **Reset** returns to the initial state. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

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
  [Attributes of `<tp-graph-dfa>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addEdge</code> | <code>addEdge(source: string, target: string, type = TP_DFA_TRANSITION, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = &quot;forward&quot;): TpGraphEdge</code> | Adds a forward transition between existing state IDs, using optional connection ports; returns the edge record. Unsupported types, directions or endpoints throw. |
  | <code>addNode</code> | <code>addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode</code> | Adds a DFA state or comment at graph coordinates point with the optional label; returns a detached node record. Unsupported types throw TypeError. |
  | <code>readNext</code> | <code>readNext(duration = 300): Promise&lt;boolean&gt;</code> | Consumes and animates one input symbol using duration milliseconds. Resolves to true if a symbol was processed, not whether the word is accepted; false means no further step is possible. |
  | <code>reset</code> | <code>reset(word = this.inputWord): void</code> | Restarts reading word at the initial state and clears rejection and transition highlights; omitted word reuses the current input. Emits tp-dfa-reset. |
  | <code>run</code> | <code>run(duration = 600): Promise&lt;boolean&gt;</code> | Processes remaining symbols with duration milliseconds per step, stopping at the end or rejection. Resolves to whether the complete word is accepted; does not reset the input first. |
  | <code>setGraph</code> | <code>setGraph(graph: TpGraphDocument): void</code> | Validates the specialized graph before replacing the editor graph; retains the base editor cloning and undo-history behavior. Invalid data throws without replacing the graph. |
  [Public methods of `TpGraphDfa`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-dfa-reset</code> | <code>&#123; word: string; stateId: string \| null; graph: TpGraphDocument &#125;</code> | Emitted after the input word, consumed-symbol count and active state are reset. stateId is null when no initial state is available; graph is the resulting snapshot. |
  | <code>tp-dfa-step</code> | <code>&#123; symbol: string; position: number; stateId: string \| null; accepted: boolean; rejected: boolean; graph: TpGraphDocument &#125;</code> | Emitted after consuming one symbol and completing its transition animation. position is the number of consumed symbols; accepted and rejected describe the resulting state. |
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
