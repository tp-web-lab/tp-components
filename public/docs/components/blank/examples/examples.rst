.. tp-restructuredtext-viewer::
   :label: tp-blank
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-blank-1(tp-blank)
            :name: capital
            :aria-label: Capital of France

         .. role:: example-tp-blank-2(tp-blank)
            :name: shape
            :aria-label: Three-sided shape

         .. role:: example-tp-blank-3(tp-blank)
            :name: logo
            :aria-label: Library logo

         .. tp-fill-blank-question::
            :mode: closed

            Title
               Match the answers

            Prompt
               Choose an answer for each blank.

            Answers
               1. Paris

               2. .. image:: /docs/medias/examples/36c2ceb2a29fc3ae.svg
                     :alt: Triangle
                     :width: 48
                     :height: 40

               3. .. image:: /docs/medias/logos/logo-tp.svg
                     :alt: tp-components logo
                     :width: 40
                     :height: 40

            Form
               The capital of France: :example-tp-blank-1:`capital`

               A shape with three sides: :example-tp-blank-2:`shape`

               The library logo: :example-tp-blank-3:`logo`

            Feedback
               Match each answer to its description.

            Solution
               Paris; the triangle; the tp-components logo.
