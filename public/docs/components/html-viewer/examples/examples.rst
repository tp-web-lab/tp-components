.. tp-restructuredtext-viewer::
   :label: tp-html-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-html-viewer::

            .. script::
               :type: tp/html

               <h2>Hello, HTML!</h2>
               <p>This preview renders <strong>HTML content</strong>.</p>

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/html-viewer/html-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-html-viewer");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/html");
            element2.textContent = "\n\u003ch2>Hello, HTML!\u003c/h2>\n\u003cp>This preview renders \u003cstrong>HTML content\u003c/strong>.\u003c/p>\n  ";
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Multiple examples

         .. tp-html-viewer::

            .. script::
               :type: tp/html

               <div role="example" label="Paragraph">
                 <p>A paragraph with <strong>strong text</strong>.</p>
               </div>
               <div role="example" label="Button">
                 <button type="button">Continue</button>
               </div>

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

            .. tp-html-viewer::
               :mode: default

               .. script::
                  :type: tp/html

                  <h2>Viewer modes</h2>
                  <p>Change this message, then run the source.</p>

         .. section::

            .. heading-level:: 3

            mode="lite" — Compact controls
            ==============================

            Open Code to edit the source, then click Run or press :example-kbd-3:`Shift`\ +\ :example-kbd-4:`Enter` in the editor.

            .. tp-html-viewer::
               :mode: lite

               .. script::
                  :type: tp/html

                  <h2>Viewer modes</h2>
                  <p>Change this message, then run the source.</p>

         .. section::

            .. heading-level:: 3

            mode="simple" — Editor and rendered output only
            ===============================================

            Edit the code below, keep the cursor in the editor and press :example-kbd-5:`Shift`\ +\ :example-kbd-6:`Enter` (Return) to run it. This viewer has no Run button.

            .. tp-html-viewer::
               :mode: simple

               .. script::
                  :type: tp/html

                  <h2>Viewer modes</h2>
                  <p>Change this message, then run the source.</p>
