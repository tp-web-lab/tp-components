.. tp-restructuredtext-viewer::
   :label: tp-javascript-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-javascript-viewer::
            :src: /docs/components/_shared/intro-projects/javascript.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/javascript/javascript.js";
            import "/components/javascript-viewer/javascript-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-javascript-viewer");
            element1.setAttribute("src", "/docs/components/_shared/intro-projects/javascript.json");
            example.append(element1);

            document.body.append(example);

      .. example:: src

         .. tp-javascript-viewer::
            :src: /docs/components/javascript-viewer/examples/example.json

      .. example:: script

         .. tp-javascript-viewer::

            .. script::
               :type: tp/javascript

               const app = document.querySelector('#app');

               if (app instanceof HTMLElement) {
                 app.textContent = 'Hello JavaScript viewer';
               }

               console.log('Hello JavaScript');

      .. example:: error

         .. tp-javascript-viewer::

            .. script::
               :type: tp/javascript

               console.error(new Error('Intentional JavaScript error'));

      .. example:: Single source file

         .. tp-javascript-viewer::
            :src: /docs/components/_shared/single-source/example.js

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

            .. tp-javascript-viewer::
               :mode: default

               .. script::
                  :type: tp/javascript
                  :filename: main.js

                  document.body.innerHTML = "<p>The program ran.</p>";
                  console.log("Console message before the intentional error.");
                  throw new Error("Intentional error: the simple-mode console opens automatically.");

         .. section::

            .. heading-level:: 3

            mode="lite" — Compact controls
            ==============================

            Open Code to edit the source, then click Run or press :example-kbd-3:`Shift`\ +\ :example-kbd-4:`Enter` in the editor.

            Run to print a console message followed by an intentional error. In simple mode the console opens automatically. Comment out the message statements and run again to check that the error alone opens it; remove the error statement to try a successful run.

            .. tp-javascript-viewer::
               :mode: lite

               .. script::
                  :type: tp/javascript
                  :filename: main.js

                  document.body.innerHTML = "<p>The program ran.</p>";
                  console.log("Console message before the intentional error.");
                  throw new Error("Intentional error: the simple-mode console opens automatically.");

         .. section::

            .. heading-level:: 3

            mode="simple" — Editor and rendered output only
            ===============================================

            Edit the code below, keep the cursor in the editor and press :example-kbd-5:`Shift`\ +\ :example-kbd-6:`Enter` (Return) to run it. This viewer has no Run button.

            Run to print a console message followed by an intentional error. In simple mode the console opens automatically. Comment out the message statements and run again to check that the error alone opens it; remove the error statement to try a successful run.

            .. tp-javascript-viewer::
               :mode: simple

               .. script::
                  :type: tp/javascript
                  :filename: main.js

                  document.body.innerHTML = "<p>The program ran.</p>";
                  console.log("Console message before the intentional error.");
                  throw new Error("Intentional error: the simple-mode console opens automatically.");

         Programming viewers already have compact controls, so default and lite look alike. The first run may load the language engine.
