.. tp-restructuredtext-viewer::
   :label: tp-biblio
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-ref-1(tp-ref)
            :href: @example

         .. div::
            :data-tp-reference-scope:

            Read more :example-tp-ref-1:`bibliography-example`.

            .. tp-biblio::
               :ref: example
               :title: Example

               Additional information with **HTML content**.

            .. tp-listof::
               :selector: tp-biblio
