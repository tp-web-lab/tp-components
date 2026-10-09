/**
 * @module components/mathfield
 * @summary Mathematical expression field with live LaTeX or AsciiMath rendering.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-copy-code
 * @summary Copy-to-clipboard button component.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
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
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
// tp-docgen:dependencies:end

import { initializeFieldName } from "../../utilities/field-name.js";
import { TpDropdown } from "../dropdown/dropdown.js";
import style from "./mathfield.css?inline";
import "../copy-code/copy-code.js";
import "../divider/divider.js";
import "../icon-button/icon-button.js";
import "../markdown/markdown.js";
import "../textfield/textfield.js";
import { TpBase } from "../base/base.js";

export type TpMathfieldMode = "latexmath" | "asciimath";
export type TpMathfieldLabelPosition = "top" | "bottom" | "start" | "end";

/**
 * @summary Mathematical expression field with live LaTeX or AsciiMath rendering.
 * @tagname tp-mathfield
 * @attr {string} mode = "latexmath" - Mathematical notation (`latexmath` or `asciimath`).
 * @attr {boolean} multiline = false - Uses a multiline editor and display-style rendering.
 * @attr {boolean} preview = false - Opens the rendered MathJax preview panel.
 * @attr {string} value = "" - Mathematical expression source.
 * @attr {string} label = "" - Visible label associated with the editing field.
 * @attr {string} label-position = "top" - Label position (`top`, `bottom`, `start`, or `end`).
 * @attr {string} placeholder = "Type LaTeX formula..." - Placeholder shown while the field is empty; defaults to the active notation mode.
 * @attr {string} name = "" - Name submitted with the containing form; defaults to the initial inline content when omitted.
 * @attr {string} autocomplete = "" - Native autocomplete hint.
 * @attr {boolean} required = false - Marks the field as required.
 * @attr {boolean} readonly = false - Prevents value editing.
 * @attr {boolean} disabled = false - Disables the field.
 * @attr {boolean} clearable = false - Shows the clear button; it is disabled when empty, readonly or disabled.
 * @event input Emitted when the expression changes while editing.
 * @event change Emitted when the expression is committed or a different notation is selected in the menu.
 * @event tp-clear Emitted after the embedded button clears the expression.
 * @event tp-math-rendered Emitted after MathJax finishes rendering the expression.
 * @cssprop [--tp-mathfield-inline-size=28rem] Component width.
 * @cssprop [--tp-mathfield-preview-background=Canvas] Preview panel background.
 * @cssprop [--tp-mathfield-preview-border-color=var(--tp-neutral-stroke-soft)] Preview border color.
 * @cssprop [--tp-mathfield-preview-padding=0.75rem] Preview padding.
 * @example
 * <tp-mathfield label="Formula" value="E = mc^2" clearable></tp-mathfield>
 */
export class TpMathfield extends TpBase {
	private static nextModeId = 0;
	private modeButton: HTMLButtonElement | null = null;
	private modeDropdown: TpDropdown | null = null;
	private static readonly styleId = "tp-mathfield-styles";
	private editor: HTMLElement | null = null;
	private previewPanel: HTMLElement | null = null;
	private previewButton: HTMLElement | null = null;
	private sourceCopyButton: HTMLElement | null = null;

	public static get observedAttributes(): string[] {
		return [
			"mode",
			"multiline",
			"preview",
			"value",
			"label",
			"label-position",
			"placeholder",
			"name",
			"autocomplete",
			"required",
			"readonly",
			"disabled",
			"clearable",
		];
	}

	/** Mathematical notation used by the expression. */
	public get mode(): TpMathfieldMode {
		return this.getAttribute("mode") === "asciimath"
			? "asciimath"
			: "latexmath";
	}
	public set mode(value: TpMathfieldMode) {
		this.setStringAttribute("mode", value);
	}
	/** Whether the editor and rendering use multiline display mode. */
	public get multiline(): boolean {
		return this.getBooleanAttribute("multiline");
	}
	public set multiline(value: boolean) {
		this.setBooleanAttribute("multiline", value);
	}
	/** Whether the rendered MathJax preview is visible. */
	public get previewVisible(): boolean {
		return this.getBooleanAttribute("preview");
	}
	public set previewVisible(value: boolean) {
		this.setBooleanAttribute("preview", value);
	}
	/** Mathematical expression source. */
	public get value(): string {
		return this.getStringAttribute("value");
	}
	public set value(value: string) {
		this.setStringAttribute("value", value);
	}
	/** Visible label associated with the editing field. */
	public get label(): string {
		return this.getStringAttribute("label");
	}
	public set label(value: string) {
		this.setStringAttribute("label", value);
	}
	/** Position of the visible label around the editing field. */
	public get labelPosition(): TpMathfieldLabelPosition {
		const value = this.getAttribute("label-position");
		return value === "bottom" || value === "start" || value === "end"
			? value
			: "top";
	}
	public set labelPosition(value: TpMathfieldLabelPosition) {
		this.setStringAttribute("label-position", value);
	}
	/** Placeholder shown while the field is empty. */
	public get placeholder(): string {
		return (
			this.getAttribute("placeholder") ??
			`Type ${this.mode === "asciimath" ? "AsciiMath" : "LaTeX"} formula...`
		);
	}
	public set placeholder(value: string) {
		this.setStringAttribute("placeholder", value);
	}
	/** Name submitted with the containing form; defaults to the initial inline content when omitted. */
	public get name(): string {
		return this.getStringAttribute("name");
	}
	public set name(value: string) {
		this.setStringAttribute("name", value);
	}
	/** Native autocomplete hint. */
	public get autocomplete(): string {
		return this.getStringAttribute("autocomplete");
	}
	public set autocomplete(value: string) {
		this.setStringAttribute("autocomplete", value);
	}
	/** Whether a value is required. */
	public get required(): boolean {
		return this.getBooleanAttribute("required");
	}
	public set required(value: boolean) {
		this.setBooleanAttribute("required", value);
	}
	/** Whether the value cannot be edited. */
	public get readOnly(): boolean {
		return this.getBooleanAttribute("readonly");
	}
	public set readOnly(value: boolean) {
		this.setBooleanAttribute("readonly", value);
	}
	/** Whether the field is disabled. */
	public get disabled(): boolean {
		return this.getBooleanAttribute("disabled");
	}
	public set disabled(value: boolean) {
		this.setBooleanAttribute("disabled", value);
	}
	/** Whether the embedded clear button can be displayed. */
	public get clearable(): boolean {
		return this.getBooleanAttribute("clearable");
	}
	public set clearable(value: boolean) {
		this.setBooleanAttribute("clearable", value);
	}

	protected override connectedCallback(): void {
		initializeFieldName(this);
		super.connectedCallback();
		this.ensureGlobalStyle(TpMathfield.styleId, style);
		this.renderStructure();
	}

	protected attributeChangedCallback(name: string): void {
		if (!this.isConnected) return;
		this.syncEditor();
		if (name !== "preview") this.renderPreview();
	}

	/** Focuses the expression editor. */
	public override focus(options?: FocusOptions): void {
		(
			this.editor as
				| (HTMLElement & { focus(options?: FocusOptions): void })
				| null
		)?.focus(options);
	}

	/** Clears the expression and emits `input`, `change`, and `tp-clear`. */
	public clear(): void {
		if (this.disabled || this.readOnly || this.value === "") return;
		(this.editor as (HTMLElement & { clear(): void }) | null)?.clear();
	}

	/** Returns the mathematical expression source. */
	public getValue(): string {
		return this.value;
	}

	private renderStructure(): void {
		this.editor = document.createElement("tp-textfield");
		this.editor.setAttribute("data-tp-mathfield-editor", "");
		this.editor.addEventListener("input", this.handleInput);
		this.editor.addEventListener("change", this.handleChange);
		this.editor.addEventListener("tp-clear", this.handleClear);
		this.previewButton = document.createElement("tp-icon-button");
		this.previewButton.setAttribute("data-tp-mathfield-preview-button", "");
		this.previewButton.setAttribute("name", "eye-outline");
		this.previewButton.setAttribute("label", "Show preview");
		this.previewButton.setAttribute("size", "s");
		this.previewButton.addEventListener("click", this.handlePreviewToggle);
		this.sourceCopyButton = document.createElement("tp-copy-code");
		this.sourceCopyButton.setAttribute("data-tp-mathfield-source-copy", "");
		this.sourceCopyButton.setAttribute("copied-text", "Formula copied!");
		(
			this.sourceCopyButton as HTMLElement & { forElement: HTMLElement | null }
		).forElement = this;
		this.previewPanel = document.createElement("div");
		this.previewPanel.setAttribute("data-tp-mathfield-preview", "");
		this.previewPanel.setAttribute("aria-live", "polite");
		this.modeButton = document.createElement("button");
		this.modeButton.type = "button";
		this.modeButton.id = `tp-mathfield-mode-${++TpMathfield.nextModeId}`;
		this.modeButton.setAttribute("data-tp-mathfield-mode-button", "");
		this.modeButton.setAttribute("aria-haspopup", "menu");
		this.modeDropdown = new TpDropdown();
		this.modeDropdown.anchor = `#${this.modeButton.id}`;
		this.modeDropdown.placement = "bottom";
		this.modeDropdown.setAttribute("outside-click", "");
		this.modeDropdown.setAttribute("data-tp-mathfield-mode-menu", "");
		const list = document.createElement("ul");
		for (const mode of ["latexmath", "asciimath"] as const) {
			const item = document.createElement("li");
			item.dataset.mode = mode;
			const check = document.createElement("span");
			check.dataset.modeCheck = "";
			check.setAttribute("aria-hidden", "true");
			check.textContent = "✓";
			item.append(check, document.createTextNode(mode));
			item.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					event.stopImmediatePropagation();
					item.click();
				} else if (event.key === "Escape") this.modeButton?.focus();
			});
			item.addEventListener("click", () => {
				if (this.disabled || this.readOnly) return;
				const changed = this.mode !== mode;
				this.mode = mode;
				this.modeDropdown?.hide();
				this.modeButton?.focus();
				if (changed)
					this.dispatchEvent(
						new Event("change", { bubbles: true, composed: true }),
					);
			});
			list.append(item);
		}
		this.modeDropdown.append(list);
		this.modeDropdown.addEventListener("tp-dropdown-toggle", () => {
			this.modeButton?.setAttribute(
				"aria-expanded",
				String(this.modeDropdown?.open ?? false),
			);
		});
		this.modeButton.addEventListener("click", (event) => {
			event.preventDefault();
			if (this.disabled || this.readOnly) return;
			this.modeDropdown?.toggle();
			if (this.modeDropdown?.open)
				this.modeDropdown
					.querySelector<HTMLElement>(`[data-mode="${this.mode}"]`)
					?.focus();
		});
		// Connect the dropdown only after its trigger exists in the document.
		this.replaceChildren(this.editor, this.previewPanel);
		this.syncEditor();
		this.append(this.modeDropdown);
		this.renderPreview();
	}

	private syncEditor(): void {
		if (this.editor === null) return;
		const stringAttributes = [
			"value",
			"label",
			"label-position",
			"name",
			"autocomplete",
		] as const;
		for (const name of stringAttributes) {
			const value =
				name === "label-position"
					? this.labelPosition
					: this.getStringAttribute(name);
			if (value === "") this.editor.removeAttribute(name);
			else this.editor.setAttribute(name, value);
		}
		this.editor.setAttribute("placeholder", this.placeholder);
		for (const name of [
			"multiline",
			"required",
			"readonly",
			"disabled",
			"clearable",
		] as const) {
			this.editor.toggleAttribute(name, this.hasAttribute(name));
		}
		if (this.previewButton !== null) {
			this.previewButton.setAttribute(
				"aria-pressed",
				String(this.previewVisible),
			);
			this.previewButton.setAttribute(
				"label",
				this.previewVisible ? "Hide preview" : "Show preview",
			);
			this.previewButton.toggleAttribute("disabled", this.disabled);
			const control = this.editor.querySelector<HTMLElement>(
				"[data-tp-textfield-control]",
			);
			if (control !== null) {
				if (this.sourceCopyButton !== null)
					control.append(this.sourceCopyButton);
				control.append(this.previewButton);
			}
		}
		if (this.modeButton && this.modeDropdown) {
			const marker = this.editor.querySelector<HTMLElement>(
				"tp-icon[data-tp-textfield-type]",
			);
			if (marker) {
				marker.removeAttribute("data-tp-textfield-type");
				marker.replaceWith(this.modeButton);
				this.modeButton.replaceChildren(marker);
			}
			this.modeButton.disabled = this.disabled || this.readOnly;
			this.modeButton.setAttribute(
				"aria-label",
				`Mathematical notation: ${this.mode}`,
			);
			this.modeButton.setAttribute(
				"aria-expanded",
				String(this.modeDropdown.open),
			);
			if (this.modeButton.disabled) this.modeDropdown.hide();
			for (const item of this.modeDropdown.querySelectorAll<HTMLElement>(
				"[data-mode]",
			)) {
				const active = item.dataset.mode === this.mode;
				item.setAttribute(
					"aria-label",
					`${item.dataset.mode}${active ? ", active" : ""}`,
				);
				const check = item.querySelector<HTMLElement>("[data-mode-check]");
				if (check) check.style.visibility = active ? "visible" : "hidden";
			}
		}
		this.previewPanel?.toggleAttribute(
			"hidden",
			!this.previewVisible || this.value.trim() === "",
		);
	}

	private renderPreview(): void {
		if (this.previewPanel === null) return;
		this.previewPanel.replaceChildren();
		if (this.value.trim() === "") {
			return;
		}
		const markdown = document.createElement("tp-markdown");
		const modeLabel = document.createElement("code");
		modeLabel.setAttribute("data-tp-mathfield-preview-mode", "");
		modeLabel.textContent = this.mode;
		const content = document.createElement("div");
		content.setAttribute("data-tp-mathfield-preview-content", "");
		const renderCopyButton = document.createElement("tp-copy-code");
		renderCopyButton.setAttribute("data-tp-mathfield-render-copy", "");
		renderCopyButton.setAttribute("copied-text", "SVG copied!");
		const copyTarget = content as HTMLElement & { getCode?: () => string };
		copyTarget.getCode = () => content.querySelector("svg")?.outerHTML ?? "";
		(
			renderCopyButton as HTMLElement & { forElement: HTMLElement | null }
		).forElement = content;
		const divider = document.createElement("tp-divider");
		divider.setAttribute("data-tp-mathfield-preview-divider", "");
		divider.setAttribute(
			"orientation",
			this.multiline ? "horizontal" : "vertical",
		);
		const source = document.createElement("script");
		source.type = "tp/markdown";
		const expression = this.multiline
			? `\`\`\`${this.mode}\n${this.value}\n\`\`\``
			: `:${this.mode}:\`${this.value.replaceAll("`", "\\`")}\``;
		source.textContent = `---\nextensions:\n  - math\n---\n\n${expression}`;
		markdown.append(source);
		markdown.addEventListener("tp-markdown-rendered", this.handleRendered, {
			once: true,
		});
		content.append(markdown);
		this.previewPanel.append(modeLabel, renderCopyButton, divider, content);
	}

	private readonly handleInput = (event: Event): void => {
		event.stopPropagation();
		this.setStringAttribute(
			"value",
			(this.editor as HTMLElement & { value: string }).value,
		);
		this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
	};
	private readonly handleChange = (event: Event): void => {
		event.stopPropagation();
		this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
	};
	private readonly handleClear = (event: Event): void => {
		event.stopPropagation();
		this.dispatchEvent(
			new CustomEvent("tp-clear", { bubbles: true, composed: true }),
		);
	};
	private readonly handlePreviewToggle = (): void => {
		if (this.disabled || this.value.trim() === "") return;
		this.previewVisible = !this.previewVisible;
	};
	private readonly handleRendered = (event: Event): void => {
		event.stopPropagation();
		this.dispatchEvent(
			new CustomEvent("tp-math-rendered", {
				bubbles: true,
				composed: true,
				detail: { mode: this.mode, value: this.value },
			}),
		);
	};
}

if (!customElements.get("tp-mathfield"))
	customElements.define("tp-mathfield", TpMathfield);

declare global {
	interface HTMLElementTagNameMap {
		"tp-mathfield": TpMathfield;
	}
}
