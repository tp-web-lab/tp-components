.. tp-restructuredtext-viewer::
   :label: tp-python-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-python-viewer::
            :src: /docs/components/_shared/intro-projects/python.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/python/python.js";
            import "/components/python-viewer/python-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-python-viewer");
            element1.setAttribute("src", "/docs/components/_shared/intro-projects/python.json");
            example.append(element1);

            document.body.append(example);

      .. example:: src

         .. tp-python-viewer::
            :src: /docs/components/python-viewer/examples/example.json

      .. example:: script

         .. tp-python-viewer::

            .. script::
               :type: tp/python

               message = "Hello Python viewer"
               print(message)

      .. example:: matplotlib

         .. tp-python-viewer::
            :src: /docs/components/python-viewer/examples/matplotlib.json

      .. example:: error

         .. tp-python-viewer::

            .. script::
               :type: tp/python

               raise RuntimeError("Intentional Python error")

      .. example:: Single source file

         .. tp-python-viewer::
            :src: /docs/components/_shared/single-source/example.py

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

            Run to print a console message followed by an intentional error. In simple mode the console opens automatically. Comment out the message statements and run again to check that the error alone opens it; remove the error statement to try a successful run.

            .. tp-python-viewer::
               :mode: default

               .. script::
                  :type: tp/python
                  :filename: main.py

                  from js import document
                  document.body.innerHTML = "<p>The program ran.</p>"
                  print("Console message before the intentional error.")
                  raise RuntimeError("Intentional error: the simple-mode console opens automatically.")

         .. section::

            .. heading-level:: 3

            mode="lite" — Compact controls
            ==============================

            Open Code to edit the source, then click Run or press :example-kbd-3:`Shift`\ +\ :example-kbd-4:`Enter` in the editor.

            Run to print a console message followed by an intentional error. In simple mode the console opens automatically. Comment out the message statements and run again to check that the error alone opens it; remove the error statement to try a successful run.

            .. tp-python-viewer::
               :mode: lite

               .. script::
                  :type: tp/python
                  :filename: main.py

                  from js import document
                  document.body.innerHTML = "<p>The program ran.</p>"
                  print("Console message before the intentional error.")
                  raise RuntimeError("Intentional error: the simple-mode console opens automatically.")

         .. section::

            .. heading-level:: 3

            mode="simple" — Editor and rendered output only
            ===============================================

            Edit the code below, keep the cursor in the editor and press :example-kbd-5:`Shift`\ +\ :example-kbd-6:`Enter` (Return) to run it. This viewer has no Run button.

            Run to print a console message followed by an intentional error. In simple mode the console opens automatically. Comment out the message statements and run again to check that the error alone opens it; remove the error statement to try a successful run.

            .. tp-python-viewer::
               :mode: simple

               .. script::
                  :type: tp/python
                  :filename: main.py

                  from js import document
                  document.body.innerHTML = "<p>The program ran.</p>"
                  print("Console message before the intentional error.")
                  raise RuntimeError("Intentional error: the simple-mode console opens automatically.")

         Programming viewers already have compact controls, so default and lite look alike. The first run may load the language engine.
