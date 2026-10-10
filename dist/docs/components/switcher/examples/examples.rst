.. tp-restructuredtext-viewer::
   :label: tp-switcher
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-switcher::
            :threshold: 35rem
            :gap: 1rem

            .. tp-box::

               1. Plan the content.

            .. tp-box::

               2. Write a draft.

            .. tp-box::

               3. Review the text.

            .. tp-box::

               4. Add illustrations.

            .. tp-box::

               5. Publish the result.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: gap
                  :label: gap
                  :value: 1rem
                  :placeholder: 1rem
                  :clearable:

               .. tp-textfield::
                  :data-setting: max-horizontal
                  :label: max-horizontal
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: threshold
                  :label: threshold
                  :value: 30rem
                  :placeholder: 30rem
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
            :title: switcher attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/switcher/examples/attributes.js
