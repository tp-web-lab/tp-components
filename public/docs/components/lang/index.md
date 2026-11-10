<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="lang" library="components" size="1.25em"></tp-icon> Language

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-lang>` element provides a documentation language selector.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-iframe src="/docs/components/lang/examples/introduction-frame.html" title="tp-lang — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-lang" src="/docs/components/lang/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

`<tp-lang>` displays a flag button and a dropdown for switching documentation languages. It is primarily designed for `<tp-markup-multi-pages>` and changes the documentation repository used by the page.

The first language listed in `langs` is the default language. It uses the base repository directly. Other languages use a subdirectory named after the language code.

The controller behaves like an icon button. Use `variant`, `size`, and
`disabled` to configure the internal `<tp-icon-button>`:

```html
<tp-lang langs="en,fr" variant="brand" size="s"></tp-lang>
<tp-lang langs="en,fr" disabled></tp-lang>
```

### Fixed documentation repository

```html
<tp-lang langs="en,fr" repository="/docs"></tp-lang>
<tp-markup-multi-pages repository="/docs"></tp-markup-multi-pages>
```

With `repository="/docs"` and `langs="en,fr"`:

| Language | Repository |
| --- | --- |
| `en` | `/docs` |
| `fr` | `/docs/fr` |

The component updates the `repository` attribute of the nearest `<tp-markup-multi-pages>`. If it is not inside one, it updates the first compatible multi-page documentation component found in the document.

### Language modes

The dropdown always exposes `auto` before the explicit languages. `auto` uses the browser language from `navigator.language`.

| Mode | Resolution |
| --- | --- |
| `auto` | Uses the browser language when its base code is listed in `langs`; otherwise uses the first language. |
| `en`, `fr`, ... | Uses the selected language directly. |

For example, with `langs="en,fr,es"` and `navigator.language` set to `fr-FR`, `auto` resolves to `fr`.

### Inferred repository

When `repository` is omitted, the base path is inferred from the directory that contains the current `index.html`.

```html
<tp-lang langs="en,fr"></tp-lang>
<tp-markup-multi-pages></tp-markup-multi-pages>
```

For a page served at `/guide/index.html`, French documentation is resolved as `/guide/fr`.

### Directory layout

For `langs="en,fr"` and a default English documentation, a typical layout is:

```txt
docs/
  index.html
  sidebar.md
  cover.md
  components/
    callout/
      index.md
  fr/
    sidebar.md
    cover.md
    components/
      callout/
        index.md
```

The translated tree should keep the same relative paths as the default documentation.

### Current page

When `<tp-markup-multi-pages>` navigation uses hash URLs such as `#/components/callout/index.md`, changing the language keeps the current document path and only changes the repository.

```txt
/docs + #/components/callout/index.md
/docs/fr + #/components/callout/index.md
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
  <script type="module" src="/path/to/components/lang/lang.js"></script>
  ```

import
: ```js
  import "/path/to/components/lang/lang.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/lang/lang.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Choose English or French and observe the translated message in this isolated example.

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
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
