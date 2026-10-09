.. tp-restructuredtext-viewer::
   :label: tp-matching-question
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-matching-question::

            Title
               English and French

            Prompt
               Match each English expression with its French translation.

            Form
               - Hello

               - Thank you

               - Goodbye

               1. Bonjour

               2. Merci

               3. Au revoir

            Feedback
               Distinguish greetings, thanks and farewells.

            Solution
               Hello — Bonjour; Thank you — Merci; Goodbye — Au revoir.

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - heading

            .. tp-cluster::

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
            :title: matching-question attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /tp-components/docs/components/matching-question/examples/attributes.js

      .. example:: Rich content

         .. role:: example-tp-icon-1(tp-icon)
            :name: lt
            :library: flags
            :size: 3em
            :role: img
            :aria-label: Flag to identify

         .. tp-matching-question::

            Title
               Identify the media

            Prompt
               Associate each flag, sound or scene with its description.

            Form
               - :example-tp-icon-1:`lt`

               - Listen to the sound.

                 .. audio::
                    :controls:
                    :src: /tp-components/docs/medias/audios/glass-break.mp3
                    :aria-label: Sound to identify

               - Watch the scene.

                 .. video::
                    :controls:
                    :width: 240
                    :src: /tp-components/docs/medias/videos/chute-eau.mp4
                    :aria-label: Scene to identify

               1. Lithuania

               2. Breaking glass

               3. A waterfall

            Feedback
               Observe the flag colors and distinguish the sound from the scene.

            Solution
               The flag represents Lithuania; the sound is breaking glass; the video shows a waterfall.

      .. example:: External definition

         .. tp-matching-question::
            :src: /tp-components/docs/components/matching-question/examples/translations.json

      .. example:: Irregular verbs

         .. tp-matching-question::

            Title
               Irregular verbs

            Prompt
               Associate each verb with its past simple, past participle and French translation.

            Form
               .. tp-matching::

                  Base form
                     - be

                     - have

                     - do

                  Past simple
                     1. was

                     2. had

                     3. did

                  Past participle
                     - been

                     - had

                     - done

                  French
                     1. être

                     2. avoir

                     3. faire

            Feedback
               Check all four members of each group before submitting again.

            Solution
               - be — was — been — être

               - have — had — had — avoir

               - do — did — done — faire

      .. example:: Header list

         .. tp-matching-question::
            :heading:

            Prompt
               Match each expression with its translation.

            Form
               - English

               - French

               - Hello

               - Thank you

               - Goodbye

               1. Bonjour

               2. Merci

               3. Au revoir

            Solution
               Hello — Bonjour; Thank you — Merci; Goodbye — Au revoir.
