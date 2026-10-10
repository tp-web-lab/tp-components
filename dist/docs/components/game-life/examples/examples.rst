.. tp-restructuredtext-viewer::
   :label: tp-game-life
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-game-life::
            :preset: glider
            :label: Glider
            :cell-size: 14

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - autoplay

               - wrap

            .. tp-radio-list::
               :data-setting: preset
               :label: preset
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default (empty)

               - glider

               - blinker

               - toad

               - beacon

               - gosper-gun

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: alive-color
                  :label: alive-color
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: background
                  :label: background
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: cell-radius
                  :label: cell-radius
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: cell-size
                  :label: cell-size
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: dead-color
                  :label: dead-color
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: grid-color
                  :label: grid-color
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: grid-stroke-width
                  :label: grid-stroke-width
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: interval
                  :label: interval
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
                  :data-setting: padding
                  :label: padding
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: preset-height
                  :label: preset-height
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: preset-width
                  :label: preset-width
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: preset-x
                  :label: preset-x
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: preset-y
                  :label: preset-y
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: steps
                  :label: steps
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
            :title: game-life attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/game-life/examples/attributes.js
