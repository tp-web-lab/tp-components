.. tp-restructuredtext-viewer::
   :label: tp-splitter
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-splitter::
            :position: 40%

            start
               .. tp-box::

                  Drag the divider to resize this panel.

            end
               .. tp-box::

                  This panel uses the remaining space.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: axis
               :label: axis
               :label-position: top
               :orientation: horizontal
               :value: 1

               - horizontal

               - vertical

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: position
                  :label: position
                  :value: 50%
                  :placeholder: 50%
                  :clearable:

               .. tp-textfield::
                  :data-setting: storage-key
                  :label: storage-key
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
            :title: splitter attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/splitter/examples/attributes.js

      .. example:: Nested splitters

         Drag the outer divider left or right, then drag the inner divider up or down. Focus either divider to resize its panels with the arrow keys.

         .. tp-splitter::
            :axis: horizontal
            :position: 30%
            :style: height: 20rem

            start
               .. tp-box::

                  .. h3::

                     Navigation

                  This panel is resized by the outer divider.

            end
               .. tp-splitter::
                  :axis: vertical
                  :position: 55%
                  :style: height: 100%

                  start
                     .. tp-box::

                        .. h3::

                           Editor

                        The inner divider changes the height of this panel.

                  end
                     .. tp-box::

                        .. h3::

                           Preview

                        This panel uses the remaining height.
