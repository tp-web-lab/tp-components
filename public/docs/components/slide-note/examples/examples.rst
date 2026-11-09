.. tp-restructuredtext-viewer::
   :label: tp-slide-note
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-slide-note::
            :legend: Speaker notes
            :lang: en-GB
            :show-text:

            .. script::
               :type: tp/txt

               Introduce the idea. [trigger=clic] Explain the next step.

      .. example:: External notes

         .. tp-slide-note::
            :legend: External notes
            :src: /docs/components/slide-note/examples/notes.txt
            :lang: en-GB
            :show-text:
