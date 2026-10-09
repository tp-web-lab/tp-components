.. tp-restructuredtext-viewer::
   :label: tp-mastermind
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-mastermind::
            :solution: red blue green yellow
            :attempts: 8

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: attempts
                  :label: attempts
                  :value: 10
                  :placeholder: 10
                  :clearable:

               .. tp-textfield::
                  :data-setting: colors
                  :label: colors
                  :value: red blue green yellow orange purple
                  :placeholder: red blue green yellow orange purple
                  :clearable:

               .. tp-textfield::
                  :data-setting: solution
                  :label: solution
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
            :title: mastermind attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/mastermind/examples/attributes.js

      .. example:: mastermind ⭐⭐

         .. tp-mastermind::
            :solution: orange purple red green
            :attempts: 8

      .. example:: mastermind ⭐⭐⭐

         .. tp-mastermind::
            :solution: yellow red purple blue orange
            :attempts: 10
