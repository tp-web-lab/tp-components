:::::: tp-markdown-viewer { label="tp-sql-notebook" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-sql-notebook
::: script { type="tp/markdown" }
# Interactive SQL

Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.
:::

::: script { type="tp/sql" filename="tables.sql" }
CREATE TABLE language (name TEXT);
INSERT INTO language VALUES ('SQL');
:::

::: script { type="tp/sql" filename="query.sql" }
SELECT * FROM language;
:::
::::
```
:::::
::::::
