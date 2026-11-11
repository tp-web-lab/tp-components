:::::: tp-markdown-viewer { label="tp-sql-viewer" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box
The query lists three European capitals. Expand the query in the result panel to see its rows.

::: tp-sql-viewer { src="/docs/components/_shared/intro-projects/sql.json" }
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/box/box.js";
import "/components/sql-viewer/sql-viewer.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-box");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("p");
element2.append(document.createTextNode("The query lists three European capitals. Expand the query in the result panel to see its rows."));
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("tp-sql-viewer");
element3.setAttribute("src", "/docs/components/_shared/intro-projects/sql.json");
element1.append(element3);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="src"}
::: tp-sql-viewer { src="/docs/components/sql-viewer/examples/example.json" }
:::
```

``` example {label="script without filename"}
:::: tp-sql-viewer
::: script { type="tp/sql" }
CREATE TABLE users (name TEXT NOT NULL);
INSERT INTO users (name) VALUES ('Ada'), ('Grace');
:::
::::
```

``` example {label="scripts with filename"}
:::: tp-sql-viewer
::: script { type="tp/sql" filename="tables.sql" }
CREATE TABLE users (name TEXT NOT NULL);
INSERT INTO users (name) VALUES ('Ada'), ('Grace');
:::

::: script { type="tp/sql" filename="query.sql" }
SELECT name
FROM users
ORDER BY name;
:::
::::
```

``` example {label="error"}
:::: tp-sql-viewer
::: script { type="tp/sql" filename="query.sql" }
SELECT * FROM missing_table;
:::
::::
```

``` example {label="Single source file"}
::: tp-sql-viewer { src="/docs/components/_shared/single-source/example.sql" }
:::
```
:::::
::::::
