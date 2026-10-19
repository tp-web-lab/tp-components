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
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @credit MathLive https://mathlive.io/
 * @summary Visual LaTeX editing and mathematical keyboard, loaded on demand.
 */
/**
 * @credit MathJax https://www.mathjax.org/
 * @summary Mathematical notation rendering.
 */
// tp-docgen:dependencies:end

import { initializeFieldName } from "../../utilities/field-name.js";
import { isInQuestion } from "../../utilities/question-context.js";
import { TpDropdown } from "../dropdown/dropdown.js";
import style from "./mathfield.css?inline";
import "../copy-code/copy-code.js";
import "../icon-button/icon-button.js";

import "../textfield/textfield.js";

import type { MathfieldElement } from "mathlive";
import { TpBase } from "../base/base.js";

export type TpMathfieldMode = "latexmath" | "asciimath";
export type TpMathfieldLabelPosition = "top" | "bottom" | "start" | "end";

/**
 * @summary Mathematical expression field with live LaTeX or AsciiMath rendering.
 * @tagname tp-mathfield
 * @attr {string} mode = "latexmath" - Mathematical notation (`latexmath` or `asciimath`).
 * @attr {boolean} multiline = false - Uses a multiline editor and display-style rendering.
 * @attr {boolean} mathlive = false - Offers a visual MathLive editor in LaTeX mode, loaded on first opening.
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
	private visualButton: HTMLElement | null = null;
	private visualPanel: HTMLElement | null = null;
	private visualEditor: MathfieldElement | null = null;
	private visualRevision = 0;
	private sourceCopyButton: HTMLElement | null = null;

	public static get observedAttributes(): string[] {
		return [
			"mode",
			"mathlive",
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
		return !isInQuestion(this) && this.getAttribute("mode") === "asciimath"
			? "asciimath"
			: "latexmath";
	}
	public set mode(value: TpMathfieldMode) {
		this.setStringAttribute("mode", value);
	}
	/** Whether a visual LaTeX editor can be opened. */
	public get mathlive(): boolean {
		return this.getBooleanAttribute("mathlive");
	}
	public set mathlive(value: boolean) {
		this.setBooleanAttribute("mathlive", value);
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

	protected disconnectedCallback(): void {
		this.closeVisualEditor();
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
		this.visualButton = document.createElement("tp-icon-button");
		this.visualButton.setAttribute("type", "button");
		this.visualButton.setAttribute("size", "s");
		this.visualButton.setAttribute("data-tp-mathfield-visual-button", "");
		this.visualButton.addEventListener("click", () => {
			if (this.disabled || this.readOnly) return;
			if (this.visualPanel && !this.visualPanel.hidden)
				this.closeVisualEditor();
			else void this.openVisualEditor();
		});
		this.visualPanel = document.createElement("div");
		this.visualPanel.id = `${this.modeButton.id}-visual`;
		this.visualPanel.setAttribute("data-tp-mathfield-visual-panel", "");
		this.visualPanel.hidden = true;
		this.visualButton.setAttribute("aria-controls", this.visualPanel.id);
		this.replaceChildren(this.editor, this.previewPanel, this.visualPanel);
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
				if (this.visualButton) control.append(this.visualButton);
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
			this.modeButton.disabled =
				this.disabled || this.readOnly || isInQuestion(this);
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
		this.syncVisualEditor();
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
		void import("../markdown/markdown.js");
		const markdown = document.createElement("tp-markdown");
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
		this.previewPanel.append(content, renderCopyButton);
	}

	private syncVisualEditor(): void {
		const available = this.mathlive && this.mode === "latexmath";
		if (!available || this.disabled || this.readOnly) this.closeVisualEditor();
		if (this.visualButton) {
			this.visualButton.hidden = !available;
			this.visualButton.toggleAttribute(
				"disabled",
				this.disabled || this.readOnly,
			);
			const open = this.visualPanel?.hidden === false;
			this.visualButton.setAttribute("name", open ? "pencil-off" : "pencil");
			this.visualButton.setAttribute(
				"label",
				open ? "Close visual editor" : "Edit visually",
			);
			this.visualButton.setAttribute("aria-expanded", String(open));
		}
		if (this.visualEditor && this.visualEditor.value !== this.value) {
			this.visualEditor.setValue(this.value, { silenceNotifications: true });
		}
	}

	private closeVisualEditor(): void {
		this.visualRevision += 1;
		this.visualEditor?.executeCommand("hideVirtualKeyboard");
		this.visualEditor = null;
		if (this.visualPanel) {
			this.visualPanel.hidden = true;
			this.visualPanel.replaceChildren();
		}
		if (this.visualButton) {
			this.visualButton.setAttribute("name", "pencil");
			this.visualButton.setAttribute("label", "Edit visually");
			this.visualButton.setAttribute("aria-expanded", "false");
		}
	}

	private async openVisualEditor(): Promise<void> {
		if (
			!this.mathlive ||
			this.mode !== "latexmath" ||
			this.disabled ||
			this.readOnly ||
			!this.visualPanel
		)
			return;
		const revision = ++this.visualRevision;
		this.visualPanel.hidden = false;
		this.visualPanel.textContent = "Loading visual editor…";
		this.syncVisualEditor();
		try {
			const { createVisualMathfield } = await import("./mathlive-editor.js");
			if (revision !== this.visualRevision || !this.isConnected) return;
			const visual = createVisualMathfield();
			visual.setAttribute("aria-label", this.label || "Visual formula editor");
			visual.setValue(this.value, { silenceNotifications: true });
			visual.addEventListener("input", (event) => {
				event.stopPropagation();
				if (this.disabled || this.readOnly) return;
				this.value = visual.value;
				this.dispatchEvent(
					new Event("input", { bubbles: true, composed: true }),
				);
			});
			visual.addEventListener("change", this.handleChange);
			visual.addEventListener("keydown", (event) => {
				if (event.key !== "Escape" || event.defaultPrevented) return;
				event.stopPropagation();
				this.closeVisualEditor();
				this.visualButton?.focus();
			});
			this.visualEditor = visual;
			this.visualPanel.replaceChildren(visual);
			visual.focus();
		} catch {
			if (revision !== this.visualRevision) return;
			this.visualPanel.textContent =
				"The visual editor could not be loaded. Close it and try again, or continue editing the LaTeX source.";
		}
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
