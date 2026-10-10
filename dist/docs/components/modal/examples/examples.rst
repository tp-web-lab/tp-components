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

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - backdrop

               - breakout

               - fixed

               - open

               - outside-click

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: margin
                  :label: margin
                  :value:
                  :placeholder:
                  :clearable:

            .. tp-button-group::

               .. tp-button::
                  :id: attributes-reset
                  :type: button

                  Reset defaults

               .. tp-button::
                  :id: attributes-reload
                  :type: button

                  Reload preview

         .. tp-divider::

         .. h3::

            Preview

         .. tp-iframe::
            :id: attributes-frame
            :title: modal attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/modal/examples/attributes.js
