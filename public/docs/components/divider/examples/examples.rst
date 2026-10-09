.. tp-restructuredtext-viewer::
   :label: tp-divider
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            Primary content group.

            .. tp-divider::

            Secondary content group.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: orientation
               :label: orientation
               :label-position: top
               :orientation: horizontal
               :value: 1

               - horizontal

               - vertical

            .. tp-cluster::

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
            :title: divider attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/divider/examples/attributes.js

      .. example:: Custom style

         .divider-custom-style tp-divider { --tp-divider-color: var(--tp-brand-fill-mid); --tp-divider-thickness: 4px; --tp-divider-margin-block: 0.75rem; }

         .. tp-box::

            Before the custom divider.

            .. tp-divider::

            After the custom divider.

      .. example:: Dropdown menu

         .. tp-dropdown::
            :open:

            - Load
            - Save
