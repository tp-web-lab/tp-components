import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
	exampleFile,
	markupExample,
	namedExamples,
	viewerSource,
} from "./component-basic-examples.mjs";
import { exampleRefinements } from "./component-example-refinements.mjs";
import { standardizeComponentExamples } from "./standardize-component-examples.mjs";

const root = resolve(import.meta.dirname, "../public/docs/components");
let components = 0;
let removed = 0;
let added = 0;
for (const component of readdirSync(root)) {
	const folder = `${root}/${component}/examples`;
	if (!existsSync(`${folder}/examples.html`)) continue;
	const html = namedExamples(
		"html",
		viewerSource("html", readFileSync(`${folder}/examples.html`, "utf8")),
	);
	const plans = exampleRefinements[component] ?? [];
	if (
		!html.some((example) => example.label === "Additional usage") &&
		!plans.length
	)
		continue;
	for (const language of ["html", "md", "adoc", "rst"]) {
		const path = `${folder}/examples.${language}`;
		const examples = namedExamples(
			language,
			viewerSource(language, readFileSync(path, "utf8")),
		);
		if (
			JSON.stringify(examples.map((example) => example.label)) !==
			JSON.stringify(html.map((example) => example.label))
		)
			throw Error(`Mismatched labels: ${component}/${language}`);
		const next = examples.filter(
			(example) =>
				example.label !== "Additional usage" &&
				!plans.some((plan) => plan.label === example.label),
		);
		for (const plan of plans) {
			const original = examples.find(
				(example) =>
					example.label === plan.previousLabel || example.label === plan.label,
			);
			const source = plan.source
				? markupExample(language, plan.source)
				: original?.source;
			if (!source)
				throw Error(`Missing replacement: ${component}/${plan.label}`);
			next.push({ label: plan.label, source });
		}
		writeFileSync(path, exampleFile(language, `tp-${component}`, next));
	}
	components++;
	removed += html.filter(
		(example) => example.label === "Additional usage",
	).length;
	added += plans.length;
}
console.log(
	`Refined ${components} components: removed ${removed} generic entries, added or retained ${added} focused examples.`,
);
standardizeComponentExamples();
