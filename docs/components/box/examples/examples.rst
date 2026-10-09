.. tp-restructuredtext-viewer::
   :label: tp-box
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            The custom HTML element ``<tp-box>`` wraps its content in various ways.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - invert

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: border-radius
                  :label: border-radius
                  :value: 0px
                  :placeholder: 0px
                  :clearable:

               .. tp-textfield::
                  :data-setting: border-width
                  :label: border-width
                  :value: 1px
                  :placeholder: 1px
                  :clearable:

               .. tp-textfield::
                  :data-setting: padding
                  :label: padding
                  :value: 1rem
                  :placeholder: 1rem
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
            :title: box attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/box/examples/attributes.js
