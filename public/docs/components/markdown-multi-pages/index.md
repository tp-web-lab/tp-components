<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="markdown-multi-pages" library="components" size="1.25em"></tp-icon> Markdown multi-pages

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-markdown-multi-pages>` element presents Markdown documents with navigation between pages.

<tp-box class="tp-component-doc-example" border-radius="0.5rem">

<!-- tp-docgen:introduction:start -->
<tp-iframe src="/docs/components/markdown-multi-pages/examples/introduction-frame.html" title="tp-markdown-multi-pages — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>
<!-- tp-docgen:introduction:end -->

</tp-box>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-markdown-multi-pages" src="/docs/components/markdown-multi-pages/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

The language selector appears only when `langs` declares at least two distinct comma-separated language codes (for example, `langs="fr,en"`). Without `langs`, or with a single language, it stays hidden. Changes to `langs` update the selector immediately; translation-file availability does not control its visibility.

The default toolbar places Clock, Language (only when multiple languages are declared), Color, Theme and Fullscreen on the right, and Home, Menu, Code, Calculator and Personal annotations on the left, in that order. The document title stays between these groups.

Set `logo="/docs/medias/logos/logo-tp.svg"` to display a `tp-icon` at the start of the toolbar, at the default icon-button size (`2em`). Changing the attribute updates the logo; removing it or setting it to an empty value hides it. The logo is decorative and has no click action. Single-page documents also require the `toolbar` attribute.

### Toolbar selection

Set `toolbar="home,menu,code,theme,fullscreen"` to select the visible commands. Supported names are `home`, `menu`, `code`, `calc`, `postit`, `clock`, `lang`, `color`, `theme`, `screen` and `fullscreen`. Names are comma-separated and case-insensitive; duplicates and unknown names are ignored. Controls keep their standard order.

Unlike single-page documents, omitting `toolbar` keeps the complete multi-page toolbar for backward compatibility. An empty value also enables every command; `toolbar="none"` hides all commands. The title, logo and repository link remain available. The language selector additionally requires at least two configured languages. Changing the attribute updates visibility without reloading the current page or resetting the sidebar.

### Authoring

Use `<tp-markdown-multi-pages>` as shown below.

```html
<tp-markdown-multi-pages></tp-markdown-multi-pages>
```

### Local navigation bar

An optional `navbar` file supplies a list of links displayed directly as buttons on the right of the main toolbar, before the vertical `tp-divider` and global controls. Authored `tp-button` and `tp-icon-button` elements are preserved; ordinary links become `tp-button` elements. No menu or list wrapper is added to the toolbar. Use `navbar.md`, `navbar.adoc`, `navbar.rst` or `navbar.html`, matching the document format. Both ordered and unordered lists are accepted. A missing file or a file without a list adds no controls.

Place it at the root of `repository`, beside `sidebar` and `cover`. Internal document links use the existing page navigation and remain available on every page. Changing the repository reloads the navbar.

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
  <script type="module" src="/path/to/components/markdown-multi-pages/markdown-multi-pages.js"></script>
  ```

import
: ```js
  import "/path/to/components/markdown-multi-pages/markdown-multi-pages.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/markdown-multi-pages/markdown-multi-pages.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Navigate between the markdown documentation pages and observe dynamic page loading inside the isolated example.

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
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-calculator
@summary Scientific calculator with an editable expression and degree/radian modes.
-->
<!--
@tp-dependency tp-clock
@summary Live clock component with digital or analogic display and date tooltip.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-drawer
@summary Drawer overlay component.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-lang
@summary Documentation language selector.
-->
<!--
@tp-dependency tp-markdown
@summary Markdown rendering component.
-->
<!--
@tp-dependency tp-post-it-editor
@summary creates and edits persistent personal annotations attached to document elements.
-->
<!--
@tp-dependency tp-screen
@summary Responsive page preview in selectable device viewports.
-->
<!--
@tp-dependency tp-source
@summary Source repository link button.
-->
<!--
@tp-dependency tp-splitter
@summary Splitter component with two resizable panels.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->
<!--
@tp-dependency tp-tree
@summary Generic tree component for interactive hierarchical editing.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-calculator>`](#/components/calculator/index.md) : Scientific calculator with an editable expression and degree/radian modes.
- [`<tp-clock>`](#/components/clock/index.md) : Live clock component with digital or analogic display and date tooltip.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-drawer>`](#/components/drawer/index.md) : Drawer overlay component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-lang>`](#/components/lang/index.md) : Documentation language selector.
- [`<tp-markdown>`](#/components/markdown/index.md) : Markdown rendering component.
- [`<tp-post-it-editor>`](#/components/post-it-editor/index.md) : creates and edits persistent personal annotations attached to document elements.
- [`<tp-screen>`](#/components/screen/index.md) : Responsive page preview in selectable device viewports.
- [`<tp-source>`](#/components/source/index.md) : Source repository link button.
- [`<tp-splitter>`](#/components/splitter/index.md) : Splitter component with two resizable panels.
- [`<tp-textfield>`](#/components/textfield/index.md) : Single-line and automatically growing multiline text field.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,
- [`<tp-tree>`](#/components/tree/index.md) : Generic tree component for interactive hierarchical editing.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
