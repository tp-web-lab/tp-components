.. tp-restructuredtext-viewer::
   :label: tp-text-to-speech
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-text-to-speech::
            :lang: en-GB
            :show-text:

            .. script::
               :type: tp/txt

               Welcome to tp-components. This example uses the browser speech synthesis service.

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/text-to-speech/text-to-speech.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-text-to-speech");
            element1.setAttribute("lang", "en-GB");
            element1.setAttribute("show-text", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/txt");
            element2.textContent = "\n    Welcome to tp-components. This example uses the browser speech synthesis service.\n  ";
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: English voices

         .. tp-text-to-speech::
            :id: voice-comparison
            :value: Welcome to tp-components. You can pause this reading and resume it whenever you want.
            :lang: en-US
            :show-text:

         .. script::
            :type: module
            :src: /docs/components/text-to-speech/examples/voice-comparison.js

      .. example:: French voices

         .. tp-text-to-speech::
            :id: voice-comparison
            :value: Bienvenue dans tp-components. Vous pouvez mettre cette lecture en pause, puis la reprendre à votre rythme.
            :lang: fr-FR
            :show-text:

         .. script::
            :type: module
            :src: /docs/components/text-to-speech/examples/voice-comparison.js

      .. example:: Synchronized speech

         Press Speak, then try Pause, Resume and Stop. Some voices do not report word boundaries; the full text remains visible in that case.

         .. tp-typewriting::
            :id: spoken-text
            :word:

            Welcome to **tp-components**. You can pause this reading and resume it whenever you want.

         .. tp-text-to-speech::
            :for: spoken-text
            :lang: en

      .. example:: Read an element

         .. article::
            :id: reading-article

            Welcome to **tp-components**. This article stays visible while it is read aloud.

            You can pause the reading, resume it, or stop it whenever you want.

         .. tp-text-to-speech::
            :for: reading-article
            :lang: en

      .. example:: Pauses

         .. tp-text-to-speech::
            :lang: en-GB
            :show-text:
            :pause-between-lines: 800

            .. script::
               :type: tp/txt

               Look at the illustration. [pause=1500]
               A. A woman is placing [pause=300] a box on a table.
               B. Two people are boarding a train.
               C. A man is cleaning a window.
               D. Some chairs are being stacked.

      .. example:: Dialogue

         Voice names depend on your browser and system. This dialogue uses Daniel and Kate when available; otherwise it uses the component voice. Open Speech voice settings to see the available names for this language.

         .. tp-text-to-speech::
            :lang: en-GB
            :show-text:
            :pause-between-lines: 400

            .. script::
               :type: tp/txt

               [voice=Daniel] Hello! How are you?
               [voice=Kate] Very well, thank you. [pause=600]
               [voice=Daniel] Shall we begin?
               [voice=default] End of the dialogue.

      .. example:: Named triggers

         .. tp-text-to-speech::
            :data-trigger-demo:
            :lang: en-GB
            :show-text:

            .. script::
               :type: tp/txt

               Listen to the first idea. [trigger=clic] Now the second idea. [pause=500] [trigger=clic] Finished.

         .. div::
            :data-trigger-status:
            :role: status

            No trigger yet.

         .. script::
            :type: module
            :src: /docs/components/text-to-speech/examples/triggers.js

      .. example:: Automatic pauses

         .. tp-text-to-speech::
            :lang: en-GB
            :show-text:
            :pause-after-comma: 200
            :pause-after-semicolon: 400
            :pause-after-colon: 400
            :pause-after-sentence: 600
            :pause-per-blank-line: 1000

            .. script::
               :type: tp/txt

               First, listen to this idea; then consider the next one: punctuation sets the pace. Do you hear the pauses? Good!

               A new paragraph follows one blank line.


               Two blank lines add a longer break.
