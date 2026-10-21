import { t as e } from "./base.js";
import "./icon-button.js";
import "./button-group.js";
import "./dropdown.js";
import { TpDeclarativeTextSource as t } from "../utilities/declarative-text-source.js";
import { PIECES as n, SQUARE as r, at as i, insideTarget as a, overlaps as o, parseSolution as s, polygon as c, solved as l, validate as u } from "../components/tangram/geometry.js";
//#region src/components/tangram/tangram.css?inline
var d = "tp-tangram{color:var(--tp-color-text,#242c33);display:block}tp-tangram .tp-tangram-ui{background:var(--tp-color-background,#fff);border:1px solid #d6d5ce;border-radius:1rem;padding:1rem}tp-tangram .tp-tangram-heading{flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:.75rem;margin-bottom:1rem;display:flex}tp-tangram .tp-tangram-title{flex-direction:column;gap:.2rem;display:flex}tp-tangram .tp-tangram-heading>tp-button-group{justify-content:flex-end;margin-left:auto}tp-tangram .tp-tangram-heading strong{font-size:1.4rem}tp-tangram tp-button-group{flex-wrap:wrap;gap:.25rem;display:flex}tp-tangram .tp-tangram-hint,tp-tangram [role=status]{margin:.75rem 0;font-size:.9rem}tp-tangram .tp-tangram-board{touch-action:none;-webkit-user-select:none;user-select:none;background:#f7f6f0;border-radius:.6rem;width:100%;max-height:70vh;display:block}tp-tangram [data-piece]{cursor:grab}tp-tangram [data-piece]:focus{stroke:#101820;stroke-width:.08px;outline:none}tp-tangram [data-piece].invalid{opacity:.55;stroke:#c00000;stroke-width:.1px}tp-tangram:fullscreen{background:#fff;overflow:auto}tp-tangram:fullscreen .tp-tangram-board{max-height:78vh}tp-tangram .tp-tangram-stage{position:relative}tp-tangram .tp-tangram-selection-tools{z-index:2;background:var(--tp-color-background,#fff);border:1px solid #b8bdbb;border-radius:.5rem;gap:.15rem;padding:.2rem;display:flex;position:absolute;box-shadow:0 2px 8px #0002}tp-tangram .tp-tangram-selection-tools[hidden]{display:none}tp-tangram [data-selected]{stroke:#101820;stroke-width:.08px}tp-tangram [data-action=left] tp-icon{transform:scaleX(-1)}tp-tangram .tp-tangram-orientation{margin:.75rem 0;font-size:.9rem;font-weight:600}tp-tangram [data-piece][data-incorrect]{stroke:#b00020;stroke-width:.12px;stroke-dasharray:.18 .1}", f = [
	"#b84432",
	"#246c94",
	"#ba7b15",
	"#648237",
	"#925599",
	"#187f7c",
	"#b94574"
], p = 0, m = (e) => e.map((e) => ({ ...e })), h = class extends e {
	source = new t(this, { scriptTypes: ["tp/tangram"] });
	target = m(r);
	state = [];
	history = [];
	cursor = 0;
	selected = "large-1";
	hasSelection = !1;
	selectionToolsDismissed = !1;
	resizeObserver;
	showing = !1;
	showingIncorrect = !1;
	revealedPiece = null;
	assistId = `tp-tangram-assist-${++p}`;
	extent = 7;
	viewExtent = 7;
	token = 0;
	abort;
	ui;
	drag;
	static get observedAttributes() {
		return ["src", "exact-orientation"];
	}
	get exactOrientation() {
		return this.hasAttribute("exact-orientation");
	}
	set exactOrientation(e) {
		this.toggleAttribute("exact-orientation", e);
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		this.setAttribute("src", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-tangram-style", d), this.source.capture(), this.ownerDocument.addEventListener("click", this.dismissOutsideSelection, !0), this.ui || (this.ui = document.createElement("div"), this.ui.className = "tp-tangram-ui", this.append(this.ui), this.ui.addEventListener("click", this.handleClick), this.ui.addEventListener("keydown", this.key), this.ui.addEventListener("pointerdown", this.down), this.ui.addEventListener("pointermove", this.move), this.ui.addEventListener("pointerup", this.up), this.ui.addEventListener("pointercancel", this.cancel), this.ui.addEventListener("lostpointercapture", this.cancel), this.ui.addEventListener("focusin", (e) => {
			let t = e.target.getAttribute("data-piece");
			t && (this.selected = t, this.hasSelection = !0, this.selectionToolsDismissed = !1, this.updateButtons());
		})), typeof ResizeObserver < "u" && (this.resizeObserver = new ResizeObserver(() => this.positionSelectionTools()), this.resizeObserver.observe(this.ui)), this.source.observe(() => {
			this.reload();
		}), this.reload();
	}
	disconnectedCallback() {
		this.ownerDocument.removeEventListener("click", this.dismissOutsideSelection, !0), this.token++, this.abort?.abort(), this.source.disconnect(), this.resizeObserver?.disconnect(), this.cancel();
	}
	attributeChangedCallback(e, t, n) {
		t === n || !this.isConnected || !this.ui || (e === "exact-orientation" ? this.state.length && this.reset() : this.reload());
	}
	async reload() {
		let e = ++this.token;
		this.abort?.abort(), this.abort = new AbortController();
		try {
			let t = await this.source.read({ signal: this.abort.signal });
			if (e !== this.token) return;
			this.setSolution(t.trim() ? s(t) : r);
		} catch (t) {
			if (e !== this.token) return;
			this.state.length || this.setSolution(r);
			let n = t instanceof Error ? t.message : String(t);
			this.status(n), this.dispatchEvent(new CustomEvent("tp-tangram-error", {
				bubbles: !0,
				detail: { message: n }
			}));
		}
	}
	setSolution(e) {
		let t = typeof e == "string" ? s(e) : m(e);
		u(t), this.token++, this.abort?.abort(), this.cancel();
		let n = t.flatMap(c), r = n.map((e) => e.x), i = n.map((e) => e.y), a = (Math.min(...r) + Math.max(...r)) / 2, o = (Math.min(...i) + Math.max(...i)) / 2;
		this.target = t.map((e) => ({
			...e,
			x: e.x - a,
			y: e.y - o
		})), this.extent = Math.max(7, Math.max(...r) - Math.min(...r) + 5, Math.max(...i) - Math.min(...i) + 5), this.reset();
	}
	get placements() {
		return m(this.state);
	}
	get isSolved() {
		return l(this.state, this.target);
	}
	get canUndo() {
		return this.cursor > 0;
	}
	get canRedo() {
		return this.cursor < this.history.length - 1;
	}
	reset() {
		this.cancel();
		let e = this.extent - 2;
		this.state = n.map((t, n) => ({
			id: t.id,
			x: Math.cos(n * 2 * Math.PI / 7) * e,
			y: Math.sin(n * 2 * Math.PI / 7) * e,
			angle: this.exactOrientation ? this.target.find((e) => e.id === t.id)?.angle ?? 0 : 0,
			flipped: this.exactOrientation ? this.target.find((e) => e.id === t.id)?.flipped ?? !1 : !1
		})), this.hasSelection = !1, this.viewExtent = this.extent, this.showing = !1, this.showingIncorrect = !1, this.revealedPiece = null, this.history = [m(this.state)], this.cursor = 0, this.render();
	}
	place(e, t, n, r, i) {
		let a = this.state.find((t) => t.id === e);
		if (!a) return !1;
		let s = {
			...a,
			x: t,
			y: n,
			angle: r ?? a.angle,
			flipped: i ?? a.flipped
		};
		return ![
			t,
			n,
			s.angle
		].every(Number.isFinite) || typeof s.flipped != "boolean" ? !1 : this.state.some((t) => t.id !== e && o(s, t)) ? (this.status("Placement refused: this piece overlaps another piece."), !1) : JSON.stringify(a) === JSON.stringify(s) ? !0 : (this.state = this.state.map((t) => t.id === e ? s : t), this.history.splice(this.cursor + 1), this.history.push(m(this.state)), this.cursor++, this.changed(), !0);
	}
	undo() {
		this.cancel(), this.canUndo && (this.state = m(i(this.history, --this.cursor)), this.changed());
	}
	redo() {
		this.cancel(), this.canRedo && (this.state = m(i(this.history, ++this.cursor)), this.changed());
	}
	showSolution(e = !0) {
		this.cancel(), this.showing = e, this.revealedPiece = null, this.render();
	}
	showIncorrectPieces(e = !0) {
		this.cancel(), this.showingIncorrect = e, this.showing = !1, this.revealedPiece = null, this.render();
	}
	clearIncorrectPieces() {
		this.cancel(), this.showing = !1, this.revealedPiece = null, this.showingIncorrect = !1;
		let e = this.state.filter((e) => a(e, this.target));
		if (e.length === this.state.length) {
			this.render();
			return;
		}
		let t = [...e];
		this.state = this.state.map((n, r) => {
			if (e.includes(n)) return n;
			let i = this.extent - 2, a;
			do
				a = {
					...n,
					x: Math.cos(r * 2 * Math.PI / 7) * i,
					y: Math.sin(r * 2 * Math.PI / 7) * i
				}, i += 2;
			while ([...t, ...this.target].some((e) => o(a, e)));
			return t.push(a), a;
		}), this.showingIncorrect = !1, JSON.stringify(this.state) === JSON.stringify(i(this.history, this.cursor)) ? this.render() : (this.history.splice(this.cursor + 1), this.history.push(m(this.state)), this.cursor++, this.changed());
	}
	showPiece() {
		if (this.cancel(), !this.hasSelection) {
			this.status("Select a piece before asking to show it.");
			return;
		}
		this.showing = !1, this.revealedPiece = this.selected, this.render(), this.status("Selected piece shown in the center using the supplied solution.");
	}
	async fullscreen() {
		try {
			document.fullscreenElement === this ? await document.exitFullscreen() : await this.requestFullscreen();
		} catch {
			this.status("Fullscreen is unavailable in this browser or embedding context.");
		}
	}
	changed() {
		this.render(), this.dispatchEvent(new CustomEvent("tp-tangram-change", {
			bubbles: !0,
			detail: {
				placements: this.placements,
				solved: this.isSolved
			}
		}));
	}
	status(e) {
		let t = this.ui?.querySelector("[role=\"status\"]");
		t && (t.textContent = e);
	}
	updateButtons() {
		this.ui?.querySelector("[data-assist=\"piece\"]")?.setAttribute("aria-disabled", String(this.showing || !this.hasSelection));
		for (let e of this.ui?.querySelectorAll("[data-action=\"flip\"]") ?? []) e.toggleAttribute("disabled", this.showing || this.selected !== "parallelogram");
		for (let e of this.ui?.querySelectorAll("[data-piece]") ?? []) e.toggleAttribute("data-selected", this.hasSelection && e.getAttribute("data-piece") === this.selected);
		this.positionSelectionTools();
	}
	dismissOutsideSelection = (e) => {
		let t = e.target;
		t instanceof Element && (this.ui?.contains(t) && t.closest("[data-piece], .tp-tangram-selection-tools") || this.dismissSelectionTools());
	};
	dismissSelectionTools() {
		(this.ui?.querySelector(".tp-tangram-selection-tools"))?.contains(this.ownerDocument.activeElement) && this.ui?.querySelector(`[data-piece="${this.selected}"]`)?.focus({ preventScroll: !0 }), this.selectionToolsDismissed = !0, this.positionSelectionTools();
	}
	positionSelectionTools() {
		let e = this.ui?.querySelector(".tp-tangram-selection-tools"), t = this.ui?.querySelector(".tp-tangram-board"), n = this.state.find((e) => e.id === this.selected);
		if (!e || !t || !n || (e.hidden = this.showing || !this.hasSelection || this.selectionToolsDismissed || !!this.drag, e.hidden)) return;
		let r = t.getBoundingClientRect(), i = Math.min(r.width, r.height) / (2 * this.viewExtent), a = r.width / 2 + n.x * i, o = r.height / 2 + Math.min(...c(n).map((e) => e.y)) * i, s = e.offsetWidth || 132, l = e.offsetHeight || 44;
		e.style.left = `${Math.max(4, Math.min(r.width - s - 4, a - s / 2))}px`, e.style.top = `${Math.max(4, Math.min(r.height - l - 4, o - l - 8))}px`;
	}
	iconButton(e, t, n = !1) {
		return `<tp-icon-button ${e === "help" ? `id="${this.assistId}" aria-haspopup="menu"` : ""} data-action="${e}" name="${{
			undo: "undo",
			redo: "redo",
			left: "rotate-right",
			right: "rotate-right",
			flip: "card-flip",
			help: "help",
			reset: "refresh",
			fullscreen: "fullscreen"
		}[e]}" label="${t}" ${n ? "disabled" : ""}></tp-icon-button>`;
	}
	render() {
		if (!this.ui) return;
		this.viewExtent = Math.max(this.viewExtent, ...this.state.flatMap(c).map((e) => Math.max(Math.abs(e.x), Math.abs(e.y)) + .15));
		let e = this.ui.contains(document.activeElement) ? document.activeElement?.closest("[data-piece],[data-action]") : null, t = e?.dataset.piece, r = e?.dataset.action, i = !!e?.closest(".tp-tangram-selection-tools"), o = [
			[
				"undo",
				"Undo",
				!this.canUndo
			],
			[
				"redo",
				"Redo",
				!this.canRedo
			],
			[
				"left",
				"Rotate −45°",
				this.showing
			],
			[
				"right",
				"Rotate +45°",
				this.showing
			],
			[
				"flip",
				"Flip",
				this.selected !== "parallelogram"
			],
			[
				"help",
				"Tangram assistance",
				!1
			],
			[
				"reset",
				"Restart",
				!1
			],
			[
				"fullscreen",
				"Fullscreen",
				!1
			]
		];
		this.ui.innerHTML = `<div class="tp-tangram-heading"><div class="tp-tangram-title"><strong>Tangram</strong><span>7 pieces · 16 units of area</span></div><tp-button-group aria-label="Tangram controls">${o.map(([e, t, n]) => this.iconButton(e, t, n)).join("")}</tp-button-group></div><tp-dropdown class="tp-tangram-assist" anchor="#${this.assistId}" placement="bottom" outside-click><ul><li data-assist="incorrect">${this.showingIncorrect ? "Hide incorrect pieces" : "Show all incorrect pieces"}</li><li data-assist="clear">Clear the incorrect pieces</li><li data-assist="piece" aria-disabled="${this.showing || !this.hasSelection}">Show the piece</li><li data-assist="solution">${this.showing ? "Hide the solution" : "Show the solution"}</li></ul></tp-dropdown><p class="tp-tangram-hint">${this.showing ? "Solution preview — 7 pieces, each used once. Choose Hide the solution in the help menu to resume your game." : "Drag a piece. Rotate with the buttons or R; flip the parallelogram with F. Arrow keys move the focused piece."}</p><div class="tp-tangram-stage"><svg class="tp-tangram-board" viewBox="${-this.viewExtent} ${-this.viewExtent} ${2 * this.viewExtent} ${2 * this.viewExtent}" role="group" aria-label="Tangram puzzle board"> <g aria-hidden="true" class="tp-tangram-target" data-solution-preview="${this.showing}">${this.target.map((e) => `<polygon points="${this.points(e)}" fill="${this.showing || this.revealedPiece === e.id ? f[n.findIndex((t) => t.id === e.id)] : "#d6d5ce"}" ${this.showing || this.revealedPiece === e.id ? "stroke=\"#fff\" stroke-width=\"0.035\"" : "stroke=\"#d6d5ce\" stroke-width=\"0.008\""}/>`).join("")}</g><g class="tp-tangram-playing-pieces" ${this.showing ? "display=\"none\" aria-hidden=\"true\"" : ""}>${this.state.map((e, t) => `<polygon data-piece="${e.id}" ${this.showingIncorrect && !a(e, this.target) ? "data-incorrect=\"true\"" : ""} tabindex="${this.showing ? -1 : 0}" role="button" aria-label="${e.id}, move with arrow keys, rotate with R" points="${this.points(e)}" fill="${f[t]}" stroke="#fff" stroke-width="0.035"/>`).join("")}</g></svg><div class="tp-tangram-selection-tools" role="group" aria-label="Selected piece controls" hidden>${this.iconButton("left", "Rotate selected piece −45°")}${this.iconButton("right", "Rotate selected piece +45°")}${this.iconButton("flip", "Flip selected piece", this.selected !== "parallelogram")}</div></div>${this.exactOrientation ? "<p class=\"tp-tangram-orientation\">Exact orientation: all seven pieces start with their solution rotation and reflection. They remain freely movable and rotatable.</p>" : ""}<p role="status" aria-live="polite">${this.showing ? "Solution preview: seven pieces, each used once. Hide the solution to resume your unchanged game." : this.isSolved ? "Puzzle completed!" : this.showingIncorrect ? `${this.state.filter((e) => !a(e, this.target)).length} incorrect pieces highlighted.` : "Reproduce the central silhouette. Pieces may touch, but cannot overlap."}</p>`;
		let s = this.ui.querySelector("tp-dropdown");
		s?.addEventListener("click", (e) => {
			let t = e.target.closest("[data-assist]");
			if (!(!t || t.getAttribute("aria-disabled") === "true")) {
				switch (s.hide(), t.dataset.assist) {
					case "incorrect":
						this.showIncorrectPieces(!this.showingIncorrect);
						break;
					case "clear":
						this.clearIncorrectPieces();
						break;
					case "piece":
						this.showPiece();
						break;
					case "solution":
						this.showSolution(!this.showing);
						break;
				}
				this.ui?.querySelector("[data-action=\"help\"] button")?.focus({ preventScroll: !0 });
			}
		}), s?.addEventListener("tp-dropdown-toggle", () => {
			this.ui?.querySelector("[data-action=\"help\"] button")?.setAttribute("aria-expanded", String(s.open));
		}), this.updateButtons(), t ? this.ui.querySelector(`[data-piece="${t}"]`)?.focus({ preventScroll: !0 }) : r && this.ui.querySelector(`${i ? ".tp-tangram-selection-tools" : "tp-button-group"} [data-action="${r}"] button`)?.focus({ preventScroll: !0 });
	}
	points(e) {
		return c(e).map((e) => `${e.x},${e.y}`).join(" ");
	}
	handleClick = (e) => {
		let t = e.target.closest("[data-action]");
		if (!t || t.hasAttribute("disabled")) return;
		this.cancel();
		let n = this.state.find((e) => e.id === this.selected);
		if (n) switch (t.dataset.action) {
			case "undo":
				this.undo();
				break;
			case "redo":
				this.redo();
				break;
			case "left":
				this.place(n.id, n.x, n.y, n.angle - 45);
				break;
			case "right":
				this.place(n.id, n.x, n.y, n.angle + 45);
				break;
			case "flip":
				n.id === "parallelogram" && this.place(n.id, n.x, n.y, n.angle, !n.flipped);
				break;
			case "help":
				this.ui?.querySelector("tp-dropdown")?.toggle();
				break;
			case "reset":
				this.reset();
				break;
			case "fullscreen": this.fullscreen();
		}
	};
	key = (e) => {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
			e.preventDefault(), e.shiftKey ? this.redo() : this.undo();
			return;
		}
		if (e.key === "Escape") {
			this.cancel(), this.dismissSelectionTools();
			return;
		}
		let t = e.target.getAttribute("data-piece"), n = this.state.find((e) => e.id === t);
		if (this.showing || !n || e.ctrlKey || e.metaKey || e.altKey) return;
		let r = e.shiftKey ? .5 : .05, { x: i, y: a, angle: o, flipped: s } = n;
		switch (e.key) {
			case "ArrowLeft":
				i -= r;
				break;
			case "ArrowRight":
				i += r;
				break;
			case "ArrowUp":
				a -= r;
				break;
			case "ArrowDown":
				a += r;
				break;
			case "r":
			case "R":
				o += e.shiftKey ? -45 : 45;
				break;
			case "f":
			case "F":
				if (n.id !== "parallelogram") return;
				s = !s;
				break;
			default: return;
		}
		e.preventDefault(), this.cancel(), this.place(n.id, i, a, o, s);
	};
	position(e, t) {
		let n = t.getScreenCTM();
		return n ? new DOMPoint(e.clientX, e.clientY).matrixTransform(n.inverse()) : null;
	}
	down = (e) => {
		if (this.showing || this.drag || e.button !== 0) return;
		let t = e.target.closest("[data-piece]"), n = t?.ownerSVGElement, r = this.state.find((e) => e.id === t?.dataset.piece);
		if (!r || !n) return;
		let i = this.position(e, n);
		i && (e.preventDefault(), this.selected = r.id, this.hasSelection = !0, this.selectionToolsDismissed = !1, t?.focus({ preventScroll: !0 }), this.updateButtons(), this.drag = {
			id: e.pointerId,
			start: i,
			before: { ...r },
			svg: n
		}, n.setPointerCapture(e.pointerId), this.positionSelectionTools());
	};
	candidate(e) {
		if (!this.drag || e.pointerId !== this.drag.id) return null;
		let t = this.position(e, this.drag.svg);
		return t ? {
			...this.drag.before,
			x: this.drag.before.x + t.x - this.drag.start.x,
			y: this.drag.before.y + t.y - this.drag.start.y
		} : null;
	}
	move = (e) => {
		let t = this.candidate(e);
		if (!t) return;
		let n = this.ui?.querySelector(`[data-piece="${t.id}"]`);
		n?.setAttribute("points", this.points(t)), n?.classList.toggle("invalid", this.state.some((e) => e.id !== t.id && o(t, e)));
	};
	up = (e) => {
		let t = this.candidate(e);
		if (!t) return;
		this.cancel();
		let n = [...this.target, ...this.state.filter((e) => e.id !== t.id)].flatMap(c), r = .18, i = 0, a = 0;
		for (let e of c(t)) for (let t of n) {
			let n = Math.hypot(t.x - e.x, t.y - e.y);
			n < r && (r = n, i = t.x - e.x, a = t.y - e.y);
		}
		let s = {
			...t,
			x: t.x + i,
			y: t.y + a
		}, l = this.state.some((e) => e.id !== t.id && o(s, e)) ? t : s;
		this.place(t.id, l.x, l.y, t.angle, t.flipped);
	};
	cancel = () => {
		let e = this.drag;
		if (!e) return;
		this.drag = void 0, e.svg.hasPointerCapture(e.id) && e.svg.releasePointerCapture(e.id);
		let t = this.ui?.querySelector(`[data-piece="${e.before.id}"]`);
		t?.setAttribute("points", this.points(e.before)), t?.classList.remove("invalid"), this.positionSelectionTools();
	};
};
customElements.get("tp-tangram") || customElements.define("tp-tangram", h);
//#endregion
export { h as t };

//# sourceMappingURL=tangram.js.map