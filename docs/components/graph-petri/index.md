# <tp-icon name="graph-petri" library="components" size="1.25em"></tp-icon> Petri graph

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-petri>` element implements the <tp-icon name="graph-petri" library="components" size="1.25em"></tp-icon> Petri graph functionality: edits and simulates place/transition Petri nets.

<tp-graph-petri id="petri-intro" grid="" grid-size="20" src="/tp-components/docs/components/graph-petri/examples/petri-intro.json"></tp-graph-petri>

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
| Enter / Space | Fires the focused enabled transition. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-graph-petri>` as shown below.

```html
<tp-graph-petri id="petri-intro" grid grid-size="20" src="/tp-components/docs/components/graph-petri/examples/petri-intro.json"></tp-graph-petri>
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
  | None. |  |  |  |
  [Attributes of `<tp-graph-petri>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addArc</code> | <code>addArc(source: string, target: string, weight = 1): TpGraphEdge</code> | Adds arc. |
  | <code>addEdge</code> | <code>addEdge(source: string, target: string, type = TP_PETRI_ARC, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = &#39;forward&#39;): TpGraphEdge</code> | Adds edge. |
  | <code>addNode</code> | <code>addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode</code> | Adds node. |
  | <code>addPlace</code> | <code>addPlace(point: TpGraphPoint, label = &#39;Place&#39;, initialTokens = 0): TpGraphNode</code> | Adds place. |
  | <code>addTokens</code> | <code>addTokens(placeId: string, count = 1, updateInitial = true): void</code> | Adds tokens. |
  | <code>addTransition</code> | <code>addTransition(point: TpGraphPoint, label = &#39;Transition&#39;): TpGraphNode</code> | Adds transition. |
  | <code>fire</code> | <code>fire(transitionId: string, duration = 350): Promise&lt;void&gt;</code> | Fire. |
  | <code>fireNext</code> | <code>fireNext(duration = 350): Promise&lt;string \| null&gt;</code> | Fire next. |
  | <code>resetMarking</code> | <code>resetMarking(): void</code> | Resets marking. |
  | <code>setGraph</code> | <code>setGraph(graph: TpGraphDocument): void</code> | Sets graph. |
  [Public methods of `TpGraphPetri`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-graph-change</code> | <code>&#123; reason: &quot;add-token&quot;; graph: unknown &#125;</code> | Emitted when graph change occurs. |
  | <code>tp-graph-error</code> | <code>&#123; error: unknown; operation: &quot;add-token&quot; &#125;</code> | Emitted when graph error occurs. |
  | <code>tp-petri-fire</code> | <code>&#123; transitionId: unknown; marking: unknown; graph: unknown &#125;</code> | Fired after a transition is fired. |
  | <code>tp-petri-reset</code> | <code>&#123; marking: unknown; graph: unknown &#125;</code> | Fired after the initial marking is restored. |
  [Events emitted by `<tp-graph-petri>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-petri>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_graph-petri.TpGraphPetri.html)
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
