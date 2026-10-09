.. tp-restructuredtext-viewer::
   :label: tp-matching
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-matching::

            - Hello

            - Thank you

            - Goodbye

            1. Bonjour

            2. Merci

            3. Au revoir

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - disabled

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
            :title: matching attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/matching/examples/attributes.js

      .. example:: Rich content

         .. role:: example-tp-icon-1(tp-icon)
            :name: lt
            :library: flags
            :size: 3em
            :role: img
            :aria-label: Flag to identify

         .. tp-matching::

            - :example-tp-icon-1:`lt`

            - Listen to the sound.

              .. audio::
                 :controls:
                 :src: /docs/medias/audios/glass-break.mp3
                 :aria-label: Sound to identify

            - Watch the scene.

              .. video::
                 :controls:
                 :width: 240
                 :src: /docs/medias/videos/chute-eau.mp4
                 :aria-label: Scene to identify

            1. Lithuania

            2. Breaking glass

            3. A waterfall

      .. example:: Irregular verbs

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

      .. example:: Header list

         .. tp-matching::
            :heading:

            - English

            - French

            - Hello

            - Thank you

            - Goodbye

            1. Bonjour

            2. Merci

            3. Au revoir
