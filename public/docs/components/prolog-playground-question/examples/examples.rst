.. tp-restructuredtext-viewer::
   :label: tp-prolog-playground-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-prolog-playground-question::
            :open:
            :src: /docs/components/playground-question/examples/prolog/double.pl
            :test: /docs/components/playground-question/examples/prolog/double.test.pl

            Title
               Double a number

            Prompt
               Complete double so it returns twice its argument. Edit the source, then submit to run the tests.

            Solution
               Use Result is Value * 2.
