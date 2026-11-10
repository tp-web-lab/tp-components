.. tp-restructuredtext-viewer::
   :label: tp-screen
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-screen::
            :src: /docs/components/screen/examples/responsive.html

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/screen/screen.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-screen");
            element1.setAttribute("src", "/docs/components/screen/examples/responsive.html");
            example.append(element1);

            document.body.append(example);
