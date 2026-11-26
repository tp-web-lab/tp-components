::::::: tp-markdown-viewer { label="tp-global-listof" allow-script preserve-source }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box { style="position: relative; contain: layout; block-size: 32rem; padding: 0;" }
::: tp-html-multi-pages { repository="/docs/components/global-listof/examples/guide" label="Global lists" menu }
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/box/box.js";
import "/components/html-multi-pages/html-multi-pages.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-box");
element1.setAttribute("style", "position: relative; contain: layout; block-size: 32rem; padding: 0;");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("tp-html-multi-pages");
element2.setAttribute("repository", "/docs/components/global-listof/examples/guide");
element2.setAttribute("label", "Global lists");
element2.setAttribute("menu", "");
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Markdown guide"}
:::: tp-box { style="position: relative; contain: layout; block-size: 32rem; padding: 0;" }
::: tp-markdown-multi-pages { repository="/docs/components/global-listof/examples/markdown-guide" label="Global lists" menu }
:::
::::
```

``` example {label="AsciiDoc guide"}
:::: tp-box { style="position: relative; contain: layout; block-size: 32rem; padding: 0;" }
::: tp-asciidoc-multi-pages { repository="/docs/components/global-listof/examples/asciidoc-guide" label="Global lists" menu }
:::
::::
```

``` example {label="LaTeX guide"}
:::: tp-box { style="position: relative; contain: layout; block-size: 32rem; padding: 0;" }
::: tp-latex-multi-pages { repository="/docs/components/global-listof/examples/latex-guide" label="Global lists" menu }
:::
::::
```

``` example {label="reStructuredText guide"}
:::: tp-box { style="position: relative; contain: layout; block-size: 32rem; padding: 0;" }
::: tp-restructuredtext-multi-pages { repository="/docs/components/global-listof/examples/rst-guide" label="Global lists" menu }
:::
::::
```

``` example {label="Mixed markup guide"}
:::: tp-box { style="position: relative; contain: layout; block-size: 32rem; padding: 0;" }
::: tp-markup-multi-pages { repository="/docs/components/global-listof/examples/mixed-guide" label="Global lists" menu }
:::
::::
```

``` example {label="Bibliography across pages"}
:::: tp-box { style="position: relative; contain: layout; block-size: 32rem; padding: 0;" }
::: tp-html-multi-pages { repository="/docs/components/global-listof/examples/biblio-guide" label="Bibliography across pages" menu }
:::
::::
```

``` example {label="Glossary across pages"}
:::: tp-box { style="position: relative; contain: layout; block-size: 32rem; padding: 0;" }
::: tp-html-multi-pages { repository="/docs/components/global-listof/examples/glossary-guide" label="Glossary across pages" menu }
:::
::::
```

``` example {label="Index across pages"}
:::: tp-box { style="position: relative; contain: layout; block-size: 32rem; padding: 0;" }
::: tp-html-multi-pages { repository="/docs/components/global-listof/examples/index-guide" label="Index across pages" menu }
:::
::::
```

``` example {label="Compare merge modes"}
::::: div { data-merge-comparison }
::: tp-checkbox-list { orientation="horizontal" }
- Merge across pages
:::

Separate sections
{data-merge-status role="status"}

:::: tp-box { style="position: relative; contain: layout; block-size: 32rem; padding: 0;" }
::: tp-html-multi-pages { repository="/docs/components/global-listof/examples/merge-guide" label="Merge comparison" menu }
:::
::::
:::::

::: script { type="module" }
import "/components/checkbox-list/checkbox-list.js";
import "/components/box/box.js";
import "/components/html-multi-pages/html-multi-pages.js";
import "/components/global-listof/global-listof.js";

const example = document.querySelector("[data-merge-comparison]");
const checkbox = example.querySelector("tp-checkbox-list");
const guide = example.querySelector("tp-html-multi-pages");
const status = example.querySelector("[data-merge-status]");

function updateMerge() {
  const merge = checkbox.value === "1";
  const list = guide.querySelector("tp-global-listof");
  if (list && list.merge !== merge) list.merge = merge;
  status.textContent = merge ? "Merged list" : "Separate sections";
}

checkbox.addEventListener("tp-checkbox-list-change", updateMerge);
guide.addEventListener("tp-global-listof-ready", updateMerge);
updateMerge();
:::
```
::::::
:::::::
