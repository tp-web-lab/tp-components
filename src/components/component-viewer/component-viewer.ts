/**
 * @module components/component-viewer
 * @summary API tables and interactive attribute controls for a component preview.
 */
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
		: `<div class="tp-component-viewer-table"><table><thead><tr>${columns.map((key) => `<th scope="col">${key[0]?.toUpperCase()}${key.slice(1)}</th>`).join("")}</tr></thead><tbody>${items.map((item) => `<tr>${columns.map((key) => `<td data-api-column="${key}">${escapeHtml(key === "description" ? description(item) : String(item[key] ?? ""))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
	return `<dt>${title}</dt><dd>${body}</dd>`;
}
function commandsTable(api: Api): string {
	const commands = api.userHelp?.commands;
	const content = commands?.length
		? `<p>Mod = ⌘ on macOS, Ctrl elsewhere. — = no assigned shortcut.</p><div class="tp-component-viewer-table"><table><thead><tr><th scope="col">Button / command</th><th scope="col">Action</th><th scope="col">Shortcut</th></tr></thead><tbody>${commands.map((command) => `<tr><td>${escapeHtml(command.button)}</td><td>${escapeHtml(command.description)}</td><td>${escapeHtml(command.shortcut)}</td></tr>`).join("")}</tbody></table></div>`
		: `<p>${commands ? "No component-specific commands." : "No component-specific commands documented."}</p>`;
	return `<dt>Commands</dt><dd>${content}</dd>`;
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
 * API reference beside an interactive component preview.
 * @tagname tp-component-viewer
 * @summary API tables and interactive attribute controls for a component preview.
 * @attr {string} tag = "" - Component tag; inferred from supplied HTML when omitted.
 * @attr {string} src = "" - HTML example file, resolved relative to the author document.
 * @attr {string} api-src = "" - Optional component API manifest URL.
 * @example
 * <tp-component-viewer tag="tp-button"></tp-component-viewer>
 */
export class TpComponentViewer extends TpBase {
	private inlineSource: string | null = null;
	private source = "";
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
		return (
			settings?.choices ??
			settings?.values?.map((value) => ({ label: value, value }))
		);
	}
	private render(): void {
		const api = this.api;
		if (!api) return;
		this.innerHTML = `<header class="tp-component-viewer-header"><h2 data-component-title><tp-icon library="components" name="${escapeHtml(this.componentTag.slice(3))}" size="1.25em" aria-hidden="true"></tp-icon><span data-component-title-text>${escapeHtml(this.componentTag)} ${this.activePanel}</span></h2><tp-radio-list data-component-mode orientation="horizontal" aria-label="Displayed panel" value="${this.activePanel === "Doc" ? "1" : this.activePanel === "Demo" ? "2" : "3"}"><ul><li>Doc</li><li>Demo</li><li>API</li></ul></tp-radio-list></header><div class="tp-component-viewer-layout"><section class="tp-component-viewer-docs" aria-label="Component API"><tp-tabs><dl>${commandsTable(api)}${table("Attributes", this.attributesApi, ["name", "type", "default", "description"])}${table(
			"Methods",
			(api.methods ?? []).filter((item) => !item.inherited),
			["name", "description"],
		)}${table(
			"Events",
			(api.events ?? []).filter(
				(item) => item.emitted === true && !item.inherited,
			),
			["name", "detail", "description"],
		)}${table("CSS Properties", api.cssproperties ?? [], ["name", "default", "description"])}</dl></tp-tabs></section><section class="tp-component-viewer-demo" aria-label="Component demo"><div data-component-preview></div><h3>Configuration</h3><div data-component-controls></div><div class="tp-component-viewer-actions"><tp-button data-component-reset>Reset defaults</tp-button><tp-button data-component-reload>Reload preview</tp-button></div><p>Reload preview applies initialization-only settings.</p></section><section class="tp-component-viewer-api" aria-label="Full component API"></section></div>`;
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
		const title = this.querySelector("[data-component-title-text]");
		if (title) title.textContent = `${this.componentTag} ${this.activePanel}`;
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
	private renderPreview(): void {
		this.previewObserver?.disconnect();
		this.preview = null;
		const parsed = new DOMParser().parseFromString(this.source, "text/html");
		const target = parsed.querySelector(this.componentTag);
		if (!target) return;
		for (const [name, value] of this.values) {
			if (value === null) target.removeAttribute(name);
			else target.setAttribute(name, value);
		}
		let base = parsed.querySelector("base");
		if (!base) {
			base = parsed.createElement("base");
			parsed.head.prepend(base);
		}
		base.href = new URL(base.getAttribute("href") || ".", this.baseUrl).href;
		const viewer = document.createElement("tp-html-viewer");
		viewer.setAttribute("lite", "");
		viewer.classList.add("tp-component-viewer-preview");
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
				};
				this.previewObserver = new MutationObserver(sync);
				this.previewObserver.observe(preview, {
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
