.. tp-restructuredtext-viewer::
   :label: tp-modal
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-intro-action: modal
            :data-allow-script:

            .. tp-button::
               :id: intro-modal-trigger
               :data-demo-trigger:

               Open the modal

            .. tp-modal::
               :backdrop:
               :outside-click:
               :aria-label: Example modal

               This panel contains additional information.

               .. tp-button::
                  :data-demo-close:

                  Close

            .. p::
               :data-demo-status:
               :role: status

               Try the modal using its trigger.

            .. script::
               :src: /docs/components/_shared/introduction-actions.js
