import "../accordion/accordion.js";
import "../callout/callout.js";
import { TpBase } from "../base/base.js";
import "../button-group/button-group.js";
import "../textfield/textfield.js";
import "../code-editor/code-editor.js";
import { type GeometryResult } from "./geometry.js";
import "../save-image/save-image.js";
import "../dropdown/dropdown.js";
import "../radio-list/radio-list.js";
export type { GeometryObject, GeometryPoint, GeometryResult, GeometryValue, } from "./geometry.js";
export { evaluateGeometry, MEDIATRIX_CONSTRUCTION, parseGeometry, serializeGeometry, } from "./geometry.js";
/**
 * @summary Constructs dynamic figures with a graduated ruler and compass.
 * @tagname tp-graph-geometry
 * @attr {string} src = "" - URL of a text file containing construction commands.
 * @attr {boolean} built-in = false - Offers direct midpoint, perpendicular, parallel, perpendicular bisector, angle bisector, tangent, polygon and transformation tools.
 * @attr {boolean} grid = false - Shows a light grid without axes or graduations.
 * @attr {boolean} readonly = false - Prevents changes to the construction.
 * @event tp-geometry-change Fired after a construction change; detail contains source and undefined object names.
 * @eventdetail tp-geometry-change { source: string; undefined: string[] }
 * @event tp-geometry-error Fired when a file cannot be loaded or source cannot be parsed; detail contains message.
 * @eventdetail tp-geometry-error { message: string }
 * @accessibility Uses library buttons, fields, an accordion and a code editor with native keyboard controls.
 * @accessibility Provides an object list as an alternative to pointer selection and announces undefined constructions.
 * @accessibilityresponsibility Provide a textual explanation of the figure when its visual relationships are needed to understand the lesson.
 * @keyboard {Arrow keys} Moves the selected point or measurement label, or pans in Pan view; Shift reduces the step.
 * @keyboard {Escape} Cancels pending construction input and returns to Move.
 * @example
 * <tp-graph-geometry></tp-graph-geometry>
 */
export declare class TpGraphGeometry extends TpBase {
    private static nextId;
    private readonly controlId;
    private objects;
    private result;
    private initialized;
    private sourceRequest;
    private objectListMarkup;
    private tool;
    private polygonDraft;
    private pending;
    private selected;
    private undoStack;
    private redoStack;
    private scale;
    private center;
    private pan;
    private suppressCanvasClick;
    private drag;
    static get observedAttributes(): string[];
    get src(): string;
    set src(value: string);
    get value(): string;
    set value(source: string);
    get grid(): boolean;
    set grid(value: boolean);
    get builtIn(): boolean;
    set builtIn(value: boolean);
    get readonly(): boolean;
    /** Returns a detached snapshot of computed objects and undefined-object diagnostics. */
    analyze(): GeometryResult;
    /** Atomically replaces the construction; invalid source leaves the previous figure intact. */
    setConstruction(source: string): void;
    /** @summary Undoes one construction change. */
    undo(): void;
    /** @summary Redoes one construction change. */
    redo(): void;
    /** Removes an object and every construction depending on it, as one undoable action. */
    removeObject(id: string): void;
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** @internal */
    disconnectedCallback(): void;
    private loadSource;
    private restore;
    private recompute;
    private changed;
    private syncSource;
    private field;
    private report;
    private readonly onExportError;
    private changeAppearance;
    /** Exports the current view as a standalone SVG, with resolved colors and no editing controls. */
    exportSvg(): string;
    private name;
    private pointName;
    private appendConstruction;
    private render;
    private syncButtonControls;
    private updateTool;
    private selectObject;
    private finishPolygon;
    private polygonClick;
    private useTool;
    private canvasPoint;
    private world;
    private movePoint;
    private fitView;
    private draw;
}
