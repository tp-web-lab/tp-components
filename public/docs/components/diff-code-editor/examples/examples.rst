.. tp-restructuredtext-viewer::
   :label: tp-diff-code-editor
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-diff-code-editor::

            left
               .. script::
                  :type: tp/javascript
                  :filename: before.js

                  const message = "Hello";
                  const count = 3;
                  const prefix = "Greeting:";
                  console.log(prefix, message, count);
                  console.log("Done");

            right
               .. script::
                  :type: tp/javascript
                  :filename: after.js

                  const message = "Hello world";
                  const count = 3;
                  const prefix = "Greeting:";
                  console.log(prefix, message);
                  console.log("Done");

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/diff-code-editor/diff-code-editor.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-diff-code-editor");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("dl");
            element2.append(document.createTextNode("\n    "));

            const element3 = document.createElement("dt");
            element3.append(document.createTextNode("left"));
            element2.append(element3);
            element2.append(document.createTextNode("\n    "));

            const element4 = document.createElement("dd");

            const element5 = document.createElement("script");
            element5.setAttribute("type", "tp/javascript");
            element5.setAttribute("filename", "before.js");
            element5.textContent = "\nconst message = \"Hello\";\nconst count = 3;\nconst prefix = \"Greeting:\";\nconsole.log(prefix, message, count);\nconsole.log(\"Done\");\n    ";
            element4.append(element5);
            element2.append(element4);
            element2.append(document.createTextNode("\n    "));

            const element6 = document.createElement("dt");
            element6.append(document.createTextNode("right"));
            element2.append(element6);
            element2.append(document.createTextNode("\n    "));

            const element7 = document.createElement("dd");

            const element8 = document.createElement("script");
            element8.setAttribute("type", "tp/javascript");
            element8.setAttribute("filename", "after.js");
            element8.textContent = "\nconst message = \"Hello world\";\nconst count = 3;\nconst prefix = \"Greeting:\";\nconsole.log(prefix, message);\nconsole.log(\"Done\");\n    ";
            element7.append(element8);
            element2.append(element7);
            element2.append(document.createTextNode("\n  "));
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Read-only files

         .. tp-diff-code-editor::
            :readonly:
            :src-left: /docs/components/diff-code-editor/examples/before.js
            :src-right: /docs/components/diff-code-editor/examples/after.js

      .. example:: Wrapped Markdown

         .. tp-diff-code-editor::
            :wrap:
            :language: markdown
            :filename-left: draft.md
            :filename-right: review.md

            left
               .. script::
                  :type: tp/markdown

                  # Workshop

                  - Read the documentation.
                  - Try the examples.

            right
               .. script::
                  :type: tp/markdown

                  # Practical workshop

                  - Read the documentation carefully.
                  - Edit the examples and compare the results.
                  - Share your findings.
