.. tp-restructuredtext-viewer::
   :label: tp-restructuredtext-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-restructuredtext-viewer::

            .. script::
               :type: tp/restructuredtext

               Live reStructuredText
               =====================

               Edit this source and select **Run**.

               * First item
               * Second item

      .. example:: Multiple examples

         .. tp-restructuredtext-viewer::

            .. script::
               :type: tp/restructuredtext

               .. example:: Paragraph and list

                  A paragraph with **strong text** and *emphasis*.

                  * Alpha
                  * Beta

               .. example:: Table

                  ================  =================
                  Language          Purpose
                  ================  =================
                  reStructuredText  Technical writing
                  HTML              Web documents
                  ================  =================
