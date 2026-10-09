/**
 * @module components/contextmenu
 * @summary Accessible context menu built from a nested list.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./contextmenu.css?inline";

/**
 * Détail de sélection d’une action de menu contextuel.
 *
 * @summary Représente l’action choisie dans le menu.
 */
export interface TpContextmenuSelectDetail {
	/**
	 * Action déclarée sur l’item via `data-action`.
	 */
	action: string;

	/**
	 * Item de menu sélectionné.
	 */
	item: HTMLLIElement;

	/**
	 * Texte lisible de l’item.
	 */
	label: string;
}

/**
 * Compteur global d’instances.
 *
 * @summary Sert à générer des identifiants uniques de menu.
 * @internal
 */
let instanceCount = 0;

/**
 * `<tp-contextmenu>` affiche un menu contextuel positionné à l’écran.
 *
 * Le composant :
 * - peut être lié à un élément d’ancrage via `anchor`
 * - intercepte le clic droit sur cet ancrage
 * - peut aussi être ouvert manuellement avec `showAt(x, y)`
 * - gère les sous-menus à partir de listes `<ul>` imbriquées
 * - fournit une navigation clavier simple
 * - émet `tp-contextmenu-select` quand un item terminal avec `data-action` est activé
 *
 * Exemple :
 *
 * ```html
 * <button id="target">Open menu</button>
 *
 * <tp-contextmenu anchor="#target">
 *   <ul>
 *     <li data-action="rename">Rename</li>
 *     <li data-action="delete">Delete</li>
 *     <li>
 *       More
 *       <ul>
 *         <li data-action="duplicate">Duplicate</li>
 *       </ul>
 *     </li>
 *   </ul>
 * </tp-contextmenu>
 * ```
 *
 * Attributs réactifs :
 * - `anchor`
 * - `open`
 *
 * @summary Affiche un menu contextuel accessible et réutilisable.
 * @tagname tp-contextmenu
 *
 * @attr {string} anchor = "" - Sélecteur CSS de l’élément servant d’ancrage au clic droit.
 * @attr {boolean} open = false - Ouvre ou ferme le menu.
 *
 *
 * @event tp-contextmenu-select Émis quand un item terminal portant `data-action` est sélectionné.
 * @eventdetail tp-contextmenu-select { action: string; item: HTMLLIElement; label: string }
 *
 * @cssprop --tp-contextmenu-background Background color of the menu and submenus.
 * @cssprop --tp-contextmenu-foreground Text color of the menu.
 * @cssprop --tp-contextmenu-border-color Border color of the menu and dividers.
 * @cssprop --tp-contextmenu-shadow-1 Primary menu shadow color.
 * @cssprop --tp-contextmenu-shadow-2 Secondary menu shadow color.
 * @cssprop --tp-contextmenu-hover Hover background color for menu items.
 * @cssprop --tp-contextmenu-radius Menu and submenu border radius.
 * @cssprop --tp-contextmenu-submenu-offset Inline offset used to position submenus.
 * @cssprop --tp-contextmenu-min-inline-size Minimum inline size of menus.
 * @cssprop --tp-contextmenu-padding Padding around menus.
 * @cssprop --tp-contextmenu-item-padding-block Block padding for menu items.
 * @cssprop --tp-contextmenu-item-padding-inline Inline padding for menu items.
 * @cssprop --tp-contextmenu-z-index Stacking level of the context menu.
 * @example
 * <tp-button id="intro-contextmenu-trigger" data-demo-trigger>Right-click this button</tp-button>
 * <tp-contextmenu anchor="#intro-contextmenu-trigger" outside-click>
 * <ul>
 * <li>Item 1</li>
 * <li>Item 2</li>
 * <li>Item 3</li>
 * </ul>
 * </tp-contextmenu>
 */
export class TpContextmenu extends TpBase {
	/**
	 * Identifiant de la feuille de styles globale injectée une seule fois.
	 *
	 * @summary Identifiant du style global du composant.
	 * @internal
	 */
	private static readonly contextmenuStyleId = "tp-contextmenu-styles";

	/**
	 * Élément actuellement lié comme ancrage.
	 *
	 * @summary Référence vers l’élément d’ancrage.
	 * @internal
	 */
	private anchorEl: HTMLElement | null = null;

	/**
	 * Identifiant unique de l’instance.
	 *
	 * @summary Identifiant logique du menu.
	 * @internal
	 */
	private instanceId = "";

	/**
	 * Dernière position X connue du pointeur.
	 *
	 * @summary Dernière position horizontale utilisée pour ouvrir le menu.
	 * @internal
	 */
	private lastPointerX = 0;

	/**
	 * Dernière position Y connue du pointeur.
	 *
	 * @summary Dernière position verticale utilisée pour ouvrir le menu.
	 * @internal
	 */
	private lastPointerY = 0;

	/**
	 * Réagit au clic droit sur l’élément d’ancrage.
	 *
	 * @summary Ouvre le menu à la position du pointeur.
	 * @param event Événement de menu contextuel natif.
	 * @internal
	 */
	private readonly handleAnchorContextmenu = (event: MouseEvent): void => {
		event.preventDefault();
		this.lastPointerX = event.clientX;
		this.lastPointerY = event.clientY;
		this.showAt(this.lastPointerX, this.lastPointerY);
	};

	/**
	 * Réagit aux clics ou pressions en dehors du menu.
	 *
	 * @summary Ferme le menu lors d’une interaction extérieure.
	 * @param event Événement pointeur document.
	 * @internal
	 */
	private readonly handleDocumentPointerDown = (event: PointerEvent): void => {
		if (!this.open) {
			return;
		}

		const target = event.target;
		if (!(target instanceof Node)) {
			return;
		}

		if (this.contains(target)) {
			return;
		}

		this.hide();
	};

	/**
	 * Réagit aux touches clavier globales.
	 *
	 * @summary Ferme le menu avec `Escape`.
	 * @param event Événement clavier document.
	 * @internal
	 */
	private readonly handleDocumentKeydown = (event: KeyboardEvent): void => {
		if (!this.open) {
			return;
		}

		if (event.key === "Escape") {
			this.hide();
		}
	};

	/**
	 * Liste des attributs observés.
	 *
	 * @summary Déclare les attributs observés.
	 * @internal
	 */
	/**
	 * Attributes observed by `<tp-contextmenu>`.
	 *
	 * @summary Observed attributes.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return ["anchor", "open"];
	}

	/**
	 * Sélecteur CSS de l’élément servant d’ancrage.
	 *
	 * @attr anchor
	 */
	public get anchor(): string {
		return this.getStringAttribute("anchor");
	}

	/**
	 * Définit le sélecteur CSS de l’élément d’ancrage.
	 *
	 * @param value Sélecteur CSS.
	 */
	public set anchor(value: string) {
		this.setStringAttribute("anchor", value);
	}

	/**
	 * Indique si le menu est ouvert.
	 *
	 * @attr open
	 */
	public get open(): boolean {
		return this.getBooleanAttribute("open");
	}

	/**
	 * Ouvre ou ferme le menu.
	 *
	 * @param value `true` pour ouvrir le menu.
	 */
	public set open(value: boolean) {
		this.setBooleanAttribute("open", value);
	}

	/**
	 * Initialise le composant lors de sa connexion au document.
	 *
	 * @summary Initialise le menu contextuel lors de sa connexion au DOM.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpContextmenu.contextmenuStyleId, style);
		this.ensureInstanceId();
		this.bindAnchor();
		this.updateMenu();
		document.addEventListener("pointerdown", this.handleDocumentPointerDown);
		document.addEventListener("keydown", this.handleDocumentKeydown);
	}

	/**
	 * Réagit aux changements des attributs observés.
	 *
	 * @summary Met à jour le composant après changement d’attribut.
	 * @param name Nom de l’attribut modifié.
	 * @param oldValue Ancienne valeur.
	 * @param newValue Nouvelle valeur.
	 * @internal
	 */
	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (!this.isConnected || oldValue === newValue) {
			return;
		}

		if (name === "anchor") {
			this.bindAnchor();
		}

		this.updateMenu();
	}

	/**
	 * Nettoie les écouteurs et marqueurs lors de la déconnexion.
	 *
	 * @summary Nettoie le composant lors de sa déconnexion.
	 * @internal
	 */
	public disconnectedCallback(): void {
		this.unbindAnchor();
		document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
		document.removeEventListener("keydown", this.handleDocumentKeydown);
	}

	/**
	 * Ouvre le menu à une position donnée.
	 *
	 * @summary Ouvre explicitement le menu à l’écran.
	 * @param x Position horizontale en pixels.
	 * @param y Position verticale en pixels.
	 */
	public showAt(x: number, y: number): void {
		this.open = true;
		this.positionMenu(x, y);
	}

	/**
	 * Ferme le menu.
	 *
	 * @summary Ferme explicitement le menu.
	 */
	public hide(): void {
		this.open = false;
		this.closeAll();
	}

	/**
	 * Ferme tous les sous-menus ouverts.
	 *
	 * @summary Réinitialise l’état d’ouverture des sous-menus.
	 */
	public closeAll(): void {
		const items = this.getMenuItems();

		for (const item of items) {
			if (this.getSubmenu(item) !== null) {
				item.setAttribute("aria-expanded", "false");
			}
		}
	}

	/**
	 * Garantit l’existence d’un identifiant unique d’instance.
	 *
	 * @summary Génère un identifiant unique si nécessaire.
	 * @internal
	 */
	private ensureInstanceId(): void {
		if (this.instanceId !== "") {
			return;
		}

		instanceCount += 1;
		this.instanceId = `tp-contextmenu-${String(instanceCount)}`;
		this.setAttribute("data-tp-contextmenu-id", this.instanceId);
	}

	/**
	 * Lie le menu à son élément d’ancrage.
	 *
	 * @summary Attache l’écouteur de clic droit à l’ancrage.
	 * @internal
	 */
	private bindAnchor(): void {
		this.unbindAnchor();

		if (this.anchor === "") {
			return;
		}

		const element = document.querySelector(this.anchor);
		if (!(element instanceof HTMLElement)) {
			return;
		}

		this.anchorEl = element;
		this.anchorEl.addEventListener("contextmenu", this.handleAnchorContextmenu);
	}

	/**
	 * Supprime la liaison avec l’ancrage courant.
	 *
	 * @summary Détache l’écouteur de clic droit de l’ancrage.
	 * @internal
	 */
	private unbindAnchor(): void {
		if (this.anchorEl === null) {
			return;
		}

		this.anchorEl.removeEventListener(
			"contextmenu",
			this.handleAnchorContextmenu,
		);
		this.anchorEl = null;
	}

	/**
	 * Retourne la liste racine du menu.
	 *
	 * @summary Retourne le menu racine.
	 * @returns Élément `<ul>` racine ou `null`.
	 * @internal
	 */
	private getRootMenu(): HTMLUListElement | null {
		const element = this.querySelector(":scope > ul");
		return element instanceof HTMLUListElement ? element : null;
	}

	/**
	 * Retourne les éléments `li` directs d’un menu donné.
	 *
	 * @summary Retourne les items directs d’un menu.
	 * @param menu Menu concerné.
	 * @returns Liste des items directs.
	 * @internal
	 */
	private getDirectMenuItems(menu: HTMLUListElement): HTMLLIElement[] {
		return Array.from(menu.children).filter(
			(element): element is HTMLLIElement => element instanceof HTMLLIElement,
		);
	}

	/**
	 * Retourne tous les items du menu et de ses sous-menus.
	 *
	 * @summary Retourne tous les items du composant.
	 * @returns Liste complète des items.
	 * @internal
	 */
	private getMenuItems(): HTMLLIElement[] {
		return Array.from(this.querySelectorAll("li")).filter(
			(element): element is HTMLLIElement => element instanceof HTMLLIElement,
		);
	}

	/**
	 * Retourne le sous-menu direct d’un item.
	 *
	 * @summary Retourne le sous-menu d’un item.
	 * @param item Item concerné.
	 * @returns Sous-menu ou `null`.
	 * @internal
	 */
	private getSubmenu(item: HTMLLIElement): HTMLUListElement | null {
		const submenu = Array.from(item.children).find(
			(child): child is HTMLUListElement => child instanceof HTMLUListElement,
		);

		return submenu ?? null;
	}

	/**
	 * Retourne l’action associée à un item.
	 *
	 * @summary Retourne la valeur de `data-action`.
	 * @param item Item concerné.
	 * @returns Action ou chaîne vide.
	 * @internal
	 */
	private getItemAction(item: HTMLLIElement): string {
		return item.getAttribute("data-action") ?? "";
	}

	/**
	 * Retourne le texte lisible d’un item sans inclure celui de son sous-menu.
	 *
	 * @summary Retourne le libellé texte d’un item.
	 * @param item Item concerné.
	 * @returns Texte du libellé.
	 * @internal
	 */
	private getItemLabel(item: HTMLLIElement): string {
		const parts = Array.from(item.childNodes)
			.filter((node) => !(node instanceof HTMLUListElement))
			.map((node) => node.textContent ?? "")
			.join(" ")
			.trim();

		return parts.replace(/\s+/g, " ");
	}

	/**
	 * Met à jour les rôles ARIA et la navigation clavier.
	 *
	 * @summary Décore le menu et ses sous-menus.
	 * @internal
	 */
	private updateMenu(): void {
		const rootMenu = this.getRootMenu();
		if (rootMenu === null) {
			return;
		}

		rootMenu.setAttribute("role", "menu");
		this.decorateMenu(rootMenu);
	}

	/**
	 * Décore un menu donné ainsi que ses éventuels sous-menus.
	 *
	 * @summary Applique la structure ARIA et les handlers clavier.
	 * @param menu Menu à décorer.
	 * @internal
	 */
	private decorateMenu(menu: HTMLUListElement): void {
		menu.setAttribute("role", "menu");

		const items = this.getDirectMenuItems(menu);

		let firstFocusableAssigned = false;

		for (const item of items) {
			const isSeparator = item.getAttribute("role") === "separator";

			if (isSeparator) {
				item.setAttribute("role", "separator");
				item.removeAttribute("tabindex");
				item.removeAttribute("aria-haspopup");
				item.removeAttribute("aria-expanded");
				item.onclick = null;
				item.onkeydown = null;
				continue;
			}

			item.setAttribute("role", "menuitem");
			item.setAttribute("tabindex", firstFocusableAssigned ? "-1" : "0");
			firstFocusableAssigned = true;

			const submenu = this.getSubmenu(item);

			if (submenu !== null) {
				item.setAttribute("aria-haspopup", "menu");

				if (!item.hasAttribute("aria-expanded")) {
					item.setAttribute("aria-expanded", "false");
				}

				this.decorateMenu(submenu);
			} else {
				item.removeAttribute("aria-haspopup");
				item.removeAttribute("aria-expanded");
			}

			item.onclick = () => {
				if (item.getAttribute("aria-disabled") === "true") {
					return;
				}

				if (submenu !== null) {
					const expanded = item.getAttribute("aria-expanded") === "true";
					item.setAttribute("aria-expanded", String(!expanded));
					return;
				}

				this.handleItemActivation(item);
			};

			item.onkeydown = (event) => {
				if (item.getAttribute("aria-disabled") === "true") {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
					}
					return;
				}

				this.handleKey(
					event,
					item,
					items.filter(
						(candidate) => candidate.getAttribute("role") !== "separator",
					),
				);
			};
		}
	}

	/**
	 * Active un item terminal du menu.
	 *
	 * Si l’item porte `data-action`, le composant émet
	 * `tp-contextmenu-select` avant de se fermer.
	 *
	 * @summary Active un item de menu terminal.
	 * @param item Item activé.
	 * @internal
	 */
	private handleItemActivation(item: HTMLLIElement): void {
		if (
			item.getAttribute("aria-disabled") === "true" ||
			item.getAttribute("role") === "separator"
		) {
			return;
		}
		const action = this.getItemAction(item);

		if (action !== "") {
			this.dispatchEvent(
				new CustomEvent<TpContextmenuSelectDetail>("tp-contextmenu-select", {
					bubbles: true,
					detail: {
						action,
						item,
						label: this.getItemLabel(item),
					},
				}),
			);
		}

		this.hide();
	}

	/**
	 * Gère la navigation clavier au sein du menu.
	 *
	 * @summary Gère les interactions clavier sur un item de menu.
	 * @param event Événement clavier.
	 * @param item Item courant.
	 * @param siblings Frères du même niveau.
	 * @internal
	 */
	private handleKey(
		event: KeyboardEvent,
		item: HTMLLIElement,
		siblings: HTMLLIElement[],
	): void {
		const index = siblings.indexOf(item);
		if (index < 0) {
			return;
		}

		if (event.key === "ArrowDown") {
			this.focusItem(siblings[(index + 1) % siblings.length]);
			event.preventDefault();
			return;
		}

		if (event.key === "ArrowUp") {
			this.focusItem(siblings[(index - 1 + siblings.length) % siblings.length]);
			event.preventDefault();
			return;
		}

		if (event.key === "ArrowRight") {
			const submenu = this.getSubmenu(item);
			if (submenu !== null) {
				item.setAttribute("aria-expanded", "true");
				this.focusItem(this.getDirectMenuItems(submenu)[0]);
			}
			event.preventDefault();
			return;
		}

		if (event.key === "ArrowLeft") {
			const parentItem = item.parentElement?.closest("li");
			if (parentItem instanceof HTMLLIElement) {
				parentItem.setAttribute("aria-expanded", "false");
				this.focusItem(parentItem);
			}
			event.preventDefault();
			return;
		}

		if (event.key === "Home") {
			this.focusItem(siblings[0]);
			event.preventDefault();
			return;
		}

		if (event.key === "End") {
			this.focusItem(siblings[siblings.length - 1]);
			event.preventDefault();
			return;
		}

		if (event.key === "Enter" || event.key === " ") {
			const submenu = this.getSubmenu(item);

			if (submenu !== null) {
				const expanded = item.getAttribute("aria-expanded") === "true";
				item.setAttribute("aria-expanded", String(!expanded));

				if (!expanded) {
					this.focusItem(this.getDirectMenuItems(submenu)[0]);
				}
			} else {
				this.handleItemActivation(item);
			}

			event.preventDefault();
			return;
		}

		if (event.key === "Escape") {
			this.hide();
			event.preventDefault();
		}
	}

	/**
	 * Donne le focus à un item donné et met à jour ses frères.
	 *
	 * @summary Déplace le focus vers un item du menu.
	 * @param item Item à focaliser.
	 * @internal
	 */
	private focusItem(item: HTMLLIElement | undefined): void {
		if (item === undefined) {
			return;
		}

		const menu = item.parentElement;
		if (!(menu instanceof HTMLUListElement)) {
			return;
		}

		const siblings = this.getDirectMenuItems(menu);

		for (const sibling of siblings) {
			sibling.setAttribute("tabindex", sibling === item ? "0" : "-1");
		}

		item.focus();
	}

	/**
	 * Positionne le menu dans la fenêtre en évitant les débordements.
	 *
	 * @summary Positionne visuellement le menu.
	 * @param x Position horizontale souhaitée.
	 * @param y Position verticale souhaitée.
	 * @internal
	 */
	private positionMenu(x: number, y: number): void {
		const rect = this.getBoundingClientRect();

		const left = Math.max(8, Math.min(x, window.innerWidth - rect.width - 8));
		const top = Math.max(8, Math.min(y, window.innerHeight - rect.height - 8));

		this.style.left = `${String(Math.round(left))}px`;
		this.style.top = `${String(Math.round(top))}px`;
	}
}

/**
 * Enregistre l’élément personnalisé `tp-contextmenu`
 * s’il n’est pas déjà défini.
 *
 * @summary Enregistre le custom element `tp-contextmenu`.
 * @internal
 */
if (!customElements.get("tp-contextmenu")) {
	customElements.define("tp-contextmenu", TpContextmenu);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-contextmenu": TpContextmenu;
	}
}
