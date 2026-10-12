# <tp-icon name="graph-geometry" library="components" size="1.25em"></tp-icon> Geometry

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-geometry>` element implements dynamic ruler and compass constructions. Points, lines, segments, circles and arcs preserve their construction dependencies when a point moves. No equations or function plots are exposed.

<tp-graph-geometry></tp-graph-geometry>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Move | Drag a free point freely or slide an attached point along its support. Drag empty space to pan the whole drawing. Intersection points are calculated and cannot be dragged. |
| Pan view | Drag anywhere, including over a point, to move the entire view without changing the construction. Middle-button dragging also pans in any tool. |
| Scroll / Shift + scroll | Scroll vertically or horizontally with the mouse wheel or trackpad. Shift + vertical scrolling pans horizontally. Scrolling outside the drawing still scrolls the page. |
| Grid | Toggle a light grid that follows panning and zooming, with no axes, origin marker or graduations. The grid starts hidden and does not snap points. |
| Point | Click the drawing to create a free point. |
| Point on object | Click a line, segment, circle or arc to create a sliding point. |
| Segment / Line | Select two existing points, either in the drawing or in the object list. |
| Circle · radius | Enter a positive radius or a transferred length such as `distance(A, B)`, then select the centre point. |
| Circle · through point | Select the centre, then a point the circle must pass through. |
| Arc | Enter start and end angles, then select the supporting circle. The circle outline is hidden; further arcs can use that circle via the object list. |
| Intersection | Select two supports. All currently existing distinct intersections are created. |
| Object list | Select an object, including a hidden supporting circle. With a construction tool active, use the object as input to the tool. |
| Delete selected + dependents | Remove the selected object and its dependent constructions as one undoable action. |
| Undo / Redo | Undo or redo one construction change or point movement. |
| − / + / Fit | Zoom or fit the finite visible objects into the drawing. |
| Perpendicular bisector / New construction | Load the example or start an empty construction. Undo restores the previous construction. |
| Construction source / Apply construction | Edit and apply the construction commands. Invalid commands leave the previous figure unchanged. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between tools, parameters, object buttons, drawing and source controls. |
| Enter / Space | Activate a focused button or expand/collapse the Construction source accordion. Selecting an object in Move mode focuses the drawing. |
| Arrow keys on the drawing | In Pan view, pan by 40 drawing pixels. Otherwise move the selected free or attached point by 0.2 units before projection onto its support. |
| Shift + arrow keys | In Pan view, pan by 8 drawing pixels. Otherwise use a smaller point step of 0.02 units. |
| Escape on the drawing | Cancel the pending selection and return to Move. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

An empty component initially shows a perpendicular bisector. Use New construction for a blank drawing. Supply plain text content or a `script` with type `tp/geometry` to author a different construction; set the JavaScript `value` property to an empty string for an initially empty construction.

```html
<tp-graph-geometry>
  <script type="tp/geometry">
    point O = (0, 0)
    point A = (3, 4)
    circle c = circle(O, through=A)
    point P = on(c, angle=30deg)
  </script>
</tp-graph-geometry>
```

Use `src` to load a UTF-8 text file containing these same commands (without an HTML wrapper):

```html
<tp-graph-geometry src="/docs/components/graph-geometry/examples/circle.geometry"></tp-graph-geometry>
```

A nonempty `src` takes precedence over inline content at initialization. Relative URLs resolve against the document base URL. Changing `src` loads a new construction and fits the view; removing or clearing it cancels a pending load and keeps the current figure. Successful loads can be undone. HTTP, network and syntax errors are announced and emit `tp-geometry-error`; the last valid figure remains intact. Files served from another origin require CORS permission. File contents are parsed as construction commands, never executed as JavaScript.

Coordinates only place free points initially. Lengths are construction units, independent of zoom. No axes or graduations are shown. The optional grid follows the construction plane without snapping points. Add the boolean `grid` attribute or use the Grid button to show it. Panning and scrolling change only the view, never the construction source or its undo history. Fit restores a centred view. View navigation and the grid remain available in readonly mode.

| Command | Meaning |
| --- | --- |
| `point A = (0, 0)` | Free point. |
| `line d = line(A, B)` | Infinite line through two points. |
| `segment s = segment(A, B)` | Finite segment. |
| `circle c = circle(O, 5)` | Fixed radius of five units. |
| `circle c = circle(O, through=A)` | Circle through A, following both O and A. |
| `circle c = circle(O, distance(A, B))` | Transfer the current length AB. |
| `point P = on(c, angle=30deg)` | Sliding point on a circle or arc. |
| `point Q = on(d, t=0.5)` | Sliding point halfway along the defining points. A line allows any parameter; a segment clamps it to 0–1. |
| `arc a = arc(c, start=20deg, end=100deg)` | Counterclockwise arc of a supporting circle. Add `direction=cw` for clockwise. |
| `arc a = arc(c, start=40deg, end=80deg, relative-to=s)` | Arc oriented relative to the segment from its first point to its second point. |
| `point I = intersection(a, b, branch=0)` | Dependent intersection of lines, segments, circles or arcs. |

Append `hidden` to keep an object as a support without drawing it. Use one command per line; `#` starts a comment. Names begin with a Latin letter and may contain letters, digits and underscores. Forward references are accepted; duplicate names, unknown supports and dependency cycles are rejected. Source is normalized after changes, so comments are not retained.

`branch=0` and `branch=1` retain their identities when clipping to arcs or segments. For two circles, branch 0 lies to the left of the direction from the first centre to the second; branch 1 lies to its right. For a line and a circle, branch 0 comes first along the line's defining direction. A pair of lines only has branch 0. At a tangency both circular branches occupy the same point; the mouse tool creates it once. Coincident supports do not define a unique intersection.

Undefined constructions and their dependents are hidden and listed with a diagnostic. They reappear when their supports permit the construction again. Arcs have distinct start/end angles and span less than a full turn. Arc endpoints defined by named points, automatic labels for lengths, and equation plotting are not part of this initial version.

### Perpendicular bisector

The default example constructs four arcs with radius AB: two around A and two around B. Their intersections C and D define the bisector. All arc angles are relative to the oriented segment AB, so the construction also follows rotation. If A and B coincide, the dependent objects become undefined until the points separate.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Drag A or B and observe the arcs, intersections and perpendicular bisector follow the segment.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Attached points
: Move the centre O and slide P around its circle or Q along its line. The fixed-radius circle and attached points keep their construction relationships.

Arc only
: Inspect a single visible arc with its circle hidden, then drag the centre to move the arc.

From a file
: Load a construction from a local text file, then move O or slide P along the circle. The file uses the same commands as the construction editor.
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

The component extends `TpBase`. It has its own geometric dependency model rather than storing figures as generic graph edges. The module is exported by the library and discoverable by `tp-loader`.

Set `value` or call `setConstruction(source)` to replace a construction atomically. Call `analyze()` for a detached snapshot containing `values` and `errors` maps. The pure `parseGeometry`, `evaluateGeometry`, and `serializeGeometry` functions are also exported. Programmatic source replacement is allowed in readonly mode; readonly blocks user editing, undo/redo and deletion.

### API
<!-- tp-docgen:api TpGraphGeometry -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>grid</code> | <code>boolean</code> | <code>false</code> | Shows a light grid without axes or graduations. |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Prevents changes to the construction. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of a text file containing construction commands. |
  [Attributes of `<tp-graph-geometry>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>analyze</code> | <code>analyze(): GeometryResult</code> | Returns a detached snapshot of computed objects and undefined-object diagnostics. |
  | <code>redo</code> | <code>redo(): void</code> | Redoes one construction change. |
  | <code>removeObject</code> | <code>removeObject(id: string): void</code> | Removes an object and every construction depending on it, as one undoable action. |
  | <code>setConstruction</code> | <code>setConstruction(source: string): void</code> | Atomically replaces the construction; invalid source leaves the previous figure intact. |
  | <code>undo</code> | <code>undo(): void</code> | Undoes one construction change. |
  [Public methods of `TpGraphGeometry`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-geometry-change</code> | <code>&#123; source: string; undefined: string[] &#125;</code> | Fired after a construction change; detail contains source and undefined object names. |
  | <code>tp-geometry-error</code> | <code>&#123; message: string &#125;</code> | Fired when a file cannot be loaded or source cannot be parsed; detail contains message. |
  [Events emitted by `<tp-graph-geometry>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-graph-geometry>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_graph-geometry.TpGraphGeometry.html)
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
  <script type="module" src="/path/to/components/graph-geometry/graph-geometry.js"></script>
  ```

import
: ```js
  import "/path/to/components/graph-geometry/graph-geometry.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/graph-geometry/graph-geometry.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-graph-geometry>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-accordion
@summary Collapsible multi-panels element.
-->
<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-button-group
@summary Button group component for organizing multiple buttons.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->

- [`<tp-accordion>`](../accordion/index.md) : Collapsible multi-panels element.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-textfield>`](../textfield/index.md) : Single-line and automatically growing multiline text field.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
