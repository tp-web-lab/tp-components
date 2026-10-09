# <tp-icon name="yakazu" library="components" size="1.25em"></tp-icon> Yakazu

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-yakazu>` element implements the <tp-icon name="yakazu" library="components" size="1.25em"></tp-icon> Yakazu functionality: yakazu puzzle web component using lightDOM. Provides interactive Yakazu puzzle solving via the `<tp-yakazu>` custom element. Yakazu is a logic puzzle combining elements of Sudoku with arithmetic constraints. Features: - Interactive grid solving with visual feedback - Dual entry modes: Game (single value) and Note (pencil marks) - Real-time validation with constraint checking - Undo/redo functionality - Assistance options (show cell, show solution, clear errors) - Entry mode toggling - Progress tracking and completion detection Puzzle data is loaded from data attributes or HTML list structures.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>Fill every white square with a digit. Black squares separate horizontal and vertical runs; given digits cannot be changed.</p>

<p>A run of length n must contain all digits from 1 to n exactly once, in any order. For example, a run of four squares contains 1, 2, 3 and 4.</p>

<p>Each square must satisfy both the horizontal and vertical run it belongs to. Complete all white squares consistently; pencil marks are only reminders.</p>

</details>

<tp-yakazu>
      <ol>
      <li>25431#9#4!</li>
      <li>1#1524673</li>
      <li>#13!2#12#2</li>
      <li>2#563274!1</li>
      <li>12674385!#</li>
      <li>34!21!5#1!2#</li>
      <li>#1#412563</li>
      <li>2!31#2!#312</li>
      <li>1#21#2431</li>
      </ol>
      </tp-yakazu>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Using the component | Complete the puzzle using the editable cells; fixed clues cannot be changed. |
| Using the component | Use the displayed assistance controls to check or reveal information when available. |
| Using the component | The puzzle's messages indicate progress and completion. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move between the available controls. |
| Focused controls | Use each control’s standard keyboard interaction.  |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Use `<tp-yakazu>` as shown below.

```html
<tp-yakazu>
<ol>
<li>25431#9#4!</li>
<li>1#1524673</li>
<li>#13!2#12#2</li>
<li>2#563274!1</li>
<li>12674385!#</li>
<li>34!21!5#1!2#</li>
<li>#1#412563</li>
<li>2!31#2!#312</li>
<li>1#21#2431</li>
</ol>
</tp-yakazu>
```

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Complete the number grid while respecting the constraints of its horizontal and vertical runs.
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

### API
<!-- tp-docgen:api TpYakazu -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | None. |  |  |  |
  [Attributes of `<tp-yakazu>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpYakazu`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-yakazu>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-yakazu>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_yakazu.TpYakazu.html)
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
  <script type="module" src="/path/to/components/yakazu/yakazu.js"></script>
  ```

import
: ```js
  import "/path/to/components/yakazu/yakazu.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/yakazu/yakazu.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-yakazu>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.

### External

<!--
@credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
@summary Shared parsers, games and rendering utilities.
-->

- [tp-utilities](https://www.npmjs.com/package/@tp/tp-utilities) : Shared parsers, games and rendering utilities.
<!-- tp-docgen:dependencies:end -->
