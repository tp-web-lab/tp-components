<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="control" library="components" size="1.25em"></tp-icon> Control

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-control>` element selects which interface controllers appear in a compact toolbar.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-box data-tp-color-scope="">
  <tp-control value="color,theme"></tp-control>
  <p>Change the color or theme of this box. The inline code <code>hello(world)</code> uses the selected brand color.</p>
</tp-box>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-control" src="/docs/components/control/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Add `data-tp-color-scope` to a surrounding `tp-box` to keep color changes local. The introductory example uses this explicit scope; its theme also applies only to the box.

Use `value` to set the initially visible controllers, separated by commas: `clock`, `lang`, `dir`, `color`, `theme`, `screen` and `fullscreen`. An empty value initially hides them all. The menu always offers every controller; `tp-control` itself is excluded.

The toolbar appears to the left of the Controllers button, in this order: Clock, Language, Direction, Color, Theme, Screen, Fullscreen. Hiding a controller preserves its current setting. The color controller shares the nearest existing brand scope, so it follows changes to the page palette; without an existing scope it controls the surrounding content. Direction, theme and fullscreen retain their usual scope through the toolbar and `tp-control` container. Language and screen retain their usual document behavior.

Set `langs` and `repository` to configure the embedded language controller. `langs` defaults to `en`.

Listen to `tp-control-change` for reader selections; `event.detail` contains the comma-separated `value` and the `controllers` array. Updating `value` from JavaScript also updates the toolbar and menu.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/control/control.js"></script>
  ```

import
: ```js
  import "/path/to/components/control/control.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/control/control.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Change Color or Theme and observe the inline code and background inside the box. Open Controllers to show or hide the available controls; the surrounding page keeps its colors.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

All controllers
: All seven entries start visible. Uncheck All controllers to hide them, then select individual entries.

Initially hidden
: Only the Controllers button is initially visible. Open it and select the controllers you want to display.
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
@tp-dependency tp-checkbox-list
@summary Transforms a list into a group of checkboxes.
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
@tp-dependency tp-dir
@summary Reading-direction controller (`ltr`/`rtl`/`auto`) with embedded UI.
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
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
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
@tp-dependency tp-screen
@summary Responsive page preview in selectable device viewports.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->
<!--
@tp-dependency tp-toolbar
@summary Sticky toolbar with start / center / end sections,
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-checkbox-list>`](#/components/checkbox-list/index.md) : Transforms a list into a group of checkboxes.
- [`<tp-clock>`](#/components/clock/index.md) : Live clock component with digital or analogic display and date tooltip.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-dir>`](#/components/dir/index.md) : Reading-direction controller (`ltr`/`rtl`/`auto`) with embedded UI.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-lang>`](#/components/lang/index.md) : Documentation language selector.
- [`<tp-screen>`](#/components/screen/index.md) : Responsive page preview in selectable device viewports.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.
- [`<tp-toolbar>`](#/components/toolbar/index.md) : Sticky toolbar with start / center / end sections,

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
