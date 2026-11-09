.. tp-restructuredtext-viewer::
   :label: tp-prolog-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-prolog-viewer::
            :src: /docs/components/_shared/intro-projects/prolog.json

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
