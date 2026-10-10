.. tp-restructuredtext-viewer::
   :label: tp-sidebar
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-sidebar::
            :side-width: 12rem
            :gap: 1rem

            .. tp-box::

               .. h3::

                  Navigation

               Overview

               Examples

            .. tp-box::

               .. h3::

                  Main content

               The sidebar stays beside this content while there is enough space.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - right-sidebar

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: content-width
                  :label: content-width
                  :value: 50%
                  :placeholder: 50%
                  :clearable:

               .. tp-textfield::
                  :data-setting: gap
                  :label: gap
                  :value: 1rem
                  :placeholder: 1rem
                  :clearable:

               .. tp-textfield::
                  :data-setting: side-width
                  :label: side-width
                  :value: auto
                  :placeholder: auto
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
            :title: sidebar attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/sidebar/examples/attributes.js
