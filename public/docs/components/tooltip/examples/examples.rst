.. tp-restructuredtext-viewer::
   :label: tp-tooltip
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-intro-action: tooltip
            :data-allow-script:

            .. tp-button::
               :id: intro-tooltip-trigger
               :data-demo-trigger:

               Hover or focus for help

            .. tp-tooltip::
               :anchor: #intro-tooltip-trigger

               This help also appears when the trigger receives keyboard focus.

            .. attributes::
               :data-demo-status:
               :role: status

            Try the tooltip using its trigger.

            .. script::
               :src: /docs/components/_shared/introduction-actions.js

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/button/button.js";
            import "/components/tooltip/tooltip.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-box");
            element1.setAttribute("data-intro-action", "tooltip");
            element1.setAttribute("data-allow-script", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("tp-button");
            element2.setAttribute("id", "intro-tooltip-trigger");
            element2.setAttribute("data-demo-trigger", "");
            element2.append(document.createTextNode("Hover or focus for help"));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("tp-tooltip");
            element3.setAttribute("anchor", "#intro-tooltip-trigger");
            element3.append(document.createTextNode("This help also appears when the trigger receives keyboard focus."));
            element1.append(element3);
            element1.append(document.createTextNode("\n  "));

            const element4 = document.createElement("p");
            element4.setAttribute("data-demo-status", "");
            element4.setAttribute("role", "status");
            element4.append(document.createTextNode("Try the tooltip using its trigger."));
            element1.append(element4);
            element1.append(document.createTextNode("\n  "));

            const element5 = document.createElement("script");
            element5.setAttribute("src", "/docs/components/_shared/introduction-actions.js");
            element1.append(element5);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Links and scrollable content

         .. role:: example-kbd-1(kbd)

         .. role:: example-kbd-2(kbd)

         .. tp-box::
            :style: min-height: 20rem; padding: 1rem; display: flex; align-items: end;

            .. tp-button::
               :id: scroll-tooltip-trigger
               :class: scroll-tooltip-trigger

               Hover, then enter the tooltip

            .. tp-tooltip::
               :anchor: .scroll-tooltip-trigger
               :style: inline-size: 28rem; max-inline-size: calc(100vw - 2rem); padding: 0; border: 1px solid var(--tp-brand-stroke-soft); background: var(--tp-background-color); color: var(--tp-text-body);

               .. div::
                  :tabindex: 0
                  :aria-label: Scrollable tooltip guide
                  :style: max-height: 10rem; overflow: auto; overscroll-behavior: contain; padding: 1rem;

                  **Try the interactive tooltip**

                  Move the pointer here, then `open the details below <#tooltip-example-details>`__ or scroll through this guide.

                  1. Hover over the button to open the tooltip.
                  2. Move across the gap into the tooltip.
                  3. Keep the pointer inside: the tooltip stays open.
                  4. Select some text without closing it.
                  5. Use the mouse wheel or scrollbar to continue reading.
                  6. Use :example-kbd-1:`Tab` to focus the scrollable guide.
                  7. Use the arrow keys to scroll while the guide has focus.
                  8. Follow the link at the end of the guide.
                  9. Move away from both areas to close the tooltip when it has no keyboard focus.
                  10. Press :example-kbd-2:`Escape` to close it immediately.

                  `Read the details <#tooltip-example-details>`__

         .. _tooltip-example-details:

         **Details:** Links inside the tooltip work like ordinary links. Hover or focus the button again to reopen the guide.
