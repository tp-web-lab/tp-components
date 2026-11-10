.. tp-restructuredtext-viewer::
   :label: tp-audio-recorder
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-audio-recorder::

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/audio-recorder/audio-recorder.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-audio-recorder");
            example.append(element1);

            document.body.append(example);

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
