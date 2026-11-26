.. tp-restructuredtext-viewer::
   :label: tp-equanum
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-ref-1(tp-ref)
            :href: =energy
            :tp-empty: true

         .. div::
            :data-tp-reference-scope:

            .. tp-equanum::
               :ref: energy
               :number: 2.1

               .. math::

                  E = mc^2

            See equation :example-tp-ref-1:`reference-energy-1`.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/equanum/equanum.js";
            import "/components/math/math.js";
            import "/components/ref/ref.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("div");
            element1.setAttribute("data-tp-reference-scope", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("tp-equanum");
            element2.setAttribute("ref", "energy");
            element2.setAttribute("number", "2.1");
            element2.append(document.createTextNode("\n    "));

            const element3 = document.createElement("tp-math");
            element3.setAttribute("displaystyle", "");
            element3.setAttribute("value", "E = mc^2");
            element2.append(element3);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element4 = document.createElement("p");
            element4.append(document.createTextNode("See equation "));

            const element5 = document.createElement("tp-ref");
            element5.setAttribute("href", "=energy");
            element4.append(element5);
            element4.append(document.createTextNode("."));
            element1.append(element4);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: align row previews

         .. tp-latex::

            .. script::
               :type: tp/latex

               \usepackage{amsmath}
               \begin{align}
               x &= 1\label{row:first} \\
               y &= 2\label{row:second}
               \end{align}
               Compare \eqref{row:first} and \eqref{row:second}: each reference previews only its own equation.

      .. example:: alignat row previews

         .. tp-latex::

            .. script::
               :type: tp/latex

               \usepackage{amsmath}
               \begin{alignat}{2}
               x &= 1 &\qquad z &= 3\label{row:first} \\
               y &= 2 &\qquad w &= 4\label{row:second}
               \end{alignat}
               Compare \eqref{row:first} and \eqref{row:second}: each reference previews only its own equation.

      .. example:: flalign row previews

         .. tp-latex::

            .. script::
               :type: tp/latex

               \usepackage{amsmath}
               \begin{flalign}
               x &= 1 &&\label{row:first} \\
               y &= 2 &&\label{row:second}
               \end{flalign}
               Compare \eqref{row:first} and \eqref{row:second}: each reference previews only its own equation.

      .. example:: gather row previews

         .. tp-latex::

            .. script::
               :type: tp/latex

               \usepackage{amsmath}
               \begin{gather}
               x = 1\label{row:first} \\
               y = 2\label{row:second}
               \end{gather}
               Compare \eqref{row:first} and \eqref{row:second}: each reference previews only its own equation.

      .. example:: eqnarray row previews

         .. tp-latex::

            .. script::
               :type: tp/latex

               \usepackage{amsmath}
               \begin{eqnarray}
               x &=& 1\label{row:first} \\
               y &=& 2\label{row:second}
               \end{eqnarray}
               Compare \eqref{row:first} and \eqref{row:second}: each reference previews only its own equation.
