::::::::: tp-markdown-viewer { label="tp-exercise" allow-script }
:::::::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::::::: tp-exercise { open }
Title
:
  A day at the museum

Context
:
  The museum opens at 9 a.m. Admission costs 8 euros.

Questions
:
  :::::: ol { class="questions" }
  ::::: li
  :::: tp-question { open="input" }
  Title
  :
    Opening time

  Prompt
  :
    When does the museum open?

  Form
  :
    ::: tp-textfield { label="Your answer" }
    :::

  Feedback
  :
    Compare your answer with the opening time in the context.

  Solution
  :
    At 9 a.m.
  ::::
  :::::

  ::::: li
  :::: tp-question { open="input" }
  Title
  :
    Admission

  Prompt
  :
    How much do two tickets cost?

  Form
  :
    ::: tp-textfield { label="Your answer" }
    :::

  Feedback
  :
    Multiply the price of one ticket by two.

  Solution
  :
    16 euros.
  ::::
  :::::
  ::::::
:::::::
```

``` example {label="Timed exercise"}
::::::: tp-exercise { timing="00:00:10" open }
Title
:
  A day at the museum

Context
:
  The museum opens at 9 a.m. Admission costs 8 euros.

Questions
:
  :::::: ol { class="questions" }
  ::::: li
  :::: tp-question { open="input" }
  Title
  :
    Opening time

  Prompt
  :
    When does the museum open?

  Form
  :
    ::: tp-textfield { label="Your answer" }
    :::

  Feedback
  :
    Compare your answer with the opening time in the context.

  Solution
  :
    At 9 a.m.
  ::::
  :::::

  ::::: li
  :::: tp-question { open="input" }
  Title
  :
    Admission

  Prompt
  :
    How much do two tickets cost?

  Form
  :
    ::: tp-textfield { label="Your answer" }
    :::

  Feedback
  :
    Multiply the price of one ticket by two.

  Solution
  :
    16 euros.
  ::::
  :::::
  ::::::
:::::::
```

``` example {label="Nested exercises"}
:::::: tp-exercise { open }
Title
:
  A museum visit

Context
:
  The museum opens at 9 a.m.

Questions
:
  1. :::: tp-question { open="input" }
     Title
     :
       Opening time

     Prompt
     :
       When does the museum open?

     Form
     :
       ::: tp-textfield { label="Your answer" }
       :::

     Feedback
     :
       Compare your answer with the context.

     Solution
     :
       At 9 a.m.
     ::::

  2. ::::: tp-exercise
     Title
     :
       The guided tour

     Context
     :
       The tour starts at 10 a.m. and lasts one hour.

     Questions
     :
       1. :::: tp-question { open="input" }
          Title
          :
            End of the tour

          Prompt
          :
            When does the tour finish?

          Form
          :
            ::: tp-textfield { label="Your answer" }
            :::

          Feedback
          :
            Compare your answer with the context.

          Solution
          :
            At 11 a.m.
          ::::
     :::::
::::::
```
::::::::
:::::::::
