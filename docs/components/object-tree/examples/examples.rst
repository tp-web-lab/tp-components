.. tp-restructuredtext-viewer::
   :label: tp-object-tree
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-object-tree::

            .. script::
               :type: tp/javascript

               ({
                 course: {
                   title: 'Web components',
                   lessons: 12,
                   published: true
                 },
                 topics: ['HTML', 'CSS', 'JavaScript']
               })

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: src
               :label: src
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default

               - file1

               - file2

               - file-unknown

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
            :title: object-tree attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /tp-components/docs/components/object-tree/examples/attributes.js

      .. example:: Internal script

         .. tp-object-tree::

            .. script::
               :type: tp/javascript

               ({
                 component: 'tp-object-tree',
                 stable: true,
                 versions: [1, 2, 3]
               })

      .. example:: JavaScript API

         .. tp-object-tree::

         .. script::

            {
            const script = document.currentScript;
            const output = script?.closest('[data-role="output"]');
            const tree = output?.querySelector('tp-object-tree')
              ?? script?.previousElementSibling;

            customElements.whenDefined('tp-object-tree').then(() => {
              tree?.setValue({
                component: 'tp-object-tree',
                stable: true,
                versions: [1, 2, 3]
              });
            });
            }
