/**
 * Base commune pour les composants d’overlay comme `<tp-modal>`, superpositions
 * `<tp-drawer>` et `<tp-popover>`.
 */
import { TpBase } from "../base/base.js";

export abstract class TpOverlayElement extends TpBase {
	private backdropEl: HTMLElement | null = null;
	private instanceId = "";
	private lastOpenState: boolean | null = null;
	private topLayerEnabled = false;
	public ignoreOutsideClickFor: HTMLElement[] = [];
	private readonly handleKeydown = (event: KeyboardEvent): void => {
		if (event.key !== "Escape" || !this.open) {
			return;
		}

		this.hide();
	};

	protected readonly handlePointerDownOutside = (event: PointerEvent): void => {
		if (!this.open || !this.outsideClick) {
			return;
		}

		const target = event.target;

		if (
			target instanceof Node &&
			this.ignoreOutsideClickFor.some((element) => element.contains(target))
		) {
			return;
		}
		if (!(target instanceof Node)) {
			return;
		}

		if (this.isInsideInteractiveBoundary(target)) {
			return;
		}

		this.hide();
	};

	/**
	 * Préfixe utilisé pour générer l’identifiant d’instance.
	 * Exemple : `tp-modal`, `tp-drawer`, `tp-popover`.
	 */
	protected abstract readonly overlayName: string;

	/**
	 * Nom du custom element backdrop.
	 * Exemple : `tp-modal-backdrop`, `tp-drawer-backdrop`.
	 */
	protected abstract readonly backdropTagName: string;

	/**
	 * Nom de l’événement émis quand l’état change.
	 * Exemple : `tp-modal-toggle`, `tp-drawer-toggle`.
	 */
	protected abstract readonly toggleEventName: string;

	/**
	 * Allows a floating overlay to escape clipping ancestors by using the
	 * browser top layer. Modal-like overlays keep their existing behaviour and
	 * anchored overlays opt in explicitly.
	 */
	protected get usesTopLayer(): boolean {
		return false;
	}

	/** Whether clicking the backdrop dismisses this overlay. */
	protected get closesOnBackdropClick(): boolean {
		return true;
	}

	/**
	 * Indique si l’overlay est ouvert.
	 */
	public get open(): boolean {
		return this.hasAttribute("open");
	}

	public set open(value: boolean) {
		if (value) {
			this.setAttribute("open", "");
			return;
		}

		this.removeAttribute("open");
	}

	/**
	 * Active l’overlay visuel derrière le composant.
	 */
	public get backdrop(): boolean {
		return this.hasAttribute("backdrop");
	}

	public set backdrop(value: boolean) {
		if (value) {
			this.setAttribute("backdrop", "");
			return;
		}

		this.removeAttribute("backdrop");
	}

	/**
	 * Active la fermeture au clic extérieur.
	 */
	public get outsideClick(): boolean {
		return this.hasAttribute("outside-click");
	}

	public set outsideClick(value: boolean) {
		if (value) {
			this.setAttribute("outside-click", "");
			return;
		}

		this.removeAttribute("outside-click");
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this.setupTopLayer();
		this.ensureOverlayInstanceId();
		this.ensureBackdrop();
		this.updateOverlayState();
		document.addEventListener("keydown", this.handleKeydown);
		document.addEventListener("pointerdown", this.handlePointerDownOutside);
	}

	public disconnectedCallback(): void {
		this.hideFromTopLayer();
		document.removeEventListener("keydown", this.handleKeydown);
		document.removeEventListener("pointerdown", this.handlePointerDownOutside);
		this.removeBackdrop();
	}

	/**
	 * Ouvre l’overlay.
	 */
	public show(): void {
		this.open = true;
	}

	/**
	 * Ferme l’overlay.
	 */
	public hide(): void {
		this.open = false;
	}

	public toggle(): void {
		this.open = !this.open;
	}

	/**
	 * Retourne le parent dans lequel le backdrop doit être inséré.
	 */
	protected abstract getBackdropParent(): HTMLElement | null;

	/**
	 * Retourne si le backdrop doit être considéré comme "contained".
	 */
	protected abstract isBackdropContained(): boolean;

	/**
	 * Retourne les données spécifiques à inclure dans l’événement toggle.
	 */
	protected abstract getToggleEventDetail(): Record<string, unknown>;

	/**
	 * Permet aux sous-classes d’élargir la zone considérée comme "interne".
	 *
	 * Par défaut, seul le composant lui-même est considéré comme interne.
	 * Exemple : un popover peut y ajouter son ancre.
	 */
	protected isInsideInteractiveBoundary(target: Node): boolean {
		return this.contains(target);
	}

	/**
	 * Hook appelé après mise à jour de l’état commun.
	 */
	protected afterOverlayUpdate(): void {
		// surcharge optionnelle
	}

	/**
	 * Met à jour toute la logique commune de l’overlay.
	 */
	protected updateOverlayState(): void {
		this.syncTopLayer();
		this.setAttribute("data-open", String(this.open));
		this.ensureBackdrop();
		this.updateBackdrop();
		this.dispatchToggleEventIfNeeded();
		this.afterOverlayUpdate();
	}

	private setupTopLayer(): void {
		if (!this.usesTopLayer || typeof this.showPopover !== "function") {
			return;
		}

		this.setAttribute("popover", "manual");
		this.topLayerEnabled = true;
	}

	private syncTopLayer(): void {
		if (!this.usesTopLayer && this.topLayerEnabled) {
			this.hideFromTopLayer();
			this.removeAttribute("popover");
			this.topLayerEnabled = false;
		} else if (this.usesTopLayer && !this.topLayerEnabled) {
			this.setupTopLayer();
		}
		if (!this.topLayerEnabled) {
			return;
		}

		if (this.open) {
			try {
				this.showPopover();
			} catch {
				// The element may already be open or may not yet be renderable.
			}
			return;
		}

		this.hideFromTopLayer();
	}

	private hideFromTopLayer(): void {
		if (!this.topLayerEnabled || typeof this.hidePopover !== "function") {
			return;
		}

		try {
			this.hidePopover();
		} catch {
			// The element may already be closed or disconnected.
		}
	}

	private ensureOverlayInstanceId(): void {
		if (this.instanceId !== "") {
			return;
		}

		TpOverlayElement.instanceCount += 1;
		this.instanceId = `${this.overlayName}-${String(TpOverlayElement.instanceCount)}`;
		this.setAttribute(`data-${this.overlayName}-id`, this.instanceId);
	}

	private ensureBackdrop(): void {
		if (!this.backdrop) {
			this.removeBackdrop();
			return;
		}

		if (this.backdropEl !== null) {
			return;
		}

		const backdrop = document.createElement(this.backdropTagName);
		backdrop.setAttribute("data-owner", this.instanceId);
		backdrop.addEventListener("click", () => {
			if (this.closesOnBackdropClick) this.hide();
		});

		const parent = this.getBackdropParent();
		parent?.append(backdrop);

		this.backdropEl = backdrop;
	}

	private removeBackdrop(): void {
		this.backdropEl?.remove();
		this.backdropEl = null;
	}

	private updateBackdrop(): void {
		if (this.backdropEl === null) {
			this.removeAttribute("data-has-backdrop");
			return;
		}

		this.setAttribute("data-has-backdrop", "true");
		this.backdropEl.setAttribute("data-open", String(this.open));
		this.backdropEl.setAttribute(
			"data-contained",
			String(this.isBackdropContained()),
		);

		const expectedParent = this.getBackdropParent();
		if (
			expectedParent !== null &&
			this.backdropEl.parentElement !== expectedParent
		) {
			expectedParent.append(this.backdropEl);
		}
	}

	private dispatchToggleEventIfNeeded(): void {
		if (this.lastOpenState === this.open) {
			return;
		}

		this.lastOpenState = this.open;

		this.dispatchEvent(
			new CustomEvent(this.toggleEventName, {
				bubbles: true,
				detail: {
					backdrop: this.backdrop,
					open: this.open,
					outsideClick: this.outsideClick,
					...this.getToggleEventDetail(),
				},
			}),
		);
	}

	private static instanceCount = 0;
}
