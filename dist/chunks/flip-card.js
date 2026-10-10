import { qu as e } from "./lib/typescript/typescript.js";
//#region src/components/flip-card/flip-card.css?inline
var t = ".tp-flip-card{width:var(--tp-flip-card-width,12rem);max-width:100%;aspect-ratio:var(--tp-flip-card-aspect-ratio,5 / 7);perspective:75rem;vertical-align:top;display:inline-block;position:relative}.tp-flip-card[fit-content]{aspect-ratio:auto;width:fit-content}.tp-flip-card *,.tp-flip-card :before,.tp-flip-card :after{box-sizing:border-box}.tp-flip-card-scene,.tp-flip-card-inner,.tp-flip-card-face{position:absolute;inset:0}.tp-flip-card-sizer{display:none}.tp-flip-card[fit-content]>.tp-flip-card-sizer{visibility:hidden;padding:var(--tp-flip-card-padding,1rem);pointer-events:none;border:1px solid #0000;display:block}.tp-flip-card-inner{transform-style:preserve-3d;transition:transform .4s}.tp-flip-card[flipped] .tp-flip-card-inner{transform:rotateY(180deg)}.tp-flip-card-face{padding:var(--tp-flip-card-padding,1rem);border:1px solid var(--tp-flip-card-border-color,var(--tp-neutral-stroke-soft,#d6d9df));border-radius:var(--tp-flip-card-border-radius,var(--tp-border-radius-lg,.5625rem));backface-visibility:hidden;background:var(--tp-flip-card-background,var(--tp-paper-color,#fff));color:var(--tp-text-body,inherit);overflow:auto}.tp-flip-card-recto{transform:rotateY(0)}.tp-flip-card-verso{transform:rotateY(180deg)}.tp-flip-card-button{z-index:1;--tp-icon-button-size:2rem;--tp-icon-button-icon-size:1.125rem;--tp-icon-button-hover-background:var(--tp-neutral-fill-softer,#f5f6f8);background:var(--tp-paper-color,#fff);color:var(--tp-text-body,inherit);box-shadow:var(--tp-shadow-m,0 .125rem .5rem #0003);border-radius:50%;position:absolute}.tp-flip-card-button[hidden]{display:none}.tp-flip-card-scene[role=button]{cursor:pointer}.tp-flip-card-scene[role=button]:focus-visible{outline:2px solid var(--tp-focus-color,currentColor);outline-offset:2px}.tp-flip-card-button[data-block=top]{top:var(--tp-flip-card-button-offset,.5rem)}.tp-flip-card-button[data-block=bottom]{bottom:var(--tp-flip-card-button-offset,.5rem)}.tp-flip-card-button[data-inline=start]{inset-inline-start:var(--tp-flip-card-button-offset,.5rem)}.tp-flip-card-button[data-inline=center]{inset-inline-start:50%;transform:translate(-50%)}.tp-flip-card-button[data-inline=end]{inset-inline-end:var(--tp-flip-card-button-offset,.5rem)}.tp-flip-card-error{padding:var(--tp-flip-card-padding,1rem);background:var(--tp-danger-fill-softer,#f8d7da);color:var(--tp-danger-text-colorful,#721c24)}@media (prefers-reduced-motion:reduce){.tp-flip-card-inner{transition:none}}", n = ["recto", "verso"], r = class r extends e {
	static styleId = "tp-flip-card-styles";
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"disabled",
			"flipped",
			"button-position"
		];
	}
	get disabled() {
		return this.hasAttribute("disabled");
	}
	set disabled(e) {
		this.toggleAttribute("disabled", e);
	}
	get flipped() {
		return this.hasAttribute("flipped");
	}
	set flipped(e) {
		this.toggleAttribute("flipped", e);
	}
	get buttonPosition() {
		return this.getAttribute("button-position") ?? "bottom end";
	}
	set buttonPosition(e) {
		this.setAttribute("button-position", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(r.styleId, t), this.classList.add("tp-flip-card"), this.dataset.tpFlipCardRendered !== "true" && this.renderFromDefinitionList(), this.syncState();
	}
	attributeChangedCallback() {
		this.isConnected && this.dataset.tpFlipCardRendered === "true" && this.syncState();
	}
	flip() {
		return this.disabled ? this.flipped : (this.flipped = !this.flipped, this.dispatchEvent(new CustomEvent("tp-flip-card-change", {
			bubbles: !0,
			detail: { flipped: this.flipped }
		})), this.flipped);
	}
	renderFromDefinitionList() {
		let e = Array.from(this.children).find((e) => e.tagName === "DL");
		if (!e) {
			this.renderError("tp-flip-card requires a definition list");
			return;
		}
		let t = /* @__PURE__ */ new Map(), r = null;
		for (let i of Array.from(e.children)) if (i.tagName === "DT") {
			let e = i.textContent?.trim().toLowerCase() ?? "";
			r = n.includes(e) ? e : null;
		} else if (i.tagName === "DD" && r) {
			let e = t.get(r) ?? [];
			e.push(...Array.from(i.childNodes)), t.set(r, e);
		}
		if (!t.has("recto") || !t.has("verso")) {
			this.renderError("tp-flip-card requires recto and verso content");
			return;
		}
		let i = document.createElement("div");
		i.className = "tp-flip-card-scene", i.addEventListener("click", () => {
			this.normalizedButtonPosition()[0] === "none" && this.flip();
		}), i.addEventListener("keydown", (e) => {
			this.normalizedButtonPosition()[0] === "none" && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.flip());
		});
		let a = document.createElement("div");
		a.className = "tp-flip-card-inner";
		let o = document.createElement("div");
		o.className = "tp-flip-card-sizer", o.setAttribute("aria-hidden", "true"), o.append(...(t.get("verso") ?? []).map((e) => e.cloneNode(!0)));
		for (let e of n) {
			let n = document.createElement("div");
			n.className = `tp-flip-card-face tp-flip-card-${e}`, n.dataset.side = e, n.append(...t.get(e) ?? []), a.append(n);
		}
		let s = document.createElement("tp-icon-button");
		s.className = "tp-flip-card-button", s.setAttribute("type", "button"), s.setAttribute("name", "card-flip"), s.setAttribute("size", "m"), s.addEventListener("click", () => this.flip()), i.append(a), this.replaceChildren(o, i, s), this.dataset.tpFlipCardRendered = "true";
	}
	syncState() {
		let e = this.querySelector(".tp-flip-card-recto"), t = this.querySelector(".tp-flip-card-verso"), n = this.querySelector(".tp-flip-card-button"), r = this.querySelector(".tp-flip-card-scene"), [i, a] = this.normalizedButtonPosition(), o = i === "none";
		e?.setAttribute("aria-hidden", String(this.flipped)), t?.setAttribute("aria-hidden", String(!this.flipped)), n && (n.dataset.block = i, n.dataset.inline = a, n.hidden = o, n.setAttribute("label", this.flipped ? "Show recto" : "Show verso"), n.setAttribute("aria-pressed", String(this.flipped)), n.toggleAttribute("disabled", this.disabled)), r && (r.toggleAttribute("role", o), o && r.setAttribute("role", "button"), r.tabIndex = o && !this.disabled ? 0 : -1, r.setAttribute("aria-disabled", String(this.disabled)), r.setAttribute("aria-label", this.flipped ? "Show recto" : "Show verso"));
	}
	normalizedButtonPosition() {
		let e = this.buttonPosition.trim().toLowerCase().split(/\s+/);
		return e.includes("none") ? ["none", "none"] : [e.find((e) => e === "top" || e === "bottom") ?? "bottom", e.find((e) => e === "start" || e === "center" || e === "end") ?? "end"];
	}
	renderError(e) {
		let t = document.createElement("div");
		t.className = "tp-flip-card-error", t.textContent = `Error: ${e}`, this.replaceChildren(t);
	}
};
customElements.get("tp-flip-card") || customElements.define("tp-flip-card", r);
//#endregion
export { r as t };

//# sourceMappingURL=flip-card.js.map