# <tp-icon name="solitaire" library="components" size="1.25em"></tp-icon> Solitaire

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-solitaire>` element implements the <tp-icon name="solitaire" library="components" size="1.25em"></tp-icon> Solitaire functionality: displays a playable Klondike solitaire.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>Move all cards to the four foundations, one for each suit. With the default 52-card deck, foundations build upwards from Ace to King.</p>

<p>On the tableau, build descending sequences with alternating red and black cards. You may move a face-up card or a valid face-up sequence onto the next higher card of the opposite colour. Only a King or a sequence headed by a King can fill an empty tableau pile.</p>

<p>Draw one card at a time from the stock and use the top card of the waste. When the stock is empty, recycle the waste. Reveal face-down cards as they become exposed. Only an exposed top card can move to a foundation.</p>

<p>In the 32-card variant, the component uses the rank order 7, 8, 9, 10, Jack, Queen, King, Ace: foundations start with 7 and end with Ace, and empty tableau piles accept an Ace. The alternating-colour and consecutive-rank rules still apply.</p>

</details>

<tp-solitaire></tp-solitaire>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Select | Select a face-up card, then select its destination pile. |
| Using the component | Reveal exposed face-down cards and move cards to the foundations according to the game rules. |
| Click | Click a face-up card to select it, then click a destination tableau pile or foundation. |
| Click | Click a face-down card at the top of a tableau pile to reveal it. |
| Using the component | Double-click the top card of the waste or a tableau pile to send it directly to its foundation when the move is valid. |
| Using the component | The chronometer starts with the first action and pauses when all cards reach the foundations. |
| Using the component | The refresh button reshuffles the cards and resets the timer. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Choose `deck-size="32"` or `deck-size="52"`. The default is 52. Choose the bundled OpenDecks back with `back="blue"` or `back="red"`.

```html
<tp-solitaire deck-size="52" back="blue"></tp-solitaire>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Play the card layout using the game’s available moves and controls.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

32 cards with red back
: Play solitaire using the 32-card red-backed deck.
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
<!-- tp-docgen:api TpSolitaire -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>back</code> | <code>string</code> | <code>&quot;blue&quot;</code> | OpenDecks card back: blue or red. |
  | <code>deck-size</code> | <code>number</code> | <code>52</code> | Number of cards: 32 or 52. |
  [Attributes of `<tp-solitaire>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>reset</code> | <code>reset(): void</code> | Reshuffles and starts a new game. |
  [Public methods of `TpSolitaire`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-solitaire-move</code> | <code>void</code> | Emitted after a valid move. |
  | <code>tp-solitaire-reset</code> | <code>void</code> | Emitted after the cards are reshuffled. |
  | <code>tp-solitaire-win</code> | <code>void</code> | Emitted when the game is won. |
  [Events emitted by `<tp-solitaire>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-solitaire-card-width</code> | <code>7rem</code> | Card width. |
  | <code>&#45;&#45;tp-solitaire-gap</code> | <code>0.75rem</code> | Gap between piles. |
  [CSS properties of `<tp-solitaire>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_solitaire.TpSolitaire.html)
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
  <script type="module" src="/path/to/components/solitaire/solitaire.js"></script>
  ```

import
: ```js
  import "/path/to/components/solitaire/solitaire.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/solitaire/solitaire.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-solitaire>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-chronometer
@summary Chronometer component with play, pause and stop controls.
-->
<!--
@tp-dependency tp-dragdrop
@summary Generic drag-and-drop controller for content.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-chronometer>`](../chronometer/index.md) : Chronometer component with play, pause and stop controls.
- [`<tp-dragdrop>`](../dragdrop/index.md) : Generic drag-and-drop controller for content.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
