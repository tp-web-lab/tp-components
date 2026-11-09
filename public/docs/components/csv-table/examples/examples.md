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
