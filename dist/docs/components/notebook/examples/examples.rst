.. tp-restructuredtext-viewer::
   :label: tp-notebook
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-notebook::

            .. script::
               :type: tp/markdown

               # Notebook example
               Here is a notebook that combines AsciiDoc, HTML, LaTeX, Markdown and reStructuredText as markup languages, and Python and JavaScript as programming languages.

               ## Calculation
               We perform a simple multiplication in Python to demonstrate the calculation.

            .. script::
               :type: tp/python

               x = 6 * 7
               print(x)

            .. script::
               :type: tp/restructuredtext
               :doctest:

               .. h2::

                  Verification

               We use the doctest blocks in reStructuredText to verify the output of the Python code.

               >>> print(6 * 7)
               42

            .. script::
               :type: tp/html

               In JavaScript, we would have written the following code:

            .. script::
               :type: tp/javascript

               const x = 6 * 7;
               console.log(x)

            .. script::
               :type: tp/asciidoc

               == Result
               The result of the multiplication is displayed using Asciidoc and Mathjax:

               latexmath:[x = 6 * 7 = 42]

            .. script::
               :type: tp/latex

               \section*{LaTeX and TP styles}
               The same result can be written in LaTeX: $6 \times 7 = 42$.

               \begin{itemize}
                 \item Ordinary lists use the shared TP styles.
                 \item Nested lists keep their hierarchy.
                   \begin{itemize}
                     \item This is a nested item.
                   \end{itemize}
               \end{itemize}

               \wcTpCallout[variant=info,heading=LaTeX inside a component]{
                 \textbf{The component controls its appearance.}
                 \begin{itemize}
                   \item Keep the LaTeX source readable.
                   \item Reuse the same TP typography and list styles.
                 \end{itemize}
               }

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/note/note.js";
            import "/components/notebook/notebook.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-notebook");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/markdown");
            element2.textContent = "\n    # Notebook example\n    Here is a notebook that combines AsciiDoc, HTML, LaTeX, Markdown and reStructuredText as markup languages, and Python and JavaScript as programming languages.\n\n    ## Calculation\n    We perform a simple multiplication in Python to demonstrate the calculation.\n  ";
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("script");
            element3.setAttribute("type", "tp/python");
            element3.textContent = "\n    x = 6 * 7\n    print(x)\n  ";
            element1.append(element3);
            element1.append(document.createTextNode("\n  "));

            const element4 = document.createElement("script");
            element4.setAttribute("type", "tp/restructuredtext");
            element4.setAttribute("doctest", "");
            element4.textContent = "\n    .. h2::\n\n       Verification\n\n    We use the doctest blocks in reStructuredText to verify the output of the Python code.\n\n    >>> print(6 * 7)\n    42\n  ";
            element1.append(element4);
            element1.append(document.createTextNode("\n  "));

            const element5 = document.createElement("script");
            element5.setAttribute("type", "tp/html");
            element5.textContent = "\n    In JavaScript, we would have written the following code:\n  ";
            element1.append(element5);
            element1.append(document.createTextNode("\n  "));

            const element6 = document.createElement("script");
            element6.setAttribute("type", "tp/javascript");
            element6.textContent = "\n    const x = 6 * 7;\n    console.log(x)\n  ";
            element1.append(element6);
            element1.append(document.createTextNode("\n  "));

            const element7 = document.createElement("script");
            element7.setAttribute("type", "tp/asciidoc");
            element7.textContent = "\n    == Result\n    The result of the multiplication is displayed using Asciidoc and Mathjax:\n\n    latexmath:[x = 6 * 7 = 42]\n  ";
            element1.append(element7);
            element1.append(document.createTextNode("\n  "));

            const element8 = document.createElement("script");
            element8.setAttribute("type", "tp/latex");
            element8.textContent = "\n    \\section*{LaTeX and TP styles}\n    The same result can be written in LaTeX: $6 \\times 7 = 42$.\n\n    \\begin{itemize}\n      \\item Ordinary lists use the shared TP styles.\n      \\item Nested lists keep their hierarchy.\n        \\begin{itemize}\n          \\item This is a nested item.\n        \\end{itemize}\n    \\end{itemize}\n\n    \\wcTpCallout[variant=info,heading=LaTeX inside a component]{\n      \\textbf{The component controls its appearance.}\n      \\begin{itemize}\n        \\item Keep the LaTeX source readable.\n        \\item Reuse the same TP typography and list styles.\n      \\end{itemize}\n    }\n  ";
            element1.append(element8);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);
