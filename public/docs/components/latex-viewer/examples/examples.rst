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

      .. example:: Compare presentation modes

         .. role:: example-kbd-1(kbd)

         .. role:: example-kbd-2(kbd)

         .. role:: example-kbd-3(kbd)

         .. role:: example-kbd-4(kbd)

         .. role:: example-kbd-5(kbd)

         .. role:: example-kbd-6(kbd)

         .. section::

            .. heading-level:: 3

            mode="default" — Standard controls
            ==================================

            Open Code to edit the source, then click Run or press :example-kbd-1:`Shift`\ +\ :example-kbd-2:`Enter` in the editor.

            .. tp-latex-viewer::
               :mode: default

               .. script::
                  :type: tp/latex

                  \section{Viewer modes}
                  Change this \textbf{message}, then run the source.

         .. section::

            .. heading-level:: 3

            mode="lite" — Compact controls
            ==============================

            Open Code to edit the source, then click Run or press :example-kbd-3:`Shift`\ +\ :example-kbd-4:`Enter` in the editor.

            .. tp-latex-viewer::
               :mode: lite

               .. script::
                  :type: tp/latex

                  \section{Viewer modes}
                  Change this \textbf{message}, then run the source.

         .. section::

            .. heading-level:: 3

            mode="simple" — Editor and rendered output only
            ===============================================

            Edit the code below, keep the cursor in the editor and press :example-kbd-5:`Shift`\ +\ :example-kbd-6:`Enter` (Return) to run it. This viewer has no Run button.

            .. tp-latex-viewer::
               :mode: simple

               .. script::
                  :type: tp/latex

                  \section{Viewer modes}
                  Change this \textbf{message}, then run the source.
