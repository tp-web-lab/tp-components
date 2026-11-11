::::: tp-markdown-viewer { label="tp-word-cloud" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-word-cloud { shape="circle" color="glaz" bg-color="glaz" scale="1" rotate="0" }
1. :tp-icon:{name="logo-tp" aria-label="tp logo"}

2. 

3. quizzes, playgrounds, viewers, notebooks

4. simulators, plots, games

5. 

6. documentations, editors, pickers, controllers, feedbacks

7. markdown, asciidoc, latex, restructuredtext

8. forms, overlays, medias, times

9. 

10. utilities
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/icon/icon.js";
import "/components/word-cloud/word-cloud.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-word-cloud");
element1.setAttribute("shape", "circle");
element1.setAttribute("color", "glaz");
element1.setAttribute("bg-color", "glaz");
element1.setAttribute("scale", "1");
element1.setAttribute("rotate", "0");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("ol");
element2.append(document.createTextNode("\n    "));

const element3 = document.createElement("li");

const element4 = document.createElement("tp-icon");
element4.setAttribute("name", "logo-tp");
element4.setAttribute("aria-label", "tp logo");
element3.append(element4);
element2.append(element3);
element2.append(document.createTextNode("\n    "));

const element5 = document.createElement("li");
element2.append(element5);
element2.append(document.createTextNode("\n    "));

const element6 = document.createElement("li");
element6.append(document.createTextNode("quizzes, playgrounds, viewers, notebooks"));
element2.append(element6);
element2.append(document.createTextNode("\n    "));

const element7 = document.createElement("li");
element7.append(document.createTextNode("simulators, plots, games"));
element2.append(element7);
element2.append(document.createTextNode("\n    "));

const element8 = document.createElement("li");
element2.append(element8);
element2.append(document.createTextNode("\n    "));

const element9 = document.createElement("li");
element9.append(document.createTextNode("documentations, editors, pickers, controllers, feedbacks"));
element2.append(element9);
element2.append(document.createTextNode("\n    "));

const element10 = document.createElement("li");
element10.append(document.createTextNode("markdown, asciidoc, latex, restructuredtext"));
element2.append(element10);
element2.append(document.createTextNode("\n    "));

const element11 = document.createElement("li");
element11.append(document.createTextNode("forms, overlays, medias, times"));
element2.append(element11);
element2.append(document.createTextNode("\n    "));

const element12 = document.createElement("li");
element2.append(element12);
element2.append(document.createTextNode("\n    "));

const element13 = document.createElement("li");
element13.append(document.createTextNode("utilities"));
element2.append(element13);
element2.append(document.createTextNode("\n  "));
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
