::::::: tp-markdown-viewer { label="tp-memory" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-memory { label="Match the fruits" }
1. Apple

2. Pear

3. Plum
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-radio-list { data-setting="back" label="back" label-position="top" orientation="horizontal" value="1" }
- Default

- file1

- file2

- file-unknown
:::

:::: tp-cluster
::: tp-textfield { data-setting="mismatch-delay" label="mismatch-delay" value="1000" placeholder="1000" clearable }
:::
::::

:::: tp-button-group
::: tp-button { id="attributes-reset" type="button" }
Reset defaults
:::

::: tp-button { id="attributes-reload" type="button" }
Reload preview
:::
::::
:::::

::: tp-divider
:::

### Preview

::: tp-iframe { id="attributes-frame" title="memory attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

::: script { type="module" src="/docs/components/memory/examples/attributes.js" }
:::
```

``` example {label="Numbers 0 to 9"}
:::: tp-memory { back="/medias/logos/logo-tp-components.svg" }
1. ::: tp-icon { name="0" library="numbers" size="5em" }
  :::
2. ::: tp-icon { name="1" library="numbers" size="5em" }
  :::
3. ::: tp-icon { name="2" library="numbers" size="5em" }
  :::
4. ::: tp-icon { name="3" library="numbers" size="5em" }
  :::
5. ::: tp-icon { name="4" library="numbers" size="5em" }
  :::
6. ::: tp-icon { name="5" library="numbers" size="5em" }
  :::
7. ::: tp-icon { name="6" library="numbers" size="5em" }
  :::
8. ::: tp-icon { name="7" library="numbers" size="5em" }
  :::
9. ::: tp-icon { name="8" library="numbers" size="5em" }
  :::
10. ::: tp-icon { name="9" library="numbers" size="5em" }
  :::
::::
```

``` example {label="European Union flags"}
:::: tp-memory { back="/medias/logos/logo-tp-markdown.svg" }
- ::: tp-icon { name="at" library="flags" size="5em" title="Austria" }
  :::
- ::: tp-icon { name="be" library="flags" size="5em" title="Belgium" }
  :::
- ::: tp-icon { name="bg" library="flags" size="5em" title="Bulgaria" }
  :::
- ::: tp-icon { name="hr" library="flags" size="5em" title="Croatia" }
  :::
- ::: tp-icon { name="cy" library="flags" size="5em" title="Cyprus" }
  :::
- ::: tp-icon { name="cz" library="flags" size="5em" title="Czechia" }
  :::
- ::: tp-icon { name="dk" library="flags" size="5em" title="Denmark" }
  :::
- ::: tp-icon { name="ee" library="flags" size="5em" title="Estonia" }
  :::
- ::: tp-icon { name="fi" library="flags" size="5em" title="Finland" }
  :::
- ::: tp-icon { name="fr" library="flags" size="5em" title="France" }
  :::
- ::: tp-icon { name="de" library="flags" size="5em" title="Germany" }
  :::
- ::: tp-icon { name="gr" library="flags" size="5em" title="Greece" }
  :::
- ::: tp-icon { name="hu" library="flags" size="5em" title="Hungary" }
  :::
- ::: tp-icon { name="ie" library="flags" size="5em" title="Ireland" }
  :::
- ::: tp-icon { name="it" library="flags" size="5em" title="Italy" }
  :::
- ::: tp-icon { name="lv" library="flags" size="5em" title="Latvia" }
  :::
- ::: tp-icon { name="lt" library="flags" size="5em" title="Lithuania" }
  :::
- ::: tp-icon { name="lu" library="flags" size="5em" title="Luxembourg" }
  :::
- ::: tp-icon { name="mt" library="flags" size="5em" title="Malta" }
  :::
- ::: tp-icon { name="nl" library="flags" size="5em" title="Netherlands" }
  :::
- ::: tp-icon { name="pl" library="flags" size="5em" title="Poland" }
  :::
- ::: tp-icon { name="pt" library="flags" size="5em" title="Portugal" }
  :::
- ::: tp-icon { name="ro" library="flags" size="5em" title="Romania" }
  :::
- ::: tp-icon { name="sk" library="flags" size="5em" title="Slovakia" }
  :::
- ::: tp-icon { name="si" library="flags" size="5em" title="Slovenia" }
  :::
- ::: tp-icon { name="es" library="flags" size="5em" title="Spain" }
  :::
- ::: tp-icon { name="se" library="flags" size="5em" title="Sweden" }
  :::
::::
```
::::::
:::::::
