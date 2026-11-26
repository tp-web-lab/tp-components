::::::: tp-markdown-viewer { label="tp-latex-viewer" allow-script preserve-source }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-latex-viewer
::: script { type="tp/latex" }
\section{Hello}A formula $x^2$.
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/latex/latex.js";
import "/components/latex-viewer/latex-viewer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-latex-viewer");

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/latex");
element2.textContent = "\\section{Hello}A formula $x^2$.";
element1.append(element2);
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Compare presentation modes"}
::::: section
### mode="default" — Standard controls

Open Code to edit the source, then click Run or press :kbd:Shift{}+:kbd:Enter{} in the editor.

:::: tp-latex-viewer { mode="default" }
::: script { type="tp/latex" }
\section{Viewer modes}
Change this \textbf{message}, then run the source.
:::
::::
:::::

::::: section
### mode="lite" — Compact controls

Open Code to edit the source, then click Run or press :kbd:Shift{}+:kbd:Enter{} in the editor.

:::: tp-latex-viewer { mode="lite" }
::: script { type="tp/latex" }
\section{Viewer modes}
Change this \textbf{message}, then run the source.
:::
::::
:::::

::::: section
### mode="simple" — Editor and rendered output only

Edit the code below, keep the cursor in the editor and press :kbd:Shift{}+:kbd:Enter{} (Return) to run it. This viewer has no Run button.

:::: tp-latex-viewer { mode="simple" }
::: script { type="tp/latex" }
\section{Viewer modes}
Change this \textbf{message}, then run the source.
:::
::::
:::::
```
::::::
:::::::
