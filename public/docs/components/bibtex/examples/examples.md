:::::: tp-markdown-viewer { label="tp-bibtex" allow-script preserve-source }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-bibtex { src="/docs/components/bibtex/examples/books.bib" }
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/bibtex/bibtex.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-bibtex");
element1.setAttribute("src", "/docs/components/bibtex/examples/books.bib");
example.append(element1);

document.body.append(example);
:::
```

``` example {label="BibTeX script"}
:::: tp-bibtex
::: script { type="tp/bibtex" }
@book{knuth1984,
  author = {Donald E. Knuth},
  title = {The \TeX book},
  publisher = {Addison-Wesley},
  year = {1984}
}
:::
::::
```

``` example {label="LaTeX bibliography"}
::: tp-bibtex { src="/docs/components/bibtex/examples/books.bib" out="latex" }
:::
```

``` example {label="CSL-JSON input"}
:::: tp-bibtex { in="clsjson" out="tp-biblio" }
::: script { type="tp/clsjson" }
[
  {
    "id": "lamport1994",
    "type": "book",
    "author": [
      {
        "given": "Leslie",
        "family": "Lamport"
      }
    ],
    "title": "LaTeX: A Document Preparation System",
    "edition": "2",
    "publisher": "Addison-Wesley",
    "issued": {
      "date-parts": [
        [
          1994
        ]
      ]
    }
  }
]
:::
::::
```

``` example {label="CSL-JSON to LaTeX"}
::: tp-bibtex { src="/docs/components/bibtex/examples/books.json" in="clsjson" out="latex" }
:::
```
:::::
::::::
