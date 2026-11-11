<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="tangram" library="components" size="1.25em"></tp-icon> Tangram

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-tangram>` element provides a seven-piece puzzle for assembling a target silhouette.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-tangram></tp-tangram>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-tangram" src="/docs/components/tangram/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Programming notes

Import `TpTangram` and `TangramPlacement` from the library. Call `setSolution(textOrPlacements)` to load a solution from JavaScript. Call `place(id, x, y, angle?, flipped?)` to attempt an absolute placement; it returns false if refused. Use `placements` for an independent snapshot, `isSolved` for completion, `canUndo` / `canRedo` for history availability, and `undo()`, `redo()`, `reset()`, `showSolution(boolean)` or `fullscreen()` for commands. Successful source replacement and Restart clear history.

`tp-tangram-change` provides `{placements, solved}` after accepted changes and undo/redo. `tp-tangram-error` provides `{message}` on source-loading errors. The inline script uses `type="tp/tangram"` and may be added during HTML parsing.

### Authoring

#### Author directives

#### Initial orientation

Add the boolean `exact-orientation` attribute to start all seven scattered pieces with the rotation and reflection used in the solution. A note below the board identifies this mode. Correctly oriented or positioned pieces remain freely movable, rotatable and flippable; the attribute is an initial aid, not a constraint. Adding or removing it restarts the current puzzle and clears undo/redo history. Loading another solution and Restart apply the attribute again. In JavaScript, use the boolean `exactOrientation` property.

```html
<tp-tangram exact-orientation src="/docs/components/tangram/examples/convex-01.txt"></tp-tangram>
```

The main toolbar uses icons with tooltips and accessible labels. Selecting a piece displays a small local toolbar beside it with the same rotation commands and the parallelogram flip. Keyboard shortcuts <kbd>R</kbd>, <kbd>Shift</kbd>+<kbd>R</kbd> and <kbd>F</kbd> also work while the piece is focused.

#### Solution source

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

### Importing

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

<!-- -->
## Examples

### Thirteen convex figures

The examples **Convex 01** through **Convex 13** reproduce the supplied reference image, including each seven-piece dissection. Numbering runs left to right across the top row (01–05), then the middle row (06–10), then the bottom row (11–13). Each figure is available as an independent `examples/convex-NN.txt` file using integer vertices with `grid sqrt2`. Choose its numbered example below and press Solution to inspect the dissection.

<img src="/docs/components/tangram/examples/convex-gallery.svg" alt="The thirteen convex tangrams, numbered in reference-image order" style="max-width: 48rem; width: 100%; height: auto;">

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Drag and rotate the seven pieces to cover the silhouette. Try Undo, Redo and Solution to inspect the dissection.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

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
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
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
- [`<tp-button-group>`](#/components/button-group/index.md) : Button group component for organizing multiple buttons.
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
<!-- tp-docgen:dependencies:end -->
