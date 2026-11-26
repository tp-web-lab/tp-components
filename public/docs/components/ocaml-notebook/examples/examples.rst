.. tp-restructuredtext-viewer::
   :label: tp-ocaml-notebook
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-ocaml-notebook::

            .. script::
               :type: tp/markdown

               # OCaml functions

               Run all cells in order. The second cell uses the function defined by the first.

            .. script::
               :type: tp/ocaml
               :filename: functions.ml
               :query: square 3;;

               let square x = x * x;;

            .. script::
               :type: tp/markdown

               ## Use the function

               This cell uses the definition from the preceding cell.

            .. script::
               :type: tp/ocaml
               :filename: example.ml
               :query: square 7;;

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/ocaml/ocaml.js";
            import "/components/ocaml-notebook/ocaml-notebook.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-ocaml-notebook");
            element1.append(document.createTextNode("\n  "));

            const element2 = document.createElement("script");
            element2.setAttribute("type", "tp/markdown");
            element2.textContent = "# OCaml functions\n\nRun all cells in order. The second cell uses the function defined by the first.";
            element1.append(element2);
            element1.append(document.createTextNode("\n  "));

            const element3 = document.createElement("script");
            element3.setAttribute("type", "tp/ocaml");
            element3.setAttribute("filename", "functions.ml");
            element3.setAttribute("query", "square 3;;");
            element3.textContent = "\n    let square x = x * x;;\n  ";
            element1.append(element3);
            element1.append(document.createTextNode("\n  "));

            const element4 = document.createElement("script");
            element4.setAttribute("type", "tp/markdown");
            element4.textContent = "## Use the function\n\nThis cell uses the definition from the preceding cell.";
            element1.append(element4);
            element1.append(document.createTextNode("\n  "));

            const element5 = document.createElement("script");
            element5.setAttribute("type", "tp/ocaml");
            element5.setAttribute("filename", "example.ml");
            element5.setAttribute("query", "square 7;;");
            element5.textContent = "\n  ";
            element1.append(element5);
            element1.append(document.createTextNode("\n"));
            example.append(element1);

            document.body.append(example);

      .. example:: Shared state and HTML export

         .. tp-ocaml-notebook::

            .. script::
               :type: tp/markdown

               # A shared counter

               Run all cells, then rerun the last cell.

            .. script::
               :type: tp/ocaml
               :query: !count;;

               let count = ref 0;;

            .. script::
               :type: tp/markdown

               ## Increment

               Export HTML and repeat the same actions.

            .. script::
               :type: tp/ocaml
               :query: incr count; !count;;

      .. example:: Messages, errors and HTML export

         .. tp-ocaml-notebook::
            :label: Messages and errors

            .. script::
               :type: tp/markdown

               # Messages and errors

               Click inside the first code editor and press <kbd>Shift</kbd>+<kbd>Return</kbd>.
               The output displays the message.
               A JavaScript console.log message also appears in the same output. The second cell has not run yet.

               Then click inside the second code editor and press <kbd>Shift</kbd>+<kbd>Return</kbd>.
               The output displays the intentional error. Edit the code and rerun the current cell.

               Export this notebook as HTML, open the downloaded file and repeat both shortcuts.
               The exported cells use the same simple interpreter presentation and unified output.
               Internet access is required to load the components and their execution engines.

            .. script::
               :type: tp/ocaml
               :query: run_cell_1 ();;

               let run_cell_1 () =
                 print_endline "Message from the first cell.";
                 ignore (Js_of_ocaml.Js.Unsafe.eval_string "console.log('JavaScript message.')");;

            .. script::
               :type: tp/markdown

               ## An intentional error

               Run the following cell separately to display its error.

            .. script::
               :type: tp/ocaml
               :query: run_cell_2 ();;

               let run_cell_2 () = failwith "Intentional error from the second cell.";;

      .. example:: Program queries and automatic reload

         .. tp-ocaml-notebook::

            .. script::
               :type: tp/markdown

               # Program and query

               Press Return in the query field to obtain 10. Change 10 to 20 in the program,
               then press Return in the query field or Shift+Return in the editor.
               The program displays “> Program reloaded.” before the query, then the result 20.
               Run again without editing: there is no new reload message.
               Export HTML and try changing 20 to 30. Clear the query: execution requires a nonempty query.

            .. script::
               :type: tp/ocaml
               :filename: answer.ml
               :query: answer ();;

               let answer () = 10;;
