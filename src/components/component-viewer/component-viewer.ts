/**
 * @module components/component-viewer
 * @summary API tables and interactive attribute controls for a component preview.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-checkbox-list
 * @summary Transforms a list into a group of checkboxes.
 */
/**
 * @tp-dependency tp-cluster
 * @summary Flexible cluster layout component.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-datefield
 * @summary Native date field with labels, constraints, picker access, and clearing.
 */
/**
 * @tp-dependency tp-html-viewer
 * @summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
/**
 * @tp-dependency tp-tabs
 * @summary Accessible tabs component with keyboard and reorder support.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @tp-dependency tp-timefield
 * @summary Native time field with labels, constraints, picker access, and clearing.
 */
// tp-docgen:dependencies:end

import { type DefaultTreeAdapterTypes, parseFragment } from "parse5";
import { createHelpButtonTable } from "../../utilities/help-buttons.js";
import { latexMarkup } from "../../utilities/latex-markup.js";
import { nativeMarkup } from "../../utilities/native-markup.js";
import {
	getComponentSourceBaseUrl,
	resolveComponentSourceUrl,
} from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../icon/icon.js";
import "../checkbox-list/checkbox-list.js";
import "../radio-list/radio-list.js";
import "../textfield/textfield.js";
import "../numberfield/numberfield.js";
import "../datefield/datefield.js";
import "../timefield/timefield.js";
import "../cluster/cluster.js";
import "../tabs/tabs.js";
import "../html-viewer/html-viewer.js";
import "../icon-button/icon-button.js";
import "../code-editor/code-editor.js";
import { formatHelpKeyboard } from "../../utilities/help-keyboard.js";
import { renderMarkdownInto } from "../markdown/markdown.js";
import style from "./component-viewer.css?inline";
import catalog from "./controls.json";

type ApiItem = {
	name: string;
	type?: string;
	default?: string;
	description?: string;
	detail?: string;
	inherited?: boolean;
	emitted?: boolean;
};
type Api = {
	classname?: string;
	userHelp?: {
		interactions?: string;
		commands?: { button: string; description: string; shortcut: string }[];
	};
	tagname: string;
	attributes: ApiItem[];
	methods?: ApiItem[];
	events?: ApiItem[];
	cssproperties?: ApiItem[];
	examples?: { code: string }[];
};
type Choices = {
	values?: string[];
	choices?: { label: string; value: string }[];
};
type ValueControl = HTMLElement & { value: string };
const controlsCatalog: Record<string, Record<string, Choices>> = catalog;
const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll('"', "&quot;");
/** Shorten boolean attributes without touching text, scripts or quoted values. */
function booleanHtmlSource(
	source: string,
	tag: string,
	attributes: ApiItem[],
): string {
	const names = new Set(
		attributes
			.filter((item) => item.type === "boolean")
			.map((item) => item.name),
	);
	const edits: { start: number; end: number; name: string }[] = [];
	const visit = (node: DefaultTreeAdapterTypes.Node): void => {
		if ("tagName" in node && node.tagName === tag) {
			for (const attribute of node.attrs) {
				const location = node.sourceCodeLocation?.attrs?.[attribute.name];
				if (names.has(attribute.name) && attribute.value === "" && location) {
					edits.push({
						start: location.startOffset,
						end: location.endOffset,
						name: attribute.name,
					});
				}
			}
		}
		if ("childNodes" in node) node.childNodes.forEach(visit);
		if ("content" in node) visit(node.content);
	};
	visit(parseFragment(source, { sourceCodeLocationInfo: true }));
	for (const edit of edits.sort((left, right) => right.start - left.start)) {
		source = source.slice(0, edit.start) + edit.name + source.slice(edit.end);
	}
	return source;
}
function defaultValue(item: ApiItem): string {
	const value = item.default ?? "";
	try {
		return String(JSON.parse(value));
	} catch {
		return value.replace(/^'(.*)'$/, "$1");
	}
}
function description(item: ApiItem): string {
	const text = item.description?.trim() ?? "";
	const name = item.name.replace(/\(.*$/, "");
	const words = name
		.replace(/^--tp-[a-z]+-/, "")
		.replace(/^tp-/, "")
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replaceAll("-", " ")
		.toLowerCase();
	if (
		!text ||
		/^(?:API documentation summary|Event|Method|Property)\.?$/i.test(text) ||
		/^Attribute [`'"].+[`'"]\.$/i.test(text) ||
		text.toLowerCase() === `controls the ${words}.` ||
		(text.startsWith("Controls the ") &&
			name.endsWith(`-${text.slice(13, -1).replaceAll(" ", "-")}`)) ||
		text.toLowerCase() === `${words}.` ||
		text.toLowerCase() === `emitted when ${words} occurs.`
	)
		return "—";
	return text;
}
function table(
	title: string,
	items: ApiItem[],
	columns: (keyof ApiItem)[],
): string {
	const body = !items.length
		? `<p>No ${title.toLowerCase()} declared by this component.</p>`
		: `<div class="tp-component-viewer-table" data-api-table="${title.toLowerCase()}"><table><thead><tr>${columns.map((key) => `<th scope="col">${key[0]?.toUpperCase()}${key.slice(1)}</th>`).join("")}</tr></thead><tbody>${items.map((item) => `<tr>${columns.map((key) => `<td data-api-column="${key}">${escapeHtml(key === "description" ? description(item) : String(item[key] ?? ""))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
	return `<dt>${title}</dt><dd>${body}</dd>`;
}
function commandsTable(api: Api): string {
	const commands = api.userHelp?.commands;
	const content = commands?.length
		? `<p>Mod = ⌘ on macOS, Ctrl elsewhere. — = no assigned shortcut.</p><div class="tp-component-viewer-table"><table><thead><tr><th scope="col">Button / command</th><th scope="col">Action</th><th scope="col">Shortcut</th></tr></thead><tbody>${commands.map((command) => `<tr><td>${escapeHtml(command.button)}</td><td>${escapeHtml(command.description)}</td><td>${escapeHtml(command.shortcut)}</td></tr>`).join("")}</tbody></table></div>`
		: `<p>${commands ? "No component-specific commands." : "No component-specific commands documented."}</p>`;
	return `<dt>User interactions</dt><dd><div data-component-interactions><tp-tabs data-component-interaction-tabs><dl><dt>Buttons</dt><dd><div data-component-buttons>${content}</div></dd><dt>Mouse</dt><dd><div data-component-mouse></div></dd><dt>Keyboard</dt><dd><div data-component-keyboard></div></dd></dl></tp-tabs></div></dd>`;
}

function fieldTag(item: ApiItem): string {
	switch (item.type?.toLowerCase()) {
		case "number":
		case "integer":
			return "tp-numberfield";
		case "date":
			return "tp-datefield";
		case "time":
			return "tp-timefield";
		default:
			return "tp-textfield";
	}
}

/**
 * The custom `<tp-component-viewer>` element documents a component and lets readers try its attributes on a live example.
 *
 * @tagname tp-component-viewer
 * @summary Documents a component and lets readers try its attributes on a live example.
 * @attr {string} tag = "" - Component tag; inferred from supplied HTML when omitted.
 * @attr {string} src = "" - HTML example file, resolved relative to the author document.
 * @attr {string} api-src = "" - Optional component API manifest URL.
 * @example
 * <tp-component-viewer tag="tp-button"></tp-component-viewer>
 */
export class TpComponentViewer extends TpBase {
	private inlineSource: string | null = null;
	private source = "";
	private contentOverride: string | null = null;
	private baseUrl = "";
	private componentTag = "";
	private activePanel: "Doc" | "Demo" | "API" = "Doc";
	private api: Api | null = null;
	private values = new Map<string, string | null>();
	private cleared = new Set<string>();
	private revision = 0;
	private request: AbortController | null = null;
	private previewObserver: MutationObserver | null = null;
	private preview: Element | null = null;

	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "tag", "src", "api-src"];
	}
	public get tag(): string {
		return this.getAttribute("tag") ?? "";
	}
	public set tag(value: string) {
		this.setAttribute("tag", value);
	}
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	public get apiSrc(): string {
		return this.getAttribute("api-src") ?? "";
	}
	public set apiSrc(value: string) {
		this.setAttribute("api-src", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-component-viewer-styles", style);
		this.inlineSource ??=
			this.querySelector(
				':scope > script[type="tp/html"], :scope > script[type="tp/component-viewer"]',
			)?.textContent?.trim() ?? "";
		void this.load();
	}
	protected override attributeChangedCallback(name: string): void {
		if (this.isConnected && ["tag", "src", "api-src"].includes(name))
			void this.load();
	}
	protected disconnectedCallback(): void {
		this.revision++;
		this.request?.abort();
		this.previewObserver?.disconnect();
		this.preview = null;
	}
	private get attributesApi(): ApiItem[] {
		return this.api?.attributes.filter((item) => !item.inherited) ?? [];
	}

	private async load(): Promise<void> {
		const revision = ++this.revision;
		this.request?.abort();
		this.previewObserver?.disconnect();
		this.preview = null;
		this.request = new AbortController();
		const signal = this.request.signal;
		this.innerHTML = '<p role="status">Loading component API…</p>';
		try {
			this.baseUrl = getComponentSourceBaseUrl(this);
			let source = this.inlineSource ?? "";
			if (this.src.trim()) {
				this.baseUrl = resolveComponentSourceUrl(this, this.src).href;
				const response = await fetch(this.baseUrl, { signal });
				if (!response.ok)
					throw new Error(`Unable to load example (${response.status}).`);
				source = await response.text();
			}
			if (revision !== this.revision) return;
			const parsed = new DOMParser().parseFromString(source, "text/html");
			const inferred = [...parsed.body.querySelectorAll("*")].find((item) =>
				item.localName.startsWith("tp-"),
			)?.localName;
			const tag = this.tag.trim() || inferred || "";
			if (!/^tp-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag))
				throw new Error(
					"Provide a component tag or an HTML example containing a tp-* component.",
				);
			const api = await this.loadApi(tag, signal);
			if (revision !== this.revision) return;
			this.api = api;
			this.componentTag = tag;
			this.contentOverride = null;
			this.source = source || api.examples?.[0]?.code || `<${tag}></${tag}>`;
			const original = new DOMParser()
				.parseFromString(this.source, "text/html")
				.querySelector(tag);
			if (!original) throw new Error(`The example does not contain <${tag}>.`);
			this.values = new Map(
				this.attributesApi.map((item) => [
					item.name,
					original.getAttribute(item.name),
				]),
			);
			this.cleared.clear();
			this.render();
		} catch (error) {
			if (revision !== this.revision || signal.aborted) return;
			const message = document.createElement("p");
			message.setAttribute("role", "alert");
			message.textContent =
				error instanceof Error ? error.message : String(error);
			this.replaceChildren(message);
		}
	}
	private async loadApi(tag: string, signal: AbortSignal): Promise<Api> {
		const name = tag.slice(3);
		const moduleUrl = new URL(import.meta.url);
		const root = moduleUrl.pathname.includes("/chunks/")
			? new URL("../components/", moduleUrl)
			: moduleUrl.pathname.includes("/components/component-viewer/")
				? new URL("../", moduleUrl)
				: new URL("./components/", moduleUrl);
		const urls = this.apiSrc
			? [resolveComponentSourceUrl(this, this.apiSrc).href]
			: [
					new URL(`${name}/${name}.json`, root).href,
					new URL(
						`/src/components/${name}/${name}.json`,
						this.ownerDocument.baseURI,
					).href,
					new URL(
						`/components/${name}/${name}.json`,
						this.ownerDocument.baseURI,
					).href,
				];
		for (const url of urls) {
			try {
				const response = await fetch(url, { signal });
				if (!response.ok) continue;
				const api = (await response.json()) as Api;
				if (api.tagname === tag && Array.isArray(api.attributes)) return api;
			} catch (error) {
				if (signal.aborted) throw error;
			}
		}
		throw new Error(`API manifest unavailable for <${tag}>.`);
	}
	private choices(
		item: ApiItem,
	): { label: string; value: string }[] | undefined {
		const settings = controlsCatalog[this.componentTag]?.[item.name];
		const configured =
			settings?.choices ??
			settings?.values?.map((value) => ({ label: value, value }));
		if (configured) return configured;
		// Closed string unions in a fresh API work before the catalog is rebuilt.
		// Open unions (for example "small" | string) must remain editable fields.
		const members = item.type?.split("|").map((member) => member.trim());
		if (!members || members.length < 2) return undefined;
		const values: string[] = [];
		for (const member of members) {
			const literal = member.match(/^(?:"([^"\\]*)"|'([^'\\]*)')$/);
			if (!literal) return undefined;
			values.push(literal[1] ?? literal[2] ?? "");
		}
		return [...new Set(values)].map((value) => ({ label: value, value }));
	}
	private render(): void {
		const api = this.api;
		if (!api) return;
		this.innerHTML = `<header class="tp-component-viewer-header"><h2 data-component-title><tp-icon library="components" name="${escapeHtml(this.componentTag.slice(3))}" size="1.25em" aria-hidden="true"></tp-icon><span data-component-title-text>${escapeHtml(this.componentTag)}</span></h2><tp-radio-list data-component-mode orientation="horizontal" aria-label="Displayed panel" value="${this.activePanel === "Doc" ? "1" : this.activePanel === "Demo" ? "2" : "3"}"><ul><li>Doc</li><li>Demo</li><li>API</li></ul></tp-radio-list></header><div class="tp-component-viewer-layout"><section class="tp-component-viewer-docs" aria-label="Component API"><tp-tabs><dl>${commandsTable(api)}${table("Attributes", this.attributesApi, ["name", "type", "default", "description"])}${table(
			"Methods",
			(api.methods ?? []).filter((item) => !item.inherited),
			["name", "description"],
		)}${table(
			"Events",
			(api.events ?? []).filter(
				(item) => item.emitted === true && !item.inherited,
			),
			["name", "detail", "description"],
		)}${table("CSS Properties", api.cssproperties ?? [], ["name", "default", "description"])}</dl></tp-tabs></section><section class="tp-component-viewer-demo" aria-label="Component demo"><div data-component-preview></div><tp-icon-button data-component-source-toggle name="code" label="Show markup source" aria-pressed="false"></tp-icon-button><div data-component-source hidden></div><h3>Attributes setting</h3><div data-component-controls></div><h3>Content setting</h3><tp-textfield data-component-content label="Content (HTML)" clearable multiline rows="2"></tp-textfield><div class="tp-component-viewer-actions"><tp-button data-component-reset>Reset defaults</tp-button><tp-button data-component-reload>Reload preview</tp-button></div><p>Reload preview applies initialization-only settings.</p></section><section class="tp-component-viewer-api" aria-label="Full component API"></section></div>`;
		const interactions = this.querySelector<HTMLElement>(
			"[data-component-interactions]",
		);
		if (interactions && api.userHelp?.interactions) {
			const rendered = document.createElement("div");
			void renderMarkdownInto(
				formatHelpKeyboard(api.userHelp.interactions),
				rendered,
			).then(() => {
				if (!interactions.isConnected) return;
				let destination = interactions.querySelector("[data-component-mouse]");
				for (const node of Array.from(rendered.childNodes)) {
					if (node instanceof HTMLElement && /^H[1-6]$/.test(node.tagName)) {
						const title = node.textContent?.trim().toLowerCase();
						if (title === "user interactions") continue;
						if (
							title === "mouse interactions" ||
							title === "keyboard interactions"
						) {
							destination = interactions.querySelector(
								title === "mouse interactions"
									? "[data-component-mouse]"
									: "[data-component-keyboard]",
							);
							continue;
						}
					}
					destination?.append(node);
				}
				for (const panel of interactions.querySelectorAll<HTMLElement>(
					"[data-component-mouse], [data-component-keyboard]",
				))
					panel.classList.add("tp-markdown-output");
			});
		}

		const content = this.querySelector<ValueControl>(
			"[data-component-content]",
		);
		if (content) {
			content.value =
				this.configuredDocument().querySelector(this.componentTag)?.innerHTML ??
				"";
			content.addEventListener("input", () => {
				if (this.contentOverride === content.value) return;
				this.contentOverride = content.value;
				this.renderPreview();
			});
		}
		const toggle = this.querySelector("[data-component-source-toggle]");
		toggle?.addEventListener("click", () => {
			const panel = this.querySelector<HTMLElement>("[data-component-source]");
			if (!panel) return;
			panel.hidden = !panel.hidden;
			toggle.setAttribute("aria-pressed", String(!panel.hidden));
			toggle.setAttribute(
				"label",
				panel.hidden ? "Show markup source" : "Hide markup source",
			);
			this.syncSource();
		});
		const mode = this.querySelector<ValueControl>("[data-component-mode]");
		mode?.addEventListener("tp-radio-list-change", () => {
			this.activePanel =
				mode.value === "3" ? "API" : mode.value === "2" ? "Demo" : "Doc";
			this.updatePanel();
		});
		this.updatePanel();
		const container = this.querySelector("[data-component-controls]");
		const booleans = this.attributesApi.filter(
			(item) => item.type === "boolean",
		);
		if (booleans.length) {
			const control = document.createElement(
				"tp-checkbox-list",
			) as ValueControl;
			control.setAttribute("label", "Boolean attributes");
			control.setAttribute("label-position", "top");
			control.setAttribute("orientation", "horizontal");
			control.dataset.componentBooleans = "";
			control.innerHTML = `<ul>${booleans.map((item) => `<li>${escapeHtml(item.name)}</li>`).join("")}</ul>`;
			container?.append(control);
			control.addEventListener("change", () => {
				const selected = new Set(control.value.split(","));
				booleans.forEach((item, index) => {
					this.apply(item.name, selected.has(String(index + 1)) ? "" : null);
				});
			});
		}
		const fields = document.createElement("tp-cluster");
		fields.setAttribute("align", "start");
		fields.dataset.componentFields = "";
		const nonBooleans = this.attributesApi.filter(
			(item) => item.type !== "boolean",
		);
		const ordered = [
			...nonBooleans.filter((item) => this.choices(item)),
			...nonBooleans.filter((item) => !this.choices(item)),
		];
		for (const item of ordered) {
			const choices = this.choices(item);
			const control = document.createElement(
				choices ? "tp-radio-list" : fieldTag(item),
			) as ValueControl;
			control.dataset.componentSetting = item.name;
			control.setAttribute("label", item.name);
			control.setAttribute("label-position", "top");
			if (choices) {
				control.setAttribute("orientation", "horizontal");
				control.innerHTML = `<ul>${choices.map((choice) => `<li>${escapeHtml(choice.label || "Default")}</li>`).join("")}</ul>`;
			} else {
				control.setAttribute("clearable", "");
				control.setAttribute("placeholder", defaultValue(item));
			}
			if (!choices && !fields.isConnected) container?.append(fields);
			(choices ? container : fields)?.append(control);
			control.addEventListener("change", () => {
				const value = choices
					? (choices[Number(control.value) - 1]?.value ?? "")
					: control.value;
				if (value === "") this.cleared.add(item.name);
				else this.cleared.delete(item.name);
				this.apply(item.name, value === "" ? null : value);
			});
		}
		this.querySelector("[data-component-reset]")?.addEventListener(
			"click",
			() => this.resetDefaults(),
		);
		this.querySelector("[data-component-reload]")?.addEventListener(
			"click",
			() => this.renderPreview(),
		);
		this.syncControls();
		this.renderPreview();
	}
	private updatePanel(): void {
		const docs = this.querySelector<HTMLElement>(".tp-component-viewer-docs");
		const demo = this.querySelector<HTMLElement>(".tp-component-viewer-demo");
		if (docs) docs.hidden = this.activePanel !== "Doc";
		if (demo) demo.hidden = this.activePanel !== "Demo";
		const apiPanel = this.querySelector<HTMLElement>(
			".tp-component-viewer-api",
		);
		if (apiPanel) {
			apiPanel.hidden = this.activePanel !== "API";
			if (this.activePanel === "API" && !apiPanel.firstChild)
				this.loadFullApi(apiPanel);
		}
	}
	private loadFullApi(panel: HTMLElement): void {
		if (!this.api?.classname) {
			panel.textContent =
				"The full API page is not declared in this component manifest.";
			return;
		}
		const moduleUrl = new URL(import.meta.url);
		const root = new URL(
			moduleUrl.pathname.includes("/src/components/")
				? "../../../"
				: moduleUrl.pathname.includes("/components/")
					? "../../"
					: moduleUrl.pathname.includes("/chunks/")
						? "../"
						: "./",
			moduleUrl,
		);
		const page = `components_${this.componentTag.slice(3)}.${this.api.classname}.html`;
		const viewer = document.createElement("tp-html-viewer");
		viewer.setAttribute("lite", "");
		viewer.setAttribute("no-loader", "");
		viewer.setAttribute(
			"src",
			new URL(`api/classes/${encodeURIComponent(page)}`, root).href,
		);
		viewer.classList.add("tp-component-viewer-preview");
		viewer.addEventListener(
			"load",
			(event) => {
				if (!(event.target instanceof HTMLIFrameElement)) return;
				const documentNode = event.target.contentDocument;
				if (!documentNode) return;
				// TypeDoc's viewport minimum would feed the iframe's own measured height
				// back into its document when the panel is hidden and shown again.
				const sizing = documentNode.createElement("style");
				sizing.textContent = "html body .container-main { min-height: 0; }";
				documentNode.head.append(sizing);
			},
			true,
		);
		panel.append(viewer);
	}

	private apply(name: string, value: string | null): void {
		this.values.set(name, value);
		if (value === null) this.preview?.removeAttribute(name);
		else this.preview?.setAttribute(name, value);
		this.syncSource();
	}
	private syncControls(): void {
		const booleans = this.attributesApi.filter(
			(item) => item.type === "boolean",
		);
		const control = this.querySelector<ValueControl>(
			"[data-component-booleans]",
		);
		if (control)
			control.value = booleans
				.flatMap((item, index) =>
					this.values.get(item.name) !== null ? [String(index + 1)] : [],
				)
				.join(",");
		for (const control of this.querySelectorAll<ValueControl>(
			"[data-component-setting]",
		)) {
			const item = this.attributesApi.find(
				(item) => item.name === control.dataset.componentSetting,
			);
			if (!item) continue;
			const value = this.cleared.has(item.name)
				? ""
				: (this.values.get(item.name) ?? defaultValue(item));
			const choices = this.choices(item);
			control.value = choices
				? String(
						choices.findIndex((choice) => String(choice.value) === value) + 1,
					)
				: value;
		}
	}
	/** Restores documented attribute defaults and restarts the preview. */
	public resetDefaults(): void {
		this.contentOverride = null;
		const content = this.querySelector<ValueControl>(
			"[data-component-content]",
		);
		if (content)
			content.value =
				this.configuredDocument().querySelector(this.componentTag)?.innerHTML ??
				"";
		this.cleared.clear();
		for (const item of this.attributesApi) {
			const value = defaultValue(item);
			this.values.set(
				item.name,
				item.type === "boolean"
					? value === "true"
						? ""
						: null
					: value || null,
			);
		}
		this.syncControls();
		this.renderPreview();
	}
	/** Serialize author content with current public attributes, excluding generated DOM. */
	private configuredDocument(): Document {
		const parsed = new DOMParser().parseFromString(this.source, "text/html");
		const target = parsed.querySelector(this.componentTag);
		if (target && this.contentOverride !== null)
			target.innerHTML = this.contentOverride;
		for (const [name, value] of this.values) {
			if (value === null) target?.removeAttribute(name);
			else target?.setAttribute(name, value);
		}
		return parsed;
	}
	private syncSource(): void {
		const panel = this.querySelector<HTMLElement>("[data-component-source]");
		if (!panel || panel.hidden) return;
		const languages = [
			["html", "HTML", "html"],
			["adoc", "tp-asciidoc", "asciidoc"],
			["latex", "tp-latex", "latex"],
			["md", "tp-markdown", "markdown"],
			["rst", "tp-restructuredtext", "restructuredtext"],
		] as const;
		if (!panel.querySelector("tp-tabs")) {
			const tabs = document.createElement("tp-tabs");
			const list = document.createElement("dl");
			for (const [format, label, language] of languages) {
				const term = document.createElement("dt");
				term.textContent = label;
				const content = document.createElement("dd");
				const editor = document.createElement("tp-code-editor");
				editor.dataset.componentSourceFormat = format;
				editor.setAttribute("language", language);
				for (const attribute of ["readonly", "line-numbers", "word-wrap"])
					editor.setAttribute(attribute, "");
				content.append(editor);
				list.append(term, content);
			}
			tabs.append(list);
			panel.append(tabs);
		}
		const parsed = this.configuredDocument();
		const source = /<!doctype|<html[\s>]/i.test(this.source)
			? `<!doctype html>\n${parsed.documentElement.outerHTML}`
			: `${parsed.head.innerHTML}${parsed.body.innerHTML}`.trim();
		for (const [format] of languages) {
			const editor = panel.querySelector<
				HTMLElementTagNameMap["tp-code-editor"]
			>(`[data-component-source-format="${format}"]`);
			const value =
				format === "html"
					? booleanHtmlSource(
							source,
							this.componentTag,
							this.api?.attributes ?? [],
						)
					: format === "latex"
						? `\\documentclass{article}\n\\begin{document}\n${latexMarkup(source)}\n\\end{document}\n`
						: nativeMarkup(format, source);
			if (editor && editor.value !== value) editor.value = value;
		}
	}

	private syncButtonInteractions(): void {
		const container = this.querySelector("[data-component-buttons]");
		if (!container || !this.preview) return;
		const legend = createHelpButtonTable(
			this.preview as HTMLElement,
			this.api?.userHelp?.interactions ?? "",
		);
		if (legend) {
			for (const label of legend.querySelectorAll("h4"))
				if (label.textContent === "Buttons") label.remove();
			container.replaceChildren(legend);
		} else {
			const empty = document.createElement("p");
			empty.textContent = "No component-specific buttons.";
			container.replaceChildren(empty);
		}
	}

	private renderPreview(): void {
		this.previewObserver?.disconnect();
		this.preview = null;
		const parsed = this.configuredDocument();
		this.syncSource();
		let base = parsed.querySelector("base");
		if (!base) {
			base = parsed.createElement("base");
			parsed.head.prepend(base);
		}
		base.href = new URL(base.getAttribute("href") || ".", this.baseUrl).href;
		const viewer = document.createElement("tp-html-viewer");
		viewer.setAttribute("lite", "");
		viewer.classList.add("tp-component-viewer-preview");
		viewer.setAttribute("data-tp-render-eager", "");
		const source = document.createElement("script");
		source.type = "tp/html";
		source.textContent = `<!doctype html>${parsed.documentElement.outerHTML}`;
		viewer.append(source);
		viewer.addEventListener(
			"load",
			(event) => {
				if (!(event.target instanceof HTMLIFrameElement)) return;
				const preview = event.target.contentDocument?.querySelector(
					this.componentTag,
				);
				if (!preview) return;
				this.previewObserver?.disconnect();
				this.preview = preview;
				const sync = () => {
					for (const item of this.attributesApi) {
						const value = preview.getAttribute(item.name);
						this.values.set(item.name, value);
						if (
							this.cleared.has(item.name) &&
							value !== null &&
							value !== defaultValue(item)
						)
							this.cleared.delete(item.name);
					}
					this.syncControls();
					this.syncSource();
					this.syncButtonInteractions();
				};
				this.previewObserver = new MutationObserver(sync);
				this.previewObserver.observe(preview, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: this.attributesApi.map((item) => item.name),
				});
				sync();
			},
			true,
		);
		this.querySelector("[data-component-preview]")?.replaceChildren(viewer);
	}
}
if (!customElements.get("tp-component-viewer"))
	customElements.define("tp-component-viewer", TpComponentViewer);

declare global {
	interface HTMLElementTagNameMap {
		"tp-component-viewer": TpComponentViewer;
	}
}
