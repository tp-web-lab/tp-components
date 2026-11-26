:::::: tp-markdown-viewer { label="tp-markup-converter" allow-script preserve-source }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-markup-converter
::: script { type="tp/markdown" }
# Workshop

A **practical** introduction to markup.

| Formula | Image |
| :--- | :--- |
| :tp-math:`E = mc^2`{mode="latexmath"} | ![Canoe](/medias/image/canoe.svg){width=160} |
[Science and illustration]
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/markup-converter/markup-converter.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-markup-converter");

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/markdown");
element2.textContent = "\n# Workshop\n\nA **practical** introduction to markup.\n\n| Formula | Image |\n| :--- | :--- |\n| :tp-math:`E = mc^2`{mode=\"latexmath\"} | ![Canoe](/medias/image/canoe.svg){width=160} |\n[Science and illustration]\n";
element1.append(element2);
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Markdown source"}
:::: tp-markup-converter
::: script { type="tp/markdown" }
# Workshop

A **practical** introduction to markup.

| Formula | Image |
| :--- | :--- |
| :tp-math:`E = mc^2`{mode="latexmath"} | ![Canoe](/medias/image/canoe.svg){width=160} |
[Science and illustration]
:::
::::
```

``` example {label="HTML source"}
:::: tp-markup-converter
::: script { type="tp/html" }
<h1>Workshop</h1>
<p>A <strong>practical</strong> introduction to markup.</p>
<table><caption>Science and illustration</caption><thead><tr><th>Formula</th><th>Image</th></tr></thead><tbody><tr><td><tp-math mode="latexmath">E = mc^2</tp-math></td><td><img src="/medias/image/canoe.svg" alt="Canoe" width="160"></td></tr></tbody></table>
:::
::::
```

``` example {label="AsciiDoc source"}
:::: tp-markup-converter
::: script { type="tp/asciidoc" }
= Workshop
:showtitle:

A *practical* introduction to markup.

.Science and illustration
[cols="1,1",options="header"]
|===
|Formula |Image
|latexmath:[E = mc^2] |image:/medias/image/canoe.svg[Canoe,160]
|===
:::
::::
```

``` example {label="LaTeX source"}
:::: tp-markup-converter
::: script { type="tp/latex" }
\documentclass{article}
\usepackage{graphicx}
\begin{document}
\section*{Workshop}
A \textbf{practical} introduction to markup.
\begin{table}
\begin{tabular}{ll}
\textbf{Formula} & \textbf{Image} \\
\(E = mc^2\) & \includegraphics[width=160px]{/medias/image/canoe.svg} \\
\end{tabular}
\caption{Science and illustration}
\end{table}
\end{document}
:::
::::
```

``` example {label="reStructuredText source"}
:::: tp-markup-converter
::: script { type="tp/restructuredtext" }
Workshop
========

A **practical** introduction to markup.

.. list-table:: Science and illustration
   :header-rows: 1

   * - Formula
     - Image
   * - :math:`E = mc^2`
     - .. image:: /medias/image/canoe.svg
          :alt: Canoe
          :width: 160px
:::
::::
```

``` example {label="Rich text"}
:::: tp-markup-converter
::: script { type="tp/html" }
<h1>A riverside workshop</h1>
<p>Explore <strong>bold text</strong>, <em>emphasis</em>, <u>underlining</u> and <a href="https://example.org">a link</a>.</p>
<blockquote><p>Observe, describe and compare.</p></blockquote>
<ul><li>Read the document</li><li>Inspect the media</li></ul>
<figure><img src="/medias/image/canoe.svg" width="240" alt="Canoe"><figcaption>A canoe by the river</figcaption></figure>
<video src="/medias/video/chute-eau.mp4" controls preload="metadata" width="280" aria-label="Waterfall"></video>
<audio src="/medias/audio/glass-break.mp3" controls preload="metadata" aria-label="Glass breaking"></audio>
:::
::::
```

``` example {label="External source"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/workshop.adoc" }
:::
```

``` example {label="Native HTML comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-native.html" }
:::
```

``` example {label="Native Markdown comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-native.md" }
:::
```

``` example {label="Native AsciiDoc comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-native.adoc" }
:::
```

``` example {label="Native reStructuredText comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-native.rst" }
:::
```

``` example {label="Media and subtitles comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-rich-media.html" }
:::
```

``` example {label="Merged table comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-table-layout.html" }
:::
```

``` example {label="Math and code comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-math-and-code.html" }
:::
```

``` example {label="LaTeX text environments comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-text-environments.tex" }
:::
```

``` example {label="LaTeX flexible table comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-tables.tex" }
:::
```

``` example {label="LaTeX table rules comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-rules.tex" }
:::
```

``` example {label="LaTeX lists comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-lists.tex" }
:::
```

``` example {label="LaTeX theorems and references comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-theorems.tex" }
:::
```

``` example {label="LaTeX units comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-units.tex" }
:::
```

``` example {label="LaTeX image transformations comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-graphics.tex" }
:::
```

``` example {label="LaTeX code listings comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-listings.tex" }
:::
```

``` example {label="LaTeX array and tabularx comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-array-tabularx.tex" }
:::
```

``` example {label="LaTeX indexes comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-imakeidx.tex" }
:::
```

``` example {label="LaTeX core math environments comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-core-math-environments.tex" }
:::
```

``` example {label="LaTeX AMS equations comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-ams-environments.tex" }
:::
```

``` example {label="LaTeX multilingual quotations comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-csquotes.tex" }
:::
```

``` example {label="Index components comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-index-components.html" }
:::
```

``` example {label="Native comments comparison"}
::: tp-markup-converter { src="/docs/components/markup-converter/examples/comparison-comments.html" }
:::
```
:::::
::::::
