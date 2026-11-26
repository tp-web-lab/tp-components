.. tp-restructuredtext-viewer::
   :label: tp-ocaml-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-ocaml-viewer::
            :src: /docs/components/_shared/intro-projects/ocaml.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/ocaml/ocaml.js";
            import "/components/ocaml-viewer/ocaml-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-ocaml-viewer");
            element1.setAttribute("src", "/docs/components/_shared/intro-projects/ocaml.json");
            example.append(element1);

            document.body.append(example);

      .. example:: OCaml tests

         .. tp-ocaml-viewer::
            :src: /docs/components/ocaml-playground/examples/test-project.json

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

            Run to show the printed message and intentional error in the output. This viewer has no separate console; JavaScript console messages also appear in the output.

            .. tp-ocaml-viewer::
               :mode: default

               .. script::
                  :type: tp/ocaml
                  :filename: main.ml

                  print_endline "Printed message before the intentional error.";;
                  failwith "Intentional error: the error appears in the output.";;

         .. section::

            .. heading-level:: 3

            mode="lite" — Compact controls
            ==============================

            Open Code to edit the source, then click Run or press :example-kbd-3:`Shift`\ +\ :example-kbd-4:`Enter` in the editor.

            Run to show the printed message and intentional error in the output. This viewer has no separate console; JavaScript console messages also appear in the output.

            .. tp-ocaml-viewer::
               :mode: lite

               .. script::
                  :type: tp/ocaml
                  :filename: main.ml

                  print_endline "Printed message before the intentional error.";;
                  failwith "Intentional error: the error appears in the output.";;

         .. section::

            .. heading-level:: 3

            mode="simple" — Editor and rendered output only
            ===============================================

            Edit the code below, keep the cursor in the editor and press :example-kbd-5:`Shift`\ +\ :example-kbd-6:`Enter` (Return) to run it. This viewer has no Run button.

            Run to show the printed message and intentional error in the output. This viewer has no separate console; JavaScript console messages also appear in the output.

            .. tp-ocaml-viewer::
               :mode: simple

               .. script::
                  :type: tp/ocaml
                  :filename: main.ml

                  print_endline "Printed message before the intentional error.";;
                  failwith "Intentional error: the error appears in the output.";;

         Programming viewers already have compact controls, so default and lite look alike. The first run may load the language engine.
