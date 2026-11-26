<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="animation" library="components" size="1.25em"></tp-icon> Animation

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-animation>` element animates a target element and provides playback controls.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-animation in="shakeX" trigger="click" autoplay duration="1200ms" iterations="3">
  <tp-box>This box shakes three times on load. Click to replay.</tp-box>
</tp-animation>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-animation" src="/docs/components/animation/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Choosing an animation

`tp-animation` uses [Animate.css](https://animate.style/). Visit its **interactive animation catalogue** to preview effects and choose their names. The stylesheet is included automatically with the component.

Pass the name directly, for example `in="bounceInLeft"` or `out="fadeOutRight"`, **without the `animate__` prefix**. `in` identifies the effect played by the trigger or `playIn()`; `out` is played by `playOut()` and does not run automatically after an entrance.

| Family | Example names | Effect |
| --- | --- | --- |
| Attention | `bounce`, `shakeX`, `pulse`, `heartBeat` | Rebound, shake or pulse |
| Fade | `fadeIn`, `fadeInLeft`, `fadeOutRight` | Change opacity, optionally with movement |
| Slide | `slideInLeft`, `slideOutRight` | Move in or out |
| Bounce | `bounceInDown`, `bounceOutUp` | Enter or leave with rebounds |
| Zoom | `zoomIn`, `zoomOut` | Change scale |
| Rotation | `rotateIn`, `rotateOut` | Rotate while appearing or disappearing |
| Flip | `flipInX`, `flipInY` | Rotate around a three-dimensional axis |
| Special | `jackInTheBox`, `rollIn`, `hinge` | Combined or unusual movements |

Set `duration="1200ms"` to control the duration, `delay="300ms"` for a delayed start, and `iterations="3"` to repeat an effect. `trigger="click"` and `trigger="hover"` make demonstrations easy to replay; `trigger="manual"` lets separate controls invoke `playIn()`, `playOut()` and `cancel()`. `pause()` freezes the current animation; `resume()` continues from the same playback time. Unlike `play()` or `restart()`, `resume()` does not start over. Setting `paused` and then removing it has the same pause/resume effect. Reduced-motion preferences display the final state immediately.

### Authoring

The animate.css stylesheet is loaded automatically with the component, including when importing it individually.

Add `autoplay` to start the entrance on load while retaining another trigger: `trigger="click" autoplay` starts automatically and lets readers click to replay.

Choose an animate.css name with `in` or `out`, then select a `load`, `click`, `hover`, `manual`, or `intersection` trigger.

```html
<tp-animation in="fadeIn" trigger="load" duration="800ms">
  <tp-box>Animated content</tp-box>
</tp-animation>
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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Watch shakeX play three times on load, with 1.2 seconds per cycle. Click the box to replay, or focus it and press Enter or Space.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Attention seekers
: Click Bounce, Shake and Pulse to compare translation and scale; Pulse repeats three times.

Directional entrances
: Click the boxes to compare slideInLeft with bounceInDown. Each click replays the chosen entrance.

Zoom and rotation
: Compare zoomIn and rotateIn by clicking the boxes; observe scale, rotation and opacity changes.

Three-dimensional flip
: Hover over or focus the box to play flipInY. Leave and return to replay the vertical-axis flip.

Entrance and exit
: Use Enter or Exit, then Pause to freeze the movement and Resume to continue from the same position. Each animation lasts three seconds; Reset restores the original visible box.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
:tp-icon:{name="file_type_html" library="languages" size="1.25em" aria-hidden="true"} HTML
: ::include{examples/examples.html}

:tp-icon:{name="file_type_asciidoc" library="languages" size="1.25em" aria-hidden="true"} tp-asciidoc
: ::include{examples/examples.adoc}

:tp-icon:{name="file_type_latex" library="languages" size="1.25em" aria-hidden="true"} tp-latex
: ::include{examples/examples-latex.html}

:tp-icon:{name="file_type_markdown" library="languages" size="1.25em" aria-hidden="true"} tp-markdown
: ::include{examples/examples.md}

:tp-icon:{name="file_type_restructuredtext" library="languages" size="1.25em" aria-hidden="true"} tp-restructuredtext
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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
