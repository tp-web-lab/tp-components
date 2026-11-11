<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="source" library="components" size="1.25em"></tp-icon> Source

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-source>` element links to the project’s source repository.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box>
  <p>Open the source repository for this library.</p>
  <tp-source url="https://github.com/tp-web-lab/tp-components"></tp-source>
</tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-source" src="/docs/components/source/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

`<tp-source>` displays a repository button when `url` is available. It chooses the icon from the URL: GitHub, GitLab, Bitbucket, or a generic Git icon.

```html
<tp-source url="https://github.com/tp-web-lab/tp-components"></tp-source>
```

If `url` is empty or missing, the component is not displayed.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/source/source.js"></script>
  ```

import
: ```js
  import "/path/to/components/source/source.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/source/source.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Activate the source link to open the configured repository.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Repository providers
: Compare source links for GitHub, GitLab and a generic Git address. The generic example address is illustrative.
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
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
