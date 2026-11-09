.. tp-restructuredtext-viewer::
   :label: tp-logigram
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-logigram::
            :label: The reading club

            Prompt
               Three readers chose different books and drinks. Find every match.

            Categories
               - Readers

                 - Ada

                 - Ben

                 - Cleo

               - Books

                 - Poetry

                 - History

                 - Science

               - Drinks

                 - Tea

                 - Juice

                 - Water

            Clues
               1. Ada chose Poetry.

               2. The History reader drank Juice.

               3. Ben drank Water.

               4. Cleo did not choose Poetry.

            Solution
               1.

                  - Ada

                  - Poetry

                  - Tea

               2.

                  - Ben

                  - Science

                  - Water

               3.

                  - Cleo

                  - History

                  - Juice

      .. example:: Automatic exclusions

         .. tp-logigram::
            :label: The reading club
            :auto-exclude:

            Prompt
               Three readers chose different books and drinks. Find every match.

            Categories
               - Readers

                 - Ada

                 - Ben

                 - Cleo

               - Books

                 - Poetry

                 - History

                 - Science

               - Drinks

                 - Tea

                 - Juice

                 - Water

            Clues
               1. Ada chose Poetry.

               2. The History reader drank Juice.

               3. Ben drank Water.

               4. Cleo did not choose Poetry.

            Solution
               1.

                  - Ada

                  - Poetry

                  - Tea

               2.

                  - Ben

                  - Science

                  - Water

               3.

                  - Cleo

                  - History

                  - Juice
