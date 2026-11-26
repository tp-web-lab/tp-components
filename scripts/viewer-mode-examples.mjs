/** Comparable presentations of the same source, shared by all viewer docs. */
const markupSources = {
  html: '<h2>Viewer modes</h2>\n<p>Change this message, then run the source.</p>',
  markdown: '## Viewer modes\n\nChange this **message**, then run the source.',
  asciidoc: '== Viewer modes\n\nChange this *message*, then run the source.',
  latex: String.raw`\section{Viewer modes}
Change this \textbf{message}, then run the source.`,
  restructuredtext: 'Viewer modes\n============\n\nChange this **message**, then run the source.',
};
const programmingSources = {
  "javascript": [
    {
      "filename": "main.js",
      "content": "document.body.innerHTML = \"<p>The program ran.</p>\";\nconsole.log(\"Console message before the intentional error.\");\nthrow new Error(\"Intentional error: the simple-mode console opens automatically.\");"
    }
  ],
  "typescript": [
    {
      "filename": "main.ts",
      "content": "const message: string = \"The program ran.\";\ndocument.body.innerHTML = `<p>${message}</p>`;\nconsole.log(\"Console message before the intentional error.\");\nthrow new Error(\"Intentional error: the simple-mode console opens automatically.\");"
    }
  ],
  "python": [
    {
      "filename": "main.py",
      "content": "from js import document\ndocument.body.innerHTML = \"<p>The program ran.</p>\"\nprint(\"Console message before the intentional error.\")\nraise RuntimeError(\"Intentional error: the simple-mode console opens automatically.\")"
    }
  ],
  "scheme": [
    {
      "filename": "main.scm",
      "content": "(display \"Console message before the intentional error.\")\n(newline)\n(error \"Intentional error: the simple-mode console opens automatically.\")"
    }
  ],
  "ocaml": [
    {
      "filename": "main.ml",
      "content": "print_endline \"Console message before the intentional error.\";;\nfailwith \"Intentional error: the simple-mode console opens automatically.\";;"
    }
  ],
  "prolog": [
    {
      "filename": "program.pl",
      "content": "% The query file demonstrates console output and an intentional error."
    },
    {
      "filename": "query.pl",
      "content": "writeln('Console message before the intentional error.').\nthrow(error(intentional_viewer_error, context(mode_comparison, 'Intentional error: the simple-mode console opens automatically.')))."
    }
  ],
  "sql": [
    {
      "filename": "tables.sql",
      "content": "-- No setup is needed for this calculation."
    },
    {
      "filename": "query.sql",
      "content": "SELECT 6 * 7 AS answer;\n\n-- Intentional error: comment out the next line to display the calculation.\nSELECT * FROM intentional_viewer_error;"
    }
  ]
};
const programmingLanguages = ['javascript', 'typescript', 'python', 'sql', 'prolog', 'scheme', 'ocaml'];

export const viewerModeScenarios = Object.fromEntries(
  [...Object.keys(markupSources), ...programmingLanguages].map((language) => {
    const component = `${language}-viewer`;
    const inlineOutput = ['scheme', 'ocaml', 'prolog'].includes(language);
    if (inlineOutput) for (const file of programmingSources[language]) file.content = file.content.replaceAll('the simple-mode console opens automatically', 'the error appears in the output').replaceAll('Console message', 'Printed message');
    const source = Object.entries({
      default: 'Standard controls', lite: 'Compact controls', simple: 'Editor and rendered output only',
    }).map(([mode, heading]) => {
      const viewer = language in markupSources
        ? `<tp-${component} mode="${mode}">\n  <script type="tp/${language}">\n${markupSources[language]}\n  </script>\n</tp-${component}>`
        : `<tp-${component} mode="${mode}">\n${programmingSources[language].map(file => `  <script type="tp/${language}" filename="${file.filename}">\n${file.content}\n  </script>`).join("\n")}\n</tp-${component}>`;
      const instruction = mode === 'simple'
        ? '<p>Edit the code below, keep the cursor in the editor and press <kbd>Shift</kbd>+<kbd>Enter</kbd> (Return) to run it. This viewer has no Run button.</p>'
        : '<p>Open Code to edit the source, then click Run or press <kbd>Shift</kbd>+<kbd>Enter</kbd> in the editor.</p>';
      const consoleHint = inlineOutput ? '<p>Run to show the printed message and intentional error in the output. This viewer has no separate console; JavaScript console messages also appear in the output.</p>' : programmingLanguages.includes(language)
        ? (language === 'sql'
          ? '<p>Run the query to trigger an intentional missing-table error and open the console. Comment out the final SELECT and run again to display the successful query.</p>'
          : '<p>Run to print a console message followed by an intentional error. In simple mode the console opens automatically. Comment out the message statements and run again to check that the error alone opens it; remove the error statement to try a successful run.</p>')
        : '';
      return `<section>\n<h3>mode="${mode}" — ${heading}</h3>\n${instruction}\n${consoleHint}\n${viewer}\n</section>`;
    }).join('\n\n');
    return [component, {
      label: 'Compare presentation modes',
      description: inlineOutput ? 'Compare the three modes and use <kbd>Shift</kbd>+<kbd>Return</kbd> to display messages and errors directly in the output, without a separate console.' : (programmingLanguages.includes(language) ? (language === 'sql' ? 'Trigger an intentional SQL error to open the console, then remove the invalid query. ' : 'Run the message and intentional error to open the console automatically. ') : '') + 'Compare default, lite and simple presentations of the same source. In simple mode, edit the code and press <kbd>Shift</kbd>+<kbd>Enter</kbd> (Return) from the editor to update only that viewer.',
      source: source + (programmingLanguages.includes(language) ? '\n<p>Programming viewers already have compact controls, so default and lite look alike. The first run may load the language engine.</p>' : ''),
    }];
  }),
);
