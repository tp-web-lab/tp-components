.. tp-restructuredtext-viewer::
   :label: tp-single-choice-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-single-choice-question::
            :answer: 1
            :random:

            Title
               Geography

            Prompt
               What is the capital of France?

            Form
               - Paris

               - London

               - Berlin

            Feedback
               - Correct.

               - London is in the UK.

               - Berlin is in Germany.

            Solution
               Paris

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/single-choice-question/single-choice-question.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-single-choice-question");
            element1.setAttribute("answer", "1");
            element1.setAttribute("random", "");
            element1.append(document.createTextNode("\n    "));

            const element2 = document.createElement("dl");
            element2.append(document.createTextNode("\n      "));

            const element3 = document.createElement("dt");
            element3.append(document.createTextNode("Title"));
            element2.append(element3);

            const element4 = document.createElement("dd");
            element4.append(document.createTextNode("Geography"));
            element2.append(element4);
            element2.append(document.createTextNode("\n      "));

            const element5 = document.createElement("dt");
            element5.append(document.createTextNode("Prompt"));
            element2.append(element5);

            const element6 = document.createElement("dd");
            element6.append(document.createTextNode("What is the capital of France?"));
            element2.append(element6);
            element2.append(document.createTextNode("\n      "));

            const element7 = document.createElement("dt");
            element7.append(document.createTextNode("Form"));
            element2.append(element7);

            const element8 = document.createElement("dd");

            const element9 = document.createElement("ul");

            const element10 = document.createElement("li");
            element10.append(document.createTextNode("Paris"));
            element9.append(element10);

            const element11 = document.createElement("li");
            element11.append(document.createTextNode("London"));
            element9.append(element11);

            const element12 = document.createElement("li");
            element12.append(document.createTextNode("Berlin"));
            element9.append(element12);
            element8.append(element9);
            element2.append(element8);
            element2.append(document.createTextNode("\n      "));

            const element13 = document.createElement("dt");
            element13.append(document.createTextNode("Feedback"));
            element2.append(element13);

            const element14 = document.createElement("dd");

            const element15 = document.createElement("ul");

            const element16 = document.createElement("li");
            element16.append(document.createTextNode("Correct."));
            element15.append(element16);

            const element17 = document.createElement("li");
            element17.append(document.createTextNode("London is in the UK."));
            element15.append(element17);

            const element18 = document.createElement("li");
            element18.append(document.createTextNode("Berlin is in Germany."));
            element15.append(element18);
            element14.append(element15);
            element2.append(element14);
            element2.append(document.createTextNode("\n      "));

            const element19 = document.createElement("dt");
            element19.append(document.createTextNode("Solution"));
            element2.append(element19);

            const element20 = document.createElement("dd");
            element20.append(document.createTextNode("Paris"));
            element2.append(element20);
            element2.append(document.createTextNode("\n    "));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));
            example.append(element1);

            document.body.append(example);

      .. example:: Derivative of tan(x)

         .. tp-single-choice-question::
            :answer: 2
            :random:
            :lang: en

            Title
               Derivative of the tangent function

            Prompt
               What is the derivative of :math:`f(x) = \tan(x)` at a point where :math:`\cos(x) \ne 0`?

            Form
               - :math:`\cos^{2}(x)`

               - :math:`\displaystyle \frac{1}{\cos^{2}(x)}`

               - :math:`\displaystyle -\frac{1}{\sin^{2}(x)}`

               - :math:`\displaystyle \frac{1}{\tan^{2}(x)}`

            Feedback
               - The square of the cosine belongs in the denominator.

               - Correct. Apply the quotient rule to sine divided by cosine.

               - This is the derivative of the cotangent, not the tangent.

               - The reciprocal square of the tangent is not its derivative.

            Solution
               :math:`\displaystyle f'(x) = \frac{1}{\cos^{2}(x)} = 1 + \tan^{2}(x)`, wherever :math:`\cos(x) \ne 0`.

      .. example:: Regular heptagon

         .. tp-single-choice-question::
            :answer: 3
            :random:
            :lang: en

            Title
               Recognize a regular heptagon

            Prompt
               Which figure is a regular heptagon? Select the polygon with seven equal sides and seven equal interior angles.

            Form
               - .. image:: /docs/components/single-choice-question/examples/pentagon.svg
                    :alt: Regular polygon with 5 sides
                    :width: 120
                    :height: 120

               - .. image:: /docs/components/single-choice-question/examples/hexagon.svg
                    :alt: Regular polygon with 6 sides
                    :width: 120
                    :height: 120

               - .. image:: /docs/components/single-choice-question/examples/heptagon.svg
                    :alt: Regular polygon with 7 sides
                    :width: 120
                    :height: 120

               - .. image:: /docs/components/single-choice-question/examples/octagon.svg
                    :alt: Regular polygon with 8 sides
                    :width: 120
                    :height: 120

               - .. image:: /docs/components/single-choice-question/examples/nonagon.svg
                    :alt: Regular polygon with 9 sides
                    :width: 120
                    :height: 120

            Feedback
               - This pentagon has five sides.

               - This hexagon has six sides.

               - Correct. This heptagon has seven equal sides and seven equal interior angles.

               - This octagon has eight sides.

               - This nonagon has nine sides.

            Solution
               The regular heptagon is the polygon with seven equal sides and seven equal interior angles.
