/** Runnable Prolog library documentation scenarios, also used by the browser check. */
export const prologLibraryExamples = [
  {
    "library": "aggregate",
    "label": "Library aggregate: Aggregate values",
    "program": "salary(ada, 40).\nsalary(byron, 60).",
    "query": "aggregate_all(sum(Amount), salary(_, Amount), Total).",
    "expected": "Total = 100",
    "detail": "Totals the two salaries."
  },
  {
    "library": "apply",
    "label": "Library apply: Map a predicate",
    "program": "double(X, Y) :- Y is 2 * X.",
    "query": "maplist(double, [1, 2, 3], Doubles).",
    "expected": "Doubles = [2,4,6]",
    "detail": "Applies double/2 to every list item."
  },
  {
    "library": "assoc",
    "label": "Library assoc: Key-value associations",
    "program": "lookup_score(Score) :-\n    empty_assoc(A0),\n    put_assoc(ada, A0, 42, A1),\n    get_assoc(ada, A1, Score).",
    "query": "lookup_score(Score).",
    "expected": "Score = 42",
    "detail": "Builds an association tree and retrieves a value by key."
  },
  {
    "library": "clpfd",
    "label": "Library clpfd: Finite-domain constraints",
    "program": "",
    "query": "[A, B] ins 1..3, A #< B, all_distinct([A, B]), labeling([], [A, B]).",
    "expected": "A = 1, B = 2",
    "detail": "Use Next solution to obtain A = 1, B = 3, then A = 2, B = 3."
  },
  {
    "library": "clpq",
    "label": "Library clpq: Exact rational constraints",
    "program": "",
    "query": "{X = 1/3 + 1/6}.",
    "expected": "X = 1r2",
    "detail": "Solves an exact rational equation; 1r2 means one half. Use this independent interpreter rather than loading clpr in the same session."
  },
  {
    "library": "clpr",
    "label": "Library clpr: Real-number constraints",
    "program": "",
    "query": "{2 * X = 3}.",
    "expected": "X = 1.5",
    "detail": "Solves a real-number equation. Use this independent interpreter rather than loading clpq in the same session."
  },
  {
    "library": "dcg/basics",
    "label": "Library dcg/basics: Parse an integer",
    "program": "parse_number(Text, Number) :-\n    string_codes(Text, Codes),\n    phrase(integer(Number), Codes).",
    "query": "parse_number(\"42\", Number).",
    "expected": "Number = 42",
    "detail": "Parses text with the integer//1 grammar rule."
  },
  {
    "library": "dif",
    "label": "Library dif: Disequality constraints",
    "program": "",
    "query": "dif(X, red), member(X, [red, green, blue]).",
    "expected": "X = green",
    "detail": "Excludes red before X is known. Next solution produces X = blue."
  },
  {
    "library": "lists",
    "label": "Library lists: Reverse a list",
    "program": "route([paris, lyon, nice]).",
    "query": "route(Cities), reverse(Cities, Return).",
    "expected": "Cities = [paris,lyon,nice], Return = [nice,lyon,paris]",
    "detail": "Reverses the route using reverse/2."
  },
  {
    "library": "ordsets",
    "label": "Library ordsets: Union of ordered sets",
    "program": "",
    "query": "ord_union([blue, red], [green, red], Colors).",
    "expected": "Colors = [blue,green,red]",
    "detail": "Combines sorted sets without duplicating red."
  },
  {
    "library": "pairs",
    "label": "Library pairs: Group values by key",
    "program": "",
    "query": "group_pairs_by_key([fruit-apple, fruit-pear, vegetable-carrot], Groups).",
    "expected": "Groups = [fruit-[apple,pear],vegetable-[carrot]]",
    "detail": "Groups consecutive pairs with the same key."
  },
  {
    "library": "plunit",
    "label": "Library plunit: Unit tests",
    "program": ":- use_module(library(plunit)).\n\ndouble(X, Y) :- Y is 2 * X.\n\n:- begin_tests(arithmetic).\n\ntest(double_two) :-\n    double(2, 4).\n\ntest(wrong_result, [fail]) :-\n    double(2, 5).\n\n:- end_tests(arithmetic).",
    "query": "run_tests(arithmetic).",
    "expected": "true.",
    "detail": "Both tests pass. Change the expected 4 to 5 in the source, click Run to see a failing test."
  },
  {
    "library": "random",
    "label": "Library random: Roll a die",
    "program": "",
    "query": "random_between(1, 6, Die).",
    "expected": "Die = an integer from 1 to 6",
    "detail": "Run the query several times; results may repeat."
  },
  {
    "library": "wasm",
    "label": "Library wasm: Call JavaScript",
    "program": "",
    "query": "Maximum := 'Math'.max(3, 7).",
    "expected": "Maximum = 7",
    "detail": "Calls JavaScript Math.max through the := operator. The runtime already loads wasm; its check appears after initialization."
  },
  {
    "library": "when",
    "label": "Library when: Delay a goal",
    "program": "",
    "query": "when(nonvar(X), Y is X * 2), X = 21.",
    "expected": "X = 21, Y = 42",
    "detail": "Delays the multiplication until X has a value."
  }
].map(example => ({
  ...example,
  loading: ["clpfd", "clpq", "clpr", "dcg/basics"].includes(example.library)
    ? "menu" : example.library === "plunit" ? "source" : example.library === "wasm" ? "runtime" : "automatic",
}));

const escapeAttribute = value => escape(value).replaceAll('"', "&quot;");
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
export const prologLibraryScenarios = prologLibraryExamples.map(example => {
  const instruction = example.loading === "menu"
    ? `This example requires ${example.library}: select it in the SWI-Prolog libraries dropdown, then click Run. The query is prefilled.`
    : example.loading === "source"
      ? "Click Run directly. The source imports plunit before declaring the tests; no dropdown action is needed. Its check appears in the libraries menu after execution."
      : example.loading === "runtime"
        ? "Click Run directly. The runtime provides wasm at initialization; no dropdown action is needed."
        : `Click Run directly. SWI-Prolog loads ${example.library} automatically when needed, unless it has already been loaded by a dependency. Inspect its check in the libraries menu after execution; no manual loading is required for this example.`;
  const source = `<p>${escape(instruction)}</p>
<tp-textfield label="Query" label-position="start" style="--tp-textfield-inline-size:100%" readonly copy-code value="${escapeAttribute(example.query)}"></tp-textfield>
<p>Expected: <code>${escape(example.expected)}</code>. ${escape(example.detail)}</p>
<tp-prolog query="${escapeAttribute(example.query)}">${example.program ? `
  <script type="tp/prolog" filename="${example.library.replaceAll("/", "-")}-demo.pl">
${example.program.split("\n").map(line => line ? `    ${line}` : "").join("\n")}
  </script>
` : ""}</tp-prolog>`;
  const description = example.loading === "source"
    ? `Click Run to execute the two tests; the source already imports plunit. ${example.detail}`
    : example.loading === "menu"
      ? `Select **${example.library}** in the SWI-Prolog libraries menu, then click Run (expected: \`${example.expected}\`). ${example.detail}`
      : `Click Run directly without loading a library from the menu (expected: \`${example.expected}\`). ${example.detail}`;
  return { label: example.label, source, description };
});
