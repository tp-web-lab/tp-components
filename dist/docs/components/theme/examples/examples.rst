.. tp-restructuredtext-viewer::
   :label: tp-theme
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. section::

            .. tp-theme::

            The selected theme is scoped to this section.

            ``Inline code follows the selected theme.``

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

               - light

               - dark

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

               .. tp-textfield::
                  :data-setting: ui-anchor
                  :label: ui-anchor
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
            :title: theme attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/theme/examples/attributes.js

      .. example:: Local theme scope

         .. tp-box::

            .. tp-theme::

            .. tp-callout::

               The selected theme is scoped to this box.

      .. example:: Change event

         .. section::
            :id: theme-event-target

            .. tp-theme::
               :anchor: #theme-event-target

            Choose a different theme mode to emit
            ``tp-theme-change``
            .

            .. tp-callout::

               This callout follows the selected theme.

         .. tp-console::

         .. script::
            :type: module

            customElements.whenDefined('tp-console').then(() => {
              const section = document.querySelector('#theme-event-target');
              const output = document.querySelector('tp-console');
              output.redirectConsoleToSelf();
              section?.addEventListener('tp-theme-change', (event) => {
                console.info('tp-theme-change', {
                  mode: event.detail.mode,
                  theme: event.detail.theme,
                  anchor: event.detail.anchor,
                  target: event.detail.target?.id,
                });
              });
            });
