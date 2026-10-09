.. tp-restructuredtext-viewer::
   :label: tp-crossword
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-crossword::

            solution
               1. BALL

               2. AREA

               3. LEAD

               4. LADY

            across
               1. A. A round toy used in many sports

               2. B. The size of a surface

               3. C. A heavy metal

               4. D. A polite word for a woman

            down
               1. 1. A round toy used in many sports

               2. 2. The size of a surface

               3. 3. A heavy metal

               4. 4. A polite word for a woman

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - silent

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: data-crossword-puzzle
                  :label: data-crossword-puzzle
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: data-crossword-silent
                  :label: data-crossword-silent
                  :value: false
                  :placeholder: false
                  :clearable:

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
            :title: crossword attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/crossword/examples/attributes.js
