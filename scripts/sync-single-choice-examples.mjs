import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
	exampleFile,
	markupExample,
	namedExamples,
	viewerSource,
} from "./component-basic-examples.mjs";
import { standardizeComponentExamples } from "./standardize-component-examples.mjs";

const directory = resolve(
	import.meta.dirname,
	"../public/docs/components/single-choice-question/examples",
);
const formulas = [
	String.raw`f(x) = \tan(x)`,
	String.raw`\cos^{2}(x)`,
	String.raw`\displaystyle \frac{1}{\cos^{2}(x)}`,
	String.raw`\displaystyle -\frac{1}{\sin^{2}(x)}`,
	String.raw`\displaystyle \frac{1}{\tan^{2}(x)}`,
	String.raw`\displaystyle f'(x) = \frac{1}{\cos^{2}(x)} = 1 + \tan^{2}(x)`,
	String.raw`\cos(x) \ne 0`,
];
const derivative = `<tp-single-choice-question answer="2" random lang="en">
  <dl>
    <dt>Title</dt><dd>Derivative of the tangent function</dd>
    <dt>Prompt</dt><dd>What is the derivative of MATH0 at a point where MATH6?</dd>
    <dt>Form</dt><dd><ul><li>MATH1</li><li>MATH2</li><li>MATH3</li><li>MATH4</li></ul></dd>
    <dt>Feedback</dt><dd><ul>
      <li>The square of the cosine belongs in the denominator.</li>
      <li>Correct. Apply the quotient rule to sine divided by cosine.</li>
      <li>This is the derivative of the cotangent, not the tangent.</li>
      <li>The reciprocal square of the tangent is not its derivative.</li>
    </ul></dd>
    <dt>Solution</dt><dd>MATH5, wherever MATH6.</dd>
  </dl>
</tp-single-choice-question>`;
const polygons = ["pentagon", "hexagon", "heptagon", "octagon", "nonagon"];
const polygon = `<tp-single-choice-question answer="3" random lang="en">
  <dl>
    <dt>Title</dt><dd>Recognize a regular heptagon</dd>
    <dt>Prompt</dt><dd>Which figure is a regular heptagon? Select the polygon with seven equal sides and seven equal interior angles.</dd>
    <dt>Form</dt><dd><ul>${polygons.map((name, index) => `<li><img src="/docs/components/single-choice-question/examples/${name}.svg" alt="Regular polygon with ${index + 5} sides" width="120" height="120"></li>`).join("")}</ul></dd>
    <dt>Feedback</dt><dd><ul>
      <li>This pentagon has five sides.</li>
      <li>This hexagon has six sides.</li>
      <li>Correct. This heptagon has seven equal sides and seven equal interior angles.</li>
      <li>This octagon has eight sides.</li>
      <li>This nonagon has nine sides.</li>
    </ul></dd>
    <dt>Solution</dt><dd>The regular heptagon is the polygon with seven equal sides and seven equal interior angles.</dd>
  </dl>
</tp-single-choice-question>`;
const mathjax = `<script>
  // Wait for the question and its radio controls before typesetting the live content.
  window.MathJax = {
    svg: { fontCache: "local" },
    startup: {
      pageReady: async () => {
        await customElements.whenDefined("tp-single-choice-question");
        await customElements.whenDefined("tp-radio-list");
        return MathJax.startup.defaultPageReady();
      }
    }
  };
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js"></script>`;

const basic = namedExamples(
	"html",
	viewerSource("html", readFileSync(`${directory}/examples.html`, "utf8")),
).find(({ label }) => label === "Basic usage");
if (!basic) throw new Error("Missing Basic usage");
const basicSource = basic.source.replace(
	/<tp-single-choice-question\b(?![^>]*\brandom\b)/,
	"<tp-single-choice-question random",
);
for (const language of ["html", "md", "adoc", "rst"]) {
	const path = `${directory}/examples.${language}`;
	let mathSource = markupExample(language, derivative).replace(
		/MATH(\d+)/g,
		(_, index) => {
			const formula = formulas[Number(index)];
			if (language === "html") return `\\(${formula}\\)`;
			if (language === "md") return `:latexmath:\`${formula}\``;
			if (language === "adoc") return `latexmath:[${formula}]`;
			return `:math:\`${formula}\``;
		},
	);
	if (language === "html") mathSource += `\n${mathjax}`;
	if (language === "md")
		mathSource = `---\nextensions: [math]\n---\n\n${mathSource}`;
	writeFileSync(
		path,
		exampleFile(language, "tp-single-choice-question", [
			{ label: basic.label, source: markupExample(language, basicSource) },
			{ label: "Derivative of tan(x)", source: mathSource },
			{ label: "Regular heptagon", source: markupExample(language, polygon) },
		]),
	);
}
standardizeComponentExamples(["single-choice-question"]);
