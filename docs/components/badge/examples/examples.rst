.. tp-restructuredtext-viewer::
   :label: tp-badge
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-badge-1(tp-badge)
            :variant: success
            :pulse:

         .. role:: vite-icon(tp-icon)
            :name: file_type_vite
            :library: languages

         .. role:: version-divider(tp-divider)
            :orientation: vertical

         Build status: :example-tp-badge-1:`Ready`

         .. tp-badge::
            :outlined:

            :vite-icon:`\ ` Vite :version-divider:`\ ` 8.1.5

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - outlined

               - pill

               - pulse

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
            :title: badge attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/badge/examples/attributes.js

      .. example:: With icon

         .. role:: example-tp-icon-1(tp-icon)
            :name: check

         .. role:: example-tp-icon-2(tp-icon)
            :name: clock-outline

         Badges can contain inline content such as icons.

         .. tp-badge::
            :variant: success
            :pill:

            :example-tp-icon-1:`check` Approved

         .. tp-badge::
            :variant: warning
            :pill:

            :example-tp-icon-2:`clock-outline` Waiting
