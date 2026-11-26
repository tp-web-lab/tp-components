.. tp-restructuredtext-viewer::
   :label: tp-scheme
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-scheme::
            :query: (square 7)

            .. script::
               :type: tp/scheme

               (define (square x)
                 (* x x))

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/scheme/scheme.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-scheme");
            element1.setAttribute("query", "(square 7)");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/scheme");
            element2.textContent = "\n    (define (square x)\n      (* x x))\n  ";
            element1.append(element2);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: DOM elements and click events

         .. script::
            :type: module

            import "/components/button/button.js";
            import "/components/scheme/scheme.js";

         .. tp-scheme::
            :query: (setup-dom)

            .. script::
               :type: tp/scheme

               (define (setup-dom)
                 (let ((host (document.getElementById "scheme-dom-demo"))
                       (button (document.createElement "tp-button"))
                       (message (document.createElement "p")))
                   (set! button.textContent "Click me")
                   (set! message.textContent "Waiting for a click.")
                   (button.addEventListener "click"
                     (lambda (event)
                       (set! message.textContent "Scheme handled the click!")
                       (display "Clicked from Scheme")
                       (newline)))
                   (host.replaceChildren button message)
                   "Button ready"))

         .. div::
            :id: scheme-dom-demo
            :aria-live: polite

      .. example:: Errors and recovery

         .. tp-scheme::
            :query: (error "Expected error")

            .. script::
               :type: tp/scheme

               (define (square x) (* x x))

      .. example:: Exact numbers and lists

         .. tp-scheme::
            :query: (map (lambda (x) (* x x)) (list 1/2 2/3 3/4))

      .. example:: Presentation modes and automatic reload

         Each interpreter has its own session. Default and lite show the normal controls; simple opens the editor and hides the header and welcome information. Its query buttons are hidden.

         In default and lite, open Edit source. Run the prefilled query to obtain 10. Change 10 to 20 in the source, then click Run or press Return in the query field. In simple, use Return in the query field. Shift+Return works too.

         The result becomes 20 and “> Program reloaded.” appears before the query. Run again without editing: the result remains 20, with no new reload message. Merely editing the source does not execute it.

         .. heading-level:: 3

         Default
         =======

         .. tp-scheme::
            :mode: default
            :query: (answer)

            .. script::
               :type: tp/scheme
               :filename: answer.scm

               (define (answer) 10)

         .. heading-level:: 3

         Lite
         ====

         .. tp-scheme::
            :mode: lite
            :query: (answer)

            .. script::
               :type: tp/scheme
               :filename: answer.scm

               (define (answer) 10)

         .. heading-level:: 3

         Simple
         ======

         .. tp-scheme::
            :mode: simple
            :query: (answer)

            .. script::
               :type: tp/scheme
               :filename: answer.scm

               (define (answer) 10)

      .. example:: Execution trace drawer

         .. tp-scheme::
            :tracer:
            :filename: factorial.scm
            :query: (factorial 5)

            .. script::
               :type: tp/scheme

               (define (factorial n)
                 (if (<= n 1)
                     1
                     (* n (factorial (- n 1)))))
