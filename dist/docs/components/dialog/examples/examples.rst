.. tp-restructuredtext-viewer::
   :label: tp-dialog
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-intro-action: dialog
            :data-allow-script:

            .. tp-button::
               :id: intro-dialog-trigger
               :data-demo-trigger:

               Open the confirmation dialog

            .. tp-dialog::

            .. p::
               :data-demo-status:
               :role: status

               Try the dialog using its trigger.

            .. script::
               :src: /docs/components/_shared/introduction-actions.js
