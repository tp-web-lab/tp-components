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

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - auto-exclude

               - disabled

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
                  :data-setting: label
                  :label: label
                  :value: Logigram
                  :placeholder: Logigram
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
            :title: logigram attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /docs/components/logigram/examples/attributes.js

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
