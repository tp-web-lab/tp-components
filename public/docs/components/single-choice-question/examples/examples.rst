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

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - random

            .. tp-radio-list::
               :data-setting: orientation
               :label: orientation
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default (empty)

               - horizontal

               - vertical

            .. tp-radio-list::
               :data-setting: src
               :label: src
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default

               - file1

               - file2

               - file-unknown

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: answer
                  :label: answer
                  :value: 0
                  :placeholder: 0
                  :clearable:

               .. tp-textfield::
                  :data-setting: name
                  :label: name
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: value
                  :label: value
                  :value:
                  :placeholder:
                  :clearable:

            .. tp-button-group::

               .. tp-button::
                  :id: attributes-reset
                  :type: button

                  Reset defaults

               .. tp-button::
                  :id: attributes-reload
                  :type: button

                  Reload preview

         .. tp-divider::

         .. h3::

            Preview

         .. tp-iframe::
            :id: attributes-frame
            :title: single-choice-question attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /docs/components/single-choice-question/examples/attributes.js

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
