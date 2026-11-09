:::::: tp-markdown-viewer { label="tp-ref" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: div { data-tp-reference-scope }
A useful detail :tp-ref:{href="^detail"}.

::: tp-note { ref="detail" title="Detail" }
A note with **formatted content**.
:::
::::
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
:::::
::::::
