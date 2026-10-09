.. tp-restructuredtext-viewer::
   :label: tp-avatar
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-cluster::

            .. tp-avatar::
               :src: /tp-components/docs/medias/logos/logo-tp.svg
               :label: tp-components

            .. tp-avatar::
               :initials: AL
               :label: Ada Lovelace

            .. tp-avatar::
               :icon: user
               :shape: square
               :label: Guest

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: shape
               :label: shape
               :label-position: top
               :orientation: horizontal
               :value: 1

               - circle

               - square

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

               - No image (default)

               - tp-components logo

               - Portrait illustration

               - Missing image (test fallback)

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: icon
                  :label: icon
                  :value: user
                  :placeholder: user
                  :clearable:

               .. tp-textfield::
                  :data-setting: initials
                  :label: initials
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
                  :data-setting: library
                  :label: library
                  :value: tp
                  :placeholder: tp
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
            :title: avatar attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         The src control selects no image, the tp-components logo, a portrait illustration or a deliberately missing image. A missing image displays the initials, or the icon if no initials are set. These choices only restrict this demo: the component accepts an image URL in src.

         .. script::
            :type: module
            :src: /tp-components/docs/components/avatar/examples/attributes.js
