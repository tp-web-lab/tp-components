.. tp-restructuredtext-viewer::
   :label: tp-markdown-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-markdown-viewer::

            .. script::
               :type: tp/markdown

               # Live Markdown

               Edit this source and select **Run**.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/markdown/markdown.js";
            import "/components/markdown-viewer/markdown-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-markdown-viewer");
            element1.append(document.createTextNode("\n      "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/markdown");
            element2.textContent = "\n        # Live Markdown\n\n        Edit this source and select **Run**.\n      ";
            element1.append(element2);
            element1.append(document.createTextNode("\n    "));
            example.append(element1);

            document.body.append(example);

      .. example:: Multiple examples

         .. tp-markdown-viewer::

            .. script::
               :type: tp/markdown

               ``` example {label="Paragraph and list"}
               A paragraph with **strong text** and *emphasis*.

               - Alpha
               - Beta
               ```

               ``` example {label="Table"}
               | Language | Purpose |
               | --- | --- |
               | Markdown | Technical writing |
               | HTML | Web documents |
               ```

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

            .. tp-markdown-viewer::
               :mode: default

               .. script::
                  :type: tp/markdown

                  ## Viewer modes

                  Change this **message**, then run the source.

         .. section::

            .. heading-level:: 3

            mode="lite" — Compact controls
            ==============================

            Open Code to edit the source, then click Run or press :example-kbd-3:`Shift`\ +\ :example-kbd-4:`Enter` in the editor.

            .. tp-markdown-viewer::
               :mode: lite

               .. script::
                  :type: tp/markdown

                  ## Viewer modes

                  Change this **message**, then run the source.

         .. section::

            .. heading-level:: 3

            mode="simple" — Editor and rendered output only
            ===============================================

            Edit the code below, keep the cursor in the editor and press :example-kbd-5:`Shift`\ +\ :example-kbd-6:`Enter` (Return) to run it. This viewer has no Run button.

            .. tp-markdown-viewer::
               :mode: simple

               .. script::
                  :type: tp/markdown

                  ## Viewer modes

                  Change this **message**, then run the source.
