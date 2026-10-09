import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/dialog/dialog.css?inline
var t = "[data-tp-dialog]{border:0;border-radius:.75rem;inline-size:32rem;max-inline-size:min(32rem,100vw - 2rem);padding:0}[data-tp-dialog]::backdrop{background:#00000059}[data-tp-dialog-panel]{gap:1rem;padding:1rem;display:grid}[data-tp-dialog-header]{font-weight:700}[data-tp-dialog-body]{max-block-size:16rem;overflow:auto}[data-tp-dialog-footer]{justify-content:flex-end;gap:.5rem;display:flex}", n = class extends e {
	dialogEl = null;
	headerEl = null;
	bodyEl = null;
	confirmButtonEl = null;
	cancelButtonEl = null;
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.render();
	}
	setContent(e) {
		this.render(), this.headerEl !== null && (this.headerEl.textContent = e.title ?? ""), this.bodyEl !== null && this.bodyEl.replaceChildren(...e.body ?? []), this.confirmButtonEl !== null && this.setButtonText(this.confirmButtonEl, e.confirmText ?? "Confirm"), this.cancelButtonEl !== null && this.setButtonText(this.cancelButtonEl, e.cancelText ?? "Cancel");
	}
	show() {
		this.render(), this.dialogEl?.showModal();
	}
	close(e = "cancel") {
		this.dialogEl?.close(e), this.dispatchEvent(new CustomEvent("tp-dialog-close", {
			bubbles: !0,
			detail: { action: e }
		}));
	}
	setButtonText(e, t) {
		if (e === null) return;
		let n = e.querySelector("[data-tp-button-content]");
		if (n instanceof HTMLElement) {
			n.textContent = t;
			return;
		}
		e.textContent = t;
	}
	ensureStyles() {
		if (document.getElementById("tp-dialog-styles")) return;
		let e = document.createElement("style");
		e.id = "tp-dialog-styles", e.textContent = t, document.head.append(e);
	}
	render() {
		if (this.dialogEl !== null) return;
		let e = document.createElement("dialog");
		e.setAttribute("data-tp-dialog", "");
		let t = document.createElement("form");
		t.setAttribute("method", "dialog"), t.setAttribute("data-tp-dialog-panel", "");
		let n = document.createElement("header");
		n.setAttribute("data-tp-dialog-header", "");
		let r = document.createElement("section");
		r.setAttribute("data-tp-dialog-body", "");
		let i = document.createElement("footer");
		i.setAttribute("data-tp-dialog-footer", "");
		let a = document.createElement("tp-button");
		a.setAttribute("variant", "neutral"), a.setAttribute("type", "button"), a.setAttribute("size", "xs"), a.setAttribute("pill", ""), a.textContent = "Cancel", a.style.cursor = "pointer", a.addEventListener("click", (e) => {
			e.preventDefault(), this.close("cancel");
		});
		let o = document.createElement("tp-button");
		o.setAttribute("variant", "danger"), o.setAttribute("type", "button"), o.setAttribute("size", "xs"), o.setAttribute("pill", ""), o.textContent = "Delete", o.style.cursor = "pointer", o.addEventListener("click", (e) => {
			e.preventDefault(), this.close("confirm");
		}), this.cancelButtonEl = a, this.confirmButtonEl = o, i.append(a, o), t.append(n, r, i), e.append(t), this.append(e), this.dialogEl = e, this.headerEl = n, this.bodyEl = r;
	}
};
customElements.get("tp-dialog") || customElements.define("tp-dialog", n);
//#endregion
export { n as t };

