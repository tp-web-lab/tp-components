# <tp-icon name="lang" library="components" size="1.25em"></tp-icon> Language

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-lang>` element implements the <tp-icon name="lang" library="components" size="1.25em"></tp-icon> Language functionality: documentation language selector.

<tp-iframe src="/tp-components/docs/components/lang/examples/introduction-frame.html" title="tp-lang — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Language button | Open the list of available languages. |
| Language entry | Navigate to that language version of the documentation. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

`<tp-lang>` displays a flag button and a dropdown for switching documentation languages. It is primarily designed for `<tp-markup-multi-pages>` and changes the documentation repository used by the page.

The first language listed in `langs` is the default language. It uses the base repository directly. Other languages use a subdirectory named after the language code.

The controller behaves like an icon button. Use `variant`, `size`, and
`disabled` to configure the internal `<tp-icon-button>`:

```html
<tp-lang langs="en,fr" variant="brand" size="s"></tp-lang>
<tp-lang langs="en,fr" disabled></tp-lang>
```

#### Fixed documentation repository

```html
<tp-lang langs="en,fr" repository="/tp-components/docs"></tp-lang>
<tp-markup-multi-pages repository="/tp-components/docs"></tp-markup-multi-pages>
```

With `repository="/tp-components/docs"` and `langs="en,fr"`:

| Language | Repository |
| --- | --- |
| `en` | `/tp-components/docs` |
| `fr` | `/tp-components/docs/fr` |

The component updates the `repository` attribute of the nearest `<tp-markup-multi-pages>`. If it is not inside one, it updates the first compatible multi-page documentation component found in the document.

#### Language modes

The dropdown always exposes `auto` before the explicit languages. `auto` uses the browser language from `navigator.language`.

| Mode | Resolution |
| --- | --- |
| `auto` | Uses the browser language when its base code is listed in `langs`; otherwise uses the first language. |
| `en`, `fr`, ... | Uses the selected language directly. |

For example, with `langs="en,fr,es"` and `navigator.language` set to `fr-FR`, `auto` resolves to `fr`.

#### Inferred repository

When `repository` is omitted, the base path is inferred from the directory that contains the current `index.html`.

```html
<tp-lang langs="en,fr"></tp-lang>
<tp-markup-multi-pages></tp-markup-multi-pages>
```

For a page served at `/guide/index.html`, French documentation is resolved as `/guide/fr`.

#### Directory layout

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

#### Current page

When `<tp-markup-multi-pages>` navigation uses hash URLs such as `#/components/callout/index.md`, changing the language keeps the current document path and only changes the repository.

```txt
/tp-components/docs + #/components/callout/index.md
/tp-components/docs/fr + #/components/callout/index.md
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Choose English or French and observe the translated message in this isolated example.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
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
<!-- tp-docgen:api TpLang -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables the language trigger. |
  | <code>langs</code> | <code>string</code> | <code>&quot;en&quot;</code> | Comma-separated language codes. |
  | <code>repository</code> | <code>string</code> | <code>&quot;&quot;</code> | Documentation repository root. |
  | <code>size</code> | <code>string</code> | <code>&quot;m&quot;</code> | Icon button size. |
  | <code>variant</code> | <code>string</code> | <code>&quot;neutral&quot;</code> | Icon button variant. |
  [Attributes of `<tp-lang>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpLang`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-lang-change</code> | <code>&#123; choice: string; lang: string; repository: string; anchor: null; target: HTMLElement \| null &#125;</code> | Emitted when the selected documentation language changes. |
  [Events emitted by `<tp-lang>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-lang>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_lang.TpLang.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-lang>` are loaded automatically by this component if they have not already been loaded by another component.

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
@summary Displays an anchored dropdown menu.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-divider>`](../divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](../dropdown/index.md) : Displays an anchored dropdown menu.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
