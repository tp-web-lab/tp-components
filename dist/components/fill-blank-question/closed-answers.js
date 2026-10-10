import { vr as e } from "../../chunks/lib/typescript/typescript.js";
import { n as t } from "../../chunks/blank.js";
import "../../chunks/sidebar.js";
//#region src/components/fill-blank-question/closed-answers.ts
var n = class n {
	form;
	static nextId = 0;
	layout = document.createElement("tp-sidebar");
	container = document.createElement("div");
	dragdrop = document.createElement("tp-dragdrop");
	fields = /* @__PURE__ */ new Map();
	choices = [];
	selected = null;
	targetField = null;
	reading = document.createElement("div");
	readingCallout = document.createElement("tp-callout");
	readingObserver = new MutationObserver(() => this.updateReading());
	instructions = document.createElement("tp-callout");
	constructor(e, t, r, i = []) {
		this.form = e, this.container.id = `tp-closed-answers-${n.nextId++}`, this.layout.setAttribute("right-sidebar", ""), this.layout.setAttribute("side-width", "10rem"), this.container.setAttribute("data-tp-closed-answers", "");
		let a = document.createElement("div");
		a.setAttribute("data-tp-closed-bank", "");
		let o = document.createElement("tp-divider");
		o.setAttribute("orientation", "vertical");
		let s = document.createElement("div"), c = document.createElement("span");
		c.setAttribute("data-tp-closed-answers-heading", ""), c.textContent = "Answers", this.instructions.setAttribute("variant", "info"), this.instructions.setAttribute("heading", "Interactions"), this.instructions.setAttribute("closable", ""), this.instructions.setAttribute("data-tp-closed-instructions", ""), this.instructions.innerHTML = "<dl>\n			<dt>Mouse</dt>\n			<dd>Drag an answer to a blank, or select an answer then click a blank.</dd>\n			<dt>Keyboard</dt>\n			<dd>Tab to a blank, then press Right Arrow to reach the answers: the starting blank stays highlighted. Use Up/Down to choose an answer, then Enter or Space to fill the highlighted blank directly. Escape cancels and returns to that blank. Delete or Backspace clears a focused blank.</dd>\n		</dl>", r?.after(this.instructions), this.reading.setAttribute("role", "status"), this.reading.setAttribute("data-tp-closed-reading", ""), this.readingCallout.setAttribute("variant", "neutral"), this.readingCallout.append(this.reading);
		let l = document.createElement("tp-button-group");
		l.setAttribute("orientation", "vertical"), l.style.setProperty("--tp-button-group-gap", "0.25rem"), l.setAttribute("aria-label", "Available answers");
		let u = t.map((e, t) => ({
			text: e,
			rank: String(t + 1),
			content: i[t] ?? document.createTextNode(e)
		}));
		for (let e = u.length - 1; e > 0; --e) {
			let t = Math.floor(Math.random() * (e + 1)), n = u[e], r = u[t];
			n && r && (u[e] = r, u[t] = n);
		}
		for (let { text: e, rank: t, content: n } of u) {
			let r = document.createElement("tp-button");
			r.setAttribute("size", "s"), r.setAttribute("data-tp-closed-item", "");
			let i = e || (n instanceof DocumentFragment ? n.querySelector("[aria-label], img")?.getAttribute("aria-label") || n.querySelector("img")?.getAttribute("alt") : "") || "Answer option";
			r.setAttribute("aria-label", i);
			let a = document.createElement("button");
			a.type = "button", a.tabIndex = 0, a.setAttribute("aria-label", i), a.append(n.cloneNode(!0)), r.append(a), l.append(r), this.choices.push({
				text: i,
				button: r,
				field: null,
				rank: t,
				content: n
			});
		}
		for (let t of e.querySelectorAll("tp-textfield, tp-blank")) this.fields.set(t, t.readOnly), t.readOnly = !0, t.value = "", t.setAttribute("data-tp-closed-item", "");
		s.append(c, l), a.append(o, s), e.before(this.container), this.container.append(this.layout, this.readingCallout), this.layout.append(e, a), this.container.addEventListener("click", this.onClick), this.container.addEventListener("input", this.onFieldInput), this.container.addEventListener("keydown", this.onKeyDown, !0), this.dragdrop.setAttribute("root", `#${this.container.id}`), this.dragdrop.setAttribute("items", "[data-tp-closed-item]"), this.dragdrop.setAttribute("handle", "tp-button, tp-textfield, tp-blank, button, input, textarea"), this.dragdrop.addEventListener("tp-dragdrop-drop", this.onDrop), this.container.append(this.dragdrop);
		for (let e of this.choices) e.button.tabIndex = -1;
		this.updateReading(), this.readingObserver.observe(this.form, {
			subtree: !0,
			childList: !0,
			characterData: !0
		}), this.readingObserver.observe(a, {
			subtree: !0,
			childList: !0
		});
	}
	destroy() {
		this.readingObserver.disconnect(), this.setTargetField(null), this.instructions.remove(), this.dragdrop.remove(), this.dragdrop.removeEventListener("tp-dragdrop-drop", this.onDrop), this.container.removeEventListener("click", this.onClick), this.container.removeEventListener("input", this.onFieldInput), this.container.removeEventListener("keydown", this.onKeyDown, !0);
		for (let [e, t] of this.fields) e.readOnly = t, e.removeAttribute("data-tp-closed-item"), e.removeAttribute("draggable");
		this.container.before(this.form), this.container.remove();
	}
	onClick = (e) => {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[data-tp-closed-item]"), n = this.choices.find((e) => e.button === t);
		n ? this.selected = n : t && this.fields.has(t) && this.selected && (this.assign(this.selected, t), this.selected = null);
	};
	onKeyDown = (e) => {
		if (!(e.target instanceof Element)) return;
		if (e.target.closest("[data-tp-blank-clear]")) {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault(), e.stopPropagation();
				let n = e.target.closest("tp-blank");
				n && t(n) && (n.clear(), n.focus());
			}
			return;
		}
		if (!e.target.closest("[data-tp-closed-item]") || ![
			"Enter",
			" ",
			"Escape",
			"ArrowUp",
			"ArrowDown",
			"ArrowLeft",
			"ArrowRight",
			"Delete",
			"Backspace"
		].includes(e.key)) return;
		e.stopPropagation();
		let n = e.target.closest("[data-tp-closed-item]"), r = e.target.closest("tp-textfield, tp-blank");
		if (e.key === "Escape") {
			e.preventDefault(), this.targetField ? this.focusField(this.targetField) : this.selected?.button.querySelector("button")?.focus(), this.setTargetField(null), this.selected = null;
			return;
		}
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			let t = this.choices.find((e) => e.button === n);
			if (t) {
				if (this.targetField) {
					let e = this.targetField;
					this.assign(t, e), this.setTargetField(null), this.selected = null, this.focusField(e);
					return;
				}
				this.selected = t;
				let e = [...this.fields.keys()].filter((e) => !e.disabled), n = e.find((e) => e.value === "") ?? e[0];
				n && this.focusField(n);
			} else r && this.selected && (this.assign(this.selected, r), this.selected = null);
			return;
		}
		if (e.key.startsWith("Arrow")) {
			if (!this.selected) {
				let t = this.choices.findIndex((e) => e.button === n);
				if (r && e.key === "ArrowRight") {
					if (e.preventDefault(), r.disabled || this.choices.length === 0) return;
					this.setTargetField(r), this.choices[0]?.button.querySelector("button")?.focus();
				} else if (t >= 0 && ["ArrowUp", "ArrowDown"].includes(e.key)) {
					e.preventDefault();
					let n = e.key === "ArrowDown" ? 1 : -1;
					this.choices[(t + n + this.choices.length) % this.choices.length]?.button.querySelector("button")?.focus();
				}
				return;
			}
			e.preventDefault();
			let t = [...this.fields.keys()].filter((e) => !e.disabled);
			if (t.length === 0) return;
			let i = t[((r ? t.indexOf(r) : -1) + (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1) + t.length) % t.length];
			i && this.focusField(i);
			return;
		}
		if (!r || !this.fields.has(r) || r.disabled) return;
		e.preventDefault();
		let i = this.choices.find((e) => e.field === r);
		i && (i.field = null), this.updateAssignedChoices(), this.write(r, "");
	};
	onFieldInput = (e) => {
		this.updateReading();
		let n = e.target;
		if (!(n instanceof Element) || !t(n) || n.value !== "") return;
		let r = this.choices.find((e) => e.field === n);
		r && (r.field = null, this.updateAssignedChoices());
	};
	focusField(e) {
		t(e) ? e.focus() : e.querySelector("input, textarea")?.focus();
	}
	setTargetField(e) {
		this.targetField?.removeAttribute("data-tp-closed-target"), this.targetField = e, e?.setAttribute("data-tp-closed-target", "");
	}
	onDrop = (e) => {
		let { source: t, target: n } = e.detail, r = this.choices.find((e) => e.button === t || e.field === t);
		r && n && this.fields.has(n) && this.assign(r, n), this.selected = null;
	};
	assign(e, n) {
		if (!this.fields.has(n) || n.disabled) return;
		let r = this.choices.find((e) => e.field === n);
		if (r && (r.field = null), e.field && e.field !== n && this.write(e.field, ""), e.field = n, this.updateAssignedChoices(), t(n)) {
			let t = document.createDocumentFragment(), r = e.button.querySelector("[data-tp-button-content]") ?? e.button.querySelector("button");
			if (r) for (let e of r.childNodes) t.append(e.cloneNode(!0));
			else t.append(e.content.cloneNode(!0));
			this.preserveRenderedMath(t), n.setAnswer(e.rank, t);
		} else this.write(n, e.text);
		this.updateReading();
	}
	updateReading() {
		e(this.layout);
		let n = document.createElement("template"), r = n.content.ownerDocument.importNode(this.form, !0);
		n.content.append(...r.childNodes);
		let i = [...this.fields.keys()], a = n.content.querySelectorAll("tp-textfield, tp-blank");
		for (let [e, n] of a.entries()) {
			let r = i[e];
			if (!r?.value) n.replaceWith(document.createTextNode("…"));
			else if (t(r)) {
				let e = document.createDocumentFragment();
				for (let t of r.childNodes) t instanceof Element && t.hasAttribute("data-tp-blank-tools") || e.append(t.cloneNode(!0));
				for (let t of e.querySelectorAll("p")) t.replaceWith(...t.childNodes);
				n.replaceWith(e);
			} else n.replaceWith(document.createTextNode(r.value));
		}
		this.normalizeReadingMath(n.content), this.reading.replaceChildren(n.content);
	}
	preserveRenderedMath(e) {
		for (let t of e.querySelectorAll("tp-math")) {
			let e = t.querySelector(":scope > [data-tp-math-output]");
			e?.querySelector("svg") && (t.hasAttribute("displaystyle") && (e.style.display = "block"), t.replaceWith(e));
		}
	}
	normalizeReadingMath(e) {
		this.preserveRenderedMath(e);
		for (let t of e.querySelectorAll("mjx-container, .MathJax_SVG")) {
			let e = t.querySelectorAll(":scope > svg");
			if (e.length === 0) continue;
			let n = document.createElement("span");
			n.setAttribute("data-tp-reading-math", "");
			let r = t.getAttribute("aria-label") || t.getAttribute("data-semantic-speech-none") || t.querySelector("svg[aria-label]")?.getAttribute("aria-label") || t.querySelector("math")?.textContent || "Mathematical expression";
			n.setAttribute("role", "img"), n.setAttribute("aria-label", r);
			for (let t of e) t.setAttribute("aria-hidden", "true");
			n.append(...e), t.replaceWith(n);
		}
		for (let t of e.querySelectorAll(".MathJax_Preview, script[type^=\"math/\"], mjx-assistive-mml, .MJX_Assistive_MathML")) t.remove();
	}
	updateAssignedChoices() {
		for (let e of this.choices) {
			e.button.toggleAttribute("data-tp-closed-assigned", e.field !== null);
			let t = e.button.querySelector("button");
			e.field ? t?.setAttribute("aria-description", `Assigned to ${e.field.getAttribute("aria-label") ?? e.field.name}. Can be reassigned.`) : t?.removeAttribute("aria-description");
		}
	}
	write(e, n) {
		if (e.value = n, t(e)) {
			e.dispatchEvent(new Event("input", { bubbles: !0 }));
			return;
		}
		e.querySelector("input, textarea")?.dispatchEvent(new Event("input", { bubbles: !0 }));
	}
};
//#endregion
export { n as ClosedAnswers };

//# sourceMappingURL=closed-answers.js.map