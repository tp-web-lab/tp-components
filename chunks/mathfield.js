import { $n as e, Ku as t } from "./lib/typescript/typescript.js";
import { initializeFieldName as n } from "../utilities/field-name.js";
import "../components/textfield/textfield.js";
//#region src/components/mathfield/mathfield.css?inline
var r = "tp-mathfield{vertical-align:middle;flex-wrap:wrap;align-items:flex-end;gap:.5rem;min-inline-size:0;max-inline-size:100%;display:inline-flex}tp-mathfield[label-position=bottom]{align-items:flex-start}tp-mathfield[label-position=start],tp-mathfield[label-position=end]{align-items:center}tp-mathfield [data-tp-mathfield-editor]{flex:0 0 var(--tp-mathfield-inline-size,28rem);inline-size:var(--tp-mathfield-inline-size,28rem);min-inline-size:0}tp-mathfield[multiline]{inline-size:var(--tp-mathfield-inline-size,28rem);display:block}tp-mathfield[multiline] [data-tp-mathfield-editor]{inline-size:100%}tp-mathfield [data-tp-textfield-control] [data-tp-mathfield-preview-button]{margin:0;position:absolute;inset-block-start:50%;inset-inline-end:1.9rem;transform:translateY(-50%)}tp-mathfield [data-tp-textfield-control] [data-tp-mathfield-source-copy]{min-block-size:1.75rem;min-inline-size:1.75rem;margin:0;inset-block-start:50%;inset-inline-end:3.65rem;transform:translateY(-50%)}tp-mathfield [data-tp-textfield-control] [data-tp-textfield-clear]{inset-inline-end:5.4rem}tp-mathfield tp-textfield [data-tp-textfield-input],tp-mathfield tp-textfield[clearable] [data-tp-textfield-input]{padding-inline-end:calc(var(--tp-textfield-padding-inline,.75em) + 7rem)}tp-mathfield[multiline] [data-tp-textfield-control] [data-tp-mathfield-preview-button],tp-mathfield[multiline] [data-tp-textfield-control] [data-tp-mathfield-source-copy]{inset-block-start:.35em;transform:none}tp-mathfield [data-tp-mathfield-preview]{box-sizing:border-box;inline-size:max-content;min-inline-size:0;max-inline-size:100%;padding:var(--tp-mathfield-preview-padding,.75rem);border:1px solid var(--tp-mathfield-preview-border-color,var(--tp-neutral-stroke-soft));border-radius:var(--tp-border-radius-sm);background:var(--tp-mathfield-preview-background,Canvas);text-align:start;align-items:center;display:inline-flex;overflow-x:auto}tp-mathfield[multiline] [data-tp-mathfield-preview]{inline-size:100%;margin-block-start:.5rem;display:grid}tp-mathfield [data-tp-mathfield-preview][hidden]{display:none}tp-mathfield [data-tp-mathfield-preview-mode]{flex:none;font-size:.875em;display:block}tp-mathfield [data-tp-mathfield-preview-divider]{--tp-divider-color:var(--tp-mathfield-preview-border-color,var(--tp-neutral-stroke-soft));--tp-divider-margin-inline:.75rem}tp-mathfield [data-tp-mathfield-preview-content]{text-align:start}tp-mathfield [data-tp-mathfield-preview-mode]{order:1}tp-mathfield [data-tp-mathfield-preview-divider]{order:2}tp-mathfield [data-tp-mathfield-preview-content]{order:3}tp-mathfield [data-tp-mathfield-render-copy]{order:4;min-block-size:1.75rem;min-inline-size:1.75rem;position:relative;inset:auto}tp-mathfield[multiline] [data-tp-mathfield-preview-mode]{grid-area:1/1;align-self:center}tp-mathfield[multiline] [data-tp-mathfield-render-copy]{grid-area:1/2}tp-mathfield[multiline] [data-tp-mathfield-preview-divider]{--tp-divider-margin-block:.5rem;--tp-divider-margin-inline:0}tp-mathfield[multiline] [data-tp-mathfield-preview-content]{text-align:center;grid-area:3/1/auto/-1;inline-size:100%}tp-mathfield[multiline] [data-tp-mathfield-preview]{grid-template-columns:minmax(0,1fr) auto}tp-mathfield[multiline] [data-tp-mathfield-preview-divider]{grid-area:2/1/auto/-1}tp-mathfield [data-tp-mathfield-preview] .tp-markdown-output>:first-child{margin-block-start:0}tp-mathfield [data-tp-mathfield-preview] .tp-markdown-output>:last-child{margin-block-end:0}tp-mathfield [data-tp-mathfield-mode-button]{color:var(--tp-text-muted);cursor:pointer;background:0 0;border:0;justify-content:center;align-items:center;padding:0;display:inline-flex;position:absolute;inset-block-start:50%;inset-inline-end:.4em;transform:translateY(-50%)}tp-mathfield [data-tp-mathfield-mode-button]:focus-visible{outline:2px solid var(--tp-brand-stroke);outline-offset:2px}tp-mathfield [data-tp-mathfield-mode-button]:disabled{cursor:not-allowed}tp-mathfield [data-tp-mathfield-mode-menu] [data-mode-check]{inline-size:1.25em;display:inline-block}", i = class i extends t {
	static nextModeId = 0;
	modeButton = null;
	modeDropdown = null;
	static styleId = "tp-mathfield-styles";
	editor = null;
	previewPanel = null;
	previewButton = null;
	sourceCopyButton = null;
	static get observedAttributes() {
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
			"clearable"
		];
	}
	get mode() {
		return this.getAttribute("mode") === "asciimath" ? "asciimath" : "latexmath";
	}
	set mode(e) {
		this.setStringAttribute("mode", e);
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
		n(this), super.connectedCallback(), this.ensureGlobalStyle(i.styleId, r), this.renderStructure();
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
	renderStructure() {
		this.editor = document.createElement("tp-textfield"), this.editor.setAttribute("data-tp-mathfield-editor", ""), this.editor.addEventListener("input", this.handleInput), this.editor.addEventListener("change", this.handleChange), this.editor.addEventListener("tp-clear", this.handleClear), this.previewButton = document.createElement("tp-icon-button"), this.previewButton.setAttribute("data-tp-mathfield-preview-button", ""), this.previewButton.setAttribute("name", "eye-outline"), this.previewButton.setAttribute("label", "Show preview"), this.previewButton.setAttribute("size", "s"), this.previewButton.addEventListener("click", this.handlePreviewToggle), this.sourceCopyButton = document.createElement("tp-copy-code"), this.sourceCopyButton.setAttribute("data-tp-mathfield-source-copy", ""), this.sourceCopyButton.setAttribute("copied-text", "Formula copied!"), this.sourceCopyButton.forElement = this, this.previewPanel = document.createElement("div"), this.previewPanel.setAttribute("data-tp-mathfield-preview", ""), this.previewPanel.setAttribute("aria-live", "polite"), this.modeButton = document.createElement("button"), this.modeButton.type = "button", this.modeButton.id = `tp-mathfield-mode-${++i.nextModeId}`, this.modeButton.setAttribute("data-tp-mathfield-mode-button", ""), this.modeButton.setAttribute("aria-haspopup", "menu"), this.modeDropdown = new e(), this.modeDropdown.anchor = `#${this.modeButton.id}`, this.modeDropdown.placement = "bottom", this.modeDropdown.setAttribute("outside-click", ""), this.modeDropdown.setAttribute("data-tp-mathfield-mode-menu", "");
		let t = document.createElement("ul");
		for (let e of ["latexmath", "asciimath"]) {
			let n = document.createElement("li");
			n.dataset.mode = e;
			let r = document.createElement("span");
			r.dataset.modeCheck = "", r.setAttribute("aria-hidden", "true"), r.textContent = "✓", n.append(r, document.createTextNode(e)), n.addEventListener("keydown", (e) => {
				e.key === "Enter" || e.key === " " ? (e.preventDefault(), e.stopImmediatePropagation(), n.click()) : e.key === "Escape" && this.modeButton?.focus();
			}), n.addEventListener("click", () => {
				if (this.disabled || this.readOnly) return;
				let t = this.mode !== e;
				this.mode = e, this.modeDropdown?.hide(), this.modeButton?.focus(), t && this.dispatchEvent(new Event("change", {
					bubbles: !0,
					composed: !0
				}));
			}), t.append(n);
		}
		this.modeDropdown.append(t), this.modeDropdown.addEventListener("tp-dropdown-toggle", () => {
			this.modeButton?.setAttribute("aria-expanded", String(this.modeDropdown?.open ?? !1));
		}), this.modeButton.addEventListener("click", (e) => {
			e.preventDefault(), !(this.disabled || this.readOnly) && (this.modeDropdown?.toggle(), this.modeDropdown?.open && this.modeDropdown.querySelector(`[data-mode="${this.mode}"]`)?.focus());
		}), this.replaceChildren(this.editor, this.previewPanel), this.syncEditor(), this.append(this.modeDropdown), this.renderPreview();
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
				e !== null && (this.sourceCopyButton !== null && e.append(this.sourceCopyButton), e.append(this.previewButton));
			}
			if (this.modeButton && this.modeDropdown) {
				let e = this.editor.querySelector("tp-icon[data-tp-textfield-type]");
				e && (e.removeAttribute("data-tp-textfield-type"), e.replaceWith(this.modeButton), this.modeButton.replaceChildren(e)), this.modeButton.disabled = this.disabled || this.readOnly, this.modeButton.setAttribute("aria-label", `Mathematical notation: ${this.mode}`), this.modeButton.setAttribute("aria-expanded", String(this.modeDropdown.open)), this.modeButton.disabled && this.modeDropdown.hide();
				for (let e of this.modeDropdown.querySelectorAll("[data-mode]")) {
					let t = e.dataset.mode === this.mode;
					e.setAttribute("aria-label", `${e.dataset.mode}${t ? ", active" : ""}`);
					let n = e.querySelector("[data-mode-check]");
					n && (n.style.visibility = t ? "visible" : "hidden");
				}
			}
			this.previewPanel?.toggleAttribute("hidden", !this.previewVisible || this.value.trim() === "");
		}
	}
	renderPreview() {
		if (this.previewPanel === null || (this.previewPanel.replaceChildren(), this.value.trim() === "")) return;
		let e = document.createElement("tp-markdown"), t = document.createElement("code");
		t.setAttribute("data-tp-mathfield-preview-mode", ""), t.textContent = this.mode;
		let n = document.createElement("div");
		n.setAttribute("data-tp-mathfield-preview-content", "");
		let r = document.createElement("tp-copy-code");
		r.setAttribute("data-tp-mathfield-render-copy", ""), r.setAttribute("copied-text", "SVG copied!");
		let i = n;
		i.getCode = () => n.querySelector("svg")?.outerHTML ?? "", r.forElement = n;
		let a = document.createElement("tp-divider");
		a.setAttribute("data-tp-mathfield-preview-divider", ""), a.setAttribute("orientation", this.multiline ? "horizontal" : "vertical");
		let o = document.createElement("script");
		o.type = "tp/markdown", o.textContent = `---\nextensions:\n  - math\n---\n\n${this.multiline ? `\`\`\`${this.mode}\n${this.value}\n\`\`\`` : `:${this.mode}:\`${this.value.replaceAll("`", "\\`")}\``}`, e.append(o), e.addEventListener("tp-markdown-rendered", this.handleRendered, { once: !0 }), n.append(e), this.previewPanel.append(t, r, a, n);
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
customElements.get("tp-mathfield") || customElements.define("tp-mathfield", i);
//#endregion
export { i as t };

