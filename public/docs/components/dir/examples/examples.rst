.. tp-restructuredtext-viewer::
   :label: tp-dir
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            .. tp-dir::

            Use the direction button to switch this paragraph between left-to-right and right-to-left layout.

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
