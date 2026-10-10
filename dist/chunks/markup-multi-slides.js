import "./numberfield.js";
import { t as e } from "./markup-multi-pages.js";
//#region src/components/markup-multi-slides/markup-multi-slides.css?inline
var t = ".tp-markup-multi-slides-host .tp-markup-multi-pages-content{padding-block-end:4rem;font-size:clamp(1rem,.65rem + 1.15vw,2.5rem)}.tp-markup-multi-slides-host [data-slide-step][data-slide-fragment-hidden]{visibility:hidden;pointer-events:none}.tp-markup-multi-slides-navigation{z-index:2;box-sizing:border-box;background:var(--tp-paper-color);border-radius:0 0 .75rem .75rem;align-items:center;gap:.5rem;padding:.25rem .5rem;display:flex;position:absolute;inset-block-end:0;inset-inline:0}.tp-markup-multi-slides-navigation>tp-numberfield{flex:1 1 0;min-inline-size:0}.tp-markup-multi-slides-controls{background:color-mix(in srgb, var(--tp-paper-color,#fff) 85%, transparent);border-radius:999px;flex:none;align-items:center;gap:.125rem;display:flex}.tp-markup-multi-slides-controls tp-icon-button{--tp-icon-button-padding:.25rem}.tp-markup-multi-slides-counter{text-align:center;min-inline-size:3.25rem;color:var(--tp-brand-text-colorful,currentColor);font-variant-numeric:tabular-nums;font-size:.75rem}", n = class n extends e {
	static nextTicksId = 0;
	ticksId = `tp-slide-ticks-${++n.nextTicksId}`;
	static styleId = "tp-markup-multi-slides-styles";
	navigationObserver = null;
	navigationSyncPending = !1;
	progressElements = [];
	progressSteps = [];
	progressIndex = 0;
	progressPage = "";
	revealPreviousSlideOnLoad = !1;
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-markup-multi-slides-host"), this.ensureGlobalStyle(n.styleId, t), this.ownerDocument.addEventListener("keydown", this.handleKeydown), this.addEventListener("click", this.handleProgressClick), this.addEventListener("contextmenu", this.handleProgressContextMenu), this.observeNavigation(), this.scheduleNavigationSync();
	}
	disconnectedCallback() {
		this.navigationObserver?.disconnect(), this.navigationObserver = null, this.ownerDocument.removeEventListener("keydown", this.handleKeydown), this.removeEventListener("click", this.handleProgressClick), this.removeEventListener("contextmenu", this.handleProgressContextMenu), super.disconnectedCallback();
	}
	handleKeydown = (e) => {
		if (![
			"ArrowLeft",
			"ArrowRight",
			"Enter",
			" ",
			"Backspace"
		].includes(e.key) || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || this.closest("[hidden]") !== null) return;
		let t = e.target;
		t instanceof Element && t.closest("input, textarea, select, button, a, [contenteditable], tp-code-editor") !== null || (e.key === "ArrowLeft" || e.key === "Backspace" ? this.rewindProgress() : this.advanceProgress()) && e.preventDefault();
	};
	handleProgressClick = (e) => {
		let t = e.target;
		!(t instanceof Element) || t.closest(".tp-markup-multi-pages-content") === null || t.closest("a, button, input, textarea, select, summary, [contenteditable], tp-code-editor") === null && this.advanceProgress();
	};
	handleProgressContextMenu = (e) => {
		let t = e.target;
		!(t instanceof Element) || t.closest(".tp-markup-multi-pages-content") === null || t.closest("a, button, input, textarea, select, summary, [contenteditable], tp-code-editor") === null && this.rewindProgress() && e.preventDefault();
	};
	advanceProgress() {
		let e = this.progressSteps[this.progressIndex];
		if (e !== void 0) {
			for (let t of this.progressElements) Number(t.dataset.slideStep) === e && (t.removeAttribute("data-slide-fragment-hidden"), t.removeAttribute("aria-hidden"));
			return this.progressIndex += 1, this.updateArrowStates(), !0;
		}
		return this.goToRelativeSlide(1);
	}
	rewindProgress() {
		if (this.progressIndex > 0) {
			--this.progressIndex;
			let e = this.progressSteps[this.progressIndex];
			for (let t of this.progressElements) Number(t.dataset.slideStep) === e && (t.setAttribute("data-slide-fragment-hidden", ""), t.setAttribute("aria-hidden", "true"));
			return this.updateArrowStates(), !0;
		}
		return this.revealPreviousSlideOnLoad = !0, this.goToRelativeSlide(-1) ? !0 : (this.revealPreviousSlideOnLoad = !1, !1);
	}
	goToRelativeSlide(e) {
		let t = Array.from(this.querySelectorAll(".tp-markup-multi-pages-sidebar a[href]")), n = t[t.findIndex((e) => e.getAttribute("aria-current") === "page") + e];
		return n === void 0 ? !1 : (n.click(), !0);
	}
	observeNavigation() {
		this.navigationObserver?.disconnect(), this.navigationObserver = new MutationObserver(() => this.scheduleNavigationSync()), this.navigationObserver.observe(this, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: ["aria-current"]
		});
	}
	scheduleNavigationSync() {
		this.navigationSyncPending || (this.navigationSyncPending = !0, queueMicrotask(() => {
			this.navigationSyncPending = !1, this.isConnected && this.syncNavigation();
		}));
	}
	syncNavigation() {
		this.querySelectorAll(".tp-markup-multi-pages-page-nav").forEach((e) => {
			e.remove();
		});
		let e = Array.from(this.querySelectorAll(".tp-markup-multi-pages-sidebar a[href]")), t = e.findIndex((e) => e.getAttribute("aria-current") === "page"), n = this.querySelector(".tp-markup-multi-slides-navigation");
		if (t < 0 || e.length === 0) {
			n?.remove();
			return;
		}
		this.syncProgress();
		let r = `${t}:${e.length}`;
		if (n?.dataset.signature === r) return;
		if (n) {
			this.syncSlideTicks(n, e.length);
			let i = n.querySelector("tp-numberfield");
			i && (i.max = String(e.length), i.value = String(t + 1));
			let a = n.querySelector(".tp-markup-multi-slides-counter");
			a && (a.textContent = `${t + 1} / ${e.length}`), n.dataset.signature = r, this.updateArrowStates();
			return;
		}
		let i = document.createElement("nav");
		i.className = "tp-markup-multi-slides-navigation", i.dataset.signature = r, i.setAttribute("aria-label", "Slide navigation");
		let a = document.createElement("tp-numberfield");
		a.range = !0, a.list = this.ticksId, a.min = "1", a.max = String(e.length), a.value = String(t + 1), a.setAttribute("aria-label", "Current slide"), a.addEventListener("input", () => {
			this.querySelectorAll(".tp-markup-multi-pages-sidebar a[href]")[Number(a.value) - 1]?.click();
		});
		let o = document.createElement("span");
		o.className = "tp-markup-multi-slides-controls", o.append(this.createArrow("previous", "arrow-left", "Previous step or slide"), this.createCounter(t, e.length), this.createArrow("next", "arrow-right", "Next step or slide")), i.append(a, o), this.syncSlideTicks(i, e.length), this.querySelector(".tp-markup-multi-pages")?.append(i), this.updateArrowStates();
	}
	syncSlideTicks(e, t) {
		let n = e.querySelector("datalist");
		n || (n = document.createElement("datalist"), n.id = this.ticksId, e.append(n)), n.options.length !== t && n.replaceChildren(...Array.from({ length: t }, (e, t) => {
			let n = document.createElement("option");
			return n.value = String(t + 1), n;
		}));
	}
	syncProgress() {
		let e = this.querySelector(".tp-markup-multi-pages-sidebar a[aria-current=\"page\"]")?.href ?? "", t = Array.from(this.querySelectorAll(".tp-markup-multi-pages-content [data-slide-step]")).filter((e) => {
			let t = Number(e.dataset.slideStep);
			return Number.isInteger(t) && t >= 1;
		});
		if (!(e === this.progressPage && t.length === this.progressElements.length && t.every((e, t) => e === this.progressElements[t]))) {
			this.progressPage = e, this.progressElements = t, this.progressSteps = [...new Set(t.map((e) => Number(e.dataset.slideStep)))].sort((e, t) => e - t), this.progressIndex = this.revealPreviousSlideOnLoad ? this.progressSteps.length : 0;
			for (let e of t) e.hidden = !1, this.revealPreviousSlideOnLoad ? (e.removeAttribute("data-slide-fragment-hidden"), e.removeAttribute("aria-hidden")) : (e.setAttribute("data-slide-fragment-hidden", ""), e.setAttribute("aria-hidden", "true"));
			this.revealPreviousSlideOnLoad = !1;
		}
	}
	createArrow(e, t, n) {
		let r = document.createElement("tp-icon-button");
		return r.dataset.slideDirection = e, r.setAttribute("name", t), r.setAttribute("label", n), r.setAttribute("color", "var(--tp-brand-text-colorful)"), r.addEventListener("click", () => {
			e === "previous" ? this.rewindProgress() : this.advanceProgress();
		}), r;
	}
	updateArrowStates() {
		let e = Array.from(this.querySelectorAll(".tp-markup-multi-pages-sidebar a[href]")), t = e.findIndex((e) => e.getAttribute("aria-current") === "page"), n = this.querySelector("[data-slide-direction=\"previous\"]"), r = this.querySelector("[data-slide-direction=\"next\"]");
		n?.toggleAttribute("disabled", this.progressIndex === 0 && t <= 0), r?.toggleAttribute("disabled", this.progressIndex >= this.progressSteps.length && t >= e.length - 1);
	}
	createCounter(e, t) {
		let n = document.createElement("span");
		return n.className = "tp-markup-multi-slides-counter", n.setAttribute("aria-live", "polite"), n.textContent = `${e + 1} / ${t}`, n;
	}
};
customElements.get("tp-markup-multi-slides") || customElements.define("tp-markup-multi-slides", n);
//#endregion
export { n as t };

//# sourceMappingURL=markup-multi-slides.js.map