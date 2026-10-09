.. tp-restructuredtext-viewer::
   :label: tp-toc
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-tp-toc-scope:

            .. tp-toc::
               :label: On this page
               :open:
               :expand-all:

            .. h2::

               Getting started

            Choose a heading in the table of contents to jump to its section.

            .. h3::

               Installation

            Install the library in your project.

            .. h3::

               First component

            Add your first interactive component.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - brand

               - expand-all

               - open

            .. tp-radio-list::
               :data-setting: position
               :label: position
               :label-position: top
               :orientation: horizontal
               :value: 3

               - start

               - end

               - center

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: label
                  :label: label
                  :value: Contents
                  :placeholder: Contents
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
            :title: toc attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/toc/examples/attributes.js
