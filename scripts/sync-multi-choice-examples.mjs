import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { exampleFile, markupExample } from "./component-basic-examples.mjs";
import { standardizeComponentExamples } from "./standardize-component-examples.mjs";

const directory = resolve(
	import.meta.dirname,
	"../public/docs/components/multi-choice-question",
);
const basic = `<tp-multi-choice-question answer="1,3,5" random>
  <dl>
    <dt>Title</dt><dd>Web languages</dd>
    <dt>Prompt</dt><dd>Select the styling languages, including CSS preprocessors.</dd>
    <dt>Form</dt><dd><ul><li>CSS</li><li>HTML</li><li>Sass</li><li>JavaScript</li><li>Less</li></ul></dd>
    <dt>Feedback</dt><dd><ul><li>Correct. CSS describes presentation.</li><li>HTML structures content.</li><li>Correct. Sass is a CSS preprocessor.</li><li>JavaScript is a programming language.</li><li>Correct. Less is a CSS preprocessor.</li></ul></dd>
    <dt>Solution</dt><dd>CSS, Sass and Less are used to define styles.</dd>
  </dl>
</tp-multi-choice-question>`;
const formulas = [
	String.raw`f(x) = \tan(x)`,
	String.raw`\displaystyle \frac{1}{\cos^2(x)}`,
	String.raw`1 - \tan^2(x)`,
	String.raw`1 + \tan^2(x)`,
	String.raw`\cos^2(x)`,
	String.raw`\displaystyle -\frac{1}{\sin^2(x)}`,
	String.raw`\cos(x) \ne 0`,
	String.raw`\displaystyle f'(x) = \frac{1}{\cos^2(x)} = 1 + \tan^2(x)`,
];
const derivative = `<tp-multi-choice-question answer="1,3" lang="en" random>
  <dl>
    <dt>Title</dt><dd>Equivalent derivatives of the tangent</dd>
    <dt>Prompt</dt><dd>Select all expressions equal to the derivative of MATH0 wherever MATH6.</dd>
    <dt>Form</dt><dd><ul><li>MATH1</li><li>MATH2</li><li>MATH3</li><li>MATH4</li><li>MATH5</li></ul></dd>
    <dt>Feedback</dt><dd><ul>
      <li>Correct. Apply the quotient rule to sine divided by cosine.</li>
      <li>The identity uses a plus sign, not a minus sign.</li>
      <li>Correct. This is equivalent to the reciprocal square of the cosine.</li>
      <li>The square of the cosine belongs in the denominator.</li>
      <li>This is the derivative of the cotangent, not the tangent.</li>
    </ul></dd>
    <dt>Solution</dt><dd>MATH7. The expression MATH2 is not the derivative.</dd>
  </dl>
</tp-multi-choice-question>`;
const languages = [
	["html", "HTML"],
	["javascript", "JavaScript"],
	["markdown", "Markdown"],
	["python", "Python"],
	["asciidoc", "AsciiDoc"],
	["typescript", "TypeScript"],
];
const logos = `<tp-multi-choice-question answer="1,3,5" lang="en" orientation="horizontal" random>
  <dl>
    <dt>Title</dt><dd>Recognize markup languages</dd>
    <dt>Prompt</dt><dd>Select the three logos representing markup languages rather than programming languages.</dd>
    <dt>Form</dt><dd><ul>${languages.map(([name, label]) => `<li><tp-icon name="file_type_${name}" library="languages" size="2em" role="img" aria-label="${label}"></tp-icon></li>`).join("")}</ul></dd>
    <dt>Feedback</dt><dd><ul>
      <li>Correct. HTML marks up the structure of web documents.</li>
      <li>JavaScript is a programming language.</li>
      <li>Correct. Markdown is a lightweight markup language.</li>
      <li>Python is a programming language.</li>
      <li>Correct. AsciiDoc is a markup language for documents.</li>
      <li>TypeScript is a programming language based on JavaScript.</li>
    </ul></dd>
    <dt>Solution</dt><dd><p>SOLUTIONhtml HTML, SOLUTIONmarkdown Markdown and SOLUTIONasciidoc AsciiDoc are markup languages.</p><p>SOLUTIONjavascript JavaScript, SOLUTIONpython Python and SOLUTIONtypescript TypeScript are programming languages.</p></dd>
  </dl>
</tp-multi-choice-question>`;
const mathjax = `<script>
  // Typeset after the question has created its checkbox controls.
  window.MathJax = {
    svg: { fontCache: "local" },
    startup: {
      pageReady: async () => {
        await customElements.whenDefined("tp-multi-choice-question");
        await customElements.whenDefined("tp-checkbox-list");
        return MathJax.startup.defaultPageReady();
      }
    }
  };
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js"></script>`;

for (const language of ["html", "md", "adoc", "rst"]) {
	let logoSource = logos;
	if (language === "adoc" || language === "rst")
		logoSource = markupExample(language, logos);
	// RST discovers component directives at the start of a line, after indentation.
	if (language === "rst")
		logoSource = logoSource.replace(
			/^([ \t]*)- \.\. tp-icon::/gm,
			"$1-\n$1  .. tp-icon::",
		);
	if (language === "md") {
		let index = 0;
		logoSource = markupExample(
			language,
			logos.replace(/<tp-icon\b[^>]*><\/tp-icon>/g, () => `LOGO${index++}`),
		);
		logoSource = logoSource.replace(/LOGO(\d+)/g, (_, position) => {
			const [name, label] = languages[Number(position)];
			return `:tp-icon:{name="file_type_${name}" library="languages" size="2em" role="img" aria-label="${label}"}`;
		});
	}
	// Native inline images keep solution logos beside their names in Adoc and RST.
	for (const [name, label] of languages) {
		const asset = `/docs/components/multi-choice-question/examples/logos/${name}.svg`;
		const assetDirectory = `${directory}/examples/logos`;
		mkdirSync(assetDirectory, { recursive: true });
		writeFileSync(
			`${assetDirectory}/${name}.svg`,
			readFileSync(
				resolve(
					import.meta.dirname,
					`../src/components/icon/icons/languages/file_type_${name}.svg`,
				),
			),
		);
		const icon =
			language === "html"
				? `<tp-icon name="file_type_${name}" library="languages" size="1em" aria-hidden="true"></tp-icon>`
				: language === "md"
					? `:tp-icon:{name="file_type_${name}" library="languages" size="1em" aria-hidden="true"}`
					: language === "adoc"
						? `image:${asset}[${label},1em,1em]`
						: `|solution-${name}|`;
		logoSource = logoSource.replace(`SOLUTION${name}`, icon);
		if (language === "rst")
			logoSource = `.. |solution-${name}| image:: ${asset}\n   :alt: ${label}\n   :width: 1em\n   :height: 1em\n\n${logoSource}`;
	}
	let math = markupExample(language, derivative).replace(
		/MATH(\d+)/g,
		(_, index) => {
			const formula = formulas[Number(index)];
			if (language === "html") return `\\(${formula}\\)`;
			if (language === "adoc") return `latexmath:[${formula}]`;
			return `:latexmath:\`${formula}\``;
		},
	);
	if (language === "html") math += `\n${mathjax}`;
	if (language === "md") math = `---\nextensions: [math]\n---\n\n${math}`;
	writeFileSync(
		`${directory}/examples/examples.${language}`,
		exampleFile(language, "tp-multi-choice-question", [
			{ label: "Basic usage", source: markupExample(language, basic) },
			{ label: "Derivatives of tan(x)", source: math },
			{ label: "Markup languages", source: logoSource },
		]),
	);
}
const page = `${directory}/index.md`;
standardizeComponentExamples(["multi-choice-question"]);
writeFileSync(
	page,
	readFileSync(page, "utf8").replace(
		/<tp-multi-choice-question\b[^>]*>[\s\S]*?<\/tp-multi-choice-question>/,
		basic,
	),
);
