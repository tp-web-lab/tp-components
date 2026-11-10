:::::: tp-markdown-viewer { label="tp-asciidoc-viewer" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-asciidoc-viewer
::: script { type="tp/asciidoc" }
= Live AsciiDoc
:showtitle:

Edit this source and select *Run*.
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/asciidoc/asciidoc.js";
import "/components/asciidoc-viewer/asciidoc-viewer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-asciidoc-viewer");
element1.append(document.createTextNode("\n        "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/asciidoc");
element2.textContent = "\n          = Live AsciiDoc\n          :showtitle:\n\n          Edit this source and select *Run*.\n        ";
element1.append(element2);
element1.append(document.createTextNode("\n      "));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Multiple examples"}
:::: tp-asciidoc-viewer
::: script { type="tp/asciidoc" }
.Paragraph and list
====
A paragraph with *strong text* and _emphasis_.

* Alpha
* Beta
====

.Table
====
|===
| Language | Purpose

| AsciiDoc
| Technical writing

| HTML
| Web documents
|===
====
:::
::::
```
:::::
::::::
