.. tp-restructuredtext-viewer::
   :label: tp-cluster
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            .. tp-cluster::
               :justify: center
               :gap: 0.5rem

               .. tp-button::

                  Alpha

               .. tp-button::

                  Beta

               .. tp-button::

                  Gamma

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: align
               :label: align
               :label-position: top
               :orientation: horizontal
               :value: 3

               - normal

               - stretch

               - center

               - start

               - end

               - flex-start

               - flex-end

               - self-start

               - self-end

               - baseline

               - first baseline

               - last baseline

            .. tp-radio-list::
               :data-setting: justify
               :label: justify
               :label-position: top
               :orientation: horizontal
               :value: 4

               - normal

               - start

               - end

               - flex-start

               - flex-end

               - center

               - left

               - right

               - space-between

               - space-around

               - space-evenly

               - stretch

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: gap
                  :label: gap
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
            :title: cluster attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/cluster/examples/attributes.js

      .. example:: Space between

         .. tp-box::

            .. tp-cluster::
               :justify: space-between

               .. tp-badge::

                  Start

               .. tp-badge::

                  End

      .. example:: Wrapping items

         .. tp-box::
            :style: max-inline-size: 16rem

            .. tp-cluster::
               :gap: 0.5rem

               .. tp-button::

                  One

               .. tp-button::

                  Two

               .. tp-button::

                  Three

               .. tp-button::

                  Four
