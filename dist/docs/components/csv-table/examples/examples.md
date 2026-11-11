:::::: tp-markdown-viewer { label="tp-csv-table" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-csv-table { heading }
::: script { type="tp/csv-table" }
Country,Capital
Estonia,Tallinn
Latvia,Riga
Lithuania,Vilnius
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/csv-table/csv-table.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-csv-table");
element1.setAttribute("heading", "");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/csv-table");
element2.textContent = "\n    Country,Capital\n    Estonia,Tallinn\n    Latvia,Riga\n    Lithuania,Vilnius\n  ";
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Quoted fields"}
:::: tp-csv-table { heading separator=";" }
::: script { type="tp/csv-table" }
Name;Note
"Ada; Lovelace";"A quoted ""word"""
Grace;"First line
Second line"
:::
::::
```
:::::
::::::
