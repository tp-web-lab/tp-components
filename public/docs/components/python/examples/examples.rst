.. tp-restructuredtext-viewer::
   :label: tp-python
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-python::
            :query: square(7)

            .. script::
               :type: tp/python

               def square(x):
                   return x * x

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/python/python.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-python");
            element1.setAttribute("query", "square(7)");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/python");
            element2.textContent = "\n    def square(x):\n        return x * x\n  ";
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Persistent session

         .. tp-python::
            :query: next(counter)

            .. script::
               :type: tp/python

               from itertools import count

               counter = count(1)

      .. example:: Async functions and output

         .. tp-python::
            :query: await answer()

            .. script::
               :type: tp/python

               import asyncio

               async def answer():
                   print("Computing the answer")
                   await asyncio.sleep(0)
                   return 42

      .. example:: External Python file

         .. tp-python::
            :src: /docs/components/python/examples/squares.py
            :query: square(9)

      .. example:: DOM elements and click events

         .. script::
            :type: module

            import "/components/button/button.js";
            import "/components/python/python.js";

         .. tp-python::
            :query: setup_dom()

            .. script::
               :type: tp/python
               :filename: dom-demo.py

               from js import parent
               from pyodide.ffi import create_proxy

               handlers = []

               def setup_dom():
                   host = parent.document.getElementById("python-dom-demo")
                   host.replaceChildren()
                   for handler in handlers:
                       handler.destroy()
                   handlers.clear()
                   button = parent.document.createElement("tp-button")
                   button.textContent = "Click me"
                   message = parent.document.createElement("p")
                   message.textContent = "Waiting for a click."
                   clicks = 0

                   def clicked(event):
                       nonlocal clicks
                       clicks += 1
                       message.textContent = f"Python handled {clicks} click(s)."
                       print("Clicks:", clicks)

                   handler = create_proxy(clicked)
                   handlers.append(handler)
                   button.addEventListener("click", handler)
                   host.append(button, message)
                   return "Button ready"

         .. div::
            :id: python-dom-demo
            :aria-live: polite

      .. example:: Errors and recovery

         .. tp-python::
            :query: divide(12, 0)

            .. script::
               :type: tp/python
               :filename: errors.py

               def divide(numerator, denominator):
                   return numerator / denominator

      .. example:: Presentation modes and automatic reload

         Each interpreter has its own session. Default and lite show the normal controls; simple opens the editor and hides the header and welcome information. Its query buttons are hidden.

         In default and lite, open Edit source. Run the prefilled query to obtain 10. Change 10 to 20 in the source, then click Run or press Return in the query field. In simple, use Return in the query field. Shift+Return works too.

         The result becomes 20 and “> Program reloaded.” appears before the query. Run again without editing: the result remains 20, with no new reload message. Merely editing the source does not execute it.

         .. heading-level:: 3

         Default
         =======

         .. tp-python::
            :mode: default
            :query: answer()

            .. script::
               :type: tp/python
               :filename: answer.py

               def answer():
                   return 10

         .. heading-level:: 3

         Lite
         ====

         .. tp-python::
            :mode: lite
            :query: answer()

            .. script::
               :type: tp/python
               :filename: answer.py

               def answer():
                   return 10

         .. heading-level:: 3

         Simple
         ======

         .. tp-python::
            :mode: simple
            :query: answer()

            .. script::
               :type: tp/python
               :filename: answer.py

               def answer():
                   return 10

      .. example:: Execution trace drawer

         .. tp-python::
            :tracer:
            :filename: factorial.py
            :query: print(factorial(5))

            .. script::
               :type: tp/python

               def factorial(n):
                   if n <= 1:
                       return 1
                   return n * factorial(n - 1)
