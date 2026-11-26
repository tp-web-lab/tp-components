/** Compare interpreter presentations with the same editable program. */
const programs = {
  javascript: ['js', 'function answer() {\n  return 10;\n}', 'answer()'],
  typescript: ['ts', 'function answer(): number {\n  return 10;\n}', 'answer()'],
  python: ['py', 'def answer():\n    return 10', 'answer()'],
  scheme: ['scm', '(define (answer) 10)', '(answer)'],
  ocaml: ['ml', 'let answer () = 10;;', 'answer ();;'],
  prolog: ['pl', 'answer(10).\nanswer(20).\nanswer(30).', 'answer(X).'],
};
export const interpreterModeScenarios = Object.fromEntries(
  Object.entries(programs).map(([language, [extension, code, query]]) => [language, {
    label: 'Presentation modes and automatic reload',
    description: language === 'prolog' ? 'In each mode, run answer(X). to obtain X = 10, select Next solution for X = 20, then All solutions for X = 30. All solutions can also run the query directly. Change answer(10). to answer(100). and Run again to verify automatic reloading. The solution buttons remain visible in simple mode.' : 'Compare default, lite and simple using the same program. Run the query to obtain 10, edit the source to return 20, then use Run or Return in the query field. Only a changed program displays “> Program reloaded.”; run again without editing to keep the session.',
    source: `<p>Each interpreter has its own session. Default and lite show the normal controls; simple opens the editor and hides the header and welcome information. ${language === "prolog" ? "Prolog keeps its query buttons and Libraries dropdown, including Next solution, All solutions and Accept." : "Its query buttons are hidden."}</p>
${language === "prolog" ? `<p>In each mode, click Run to obtain X = 10, then Next solution to obtain X = 20, and All solutions to display the remaining answer, X = 30. Click All solutions again after the query has finished to display all three answers at once; Run is not required first. These buttons remain available in simple mode.</p>
<p>In default and lite, open Edit source; simple already shows it. Change answer(10). to answer(100)., then click Run or press Return in the query field. The first answer becomes X = 100 and “> Program reloaded.” appears. Run again without editing: no new reload message appears. Shift+Return works too.</p>` : `<p>In default and lite, open Edit source. Run the prefilled query to obtain 10. Change 10 to 20 in the source, then click Run or press Return in the query field. In simple, use Return in the query field. Shift+Return works too.</p>
<p>The result becomes 20 and “> Program reloaded.” appears before the query. Run again without editing: the result remains 20, with no new reload message. Merely editing the source does not execute it.</p>`}
${['default', 'lite', 'simple'].map(mode => `<h3>${mode[0].toUpperCase() + mode.slice(1)}</h3>
<tp-${language} mode="${mode}" query="${query}">
  <script type="tp/${language}" filename="answer.${extension}">
    ${code.replaceAll('\n', '\n    ')}
  </script>
</tp-${language}>`).join('\n')}`,
  }]),
);
