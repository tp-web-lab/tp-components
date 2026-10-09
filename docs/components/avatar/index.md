# <tp-icon name="avatar" library="components" size="1.25em"></tp-icon> Avatar

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-avatar>` element implements the Avatar functionality: displays an image, initials or an icon in a circle or square.

<tp-cluster>
  <tp-avatar src="/tp-components/docs/medias/logos/logo-tp.svg" label="tp-components"></tp-avatar>
  <tp-avatar initials="AL" label="Ada Lovelace"></tp-avatar>
  <tp-avatar icon="user" shape="square" label="Guest"></tp-avatar>
</tp-cluster>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | An avatar identifies a person or entity. It is a static image, not a button: it has no mouse or keyboard action. Its accessible label is announced by screen readers when provided. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Set `src` for an image, `initials` for text, or `icon` and `library` for a `tp-icon`. The priority is image, initials, then icon. A failed image automatically falls back to initials or the icon (default: `user` from the `tp` library). Changing `src` retries image loading.

Use `shape="circle"` (default) or `shape="square"`. The shared sizes `xxs`, `xs`, `s`, `m` (default), `l`, `xl` and `xxl` occupy 1, 1.5, 2, 3, 4, 5 and 6 rem respectively. Icons occupy approximately 83% of the avatar width and height. Images fill the shape with `object-fit: cover`; use short initials, usually one or two letters. All attributes update the display dynamically.

`src` accepts an image URL, for example `src="/images/portrait.jpg"`; its default is an empty string (no image). The Attributes example restricts this setting to two reviewed local images and a deliberately missing image. These are demonstration choices, not special values understood by the component. Select “Missing image (test fallback)” to see the initials, or the icon when no initials are provided.

Provide `label` with the full name when the avatar conveys identity. Omit it when adjacent text already identifies the person: the avatar is then decorative. Initials are treated as plain text, not HTML. Content is configured through attributes; child nodes are reserved for the generated rendering.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Compare an image, initials and a fallback icon, displayed in circular and square avatars.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API

<!-- tp-docgen:api TpAvatar -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>icon</code> | <code>string</code> | <code>&quot;user&quot;</code> | Fallback tp-icon name. |
  | <code>initials</code> | <code>string</code> | <code>&quot;&quot;</code> | Initials displayed when no image is available. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Accessible name; without a label the avatar is decorative. |
  | <code>library</code> | <code>string</code> | <code>&quot;tp&quot;</code> | Icon library. |
  | <code>shape</code> | <code>TpAvatarShape</code> | <code>&quot;circle&quot;</code> | Avatar shape (`circle` or `square`). |
  | <code>size</code> | <code>TpSizeType</code> | <code>&quot;m&quot;</code> | Avatar size (`xxs`, `xs`, `s`, `m`, `l`, `xl`, or `xxl`). |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Image URL; falls back to initials or an icon if loading fails. |
  [Attributes of `<tp-avatar>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpAvatar`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-avatar>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-avatar>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_avatar.TpAvatar.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-avatar>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
