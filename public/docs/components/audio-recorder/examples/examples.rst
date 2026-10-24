.. tp-restructuredtext-viewer::
   :label: tp-audio-recorder
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-audio-recorder::

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         Enter ``#spoken-answer`` in transcript, then use Record and Stop in the preview. Final recognized speech fills the editable Transcript field. Browser support and microphone permission are required; recognition may use an online service.

         .. tp-stack::

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: transcript
                  :label: transcript
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
            :title: audio-recorder attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/audio-recorder/examples/attributes.js

      .. example:: Spoken answer

         .. tp-fill-blank-question::
            :open:

            Title
               A spoken answer

            Answers
               1. blue

            Prompt
               Say the word “blue”. Stop recording, review the transcript and submit. Recognition may use an online service; you can also type the answer.

            Form
               .. tp-audio-recorder::
                  :transcript: #spoken-answer
                  :lang: en-US

               .. tp-textfield::
                  :id: spoken-answer
                  :name: color
                  :clearable:
                  :regexp: blue[.!?]?
                  :label: Your answer

            Solution
               blue
