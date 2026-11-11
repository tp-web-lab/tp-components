<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="wari" library="components" size="1.25em"></tp-icon> Wari

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-wari>` element displays Oware Abapa positions and plays out games and endgames.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-wari interactive=""></tp-wari>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-wari" src="/docs/components/wari/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Awalé and the selected rules

Wari, also known as awalé or oware, has many regional variants. This component uses **Abapa**, with twelve pits and forty-eight seeds. Each player owns six pits, initially containing four seeds each. South starts. See the [Abapa rules](https://oware.org/abapa.asp) for the traditional game.

A turn sows all seeds from one of the active player's nonempty pits counterclockwise, one seed per pit. The source pit is skipped on every subsequent lap. A turn always passes to the opponent after the sowing.

If the last seed lands in an opposing pit containing two or three seeds, that pit is captured. Capture continues backwards through adjacent opposing pits with two or three seeds. If this would take every seed on the opponent's side, the entire capture is cancelled; the sowing remains valid. This is the **void grand slam** rule.

When the opposing row is empty, only moves that feed it are legal. If no such move exists, the game ends and each player collects the seeds remaining on their own side. A player wins upon reaching twenty-five captured seeds; 24–24 is a draw. To make automated play finite, this component also ends on the third occurrence of the same pits, scores and active side, collecting each side's remaining seeds and comparing scores. This automatic repetition convention replaces a manual agreement to end a cycle.

### Positions

`position` uses the component's compact notation: `S:4,4,4,4,4,4,4,4,4,4,4,4:0,0`. This is **not chess FEN**. The three fields are:

- `S` or `N`: South or North to move.
- Twelve pit counts in sowing order, pits 1–12.
- South's captured-seed score, then North's score.

South owns pits 1–6, displayed left to right along the bottom in the default orientation. North owns pits 7–12, displayed right to left along the top. Sowing follows increasing numbers, wraps from 12 to 1, and skips the source pit. Flipping changes the view, never these identities.

All counts must be nonnegative integers, and pits plus scores must total forty-eight. All zeros represent a cleared, non-playable board. A terminal loaded position is resolved immediately, including final collection when feeding is impossible. Invalid input emits `tp-wari-error` and preserves the current game. Position validation does not prove historical reachability.

The `position` attribute reflects moves and navigation. Loading a new position resets history, repetition counts and move numbering to one. `setPosition({ pits: [4,4,4,4,4,4,4,4,4,4,4,4], scores: [0,0], turn: "south" })` accepts the same information as a JavaScript object. The read-only `scores` property returns an independent South/North pair; `turn` returns the active side.

### Human input and orientation

`interactive` is a boolean attribute, absent by default. It enables clicking, tapping and keyboard moves. Omit it to lock human input; a value of `"false"` still enables it. API moves remain available when human input is locked. Moves sow a pit's entire contents; there is no piece dragging.

`orientation="south"` (default) puts South at the bottom; `orientation="north"` puts North at the bottom. It does not change the side to move or an existing game's chosen human side.

Legal pits are outlined when human input is available. Every pit displays its exact count; up to twelve decorative seed shapes are shown to keep crowded pits readable. The last source and destination have dashed and solid outlines respectively. The score labels show captured seeds, including any final collection.

### JavaScript API

Import the component before calling its methods. Pit arguments are numbers from 1 to 12, independently of orientation.

| Method | Result |
| --- | --- |
| `start()` | Loads four seeds in every pit with South to move. |
| `setPosition(stringOrObject)` | Loads an exercise, stops playback and clears history; returns a boolean. |
| `move(pit)` | Sows a legal pit and applies captures and final collection; returns a boolean. |
| `legalMove(pit)` | Tests a pit without playing it. |
| `legalMoves()` | Returns the legal pit numbers, including feeding restrictions. |
| `highlightLegalMove(show = true)` | Highlights and returns legal pits; pass false to clear API highlights. |
| `flip()` | Reverses the viewing orientation. |
| `clear()` | Empties the board and both scores and stops play. |
| `reset()` | Restores the loaded exercise and clears its recorded continuation. |
| `play(mode = "user/random", userSide = "south", delay = 2000)` | Starts human versus random or `random/random` play; delay is 100–60000 milliseconds. Returns a boolean. |
| `stop()` / `pause()` | Stops automatic play while preserving history and position. |
| `rewind()` | Returns to the loaded beginning while retaining recorded moves for replay. |
| `previousMove()` | Takes back a complete turn, including captures, scores and repetition state. Returns a boolean. |
| `nextMove()` | Replays one recorded turn, or chooses a random legal move when no recording remains. Returns a boolean. |
| `playToEnd()` | Replays recorded turns and continues randomly until the game ends or playback is paused. |

~~~js
import "/components/wari/wari.js";

const wari = document.createElement("tp-wari");
wari.interactive = true;
document.body.append(wari);
wari.move(3);
wari.previousMove();
wari.play("user/random", "south");
~~~

### Playback and history

`user/random` enables human moves for the chosen side; `random/random` plays both sides and locks human input. Random play illustrates legal continuations without seeking the best move. The default interval is two seconds per complete turn. Sowing is applied as one turn, rather than as a draggable or seed-by-seed operation.

The sidebar displays the last move and a numbered history, for example `1. South: 3 → 7` and `1… North: 7 → 12`. Captures add their seed count to the move description. The last move also reports the number of seeds sown, cancelled grand slams and any final collection. Scores retain captured seeds across turns and follow undo/replay.

The five playback buttons sit under the board beside the status. Playing a different move after going back replaces the remaining continuation. Automatic play stops on a game result, a new position, Stop/Pause or disconnection. Reconnecting preserves the board without restarting playback.

### Events

`tp-wari-change` supplies `{ position, pits, scores, turn }` after loading, playing or navigating. `tp-wari-move` supplies `{ number, side, from, to, seeds, path, captures, grandSlam, collected, before, after }` after a complete turn. Each capture contains `{ pit, seeds }`; `path` lists successive receiving pits, including repeated visits, and `collected` gives South/North final-collection amounts. `before` and `after` are serialized positions.

`tp-wari-end` supplies `{ position, result }` when a move ends the game. `tp-wari-error` supplies `{ message }` for invalid positions or play parameters. Events bubble. Invalid moves return false without changing the board.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/wari/wari.js"></script>
  ```

import
: ```js
  import "/path/to/components/wari/wari.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/wari/wari.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Play an Oware Abapa game from the standard forty-eight-seed position. Sow a highlighted pit, inspect the scores and try the playback controls.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Capturing seeds
: Play South pit 5 to finish in pit 8 and capture five seeds from pits 8 and 7. Previous move restores both the pits and the scores.

Feeding the opponent
: North has no seeds. Only pit 6 can feed North, so pit 1 cannot be played even though it contains a seed.

Void grand slam
: Sow pit 6. The two seeds in pit 7 would be the opponent’s entire supply, so the capture is cancelled and North keeps them.
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

- [`<tp-checkers>`](#/components/checkers/index.md) : Explore international draughts positions with the same playback controls.
- [`<tp-chess>`](#/components/chess/index.md) : Explore chess positions with the same playback controls.
<!-- tp-docgen:dependencies:end -->
