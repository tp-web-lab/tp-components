:::::: tp-markdown-viewer { label="tp-python-notebook" allow-script preserve-source }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-python-notebook
::: script { type="tp/markdown" }
# Interactive Python

Select **Run all cells** to execute the program. Edit the program directly in each cell; its query is prefilled.
:::

::: script { type="tp/python" query="message" }
message = "Hello from Python"
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/python/python.js";
import "/components/python-notebook/python-notebook.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-python-notebook");
element1.append(document.createTextNode("\n    "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/markdown");
element2.textContent = "# Interactive Python\n\nSelect **Run all cells** to execute the program. Edit the program directly in each cell; its query is prefilled.";
element1.append(element2);
element1.append(document.createTextNode("\n    "));

const element3 = document.createElement("script");
element3.setAttribute("type", "tp/python");
element3.setAttribute("query", "message");
element3.textContent = "message = \"Hello from Python\"";
element1.append(element3);
element1.append(document.createTextNode("\n  "));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Messages, errors and HTML export"}
:::: tp-python-notebook { label="Messages and errors" }
::: script { type="tp/markdown" }
# Messages and errors

Click inside the first code editor and press <kbd>Shift</kbd>+<kbd>Return</kbd>.
The output displays the message.
The second cell has not run yet.

Then click inside the second code editor and press <kbd>Shift</kbd>+<kbd>Return</kbd>.
The output displays the intentional error. Edit the code and rerun the current cell.

Export this notebook as HTML, open the downloaded file and repeat both shortcuts.
The exported cells use the same simple interpreter presentation and mandatory queries and unified output.
Internet access is required to load the components and their execution engines.
:::

::: script { type="tp/python" query="run_cell_1()" }
def run_cell_1():
    print("Message from the first cell.")
:::

::: script { type="tp/markdown" }
## An intentional error

Run the following cell separately to display its error.
:::

::: script { type="tp/python" query="run_cell_2()" }
def run_cell_2():
    raise RuntimeError("Intentional error from the second cell.")
:::
::::
```

``` example {label="Program queries and automatic reload"}
:::: tp-python-notebook
::: script { type="tp/markdown" }
# Program and query

Press Return in the query field to obtain 10. Change 10 to 20 in the program,
then press Return in the query field or Shift+Return in the editor.
The program displays “> Program reloaded.” before the query, then the result 20.
Run again without editing: there is no new reload message.
Export HTML and try changing 20 to 30. Clear the query: execution requires a nonempty query.
:::

::: script { type="tp/python" filename="answer.py" query="answer()" }
def answer():
    return 10
:::
::::
```
:::::
::::::
