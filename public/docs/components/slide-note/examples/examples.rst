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

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/slide-note/slide-note.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-slide-note");
            element1.setAttribute("legend", "Speaker notes");
            element1.setAttribute("lang", "en-GB");
            element1.setAttribute("show-text", "");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/txt");
            element2.textContent = "Introduce the idea. [trigger=clic] Explain the next step.";
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: External notes

         .. tp-slide-note::
            :legend: External notes
            :src: /docs/components/slide-note/examples/notes.txt
            :lang: en-GB
            :show-text:
