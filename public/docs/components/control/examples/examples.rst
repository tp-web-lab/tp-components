.. tp-restructuredtext-viewer::
   :label: tp-control
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :data-tp-color-scope:

            .. tp-control::
               :value: color,theme

            Change the color or theme of this box. The inline code ``hello(world)`` uses the selected brand color.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/control/control.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-box");
            element1.setAttribute("data-tp-color-scope", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("tp-control");
            element2.setAttribute("value", "color,theme");
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("p");
            element3.append(document.createTextNode("Change the color or theme of this box. The inline code "));

            const element4 = document.createElement("code");
            element4.append(document.createTextNode("hello(world)"));
            element3.append(element4);
            element3.append(document.createTextNode(" uses the selected brand color."));
            element1.append(element3);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: All controllers

         .. tp-control::
            :value: clock,lang,dir,color,theme,screen,fullscreen
            :langs: en,fr

      .. example:: Initially hidden

         .. tp-control::
