.. tp-restructuredtext-viewer::
   :label: tp-inline
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-inline::
            :gap: 1rem
            :align: center

            .. tp-button::

               Previous

            .. span::

               Page 2 of 5

            .. tp-button::

               Next

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - stretch

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
                  :value: 0.5rem
                  :placeholder: 0.5rem
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
            :title: inline attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/inline/examples/attributes.js
