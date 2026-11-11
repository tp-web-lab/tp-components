<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="markup-single-page" library="components" size="1.25em"></tp-icon> Markup single-page

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-markup-single-page>` element renders one Markdown, AsciiDoc, reStructuredText, LaTeX or HTML document.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-markup-single-page>
  <script type="tp/markdown">
## A short guide

This document is rendered as a single page.

### Getting started

- Read the introduction
- Try a component
  </script>
</tp-markup-single-page>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-markup-single-page" src="/docs/components/markup-single-page/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: ```html
  <tp-markup-single-page></tp-markup-single-page>
  ```

internal script
: ```html
  <tp-markup-single-page>
    <script type="tp/markdown">
  ## A short guide
  
  This document is rendered as a single page.
  
  ### Getting started
  
  - Read the introduction
  - Try a component
    </script>
  </tp-markup-single-page>
  ```

external file
: ```html
  <tp-markup-single-page src="/docs/components/markup-single-page/examples/initial-content.md"></tp-markup-single-page>
  ```
:::

### Configuration

Set `logo="/docs/medias/logos/logo-tp.svg"` to display a `tp-icon` at the start of the toolbar, at the default icon-button size (`2em`). Changing the attribute updates the logo; removing it or setting it to an empty value hides it. The logo is decorative and has no click action. Single-page documents also require the `toolbar` attribute.

### Authoring

Use `label="My document"` to display a title in the center of the toolbar. Its default is an empty string. Changing or removing the label updates only the title, without reloading the document or closing its tools. Without a toolbar, the label is not displayed.

The toolbar is hidden by default. Add `toolbar` (or `toolbar=""`) to display all available controls, or give a comma-separated selection. The toolbar updates immediately without reloading the document. Unknown names and duplicates are ignored.

```html
<tp-markup-single-page src="guide.md" toolbar="code,calc,postit,theme,fullscreen" label="My document"></tp-markup-single-page>
```

Set `git="https://github.com/owner/repository"` to add a repository button at the start of the toolbar, before Code. It opens the repository in a new tab. This button is independent of the selection in `toolbar`; an absent or empty `git` hides it. Without a toolbar, no repository button is displayed.

The left group contains `code`, `calc`, `postit`; the right group contains `clock`, `lang`, `color`, `theme`, `fullscreen`, in that order regardless of the order in the attribute. Code displays the original source as text; Calculator opens a separate drawer.

For translated external documents, provide `langs="en,fr,es"`. The first language uses the source directory (for example `guide.md`); the others use subdirectories with the same filename (`fr/guide.md`, `es/guide.md`). With no `langs`, only `en` is assumed and no translation requests are made. The language control is shown only when `lang` is selected and at least two versions are available. It is hidden for inline documents. A static server must return 404 for missing translation files instead of serving a fallback page.

### Local navigation bar

An optional `navbar` file supplies a list of links displayed directly as buttons on the right of the main toolbar, before the vertical `tp-divider` and global controls. Authored `tp-button` and `tp-icon-button` elements are preserved; ordinary links become `tp-button` elements. No menu or list wrapper is added to the toolbar. Use `navbar.md`, `navbar.adoc`, `navbar.rst` or `navbar.html`, matching the document format. Both ordered and unordered lists are accepted. A missing file or a file without a list adds no controls.

Place it beside the `src` document (or beside the host page for inline content). Enable `toolbar` to show it. Links resolve relative to the navbar file. Changing the source or recreating the toolbar reloads the navbar.

For a Markdown navbar:

```markdown
- [Playlist](playlist/playlist.md)
- [Scores](partitions/partitions.md)
```

### Linked toolbar logo

Use `logo="logo.svg"` with `logo-href="https://example.org/"` to display the logo as a `tp-icon-button` that opens the associated website in the current tab. Relative destinations resolve against the page URL. When `logo-href` is omitted or empty, it defaults to `./` (the current directory). An invalid or non-HTTP(S) destination leaves the logo visible but inactive. Both attributes update immediately. Single-page documents also require `toolbar` to display the toolbar.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/markup-single-page/markup-single-page.js"></script>
  ```

import
: ```js
  import "/path/to/components/markup-single-page/markup-single-page.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markup-single-page/markup-single-page.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the rendered markup document. The toolbar is hidden unless explicitly enabled.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Toolbar controls
: Compare the complete toolbar with a selection of Code, Calculator and Theme. Open a drawer or change the appearance without replacing the document.
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
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
