.. tp-restructuredtext-viewer::
   :label: tp-multi-choice-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-multi-choice-question::
            :answer: 1,3,5
            :random:

            Title
               Web languages

            Prompt
               Select the styling languages, including CSS preprocessors.

            Form
               - CSS

               - HTML

               - Sass

               - JavaScript

               - Less

            Feedback
               - Correct. CSS describes presentation.

               - HTML structures content.

               - Correct. Sass is a CSS preprocessor.

               - JavaScript is a programming language.

               - Correct. Less is a CSS preprocessor.

            Solution
               CSS, Sass and Less are used to define styles.

      .. example:: Derivatives of tan(x)

         .. tp-multi-choice-question::
            :answer: 1,3
            :lang: en
            :random:

            Title
               Equivalent derivatives of the tangent

            Prompt
               Select all expressions equal to the derivative of :latexmath:`f(x) = \tan(x)` wherever :latexmath:`\cos(x) \ne 0`.

            Form
               - :latexmath:`\displaystyle \frac{1}{\cos^2(x)}`

               - :latexmath:`1 - \tan^2(x)`

               - :latexmath:`1 + \tan^2(x)`

               - :latexmath:`\cos^2(x)`

               - :latexmath:`\displaystyle -\frac{1}{\sin^2(x)}`

            Feedback
               - Correct. Apply the quotient rule to sine divided by cosine.

               - The identity uses a plus sign, not a minus sign.

               - Correct. This is equivalent to the reciprocal square of the cosine.

               - The square of the cosine belongs in the denominator.

               - This is the derivative of the cotangent, not the tangent.

            Solution
               :latexmath:`\displaystyle f'(x) = \frac{1}{\cos^2(x)} = 1 + \tan^2(x)`. The expression :latexmath:`1 - \tan^2(x)` is not the derivative.

      .. example:: Markup languages

         .. role:: inline-tp-icon-1(tp-icon)
            :name: file_type_html
            :library: languages
            :size: 2em
            :role: img
            :aria-label: HTML

         .. role:: inline-tp-icon-2(tp-icon)
            :name: file_type_javascript
            :library: languages
            :size: 2em
            :role: img
            :aria-label: JavaScript

         .. role:: inline-tp-icon-3(tp-icon)
            :name: file_type_markdown
            :library: languages
            :size: 2em
            :role: img
            :aria-label: Markdown

         .. role:: inline-tp-icon-4(tp-icon)
            :name: file_type_python
            :library: languages
            :size: 2em
            :role: img
            :aria-label: Python

         .. role:: inline-tp-icon-5(tp-icon)
            :name: file_type_asciidoc
            :library: languages
            :size: 2em
            :role: img
            :aria-label: AsciiDoc

         .. role:: inline-tp-icon-6(tp-icon)
            :name: file_type_typescript
            :library: languages
            :size: 2em
            :role: img
            :aria-label: TypeScript

         .. |solution-typescript| image:: /docs/components/multi-choice-question/examples/logos/typescript.svg
            :alt: TypeScript
            :width: 1em
            :height: 1em

         .. |solution-asciidoc| image:: /docs/components/multi-choice-question/examples/logos/asciidoc.svg
            :alt: AsciiDoc
            :width: 1em
            :height: 1em

         .. |solution-python| image:: /docs/components/multi-choice-question/examples/logos/python.svg
            :alt: Python
            :width: 1em
            :height: 1em

         .. |solution-markdown| image:: /docs/components/multi-choice-question/examples/logos/markdown.svg
            :alt: Markdown
            :width: 1em
            :height: 1em

         .. |solution-javascript| image:: /docs/components/multi-choice-question/examples/logos/javascript.svg
            :alt: JavaScript
            :width: 1em
            :height: 1em

         .. |solution-html| image:: /docs/components/multi-choice-question/examples/logos/html.svg
            :alt: HTML
            :width: 1em
            :height: 1em

         .. tp-multi-choice-question::
            :answer: 1,3,5
            :lang: en
            :orientation: horizontal
            :random:

            Title
               Recognize markup languages

            Prompt
               Select the three logos representing markup languages rather than programming languages.

            Form
               -
                 :inline-tp-icon-1:`icon`

               -
                 :inline-tp-icon-2:`icon`

               -
                 :inline-tp-icon-3:`icon`

               -
                 :inline-tp-icon-4:`icon`

               -
                 :inline-tp-icon-5:`icon`

               -
                 :inline-tp-icon-6:`icon`

            Feedback
               - Correct. HTML marks up the structure of web documents.

               - JavaScript is a programming language.

               - Correct. Markdown is a lightweight markup language.

               - Python is a programming language.

               - Correct. AsciiDoc is a markup language for documents.

               - TypeScript is a programming language based on JavaScript.

            Solution
               |solution-html| HTML, |solution-markdown| Markdown and |solution-asciidoc| AsciiDoc are markup languages.

               |solution-javascript| JavaScript, |solution-python| Python and |solution-typescript| TypeScript are programming languages.

      .. example:: No correct choices

         .. tp-multi-choice-question::
            :answer:

            Title
               No correct choices

            Prompt
               Select the even numbers. If none applies, submit without selecting a box.

            Form
               - 3

               - 5

               - 7

            Solution
               All three numbers are odd. Leaving every box unchecked is correct.
