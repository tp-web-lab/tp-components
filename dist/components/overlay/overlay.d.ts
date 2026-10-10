/**
 * Base commune pour les composants d’overlay comme `<tp-modal>`, superpositions
 * `<tp-drawer>` et `<tp-popover>`.
 */
import { TpBase } from "../base/base.js";
export declare abstract class TpOverlayElement extends TpBase {
    private backdropEl;
    private instanceId;
    private lastOpenState;
    private topLayerEnabled;
    ignoreOutsideClickFor: HTMLElement[];
    private readonly handleKeydown;
    protected readonly handlePointerDownOutside: (event: PointerEvent) => void;
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
    protected get usesTopLayer(): boolean;
    /** Whether clicking the backdrop dismisses this overlay. */
    protected get closesOnBackdropClick(): boolean;
    /**
     * Indique si l’overlay est ouvert.
     */
    get open(): boolean;
    set open(value: boolean);
    /**
     * Active l’overlay visuel derrière le composant.
     */
    get backdrop(): boolean;
    set backdrop(value: boolean);
    /**
     * Active la fermeture au clic extérieur.
     */
    get outsideClick(): boolean;
    set outsideClick(value: boolean);
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Ouvre l’overlay.
     */
    show(): void;
    /**
     * Ferme l’overlay.
     */
    hide(): void;
    toggle(): void;
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
    protected isInsideInteractiveBoundary(target: Node): boolean;
    /**
     * Hook appelé après mise à jour de l’état commun.
     */
    protected afterOverlayUpdate(): void;
    /**
     * Met à jour toute la logique commune de l’overlay.
     */
    protected updateOverlayState(): void;
    private setupTopLayer;
    private syncTopLayer;
    private hideFromTopLayer;
    private ensureOverlayInstanceId;
    private ensureBackdrop;
    private removeBackdrop;
    private updateBackdrop;
    private dispatchToggleEventIfNeeded;
    private static instanceCount;
}
