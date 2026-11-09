.. tp-restructuredtext-viewer::
   :label: tp-tabs
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-icon-1(tp-icon)
            :size: 2em
            :name: numeric-1

         .. role:: example-tp-icon-2(tp-icon)
            :size: 2em
            :name: numeric-2

         .. role:: example-tp-icon-3(tp-icon)
            :size: 2em
            :name: numeric-3

         .. role:: example-tp-icon-4(tp-icon)
            :size: 2em
            :name: numeric-4

         .. tp-tabs::

            Tab 1
               Content of panel :example-tp-icon-1:`numeric-1`

            Tab 2
               Content of panel :example-tp-icon-2:`numeric-2`

            Tab 3
               Content of panel :example-tp-icon-3:`numeric-3`

            Tab 4
               Content of panel :example-tp-icon-4:`numeric-4`
