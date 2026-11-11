<!-- tp-docgen:page-layout:v2 -->
<!-- -->
# <tp-icon name="html-blog" library="components" size="1.25em"></tp-icon> HTML blog

<div class="tp-component-doc-overview">

<div class="tp-component-doc-toc">
<tp-toc position="end" expand-all></tp-toc>
</div>

<div class="tp-component-doc-intro">

The custom `<tp-html-blog>` element lists dated articles with summaries, category and tag filters, pagination and a reader.

<div class="tp-component-doc-example">

<!-- tp-docgen:introduction:start -->
``` raw html
<tp-html-blog page-size="2">
  <script type="tp/html">
    <h2>A small garden</h2>
    <dl>
      <dt>Id</dt><dd>garden</dd>
      <dt>Date</dt><dd>2026-06-03</dd>
      <dt>Summary</dt><dd>Three ideas for a greener balcony.</dd>
      <dt>Categories</dt><dd>Life</dd>
      <dt>Tags</dt><dd>plants, outdoors</dd>
    </dl>
    <p>Start with herbs, choose a sunny spot, and water regularly.</p>

    <h2>Learning together</h2>
    <dl>
      <dt>Id</dt><dd>learning</dd>
      <dt>Date</dt><dd>2026-06-02</dd>
      <dt>Summary</dt><dd>Notes from our first workshop.</dd>
      <dt>Categories</dt><dd>Learning</dd>
      <dt>Tags</dt><dd>community, ideas</dd>
    </dl>
    <p>A short shared exercise makes a good starting point for discussion.</p>

    <h2>Welcome</h2>
    <dl>
      <dt>Id</dt><dd>welcome</dd>
      <dt>Date</dt><dd>2026-06-01</dd>
      <dt>Summary</dt><dd>What you will find in this blog.</dd>
      <dt>Categories</dt><dd>Life</dd>
      <dt>Tags</dt><dd>community</dd>
    </dl>
    <p>We share practical ideas and small discoveries. Come back for the next article.</p>
  </script>
</tp-html-blog>
```
<!-- tp-docgen:introduction:end -->

</div>

</div>

</div>

<!-- -->
## Component viewer

<tp-component-viewer tag="tp-html-blog" src="/docs/components/html-blog/examples/introduction.html"></tp-component-viewer>

<!-- -->
## Usage

### Initial content

::: tp-tabs
no content
: Displays “No articles yet.”

attribute
: Set `value` to the markup index. Escape markup characters in HTML attribute values.

internal script
: Place the index in a `<script type="tp/html">` child, as in the introduction.

external file
: Use `src="articles.html"`. Article and image paths resolve relative to that file.
:::

### Article structure

Start each article with a level-two heading, followed by a native definition list and the article body. Use these terms:

| Term | Meaning |
| --- | --- |
| Id | Optional unique identifier for opening an article through the `article` attribute; otherwise the heading ID or a generated identifier is used. |
| Date | Required publication date, in `YYYY-MM-DD` format. The list is sorted newest first. |
| Summary | Short plain-text excerpt shown in the list; defaults to the first content paragraph. |
| Categories | Optional comma-separated categories. |
| Tags | Optional comma-separated tags. |
| Source | Optional article file, loaded when opened; replaces the inline body. A linked heading can also supply its URL. |
| Language | Optional external article language for the generic blog: `html`, `markdown`, `asciidoc` or `restructuredtext`. Specialized blogs always use their fixed language. |

In reStructuredText, begin the index with a document title, then use second-level article headings. Dates and identifiers are validated; an error is displayed rather than silently dropping invalid articles.

### Selection and pagination

Use `page-size` to set the number of articles per page. `category` and `tag` apply together. `page` selects a list page and `article` opens an article by its identifier. Returning to the list preserves the current page and filters. No browser URL or history is changed, so multiple blogs can coexist.

### Importing

::: tp-tabs
script
: Autoloading:

  ```html
  <script type="module" src="tp-loader.js"></script>
  ```

  Cherry picking:

  ```html
  <script type="module" src="/path/to/components/html-blog/html-blog.js"></script>
  ```

import
: ```js
  import "/path/to/components/html-blog/html-blog.js";
  ```

bundler
: ```js
  import "@tp/tp-components/components/html-blog/html-blog.js";
  ```
:::

<!-- -->
## Examples

<!-- tp-docgen:example-descriptions:start -->
Basic usage
: Browse pages, combine the category and tag filters, and open an article before returning to the list.

Javascript API
: Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.

External articles
: Open A small garden to load its complete article from a separate file relative to the index.
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
@tp-dependency tp-markup-blog
@summary Paginated markup articles with category and tag filters.
-->

- [`<tp-markup-blog>`](#/components/markup-blog/index.md) : Paginated markup articles with category and tag filters.

### External

<!--
@summary No external dependency.
-->
No external dependency

### See also

- [`<tp-markup-blog>`](#/components/markup-blog/index.md) : Mix article languages and share the blog index format.
<!-- tp-docgen:dependencies:end -->
