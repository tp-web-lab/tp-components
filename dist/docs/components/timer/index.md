<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="timer" library="components" size="1.25em"></tp-icon> Timer

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-timer>` element counts down a duration and signals when it expires.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-timer></tp-timer>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-timer" src="/docs/components/timer/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

The timer starts with the theme’s green `success` background. As time elapses, the red `danger` color fills it from left to right while the green portion shrinks. At zero, the background is fully red. Stop or reset restores green; the numerical countdown remains visible throughout. This also applies to timers embedded in questions and exercises.

### Authoring

By default, the countdown starts when connected. Add `manual` to wait for the Start timer button or the public `start()` method. `reset()` stops the countdown and restores the configured duration.

Add `no-controls` to hide the duration input and buttons and display `hh:mm:ss`; this display has no direct mouse or keyboard interaction. Combine `manual no-controls silent` when another component controls the countdown, as in timed questions. The `tp-timer-elapsed` event fires when the countdown reaches zero.

Use `<tp-timer>` as shown below.

```html
<tp-timer></tp-timer>
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
  <script type="module" src="/path/to/components/timer/timer.js"></script>
  ```

import
: ```js
  import "/path/to/components/timer/timer.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/timer/timer.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Use the timer controls and observe the countdown.

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
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
