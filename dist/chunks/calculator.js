import { Ku as e } from "./lib/typescript/typescript.js";
import "../components/textfield/textfield.js";
import { calculate as t } from "../components/calculator/calculator-engine.js";
//#region src/components/calculator/calculator.css?inline
var n = "tp-calculator{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-md);background:var(--tp-paper-color);max-inline-size:48rem;color:var(--tp-text-body);padding:1rem;display:flow-root}tp-calculator .tp-calculator-header{justify-content:space-between;align-items:center;gap:.75rem;margin-block-end:.75rem;display:flex}tp-calculator .tp-calculator-header h3{margin:0;font-size:1.25rem}tp-calculator .tp-calculator-pads{flex-wrap:wrap;gap:.75rem;display:flex}tp-calculator .tp-calculator-scientific,tp-calculator .tp-calculator-numeric{flex:14rem;grid-template-columns:repeat(4,minmax(0,1fr));gap:.35rem;min-inline-size:0;display:grid}tp-calculator[data-orientation=vertical]{max-inline-size:25rem}tp-calculator[data-orientation=vertical] .tp-calculator-pads{flex-direction:column}tp-calculator[data-orientation=vertical] .tp-calculator-pads>div{flex-basis:auto}tp-calculator tp-button{min-inline-size:0}tp-calculator tp-button button{min-block-size:2.5rem;inline-size:100%;padding-inline:.25rem}tp-calculator .tp-calculator-status{overflow-wrap:anywhere;min-block-size:1.5em;margin-block:.5rem}tp-calculator>tp-textfield{--tp-textfield-inline-size:100%}tp-calculator .tp-calculator-numeric tp-button:last-child{grid-column:span 2}", r = class extends e {
	field = null;
	status = null;
	degreeButton = null;
	orientationButton = null;
	degrees = !0;
	start = 0;
	end = 0;
	evaluated = !1;
	static get observedAttributes() {
		return ["orientation"];
	}
	get orientation() {
		return this.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
	}
	set orientation(e) {
		this.setAttribute("orientation", e);
	}
	attributeChangedCallback() {
		this.syncOrientation();
	}
	syncOrientation() {
		this.dataset.orientation = this.orientation;
		let e = this.orientation === "horizontal" ? "vertical" : "horizontal";
		this.orientationButton?.setAttribute("name", `arrow-expand-${e}`), this.orientationButton?.setAttribute("label", `Switch to ${e} orientation`);
	}
	connectedCallback() {
		if (super.connectedCallback(), this.ensureGlobalStyle("tp-calculator-style", n), this.dataset.orientation = this.orientation, this.field) return;
		let e = document.createElement("h3");
		e.textContent = "Calculator";
		let t = document.createElement("div");
		t.className = "tp-calculator-header", this.orientationButton = document.createElement("tp-icon-button"), this.orientationButton.setAttribute("type", "button"), this.orientationButton.addEventListener("click", () => {
			this.orientation = this.orientation === "horizontal" ? "vertical" : "horizontal";
		}), this.syncOrientation(), t.append(e, this.orientationButton), this.field = document.createElement("tp-textfield"), this.field.setAttribute("label", "Expression"), this.field.setAttribute("label-position", "top"), this.field.setAttribute("placeholder", "0"), this.field.addEventListener("input", () => {
			this.evaluated = !1, this.clearStatus(), this.rememberSelection();
		}), this.field.addEventListener("keyup", () => this.rememberSelection()), this.field.addEventListener("click", () => this.rememberSelection()), this.field.addEventListener("focusout", () => this.rememberSelection()), this.field.addEventListener("keydown", (e) => {
			e.key === "Enter" || e.key === "=" ? (e.preventDefault(), this.equals()) : e.key === "Escape" && (e.preventDefault(), this.clear());
		}), this.status = document.createElement("p"), this.status.className = "tp-calculator-status", this.status.setAttribute("role", "status");
		let r = document.createElement("div");
		r.className = "tp-calculator-pads";
		let i = document.createElement("div");
		i.className = "tp-calculator-scientific";
		let a = document.createElement("div");
		a.className = "tp-calculator-numeric";
		let o = (e, t, n, r = t) => {
			let i = document.createElement("tp-button"), a = document.createElement("span");
			return a.dataset.calculatorKey = "", a.textContent = t, i.append(a), i.setAttribute("type", "button"), i.setAttribute("aria-label", r), i.addEventListener("pointerdown", (e) => e.preventDefault()), i.addEventListener("click", n), e.append(i), i;
		};
		this.degreeButton = o(i, "Deg", () => {
			if (this.degrees = !this.degrees, this.degreeButton) {
				let e = this.degreeButton.querySelector("[data-calculator-key]");
				e && (e.textContent = this.degrees ? "Deg" : "Rad"), this.degreeButton.setAttribute("aria-label", this.degrees ? "Degrees; switch to radians" : "Radians; switch to degrees");
			}
		}, "Degrees; switch to radians"), o(i, "(", () => this.insert("(")), o(i, ")", () => this.insert(")")), o(i, "%", () => this.insert("%"));
		for (let [e, t, n] of [
			[
				"x²",
				"(",
				")^2"
			],
			[
				"xⁿ",
				"(",
				")^"
			],
			[
				"eˣ",
				"exp(",
				")"
			],
			[
				"10ⁿ",
				"10^(",
				")"
			],
			[
				"1/x",
				"1/(",
				")"
			],
			[
				"√x",
				"sqrt(",
				")"
			],
			[
				"ʸ√x",
				"sqrt(",
				",)"
			],
			[
				"n!",
				"(",
				")!"
			]
		]) o(i, e ?? "", () => this.wrap(t ?? "", n ?? ""));
		for (let e of [
			"ln",
			"log",
			"sin",
			"cos",
			"tan",
			"sinh",
			"cosh",
			"tanh"
		]) o(i, e, () => this.wrap(`${e}(`, ")"));
		o(i, "e", () => this.insert("e")), o(i, "π", () => this.insert("pi"), "Pi"), o(i, "Rand", () => this.insert(String(Math.random())), "Random number"), o(i, ",", () => this.insert(","));
		for (let e of [
			"AC",
			"⌫",
			"±",
			"/",
			"7",
			"8",
			"9",
			"*",
			"4",
			"5",
			"6",
			"-",
			"1",
			"2",
			"3",
			"+",
			"0",
			".",
			"=",
			""
		]) e && o(a, e, () => {
			e === "AC" ? this.clear() : e === "⌫" ? this.backspace() : e === "±" ? this.wrap("-(", ")") : e === "=" ? this.equals() : this.insert(e);
		}, e === "⌫" ? "Delete previous character" : e === "AC" ? "Clear all" : e);
		r.append(i, a), this.replaceChildren(t, this.field, this.status, r);
	}
	rememberSelection() {
		let e = this.field?.querySelector("input");
		e && (this.start = e.selectionStart ?? 0, this.end = e.selectionEnd ?? this.start);
	}
	clearStatus() {
		this.status && (this.status.textContent = ""), this.field?.removeAttribute("aria-invalid");
	}
	write(e, t = e.length) {
		if (!this.field) return;
		this.field.value = e, this.start = t, this.end = t;
		let n = this.field.querySelector("input");
		n?.focus(), n?.setSelectionRange(t, t), this.clearStatus();
	}
	insert(e) {
		let t = this.field?.value ?? "";
		this.evaluated && !/^[+*/^%!-]$/.test(e) && (t = "", this.start = 0, this.end = 0), this.evaluated = !1, this.write(t.slice(0, this.start) + e + t.slice(this.end), this.start + e.length);
	}
	wrap(e, t) {
		let n = this.field?.value ?? "", r = n.slice(this.start, this.end), i = this.start === this.end && n.length > 0, a = i ? n : r, o = i ? "" : n.slice(0, this.start), s = i ? "" : n.slice(this.end);
		this.evaluated = !1;
		let c = o + e + a + t + s, l = t === ",)" ? o.length + e.length + a.length + 1 : a ? c.length - s.length : o.length + e.length;
		this.write(c, l);
	}
	backspace() {
		let e = this.field?.value ?? "", t = this.start === this.end ? Math.max(0, this.start - 1) : this.start;
		this.evaluated = !1, this.write(e.slice(0, t) + e.slice(this.end), t);
	}
	clear() {
		this.evaluated = !1, this.write("");
	}
	equals() {
		let e = this.field?.value ?? "";
		try {
			let n = t(e, this.degrees);
			this.write(String(n)), this.evaluated = !0, this.status && (this.status.textContent = `${e} = ${n}`), this.dispatchEvent(new CustomEvent("tp-calculator-result", {
				bubbles: !0,
				detail: {
					expression: e,
					result: n
				}
			}));
		} catch (e) {
			this.status && (this.status.textContent = e instanceof Error ? e.message : String(e)), this.field?.setAttribute("aria-invalid", "true");
		}
	}
};
customElements.get("tp-calculator") || customElements.define("tp-calculator", r);
//#endregion
export { r as t };

//# sourceMappingURL=calculator.js.map