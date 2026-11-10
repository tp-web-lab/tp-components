::::: tp-markdown-viewer { label="tp-accordion" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-accordion { open-indexes="1" }
What is HTML?
:
  The language used to structure web pages.

What is CSS?
:
  The language used to style web pages.

What is Javascript?
:
  The language used to define the behaviour of web pages.
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/accordion/accordion.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-accordion");
element1.setAttribute("open-indexes", "1");
element1.append(document.createTextNode("\n    "));

const element2 = document.createElement("dl");
element2.append(document.createTextNode("\n      "));

const element3 = document.createElement("dt");
element3.append(document.createTextNode("What is HTML?"));
element2.append(element3);

const element4 = document.createElement("dd");
element4.append(document.createTextNode("The language used to structure web pages."));
element2.append(element4);
element2.append(document.createTextNode("\n      "));

const element5 = document.createElement("dt");
element5.append(document.createTextNode("What is CSS?"));
element2.append(element5);

const element6 = document.createElement("dd");
element6.append(document.createTextNode("The language used to style web pages."));
element2.append(element6);
element2.append(document.createTextNode("\n      "));

const element7 = document.createElement("dt");
element7.append(document.createTextNode("What is Javascript?"));
element2.append(element7);

const element8 = document.createElement("dd");
element8.append(document.createTextNode("The language used to define the behaviour of web pages."));
element2.append(element8);
element2.append(document.createTextNode("\n    "));
element1.append(element2);
element1.append(document.createTextNode("\n    "));
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
