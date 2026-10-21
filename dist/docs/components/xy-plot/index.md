# <tp-icon name="xy-plot" library="components" size="1.25em"></tp-icon> XY plot

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-xy-plot>` element implements the <tp-icon name="xy-plot" library="components" size="1.25em"></tp-icon> XY plot functionality: xY graph rendering component.

<tp-xy-plot label="Functions">
  <script type="tp/xy-plot">
    label = "Functions"
    x-axis = [-10, 10]
    y-axis = [-5, 5]
    curve Sine = function(x, 2*sin(x))
    curve Line = function(x, x/2)
  </script>
</tp-xy-plot>

The title **Functions** appears at the left of the toolbar. Use the bottom-left **Code** button to open **Graph definition** in place of the curves to use the `.txt` file menu, F1, Reset definition and Play.

## Usage

### Shared points, vectors and title

Both plot components accept this exact source:

```text
label = "Points and vectors"
point O = (0, 0)
point A = (3, 4)
vector u = vector(O, A)
```

Use `label = "..."` (or `title = "..."`) for the figure title. A nonempty HTML `label` attribute takes precedence. Points use `point NAME = (x, y)`; vectors use `vector NAME = vector(START, END)`. Each name must be unique. Editing an endpoint and applying the source recomputes its vectors. This first shared subset covers free points and vectors between points; attached points and geometric constructions remain specific to Geometry.

XY plot defaults to `xyFunctionGraph` when a source starts with these shared declarations. Its usual graph header and axis/curve directives can still be added. Existing `title "..."`, `points [...]` and `vectors [...]` definitions remain supported and can coexist with shared declarations, using distinct object names and only one title. Graph settings preserve shared point/vector declarations; their editors accept declaration lines in this mode.


Set `style="--tp-plot-height:440px"` to give the normal plot a fixed height, including its top and bottom controls. Both plot components support this property, so figures in cards can share the same height. Settings and other authoring panels remain outside this area; the enlarged view keeps its own dimensions. The code view scrolls within the available area. Omit the property to keep automatic sizing.

Use `label="My graph"` to display a title at the left of the view toolbar, including in the enlarged view. The source `title` directive is used when `label` is empty. The title appears only in the toolbar, never inside the SVG. Changing `label` preserves the graph, viewport and editor draft. The top right contains Save image, Theme, then Zoom graph. The bottom left contains Code; the bottom right contains Undo, Redo, Zoom out (−), then Zoom in (+). This layout is shared by the normal and enlarged views. Interactive settings, when enabled, appear below this block.

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Zoom in (+) / Zoom out (−) | Magnify or widen the coordinate ranges around the graph center, in both the preview and enlarged view. Keep the current animation step. |
| Save image | Save the current graph view as SVG, PNG or WebP, with its visible axes, grid, animation step and theme colors. |
| Theme | Choose Light, Dark or Auto for this plot only; the enlarged view shares the same theme. |
| Code (`</>`) | Replace the curves with Graph definition, or return to the curves, in either view. Draft edits are preserved; Play applies them. Closing zoom restores the previous normal view. |
| Undo / Redo | Undo or redo an applied definition change (Play, file load, interactive settings or Reset). A new change clears the redo history. View navigation is independent. |
| Drag the graph (mouse or touch) | Move the drawing horizontally and vertically. Center a point of interest before zooming in. |
| Settings fields | Update the graph and enlarged view; invalid entries retain the last valid graph and show feedback. |
| Start / Previous / Next / End | Return to zero revealed objects, hide the last revealed object, reveal the next object, or reveal all objects. The counter shows the current step and total. |
| Graph definition | Expand or collapse the editable source in the code view, with or without settings. |
| Graph definition > Files | Load a `.txt` definition, Save the draft, or Save as a new file. Valid loads update the graph and settings; invalid files preserve the current graph. |
| Graph definition > F1 / Reset definition / Play | Toggle the editor toolbar / discard draft edits and restore the displayed graph definition / validate and apply the edited definition. |
| Reset | Restore the original graph definition and settings. |
| Zoom graph (outward arrows) | Open the enlarged graph. |
| Close zoomed graph (inward arrows) | Close the enlarged graph and return to the preview. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between the available controls. |
| <kbd>F1</kbd> in Graph definition | Show or hide the source editor toolbar. |
| <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd>, <kbd>Home</kbd> / <kbd>End</kbd> in the file menu | Navigate Load, Save and Save as; <kbd>Enter</kbd>/<kbd>Space</kbd> activates an action and <kbd>Escape</kbd> closes the menu. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate the focused button, including Code, Undo, Redo, Zoom in, Zoom out and Reset. |
| Arrow keys on the focused graph | Move the drawing in the arrow direction by 10% of the visible range. |
| <kbd>Home</kbd> on the focused graph | Restore the original scale and position. |
| <kbd>Escape</kbd> | Close the enlarged graph. |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |

### Assignment syntax

All XY directives accept an optional equals sign: `x-axis`, `y-axis`, `x-ticks`, `y-ticks`, `legend-x`, `legend-y`, `grid`, `x-axis-at`, `y-axis-at`, `samples`, `anim`, `t-axis`, `theta-axis`, `functions`, `points` and `vectors`. Existing definitions without `=` remain valid, and both forms can be mixed. Lists may span multiple lines. Graph settings retain assignment syntax when editing such a source.

```text
xyFunctionGraph
label = "Parabola"
x-axis = [-2, 6]
y-axis = [-2, 16]
x-ticks = [-2, 0, 2, 4, 6]
legend-x = "x"
grid = both
x-axis-at = 0
samples = 256
curve f = function(x, x*x)
point O = (0, 0)
point A = (3, 4)
vector u = vector(O, A)
anim = ["f", "A", "u"]
```

The graph header may be omitted for Cartesian sources beginning with an assignment; named curves can also infer a polar or parametric kind. Use `xyPolarGraph` or `xyParametricGraph` to select the other graph kinds; use `theta-axis = [0, 2*PI]` or `t-axis = [0, 2*PI]` respectively. These plotting directives belong to XY plot; Geometry shares only the title, free-point and endpoint-vector declarations at this stage.

### Named curves

Define one curve per line, with an identifier used by its legend and by `anim`:

```text
curve f = function(x, sin(x))
curve r = polar(t, 2*cos(3*t))
curve c = parametric(t, cos(t), sin(t))
```

These three lines illustrate three separate graph kinds; do not mix kinds in one plot. Cartesian curves use `x`; polar and parametric curves use `t`. Expressions are unquoted and use the same safe mathematical operators and functions as legacy curves. Each expression is independent; curve identifiers are not callable mathematical functions.

The optional last argument `range=[min, max]` limits sampling. Bounds may use expressions, must be finite and strictly increasing. Without a range, the graph's axis or parameter range is used. A Cartesian range is intersected with the visible horizontal range. Put `style=solid`, `style=dashed`, `style=dotted` or `style=dash-dot` after the call:

```text
label = "Sine and cosine"
x-axis = [-4, 4]
y-axis = [-2, 2]
curve f = function(x, sin(x), range=[-PI, PI]) style=dashed
curve g = function(x, cos(x)) style=dotted
anim = ["f", "g"]
```

When the header is omitted, named curves determine the graph kind, even after title, point or axis declarations. An explicit `xyFunctionGraph`, `xyPolarGraph` or `xyParametricGraph` header must agree with every curve. Names must be unique across named curves, points, vectors and legacy objects. Existing `functions` lists remain supported and can accompany named curves of the same kind. Graph settings preserve named declarations; changing the graph kind starts a compatible named curve.

### Dynamic zoom

The + and − buttons change the scale around the center of the current graph. Each + click multiplies magnification by 1.25; − reverses one step. Twelve steps are available in either direction from the initial view. Curves are resampled and automatic ticks are recalculated, while labels keep their size. Explicit curve intervals remain respected; numeric datasets are never extrapolated.

Drag the graph to place a point of interest at the center, then use + to zoom around it. Keyboard users can focus the graph with Tab, pan with the arrow keys and reset with Home.

Both views share the same zoom, position and animation state. Applying a new graph definition or dataset resets the zoom. Returning to the initial scale restores any custom ticks. Explicit axes outside the visible range disappear, with graduations placed along the frame.

### Display attributes

`grid="both|horizontal|vertical|none"` chooses grid directions (default `both`). When present, it overrides the graph definition’s `grid` directive; removing it restores that directive. `axis="both|horizontal|vertical|none"` chooses visible axes (default `both`). Hiding an axis also hides its ticks, numeric graduations and axis label, independently of the grid. The plot frame remains visible.

The boolean `no-legend` attribute hides curve legends (default `false`). These attributes update both views immediately without changing the current animation step. JavaScript properties are `grid`, `axis` and `noLegend`.

### Step-by-step reveal

The outer list defines the steps. A string reveals one named object; a nonempty list reveals all its objects simultaneously:

```text
anim = ["A", ["f1", "f2"], "B"]
```

This sequence has **three steps**: A, then both curves f1 and f2, then B. At `0 / 3`, all four objects are hidden. Next reveals one whole step; Previous hides it again. Start hides every listed object and End reveals them all. Objects absent from the sequence stay visible. Curve legend entries follow their curves in both views, and zoom preserves the current step.

Names must exist and occur only once across the entire sequence. Empty names, empty groups and deeper nesting are rejected. Lists may span multiple lines. Omitting `anim`, or using `anim = []`, displays everything without animation controls. Applying a new definition restarts at step zero.

### Author directives

A graph is a text definition, supplied in a `<script type="tp/xy-plot">` inside the component, as plain inline text, or through the component's `src` attribute. Named curves infer the graph kind; an optional first-line header selects it explicitly. Subsequent declarations define settings and objects. These are graph-language directives, not HTML attributes.

#### Graph kind and coordinates

| First line | Curves | Expression variable | Default sampling domain |
| --- | --- | --- | --- |
| `xyFunctionGraph` | Cartesian functions `y = f(x)` | `x` | The horizontal range `x-axis` |
| `xyPolarGraph` | Polar functions `r = f(t)` | `t`, an angle in radians | `theta-axis = [0, 2*PI]` |
| `xyParametricGraph` | Parametric curves `(x(t), y(t))` | `t` | `t-axis = [0, 2*PI]` |

`x-axis` and `y-axis` always describe the visible Cartesian coordinate ranges, including for polar and parametric graphs.

#### Available declarations

For each item, the common syntax appears first and the legacy equivalent directly below it. Legacy forms remain readable; all declarative examples use the common syntax.

| Object or setting | Syntax: common, then legacy | Meaning and default |
| --- | --- | --- |
| Title | `label = "Functions"`<br>Legacy: `title "Functions"` | No title by default; `title = "Functions"` is also accepted. |
| Horizontal axis label | `legend-x = "Distance (m)"`<br>Legacy: `legend-x "Distance (m)"` | No label by default. |
| Vertical axis label | `legend-y = "Altitude (m)"`<br>Legacy: `legend-y "Altitude (m)"` | No label by default. |
| Horizontal range | `x-axis = [-1, 6]`<br>Legacy: `x-axis [-1, 6]` | Default `[-10, 10]`; increasing, distinct bounds. |
| Vertical range | `y-axis = [-5, 25]`<br>Legacy: `y-axis [-5, 25]` | Default `[-10, 10]`; increasing, distinct bounds. |
| Horizontal ticks | `x-ticks = [-1, 0, 1, 2, 3]`<br>Legacy: `x-ticks [-1, 0, 1, 2, 3]` | Default: nine evenly spaced ticks. |
| Vertical ticks | `y-ticks = [-5, 0, 1, 4, 9]`<br>Legacy: `y-ticks [-5, 0, 1, 4, 9]` | Default: nine evenly spaced ticks. |
| Grid | `grid = horizontal`<br>Legacy: `grid horizontal` | `both` (default), `horizontal`, `vertical` or `none`; axes remain independent. |
| Horizontal axis position | `x-axis-at = 0`<br>Legacy: `x-axis-at 0` | The y coordinate of the horizontal axis. |
| Vertical axis position | `y-axis-at = 0`<br>Legacy: `y-axis-at 0` | The x coordinate of the vertical axis. |
| Sampling | `samples = 512`<br>Legacy: `samples 512` | At least 2 samples per curve; default 512. |
| Cartesian curve | `curve f = function(x, x*x)`<br>Legacy: `functions [["f", "x*x"]]` | Expression in `x`. Multiple curves use separate declarations. |
| Polar curve | `curve r = polar(t, 2*cos(t))`<br>Legacy: `functions [["r", "2*cos(t)"]]` | Expression in `t`; legacy sources require `xyPolarGraph`. |
| Parametric curve | `curve c = parametric(t, cos(t), sin(t))`<br>Legacy: `functions [["c", "cos(t)", "sin(t")]]` | Expressions in `t`; legacy sources require `xyParametricGraph`. |
| Curve interval and style | `curve f = function(x, sin(x), range=[0, PI]) style=dashed`<br>Legacy: `functions [["f", "sin(x)", "dashed", [0, PI]]]` | Optional interval; style defaults to `solid`. |
| Point | `point A = (2, 4)`<br>Legacy: `points [["A", 2, 4]]` | Named Cartesian point in every graph kind. |
| Vector | `point O = (0, 0)`<br>`point A = (3, 2)`<br>`vector u = vector(O, A)`<br>Legacy: `vectors [["u", 0, 0, 3, 2]]` | New syntax references endpoints; legacy syntax stores origin and displacement. |
| Animation | `anim = ["A", ["f1", "f2"], "B"]`<br>Legacy: `anim ["A", ["f1", "f2"], "B"]` | Ordered steps; a group is revealed simultaneously. Default `[]`. |
| Parametric interval | `t-axis = [0, 2*PI]`<br>Legacy: `t-axis [0, 2*PI]` | Default `[0, 2*PI]`; also an alias of `theta-axis` in polar graphs. |
| Polar interval | `theta-axis = [0, PI]`<br>Legacy: `theta-axis [0, PI]` | Default `[0, 2*PI]`. |

Axis positions must be finite and within the visible range. Without explicit positions, ticks and labels stay on the bottom and left edges, with zero axes drawn when visible. Points outside the visible ranges are not drawn. Legacy point lists additionally support label offsets; legacy vector lists additionally support vector line styles. These options do not yet have equivalents in the shared point/vector declarations.

#### Curves and optional intervals

```text
curve Sine = function(x, sin(x))
curve Cosine = function(x, cos(x), range=[-PI/2, PI/2])
```

For a separate polar plot:

```text
curve Semicircle = polar(t, 2, range=[0, PI])
```

For a separate parametric plot:

```text
curve Circle = parametric(t, cos(t), sin(t))
curve Arc = parametric(t, 2*cos(t), 2*sin(t), range=[0, PI])
```

Intervals must be finite and strictly increasing. Cartesian intervals are intersected with the visible horizontal range; polar and parametric curves otherwise use their global parameter range. Keep each named declaration on one line.

#### Line styles

Place the style after the curve call: `solid` (default), `dashed`, `dotted` or `dash-dot`. The legend uses the same style.

```text
curve Sine = function(x, sin(x)) style=dashed
curve Cosine = function(x, cos(x), range=[0, PI]) style=dotted
```

#### Vectors

Vectors reference two points. Changing an endpoint and applying the source recomputes every vector using that point. They may accompany curves or be displayed alone.

```text
x-axis = [-1, 5]
y-axis = [-1, 5]
point O = (0, 0)
point A = (3, 2)
point B = (2, 4)
vector u = vector(O, A)
vector v = vector(A, B)
```

Vectors are clipped to the visible plot; a zero-length vector appears as a dot. Edit the endpoint coordinates in the settings panel.

#### Mathematical expressions

Curve expressions, range bounds, ticks, axis positions and point coordinates/offsets accept arithmetic (`+`, `-`, `*`, `/`, `**`, parentheses), constants `PI` and `E`, and these functions:

`abs`, `acos`, `acosh`, `asin`, `asinh`, `atan`, `atanh`, `ceil`, `cos`, `cosh`, `exp`, `floor`, `log`, `max`, `min`, `pow`, `random`, `round`, `sin`, `sinh`, `sqrt`, `tan`, `tanh`.

Angles are in radians; `log` is the natural logarithm. Write powers as `x*x`, `x**2`, or `pow(x, 2)`, not `x^2`. Only curve expressions have access to their variable (`x` or `t`). For `samples`, use a plain integer. Invalid or non-finite curve samples are skipped.

#### Complete Cartesian example

```html
<tp-xy-plot>
  <script type="tp/xy-plot">
    label = "Parabola and secant"
    legend-x = "x"
    legend-y = "f(x)"
    x-axis = [-1, 6]
    y-axis = [-5, 25]
    x-ticks = [-1, 0, 1, 2, 3, 4, 5, 6]
    y-ticks = [-5, 0, 1, 4, 9, 16, 25]
    grid = horizontal
    x-axis-at = 0
    y-axis-at = 0
    samples = 512
    curve Parabola = function(x, x*x)
    curve Secant = function(x, 7*x-10, range=[2, 5])
    point A = (2, 4)
    point B = (5, 25)
  </script>
</tp-xy-plot>
```

Add the boolean `settings` attribute (`<tp-xy-plot settings>`) to offer the built-in settings panel. The panel appears directly below the graph and its bottom controls. The **Author directives** example below uses this attribute to expose every setting, switch between all three graph kinds and display the generated definition. Clear an optional field to omit its directive and restore its default behavior.

The **Graph definition** disclosure is always available for declarative graphs, independently of `settings`. Use Code at the bottom left to display it in place of the curves. The attribute only adds the form-based settings panel below the graph. The disclosure contains an editable `tp-code-editor`, a `.txt` file menu and F1, Reset definition and Play icon buttons. Play updates both views and the settings fields; errors retain the displayed graph. Save preserves unapplied text. The suggested filename uses the slugified `label`, or `construction.txt` without a label; Save reuses the destination where supported, while Save as asks for a new one. Reset definition restores the currently displayed graph source.

**Reset** restores the original inline or loaded definition. Changing `src` establishes a new original definition; hiding the panel or removing `settings` retains the current graph. Settings are local to each component. The panel supports declarative graphs; it is unavailable for numeric series supplied with `setData()`, whose Code button is disabled. Interactive sampling is limited to 4096 samples per curve, or the original sample count if higher.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the Functions label at the left of the toolbar. Use the bottom-left Code button to edit, load or save the source and try F1, Reset definition and Play.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Author directives
: Use the settings below the graph to change the graph kind, axes, grid, curves and points. Use Code at the bottom left to edit the source, load or save a .txt file, toggle the editor toolbar with F1 and apply with Play.

Numeric data (setData)
: Plot numerical elevation measurements with setData(), a dashed reference line and a labelled marker. Add measurements to update the same graph and its automatic axis ranges, then use Reset to restore the initial data.

Line styles and vectors
: Compare solid, dashed, dotted and dash-dot curves with their legend samples and a displacement vector. Use the settings below the graph to edit curve styles, vector endpoints or curve intervals.

Vectors only
: Inspect two successive displacement vectors and their resultant without any function curves. Edit their endpoint coordinates in the settings below the graph.

Step-by-step reveal
: Use Next to reveal A, both curves f1 and f2 together, B, then vector u. Previous hides an entire step; the counter counts four steps and the reference curve stays visible.

Shared points and vectors
: Change a point and press Play to update its vector. Try the axis, grid and sampling assignments; the title, point and vector declarations are also accepted by Geometry.

Named curves
: Compare Cartesian, polar and parametric named curves. Open Code, edit an expression, range or style, then press Play; the interactive settings preserve the named syntax.
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

```js
plot.anim();                    // Get comma-separated names, or JSON for grouped steps.
plot.anim("A,u,Parabola");      // Replace the sequence and return to step zero.
plot.next();                    // Reveal one more object.
plot.previous();                // Hide the last revealed object.
plot.goToEnd();                 // Reveal the whole sequence.
plot.goToStart();               // Hide the whole sequence.
plot.anim("");                 // Show every object and remove the controls.
```

Pass an array for grouped steps, for example `plot.anim(["A", ["f1", "f2"], "B"])`, or pass the equivalent JSON string. The getter returns JSON when groups are present and keeps the comma-separated format for a flat sequence; its result can be passed back to the setter. Arrays are copied when applied.

Whitespace around names is ignored. Names must be unique and match object labels. The JavaScript sequence overrides the source `anim` directive and persists across rerenders. It can be set before connection. Previous and Next stop at the sequence boundaries. The buttons use these same methods.


Call `setData({ title, xLabel, yLabel, series })` to plot numeric measurements without converting them into mathematical expressions. Each series contains a `label` and an array of finite `{ x, y }` points; optional `lineStyle` selects `solid`, `dashed`, `dotted`, or `dash-dot` for both the curve and legend. The existing `dashed: true` shorthand remains supported; an explicit `lineStyle` takes precedence. Separate series are never joined; a series with one point is shown as an isolated sample. Axis ranges are derived from the data. An optional `points` array adds labelled markers (`{ x, y, label, dx?, dy? }`), with label offsets in SVG pixels. An optional `vectors` array accepts `{ label, x, y, dx, dy, lineStyle? }`; both vector origins and endpoints contribute to automatic axis ranges. Use `series: []` to show only vectors. The data can be supplied before connection or updated later; setting `src` returns to declarative source rendering. `tp-map` uses this API for GPX elevation profiles and their minimum/maximum markers.

### API
<!-- tp-docgen:api TpXYPlot -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>axis</code> | <code>&quot;both&quot; \| &quot;horizontal&quot; \| &quot;vertical&quot; \| &quot;none&quot;</code> | <code>&quot;both&quot;</code> | Visible axes and their ticks. |
  | <code>grid</code> | <code>&quot;both&quot; \| &quot;horizontal&quot; \| &quot;vertical&quot; \| &quot;none&quot;</code> | <code>&quot;both&quot;</code> | Visible grid directions; overrides the graph directive when present. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Title displayed at the left of the view toolbar. |
  | <code>no-legend</code> | <code>boolean</code> | <code>false</code> | Hides curve legends. |
  | <code>settings</code> | <code>boolean</code> | <code>false</code> | Shows interactive settings below the graph and its controls. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the src. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-xy-plot>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>anim</code> | <code>anim(): string</code> | Gets reveal order (JSON for groups), or sets comma-separated names, JSON or step arrays. |
  | <code>anim</code> | <code>anim(names: string \| XYAnimationStep[]): void</code> | Anim. |
  | <code>anim</code> | <code>anim(names?: string \| XYAnimationStep[]): string \| undefined</code> | Anim. |
  | <code>exportSvg</code> | <code>exportSvg(): string</code> | Exports the displayed graph with its current viewport, visibility and theme colors. |
  | <code>goToEnd</code> | <code>goToEnd(): void</code> | Reveals all objects in the reveal sequence. |
  | <code>goToStart</code> | <code>goToStart(): void</code> | Hides all objects in the reveal sequence. |
  | <code>next</code> | <code>next(): void</code> | Reveals the next object; stops at the end. |
  | <code>previous</code> | <code>previous(): void</code> | Hides the last revealed object; stops at the start. |
  | <code>setData</code> | <code>setData(data: TpXYPlotData): void</code> | Renders numeric series with automatic axis ranges; separate series preserve gaps. |
  [Public methods of `TpXYPlot`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-xy-plot>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-plot-height</code> | <code>auto</code> | Height of the normal plot including its top and bottom controls; settings remain below. |
  [CSS properties of `<tp-xy-plot>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_xy-plot.TpXYPlot.html)
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
  <script type="module" src="/path/to/components/xy-plot/xy-plot.js"></script>
  ```

import
: ```js
  import "/path/to/components/xy-plot/xy-plot.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/xy-plot/xy-plot.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-xy-plot>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->
<!--
@tp-dependency tp-cluster
@summary Flexible cluster layout component.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-dropdown
@summary Dropdown menu component.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-radio-list
@summary Transforms a list into a group of radio buttons.
-->
<!--
@tp-dependency tp-save-image
@summary Downloads an anchored image as SVG, PNG or WebP.
-->
<!--
@tp-dependency tp-stack
@summary Vertical stack layout component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-cluster>`](../cluster/index.md) : Flexible cluster layout component.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-dropdown>`](../dropdown/index.md) : Dropdown menu component.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-radio-list>`](../radio-list/index.md) : Transforms a list into a group of radio buttons.
- [`<tp-save-image>`](../save-image/index.md) : Downloads an anchored image as SVG, PNG or WebP.
- [`<tp-stack>`](../stack/index.md) : Vertical stack layout component.
- [`<tp-textfield>`](../textfield/index.md) : Single-line and automatically growing multiline text field.
- [`<tp-theme>`](../theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.

### External

<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->

## Appendix: EBNF grammar

This appendix specifies the documented source language accepted by `tp-xy-plot`, using only the common syntax. Older forms remain accepted by the parser but are intentionally excluded from this grammar. It describes authoring syntax, not the JavaScript `setData()` API. Historical parser tolerances (such as ignoring some unknown lines) are not part of this grammar. The semantic rules below are required in addition to the EBNF.

### Source comments

HTML-style comments `<!-- … -->` are ignored outside quoted strings. They may appear before the header, on their own lines, inside an animation list, or after a declaration, and may span several lines. The first `-->` closes the comment; comments do not nest. An unclosed comment produces an error. Comments act as whitespace and preserve line boundaries, so they cannot join tokens or split a single-line declaration across lines. Markers inside strings remain literal text.

```ebnf
comment = "<!--", commentText, "-->" ;
commentText = ? any characters, including newlines, up to the first --> ? ;
```

Comments are removed before applying the document grammar below. In HTML, put source in `<script type="tp/xy-plot">` to preserve comments when editing or saving the source; comments written directly as HTML child nodes are handled by the browser.

### Notation and line structure

In the following grammar, `=` defines a production, `,` concatenates elements, `|` separates alternatives, `[ … ]` means optional, and `{ … }` means zero or more repetitions. Quoted text is literal; `? … ?` describes a lexical token. A semicolon ends an EBNF production; it is **not** a source-language separator.

Use one declaration per line. Leading/trailing whitespace and blank lines are ignored. Spaces or tabs may separate tokens, but must separate a keyword from an identifier (`point A`, for example). Constructor tokens such as `function(` and `vector(` contain no intervening whitespace. Only the bracketed lists of `anim` may span multiple lines. `lineEnd` below means the end of a logical line after those lists have been joined; the final newline is optional.

```ebnf
document = [ header, lineEnd ], declaration,
           { lineEnd, declaration }, [ lineEnd ] ;
header = "xyFunctionGraph" | "xyPolarGraph" | "xyParametricGraph" ;
declaration = titleDeclaration | pointDeclaration | vectorDeclaration
            | curveDeclaration | setting ;
lineEnd = ? logical line boundary ? ;
```

The header is optional when the first declaration is `label =`, `title =`, `point`, `vector`, `curve`, or a setting written with `=`. Without a header, named curves determine the graph kind; otherwise it defaults to Cartesian. All curves in a document must use the same coordinate kind, consistent with any explicit header.

### Common declarations and settings

```ebnf
titleDeclaration = ( "label" | "title" ), "=", jsonString ;
pointDeclaration = "point", identifier, "=", "(", scalar, ",", scalar, ")" ;
vectorDeclaration = "vector", identifier, "=", "vector(",
                    identifier, ",", identifier, ")" ;
curveDeclaration = "curve", identifier, "=", curveConstructor,
                   [ "style", "=", lineStyle ] ;
curveConstructor = "function(", "x", ",", expression, [ curveRange ], ")"
                 | "polar(", "t", ",", expression, [ curveRange ], ")"
                 | "parametric(", "t", ",", expression, ",", expression,
                   [ curveRange ], ")" ;
curveRange = ",", "range", "=", range ;
lineStyle = "solid" | "dashed" | "dotted" | "dash-dot" ;

setting = rangeSetting | ticksSetting | legendSetting | gridSetting
        | crossingSetting | samplesSetting | animationSetting ;
rangeSetting = ( "x-axis" | "y-axis" | "t-axis" | "theta-axis" ),
               "=", range ;
ticksSetting = ( "x-ticks" | "y-ticks" ), "=",
               "[", scalar, { ",", scalar }, "]" ;
legendSetting = ( "legend-x" | "legend-y" ), "=", plainString ;
gridSetting = "grid", "=",
              ( "both" | "horizontal" | "vertical" | "none" ) ;
crossingSetting = ( "x-axis-at" | "y-axis-at" ), "=", scalar ;
samplesSetting = "samples", "=", unsignedInteger ;
animationSetting = "anim", "=",
                   "[", [ animationStep, { ",", animationStep } ], "]" ;
animationStep = jsonString | "[", jsonString, { ",", jsonString }, "]" ;
range = "[", scalar, ",", scalar, "]" ;
```

The constructor `function` selects Cartesian coordinates, `polar` selects polar coordinates, and `parametric` selects parametric coordinates. Polar expressions use the variable `t`; `theta-axis` sets its interval and `t-axis` is an alias in polar graphs. Parametric graphs use `t-axis`. Angles in mathematical expressions are in radians; there are no `deg` suffixes.

### Expressions and lexical tokens

The expression grammar below describes the supported arithmetic subset. Function calls may be nested. `**` denotes exponentiation and associates to the right; `^` and `%` are not supported. A negative base must be parenthesized before exponentiation: `(-2)**2`. Avoid adjacent unary signs such as `--2`, which JavaScript interprets as an increment/decrement operator.

```ebnf
scalar = expression ;
expression = product, { ( "+" | "-" ), product } ;
product = power, { ( "*" | "/" ), power } ;
power = unary | primary, "**", power ;
unary = primary | ( "+" | "-" ), unary ;
primary = number | constant | variable | call | "(", expression, ")" ;
constant = "PI" | "E" ;
variable = "x" | "t" ;
call = unaryFunction, "(", expression, ")"
     | "pow", "(", expression, ",", expression, ")"
     | ( "min" | "max" ), "(", expression, { ",", expression }, ")"
     | "random", "(", ")" ;
unaryFunction = "abs" | "acos" | "acosh" | "asin" | "asinh" | "atan" | "atanh"
              | "ceil" | "cos" | "cosh" | "exp" | "floor" | "log" | "round"
              | "sin" | "sinh" | "sqrt" | "tan" | "tanh" ;

identifier = letterOrUnderscore, { letterOrUnderscore | digit } ;
letterOrUnderscore = ? ASCII A–Z, a–z, or underscore ? ;
digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
nonzeroDigit = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
unsignedInteger = "0" | nonzeroDigit, { digit } ;
number = ( unsignedInteger, [ ".", { digit } ] | ".", digit, { digit } ),
         [ ( "e" | "E" ), [ "+" | "-" ], digit, { digit } ] ;
jsonString = ? double-quoted JSON string, including JSON escape sequences ? ;
plainString = '"', { plainCharacter }, '"' ;
plainCharacter = ? any character except double quote, CR, or LF; no escape processing ? ;
```

Names and keywords are case-sensitive. Named declarations use identifiers such as `A`, `f1`, or `velocity_2`. `label`, `title` assignments and `anim` use JSON strings; legends use plain double-quoted strings. Arrays do not have trailing commas.

### Semantic rules and current limits

- Scalar contexts (coordinates, ticks, ranges and axis crossings) use constants and mathematical functions, without `x` or `t`. Their results must be finite. Curve expressions use only `x` for Cartesian graphs or `t` for polar/parametric graphs. Object names do not introduce mathematical variables or callable functions.
- Every range has two finite bounds with the lower bound strictly smaller than the upper bound. `samples` is an integer of at least two. `x-axis-at` is a y-coordinate within `y-axis`; `y-axis-at` is an x-coordinate within `x-axis`.
- Declare at most one figure title. Use unique names across points, vectors and curves. Each endpoint of a named vector must name an existing point; forward references are allowed because endpoints are resolved after reading all declarations.
- Each animation name must identify an existing object and occur only once in the sequence. A string is one step; a nonempty inner list reveals its objects together. Deeper nesting is not supported. `anim = []` disables step controls.
- A document must define at least one curve, point or vector. A points-only or vectors-only construction is valid.
- Semicolon-separated declarations, user-defined variables/functions, and geometry constructions such as circles or intersections are not supported by this language. The shared syntax with `tp-graph-geometry` covers titles, free points and vectors; it does not make the two languages interchangeable.

### Complete example

This source uses the common syntax and reveals `A`, then both curves in the same step, then `B` and finally the vector. `O` remains visible because it is not listed in `anim`.

```text
<!-- Curves f1 and f2 are revealed together. -->
label = "Grouped animation"
x-axis = [-PI, PI]
y-axis = [-2, 2]
grid = both
samples = 256
point O = (0, 0)
point A = (-PI, 0)
point B = (PI, 0)
vector u = vector(O, B)
curve f1 = function(x, sin(x), range=[-PI, PI])
curve f2 = function(x, cos(x), range=[-PI, PI]) style=dashed
anim = ["A", ["f1", "f2"], "B", "u"]
```
