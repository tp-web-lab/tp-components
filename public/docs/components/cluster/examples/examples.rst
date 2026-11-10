.. tp-restructuredtext-viewer::
   :label: tp-cluster
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            .. tp-cluster::
               :justify: center
               :gap: 0.5rem

               .. tp-button::

                  Alpha

               .. tp-button::

                  Beta

               .. tp-button::

                  Gamma

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/button/button.js";
            import "/components/cluster/cluster.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-box");
            element1.append(document.createTextNode("\n      "));

            const element2 = document.createElement("tp-cluster");
            element2.setAttribute("justify", "center");
            element2.setAttribute("gap", "0.5rem");
            element2.append(document.createTextNode("\n        "));

            const element3 = document.createElement("tp-button");
            element3.append(document.createTextNode("Alpha"));
            element2.append(element3);
            element2.append(document.createTextNode("\n        "));

            const element4 = document.createElement("tp-button");
            element4.append(document.createTextNode("Beta"));
            element2.append(element4);
            element2.append(document.createTextNode("\n        "));

            const element5 = document.createElement("tp-button");
            element5.append(document.createTextNode("Gamma"));
            element2.append(element5);
            element2.append(document.createTextNode("\n      "));
            element1.append(element2);
            element1.append(document.createTextNode("\n    "));
            example.append(element1);

            document.body.append(example);

      .. example:: Space between

         .. tp-box::

            .. tp-cluster::
               :justify: space-between

               .. tp-badge::

                  Start

               .. tp-badge::

                  End

      .. example:: Wrapping items

         .. tp-box::
            :style: max-inline-size: 16rem

            .. tp-cluster::
               :gap: 0.5rem

               .. tp-button::

                  One

               .. tp-button::

                  Two

               .. tp-button::

                  Three

               .. tp-button::

                  Four
