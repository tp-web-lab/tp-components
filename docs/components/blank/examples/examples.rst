.. tp-restructuredtext-viewer::
   :label: tp-blank
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-blank-1(tp-blank)
            :name: capital
            :aria-label: Capital of France

         .. role:: example-tp-blank-2(tp-blank)
            :name: shape
            :aria-label: Three-sided shape

         .. role:: example-tp-blank-3(tp-blank)
            :name: logo
            :aria-label: Library logo

         .. tp-fill-blank-question::
            :closed:

            Title
               Match the answers

            Prompt
               Choose an answer for each blank.

            Answers
               1. Paris

               2. .. image:: /tp-components/docs/medias/examples/36c2ceb2a29fc3ae.svg
                     :alt: Triangle
                     :width: 48
                     :height: 40

               3. .. image:: /tp-components/docs/medias/logos/logo-tp.svg
                     :alt: tp-components logo
                     :width: 40
                     :height: 40

            Form
               The capital of France: :example-tp-blank-1:`capital`

               A shape with three sides: :example-tp-blank-2:`shape`

               The library logo: :example-tp-blank-3:`logo`

            Feedback
               Match each answer to its description.

            Solution
               Paris; the triangle; the tp-components logo.

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

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: aria-label
                  :label: aria-label
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: name
                  :label: name
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: placeholder
                  :label: placeholder
                  :value: …
                  :placeholder: …
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
            :title: blank attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/blank/examples/attributes.js
