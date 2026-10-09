.. tp-restructuredtext-viewer::
   :label: tp-lorem-ipsum
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-lorem-ipsum::
            :length: 1
            :words-per-sentence: 8
            :sentences-per-paragraph: 2
            :seed: 42

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: type
               :label: type
               :label-position: top
               :orientation: horizontal
               :value: 3

               - sentence

               - title

               - p

               - dl

               - ol

               - ul

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: length
                  :label: length
                  :value: 3-5
                  :placeholder: 3-5
                  :clearable:

               .. tp-textfield::
                  :data-setting: seed
                  :label: seed
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: sentences-per-paragraph
                  :label: sentences-per-paragraph
                  :value: 3-6
                  :placeholder: 3-6
                  :clearable:

               .. tp-textfield::
                  :data-setting: words-per-sentence
                  :label: words-per-sentence
                  :value: 4-16
                  :placeholder: 4-16
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
            :title: lorem-ipsum attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/lorem-ipsum/examples/attributes.js
