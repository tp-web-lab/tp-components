# <tp-icon name="memory" library="components" size="1.25em"></tp-icon> Memory

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-memory>` element implements the <tp-icon name="memory" library="components" size="1.25em"></tp-icon> Memory functionality: creates a memory matching game.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>The cards are placed face down in matching pairs. Reveal two different cards on each turn.</p>

<p>If their contents match, the pair stays revealed. Otherwise, the cards turn face down again after a short delay.</p>

<p>Remember the positions and find every pair to complete the game.</p>

</details>

<tp-memory label="Match the fruits">
  <ol><li>Apple</li><li>Pear</li><li>Plum</li></ol>
</tp-memory>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Reveal two cards and try to find matching pairs. |
| Using the component | Unmatched cards turn back over; matched pairs remain revealed. |
| Using the component | Reset starts a new game. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Provide one `<li>` for each distinct pair. The list may be an `<ol>` or a `<ul>` and each item can contain text, images, SVG, or other `tp-*` components. With `n` items, `<tp-memory>` creates `2 × n` flip cards.

Memory cards use `button-position="none"`: click directly on a card to turn it over.

```html
<tp-memory>
  <ol>
    <li><img src="/tp-components/components/card/cards/hearts/hk.svg" alt="King of hearts"></li>
    <li><img src="/tp-components/components/card/cards/spades/sq.svg" alt="Queen of spades"></li>
    <li><img src="/tp-components/components/card/cards/clubs/ca.svg" alt="Ace of clubs"></li>
  </ol>
</tp-memory>
```

Cards adapt their width and height to their content. Images and SVGs retain their proportions and are limited to `--tp-memory-card-max-width`.

The default card back is the blue OpenDecks SVG. Use `back="blue"` or `back="red"` for the two bundled playing-card backs, or provide an image URL such as a `logo-tp-*` SVG. Use `mismatch-delay` to change the 1000 ms delay.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Reveal cards and find matching pairs, remembering their positions.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Numbers 0 to 9
: Find pairs of matching number cards.

European Union flags
: Find matching pairs of flag images.
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
<!-- tp-docgen:api TpMemory -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>back</code> | <code>string</code> | <code>&quot;&quot;</code> | Card-back URL, or blue/red for an OpenDecks back. |
  | <code>mismatch-delay</code> | <code>number</code> | <code>1000</code> | Delay before unmatched cards turn back, in milliseconds. |
  [Attributes of `<tp-memory>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>reset</code> | <code>reset(): void</code> | Resets the timer, hides and reshuffles every card. |
  [Public methods of `TpMemory`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-memory-complete</code> | <code>void</code> | Emitted when every pair is matched. |
  | <code>tp-memory-match</code> | <code>&#123; pair: unknown &#125;</code> | Emitted when a pair is matched. |
  | <code>tp-memory-reset</code> | <code>void</code> | Emitted after the game is reset. |
  [Events emitted by `<tp-memory>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-memory-card-max-width</code> | <code>10rem</code> | Maximum width of image and SVG cards. |
  | <code>&#45;&#45;tp-memory-gap</code> | <code>0.75rem</code> | Gap between cards. |
  [CSS properties of `<tp-memory>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_memory.TpMemory.html)
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
  <script type="module" src="/path/to/components/memory/memory.js"></script>
  ```

import
: ```js
  import "/path/to/components/memory/memory.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/memory/memory.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-memory>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-chronometer
@summary Chronometer component with play, pause and stop controls.
-->
<!--
@tp-dependency tp-flip-card
@summary Two-sided card component.
-->
<!--
@tp-dependency tp-switcher
@summary Switches between horizontal and vertical layouts based on available space.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-chronometer>`](../chronometer/index.md) : Chronometer component with play, pause and stop controls.
- [`<tp-flip-card>`](../flip-card/index.md) : Two-sided card component.
- [`<tp-switcher>`](../switcher/index.md) : Switches between horizontal and vertical layouts based on available space.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
