const programs = {
 javascript: ['js', 'function answer() { return 10; }', 'answer()'],
 typescript: ['ts', 'function answer(): number { return 10; }', 'answer()'],
 python: ['py', 'def answer():\n    return 10', 'answer()'],
 scheme: ['scm', '(define (answer) 10)', '(answer)'],
 ocaml: ['ml', 'let answer () = 10;;', 'answer ();;'],
 prolog: ['pl', 'answer(10).', 'answer(X).'],
};
export const notebookInterpreterScenarios = Object.fromEntries(['notebook', ...Object.keys(programs).map(lang => `${lang}-notebook`)].map(component => {
 const lang = component === 'notebook' ? 'javascript' : component.replace('-notebook','');
 const [ext, source, query] = programs[lang];
 return [component, {
  label: 'Program queries and automatic reload',
  description: 'Run the prefilled query to obtain 10. Change 10 to 20 in the program and press Return in the query field or Shift+Return in the editor. A successful reload displays “> Program reloaded.” before the query. Export HTML and repeat the change: the source and query remain editable. Clear the query to verify that no program is executed without one.',
  source: `<tp-${component}>
  <script type="tp/markdown">
    # Program and query

    Press Return in the query field to obtain 10. Change 10 to 20 in the program,
    then press Return in the query field or Shift+Return in the editor.
    The program displays “> Program reloaded.” before the query, then the result 20.
    Run again without editing: there is no new reload message.
    Export HTML and try changing 20 to 30. Clear the query: execution requires a nonempty query.
  </script>
  <script type="tp/${lang}" filename="answer.${ext}" query="${query}">
    ${source.replaceAll('\n','\n    ')}
  </script>
</tp-${component}>`,
 }];
}));
