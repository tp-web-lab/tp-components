.. tp-restructuredtext-viewer::
   :label: tp-scheme-interpreter-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-scheme-interpreter-question::
            :query: (double 3)
            :open:
            :src: /docs/components/scheme-interpreter-question/examples/double.scm

            Title
               Double a number

            Prompt
               Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.

            Feedback
               /docs/components/scheme-interpreter-question/examples/double.test.scm

            Solution
               Return (\* x 2).

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/scheme/scheme.js";
            import "/components/scheme-interpreter-question/scheme-interpreter-question.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-scheme-interpreter-question");
            element1.setAttribute("query", "(double 3)");
            element1.setAttribute("open", "");
            element1.setAttribute("src", "/docs/components/scheme-interpreter-question/examples/double.scm");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("dl");
            element2.append(document.createTextNode("\n    "));

            const element3 = document.createElement("dt");
            element3.append(document.createTextNode("Title"));
            element2.append(element3);

            const element4 = document.createElement("dd");
            element4.append(document.createTextNode("Double a number"));
            element2.append(element4);
            element2.append(document.createTextNode("\n    "));

            const element5 = document.createElement("dt");
            element5.append(document.createTextNode("Prompt"));
            element2.append(element5);

            const element6 = document.createElement("dd");
            element6.append(document.createTextNode("Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests."));
            element2.append(element6);
            element2.append(document.createTextNode("\n    "));

            const element7 = document.createElement("dt");
            element7.append(document.createTextNode("Feedback"));
            element2.append(element7);

            const element8 = document.createElement("dd");
            element8.append(document.createTextNode("/docs/components/scheme-interpreter-question/examples/double.test.scm"));
            element2.append(element8);
            element2.append(document.createTextNode("\n    "));

            const element9 = document.createElement("dt");
            element9.append(document.createTextNode("Solution"));
            element2.append(element9);

            const element10 = document.createElement("dd");
            element10.append(document.createTextNode("Return (* x 2)."));
            element2.append(element10);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Passing solution

         .. tp-scheme-interpreter-question::
            :query: (double 3)
            :open:
            :src: /docs/components/scheme-interpreter-question/examples/double-solved.scm
            :test: /docs/components/scheme-interpreter-question/examples/double.test.scm

            Title
               Double a number

            Prompt
               Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.

            Solution
               Return (\* x 2).

      .. example:: Explicit Feedback file

         .. tp-scheme-interpreter-question::
            :query: (double 3)
            :open:

            .. script::
               :type: tp/scheme

               (define (double x) (+ x 1))

            Title
               Double a number

            Prompt
               Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.

            Feedback
               /docs/components/scheme-interpreter-question/examples/double.test.scm

            Solution
               Return (\* x 2).
