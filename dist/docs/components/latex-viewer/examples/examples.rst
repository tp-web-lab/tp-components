.. tp-restructuredtext-viewer::
   :label: tp-latex-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-latex-viewer::

            .. script::
               :type: tp/latex

               \section{Hello}A formula $x^2$.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/latex/latex.js";
            import "/components/latex-viewer/latex-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-latex-viewer");

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/latex");
            element2.textContent = "\\section{Hello}A formula $x^2$.";
            element1.append(element2);
            example.append(element1);

            document.body.append(example);
