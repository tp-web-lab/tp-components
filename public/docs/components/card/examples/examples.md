:::::: tp-markdown-viewer { label="tp-card" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-card
header
:
  content header

footer
:
  content footer

main
:
  content body
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/card/card.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-card");
element1.append(document.createTextNode("\n        "));

const element2 = document.createElement("dl");
element2.append(document.createTextNode("\n          "));

const element3 = document.createElement("dt");
element3.append(document.createTextNode("header"));
element2.append(element3);

const element4 = document.createElement("dd");
element4.append(document.createTextNode("content header"));
element2.append(element4);
element2.append(document.createTextNode("\n          "));

const element5 = document.createElement("dt");
element5.append(document.createTextNode("footer"));
element2.append(element5);

const element6 = document.createElement("dd");
element6.append(document.createTextNode("content footer"));
element2.append(element6);
element2.append(document.createTextNode("\n          "));

const element7 = document.createElement("dt");
element7.append(document.createTextNode("main"));
element2.append(element7);

const element8 = document.createElement("dd");
element8.append(document.createTextNode("content body"));
element2.append(element8);
element2.append(document.createTextNode("\n        "));
element1.append(element2);
element1.append(document.createTextNode("\n      "));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Image card"}
::: tp-card
main
: ![Seashore](https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80)
:::
```

``` example {label="Icon card"}
:::: tp-card
main
:
  :tp-icon:{name="logo-tp-components" size="5em"}
::::
```
:::::
::::::
