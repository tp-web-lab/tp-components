<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="screen" library="components" size="1.25em"></tp-icon> Screen

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-screen>` element previews and applies absolute device sizes or relative aspect ratios to the page.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-screen src="/docs/components/screen/examples/responsive.html"></tp-screen>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-screen" src="/docs/components/screen/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

| Format | Viewport |
| --- | --- |
| Phone portrait | 390 × 844 CSS px |
| Phone landscape | 844 × 390 CSS px |
| Tablet portrait | 768 × 1024 CSS px |
| Tablet landscape | 1024 × 768 CSS px |
| Laptop | 1366 × 768 CSS px |
| Desktop | 1920 × 1080 CSS px |
| default | Current window proportions; restores the original window on OK |
| 16:9, 3:2, 4:3 | Landscape ratios fitted to the available area |
| 1:1 | Square fitted to the available area |
| 3:4, 2:3, 9:16 | Portrait ratios fitted to the available area |

Absolute presets preserve their CSS pixel dimensions and scale down visually if needed. Relative presets resize with the available area. Media queries and viewport units respond to the actual iframe size. This is viewport sizing, not hardware emulation: browser engine, touch input, device pixel ratio and user agent remain unchanged. A remote page can refuse embedding. Use a served page URL rather than an inline `srcdoc` document for current-page preview.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/screen/screen.js"></script>
  ```

import
: ```js
  import "/path/to/components/screen/screen.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/screen/screen.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Try the absolute and relative format rows, then use OK to apply a format or Cancel to keep the last choice. Type into the field and reopen the chooser to check that the applied page keeps its state.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
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
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-iframe
@summary Controlled iframe component.
-->
<!--
@tp-dependency tp-menu
@summary Accessible menu component.
-->
<!--
@tp-dependency tp-modal
@summary Modal overlay component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-iframe>`](#/components/iframe/index.md) : Controlled iframe component.
- [`<tp-menu>`](#/components/menu/index.md) : Accessible menu component.
- [`<tp-modal>`](#/components/modal/index.md) : Modal overlay component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
