.. tp-restructuredtext-viewer::
   :label: tp-fill-blank
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-textfield-1(tp-textfield)
            :name: capital
            :placeholder: City name
            :aria-label: Capital of France
            :clearable:

         .. tp-fill-blank::

            The capital of France is :example-tp-textfield-1:`capital`.

      .. example:: Selected answer with tp-blank

         .. role:: example-tp-blank-1(tp-blank)
            :name: shape
            :aria-label: Shape with three sides

         .. tp-box::
            :id: selected-answer-demo

            Select a shape or drag it onto the blank. Use its clear button to remove the answer.

            .. tp-fill-blank::

               A shape with three sides is :example-tp-blank-1:`shape`.

            .. tp-button-group::
               :aria-label: Shape choices

               .. tp-button::
                  :data-answer: triangle
                  :aria-label: Triangle

                  .. image:: /docs/medias/examples/36c2ceb2a29fc3ae.svg
                     :alt: Triangle
                     :width: 48
                     :height: 40

               .. tp-button::
                  :data-answer: square
                  :aria-label: Square

                  .. image:: /docs/components/fill-blank/examples/square.svg
                     :alt: Square
                     :width: 48
                     :height: 40

            .. tp-dragdrop::
               :root: #selected-answer-demo
               :items: tp-button[data-answer], tp-blank

            The latest event is shown below. FormData is displayed as a list of name/value pairs.

            .. tp-callout::
               :variant: neutral
               :heading: tp-fill-blank-change
               :aria-live: polite
               :aria-atomic: true

               .. div::
                  :data-event-output:

                  No change event yet.

         .. script::
            :src: /docs/components/fill-blank/examples/selected-answer.js
