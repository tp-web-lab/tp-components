:::::: tp-markdown-viewer { label="tp-sql-viewer" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-box
The query lists three European capitals. Expand the query in the result panel to see its rows.

::: tp-sql-viewer { src="/docs/components/_shared/intro-projects/sql.json" }
:::
::::
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
