import { t as e } from "./base.js";
//#region src/components/animation/animation.css?inline
var t = "tp-animation{display:block}tp-animation>[data-tp-animation-target]{display:inherit}";
//#endregion
//#region src/components/animation/animation.ts
function n(e) {
	return e === "load" || e === "click" || e === "hover" || e === "manual" || e === "intersection";
}
function r(e) {
	return e === "none" || e === "forwards" || e === "backwards" || e === "both";
}
function i(e) {
	if (e === null || e.trim() === "") return .1;
	let t = e.split(",").map((e) => Number(e.trim())).filter((e) => Number.isFinite(e) && e >= 0 && e <= 1);
	return t.length === 0 ? .1 : t.length === 1 && t[0] !== void 0 ? t[0] : t;
}
var a = class a extends e {
	static styleId = "tp-animation-styles";
	targetEl = null;
	animation = null;
	hasAutoPlayed = !1;
	intersectionObserver = null;
	decoratedTarget = null;
	decoratedRole = null;
	decoratedTabindex = null;
	static get observedAttributes() {
		return [
			"in",
			"out",
			"duration",
			"delay",
			"iterations",
			"easing",
			"fill",
			"trigger",
			"paused",
			"once",
			"target",
			"root-margin",
			"threshold"
		];
	}
	get in() {
		return this.getAttribute("in") ?? "";
	}
	set in(e) {
		if (e === "") {
			this.removeAttribute("in");
			return;
		}
		this.setAttribute("in", e);
	}
	get out() {
		return this.getAttribute("out") ?? "";
	}
	set out(e) {
		if (e === "") {
			this.removeAttribute("out");
			return;
		}
		this.setAttribute("out", e);
	}
	get target() {
		return this.getAttribute("target") ?? "";
	}
	set target(e) {
		if (e === "") {
			this.removeAttribute("target");
			return;
		}
		this.setAttribute("target", e);
	}
	get duration() {
		return this.getAttribute("duration") ?? "1s";
	}
	set duration(e) {
		this.setAttribute("duration", e);
	}
	get delay() {
		return this.getAttribute("delay") ?? "0s";
	}
	set delay(e) {
		this.setAttribute("delay", e);
	}
	get iterations() {
		return this.getAttribute("iterations") ?? "1";
	}
	set iterations(e) {
		this.setAttribute("iterations", e);
	}
	get easing() {
		return this.getAttribute("easing") ?? "ease";
	}
	set easing(e) {
		this.setAttribute("easing", e);
	}
	get fill() {
		let e = this.getAttribute("fill");
		return e !== null && r(e) ? e : "both";
	}
	set fill(e) {
		this.setAttribute("fill", e);
	}
	get trigger() {
		let e = this.getAttribute("trigger");
		return e !== null && n(e) ? e : "load";
	}
	set trigger(e) {
		this.setAttribute("trigger", e);
	}
	get paused() {
		return this.hasAttribute("paused");
	}
	set paused(e) {
		if (e) {
			this.setAttribute("paused", "");
			return;
		}
		this.removeAttribute("paused");
	}
	get once() {
		return this.hasAttribute("once");
	}
	set once(e) {
		if (e) {
			this.setAttribute("once", "");
			return;
		}
		this.removeAttribute("once");
	}
	get rootMargin() {
		return this.getAttribute("root-margin") ?? "0px";
	}
	set rootMargin(e) {
		this.setAttribute("root-margin", e);
	}
	get threshold() {
		return this.getAttribute("threshold") ?? "0.1";
	}
	set threshold(e) {
		this.setAttribute("threshold", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureTarget(), this.bindTrigger(), this.bindIntersectionTrigger(), this.trigger === "load" && (!this.once || !this.hasAutoPlayed) && (this.hasAutoPlayed = !0, this.playIn());
	}
	attributeChangedCallback(e, t, n) {
		this.isConnected && (e === "trigger" && t !== n && n !== "load" && (this.hasAutoPlayed = !1), this.unbindTrigger(), this.ensureTarget(), this.bindTrigger(), this.unbindIntersectionTrigger(), this.bindIntersectionTrigger(), this.paused && this.pause());
	}
	disconnectedCallback() {
		super.connectedCallback(), this.cancel(), this.unbindTrigger(), this.unbindIntersectionTrigger();
	}
	play() {
		return this.playIn();
	}
	async playIn() {
		await this.playNamedAnimation(this.in, "in");
	}
	async playOut() {
		await this.playNamedAnimation(this.out, "out");
	}
	pause() {
		this.animation?.pause();
	}
	cancel() {
		this.animation !== null && (this.animation.cancel(), this.dispatchEvent(new CustomEvent("tp-animation-cancel", {
			bubbles: !0,
			detail: {
				in: this.in,
				out: this.out
			}
		})), this.animation = null);
	}
	restart() {
		return this.playIn();
	}
	ensureStyles() {
		if (document.getElementById(a.styleId)) return;
		let e = document.createElement("style");
		e.id = a.styleId, e.textContent = t, document.head.append(e);
	}
	ensureTarget() {
		let e = this.querySelectorAll("[data-tp-animation-target]");
		for (let t of e) t.removeAttribute("data-tp-animation-target");
		if (this.target !== "") this.targetEl = this.querySelector(this.target);
		else {
			let e = Array.from(this.childNodes).find((e) => e instanceof HTMLElement);
			this.targetEl = e ?? null;
		}
		this.targetEl?.setAttribute("data-tp-animation-target", "");
	}
	handleClick = () => {
		this.once && this.hasAutoPlayed || (this.hasAutoPlayed = !0, this.playIn());
	};
	handleMouseEnter = () => {
		this.once && this.hasAutoPlayed || (this.hasAutoPlayed = !0, this.playIn());
	};
	handleKeyDown = (e) => {
		e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this.handleClick());
	};
	handleIntersection = (e) => {
		for (let t of e) t.isIntersecting && (this.once && this.hasAutoPlayed || (this.hasAutoPlayed = !0, this.playIn(), this.once && this.unbindIntersectionTrigger()));
	};
	unbindTrigger() {
		this.targetEl?.removeEventListener("click", this.handleClick), this.targetEl?.removeEventListener("mouseenter", this.handleMouseEnter), this.targetEl?.removeEventListener("focus", this.handleMouseEnter), this.targetEl?.removeEventListener("keydown", this.handleKeyDown), this.decoratedTarget !== null && (this.decoratedRole === null ? this.decoratedTarget.removeAttribute("role") : this.decoratedTarget.setAttribute("role", this.decoratedRole), this.decoratedTabindex === null ? this.decoratedTarget.removeAttribute("tabindex") : this.decoratedTarget.setAttribute("tabindex", this.decoratedTabindex)), this.decoratedTarget = null, this.decoratedRole = null, this.decoratedTabindex = null;
	}
	bindTrigger() {
		this.targetEl !== null && (this.trigger === "click" && (this.targetEl.addEventListener("click", this.handleClick), this.isNativeInteractiveTarget(this.targetEl) || (this.decoratedTarget = this.targetEl, this.decoratedRole = this.targetEl.getAttribute("role"), this.decoratedTabindex = this.targetEl.getAttribute("tabindex"), this.targetEl.setAttribute("role", "button"), this.targetEl.tabIndex = 0, this.targetEl.addEventListener("keydown", this.handleKeyDown))), this.trigger === "hover" && (this.isNativeInteractiveTarget(this.targetEl) || (this.decoratedTarget = this.targetEl, this.decoratedRole = this.targetEl.getAttribute("role"), this.decoratedTabindex = this.targetEl.getAttribute("tabindex"), this.targetEl.tabIndex = 0), this.targetEl.addEventListener("mouseenter", this.handleMouseEnter), this.targetEl.addEventListener("focus", this.handleMouseEnter)));
	}
	isNativeInteractiveTarget(e) {
		return e.matches("button, a[href], input, select, textarea, summary, details, [contenteditable=\"true\"], tp-button, tp-icon-button");
	}
	bindIntersectionTrigger() {
		this.trigger !== "intersection" || this.targetEl === null || typeof IntersectionObserver > "u" || (this.intersectionObserver = new IntersectionObserver(this.handleIntersection, {
			root: null,
			rootMargin: this.rootMargin,
			threshold: i(this.getAttribute("threshold"))
		}), this.intersectionObserver.observe(this.targetEl));
	}
	unbindIntersectionTrigger() {
		this.intersectionObserver?.disconnect(), this.intersectionObserver = null;
	}
	async playNamedAnimation(e, t) {
		if (this.targetEl === null || e === "") return;
		this.cancel(), this.prepareAnimateCssClasses(e);
		let n = this.extractKeyframesFromCssAnimationName(this.targetEl);
		if (n === null) return;
		this.targetEl.classList.remove("animate__animated", `animate__${e}`);
		let r = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === !0;
		this.animation = this.targetEl.animate(n, {
			delay: r ? 0 : this.parseTimeToMs(this.delay),
			duration: r ? 0 : this.parseTimeToMs(this.duration),
			easing: this.easing,
			fill: this.fill,
			iterations: r ? 1 : this.parseIterations(this.iterations)
		}), this.dispatchEvent(new CustomEvent("tp-animation-start", {
			bubbles: !0,
			detail: {
				in: this.in,
				out: this.out,
				phase: t
			}
		})), this.paused && this.animation.pause();
		try {
			await this.animation.finished, this.dispatchEvent(new CustomEvent("tp-animation-finish", {
				bubbles: !0,
				detail: {
					in: this.in,
					out: this.out,
					phase: t
				}
			}));
		} catch {}
	}
	prepareAnimateCssClasses(e) {
		this.targetEl === null || e === "" || (this.targetEl.classList.remove("animate__animated", `animate__${e}`), this.targetEl.offsetWidth, this.targetEl.classList.add("animate__animated", `animate__${e}`));
	}
	extractKeyframesFromCssAnimationName(e) {
		if (getComputedStyle(e).animationName === "none") return null;
		let t = [
			0,
			.25,
			.5,
			.75,
			1
		], n = e.style.animation, r = e.style.transition, i = e.style.animationDelay, a = e.style.animationPlayState;
		e.style.animationPlayState = "paused", e.style.transition = "none";
		let o = t.map((t) => {
			e.style.animationDelay = `-${String(this.parseTimeToMs(this.duration) * t)}ms`;
			let n = getComputedStyle(e);
			return {
				offset: t,
				opacity: n.opacity,
				transform: n.transform === "none" ? "none" : n.transform,
				filter: n.filter === "none" ? "none" : n.filter
			};
		});
		return e.style.animation = n, e.style.transition = r, e.style.animationDelay = i, e.style.animationPlayState = a, o;
	}
	parseTimeToMs(e) {
		let t = e.trim();
		return t.endsWith("ms") ? Number(t.slice(0, -2)) : t.endsWith("s") ? Number(t.slice(0, -1)) * 1e3 : 1e3;
	}
	parseIterations(e) {
		if (e === "infinite") return Infinity;
		let t = Number(e);
		return Number.isFinite(t) && t > 0 ? t : 1;
	}
};
customElements.get("tp-animation") || customElements.define("tp-animation", a);
//#endregion
export { a as t };

//# sourceMappingURL=animation.js.map