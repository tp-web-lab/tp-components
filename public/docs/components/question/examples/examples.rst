.. tp-restructuredtext-viewer::
   :label: tp-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-question::

            Title
               Reflection

            Prompt
               Describe one benefit of web components.

            Form
               .. tp-textfield::
                  :multiline:
                  :rows: 3
                  :placeholder: Type your answer...

            Feedback
               Think about encapsulation and reuse.

            Solution
               They package reusable behavior behind a custom element.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - ai-api

               - score

            .. tp-radio-list::
               :data-setting: ai-help
               :label: ai-help
               :label-position: top
               :orientation: horizontal
               :value: 1

               - none

               - feedback

               - solution

               - both

            .. tp-radio-list::
               :data-setting: mode
               :label: mode
               :label-position: top
               :orientation: horizontal
               :value: 1

               - mixed

               - opened

               - closed

            .. tp-radio-list::
               :data-setting: open
               :label: open
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default (empty)

               - both

               - input

               - output

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
                  :data-setting: ai-assistant
                  :label: ai-assistant
                  :value: openai
                  :placeholder: openai
                  :clearable:

               .. tp-textfield::
                  :data-setting: ai-explanation-src
                  :label: ai-explanation-src
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: timing
                  :label: timing
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
            :title: question attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /docs/components/question/examples/attributes.js

      .. example:: Timed question

         .. tp-question::
            :timing: 00:00:10
            :open:

            Title
               A timed reflection

            Prompt
               Name one reusable web component.

            Form
               .. tp-textfield::
                  :clearable:
                  :placeholder: Your answer

            Solution
               A button, a timer or an audio recorder.

      .. example:: Optional score

         .. tp-fill-blank-question::
            :score:
            :open:

            Title
               An optional numerical score

            Answers
               1. blue

            Prompt
               Type blue, then submit.

            Form
               .. tp-textfield::
                  :clearable:
                  :label: Color

            Feedback
               Use the word requested in the prompt.

            Solution
               blue
