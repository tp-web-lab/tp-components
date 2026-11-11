### User interactions

Help lists only this component’s own commands. Functional subcomponents expose their internal commands through their own <kbd>Ctrl</kbd>+<kbd>?</kbd> help.

The user-help button legend groups commands by their location in the component and describes their effect briefly. Detailed gestures and keyboard behavior remain in the interaction tables below.

Use `label="My figure"` to title the drawing. With `canvas-only`, the action palette, Save image, local Theme and Zoom drawing controls remain at the top right; Undo, Redo, Zoom out, Zoom in, Fit and Grid stay at the bottom right. The object list is initially hidden and can be shown with Construction objects, immediately after Grid. The main tool strip stays hidden. The `</>` button at the bottom left shows Construction source below the drawing in normal mode. In canvas-only mode, it switches between the drawing and Construction source, including its file menu, F1, Reset and Play controls. Switching preserves the figure and unapplied editor text, including in the zoomed window. Choosing a construction tool reveals its help and parameters within the drawing panel. `readonly` still prevents construction changes.

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
| Construction objects | Show or hide the object panel using the button immediately after Grid. In canvas-only mode, this panel replaces the drawing, just like the source view. Click again to return to the drawing. The control is available in readonly mode. |
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
| `</>` | Show or hide the source editor directly below the drawing. In canvas-only mode, the editor replaces the drawing; click again to return without applying draft edits. Play applies the edited source. |
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
| <kbd>Enter</kbd> / <kbd>Space</kbd> on Rename, Move name or Hide name | Apply the edited name, enable name positioning, or toggle name visibility. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on animation controls | Choose an animation or move through its steps; available in readonly mode. |
| <kbd>F2</kbd> on the drawing | Open the inline name field for the selected object. |
| <kbd>Enter</kbd> / <kbd>Escape</kbd> in the inline name field | Rename the object / cancel editing. Leaving the field also cancels. Invalid or duplicate names keep the field open with an error. |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Move between tools, parameters, object buttons, drawing and source controls. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate a focused button. Selecting an object in Move mode focuses the drawing. |
| <kbd>F1</kbd> | Inside Construction source, show or hide the editor toolbar. Elsewhere, open or close the action palette. Use <kbd>Up</kbd>/<kbd>Down</kbd>, <kbd>Home</kbd>/<kbd>End</kbd> to navigate and <kbd>Enter</kbd>/<kbd>Space</kbd> to choose a tool. |
| <kbd>Z</kbd> / <kbd>Escape</kbd> in the zoomed window | Enlarge or restore the drawing with Z; <kbd>Escape</kbd> closes the window. |
| <kbd>Delete</kbd> | Remove the selected object and its dependent constructions as one undoable action (except in readonly mode). |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Undo / redo a construction change. |
| <kbd>−</kbd> / <kbd>+</kbd> / <kbd>F</kbd> / <kbd>G</kbd> | Zoom out / zoom in / fit the drawing / toggle the grid. |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> in canvas-only mode | Move the selected point, comment, measurement or name (with Move name enabled); when nothing is selected, or in readonly mode, pan the view. |
| <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> on the drawing | In Pan view, pan by 40 drawing pixels. With Move name enabled, move the selected object name. Otherwise move the selected comment, measurement label, free or attached point by 0.2 units before projection onto its support. |
| <kbd>Shift</kbd> <kbd>+</kbd> <kbd>←</kbd>/<kbd>↑</kbd>/<kbd>→</kbd>/<kbd>↓</kbd> | In Pan view, pan by 8 drawing pixels. Otherwise use a smaller point step of 0.02 units. |
| <kbd>Enter</kbd> on the drawing | Finish a pending irregular polygon with at least three vertices. |
| <kbd>Escape</kbd> on the drawing | Cancel the pending selection, discard uncommitted polygon vertices and return to Move. |
| <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd>, <kbd>Home</kbd> / <kbd>End</kbd> in a menu | Move between export formats, stroke styles or colors. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> in a menu | Save the chosen format or apply the selected style or color. |
| <kbd>Escape</kbd> in a menu | Close the menu. |
| <kbd>V</kbd> | Select Move. |
| <kbd>H</kbd> | Select Pan view. |
| <kbd>P</kbd> | Select Point. |
| <kbd>Shift</kbd>+<kbd>P</kbd> | Select Point on object. |
| <kbd>S</kbd> | Select Segment. |
| <kbd>L</kbd> | Select Line. |
| <kbd>Shift</kbd>+<kbd>S</kbd> | Select Segment · length. |
| <kbd>R</kbd> | Select Ray. |
| <kbd>W</kbd> | Select Vector. |
| <kbd>E</kbd> | Select Angular sector. |
| <kbd>T</kbd> | Select Comment. |
| <kbd>D</kbd> | Select Measure length. |
| <kbd>A</kbd> | Select Measure area. |
| <kbd>Shift</kbd>+<kbd>A</kbd> | Select Measure angle. |
| <kbd>C</kbd> | Select Circle · radius. |
| <kbd>Shift</kbd>+<kbd>C</kbd> | Select Circle · through point. |
| <kbd>B</kbd> | Select Arc. |
| <kbd>I</kbd> | Select Intersection. |
| <kbd>M</kbd> | Select Midpoint (requires `built-in`). |
| <kbd>Shift</kbd>+<kbd>L</kbd> | Select Perpendicular (requires `built-in`). |
| <kbd>J</kbd> | Select Parallel (requires `built-in`). |
| <kbd>Shift</kbd>+<kbd>M</kbd> | Select Perpendicular bisector · direct (requires `built-in`). |
| <kbd>Shift</kbd>+<kbd>B</kbd> | Select Angle bisector (requires `built-in`). |
| <kbd>Shift</kbd>+<kbd>T</kbd> | Select Tangents (requires `built-in`). |
| <kbd>N</kbd> | Select Polygon (requires `built-in`). |
| <kbd>Shift</kbd>+<kbd>N</kbd> | Select Regular polygon (requires `built-in`). |
| <kbd>X</kbd> | Select Axial symmetry (requires `built-in`). |
| <kbd>Shift</kbd>+<kbd>X</kbd> | Select Central symmetry (requires `built-in`). |
| <kbd>K</kbd> | Select Homothety (requires `built-in`). |
| <kbd>Shift</kbd>+<kbd>R</kbd> | Select Rotation (requires `built-in`). |
| <kbd>Shift</kbd>+<kbd>W</kbd> | Select Translation (requires `built-in`). |
| <kbd>Ctrl</kbd>+<kbd>?</kbd> | Open User Help for the component under the pointer, or the focused component if none is hovered. Include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>?</kbd> | Choose a component from the hierarchy under the pointer, or around the focused component, then open its help. <kbd>Alt</kbd> is <kbd>Option</kbd> on macOS; include <kbd>Shift</kbd> if needed to type <kbd>?</kbd>. |
