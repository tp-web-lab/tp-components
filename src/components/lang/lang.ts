/**
 * @module components/lang
 * @summary Documentation language selector.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import style from "./lang.css?inline";

import "../dropdown/dropdown.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../divider/divider.js";

import { TpBase } from "../base/base.js";
import {
	isTpSizeType,
	isTpVariantType,
	type TpSizeType,
	type TpVariantType,
} from "../base/base.types.js";
import type { TpDropdown } from "../dropdown/dropdown.js";

type TpLangCode = string;
type TpLangChoice = TpLangCode | "auto";
type TpRepositoryHost = HTMLElement & { repository?: string };

const STYLE_ID = "tp-lang-styles";

function normalizeLang(value: string): string {
	return value.trim().toLowerCase();
}

function normalizeRepository(value: string): string {
	const trimmed = value.trim();
	if (trimmed === "") {
		return "";
	}

	const normalized = trimmed.replace(/\/+$/, "");
	return normalized === "" ? "/" : normalized;
}

function createAnchorId(): string {
	return `tp-lang-${Math.random().toString(36).slice(2)}`;
}

function joinRepository(base: string, part: string): string {
	const cleanPart = part.replace(/^\/+|\/+$/g, "");
	if (base === "" || base === "/") {
		return `/${cleanPart}`;
	}

	return `${base.replace(/\/+$/, "")}/${cleanPart}`;
}

/**
 * `<tp-lang>` selects the documentation language and updates the nearest multi-page documentation shell.
 *
 * @summary Documentation language selector.
 * @tagname tp-lang
 * @attr {string} langs = "en" - Comma-separated language codes.
 * @attr {string} repository = "" - Documentation repository root.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the language trigger.
 *
 *
 * @event tp-lang-change Emitted when the selected documentation language changes.
 * @eventdetail tp-lang-change { choice: string; lang: string; repository: string; anchor: null; target: HTMLElement | null }
 * @example
 * <tp-lang></tp-lang>
 */
export class TpLang extends TpBase {
	private static readonly dropdownPlacement = "bottom";
	private static readonly changeEventName = "tp-lang-change";
	private static nextControlId = 0;
	private anchorId = createAnchorId();
	private controlEl: HTMLElement | null = null;
	private dropdownEl: TpDropdown | null = null;

	public static get observedAttributes(): string[] {
		return ["langs", "repository", "variant", "size", "disabled"];
	}

	public get langs(): string {
		return this.getAttribute("langs") ?? "en";
	}

	public set langs(value: string) {
		this.setAttribute("langs", value);
	}

	public get repository(): string {
		return this.getAttribute("repository") ?? "";
	}

	public set repository(value: string) {
		if (value.trim() === "") {
			this.removeAttribute("repository");
			return;
		}

		this.setAttribute("repository", value);
	}

	public get variant(): TpVariantType {
		const value = this.getAttribute("variant") ?? "neutral";
		return isTpVariantType(value) ? value : "neutral";
	}

	public set variant(value: TpVariantType) {
		this.setAttribute("variant", value);
	}

	public get size(): TpSizeType {
		const value = this.getAttribute("size") ?? "m";
		return isTpSizeType(value) ? value : "m";
	}

	public set size(value: TpSizeType) {
		this.setAttribute("size", value);
	}

	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}

	public set disabled(value: boolean) {
		this.toggleAttribute("disabled", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(STYLE_ID, style);
		this.ensureControl();
		this.updateControl();
		window.addEventListener("hashchange", this.handleLocationChange);
	}

	protected disconnectedCallback(): void {
		window.removeEventListener("hashchange", this.handleLocationChange);
	}

	protected attributeChangedCallback(): void {
		if (!this.isConnected) return;
		this.ensureControl();
		this.updateControl();
	}

	private ensureControl(): void {
		let control = this.querySelector<HTMLElement>(":scope > tp-icon-button");
		if (!(control instanceof HTMLElement)) {
			control = document.createElement("tp-icon-button");
			this.prepend(control);
		}

		control.setAttribute("library", "flags");
		control.setAttribute("variant", this.variant);
		control.setAttribute("size", this.size);
		control.toggleAttribute("disabled", this.disabled);
		control.removeEventListener("click", this.handleControlClick);
		control.addEventListener("click", this.handleControlClick);
		this.controlEl = control;

		this.anchorId = this.ensureControlId(control);

		let dropdown = this.querySelector<HTMLElement>(":scope > tp-dropdown");
		if (!(dropdown instanceof HTMLElement)) {
			dropdown = document.createElement("tp-dropdown");
			this.append(dropdown);
		}

		const dropdownEl = dropdown as TpDropdown;
		dropdownEl.setAttribute("anchor", `#${this.anchorId}`);
		dropdownEl.setAttribute("placement", TpLang.dropdownPlacement);
		dropdownEl.setAttribute("outside-click", "");
		this.dropdownEl = dropdownEl;

		this.renderOptions();
	}

	private ensureControlId(control: HTMLElement): string {
		const existingId = control.id.trim();
		if (existingId !== "") {
			return existingId;
		}

		TpLang.nextControlId += 1;
		const id = `tp-lang-control-${String(TpLang.nextControlId)}`;
		control.id = id;
		return id;
	}

	private renderOptions(): void {
		if (!(this.dropdownEl instanceof HTMLElement)) {
			return;
		}

		const langs = this.readLangs();
		const choices: TpLangChoice[] = ["auto", ...langs];
		const currentItems = Array.from(
			this.dropdownEl.querySelectorAll<HTMLElement>(".tp-lang-option"),
		);
		const currentChoices = currentItems.map((item) => item.dataset.lang ?? "");
		if (
			currentChoices.length === choices.length &&
			currentChoices.every((choice, index) => choice === choices[index]) &&
			this.dropdownEl.querySelector("tp-divider") !== null
		) {
			return;
		}

		const ul = document.createElement("ul");
		ul.setAttribute("role", "menu");

		for (const choice of choices) {
			const li = document.createElement("li");
			li.className = "tp-lang-option";
			li.dataset.lang = choice;
			li.setAttribute("role", "menuitem");
			li.tabIndex = 0;

			const check = document.createElement("tp-icon");
			check.setAttribute("name", "check");

			const icon = document.createElement("tp-icon");
			icon.className = "tp-lang-option-icon";
			icon.setAttribute("library", "flags");

			const label = document.createElement("span");
			label.textContent = choice;

			li.append(check, icon, label);
			li.addEventListener("click", this.handleLangItemClick);
			li.addEventListener("keydown", this.handleLangItemKeyDown);
			ul.append(li);

			if (choice === "auto") {
				const separator = document.createElement("li");
				separator.className = "tp-lang-separator";
				separator.setAttribute("role", "none");
				separator.setAttribute("aria-hidden", "true");
				const divider = document.createElement("tp-divider");
				separator.append(divider);
				ul.append(separator);
			}
		}

		this.dropdownEl.replaceChildren(ul);
	}

	private updateControl(): void {
		this.ensureControl();

		const langs = this.readLangs();
		const current = this.resolveCurrentLang(langs);
		const effectiveAutoLang = this.resolveAutoLang(langs);
		const selectedChoice = current === effectiveAutoLang ? "auto" : current;
		const label = `Language: ${current.toUpperCase()}`;

		if (this.controlEl instanceof HTMLElement) {
			this.controlEl.setAttribute("name", current);
			this.controlEl.setAttribute("library", "flags");
			this.controlEl.setAttribute("label", label);
			this.controlEl.setAttribute("title", label);
			this.controlEl.setAttribute("aria-haspopup", "menu");
			this.controlEl.setAttribute(
				"aria-expanded",
				String(this.dropdownEl?.open === true),
			);
		}

		if (this.dropdownEl instanceof HTMLElement) {
			for (const item of this.dropdownEl.querySelectorAll<HTMLElement>(
				".tp-lang-option",
			)) {
				const choice = item.dataset.lang ?? "";
				const lang = choice === "auto" ? effectiveAutoLang : choice;
				const icon = item.querySelector<HTMLElement>(
					"tp-icon.tp-lang-option-icon",
				);
				icon?.setAttribute("name", lang);

				if (choice === selectedChoice) {
					item.setAttribute("data-selected", "");
					item.setAttribute("aria-current", "true");
				} else {
					item.removeAttribute("data-selected");
					item.removeAttribute("aria-current");
				}
			}
		}
	}

	private readLangs(): TpLangCode[] {
		const langs = this.langs
			.split(",")
			.map(normalizeLang)
			.filter((lang) => lang !== "");

		return [...new Set(langs.length === 0 ? ["en"] : langs)];
	}

	private resolveCurrentLang(langs: readonly TpLangCode[]): TpLangCode {
		const markdownDoc = this.resolveMarkdownDoc();
		const docRepository =
			markdownDoc === null ? "" : this.readHostRepository(markdownDoc);
		if (docRepository !== "") {
			const currentRepository = normalizeRepository(docRepository);
			for (const lang of langs) {
				if (this.repositoryForLang(lang) === currentRepository) {
					return lang;
				}
			}
		}

		const pathLang = this.readLangFromPath(langs);
		return pathLang ?? langs[0] ?? "en";
	}

	private readLangFromPath(langs: readonly TpLangCode[]): TpLangCode | null {
		const segments = this.resolveRepositoryPathSegments();
		const lang = segments.at(-1);
		return lang !== undefined && langs.includes(lang) ? lang : null;
	}

	private resolveAutoLang(langs: readonly TpLangCode[]): TpLangCode {
		const browserLang = normalizeLang(
			navigator.language.split("-", 1)[0] ?? "",
		);
		if (langs.includes(browserLang)) {
			return browserLang;
		}

		return langs[0] ?? "en";
	}

	private repositoryForLang(lang: TpLangCode): string {
		const base = this.resolveRepositoryBase();
		const langs = this.readLangs();
		const defaultLang = langs[0] ?? "en";

		if (lang === defaultLang) {
			return base;
		}

		return joinRepository(base, lang);
	}

	private resolveRepositoryBase(): string {
		const repository = normalizeRepository(this.repository);
		if (repository !== "") {
			return repository;
		}

		const langs = this.readLangs();
		const defaultLang = langs[0] ?? "en";
		const markdownDoc = this.resolveMarkdownDoc();
		const docRepository =
			markdownDoc === null ? "" : this.readHostRepository(markdownDoc);
		if (docRepository !== "") {
			return this.stripLangSegment(
				normalizeRepository(docRepository),
				langs,
				defaultLang,
			);
		}

		const segments = this.resolveRepositoryPathSegments();
		const lastSegment = segments.at(-1);
		if (
			lastSegment !== undefined &&
			lastSegment !== defaultLang &&
			langs.includes(lastSegment)
		) {
			segments.pop();
		}

		return segments.length === 0 ? "/" : `/${segments.join("/")}`;
	}

	private resolveRepositoryPathSegments(): string[] {
		const pathname = window.location.pathname;
		const index = pathname.lastIndexOf("/");
		const base = index === -1 ? "" : pathname.slice(0, index);
		return base.split("/").filter((segment) => segment !== "");
	}

	private stripLangSegment(
		repository: string,
		langs: readonly TpLangCode[],
		defaultLang: TpLangCode,
	): string {
		const segments = repository.split("/").filter((segment) => segment !== "");
		const lastSegment = segments.at(-1);
		if (
			lastSegment !== undefined &&
			lastSegment !== defaultLang &&
			langs.includes(lastSegment)
		) {
			segments.pop();
		}

		return segments.length === 0 ? "/" : `/${segments.join("/")}`;
	}

	private readHostRepository(host: TpRepositoryHost): string {
		const propertyRepository =
			typeof host.repository === "string" ? host.repository.trim() : "";
		if (propertyRepository !== "") {
			return propertyRepository;
		}

		return host.getAttribute("repository")?.trim() ?? "";
	}

	private selectLang(choice: TpLangChoice): void {
		const langs = this.readLangs();
		const lang = choice === "auto" ? this.resolveAutoLang(langs) : choice;
		const repository = this.repositoryForLang(lang);
		const markdownDoc = this.resolveMarkdownDoc();

		if (markdownDoc !== null) {
			markdownDoc.setAttribute("repository", repository);
		}

		this.updateUrlForRepository(repository);
		this.updateControl();
		this.emitChange(choice, lang, repository, markdownDoc);
	}

	private emitChange(
		choice: TpLangChoice,
		lang: TpLangCode,
		repository: string,
		target: HTMLElement | null,
	): void {
		this.dispatchEvent(
			new CustomEvent(TpLang.changeEventName, {
				bubbles: true,
				composed: true,
				detail: {
					choice,
					lang,
					repository,
					anchor: null,
					target,
				},
			}),
		);
	}

	private updateUrlForRepository(repository: string): void {
		const url = new URL(window.location.href);
		const hash = url.hash;

		if (hash.startsWith("#/")) {
			window.dispatchEvent(new Event("hashchange"));
			return;
		}

		url.pathname = `${repository.replace(/\/+$/, "")}/index.html`;
		window.history.pushState(null, "", url);
	}

	private resolveMarkdownDoc(): HTMLElement | null {
		const local = this.closest(
			"tp-markdown-multi-pages, tp-asciidoc-multi-pages, tp-restructuredtext-multi-pages, tp-html-multi-pages, tp-markup-multi-pages",
		);
		if (local instanceof HTMLElement) {
			return local;
		}

		const doc = this.ownerDocument.querySelector(
			"tp-markdown-multi-pages, tp-asciidoc-multi-pages, tp-restructuredtext-multi-pages, tp-html-multi-pages, tp-markup-multi-pages",
		);
		return doc instanceof HTMLElement ? doc : null;
	}

	private handleControlClick = (): void => {
		if (this.disabled) {
			return;
		}

		if (!(this.dropdownEl instanceof HTMLElement)) {
			return;
		}

		this.dropdownEl.open = !this.dropdownEl.open;
		this.controlEl?.setAttribute("aria-expanded", String(this.dropdownEl.open));
	};

	private handleLangItemClick = (event: Event): void => {
		if (this.disabled) {
			return;
		}

		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;

		const lang = target.dataset.lang;
		if (lang === undefined || lang === "") return;

		if (this.dropdownEl instanceof HTMLElement) {
			this.dropdownEl.open = false;
		}
		this.selectLang(lang);
	};

	private handleLangItemKeyDown = (event: KeyboardEvent): void => {
		if (event.key !== "Enter" && event.key !== " ") {
			return;
		}

		event.preventDefault();
		this.handleLangItemClick(event);
	};

	private handleLocationChange = (): void => {
		this.updateControl();
	};
}

if (!customElements.get("tp-lang")) {
	customElements.define("tp-lang", TpLang);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-lang": TpLang;
	}
}
