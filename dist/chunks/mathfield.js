import { t as e } from "./base.js";
import "./icon-button.js";
import { initializeFieldName as t } from "../utilities/field-name.js";
import "../components/textfield/textfield.js";
import { t as n } from "./dropdown.js";
import "./copy-code.js";
import { isInQuestion as r } from "../utilities/question-context.js";
//#region src/components/mathfield/mathfield.css?inline
var i = "tp-mathfield{vertical-align:middle;flex-wrap:wrap;align-items:flex-end;gap:.5rem;min-inline-size:0;max-inline-size:100%;display:inline-flex}tp-mathfield[label-position=bottom]{align-items:flex-start}tp-mathfield[label-position=start],tp-mathfield[label-position=end]{align-items:center}tp-mathfield [data-tp-mathfield-editor]{flex:0 1 var(--tp-mathfield-inline-size,28rem);inline-size:var(--tp-mathfield-inline-size,28rem);min-inline-size:0;max-inline-size:100%}.tp-markdown-output>p:has(>tp-mathfield){display:flow-root}.tp-markdown-output>tp-mathfield,tp-mathfield[multiline]{inline-size:auto;display:flex}tp-mathfield[multiline]{max-inline-size:min(100%, var(--tp-mathfield-inline-size,28rem))}tp-mathfield[multiline] [data-tp-mathfield-editor]{flex-basis:100%;inline-size:100%}tp-mathfield [data-tp-textfield-control] [data-tp-mathfield-preview-button]{margin:0;position:absolute;inset-block-start:50%;inset-inline-end:1.9rem;transform:translateY(-50%)}tp-mathfield [data-tp-textfield-control] [data-tp-mathfield-source-copy]{min-block-size:1.75rem;min-inline-size:1.75rem;margin:0;inset-block-start:50%;inset-inline-end:3.65rem;transform:translateY(-50%)}tp-mathfield [data-tp-textfield-control] [data-tp-textfield-clear]{inset-inline-end:5.4rem}tp-mathfield tp-textfield [data-tp-textfield-input],tp-mathfield tp-textfield[clearable] [data-tp-textfield-input]{padding-inline-end:calc(var(--tp-textfield-padding-inline,.75em) + 7rem)}tp-mathfield[multiline] [data-tp-textfield-control] [data-tp-mathfield-preview-button],tp-mathfield[multiline] [data-tp-textfield-control] [data-tp-mathfield-source-copy]{inset-block-start:.35em;transform:none}tp-mathfield [data-tp-mathfield-preview]{box-sizing:border-box;inline-size:max-content;min-inline-size:0;max-inline-size:100%;padding:var(--tp-mathfield-preview-padding,.75rem);border:1px solid var(--tp-mathfield-preview-border-color,var(--tp-neutral-stroke-soft));border-radius:var(--tp-border-radius-sm);background:var(--tp-mathfield-preview-background,Canvas);text-align:start;align-items:center;display:inline-flex;overflow-x:auto}tp-mathfield[multiline] [data-tp-mathfield-preview]{inline-size:100%;margin-block-start:.5rem;display:grid}tp-mathfield [data-tp-mathfield-preview][hidden]{display:none}tp-mathfield [data-tp-mathfield-preview]{gap:.75rem}tp-mathfield[multiline] [data-tp-mathfield-preview]{grid-template-columns:minmax(0,1fr) auto}tp-mathfield [data-tp-mathfield-preview-content]{min-inline-size:0}tp-mathfield [data-tp-mathfield-render-copy]{min-block-size:1.75rem;min-inline-size:1.75rem;position:relative;inset:auto}tp-mathfield [data-tp-mathfield-visual-button][hidden],tp-mathfield [data-tp-mathfield-visual-panel][hidden]{display:none}tp-mathfield [data-tp-mathfield-visual-panel]{flex-basis:100%;min-inline-size:0;max-inline-size:100%}tp-mathfield math-field{box-sizing:border-box;width:100%;min-width:0;font-size:1.25em;display:block}tp-mathfield [data-tp-mathfield-preview] .tp-markdown-output>:first-child{margin-block-start:0}tp-mathfield [data-tp-mathfield-preview] .tp-markdown-output>:last-child{margin-block-end:0}tp-mathfield [data-tp-mathfield-mode-button]{color:var(--tp-text-muted);cursor:pointer;background:0 0;border:0;justify-content:center;align-items:center;padding:0;display:inline-flex;position:absolute;inset-block-start:50%;inset-inline-end:.4em;transform:translateY(-50%)}tp-mathfield [data-tp-mathfield-mode-button]:focus-visible{outline:2px solid var(--tp-brand-stroke);outline-offset:2px}tp-mathfield [data-tp-mathfield-mode-button]:disabled{cursor:not-allowed}tp-mathfield [data-tp-mathfield-mode-menu] [data-mode-check]{inline-size:1.25em;display:inline-block}tp-mathfield[multiline] [data-tp-mathfield-preview-content]{text-align:center}tp-mathfield [data-tp-textfield-control] [data-tp-mathfield-visual-button]{margin:0;position:absolute;inset-block-start:50%;inset-inline-end:3.65rem;transform:translateY(-50%)}tp-mathfield [data-tp-textfield-control]:has([data-tp-mathfield-visual-button]:not([hidden])) [data-tp-mathfield-source-copy]{inset-inline-end:5.4rem}tp-mathfield [data-tp-textfield-control]:has([data-tp-mathfield-visual-button]:not([hidden])) [data-tp-textfield-clear]{inset-inline-end:7.15rem}tp-mathfield [data-tp-textfield-control]:has([data-tp-mathfield-visual-button]:not([hidden])) [data-tp-textfield-input]{padding-inline-end:calc(var(--tp-textfield-padding-inline,.75em) + 8.75rem)}tp-mathfield[multiline] [data-tp-textfield-control] [data-tp-mathfield-visual-button]{inset-block-start:.35em;transform:none}", a = class a extends e {
	static nextModeId = 0;
	modeButton = null;
	modeDropdown = null;
	static styleId = "tp-mathfield-styles";
	editor = null;
	previewPanel = null;
	previewButton = null;
	visualButton = null;
	visualPanel = null;
	visualEditor = null;
	visualRevision = 0;
	sourceCopyButton = null;
	static get observedAttributes() {
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
			"clearable"
		];
	}
	get mode() {
		return !r(this) && this.getAttribute("mode") === "asciimath" ? "asciimath" : "latexmath";
	}
	set mode(e) {
		this.setStringAttribute("mode", e);
	}
	get mathlive() {
		return this.getBooleanAttribute("mathlive");
	}
	set mathlive(e) {
		this.setBooleanAttribute("mathlive", e);
	}
	get multiline() {
		return this.getBooleanAttribute("multiline");
	}
	set multiline(e) {
		this.setBooleanAttribute("multiline", e);
	}
	get previewVisible() {
		return this.getBooleanAttribute("preview");
	}
	set previewVisible(e) {
		this.setBooleanAttribute("preview", e);
	}
	get value() {
		return this.getStringAttribute("value");
	}
	set value(e) {
		this.setStringAttribute("value", e);
	}
	get label() {
		return this.getStringAttribute("label");
	}
	set label(e) {
		this.setStringAttribute("label", e);
	}
	get labelPosition() {
		let e = this.getAttribute("label-position");
		return e === "bottom" || e === "start" || e === "end" ? e : "top";
	}
	set labelPosition(e) {
		this.setStringAttribute("label-position", e);
	}
	get placeholder() {
		return this.getAttribute("placeholder") ?? `Type ${this.mode === "asciimath" ? "AsciiMath" : "LaTeX"} formula...`;
	}
	set placeholder(e) {
		this.setStringAttribute("placeholder", e);
	}
	get name() {
		return this.getStringAttribute("name");
	}
	set name(e) {
		this.setStringAttribute("name", e);
	}
	get autocomplete() {
		return this.getStringAttribute("autocomplete");
	}
	set autocomplete(e) {
		this.setStringAttribute("autocomplete", e);
	}
	get required() {
		return this.getBooleanAttribute("required");
	}
	set required(e) {
		this.setBooleanAttribute("required", e);
	}
	get readOnly() {
		return this.getBooleanAttribute("readonly");
	}
	set readOnly(e) {
		this.setBooleanAttribute("readonly", e);
	}
	get disabled() {
		return this.getBooleanAttribute("disabled");
	}
	set disabled(e) {
		this.setBooleanAttribute("disabled", e);
	}
	get clearable() {
		return this.getBooleanAttribute("clearable");
	}
	set clearable(e) {
		this.setBooleanAttribute("clearable", e);
	}
	connectedCallback() {
		t(this), super.connectedCallback(), this.ensureGlobalStyle(a.styleId, i), this.renderStructure();
	}
	attributeChangedCallback(e) {
		this.isConnected && (this.syncEditor(), e !== "preview" && this.renderPreview());
	}
	focus(e) {
		this.editor?.focus(e);
	}
	clear() {
		this.disabled || this.readOnly || this.value === "" || this.editor?.clear();
	}
	getValue() {
		return this.value;
	}
	disconnectedCallback() {
		this.closeVisualEditor();
	}
	renderStructure() {
		this.editor = document.createElement("tp-textfield"), this.editor.setAttribute("data-tp-mathfield-editor", ""), this.editor.addEventListener("input", this.handleInput), this.editor.addEventListener("change", this.handleChange), this.editor.addEventListener("tp-clear", this.handleClear), this.previewButton = document.createElement("tp-icon-button"), this.previewButton.setAttribute("data-tp-mathfield-preview-button", ""), this.previewButton.setAttribute("name", "eye-outline"), this.previewButton.setAttribute("label", "Show preview"), this.previewButton.setAttribute("size", "s"), this.previewButton.addEventListener("click", this.handlePreviewToggle), this.sourceCopyButton = document.createElement("tp-copy-code"), this.sourceCopyButton.setAttribute("data-tp-mathfield-source-copy", ""), this.sourceCopyButton.setAttribute("copied-text", "Formula copied!"), this.sourceCopyButton.forElement = this, this.previewPanel = document.createElement("div"), this.previewPanel.setAttribute("data-tp-mathfield-preview", ""), this.previewPanel.setAttribute("aria-live", "polite"), this.modeButton = document.createElement("button"), this.modeButton.type = "button", this.modeButton.id = `tp-mathfield-mode-${++a.nextModeId}`, this.modeButton.setAttribute("data-tp-mathfield-mode-button", ""), this.modeButton.setAttribute("aria-haspopup", "menu"), this.modeDropdown = new n(), this.modeDropdown.anchor = `#${this.modeButton.id}`, this.modeDropdown.placement = "bottom", this.modeDropdown.setAttribute("outside-click", ""), this.modeDropdown.setAttribute("data-tp-mathfield-mode-menu", "");
		let e = document.createElement("ul");
		for (let t of ["latexmath", "asciimath"]) {
			let n = document.createElement("li");
			n.dataset.mode = t;
			let r = document.createElement("span");
			r.dataset.modeCheck = "", r.setAttribute("aria-hidden", "true"), r.textContent = "✓", n.append(r, document.createTextNode(t)), n.addEventListener("keydown", (e) => {
				e.key === "Enter" || e.key === " " ? (e.preventDefault(), e.stopImmediatePropagation(), n.click()) : e.key === "Escape" && this.modeButton?.focus();
			}), n.addEventListener("click", () => {
				if (this.disabled || this.readOnly) return;
				let e = this.mode !== t;
				this.mode = t, this.modeDropdown?.hide(), this.modeButton?.focus(), e && this.dispatchEvent(new Event("change", {
					bubbles: !0,
					composed: !0
				}));
			}), e.append(n);
		}
		this.modeDropdown.append(e), this.modeDropdown.addEventListener("tp-dropdown-toggle", () => {
			this.modeButton?.setAttribute("aria-expanded", String(this.modeDropdown?.open ?? !1));
		}), this.modeButton.addEventListener("click", (e) => {
			e.preventDefault(), !(this.disabled || this.readOnly) && (this.modeDropdown?.toggle(), this.modeDropdown?.open && this.modeDropdown.querySelector(`[data-mode="${this.mode}"]`)?.focus());
		}), this.visualButton = document.createElement("tp-icon-button"), this.visualButton.setAttribute("type", "button"), this.visualButton.setAttribute("size", "s"), this.visualButton.setAttribute("data-tp-mathfield-visual-button", ""), this.visualButton.addEventListener("click", () => {
			this.disabled || this.readOnly || (this.visualPanel && !this.visualPanel.hidden ? this.closeVisualEditor() : this.openVisualEditor());
		}), this.visualPanel = document.createElement("div"), this.visualPanel.id = `${this.modeButton.id}-visual`, this.visualPanel.setAttribute("data-tp-mathfield-visual-panel", ""), this.visualPanel.hidden = !0, this.visualButton.setAttribute("aria-controls", this.visualPanel.id), this.replaceChildren(this.editor, this.previewPanel, this.visualPanel), this.syncEditor(), this.append(this.modeDropdown), this.renderPreview();
	}
	syncEditor() {
		if (this.editor !== null) {
			for (let e of [
				"value",
				"label",
				"label-position",
				"name",
				"autocomplete"
			]) {
				let t = e === "label-position" ? this.labelPosition : this.getStringAttribute(e);
				t === "" ? this.editor.removeAttribute(e) : this.editor.setAttribute(e, t);
			}
			this.editor.setAttribute("placeholder", this.placeholder);
			for (let e of [
				"multiline",
				"required",
				"readonly",
				"disabled",
				"clearable"
			]) this.editor.toggleAttribute(e, this.hasAttribute(e));
			if (this.previewButton !== null) {
				this.previewButton.setAttribute("aria-pressed", String(this.previewVisible)), this.previewButton.setAttribute("label", this.previewVisible ? "Hide preview" : "Show preview"), this.previewButton.toggleAttribute("disabled", this.disabled);
				let e = this.editor.querySelector("[data-tp-textfield-control]");
				e !== null && (this.sourceCopyButton !== null && e.append(this.sourceCopyButton), this.visualButton && e.append(this.visualButton), e.append(this.previewButton));
			}
			if (this.modeButton && this.modeDropdown) {
				let e = this.editor.querySelector("tp-icon[data-tp-textfield-type]");
				e && (e.removeAttribute("data-tp-textfield-type"), e.replaceWith(this.modeButton), this.modeButton.replaceChildren(e)), this.modeButton.disabled = this.disabled || this.readOnly || r(this), this.modeButton.setAttribute("aria-label", `Mathematical notation: ${this.mode}`), this.modeButton.setAttribute("aria-expanded", String(this.modeDropdown.open)), this.modeButton.disabled && this.modeDropdown.hide();
				for (let e of this.modeDropdown.querySelectorAll("[data-mode]")) {
					let t = e.dataset.mode === this.mode;
					e.setAttribute("aria-label", `${e.dataset.mode}${t ? ", active" : ""}`);
					let n = e.querySelector("[data-mode-check]");
					n && (n.style.visibility = t ? "visible" : "hidden");
				}
			}
			this.syncVisualEditor(), this.previewPanel?.toggleAttribute("hidden", !this.previewVisible || this.value.trim() === "");
		}
	}
	renderPreview() {
		if (this.previewPanel === null || (this.previewPanel.replaceChildren(), this.value.trim() === "")) return;
		import("../components/markdown/markdown.js");
		let e = document.createElement("tp-markdown"), t = document.createElement("div");
		t.setAttribute("data-tp-mathfield-preview-content", "");
		let n = document.createElement("tp-copy-code");
		n.setAttribute("data-tp-mathfield-render-copy", ""), n.setAttribute("copied-text", "SVG copied!");
		let r = t;
		r.getCode = () => t.querySelector("svg")?.outerHTML ?? "", n.forElement = t;
		let i = document.createElement("script");
		i.type = "tp/markdown", i.textContent = `---\nextensions:\n  - math\n---\n\n${this.multiline ? `\`\`\`${this.mode}\n${this.value}\n\`\`\`` : `:${this.mode}:\`${this.value.replaceAll("`", "\\`")}\``}`, e.append(i), e.addEventListener("tp-markdown-rendered", this.handleRendered, { once: !0 }), t.append(e), this.previewPanel.append(t, n);
	}
	syncVisualEditor() {
		let e = this.mathlive && this.mode === "latexmath";
		if ((!e || this.disabled || this.readOnly) && this.closeVisualEditor(), this.visualButton) {
			this.visualButton.hidden = !e, this.visualButton.toggleAttribute("disabled", this.disabled || this.readOnly);
			let t = this.visualPanel?.hidden === !1;
			this.visualButton.setAttribute("name", t ? "pencil-off" : "pencil"), this.visualButton.setAttribute("label", t ? "Close visual editor" : "Edit visually"), this.visualButton.setAttribute("aria-expanded", String(t));
		}
		this.visualEditor && this.visualEditor.value !== this.value && this.visualEditor.setValue(this.value, { silenceNotifications: !0 });
	}
	closeVisualEditor() {
		this.visualRevision += 1, this.visualEditor?.executeCommand("hideVirtualKeyboard"), this.visualEditor = null, this.visualPanel && (this.visualPanel.hidden = !0, this.visualPanel.replaceChildren()), this.visualButton && (this.visualButton.setAttribute("name", "pencil"), this.visualButton.setAttribute("label", "Edit visually"), this.visualButton.setAttribute("aria-expanded", "false"));
	}
	async openVisualEditor() {
		if (!this.mathlive || this.mode !== "latexmath" || this.disabled || this.readOnly || !this.visualPanel) return;
		let e = ++this.visualRevision;
		this.visualPanel.hidden = !1, this.visualPanel.textContent = "Loading visual editor…", this.syncVisualEditor();
		try {
			let { createVisualMathfield: t } = await import("../components/mathfield/mathlive-editor.js");
			if (e !== this.visualRevision || !this.isConnected) return;
			let n = t();
			n.setAttribute("aria-label", this.label || "Visual formula editor"), n.setValue(this.value, { silenceNotifications: !0 }), n.addEventListener("input", (e) => {
				e.stopPropagation(), !(this.disabled || this.readOnly) && (this.value = n.value, this.dispatchEvent(new Event("input", {
					bubbles: !0,
					composed: !0
				})));
			}), n.addEventListener("change", this.handleChange), n.addEventListener("keydown", (e) => {
				e.key !== "Escape" || e.defaultPrevented || (e.stopPropagation(), this.closeVisualEditor(), this.visualButton?.focus());
			}), this.visualEditor = n, this.visualPanel.replaceChildren(n), n.focus();
		} catch {
			if (e !== this.visualRevision) return;
			this.visualPanel.textContent = "The visual editor could not be loaded. Close it and try again, or continue editing the LaTeX source.";
		}
	}
	handleInput = (e) => {
		e.stopPropagation(), this.setStringAttribute("value", this.editor.value), this.dispatchEvent(new Event("input", {
			bubbles: !0,
			composed: !0
		}));
	};
	handleChange = (e) => {
		e.stopPropagation(), this.dispatchEvent(new Event("change", {
			bubbles: !0,
			composed: !0
		}));
	};
	handleClear = (e) => {
		e.stopPropagation(), this.dispatchEvent(new CustomEvent("tp-clear", {
			bubbles: !0,
			composed: !0
		}));
	};
	handlePreviewToggle = () => {
		this.disabled || this.value.trim() === "" || (this.previewVisible = !this.previewVisible);
	};
	handleRendered = (e) => {
		e.stopPropagation(), this.dispatchEvent(new CustomEvent("tp-math-rendered", {
			bubbles: !0,
			composed: !0,
			detail: {
				mode: this.mode,
				value: this.value
			}
		}));
	};
};
customElements.get("tp-mathfield") || customElements.define("tp-mathfield", a);
//#endregion
export { a as t };

//# sourceMappingURL=mathfield.js.map