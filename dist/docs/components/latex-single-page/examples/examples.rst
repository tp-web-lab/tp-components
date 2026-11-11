.. tp-restructuredtext-viewer::
   :label: tp-latex-single-page
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-latex-single-page::
            :label: A short guide

            .. script::
               :type: tp/latex

               \section*{A short guide}
               This document is rendered as a single page.
               \subsection*{Getting started}
               \begin{itemize}
                 \item Read the introduction
                 \item Try a component
               \end{itemize}

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/latex/latex.js";
            import "/components/latex-single-page/latex-single-page.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-latex-single-page");
            element1.setAttribute("label", "A short guide");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/latex");
            element2.textContent = "\n\\section*{A short guide}\nThis document is rendered as a single page.\n\\subsection*{Getting started}\n\\begin{itemize}\n  \\item Read the introduction\n  \\item Try a component\n\\end{itemize}\n  ";
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);
