:::::: tp-markdown-viewer { label="tp-prolog" allow-script preserve-source }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-prolog
::: script { type="tp/prolog" }
color(red).
color(green).
color(blue).
:::
::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/prolog/prolog.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-prolog");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("script");
element2.setAttribute("type", "tp/prolog");
element2.textContent = "\n    color(red).\n    color(green).\n    color(blue).\n  ";
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Integer constraints"}
:::: tp-prolog { query="digit(X), labeling([], [X])." }
::: script { type="tp/prolog" }
:- use_module(library(clpfd)).

digit(X) :- X in 1..3.
:::
::::
```

``` example {label="External Prolog file"}
::: tp-prolog { src="/docs/components/prolog/examples/colors.pl" }
:::
```

``` example {label="DOM elements and click events"}
Click Run to execute the prefilled `setup_dom.` query, then click the generated button. SWI-Prolog automatically loads `dom` when append\_html/2 or bind/4 is first used. Open the SWI-Prolog libraries menu afterward to see its check; loading dom there beforehand is optional.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="setup_dom." }
:::

::: script { type="module" }
import "/components/button/button.js";
import "/components/prolog/prolog.js";
:::

:::: tp-prolog { query="setup_dom." }
::: script { type="tp/prolog" filename="dom-demo.pl" }
:- use_module(library(wasm)).

% SWI-Prolog autoloads dom when its predicates are first called.
setup_dom :-
    Host := document.getElementById("prolog-dom-demo"),
    _ := Host.replaceChildren(),
    append_html(Host, [
        Button = 'tp-button'([variant=brand], 'Click me'),
        Message = p('Waiting for a click.')
    ]),
    bind(Button, click, _, clicked(Message)).

clicked(Message) :-
    Message.textContent := "The click was handled by Prolog!".
:::
::::

::: div { id="prolog-dom-demo" aria-live="polite" }
:::
```

``` example {label="Library aggregate: Aggregate values"}
Click Run directly. SWI-Prolog loads aggregate automatically when needed, unless it has already been loaded by a dependency. Inspect its check in the libraries menu after execution; no manual loading is required for this example.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="aggregate_all(sum(Amount), salary(_, Amount), Total)." }
:::

Expected: `Total = 100`. Totals the two salaries.

:::: tp-prolog { query="aggregate_all(sum(Amount), salary(_, Amount), Total)." }
::: script { type="tp/prolog" filename="aggregate-demo.pl" }
salary(ada, 40).
salary(byron, 60).
:::
::::
```

``` example {label="Library apply: Map a predicate"}
Click Run directly. SWI-Prolog loads apply automatically when needed, unless it has already been loaded by a dependency. Inspect its check in the libraries menu after execution; no manual loading is required for this example.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="maplist(double, [1, 2, 3], Doubles)." }
:::

Expected: `Doubles = [2,4,6]`. Applies double/2 to every list item.

:::: tp-prolog { query="maplist(double, [1, 2, 3], Doubles)." }
::: script { type="tp/prolog" filename="apply-demo.pl" }
double(X, Y) :- Y is 2 * X.
:::
::::
```

``` example {label="Library assoc: Key-value associations"}
Click Run directly. SWI-Prolog loads assoc automatically when needed, unless it has already been loaded by a dependency. Inspect its check in the libraries menu after execution; no manual loading is required for this example.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="lookup_score(Score)." }
:::

Expected: `Score = 42`. Builds an association tree and retrieves a value by key.

:::: tp-prolog { query="lookup_score(Score)." }
::: script { type="tp/prolog" filename="assoc-demo.pl" }
lookup_score(Score) :-
    empty_assoc(A0),
    put_assoc(ada, A0, 42, A1),
    get_assoc(ada, A1, Score).
:::
::::
```

``` example {label="Library clpfd: Finite-domain constraints"}
This example requires clpfd: select it in the SWI-Prolog libraries dropdown, then click Run. The query is prefilled.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="[A, B] ins 1..3, A #< B, all_distinct([A, B]), labeling([], [A, B])." }
:::

Expected: `A = 1, B = 2`. Use Next solution to obtain A = 1, B = 3, then A = 2, B = 3.

::: tp-prolog { query="[A, B] ins 1..3, A #< B, all_distinct([A, B]), labeling([], [A, B])." }
:::
```

``` example {label="Library clpq: Exact rational constraints"}
This example requires clpq: select it in the SWI-Prolog libraries dropdown, then click Run. The query is prefilled.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="{X = 1/3 + 1/6}." }
:::

Expected: `X = 1r2`. Solves an exact rational equation; 1r2 means one half. Use this independent interpreter rather than loading clpr in the same session.

::: tp-prolog { query="{X = 1/3 + 1/6}." }
:::
```

``` example {label="Library clpr: Real-number constraints"}
This example requires clpr: select it in the SWI-Prolog libraries dropdown, then click Run. The query is prefilled.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="{2 * X = 3}." }
:::

Expected: `X = 1.5`. Solves a real-number equation. Use this independent interpreter rather than loading clpq in the same session.

::: tp-prolog { query="{2 * X = 3}." }
:::
```

``` example {label="Library dcg/basics: Parse an integer"}
This example requires dcg/basics: select it in the SWI-Prolog libraries dropdown, then click Run. The query is prefilled.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value='parse_number("42", Number).' }
:::

Expected: `Number = 42`. Parses text with the integer//1 grammar rule.

:::: tp-prolog { query='parse_number("42", Number).' }
::: script { type="tp/prolog" filename="dcg-basics-demo.pl" }
parse_number(Text, Number) :-
    string_codes(Text, Codes),
    phrase(integer(Number), Codes).
:::
::::
```

``` example {label="Library dif: Disequality constraints"}
Click Run directly. SWI-Prolog loads dif automatically when needed, unless it has already been loaded by a dependency. Inspect its check in the libraries menu after execution; no manual loading is required for this example.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="dif(X, red), member(X, [red, green, blue])." }
:::

Expected: `X = green`. Excludes red before X is known. Next solution produces X = blue.

::: tp-prolog { query="dif(X, red), member(X, [red, green, blue])." }
:::
```

``` example {label="Library lists: Reverse a list"}
Click Run directly. SWI-Prolog loads lists automatically when needed, unless it has already been loaded by a dependency. Inspect its check in the libraries menu after execution; no manual loading is required for this example.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="route(Cities), reverse(Cities, Return)." }
:::

Expected: `Cities = [paris,lyon,nice], Return = [nice,lyon,paris]`. Reverses the route using reverse/2.

:::: tp-prolog { query="route(Cities), reverse(Cities, Return)." }
::: script { type="tp/prolog" filename="lists-demo.pl" }
route([paris, lyon, nice]).
:::
::::
```

``` example {label="Library ordsets: Union of ordered sets"}
Click Run directly. SWI-Prolog loads ordsets automatically when needed, unless it has already been loaded by a dependency. Inspect its check in the libraries menu after execution; no manual loading is required for this example.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="ord_union([blue, red], [green, red], Colors)." }
:::

Expected: `Colors = [blue,green,red]`. Combines sorted sets without duplicating red.

::: tp-prolog { query="ord_union([blue, red], [green, red], Colors)." }
:::
```

``` example {label="Library pairs: Group values by key"}
Click Run directly. SWI-Prolog loads pairs automatically when needed, unless it has already been loaded by a dependency. Inspect its check in the libraries menu after execution; no manual loading is required for this example.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="group_pairs_by_key([fruit-apple, fruit-pear, vegetable-carrot], Groups)." }
:::

Expected: `Groups = [fruit-[apple,pear],vegetable-[carrot]]`. Groups consecutive pairs with the same key.

::: tp-prolog { query="group_pairs_by_key([fruit-apple, fruit-pear, vegetable-carrot], Groups)." }
:::
```

``` example {label="Library plunit: Unit tests"}
Click Run directly. The source imports plunit before declaring the tests; no dropdown action is needed. Its check appears in the libraries menu after execution.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="run_tests(arithmetic)." }
:::

Expected: `true.`. Both tests pass. Change the expected 4 to 5 in the source, click Run to see a failing test.

:::: tp-prolog { query="run_tests(arithmetic)." }
::: script { type="tp/prolog" filename="plunit-demo.pl" }
:- use_module(library(plunit)).

double(X, Y) :- Y is 2 * X.

:- begin_tests(arithmetic).

test(double_two) :-
    double(2, 4).

test(wrong_result, [fail]) :-
    double(2, 5).

:- end_tests(arithmetic).
:::
::::
```

``` example {label="Library random: Roll a die"}
Click Run directly. SWI-Prolog loads random automatically when needed, unless it has already been loaded by a dependency. Inspect its check in the libraries menu after execution; no manual loading is required for this example.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="random_between(1, 6, Die)." }
:::

Expected: `Die = an integer from 1 to 6`. Run the query several times; results may repeat.

::: tp-prolog { query="random_between(1, 6, Die)." }
:::
```

``` example {label="Library wasm: Call JavaScript"}
Click Run directly. The runtime provides wasm at initialization; no dropdown action is needed.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="Maximum := 'Math'.max(3, 7)." }
:::

Expected: `Maximum = 7`. Calls JavaScript Math.max through the := operator. The runtime already loads wasm; its check appears after initialization.

::: tp-prolog { query="Maximum := 'Math'.max(3, 7)." }
:::
```

``` example {label="Library when: Delay a goal"}
Click Run directly. SWI-Prolog loads when automatically when needed, unless it has already been loaded by a dependency. Inspect its check in the libraries menu after execution; no manual loading is required for this example.

::: tp-textfield { label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="when(nonvar(X), Y is X * 2), X = 21." }
:::

Expected: `X = 21, Y = 42`. Delays the multiplication until X has a value.

::: tp-prolog { query="when(nonvar(X), Y is X * 2), X = 21." }
:::
```

``` example {label="Presentation modes and automatic reload"}
Each interpreter has its own session. Default and lite show the normal controls; simple opens the editor and hides the header and welcome information. Prolog keeps its query buttons and Libraries dropdown, including Next solution, All solutions and Accept.

In each mode, click Run to obtain X = 10, then Next solution to obtain X = 20, and All solutions to display the remaining answer, X = 30. Click All solutions again after the query has finished to display all three answers at once; Run is not required first. These buttons remain available in simple mode.

In default and lite, open Edit source; simple already shows it. Change answer(10). to answer(100)., then click Run or press Return in the query field. The first answer becomes X = 100 and “\> Program reloaded.” appears. Run again without editing: no new reload message appears. Shift+Return works too.

### Default

:::: tp-prolog { mode="default" query="answer(X)." }
::: script { type="tp/prolog" filename="answer.pl" }
answer(10).
answer(20).
answer(30).
:::
::::

### Lite

:::: tp-prolog { mode="lite" query="answer(X)." }
::: script { type="tp/prolog" filename="answer.pl" }
answer(10).
answer(20).
answer(30).
:::
::::

### Simple

:::: tp-prolog { mode="simple" query="answer(X)." }
::: script { type="tp/prolog" filename="answer.pl" }
answer(10).
answer(20).
answer(30).
:::
::::
```

``` example {label="Execution trace drawer"}
::: tp-prolog { tracer src="/docs/components/prolog-tracer/examples/family.pl" query="ancestor(ann, Who)." }
:::
```
:::::
::::::
