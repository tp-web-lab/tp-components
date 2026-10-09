.. tp-restructuredtext-viewer::
   :label: tp-callout
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-callout::
            :variant: info
            :heading: Information

            The workshop starts at 9:00.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - closable

               - outlined

            .. tp-radio-list::
               :data-setting: variant
               :label: variant
               :label-position: top
               :orientation: horizontal
               :value: 5

               - success

               - danger

               - warning

               - info

               - neutral

               - brand

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: heading
                  :label: heading
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: icon
                  :label: icon
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: library
                  :label: library
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: title
                  :label: title
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
            :title: callout attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/callout/examples/attributes.js
