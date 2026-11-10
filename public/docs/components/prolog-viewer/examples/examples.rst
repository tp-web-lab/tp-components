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
