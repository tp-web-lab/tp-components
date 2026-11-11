<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="copy-code" library="components" size="1.25em"></tp-icon> Copy code

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-copy-code>` element copies the textual content of a target component to the clipboard.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box>
  <tp-box id="intro-copy-code"><pre><code>const answer = 6 * 7;</code></pre></tp-box>
  <tp-copy-code for="intro-copy-code"></tp-copy-code>
</tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-copy-code" src="/docs/components/copy-code/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

All `pre > code` blocks automatically receive a copy button when the library foundations are initialized, including dynamically loaded content. It appears in the top-right corner on hover or keyboard focus, and remains visible on touch devices. Only the code text is copied. Existing copy controls are preserved; editable content is not enhanced. No additional author markup is required.

Set `for` to the target element ID. The component reports success or failure through `tp-copy-code-success` and `tp-copy-code-error`.

Successful copying temporarily replaces the copy icon with a check mark. No tooltip appears on hover or after copying. The `copied-text` attribute supplies the accessible success label; the idle button is labelled “Copy code”.

```html
<pre id="copy-example"><code>const answer = 42;</code></pre>
<tp-copy-code for="copy-example"></tp-copy-code>
```

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/copy-code/copy-code.js"></script>
  ```

import
: ```js
  import "/path/to/components/copy-code/copy-code.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/copy-code/copy-code.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Copy the displayed code and observe the button’s confirmation state.

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
@tp-dependency tp-animation
@summary Applies an animation to a target element.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->

- [`<tp-animation>`](#/components/animation/index.md) : Applies an animation to a target element.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
