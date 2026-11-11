<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="binary" library="components" size="1.25em"></tp-icon> Binary

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-binary>` element displays an interactive Binary puzzle.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-binary>
        <ol>
          <li>1010110!0</li>
          <li>01!01!0011!</li>
          <li>0010101!1!</li>
          <li>11!01!0100</li>
          <li>10011001!</li>
          <li>0!110!1010</li>
          <li>0110!0!101</li>
          <li>10!0101!10</li>
        </ol>
      </tp-binary>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-binary" src="/docs/components/binary/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `puzzle` to an even number of rows separated by line breaks. The number of rows and columns must be identical. In HTML attributes, use `&#10;` to preserve each line break.

Digits `0` and `1` define the solution. Add `!` after a digit to display it as a fixed clue when the game starts; digits without `!` remain hidden and must be found by the player.

```html
<tp-binary
  puzzle="1010110!0&#10;01!01!0011!&#10;0010101!1!&#10;11!01!0100&#10;10011001!&#10;0!110!1010&#10;0110!0!101&#10;10!0101!10"
></tp-binary>
```

The same puzzle can also be provided as an ordered or unordered list:

```html
<tp-binary>
  <ol>
    <li>1010110!0</li>
    <li>01!01!0011!</li>
    <li>0010101!1!</li>
    <li>11!01!0100</li>
    <li>10011001!</li>
    <li>0!110!1010</li>
    <li>0110!0!101</li>
    <li>10!0101!10</li>
  </ol>
</tp-binary>
```

Click an editable square, then enter `0` or `1`. The controls let you undo or redo moves and request assistance.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/binary/binary.js"></script>
  ```

import
: ```js
  import "/path/to/components/binary/binary.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/binary/binary.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Complete the binary grid while respecting its row and column constraints.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

binary ⭐⭐
: Try the binary puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.

binary ⭐⭐⭐
: Try the binary puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.
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
@tp-dependency tp-chronometer
@summary Chronometer component with play, pause and stop controls.
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
@tp-dependency tp-dropdown
@summary Dropdown menu component.
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
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-chronometer>`](#/components/chronometer/index.md) : Chronometer component with play, pause and stop controls.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-drawer>`](#/components/drawer/index.md) : Drawer overlay component.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.

### External

<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
