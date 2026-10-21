/** @module components/slope-simulator */
/**
 * @tp-dependency tp-badge
 * @summary Badge component for compact status labels.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
import { type TpSlopeProfiles } from "./profiles.js";
export type { TpSlopeProfile, TpSlopeProfiles } from "./profiles.js";
import { TpBase } from "../base/base.js";
import "../numberfield/numberfield.js";
import "../radio-list/radio-list.js";
import "../button/button.js";
import "../badge/badge.js";
import "../code-editor/code-editor.js";
import "../icon-button/icon-button.js";
import "../graph-geometry/geometry-actions.js";
/**
 * @summary Explore how uphill and downhill gradients change the effort needed to move a point.
 * @tagname tp-slope-simulator
 * @attr {string} src = "" - JSON file containing cycling profiles; takes precedence over the inline script.
 * @attr {number} speed-base = 30 - Fictional flat-ground speed in km/h; a positive attribute overrides the optional JSON speed-base.
 * @event tp-slope-simulator-error Fired when a profile source fails validation or loading; detail contains message.
 * @keyboard ArrowLeft / ArrowRight Move the focused point with slope-dependent effort.
 * @keyboard Escape End the current drag.
 * @keyboard F1 Toggle the toolbar while editing profile JSON.
 * @example
 * <tp-slope-simulator></tp-slope-simulator>
 */
export declare class TpSlopeSimulator extends TpBase {
    private ui?;
    private source;
    private available;
    private originals;
    private drafts;
    private static nextFileId;
    private readonly fileId;
    private fileBusy;
    private fileRequest?;
    private saveTargets;
    private token;
    private abort?;
    private programmatic;
    static get observedAttributes(): string[];
    /** External JSON source. Empty src restores inline profiles or defaults. */
    get src(): string;
    set src(value: string);
    /** Effective fictional speed on flat ground, in km/h. */
    get speedBase(): number;
    set speedBase(value: number);
    attributeChangedCallback(name: string, old: string | null, value: string | null): void;
    /** Replace profiles atomically. Returns false and emits an error for invalid data. */
    setProfiles(data: TpSlopeProfiles | string): boolean;
    private defaults;
    private stopLoading;
    private watchSource;
    private reloadProfiles;
    private applyProfiles;
    private refreshChoices;
    private profileCode;
    private syncEditor;
    private editProfile;
    private profileFileAction;
    private syncFileButtons;
    private reportError;
    private moving;
    private idleTimers;
    private gridVisible;
    private slope;
    private profile;
    private positions;
    private directions;
    private drag?;
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    private board;
    private terrain;
    private update;
    /** Grid coordinates use the original kilometres and absolute elevations. */
    private renderGrid;
    private stopSpeed;
    private travel;
    private key;
    private down;
    private move;
    private end;
    private finish;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-slope-simulator": TpSlopeSimulator;
    }
}
