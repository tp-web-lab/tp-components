import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-diagram>` element renders flowcharts, sequence diagrams, class diagrams and the other diagram types supported by [Mermaid](https://mermaid.js.org/).
 *
 * @summary Renders flowcharts, sequence diagrams, class diagrams and the other diagram types supported by [Mermaid](https://mermaid.js.org/).
 * @tagname tp-diagram
 * @attr {string} src = "" - Mermaid source file loaded relative to the containing document.
 * @attr {"mermaid" | "pele"} engine = "pele" - Rendering engine; only the explicit mermaid value loads Mermaid.
 * @attr {string} label = "Diagram" - Accessible name applied to the rendered SVG.
 * @event tp-diagram-rendered Emitted after the selected engine has rendered the diagram.
 * @eventdetail tp-diagram-rendered { src: string }
 * @accessibility Exposes the generated SVG as an image with the accessible name provided by label.
 * @accessibilityresponsibility Provide a label that communicates the diagram's purpose or content.
 * @accessibilityresponsibility Supply an adjacent textual explanation when the diagram communicates information that cannot be expressed adequately by its accessible name alone.
 * @example
 * <tp-diagram label="Request flow">
 *   <script type="tp/diagram">
 *     flowchart LR
 *       Browser --> Server
 *       Server --> Database
 *   </script>
 * </tp-diagram>
 */
export declare class TpDiagram extends TpBase {
    static get observedAttributes(): string[];
    private readonly source;
    private renderToken;
    private initialRenderStarted;
    private lifecycleReady;
    get src(): string;
    set src(value: string);
    get engine(): "mermaid" | "pele";
    set engine(value: "mermaid" | "pele");
    get label(): string;
    set label(value: string);
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    private renderDiagram;
    private storeInlineAuthorSource;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-diagram": TpDiagram;
    }
}
