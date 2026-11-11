.. tp-restructuredtext-viewer::
   :label: tp-popover
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-intro-action: popover
            :data-allow-script:

            .. tp-button::
               :id: intro-popover-trigger
               :data-demo-trigger:

               Show more information

            .. tp-popover::
               :anchor: #intro-popover-trigger
               :outside-click:

               This panel contains additional information.

               .. tp-button::
                  :data-demo-close:

                  Close

            .. p::
               :data-demo-status:
               :role: status

               Try the popover using its trigger.

            .. script::
               :src: /docs/components/_shared/introduction-actions.js

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/button/button.js";
            import "/components/popover/popover.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-box");
            element1.setAttribute("data-intro-action", "popover");
            element1.setAttribute("data-allow-script", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("tp-button");
            element2.setAttribute("id", "intro-popover-trigger");
            element2.setAttribute("data-demo-trigger", "");
            element2.append(document.createTextNode("Show more information"));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("tp-popover");
            element3.setAttribute("anchor", "#intro-popover-trigger");
            element3.setAttribute("outside-click", "");

            const element4 = document.createElement("p");
            element4.append(document.createTextNode("This panel contains additional information."));
            element3.append(element4);

            const element5 = document.createElement("tp-button");
            element5.setAttribute("data-demo-close", "");
            element5.append(document.createTextNode("Close"));
            element3.append(element5);
            element1.append(element3);
            element1.append(document.createTextNode("\n  "));

            const element6 = document.createElement("p");
            element6.setAttribute("data-demo-status", "");
            element6.setAttribute("role", "status");
            element6.append(document.createTextNode("Try the popover using its trigger."));
            element1.append(element6);
            element1.append(document.createTextNode("\n  "));

            const element7 = document.createElement("script");
            element7.setAttribute("src", "/docs/components/_shared/introduction-actions.js");
            element1.append(element7);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);
