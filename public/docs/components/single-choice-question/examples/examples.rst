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
