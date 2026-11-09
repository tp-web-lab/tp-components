.. tp-restructuredtext-viewer::
   :label: tp-glossary
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-ref-1(tp-ref)
            :href: %example

         .. div::
            :data-tp-reference-scope:

            Read more :example-tp-ref-1:`glossary-example`.

            .. tp-glossary::
               :ref: example
               :title: Example

               Additional information with **HTML content**.

            .. tp-listof::
               :selector: tp-glossary
