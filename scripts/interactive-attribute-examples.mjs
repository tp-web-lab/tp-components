import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseFragment, serialize } from "parse5";
import ts from "typescript";
import { markupExample } from "./component-basic-examples.mjs";

const root = resolve(import.meta.dirname, "..");
const aliases = new Map();
const sources = new Map();
for (const path of readdirSync(`${root}/src/components`, { recursive: true })) {
	if (!path.endsWith(".ts") || path.endsWith(".test.ts")) continue;
	const source = ts.createSourceFile(
		path,
		readFileSync(`${root}/src/components/${path}`, "utf8"),
		ts.ScriptTarget.Latest,
		true,
	);
	sources.set(path, source);
	for (const statement of source.statements) {
		if (ts.isTypeAliasDeclaration(statement))
			aliases.set(statement.name.text, statement.type);
	}
}
function alternatives(type, seen = new Set()) {
	if (!type) return undefined;
	if (ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal))
		return [type.literal.text];
	if (ts.isUnionTypeNode(type)) {
		const parts = type.types.map((part) => alternatives(part, seen));
		return parts.every(Boolean) ? parts.flat() : undefined;
	}
	if (ts.isTypeReferenceNode(type) && !seen.has(type.typeName.getText())) {
		const name = type.typeName.getText();
		return alternatives(aliases.get(name), new Set([...seen, name]));
	}
	return undefined;
}
const overrides = {
	"radio-list/label-position": ["top", "bottom", "start", "end"],
	"numberfield/label-position": ["top", "bottom", "start", "end"],
	"checkbox-list/label-position": ["top", "bottom", "start", "end"],
	"base/dir": ["ltr", "rtl", "auto"],
	"code-editor/dir": ["ltr", "rtl", "auto"],
	"single-choice-question/orientation": ["horizontal", "vertical"],
	"multi-choice-question/orientation": ["horizontal", "vertical"],
	"iframe/loading": ["eager", "lazy"],
	"iframe/referrerpolicy": [
		"no-referrer",
		"no-referrer-when-downgrade",
		"origin",
		"origin-when-cross-origin",
		"same-origin",
		"strict-origin",
		"strict-origin-when-cross-origin",
		"unsafe-url",
	],
	"solitaire/deck-size": ["32", "52"],
	"game-life/preset": alternatives(aliases.get("PresetName")),
	"color/preset": [
		...sources
			.get("color/color.ts")
			.text.match(/const TP_COLOR_PRESETS = \[([\s\S]*?)\]/)[1]
			.matchAll(/'([^']+)'/g),
	].map((match) => match[1]),
	"clock/type": ["digital", "analogic"],
	"flip-card/button-position": [
		"top start",
		"top center",
		"top end",
		"bottom start",
		"bottom center",
		"bottom end",
		"none",
	],
	"animation/fill": ["none", "forwards", "backwards", "both", "auto"],
};
/** Closed unions come from the component's real TypeScript contract, not guessed values. */
export function attributeControl(component, attribute) {
	if (
		attribute.type === "boolean" ||
		(component === "game-life" && ["autoplay", "wrap"].includes(attribute.name))
	)
		return { kind: "boolean" };
	const property = attribute.name.replace(/-([a-z])/g, (_, letter) =>
		letter.toUpperCase(),
	);
	const source = sources.get(`${component}/${component}.ts`);
	let values = overrides[`${component}/${attribute.name}`];
	function visit(node) {
		if (
			ts.isGetAccessorDeclaration(node) &&
			node.name.getText(source) === property
		)
			values ??= alternatives(node.type);
		ts.forEachChild(node, visit);
	}
	if (source) visit(source);
	values ??= alternatives(aliases.get(attribute.type));
	if (!values && attribute.type?.includes("|")) {
		const declaration = ts.createSourceFile(
			"enum.ts",
			`type Choice = ${attribute.type};`,
			ts.ScriptTarget.Latest,
			true,
		);
		values = alternatives(declaration.statements[0].type);
	}
	return values?.length > 1
		? { kind: "enum", values: [...new Set(values)] }
		: undefined;
}

export function describeAttributeControl(component, name) {
	const manifest = JSON.parse(
		readFileSync(
			`${root}/src/components/${component}/${component}.json`,
			"utf8",
		),
	);
	const attribute = manifest.attributes.find((item) => item.name === name);
	const control = attribute && attributeControl(component, attribute);
	if (!control) return undefined;
	return `${control.kind === "boolean" ? "Toggle the checkbox" : "Choose a value in the radio list"} to change ${name} and observe the preview. Initialization-only settings restart the preview.`;
}

/** Domain demonstrations remain useful even when an attribute example reused their source. */
const protectedComponents = new Set([
	"diagram",
	"fill-blank-question",
	"multi-choice-question",
	"single-choice-question",
]);
const extraDuplicates = {
	memory: ["Playing cards with blue back", "Playing cards with red back"],
	mathfield: ["AsciiMath inline", "LaTeX display", "AsciiMath display"],
	animation: ["Hover animation timing"],
	asciidoc: ["External document"],
	blank: ["Disabled blank"],
	button: ["Button styles", "Disabled and loading", "Link and download"],
	"button-group": ["Vertical and stretched groups"],
	"checkbox-list": ["Horizontal choices"],
	"code-editor": [
		"With initial value",
		"With file upload",
		"Read-only source",
		"Code folding",
		"Empty editor placeholder",
	],
	"icon-button": ["Disabled icon buttons"],
	iframe: ["Inline document and zoom"],
	"prolog-playground": ["Repository project"],
	"prose-editor": ["External HTML document"],
	"save-image": ["Download control icon"],
	tabs: ["Manual vertical tabs"],
	textfield: [
		"Input types",
		"Prefix and clear",
		"Multiline",
		"Label",
		"Disabled and read-only fields",
	],
	badge: ["Variants"],
	callout: ["Attribute variant", "Attribute heading"],
	card: ["Card with defined dimensions"],
	"text-to-speech": ["Show text", "Lang"],
};
export const isRetiredExample = (component, label) =>
	extraDuplicates[component]?.includes(label) ?? false;
const normalize = (source) =>
	source.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
const children = (node) => node.content?.childNodes ?? node.childNodes ?? [];
const walk = (node) => [node, ...children(node).flatMap(walk)];
const get = (node, name) =>
	node.attrs?.find((attr) => attr.name === name)?.value;

/** Remove redundant legacy variants before enhancing the surviving attribute examples. */
export function enhanceAttributeExamples(component, examples, languages) {
	const original = examples.html;
	const attributes = JSON.parse(
		readFileSync(
			`${root}/src/components/${component}/${component}.json`,
			"utf8",
		),
	).attributes;
	const duplicates = new Set(extraDuplicates[component] ?? []);
	if (!protectedComponents.has(component)) {
		const variants = original
			.filter((example) => example.label.startsWith("Attribute:"))
			.map((example) => normalize(example.source));
		for (const example of original) {
			if (
				example.label !== "Basic usage" &&
				!example.label.startsWith("Attribute:") &&
				variants.some((variant) => variant.includes(normalize(example.source)))
			)
				duplicates.add(example.label);
		}
	}
	for (const language of languages)
		examples[language] = examples[language].filter(
			(example) => !duplicates.has(example.label),
		);
	for (const attribute of attributes) {
		const control = attributeControl(component, attribute);
		if (!control) continue;
		const label = `Attribute: ${attribute.name}`;
		const example = examples.html.find((entry) => entry.label === label);
		if (
			!example ||
			example.source.includes("data-attribute-control") ||
			example.source.includes(
				control.kind === "boolean"
					? "tp-checkbox-list-change"
					: "tp-radio-list-change",
			)
		)
			continue;
		const document = parseFragment(example.source);
		const nodes = walk(document).filter(
			(node) => node.tagName === `tp-${component}`,
		);
		if (!nodes.length)
			throw Error(`${component}/${attribute.name}: missing preview`);
		const preview =
			nodes.find((node) => get(node, attribute.name) !== undefined) ?? nodes[0];
		for (const node of nodes) {
			if (node !== preview)
				node.parentNode.childNodes.splice(
					node.parentNode.childNodes.indexOf(node),
					1,
				);
		}
		let value = get(preview, attribute.name);
		const originalValue = value;
		const legacyInteraction =
			component === "iframe" && attribute.name === "interaction";
		const checked = legacyInteraction ? value !== "false" : value !== undefined;
		if (control.kind === "enum" && !control.values.includes(value)) {
			value = control.values[0];
			preview.attrs = preview.attrs.filter(
				(attr) => attr.name !== attribute.name,
			);
			preview.attrs.push({ name: attribute.name, value });
		}
		const selector =
			control.kind === "boolean" ? "tp-checkbox-list" : "tp-radio-list";
		const selected =
			control.kind === "boolean"
				? checked
					? "1"
					: ""
				: String(control.values.indexOf(value) + 1);
		const options =
			control.kind === "boolean" ? [attribute.name] : control.values;
		const html = `<${selector} data-attribute-control="${attribute.name}" value="${selected}" orientation="horizontal" aria-label="${attribute.name}"><ul>${options.map((option) => `<li>${option}</li>`).join("")}</ul></${selector}>\n<p>Change ${attribute.name} to test the preview. Changes to initialization-only attributes restart the preview.</p>`;
		const script = `<script type="module">
const control = document.querySelector('[data-attribute-control="${attribute.name}"]');
const tag = "tp-${component}";
const attribute = "${attribute.name}";
const values = ${JSON.stringify(control.values ?? [])};
await customElements.whenDefined(tag);
const preview = [...document.querySelectorAll(tag)].find((element) => element !== control);
control.addEventListener("${selector}-change", (event) => {
  if (event.target !== control) return;
  const value = ${control.kind === "boolean" ? 'event.detail.value === "1" ? "" : null' : "values[Number(event.detail.value) - 1]"};
  if (value === undefined) return;
  const apply = (element) => {
    ${legacyInteraction ? "// This legacy attribute defaults to true; use its public boolean setter.\n    element.interaction = value !== null;" : "if (value === null) element.removeAttribute(attribute);\n    else element.setAttribute(attribute, value);"}
  };
  if (preview.constructor.observedAttributes?.includes(attribute)) {
    apply(preview);
  } else if (window.frameElement?.srcdoc) {
    const source = new DOMParser().parseFromString(window.frameElement.srcdoc, "text/html");
    const originalControl = source.querySelector("[data-attribute-control]");
    const originalPreview = [...source.querySelectorAll(tag)].find((element) => element !== originalControl);
    if (!originalPreview) return;
    apply(originalPreview);
    originalControl.setAttribute("value", event.detail.value);
    window.frameElement.srcdoc = "<!doctype html>" + source.documentElement.outerHTML;
  } else {
    apply(preview);
  }
});
const observer = new MutationObserver(() => {
  const current = ${control.kind === "boolean" ? (legacyInteraction ? 'preview.getAttribute(attribute) !== "false" ? "1" : ""' : 'preview.hasAttribute(attribute) ? "1" : ""') : "String(values.indexOf(preview.getAttribute(attribute)) + 1)"};
  if (control.getAttribute("value") !== current) control.setAttribute("value", current);
});
observer.observe(preview, { attributes: true, attributeFilter: [attribute] });
window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
</script>`;
		for (const language of languages) {
			const entry = examples[language].find((item) => item.label === label);
			const body =
				nodes.length > 1 || originalValue !== value
					? markupExample(language, serialize(document))
					: entry.source;
			entry.source = `${markupExample(language, html)}\n\n${body}\n\n${markupExample(language, script)}`;
		}
	}
	return examples;
}
