/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-dragdrop
 * @summary Generic drag-and-drop controller for content.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../callout/callout.js";
/** One-based author ranks, unaffected by display order. */
export interface TpMatchingPair {
    /** Rank in the first author list. */
    left: number;
    /** Rank in the second author list. */
    right: number;
}
/** One original rank per column; null denotes a member not yet selected. */
export interface TpMatchingGroup {
    /** Members in author column order, independent of display order. */
    items: (number | null)[];
}
/** Two columns retain the original pair format; larger exercises use groups. */
export type TpMatchingValue = TpMatchingPair[] | TpMatchingGroup[];
/** Validates and copies a snapshot without changing the component state. */
export declare function normalizeMatchingValue(value: unknown, columns: number, count: number, complete?: boolean): TpMatchingGroup[] | null;
/**
 * @summary associates rich content from two or more optionally titled lists without grading the groups.
 * @tagname tp-matching
 * @attr {boolean} heading = false - Uses the first list as column headings instead of matchable items.
 * @attr {boolean} disabled = false - Disables association controls without disabling embedded media.
 * @event change Emitted after associations change; ranks refer to the original lists.
 * @eventdetail change { value: TpMatchingValue; complete: boolean }
 * @keyboard {Tab / Shift+Tab} Moves through association controls and interactive content.
 * @keyboard {Enter / Space} Selects an item or joins it to the selected group from another list.
 * @keyboard {Escape} Cancels the pending selection.
 * @accessibility Dedicated controls keep embedded links, media and components independently usable. Group numbers supplement color; column headings label their lists.
 * @example
 * <tp-matching>
 *   <ul><li>Hello</li><li>Thank you</li><li>Goodbye</li></ul>
 *   <ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol>
 * </tp-matching>
 */
export declare class TpMatching extends TpBase {
    /** Unique heading identifiers across instances. */
    private static nextHeading;
    /** Author lists, retained on reconnect. */
    private lists;
    private originalLists;
    private headingSources;
    /** Stable identities captured before any shuffle. */
    private items;
    /** Current groups keyed by their stable visible identity. */
    private groups;
    /** Next visible group number; unrelated to the expected answers. */
    private nextGroup;
    /** Pending item for pointer and keyboard selection. */
    private selected;
    /** Shared drag controller. */
    private drag;
    /** Live status for selection and pairing. */
    private status;
    /** Authoring error, kept outside the original lists. */
    private error;
    /** Watches late parser content until valid lists are available. */
    private readonly observer;
    /** Attributes with live effects. */
    static get observedAttributes(): string[];
    /** Whether the first list contains column titles. @attr heading */
    get heading(): boolean;
    set heading(value: boolean);
    /** Whether associations can be edited. */
    get disabled(): boolean;
    /** Adds or removes disabled association controls. */
    set disabled(value: boolean);
    /** Number of author columns after initialization. */
    get columnCount(): number;
    /** Number of expected groups; zero for missing or unequal lists. */
    get itemCount(): number;
    /** Whether all groups have exactly one member from every column. */
    get complete(): boolean;
    /** Detached, deterministic snapshot; two columns retain the legacy pair format. */
    get value(): TpMatchingValue;
    /** Restores valid unique members atomically; null marks missing multi-list members. */
    set value(value: TpMatchingValue);
    /** Clears all groups and reshuffles every list; emits change when values changed. */
    reset(): void;
    /** Installs styles, delegates controls and waits for author lists. */
    protected connectedCallback(): void;
    /** Stops observers and delegated events without destroying author content. */
    disconnectedCallback(): void;
    /** Updates order and controls without reconstructing rich content. */
    protected attributeChangedCallback(name: string): void;
    /** Validates bare lists or dt/dd titled columns, preserving all author item nodes. */
    private initialize;
    /** Fisher–Yates shuffles each column independently, preserving original ranks. */
    private order;
    /** Resolves only this component's original items, excluding nested matchers. */
    private itemFromEvent;
    /** Selects cards or dedicated controls without intercepting embedded interactions. */
    private readonly onClick;
    /** Cancels only a pending selection; embedded widgets keep other key events. */
    private readonly onKeyDown;
    /** Adds or replaces one member in the selected group, retaining its other columns. */
    private choose;
    /** Finds the group containing one stable item identity. */
    private groupOf;
    /** Removes only this member; groups with fewer than two members dissolve. */
    private unpair;
    /** Starts selection through the shared drag controller. */
    private readonly onDragStart;
    /** Accepts drops only from this controller and into the opposite column. */
    private readonly onDrop;
    /** Clears drag highlighting on drop or cancellation. */
    private readonly onDragEnd;
    /** Reflects selected and paired states without touching embedded content. */
    private update;
    /** Emits a serializable snapshot, without asserting whether answers are correct. */
    private emitChange;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-matching": TpMatching;
    }
}
