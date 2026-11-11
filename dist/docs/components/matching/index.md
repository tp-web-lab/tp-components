<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="matching" library="components" size="1.25em"></tp-icon> Matching

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-matching>` element groups related items from two or more lists.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
<tp-matching>
  <ul><li>Hello</li><li>Thank you</li><li>Goodbye</li></ul>
  <ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol>
</tp-matching>
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-matching" src="/docs/components/matching/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Configuration

With the boolean `heading` attribute (absent by default), the first list contains one title per following column. It is excluded from shuffling, associations and scoring; item ranks start at 1 in each remaining list. The title count must equal the number of columns, independently of their item count. Rich title content is preserved. Changing `heading` reinterprets the original lists and clears existing associations. A `dl` with named columns remains supported and already supplies its own headings.

```html
<tp-matching heading>
<ul><li>English</li><li>French</li></ul>
<ul><li>Hello</li><li>Thank you</li><li>Goodbye</li></ul>
<ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol>
</tp-matching>
```

### Authoring

Provide two or more nonempty lists with equal numbers of items. Each list may independently be `ul` or `ol`. Items at the same original rank belong to the same expected group, independently of their shuffled positions.

For column headings, provide one `dl`: each `dt` contains a heading and its following `dd` contains the corresponding list. The component transforms this structure into headed columns and associates each list with its heading for assistive technologies. Bare direct lists remain supported.

Select one item in each column to build a group. A group can remain incomplete; select one of its members to continue it. Choosing another item in an occupied column replaces that member. Removing a member preserves the remaining group unless fewer than two members remain. Drag and drop also joins items from different columns.

Items may contain text, images, SVG, audio, video and `tp-*` components. Pairing retains the original nodes and their event listeners without reconstructing media players. Changing the display order may interrupt playback. Supply meaningful alternative text and accessible names for non-text content. The separate Select control prevents media playback from accidentally selecting an answer.

Every list is independently shuffled on initialization and on `reset()`, without changing the stored author ranks. Randomization is always active; there is no `shuffle` attribute. Reconnecting the same element preserves its current order and associations. `disabled` disables association controls, but leaves embedded media usable; presence means true and absence means false.

The component collects associations, not scores. Pair numbers are identifiers, not correctness indicators. Author pairings are present in the document and must not be treated as hidden examination answers. Lists are captured once when valid content is available; reconnecting preserves state. To replace the exercise, create a new component.

### Programming notes

Read or restore the `value` property as an array of `{ left, right }` pairs. Both ranks are one-based positions in the original author lists, not the shuffled display. Duplicate ranks, out-of-range ranks and noninteger ranks throw `RangeError` without changing the previous value. Assign values after initialization; programmatic assignment does not emit `change`.

The pair format is retained for two columns. With three or more columns, each group is `{ items: [1, 1, null, 2] }`: positions identify columns in author order, ranks identify original items, and `null` identifies a missing member. A group requires at least two members; each rank can occur only once per column across all groups. `columnCount` and `itemCount` expose the exercise dimensions. `complete` becomes true only when every item belongs to a complete group.

```js
matching.addEventListener("change", (event) => {
  if (event.target !== matching) return; // Ignore events from embedded controls.
  console.log(event.detail.value, event.detail.complete);
});
matching.value = [{ left: 1, right: 2 }];
matching.reset();
```

`complete` means that every item is associated, not that the associations are correct. `reset()` clears all groups, independently reshuffles every list and emits `change` if any group was removed. A random shuffle can occasionally produce the same order. The component does not automatically participate in native form submission; serialize its `value` in the containing form.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/matching/matching.js"></script>
  ```

import
: ```js
  import "/path/to/components/matching/matching.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/matching/matching.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Associate each English expression with its French translation using Select buttons or drag and drop. Remove or replace a pair and observe its shared pair number.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

Rich content
: Associate the flag, sound and video with their descriptions. Use the media controls independently of the Select buttons, then create or remove pairs.

Irregular verbs
: Associate each base form with its past simple, past participle and French translation across four headed columns. Complete or revise a group one member at a time.

Header list
: Use the first list as English and French column headings. Match the three expressions; headings remain fixed and do not count as answers.
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
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->
<!--
@tp-dependency tp-dragdrop
@summary Generic drag-and-drop controller for content.
-->
<!--
@tp-dependency tp-icon-button
@summary Accessible icon button component.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](#/components/callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-dragdrop>`](#/components/dragdrop/index.md) : Generic drag-and-drop controller for content.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
