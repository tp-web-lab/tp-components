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

      .. example:: A document in sections

         .. tp-latex-playground::
            :repository: /examples/playgrounds/latex-playground/09-sectioned-document

      .. example:: A document with a TikZ figure

         .. tp-latex-playground::
            :repository: /examples/playgrounds/latex-playground/10-illustrated-document
