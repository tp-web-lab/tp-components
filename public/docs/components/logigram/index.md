# <tp-icon name="logigram" library="components" size="1.25em"></tp-icon> Logigram

<tp-toc position="end" expand-all open brand></tp-toc>

Solve a logic-grid puzzle by using written clues to match items across categories. Each item matches exactly one item in every other category.

<details class="tp-game-rules">
<summary>Rules of the game</summary>

<p>Use the clues to match the items across categories. Every item belongs with exactly one item in each other category, and every clue must be satisfied.</p>

<p>Each block compares two categories. Mark a cell × to exclude a match, ✓ to confirm it, or leave it unknown. A confirmed match excludes the other cells in its block row and column. Matches must also agree across categories: if A matches B and B matches C, then A matches C.</p>

<p>The puzzle is solved when all matching pairs in every block are marked ✓ and no marked cell contradicts the solution. You do not need to mark every excluded pair. Checking off a clue is only a personal reminder.</p>

</details>

<tp-logigram label="The reading club">
  <dl>
    <dt>Prompt</dt>
    <dd><p>Three readers chose different books and drinks. Find every match.</p></dd>
    <dt>Categories</dt>
    <dd>
  <ul>
    <li>Readers<ul><li>Ada</li><li>Ben</li><li>Cleo</li></ul></li>
    <li>Books<ul><li>Poetry</li><li>History</li><li>Science</li></ul></li>
    <li>Drinks<ul><li>Tea</li><li>Juice</li><li>Water</li></ul></li>
  </ul>
  </dd>
    <dt>Clues</dt>
    <dd>
  <ol>
    <li>Ada chose Poetry.</li>
    <li>The History reader drank Juice.</li>
    <li>Ben drank Water.</li>
    <li>Cleo did not choose Poetry.</li>
  </ol>
  </dd>
    <dt>Solution</dt>
    <dd>
  <ol>
    <li><ul><li>Ada</li><li>Poetry</li><li>Tea</li></ul></li>
    <li><ul><li>Ben</li><li>Science</li><li>Water</li></ul></li>
    <li><ul><li>Cleo</li><li>History</li><li>Juice</li></ul></li>
  </ol>
</dd>
  </dl>
</tp-logigram>

## Usage

The panel heading is always **Logigram**, with Undo, Redo and an Assist… menu grouped on its right. On narrow panels, the controls wrap below the heading. A custom `label` appears below the header as the puzzle title.

### Rules

Each category contains the same number of distinct items. Every pair of categories has a matrix. The matrices form one triangular grid with shared category and item headers. With three categories, two matrices sit side by side above a third matrix on the left. Mark a cell × when the two items cannot belong together, ✓ when they do, or leave it unknown. Use the clues, one-to-one exclusion, elimination and transitivity to identify every matching pair.

Assist… → Show all incorrect boxes compares your marks with the authored solution. A puzzle is solved when all matching pairs in all matrices are marked yes and no marked cell is incorrect. You do not need to fill every negative cell. Checking reports correct matches and outlines errors without erasing your work. Checking off clues is only a personal reminder.

With `auto-exclude`, marking yes also marks the competing cells in that matrix row and column as no. This does not infer transitive matches in other matrices. Undo reverses the entire move including these exclusions. Clearing a yes does not automatically erase earlier exclusions; use Undo to reverse them.

### Authoring native lists

Inside the component, write one definition list (`dl`) with four terms (`dt`), each followed by its content (`dd`). Sections are identified by name, independently of their order; names are case-insensitive. Each section must appear exactly once.

- **Prompt**: the scenario text.
- **Categories**: a list of category names, each containing a nested list of its items.
- **Clues**: a list of textual clues.
- **Solution**: a list of matched entities, each containing one item per category in category order.

The solution is removed from the rendered game. Supported sizes are 2–6 categories with 2–8 items each. Names must be unique within each category, category names must be unique, and each solution column must contain every category item exactly once. Authors must ensure the clues imply a unique solution; the component validates the supplied mapping, not the meaning of prose clues.

```markdown
::: tp-logigram { label="The reading club" auto-exclude }
Prompt
:
  Three readers chose different books and drinks. Find every match.

Categories
:
  - Readers

    - Ada

    - Ben

    - Cleo

  - Books

    - Poetry

    - History

    - Science

  - Drinks

    - Tea

    - Juice

    - Water

Clues
:
  1. Ada chose Poetry.

  2. The History reader drank Juice.

  3. Ben drank Water.

  4. Cleo did not choose Poetry.

Solution
:
  1. - Ada

     - Poetry

     - Tea

  2. - Ben

     - Science

     - Water

  3. - Cleo

     - History

     - Juice
:::
```

The same list structure works in HTML, AsciiDoc and reStructuredText. `src` loads a Markdown file containing the definition list with these four sections, without a surrounding `tp-logigram` directive. It overrides inline content; removing it restores the original inline puzzle. A changed source starts a fresh game. Labels and clues are displayed as text.

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Click a cell | Cycle unknown → no → yes → unknown. |
| Right-click a cell | Mark yes. |
| Ctrl-click / Command-click a cell | Clear its mark. |
| Clue checkbox | Mark a clue as reviewed. |
| Undo / Redo | Reverse or reapply a grid move. |
| Assist… → Reset the game | Clear the grid; Undo can restore it. Clue reminders are retained. |
| Assist… → Show all incorrect boxes | Show the score, highlight incorrect marks and announce a solved puzzle. |
| Assist… → Clear the incorrect boxes | Clear incorrect marks while preserving correct ones. |
| Assist… → Show the box | Reveal the last selected or focused cell. Select a cell first to enable this action. |
| Assist… → Show the category pair | Reveal all cells in the selected cell’s category-pair block. |
| Assist… → Show the solution | Reveal every pair and display the solved status. |

Each assistance action that changes the grid can be undone in one step. Click a grid box or focus it with Tab to enable Show the box and Show the category pair. The selected box has a persistent outline, and the message below the toolbar identifies its two items. The selection is retained when you move to the menu. Revealing a box changes only that box, even when automatic exclusions are enabled.

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move among clues, toolbar controls and cells. |
| Enter / Space | Activate a focused cell or button; Space toggles a clue checkbox. |
| Arrow keys in Assist… / Enter | Choose and apply an assistance action using the native menu. |
| Arrow keys in a matrix | Move to a neighbouring cell in the same matrix. |
| Delete / Backspace in a cell | Clear its mark. |
| Ctrl+? | Open User help for the component under the pointer, falling back to the focused component. Shift may be needed to type ?. |

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Match three readers with their books and drinks using the triangular grid, and use Assist… → Show all incorrect boxes to verify the matches.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

Automatic exclusions
: Solve the reading club puzzle across three matrices. Observe automatic exclusions and use Undo to reverse a move.
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

`value` returns a copy of the cell states (0 unknown, -1 no, 1 yes), grouped by category pair, then row and column. `reset()`, `undo()` and `redo()` modify the grid; `check()` returns `{ correct, total, errors, complete }`, or null when disabled or not ready. Errors are cell indexes. `tp-logigram-change` carries `{ value }`; `tp-logigram-check` carries the check result. Both events bubble. Disconnecting and reconnecting preserves the loaded game.

## API

<!-- tp-docgen:api TpLogigram -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>auto-exclude</code> | <code>boolean</code> | <code>false</code> | Marks other cells in the same pair row and column as no after a yes. |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Prevents playing and using game controls. |
  | <code>label</code> | <code>string</code> | <code>&quot;Logigram&quot;</code> | Puzzle title. |
  | <code>src</code> | <code>string</code> | <code>&quot;&quot;</code> | Markdown file containing Prompt, Categories, Clues and Solution definitions. |
  [Attributes of `<tp-logigram>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>check</code> | <code>check(): ReturnType&lt;LogigramModel[&quot;check&quot;]&gt; \| null</code> | Checks all marked cells and counts correct matches. Unknown negatives need not be filled. |
  | <code>redo</code> | <code>redo(): void</code> | Reapplies an undone move. |
  | <code>reset</code> | <code>reset(): void</code> | Clears the grid; the reset can be undone. |
  | <code>undo</code> | <code>undo(): void</code> | Restores the preceding move, including automatic exclusions. |
  [Public methods of `TpLogigram`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>tp-logigram-change</code> | <code>&#123; value: number[] &#125;</code> | Emitted after a move, undo, redo or reset. |
  | <code>tp-logigram-check</code> | <code>&#123; correct: number; total: number; errors: number[]; complete: boolean &#125;</code> | Emitted after checking the grid. |
  [Events emitted by `<tp-logigram>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-logigram>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_logigram.TpLogigram.html)
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
  <script type="module" src="/path/to/components/logigram/logigram.js"></script>
  ```

import
: ```js
  import "/path/to/components/logigram/logigram.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/logigram/logigram.js";
  ```
:::

## References

Game principles: [integrammes.fr — help](https://integrammes.fr/?action=aide). The demonstration puzzles above are original examples.

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-logigram>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-button
@summary Button component that supports native button and link rendering.
-->
<!--
@tp-dependency tp-checkbox-list
@summary Transforms a list into a group of checkboxes.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](../button/index.md) : Button component that supports native button and link rendering.
- [`<tp-checkbox-list>`](../checkbox-list/index.md) : Transforms a list into a group of checkboxes.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
