.. tp-restructuredtext-viewer::
   :label: tp-toolbar
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-icon-1(tp-icon)
            :section: start
            :name: home
            :aria-label: Home

         .. role:: example-tp-icon-2(tp-icon)
            :section: start
            :name: menu
            :aria-label: Menu

         .. role:: example-tp-icon-3(tp-icon)
            :section: end
            :name: github
            :aria-label: GitHub

         .. role:: example-tp-icon-4(tp-icon)
            :section: end
            :name: settings
            :aria-label: Settings

         .. role:: example-tp-icon-5(tp-icon)
            :section: end
            :name: help
            :aria-label: Help

         .. tp-box::
            :padding: 0

            .. tp-toolbar::

               :example-tp-icon-1:`home` :example-tp-icon-2:`menu`

               .. span::
                  :section: center

                  Document

               :example-tp-icon-3:`github` :example-tp-icon-4:`settings` :example-tp-icon-5:`help`

            .. tp-box::
               :border-width: 0
               :style: min-block-size: 5rem; display: grid; place-items: center

               Document area
