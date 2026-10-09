# <tp-icon name="object-tree" library="components" size="1.25em"></tp-icon> Object tree

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-object-tree>` element implements the <tp-icon name="object-tree" library="components" size="1.25em"></tp-icon> Object tree functionality: specialized tree for inspecting JavaScript values.

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

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Expand or collapse branches to inspect nested items. |
| Select | Select available links or entries to use the actions provided by the surrounding page. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

#### Initial object content

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

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Expand and collapse the object’s branches to inspect its nested values.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Internal script
: Expand the object initialized from an embedded JSON script.

JavaScript API
: Inspect the object supplied through the component’s JavaScript API.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpObjectTree -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of an external JSON file to inspect. |
  [Attributes of `<tp-object-tree>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>collapseAll</code> | <code>collapseAll(): void</code> | Collapses all nodes. |
  | <code>expandAll</code> | <code>expandAll(): void</code> | Expands all nodes. |
  | <code>setValue</code> | <code>setValue(value: unknown): void</code> | Loads a new value into the tree. |
  | <code>sortAll</code> | <code>sortAll(): void</code> | Sorts the current inspectable tree. |
  [Public methods of `TpObjectTree`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-object-tree-error</code> | <code>&#123; message: string; source: &quot;script&quot; \| &quot;src&quot;; src: string &#125;</code> | Emitted when an external JSON file or inline JavaScript expression cannot be loaded. |
  | <code>tp-object-tree-load</code> | <code>&#123; source: &quot;script&quot; \| &quot;src&quot;; src: string; value: unknown &#125;</code> | Emitted after an external JSON file or inline JavaScript expression has been loaded. |
  | <code>tp-tree-context-action</code> | <code>void</code> | Emitted when the user triggers a global tree action. |
  [Events emitted by `<tp-object-tree>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-object-tree-boolean-color</code> | <code>#8250df</code> | Controls the boolean color. |
  | <code>&#45;&#45;tp-object-tree-circular-color</code> | <code>#cf222e</code> | Controls the circular color. |
  | <code>&#45;&#45;tp-object-tree-date-color</code> | <code>#116329</code> | Controls the date color. |
  | <code>&#45;&#45;tp-object-tree-error-color</code> | <code>#cf222e</code> | Controls the error color. |
  | <code>&#45;&#45;tp-object-tree-font-size</code> | <code>0.875rem</code> | Controls the font size. |
  | <code>&#45;&#45;tp-object-tree-function-color</code> | <code>#953800</code> | Controls the function color. |
  | <code>&#45;&#45;tp-object-tree-key-color</code> | <code>#6a737d</code> | Controls the key color. |
  | <code>&#45;&#45;tp-object-tree-nullish-color</code> | <code>#8c959f</code> | Controls the nullish color. |
  | <code>&#45;&#45;tp-object-tree-number-color</code> | <code>#0550ae</code> | Controls the number color. |
  | <code>&#45;&#45;tp-object-tree-separator-color</code> | <code>#8c959f</code> | Controls the separator color. |
  | <code>&#45;&#45;tp-object-tree-string-color</code> | <code>#0a7f3f</code> | Controls the string color. |
  | <code>&#45;&#45;tp-object-tree-structure-color</code> | <code>#57606a</code> | Controls the structure color. |
  [CSS properties of `<tp-object-tree>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_object-tree.TpObjectTree.html)
<!-- tp-docgen:typedoc:end -->





































































































































































































































### Imports

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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-object-tree>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-tree
@summary Generic tree component for interactive hierarchical editing.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-tree>`](../tree/index.md) : Generic tree component for interactive hierarchical editing.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
