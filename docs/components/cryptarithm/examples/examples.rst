.. tp-restructuredtext-viewer::
   :label: tp-cryptarithm
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-cryptarithm::
            :equation: SEND + MORE = MONEY
            :solution: 9567 + 1085 = 10652

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: equation
                  :label: equation
                  :value:
                  :placeholder:
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
            :title: cryptarithm attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/cryptarithm/examples/attributes.js

      .. example:: UN + UN + NEUF = ONZE

         .. tp-cryptarithm::
            :equation: UN + UN + NEUF = ONZE
            :solution: 81 + 81 + 1987 = 2149

      .. example:: CINQ + CINQ + VINGT = TRENTE

         .. tp-cryptarithm::
            :equation: CINQ + CINQ + VINGT = TRENTE
            :solution: 6483 + 6483 + 94851 = 107817

      .. example:: ZERO + NEUF + NEUF + DOUZE = TRENTE

         .. tp-cryptarithm::
            :equation: ZERO + NEUF + NEUF + DOUZE = TRENTE
            :solution: 9206 + 3257 + 3257 + 86592 = 102312
