<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="graph-editor" library="components" size="1.25em"></tp-icon> Graph editor

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-graph-editor>` element edits and animates domain-specific graphs.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-graph-editor grid="" grid-size="20" message="Graph message area" src="/docs/components/graph-editor/examples/graph-example.json"></tp-graph-editor>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-graph-editor" src="/docs/components/graph-editor/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-graph-editor></tp-graph-editor>
  ```

internal script
: ```html
  <tp-graph-editor>
    <script type="tp/graph">{"nodes":[],"edges":[]}</script>
  </tp-graph-editor>
  ```

external file
: ```html
  <tp-graph-editor src="./graph.json"></tp-graph-editor>
  ```

JavaScript API
: Assign a graph document to the `value` property.
:::

### Empty editor

Add `grid` to display a dotted grid and snap node positions to it. `grid-size` is expressed in graph units.

```html
<tp-graph-editor grid grid-size="20"></tp-graph-editor>
```

The generic palette contains circular nodes and four link modes: no arrow, a forward arrow, a backward arrow, or arrows at both endpoints. `backward` reverses the visible arrow without exchanging `source` and `target`. Select a link mode before dragging from a node port. Parallel links are automatically rendered as separate Bézier curves. A link whose source and target are the same node is rendered as two circular arcs through an external apex, so the loop stays outside the node. Its endpoints always use two distinct ports, and additional self-links use progressively larger radii. Older self-links without ports are normalized automatically.

### Authoring

The editor deliberately separates four concerns:

- the serializable graph document;
- palettes that describe available shapes;
- SVG renderers that control their appearance;
- simulators that compute animated state transitions.

This separation allows the same editor to support Petri nets, logic circuits, query trees, geometric optics diagrams, state machines, and other domains without putting their semantics into the core component.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/graph-editor/graph-editor.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-editor/graph-editor.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-editor/graph-editor.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect and edit the supplied graph using the editor tools.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> HTML
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_latex" library="languages" size="1.25em"></tp-icon> tp-latex
: ::include{examples/examples-latex.html}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

<!--
@tp-dependency tp-accordion
@summary Collapsible multi-panels element.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-save-image
@summary Downloads an anchored image as SVG, PNG or WebP.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->

- [`<tp-accordion>`](#/components/accordion/index.md) : Collapsible multi-panels element.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button-group>`](#/components/button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-code-editor>`](#/components/code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-save-image>`](#/components/save-image/index.md) : Downloads an anchored image as SVG, PNG or WebP.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.

### External

<!--
@credit Zod https://zod.dev/
@summary Runtime schema validation.
-->

- [Zod](https://zod.dev/) : Runtime schema validation.
<!-- tp-docgen:dependencies:end -->
