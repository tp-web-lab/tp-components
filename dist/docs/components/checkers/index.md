<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="checkers" library="components" size="1.25em"></tp-icon> Checkers

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-checkers>` element displays international draughts positions and plays out endgames.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-checkers position="W:W32,34,K46:B17,19,K5" draggable-pieces=""></tp-checkers>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-checkers" src="/docs/components/checkers/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### International draughts

The component uses a 10 × 10 board with twenty men per side in its starting position. White moves first. The fifty playable dark squares are numbered 1–50 from Black's back row to White's back row; their numbers do not change when the board is flipped.

Men move one diagonal square forward and capture in either direction. Kings move and capture over any distance along a diagonal. Captures are compulsory: only complete sequences taking the greatest number of opposing pieces are legal, with no preference for capturing a king. Captured pieces remain obstacles until the whole sequence ends. A man becomes a king only when it finishes its turn on the last row.

A side loses when it has no pieces or no legal move. The component automatically stops on threefold repetition, twenty-five consecutive king-only moves by each side without a capture, or the limited-material endgame limits: five moves per side for one or two pieces including a king against a lone king, and sixteen for three pieces including a king against a lone king. A win on the final allowed move takes precedence. These rules follow the [FMJD international draughts rules](https://www.fmjd.org/docs/Annex_1.pdf).

### Positions and draughts FEN

`position` and `fen` accept draughts FEN, for example `W:W32,34,K46:B17,19,K5`. The first letter is the side to move; the next two fields list White and Black pieces. Prefix kings with `K`. Increasing ranges such as `31-50` are accepted. The default is `W:W31-50:B1-20`. This is draughts notation, rather than the six-field FEN used by chess.

On initial connection, `fen` takes precedence over `position`. Afterwards, changing either loads a new position. Both attributes reflect the current canonical FEN after a move. Loading starts a new history at move one and resets repetition and endgame counters: these are not encoded in FEN. Validation checks square numbers, duplicate occupancy, piece counts and promotion rows; it does not establish whether a position can arise in a historical game. Invalid input emits `tp-checkers-error` and preserves the board.

`setPosition({ "32": "wM", "5": "bK" })` accepts a numbered piece map. Codes are `wM`, `wK`, `bM` and `bK`: white/black man/king. Object input starts with White to move. An empty map or `clear()` creates a non-playable empty board.

### Orientation and human input

`orientation="white"` (default) puts White at the bottom; `orientation="black"` puts Black at the bottom. Flipping does not change the side to move.

`draggable-pieces` is a boolean attribute, absent by default. It enables mouse, touch and keyboard moves; its JavaScript property is `draggablePieces`. HTML also accepts the normalized alias `draggablepieces`. Omit the attribute to lock human moves; setting it to `"false"` still enables it. API moves remain available when human input is locked.

A move includes the entire capture sequence. Highlights show its final destination. If several legal routes share that destination, a route chooser lets the player select the intermediate landings. Promotion is automatic.

### JavaScript API

Import the component before calling its methods. Square arguments accept numbers or strings from 1 to 50, independently of orientation.

| Method | Result |
| --- | --- |
| `start()` | Loads the standard forty-piece starting position. |
| `setPosition(fenOrObject)` | Loads an exercise, stops playback and resets history; returns a boolean. |
| `move(begin, end, path?)` | Plays one complete legal turn; returns a boolean. Ambiguous endpoints require a full path including the origin. |
| `legalMove(begin, end, path?)` | Tests a complete move without playing it. |
| `legalMoves(square?)` | Returns independent move descriptions, including full paths and captured pieces; optionally filters by origin. |
| `highlightLegalMove(square?)` | Highlights and returns final destinations; omit the argument to clear highlights. |
| `flip()` | Reverses the viewing orientation. |
| `clear()` | Empties the board and stops playback. |
| `reset()` | Restores the loaded exercise and clears recorded moves. |
| `play(mode = "user/random", userSide = "white", delay = 2000)` | Starts human versus random or `random/random` play; delay is 100–60000 milliseconds. Returns a boolean. |
| `stop()` / `pause()` | Stops playback without discarding the position or recorded moves. |
| `rewind()` | Returns to the exercise's beginning, preserving recorded moves for replay. |
| `previousMove()` | Takes back one complete turn, restoring captured pieces and counters; returns a boolean. |
| `nextMove()` | Replays one recorded turn, or chooses a random legal turn when no recording remains; returns a boolean. |
| `playToEnd()` | Replays recorded turns, then continues randomly until the game ends or playback is paused. |

~~~js
import "/components/checkers/checkers.js";

const checkers = document.createElement("tp-checkers");
checkers.setPosition("W:W32:B17,27");
document.body.append(checkers);
checkers.highlightLegalMove(32);
checkers.move(32, 12, [32, 21, 12]);
checkers.previousMove();
~~~

### Playback and history

`user/random` enables human moves for the chosen side; `random/random` locks human input and plays both sides. Random play illustrates legal continuations; it does not search for the best move. Automatic play stops on a game result, a new position, Stop/Pause, or disconnection. Reconnection preserves the board without restarting playback.

The sidebar shows the last move, captured pieces by color and a numbered history, such as `1. White man: 32 → 21 → 12`. Black's reply is numbered `1…`. Captures are recorded only from moves played in this component. Playback controls sit beneath the board, beside the status. Taking a different move after going back replaces the remaining recorded continuation.

### Events

`tp-checkers-change` supplies `{ fen, position }` after loading, playing or navigating. `tp-checkers-move` supplies `{ from, to, path, captures, promotion, fen }` after a complete turn. Captures contain `square`, `color` (`w`/`b`) and `type` (`m`/`k`). `tp-checkers-end` supplies `{ fen, result }` when a played move ends the game. `tp-checkers-error` supplies `{ message }` for invalid positions or play parameters. Events bubble. Illegal or ambiguous API moves return false without changing the board.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/checkers/checkers.js"></script>
  ```

import
: ```js
  import "/path/to/components/checkers/checkers.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/checkers/checkers.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Explore an international draughts endgame with men and kings. Select a piece to see its legal destinations, then play a complete turn or try random play.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Majority capture
: Select the man on 32 and capture 27 then 17 by choosing destination 12. The shorter capture from 34 is unavailable because the maximum capture is compulsory.

Flying kings
: Select the king on 32 to compare distant landing squares. Captured pieces block further jumps until the turn ends.

Crowning a man
: Move the white man from 7 to 1 or 2. It becomes a king automatically at the end of the move.
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
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-chronometer
@summary Chronometer component with play, pause and stop controls.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
-->
<!--
@tp-dependency tp-drawer
@summary Drawer overlay component.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-fullscreen
@summary Fullscreen controller button.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-chronometer>`](#/components/chronometer/index.md) : Chronometer component with play, pause and stop controls.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-divider>`](#/components/divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-drawer>`](#/components/drawer/index.md) : Drawer overlay component.
- [`<tp-dropdown>`](#/components/dropdown/index.md) : Dropdown menu component.
- [`<tp-fullscreen>`](#/components/fullscreen/index.md) : Fullscreen controller button.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.
- [`<tp-theme>`](#/components/theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.

### External

<!--
@summary No external dependency.
-->
No external dependency

### See also

- [`<tp-chess>`](#/components/chess/index.md) : Explore chess positions with the same playback controls.
<!-- tp-docgen:dependencies:end -->
