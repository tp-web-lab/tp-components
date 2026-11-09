.. tp-restructuredtext-viewer::
   :label: tp-html-viewer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-html-viewer::

            .. script::
               :type: tp/html

               <h2>Hello, HTML!</h2>
               <p>This preview renders <strong>HTML content</strong>.</p>

      .. example:: Multiple examples

         .. tp-html-viewer::

            .. script::
               :type: tp/html

               <div role="example" label="Paragraph">
                 <p>A paragraph with <strong>strong text</strong>.</p>
               </div>
               <div role="example" label="Button">
                 <button type="button">Continue</button>
               </div>
