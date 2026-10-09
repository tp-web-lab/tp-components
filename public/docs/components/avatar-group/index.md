# <tp-icon name="avatar-group" library="components" size="1.25em"></tp-icon> Avatar group

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-avatar-group>` element implements the Avatar group functionality: groups tp-avatar elements with configurable overlap, stacking order and orientation.

<tp-avatar-group>
  <tp-avatar initials="AL" label="Ada Lovelace"></tp-avatar>
  <tp-avatar initials="GH" label="Grace Hopper"></tp-avatar>
  <tp-avatar initials="KT" label="Katherine Johnson"></tp-avatar>
</tp-avatar-group>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | Read the people represented by the avatars. The group is static and has no mouse or keyboard controls. Overlap changes only their visual presentation: screen readers encounter each labelled avatar in its original reading order. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Place `tp-avatar` elements directly inside the group. Each avatar keeps its own image, initials, icon, label, shape and size. The group preserves the original nodes and automatically updates when avatars are added, removed or reordered.

- `offset` is the amount of overlap, not the distance between centers. Its default is `0.75rem`; `0` places avatars side by side. Supply a nonnegative CSS length such as `8px` or `0.5rem`. Percentages, negative values and CSS expressions are not accepted and fall back to the default. Keep the overlap smaller than the avatars to leave them readable.
- `order="ltr"` (default) places each later avatar in front of the preceding one. `order="rtl"` places earlier avatars in front. This controls stacking only, never DOM order.
- `orientation="horizontal"` (default) arranges avatars in a row; `vertical` arranges them from top to bottom, with the same stacking rule.

In a right-to-left document, the horizontal row follows the inherited text direction. The `order` attribute still describes stacking relative to author order, independently of text direction. The group does not wrap.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Compare three overlapping avatars. Later avatars cover earlier ones while names remain in their original reading order.

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

<!-- tp-docgen:api TpAvatarGroup -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>offset</code> | <code>string</code> | <code>&quot;0.75rem&quot;</code> | Overlap between adjacent avatars as a nonnegative CSS length; zero disables overlap. |
  | <code>order</code> | <code>TpAvatarGroupOrder</code> | <code>&quot;ltr&quot;</code> | Stacking order: ltr places later avatars in front; rtl places earlier avatars in front. |
  | <code>orientation</code> | <code>TpAvatarGroupOrientation</code> | <code>&quot;horizontal&quot;</code> | Layout axis (horizontal or vertical). |
  [Attributes of `<tp-avatar-group>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpAvatarGroup`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-avatar-group>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-avatar-group-index</code> |  | Controls the index. |
  | <code>&#45;&#45;tp-avatar-group-overlap</code> | <code>0.75rem</code> | Controls the overlap. |
  [CSS properties of `<tp-avatar-group>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_avatar-group.TpAvatarGroup.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-avatar-group>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-avatar
@summary Visual identity using an image, initials or an icon.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-avatar>`](../avatar/index.md) : Visual identity using an image, initials or an icon.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
