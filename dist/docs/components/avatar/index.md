<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="avatar" library="components" size="1.25em"></tp-icon> Avatar

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-avatar>` element displays an image, initials or an icon in a circle or square.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-cluster>
  <tp-avatar src="/docs/medias/logos/logo-tp.svg" label="tp-components"></tp-avatar>
  <tp-avatar initials="AL" label="Ada Lovelace"></tp-avatar>
  <tp-avatar icon="user" shape="square" label="Guest"></tp-avatar>
</tp-cluster>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-avatar" src="/docs/components/avatar/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Set `src` for an image, `initials` for text, or `icon` and `library` for a `tp-icon`. The priority is image, initials, then icon. A failed image automatically falls back to initials or the icon (default: `user` from the `tp` library). Changing `src` retries image loading.

Use `shape="circle"` (default) or `shape="square"`. The shared sizes `xxs`, `xs`, `s`, `m` (default), `l`, `xl` and `xxl` occupy 1, 1.5, 2, 3, 4, 5 and 6 rem respectively. Icons occupy approximately 83% of the avatar width and height. Images fill the shape with `object-fit: cover`; use short initials, usually one or two letters. All attributes update the display dynamically.

`src` accepts an image URL, for example `src="/images/portrait.jpg"`; its default is an empty string (no image). The Attributes example restricts this setting to two reviewed local images and a deliberately missing image. These are demonstration choices, not special values understood by the component. Select “Missing image (test fallback)” to see the initials, or the icon when no initials are provided.

Provide `label` with the full name when the avatar conveys identity. Omit it when adjacent text already identifies the person: the avatar is then decorative. Initials are treated as plain text, not HTML. Content is configured through attributes; child nodes are reserved for the generated rendering.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/avatar/avatar.js"></script>
  ```

import
: ```js
  import "/path/to/components/avatar/avatar.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/avatar/avatar.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Compare an image, initials and a fallback icon, displayed in circular and square avatars.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Initials fallback
: Inspect the initials displayed when no portrait is supplied.
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
