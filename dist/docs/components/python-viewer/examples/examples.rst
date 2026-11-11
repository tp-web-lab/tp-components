.. tp-restructuredtext-viewer::
   :label: tp-python-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-python-viewer::
            :src: /docs/components/_shared/intro-projects/python.json

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/python-viewer/python-viewer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-python-viewer");
            element1.setAttribute("src", "/docs/components/_shared/intro-projects/python.json");
            example.append(element1);

            document.body.append(example);

      .. example:: src

         .. tp-python-viewer::
            :src: /docs/components/python-viewer/examples/example.json

      .. example:: script

         .. tp-python-viewer::

            .. script::
               :type: tp/python

               message = "Hello Python viewer"
               print(message)

      .. example:: matplotlib

         .. tp-python-viewer::
            :src: /docs/components/python-viewer/examples/matplotlib.json

      .. example:: error

         .. tp-python-viewer::

            .. script::
               :type: tp/python

               raise RuntimeError("Intentional Python error")

      .. example:: Single source file

         .. tp-python-viewer::
            :src: /docs/components/_shared/single-source/example.py
