/**
 * @module components/emoji-picker
 * @summary Unicode Emoji 17.0 picker.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./emoji-picker.css?inline";
import emojiTestData from "./emoji-test-17.0.txt?raw";
import "../radio-list/radio-list.js";

const emojiHtmlEntities = new Map<number, string>([
	[0x00a9, "&copy;"],
	[0x00ae, "&reg;"],
	[0x2122, "&trade;"],
]);

export type TpEmojiPickerItem = {
	emoji: string;
	name: string;
	group: string;
	subgroup: string;
	version: string;
	codepoints: string[];
};

export type TpEmojiPickerMetadata = {
	unicode: string;
	hexadecimalHtml: string;
	decimalHtml: string;
	htmlEntity: string | null;
};

export type TpEmojiPickerCopyFormat =
	| "emoji"
	| "unicode"
	| "hexadecimal-html"
	| "decimal-html"
	| "html-entity";

const copyFormats: TpEmojiPickerCopyFormat[] = [
	"emoji",
	"unicode",
	"hexadecimal-html",
	"decimal-html",
	"html-entity",
];

export function getEmojiMetadata(
	item: TpEmojiPickerItem,
): TpEmojiPickerMetadata {
	const numericCodepoints = item.codepoints.map((value) =>
		Number.parseInt(value, 16),
	);
	const namedEntities = numericCodepoints
		.map((codepoint) => emojiHtmlEntities.get(codepoint))
		.filter((value): value is string => value !== undefined);

	return {
		unicode: item.codepoints.map((value) => `U+${value}`).join(" "),
		hexadecimalHtml: item.codepoints.map((value) => `&#x${value};`).join(""),
		decimalHtml: numericCodepoints
			.map((value) => `&#${String(value)};`)
			.join(""),
		htmlEntity: namedEntities.length === 0 ? null : namedEntities.join(""),
	};
}

/**
 * Parses the official Unicode `emoji-test.txt` format.
 *
 * @summary Parses fully-qualified RGI emoji and standalone components.
 * @param source Unicode Emoji test data.
 * @returns Emoji entries in CLDR order.
 */
export function parseEmojiTestData(source: string): TpEmojiPickerItem[] {
	const items: TpEmojiPickerItem[] = [];
	let group = "";
	let subgroup = "";

	for (const line of source.split(/\r?\n/)) {
		if (line.startsWith("# group:")) {
			group = line.slice("# group:".length).trim();
			continue;
		}
		if (line.startsWith("# subgroup:")) {
			subgroup = line.slice("# subgroup:".length).trim();
			continue;
		}

		const match = line.match(
			/^([0-9A-F ]+)\s+;\s+(?:fully-qualified|component)\s+#\s+(\S+)\s+E([0-9.]+)\s+(.+)$/,
		);
		if (match === null) continue;

		const [, codepointSource, emoji, version, name] = match;
		if (
			codepointSource === undefined ||
			emoji === undefined ||
			version === undefined ||
			name === undefined
		)
			continue;

		items.push({
			emoji,
			name,
			group,
			subgroup,
			version,
			codepoints: codepointSource.trim().split(/\s+/),
		});
	}

	return items;
}

/**
 * `<tp-emoji-picker>` browses and copies the RGI emoji defined by Unicode
 * Emoji 17.0. Names and group order come from the official test data.
 *
 * @summary Unicode Emoji 17.0 picker.
 * @tagname tp-emoji-picker
 * @attr {string} filter = "" - Free-text filter applied to emoji names and metadata.
 * @attr {string} group = "all" - Active Unicode emoji group (`all` by default).
 * @attr {string} copy = "emoji" - Clipboard format: `emoji`, `unicode`, `hexadecimal-html`, `decimal-html`, or `html-entity`.
 * @attr {boolean} compact = false - Shows only the title, filters, and a compact 2em glyph grid.
 * @event tp-emoji-picker-select Emitted after an emoji is selected and copied.
 * @event tp-emoji-picker-copy-error Emitted when the clipboard rejects a copy operation.
 * @example
 * <tp-emoji-picker></tp-emoji-picker>
 */
export class TpEmojiPicker extends TpBase {
	public static readonly unicodeVersion = "17.0";
	private static readonly styleId = "tp-emoji-picker-styles";
	private static nextId = 0;

	private readonly items = parseEmojiTestData(emojiTestData);
	private searchInput: HTMLInputElement | null = null;
	private groupSelect: HTMLSelectElement | null = null;
	private countElement: HTMLElement | null = null;
	private gridElement: HTMLElement | null = null;
	private selectedEmojiElement: HTMLElement | null = null;
	private compactSelectedEmojiElement: HTMLElement | null = null;
	private selectedNameElement: HTMLElement | null = null;
	private selectedMetadataElements: Record<
		keyof TpEmojiPickerMetadata,
		HTMLElement
	> | null = null;
	private copyFormatElement: HTMLElement | null = null;

	public static get observedAttributes(): string[] {
		return ["filter", "group", "copy"];
	}

	public get filter(): string {
		return this.getStringAttribute("filter", "");
	}

	public set filter(value: string) {
		this.setStringAttribute("filter", value.trim());
	}

	public get group(): string {
		return this.getStringAttribute("group", "all");
	}

	public set group(value: string) {
		this.setStringAttribute(
			"group",
			value.trim() === "" ? "all" : value.trim(),
		);
	}

	public get compact(): boolean {
		return this.getBooleanAttribute("compact");
	}

	public set compact(value: boolean) {
		this.setBooleanAttribute("compact", value);
	}

	public get copy(): TpEmojiPickerCopyFormat {
		const value = this.getStringAttribute("copy", "emoji");
		return copyFormats.includes(value as TpEmojiPickerCopyFormat)
			? (value as TpEmojiPickerCopyFormat)
			: "emoji";
	}

	public set copy(value: TpEmojiPickerCopyFormat) {
		this.setStringAttribute("copy", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpEmojiPicker.styleId, style);
		this.ensureStructure();
		this.render();
	}

	protected override attributeChangedCallback(
		_name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue !== newValue && this.isConnected) this.render();
	}

	private ensureStructure(): void {
		if (this.hasAttribute("data-tp-emoji-picker-ready")) return;
		this.setAttribute("data-tp-emoji-picker-ready", "");
		TpEmojiPicker.nextId += 1;
		const id = `tp-emoji-picker-${String(TpEmojiPicker.nextId)}`;

		const heading = document.createElement("div");
		heading.setAttribute("data-tp-emoji-picker-heading", "");
		heading.innerHTML = `<strong>Emoji picker</strong><span>Unicode Emoji ${TpEmojiPicker.unicodeVersion}</span>`;
		const compactSelectedEmoji = document.createElement("output");
		compactSelectedEmoji.setAttribute(
			"data-tp-emoji-picker-compact-selected",
			"",
		);
		compactSelectedEmoji.setAttribute("aria-label", "Selected emoji");
		heading.append(compactSelectedEmoji);

		const controls = document.createElement("div");
		controls.setAttribute("data-tp-emoji-picker-controls", "");
		const searchLabel = document.createElement("label");
		searchLabel.htmlFor = `${id}-search`;
		searchLabel.textContent = "Filter";
		const searchField = document.createElement("div");
		searchField.setAttribute("data-tp-emoji-picker-field", "filter");
		const search = document.createElement("input");
		search.id = `${id}-search`;
		search.type = "search";
		search.placeholder = "Search emoji";
		search.setAttribute("data-tp-emoji-picker-search", "");
		search.addEventListener("input", () => {
			this.filter = search.value;
		});
		const groupLabel = document.createElement("label");
		groupLabel.htmlFor = `${id}-group`;
		groupLabel.textContent = "Group";
		const groupSelect = document.createElement("select");
		groupSelect.id = `${id}-group`;
		groupSelect.setAttribute("data-tp-emoji-picker-group", "");
		groupSelect.addEventListener("change", () => {
			this.group = groupSelect.value;
		});
		const groupField = document.createElement("div");
		groupField.setAttribute("data-tp-emoji-picker-field", "group");
		searchField.append(searchLabel, search);
		groupField.append(groupLabel, groupSelect);
		controls.append(searchField, groupField);

		const copyControls = document.createElement("fieldset");
		copyControls.setAttribute("data-tp-emoji-picker-copy-controls", "");
		const copyLegend = document.createElement("legend");
		copyLegend.textContent = "Copy as";
		const copyFormat = document.createElement("tp-radio-list");
		copyFormat.setAttribute("data-tp-emoji-picker-copy-format", "");
		copyFormat.setAttribute("name", `${id}-copy`);
		copyFormat.setAttribute("orientation", "horizontal");
		copyFormat.innerHTML = `
      <ul>
        <li>Emoji</li>
        <li>Unicode</li>
        <li>Hexa code</li>
        <li>HTML code</li>
        <li>HTML entity</li>
      </ul>
    `;
		copyFormat.addEventListener("tp-radio-list-change", (event) => {
			const value =
				(event as CustomEvent<{ value?: string }>).detail?.value ?? "1";
			this.copy = copyFormats[Number(value) - 1] ?? "emoji";
		});
		copyControls.append(copyLegend, copyFormat);

		const selected = document.createElement("figure");
		selected.setAttribute("data-tp-emoji-picker-selected", "");
		const selectedEmoji = document.createElement("output");
		selectedEmoji.setAttribute("data-tp-emoji-picker-selected-emoji", "");
		selectedEmoji.textContent = "🙂";
		const selectedName = document.createElement("figcaption");
		selectedName.setAttribute("data-tp-emoji-picker-selected-name", "");
		selectedName.textContent = "Click an emoji to copy it";
		const metadata = document.createElement("dl");
		metadata.setAttribute("data-tp-emoji-picker-metadata", "");
		const metadataElements = {} as Record<
			keyof TpEmojiPickerMetadata,
			HTMLElement
		>;
		const definitions: Array<[keyof TpEmojiPickerMetadata, string]> = [
			["unicode", "Unicode"],
			["hexadecimalHtml", "Hexa code"],
			["decimalHtml", "HTML code"],
			["htmlEntity", "HTML entity"],
		];
		for (const [key, label] of definitions) {
			const term = document.createElement("dt");
			term.textContent = label;
			const description = document.createElement("dd");
			const code = document.createElement("code");
			code.textContent = "None";
			description.append(code);
			metadata.append(term, description);
			metadataElements[key] = code;
		}
		selected.append(selectedEmoji, selectedName, metadata);

		const count = document.createElement("p");
		count.setAttribute("data-tp-emoji-picker-count", "");
		const grid = document.createElement("div");
		grid.setAttribute("data-tp-emoji-picker-grid", "");

		this.append(heading, controls, copyControls, selected, count, grid);
		this.searchInput = search;
		this.groupSelect = groupSelect;
		this.copyFormatElement = copyFormat;
		this.selectedEmojiElement = selectedEmoji;
		this.compactSelectedEmojiElement = compactSelectedEmoji;
		this.selectedNameElement = selectedName;
		this.selectedMetadataElements = metadataElements;
		this.countElement = count;
		this.gridElement = grid;
	}

	private getFilteredItems(): TpEmojiPickerItem[] {
		const filter = this.filter.toLocaleLowerCase("en");
		return this.items.filter((item) => {
			if (this.group !== "all" && item.group !== this.group) return false;
			if (filter === "") return true;
			return [
				item.emoji,
				item.name,
				item.group,
				item.subgroup,
				item.codepoints.join(" "),
			].some((value) => value.toLocaleLowerCase("en").includes(filter));
		});
	}

	private render(): void {
		if (
			this.searchInput === null ||
			this.groupSelect === null ||
			this.countElement === null ||
			this.gridElement === null
		)
			return;

		const groups = Array.from(new Set(this.items.map((item) => item.group)));
		const options = ["all", ...groups];
		this.groupSelect.replaceChildren(
			...options.map((value) => {
				const option = document.createElement("option");
				option.value = value;
				option.textContent = value === "all" ? "All groups" : value;
				return option;
			}),
		);
		this.searchInput.value = this.filter;
		this.groupSelect.value = groups.includes(this.group) ? this.group : "all";
		this.copyFormatElement?.setAttribute(
			"value",
			String(copyFormats.indexOf(this.copy) + 1),
		);

		const items = this.getFilteredItems();
		this.countElement.textContent = `${String(items.length)} emoji`;
		const fragment = document.createDocumentFragment();
		for (const item of items) {
			const button = document.createElement("button");
			button.type = "button";
			button.setAttribute("data-tp-emoji-picker-item", "");
			button.dataset.emoji = item.emoji;
			button.dataset.name = item.name;
			button.title = `${item.name} — ${item.subgroup}`;
			button.setAttribute("aria-label", item.name);
			const glyph = document.createElement("span");
			glyph.setAttribute("data-tp-emoji-picker-glyph", "");
			glyph.textContent = item.emoji;
			const name = document.createElement("span");
			name.setAttribute("data-tp-emoji-picker-name", "");
			name.textContent = item.name;
			button.append(glyph, name);
			button.addEventListener("click", () => {
				this.selectItem(item);
			});
			fragment.append(button);
		}
		this.gridElement.replaceChildren(fragment);
	}

	private selectItem(item: TpEmojiPickerItem): void {
		const metadata = getEmojiMetadata(item);
		if (this.selectedEmojiElement !== null)
			this.selectedEmojiElement.textContent = item.emoji;
		if (this.compactSelectedEmojiElement !== null) {
			this.compactSelectedEmojiElement.textContent = item.emoji;
			this.compactSelectedEmojiElement.title = item.name;
		}
		if (this.selectedNameElement !== null) {
			this.selectedNameElement.textContent = `${item.name} — ${item.group} / ${item.subgroup} — E${item.version}`;
		}
		if (this.selectedMetadataElements !== null) {
			this.selectedMetadataElements.unicode.textContent = metadata.unicode;
			this.selectedMetadataElements.hexadecimalHtml.textContent =
				metadata.hexadecimalHtml;
			this.selectedMetadataElements.decimalHtml.textContent =
				metadata.decimalHtml;
			this.selectedMetadataElements.htmlEntity.textContent =
				metadata.htmlEntity ?? "None";
		}

		const clipboardValue = this.getClipboardValue(item, metadata);
		if (navigator.clipboard !== undefined && clipboardValue !== null) {
			void navigator.clipboard
				.writeText(clipboardValue)
				.catch((error: unknown) => {
					this.dispatchEvent(
						new CustomEvent("tp-emoji-picker-copy-error", {
							bubbles: true,
							composed: true,
							detail: {
								...item,
								copy: this.copy,
								value: clipboardValue,
								error,
							},
						}),
					);
				});
		}

		this.dispatchEvent(
			new CustomEvent("tp-emoji-picker-select", {
				bubbles: true,
				composed: true,
				detail: { ...item, copy: this.copy, value: clipboardValue },
			}),
		);
	}

	private getClipboardValue(
		item: TpEmojiPickerItem,
		metadata = getEmojiMetadata(item),
	): string | null {
		switch (this.copy) {
			case "unicode":
				return metadata.unicode;
			case "hexadecimal-html":
				return metadata.hexadecimalHtml;
			case "decimal-html":
				return metadata.decimalHtml;
			case "html-entity":
				return metadata.htmlEntity;
			default:
				return item.emoji;
		}
	}
}

if (!customElements.get("tp-emoji-picker")) {
	customElements.define("tp-emoji-picker", TpEmojiPicker);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-emoji-picker": TpEmojiPicker;
	}
}
