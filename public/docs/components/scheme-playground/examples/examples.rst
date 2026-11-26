.. tp-restructuredtext-viewer::
   :label: tp-scheme-playground
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-scheme-playground::
            :src: /docs/components/_shared/intro-projects/scheme.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/scheme/scheme.js";
            import "/components/scheme-playground/scheme-playground.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-scheme-playground");
            element1.setAttribute("src", "/docs/components/_shared/intro-projects/scheme.json");
            example.append(element1);

            document.body.append(example);

      .. example:: Scheme tests

         .. tp-scheme-playground::
            :src: /docs/components/scheme-playground/examples/test-project.json

      .. example:: SRFI-64 tests

         .. tp-scheme-playground::
            :src: /docs/components/scheme-playground/examples/framework-tests.json
