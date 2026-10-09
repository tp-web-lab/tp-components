import { promises as fs, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { glob } from "glob";
import type Ts from "typescript";
import type { Plugin } from "vite";
import {
	extractComponentUserHelp,
	type TpComponentUserHelp,
} from "../src/utilities/component-user-help.js";

const require = createRequire(import.meta.url);
const ts = loadTypeScriptCompiler();

function loadTypeScriptCompiler(): typeof import("typescript") {
	const direct = require("typescript") as Partial<typeof import("typescript")>;
	if (typeof direct.createSourceFile === "function") {
		return direct as typeof import("typescript");
	}

	const pnpmRoot = path.resolve(process.cwd(), "../node_modules/.pnpm");
	const candidates = readdirSync(pnpmRoot)
		.filter((entry) => /^typescript@\d+\.\d+\.\d+$/.test(entry))
		.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

	for (const candidate of candidates) {
		const major = Number(candidate.match(/^typescript@(\d+)/)?.[1] ?? "0");
		if (major >= 7) {
			continue;
		}

		const compilerPath = path.join(
			pnpmRoot,
			candidate,
			"node_modules/typescript/lib/typescript.js",
		);

		const compiler = require(compilerPath) as Partial<
			typeof import("typescript")
		>;
		if (typeof compiler.createSourceFile === "function") {
			return compiler as typeof import("typescript");
		}
	}

	throw new Error("Unable to load the TypeScript compiler API.");
}

interface ComponentApiPluginOptions {
	rootDir?: string;
	componentsDir?: string;
}

interface ComponentApiManifest {
	userHelp?: TpComponentUserHelp;
	tagname: string;
	classname: string;
	superclass: string;
	description: string;
	examples: ComponentApiExample[];
	attributes: ComponentApiAttribute[];
	methods: ComponentApiMethod[];
	events: ComponentApiEvent[];
	cssproperties: ComponentApiCssProperty[];
	dependencies: ComponentApiDependency[];
	credits: ComponentApiCredit[];
}

interface ComponentApiDependency {
	name: string;
	summary: string;
}

interface ComponentApiCredit extends ComponentApiDependency {
	url: string;
}

interface ComponentApiExample {
	label: string;
	code: string;
}

interface ComponentApiAttribute {
	name: string;
	description: string;
	reflected: boolean;
	static: boolean;
	inherited: boolean;
	type: string;
	default: string;
}

interface ComponentApiMethod {
	name: string;
	inherited: boolean;
	description: string;
}

interface ComponentApiEvent {
	name: string;
	description: string;
	detail: string;
}

interface ComponentApiCssProperty {
	name: string;
	default: string;
	description: string;
}

interface ParsedSource {
	sourceFile: Ts.SourceFile;
	sourceText: string;
	classNode: Ts.ClassDeclaration;
}

interface AttributeCandidate {
	name: string;
	type: string;
	description: string;
	defaultValue: string;
}

interface CssVariable {
	name: string;
	defaultValue: string;
}

export function componentApiPlugin(
	options: ComponentApiPluginOptions = {},
): Plugin {
	const rootDir = options.rootDir ?? process.cwd();
	const componentsDir = options.componentsDir ?? "src/components";
	let resolvedRoot = rootDir;

	return {
		name: "tp-component-api-json",
		async configResolved(config) {
			resolvedRoot = config.root;
		},
		async buildStart() {
			await generateComponentApiFiles(resolvedRoot, componentsDir);
		},
		async configureServer(server) {
			await generateComponentApiFiles(resolvedRoot, componentsDir);

			const pattern = path.join(resolvedRoot, componentsDir, "*", "*.{ts,css}");
			const watcher = server.watcher.add(pattern);
			watcher.add(path.join(resolvedRoot, "public/docs/components/*/index.md"));
			watcher.on("change", async (filePath) => {
				if (
					filePath.endsWith(`${path.sep}index.md`) &&
					filePath.includes(`${path.sep}docs${path.sep}components${path.sep}`)
				) {
					const name = path.basename(path.dirname(filePath));
					const relativePath = path.join(componentsDir, name, `${name}.ts`);
					if (await readOptionalFile(path.join(resolvedRoot, relativePath)))
						await generateComponentApiFile(resolvedRoot, relativePath);
					return;
				}
				await generateComponentApiForChangedFile(
					resolvedRoot,
					componentsDir,
					filePath,
				);
			});
		},
	};
}

export async function generateComponentApiFiles(
	rootDir: string,
	componentsDir: string,
): Promise<void> {
	const files = await glob(`${componentsDir}/*/*.ts`, {
		cwd: rootDir,
		ignore: [
			`${componentsDir}/**/*.test.ts`,
			`${componentsDir}/**/*.spec.ts`,
			`${componentsDir}/**/*.stories.ts`,
			`${componentsDir}/**/*.d.ts`,
		],
		posix: true,
	});

	for (const relativePath of files) {
		if (!isPrimaryComponentSource(relativePath)) {
			continue;
		}

		await generateComponentApiFile(rootDir, relativePath);
	}
}

async function generateComponentApiForChangedFile(
	rootDir: string,
	componentsDir: string,
	filePath: string,
): Promise<void> {
	const relativePath = path
		.relative(rootDir, filePath)
		.split(path.sep)
		.join(path.posix.sep);
	const directory = path.posix.dirname(relativePath);
	const name = path.posix.basename(directory);
	const sourcePath = path.posix.join(componentsDir, name, `${name}.ts`);

	if (
		relativePath !== sourcePath &&
		relativePath !== `${directory}/${name}.css`
	) {
		return;
	}

	await generateComponentApiFile(rootDir, sourcePath);
}

async function generateComponentApiFile(
	rootDir: string,
	relativePath: string,
): Promise<void> {
	const sourcePath = path.join(rootDir, relativePath);
	const sourceText = await fs.readFile(sourcePath, "utf8");
	const parsed = parseSource(sourcePath, sourceText);

	if (parsed === null) {
		return;
	}

	const tagname = extractTagName(parsed.classNode);
	if (tagname === "") {
		return;
	}

	const componentDirectory = path.dirname(sourcePath);
	const componentName = path.basename(componentDirectory);
	const cssPath = path.join(componentDirectory, `${componentName}.css`);
	const cssText = await readOptionalFile(cssPath);
	const outputPath = path.join(componentDirectory, `${componentName}.json`);
	const api = buildComponentApi(parsed, cssText, componentName);
	const documentation = await readOptionalFile(
		path.join(rootDir, "public/docs/components", componentName, "index.md"),
	);
	api.userHelp = extractComponentUserHelp(documentation, sourceText);
	const nextContent = `${JSON.stringify(api, null, 2)}\n`;
	const currentContent = await readOptionalFile(outputPath);

	if (currentContent === nextContent) {
		return;
	}

	await fs.writeFile(outputPath, nextContent);
}

function isPrimaryComponentSource(relativePath: string): boolean {
	const fileName = path.posix.basename(relativePath, ".ts");
	const directoryName = path.posix.basename(path.posix.dirname(relativePath));
	return fileName === directoryName;
}

function parseSource(
	sourcePath: string,
	sourceText: string,
): ParsedSource | null {
	const sourceFile = ts.createSourceFile(
		sourcePath,
		sourceText,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS,
	);

	const classNode = findComponentClass(sourceFile);
	if (classNode === undefined) {
		return null;
	}

	return {
		classNode,
		sourceFile,
		sourceText,
	};
}

function findComponentClass(
	sourceFile: Ts.SourceFile,
): Ts.ClassDeclaration | undefined {
	let fallback: Ts.ClassDeclaration | undefined;
	let tagged: Ts.ClassDeclaration | undefined;

	function visit(node: Ts.Node): void {
		if (tagged !== undefined) {
			return;
		}

		if (ts.isClassDeclaration(node) && node.name !== undefined) {
			if (extractTagName(node) !== "") {
				tagged = node;
				return;
			}

			if (
				fallback === undefined &&
				hasModifier(node, ts.SyntaxKind.ExportKeyword)
			) {
				fallback = node;
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return tagged ?? fallback;
}

function buildComponentApi(
	parsed: ParsedSource,
	cssText: string,
	componentName: string,
): ComponentApiManifest {
	return {
		tagname: extractTagName(parsed.classNode),
		classname: parsed.classNode.name?.text ?? "",
		superclass: extractSuperclass(parsed.classNode, parsed.sourceFile),
		description:
			getSummary(parsed.classNode) || getJSDocDescription(parsed.classNode),
		examples: extractExamples(parsed.classNode),
		attributes: extractAttributes(parsed),
		methods: extractMethods(parsed),
		events: extractEvents(parsed),
		cssproperties: extractCssProperties(parsed, cssText, componentName),
		dependencies: extractDependencyMetadata(parsed.sourceText),
		credits: extractCreditMetadata(parsed.sourceText),
	};
}

function extractDependencyMetadata(
	sourceText: string,
): ComponentApiDependency[] {
	return [
		...sourceText.matchAll(
			/\/\*\*\s*\n\s*\* @tp-dependency\s+([^\n]+)\n\s*\* @summary\s+([^\n]+)\n\s*\*\//g,
		),
	].map((match) => ({
		name: match[1]?.trim() ?? "",
		summary: match[2]?.trim() ?? "",
	}));
}

function extractCreditMetadata(sourceText: string): ComponentApiCredit[] {
	return [
		...sourceText.matchAll(
			/\/\*\*\s*\n\s*\* @credit\s+(.+?)\s+(https?:\/\/\S+)\n\s*\* @summary\s+([^\n]+)\n\s*\*\//g,
		),
	].map((match) => ({
		name: match[1]?.trim() ?? "",
		url: match[2]?.trim() ?? "",
		summary: match[3]?.trim() ?? "",
	}));
}

function extractSuperclass(
	classNode: Ts.ClassDeclaration,
	sourceFile: Ts.SourceFile,
): string {
	const heritage = classNode.heritageClauses?.find(
		(clause) => clause.token === ts.SyntaxKind.ExtendsKeyword,
	);

	return heritage?.types[0]?.expression.getText(sourceFile) ?? "";
}

function extractTagName(classNode: Ts.ClassDeclaration): string {
	for (const tag of ts.getJSDocTags(classNode)) {
		if (tag.tagName.text === "tagname") {
			return normalizeTagComment(tag.comment);
		}
	}

	return "";
}

function extractExamples(
	classNode: Ts.ClassDeclaration,
): ComponentApiExample[] {
	const examples: ComponentApiExample[] = [];

	for (const tag of ts.getJSDocTags(classNode)) {
		if (tag.tagName.text !== "example") {
			continue;
		}

		const code = normalizeTagComment(tag.comment);
		if (code === "") {
			continue;
		}

		examples.push({
			label: `Example ${String(examples.length + 1)}`,
			code,
		});
	}

	return examples;
}

function extractAttributes(parsed: ParsedSource): ComponentApiAttribute[] {
	const defaults = extractDefaults(parsed);
	const reflectedAttributes = extractReflectedAttributes(parsed);
	const attributes = new Map<string, ComponentApiAttribute>();

	const addAttribute = (
		candidate: AttributeCandidate,
		fallbackDescription = "",
		fallbackType = "string",
	): void => {
		if (candidate.name === "") {
			return;
		}

		const existing = attributes.get(candidate.name);
		const candidateDescription =
			candidate.description.trim() === "*" ? "" : candidate.description;
		const description =
			candidateDescription ||
			existing?.description ||
			fallbackDescription ||
			"";
		const type =
			candidate.type === "string" && fallbackType !== "string"
				? fallbackType
				: candidate.type || existing?.type || fallbackType;

		const documentedDefault = defaults.get(candidate.name);
		const candidateDefault =
			candidate.defaultValue.trim() === "" ? undefined : candidate.defaultValue;
		const existingDefault =
			existing?.default.trim() === "" ? undefined : existing?.default;

		attributes.set(candidate.name, {
			name: candidate.name,
			description,
			reflected: reflectedAttributes.has(candidate.name),
			static: false,
			inherited: false,
			type,
			default:
				documentedDefault ??
				candidateDefault ??
				existingDefault ??
				defaultForAttribute(type),
		});
	};

	for (const tag of ts.getJSDocTags(parsed.classNode)) {
		const tagName = tag.tagName.text;
		if (tagName !== "attr" && tagName !== "attribute") {
			continue;
		}

		const candidate = parseAttributeTag(
			normalizeTagComment(tag.comment),
			tag,
			parsed.sourceFile,
		);

		addAttribute(candidate);
	}

	for (const member of parsed.classNode.members) {
		for (const tag of ts.getJSDocTags(member)) {
			const tagName = tag.tagName.text;
			if (tagName !== "attr" && tagName !== "attribute") {
				continue;
			}

			const candidate = parseAttributeTag(
				normalizeTagComment(tag.comment),
				tag,
				parsed.sourceFile,
			);
			const memberType =
				"type" in member && member.type !== undefined
					? member.type.getText(parsed.sourceFile)
					: "string";
			const hasExplicitAttributeType = /@(?:attr|attribute)\s+\{[^}]+\}/.test(
				tag.getFullText(parsed.sourceFile),
			);

			addAttribute(
				candidate,
				getSummary(member) || getJSDocDescription(member),
				hasExplicitAttributeType ? candidate.type : memberType,
			);
		}
	}

	for (const name of reflectedAttributes) {
		if (attributes.has(name) || name.startsWith("data-")) {
			continue;
		}

		const getter = parsed.classNode.members.find(
			(member): member is Ts.GetAccessorDeclaration =>
				ts.isGetAccessorDeclaration(member) &&
				ts.isIdentifier(member.name) &&
				(toKebabCase(member.name.text) === name ||
					member
						.getText(parsed.sourceFile)
						.includes(`getAttribute('${name}')`) ||
					member
						.getText(parsed.sourceFile)
						.includes(`hasAttribute('${name}')`)),
		);
		const getterSource = getter?.getText(parsed.sourceFile) ?? "";
		const type =
			getter?.type?.getText(parsed.sourceFile) ??
			(getterSource.includes(`hasAttribute('${name}')`) ? "boolean" : "string");
		const literalDefault =
			getterSource.match(
				/\?\?\s*(['"`][^'"`]*['"`]|true|false|-?\d+(?:\.\d+)?)/,
			)?.[1] ??
			getterSource.match(
				/:\s*(['"`][^'"`]*['"`]|true|false|-?\d+(?:\.\d+)?)\s*;/,
			)?.[1] ??
			(getterSource.includes(`hasAttribute('${name}')`) ? "false" : "");

		addAttribute({
			name,
			type,
			defaultValue: literalDefault,
			description:
				getter === undefined
					? inferAttributeDescription(name)
					: getSummary(getter) ||
						getJSDocDescription(getter) ||
						inferAttributeDescription(name),
		});
	}

	return [...attributes.values()].sort(compareByName);
}

function inferAttributeDescription(name: string): string {
	const words = name.replaceAll("-", " ");
	return `Controls the ${words}.`;
}

function defaultForAttribute(type: string): string {
	if (/(^|\W)boolean(\W|$)/.test(type)) {
		return "false";
	}

	if (/(^|\W)number(\W|$)/.test(type)) {
		return "0";
	}

	return '""';
}

function extractDefaults(parsed: ParsedSource): Map<string, string> {
	const defaults = new Map<string, string>();

	for (const tag of ts.getJSDocTags(parsed.classNode)) {
		if (tag.tagName.text !== "default") {
			continue;
		}

		const comment = normalizeTagComment(tag.comment);
		const [name, ...defaultParts] = comment.split(/\s+/);
		if (name !== undefined && defaultParts.length > 0) {
			defaults.set(name, defaultParts.join(" "));
		}
	}

	for (const member of parsed.classNode.members) {
		const memberName =
			member.name !== undefined && ts.isIdentifier(member.name)
				? toKebabCase(member.name.text)
				: "";
		const attributeName =
			getAttrTagName(member, parsed.sourceFile) ?? memberName;
		if (attributeName === "") {
			continue;
		}

		for (const tag of ts.getJSDocTags(member)) {
			if (tag.tagName.text !== "default") {
				continue;
			}

			const value = normalizeTagComment(tag.comment);
			if (value !== "") {
				defaults.set(attributeName, value);
			}
		}
	}

	return defaults;
}

function extractReflectedAttributes(parsed: ParsedSource): Set<string> {
	const reflected = new Set<string>();

	for (const member of parsed.classNode.members) {
		if (
			ts.isGetAccessorDeclaration(member) &&
			ts.isIdentifier(member.name) &&
			hasJSDocTag(member, "attr")
		) {
			const attrName =
				getAttrTagName(member, parsed.sourceFile) ??
				toKebabCase(member.name.text);
			reflected.add(attrName);
		}

		if (ts.isSetAccessorDeclaration(member)) {
			for (const attrName of findAttributeWrites(member)) {
				reflected.add(attrName);
			}
		}

		if (
			ts.isGetAccessorDeclaration(member) &&
			hasModifier(member, ts.SyntaxKind.StaticKeyword) &&
			ts.isIdentifier(member.name) &&
			member.name.text === "observedAttributes"
		) {
			for (const attrName of extractReturnedStringArray(member)) {
				reflected.add(attrName);
			}
		}
	}

	return reflected;
}

function getAttrTagName(
	node: Ts.Node,
	sourceFile: Ts.SourceFile,
): string | null {
	for (const tag of ts.getJSDocTags(node)) {
		if (tag.tagName.text !== "attr") {
			continue;
		}

		const namedTag = tag as Ts.JSDocTag & { name?: Ts.EntityName };
		const comment = normalizeTagComment(tag.comment);
		const typedName = comment.match(/^\{[^}]+\}\s+([a-z][a-z0-9-]*)/i)?.[1];
		const name =
			namedTag.name?.getText(sourceFile) ?? typedName ?? firstWord(comment);
		return name === "" ? null : name;
	}

	return null;
}

function findAttributeWrites(node: Ts.Node): string[] {
	const attributes: string[] = [];

	function visit(child: Ts.Node): void {
		if (ts.isCallExpression(child)) {
			const expression = child.expression;
			if (
				ts.isPropertyAccessExpression(expression) &&
				(expression.name.text === "setAttribute" ||
					expression.name.text === "removeAttribute") &&
				child.arguments[0] !== undefined &&
				ts.isStringLiteralLike(child.arguments[0])
			) {
				attributes.push(child.arguments[0].text);
			}
		}

		ts.forEachChild(child, visit);
	}

	visit(node);
	return attributes.filter((name) => name !== "" && !name.startsWith("data-"));
}

function extractReturnedStringArray(node: Ts.GetAccessorDeclaration): string[] {
	for (const statement of node.body?.statements ?? []) {
		if (
			!ts.isReturnStatement(statement) ||
			statement.expression === undefined
		) {
			continue;
		}

		if (!ts.isArrayLiteralExpression(statement.expression)) {
			continue;
		}

		return statement.expression.elements
			.filter(ts.isStringLiteralLike)
			.map((element) => element.text);
	}

	return [];
}

function parseAttributeTag(
	comment: string,
	tag: Ts.JSDocTag,
	sourceFile: Ts.SourceFile,
): AttributeCandidate {
	const typedMatch = comment.match(/^\{([^}]+)\}\s+(\S+)\s*(.*)$/);
	if (typedMatch !== null) {
		const remainder = parseAttributeRemainder(typedMatch[3] ?? "");
		return {
			name: typedMatch[2] ?? "",
			type: typedMatch[1] ?? "string",
			defaultValue: remainder.defaultValue,
			description: remainder.description,
		};
	}

	const sourceMatch = tag
		.getFullText(sourceFile)
		.match(
			/@(?:attr|attribute)\s+(?:\{([^}]+)\}\s+)?([a-z][a-z0-9-]*)\s*([\s\S]*?)(?=\n\s*\*\s*@|$)/i,
		);
	if (sourceMatch !== null) {
		const remainder = parseAttributeRemainder(
			(sourceMatch[3] ?? "")
				.replace(/\n\s*\*\s?/g, "\n")
				.replace(/\s*\*\/$/, "")
				.replace(/^\*$/, "")
				.trim(),
		);
		return {
			name: sourceMatch[2] ?? "",
			type: sourceMatch[1] ?? "string",
			defaultValue: remainder.defaultValue,
			description: remainder.description,
		};
	}

	const namedTag = tag as Ts.JSDocTag & { name?: Ts.EntityName };
	const name = namedTag.name?.getText(sourceFile) ?? firstWord(comment);
	const explicitType = tag
		.getFullText(sourceFile)
		.match(/@(?:attr|attribute)\s+\{([^}]+)\}/)?.[1];
	return {
		name,
		type: explicitType ?? getTagType(tag, sourceFile) ?? "string",
		defaultValue: "",
		description: dropFirstWord(comment),
	};
}

function parseAttributeRemainder(value: string): {
	defaultValue: string;
	description: string;
} {
	const normalized = value.trim();
	const compact = normalized.match(
		/^=\s*((?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\S+))\s+-\s+([\s\S]*)$/,
	);
	if (compact === null) {
		return {
			defaultValue: "",
			description: normalized.replace(/^[-–—]\s*/, ""),
		};
	}
	return {
		defaultValue: compact[1] ?? "",
		description: (compact[2] ?? "").trim(),
	};
}

function extractMethods(parsed: ParsedSource): ComponentApiMethod[] {
	const methods: ComponentApiMethod[] = [];

	for (const member of parsed.classNode.members) {
		if (!ts.isMethodDeclaration(member) || !ts.isIdentifier(member.name)) {
			continue;
		}

		if (
			hasModifier(member, ts.SyntaxKind.PrivateKeyword) ||
			hasModifier(member, ts.SyntaxKind.ProtectedKeyword)
		) {
			continue;
		}

		if (
			hasModifier(member, ts.SyntaxKind.StaticKeyword) ||
			hasJSDocTag(member, "internal")
		) {
			continue;
		}

		if (
			[
				"connectedCallback",
				"disconnectedCallback",
				"attributeChangedCallback",
			].includes(member.name.text)
		) {
			continue;
		}

		methods.push({
			name: renderMethodSignature(member, parsed.sourceFile),
			inherited: false,
			description:
				getSummary(member) ||
				getJSDocDescription(member) ||
				inferMethodDescription(member.name.text),
		});
	}

	return methods.sort(compareByName);
}

function extractEvents(parsed: ParsedSource): ComponentApiEvent[] {
	const descriptions = extractEventDescriptions(parsed.classNode);
	const details = extractEventDetails(parsed.classNode);
	const events = new Map<string, ComponentApiEvent>();

	for (const [name, description] of descriptions) {
		events.set(name, {
			name,
			description: description || inferEventDescription(name),
			detail: details.get(name) ?? "void",
		});
	}

	function visit(node: Ts.Node): void {
		if (
			ts.isNewExpression(node) &&
			node.expression.getText(parsed.sourceFile) === "CustomEvent"
		) {
			const name = getStringLiteralArgument(node, 0);
			if (name !== undefined) {
				events.set(name, {
					name,
					description: descriptions.get(name) || inferEventDescription(name),
					detail:
						details.get(name) ??
						inferCustomEventDetail(node, parsed.sourceFile),
				});
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(parsed.classNode);
	return [...events.values()].sort(compareByName);
}

function extractEventDescriptions(
	classNode: Ts.ClassDeclaration,
): Map<string, string> {
	const descriptions = new Map<string, string>();

	for (const tag of ts.getJSDocTags(classNode)) {
		if (tag.tagName.text !== "event") {
			continue;
		}

		const comment = normalizeTagComment(tag.comment);
		const name = firstWord(comment);
		if (name !== "") {
			descriptions.set(name, dropFirstWord(comment));
		}
	}

	return descriptions;
}

function extractEventDetails(
	classNode: Ts.ClassDeclaration,
): Map<string, string> {
	const details = new Map<string, string>();

	for (const tag of ts.getJSDocTags(classNode)) {
		if (tag.tagName.text !== "eventdetail") {
			continue;
		}

		const comment = normalizeTagComment(tag.comment);
		const name = firstWord(comment);
		const detail = dropFirstWord(comment);
		if (name !== "" && detail !== "") {
			details.set(name, detail);
		}
	}

	return details;
}

function extractCssProperties(
	parsed: ParsedSource,
	cssText: string,
	componentName: string,
): ComponentApiCssProperty[] {
	const descriptions = extractCssPropertyDescriptions(parsed.classNode);
	const properties = new Map<string, ComponentApiCssProperty>();
	const componentPrefix = `--tp-${componentName}-`;

	for (const variable of collectCssVariables(
		`${parsed.sourceText}\n${cssText}`,
	)) {
		if (
			!variable.name.startsWith(componentPrefix) &&
			!descriptions.has(variable.name)
		) {
			continue;
		}

		properties.set(variable.name, {
			name: variable.name,
			default: variable.defaultValue,
			description:
				descriptions.get(variable.name) ||
				inferCssPropertyDescription(variable.name, componentName),
		});
	}

	for (const [name, description] of descriptions) {
		const property = properties.get(name);
		if (property === undefined) {
			properties.set(name, {
				name,
				default: '""',
				description,
			});
			continue;
		}

		property.description = description;
		if (property.default === "") {
			property.default = '""';
		}
	}

	return [...properties.values()].sort(compareByName);
}

function wordsFromIdentifier(value: string): string {
	return value
		.replace(/^--tp-[a-z0-9-]+-/, "")
		.replace(/^tp-/, "")
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replaceAll("-", " ")
		.trim()
		.toLowerCase();
}

function inferMethodDescription(name: string): string {
	const words = wordsFromIdentifier(name);
	const patterns: Array<[RegExp, string]> = [
		[/^add /, "Adds "],
		[/^delete /, "Deletes "],
		[/^remove /, "Removes "],
		[/^get /, "Returns "],
		[/^set /, "Sets "],
		[/^export /, "Exports "],
		[/^import /, "Imports "],
		[/^insert /, "Inserts "],
		[/^register /, "Registers "],
		[/^unregister /, "Unregisters "],
		[/^toggle /, "Toggles "],
		[/^reset /, "Resets "],
		[/^find /, "Finds "],
		[/^move /, "Moves "],
		[/^read /, "Reads "],
	];
	for (const [pattern, replacement] of patterns) {
		if (pattern.test(words)) return `${words.replace(pattern, replacement)}.`;
	}
	return `${words.charAt(0).toUpperCase()}${words.slice(1)}.`;
}

function inferEventDescription(name: string): string {
	return `Emitted when ${wordsFromIdentifier(name)} occurs.`;
}

function inferCssPropertyDescription(
	name: string,
	componentName: string,
): string {
	return `Controls the ${wordsFromIdentifier(name.replace(`--tp-${componentName}-`, ""))}.`;
}

function extractCssPropertyDescriptions(
	classNode: Ts.ClassDeclaration,
): Map<string, string> {
	const descriptions = new Map<string, string>();

	for (const tag of ts.getJSDocTags(classNode)) {
		if (tag.tagName.text !== "cssprop" && tag.tagName.text !== "cssproperty") {
			continue;
		}

		const comment = normalizeTagComment(tag.comment);
		const name = firstWord(comment);
		if (name.startsWith("--")) {
			descriptions.set(name, dropFirstWord(comment));
		}
	}

	return descriptions;
}

function collectCssVariables(sourceText: string): CssVariable[] {
	const declarations = collectCssDeclarations(sourceText);
	const variables = new Map<string, CssVariable>();
	let searchIndex = 0;

	for (const declaration of declarations) {
		variables.set(declaration.name, declaration);
	}

	while (searchIndex < sourceText.length) {
		const start = sourceText.indexOf("var(", searchIndex);
		if (start === -1) {
			break;
		}

		const contentStart = start + "var(".length;
		const end = findClosingParen(sourceText, contentStart);
		if (end === -1) {
			searchIndex = contentStart;
			continue;
		}

		const content = sourceText.slice(contentStart, end);
		const [namePart, fallbackPart = ""] = splitTopLevelComma(content);
		const name = namePart.trim();
		if (name.startsWith("--") && !variables.has(name)) {
			variables.set(name, {
				name,
				defaultValue: normalizeCssFallback(fallbackPart),
			});
		}

		searchIndex = contentStart;
	}

	return [...variables.values()];
}

function collectCssDeclarations(sourceText: string): CssVariable[] {
	const variables: CssVariable[] = [];
	const pattern = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;{}]+);/g;

	for (const match of sourceText.matchAll(pattern)) {
		const name = match[1] ?? "";
		const value = match[2] ?? "";
		if (name !== "") {
			variables.push({
				name,
				defaultValue: normalizeCssFallback(value),
			});
		}
	}

	return variables;
}

function inferCustomEventDetail(
	node: Ts.NewExpression,
	sourceFile: Ts.SourceFile,
): string {
	const options = node.arguments?.[1];
	if (options === undefined || !ts.isObjectLiteralExpression(options)) {
		return "void";
	}

	const detail = options.properties.find(
		(property): property is Ts.PropertyAssignment => {
			return (
				ts.isPropertyAssignment(property) &&
				getPropertyName(property.name, sourceFile) === "detail"
			);
		},
	);

	if (detail === undefined) {
		return "void";
	}

	if (!ts.isObjectLiteralExpression(detail.initializer)) {
		return inferExpressionType(detail.initializer, "detail");
	}

	const properties = detail.initializer.properties.flatMap((property) => {
		if (ts.isPropertyAssignment(property)) {
			const name = getPropertyName(property.name, sourceFile);
			return [`${name}: ${inferExpressionType(property.initializer, name)}`];
		}

		if (ts.isShorthandPropertyAssignment(property)) {
			const name = property.name.text;
			return [`${name}: ${inferExpressionType(property.name, name)}`];
		}

		return [];
	});

	return properties.length === 0 ? "{}" : `{ ${properties.join("; ")} }`;
}

function inferExpressionType(
	expression: Ts.Expression,
	propertyName: string,
): string {
	if (ts.isStringLiteralLike(expression)) {
		return JSON.stringify(expression.text);
	}

	if (ts.isNumericLiteral(expression)) {
		return "number";
	}

	if (
		expression.kind === ts.SyntaxKind.TrueKeyword ||
		expression.kind === ts.SyntaxKind.FalseKeyword
	) {
		return "boolean";
	}

	switch (propertyName) {
		case "direction":
			return '"before" | "after"';
		case "filename":
		case "message":
		case "value":
			return "string";
		case "source":
			return '"api" | "script" | "src" | "value"';
		case "valueLength":
			return "number";
		default:
			return "unknown";
	}
}

function renderMethodSignature(
	method: Ts.MethodDeclaration,
	sourceFile: Ts.SourceFile,
): string {
	const name = method.name.getText(sourceFile);
	const typeParameters = method.typeParameters
		?.map((parameter) => parameter.getText(sourceFile))
		.join(", ");
	const parameters = method.parameters
		.map((parameter) => parameter.getText(sourceFile))
		.join(", ");
	const returnType = method.type?.getText(sourceFile) ?? "void";
	const genericPart = typeParameters === undefined ? "" : `<${typeParameters}>`;
	return `${name}${genericPart}(${parameters}): ${returnType}`;
}

function getSummary(node: Ts.Node): string {
	for (const tag of ts.getJSDocTags(node)) {
		if (tag.tagName.text === "summary") {
			return normalizeTagComment(tag.comment);
		}
	}

	return "";
}

function getJSDocDescription(node: Ts.Node): string {
	const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc);
	const doc = docs[0];
	if (doc === undefined) {
		return "";
	}

	return normalizeTagComment(doc.comment);
}

function getTagType(
	tag: Ts.JSDocTag,
	sourceFile: Ts.SourceFile,
): string | undefined {
	const typedTag = tag as Ts.JSDocTag & {
		typeExpression?: Ts.JSDocTypeExpression;
	};
	return typedTag.typeExpression?.type.getText(sourceFile);
}

function getStringLiteralArgument(
	node: Ts.NewExpression,
	index: number,
): string | undefined {
	const argument = node.arguments?.[index];
	return argument !== undefined && ts.isStringLiteralLike(argument)
		? argument.text
		: undefined;
}

function getPropertyName(
	name: Ts.PropertyName,
	sourceFile: Ts.SourceFile,
): string {
	if (
		ts.isIdentifier(name) ||
		ts.isStringLiteralLike(name) ||
		ts.isNumericLiteral(name)
	) {
		return name.text;
	}

	return name.getText(sourceFile);
}

function hasModifier(node: Ts.Node, kind: Ts.SyntaxKind): boolean {
	return (
		ts.canHaveModifiers(node) &&
		(ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === kind)
	);
}

function hasJSDocTag(node: Ts.Node, tagName: string): boolean {
	return ts.getJSDocTags(node).some((tag) => tag.tagName.text === tagName);
}

function normalizeTagComment(comment: Ts.JSDocTag["comment"]): string {
	if (comment === undefined) {
		return "";
	}

	if (typeof comment === "string") {
		return comment.trim();
	}

	return comment
		.map((part) => part.text)
		.join("")
		.trim();
}

function firstWord(value: string): string {
	return value.trim().split(/\s+/)[0] ?? "";
}

function dropFirstWord(value: string): string {
	return value
		.trim()
		.replace(/^\S+\s*/, "")
		.trim();
}

function normalizeCssFallback(value: string): string {
	return value.trim().replace(/\s+/g, " ");
}

function findClosingParen(value: string, startIndex: number): number {
	let depth = 1;

	for (let index = startIndex; index < value.length; index += 1) {
		const char = value[index];
		if (char === "(") {
			depth += 1;
		} else if (char === ")") {
			depth -= 1;
			if (depth === 0) {
				return index;
			}
		}
	}

	return -1;
}

function splitTopLevelComma(value: string): [string, string?] {
	let depth = 0;

	for (let index = 0; index < value.length; index += 1) {
		const char = value[index];
		if (char === "(") {
			depth += 1;
		} else if (char === ")") {
			depth -= 1;
		} else if (char === "," && depth === 0) {
			return [value.slice(0, index), value.slice(index + 1)];
		}
	}

	return [value];
}

function toKebabCase(value: string): string {
	return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function compareByName<T extends { name: string }>(left: T, right: T): number {
	return left.name.localeCompare(right.name);
}

async function readOptionalFile(filePath: string): Promise<string> {
	try {
		return await fs.readFile(filePath, "utf8");
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			error.code === "ENOENT"
		) {
			return "";
		}

		throw error;
	}
}
