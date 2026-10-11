import { t as e } from "../../chunks/base.js";
//#region src/components/overlay/overlay.ts
var t = class t extends e {
	backdropEl = null;
	instanceId = "";
	lastOpenState = null;
	topLayerEnabled = !1;
	ignoreOutsideClickFor = [];
	handleKeydown = (e) => {
		e.key !== "Escape" || !this.open || this.hide();
	};
	handlePointerDownOutside = (e) => {
		if (!this.open || !this.outsideClick) return;
		let t = e.target;
		t instanceof Node && this.ignoreOutsideClickFor.some((e) => e.contains(t)) || t instanceof Node && (this.isInsideInteractiveBoundary(t) || this.hide());
	};
	get usesTopLayer() {
		return !1;
	}
	get closesOnBackdropClick() {
		return !0;
	}
	get open() {
		return this.hasAttribute("open");
	}
	set open(e) {
		if (e) {
			this.setAttribute("open", "");
			return;
		}
		this.removeAttribute("open");
	}
	get backdrop() {
		return this.hasAttribute("backdrop");
	}
	set backdrop(e) {
		if (e) {
			this.setAttribute("backdrop", "");
			return;
		}
		this.removeAttribute("backdrop");
	}
	get outsideClick() {
		return this.hasAttribute("outside-click");
	}
	set outsideClick(e) {
		if (e) {
			this.setAttribute("outside-click", "");
			return;
		}
		this.removeAttribute("outside-click");
	}
	connectedCallback() {
		super.connectedCallback(), this.setupTopLayer(), this.ensureOverlayInstanceId(), this.ensureBackdrop(), this.updateOverlayState(), document.addEventListener("keydown", this.handleKeydown), document.addEventListener("pointerdown", this.handlePointerDownOutside);
	}
	disconnectedCallback() {
		this.hideFromTopLayer(), document.removeEventListener("keydown", this.handleKeydown), document.removeEventListener("pointerdown", this.handlePointerDownOutside), this.removeBackdrop();
	}
	show() {
		this.open = !0;
	}
	hide() {
		this.open = !1;
	}
	toggle() {
		this.open = !this.open;
	}
	isInsideInteractiveBoundary(e) {
		return this.contains(e);
	}
	afterOverlayUpdate() {}
	updateOverlayState() {
		this.syncTopLayer(), this.setAttribute("data-open", String(this.open)), this.ensureBackdrop(), this.updateBackdrop(), this.dispatchToggleEventIfNeeded(), this.afterOverlayUpdate();
	}
	setupTopLayer() {
		!this.usesTopLayer || typeof this.showPopover != "function" || (this.setAttribute("popover", "manual"), this.topLayerEnabled = !0);
	}
	syncTopLayer() {
		if (!this.usesTopLayer && this.topLayerEnabled ? (this.hideFromTopLayer(), this.removeAttribute("popover"), this.topLayerEnabled = !1) : this.usesTopLayer && !this.topLayerEnabled && this.setupTopLayer(), this.topLayerEnabled) {
			if (this.open) {
				try {
					this.showPopover();
				} catch {}
				return;
			}
			this.hideFromTopLayer();
		}
	}
	hideFromTopLayer() {
		if (!(!this.topLayerEnabled || typeof this.hidePopover != "function")) try {
			this.hidePopover();
		} catch {}
	}
	ensureOverlayInstanceId() {
		this.instanceId === "" && (t.instanceCount += 1, this.instanceId = `${this.overlayName}-${String(t.instanceCount)}`, this.setAttribute(`data-${this.overlayName}-id`, this.instanceId));
	}
	ensureBackdrop() {
		if (!this.backdrop) {
			this.removeBackdrop();
			return;
		}
		if (this.backdropEl !== null) return;
		let e = document.createElement(this.backdropTagName);
		e.setAttribute("data-owner", this.instanceId), e.addEventListener("click", () => {
			this.closesOnBackdropClick && this.hide();
		}), this.getBackdropParent()?.append(e), this.backdropEl = e;
	}
	removeBackdrop() {
		this.backdropEl?.remove(), this.backdropEl = null;
	}
	updateBackdrop() {
		if (this.backdropEl === null) {
			this.removeAttribute("data-has-backdrop");
			return;
		}
		this.setAttribute("data-has-backdrop", "true"), this.backdropEl.setAttribute("data-open", String(this.open)), this.backdropEl.setAttribute("data-contained", String(this.isBackdropContained()));
		let e = this.getBackdropParent();
		e !== null && this.backdropEl.parentElement !== e && e.append(this.backdropEl);
	}
	dispatchToggleEventIfNeeded() {
		this.lastOpenState !== this.open && (this.lastOpenState = this.open, this.dispatchEvent(new CustomEvent(this.toggleEventName, {
			bubbles: !0,
			detail: {
				backdrop: this.backdrop,
				open: this.open,
				outsideClick: this.outsideClick,
				...this.getToggleEventDetail()
			}
		})));
	}
	static instanceCount = 0;
};
//#endregion
export { t as TpOverlayElement };

//# sourceMappingURL=overlay.js.map