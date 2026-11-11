<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="chess" library="components" size="1.25em"></tp-icon> Chess

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-chess>` element displays chess positions and plays out endgames.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-chess position="8/8/3k4/8/3PK3/8/8/8" draggable-pieces=""></tp-chess>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-chess" src="/docs/components/chess/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Positions and FEN

`position` accepts a piece-placement string, such as `r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R`, or a complete FEN. A placement-only string assumes White to move, no castling rights, no en-passant target, a halfmove clock of zero and move number one. Supply a complete FEN when these fields matter to the exercise.

`fen` accepts the complete six-field Forsyth–Edwards notation: placement, active side (`w` or `b`), castling rights, en-passant square, halfmove clock and fullmove number. On initial connection, `fen` takes precedence over `position`. Afterwards, changing either loads that position. Each accepted move synchronizes both attributes: `position` contains the placement field and `fen` contains the entire current position.

With neither attribute, the board starts in the classical position with all castling rights. Invalid input emits `tp-chess-error` and preserves the previous position. Nonempty positions require one king of each color and valid FEN syntax; this is not a proof that a position can arise in a historical game. Empty maps and `clear()` create a non-playable empty board.

### Orientation and human moves

`orientation="white"` (default) places White at the bottom; `orientation="black"` places Black at the bottom. Orientation changes neither the side to move nor the human side of an existing game.

`draggable-pieces` is a boolean attribute, absent by default. It enables dragging with mouse or touch, selecting a piece and destination with clicks, and keyboard play. Its JavaScript property is `draggablePieces`; the HTML spelling `draggablePieces` is also accepted (HTML normalizes it to lowercase). As with other boolean attributes, omit it to disable moves: a value of `"false"` does not disable it. API moves remain available when human moves are locked.

Only legal moves for the active side are accepted. This includes castling, en passant and promotion; kings cannot move into check. A human pawn promotion presents queen, rook, bishop and knight choices. API moves promote to a queen unless another piece is specified. The status identifies check, checkmate, stalemate, insufficient material, threefold repetition and the fifty-move rule. The last two conditions automatically stop play in this educational component. Loading a FEN starts new history: earlier repetitions cannot be inferred from FEN alone.

### JavaScript API

Use the element after it has been defined, for example after an explicit component import. All coordinates use algebraic square names, independently of orientation.

| Method | Result |
| --- | --- |
| `start()` | Loads the classical starting position with castling rights. |
| `setPosition(fenOrObject)` | Loads a placement, full FEN or piece map; returns a boolean. Stops autoplay and establishes the new reset position. |
| `move(begin, end, promotion = "q")` | Plays a legal move and returns a boolean. Promotion accepts `q`, `r`, `b` or `n`. |
| `legalMove(begin, end, promotion = "q")` | Tests a move without changing the position. |
| `highlightLegalMove(square)` | Highlights and returns legal destination squares; omit the argument to clear highlights. |
| `flip()` | Switches the viewing orientation. |
| `clear()` | Empties the board and stops play. |
| `reset()` | Restores the most recently loaded position, including turn and rights. |
| `play(mode, userSide = "white", delay = 2000)` | Starts `user/random` (default) or `random/random`; returns whether play started. Delay is in milliseconds, from 100 to 60000; the default is two seconds per move. |
| `stop()` | Stops automatic play without changing the position. |

`setPosition({ d6: 'bK', d4: 'wP', e4: 'wK' })` uses `w` or `b` for color and `K`, `Q`, `R`, `B`, `N`, `P` for king, queen, rook, bishop, knight and pawn. Object input defaults to White to move with no castling or en-passant rights; use FEN for a different turn or rights.

~~~js
import "/components/chess/chess.js";

const chess = document.createElement("tp-chess");
chess.setPosition({ d6: "bK", d4: "wP", e4: "wK" });
document.body.append(chess);
chess.highlightLegalMove("d4");
if (chess.legalMove("d4", "d5")) chess.move("d4", "d5");
chess.play("user/random", "white");
~~~

### Playing an endgame

`user/random` enables human moves and chooses random legal replies for the other side. The method's human side defaults to White; the Play vs random toolbar button uses the side currently displayed at the bottom. `random/random` plays both sides automatically and locks human board input while it runs. Random play is an illustration of legal continuations, not a chess engine that seeks the best move.

Automatic play stops at the end of the game, on Stop, when a new position is loaded, or when the element is disconnected. Reconnecting preserves the board but does not restart autoplay. Reset position returns to the loaded exercise; Start switches to classical chess. SVG pieces come from the local chess icon collection, including a queen added for this component. Piece colors stay recognizably white and black while the board follows the surrounding brand colors.

The last move and displayed history entries use the same concise format `12… Black king: d6 → c7`, with the fullmove number from FEN (`12.` for White, `12…` for Black), without algebraic move notation or capture commentary. The last move’s two squares are marked on the board. The full recorded moves remain available for replay. Captured pieces are grouped by color beside the move history; on narrow screens this panel moves below the board. Only captures played since the position was loaded are shown: a FEN cannot reveal previously captured pieces. Loading or resetting a position clears this history; Stop and Flip preserve it.

### Playback controls

The icon-button row provides Back to beginning, Previous move, Play one move, Play to end and Pause. Each step is a single move by one side. Returning to the beginning preserves the recorded sequence; Reset position discards it. Going backward restores the board, captured pieces, last-move markers and visible history. Play one move replays a recorded move or generates one random legal move when no recorded move remains. Play to end replays the sequence, then continues randomly until a terminal position; Pause can interrupt it at any time. A different move played after going backward replaces the remaining recorded continuation.

The corresponding methods are `rewind()`, `previousMove()`, `nextMove()`, `playToEnd()` and `pause()`. The three move/play methods return a boolean indicating whether the action was possible. Navigation emits `tp-chess-change`; replayed moves also emit `tp-chess-move`.

### Events

`tp-chess-change` supplies `{ fen, position }` after a load or legal move. `tp-chess-move` adds `{ from, to, san, promotion, fen }` for played moves. `tp-chess-end` supplies `{ fen, result }` when a move ends the game. `tp-chess-error` supplies `{ message }` for invalid input. Events bubble. Invalid moves return false and leave the board unchanged.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/chess/chess.js"></script>
  ```

import
: ```js
  import "/path/to/components/chess/chess.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/chess/chess.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Explore a king-and-pawn ending. Select a white piece to see its legal destinations, then play a move or try Play vs random.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Black to move
: Explore the same pawn ending with Black to move and Black at the bottom. Compare the available king moves with Basic usage.

Pawn promotion
: Move the pawn from a7 to a8 and choose a queen, rook, bishop or knight. Reset position lets you compare promotions.

Rook endgame
: Explore a king-and-rook ending against a lone king. Try Play vs random or Random vs random, then stop or reset the exercise.
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
@credit chess.js https://github.com/jhlywa/chess.js
@summary Legal chess moves, FEN validation and game-end detection (BSD-2-Clause).
-->

- [chess.js](https://github.com/jhlywa/chess.js) : Legal chess moves, FEN validation and game-end detection (BSD-2-Clause).
<!-- tp-docgen:dependencies:end -->
