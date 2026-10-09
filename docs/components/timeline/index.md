# <tp-icon name="timeline" library="components" size="1.25em"></tp-icon> Timeline

<tp-toc position="end" expand-all open brand></tp-toc>

The custom `<tp-timeline>` element implements the Timeline functionality: arranges chronological events on a vertical or horizontal timeline.

<tp-timeline>
  <dl>
    <dt>Time</dt><dd>09:00</dd>
    <dt>Icon</dt><dd><tp-icon name="home"></tp-icon></dd>
    <dt>Title</dt><dd>Welcome</dd>
    <dt>Content</dt><dd>Meet the team and explore the project.</dd>
  </dl>
  <dl>
    <dt>Time</dt><dd>10:00</dd>
    <dt>Title</dt><dd>Workshop</dd>
    <dt>Content</dt><dd>Build your first component together.</dd>
  </dl>
  <dl>
    <dt>Time</dt><dd>12:00</dd>
    <dt>Title</dt><dd>Closing session</dd>
  </dl>
</tp-timeline>

## Usage

### User interactions

#### Mouse interactions

| Control or gesture | Result |
| --- | --- |
| Events | Read events in order. Vertical layouts place time beside the title; horizontal layouts place time above it. |
| Horizontal scrolling | Scroll to reach events outside the visible area. |
| Links and controls | Use embedded event controls normally. |

#### Keyboard interactions

| Key or gesture | Result |
| --- | --- |
| Tab | Focuses the horizontal event list and any interactive event content. |
| ArrowLeft / ArrowRight | Scrolls the focused horizontal event list left or right. |
| Ctrl+? | Open User Help for the component under the pointer, or the focused component if none is hovered. Include Shift if needed to type ?. |

### Author directives

Declare one direct `dl` per event. Each `dt` names a field and its following `dd` supplies the content:

- `Time` (required): a date, time or milestone label; use a native `time` element with `datetime` when a machine-readable date is useful.
- `Icon` (optional): a decorative marker, typically a `tp-icon`. Without it, the marker is an empty circle. Do not put interactive controls or essential information here: markers are hidden from assistive technology.
- `Title` (required): the event title.
- `Content` (optional): explanatory text, markup, links or other components.

Field names are case-insensitive and their order inside an event does not matter. Events remain in author order; they are not automatically sorted by date. The original content nodes are preserved when the definition lists become an ordered list. New direct event lists appended after initialization are also converted.

In native markup, consecutive definition lists may be merged by the parser. You can therefore also use one list with repeated groups: start every event with `Time`, followed by its other fields.

Set `orientation="horizontal"` for a horizontal timeline; the default is `vertical`. Invalid orientation values fall back to vertical. In right-to-left documents, the layout follows the reading direction.

## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the three workshop events in order: time appears opposite the title and content, and events without an icon use an empty circle.

Attributes
: Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.
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

### API

<!-- tp-docgen:api TpTimeline -->
::: tp-tabs
Attributes
: | Attribute | Type | Default | Description |
  | --- | --- | --- | --- |
  | <code>orientation</code> | <code>string</code> | <code>&quot;vertical&quot;</code> | Timeline orientation (`vertical` or `horizontal`). |
  [Attributes of `<tp-timeline>`]

Methods
: | Method | Signature | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Public methods of `TpTimeline`]

Events
: | Event | Detail | Description |
  | --- | --- | --- |
  | None. |  |  |
  [Events emitted by `<tp-timeline>`]

CSS properties
: | CSS property | Default | Description |
  | --- | --- | --- |
  | None. |  |  |
  [CSS properties of `<tp-timeline>`]
:::
<!-- /tp-docgen:api -->

<!-- tp-docgen:typedoc:start -->
[More details…](/tp-components/api/classes/components_timeline.TpTimeline.html)
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
  <script type="module" src="/path/to/components/timeline/timeline.js"></script>
  ```

import
: ```js
  import "/path/to/components/timeline/timeline.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/timeline/timeline.js";
  ```
:::

<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by `<tp-timeline>` are loaded automatically by this component if they have not already been loaded by another component.

<!--
@tp-dependency tp-base
@summary Shared base class for tp-* components.
-->
<!--
@tp-dependency tp-callout
@summary Callout component for highlighted contextual content.
-->
<!--
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->

- [`<tp-base>`](../base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](../callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-icon>`](../icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
