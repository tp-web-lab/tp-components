# <tp-icon name="graph-geometric-optics" library="components" size="1.25em"></tp-icon> Geometric optics

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-geometric-optics>` element implements the <tp-icon name="graph-geometric-optics" library="components" size="1.25em"></tp-icon> Geometric optics functionality: edits and simulates a paraxial geometric-optics bench.

<tp-graph-geometric-optics id="optics-example" grid="" grid-size="20" message="Move the lens or screen and inspect the paraxial analysis." src="/tp-components/docs/components/graph-geometric-optics/examples/converging-lens.json"></tp-graph-geometric-optics>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Drag | Drag optical components from the palette and move them along the bench. |
| Select | Select the object to edit its height, a lens to edit its signed focal length, a homogeneous medium to edit its refractive index, or a plane interface to edit its left and right indices. |
| Using the component | Rays are computed automatically and are not graph edges. |
| Using the component | Each thin lens participates in the trace only while its center is on the optical axis. |
| Using the component | Moving one lens vertically away from the axis hides only its own focal points and optical effect; aligned lenses and plane interfaces remain active. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-graph-geometric-optics>` as shown below.

```html
<tp-graph-geometric-optics id="optics-example" grid grid-size="20" message="Move the lens or screen and inspect the paraxial analysis." src="/tp-components/docs/components/graph-geometric-optics/examples/converging-lens.json"></tp-graph-geometric-optics>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the supplied optical system and try the simulator’s available controls.
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
<!-- tp-docgen:api TpGraphGeometricOptics -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-graph-geometric-optics>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>addEdge</code> | <code>addEdge(): TpGraphEdge</code> | Adds edge. |
  | <code>addNode</code> | <code>addNode(type: string, point: TpGraphPoint, label?: string): TpGraphNode</code> | Adds node. |
  | <code>analyze</code> | <code>analyze(): TpOpticsAnalysis</code> | Analyze. |
  | <code>setGraph</code> | <code>setGraph(graph: TpGraphDocument): void</code> | Sets graph. |
  | <code>trace</code> | <code>trace(): void</code> | Trace. |
  [Public methods of `TpGraphGeometricOptics`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-optics-trace</code> | <code>&#123; analysis: unknown; graph: unknown &#125;</code> | * |
  [Events emitted by `<tp-graph-geometric-optics>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-geometric-optics>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_graph-geometric-optics.TpGraphGeometricOptics.html)
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
  <script type="module" src="/path/to/components/graph-geometric-optics/graph-geometric-optics.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-geometric-optics/graph-geometric-optics.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-geometric-optics/graph-geometric-optics.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-graph-geometric-optics>` are loaded automatically by this component if they have not already been loaded by another component.

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
