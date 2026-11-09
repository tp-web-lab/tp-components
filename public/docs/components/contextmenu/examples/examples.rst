.. tp-restructuredtext-viewer::
   :label: tp-contextmenu
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-intro-action: contextmenu
            :data-allow-script:

            .. tp-button::
               :id: intro-contextmenu-trigger
               :data-demo-trigger:

               Right-click this button

            .. tp-contextmenu::
               :anchor: #intro-contextmenu-trigger
               :outside-click:

               - `Buttons </#/components/button/index.md>`_

               - `Trees </#/components/tree/index.md>`_

            .. p::
               :data-demo-status:
               :role: status

               Try the contextmenu using its trigger.

            .. script::
               :src: /docs/components/_shared/introduction-actions.js
