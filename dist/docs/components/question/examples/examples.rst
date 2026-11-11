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

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/question/question.js";
            import "/components/textfield/textfield.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-question");
            element1.append(document.createTextNode("\n    "));

            const element2 = document.createElement("dl");
            element2.append(document.createTextNode("\n      "));

            const element3 = document.createElement("dt");
            element3.append(document.createTextNode("Title"));
            element2.append(element3);

            const element4 = document.createElement("dd");
            element4.append(document.createTextNode("Reflection"));
            element2.append(element4);
            element2.append(document.createTextNode("\n      "));

            const element5 = document.createElement("dt");
            element5.append(document.createTextNode("Prompt"));
            element2.append(element5);

            const element6 = document.createElement("dd");
            element6.append(document.createTextNode("Describe one benefit of web components."));
            element2.append(element6);
            element2.append(document.createTextNode("\n    "));

            const element7 = document.createElement("dt");
            element7.append(document.createTextNode("Form"));
            element2.append(element7);

            const element8 = document.createElement("dd");

            const element9 = document.createElement("tp-textfield");
            element9.setAttribute("multiline", "");
            element9.setAttribute("rows", "3");
            element9.setAttribute("placeholder", "Type your answer...");
            element8.append(element9);
            element2.append(element8);
            element2.append(document.createTextNode("\n      "));

            const element10 = document.createElement("dt");
            element10.append(document.createTextNode("Feedback"));
            element2.append(element10);

            const element11 = document.createElement("dd");
            element11.append(document.createTextNode("Think about encapsulation and reuse."));
            element2.append(element11);
            element2.append(document.createTextNode("\n      "));

            const element12 = document.createElement("dt");
            element12.append(document.createTextNode("Solution"));
            element2.append(element12);

            const element13 = document.createElement("dd");
            element13.append(document.createTextNode("They package reusable behavior behind a custom element."));
            element2.append(element13);
            element2.append(document.createTextNode("\n    "));
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));
            example.append(element1);

            document.body.append(example);

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
