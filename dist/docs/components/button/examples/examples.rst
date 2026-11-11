.. tp-restructuredtext-viewer::
   :label: tp-button
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-button::
            :href: /#/components/button/index.md#usage

            Read the usage guide

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/button/button.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-button");
            element1.setAttribute("href", "/#/components/button/index.md#usage");
            element1.append(document.createTextNode("Read the usage guide"));
            example.append(element1);

            document.body.append(example);

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
