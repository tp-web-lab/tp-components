//#region ../tp-markdown/dist/markdown/renderers/typewriting.js
var e = {
	id: "typewriting",
	render(e, n = {}) {
		for (let r of e.querySelectorAll(".tp-md-typewriting")) r instanceof HTMLElement && t(r, n);
	}
};
function t(e, t) {
	if (e.dataset.typewritingRendered === "true") return;
	let r = n(e, t);
	r.words.length !== 0 && (e.dataset.typewritingRendered = "true", new s(e, r));
}
function n(e, t) {
	let n = r(e);
	return {
		words: o(e),
		speed: n.speed ?? t.speed ?? 100,
		delay: n.delay ?? t.delay ?? 1e3,
		loop: n.loop ?? t.loop ?? !0
	};
}
function r(e) {
	return {
		speed: i(e.dataset.typewritingSpeed),
		delay: i(e.dataset.typewritingDelay),
		loop: a(e.dataset.typewritingLoop)
	};
}
function i(e) {
	if (e === void 0) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function a(e) {
	if (e !== void 0) {
		if (e === "true" || e === "1") return !0;
		if (e === "false" || e === "0") return !1;
	}
}
function o(e) {
	let t = e.dataset.typewritingWords ?? "[]";
	try {
		let e = JSON.parse(t);
		if (Array.isArray(e) && e.every((e) => typeof e == "string")) return e;
	} catch {
		return [];
	}
	return [];
}
var s = class {
	element;
	options;
	char = "";
	counter = 0;
	isDeleting = !1;
	timeoutId;
	constructor(e, t) {
		this.element = e, this.options = t, this.type();
	}
	type() {
		let e = this.getCurrentWord();
		if (e === void 0) return;
		let t = this.options.speed;
		if (this.isDeleting ? (t /= 2, this.char = e.substring(0, this.char.length - 1)) : this.char = e.substring(0, this.char.length + 1), this.render(), !this.isDeleting && this.char === e) {
			if (!this.options.loop && this.counter >= this.options.words.length - 1) return;
			this.isDeleting = !0, t = this.options.delay;
		} else this.isDeleting && this.char === "" && (this.isDeleting = !1, this.counter += 1);
		this.timeoutId = window.setTimeout(() => {
			this.type();
		}, t);
	}
	getCurrentWord() {
		return this.options.loop ? this.options.words[this.counter % this.options.words.length] : this.options.words[this.counter];
	}
	render() {
		let e = document.createElement("span"), t = document.createElement("span");
		e.className = "write", e.textContent = this.char, t.className = "blinking-cursor", t.textContent = "|", this.element.replaceChildren(e, t);
	}
	destroy() {
		this.timeoutId !== void 0 && window.clearTimeout(this.timeoutId);
	}
};
//#endregion
export { e as default };

//# sourceMappingURL=typewriting3.js.map