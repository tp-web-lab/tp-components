.. tp-restructuredtext-viewer::
   :label: tp-index
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-ref-1(tp-ref)
            :href: !matrix

         .. role:: example-tp-ref-2(tp-ref)
            :href: !square
            :silent:
            :tp-empty: true

         .. div::
            :data-tp-reference-scope:

            A :example-tp-ref-1:`matrix` represents a linear map.

            A square matrix\ :example-tp-ref-2:`reference-square-1` has equal dimensions.

            .. tp-index::
               :ref: matrix
               :title: Matrix

               A rectangular array of numbers.

            .. tp-index::
               :ref: square
               :title: Square matrix
               :parent: matrix

            .. tp-listof::
               :selector: tp-index
               :title: Subject index

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/index/index.js";
            import "/components/listof/listof.js";
            import "/components/ref/ref.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("div");
            element1.setAttribute("data-tp-reference-scope", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("p");
            element2.append(document.createTextNode("A "));

            const element3 = document.createElement("tp-ref");
            element3.setAttribute("href", "!matrix");
            element3.append(document.createTextNode("matrix"));
            element2.append(element3);
            element2.append(document.createTextNode(" represents a linear map."));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element4 = document.createElement("p");
            element4.append(document.createTextNode("A square matrix"));

            const element5 = document.createElement("tp-ref");
            element5.setAttribute("href", "!square");
            element5.setAttribute("silent", "");
            element4.append(element5);
            element4.append(document.createTextNode(" has equal dimensions."));
            element1.append(element4);
            element1.append(document.createTextNode("\n  "));

            const element6 = document.createElement("tp-index");
            element6.setAttribute("ref", "matrix");
            element6.setAttribute("title", "Matrix");

            const element7 = document.createElement("p");
            element7.append(document.createTextNode("A rectangular array of numbers."));
            element6.append(element7);
            element1.append(element6);
            element1.append(document.createTextNode("\n  "));

            const element8 = document.createElement("tp-index");
            element8.setAttribute("ref", "square");
            element8.setAttribute("title", "Square matrix");
            element8.setAttribute("parent", "matrix");
            element1.append(element8);
            element1.append(document.createTextNode("\n  "));

            const element9 = document.createElement("tp-listof");
            element9.setAttribute("selector", "tp-index");
            element9.setAttribute("title", "Subject index");
            element1.append(element9);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Named indexes and cross-references

         .. role:: example-tp-ref-1(tp-ref)
            :href: !matrix

         .. role:: example-tp-ref-2(tp-ref)
            :href: !vector

         .. role:: example-tp-ref-3(tp-ref)
            :href: !euler
            :index: people

         .. div::
            :data-tp-reference-scope:

            :example-tp-ref-1:`Matrices` and :example-tp-ref-2:`vectors` are useful in algebra.

            :example-tp-ref-3:`Leonhard Euler` studied matrices.

            .. tp-index::
               :ref: matrix
               :title: Matrix

            .. tp-index::
               :ref: vector
               :title: Vector
               :see-also: matrix

            .. tp-index::
               :ref: array
               :title: Array
               :see: matrix

            .. tp-index::
               :ref: euler
               :index: people
               :title: Leonhard Euler
               :sort-key: Euler

               Mathematician.

            .. tp-listof::
               :selector: tp-index
               :title: Subjects

            .. tp-listof::
               :selector: tp-index
               :index: people
               :title: People
