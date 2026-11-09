.. tp-restructuredtext-viewer::
   :label: tp-save-audio
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         Listen to the sound of breaking glass, then save the MP3 file.

         .. audio::
            :id: save-audio-example
            :controls:
            :preload: metadata
            :aria-label: Sound of breaking glass

            .. source::
               :src: /docs/medias/audios/glass-break.mp3
               :type: audio/mpeg

         .. tp-save-audio::
            :anchor: #save-audio-example
            :filename: glass-break
