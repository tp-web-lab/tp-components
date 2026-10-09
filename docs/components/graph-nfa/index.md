# <tp-icon name="graph-nfa" library="components" size="1.25em"></tp-icon> Nondeterministic finite automaton

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-nfa>` element implements the <tp-icon name="graph-nfa" library="components" size="1.25em"></tp-icon> Nondeterministic finite automaton functionality: edits, generates, and simulates nondeterministic finite automata.

<tp-graph-nfa></tp-graph-nfa>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | The initial expression is `ab(a&#124;b)*`. |
| Using the component | It recognizes words over `{a,b}` that start with `ab`. |
| Generate NFA | Change the expression and press **Generate NFA** to rebuild the graph. |
| Using the component | Automatic execution waits 650 ms between characters so that the active states remain visible. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Read next character | Enter a word, then use **Read next character** or **Run word**. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-graph-nfa>` as shown below.

```html
<tp-graph-nfa id="nfa-regex-example" grid grid-size="20"></tp-graph-nfa>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied nondeterministic finite automaton and try the simulator’s available controls.
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
<!-- tp-docgen:api TpGraphNfa -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-graph-nfa>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addEdge</code> | <code>addEdge(source: string, target: string, type = TP_NFA_TRANSITION, sourcePort?: TpGraphPort, targetPort?: TpGraphPort, direction: TpGraphEdgeDirection = &#39;forward&#39;): TpGraphEdge</code> | Adds edge. |
  | <code>addNode</code> | <code>addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode</code> | Adds node. |
  | <code>generate</code> | <code>generate(source = this.regexSource): void</code> | Generate. |
  | <code>readNext</code> | <code>readNext(duration = 500): Promise&lt;boolean&gt;</code> | Reads next. |
  | <code>reset</code> | <code>reset(word = this.inputWord): void</code> | Reset. |
  | <code>run</code> | <code>run(duration = 650): Promise&lt;boolean&gt;</code> | Run. |
  | <code>setGraph</code> | <code>setGraph(graph: TpGraphDocument): void</code> | Sets graph. |
  [Public methods of `TpGraphNfa`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-graph-nfa>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-nfa>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_graph-nfa.TpGraphNfa.html)
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
  <script type="module" src="/path/to/components/graph-nfa/graph-nfa.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-nfa/graph-nfa.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-nfa/graph-nfa.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-graph-nfa>` are loaded automatically by this component if they have not already been loaded by another component.

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
