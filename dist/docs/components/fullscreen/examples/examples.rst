.. tp-restructuredtext-viewer::
   :label: tp-fullscreen
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            .. tp-fullscreen::

            This box is the fullscreen target.

            Press Esc to exit fullscreen mode.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/fullscreen/fullscreen.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-box");
            element1.append(document.createTextNode("\n      "));

            const element2 = document.createElement("tp-fullscreen");
            element1.append(element2);
            element1.append(document.createTextNode("\n      "));

            const element3 = document.createElement("p");
            element3.append(document.createTextNode("This box is the fullscreen target."));
            element1.append(element3);
            element1.append(document.createTextNode("\n      "));

            const element4 = document.createElement("p");
            element4.append(document.createTextNode("Press Esc to exit fullscreen mode."));
            element1.append(element4);
            element1.append(document.createTextNode("\n    "));
            example.append(element1);

            document.body.append(example);

      .. example:: Toolbar control

         .. tp-box::

            .. tp-toolbar::

               .. tp-fullscreen::

            The fullscreen button is in a toolbar.

            The containing box is still the fullscreen target.

      .. example:: Change event

         .. tp-box::
            :id: fullscreen-event-target

            .. tp-fullscreen::
               :anchor: #fullscreen-event-target

            Enter or exit fullscreen to emit
            ``tp-fullscreen-change``
            .

         .. tp-console::

         .. script::
            :type: module

            customElements.whenDefined('tp-console').then(() => {
              const section = document.querySelector('#fullscreen-event-target');
              const output = document.querySelector('tp-console');
              output.redirectConsoleToSelf();
              section?.addEventListener('tp-fullscreen-change', (event) => {
              console.info('tp-fullscreen-change', {
                fullscreen: event.detail.fullscreen,
                anchor: event.detail.anchor,
                target: event.detail.target?.id,
              });
              });
            });
