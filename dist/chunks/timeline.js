import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/timeline/timeline.css?inline
var t = "tp-timeline{min-inline-size:0;display:flow-root}tp-timeline>ol{margin:0;padding:0;list-style:none}tp-timeline>ol>li{grid-template-columns:minmax(3rem,1fr) 2.5rem minmax(0,3fr);margin:0;padding:0;display:grid}tp-timeline .tp-timeline-time{text-align:end;overflow-wrap:anywhere;padding:.5rem}tp-timeline .tp-timeline-body{overflow-wrap:anywhere;min-inline-size:0;padding:.5rem .5rem 1.5rem}tp-timeline .tp-timeline-title{font-weight:700}tp-timeline .tp-timeline-content{margin-block-start:.5rem}tp-timeline :is(.tp-timeline-time,.tp-timeline-title,.tp-timeline-content)>:first-child{margin-block-start:0}tp-timeline :is(.tp-timeline-time,.tp-timeline-title,.tp-timeline-content)>:last-child{margin-block-end:0}tp-timeline .tp-timeline-marker{justify-content:center;padding-block-start:.25rem;display:flex;position:relative}tp-timeline .tp-timeline-marker:before{content:\"\";background:var(--tp-neutral-stroke-soft);inline-size:2px;position:absolute;inset-block:0;inset-inline-start:calc(50% - 1px)}tp-timeline>ol>li:first-child>.tp-timeline-marker:before{inset-block-start:1.25rem}tp-timeline>ol>li:last-child>.tp-timeline-marker:before{inset-block-end:calc(100% - 1.25rem)}tp-timeline .tp-timeline-icon{box-sizing:border-box;border:2px solid var(--tp-brand-stroke-soft);background:var(--tp-paper-color);block-size:2rem;inline-size:2rem;color:var(--tp-brand-text-colorful);border-radius:50%;flex:0 0 2rem;justify-content:center;align-items:center;display:flex;position:relative}tp-timeline .tp-timeline-icon>p{margin:0}tp-timeline[data-orientation=horizontal]>ol{grid-template-rows:auto 2.5rem auto;grid-auto-columns:minmax(12rem,1fr);grid-auto-flow:column;padding-block-end:.5rem;display:grid;overflow-x:auto}tp-timeline[data-orientation=horizontal]>ol>li{grid-row:span 3;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}tp-timeline[data-orientation=horizontal] .tp-timeline-time,tp-timeline[data-orientation=horizontal] .tp-timeline-body{text-align:center}tp-timeline[data-orientation=horizontal]>ol>li>.tp-timeline-marker:before{block-size:2px;inline-size:auto;inset:calc(50% - 1px) 0 auto}tp-timeline[data-orientation=horizontal]>ol>li:first-child>.tp-timeline-marker:before{inset-inline-start:50%}tp-timeline[data-orientation=horizontal]>ol>li:last-child>.tp-timeline-marker:before{inset-inline-end:50%}tp-timeline>ol:focus-visible{outline:2px solid var(--tp-focus-color);outline-offset:2px}", n = class extends e {
	observer = new MutationObserver(() => this.renderEntries());
	static get observedAttributes() {
		return [...e.observedAttributes, "orientation"];
	}
	get orientation() {
		return this.getAttribute("orientation") === "horizontal" ? "horizontal" : "vertical";
	}
	set orientation(e) {
		this.setAttribute("orientation", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-timeline-styles", t), this.renderEntries(), this.addEventListener("keydown", this.handleKeydown);
	}
	disconnectedCallback() {
		this.observer.disconnect(), this.removeEventListener("keydown", this.handleKeydown);
	}
	handleKeydown = (e) => {
		let t = this.querySelector(":scope > ol");
		!t || e.target !== t || this.orientation !== "horizontal" || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowLeft" && e.key !== "ArrowRight" || (e.preventDefault(), t.scrollLeft += (e.key === "ArrowRight" ? 1 : -1) * Math.max(80, t.clientWidth * .8));
	};
	attributeChangedCallback() {
		this.updateOrientation();
	}
	updateOrientation() {
		this.dataset.orientation = this.orientation;
		let e = this.querySelector(":scope > ol");
		e && (this.orientation === "horizontal" ? e.tabIndex = 0 : e.removeAttribute("tabindex"));
	}
	renderEntries() {
		this.observer.disconnect();
		for (let e of this.querySelectorAll(":scope > [data-timeline-error]")) e.remove();
		let e = Array.from(this.children).filter((e) => e.localName === "dl"), t = this.querySelector(":scope > ol");
		for (let n of e) {
			let e = /* @__PURE__ */ new Map(), r = [e], i = "";
			for (let t of Array.from(n.children)) if (t.localName === "dt") i = t.textContent?.trim().toLowerCase() ?? "", i === "time" && e.has("time") && (e = /* @__PURE__ */ new Map(), r.push(e));
			else if (t.localName === "dd") {
				let n = e.get(i) ?? [];
				n.push(...Array.from(t.childNodes)), e.set(i, n);
			}
			if (r.some((e) => !e.get("time")?.some((e) => e.textContent?.trim() || e instanceof Element) || !e.get("title")?.some((e) => e.textContent?.trim() || e instanceof Element))) {
				let e = document.createElement("tp-callout");
				e.setAttribute("variant", "warning"), e.setAttribute("data-timeline-error", ""), e.textContent = "Each timeline event requires Time and Title entries.", this.append(e);
				continue;
			}
			t || (t = document.createElement("ol"), t.setAttribute("role", "list"), t.setAttribute("aria-label", "Timeline events"), this.prepend(t));
			for (let e of r) {
				let n = document.createElement("li"), r = document.createElement("div");
				r.className = "tp-timeline-time", r.append(...e.get("time") ?? []);
				let i = document.createElement("div");
				i.className = "tp-timeline-marker", i.setAttribute("aria-hidden", "true");
				let a = document.createElement("span");
				a.className = "tp-timeline-icon", a.append(...e.get("icon") ?? []), i.append(a);
				let o = document.createElement("div");
				o.className = "tp-timeline-body";
				let s = document.createElement("div");
				if (s.className = "tp-timeline-title", s.append(...e.get("title") ?? []), o.append(s), e.has("content")) {
					let t = document.createElement("div");
					t.className = "tp-timeline-content", t.append(...e.get("content") ?? []), o.append(t);
				}
				n.append(r, i, o), t.append(n);
			}
			n.remove();
		}
		this.updateOrientation(), this.observer.observe(this, { childList: !0 });
	}
};
customElements.get("tp-timeline") || customElements.define("tp-timeline", n);
//#endregion
export { n as t };

//# sourceMappingURL=timeline.js.map