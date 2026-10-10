.. tp-restructuredtext-viewer::
   :label: tp-sudoku
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-sudoku::

            1. 39465!7!1!8!2

            2. 2!85913!4!67

            3. 6!718!4!2395

            4. 7!2!63!8!95!41!

            5. 4!38!5612!79!

            6. 159!27483!6!

            7. 8674!2!5!913!

            8. 9127!38654!

            9. 54!3!1!9!6728

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: puzzle
                  :label: puzzle
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
            :title: sudoku attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/sudoku/examples/attributes.js

      .. example:: sudoku ⭐⭐

         .. tp-sudoku::

            1. 837!45!92!1!6!
            2. 5!2!6!7!13498
            3. 9!41826537
            4. 6!7498!5!32!1!
            5. 2!8364!1759!
            6. 1!5!92!3!7684!
            7. 3921648!75!
            8. 415378!9!6!2!
            9. 7!6!8!59!21!43

      .. example:: sudoku ⭐⭐⭐

         .. tp-sudoku::

            1. 34!2!9!567!81!
            2. 765481923
            3. 8!912374!5!6
            4. 4!5!67!1329!8!
            5. 93!762!8!145
            6. 12!859!4367
            7. 6!1!487!9532!
            8. 579!367814
            9. 28!3145!679!
