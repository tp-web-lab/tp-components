.. tp-restructuredtext-viewer::
   :label: tp-typescript-interpreter-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-typescript-interpreter-question::
            :query: double(3)
            :open:
            :src: /docs/components/typescript-interpreter-question/examples/double.ts

            Title
               Double a number

            Prompt
               Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.

            Feedback
               /docs/components/typescript-interpreter-question/examples/double.test.ts

            Solution
               Return value \* 2.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/typescript/typescript.js";
            import "/components/typescript-interpreter-question/typescript-interpreter-question.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-typescript-interpreter-question");
            element1.setAttribute("query", "double(3)");
            element1.setAttribute("open", "");
            element1.setAttribute("src", "/docs/components/typescript-interpreter-question/examples/double.ts");
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
            element8.append(document.createTextNode("/docs/components/typescript-interpreter-question/examples/double.test.ts"));
            element2.append(element8);
            element2.append(document.createTextNode("\n    "));

            const element9 = document.createElement("dt");
            element9.append(document.createTextNode("Solution"));
            element2.append(element9);

            const element10 = document.createElement("dd");
            element10.append(document.createTextNode("Return value * 2."));
            element2.append(element10);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Passing solution

         .. tp-typescript-interpreter-question::
            :query: double(3)
            :open:
            :src: /docs/components/typescript-interpreter-question/examples/double-solved.ts
            :test: /docs/components/typescript-interpreter-question/examples/double.test.ts

            Title
               Double a number

            Prompt
               Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.

            Solution
               Return value \* 2.

      .. example:: Explicit Feedback file

         .. tp-typescript-interpreter-question::
            :query: double(3)
            :open:

            .. script::
               :type: tp/typescript

               function double(value: number): number {
               	return value + 1;
               }

            Title
               Double a number

            Prompt
               Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.

            Feedback
               /docs/components/typescript-interpreter-question/examples/double.test.ts

            Solution
               Return value \* 2.
