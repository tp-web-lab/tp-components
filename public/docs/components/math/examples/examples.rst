.. tp-restructuredtext-viewer::
   :label: tp-math
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-math-1(tp-math)
            :value: a^2 + b^2 = c^2
            :label: a squared plus b squared equals c squared

         The identity :example-tp-math-1:`…` describes a right triangle.

      .. example:: Script and display style

         .. tp-math::

            .. script::
               :type: tp/math

               \frac{1}{2\sqrt{x}}

         .. tp-math::
            :displaystyle:

            .. script::
               :type: tp/math

               \frac{1}{2\sqrt{x}}

      .. example:: AsciiMath

         .. role:: example-tp-math-1(tp-math)
            :mode: asciimath
            :value: 1/(2sqrt(x))
            :label: One divided by twice the square root of x

         An inline expression: :example-tp-math-1:`…`.

         .. tp-math::
            :mode: asciimath
            :value: 1/(2sqrt(x))
            :displaystyle:
            :label: One divided by twice the square root of x

      .. example:: External expression

         .. tp-math::
            :src: /docs/components/math/examples/identity.txt
            :displaystyle:
