.. tp-restructuredtext-viewer::
   :label: tp-python-playground
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-python-playground::
            :src: /docs/components/_shared/intro-projects/python.json

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         Default displays a greeting in the HTML document and the console. For src, file1 displays 6 × 7 = 42; file2 displays the squares of 1 to 5. For repository, dir1 calculates 2 + 3; dir2 imports rectangle_area from geometry.py into main.py and displays the area of a rectangle. Both directories include index.html. Edit the Python files and press Run to update the result. Choose Default for src before testing repository: a nonempty src takes precedence. file-unknown and dir-unknown test loading errors: the console displays only the error, and the last valid project is retained.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: repository
               :label: repository
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default

               - dir1

               - dir2

               - dir-unknown

            .. tp-radio-list::
               :data-setting: src
               :label: src
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default

               - file1

               - file2

               - file-unknown

            .. tp-cluster::

            .. tp-button-group::

               .. tp-button::
                  :id: attributes-reset
                  :type: button

                  Reset defaults

               .. tp-button::
                  :id: attributes-reload
                  :type: button

                  Reload preview

         .. tp-divider::

         .. h3::

            Preview

         .. tp-iframe::
            :id: attributes-frame
            :title: python-playground attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         Resource controls offer only Default, two reviewed local fixtures and one missing resource: file1, file2 and file-unknown for src; dir1, dir2 and dir-unknown for repository. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /docs/components/python-playground/examples/attributes.js

      .. example:: Single source file

         .. tp-python-playground::
            :src: /docs/components/_shared/single-source/example.py
