.. tp-restructuredtext-viewer::
   :label: tp-latex-multi-slides
   :allow-script:
   :style: --tp-markup-viewer-frame-min-height: 32rem

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-latex-multi-slides::
            :repository: /docs/components/_shared/intro-documents/latex
            :label: A small guide

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/latex/latex.js";
            import "/components/latex-multi-slides/latex-multi-slides.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-latex-multi-slides");
            element1.setAttribute("repository", "/docs/components/_shared/intro-documents/latex");
            element1.setAttribute("label", "A small guide");
            example.append(element1);

            document.body.append(example);
