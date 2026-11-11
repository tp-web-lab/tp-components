<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="avatar-group" library="components" size="1.25em"></tp-icon> Avatar group

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-avatar-group>` element groups avatars into a compact visual collection.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-avatar-group>
  <tp-avatar initials="AL" label="Ada Lovelace"></tp-avatar>
  <tp-avatar initials="GH" label="Grace Hopper"></tp-avatar>
  <tp-avatar initials="KT" label="Katherine Johnson"></tp-avatar>
</tp-avatar-group>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-avatar-group" src="/docs/components/avatar-group/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Place `tp-avatar` elements directly inside the group. Each avatar keeps its own image, initials, icon, label, shape and size. The group preserves the original nodes and automatically updates when avatars are added, removed or reordered.

- `offset` is the amount of overlap, not the distance between centers. Its default is `0.75rem`; `0` places avatars side by side. Supply a nonnegative CSS length such as `8px` or `0.5rem`. Percentages, negative values and CSS expressions are not accepted and fall back to the default. Keep the overlap smaller than the avatars to leave them readable.
- `order="ltr"` (default) places each later avatar in front of the preceding one. `order="rtl"` places earlier avatars in front. This controls stacking only, never DOM order.
- `orientation="horizontal"` (default) arranges avatars in a row; `vertical` arranges them from top to bottom, with the same stacking rule.

In a right-to-left document, the horizontal row follows the inherited text direction. The `order` attribute still describes stacking relative to author order, independently of text direction. The group does not wrap.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/avatar-group/avatar-group.js"></script>
  ```

import
: ```js
  import "/path/to/components/avatar-group/avatar-group.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/avatar-group/avatar-group.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Compare three overlapping avatars. Later avatars cover earlier ones while names remain in their original reading order.

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
@tp-dependency tp-avatar
@summary Visual identity using an image, initials or an icon.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-avatar>`](#/components/avatar/index.md) : Visual identity using an image, initials or an icon.
- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
