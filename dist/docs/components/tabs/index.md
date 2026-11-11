<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="tabs" library="components" size="1.25em"></tp-icon> Tabs

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-tabs>` element provides an accessible tab group.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-tabs>
        <dl>
          <dt>Tab 1</dt>
          <dd>Content of panel <tp-icon size="2em" name="numeric-1"></tp-icon></dd>
          <dt>Tab 2</dt>
          <dd>Content of panel <tp-icon size="2em" name="numeric-2"></tp-icon></dd>
          <dt>Tab 3</dt>
          <dd>Content of panel <tp-icon size="2em" name="numeric-3"></tp-icon></dd>
          <dt>Tab 4</dt>
          <dd>Content of panel <tp-icon size="2em" name="numeric-4"></tp-icon></dd>
        </dl>
      </tp-tabs>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-tabs" src="/docs/components/tabs/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Use `<tp-tabs>` as shown below.

```html
<tp-tabs>
  <dl>
    <dt>Tab 1</dt>
    <dd>Content of panel <tp-icon size="2em" name="numeric-1"></tp-icon></dd>
    <dt>Tab 2</dt>
    <dd>Content of panel <tp-icon size="2em" name="numeric-2"></tp-icon></dd>
    <dt>Tab 3</dt>
    <dd>Content of panel <tp-icon size="2em" name="numeric-3"></tp-icon></dd>
    <dt>Tab 4</dt>
    <dd>Content of panel <tp-icon size="2em" name="numeric-4"></tp-icon></dd>
  </dl>
</tp-tabs>
```

Authors keep the familiar `dl`/`dt`/`dd` structure and do not add ARIA roles themselves. At runtime, `tp-tabs` converts it into generic elements carrying the compatible `tablist`, `tab`, and `tabpanel` roles, relationships, selection state, and keyboard behavior.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/tabs/tabs.js"></script>
  ```

import
: ```js
  import "/path/to/components/tabs/tabs.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/tabs/tabs.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select the tabs to switch between their content panels.

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
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
