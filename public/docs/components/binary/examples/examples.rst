.. tp-restructuredtext-viewer::
   :label: tp-binary
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-binary::

            1. 1010110!0

            2. 01!01!0011!

            3. 0010101!1!

            4. 11!01!0100

            5. 10011001!

            6. 0!110!1010

            7. 0110!0!101

            8. 10!0101!10

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: puzzle
                  :label: puzzle
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
            :title: binary attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/binary/examples/attributes.js

      .. example:: binary ⭐⭐

         .. tp-binary::

            1. 0110!11!00
            2. 001!100!11
            3. 11001100!
            4. 00!11!01!10!
            5. 1!00!10!011
            6. 1!1001001
            7. 01100110!
            8. 1!0011001

      .. example:: binary ⭐⭐⭐

         .. tp-binary::

            1. 0!0!101!10!10!1
            2. 10!0100!110!1
            3. 1100110010
            4. 0011!011!001
            5. 0!101!1!01100!
            6. 110!010!011!0
            7. 1!0100100!11
            8. 0101001101
            9. 011!0!101!010
            10. 101!10!10010
