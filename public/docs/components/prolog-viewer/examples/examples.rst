.. tp-restructuredtext-viewer::
   :label: tp-prolog-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-prolog-viewer::
            :src: /docs/components/_shared/intro-projects/prolog.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/prolog/prolog.js";
            import "/components/prolog-viewer/prolog-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-prolog-viewer");
            element1.setAttribute("src", "/docs/components/_shared/intro-projects/prolog.json");
            example.append(element1);

            document.body.append(example);

      .. example:: src

         .. tp-prolog-viewer::
            :src: /docs/components/prolog-viewer/examples/example.json

      .. example:: script without filename

         .. tp-prolog-viewer::

            .. script::
               :type: tp/prolog

               parent(ada, byron).
               parent(byron, charles).

               grandparent(Grandparent, Grandchild) :-
                 parent(Grandparent, Parent),
                 parent(Parent, Grandchild).

      .. example:: scripts with filename

         .. tp-prolog-viewer::

            .. script::
               :type: tp/prolog
               :filename: program.pl

               parent(ada, byron).
               parent(byron, charles).

               grandparent(Grandparent, Grandchild) :-
                 parent(Grandparent, Parent),
                 parent(Parent, Grandchild).

            .. script::
               :type: tp/prolog
               :filename: query.pl

               grandparent(ada, Grandchild).

      .. example:: error

         .. tp-prolog-viewer::

            .. script::
               :type: tp/prolog
               :filename: query.pl

               unknown_predicate(X).

      .. example:: Single source file

         .. tp-prolog-viewer::
            :src: /docs/components/_shared/single-source/example.pl

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

            .. tp-prolog-viewer::
               :mode: default

               .. script::
                  :type: tp/prolog
                  :filename: program.pl

                  % The query file demonstrates console output and an intentional error.

               .. script::
                  :type: tp/prolog
                  :filename: query.pl

                  writeln('Printed message before the intentional error.').
                  throw(error(intentional_viewer_error, context(mode_comparison, 'Intentional error: the error appears in the output.'))).

         .. section::

            .. heading-level:: 3

            mode="lite" — Compact controls
            ==============================

            Open Code to edit the source, then click Run or press :example-kbd-3:`Shift`\ +\ :example-kbd-4:`Enter` in the editor.

            Run to show the printed message and intentional error in the output. This viewer has no separate console; JavaScript console messages also appear in the output.

            .. tp-prolog-viewer::
               :mode: lite

               .. script::
                  :type: tp/prolog
                  :filename: program.pl

                  % The query file demonstrates console output and an intentional error.

               .. script::
                  :type: tp/prolog
                  :filename: query.pl

                  writeln('Printed message before the intentional error.').
                  throw(error(intentional_viewer_error, context(mode_comparison, 'Intentional error: the error appears in the output.'))).

         .. section::

            .. heading-level:: 3

            mode="simple" — Editor and rendered output only
            ===============================================

            Edit the code below, keep the cursor in the editor and press :example-kbd-5:`Shift`\ +\ :example-kbd-6:`Enter` (Return) to run it. This viewer has no Run button.

            Run to show the printed message and intentional error in the output. This viewer has no separate console; JavaScript console messages also appear in the output.

            .. tp-prolog-viewer::
               :mode: simple

               .. script::
                  :type: tp/prolog
                  :filename: program.pl

                  % The query file demonstrates console output and an intentional error.

               .. script::
                  :type: tp/prolog
                  :filename: query.pl

                  writeln('Printed message before the intentional error.').
                  throw(error(intentional_viewer_error, context(mode_comparison, 'Intentional error: the error appears in the output.'))).

         Programming viewers already have compact controls, so default and lite look alike. The first run may load the language engine.
