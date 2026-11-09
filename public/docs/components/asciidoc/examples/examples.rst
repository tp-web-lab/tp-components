.. tp-restructuredtext-viewer::
   :label: tp-asciidoc
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-asciidoc::

            .. script::
               :type: tp/asciidoc

               == A short document

               This paragraph uses *AsciiDoc*.

               * Write content
               * Add components
               * Publish the page

      .. example:: Advanced example

         .. tp-asciidoc::

            .. script::
               :type: tp/asciidoc

               include::advanced-example.adoc[]
