# <tp-icon name="post-it" library="components" size="1.25em"></tp-icon> Post-it

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-post-it>` element displays a movable floating paper note that folds into a pushpin.

<tp-box style="min-block-size: 20rem">
  <p>Drag the note by its header to move it over the page. The pin folds and opens it.</p>
  <tp-post-it heading="Remember">
    <p>Keep examples <strong>simple and meaningful</strong>.</p>
    <ul>
      <li>Show a useful result.</li>
      <li>Try the keyboard controls.</li>
    </ul>
  </tp-post-it>
</tp-box>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Reading | Read the note and use any links or components inside it normally. |
| Pushpin | Click to fold or open the note. In lite mode, drag the pin directly to move it without opening it; small movements under 4 pixels remain clicks. Its content is retained. |
| Reset position | Return to the initial position captured when the file loaded, relative to the underlying document. Content and folded state are unchanged. |
| Header | Drag anywhere on the header except its buttons, using a mouse, pen or touch. Pin and Reset keep their normal actions. In lite mode, drag the pin instead. |
| Note surface | Read, select text or use controls without moving the note accidentally. The note does not block interaction with the rest of the page. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the pin, reset, header and interactive content in the expanded note. In lite mode, only the pin remains in keyboard navigation. |
| Enter / Space | Activate the focused reset or pin button. Reset restores the initial document position; the pin folds or expands the note. |
| Arrow keys on the header, or on the pin in lite mode | Move the note by 10 pixels. Hold Shift for 1-pixel steps. |
| Escape during a drag | Cancel the movement and restore the starting position. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

`opacity` controls the transparency of the whole note, including its text, controls and folded pin: 1 (default) is opaque and 0 is fully transparent. Values are clamped to 0–1; invalid or empty values use 1. Transparency does not disable interaction, and low values can make the note difficult to read. The Attributes example provides a range control with steps of 0.05; Reset defaults restores full opacity.

After a drop, the pin is attached to the element beneath it rather than fixed page coordinates. It follows that element when a sidebar opens or closes, when the layout changes and when the page scrolls. Its horizontal and vertical offsets from the target's top-left corner remain constant, even when the target's width changes. Folding or unfolding preserves the pin's attachment point. Reset restores the initial attachment to the author's container. If the target is removed, the note retains its last position until moved again.

When the viewport becomes narrower, the displayed note is fitted horizontally inside it without overwriting its saved attachment. Widening the viewport restores the original attachment offset when space permits. Sidebar transitions are followed continuously.

Place ordinary HTML or existing `tp-*` components inside the note. In the three markup languages, use the native `tp-post-it` block directive with normal paragraphs, lists and inline formatting. Author nodes are moved intact into a `tp-box`, preserving nested component state and event listeners.

`heading` is optional and rendered as plain text. `color` accepts every shared `tp-color` preset without its `tp-` prefix, with yellow as the default (for example, `orange`, `blue`, `glaz` or `ivory`). The same tokens adapt the paper and text to light and dark themes. `rotation` is an angle in degrees, defaulting to zero and clamped between −12 and 12. On initial display and each reopening, the note slowly rotates from 0° to this angle over one second. With reduced motion enabled, the final angle is applied immediately. Leave space around rotated notes to avoid overlapping adjacent content.

The boolean `lite` attribute folds the note into a double-size pushpin by its presence, even if written `lite="false"`. Without it, the note is expanded. Clicking the pin adds or removes `lite`, and the Attributes checkbox follows this change. The header contains the pin on the left, the heading, and refresh (Reset position) on the right. There is no separate grip: drag the header surface, or focus it and use arrow keys. Header buttons do not initiate dragging. In lite mode, only the pin remains: drag it directly or use its arrow keys. Content and entered values remain intact. The pin exposes the expanded state to assistive technology. `resetPosition()` restores the original document position without scrolling the page or resetting its content.

Notes float above the document's ordinary content using a manual, nonmodal popover in the browser's top layer. Their DOM location and inherited theme are preserved, but they no longer reserve layout space. The initial location comes from their declaration. After dropping, notes scroll with the underlying text, including inside scrollable author containers: they are not pinned to the screen and may scroll out of view. Position is retained when folding and reopening, but is not stored across page reloads. A later modal dialog remains entitled to take precedence. Inside a viewer, the note floats within that viewer's iframe and cannot escape into its parent document.

```html
<tp-post-it heading="Reminder" lite>
  <p>Keep examples simple and meaningful.</p>
</tp-post-it>
```

The preferred width is `--tp-post-it-width: 20rem`, constrained by the available space; `--tp-post-it-padding` defaults to `0.75rem`. The component reuses `tp-box`, `tp-icon-button` and shared color, spacing and shadow tokens. It does not load a handwriting font or an external annotation library.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Drag the yellow reminder over the surrounding page using its header, or focus the header and use arrow keys. Click the pin to fold and reopen the note without losing its content.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Lite note
: Drag the double-size pushpin or move it with arrow keys without opening the note. Click it or press Enter or Space to open the reminder and reveal its header and reset controls, then fold it again without deleting its content.

Notes board
: Move three independently floating notes using their headers and compare their colors and rotations. The third contains a text field whose value remains intact while moving or folding the note.
<!-- tp-docgen:example-descriptions:end -->

::::::::::::::: tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

The properties `heading`, `color`, `rotation` and `lite` reflect their attributes. Use `toggle()` to fold or expand the note; it emits the bubbling `tp-post-it-toggle` event with `detail: { lite: boolean }`. Set `lite = true` or `lite = false` to select a state directly without a toggle event. If focus is inside the content when it is folded programmatically, it moves to the pin rather than remaining in hidden content.

Use `moveTo(x, y)` to position the note in viewport pixels. Requested coordinates are constrained to the visible viewport; invalid numbers are ignored. Subsequent scrolling moves the note with the document without clamping it back onto the screen. Pointer capture and drag listeners are released after a drop, cancellation or disconnection; scroll listeners are removed on disconnection.

### API

<!-- tp-docgen:api TpPostIt -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>color</code> | <code>&quot;default&quot;\|&quot;red&quot;\|&quot;orange&quot;\|&quot;amber&quot;\|&quot;yellow&quot;\|&quot;lime&quot;\|&quot;green&quot;\|&quot;emerald&quot;\|&quot;teal&quot;\|&quot;glaz&quot;\|&quot;cyan&quot;\|&quot;sky&quot;\|&quot;blue&quot;\|&quot;indigo&quot;\|&quot;violet&quot;\|&quot;purple&quot;\|&quot;fuchsia&quot;\|&quot;pink&quot;\|&quot;rose&quot;\|&quot;zinc&quot;\|&quot;ivory&quot;\|&quot;stone&quot;</code> | <code>&quot;yellow&quot;</code> | Shared tp-color palette name without the tp- prefix; invalid values fall back to yellow. |
  | <code>heading</code> | <code>string</code> | <code>&quot;&quot;</code> | Optional plain-text heading above the preserved content. |
  | <code>lite</code> | <code>boolean</code> | <code>false</code> | Folds the note into its pushpin; click the pin to expand or fold it again. |
  | <code>opacity</code> | <code>number</code> | <code>1</code> | Opacity of the whole note, including its pin, clamped from 0 to 1; invalid or empty values use 1. |
  | <code>rotation</code> | <code>number</code> | <code>0</code> | Paper rotation in degrees, clamped from -12 to 12; invalid values use 0. |
  [Attributes of `<tp-post-it>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>attachTo</code> | <code>attachTo(element: Element, x: number, y: number, initial = false): void</code> | Restores a pin attachment using pixel offsets from the target's top-left corner. |
  | <code>moveTo</code> | <code>moveTo(x: number, y: number): void</code> | Places the note in viewport pixels and attaches its pin to the underlying element. |
  | <code>resetPosition</code> | <code>resetPosition(): void</code> | Restores the loading position in the document without changing content or folded state. |
  | <code>toggle</code> | <code>toggle(): void</code> | Toggles the reflected lite attribute; the pin remains available in both states. |
  [Public methods of `TpPostIt`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-post-it-move</code> | <code>void</code> | Emitted after a pointer or keyboard move, or a position reset; attachment exposes the target and offsets. |
  | <code>tp-post-it-toggle</code> | <code>&#123; lite: boolean &#125;</code> | Emitted after the pin changes the folded state. |
  [Events emitted by `<tp-post-it>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-post-it-padding</code> | <code>0.75rem</code> | = 0.75rem Inner paper padding. |
  | <code>&#45;&#45;tp-post-it-rotation</code> | <code>0deg</code> | Controls the rotation. |
  | <code>&#45;&#45;tp-post-it-width</code> | <code>20rem</code> | = 20rem Preferred note width, limited by the available space. |
  | <code>&#45;&#45;tp-post-it-x</code> | <code>8px</code> | Controls the x. |
  | <code>&#45;&#45;tp-post-it-y</code> | <code>8px</code> | Controls the y. |
  [CSS properties of `<tp-post-it>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_post-it.TpPostIt.html)
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
  <script type="module" src="/path/to/components/post-it/post-it.js"></script>
  ```

import
: ```js
  import "/path/to/components/post-it/post-it.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/post-it/post-it.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-post-it>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-box
@summary Simple box layout component.
-->
<!--
@tp-dependency tp-color
@summary Brand color preset controller scoped to the containing element.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-box>`](../box/index.md) : Simple box layout component.
- [`<tp-color>`](../color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
