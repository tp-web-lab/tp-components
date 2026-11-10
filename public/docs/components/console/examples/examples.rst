.. tp-restructuredtext-viewer::
   :label: tp-console
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-intro-action: console
            :data-allow-script:

            Inspect these example messages, then use Clear to empty the console.

            .. tp-console::

            .. p::
               :data-demo-status:
               :role: status

            .. script::
               :src: /docs/components/_shared/introduction-actions.js

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/console/console.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-box");
            element1.setAttribute("data-intro-action", "console");
            element1.setAttribute("data-allow-script", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("p");
            element2.append(document.createTextNode("Inspect these example messages, then use Clear to empty the console."));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("tp-console");
            element1.append(element3);
            element1.append(document.createTextNode("\n  "));

            const element4 = document.createElement("p");
            element4.setAttribute("data-demo-status", "");
            element4.setAttribute("role", "status");
            element1.append(element4);
            element1.append(document.createTextNode("\n  "));

            const element5 = document.createElement("script");
            element5.setAttribute("src", "/docs/components/_shared/introduction-actions.js");
            element1.append(element5);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Values and tables

         .. tp-console::
            :id: values-console

         .. script::

            {
            const script = document.currentScript;
            const output =
              script?.closest('[data-role="output"]')?.querySelector('tp-console')
              ?? script?.parentElement?.querySelector('tp-console');
            customElements.whenDefined('tp-console').then(() => {
            output.log('Primitive values', 42, true, null, undefined);
            output.log('Nested object', {
              name: 'Ada',
              skills: ['math', 'programming'],
              active: true,
            });
            output.table([
              { name: 'Ada', score: 10 },
              { name: 'Grace', score: 9 },
            ]);
            });
            }

      .. example:: Groups and timers

         .. tp-console::
            :id: group-console

         .. script::

            {
            const script = document.currentScript;
            const output =
              script?.closest('[data-role="output"]')?.querySelector('tp-console')
              ?? script?.parentElement?.querySelector('tp-console');
            customElements.whenDefined('tp-console').then(() => {
            output.group('Build');
            output.log('Compile sources');
            output.groupCollapsed('Details');
            output.log({ files: 12, warnings: 0 });
            output.groupEnd();
            output.time('render');
            output.timeLog('render', 'halfway');
            output.timeEnd('render');
            output.groupEnd();
            });
            }

      .. example:: Redirect global console

         .. tp-console::
            :id: redirect-console

         .. script::

            {
            const script = document.currentScript;
            const output =
              script?.closest('[data-role="output"]')?.querySelector('tp-console')
              ?? script?.parentElement?.querySelector('tp-console');
            customElements.whenDefined('tp-console').then(() => {
            const restore = output.redirectConsoleToSelf();
            console.log('Captured log');
            console.warn('Captured warning');
            console.error('Captured error');
            restore();
            });
            }

      .. example:: Message levels

         .. tp-console::
            :id: basic-console

         .. script::

            {
            const script = document.currentScript;
            const output =
            script?.closest('[data-role="output"]')?.querySelector('tp-console')
            ?? script?.parentElement?.querySelector('tp-console');
            customElements.whenDefined('tp-console').then(() => {
            output.log('Standard message');
            output.info('Informative message', { type: 'info', count: 2 });
            output.warn('Warning message');
            output.error(new Error('Error message'));
            });
            }
