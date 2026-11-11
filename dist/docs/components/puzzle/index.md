<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="puzzle" library="components" size="1.25em"></tp-icon> Puzzle

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-puzzle>` element provides an image puzzle with movable and rotatable pieces.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-puzzle src="/docs/components/puzzle/examples/landscape.svg" pieces="12" alt="Mountain lake at sunrise"></tp-puzzle>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-puzzle" src="/docs/components/puzzle/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
Image URL
: Set `src` to an SVG, PNG, WebP or JPEG image. Relative URLs resolve against the containing source document.

Image child
: Provide an initial `img` child. Its `src` and `alt` are captured before the game is rendered; explicit component attributes take precedence.
:::

### Image and piece count

`pieces` sets the exact number of pieces, from 1 to 144 (16 by default). For square and interlocking pieces, a rectangular factor grid is chosen to approximate the image's aspect ratio. For example, a landscape image with 12 pieces uses four columns and three rows. Prime counts produce a single row or column; composite counts are usually more convenient to play.

For these two shapes, every grid cell is square. The complete image is fitted into the target rectangle without stretching or cropping. Margins appear when its aspect ratio differs from the grid, and those margins are part of the pieces. SVG images need usable intrinsic dimensions or a viewBox. The browser loads the image directly; no server-side cutting or canvas export is required. Image-load failures produce a message and a `tp-puzzle-error` event.

For triangles and hexagons, the board follows the outline of a compact tiling of whole regular polygons. The exact requested count is preserved, including prime counts; the last row can be shorter. The image fills the bounding rectangle and is cropped to the board silhouette without distortion. Show image uses this same silhouette.

### Piece shapes and orientation

- `shape="puzzle"` (default) creates interlocking pieces. Neighboring tabs and sockets are complementary, while the outer border stays straight.
- `shape="square"` creates straight square tiles.
- `shape="triangle"` creates equilateral triangles with alternating upward and downward orientations.
- `shape="hexagon"` creates regular hexagons in staggered rows.
- Rotations use 90° steps for `square` and `puzzle`, and 60° steps for `triangle` and `hexagon`. The toolbar, context menu and keyboard follow the selected shape.
- `exact-orientation` starts pieces in their original image orientation. Otherwise each starts at a random multiple of the rotation step. Pieces remain rotatable in both modes.

Changing `src`, `pieces`, `shape` or `exact-orientation` starts a new game. Changing `alt` updates the image description without losing progress. Keep a useful description for players who cannot identify the image visually; provide an alternative activity when spatial manipulation is unsuitable.

### Assembly and assistance

Pieces begin in a shuffled tray below the target frame. A correctly oriented piece snaps to its own target when its center comes within 0.22 cell units. Correct placement requires both the original image position and an upright orientation, even when a piece looks visually symmetric. Pieces may overlap during assembly; selecting a piece for dragging brings it to the front. The play area keeps pieces within reach.

Show image toggles a translucent reference inside the target frame without moving pieces. The controls and keyboard provide alternatives to the right-click rotation menu, including on touch devices. Undo and Redo track placements and rotations; Shuffle rearranges every piece and clears the history.

### JavaScript API and events

The `src`, `pieces`, `shape`, `alt` and `exactOrientation` properties reflect their attributes. Use `placements` to read independent copies of the current positions, and `isSolved`, `canUndo` and `canRedo` to inspect state.

`place(id, x, y, angle?)` attempts an absolute placement and returns a boolean. Coordinates are piece centers in the SVG's cell units. IDs start at zero and follow the original image rows. Angles must be multiples of 90° for square/interlocking pieces or 60° for triangles/hexagons; positions are clamped to the play area and may snap near the target. Invalid IDs or non-finite values leave the state unchanged.

`undo()`, `redo()`, `reset()` and `showImage(show = true)` expose the same actions as the controls. Wait for `tp-puzzle-load` before acting on pieces; its detail contains `pieces`, `rows` and `columns`. Each accepted edit or shuffle emits `tp-puzzle-change` with independent `placements` and `solved` values. A move that completes the arrangement also emits `tp-puzzle-complete`. Errors emit `tp-puzzle-error` with a `message`. All these events bubble.

The introductory landscape is an original local SVG fixture; it needs no external image service.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/puzzle/puzzle.js"></script>
  ```

import
: ```js
  import "/path/to/components/puzzle/puzzle.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/puzzle/puzzle.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Assemble the mountain-lake image from twelve interlocking pieces. Drag a piece, open its rotation menu with a right-click, and use Show image to compare the target.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Square pieces
: Assemble nine square tiles that start upright. Compare this straight-edged layout with the interlocking pieces in Basic usage.

Triangular pieces
: Assemble equilateral triangles within their adapted board outline. Try the 60° rotation controls and Show image.

Hexagonal pieces
: Assemble regular hexagons in a honeycomb layout. The thirteen whole pieces preserve the requested count; rotations use 60° steps.
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

- [`<tp-tangram>`](#/components/tangram/index.md) : Assemble a silhouette from seven geometric pieces.
<!-- tp-docgen:dependencies:end -->
