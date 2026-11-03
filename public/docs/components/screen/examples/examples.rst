.. tp-restructuredtext-viewer::
   :label: tp-screen
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-screen::
            :src: /docs/components/screen/examples/responsive.html

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - disabled

            .. tp-radio-list::
               :data-setting: device
               :label: device
               :label-position: top
               :orientation: horizontal
               :value: 7

               - phone-portrait

               - phone-landscape

               - tablet-portrait

               - tablet-landscape

               - laptop

               - desktop

               - default

               - 16:9

               - 3:2

               - 4:3

               - 1:1

               - 3:4

               - 2:3

               - 9:16

            .. tp-radio-list::
               :data-setting: size
               :label: size
               :label-position: top
               :orientation: horizontal
               :value: 4

               - xxs

               - xs

               - s

               - m

               - l

               - xl

               - xxl

            .. tp-radio-list::
               :data-setting: src
               :label: src
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default

               - Responsive cards

               - Alternative layout

               - file-unknown

            .. tp-radio-list::
               :data-setting: variant
               :label: variant
               :label-position: top
               :orientation: horizontal
               :value: 5

               - success

               - danger

               - warning

               - info

               - neutral

               - brand

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
            :title: screen attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /docs/components/screen/examples/attributes.js
