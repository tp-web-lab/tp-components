<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="checkbox-list" library="components" size="1.25em"></tp-icon> Checkbox list

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-checkbox-list>` element presents a list of independently selectable choices.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-checkbox-list name="topics" value="1,3">
    <ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul>
  </tp-checkbox-list>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-checkbox-list" src="/docs/components/checkbox-list/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `label` to display a name for the whole group. `label-position` accepts `top` (default), `bottom`, `start`, or `end`; use `label-position="start"` to place it beside the choices. Start and end follow the writing direction. The label names the group through `aria-labelledby`, and clicking it focuses the selected option or the first available option. No `fieldset` is created; keep the choices in the component's direct `ul`. Removing `label` restores the unlabeled layout without changing the selection.

The `value` attribute contains comma-separated, one-based item indexes. Listen for `tp-checkbox-list-change` to receive the current value and label.

```html
<tp-checkbox-list name="topics" value="1,3">
  <ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul>
</tp-checkbox-list>
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
  <script type="module" src="/path/to/components/checkbox-list/checkbox-list.js"></script>
  ```

import
: ```js
  import "/path/to/components/checkbox-list/checkbox-list.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/checkbox-list/checkbox-list.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Select and clear several web-language choices independently.

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
