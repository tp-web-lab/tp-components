.. tp-restructuredtext-viewer::
   :label: tp-sql-playground
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            The query lists three European capitals. Expand the query in the result panel to see its rows.

            .. tp-sql-playground::
               :src: /docs/components/_shared/intro-projects/sql.json

      .. example:: Single source file

         .. tp-sql-playground::
            :src: /docs/components/_shared/single-source/example.sql
