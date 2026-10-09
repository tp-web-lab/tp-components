.. tp-restructuredtext-viewer::
   :label: tp-notebook
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-notebook::

            .. script::
               :type: tp/markdown

               # Notebook example
               Here is a notebook that combines Asciidoc, HTML, Markdown and reStructuredText as markup languages, and Python and JavaScript as programming languages.

               ## Calculation
               We perform a simple multiplication in Python to demonstrate the calculation.

            .. script::
               :type: tp/python

               x = 6 * 7
               print(x)

            .. script::
               :type: tp/restructuredtext
               :doctest:

               .. h2::

                  Verification

               We use the doctest blocks in reStructuredText to verify the output of the Python code.

               >>> print(6 * 7)
               42

            .. script::
               :type: tp/html

               In JavaScript, we would have written the following code:

            .. script::
               :type: tp/javascript

               const x = 6 * 7;
               console.log(x)

            .. script::
               :type: tp/asciidoc

               == Result
               The result of the multiplication is displayed using Asciidoc and Mathjax:

               latexmath:[x = 6 * 7 = 42]

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - readonly

            .. tp-radio-list::
               :data-setting: language
               :label: language
               :label-position: top
               :orientation: horizontal
               :value: 1

               - javascript

               - typescript

               - python

               - prolog

               - sql

            .. tp-radio-list::
               :data-setting: repository
               :label: repository
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default

               - file1

               - file2

               - file-unknown

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
            :title: notebook attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /tp-components/docs/components/notebook/examples/attributes.js
