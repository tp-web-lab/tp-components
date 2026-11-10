.. tp-restructuredtext-viewer::
   :label: tp-latex-playground
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-latex-playground::

            .. script::
               :type: tp/latex

               \section{Hello}A formula $x^2$.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/latex/latex.js";
            import "/components/latex-playground/latex-playground.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-latex-playground");

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/latex");
            element2.textContent = "\\section{Hello}A formula $x^2$.";
            element1.append(element2);
            example.append(element1);

            document.body.append(example);

      .. example:: A document in sections

         .. tp-latex-playground::
            :repository: /examples/playgrounds/latex-playground/09-sectioned-document

      .. example:: A document with a TikZ figure

         .. tp-latex-playground::
            :repository: /examples/playgrounds/latex-playground/10-illustrated-document
