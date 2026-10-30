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
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Starts a click-triggered animation when its target is not a native control. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

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
  | <code>delay</code> | <code>string</code> | <code>&quot;0s&quot;</code> | Wait before each animation, with an explicit time unit such as 200ms or 0.5s. |
  | <code>duration</code> | <code>string</code> | <code>&quot;1s&quot;</code> | Duration of one animation cycle, with an explicit time unit such as 500ms or 2s. |
  | <code>easing</code> | <code>string</code> | <code>&quot;ease&quot;</code> | CSS timing function controlling the animation pace, for example linear, ease-in-out or cubic-bezier(0.4, 0, 0.2, 1). |
  | <code>fill</code> | <code>AnimationFillMode</code> | <code>&quot;both&quot;</code> | Styles retained outside playback: none, forwards (after), backwards (during the delay), or both. |
  | <code>in</code> | <code>string</code> | <code>&quot;&quot;</code> | Animate.css entrance animation name, such as fadeIn; empty means no entrance animation. |
  | <code>iterations</code> | <code>string</code> | <code>&quot;1&quot;</code> | Positive number of playback cycles, or infinite for continuous repetition. Invalid values use one cycle. |
  | <code>once</code> | <code>boolean</code> | <code>false</code> | Limits automatic click, hover/focus and intersection triggers to their first playback. |
  | <code>out</code> | <code>string</code> | <code>&quot;&quot;</code> | Animate.css exit animation name used by playOut(), such as fadeOut; empty means no exit animation. |
  | <code>paused</code> | <code>boolean</code> | <code>false</code> | Pauses playback when present; removing it allows the animation to resume. |
  | <code>root-margin</code> | <code>string</code> | <code>&quot;0px&quot;</code> | Viewport margin for the intersection trigger, using CSS margin syntax such as 100px or 0px 0px -20% 0px. |
  | <code>target</code> | <code>string</code> | <code>&quot;&quot;</code> | CSS selector of a descendant to animate. When absent, the first child element is used. |
  | <code>threshold</code> | <code>string</code> | <code>&quot;0.1&quot;</code> | Visibility thresholds for the intersection trigger: one number from 0 to 1, or a comma-separated list. Invalid entries are ignored; the fallback is 0.1. |
  | <code>trigger</code> | <code>TpAnimationTrigger</code> | <code>&quot;load&quot;</code> | Playback trigger: load, click, hover (also keyboard focus), intersection (entering the viewport), or manual (playIn()/playOut()). |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-animation>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>cancel</code> | <code>cancel(): void</code> | Cancels the current animation, clears its playback reference and emits tp-animation-cancel when an animation existed. |
  | <code>pause</code> | <code>pause(): void</code> | Pauses the current animation at its current time; does nothing when no animation exists. |
  | <code>play</code> | <code>play(): Promise&lt;void&gt;</code> | Starts the entrance animation from the beginning, like playIn(); resolves when playback finishes or is cancelled. |
  | <code>playIn</code> | <code>playIn(): Promise&lt;void&gt;</code> | Cancels the current animation and plays the configured in animation. Resolves on completion or cancellation; does nothing if the target or animation name is missing. |
  | <code>playOut</code> | <code>playOut(): Promise&lt;void&gt;</code> | Cancels the current animation and plays the configured out animation. Resolves on completion or cancellation; does nothing if the target or animation name is missing. |
  | <code>restart</code> | <code>restart(): Promise&lt;void&gt;</code> | Starts the configured entrance animation again from the beginning; returns the same completion promise as playIn(). |
  [Public methods of `TpAnimation`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-animation-cancel</code> | <code>&#123; in: string; out: string &#125;</code> | Emitted when cancel() cancels an existing animation, including cancellation before starting another phase. The detail contains the configured entrance and exit animation names. |
  | <code>tp-animation-finish</code> | <code>&#123; in: string; out: string; phase: &quot;in&quot; \| &quot;out&quot; &#125;</code> | Emitted after an entrance or exit animation finishes normally; cancellation does not emit finish. The detail identifies the configured animation names and the phase. |
  | <code>tp-animation-start</code> | <code>&#123; in: string; out: string; phase: &quot;in&quot; \| &quot;out&quot; &#125;</code> | Emitted when an entrance or exit animation starts, including when immediately paused. The detail identifies the configured animation names and the phase. |
  [Events emitted by `<tp-animation>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-animation>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_animation.TpAnimation.html)
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
