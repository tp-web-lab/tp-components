::::: tp-markdown-viewer { label="tp-blank" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-fill-blank-question { mode="closed" }
Title
:
  Match the answers

Prompt
:
  Choose an answer for each blank.

Answers
:
  1. Paris

  2. ![Triangle](/docs/medias/examples/36c2ceb2a29fc3ae.svg){width="48" height="40"}

  3. ![tp-components logo](/docs/medias/logos/logo-tp.svg){width="40" height="40"}

Form
:
  The capital of France: :tp-blank:`capital`{name="capital" aria-label="Capital of France"}

  A shape with three sides: :tp-blank:`shape`{name="shape" aria-label="Three-sided shape"}

  The library logo: :tp-blank:`logo`{name="logo" aria-label="Library logo"}

Feedback
:
  Match each answer to its description.

Solution
:
  Paris; the triangle; the tp-components logo.
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/blank/blank.js";
import "/components/fill-blank/fill-blank.js";
import "/components/fill-blank-question/fill-blank-question.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-fill-blank-question");
element1.setAttribute("mode", "closed");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("dl");
element2.append(document.createTextNode("\n    "));

const element3 = document.createElement("dt");
element3.append(document.createTextNode("Title"));
element2.append(element3);

const element4 = document.createElement("dd");
element4.append(document.createTextNode("Match the answers"));
element2.append(element4);
element2.append(document.createTextNode("\n    "));

const element5 = document.createElement("dt");
element5.append(document.createTextNode("Prompt"));
element2.append(element5);

const element6 = document.createElement("dd");
element6.append(document.createTextNode("Choose an answer for each blank."));
element2.append(element6);
element2.append(document.createTextNode("\n    "));

const element7 = document.createElement("dt");
element7.append(document.createTextNode("Answers"));
element2.append(element7);
element2.append(document.createTextNode("\n    "));

const element8 = document.createElement("dd");

const element9 = document.createElement("ol");
element9.append(document.createTextNode("\n      "));

const element10 = document.createElement("li");
element10.append(document.createTextNode("Paris"));
element9.append(element10);
element9.append(document.createTextNode("\n      "));

const element11 = document.createElement("li");

const element12 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
element12.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
element12.setAttribute("width", "48");
element12.setAttribute("height", "40");
element12.setAttribute("viewBox", "0 0 48 40");
element12.setAttribute("role", "img");
element12.setAttribute("aria-label", "Triangle");

const element13 = document.createElementNS("http://www.w3.org/2000/svg", "path");
element13.setAttribute("d", "M24 3 45 37H3Z");
element13.setAttribute("fill", "none");
element13.setAttribute("stroke", "currentColor");
element13.setAttribute("stroke-width", "3");
element12.append(element13);
element11.append(element12);
element9.append(element11);
element9.append(document.createTextNode("\n      "));

const element14 = document.createElement("li");

const element15 = document.createElement("img");
element15.setAttribute("src", "/docs/medias/logos/logo-tp.svg");
element15.setAttribute("alt", "tp-components logo");
element15.setAttribute("width", "40");
element15.setAttribute("height", "40");
element14.append(element15);
element9.append(element14);
element9.append(document.createTextNode("\n    "));
element8.append(element9);
element2.append(element8);
element2.append(document.createTextNode("\n    "));

const element16 = document.createElement("dt");
element16.append(document.createTextNode("Form"));
element2.append(element16);
element2.append(document.createTextNode("\n    "));

const element17 = document.createElement("dd");
element17.append(document.createTextNode("\n      "));

const element18 = document.createElement("p");
element18.append(document.createTextNode("The capital of France: "));

const element19 = document.createElement("tp-blank");
element19.setAttribute("name", "capital");
element19.setAttribute("aria-label", "Capital of France");
element18.append(element19);
element17.append(element18);
element17.append(document.createTextNode("\n      "));

const element20 = document.createElement("p");
element20.append(document.createTextNode("A shape with three sides: "));

const element21 = document.createElement("tp-blank");
element21.setAttribute("name", "shape");
element21.setAttribute("aria-label", "Three-sided shape");
element20.append(element21);
element17.append(element20);
element17.append(document.createTextNode("\n      "));

const element22 = document.createElement("p");
element22.append(document.createTextNode("The library logo: "));

const element23 = document.createElement("tp-blank");
element23.setAttribute("name", "logo");
element23.setAttribute("aria-label", "Library logo");
element22.append(element23);
element17.append(element22);
element17.append(document.createTextNode("\n    "));
element2.append(element17);
element2.append(document.createTextNode("\n    "));

const element24 = document.createElement("dt");
element24.append(document.createTextNode("Feedback"));
element2.append(element24);

const element25 = document.createElement("dd");
element25.append(document.createTextNode("Match each answer to its description."));
element2.append(element25);
element2.append(document.createTextNode("\n    "));

const element26 = document.createElement("dt");
element26.append(document.createTextNode("Solution"));
element2.append(element26);

const element27 = document.createElement("dd");
element27.append(document.createTextNode("Paris; the triangle; the tp-components logo."));
element2.append(element27);
element2.append(document.createTextNode("\n  "));
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```
::::
:::::
