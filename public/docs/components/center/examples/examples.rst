.. tp-restructuredtext-viewer::
   :label: tp-center
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-center::
            :intrinsic:

            .. tp-box::

               Centered content

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/box/box.js";
            import "/components/center/center.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-center");
            element1.setAttribute("intrinsic", "");
            element1.append(document.createTextNode("\n      "));

            const element2 = document.createElement("tp-box");
            element2.append(document.createTextNode("Centered content"));
            element1.append(element2);
            element1.append(document.createTextNode("\n    "));
            example.append(element1);

            document.body.append(example);

      .. example:: Constrained region

         Compare the two centered regions: the narrow region wraps the same text onto more lines. Resize the preview to see both regions shrink when less space is available.

         .. tp-stack::

            .. tp-box::

               **Maximum width: 18rem**

               .. tp-center::
                  :max-inline-size: 18rem

                  .. tp-box::
                     :invert:

                     The same text appears in both regions. The maximum width controls the width of the region, not the alignment of its text. Equal space on either side keeps the region centered.

            .. tp-box::

               **Maximum width: 36rem**

               .. tp-center::
                  :max-inline-size: 36rem

                  .. tp-box::
                     :invert:

                     The same text appears in both regions. The maximum width controls the width of the region, not the alignment of its text. Equal space on either side keeps the region centered.
