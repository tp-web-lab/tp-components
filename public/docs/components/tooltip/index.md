<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="tooltip" library="components" size="1.25em"></tp-icon> Tooltip

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-tooltip>` element displays anchored tooltip content.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-box data-intro-action="tooltip" data-allow-script="">
  <tp-button id="intro-tooltip-trigger" data-demo-trigger="">Hover or focus for help</tp-button>
  <tp-tooltip anchor="#intro-tooltip-trigger">This help also appears when the trigger receives keyboard focus.</tp-tooltip>
  <p data-demo-status="" role="status">Try the tooltip using its trigger.</p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-tooltip" src="/docs/components/tooltip/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-tooltip>` as shown below.

```html
<tp-tooltip></tp-tooltip>
```

### Pointer and keyboard interaction

Move the pointer from the anchor into the tooltip to follow links, select text or scroll its content. A short closing delay lets the pointer cross the gap. The tooltip stays open while the pointer or keyboard focus remains in either the anchor or the tooltip, and closes after both leave. Press <kbd>Escape</kbd> to close it immediately.

For long content, constrain its height and enable scrolling on the content container, for example `max-height: 20rem; overflow: auto`. Keep links keyboard accessible and place the tooltip after its anchor in document order.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/tooltip/tooltip.js"></script>
  ```

import
: ```js
  import "/path/to/components/tooltip/tooltip.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/tooltip/tooltip.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Hover over or focus the trigger to reveal the contextual help.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Links and scrollable content
: Move from the trigger into the tooltip, scroll the long guide and follow its links. Try keyboard focus and <kbd>Escape</kbd>, then leave both areas to observe the delayed closure.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
:tp-icon:{name="file_type_html" library="languages" size="1.25em" aria-hidden="true"} HTML
: ::include{examples/examples.html}

:tp-icon:{name="file_type_asciidoc" library="languages" size="1.25em" aria-hidden="true"} tp-asciidoc
: ::include{examples/examples.adoc}

:tp-icon:{name="file_type_latex" library="languages" size="1.25em" aria-hidden="true"} tp-latex
: ::include{examples/examples-latex.html}

:tp-icon:{name="file_type_markdown" library="languages" size="1.25em" aria-hidden="true"} tp-markdown
: ::include{examples/examples.md}

:tp-icon:{name="file_type_restructuredtext" library="languages" size="1.25em" aria-hidden="true"} tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

<!-- -->
<!-- tp-docgen:dependencies:start -->
## Dependencies

All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.

### Internal

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
