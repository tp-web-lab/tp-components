import "../../chunks/button.js";
import "../../chunks/divider.js";
import "../../chunks/button-group.js";
import "../../chunks/dragdrop.js";
import "../../chunks/callout.js";
import { n as e } from "../../chunks/blank.js";
import { getBlankFields as t } from "../fill-blank/fields.js";
import "../../chunks/sidebar.js";
import { preserveRenderedMath as n } from "./answer-reading.js";
//#region src/components/fill-blank-question/closed-answers.ts
var r = class r {
	form;
	static nextId = 0;
	layout = document.createElement("tp-sidebar");
	container = document.createElement("div");
	dragdrop = document.createElement("tp-dragdrop");
	fields = /* @__PURE__ */ new Map();
	choices = [];
	selected = null;
	targetField = null;
	instructions = document.createElement("tp-callout");
	constructor(n, i, a, o = [], s = i.map((e, t) => t)) {
		this.form = n, this.container.id = `tp-closed-answers-${r.nextId++}`, this.layout.setAttribute("right-sidebar", ""), this.layout.setAttribute("side-width", "10rem"), this.container.setAttribute("data-tp-closed-answers", "");
		let c = document.createElement("div");
		c.setAttribute("data-tp-closed-bank", "");
		let l = document.createElement("tp-divider");
		l.setAttribute("orientation", "vertical");
		let u = document.createElement("div"), d = document.createElement("span");
		d.setAttribute("data-tp-closed-answers-heading", ""), d.textContent = "Answers", this.instructions.setAttribute("variant", "info"), this.instructions.setAttribute("heading", "Interactions"), this.instructions.setAttribute("closable", ""), this.instructions.setAttribute("data-tp-closed-instructions", ""), this.instructions.innerHTML = "<dl>\n			<dt>Mouse</dt>\n			<dd>Drag an answer to a blank, or select an answer then click a blank.</dd>\n			<dt>Keyboard</dt>\n			<dd>Tab to a blank, then press Right Arrow to reach the answers: the starting blank stays highlighted. Use Up/Down to choose an answer, then Enter or Space to fill the highlighted blank directly. Escape cancels and returns to that blank. Delete or Backspace clears a focused blank.</dd>\n		</dl>", a?.after(this.instructions);
		let f = document.createElement("tp-button-group");
		f.setAttribute("orientation", "vertical"), f.style.setProperty("--tp-button-group-gap", "0.25rem"), f.setAttribute("aria-label", "Available answers");
		let p = i.flatMap((e, t) => s.includes(t) ? [{
			text: e,
			rank: String(t + 1),
			content: o[t] ?? document.createTextNode(e)
		}] : []);
		for (let e = p.length - 1; e > 0; --e) {
			let t = Math.floor(Math.random() * (e + 1)), n = p[e], r = p[t];
			n && r && (p[e] = r, p[t] = n);
		}
		for (let { text: e, rank: t, content: n } of p) {
			let r = document.createElement("tp-button");
			r.setAttribute("size", "s"), r.setAttribute("data-tp-closed-item", "");
			let i = e || (n instanceof DocumentFragment ? n.querySelector("[aria-label], img")?.getAttribute("aria-label") || n.querySelector("img")?.getAttribute("alt") : "") || "Answer option";
			r.setAttribute("aria-label", i);
			let a = document.createElement("button");
			a.type = "button", a.tabIndex = 0, a.setAttribute("aria-label", i), a.append(n.cloneNode(!0)), r.append(a), f.append(r), this.choices.push({
				text: i,
				button: r,
				field: null,
				rank: t,
				content: n
			});
		}
		let m = t(n);
		for (let t of s) {
			let n = m[t], r = n && (e(n) ? n : n.closest("tp-textfield"));
			r && (this.fields.set(r, r.readOnly), r.readOnly = !0, r.value = "", r.setAttribute("data-tp-closed-item", ""));
		}
		u.append(d, f), c.append(l, u), n.before(this.container), this.container.append(this.layout), this.layout.append(n, c), this.container.addEventListener("click", this.onClick), this.container.addEventListener("input", this.onFieldInput), this.container.addEventListener("keydown", this.onKeyDown, !0), this.dragdrop.setAttribute("root", `#${this.container.id}`), this.dragdrop.setAttribute("items", "[data-tp-closed-item]"), this.dragdrop.setAttribute("handle", "tp-button, tp-textfield, tp-blank, button, input, textarea"), this.dragdrop.addEventListener("tp-dragdrop-drop", this.onDrop), this.container.append(this.dragdrop);
		for (let e of this.choices) e.button.tabIndex = -1;
	}
	destroy() {
		this.setTargetField(null), this.instructions.remove(), this.dragdrop.remove(), this.dragdrop.removeEventListener("tp-dragdrop-drop", this.onDrop), this.container.removeEventListener("click", this.onClick), this.container.removeEventListener("input", this.onFieldInput), this.container.removeEventListener("keydown", this.onKeyDown, !0);
		for (let [e, t] of this.fields) e.readOnly = t, e.removeAttribute("data-tp-closed-item"), e.removeAttribute("draggable");
		this.container.before(this.form), this.container.remove();
	}
	onClick = (e) => {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[data-tp-closed-item]"), n = this.choices.find((e) => e.button === t);
		n ? this.selected = n : t && this.fields.has(t) && this.selected && (this.assign(this.selected, t), this.selected = null);
	};
	onKeyDown = (t) => {
		if (!(t.target instanceof Element)) return;
		if (t.target.closest("[data-tp-blank-clear]")) {
			if (t.key === "Enter" || t.key === " ") {
				t.preventDefault(), t.stopPropagation();
				let n = t.target.closest("tp-blank");
				n && e(n) && (n.clear(), n.focus());
			}
			return;
		}
		if (!t.target.closest("[data-tp-closed-item]") || ![
			"Enter",
			" ",
			"Escape",
			"ArrowUp",
			"ArrowDown",
			"ArrowLeft",
			"ArrowRight",
			"Delete",
			"Backspace"
		].includes(t.key)) return;
		t.stopPropagation();
		let n = t.target.closest("[data-tp-closed-item]"), r = t.target.closest("tp-textfield, tp-blank");
		if (t.key === "Escape") {
			t.preventDefault(), this.targetField ? this.focusField(this.targetField) : this.selected?.button.querySelector("button")?.focus(), this.setTargetField(null), this.selected = null;
			return;
		}
		if (t.key === "Enter" || t.key === " ") {
			t.preventDefault();
			let e = this.choices.find((e) => e.button === n);
			if (e) {
				if (this.targetField) {
					let t = this.targetField;
					this.assign(e, t), this.setTargetField(null), this.selected = null, this.focusField(t);
					return;
				}
				this.selected = e;
				let t = [...this.fields.keys()].filter((e) => !e.disabled), n = t.find((e) => e.value === "") ?? t[0];
				n && this.focusField(n);
			} else r && this.selected && (this.assign(this.selected, r), this.selected = null);
			return;
		}
		if (t.key.startsWith("Arrow")) {
			if (!this.selected) {
				let e = this.choices.findIndex((e) => e.button === n);
				if (r && t.key === "ArrowRight") {
					if (t.preventDefault(), r.disabled || this.choices.length === 0) return;
					this.setTargetField(r), this.choices[0]?.button.querySelector("button")?.focus();
				} else if (e >= 0 && ["ArrowUp", "ArrowDown"].includes(t.key)) {
					t.preventDefault();
					let n = t.key === "ArrowDown" ? 1 : -1;
					this.choices[(e + n + this.choices.length) % this.choices.length]?.button.querySelector("button")?.focus();
				}
				return;
			}
			t.preventDefault();
			let e = [...this.fields.keys()].filter((e) => !e.disabled);
			if (e.length === 0) return;
			let i = e[((r ? e.indexOf(r) : -1) + (["ArrowDown", "ArrowRight"].includes(t.key) ? 1 : -1) + e.length) % e.length];
			i && this.focusField(i);
			return;
		}
		if (!r || !this.fields.has(r) || r.disabled) return;
		t.preventDefault();
		let i = this.choices.find((e) => e.field === r);
		i && (i.field = null), this.updateAssignedChoices(), this.write(r, "");
	};
	onFieldInput = (t) => {
		let n = t.target;
		if (!(n instanceof Element) || !e(n) || n.value !== "") return;
		let r = this.choices.find((e) => e.field === n);
		r && (r.field = null, this.updateAssignedChoices());
	};
	focusField(t) {
		e(t) ? t.focus() : t.querySelector("input, textarea")?.focus();
	}
	setTargetField(e) {
		this.targetField?.removeAttribute("data-tp-closed-target"), this.targetField = e, e?.setAttribute("data-tp-closed-target", "");
	}
	onDrop = (e) => {
		let { source: t, target: n } = e.detail, r = this.choices.find((e) => e.button === t || e.field === t);
		r && n && this.fields.has(n) && this.assign(r, n), this.selected = null;
	};
	assign(t, r) {
		if (!this.fields.has(r) || r.disabled) return;
		let i = this.choices.find((e) => e.field === r);
		if (i && (i.field = null), t.field && t.field !== r && this.write(t.field, ""), t.field = r, this.updateAssignedChoices(), e(r)) {
			let e = document.createDocumentFragment(), i = t.button.querySelector("[data-tp-button-content]") ?? t.button.querySelector("button");
			if (i) for (let t of i.childNodes) e.append(t.cloneNode(!0));
			else e.append(t.content.cloneNode(!0));
			n(e), r.setAnswer(t.rank, e);
		} else this.write(r, t.text);
	}
	updateAssignedChoices() {
		for (let e of this.choices) {
			e.button.toggleAttribute("data-tp-closed-assigned", e.field !== null);
			let t = e.button.querySelector("button");
			e.field ? t?.setAttribute("aria-description", `Assigned to ${e.field.getAttribute("aria-label") ?? e.field.name}. Can be reassigned.`) : t?.removeAttribute("aria-description");
		}
	}
	write(t, n) {
		if (t.value = n, e(t)) {
			t.dispatchEvent(new Event("input", { bubbles: !0 }));
			return;
		}
		t.querySelector("input, textarea")?.dispatchEvent(new Event("input", { bubbles: !0 }));
	}
};
//#endregion
export { r as ClosedAnswers };

//# sourceMappingURL=closed-answers.js.map