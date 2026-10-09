# <tp-icon name="animation" library="components" size="1.25em"></tp-icon> Animation

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-animation>` element implements the <tp-icon name="animation" library="components" size="1.25em"></tp-icon> Animation functionality: `<tp-animation>` applique une animation à une cible du DOM léger. Le composant utilise animate.css pour les noms d'animation et WAAPI pour le contrôle de lecture.

<tp-animation in="fadeIn" trigger="load" duration="800ms">
    <tp-box>Animated content</tp-box>
  </tp-animation>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Content may animate when it appears, when you click it or when you move the pointer over it, depending on the page. |
| Using the component | There is no separate animation toolbar. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Enter / Space | Starts a click-triggered animation when its target is not a native control. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Choose an animate.css name with `in` or `out`, then select a `load`, `click`, `hover`, `manual`, or `intersection` trigger.

```html
<tp-animation in="fadeIn" trigger="load" duration="800ms">
  <tp-box>Animated content</tp-box>
</tp-animation>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Watch the content fade in when the example loads.

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
<!-- tp-docgen:api TpAnimation -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>delay</code> | <code>string</code> | <code>&quot;0s&quot;</code> | Controls the delay. |
  | <code>duration</code> | <code>string</code> | <code>&quot;1s&quot;</code> | Controls the duration. |
  | <code>easing</code> | <code>string</code> | <code>&quot;ease&quot;</code> | Controls the easing. |
  | <code>fill</code> | <code>AnimationFillMode</code> | <code>&quot;both&quot;</code> | Controls the fill. |
  | <code>in</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the in. |
  | <code>iterations</code> | <code>string</code> | <code>&quot;1&quot;</code> | Controls the iterations. |
  | <code>once</code> | <code>boolean</code> | <code>false</code> | Controls the once. |
  | <code>out</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the out. |
  | <code>paused</code> | <code>boolean</code> | <code>false</code> | Controls the paused. |
  | <code>root-margin</code> | <code>string</code> | <code>&quot;0px&quot;</code> | Marge utilisée par IntersectionObserver. |
  | <code>target</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the target. |
  | <code>threshold</code> | <code>string</code> | <code>&quot;0.1&quot;</code> | Seuil utilisé par IntersectionObserver.<br>Peut être un nombre unique ou une liste séparée par des virgules. |
  | <code>trigger</code> | <code>TpAnimationTrigger</code> | <code>&quot;load&quot;</code> | Controls the trigger. |
  [Attributes of `<tp-animation>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>cancel</code> | <code>cancel(): void</code> | Cancel. |
  | <code>pause</code> | <code>pause(): void</code> | Pause. |
  | <code>play</code> | <code>play(): Promise&lt;void&gt;</code> | Play. |
  | <code>playIn</code> | <code>playIn(): Promise&lt;void&gt;</code> | Play in. |
  | <code>playOut</code> | <code>playOut(): Promise&lt;void&gt;</code> | Play out. |
  | <code>restart</code> | <code>restart(): Promise&lt;void&gt;</code> | Restart. |
  [Public methods of `TpAnimation`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-animation-cancel</code> | <code>&#123; in: unknown; out: unknown &#125;</code> | Emitted when animation cancel occurs. |
  | <code>tp-animation-finish</code> | <code>&#123; in: unknown; out: unknown; phase: unknown &#125;</code> | Emitted when animation finish occurs. |
  | <code>tp-animation-start</code> | <code>&#123; in: unknown; out: unknown; phase: unknown &#125;</code> | Emitted when animation start occurs. |
  [Events emitted by `<tp-animation>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-animation>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_animation.TpAnimation.html)
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
  <script type="module" src="/path/to/components/animation/animation.js"></script>
  ```

import
: ```js
  import "/path/to/components/animation/animation.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/animation/animation.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-animation>` are loaded automatically by this component if they have not already been loaded by another component.

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
