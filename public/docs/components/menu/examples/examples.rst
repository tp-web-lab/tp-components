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
            :src: /docs/components/menu/examples/navigation.js

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
            :src: /docs/components/menu/examples/navigation.js
