.. tp-restructuredtext-viewer::
   :label: tp-prolog-playground
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-prolog-playground::
            :src: /docs/components/_shared/intro-projects/prolog.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/prolog-playground/prolog-playground.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-prolog-playground");
            element1.setAttribute("src", "/docs/components/_shared/intro-projects/prolog.json");
            example.append(element1);

            document.body.append(example);

      .. example:: Single source file

         .. tp-prolog-playground::
            :src: /docs/components/_shared/single-source/example.pl
