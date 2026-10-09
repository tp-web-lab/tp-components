# <tp-icon name="flip-card" library="components" size="1.25em"></tp-icon> Flip card

<tp-toc position="end" expand-all open brand></tp-toc>

<tp-flip-card>
<dl>
  <dt>recto</dt><dd><p>This is the content <strong>recto...</strong></p></dd>
  <dt>verso</dt><dd><p>...and here is the content <strong>verso.</strong></p></dd>
</dl>
</tp-flip-card>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Flip button | Switch between the front and back of the card. |
| Card without a flip button | Click the card itself to flip it. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Flip the focused card or activate its flip button. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Place a definition list inside `<tp-flip-card>`. The `recto` and `verso` entries are both required. Their content can contain text, images, SVG, or other `tp-*` components.

```html
<tp-flip-card>
  <dl>
    <dt>recto</dt><dd>This is the content recto...</dd>
    <dt>verso</dt><dd>...and here is the content verso.</dd>
  </dl>
</tp-flip-card>
```

The flip button is overlaid on the card. Its position combines `top` or `bottom` with `start`, `center`, or `end`. The default is `bottom end`.

```html
<tp-flip-card button-position="top start">
  <dl>
    <dt>recto</dt><dd>This is the content recto...</dd>
    <dt>verso</dt><dd>...and here is the content verso.</dd>
  </dl>
</tp-flip-card>
```

Set `button-position="none"` to hide the button. The card can then be flipped by clicking anywhere on its surface, or with Enter and Space from the keyboard.

```html
<tp-flip-card button-position="none">
  <dl>
    <dt>recto</dt><dd>This is the content recto...</dd>
    <dt>verso</dt><dd>...and here is the content verso.</dd>
  </dl>
</tp-flip-card>
```

The boolean `flipped` attribute controls the visible side. The `flip()` method and the `tp-flip-card-change` event allow game logic to control each card independently. A `tp-grid` or `tp-slider` can therefore contain a 32-card or 52-card deck for a future patience or memory game.

Add the boolean `disabled` attribute to prevent the card from being flipped by the button or by the `flip()` method.

```html
<tp-flip-card disabled>
  <dl>
    <dt>recto</dt><dd>This is the content recto...</dd>
    <dt>verso</dt><dd>...and here is the content verso.</dd>
  </dl>
</tp-flip-card>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Flip the card to inspect its front and back content.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Hearts suit
: Flip each of the thirteen hearts cards in the cluster by clicking it, or using Enter or Space when focused. Each card turns independently and the cluster wraps to fit the available width.
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
<!-- tp-docgen:api TpFlipCard -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>button-position</code> | <code>string</code> | <code>&quot;bottom end&quot;</code> | Position of the overlaid flip button, or none to hide it. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Prevents the card from being flipped. |
  | <code>fit-content</code> | <code>boolean</code> | <code>false</code> | Adapts the card dimensions to its verso content. |
  | <code>flipped</code> | <code>boolean</code> | <code>false</code> | Shows the verso when present. |
  [Attributes of `<tp-flip-card>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>flip</code> | <code>flip(): boolean</code> | Flips the card and returns its new state. |
  [Public methods of `TpFlipCard`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-flip-card-change</code> | <code>&#123; flipped: unknown &#125;</code> | Emitted after the visible side changes. |
  [Events emitted by `<tp-flip-card>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-flip-card-aspect-ratio</code> | <code>5 / 7</code> | Card aspect ratio. |
  | <code>&#45;&#45;tp-flip-card-background</code> | <code>var(&#45;&#45;tp-paper-color, #fff)</code> | Card face background. |
  | <code>&#45;&#45;tp-flip-card-border-color</code> | <code>var(&#45;&#45;tp-neutral-stroke-soft, #d6d9df)</code> | Card border color. |
  | <code>&#45;&#45;tp-flip-card-border-radius</code> | <code>var(&#45;&#45;tp-border-radius-lg, 0.5625rem)</code> | Card border radius. |
  | <code>&#45;&#45;tp-flip-card-button-offset</code> | <code>0.5rem</code> | Distance between the button and the card edge. |
  | <code>&#45;&#45;tp-flip-card-padding</code> | <code>1rem</code> | Card face padding. |
  | <code>&#45;&#45;tp-flip-card-width</code> | <code>12rem</code> | Card width. |
  [CSS properties of `<tp-flip-card>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_flip-card.TpFlipCard.html)
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
  <script type="module" src="/path/to/components/flip-card/flip-card.js"></script>
  ```

import
: ```js
  import "/path/to/components/flip-card/flip-card.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/flip-card/flip-card.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-flip-card>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
