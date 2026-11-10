<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="post-it" library="components" size="1.25em"></tp-icon> Post-it

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-post-it>` element displays a movable floating paper note that folds into a pushpin.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
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
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-post-it" src="/docs/components/post-it/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Authoring

To postit a fragment of HTML, simply wrap it in the **`<tp-post-it>`** element.

<pre><code class="language-html">&lt;p&gt;Here is a paragraph.&lt;/p&gt;

&lt;tp-post-it&gt;
  &lt;p&gt;Here is a paragraph enclosed within the &lt;code&gt;tp-post-it&lt;/code&gt; element.&lt;/p&gt;
&lt;/tp-post-it&gt;
</code></pre>

### Programming notes

- `toggle()` folds or opens the note while retaining its content. It emits `tp-post-it-toggle` and moves focus to the pin if the focused content becomes hidden.
- `moveTo(x, y)` moves the note to viewport coordinates in pixels and attaches its pin to the element underneath it. Invalid coordinates are ignored.
- `attachTo(element, x, y, initial = false)` attaches the pin to an element, using pixel offsets from that element's top-left corner. The note follows the target when the page scrolls or its layout changes. By default, this changes only the current attachment. Passing `true` as the fourth argument (as in `note.attachTo(target, 20, 30, true)`) also makes this attachment the destination for later calls to `resetPosition()`.
- `resetPosition()` restores the initial attachment without changing the note's content or folded state.

### Importing

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

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Drag the yellow reminder over the surrounding page using its header, or focus the header and use arrow keys. Click the pin to fold and reopen the note without losing its content.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

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

- [`<tp-base>`](#/components/base/index.md) : Shared base class for tp-* components.
- [`<tp-box>`](#/components/box/index.md) : Simple box layout component.
- [`<tp-color>`](#/components/color/index.md) : Brand color preset controller scoped to the containing element.
- [`<tp-icon-button>`](#/components/icon-button/index.md) : Accessible icon button component.

### External

<!--
@summary No external dependency.
-->
No external dependency

### See also

- [`<tp-post-it-editor>`](#/components/post-it-editor/index.md) : Create a post-it interactively and save it.
<!-- tp-docgen:dependencies:end -->
