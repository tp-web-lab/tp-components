.. tp-restructuredtext-viewer::
   :label: tp-dir
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            .. tp-dir::

            Use the direction button to switch this paragraph between left-to-right and right-to-left layout.

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

            .. tp-radio-list::
               :data-setting: mode
               :label: mode
               :label-position: top
               :orientation: horizontal
               :value: 3

               - ltr

               - rtl

               - auto

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

               .. tp-textfield::
                  :data-setting: anchor
                  :label: anchor
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
            :title: dir attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/dir/examples/attributes.js

      .. example:: Auto mode

         .. tp-box::

            .. tp-dir::
               :mode: auto

            Auto mode follows the document direction.

      .. example:: Change event

         .. section::
            :id: dir-event-target

            .. tp-dir::
               :anchor: #dir-event-target

            Choose a direction to emit
            ``tp-dir-change``
            .

            يمكن تغيير اتجاه القراءة في هذا القسم.

         .. tp-console::

         .. script::
            :type: module

            customElements.whenDefined('tp-console').then(() => {
              const section = document.querySelector('#dir-event-target');
              const output = document.querySelector('tp-console');
              output.redirectConsoleToSelf();
              section?.addEventListener('tp-dir-change', (event) => {
              console.info('tp-dir-change', {
                mode: event.detail.mode,
                dir: event.detail.dir,
                anchor: event.detail.anchor,
                target: event.detail.target?.id,
              });
              });
            });
