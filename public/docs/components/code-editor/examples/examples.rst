.. tp-restructuredtext-viewer::
   :label: tp-code-editor
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-code-editor::
            :language: javascript
            :line-numbers:

            .. script::
               :type: tp/javascript

               const greeting = "Hello, tp-components!";
               console.log(greeting);

      .. example:: Using an internal script

         .. tp-code-editor::
            :line-numbers:

            .. script::
               :type: tp/typescript

               function f(x: number): string {
                 if (x < 0) { x = x + 1 }
                 else { x = x - 1 }
                 return `${2*x}`;
               }

         .. script::
            :type: module

            import '/components/code-editor/code-editor.js';

      .. example:: Read-only code

         .. tp-code-editor::
            :language: javascript
            :readonly:
            :line-numbers:

            .. script::
               :type: tp/javascript

               const answer = 42;
