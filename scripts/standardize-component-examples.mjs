/** @module scripts/standardize-component-examples */

/**
 * Rebuilds component examples with Basic usage first, retained
 * complementary examples.
 *
 * Run from the tp-components package root with workspace dependencies installed. Updates
 * examples and shared attribute modules. Use --check to validate structure without rewriting
 * files. To limit generation, import standardizeComponentExamples with a component-name array.
 *
 * @example
 * node scripts/standardize-component-examples.mjs
 *
 * @example
 * node scripts/standardize-component-examples.mjs --check
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
	exampleFile,
	markupExample,
	namedExamples,
	viewerSource,
} from "./component-basic-examples.mjs";

import { componentDocScenarios } from "./component-doc-scenarios.mjs";

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
					!/^Attributes?(?:\s*:|$)/i.test(example.label) &&
					!/^Additional usage$/i.test(example.label) &&
					example.source.trim() !== basic.source.trim(),
			);
			for (const scenario of componentDocScenarios[component] ?? []) {
				if (!complementary.some(example => example.label === scenario.label)) complementary.push({ label: scenario.label, source: markupExample(language, scenario.source) });
			}
			writeFileSync(
				`${root}/public/docs/components/${component}/examples/examples.${language}`,
				exampleFile(language, `tp-${component}`, [
					basic,
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
		const expected = ["Basic usage"];
		const html = readExamples(component, "html");
		for (const language of languages) {
			const examples = readExamples(component, language);
			if (
				JSON.stringify(
					examples.slice(0, expected.length).map((example) => example.label),
				) !== JSON.stringify(expected)
			)
				failures.push(
					`${component}/${language}: expected Basic usage first`,
				);
			if (
				JSON.stringify(examples.map((example) => example.label)) !==
				JSON.stringify(html.map((example) => example.label))
			)
				failures.push(`${component}/${language}: different example order`);
			if (examples.some((example) => /^Attributes?(?:\s*:|$)/i.test(example.label)))
				failures.push(
					`${component}/${language}: legacy attribute example remains`,
				);
			if (
				new Set(examples.map((example) => example.label)).size !==
				examples.length
			)
				failures.push(`${component}/${language}: duplicate titles`);
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
