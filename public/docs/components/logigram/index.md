<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="logigram" library="components" size="1.25em"></tp-icon> Logigram

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-logigram>` element solves logic-grid puzzles by matching items across categories using written clues.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
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
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-logigram" src="/docs/components/logigram/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

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

### Programming notes

`value` returns a copy of the cell states (0 unknown, -1 no, 1 yes), grouped by category pair, then row and column. `reset()`, `undo()` and `redo()` modify the grid; `check()` returns `{ correct, total, errors, complete }`, or null when disabled or not ready. Errors are cell indexes. `tp-logigram-change` carries `{ value }`; `tp-logigram-check` carries the check result. Both events bubble. Disconnecting and reconnecting preserves the loaded game.

### References

Game principles: [integrammes.fr — help](https://integrammes.fr/?action=aide). The demonstration puzzles above are original examples.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Match three readers with their books and drinks using the triangular grid, and use Assist… → Show all incorrect boxes to verify the matches.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Automatic exclusions
: Solve the reading club puzzle across three matrices. Observe automatic exclusions and use Undo to reverse a move.
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
@tp-dependency tp-checkbox-list
@summary Transforms a list into a group of checkboxes.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-button>`](#/components/button/index.md) : Button component that supports native button and link rendering.
- [`<tp-checkbox-list>`](#/components/checkbox-list/index.md) : Transforms a list into a group of checkboxes.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
