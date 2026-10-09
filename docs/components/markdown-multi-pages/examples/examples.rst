.. tp-restructuredtext-viewer::
   :label: tp-markdown-multi-pages
   :allow-script:
   :style: --tp-markup-viewer-frame-min-height: 32rem

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-markdown-multi-pages::

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - menu

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
               :data-setting: theme
               :label: theme
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default (empty)

               - light

               - dark

               - auto

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: brand
                  :label: brand
                  :value: tp-default
                  :placeholder: tp-default
                  :clearable:

               .. tp-textfield::
                  :data-setting: git
                  :label: git
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: label
                  :label: label
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: langs
                  :label: langs
                  :value: en,fr
                  :placeholder: en,fr
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
            :title: markdown-multi-pages attribute preview
            :style: height: 36rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /tp-components/docs/components/markdown-multi-pages/examples/attributes.js
