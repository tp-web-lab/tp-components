.. tp-restructuredtext-viewer::
   :label: tp-asciidoc-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-asciidoc-viewer::

            .. script::
               :type: tp/asciidoc

               = Live AsciiDoc
               :showtitle:

               Edit this source and select *Run*.

      .. example:: Multiple examples

         .. tp-asciidoc-viewer::

            .. script::
               :type: tp/asciidoc

               .Paragraph and list
               ====
               A paragraph with *strong text* and _emphasis_.

               * Alpha
               * Beta
               ====

               .Table
               ====
               |===
               | Language | Purpose

               | AsciiDoc
               | Technical writing

               | HTML
               | Web documents
               |===
               ====
