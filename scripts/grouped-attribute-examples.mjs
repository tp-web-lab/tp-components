import {
	cpSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { extname, resolve } from "node:path";
import { parseFragment, serialize } from "parse5";
import { attributeControl } from "./interactive-attribute-examples.mjs";

const root = resolve(import.meta.dirname, "..");
const walk = (node) => [
	node,
	...(node.content?.childNodes ?? node.childNodes ?? []).flatMap(walk),
];
const attr = (node, name) =>
	node.attrs?.find((item) => item.name === name)?.value;
const escapeHtml = (value) =>
	String(value)
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("<", "&lt;");

/** Read published defaults without turning quoted strings into prose punctuation. */
export function attributeSettings(component) {
	const manifest = JSON.parse(
		readFileSync(
			`${root}/src/components/${component}/${component}.json`,
			"utf8",
		),
	);
	return manifest.attributes
		.map((attribute) => {
			let value = attribute.default ?? "";
			try {
				value = JSON.parse(value);
			} catch {
				value = String(value).replace(/^'(.*)'$/, "$1");
			}
			const control = attributeControl(component, attribute);
			if (component === "toolbar" && attribute.name === "placement") {
				return {
					name: attribute.name, value: "", description: attribute.description,
					kind: "enum", values: ["", "top", "bottom", "start", "end"],
					choices: [
						{ label: "Automatic (top / start)", value: "" },
						...["top", "bottom", "start", "end"].map((value) => ({ label: value, value })),
					],
				};
			}
			if (control?.kind === "boolean") value = value === true;
			return {
				name: attribute.name,
				value,
				description: attribute.description,
				...control,
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));
}

/** Only curated local fixtures are exposed by resource-loading settings. */
function fileChoices(component, setting, examples) {
	const directory = `${root}/public/docs/components/${component}/examples`;
	const registry = `${directory}/attributes-fixtures.json`;
	const saved = existsSync(registry)
		? JSON.parse(readFileSync(registry, "utf8"))
		: {};
	if (saved[setting.name]) return saved[setting.name];
	const values = examples.flatMap((example) =>
		walk(parseFragment(example.source))
			.filter((node) => node.tagName === `tp-${component}`)
			.map((node) => attr(node, setting.name))
			.filter(Boolean),
	);
	const localPath = (value) => {
		const url = new URL(
			value,
			`http://local/docs/components/${component}/examples/`,
		);
		if (url.pathname.startsWith("/medias/"))
			url.pathname = `/docs${url.pathname}`;
		if (url.origin !== "http://local") return null;
		const path = resolve(
			root,
			url.pathname.startsWith("/src/")
				? `.${url.pathname}`
				: `public${url.pathname}`,
		);
		return path.startsWith(`${root}/`) && existsSync(path) ? path : null;
	};
	const candidates = [...new Set(values)].map(localPath).filter(Boolean);
	if (!candidates.length)
		throw new Error(
			`${component}/${setting.name}: provide two reviewed local fixtures before migration`,
		);
	// The existing working example is authoritative. A second verified copy is
	// preferable to inventing another format or downloading an arbitrary resource.
	const choices = [{ label: "Default", value: setting.value }];
	[0, 1].forEach((index) => {
		const source = candidates[index] ?? candidates[0];
		const folder = statSync(source).isDirectory();
		if (source === `${root}/public/docs`) {
			choices.push({
				label: `file${index + 1}`,
				value:
					index === 0
						? "/docs/components/markup-multi-pages/docs"
						: "/docs/components/markdown-multi-pages/docs",
			});
			return;
		}
		const name = `attributes-${setting.name}-file${index + 1}${folder ? "" : extname(source)}`;
		const destination = `${directory}/${name}`;
		if (!existsSync(destination)) {
			if (folder && destination.startsWith(`${source.replace(/\/$/, "")}/`)) {
				mkdirSync(destination, { recursive: true });
				readdirSync(source)
					.filter(
						(name) =>
							!name.startsWith("attributes") && !name.startsWith("examples."),
					)
					.forEach((name) => {
						cpSync(`${source}/${name}`, `${destination}/${name}`, {
							recursive: true,
						});
					});
			} else cpSync(source, destination, { recursive: folder });
		}
		choices.push({
			label: `file${index + 1}`,
			value: `/docs/components/${component}/examples/${name}`,
		});
	});
	choices.push({
		label: "file-unknown",
		value: `/docs/components/${component}/examples/attributes-${setting.name}-file-unknown${extname(candidates[0])}`,
	});
	saved[setting.name] = choices;
	writeFileSync(registry, `${JSON.stringify(saved, null, 2)}\n`);
	return choices;
}

/** Build one isolated, restartable preview while retaining the author's content. */
export function groupedAttributeExample(component, examples) {
	const settings = attributeSettings(component);
	const basic = examples.find((example) => example.label === "Basic usage");
	if (!basic) throw new Error(`${component}: missing Basic usage`);
	const tree = parseFragment(
		component === "lsystem"
			? '<p>Choose a preset or a reviewed source file. A file takes precedence over the preset; choose Default for src to return to presets. Empty iterations, angle and step use the definition values. Playback controls explore the selected definition.</p><tp-lsystem></tp-lsystem>'
		: component === "toolbar"
			? `<p>Choose top or bottom for a horizontal toolbar, and start or end for a vertical toolbar. The surrounding grid places the toolbar at the chosen edge; placement sets its sticky edge, not its position in normal document flow.</p>
<link rel="stylesheet" href="/docs/components/toolbar/examples/preview.css">
<tp-box class="toolbar-placement-preview">
${basic.source.match(/<tp-toolbar\b[^>]*>[\s\S]*?<\/tp-toolbar>/)?.[0] ?? basic.source}
<p class="toolbar-preview-content">Document area: compare the toolbar position around this content.</p>
</tp-box>`
		: component === "cluster"
			? `<p>Compare items of different heights. Select align="stretch" to stretch the shorter boxes to the height of the SVG box. In this flex layout, justify="stretch" behaves like flex-start; try space-between to spread the boxes horizontally.</p>
<tp-box>
  <tp-cluster>
    <tp-box>Alpha</tp-box>
    <tp-box><tp-icon name="logo-tp" size="6em" role="img" aria-label="tp-components logo"></tp-icon></tp-box>
    <tp-box>Gamma</tp-box>
  </tp-cluster>
</tp-box>`
			: component === "sidebar"
				? `${basic.source}\n<script src="/docs/components/sidebar/examples/preview.js"></script>`
				: component === "slider"
					? `<p>Scroll to reveal all eight chapter panels. Try changing item-width and gap. Enable scrollbar to show it, then change its colors or disable it again. The preview is deliberately narrow so scrolling is needed at the default settings. Scrollbar visibility and styling also depend on browser and operating-system preferences.</p>
<tp-box style="max-inline-size: 28rem">
  <tp-slider>
    ${["Getting started", "Writing content", "Adding interactions", "Choosing layouts", "Using media", "Checking accessibility", "Testing components", "Publishing"].map((title, index) => `<tp-box>Chapter ${index + 1}: ${title}</tp-box>`).join("\n    ")}
  </tp-slider>
</tp-box>`
					: component === "stack"
						? `<p>Enable recursive to add spacing between the three lines inside box 1. Set split-after to 1 or 2 to push the following boxes toward the bottom; clear it to remove the flexible split. The stack has a fixed height so the extra space is visible.</p>
<tp-box>
  <tp-stack style="height: 30rem; --stack-gap: 1rem">
    <tp-box>
      <p>1. Preparation: write a draft.</p>
      <p>Review the content.</p>
      <p>Check the illustrations.</p>
    </tp-box>
    <tp-box>2. Publication: release the document.</tp-box>
    <tp-box>3. Follow-up: collect feedback.</tp-box>
  </tp-stack>
</tp-box>`
						: component === "switcher"
							? `<p>Drag the divider to change the space available to the switcher in the left panel without resizing the browser window. You can also focus the divider and use the arrow keys. Below threshold, the five panels form one column; above it, max-horizontal limits the number of panels per row.</p>
<tp-splitter position="75%">
  <dl>
    <dt>start</dt>
    <dd>${basic.source}</dd>
    <dt>end</dt>
    <dd><tp-box>Move the divider left to narrow the switcher, or right to widen it.</tp-box></dd>
  </dl>
</tp-splitter>`
							: basic.source,
	);
	const targets = walk(tree).filter(
		(node) => node.tagName === `tp-${component}`,
	);
	if (!targets.length)
		throw new Error(`${component}: missing declarative preview`);
	const target = targets[0];
	// Provide a real ID target for the speech component's for control.
	if (component === "text-to-speech") {
		const helper = parseFragment('<tp-typewriting id="attributes-spoken-text" speed="0">This linked text follows the spoken words.</tp-typewriting><article id="attributes-reading"><p>This ordinary article is read without changing its appearance.</p></article>');
		for (const node of helper.childNodes) node.parentNode = tree;
		tree.childNodes.unshift(...helper.childNodes);
	}
	// Keep a visible inline expression when the value control starts at its empty default.
	if (component === "math" && !target.childNodes.length) {
		const expression = attr(target, "value") ?? "";
		target.childNodes.push({ nodeName: "#text", value: expression, parentNode: target });
	}
	// Keep only one instance of the tested component; preserve unrelated helpers.
	targets.slice(1).forEach((node) => {
		node.parentNode.childNodes = node.parentNode.childNodes.filter(
			(child) => child !== node,
		);
	});
	target.attrs = target.attrs.filter(
		(item) => !settings.some((setting) => setting.name === item.name),
	);
	target.attrs.push({ name: "data-attributes-preview", value: "" });
	settings.forEach((setting) => {
		if (
			[
				"src",
				"repository",
				"data-tp-help-src",
				"data-tp-markdown-source",
			].includes(setting.name) ||
			(component === "memory" && setting.name === "back")
		) {
			setting.kind = "file";
			setting.choices = fileChoices(component, setting, examples);
		}
		if (setting.name === "open-indexes") {
			setting.kind = "indexes";
			setting.values = Array.from(
				{
					length: Math.max(
						1,
						(target.childNodes ?? [])
							.filter((node) => node.tagName === "dl")
							.flatMap((node) => node.childNodes ?? [])
							.filter((node) => node.tagName === "dt").length,
					),
				},
				(_, i) => String(i),
			);
		}
		if (
			setting.kind === "enum" &&
			!setting.values.includes(String(setting.value))
		)
			setting.values.unshift(String(setting.value));
	});
	const config = {
		component,
		settings,
		source: serialize(tree),
		fullWindow: /multi-(pages|slides)$/.test(component),
	};
	const directory = `${root}/public/docs/components/${component}/examples`;
	mkdirSync(directory, { recursive: true });
	writeFileSync(
		`${directory}/attributes.js`,
		`// Generated by scripts/standardize-component-examples.mjs.\nimport { initializeAttributes } from "/docs/components/_shared/component-attributes.js";\nawait initializeAttributes(${JSON.stringify(config)});\n`,
	);
	const bools = settings.filter((setting) => setting.kind === "boolean");
	const lists = settings.filter((setting) =>
		["enum", "file", "indexes"].includes(setting.kind),
	);
	const fields = settings.filter((setting) => !setting.kind);
	return `<p>Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.</p>
${["note", "biblio", "glossary", "ref", "listof"].includes(component) ? `<p>${component === "ref" ? "Enter ^detail in href to resolve the note." : component === "listof" ? "Enter figure in selector to list the two figures." : "Enter example in ref to connect the inline reference to this entry."} Clear the field to return to the empty default.</p>` : ""}
${component === "code-comment" ? '<p>The preview code editor has <code>id="commented-function"</code>. Enter <code>commented-function</code> in <code>for</code> to link the comments, then enable <code>open</code> to display the list. Hover the numbered code markers to read their tooltips even when the list is hidden.</p>' : ""}
${component === "python-playground" ? '<p>Default displays a greeting in the HTML document and the console. For src, file1 displays 6 × 7 = 42; file2 displays the squares of 1 to 5. For repository, dir1 calculates 2 + 3; dir2 imports rectangle_area from geometry.py into main.py and displays the area of a rectangle. Both directories include index.html. Edit the Python files and press Run to update the result. Choose Default for src before testing repository: a nonempty src takes precedence. file-unknown and dir-unknown test loading errors: the console displays only the error, and the last valid project is retained.</p>' : ""}
<tp-stack>
${
	bools.length
		? `<tp-checkbox-list id="attributes-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value="${bools
				.map((setting, index) => (setting.value ? index + 1 : null))
				.filter(Boolean)
				.join(
					",",
				)}"><ul>${bools.map((setting) => `<li>${escapeHtml(setting.name)}</li>`).join("")}</ul></tp-checkbox-list>`
		: ""
}
${lists
	.map((setting) => {
		const tag =
			setting.kind === "indexes" ? "tp-checkbox-list" : "tp-radio-list";
		const choices =
			setting.choices ??
			setting.values.map((value) => ({
				label: value || "Default (empty)",
				value,
			}));
		const selected =
			setting.kind === "indexes"
				? ""
				: String(
						Math.max(
							0,
							choices.findIndex(
								(choice) => String(choice.value) === String(setting.value),
							),
						) + 1,
					);
		return `<${tag} data-setting="${setting.name}" label="${setting.name}" label-position="top" orientation="horizontal" value="${selected}"><ul>${choices.map((choice) => `<li>${escapeHtml(choice.label)}</li>`).join("")}</ul></${tag}>`;
	})
	.join("\n")}
<tp-cluster>${fields.map((setting) => component === "post-it" && setting.name === "rotation"
 ? `<tp-numberfield data-setting="rotation" label="rotation" value="${escapeHtml(setting.value)}" min="-12" max="12" step="1" range></tp-numberfield>`
 : component === "post-it" && setting.name === "opacity"
 ? `<tp-numberfield data-setting="opacity" label="opacity" value="${escapeHtml(setting.value)}" min="0" max="1" step="0.05" range></tp-numberfield>`
 : `<tp-textfield data-setting="${setting.name}" label="${setting.name}" value="${escapeHtml(setting.value)}" placeholder="${escapeHtml(setting.value)}" clearable></tp-textfield>`).join("\n")}</tp-cluster>
<tp-button-group><tp-button id="attributes-reset" type="button">Reset defaults</tp-button><tp-button id="attributes-reload" type="button">Reload preview</tp-button></tp-button-group>
</tp-stack>
<tp-divider></tp-divider>
<h3>Preview</h3>
<tp-iframe id="attributes-frame" title="${component} attribute preview" style="height: ${config.fullWindow ? "36" : "24"}rem; display: flow-root; inline-size: auto;"></tp-iframe>
<tp-callout id="attributes-status" variant="info" heading="Preview status">Preparing the preview…</tp-callout>
${settings.some((setting) => setting.kind === "file") ? component === "python-playground" ? "<p>Resource controls offer only Default, two reviewed local fixtures and one missing resource: file1, file2 and file-unknown for src; dir1, dir2 and dir-unknown for repository. No arbitrary path can be entered.</p>" : component === "skeleton" ? "<p>The src control offers the inline example, two reviewed HTML documents and a missing file to test the warning. A nonempty src takes precedence over value; clear src to test a literal HTML value containing a heading and a paragraph. HTML is source data: it is not executed.</p>" : component === "avatar" ? "<p>The src control selects no image, the tp-components logo, a portrait illustration or a deliberately missing image. A missing image displays the initials, or the icon if no initials are set. These choices only restrict this demo: the component accepts an image URL in src.</p>" : "<p>File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.</p>" : ""}
<script type="module" src="/docs/components/${component}/examples/attributes.js"></script>`;
}
