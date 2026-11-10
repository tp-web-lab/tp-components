.. tp-restructuredtext-viewer::
   :label: tp-toolbar
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-icon-1(tp-icon)
            :section: start
            :name: home
            :aria-label: Home

         .. role:: example-tp-icon-2(tp-icon)
            :section: start
            :name: menu
            :aria-label: Menu

         .. role:: example-tp-icon-3(tp-icon)
            :section: end
            :name: github
            :aria-label: GitHub

         .. role:: example-tp-icon-4(tp-icon)
            :section: end
            :name: settings
            :aria-label: Settings

         .. role:: example-tp-icon-5(tp-icon)
            :section: end
            :name: help
            :aria-label: Help

         .. tp-box::
            :padding: 0

            .. tp-toolbar::

               :example-tp-icon-1:`home` :example-tp-icon-2:`menu`

               .. span::
                  :section: center

                  Document

               :example-tp-icon-3:`github` :example-tp-icon-4:`settings` :example-tp-icon-5:`help`

            .. tp-box::
               :border-width: 0
               :style: min-block-size: 5rem; display: grid; place-items: center

               Document area

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/icon/icon.js";
            import "/components/toolbar/toolbar.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-box");
            element1.setAttribute("padding", "0");
            element1.append(document.createTextNode("\n"));

            const element2 = document.createElement("tp-toolbar");
            element2.append(document.createTextNode("\n  "));

            const element3 = document.createElement("tp-icon");
            element3.setAttribute("section", "start");
            element3.setAttribute("name", "home");
            element3.setAttribute("aria-label", "Home");
            element2.append(element3);
            element2.append(document.createTextNode("\n  "));

            const element4 = document.createElement("tp-icon");
            element4.setAttribute("section", "start");
            element4.setAttribute("name", "menu");
            element4.setAttribute("aria-label", "Menu");
            element2.append(element4);
            element2.append(document.createTextNode("\n  "));

            const element5 = document.createElement("span");
            element5.setAttribute("section", "center");
            element5.append(document.createTextNode("Document"));
            element2.append(element5);
            element2.append(document.createTextNode("\n  "));

            const element6 = document.createElement("tp-icon");
            element6.setAttribute("section", "end");
            element6.setAttribute("name", "github");
            element6.setAttribute("aria-label", "GitHub");
            element2.append(element6);
            element2.append(document.createTextNode("\n  "));

            const element7 = document.createElement("tp-icon");
            element7.setAttribute("section", "end");
            element7.setAttribute("name", "settings");
            element7.setAttribute("aria-label", "Settings");
            element2.append(element7);
            element2.append(document.createTextNode("\n  "));

            const element8 = document.createElement("tp-icon");
            element8.setAttribute("section", "end");
            element8.setAttribute("name", "help");
            element8.setAttribute("aria-label", "Help");
            element2.append(element8);
            element2.append(document.createTextNode("\n"));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element9 = document.createElement("tp-box");
            element9.setAttribute("border-width", "0");
            element9.setAttribute("style", "min-block-size: 5rem; display: grid; place-items: center");
            element9.append(document.createTextNode("Document area"));
            element1.append(element9);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);
