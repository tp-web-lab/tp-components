# Tangram

The custom `<tp-tangram>` element presents seven rigid pieces and a central silhouette at exactly the same scale. Reproduce the silhouette without overlapping pieces.

<tp-tangram></tp-tangram>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Drag a piece (mouse, pen or touch) | Place the piece anywhere, including incorrect positions and outside the silhouette. Only overlaps with other playing pieces are refused. Nearby vertices snap when this causes no overlap; the view expands if needed to keep every piece visible. |
| Select a piece | Show rotation and flip icons beside that piece. |
| Click outside the piece and its local controls | Close the local controls without moving or deselecting the piece. Select a piece again to reopen them. |
| Local rotation / flip icons | Rotate or reflect the selected piece without returning to the main toolbar. Flip is available for the parallelogram only. |
| Rotate −45° / Rotate +45° | Rotate the selected piece around its center. Only rotations that overlap another playing piece are refused. |
| Flip | Reflect the selected parallelogram; available only for that piece. |
| Undo / Redo | Reverse or restore one accepted placement, rotation or reflection. |
| Assistance (?) | Open the help menu. |
| Show all incorrect pieces / Hide incorrect pieces | Mark pieces that are not entirely inside the silhouette with a red dashed outline. Valid alternative dissections are accepted. |
| Clear the incorrect pieces | Close any solution or piece preview, then return incorrect pieces around the silhouette, preserving their orientation and leaving correct pieces in place. Undo restores the previous arrangement. |
| Show the piece | Reveal the selected piece’s position in the supplied solution without moving it. Select a piece first. |
| Show the solution / Hide the solution | Show an isolated preview of the seven solution pieces, each used once. Playing pieces are temporarily hidden to avoid mixing the two arrangements. Hide the solution to resume the unchanged game. |
| Restart | Restore the surrounding pieces and clear the history. |
| Fullscreen | Enter or leave fullscreen, when supported by the browser. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Focus toolbar buttons and individual pieces. Focusing a piece selects it. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on a toolbar button | Activate the button. |
| Arrow keys on a piece | Move by 0.05 units; <kbd>Shift</kbd> increases the step to 0.5 units. |
| <kbd>R</kbd> / <kbd>Shift</kbd>+<kbd>R</kbd> on a piece | Rotate by +45° / −45°. |
| <kbd>F</kbd> on the parallelogram | Reflect it. |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Undo / redo. <kbd>Command</kbd> is also supported. |
| <kbd>Arrow Up</kbd> / <kbd>Down</kbd>, <kbd>Home</kbd> / <kbd>End</kbd> in the assistance menu | Navigate menu items. <kbd>Enter</kbd> or <kbd>Space</kbd> activates an action; <kbd>Escape</kbd> closes the menu. |
| <kbd>Escape</kbd> | Close the selected piece’s local controls and cancel a drag; the browser also uses <kbd>Escape</kbd> to leave fullscreen. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User help for the component under the pointer, falling back to the focused component. <kbd>Shift</kbd> may be needed to type <kbd>?</kbd>. |

## Authoring

### Initial orientation

Add the boolean `exact-orientation` attribute to start all seven scattered pieces with the rotation and reflection used in the solution. A note below the board identifies this mode. Correctly oriented or positioned pieces remain freely movable, rotatable and flippable; the attribute is an initial aid, not a constraint. Adding or removing it restarts the current puzzle and clears undo/redo history. Loading another solution and Restart apply the attribute again. In JavaScript, use the boolean `exactOrientation` property.

```html
<tp-tangram exact-orientation src="/docs/components/tangram/examples/convex-01.txt"></tp-tangram>
```

The main toolbar uses icons with tooltips and accessible labels. Selecting a piece displays a small local toolbar beside it with the same rotation commands and the parallelogram flip. Keyboard shortcuts <kbd>R</kbd>, <kbd>Shift</kbd>+<kbd>R</kbd> and <kbd>F</kbd> also work while the piece is focused.

### Solution source

Describe the drawing with **named points and pieces bounded by these points**. The component calculates centers, sizes, rotations and reflections automatically. `triangle` automatically uses a large, medium or small triangle of the matching size; there is no need to number identical pieces.

For example, `point O = midpoint(A, C)` places O halfway between A and C, and `triangle A B O` places a triangle whose vertices are A, B and O. Shared point names express how pieces meet.

<img src="/docs/components/tangram/examples/square-landmarks.svg" alt="Named points for the square dissection" style="max-width: 28rem; width: 100%; height: auto;">

Use this complete source in a plain text file referenced by `src`, or inside `<script type="tp/tangram">`:

```text
# Corners of a square of side 4
point A = (0, 0)
point B = (4, 0)
point C = (4, 4)
point D = (0, 4)

# Shared landmarks
point O = midpoint(A, C)
point E = midpoint(B, C)
point F = midpoint(C, D)
point G = midpoint(B, O)
point H = midpoint(O, C)
point I = midpoint(O, D)

# The seven pieces, described by their boundary vertices
triangle A B O
triangle A O D
triangle E C F
triangle B E G
triangle O H I
square O G E H
parallelogram D F H I
```

```html
<tp-tangram src="square.txt"></tp-tangram>
```

| Statement | Meaning |
| --- | --- |
| `grid sqrt2` | Optional first statement: use the small triangle leg as grid spacing (√2). `grid 1` is the default. |
| `point A = (0, 0)` | Name a point on the drawing grid. |
| `point O = midpoint(A, C)` | Construct a midpoint from two previously defined points. |
| `triangle A B O` | Use the matching small, medium or large triangle. |
| `square O G E H` | Place the square using its four boundary vertices. |
| `parallelogram D F H I` | Place the parallelogram, automatically reflecting it when needed. |
| `triangle (0, 0) (4, 0) (2, 2)` | Write coordinates directly when point names would add no clarity. |
| `# comment` | Explain any part of the drawing, on its own line or after a statement. |

List vertices around the boundary, clockwise or counterclockwise, starting at any vertex. Point declarations must precede their use. Named points and coordinate pairs may be mixed in one piece. Coordinates increase to the right and down. No angles or triangle centers are needed.

The grid has a fixed scale: the default square has side 4 and area 16; small triangles have area 1 and legs √2. Supply five right isosceles triangles of areas 4, 4, 2, 1, 1, one square of area 2 and one parallelogram of area 2. The parser checks the actual shapes and lengths, rejects overlaps, missing or excess pieces, and reports the offending line for a malformed statement. Pieces are rigid: the parser never scales or deforms them to fit an invalid drawing.

The figure is centered automatically. The silhouette and playing pieces keep the same scale. Valid alternative dissections and interchangeable triangles count as completed solutions. Even a correctly placed piece remains freely movable.

The `src` file takes precedence over an inline script. Both use the same notation; source text is never executed as JavaScript. A loading error preserves the current game, or uses the default square on initial load.

For compatibility with programmatic data, JSON placement arrays and the previous `id x y angle [flip]` lines remain supported. These low-level formats are no longer needed for hand-authored figures.

## Examples

### Thirteen convex figures

The examples **Convex 01** through **Convex 13** reproduce the supplied reference image, including each seven-piece dissection. Numbering runs left to right across the top row (01–05), then the middle row (06–10), then the bottom row (11–13). Each figure is available as an independent `examples/convex-NN.txt` file using integer vertices with `grid sqrt2`. Choose its numbered example below and press Solution to inspect the dissection.

<img src="/docs/components/tangram/examples/convex-gallery.svg" alt="The thirteen convex tangrams, numbered in reference-image order" style="max-width: 48rem; width: 100%; height: auto;">


<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Drag and rotate the seven pieces to cover the silhouette. Try Undo, Redo and Solution to inspect the dissection.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Named vertices
: Open the source to see named corners and midpoint constructions. Show the solution to compare the seven pieces with their declared vertices, then play the puzzle.

Exact orientation
: Start the first convex figure with all seven pieces already oriented as in the solution. Translate them into place, or select one to try its local rotation and flip controls.

Convex 01
: Reproduce figure 01 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 02
: Reproduce figure 02 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 03
: Reproduce figure 03 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 04
: Reproduce figure 04 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 05
: Reproduce figure 05 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 06
: Reproduce figure 06 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 07
: Reproduce figure 07 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 08
: Reproduce figure 08 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 09
: Reproduce figure 09 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 10
: Reproduce figure 10 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 11
: Reproduce figure 11 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 12
: Reproduce figure 12 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.

Convex 13
: Reproduce figure 13 from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
html
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

Import `TpTangram` and `TangramPlacement` from the library. Call `setSolution(textOrPlacements)` to load a solution from JavaScript. Call `place(id, x, y, angle?, flipped?)` to attempt an absolute placement; it returns false if refused. Use `placements` for an independent snapshot, `isSolved` for completion, `canUndo` / `canRedo` for history availability, and `undo()`, `redo()`, `reset()`, `showSolution(boolean)` or `fullscreen()` for commands. Successful source replacement and Restart clear history.

`tp-tangram-change` provides `{placements, solved}` after accepted changes and undo/redo. `tp-tangram-error` provides `{message}` on source-loading errors. The inline script uses `type="tp/tangram"` and may be added during HTML parsing.

### API
<!-- tp-docgen:api TpTangram -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>exact-orientation</code> | <code>boolean</code> | <code>false</code> | Starts every piece in its solution orientation, including reflection; changing it restarts the puzzle. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Text or JSON file containing the seven solution placements. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-tangram>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>clearIncorrectPieces</code> | <code>clearIncorrectPieces(): void</code> | Returns incorrect pieces outside the silhouette in one undoable operation. |
  | <code>fullscreen</code> | <code>fullscreen(): Promise&lt;void&gt;</code> | Toggles the browser fullscreen view. |
  | <code>place</code> | <code>place(id: string, x: number, y: number, angle?: number, flipped?: boolean): boolean</code> | Attempts an absolute placement. Rejected placements leave history unchanged. |
  | <code>redo</code> | <code>redo(): void</code> | Redo. |
  | <code>reset</code> | <code>reset(): void</code> | Restores the seven pieces around the target silhouette. |
  | <code>setSolution</code> | <code>setSolution(solution: string \| Placement[]): void</code> | Loads a validated solution; centers it and starts a fresh game. |
  | <code>showIncorrectPieces</code> | <code>showIncorrectPieces(show = true): void</code> | Highlights pieces that are not entirely inside the target silhouette. |
  | <code>showPiece</code> | <code>showPiece(): void</code> | Reveals the selected piece in the supplied dissection without moving it. |
  | <code>showSolution</code> | <code>showSolution(show = true): void</code> | Shows an isolated solution preview; hiding it restores the unchanged playing pieces. |
  | <code>undo</code> | <code>undo(): void</code> | Undo. |
  [Public methods of `TpTangram`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-tangram-change</code> | <code>&#123; placements: unknown; solved: unknown &#125;</code> | Fired after an accepted edit; detail contains placements and solved. |
  | <code>tp-tangram-error</code> | <code>&#123; message: string &#125;</code> | Fired when loading a solution fails; detail contains message. |
  [Events emitted by `<tp-tangram>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-tangram>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_tangram.TpTangram.html)
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
  <script type="module" src="/path/to/components/tangram/tangram.js"></script>
  ```

import
: ```js
  import "/path/to/components/tangram/tangram.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/tangram/tangram.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-tangram>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-dropdown>`](../dropdown/index.md) : Dropdown menu component.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
