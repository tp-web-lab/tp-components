.. tp-restructuredtext-viewer::
   :label: tp-prolog-notebook
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-prolog-notebook::

            .. script::
               :type: tp/markdown

               # Family relations

               Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.

            .. script::
               :type: tp/prolog
               :filename: program.pl

               parent(ada, byron).
               parent(byron, charles).

               grandparent(X, Z) :- parent(X, Y), parent(Y, Z).

            .. script::
               :type: tp/prolog
               :filename: query.pl

               grandparent(ada, Grandchild).
