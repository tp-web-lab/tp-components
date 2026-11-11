<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="stack" library="components" size="1.25em"></tp-icon> Stack

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-stack>` element arranges content vertically with consistent spacing.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-stack>
  <tp-box>Step 1: Write a draft.</tp-box>
  <tp-box>Step 2: Review the content.</tp-box>
  <tp-box>Step 3: Publish the document.</tp-box>
</tp-stack>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-stack" src="/docs/components/stack/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

`recursive` applies the stack spacing to nested siblings as well as direct children. Without it, only the direct children are spaced.

`split-after` is a one-based child index: `1` inserts flexible space after the first child, `2` after the second. By default the attribute is absent (`""` in the attribute table), so there is no split; the JavaScript property `splitAfter` returns `null`. Leave the Attributes field empty to keep this default. The stack needs extra available height for the effect to be visible, and the index must precede another child.

In Attributes, enable `recursive` to separate the three lines inside the first box. Enter `1` or `2` in `split-after` to push the following boxes toward the bottom of the fixed-height preview. Clear the field to restore normal spacing.

```html
<tp-stack split-after="2" style="height: 30rem">
  <tp-box>Header</tp-box>
  <tp-box>Content</tp-box>
  <tp-box>Footer pushed toward the bottom</tp-box>
</tp-stack>
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
  <script type="module" src="/path/to/components/stack/stack.js"></script>
  ```

import
: ```js
  import "/path/to/components/stack/stack.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/stack/stack.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the vertical spacing between the three publishing steps.

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
