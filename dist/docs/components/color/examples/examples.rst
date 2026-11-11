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

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/color/color.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("section");
            element1.append(document.createTextNode("\n      "));

            const element2 = document.createElement("tp-color");
            element1.append(element2);
            element1.append(document.createTextNode("\n      "));

            const element3 = document.createElement("p");
            element3.append(document.createTextNode("The selected brand color is scoped to this section."));
            element1.append(element3);
            element1.append(document.createTextNode("\n      "));

            const element4 = document.createElement("code");
            element4.append(document.createTextNode("Inline code uses the selected brand colour."));
            element1.append(element4);
            element1.append(document.createTextNode("\n    "));
            example.append(element1);

            document.body.append(example);

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
