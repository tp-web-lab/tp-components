.. tp-restructuredtext-viewer::
   :label: tp-markdown-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-markdown-viewer::

            .. script::
               :type: tp/markdown

               # Live Markdown

               Edit this source and select **Run**.

      .. example:: Multiple examples

         .. tp-markdown-viewer::

            .. script::
               :type: tp/markdown

               ``` example {label="Paragraph and list"}
               A paragraph with **strong text** and *emphasis*.

               - Alpha
               - Beta
               ```

               ``` example {label="Table"}
               | Language | Purpose |
               | --- | --- |
               | Markdown | Technical writing |
               | HTML | Web documents |
               ```
