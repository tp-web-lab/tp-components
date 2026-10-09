# <tp-icon name="matching" library="components" size="1.25em"></tp-icon> Matching

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-matching>` element implements the Matching functionality: associates rich content from two or more optionally titled lists without grading the groups.

<tp-matching>
  <ul><li>Hello</li><li>Thank you</li><li>Goodbye</li></ul>
  <ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol>
</tp-matching>

## Usage

With the boolean `heading` attribute (absent by default), the first list contains one title per following column. It is excluded from shuffling, associations and scoring; item ranks start at 1 in each remaining list. The title count must equal the number of columns, independently of their item count. Rich title content is preserved. Changing `heading` reinterprets the original lists and clears existing associations. A `dl` with named columns remains supported and already supplies its own headings.

```html
<tp-matching heading>
<ul><li>English</li><li>French</li></ul>
<ul><li>Hello</li><li>Thank you</li><li>Goodbye</li></ul>
<ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol>
</tp-matching>
```

### User interactions

#### Mouse interactions

Associated cards share a color and a group number, including incomplete groups. Colors cycle through blue, violet, amber, cyan, orange and indigo; they indicate membership, never correctness. The number remains the identifier when colors repeat. Completing or editing a group preserves its color.

Click a card or its link icon to select it, then click a card in another column to associate them. Clicking the selected card again cancels the selection. Embedded links, fields, media players and other controls retain their own interactions without selecting the card. The link icon also remains the keyboard selection control and drag handle.

| Control or gesture | Result |
| --- | --- |
| Click a card | Select it or associate it with the selected item from another column. Clicking it again cancels selection. Embedded controls do not select the card. |
| Select | Select an item, then one in each other column to build a group. Select an existing member to extend its group. Select the same item again to cancel. |
| Drag a Select button | Drop it on an item in the other list to associate the two items. |
| Remove pair / Remove from group (close icon) | Remove this member. Other members stay associated unless fewer than two remain. |
| Pair or group number | The same number identifies associated items; it does not indicate a correct answer. A group contains at most one item per column. |
| Embedded content | Use media players, links and components normally; interacting with them does not select an item. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab / Shift+Tab | Move through the selection buttons, removal buttons and interactive content. |
| Enter / Space on Select | Select the item, then activate Select in another column to extend its group. |
| Enter / Space on Remove pair / Remove from group | Remove the member and return focus to its Select button. |
| Escape | Cancel a pending selection while focus is inside an item. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Provide two or more nonempty lists with equal numbers of items. Each list may independently be `ul` or `ol`. Items at the same original rank belong to the same expected group, independently of their shuffled positions.

For column headings, provide one `dl`: each `dt` contains a heading and its following `dd` contains the corresponding list. The component transforms this structure into headed columns and associates each list with its heading for assistive technologies. Bare direct lists remain supported.

Select one item in each column to build a group. A group can remain incomplete; select one of its members to continue it. Choosing another item in an occupied column replaces that member. Removing a member preserves the remaining group unless fewer than two members remain. Drag and drop also joins items from different columns.

Items may contain text, images, SVG, audio, video and `tp-*` components. Pairing retains the original nodes and their event listeners without reconstructing media players. Changing the display order may interrupt playback. Supply meaningful alternative text and accessible names for non-text content. The separate Select control prevents media playback from accidentally selecting an answer.

Every list is independently shuffled on initialization and on `reset()`, without changing the stored author ranks. Randomization is always active; there is no `shuffle` attribute. Reconnecting the same element preserves its current order and associations. `disabled` disables association controls, but leaves embedded media usable; presence means true and absence means false.

The component collects associations, not scores. Pair numbers are identifiers, not correctness indicators. Author pairings are present in the document and must not be treated as hidden examination answers. Lists are captured once when valid content is available; reconnecting preserves state. To replace the exercise, create a new component.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Associate each English expression with its French translation using Select buttons or drag and drop. Remove or replace a pair and observe its shared pair number.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.

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

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
:::::::::::::::

## Programming

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

### API

<!-- tp-docgen:api TpMatching -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>disabled</code> | <code>boolean</code> | <code>false</code> | Disables association controls without disabling embedded media. |
  | <code>heading</code> | <code>boolean</code> | <code>false</code> | Uses the first list as column headings instead of matchable items. |
  [Attributes of `<tp-matching>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | <code>reset</code> | <code>reset(): void</code> | Clears all groups and reshuffles every list; emits change when values changed. |
  [Public methods of `TpMatching`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | <code>change</code> | <code>&#123; value: TpMatchingValue; complete: boolean &#125;</code> | Emitted after associations change; ranks refer to the original lists. |
  [Events emitted by `<tp-matching>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | <code>&#45;&#45;tp-matching-columns</code> | <code>2</code> | Controls the columns. |
  [CSS properties of `<tp-matching>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/api/classes/components_matching_matching.TpMatching.html)
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

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-matching>` are loaded automatically by this component if they have not already been loaded by another component.

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

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-dragdrop>`](../dragdrop/index.md) : Generic drag-and-drop controller for content.
- [`<tp-icon-button>`](../icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
