<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="console" library="components" size="1.25em"></tp-icon> Console

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-console>` element provides a visual console for playground output.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-box data-intro-action="console" data-allow-script="">
  <p>Inspect these example messages, then use Clear to empty the console.</p>
  <tp-console></tp-console>
  <p data-demo-status="" role="status"></p>
  <script src="/docs/components/_shared/introduction-actions.js"></script>
</tp-box>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-console" src="/docs/components/console/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-console>` when you need a visual console. You can write entries directly through the component methods:

``` html
<tp-console id="output"></tp-console>

<script type="module">
  await customElements.whenDefined('tp-console');
  const output = document.querySelector('#output');
  output.log('Loaded');
  output.warn('Missing optional value');
  output.error(new Error('Example error'));
</script>
```

The component can also redirect global `console.log`, `console.info`, `console.warn`, `console.error`, and `console.clear` calls to itself while keeping the native browser console behavior.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/console/console.js"></script>
  ```

import
: ```js
  import "/path/to/components/console/console.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/console/console.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the sample messages and use Clear to empty the console.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Values and tables
: Inspect how the console displays structured values and tabular data.

Groups and timers
: Inspect grouped console output and timing information.

Redirect global console
: Observe global console messages redirected into the component.

Message levels
: Compare standard, informative, warning and error messages in the console, then clear its output.
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
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-copy-code
@summary Copy-to-clipboard button component.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-object-tree
@summary Specialized tree for inspecting JavaScript values.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-copy-code>`](#/components/copy-code/index.md) : Copy-to-clipboard button component.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-object-tree>`](#/components/object-tree/index.md) : Specialized tree for inspecting JavaScript values.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
