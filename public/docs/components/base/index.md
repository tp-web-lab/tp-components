<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="base" library="components" size="1.25em"></tp-icon> Base

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-base>` element provides shared styling, attributes and contextual help for the component library.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-base>This element provides the common tp-components foundation.</tp-base>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-base" src="/docs/components/base/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

`<tp-base>` installs the global reset, design tokens, and common tp-components styles once in the document. Every component that extends `TpBase` therefore starts from the same visual foundation without loading those styles again.

It also provides the shared user help system. Press Ctrl+? on a hovered or focused component to open “User help” in a tp-component-viewer with Doc, Demo and API panels. The drawer opens in the outer page even when the target is inside an embedded preview. Its header provides color and theme selectors, Expand, Collapse and Close controls. The demo starts from an independent copy of the targeted instance, preserving its content and current attributes at the time help is requested.

The help drawer header offers three buttons for the selected component:

- **User help** shows its independent preview and interaction instructions.
- **Author help** opens its component documentation in the drawer.
- **Developer help** opens its generated TypeDoc class reference in the drawer.

The drawer opens on User help. Switching views keeps the originally selected component.

### Authoring

`<tp-base>` is primarily an extension point for component authors. Application interfaces should normally use one of its specialized subclasses.

The host page can set `tp-components-docs-root` and `tp-components-api-root` meta elements to locate the author guides and TypeDoc output. Their defaults are `/docs/components/` and `/api/`. Generate the API with `pnpm docs:api` to include `component-pages.json`, which maps component tags to their actual TypeDoc class pages. In `tp-docs`, these locations are configured automatically; run the components documentation server alongside another guide when using Author help or Developer help in development.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/base/base.js"></script>
  ```

import
: ```js
  import "/path/to/components/base/base.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/base/base.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect a minimal element using the common component foundation.

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
@summary This component has no tp-components dependencies.
-->
No internal dependency

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
