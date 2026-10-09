import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
	exampleFile,
	markupExample,
	namedExamples,
	viewerSource,
} from "./component-basic-examples.mjs";
import { groupedAttributeExample } from "./grouped-attribute-examples.mjs";
import {
	fieldAttributesScript,
	groupedFields,
	textfieldAttributesExample,
} from "./textfield-attributes-example.mjs";

const root = resolve(import.meta.dirname, "..");
export const languages = ["html", "md", "adoc", "rst"];
const read = (path) => readFileSync(path, "utf8");
export function componentAttributes(component) {
	return JSON.parse(
		read(`${root}/src/components/${component}/${component}.json`),
	)
		.attributes.map((attribute) => attribute.name)
		.sort();
}
export function documentedComponents() {
	return readdirSync(`${root}/public/docs/components`).filter(
		(component) =>
			existsSync(`${root}/src/components/${component}/${component}.json`) &&
			existsSync(
				`${root}/public/docs/components/${component}/examples/examples.html`,
			),
	);
}
export function readExamples(component, language) {
	return namedExamples(
		language,
		viewerSource(
			language,
			read(
				`${root}/public/docs/components/${component}/examples/examples.${language}`,
			),
		),
	);
}

export function standardizeComponentExamples(
	components = documentedComponents(),
) {
	for (const component of components) {
		const examples = Object.fromEntries(
			languages.map((language) => [
				language,
				readExamples(component, language),
			]),
		);
		const attributes = componentAttributes(component);
		let source;
		if (groupedFields.includes(component)) {
			source = textfieldAttributesExample(component);
			writeFileSync(
				`${root}/public/docs/components/${component}/examples/attributes.js`,
				fieldAttributesScript(component),
			);
		} else if (attributes.length)
			source = groupedAttributeExample(component, examples.html);
		for (const language of languages) {
			const basic = examples[language].find(
				(example) => example.label === "Basic usage",
			);
			if (!basic)
				throw new Error(`${component}/${language}: missing Basic usage`);
			const complementary = examples[language].filter(
				(example) =>
					example.label !== "Basic usage" &&
					example.label !== "Attributes" &&
					!/^Attributes?\s*:/i.test(example.label) &&
					!/^Additional usage$/i.test(example.label) &&
					example.source.trim() !== basic.source.trim(),
			);
			writeFileSync(
				`${root}/public/docs/components/${component}/examples/examples.${language}`,
				exampleFile(language, `tp-${component}`, [
					basic,
					...(source
						? [{ label: "Attributes", source: markupExample(language, source) }]
						: []),
					...complementary,
				]),
			);
		}
	}
	return { components: components.length, added: 0 };
}

export function checkExampleStructure() {
	const failures = [];
	for (const component of documentedComponents()) {
		const attributes = componentAttributes(component);
		const expected = [
			"Basic usage",
			...(attributes.length ? ["Attributes"] : []),
		];
		const html = readExamples(component, "html");
		for (const language of languages) {
			const examples = readExamples(component, language);
			if (
				JSON.stringify(
					examples.slice(0, expected.length).map((example) => example.label),
				) !== JSON.stringify(expected)
			)
				failures.push(
					`${component}/${language}: expected Basic usage followed by grouped Attributes`,
				);
			if (
				JSON.stringify(examples.map((example) => example.label)) !==
				JSON.stringify(html.map((example) => example.label))
			)
				failures.push(`${component}/${language}: different example order`);
			if (examples.some((example) => /^Attributes?\s*:/i.test(example.label)))
				failures.push(
					`${component}/${language}: legacy attribute example remains`,
				);
			if (
				new Set(examples.map((example) => example.label)).size !==
				examples.length
			)
				failures.push(`${component}/${language}: duplicate titles`);
			if (!attributes.length) continue;
			const grouped = examples.find(
				(example) => example.label === "Attributes",
			);
			const scriptPath = `${root}/public/docs/components/${component}/examples/attributes.js`;
			if (
				!grouped?.source.includes(
					`/docs/components/${component}/examples/attributes.js`,
				) ||
				!existsSync(scriptPath)
			) {
				failures.push(
					`${component}/${language}: missing external Attributes script`,
				);
				continue;
			}
			const script = readFileSync(scriptPath, "utf8");
			attributes.forEach((attribute) => {
				if (!script.includes(`"name":"${attribute}"`))
					failures.push(
						`${component}/${language}: missing grouped control for ${attribute}`,
					);
			});
		}
	}
	return failures;
}
if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
	if (!process.argv.includes("--check"))
		console.log(standardizeComponentExamples());
	const failures = checkExampleStructure();
	if (failures.length) {
		console.error(failures.join("\n"));
		process.exitCode = 1;
	} else
		console.log(
			`Example structure verified for ${documentedComponents().length} components.`,
		);
}
