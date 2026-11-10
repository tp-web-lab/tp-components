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

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/matching/matching.js";
            import "/components/matching-question/matching-question.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-matching-question");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("dl");
            element2.append(document.createTextNode("\n    "));

            const element3 = document.createElement("dt");
            element3.append(document.createTextNode("Title"));
            element2.append(element3);

            const element4 = document.createElement("dd");
            element4.append(document.createTextNode("English and French"));
            element2.append(element4);
            element2.append(document.createTextNode("\n    "));

            const element5 = document.createElement("dt");
            element5.append(document.createTextNode("Prompt"));
            element2.append(element5);

            const element6 = document.createElement("dd");
            element6.append(document.createTextNode("Match each English expression with its French translation."));
            element2.append(element6);
            element2.append(document.createTextNode("\n    "));

            const element7 = document.createElement("dt");
            element7.append(document.createTextNode("Form"));
            element2.append(element7);

            const element8 = document.createElement("dd");
            element8.append(document.createTextNode("\n      "));

            const element9 = document.createElement("ul");

            const element10 = document.createElement("li");
            element10.append(document.createTextNode("Hello"));
            element9.append(element10);

            const element11 = document.createElement("li");
            element11.append(document.createTextNode("Thank you"));
            element9.append(element11);

            const element12 = document.createElement("li");
            element12.append(document.createTextNode("Goodbye"));
            element9.append(element12);
            element8.append(element9);
            element8.append(document.createTextNode("\n      "));

            const element13 = document.createElement("ol");

            const element14 = document.createElement("li");
            element14.append(document.createTextNode("Bonjour"));
            element13.append(element14);

            const element15 = document.createElement("li");
            element15.append(document.createTextNode("Merci"));
            element13.append(element15);

            const element16 = document.createElement("li");
            element16.append(document.createTextNode("Au revoir"));
            element13.append(element16);
            element8.append(element13);
            element8.append(document.createTextNode("\n    "));
            element2.append(element8);
            element2.append(document.createTextNode("\n    "));

            const element17 = document.createElement("dt");
            element17.append(document.createTextNode("Feedback"));
            element2.append(element17);

            const element18 = document.createElement("dd");
            element18.append(document.createTextNode("Distinguish greetings, thanks and farewells."));
            element2.append(element18);
            element2.append(document.createTextNode("\n    "));

            const element19 = document.createElement("dt");
            element19.append(document.createTextNode("Solution"));
            element2.append(element19);

            const element20 = document.createElement("dd");
            element20.append(document.createTextNode("Hello — Bonjour; Thank you — Merci; Goodbye — Au revoir."));
            element2.append(element20);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

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

            Feedback
               Observe the flag colors and distinguish the sound from the scene.

            Solution
               The flag represents Lithuania; the sound is breaking glass; the video shows a waterfall.

      .. example:: External definition

         .. tp-matching-question::
            :src: /docs/components/matching-question/examples/translations.json

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
