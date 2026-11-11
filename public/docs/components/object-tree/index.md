<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="object-tree" library="components" size="1.25em"></tp-icon> Object tree

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-object-tree>` element displays JavaScript values as an expandable tree.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-object-tree>
  <script type="tp/javascript">
    ({
      course: {
        title: 'Web components',
        lessons: 12,
        published: true
      },
      topics: ['HTML', 'CSS', 'JavaScript']
    })
  </script>
</tp-object-tree>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-object-tree" src="/docs/components/object-tree/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-object-tree></tp-object-tree>
  ```

  The empty tree can be populated later from JavaScript with `setValue(value)`.

internal script
: The direct child script must contain a JavaScript expression whose result is the value to inspect.

  ```html
  <tp-object-tree>
    <script type="tp/javascript">
      ({
        component: 'tp-object-tree',
        stable: true,
        versions: [1, 2, 3]
      })
    </script>
  </tp-object-tree>
  ```

external file
: The `src` attribute loads and inspects a JSON file.

  ```html
  <tp-object-tree src="./component.json"></tp-object-tree>
  ```

  `component.json`:

  ```json
  {
    "component": "tp-object-tree",
    "stable": true,
    "versions": [1, 2, 3]
  }
  ```

JavaScript
: Call `setValue(value)` to inspect a value created by application code.

  ```html
  <tp-object-tree id="object-tree-example"></tp-object-tree>
  ```

  `object-tree-example.js`:

  ```js
  await customElements.whenDefined('tp-object-tree');
  const tree = document.querySelector('#object-tree-example');
  tree?.setValue({
    component: 'tp-object-tree',
    stable: true,
    versions: [1, 2, 3]
  });
  ```
:::

When both are present, `src` takes precedence over the internal script. `expandAll()`, `collapseAll()`, and `sortAll()` control the resulting tree.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/object-tree/object-tree.js"></script>
  ```

import
: ```js
  import "/path/to/components/object-tree/object-tree.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/object-tree/object-tree.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand and collapse the object’s branches to inspect its nested values.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Internal script
: Expand the object initialized from an embedded JSON script.

JavaScript API
: Inspect the object supplied through the component’s JavaScript API.
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
@tp-dependency tp-tree
@summary Generic tree component for interactive hierarchical editing.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-tree>`](#/components/tree/index.md) : Generic tree component for interactive hierarchical editing.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
