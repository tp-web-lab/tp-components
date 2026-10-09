import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/slider/slider.css?inline
var t = "tp-slider{--tp-slider-gap:1rem;--tp-scrollbar-size:1rem;gap:var(--tp-slider-gap);scrollbar-width:auto;scrollbar-color:var(--tp-scrollbar-thumb-color,var(--tp-neutral-fill-mid)) var(--tp-scrollbar-track-color,transparent);flex-wrap:nowrap;block-size:auto;min-inline-size:0;display:flex;overflow:auto hidden}tp-slider::-webkit-scrollbar{height:var(--tp-scrollbar-size)}tp-slider::-webkit-scrollbar-track{background-color:var(--tp-scrollbar-track-color,transparent)}tp-slider::-webkit-scrollbar-thumb{background-color:var(--tp-scrollbar-thumb-color,var(--tp-neutral-fill-mid));border:.25rem solid var(--tp-scrollbar-track-color,transparent);border-radius:var(--tp-scrollbar-size);background-clip:padding-box}@supports selector(::-webkit-scrollbar) and (not ((-moz-appearance:none))){tp-slider{scrollbar-color:auto}}tp-slider>*{min-inline-size:0;inline-size:var(--tp-slider-item-width,auto);flex:none}tp-slider>img{flex-basis:auto;block-size:100%;inline-size:auto}tp-slider[slider-height]>img,tp-slider[slider-height]>video{object-fit:cover;block-size:100%;inline-size:auto}tp-slider:focus-visible{outline:2px solid var(--tp-focus-color,currentColor);outline-offset:2px}tp-slider[scrollbar].overflowing{padding-block-end:max(0px, calc(var(--tp-scrollbar-size) - var(--tp-slider-native-scrollbar-size,0px)))}tp-slider:not([scrollbar]){scrollbar-width:none}tp-slider:not([scrollbar])::-webkit-scrollbar{height:0}@supports selector(::-webkit-scrollbar) and (not ((-moz-appearance:none))){tp-slider:not([scrollbar]){scrollbar-width:auto}}", n = class n extends e {
	static styleId = "tp-slider-styles";
	resizeObserver = null;
	mutationObserver = null;
	handleScroll = () => {
		this.updateOverflowState();
	};
	handleKeydown = (e) => {
		if (e.target !== this || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !this.overflowing) return;
		let t = this.scrollWidth - this.clientWidth, n = getComputedStyle(this).direction === "rtl", r = this.clientWidth * .8, i;
		switch (e.key) {
			case "ArrowLeft":
				i = this.scrollLeft - r;
				break;
			case "ArrowRight":
				i = this.scrollLeft + r;
				break;
			case "Home":
				i = 0;
				break;
			case "End":
				i = n ? -t : t;
				break;
			default: return;
		}
		e.preventDefault(), this.scrollLeft = Math.max(n ? -t : 0, Math.min(n ? 0 : t, i));
	};
	static get observedAttributes() {
		return [
			"slider-height",
			"item-width",
			"gap",
			"scrollbar",
			"scrollbar-track-color",
			"scrollback-thumb-color"
		];
	}
	get sliderHeight() {
		return this.getAttribute("slider-height") ?? "";
	}
	set sliderHeight(e) {
		if (e === "") {
			this.removeAttribute("slider-height");
			return;
		}
		this.setAttribute("slider-height", e);
	}
	get itemWidth() {
		return this.getAttribute("item-width") ?? "";
	}
	set itemWidth(e) {
		if (e === "") {
			this.removeAttribute("item-width");
			return;
		}
		this.setAttribute("item-width", e);
	}
	get gap() {
		return this.getAttribute("gap") ?? "";
	}
	set gap(e) {
		if (e === "") {
			this.removeAttribute("gap");
			return;
		}
		this.setAttribute("gap", e);
	}
	get scrollbar() {
		return this.hasAttribute("scrollbar");
	}
	set scrollbar(e) {
		this.toggleAttribute("scrollbar", e);
	}
	get scrollbarTrackColor() {
		return this.getAttribute("scrollbar-track-color") ?? "";
	}
	set scrollbarTrackColor(e) {
		if (e === "") {
			this.removeAttribute("scrollbar-track-color");
			return;
		}
		this.setAttribute("scrollbar-track-color", e);
	}
	get scrollbackThumbColor() {
		return this.getAttribute("scrollback-thumb-color") ?? "";
	}
	set scrollbackThumbColor(e) {
		if (e === "") {
			this.removeAttribute("scrollback-thumb-color");
			return;
		}
		this.setAttribute("scrollback-thumb-color", e);
	}
	get overflowing() {
		return this.scrollWidth > this.clientWidth;
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.updateStyles(), this.updateOverflowState(), this.observeLayout(), this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("keydown", this.handleKeydown), this.addEventListener("scroll", this.handleScroll, { passive: !0 });
	}
	attributeChangedCallback() {
		this.updateStyles(), this.updateOverflowState();
	}
	disconnectedCallback() {
		this.removeEventListener("keydown", this.handleKeydown), this.resizeObserver?.disconnect(), this.resizeObserver = null, this.mutationObserver?.disconnect(), this.mutationObserver = null, this.removeEventListener("scroll", this.handleScroll);
	}
	ensureStyles() {
		if (document.getElementById(n.styleId)) return;
		let e = document.createElement("style");
		e.id = n.styleId, e.textContent = t, document.head.append(e);
	}
	observeLayout() {
		typeof ResizeObserver < "u" && (this.resizeObserver = new ResizeObserver(() => {
			this.updateOverflowState();
		}), this.resizeObserver.observe(this)), this.mutationObserver = new MutationObserver(() => {
			this.updateOverflowState();
		}), this.mutationObserver.observe(this, {
			childList: !0,
			subtree: !1
		});
	}
	updateStyles() {
		this.sliderHeight === "" ? this.style.removeProperty("block-size") : this.style.blockSize = this.sliderHeight, this.itemWidth === "" ? this.style.removeProperty("--tp-slider-item-width") : this.style.setProperty("--tp-slider-item-width", this.itemWidth), this.gap === "" ? this.style.removeProperty("--tp-slider-gap") : this.style.setProperty("--tp-slider-gap", this.gap), this.scrollbarTrackColor === "" ? this.style.removeProperty("--tp-scrollbar-track-color") : this.style.setProperty("--tp-scrollbar-track-color", this.scrollbarTrackColor), this.scrollbackThumbColor === "" ? this.style.removeProperty("--tp-scrollbar-thumb-color") : this.style.setProperty("--tp-scrollbar-thumb-color", this.scrollbackThumbColor);
	}
	updateOverflowState() {
		this.classList.toggle("overflowing", this.overflowing);
		let e = getComputedStyle(this), t = (Number.parseFloat(e.borderTopWidth) || 0) + (Number.parseFloat(e.borderBottomWidth) || 0), n = `${Math.max(0, this.offsetHeight - this.clientHeight - t)}px`;
		this.style.getPropertyValue("--tp-slider-native-scrollbar-size") !== n && this.style.setProperty("--tp-slider-native-scrollbar-size", n);
	}
};
customElements.get("tp-slider") || customElements.define("tp-slider", n);
//#endregion
export { n as t };

