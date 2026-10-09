.. tp-restructuredtext-viewer::
   :label: tp-menu
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-menu::

            - `Buttons </#/components/button/index.md>`_

            - `Tabs </#/components/tabs/index.md>`_

            - `Trees </#/components/tree/index.md>`_

         .. script::
            :src: /tp-components/docs/components/menu/examples/navigation.js

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: orientation
               :label: orientation
               :label-position: top
               :orientation: horizontal
               :value: 2

               - horizontal

               - vertical

            .. tp-cluster::

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
            :title: menu attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/menu/examples/attributes.js

      .. example:: Nested submenus

         Open Components, then Layout, then Rows to explore three submenu levels. Click a branch to open it, or focus Components and press Arrow Down, then Arrow Right twice. Arrow Left closes a submenu and returns focus to its parent. Links open the corresponding documentation page.

         .. tp-box::
            :style: min-height: 22rem

            .. tp-menu::
               :orientation: horizontal

               - Components

                 - Layout

                   - Rows

                     - `Inline </#/components/inline/index.md>`_

                     - `Cluster </#/components/cluster/index.md>`_

                   - `Grid </#/components/grid/index.md>`_

                   - `Frame </#/components/frame/index.md>`_

                 - Navigation

                   - `Tabs </#/components/tabs/index.md>`_

                   - `Trees </#/components/tree/index.md>`_

               - `Buttons </#/components/button/index.md>`_

         .. script::
            :src: /tp-components/docs/components/menu/examples/navigation.js
