# <tp-icon name="icon" library="components" size="1.25em"></tp-icon> Icons

<tp-toc position="end" expand-all open brand></tp-toc>

Displays SVG icons from inline markup, a URL or an icon library, with sizing, color, transforms and fallbacks.

<tp-icon name="heart" size="3rem" aria-label="Heart"></tp-icon>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | This component displays information and has no control to operate. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Component itself | No dedicated keyboard action. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Author directives

Choose an icon with `name` and `library`, or load an SVG with `src`. Source priority is: inline SVG, `src`, `name`, `fallback-icon`, then `fallback` text.

```html
<tp-icon name="heart" size="3rem" aria-label="Heart"></tp-icon>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the icon loaded from the configured icon library.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

### API
<!-- tp-docgen:api TpIcon -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>color</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS color applied to the SVG and its colorizable fills and strokes, for example red, #2563eb or var(--brand-color). Empty inherits the surrounding text color; explicit fixed SVG colors are preserved. |
  | <code>fallback</code> | <code>string</code> | <code>&quot;&quot;</code> | Plain text displayed only when no SVG can be resolved, including fallback-icon. For example, use ? for an unavailable icon. Empty leaves the reserved icon area blank. |
  | <code>fallback-icon</code> | <code>string</code> | <code>&quot;&quot;</code> | Backup icon identifier used when inline SVG, src and name provide no icon. Looked up in the selected library, then in tp; if unavailable, fallback text is used. |
  | <code>flip-h</code> | <code>boolean</code> | <code>false</code> | Mirrors the icon horizontally when present. Remove the attribute to restore its orientation; writing false still enables it. |
  | <code>flip-v</code> | <code>boolean</code> | <code>false</code> | Mirrors the icon vertically when present. Can be combined with flip-h and rotate; writing false still enables it. |
  | <code>library</code> | <code>string</code> | <code>tp</code> | Registry containing name and the first fallback-icon lookup. Built-in libraries: tp, languages, flags, numbers, letters and components. Custom registered libraries are also accepted. |
  | <code>name</code> | <code>string</code> | <code>&quot;&quot;</code> | Icon identifier in the selected library, for example heart or settings. Used when no inline SVG or successfully loaded src is available. |
  | <code>rotate</code> | <code>string</code> | <code>0deg</code> | Rotation angle: a number is interpreted in degrees; deg, rad and turn units are also accepted. Negative values rotate in the opposite direction. Invalid values use 0deg; spin overrides this fixed rotation. |
  | <code>scale</code> | <code>number</code> | <code>1</code> | Positive numeric multiplier for size, for example 0.5 to halve it or 2 to double it. Zero, negative and invalid values use 1. Changes the space occupied by the icon. |
  | <code>size</code> | <code>string</code> | <code>1em</code> | Base width and height as a CSS length, for example 24px, 2rem or 1.5em. The scale factor multiplies both dimensions; 1em follows the surrounding font size. |
  | <code>spin</code> | <code>boolean</code> | <code>false</code> | Continuously rotates the SVG once per second when present, overriding rotate. Respects the reduced-motion preference. Remove the attribute to stop; writing false still enables it. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of an SVG file to load. Relative URLs resolve against the containing source document when available, otherwise the page URL. Inline SVG takes precedence; a failed load falls back to name, then the fallback settings. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-icon>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpIcon`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-icon>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-icon-size</code> | <code>1em</code> | Width and height of the rendered icon; assigned internally from size multiplied by scale. |
  [CSS properties of `<tp-icon>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_icon.TpIcon.html)
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
  <script type="module" src="/path/to/components/icon/icon.js"></script>
  ```

import
: ```js
  import "/path/to/components/icon/icon.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/icon/icon.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-icon>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
