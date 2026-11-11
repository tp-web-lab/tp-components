::::::: tp-markdown-viewer { label="tp-listof" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::::: div { data-tp-reference-scope }
::: tp-listof { selector="figure" }
:::

:::: figure
A diagram of the water cycle.

::: figcaption
The water cycle
:::
::::

:::: figure
A diagram of a food chain.

::: figcaption
A food chain
:::
::::
:::::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/listof/listof.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("div");
element1.setAttribute("data-tp-reference-scope", "");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("tp-listof");
element2.setAttribute("selector", "figure");
element1.append(element2);
element1.append(document.createTextNode("\n  "));

const element3 = document.createElement("figure");

const element4 = document.createElement("p");
element4.append(document.createTextNode("A diagram of the water cycle."));
element3.append(element4);

const element5 = document.createElement("figcaption");
element5.append(document.createTextNode("The water cycle"));
element3.append(element5);
element1.append(element3);
element1.append(document.createTextNode("\n  "));

const element6 = document.createElement("figure");

const element7 = document.createElement("p");
element7.append(document.createTextNode("A diagram of a food chain."));
element6.append(element7);

const element8 = document.createElement("figcaption");
element8.append(document.createTextNode("A food chain"));
element6.append(element8);
element1.append(element6);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Notes, bibliography and glossary"}
:::: div { data-tp-reference-scope }
Read a note :tp-ref:{href="^method"}, consult a source :tp-ref:{href="@book"}, or look up :tp-ref:{href="%ecosystem"}. Compare another note :tp-ref:{href="^weather"}, then read the first note again :tp-ref:{href="^method"}.

::: tp-note { ref="method" title="Method" }
Observe the habitat at **three different times** of day.

- Record the weather.

- Compare your observations.
:::

::: tp-biblio { ref="book" title="Book" }
Alex Example. *Field observation handbook*. Example Press, 2026.
:::

::: tp-glossary { ref="ecosystem" title="Ecosystem" }
A community of organisms interacting with their physical environment.
:::

::: tp-note { ref="weather" }
Record the temperature and cloud cover.
:::

::: tp-biblio { ref="atlas" }
Alex Example. *A field atlas*. Example Press, 2025.
:::

::: tp-glossary { ref="community" }
A group of interacting populations.
:::

### Notes

::: tp-listof { selector="tp-note" }
:::

### Bibliography

::: tp-listof { selector="tp-biblio" }
:::

### Glossary

::: tp-listof { selector="tp-glossary" }
:::
::::
```
::::::
:::::::
