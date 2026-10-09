.. tp-restructuredtext-viewer::
   :label: tp-copy-code
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            .. tp-box::
               :id: intro-copy-code

               ::

                  const answer = 6 * 7;

            .. tp-copy-code::
               :for: intro-copy-code

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: copied-text
                  :label: copied-text
                  :value: Copied!
                  :placeholder: Copied!
                  :clearable:

               .. tp-textfield::
                  :data-setting: error-icon
                  :label: error-icon
                  :value: warning
                  :placeholder: warning
                  :clearable:

               .. tp-textfield::
                  :data-setting: for
                  :label: for
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: icon
                  :label: icon
                  :value: copy
                  :placeholder: copy
                  :clearable:

               .. tp-textfield::
                  :data-setting: success-icon
                  :label: success-icon
                  :value: check
                  :placeholder: check
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
            :title: copy-code attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/copy-code/examples/attributes.js
