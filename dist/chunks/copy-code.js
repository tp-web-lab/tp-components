import { t as e } from "./base.js";
import { t } from "./icon.js";
import { t as n } from "./animation.js";
//#region src/components/copy-code/copy-code.css?inline
var r = "tp-copy-code{cursor:pointer;z-index:1;min-block-size:2rem;min-inline-size:2rem;color:var(--tp-text-body);justify-content:center;align-items:center;display:inline-flex;position:absolute;inset-block-start:.5rem;inset-inline-end:.5rem}tp-copy-code>tp-animation{display:inline-flex}tp-copy-code>tp-animation>tp-icon{pointer-events:none}tp-copy-code:focus-visible{outline-offset:2px;outline:2px solid}tp-copy-code[data-state=success]{color:var(--tp-copy-code-success-color,green)}tp-copy-code[data-state=error]{color:var(--tp-copy-code-error-color,red)}pre.tp-code-block-copy{position:relative}pre.tp-code-block-copy>tp-copy-code[data-tp-code-block-copy]{background:var(--tp-paper-color,Canvas);border-radius:var(--tp-radius-s);opacity:0;pointer-events:none}pre.tp-code-block-copy:hover>tp-copy-code[data-tp-code-block-copy],pre.tp-code-block-copy:focus-within>tp-copy-code[data-tp-code-block-copy]{opacity:1;pointer-events:auto}@media (hover:none){pre.tp-code-block-copy>tp-copy-code[data-tp-code-block-copy]{opacity:1;pointer-events:auto}}", i = 1500, a = 0;
function o(e) {
	return typeof e == "object" && !!e && "getValue" in e && typeof e.getValue == "function";
}
function s(e) {
	return typeof e == "object" && !!e && "getCode" in e && typeof e.getCode == "function";
}
var c = class c extends e {
	static styleId = "tp-copy-code-styles";
	targetEl = null;
	iconEl = null;
	animationEl = null;
	anchorEl = null;
	anchorId = "";
	stateTimer = null;
	state = "idle";
	handleKeydown = (e) => {
		e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this.copy());
	};
	handleClick = () => {
		this.copy();
	};
	static get observedAttributes() {
		return [
			"for",
			"icon",
			"success-icon",
			"error-icon",
			"copied-text"
		];
	}
	get htmlFor() {
		return this.getAttribute("for") ?? "";
	}
	set htmlFor(e) {
		if (e === "") {
			this.removeAttribute("for");
			return;
		}
		this.setAttribute("for", e);
	}
	get icon() {
		return this.getAttribute("icon") ?? "copy";
	}
	set icon(e) {
		if (e === "") {
			this.removeAttribute("icon");
			return;
		}
		this.setAttribute("icon", e);
	}
	get successIcon() {
		return this.getAttribute("success-icon") ?? "check";
	}
	set successIcon(e) {
		if (e === "") {
			this.removeAttribute("success-icon");
			return;
		}
		this.setAttribute("success-icon", e);
	}
	get errorIcon() {
		return this.getAttribute("error-icon") ?? "warning";
	}
	set errorIcon(e) {
		if (e === "") {
			this.removeAttribute("error-icon");
			return;
		}
		this.setAttribute("error-icon", e);
	}
	get copiedText() {
		return this.getAttribute("copied-text") ?? "Copied!";
	}
	set copiedText(e) {
		if (e === "") {
			this.removeAttribute("copied-text");
			return;
		}
		this.setAttribute("copied-text", e);
	}
	get forElement() {
		return this.targetEl;
	}
	set forElement(e) {
		this.targetEl = e;
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureAnchorId(), this.ensureDom(), this.setAttribute("role", "button"), this.tabIndex = 0, this.setAttribute("data-state", this.state), this.addEventListener("click", this.handleClick), this.addEventListener("keydown", this.handleKeydown), this.syncIcon(), this.syncAnimation();
	}
	attributeChangedCallback() {
		this.isConnected && (this.syncIcon(), this.syncAnimation());
	}
	disconnectedCallback() {
		super.connectedCallback(), this.removeEventListener("click", this.handleClick), this.removeEventListener("keydown", this.handleKeydown), this.stateTimer !== null && (window.clearTimeout(this.stateTimer), this.stateTimer = null);
	}
	async copy() {
		let e = this.resolveTarget();
		if (e === null) return this.setState("error"), this.emitError("No target element found."), !1;
		let t = this.getTargetContent(e);
		try {
			return await navigator.clipboard.writeText(t), this.setState("success"), this.dispatchEvent(new CustomEvent("tp-copy-code-success", {
				bubbles: !0,
				detail: {
					length: t.length,
					target: e
				}
			})), !0;
		} catch (e) {
			let t = e instanceof Error ? e.message : "Unknown clipboard error";
			return this.setState("error"), this.emitError(t), !1;
		}
	}
	ensureAnchorId() {
		this.anchorId === "" && (a += 1, this.anchorId = `tp-copy-code-anchor-${String(a)}`);
	}
	ensureDom() {
		let e = this.querySelector(":scope > [data-tp-copy-code-anchor]"), r = this.querySelector(":scope > [data-tp-copy-code-anchor] tp-animation"), i = this.querySelector(":scope > [data-tp-copy-code-anchor] tp-icon");
		if (e instanceof HTMLSpanElement && (this.anchorEl = e), r instanceof n && (this.animationEl = r), i instanceof t && (this.iconEl = i), this.anchorEl instanceof HTMLSpanElement && this.animationEl instanceof n && this.iconEl instanceof t) {
			this.anchorEl.id = this.anchorId;
			return;
		}
		this.textContent = "";
		let a = document.createElement("span");
		a.id = this.anchorId, a.setAttribute("data-tp-copy-code-anchor", "");
		let o = document.createElement("tp-animation");
		o.setAttribute("data-tp-copy-code-animation", ""), o.setAttribute("trigger", "manual"), o.setAttribute("target", "[data-tp-copy-code-icon]"), o.setAttribute("in", "pulse");
		let s = document.createElement("tp-icon");
		s.setAttribute("data-tp-copy-code-icon", ""), s.setAttribute("name", this.icon), s.setAttribute("aria-hidden", "true"), o.append(s), a.append(o), this.append(a), this.anchorEl = a, this.animationEl = o, this.iconEl = s;
	}
	ensureStyles() {
		if (document.getElementById(c.styleId)) return;
		let e = document.createElement("style");
		e.id = c.styleId, e.textContent = r, document.head.append(e);
	}
	resolveTarget() {
		if (this.targetEl instanceof HTMLElement) return this.targetEl;
		if (this.htmlFor === "") return null;
		let e = document.getElementById(this.htmlFor);
		return e instanceof HTMLElement ? e : null;
	}
	getTargetContent(e) {
		return o(e) ? e.getValue() : s(e) ? e.getCode() : e.textContent ?? "";
	}
	syncIcon() {
		if (this.setAttribute("aria-label", this.state === "success" ? this.copiedText : "Copy code"), !(this.iconEl instanceof HTMLElement)) return;
		let e = this.icon;
		this.state === "success" && (e = this.successIcon), this.state === "error" && (e = this.errorIcon), this.iconEl.setAttribute("name", e);
	}
	syncAnimation() {
		this.animationEl instanceof HTMLElement && (this.animationEl.setAttribute("target", "[data-tp-copy-code-icon]"), this.animationEl.setAttribute("trigger", "manual"), this.animationEl.setAttribute("in", "pulse"));
	}
	showSuccessFeedback() {
		let e = this.animationEl;
		if (typeof e.restart == "function") {
			e.restart();
			return;
		}
		if (typeof e.playIn == "function") {
			e.playIn();
			return;
		}
		typeof e.play == "function" && e.play();
	}
	setState(e) {
		this.state = e, this.setAttribute("data-state", e), this.syncIcon(), this.stateTimer !== null && (window.clearTimeout(this.stateTimer), this.stateTimer = null), e === "success" && this.showSuccessFeedback(), e !== "idle" && (this.stateTimer = window.setTimeout(() => {
			this.state = "idle", this.setAttribute("data-state", "idle"), this.syncIcon(), this.stateTimer = null;
		}, i));
	}
	emitError(e) {
		this.dispatchEvent(new CustomEvent("tp-copy-code-error", {
			bubbles: !0,
			detail: { message: e }
		}));
	}
};
customElements.get("tp-copy-code") || customElements.define("tp-copy-code", c);
//#endregion
export { c as t };

//# sourceMappingURL=copy-code.js.map