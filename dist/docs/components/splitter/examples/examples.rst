.. tp-restructuredtext-viewer::
   :label: tp-splitter
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-splitter::
            :position: 40%

            start
               .. tp-box::

                  Drag the divider to resize this panel.

            end
               .. tp-box::

                  This panel uses the remaining space.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/splitter/splitter.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-splitter");
            element1.setAttribute("position", "40%");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("dl");
            element2.append(document.createTextNode("\n    "));

            const element3 = document.createElement("dt");
            element3.append(document.createTextNode("start"));
            element2.append(element3);

            const element4 = document.createElement("dd");

            const element5 = document.createElement("tp-box");
            element5.append(document.createTextNode("Drag the divider to resize this panel."));
            element4.append(element5);
            element2.append(element4);
            element2.append(document.createTextNode("\n    "));

            const element6 = document.createElement("dt");
            element6.append(document.createTextNode("end"));
            element2.append(element6);

            const element7 = document.createElement("dd");

            const element8 = document.createElement("tp-box");
            element8.append(document.createTextNode("This panel uses the remaining space."));
            element7.append(element8);
            element2.append(element7);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Nested splitters

         Drag the outer divider left or right, then drag the inner divider up or down. Focus either divider to resize its panels with the arrow keys.

         .. tp-splitter::
            :axis: horizontal
            :position: 30%
            :style: height: 20rem

            start
               .. tp-box::

                  .. h3::

                     Navigation

                  This panel is resized by the outer divider.

            end
               .. tp-splitter::
                  :axis: vertical
                  :position: 55%
                  :style: height: 100%

                  start
                     .. tp-box::

                        .. h3::

                           Editor

                        The inner divider changes the height of this panel.

                  end
                     .. tp-box::

                        .. h3::

                           Preview

                        This panel uses the remaining height.
