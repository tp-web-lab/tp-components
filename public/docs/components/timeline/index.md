<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="timeline" library="components" size="1.25em"></tp-icon> Timeline

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-timeline>` element arranges chronological events on a vertical or horizontal timeline.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
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
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-timeline" src="/docs/components/timeline/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

Declare one direct `dl` per event. Each `dt` names a field and its following `dd` supplies the content:

- `Time` (required): a date, time or milestone label; use a native `time` element with `datetime` when a machine-readable date is useful.
- `Icon` (optional): a decorative marker, typically a `tp-icon`. Without it, the marker is an empty circle. Do not put interactive controls or essential information here: markers are hidden from assistive technology.
- `Title` (required): the event title.
- `Content` (optional): explanatory text, markup, links or other components.

Field names are case-insensitive and their order inside an event does not matter. Events remain in author order; they are not automatically sorted by date. The original content nodes are preserved when the definition lists become an ordered list. New direct event lists appended after initialization are also converted.

In native markup, consecutive definition lists may be merged by the parser. You can therefore also use one list with repeated groups: start every event with `Time`, followed by its other fields.

Set `orientation="horizontal"` for a horizontal timeline; the default is `vertical`. Invalid orientation values fall back to vertical. In right-to-left documents, the layout follows the reading direction.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Read the three workshop events in order: time appears opposite the title and content, and events without an icon use an empty circle.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.
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
@tp-dependency tp-icon
@summary SVG icon component with inline, URL, and registry sources.
-->

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-callout>`](#/components/callout/index.md) : Callout component for highlighted contextual content.
- [`<tp-icon>`](#/components/icon/index.md) : SVG icon component with inline, URL, and registry sources.

### External

<!--
@summary No external dependency.
-->
No external dependency
<!-- tp-docgen:dependencies:end -->
