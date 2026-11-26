:::::: tp-markdown-viewer { label="tp-sql-notebook" allow-script preserve-source }
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

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/sql-notebook/sql-notebook.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-sql-notebook");
element1.append(document.createTextNode("\n    "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/markdown");
element2.textContent = "# Interactive SQL\n\nSelect **Run all cells** to execute the program. Use the code button in a cell to edit its source.";
element1.append(element2);
element1.append(document.createTextNode("\n    "));

const element3 = document.createElement("script");
element3.setAttribute("type", "tp/sql");
element3.setAttribute("filename", "tables.sql");
element3.textContent = "CREATE TABLE language (name TEXT);\nINSERT INTO language VALUES ('SQL');";
element1.append(element3);
element1.append(document.createTextNode("\n    "));

const element4 = document.createElement("script");
element4.setAttribute("type", "tp/sql");
element4.setAttribute("filename", "query.sql");
element4.textContent = "SELECT * FROM language;";
element1.append(element4);
element1.append(document.createTextNode("\n  "));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Messages, errors and HTML export"}
:::: tp-sql-notebook { label="Messages and errors" }
::: script { type="tp/markdown" }
# Messages and errors

Click inside the first code editor and press <kbd>Shift</kbd>+<kbd>Return</kbd>.
SQL displays the message in its result table; it has no console.log function.
The second cell has not run yet.

Then click inside the second code editor and press <kbd>Shift</kbd>+<kbd>Return</kbd>.
Its console opens automatically to show the intentional error. Edit the code and rerun the current cell.

Export this notebook as HTML, open the downloaded file and repeat both shortcuts.
The exported cells use the same simple presentation and automatic console behavior.
Internet access is required to load the components and their execution engines.
:::

::: script { type="tp/sql" filename="query.sql" }
SELECT 'Message from the first cell.' AS message;
:::

::: script { type="tp/markdown" }
## An intentional error

Run the following cell separately to open its error console.
:::

::: script { type="tp/sql" filename="query.sql" }
SELECT * FROM intentional_notebook_error;
:::
::::
```
:::::
::::::
