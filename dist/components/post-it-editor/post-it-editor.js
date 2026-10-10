import { Zu as e } from "../../chunks/lib/typescript/typescript.js";
import { n as t, t as n } from "../../chunks/personal-annotations.js";
//#region src/components/post-it-editor/post-it-editor.ts
var r = class extends e {
	controller = null;
	targetElement = null;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"for",
			"page",
			"markup"
		];
	}
	get markup() {
		let e = this.getAttribute("markup") ?? "none";
		return Object.hasOwn(t, e) ? e : "none";
	}
	set markup(e) {
		this.setAttribute("markup", e);
	}
	get page() {
		return this.getAttribute("page") || this.ownerDocument.location.href.split("#")[0] || "";
	}
	setPage(e) {
		this.setAttribute("page", e);
	}
	setTarget(e) {
		this.targetElement = e, this.isConnected && this.initialize();
	}
	connectedCallback() {
		super.connectedCallback(), this.style.display = "contents", this.initialize();
	}
	disconnectedCallback() {
		this.dispose();
	}
	attributeChangedCallback(e) {
		this.isConnected && (e === "for" ? (this.targetElement = null, this.initialize()) : e === "markup" ? this.controller?.setMarkup(this.markup) : e === "page" && this.controller?.setPage(this.getAttribute("page") ?? this.page));
	}
	initialize() {
		this.dispose();
		let e = this.targetElement;
		try {
			!e && this.getAttribute("for") && (e = this.ownerDocument.querySelector(this.getAttribute("for") ?? ""));
		} catch {
			e = null;
		}
		if (!e || e === this || this.contains(e)) {
			this.textContent = "Choose a document container with the for attribute before editing annotations.";
			return;
		}
		this.replaceChildren(), this.controller = new n(this, e, (e) => {
			this.markup = e;
		}), this.controller.setMarkup(this.markup), this.prepend(this.controller.button), this.controller.setPage(this.getAttribute("page") ?? this.page);
	}
	dispose() {
		this.controller?.dispose(), this.controller = null;
	}
};
customElements.get("tp-post-it-editor") || customElements.define("tp-post-it-editor", r);
//#endregion
export { r as TpPostItEditor };

//# sourceMappingURL=post-it-editor.js.map