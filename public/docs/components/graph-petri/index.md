# <tp-icon name="graph-petri" library="components" size="1.25em"></tp-icon> Petri graph

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-petri>` element implements the <tp-icon name="graph-petri" library="components" size="1.25em"></tp-icon> Petri graph functionality: edits and simulates place/transition Petri nets.

<tp-graph-petri id="petri-intro" grid="" grid-size="20" src="/docs/components/graph-petri/examples/petri-intro.json"></tp-graph-petri>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Franchissable transitions are highlighted in green. |
| Hover | Hover one and use its play control to execute that specific transition. |
| Using the component | The generic toolbar is above the canvas. |
| Play | The Petri-specific toolbar is below the canvas: **Play** chooses randomly among all currently enabled transitions and **Reset** restores the initial marking. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Fires the focused enabled transition. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

Use `<tp-graph-petri>` as shown below.

```html
<tp-graph-petri id="petri-intro" grid grid-size="20" src="/docs/components/graph-petri/examples/petri-intro.json"></tp-graph-petri>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied Petri net and try the simulator’s available controls.
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
<!-- tp-docgen:api TpGraphPetri -->
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
  [Attributes of `<tp-graph-petri>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addArc</code> | <code>addArc(source: string, target: string, weight = 1): TpGraphEdge</code> | Adds an arc between source and target IDs with a positive integer weight; returns its stored edge record. Invalid weight or incompatible endpoints throw. |
  | <code>addEdge</code> | <code>addEdge(source: string, target: string, type = TP_PETRI_ARC, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = &quot;forward&quot;): TpGraphEdge</code> | Adds a Petri arc between a place and a transition, returning its edge record. Only forward/backward directions and the Petri arc type are accepted; invalid connections throw. |
  | <code>addNode</code> | <code>addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode</code> | Adds a Petri place, transition or comment at graph coordinates point with the optional label; returns a detached node record. Unsupported types throw TypeError. |
  | <code>addPlace</code> | <code>addPlace(point: TpGraphPoint, label = &quot;Place&quot;, initialTokens = 0): TpGraphNode</code> | Adds a place at graph coordinates point with the optional label and nonnegative integer initialTokens. Sets both current and initial marking and returns the node record. |
  | <code>addTokens</code> | <code>addTokens(placeId: string, count = 1, updateInitial = true): void</code> | Adds a positive integer count to placeId without exceeding its capacity. Also increases its initial marking unless updateInitial is false; invalid inputs throw. |
  | <code>addTransition</code> | <code>addTransition(point: TpGraphPoint, label = &quot;Transition&quot;): TpGraphNode</code> | Adds a Petri transition at graph coordinates point with label and returns its node record. |
  | <code>fire</code> | <code>fire(transitionId: string, duration = 350): Promise&lt;void&gt;</code> | Fires the enabled transition identified by transitionId, animates for duration milliseconds and emits tp-petri-fire. Resolves after animation; invalid or disabled transitions reject. |
  | <code>fireNext</code> | <code>fireNext(duration = 350): Promise&lt;string \| null&gt;</code> | Randomly chooses and fires an enabled transition with duration in milliseconds. Resolves to its ID, or null when no transition is enabled. |
  | <code>resetMarking</code> | <code>resetMarking(): void</code> | Restores each place to its initial token count, clears fired-transition highlights and emits tp-petri-reset. |
  | <code>setGraph</code> | <code>setGraph(graph: TpGraphDocument): void</code> | Validates the specialized graph before replacing the editor graph; retains the base editor cloning and undo-history behavior. Invalid data throws without replacing the graph. |
  [Public methods of `TpGraphPetri`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-graph-change</code> | <code>&#123; reason: string; graph: TpGraphDocument &#125;</code> | Emitted after adding a token, as well as for inherited graph mutations. reason identifies the operation and graph contains the resulting snapshot. |
  | <code>tp-graph-error</code> | <code>&#123; error: unknown; operation: &quot;add-token&quot; \| &quot;load-src&quot; \| &quot;reconnect-edge&quot; \| &quot;add-edge&quot;; src?: string &#125;</code> | Emitted if adding a token from the UI fails, or for an inherited graph loading or edge-editing failure. operation identifies the failed action. |
  | <code>tp-petri-fire</code> | <code>&#123; transitionId: string; marking: Record&lt;string, number&gt;; graph: TpGraphDocument &#125;</code> | Emitted after a transition fires and its animation finishes; marking maps each place ID to its remaining token count. |
  | <code>tp-petri-reset</code> | <code>&#123; marking: Record&lt;string, number&gt;; graph: TpGraphDocument &#125;</code> | Emitted after the initial marking is restored; marking maps each place ID to its reset token count. |
  [Events emitted by `<tp-graph-petri>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-petri>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_graph-petri.TpGraphPetri.html)
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
  <script type="module" src="/path/to/components/graph-petri/graph-petri.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-petri/graph-petri.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-petri/graph-petri.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-graph-petri>` are loaded automatically by this component if they have not already been loaded by another component.

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
