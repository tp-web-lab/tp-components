.. tp-restructuredtext-viewer::
   :label: tp-color
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. section::

            .. tp-color::

            The selected brand color is scoped to this section.

            ``Inline code uses the selected brand colour.``

      .. example:: Local color scope

         .. tp-box::

            .. tp-color::

            .. tp-callout::
               :variant: brand

               The selected brand color is scoped to this box.

      .. example:: Change event

         .. section::
            :id: color-event-target

            .. tp-color::
               :anchor: #color-event-target

            Choose a brand color to emit
            ``tp-color-change``
            .

            .. tp-callout::
               :variant: brand

               This callout follows the selected brand color.

         .. tp-console::

         .. script::
            :type: module

            customElements.whenDefined('tp-console').then(() => {
              const section = document.querySelector('#color-event-target');
              const output = document.querySelector('tp-console');
              output.redirectConsoleToSelf();
              section?.addEventListener('tp-color-change', (event) => {
              console.info('tp-color-change', {
                preset: event.detail.preset,
                brand: event.detail.brand,
                anchor: event.detail.anchor,
                target: event.detail.target?.id,
              });
              });
            });
