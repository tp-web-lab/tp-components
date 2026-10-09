.. tp-restructuredtext-viewer::
   :label: tp-note
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-ref-1(tp-ref)
            :href: ^example

         .. div::
            :data-tp-reference-scope:

            Read more :example-tp-ref-1:`note-example`.

            .. tp-note::
               :ref: example
               :title: Example

               Additional information with **HTML content**.

            .. tp-listof::
               :selector: tp-note

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         Enter example in ref to connect the inline reference to this entry. Clear the field to return to the empty default.

         .. tp-stack::

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: ref
                  :label: ref
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
            :title: note attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/note/examples/attributes.js
