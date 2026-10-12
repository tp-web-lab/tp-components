# <tp-icon name="xy-plot" library="components" size="1.25em"></tp-icon> XY plot

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-xy-plot>` element implements the <tp-icon name="xy-plot" library="components" size="1.25em"></tp-icon> XY plot functionality: xY graph rendering component.

<tp-xy-plot>
    <script type="tp/xy-plot">
      xyFunctionGraph
        title "Functions"
        x-axis [-10,10]
        y-axis [-5,5]
        functions [["Sine", "2*sin(x)"], ["Line", "x/2"]]
    </script>
  </tp-xy-plot>

## Usage

The top-right toolbar contains Zoom in (+), Zoom out (−), Reset view (refresh), Graph settings (when enabled), then Zoom graph to open the enlarged view.

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Zoom in (+) / Zoom out (−) | Magnify or widen the coordinate ranges around the graph center, in both the preview and enlarged view. Keep the current animation step. |
| Reset view (refresh) | Restore the original scale and position without changing the animation step. |
| Drag the graph (mouse or touch) | Move the drawing horizontally and vertically. Center a point of interest before zooming in. |
| Graph settings (gear) | Show or hide the settings panel below the graph. |
| Settings fields | Update the graph and enlarged view; invalid entries retain the last valid graph and show feedback. |
| Start / Previous / Next / End | Return to zero revealed objects, hide the last revealed object, reveal the next object, or reveal all objects. The counter shows the current step and total. |
| Reset | Restore the original graph definition and settings. |
| Zoom graph (outward arrows) | Open the enlarged graph. |
| Close zoomed graph (inward arrows) | Close the enlarged graph and return to the preview. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Enter / Space | Activate the focused button, including Zoom in, Zoom out, Graph settings and Reset. |
| Arrow keys on the focused graph | Move the drawing in the arrow direction by 10% of the visible range. |
| Home on the focused graph | Restore the original scale and position. |
| Escape | Close the enlarged graph. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Dynamic zoom

The + and − buttons change the scale around the center of the current graph. Each + click multiplies magnification by 1.25; − reverses one step. Twelve steps are available in either direction from the initial view. Curves are resampled and automatic ticks are recalculated, while labels keep their size. Explicit curve intervals remain respected; numeric datasets are never extrapolated.

Drag the graph to place a point of interest at the center, then use + to zoom around it. The refresh button restores both the original scale and position. Keyboard users can focus the graph with Tab, pan with the arrow keys and reset with Home.

Both views share the same zoom, position and animation state. Applying a new graph definition or dataset resets the zoom. Returning to the initial scale restores any custom ticks. Explicit axes outside the visible range disappear, with graduations placed along the frame.

### Display attributes

`grid="both|horizontal|vertical|none"` chooses grid directions (default `both`). When present, it overrides the graph definition’s `grid` directive; removing it restores that directive. `axis="both|horizontal|vertical|none"` chooses visible axes (default `both`). Hiding an axis also hides its ticks, numeric graduations and axis label, independently of the grid. The plot frame remains visible.

The boolean `no-legend` attribute hides curve legends (default `false`). These attributes update both views immediately without changing the current animation step. JavaScript properties are `grid`, `axis` and `noLegend`.

### Step-by-step reveal

Add `anim ["A", "u", "Sine"]` to reveal those named points, vectors or functions in that order. Objects not listed remain visible from initialization. At step `0 / 3`, all listed objects are hidden. Each Next action reveals one more; Previous hides the last one. Start returns to `0 / 3` and End reveals everything. Curve legend entries follow their curves, including in the enlarged view. Axes, colors and framing stay stable throughout.

Omitting `anim`, or using `anim []`, displays everything without progression controls. Names must match labels exactly, be nonempty and occur only once in the list; unknown names are reported as errors. Objects sharing a label are revealed together. The list can span several lines. Applying a new definition in Graph settings restarts at step zero.

### Author directives

A graph is a text definition, supplied in a `<script type="tp/xy-plot">` inside the component, as plain inline text, or through the component's `src` attribute. The first line selects the graph kind; the following lines declare its settings. These are graph-language directives, not HTML attributes.

#### Graph kind and coordinates

| First line | Curves | Expression variable | Default sampling domain |
| --- | --- | --- | --- |
| `xyFunctionGraph` | Cartesian functions `y = f(x)` | `x` | The horizontal range `x-axis` |
| `xyPolarGraph` | Polar functions `r = f(t)` | `t`, an angle in radians | `theta-axis [0, 2*PI]` |
| `xyParametricGraph` | Parametric curves `(x(t), y(t))` | `t` | `t-axis [0, 2*PI]` |

`x-axis` and `y-axis` always describe the visible Cartesian coordinate ranges, including for polar and parametric graphs.

#### Available declarations

| Declaration | Example | Meaning and default when omitted |
| --- | --- | --- |
| `title` | `title "Functions"` | Chart title. No title by default. |
| `legend-x` | `legend-x "Distance (m)"` | Horizontal axis label. No label by default. |
| `legend-y` | `legend-y "Altitude (m)"` | Vertical axis label. No label by default. |
| `x-axis` | `x-axis [-1, 6]` | Visible horizontal range; default `[-10, 10]`. Use increasing, distinct bounds. |
| `y-axis` | `y-axis [-5, 25]` | Visible vertical range; default `[-10, 10]`. Use increasing, distinct bounds. |
| `x-ticks` | `x-ticks [-1, 0, 1, 2, 3, 4, 5, 6]` | Horizontal tick coordinates and vertical grid positions. Default: nine evenly spaced ticks. |
| `y-ticks` | `y-ticks [-5, 0, 1, 4, 9, 16, 25]` | Vertical tick coordinates and horizontal grid positions. Default: nine evenly spaced ticks. |
| `grid` | `grid horizontal` | `both` (default), `horizontal`, `vertical`, or `none`. Does not remove ticks, axes or the plot border. |
| `x-axis-at` | `x-axis-at 0` | **y coordinate** of the horizontal axis. Its ticks and label follow it. |
| `y-axis-at` | `y-axis-at 0` | **x coordinate** of the vertical axis. Its ticks and label follow it. |
| `samples` | `samples 512` | Number of samples per curve; default `512`. Use an integer of at least 2. |
| `functions` | `functions [["Parabola", "x*x"]]` | Curve definitions (optional when vectors are supplied); see the forms below. No curves are defined by default. |
| `anim` | `anim ["A", "u", "Sine"]` | Ordered names to reveal progressively; default `[]`. |
| `vectors` | `vectors [["u", 0, 0, 3, 2]]` | Vectors defined by an origin and Cartesian components; default `[]`. May be displayed without curves. |
| `points` | `points [["A", 2, 4, 10, 10], ["B", 5, 25]]` | Optional labelled markers; default `[]`. Coordinates are Cartesian in every graph kind. |
| `t-axis` | `t-axis [0, 2*PI]` | Parameter range for parametric graphs; default `[0, 2*PI]`. Also accepted as an alias of `theta-axis` for polar graphs. |
| `theta-axis` | `theta-axis [0, PI]` | Angular sampling range for polar graphs; default `[0, 2*PI]`. Has no effect on other graph kinds. |

Axis positions must be finite and within the visible range. Without `x-axis-at` and `y-axis-at`, ticks and labels stay on the bottom and left edges; zero axes are drawn when zero lies inside the corresponding range. For `x-axis [-1, 6]` and `y-axis [-5, 25]`, use `x-axis-at -5` and `y-axis-at -1` to put the axes along those edges.

A point has the form `["label", x, y]` or `["label", x, y, dx, dy]`. The optional offsets position the label in SVG units: positive `dx` moves right, positive `dy` moves down. Their defaults are `8` and `-8`. Points outside the visible ranges are not drawn.

#### Curves and optional intervals

Cartesian and polar graphs accept either a list of quoted expressions or labelled entries:

```text
functions ["sin(x)", "cos(x)"]
functions [["Sine", "sin(x)"], ["Cosine", "cos(x)"]]
functions [["Sine segment", "sin(x)", [-PI/2, PI/2]], ["Line", "x/2"]]
```

For a polar graph, use `t` instead of `x`, for example `functions [["Semicircle", "2", [0, PI]]]`.

Parametric graphs accept pairs of expressions, with an optional label and an optional final interval:

```text
functions [["cos(t)", "sin(t)"]]
functions [["Circle", "cos(t)", "sin(t)"]]
functions [["Arc", "cos(t)", "sin(t)", [0, PI]]]
```

Each interval must have finite, strictly increasing bounds. Both endpoints are sampled. Without an interval, a Cartesian curve spans the full horizontal grid; polar and parametric curves use their global parameter range. Cartesian intervals are intersected with `x-axis`; an interval wholly outside it produces no curve. Per-curve intervals never change the visible axes.

`functions`, `vectors` and `points` lists may span multiple lines. Strings use double quotes; embedded double quotes are not supported. Use commas between values and between entries.

#### Line styles

Labelled curves accept a style after their expression(s), before the optional interval: `solid` (default), `dashed`, `dotted`, or `dash-dot`. The legend uses the same style.

```text
functions [["Sine", "sin(x)", "dashed"], ["Cosine", "cos(x)", "dotted", [0, PI]]]
```

For a labelled parametric curve, use `["Circle", "cos(t)", "sin(t)", "dash-dot"]`. Polar curves use the same form as Cartesian curves with expressions in `t`. Existing definitions without a style remain solid.

#### Vectors

A vector has the form `["label", x, y, dx, dy]`, optionally followed by a quoted line style. Its origin is `(x, y)` and its arrowhead is at `(x + dx, y + dy)`. These are Cartesian mathematical coordinates for every graph kind; `dx` and `dy` are vector components, unlike point-label offsets. Labels appear beside the arrowhead. Vectors are clipped to the visible plot; a zero vector appears as a dot.

```text
xyFunctionGraph
  x-axis [-1, 5]
  y-axis [-1, 5]
  vectors [["u", 0, 0, 3, 2], ["v", 3, 2, -1, 2, "dashed"]]
```

Vectors may accompany curves or be displayed alone, with `functions` omitted or set to `[]`. Coordinates and components accept scalar expressions such as `sqrt(2)` and must be finite. Edit vectors in the Graph settings panel alongside curves and points.

#### Mathematical expressions

Curve expressions, range bounds, ticks, axis positions and point coordinates/offsets accept arithmetic (`+`, `-`, `*`, `/`, `**`, parentheses), constants `PI` and `E`, and these functions:

`abs`, `acos`, `acosh`, `asin`, `asinh`, `atan`, `atanh`, `ceil`, `cos`, `cosh`, `exp`, `floor`, `log`, `max`, `min`, `pow`, `random`, `round`, `sin`, `sinh`, `sqrt`, `tan`, `tanh`.

Angles are in radians; `log` is the natural logarithm. Write powers as `x*x`, `x**2`, or `pow(x, 2)`, not `x^2`. Only curve expressions have access to their variable (`x` or `t`). For `samples`, use a plain integer. Invalid or non-finite curve samples are skipped.

#### Complete Cartesian example

```html
<tp-xy-plot>
  <script type="tp/xy-plot">
    xyFunctionGraph
      title "Parabola and secant"
      legend-x "x"
      legend-y "f(x)"
      x-axis [-1, 6]
      y-axis [-5, 25]
      x-ticks [-1, 0, 1, 2, 3, 4, 5, 6]
      y-ticks [-5, 0, 1, 4, 9, 16, 25]
      grid horizontal
      x-axis-at 0
      y-axis-at 0
      samples 512
      functions [
        ["Parabola", "x*x"],
        ["Secant", "7*x - 10", [2, 5]]
      ]
      points [["A", 2, 4, 10, 10], ["B", 5, 25]]
  </script>
</tp-xy-plot>
```

Add the boolean `settings` attribute (`<tp-xy-plot settings>`) to offer the built-in settings panel. Its gear button opens or closes the panel below the graph. The **Author directives** example below uses this attribute to expose every setting, switch between all three graph kinds and display the generated definition. Clear an optional field to omit its directive and restore its default behavior.

**Reset** restores the original inline or loaded definition. Changing `src` establishes a new original definition; hiding the panel or removing `settings` retains the current graph. Settings are local to each component. The panel supports declarative graphs; its button is disabled for numeric series supplied with `setData()`. Interactive sampling is limited to 4096 samples per curve, or the original sample count if higher.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Inspect the plotted data and the chart’s axes.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Author directives
: Open the built-in Graph settings panel to change the graph kind, axes, grid, sampling, curves and labelled points. Inspect the generated definition or use Reset to restore the starting graph.

Numeric data (setData)
: Plot numerical elevation measurements with setData(), a dashed reference line and a labelled marker. Add measurements to update the same graph and its automatic axis ranges, then use Reset to restore the initial data.

Line styles and vectors
: Compare solid, dashed, dotted and dash-dot curves with their legend samples and a displacement vector. Open Graph settings to edit styles, components or curve intervals.

Vectors only
: Inspect two successive displacement vectors and their resultant without any function curves. Edit their origins and components in Graph settings.

Step-by-step reveal
: Use Next to reveal a point, a vector and a curve in order. Try Previous, Start and End, and compare the enlarged view; the reference curve stays visible throughout.
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
plot.anim();                    // Get the comma-separated names.
plot.anim("A,u,Parabola");      // Replace the sequence and return to step zero.
plot.next();                    // Reveal one more object.
plot.previous();                // Hide the last revealed object.
plot.goToEnd();                 // Reveal the whole sequence.
plot.goToStart();               // Hide the whole sequence.
plot.anim("");                 // Show every object and remove the controls.
```

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
  | <code>no-legend</code> | <code>boolean</code> | <code>false</code> | Hides curve legends. |
  | <code>settings</code> | <code>boolean</code> | <code>false</code> | Shows a button for editing the graph definition in a panel below the plot. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Controls the src. |
  [Attributes of `<tp-xy-plot>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>anim</code> | <code>anim(): string</code> | Gets the comma-separated reveal order, or sets it and returns to the start. |
  | <code>anim</code> | <code>anim(names: string): void</code> | Anim. |
  | <code>anim</code> | <code>anim(names?: string): string \| undefined</code> | Anim. |
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
  | None. |  |  |
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
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->
<!--
@tp-dependency tp-radio-list
@summary Transforms a list into a group of radio buttons.
-->
<!--
@tp-dependency tp-stack
@summary Vertical stack layout component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-cluster>`](../cluster/index.md) : Flexible cluster layout component.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-radio-list>`](../radio-list/index.md) : Transforms a list into a group of radio buttons.
- [`<tp-stack>`](../stack/index.md) : Vertical stack layout component.
- [`<tp-textfield>`](../textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
