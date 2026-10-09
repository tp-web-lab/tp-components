.. tp-restructuredtext-viewer::
   :label: tp-post-it
   :allow-script:
   :style: --tp-markup-viewer-frame-min-height: 32rem

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :style: min-block-size: 20rem

            Drag the note by its header to move it over the page. The pin folds and opens it.

            .. tp-post-it::
               :heading: Remember

               Keep examples **simple and meaningful**.

               - Show a useful result.

               - Try the keyboard controls.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - lite

            .. tp-radio-list::
               :data-setting: color
               :label: color
               :label-position: top
               :orientation: horizontal
               :value: 5

               - default

               - red

               - orange

               - amber

               - yellow

               - lime

               - green

               - emerald

               - teal

               - glaz

               - cyan

               - sky

               - blue

               - indigo

               - violet

               - purple

               - fuchsia

               - pink

               - rose

               - zinc

               - ivory

               - stone

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: heading
                  :label: heading
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-numberfield::
                  :data-setting: opacity
                  :label: opacity
                  :value: 1
                  :min: 0
                  :max: 1
                  :step: 0.05
                  :range:

               .. tp-numberfield::
                  :data-setting: rotation
                  :label: rotation
                  :value: 0
                  :min: -12
                  :max: 12
                  :step: 1
                  :range:

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
            :title: post-it attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/post-it/examples/attributes.js

      .. example:: Lite note

         .. tp-post-it::
            :heading: Reminder
            :lite:

            Keep examples **simple and meaningful**.

      .. example:: Notes board

         .. tp-cluster::
            :gap: 2rem
            :style: padding: 1rem

            .. tp-post-it::
               :heading: Plan
               :color: yellow
               :rotation: -2

               Write one useful example.

            .. tp-post-it::
               :heading: Review
               :color: blue
               :rotation: 2

               Check the result with the keyboard.

            .. tp-post-it::
               :heading: Your reminder
               :color: pink

               .. tp-textfield::
                  :label: Reminder
                  :placeholder: What comes next?
                  :clearable:
