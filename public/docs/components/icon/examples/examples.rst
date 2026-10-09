.. tp-restructuredtext-viewer::
   :label: tp-icon
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: inline-tp-icon-1(tp-icon)
            :name: heart
            :size: 3rem
            :aria-label: Heart

         :inline-tp-icon-1:`icon`

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - flip-h

               - flip-v

               - spin

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

               .. tp-textfield::
                  :data-setting: color
                  :label: color
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: fallback
                  :label: fallback
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: fallback-icon
                  :label: fallback-icon
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: library
                  :label: library
                  :value: tp
                  :placeholder: tp
                  :clearable:

               .. tp-textfield::
                  :data-setting: name
                  :label: name
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: rotate
                  :label: rotate
                  :value: 0deg
                  :placeholder: 0deg
                  :clearable:

               .. tp-textfield::
                  :data-setting: scale
                  :label: scale
                  :value: 1
                  :placeholder: 1
                  :clearable:

               .. tp-textfield::
                  :data-setting: size
                  :label: size
                  :value: 1em
                  :placeholder: 1em
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
            :title: icon attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /docs/components/icon/examples/attributes.js
