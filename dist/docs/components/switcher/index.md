<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="switcher" library="components" size="1.25em"></tp-icon> Switcher

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-switcher>` element switches between horizontal and vertical layouts based on available space.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-switcher threshold="35rem" gap="1rem">
  <tp-box>1. Plan the content.</tp-box>
  <tp-box>2. Write a draft.</tp-box>
  <tp-box>3. Review the text.</tp-box>
  <tp-box>4. Add illustrations.</tp-box>
  <tp-box>5. Publish the result.</tp-box>
</tp-switcher>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-switcher" src="/docs/components/switcher/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

The default gap is `1rem`, and the default width threshold is `30rem`. Below this available width, the items stack vertically. CSS properties can override these defaults.

`max-horizontal` is absent by default (`""` in the attribute table): there is no per-row limit, and the JavaScript property `maxHorizontal` returns `null`. A positive integer limits the number of items on each row; additional items wrap onto subsequent rows. With five panels, `3` gives a row of three followed by a row of two, and `2` gives rows of two, two and one, provided enough width is available. Items on the last row expand to share its available width. Below `threshold`, the layout still becomes a single column. In Attributes, try `3`, then `2`, and clear the field to remove the per-row limit.

```html
<tp-switcher></tp-switcher>
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
  <script type="module" src="/path/to/components/switcher/switcher.js"></script>
  ```

import
: ```js
  import "/path/to/components/switcher/switcher.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/switcher/switcher.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Resize the example to switch the panels between a shared row and a vertical stack.

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
