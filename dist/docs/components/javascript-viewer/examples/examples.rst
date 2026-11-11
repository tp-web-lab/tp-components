.. tp-restructuredtext-viewer::
   :label: tp-javascript-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-javascript-viewer::
            :src: /docs/components/_shared/intro-projects/javascript.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/javascript-viewer/javascript-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-javascript-viewer");
            element1.setAttribute("src", "/docs/components/_shared/intro-projects/javascript.json");
            example.append(element1);

            document.body.append(example);

      .. example:: src

         .. tp-javascript-viewer::
            :src: /docs/components/javascript-viewer/examples/example.json

      .. example:: script

         .. tp-javascript-viewer::

            .. script::
               :type: tp/javascript

               const app = document.querySelector('#app');

               if (app instanceof HTMLElement) {
                 app.textContent = 'Hello JavaScript viewer';
               }

               console.log('Hello JavaScript');

      .. example:: error

         .. tp-javascript-viewer::

            .. script::
               :type: tp/javascript

               console.error(new Error('Intentional JavaScript error'));

      .. example:: Single source file

         .. tp-javascript-viewer::
            :src: /docs/components/_shared/single-source/example.js
