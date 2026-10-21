# <tp-icon name="graph-geometry" library="components" size="1.25em"></tp-icon> Geometry

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-graph-geometry>` element implements dynamic ruler and compass constructions. Points, lines, segments, rays, vectors, circles, arcs, angular sectors, polygons and comments preserve their construction dependencies when a point moves. No equations or function plots are exposed.

<tp-graph-geometry></tp-graph-geometry>

## Usage

### Shared points, vectors and title

Both plot components accept this exact source:

```text
label = "Points and vectors"
point O = (0, 0)
point A = (3, 4)
vector u = vector(O, A)
```

Use `label = "..."` (or `title = "..."`) for the figure title. Applying a source title updates the figure label, as with other Geometry constructions. Points use `point NAME = (x, y)`; vectors use `vector NAME = vector(START, END)`. Each name must be unique. Editing an endpoint and applying the source recomputes its vectors. This first shared subset covers free points and vectors between points; attached points and geometric constructions remain specific to Geometry.


Set `style="--tp-plot-height:440px"` to give the normal plot a fixed height, including its top and bottom controls. Both plot components support this property, so figures in cards can share the same height. Settings and other authoring panels remain outside this area; the enlarged view keeps its own dimensions. The code view scrolls within the available area. Omit the property to keep automatic sizing.

### User interactions

Use `label="My figure"` to title the drawing. With `canvas-only`, the action palette, Save image, local Theme and Zoom drawing controls remain at the top right; Undo, Redo, Zoom out, Zoom in, Fit and Grid stay at the bottom right. The object list and main tool strip are hidden. The `</>` button at the bottom left switches between the drawing and Construction source, including its file menu, F1, Reset and Play controls. Switching preserves the figure and unapplied editor text, including in the zoomed window. Choosing a construction tool reveals its help and parameters within the drawing panel. `readonly` still prevents construction changes.

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Theme | Choose Light, Dark or Auto for this component only. The switcher remains available in canvas-only mode. |
| Action icons | Select a construction tool. Each 24×24 SVG depicts the action; its tooltip gives the name and shortcut. The selected tool is highlighted. An outlined information callout shows the icon, action heading and instructions. |
| Actions palette | Open the keyboard-icon menu of available tools, with icon, name and shortcut. Groups follow the tool strip order, separated by horizontal dividers. Scroll within the menu when space is limited. Extra tools require `built-in`. |
| Zoom drawing | Enlarge the live drawing in a modal window; points, measurements, tools and view controls remain interactive. Close restores the same construction. |
| Move | Drag a measurement label to place it independently while keeping it attached to its supports. Drag a free point freely or slide an attached point along its support. Drag empty space to pan the whole drawing. Intersection and midpoint constructions are calculated and cannot be dragged. |
| Pan view | Drag anywhere, including over a point, to move the entire view without changing the construction. Middle-button dragging also pans in any tool. |
| Scroll / Shift + scroll | Scroll vertically or horizontally with the mouse wheel or trackpad. Shift + vertical scrolling pans horizontally. Scrolling outside the drawing still scrolls the page. |
| Grid | Toggle a light grid that follows panning and zooming, with no axes, origin marker or graduations. The grid starts hidden and does not snap points. |
| Point | Click the drawing to create a free point. |
| Point on object | Click a line, segment, ray, vector, circle or arc to create a sliding point. |
| Segment / Line / Ray / Vector | Select two existing points, either in the drawing or in the object list. For a ray or vector, select the origin first. |
| Segment · length | Enter a positive numeric length in Radius / length, then select the origin and a direction point. The segment endpoint follows that direction at the imposed distance. |
| Angular sector | Enter start and end angles, then select a circle. A filled sector includes the centre, both radii and the circular boundary. |
| Measure length | Select two points, or select a segment, vector, arc, circle, polygon or sector. Closed shapes show their perimeter; an arc shows its curved length. |
| Measure area | Select a circle, simple polygon or angular sector to display its enclosed area. |
| Measure angle | Select two sides to mark their angle with an arc and its value, or a small square without a value for a right angle. Alternatively select three points: first arm, vertex, second arm, to display a numeric measurement. |
| Comment | Enter Comment text and click anywhere to place a free annotation, or click a point to attach it. Drag the annotation in Move mode to reposition it. |
| Midpoint / Perpendicular bisector · direct (`built-in`) | Select a segment to construct its midpoint or perpendicular bisector. |
| Perpendicular / Parallel (`built-in`) | Select a point, then a line, segment, ray or vector. |
| Angle bisector (`built-in`) | Select three points in order: first arm, vertex, second arm. Construct the internal angle bisector as a line. |
| Transformation (`built-in`) | Choose Create a copy (default) to add an image, or Transform the object to replace the selected object without adding another object. |
| Axial symmetry (`built-in`) | Select an object, then a line, segment, ray or vector as its axis. Create a reflected image. |
| Central symmetry (`built-in`) | Select an object, then its centre point. Create an image on the opposite side of that centre. |
| Homothety (`built-in`) | Set Ratio (default 2, nonzero), select an object, then its centre point. Negative ratios also place the image on the opposite side. |
| Rotation (`built-in`) | Set Rotation angle (°), default 90, select an object, then its centre point. Positive angles turn counterclockwise; negative angles turn clockwise. |
| Translation (`built-in`) | Select an object, then a vector. Create its image with that displacement. |
| Polygon (`built-in`) | Click empty space to create successive vertices, or select existing points. Close by selecting the first vertex after at least three vertices, or use Finish polygon. |
| Regular polygon (`built-in`) | Set Sides to an integer from 3 to 360, then click or select two consecutive vertices. The polygon turns counterclockwise from this first edge. |
| Finish polygon (`built-in`) | Complete the pending irregular polygon; enabled after three vertices. The new points and polygon form one undoable change. |
| Tangents (`built-in`) | Select a point, then a circle. Create two tangents outside, one on the circumference, or announce that none exists inside. |
| Circle · radius | Enter a positive radius or a transferred length such as `distance(A, B)`, then select the centre point. |
| Circle · through point | Select the centre, then a point the circle must pass through. |
| Arc | Enter start and end angles, then select the supporting circle. The circle outline is hidden; further arcs can use that circle via the object list. |
| Intersection | Select two supports. All currently existing distinct intersections are created. |
| Save image | Open the format menu and save the current view as SVG (default, first item), PNG or WebP. The export includes the visible grid, colors and stroke styles. |
| Style | In Move mode, select an object and choose hidden, dotted, dashed or solid (default). Hidden objects remain available in the object list and keep their dependencies. |
| Color | Choose a library palette color for the selected object, or Automatic to restore its normal color. |
| Object list | Select an object, including a hidden supporting circle. With a construction tool active, use the object as input to the tool. |
| Delete selected + dependents | Remove the selected object and its dependent constructions as one undoable action. |
| Undo / Redo | Undo or redo one construction change or point movement. |
| − / + / Fit | Zoom or fit the finite visible objects into the drawing. |
| New construction | Start an empty construction. Undo restores the previous construction. |
| Construction source > Load | Choose a local `.txt` construction file. A valid construction replaces the drawing and can be undone; invalid files leave it unchanged. Disabled in readonly mode. |
| Construction source > Save | Save the current editor text, including edits not yet applied. The first save asks for a destination; later saves reuse it where supported, or download the file again. |
| Construction source > Save as | Choose a new destination or download filename. Cancelling preserves the previous destination. |
| `</>` in canvas-only mode | Replace the drawing with Construction source, or return to the drawing without applying draft edits. Play applies the source before returning to the drawing with `</>`. |
| Construction source > F1 / Reset | Show or hide the editor toolbar / restore the source of the displayed construction without changing the figure. |
| Construction source > Play | Edit and apply the construction commands. Invalid commands leave the previous figure unchanged. |
| Double-click an object in Move or Pan view | Open an Object name field at the clicked position. |
| Animation name | Choose a named animation and restart it at step zero. The first declared animation is selected initially. |
| Start / Previous / Next / End animation | Return to the initial view, hide the last step, reveal the next step, or show the complete sequence. A grouped step is shown or hidden together. |
| Hide name in Construction objects | Toggle visibility of the selected object’s name while keeping its geometry visible. Press again to show the name. |
| Rename in Construction objects | Apply a unique object name and update dependent references. |
| Drag an object name / Move name | Reposition the name independently of the object; Move name also enables arrow-key positioning. |

#### Keyboard interactions

Tool shortcuts apply while focus is inside the figure and never intercept typing in fields or the source editor. They affect only the focused component.

| Key or gesture | Result |
| --- | --- |
| Enter / Space on Rename, Move name or Hide name | Apply the edited name, enable name positioning, or toggle name visibility. |
| Enter / Space on animation controls | Choose an animation or move through its steps; available in readonly mode. |
| F2 on the drawing | Open the inline name field for the selected object. |
| Enter / Escape in the inline name field | Rename the object / cancel editing. Leaving the field also cancels. Invalid or duplicate names keep the field open with an error. |
| Tab / Shift+Tab | Move between tools, parameters, object buttons, drawing and source controls. |
| Enter / Space | Activate a focused button or expand/collapse the Construction source accordion. Selecting an object in Move mode focuses the drawing. |
| F1 | Inside Construction source, show or hide the editor toolbar. Elsewhere, open or close the action palette. Use Up/Down, Home/End to navigate and Enter/Space to choose a tool. |
| Z / Escape in the zoomed window | Enlarge or restore the drawing with Z; Escape closes the window. |
| Delete | Remove the selected object and its dependent constructions as one undoable action (except in readonly mode). |
| Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z | Undo / redo a construction change. |
| − / + / F / G | Zoom out / zoom in / fit the drawing / toggle the grid. |
| Arrow keys in canvas-only mode | Move the selected point, comment, measurement or name (with Move name enabled); when nothing is selected, or in readonly mode, pan the view. |
| Arrow keys on the drawing | In Pan view, pan by 40 drawing pixels. With Move name enabled, move the selected object name. Otherwise move the selected comment, measurement label, free or attached point by 0.2 units before projection onto its support. |
| Shift + arrow keys | In Pan view, pan by 8 drawing pixels. Otherwise use a smaller point step of 0.02 units. |
| Enter on the drawing | Finish a pending irregular polygon with at least three vertices. |
| Escape on the drawing | Cancel the pending selection, discard uncommitted polygon vertices and return to Move. |
| ArrowUp / ArrowDown, Home / End in a menu | Move between export formats, stroke styles or colors. |
| Enter / Space in a menu | Save the chosen format or apply the selected style or color. |
| Escape in a menu | Close the menu. |
| V | Select Move. |
| H | Select Pan view. |
| P | Select Point. |
| Shift+P | Select Point on object. |
| S | Select Segment. |
| L | Select Line. |
| Shift+S | Select Segment · length. |
| R | Select Ray. |
| W | Select Vector. |
| E | Select Angular sector. |
| T | Select Comment. |
| D | Select Measure length. |
| A | Select Measure area. |
| Shift+A | Select Measure angle. |
| C | Select Circle · radius. |
| Shift+C | Select Circle · through point. |
| B | Select Arc. |
| I | Select Intersection. |
| M | Select Midpoint (requires `built-in`). |
| Shift+L | Select Perpendicular (requires `built-in`). |
| J | Select Parallel (requires `built-in`). |
| Shift+M | Select Perpendicular bisector · direct (requires `built-in`). |
| Shift+B | Select Angle bisector (requires `built-in`). |
| Shift+T | Select Tangents (requires `built-in`). |
| N | Select Polygon (requires `built-in`). |
| Shift+N | Select Regular polygon (requires `built-in`). |
| X | Select Axial symmetry (requires `built-in`). |
| Shift+X | Select Central symmetry (requires `built-in`). |
| K | Select Homothety (requires `built-in`). |
| Shift+R | Select Rotation (requires `built-in`). |
| Shift+W | Select Translation (requires `built-in`). |
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

Angles in source accept `deg` (degrees), `rad` (radians), `grad` (gradians) and `turn` (turns). **An angle without a unit now means radians**: `angle=1.5707963267948966`, `angle=1.5707963267948966rad`, `angle=90deg`, `angle=100grad` and `angle=0.25turn` are equivalent. This applies to attached points, arcs, sectors and rotations. Older unitless angles interpreted as degrees must add `deg`. Interface fields and normalized source remain in degrees; expressions such as `pi/2` are not supported.

Start the source with `label = "Médiatrice de AB"` to name the figure; `title = "Médiatrice de AB"` is an alias. Use a double-quoted string, with JSON escapes for quotes and newlines. Only one declaration is allowed. Play, Load and `src` restore this label, taking precedence over the HTML attribute. Without a declaration, the current label is kept; `label = ""` clears it. The normalized source and saved files include the label, so it travels with the construction. Saving an unapplied draft uses its declared label when present. The declaration is metadata, not an object or a visible figure comment.

Coordinates only place free points initially. Lengths are construction units, independent of zoom. No axes or graduations are shown. The optional grid follows the construction plane without snapping points. Add the boolean `grid` attribute or use the Grid button to show it. The drawing area has a minimum height of 320 CSS pixels and grows with the adjacent object panel. Added space extends the grid downwards without recentering or rescaling existing objects. Removing objects lets the area shrink again. On narrow screens the object panel appears below the drawing. Panning and scrolling change only the view, never the construction source or its undo history. Fit restores a centred view. View navigation and the grid remain available in readonly mode.

| Command | Meaning |
| --- | --- |
| `point A = (0, 0)` | Free point. |
| `line d = line(A, B)` | Infinite line through two points. |
| `segment s = segment(A, B)` | Finite segment. |
| `segment s = segment(A, B, length=5)` | Segment starting at A, directed towards B, with fixed length 5. B sets the direction; the computed endpoint need not coincide with B. |
| `ray r = ray(A, B)` | Ray starting at A and passing through B. |
| `vector v = vector(A, B)` | Directed segment with an arrow at B. |
| `circle c = circle(O, 5)` | Fixed radius of five units. |
| `circle c = circle(O, through=A)` | Circle through A, following both O and A. |
| `circle c = circle(O, distance(A, B))` | Transfer the current length AB. |
| `point P = on(c, angle=30deg)` | Sliding point on a circle or arc. |
| `point Q = on(d, t=0.5)` | Sliding point halfway along the defining points. A line allows any parameter; a segment or vector clamps it to 0–1, and a ray clamps it to 0 or greater. Use `t=1` to create the endpoint of a fixed-length segment. |
| `arc a = arc(c, start=20deg, end=100deg)` | Counterclockwise arc of a supporting circle. Add `direction=cw` for clockwise. |
| `arc a = arc(c, start=40deg, end=80deg, relative-to=s)` | Arc oriented relative to the segment from its first point to its second point. |
| `sector w = sector(c, start=20deg, end=100deg)` | Filled circular sector. Supports the same `direction` and `relative-to` options as an arc. |
| `comment note = comment(A, "Length AB")` | Visible text attached to A. Double-quoted text supports escaped quotes (`\"`), commas and `#`. |
| `point I = intersection(a, b, branch=0)` | Dependent intersection of lines, segments, rays, vectors, circles or arcs. |

Append `hidden` to keep an object as a support without drawing it. Use one command per line; `#` outside quoted text starts a source comment. HTML-style `<!-- … -->` comments can span several lines and never create objects in the figure. Comment markers inside quoted figure text are literal. Names begin with a Latin letter and may contain letters, digits and underscores. Forward references are accepted; duplicate names, unknown supports and dependency cycles are rejected. Play and Load retain comments and the chosen angle units in the editor, so Save can preserve them. Graphical changes, Undo/Redo and Reset regenerate normalized source, discarding source comments and writing angles in degrees; visible `comment` objects are retained.

`branch=0` and `branch=1` retain their identities when clipping to arcs or segments. For two circles, branch 0 lies to the left of the direction from the first centre to the second; branch 1 lies to its right. For a line and a circle, branch 0 comes first along the line's defining direction. A pair of lines only has branch 0. At a tangency both circular branches occupy the same point; the mouse tool creates it once. Coincident supports do not define a unique intersection.

Undefined constructions and their dependents are hidden and listed with a diagnostic. They reappear when their supports permit the construction again. Arcs and sectors have distinct start/end angles and span less than a full turn. Arc endpoints defined by named points and equation plotting are not part of this initial version.

### Object names and free comments

Select an object and activate **Hide name** in Construction objects to hide its name without hiding its geometry. Activate it again to restore the name at its saved position. The object list keeps the identifier and marks it as **name hidden**. This is saved with the `label-hidden` suffix (for example, `point A = (0, 0) label-hidden`), supports Undo/Redo and image export, and is disabled in readonly mode. Comment contents and measurement values remain visible; use the object’s hidden style to hide those annotations entirely.

Double-click an object in Move or Pan view to rename it directly in the drawing. Press Enter to confirm, or Escape to cancel; leaving the field also cancels. F2 opens the same field for the selected object, including in canvas-only and zoomed views. Alternatively, select an object in **Construction objects**, edit **Object name**, and press **Rename**. Names must be valid, unique construction identifiers. Renaming updates dependent constructions. When renaming a comment, its visible text also becomes the new name; renaming an anchor point does not change the text of comments attached to it.

Drag a name in Move mode to reposition it without moving its object. Alternatively, select the object, enable **Move name**, and use the arrow keys on the drawing (Shift for a smaller step). Disable Move name or select another object to return to moving points and comments. Offsets follow the object and are saved as `label-x` and `label-y` in construction units.

With **Comment**, click empty space for a free annotation or click a point to attach it. Drag the comment in Move mode, or select it in Construction objects and use the arrow keys. Moving an attached comment keeps its anchor and updates its offset. These changes support Undo/Redo, source reload and image export; readonly disables editing.

```text
point A = (0, 0) label-x=0.5 label-y=0.3
comment attached = comment(A, "Follows A", dx=1, dy=0.5)
comment free = comment((3, 2), "Independent annotation")
```

### Step-by-step animation

An animation is a named control object in Construction objects. Its list contains object identifiers without quotes; an inner list groups objects that appear simultaneously:

```text
point O = (0, -2)
point A = (-2, 0)
point B = (2, 0)
segment s = segment(A, B)
point P = midpoint(s)
animation a = [[A, B], P, s]
```

Initially only O is visible. **Next** reveals A and B together, then P, then s. Previous steps remain visible. **Previous** hides the last revealed step; **Start** returns to step zero and **End** reveals the complete sequence. The counter counts outer-list steps, so this example has three steps. Objects absent from the selected animation are visible from initialization, even when they depend on objects not yet revealed. All objects continue to be calculated, and the drawing remains interactive. Explicit `hidden` styles and hidden names remain hidden when their step is reached.

<tp-graph-geometry canvas-only label="Grouped construction animation">
<script type="tp/geometry">
point O = (0, -2)
point A = (-2, 0)
point B = (2, 0)
segment s = segment(A, B)
point P = midpoint(s)
animation a = [[A, B], P, s]
</script>
</tp-graph-geometry>

Animation controls appear above the drawing, including in canvas-only, zoomed and readonly views. Multiple declarations are allowed: use their name buttons or select the animation in Construction objects to choose one. Only the selected animation controls visibility. Switching animations starts at zero. An empty list `[]` hides nothing and has no available steps.

Lists may span multiple lines and contain source comments. Object names must exist and occur only once within each animation; forward references are accepted. Inner groups must be nonempty, with only one grouping level. Animations cannot reference other animations or serve as geometric supports, and have no style or color options.

Renaming an object updates animation references. Deleting objects removes their references and empty groups from every animation; Undo restores them. Deleting an animation keeps its objects. Applying or loading a construction, or Undo/Redo of construction edits, restarts at step zero. Stepping only changes the view: it does not modify source or create undo entries. Saved source retains animation declarations, while image export captures the current visible step.

### Appearance and image export

In Move mode, select an object in the drawing or the object list. Its Style and Color menus edit that object. New objects start with a solid stroke and their normal automatic color. Hidden objects are still selectable in the list: choose solid, dotted or dashed to show them again. Changes are undoable, update the source and survive loading from `src`.

Append appearance options after a construction command:

```text
segment AB = segment(A, B) style=dashed color=blue
circle c = circle(O, 5) style=dotted color=red
line d = line(A, B) style=hidden
comment note = comment(A, "Reference point") color=green
```

`style` accepts `hidden`, `dotted`, `dashed` and `solid` (default). The legacy `hidden` suffix remains supported. Hidden objects keep their mathematical role; they are absent from the drawing and exported image. Dotted and dashed affect strokes, including point outlines; comments remain readable text. Omit `color` for Automatic. Palette names are the shared `tp-color` presets without the `tp-` prefix: default, red, orange, amber, yellow, lime, green, emerald, teal, glaz, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose, zinc, ivory and stone. The `default` palette color is distinct from Automatic, which restores the normal color for each object kind.

Save image uses `tp-save-image` and its `tp-dropdown`, with SVG offered first as the default, followed by PNG and WebP. It saves the current view at a width of 900 drawing units and its dynamically calculated height, including its background and optional grid, with colors resolved independently of the page stylesheet. Pan, zoom or Fit before saving to choose the framing. Selection highlights, invisible hit areas, menus and editing controls are excluded. Image export remains available in readonly mode; appearance editing does not. These files are images. Use Load, Save and Save as inside Construction source for editable UTF-8 `.txt` descriptions, including styles and measurement offsets. The file menu is opened with the file icon. F1 toggles the editor toolbar; Reset discards draft edits and restores the displayed construction source; Play applies the editor text. The suggested filename is the slugified figure label (for example, `Médiatrice de AB` becomes `mediatrice-de-ab.txt`), or `construction.txt` without a label. Save keeps reusing an existing destination; Save as proposes the current label, and Save as adds `.txt` when omitted. Save records the editor text without applying it; Play updates the drawing. Browsers with direct file access reuse the chosen save destination. Other browsers ask for a filename and download the file; they cannot overwrite a local file directly. After Load, the next Save asks for a destination because opening a file does not grant write access. New construction, the built-in example and changes to src reset the save destination. Save and Save as remain available in readonly mode.

### Direct construction tools

Add the boolean `built-in` attribute to offer the direct construction and transformation tools in the toolbar. Adding or removing it updates the toolbar immediately and preserves the construction. Its absence keeps the ruler-and-compass tools available. As with other boolean attributes, `built-in="false"` still enables it; remove the attribute to disable it. `readonly` prevents the use of these tools as well.

```html
<tp-graph-geometry built-in></tp-graph-geometry>
```

The following commands can be loaded from source or a file with or without `built-in`. The attribute controls which tools are offered, not which saved constructions can be interpreted.

| Command | Meaning |
| --- | --- |
| `point M = midpoint(s)` | Midpoint of segment s, including a fixed-length segment. |
| `line p = perpendicular(P, d)` | Perpendicular through P to a line, segment, ray or vector d. |
| `line q = parallel(P, d)` | Parallel through P to the same kinds of support. |
| `line m = perpendicularBisector(s)` | Perpendicular bisector of segment s. |
| `line b = bisector(A, O, B)` | Line bisecting the internal angle AOB, with vertex O. |
| `line t = tangent(P, c, branch=0)` | Tangent from P to circle c; branch 1 selects the other tangent. |

All these constructions follow their supports. Tangent branch 0 touches the circle to the left of the direction from its centre to P; branch 1 touches it to the right. At the circumference, both branches define the same line. Inside the circle they are undefined and reappear when P moves outside again. The Tangents tool creates all currently distinct tangents as one undoable action. A zero-length angle arm leaves the internal angle bisector undefined. A straight angle produces the perpendicular line through its vertex. Coincident points leave lines, rays, vectors and segments undefined until their direction becomes defined again.

A sector is a filled annotation of part of a circle: attach points and construct intersections on its supporting circle or a matching arc. A comment is plain text, never HTML. It can follow an anchor point or be placed freely at coordinates. Drag it in Move mode to change its position without moving the anchor. Lengths and radii are numbers (or transferred distances for circles); there are no symbolic equations.

### Polygons

With `built-in`, Polygon creates an irregular polygon from successive clicks. Click empty space to create a vertex or select an existing point. A dashed preview shows the pending edges. Click the first vertex to close it, or use Finish polygon (Enter on the drawing). At least three distinct vertices are required. Escape, changing tools or removing `built-in` discards the unfinished polygon and its new points. Completion records the new points and polygon as one undoable change.

Regular polygon uses two consecutive vertices, in the selected order, and Sides (an integer from 3 to 360, default 5). Both vertices can be created by clicking or selected from existing points. The remaining vertices are calculated counterclockwise from the first edge and follow its translation, rotation and length. Reverse the first two vertices to build on the other side. Calculated vertices are part of the polygon, not separately named point objects.

```text
point A = (-3, 0)
point B = (0, 0)
point C = (-2, 2)
polygon triangle = polygon(A, B, C) color=blue
polygon pentagon = regularPolygon(A, B, sides=5) color=green
```

Both polygon types have a closed outline and a light fill in the same color (15% opacity). The Color and Style menus, hidden state and image exports apply to the whole polygon. Irregular polygons follow their named vertices in order; concave and crossing outlines are allowed. Coincident consecutive vertices leave a polygon undefined until moved apart. Polygon edges are not individual segment objects or supports for attached points and intersections; create a segment between named vertices for those operations. Polygon commands load from source or `src` even without `built-in`; that attribute controls the tools offered in the interface.

### Transformations

With `built-in`, select a transformation tool, then the object to copy, then its reference (axis, centre or vector). Selection works in the drawing and in the object list, including hidden reference objects. Choose Create a copy (default) to add a new dependent image, or Transform the object to replace the selected object while preserving its name, appearance and visibility. Both modes record one undoable change. Move the source points or the transformation reference to update the image. Images can themselves be transformed or used as construction supports of their resulting kind. To move a transformed point, move its defining objects.

The five operations support points, segments (including fixed lengths), lines, rays, vectors, circles, arcs, sectors, polygons and comments. Reflections reverse arc direction. Homotheties scale radii by the absolute ratio; negative ratios also reverse the position relative to the centre. A zero ratio is rejected to preserve the geometric kind. Comments move their anchor while their text stays upright. Copies created with the toolbar initially copy the source stroke style and color; their appearance can then be edited independently, including the light polygon fill. Copies are visible even when their source is hidden; transformation in place preserves the hidden state.

Use the resulting object's type on the left of a source command:

```text
point reflected = axialSymmetry(A, axis)
segment opposite = centralSymmetry(s, O)
polygon enlarged = homothety(p, O, ratio=2)
polygon turned = rotation(p, O, angle=90deg)
circle shifted = translation(c, v)
```

In Transform the object mode, the object count stays unchanged and existing dependents keep referencing the same name. The object's original recipe is embedded in the transformation rather than retained as a separate hidden object. For example:

```text
polygon p = rotation(polygon(A, B, C), O, angle=90deg) color=blue
```

Applying another transformation nests another recipe. Source reload and Undo/Redo preserve this composition. The defining points A, B and C remain construction supports; they are not moved independently by transforming p. For a transformed point, move its supports or edit its source recipe. The transformation reference must not depend on the object being replaced: this would create a dependency cycle and is rejected without changing the figure. For example, translating A by a vector defined from A requires Create a copy, or an independent vector.

The source object must have the declared result type. Axial symmetry uses the infinite supporting line of a line, segment, ray or vector. Translation requires a vector and follows its direction and length. Ratio and angle are fixed finite numbers recorded when the construction is created. Adjust them in Construction source to change an existing image. Source commands can be loaded with or without `built-in`, including through `src`. Deleting a source or reference removes dependent images; Undo restores them. Undefined supports temporarily hide their images. Exports include the visible transformed figures with their styles and fills.

### Perpendicular bisector

The default example constructs four arcs with radius AB: two around A and two around B. Their intersections C and D define the bisector. All arc angles are relative to the oriented segment AB, so the construction also follows rotation. If A and B coincide, the dependent objects become undefined until the points separate.

### Measurements

The three measurement tools are standard: they do not require `built-in`. Their labels follow the supports and update when the construction changes. Lengths use construction units (`u`), areas use square units (`u²`), and angles use degrees. Displayed values are rounded to two decimal places; calculations retain full precision. Panning and zooming do not change measurements.

In Move mode, drag a measurement label to avoid overlaps, or select it in the object list and use the arrow keys (Shift for a smaller step). Moving the label does not move its supports or change the measured value. Its offset is saved in construction units, follows its anchor during movement and zoom, and is preserved by source reload, image exports and Undo/Redo. Readonly prevents repositioning. Optional `dx` and `dy` parameters set the offset in the source; positive `dy` moves upwards. For example, `comment distanceAB = length(A, B, dx=1, dy=0.5)`. Omitting both restores the default placement.

Two-side angles use `comment corner = angle(AB, BC)`. The sides must share an endpoint or intersect. At a shared endpoint the arms point along each side away from the vertex; at an interior intersection each arm points towards its farther defining endpoint (the second endpoint in a tie). The smaller angle is marked with an arc and its value. A right angle uses two sides of a small square without numeric text. The mark stays at the vertex; dragging its value only changes the label offset. When the sides move, the mark switches automatically between arc and square. Parallel disjoint sides leave the measurement undefined. Three-point measurements retain their numeric annotation.

Measurements use dynamic comment commands in the construction source:

```text
comment distanceAB = length(A, B)
comment segmentLength = length(AB)
comment perimeter = length(c)
comment surface = area(c)
comment angleABC = angle(A, B, C)
```

`length` accepts two points, or one segment, vector, circle, arc, polygon or sector. For a sector, the perimeter includes both radii. `area` accepts a circle, simple polygon (including concave polygons) or sector. `angle` accepts two linear sides (segments, lines, rays or vectors), or three points with the vertex second; a zero-length arm makes the measurement undefined. Crossing polygon edges make the area undefined until the polygon becomes simple again. Infinite lines and rays have no finite length and cannot be measured. Measurement labels support the same color, visibility, deletion and undo controls as comments and appear in image exports.

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

Ruler primitives
: Move A or B to compare a free segment with a fixed-length segment, a ray and a vector. The sector and comment follow their supports; use the toolbar to add another construction.

Direct constructions
: Use the extra built-in tools to add midpoints, perpendiculars, parallels, bisectors and tangents. Drag P inside and outside the circle to see its tangents disappear and reappear.

Styles and export
: Select an object in Move mode and change its stroke style or library color. Reveal the hidden circle from the object list, then use Save image to export the current view as SVG, PNG or WebP.

Polygons
: Move the defining points to reshape the irregular polygon or resize and rotate the regular pentagon. Use the built-in polygon tools to create more figures, then change their color and export the light fills with their outlines.

Transformations
: Move the source triangle points, the centre or the translation vector endpoint and observe the five dependent images. Use the built-in transformation tools to add another image, then edit its color independently.

Transform in place
: Choose Transform the object, select Rotation, then the circle c and centre O. The circle keeps its name and its attached point Q follows; Undo restores the original construction. Switch to Create a copy to compare both modes.

Measurements
: Drag A, B or C to update the length and marked angles: the right-angle square becomes an arc with its value when the sides are no longer perpendicular. Change the circle radius in Construction source to update its area. In Move mode, drag the measurement labels apart or select them and use the arrow keys. Use the three standard measurement tools to add distances, perimeters and areas without enabling built-in.

Interactive figure
: Drag O or slide P around its circle in canvas-only mode. Scroll to pan and use the corner theme switcher to change only this figure.

Shared points and vectors
: Open the source, change point A and press Play. The vector follows its endpoints; the same title, point and vector declarations work in both components.
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
  | <code>built-in</code> | <code>boolean</code> | <code>false</code> | Offers direct midpoint, perpendicular, parallel, perpendicular bisector, angle bisector, tangent, polygon and transformation tools. |
  | <code>canvas-only</code> | <code>boolean</code> | <code>false</code> | Shows the interactive drawing with its action palette and view controls, with a source toggle and without the object list. |
  | <code>grid</code> | <code>boolean</code> | <code>false</code> | Shows a light grid without axes or graduations. |
  | <code>label</code> | <code>string</code> | <code>&quot;&quot;</code> | Title displayed above the drawing. |
  | <code>readonly</code> | <code>boolean</code> | <code>false</code> | Prevents changes to the construction. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of a text file containing construction commands. |
  | <code>data-tp-help-src</code> | <code>string</code> | <code>&quot;&quot;</code> | URL of the component API manifest used by the help system. *(inherited from <code>tp-base</code>)* |
  | <code>data-tp-markdown-source</code> | <code>string</code> | <code>&quot;&quot;</code> | Source document URL used to resolve relative resources in generated help. *(inherited from <code>tp-base</code>)* |
  | <code>dir</code> | <code>string</code> | <code>&quot;&quot;</code> | Text direction (`ltr`, `rtl`, or `auto`). *(inherited from <code>tp-base</code>)* |
  | <code>lang</code> | <code>string</code> | <code>&quot;&quot;</code> | Language tag used by the component content. *(inherited from <code>tp-base</code>)* |
  [Attributes of `<tp-graph-geometry>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>analyze</code> | <code>analyze(): GeometryResult</code> | Returns a detached snapshot of computed objects and undefined-object diagnostics. |
  | <code>exportSvg</code> | <code>exportSvg(): string</code> | Exports the current view as a standalone SVG, with resolved colors and no editing controls. |
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
  | <code>&#45;&#45;tp-plot-height</code> | <code>auto</code> | Height of the normal drawing including its top and bottom controls; other panels remain outside. |
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
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->
<!--
@tp-dependency tp-code-editor
@summary CodeMirror-based code editor component.
-->
<!--
@tp-dependency tp-divider
@summary Visual separator for menus, dropdowns, toolbars, and layouts.
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
@tp-dependency tp-textfield
@summary Single-line and automatically growing multiline text field.
-->
<!--
@tp-dependency tp-theme
@summary Parent-scoped light/dark/auto theme controller with embedded UI.
-->

- [`<tp-accordion>`](../accordion/index.md) : Collapsible multi-panels element.
- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-button-group>`](../button-group/index.md) : Button group component for organizing multiple buttons.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-code-editor>`](../code-editor/index.md) : CodeMirror-based code editor component.
- [`<tp-divider>`](../divider/index.md) : Visual separator for menus, dropdowns, toolbars, and layouts.
- [`<tp-dropdown>`](../dropdown/index.md) : Dropdown menu component.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.
- [`<tp-radio-list>`](../radio-list/index.md) : Transforms a list into a group of radio buttons.
- [`<tp-save-image>`](../save-image/index.md) : Downloads an anchored image as SVG, PNG or WebP.
- [`<tp-textfield>`](../textfield/index.md) : Single-line and automatically growing multiline text field.
- [`<tp-theme>`](../theme/index.md) : Parent-scoped light/dark/auto theme controller with embedded UI.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
