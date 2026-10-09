.. tp-restructuredtext-viewer::
   :label: tp-typescript-notebook
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-typescript-notebook::

            .. script::
               :type: tp/markdown

               # Interactive TypeScript

               Select **Run all cells** to execute the program. Use the code button in a cell to edit its source.

            .. script::
               :type: tp/typescript

               const language: string = 'TypeScript';
               console.log(`Hello from ${language}`);
