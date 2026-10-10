.. tp-restructuredtext-viewer::
   :label: tp-icon-picker
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-icon-picker::

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - compact

            .. tp-radio-list::
               :data-setting: copy
               :label: copy
               :label-position: top
               :orientation: horizontal
               :value: 1

               - name

               - svg

               - tp-icon

               - tp-icon-button

               - img

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: filter
                  :label: filter
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: library
                  :label: library
                  :value: all
                  :placeholder: all
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
            :title: icon-picker attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/icon-picker/examples/attributes.js
