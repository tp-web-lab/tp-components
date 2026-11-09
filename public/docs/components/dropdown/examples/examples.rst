.. tp-restructuredtext-viewer::
   :label: tp-dropdown
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-intro-action: dropdown
            :data-allow-script:

            .. tp-button::
               :id: intro-dropdown-trigger
               :data-demo-trigger:

               Open the menu

            .. tp-dropdown::
               :anchor: #intro-dropdown-trigger
               :outside-click:

               - `Buttons </#/components/button/index.md>`_

               - `Trees </#/components/tree/index.md>`_

            .. p::
               :data-demo-status:
               :role: status

               Try the dropdown using its trigger.

            .. script::
               :src: /docs/components/_shared/introduction-actions.js
