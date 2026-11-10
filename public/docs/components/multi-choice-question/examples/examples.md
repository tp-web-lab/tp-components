::::: tp-markdown-viewer { label="tp-multi-choice-question" allow-script }
:::: script { type="tp/markdown" }
``` example {label="Basic usage"}
::: tp-multi-choice-question { answer="1,3,5" random }
Title
:
  Web languages

Prompt
:
  Select the styling languages, including CSS preprocessors.

Form
:
  - CSS

  - HTML

  - Sass

  - JavaScript

  - Less

Feedback
:
  - Correct. CSS describes presentation.

  - HTML structures content.

  - Correct. Sass is a CSS preprocessor.

  - JavaScript is a programming language.

  - Correct. Less is a CSS preprocessor.

Solution
:
  CSS, Sass and Less are used to define styles.
:::
```

``` example {label="Javascript API"}
::: script { type="module" }
import "/components/multi-choice-question/multi-choice-question.js";

const example = document.createDocumentFragment();

const element1 = document.createElement("tp-multi-choice-question");
element1.setAttribute("answer", "1,3,5");
element1.setAttribute("random", "");
element1.append(document.createTextNode("\n  "));

const element2 = document.createElement("dl");
element2.append(document.createTextNode("\n    "));

const element3 = document.createElement("dt");
element3.append(document.createTextNode("Title"));
element2.append(element3);

const element4 = document.createElement("dd");
element4.append(document.createTextNode("Web languages"));
element2.append(element4);
element2.append(document.createTextNode("\n    "));

const element5 = document.createElement("dt");
element5.append(document.createTextNode("Prompt"));
element2.append(element5);

const element6 = document.createElement("dd");
element6.append(document.createTextNode("Select the styling languages, including CSS preprocessors."));
element2.append(element6);
element2.append(document.createTextNode("\n    "));

const element7 = document.createElement("dt");
element7.append(document.createTextNode("Form"));
element2.append(element7);

const element8 = document.createElement("dd");

const element9 = document.createElement("ul");

const element10 = document.createElement("li");
element10.append(document.createTextNode("CSS"));
element9.append(element10);

const element11 = document.createElement("li");
element11.append(document.createTextNode("HTML"));
element9.append(element11);

const element12 = document.createElement("li");
element12.append(document.createTextNode("Sass"));
element9.append(element12);

const element13 = document.createElement("li");
element13.append(document.createTextNode("JavaScript"));
element9.append(element13);

const element14 = document.createElement("li");
element14.append(document.createTextNode("Less"));
element9.append(element14);
element8.append(element9);
element2.append(element8);
element2.append(document.createTextNode("\n    "));

const element15 = document.createElement("dt");
element15.append(document.createTextNode("Feedback"));
element2.append(element15);

const element16 = document.createElement("dd");

const element17 = document.createElement("ul");

const element18 = document.createElement("li");
element18.append(document.createTextNode("Correct. CSS describes presentation."));
element17.append(element18);

const element19 = document.createElement("li");
element19.append(document.createTextNode("HTML structures content."));
element17.append(element19);

const element20 = document.createElement("li");
element20.append(document.createTextNode("Correct. Sass is a CSS preprocessor."));
element17.append(element20);

const element21 = document.createElement("li");
element21.append(document.createTextNode("JavaScript is a programming language."));
element17.append(element21);

const element22 = document.createElement("li");
element22.append(document.createTextNode("Correct. Less is a CSS preprocessor."));
element17.append(element22);
element16.append(element17);
element2.append(element16);
element2.append(document.createTextNode("\n    "));

const element23 = document.createElement("dt");
element23.append(document.createTextNode("Solution"));
element2.append(element23);

const element24 = document.createElement("dd");
element24.append(document.createTextNode("CSS, Sass and Less are used to define styles."));
element2.append(element24);
element2.append(document.createTextNode("\n  "));
element1.append(element2);
element1.append(document.createTextNode("\n"));
example.append(element1);

document.body.append(example);
:::
```

``` example {label="Derivatives of tan(x)"}
---
extensions: [math]
---

::: tp-multi-choice-question { answer="1,3" lang="en" random }
Title
:
  Equivalent derivatives of the tangent

Prompt
:
  Select all expressions equal to the derivative of :latexmath:`f(x) = \tan(x)` wherever :latexmath:`\cos(x) \ne 0`.

Form
:
  - :latexmath:`\displaystyle \frac{1}{\cos^2(x)}`

  - :latexmath:`1 - \tan^2(x)`

  - :latexmath:`1 + \tan^2(x)`

  - :latexmath:`\cos^2(x)`

  - :latexmath:`\displaystyle -\frac{1}{\sin^2(x)}`

Feedback
:
  - Correct. Apply the quotient rule to sine divided by cosine.

  - The identity uses a plus sign, not a minus sign.

  - Correct. This is equivalent to the reciprocal square of the cosine.

  - The square of the cosine belongs in the denominator.

  - This is the derivative of the cotangent, not the tangent.

Solution
:
  :latexmath:`\displaystyle f'(x) = \frac{1}{\cos^2(x)} = 1 + \tan^2(x)`. The expression :latexmath:`1 - \tan^2(x)` is not the derivative.
:::
```

``` example {label="Markup languages"}
::: tp-multi-choice-question { answer="1,3,5" lang="en" orientation="horizontal" random }
Title
:
  Recognize markup languages

Prompt
:
  Select the three logos representing markup languages rather than programming languages.

Form
:
  - :tp-icon:{name="file_type_html" library="languages" size="2em" role="img" aria-label="HTML"}

  - :tp-icon:{name="file_type_javascript" library="languages" size="2em" role="img" aria-label="JavaScript"}

  - :tp-icon:{name="file_type_markdown" library="languages" size="2em" role="img" aria-label="Markdown"}

  - :tp-icon:{name="file_type_python" library="languages" size="2em" role="img" aria-label="Python"}

  - :tp-icon:{name="file_type_asciidoc" library="languages" size="2em" role="img" aria-label="AsciiDoc"}

  - :tp-icon:{name="file_type_typescript" library="languages" size="2em" role="img" aria-label="TypeScript"}

Feedback
:
  - Correct. HTML marks up the structure of web documents.

  - JavaScript is a programming language.

  - Correct. Markdown is a lightweight markup language.

  - Python is a programming language.

  - Correct. AsciiDoc is a markup language for documents.

  - TypeScript is a programming language based on JavaScript.

Solution
:
  :tp-icon:{name="file_type_html" library="languages" size="1em" aria-hidden="true"} HTML, :tp-icon:{name="file_type_markdown" library="languages" size="1em" aria-hidden="true"} Markdown and :tp-icon:{name="file_type_asciidoc" library="languages" size="1em" aria-hidden="true"} AsciiDoc are markup languages.

  :tp-icon:{name="file_type_javascript" library="languages" size="1em" aria-hidden="true"} JavaScript, :tp-icon:{name="file_type_python" library="languages" size="1em" aria-hidden="true"} Python and :tp-icon:{name="file_type_typescript" library="languages" size="1em" aria-hidden="true"} TypeScript are programming languages.
:::
```

``` example {label="No correct choices"}
::: tp-multi-choice-question { answer }
Title
:
  No correct choices

Prompt
:
  Select the even numbers. If none applies, submit without selecting a box.

Form
:
  - 3

  - 5

  - 7

Solution
:
  All three numbers are odd. Leaving every box unchecked is correct.
:::
```
::::
:::::
