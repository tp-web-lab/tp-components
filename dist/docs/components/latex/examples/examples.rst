.. tp-restructuredtext-viewer::
   :label: tp-latex
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-latex::

            .. script::
               :type: tp/latex

               \section{A first document}
               The area of a circle is $A=\pi r^2$.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/latex/latex.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-latex");

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/latex");
            element2.textContent = "\\section{A first document}\nThe area of a circle is $A=\\pi r^2$.";
            element1.append(element2);
            example.append(element1);

            document.body.append(example);
