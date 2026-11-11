<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="word-cloud" library="components" size="1.25em"></tp-icon> Word cloud

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-word-cloud>` element generates a responsive SVG word cloud inside a chosen silhouette.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-word-cloud shape="circle" color="glaz" bg-color="glaz" scale="1" rotate="0">
  <ol>
    <li><tp-icon name="logo-tp" aria-label="tp logo"></tp-icon></li>
    <li></li>
    <li>quizzes, playgrounds, viewers, notebooks</li>
    <li>simulators, plots, games</li>
    <li></li>
    <li>documentations, editors, pickers, controllers, feedbacks</li>
    <li>markdown, asciidoc, latex, restructuredtext</li>
    <li>forms, overlays, medias, times</li>
    <li></li>
    <li>utilities</li>
  </ol>
</tp-word-cloud>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-word-cloud" src="/docs/components/word-cloud/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Ranked words

Supply an ordered list directly inside the component. Separate words or phrases with commas. All words in the same item share one size; subsequent items have progressively smaller sizes. Empty comma-separated entries produce no words. Empty list items still count as size ranks: insert an empty item before a group to make that group and all following groups smaller; remove it to make them larger. A blank source line alone is not an item: use `<li></li>` in HTML or an empty list marker in native markup. Changing the list or any attribute redraws the cloud automatically.

### Icons

Place a `tp-icon` inside a list item to use it as a cloud item, for example `<li><tp-icon name="logo-tp" aria-label="tp logo"></tp-icon>, quizzes, viewers</li>`. Each icon is independent of neighboring words and uses its group's size and the cloud rotation. Empty items still consume a size rank. Supply an accessible label for meaningful icons.

Icons reuse `tp-icon` inside an SVG `foreignObject`, including its asynchronous source loading and fallback. The cloud controls their size and rotation; icon `size`, `scale`, `rotate` and `spin` settings are not used. Explicit icon colors are preserved; otherwise icons inherit the word palette. Export consumers must support SVG `foreignObject` and custom elements.

### Appearance

- `shape`: `circle` (default), `triangle`, `square`, `pentagon`, `hexagon`, `cloud`, `heart` or `puzzle`. Only English names are supported.
- `color`: a built-in brand palette such as `teal`, `blue` or `purple`; default: `glaz` (the default brand). Words alternate among palette levels 500, 600, 700 and 800.
- `bg-color`: a built-in brand palette for the shape background, independently of the words. Uses palette level 100. Default: `glaz` (the default brand). Omitted or invalid values use `glaz`; an explicit `bg-color=""` leaves the background transparent.
- `scale`: positive font-size multiplier (default 1, range 0.1–4). Dense clouds shrink all words together until they fit, preserving size ratios.
- `rotate`: rotation in degrees (default 0, range −90–90). Words alternate between horizontal, positive and negative rotation.

Invalid values use their defaults; finite numeric values are clamped to the documented ranges. The silhouette constrains the complete bounds of each word and icon, including the concave edges of the cloud, heart and puzzle piece. Placement is deterministic and avoids overlaps. Short lists may not fill the silhouette. The SVG adapts to the available width. The original list remains available to screen readers. Above 500 words, or if placement cannot complete, the original list is displayed instead.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/word-cloud/word-cloud.js"></script>
  ```

import
: ```js
  import "/path/to/components/word-cloud/word-cloud.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/word-cloud/word-cloud.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Compare the tp logo with the ranked word groups inside the circular silhouette. Empty list items create additional size steps between groups.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-latex
: ::include{examples/examples-latex.html}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
