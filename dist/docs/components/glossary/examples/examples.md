:::::: tp-markdown-viewer { label="tp-glossary" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: div { data-tp-reference-scope }
Read more :tp-ref:{href="%example"}.

::: tp-glossary { ref="example" title="Example" }
Additional information with **HTML content**.
:::

::: tp-listof { selector="tp-glossary" }
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/glossary/glossary.js";
import "/components/listof/listof.js";
import "/components/ref/ref.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("div");
element1.setAttribute("data-tp-reference-scope", "");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("p");
element2.append(document.createTextNode("Read more "));

const element3 = document.createElement("tp-ref");
element3.setAttribute("href", "%example");
element2.append(element3);
element2.append(document.createTextNode("."));
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element4 = document.createElement("tp-glossary");
element4.setAttribute("ref", "example");
element4.setAttribute("title", "Example");

const element5 = document.createElement("p");
element5.append(document.createTextNode("Additional information with "));

const element6 = document.createElement("strong");
element6.append(document.createTextNode("HTML content"));
element5.append(element6);
element5.append(document.createTextNode("."));
element4.append(element5);
element1.append(element4);
element1.append(document.createTextNode("\n  "));

const element7 = document.createElement("tp-listof");
element7.setAttribute("selector", "tp-glossary");
element1.append(element7);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
:::::
::::::
