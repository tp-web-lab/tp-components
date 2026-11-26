/** Two independent cells demonstrate the shortcut and automatic console opening. */
const sources = {
  javascript: ['console.log("Message from the first cell.");', 'throw new Error("Intentional error from the second cell.");'],
  typescript: ['const message: string = "Message from the first cell.";\nconsole.log(message);', 'throw new Error("Intentional error from the second cell.");'],
  python: ['print("Message from the first cell.")', 'raise RuntimeError("Intentional error from the second cell.")'],
  prolog: ["writeln('Message from the first cell.').", "throw(error(intentional_notebook_error, context(console_example, 'Intentional error from the second cell.')))."],
  scheme: ['(display "Message from the first cell.")\n(newline)', '(error "Intentional error from the second cell.")'],
  ocaml: ['print_endline "Message from the first cell.";;', 'failwith "Intentional error from the second cell.";;'],
  sql: ["SELECT 'Message from the first cell.' AS message;", 'SELECT * FROM intentional_notebook_error;'],
};
export const notebookConsoleScenarios = Object.fromEntries(
  ['notebook', ...Object.keys(sources).map(language => `${language}-notebook`)].map(component => {
    const language = component === 'notebook' ? 'javascript' : component.replace('-notebook', '');
    const sql = language === 'sql';
    const inlineOutput = ['scheme', 'ocaml', 'prolog'].includes(language);
    const filename = language === 'prolog' ? ' filename="query.pl"' : sql ? ' filename="query.sql"' : '';
    let source = `<tp-${component} label="Messages and errors">
  <script type="tp/markdown">
    # Messages and errors

    Click inside the first code editor and press <kbd>Shift</kbd>+<kbd>Return</kbd>.
    ${sql ? 'SQL displays the message in its result table; it has no console.log function.' : 'Its console opens automatically to show the message.'}
    The second cell has not run yet.

    Then click inside the second code editor and press <kbd>Shift</kbd>+<kbd>Return</kbd>.
    Its console opens automatically to show the intentional error. Edit the code and rerun the current cell.

    Export this notebook as HTML, open the downloaded file and repeat both shortcuts.
    The exported cells use the same simple presentation and automatic console behavior.
    Internet access is required to load the components and their execution engines.
  </script>
  <script type="tp/${language}"${filename}>
    ${sources[language][0].replaceAll('\n', '\n    ')}
  </script>
  <script type="tp/markdown">
    ## An intentional error

    Run the following cell separately to open its error console.
  </script>
  <script type="tp/${language}"${filename}>
    ${sources[language][1]}
  </script>
</tp-${component}>`;
    if (inlineOutput) source = source.replaceAll('Its console opens automatically to show', 'The output displays').replaceAll('automatic console behavior', 'unified output').replaceAll('open its error console', 'display its error');
    if (language === 'scheme') source = source.replace('(newline)', '(newline)\n    (console.log "JavaScript message.")');
    if (language === 'ocaml') source = source.replace('print_endline "Message from the first cell.";;', 'print_endline "Message from the first cell.";;\n    let () = ignore (Js_of_ocaml.Js.Unsafe.eval_string "console.log(\'JavaScript message.\')");;');
    if (language === 'prolog') source = source.replace("writeln('Message from the first cell.').", "writeln('Message from the first cell.'), _ := console.log(\"JavaScript message.\").");
    if (inlineOutput) source = source.replace('The second cell has not run yet.', 'A JavaScript console.log message also appears in the same output. The second cell has not run yet.');
    if (!sql && language !== 'prolog') {
      let cell = 0;
      source = source.replace(new RegExp(`<script type="tp/${language}"([^>]*)>([\\s\\S]*?)</script>`, 'g'), (_match, attributes, content) => {
        const name = language === 'scheme' ? `run-cell-${cell + 1}` : `run_cell_${cell + 1}`;
        const code = content.trim().replace(/^    /gm, '');
        let program, query;
        if (language === 'python') { program = `def ${name}():\n${code.split('\n').map(line => '    ' + line).join('\n')}`; query = `${name}()`; }
        else if (language === 'scheme') { program = `(define (${name})\n  ${code.replaceAll('\n', '\n  ')})`; query = `(${name})`; }
        else if (language === 'ocaml') { program = cell === 0 ? `let ${name} () =\n  print_endline "Message from the first cell.";\n  ignore (Js_of_ocaml.Js.Unsafe.eval_string "console.log('JavaScript message.')");;` : `let ${name} () = failwith "Intentional error from the second cell.";;`; query = `${name} ();;`; }
        else { program = `function ${name}() {\n  ${code.replaceAll('\n', '\n  ')}\n}`; query = `${name}()`; }
        cell++;
        return `<script type="tp/${language}"${attributes} query="${query}">\n    ${program.replaceAll('\n','\n    ')}\n  </script>`;
      });
    }
    if (!sql) source = source.replaceAll('Its console opens automatically to show', 'The output displays').replaceAll('Its console opens automatically to show', 'The output displays').replaceAll('open its error console', 'display its error').replaceAll('automatic console behavior', 'mandatory queries and unified output').replaceAll('simple presentation', 'simple interpreter presentation');
    return [component, {
      label: 'Messages, errors and HTML export', source,
      description: !sql ? 'Run each cell with <kbd>Shift</kbd>+<kbd>Return</kbd> to see its message or error directly in the output. Export HTML and repeat the same actions; these interpreters have a required prefilled query and no separate console.' : `Run each cell separately with <kbd>Shift</kbd>+<kbd>Return</kbd> to observe ${sql ? 'a SQL result message and automatic console opening on an error' : 'automatic console opening for a message and an intentional error'}. Export HTML and repeat the same actions in the downloaded notebook.`,
    }];
  }),
);
