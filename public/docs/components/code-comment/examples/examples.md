:::::: tp-markdown-viewer { label="tp-code-comment" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-code-editor { id="commented-function" language="typescript" }
::: script { type="tp/typescript" }
function f(x: number): number {
  if (x > 0) { return 2 * x; } // <1>
  else { return 4 * x; } // <2>
}
:::
::::

::: tp-code-comment { for="commented-function" }
1. Positive values are doubled.

2. Zero and negative values are multiplied by four.
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/code-comment/code-comment.js";
import "/components/code-editor/code-editor.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-code-editor");
element1.setAttribute("id", "commented-function");
element1.setAttribute("language", "typescript");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/typescript");
element2.textContent = "\n    function f(x: number): number {\n      if (x > 0) { return 2 * x; } // \u003c1>\n      else { return 4 * x; } // \u003c2>\n    }\n  ";
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);
example.append(document.createTextNode("\n"));

const element3 = document.createElement("tp-code-comment");
element3.setAttribute("for", "commented-function");
element3.append(document.createTextNode("\n  "));

const element4 = document.createElement("ol");
element4.append(document.createTextNode("\n    "));

const element5 = document.createElement("li");
element5.append(document.createTextNode("Positive values are doubled."));
element4.append(element5);
element4.append(document.createTextNode("\n    "));

const element6 = document.createElement("li");
element6.append(document.createTextNode("Zero and negative values are multiplied by four."));
element4.append(element6);
element4.append(document.createTextNode("\n  "));
element3.append(element4);
element3.append(document.createTextNode("\n"));
example.append(element3);

document.body.append(example);
:::
```
:::::
::::::
