.. tp-restructuredtext-viewer::
   :label: tp-button-group
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-page-navigation:
            :data-allow-script:

            Use the grouped buttons to change the current page.

            .. tp-button-group::
               :attached:
               :aria-label: Page navigation

               .. tp-button::
                  :data-previous:
                  :disabled:

                  Previous

               .. tp-button::
                  :data-next:

                  Next

            .. p::
               :data-page-status:
               :role: status

               Page 1 of 5

            .. script::
               :src: /docs/components/button-group/examples/page-navigation.js
