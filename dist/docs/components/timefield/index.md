<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="timefield" library="components" size="1.25em"></tp-icon> Time field

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-timefield>` element collects a time within optional limits.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-timefield label="Time" value="14:30" clearable=""></tp-timefield>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-timefield" src="/docs/components/timefield/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

All fields use the same inline convention: `:tp-timefield:\`identifier\`{value="14:30" placeholder="…"}`. The inline content initializes `name` only; it never sets `id`, `label` or `value`. An explicit `name` takes precedence. Use `value` for initial content and `placeholder` for a hint; omitting `value` keeps the component's normal default. The HTML equivalent is `<tp-timefield name="identifier" value="14:30" placeholder="…"></tp-timefield>`.

Native date and time controls may ignore `placeholder` and show their browser-provided date/time hint instead.

Use `value`, `min`, and `max` with the native `HH:mm` or `HH:mm:ss` format. The browser displays and edits the time according to the user's locale. `step` expresses an interval in seconds and defaults to 60.

Set `label` to associate a visible label with the time input. `label-position` accepts `top`, `bottom`, `start`, and `end`. Add `clearable` to let the user remove the selected time. A required field displays a colored `*` after its label, or inside the start corner of the control when no label is present. Native form validation remains active in both cases.

### Events and programmatic interactions

| Interaction | Result |
| --- | --- |
| Select or type a time | Updates `value` and emits `input`. |
| Commit the time | Emits `change`. |
| Select the clock button | Opens the browser's native time picker. |
| Select the clear button | Clears `value` and emits `input`, `change`, and `tp-clear`. |

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/timefield/timefield.js"></script>
  ```

import
: ```js
  import "/path/to/components/timefield/timefield.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/timefield/timefield.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Enter or choose a time using the field and its time controls.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Inline named field
: Edit the inline field. Its role content supplies the form name, while value supplies the initial data; inspect the source to compare the shared convention across markup languages.
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
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
