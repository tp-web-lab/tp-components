::::::: tp-markdown-viewer { label="tp-fill-blank-question" allow-script }
:::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-fill-blank-question { case-sensitive }
Answers
:
  1. Paris

  2. Rome

Title
:
  Geography

Prompt
:
  Complete both sentences.

Form
:
  The capital of France is :tp-textfield:`france-capital`{name="france-capital" placeholder="Capital" aria-label="Capital of France" clearable}.

  The capital of Italy is :tp-textfield:`italy-capital`{name="italy-capital" placeholder="Capital" aria-label="Capital of Italy" clearable}.

Feedback
:
  Check the spelling of each capital.

  - The capital of France is home to the Eiffel Tower.

  - The capital of Italy is home to the Colosseum.

Solution
:
  The capital of France is Paris. The capital of Italy is Rome.
:::
```

``` example {label="Attributes"}
Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

::::: tp-stack
::: tp-checkbox-list { id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value }
- case-sensitive

- closed

- partial
:::

::: tp-cluster
:::

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

::: tp-iframe { id="attributes-frame" title="fill-blank-question attribute preview" style="height: 24rem; display: flow-root; inline-size: auto;" }
:::

::: tp-callout { id="attributes-status" variant="info" heading="Preview status" }
Preparing the preview…
:::

::: script { type="module" src="/tp-components/docs/components/fill-blank-question/examples/attributes.js" }
:::
```

``` example {label="Geography"}
:::: tp-fill-blank-question { lang="en" }
Answers
:
  1. Paris
  2. Berlin
  3. Rome

Title
: Geography

Prompt
: Complete the sentences with the capitals.

Form
:
  The capital of France is :tp-textfield:`france`{name="france" aria-label="Capital of France" placeholder="City name" clearable}.

  The capital of Germany is :tp-textfield:`germany`{name="germany" aria-label="Capital of Germany" placeholder="City name" clearable}.

  The capital of Italy is :tp-textfield:`italy`{name="italy" aria-label="Capital of Italy" placeholder="City name" clearable}.

Feedback
: Check the capital of each country and its spelling.

Solution
: France: Paris. Germany: Berlin. Italy: Rome.
::::
```

``` example {label="Irregular verbs"}
:::: tp-fill-blank-question { lang="en" }
Answers
:
  1. went
  2. saw
  3. took

Title
: Irregular verbs

Prompt
: Complete each sentence with the past simple form of the verb shown in the blank.

Form
:
  Yesterday, I :tp-textfield:`go`{name="go" aria-label="Past simple of go" placeholder="go" clearable} to school.

  Last night, she :tp-textfield:`see`{name="see" aria-label="Past simple of see" placeholder="see" clearable} a shooting star.

  Last Monday, we :tp-textfield:`take`{name="take" aria-label="Past simple of take" placeholder="take" clearable} the train.

Feedback
: These verbs are irregular: their past simple forms do not end in -ed.

Solution
: go → went; see → saw; take → took.
::::
```

``` example {label="Baltic capitals and flags"}
:::: tp-fill-blank-question { closed lang="en" }
Answers
:
  1. Tallinn
  2. :tp-icon:{name="ee" library="flags" aria-label="Flag of Estonia"}
  3. Riga
  4. :tp-icon:{name="lv" library="flags" aria-label="Flag of Latvia"}
  5. Vilnius
  6. :tp-icon:{name="lt" library="flags" aria-label="Flag of Lithuania"}

Title
: Baltic capitals and flags

Prompt
: Match each country with its capital and national flag.

Form
:
  Estonia has :tp-blank:`estonia-capital`{name="estonia-capital" aria-label="Capital of Estonia"} as its capital and :tp-blank:`estonia-flag`{name="estonia-flag" aria-label="Flag of Estonia"} as its national flag.

  Latvia has :tp-blank:`latvia-capital`{name="latvia-capital" aria-label="Capital of Latvia"} as its capital and :tp-blank:`latvia-flag`{name="latvia-flag" aria-label="Flag of Latvia"} as its national flag.

  Lithuania has :tp-blank:`lithuania-capital`{name="lithuania-capital" aria-label="Capital of Lithuania"} as its capital and :tp-blank:`lithuania-flag`{name="lithuania-flag" aria-label="Flag of Lithuania"} as its national flag.

Feedback
: Check which country each capital and flag belongs to.

Solution
: Estonia: Tallinn; Latvia: Riga; Lithuania: Vilnius. Match each flag with its country.
::::
```

``` example {label="Square root"}
---
extensions: [math]
---

:::: tp-fill-blank-question { closed lang="en" }
Answers
:
  1. :latexmath:`\mathbb{R}_{+}`
  2. :latexmath:`\mathbb{R}_{+}^{*}`
  3. :latexmath:`\frac{1}{2\sqrt{x}}`

Title
: The square root function

Prompt
: Complete the sentence with the mathematical expressions.

Form
:
  The square root function :latexmath:`f(x) = \sqrt{x}` is defined on :tp-blank:`domain`{name="domain" aria-label="Domain"}, differentiable on :tp-blank:`differentiability`{name="differentiability" aria-label="Domain of differentiability"}, and :latexmath:`f'(x) =` :tp-blank:`derivative`{name="derivative" aria-label="Derivative"}.

Feedback
: Consider whether zero belongs to the domain and whether the derivative exists there.

Solution
: The domain is :latexmath:`\mathbb{R}_{+} = [0, +\infty)`. The function is differentiable on :latexmath:`\mathbb{R}_{+}^{*} = (0, +\infty)`, with :latexmath:`f'(x) = \frac{1}{2\sqrt{x}}`.
::::
```
::::::
:::::::
