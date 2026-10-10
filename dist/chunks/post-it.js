import { Zu as e } from "./lib/typescript/typescript.js";
import "./box.js";
import { t } from "./color.js";
//#region src/components/post-it/post-it.css?inline
var n = "tp-post-it{inline-size:var(--tp-post-it-width,20rem);min-inline-size:0;max-inline-size:100%;display:flow-root}tp-post-it[hidden]{display:none}tp-post-it[data-post-it-floating]{inset:auto;left:var(--tp-post-it-x,8px);top:var(--tp-post-it-y,8px);max-inline-size:calc(100vw - 16px);z-index:var(--tp-z-index-toast,1100);background:0 0;border:0;margin:0;padding:0;position:fixed;overflow:visible}tp-post-it::backdrop{pointer-events:none;background:0 0}tp-post-it>[data-post-it-paper]{--tp-box-background:var(--tp-brand-fill-soft);--tp-box-color:var(--tp-brand-text-on-soft);--tp-box-border-width:0;--tp-box-padding:var(--tp-post-it-padding,.75rem);box-shadow:var(--tp-shadow-mid);transform:rotate(var(--tp-post-it-rotation,0deg));transform-origin:top;overflow-wrap:anywhere;position:relative}@keyframes tp-post-it-open{0%{transform:rotate(0)}to{transform:rotate(var(--tp-post-it-rotation,0deg))}}tp-post-it:not([lite])>[data-post-it-paper]{animation:1s ease-in-out tp-post-it-open}@media (prefers-reduced-motion:reduce){tp-post-it:not([lite])>[data-post-it-paper]{animation:none}}tp-post-it>[data-post-it-paper]:after{content:\"\";background:var(--tp-brand-fill-loud);clip-path:polygon(100% 0,100% 100%,0 100%);pointer-events:none;block-size:1rem;inline-size:1rem;position:absolute;inset-block-end:0;inset-inline-end:0}tp-post-it [data-post-it-header]{align-items:start;gap:var(--tp-space-xs,.5rem);margin-block-end:var(--tp-space-xs,.5rem);display:flex}tp-post-it:not([lite]) [data-post-it-header]{border-block-end:1px solid var(--tp-brand-stroke-soft,currentColor);padding-block-end:var(--tp-space-xs,.5rem)}tp-post-it [data-post-it-header]:focus-visible{outline:2px solid var(--tp-brand-stroke-loud,currentColor);outline-offset:2px}tp-post-it [data-post-it-heading][hidden],tp-post-it [data-post-it-reset][hidden],tp-post-it [data-post-it-content][hidden]{display:none}tp-post-it [data-post-it-heading]{min-inline-size:0}tp-post-it [data-post-it-reset]{margin-inline-start:auto}tp-post-it [data-post-it-pin],tp-post-it [data-post-it-reset]{flex:none}tp-post-it:not([lite]) [data-post-it-header],tp-post-it[lite] [data-post-it-pin]{touch-action:none;-webkit-user-select:none;user-select:none;flex:none}tp-post-it:not([lite]) [data-post-it-header],tp-post-it[lite] [data-post-it-pin] button{cursor:grab;touch-action:none}tp-post-it[data-post-it-dragging] [data-post-it-header],tp-post-it[lite][data-post-it-dragging] [data-post-it-pin] button{cursor:grabbing}tp-post-it [data-post-it-content]{max-block-size:max(3rem,100dvh - 9rem);display:flow-root;overflow:auto}tp-post-it [data-post-it-content]>:first-child{margin-block-start:0}tp-post-it [data-post-it-content]>:last-child{margin-block-end:0}tp-post-it[lite]{inline-size:fit-content}tp-post-it[lite] [data-post-it-pin]{font-size:2em}tp-post-it[lite]>[data-post-it-paper]{--tp-box-padding:0px;--tp-box-background:transparent;--tp-box-color:var(--tp-brand-text-colorful);box-shadow:none;transform:none}tp-post-it[lite]>[data-post-it-paper]:after{display:none}tp-post-it[lite] [data-post-it-header]{margin:0}@media (forced-colors:active){tp-post-it:not([lite])>[data-post-it-paper]{border:1px solid canvastext}}", r = t.presets.map((e) => e.slice(3)), i = class t extends e {
	static colors = r;
	get attachment() {
		return this.anchor ? { ...this.anchor } : null;
	}
	attachTo(e, t, n, r = !1) {
		!Number.isFinite(t) || !Number.isFinite(n) || e.ownerDocument !== this.ownerDocument || (this.float(), this.anchor = {
			element: e,
			x: t,
			y: n
		}, r && (this.initialAnchor = { ...this.anchor }), this.followAnchor());
	}
	static nextId = 0;
	contentId = `tp-post-it-content-${++t.nextId}`;
	position = null;
	initialPosition = null;
	anchor = null;
	initialAnchor = null;
	layoutFrame = null;
	scrollOffset = {
		x: 0,
		y: 0
	};
	floatingTimer = null;
	suppressPinClick = !1;
	drag = null;
	paper = null;
	content = null;
	observer = new MutationObserver(() => this.arrange());
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"color",
			"heading",
			"lite",
			"opacity",
			"rotation"
		];
	}
	get color() {
		let e = this.getAttribute("color") ?? "yellow";
		return r.find((t) => t === e) ?? "yellow";
	}
	set color(e) {
		this.setAttribute("color", e);
	}
	get heading() {
		return this.getAttribute("heading") ?? "";
	}
	set heading(e) {
		this.setAttribute("heading", e);
	}
	get lite() {
		return this.hasAttribute("lite");
	}
	set lite(e) {
		this.toggleAttribute("lite", e);
	}
	get opacity() {
		let e = this.getAttribute("opacity"), t = e?.trim() ? Number(e) : 1;
		return Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 1;
	}
	set opacity(e) {
		this.setAttribute("opacity", String(e));
	}
	get rotation() {
		let e = Number(this.getAttribute("rotation") ?? 0);
		return Number.isFinite(e) ? Math.max(-12, Math.min(12, e)) : 0;
	}
	set rotation(e) {
		this.setAttribute("rotation", String(e));
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-post-it-styles", n), this.hasAttribute("role") || this.setAttribute("role", "note"), this.arrange(), this.observer.observe(this, { childList: !0 }), this.scrollOffset = this.getScrollOffset(), this.ownerDocument.defaultView?.addEventListener("scroll", this.followScroll, !0), this.ownerDocument.defaultView?.addEventListener("resize", this.keepVisible), this.floatingTimer = setTimeout(() => {
			this.floatingTimer = null, this.float();
		}, 0);
	}
	disconnectedCallback() {
		this.observer.disconnect(), this.floatingTimer !== null && clearTimeout(this.floatingTimer), this.floatingTimer = null, this.finishDrag(), this.layoutFrame !== null && this.ownerDocument.defaultView?.cancelAnimationFrame(this.layoutFrame), this.layoutFrame = null, this.ownerDocument.defaultView?.removeEventListener("scroll", this.followScroll, !0), this.ownerDocument.defaultView?.removeEventListener("resize", this.keepVisible);
	}
	attributeChangedCallback(e) {
		this.isConnected && [
			"color",
			"heading",
			"lite",
			"opacity",
			"rotation"
		].includes(e) && this.update();
	}
	arrange() {
		if (!this.paper || this.paper.parentElement !== this) {
			this.paper = this.ownerDocument.createElement("tp-box"), this.paper.setAttribute("data-post-it-paper", ""), this.paper.innerHTML = "<div data-post-it-header tabindex=\"0\" role=\"group\" aria-label=\"Move note with arrow keys\"><tp-icon-button data-post-it-pin name=\"pin\" library=\"components\" label=\"Fold note\"></tp-icon-button><strong data-post-it-heading></strong><tp-icon-button data-post-it-reset name=\"refresh\" label=\"Reset position\"></tp-icon-button></div><div data-post-it-content></div>", this.paper.querySelector("[data-post-it-reset]")?.addEventListener("click", () => this.resetPosition());
			let e = this.paper.querySelector("[data-post-it-header]");
			e?.addEventListener("pointerdown", this.startDrag), e?.addEventListener("keydown", this.moveWithKeyboard), this.content = this.paper.querySelector("[data-post-it-content]"), this.content && (this.content.id = this.contentId);
			let t = this.paper.querySelector("[data-post-it-pin]");
			t?.addEventListener("pointerdown", this.startDrag), t?.addEventListener("keydown", this.moveWithKeyboard), t?.addEventListener("click", (e) => {
				if (this.suppressPinClick && e.detail !== 0) {
					this.suppressPinClick = !1, e.preventDefault();
					return;
				}
				this.toggle();
			}), this.append(this.paper);
		}
		Array.from(this.childNodes).forEach((e) => {
			e !== this.paper && this.content?.append(e);
		}), this.update();
	}
	update() {
		if (!this.paper) return;
		this.paper.style.opacity = String(this.opacity), this.paper.classList.remove(...r.map((e) => `tp-${e}`)), this.paper.classList.add(`tp-${this.color}`), this.paper.style.setProperty("--tp-post-it-rotation", `${this.rotation}deg`);
		let e = this.paper.querySelector("[data-post-it-heading]");
		e && (e.textContent = this.heading, e.hidden = this.lite || !this.heading.trim());
		let t = this.paper.querySelector("[data-post-it-pin]");
		t?.setAttribute("label", `${this.lite ? "Open" : "Fold"} note${this.heading.trim() ? `: ${this.heading}` : ""}`);
		let n = t?.querySelector("button");
		this.paper.querySelectorAll("[data-post-it-reset]").forEach((e) => {
			this.lite && e.contains(this.ownerDocument.activeElement) && n?.focus(), e.hidden = this.lite;
		});
		let i = this.paper.querySelector("[data-post-it-header]");
		i && (i.tabIndex = this.lite ? -1 : 0), this.lite && this.ownerDocument.activeElement === i && n?.focus(), this.lite && this.drag?.handle.hasAttribute("data-post-it-header") && this.finishDrag(!0), n?.setAttribute("aria-expanded", String(!this.lite)), n?.setAttribute("aria-controls", this.contentId), this.content && (this.lite && this.content.contains(this.ownerDocument.activeElement) && n?.focus(), this.content.hidden = this.lite), this.keepVisible();
	}
	float() {
		if (!this.isConnected) return;
		this.ownerDocument.querySelectorAll("tp-post-it").forEach((e) => {
			let t = e.getBoundingClientRect();
			if (!e.initialPosition) {
				let n = e.getScrollOffset();
				e.initialPosition = {
					x: t.left + n.x,
					y: t.top + n.y
				};
			}
			e.position ||= {
				x: t.left,
				y: t.top
			};
		});
		let e = this.getBoundingClientRect(), t = this.position ?? {
			x: e.left,
			y: e.top
		};
		this.setAttribute("data-post-it-floating", ""), typeof this.showPopover == "function" && (this.setAttribute("popover", "manual"), this.showPopover()), this.position = t, this.keepVisible(), this.anchor || (this.attach(this.parentElement), this.initialAnchor ??= this.anchor), this.layoutFrame === null && this.trackLayout();
	}
	attach(e = null) {
		let t = this.querySelector("[data-post-it-pin]")?.getBoundingClientRect();
		if (!t?.width || !t.height) return;
		let n = t.left + t.width / 2, r = t.top + t.height / 2, i = e ?? this.ownerDocument.elementsFromPoint(n, r).find((e) => !e.closest("tp-post-it"));
		if (!i) return;
		let a = i.getBoundingClientRect();
		!a.width || !a.height || (this.anchor = {
			element: i,
			x: n - a.left,
			y: r - a.top
		});
	}
	followAnchor() {
		if (!this.anchor || this.drag || !this.position) return;
		if (!this.anchor.element.isConnected) {
			this.anchor = null;
			return;
		}
		let e = this.anchor.element.getBoundingClientRect(), t = this.querySelector("[data-post-it-pin]")?.getBoundingClientRect();
		if (!t || !e.width || !t.width) return;
		let n = this.getBoundingClientRect(), r = this.ownerDocument.defaultView?.innerWidth ?? n.right, i = this.position.x + e.left + this.anchor.x - (t.left + t.width / 2), a = Math.max(8, Math.min(i, r - n.width - 8)) - this.position.x, o = e.top + this.anchor.y - (t.top + t.height / 2);
		Math.abs(a) < .01 && Math.abs(o) < .01 || (this.position.x += a, this.position.y += o, this.keepVisible());
	}
	trackLayout = () => {
		if (!this.isConnected) {
			this.layoutFrame = null;
			return;
		}
		this.followAnchor(), this.layoutFrame = this.ownerDocument.defaultView?.requestAnimationFrame(this.trackLayout) ?? null;
	};
	resetPosition() {
		this.initialPosition || this.float(), this.initialPosition && (this.finishDrag(), this.scrollOffset = this.getScrollOffset(), this.position = {
			x: this.initialPosition.x - this.scrollOffset.x,
			y: this.initialPosition.y - this.scrollOffset.y
		}, this.keepVisible(), this.anchor = this.initialAnchor, this.followAnchor(), this.dispatchEvent(new CustomEvent("tp-post-it-move", { bubbles: !0 })));
	}
	moveTo(e, t) {
		if (!Number.isFinite(e) || !Number.isFinite(t)) return;
		let n = this.ownerDocument.defaultView;
		if (!n) return;
		let r = this.getBoundingClientRect();
		this.position = {
			x: Math.max(8, Math.min(e, n.innerWidth - r.width - 8)),
			y: Math.max(8, Math.min(t, n.innerHeight - r.height - 8))
		}, this.keepVisible(), this.drag || this.attach();
	}
	keepVisible = () => {
		this.position && (this.style.setProperty("--tp-post-it-x", `${this.position.x}px`), this.style.setProperty("--tp-post-it-y", `${this.position.y}px`));
	};
	getScrollOffset() {
		let e = this.ownerDocument.defaultView, t = {
			x: e?.scrollX ?? 0,
			y: e?.scrollY ?? 0
		}, n = this.parentElement;
		for (; n;) n !== this.ownerDocument.scrollingElement && (t.x += n.scrollLeft, t.y += n.scrollTop), n = n.parentElement;
		return t;
	}
	followScroll = () => {
		let e = this.getScrollOffset(), t = this.scrollOffset.x - e.x, n = this.scrollOffset.y - e.y;
		if (this.scrollOffset = e, this.anchor && !this.drag) {
			this.followAnchor();
			return;
		}
		this.position && (this.position.x += t, this.position.y += n, this.drag && (this.drag.x += t, this.drag.y += n), this.keepVisible());
	};
	startDrag = (e) => {
		let t = e.currentTarget;
		if (!(t instanceof HTMLElement) || e.button !== 0 || this.drag) return;
		let n = t.hasAttribute("data-post-it-pin");
		!n && e.target instanceof Element && e.target.closest("tp-icon-button, button, a, input") || (this.suppressPinClick = !1, this.lite === n && (e.preventDefault(), typeof this.hidePopover == "function" && this.matches(":popover-open") && this.hidePopover(), this.float(), this.position && (n ? t.querySelector("button")?.focus() : t.focus(), this.drag = {
			id: e.pointerId,
			clientX: e.clientX,
			clientY: e.clientY,
			...this.position,
			handle: t,
			moved: !1
		}, t.setPointerCapture?.(e.pointerId), this.setAttribute("data-post-it-dragging", ""), this.ownerDocument.addEventListener("pointermove", this.moveDrag), this.ownerDocument.addEventListener("pointerup", this.endDrag), this.ownerDocument.addEventListener("pointercancel", this.cancelDrag), this.ownerDocument.addEventListener("keydown", this.cancelWithEscape), this.ownerDocument.defaultView?.addEventListener("blur", this.cancelOnBlur))));
	};
	moveDrag = (e) => {
		!this.drag || e.pointerId !== this.drag.id || !this.drag.moved && this.drag.handle.hasAttribute("data-post-it-pin") && Math.hypot(e.clientX - this.drag.clientX, e.clientY - this.drag.clientY) < 4 || (this.drag.moved = !0, this.moveTo(this.drag.x + e.clientX - this.drag.clientX, this.drag.y + e.clientY - this.drag.clientY));
	};
	endDrag = (e) => {
		e.pointerId === this.drag?.id && this.finishDrag();
	};
	cancelDrag = (e) => {
		e.pointerId === this.drag?.id && this.finishDrag(!0);
	};
	cancelWithEscape = (e) => {
		e.key === "Escape" && (e.preventDefault(), this.finishDrag(!0));
	};
	cancelOnBlur = () => this.finishDrag(!0);
	finishDrag(e = !1) {
		let t = this.drag;
		this.drag = null, t && (t.handle.hasAttribute("data-post-it-pin") && (this.suppressPinClick = t.moved || e), e && (this.position = {
			x: t.x,
			y: t.y
		}, this.keepVisible()), t.handle.hasPointerCapture?.(t.id) && t.handle.releasePointerCapture(t.id), !e && t.moved && this.isConnected && (this.attach(), this.dispatchEvent(new CustomEvent("tp-post-it-move", { bubbles: !0 })))), this.removeAttribute("data-post-it-dragging"), this.ownerDocument.removeEventListener("pointermove", this.moveDrag), this.ownerDocument.removeEventListener("pointerup", this.endDrag), this.ownerDocument.removeEventListener("pointercancel", this.cancelDrag), this.ownerDocument.removeEventListener("keydown", this.cancelWithEscape), this.ownerDocument.defaultView?.removeEventListener("blur", this.cancelOnBlur);
	}
	moveWithKeyboard = (e) => {
		let t = e.currentTarget;
		if (t instanceof HTMLElement && t.hasAttribute("data-post-it-header") && e.target !== t || !(t instanceof HTMLElement) || this.lite !== t.hasAttribute("data-post-it-pin")) return;
		let n = {
			ArrowLeft: [-1, 0],
			ArrowRight: [1, 0],
			ArrowUp: [0, -1],
			ArrowDown: [0, 1]
		}[e.key];
		if (!n || e.altKey || e.ctrlKey || e.metaKey || (e.preventDefault(), this.float(), !this.position)) return;
		let r = e.shiftKey ? 1 : 10;
		this.moveTo(this.position.x + n[0] * r, this.position.y + n[1] * r), this.dispatchEvent(new CustomEvent("tp-post-it-move", { bubbles: !0 }));
	};
	toggle() {
		this.lite = !this.lite, this.dispatchEvent(new CustomEvent("tp-post-it-toggle", {
			bubbles: !0,
			detail: { lite: this.lite }
		}));
	}
};
customElements.get("tp-post-it") || customElements.define("tp-post-it", i);
//#endregion
export { i as t };

//# sourceMappingURL=post-it.js.map