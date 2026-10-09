.. tp-restructuredtext-viewer::
   :label: tp-button
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-button::
            :href: /#/components/button/index.md#usage

            Read the usage guide

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

               - loading

               - outlined

               - pill

            .. tp-radio-list::
               :data-setting: loading-mode
               :label: loading-mode
               :label-position: top
               :orientation: horizontal
               :value: 1

               - replace

               - inline

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
               :data-setting: type
               :label: type
               :label-position: top
               :orientation: horizontal
               :value: 1

               - button

               - submit

               - reset

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

               .. tp-textfield::
                  :data-setting: download
                  :label: download
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: href
                  :label: href
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: rel
                  :label: rel
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: target
                  :label: target
                  :value:
                  :placeholder:
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
            :title: button attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/button/examples/attributes.js
