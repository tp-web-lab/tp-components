.. tp-restructuredtext-viewer::
   :label: tp-button
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-button::
            :href: /#/components/button/index.md#usage

            Read the usage guide

      .. example:: Navigation link

         .. tp-button::
            :href: https://example.org
            :target: _blank
            :outlined:
            :variant: brand

            Open example.org

      .. example:: Unavailable action

         .. tp-button::
            :disabled:

            Submit answer
