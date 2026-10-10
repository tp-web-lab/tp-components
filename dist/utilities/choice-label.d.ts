export { default as choiceLabelStyle } from "./choice-label.css?inline";
/** Logical positions shared by radio and checkbox group labels. */
export type TpChoiceLabelPosition = "top" | "bottom" | "start" | "end";
/** Resolve unsupported or absent positions to the default top position. */
export declare function choiceLabelPosition(host: HTMLElement): TpChoiceLabelPosition;
/** Render a shared, accessible group heading without introducing a fieldset. */
export declare class TpChoiceLabel {
    /** Counter shared by both list types to keep label identifiers unique. */
    private static nextId;
    /** The generated heading, retained across disconnects and reconnects. */
    private heading;
    /** Whether the default group role belongs to this helper rather than the author. */
    private ownedRole;
    /** The list whose visible heading and accessible group name are synchronized. */
    private readonly host;
    /** Bind the helper to an existing light-DOM list component. */
    constructor(host: HTMLElement);
    /** Update heading text, layout and naming while preserving author-provided ARIA. */
    sync(): void;
    /** Add or remove only this heading's token from the author's naming references. */
    private updateReference;
}
