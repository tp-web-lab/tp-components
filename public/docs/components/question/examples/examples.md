:::::: tp-markdown-viewer { label="tp-question" allow-script }
::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
:::: tp-question
Title
:
  Reflection

Prompt
:
  Describe one benefit of web components.

Form
:
  ::: tp-textfield { multiline rows="3" placeholder="Type your answer..." }
  :::

Feedback
:
  Think about encapsulation and reuse.

Solution
:
  They package reusable behavior behind a custom element.
::::
```

``` example {label="Timed question"}
:::: tp-question { timing="00:00:10" open }
Title
:
  A timed reflection

Prompt
:
  Name one reusable web component.

Form
:
  ::: tp-textfield { clearable placeholder="Your answer" }
  :::

Solution
:
  A button, a timer or an audio recorder.
::::
```

``` example {label="Optional score"}
:::: tp-fill-blank-question { score open }
Title
:
  An optional numerical score

Answers
:
  1. blue

Prompt
:
  Type blue, then submit.

Form
:
  ::: tp-textfield { clearable label="Color" }
  :::

Feedback
:
  Use the word requested in the prompt.

Solution
:
  blue
::::
```
:::::
::::::
