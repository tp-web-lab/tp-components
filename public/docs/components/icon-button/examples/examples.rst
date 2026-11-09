.. tp-restructuredtext-viewer::
   :label: tp-icon-button
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-intro-action: counter
            :data-allow-script:

            Activate the heart button to add a like.

            .. tp-icon-button::
               :name: heart
               :label: Like this example
               :data-demo-trigger:

            .. p::
               :data-demo-status:
               :role: status

               Likes: 0

            .. script::
               :src: /docs/components/_shared/introduction-actions.js
