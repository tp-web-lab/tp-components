.. tp-restructuredtext-viewer::
   :label: tp-asciidoc-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-asciidoc-viewer::

            .. script::
               :type: tp/asciidoc

               = Live AsciiDoc
               :showtitle:

               Edit this source and select *Run*.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/asciidoc/asciidoc.js";
            import "/components/asciidoc-viewer/asciidoc-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-asciidoc-viewer");
            element1.append(document.createTextNode("\n        "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/asciidoc");
            element2.textContent = "\n          = Live AsciiDoc\n          :showtitle:\n\n          Edit this source and select *Run*.\n        ";
            element1.append(element2);
            element1.append(document.createTextNode("\n      "));
            example.append(element1);

            document.body.append(example);

      .. example:: Multiple examples

         .. tp-asciidoc-viewer::

            .. script::
               :type: tp/asciidoc

               .Paragraph and list
               ====
               A paragraph with *strong text* and _emphasis_.

               * Alpha
               * Beta
               ====

               .Table
               ====
               |===
               | Language | Purpose

               | AsciiDoc
               | Technical writing

               | HTML
               | Web documents
               |===
               ====

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

            .. tp-asciidoc-viewer::
               :mode: default

               .. script::
                  :type: tp/asciidoc

                  == Viewer modes

                  Change this *message*, then run the source.

         .. section::

            .. heading-level:: 3

            mode="lite" — Compact controls
            ==============================

            Open Code to edit the source, then click Run or press :example-kbd-3:`Shift`\ +\ :example-kbd-4:`Enter` in the editor.

            .. tp-asciidoc-viewer::
               :mode: lite

               .. script::
                  :type: tp/asciidoc

                  == Viewer modes

                  Change this *message*, then run the source.

         .. section::

            .. heading-level:: 3

            mode="simple" — Editor and rendered output only
            ===============================================

            Edit the code below, keep the cursor in the editor and press :example-kbd-5:`Shift`\ +\ :example-kbd-6:`Enter` (Return) to run it. This viewer has no Run button.

            .. tp-asciidoc-viewer::
               :mode: simple

               .. script::
                  :type: tp/asciidoc

                  == Viewer modes

                  Change this *message*, then run the source.
