/**
 * @module components/xy-plot
 * @summary XY graph rendering component.
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
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-cluster
 * @summary Flexible cluster layout component.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
/**
 * @tp-dependency tp-stack
 * @summary Vertical stack layout component.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
import { type XYGrid, type XYLineStyle, type XYVector } from "@tp/tp-utilities/xy-graph";
import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
/** Numeric series supplied directly instead of mathematical expressions. */
export interface TpXYPlotData {
    vectors?: XYVector[];
    /** Accessible chart title. */
    title: string;
    /** Horizontal axis label, including units. */
    xLabel: string;
    /** Vertical axis label, including units. */
    yLabel: string;
    /** Independent polylines; separate entries are never connected. */
    series: {
        label: string;
        points: {
            x: number;
            y: number;
        }[];
        /** Uses dashes for the curve and its legend sample instead of a solid stroke. */
        dashed?: boolean;
        lineStyle?: XYLineStyle;
    }[];
    /** Optional labelled markers; offsets position labels in SVG pixels. */
    points?: {
        x: number;
        y: number;
        label: string;
        dx?: number;
        dy?: number;
    }[];
}
/**
 * @summary XY graph rendering component.
 * @tagname tp-xy-plot
 * @attr {"both" | "horizontal" | "vertical" | "none"} grid = "both" - Visible grid directions; overrides the graph directive when present.
 * @attr {"both" | "horizontal" | "vertical" | "none"} axis = "both" - Visible axes and their ticks.
 * @attr {boolean} no-legend = false - Hides curve legends.
 * @attr {boolean} settings = false - Shows a button for editing the graph definition in a panel below the plot.
 * @example
 * <tp-xy-plot>
 *   <script type="tp/xy-plot">
 *     xyFunctionGraph
 *       title "Functions"
 *       x-axis [-10,10]
 *       y-axis [-5,5]
 *       functions [["Sine", "2*sin(x)"], ["Line", "x/2"]]
 *   </script>
 * </tp-xy-plot>
 */
export declare class TpXYPlot extends TpBase {
    /** Optional numeric data, retained when the component reconnects. */
    private data;
    /** Prevents an obsolete asynchronous source read from replacing new data. */
    private revision;
    private animation;
    /** Original bounds and samples remain unchanged by interactive zoom. */
    private zoomDiagram;
    private zoomCurves;
    private zoomLevel;
    private panX;
    private panY;
    private panFrame;
    private drag;
    private animationOverride;
    private sourceGrid;
    private objectNames;
    private animationStep;
    private currentSource;
    private initialSource;
    private settingsEditor;
    private settingsOpen;
    private settingsRevision;
    private readonly settingsPanelId;
    /** Whether the graph settings button is shown. @attr settings */
    get settings(): boolean;
    set settings(value: boolean);
    private direction;
    /** Visible grid directions. @attr grid */
    get grid(): "both" | "horizontal" | "vertical" | "none";
    set grid(value: XYGrid);
    /** Visible axes and associated ticks. @attr axis */
    get axis(): "both" | "horizontal" | "vertical" | "none";
    set axis(value: XYGrid);
    /** Whether curve legends are hidden. @attr no-legend */
    get noLegend(): boolean;
    set noLegend(value: boolean);
    /** Gets the comma-separated reveal order, or sets it and returns to the start. */
    anim(): string;
    anim(names: string): void;
    /** Hides all objects in the reveal sequence. */
    goToStart(): void;
    /** Reveals all objects in the reveal sequence. */
    goToEnd(): void;
    /** Hides the last revealed object; stops at the start. */
    previous(): void;
    /** Reveals the next object; stops at the end. */
    next(): void;
    private syncPresentation;
    static get observedAttributes(): string[];
    private readonly source;
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    /** Renders numeric series with automatic axis ranges; separate series preserve gaps. */
    setData(data: TpXYPlotData): void;
    /** Builds the existing SVG renderer's diagram from finite numeric samples. */
    private renderData;
    /** Resets the viewport when a new graph definition or dataset is rendered. */
    private initializeViewport;
    /** Computes a centered viewport without accumulating floating-point drift. */
    private zoomRange;
    /** Resamples functions while preserving the revealed objects and both views. */
    private changeZoom;
    /** Applies a translated and scaled viewport, without changing the source. */
    private renderViewport;
    /** Releases pointer capture and any scheduled pan rendering. */
    private stopPan;
    /** Enables dragging and keyboard panning on the stable SVG container. */
    private bindPan;
    /** Frames the actual drawing, including rotated axis labels and long legends. */
    private fitPlotViewBox;
    private disposeSettings;
    private syncSettings;
    private toggleSettings;
    private commitSvg;
    private createAnimationControls;
    private syncAnimation;
    private renderPlot;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-xy-plot": TpXYPlot;
    }
}
