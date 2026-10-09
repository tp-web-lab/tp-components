/**
 * @module components/diagram
 * @summary Accessible Mermaid diagram renderer.
 */
import { TpBase } from '../base/base.js';
/**
 * @summary Renders Mermaid source supplied inline or through a source URL.
 * @tagname tp-diagram
 * @attr {string} src = "" - Mermaid source file loaded relative to the containing document.
 * @attr {string} label = "Diagram" - Accessible name applied to the rendered SVG.
 * @event tp-diagram-rendered Emitted after Mermaid has rendered the diagram.
 * @eventdetail tp-diagram-rendered { src: string }
 * @accessibility Exposes the generated SVG as an image with the accessible name provided by label.
 * @accessibilityresponsibility Provide a label that communicates the diagram's purpose or content.
 * @accessibilityresponsibility Supply an adjacent textual explanation when the diagram communicates information that cannot be expressed adequately by its accessible name alone.
 * @example
 * <tp-diagram label="Request flow">
 *   <script type="tp/diagram">
 *     flowchart LR
 *       Browser --> Server
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
        'tp-diagram': TpDiagram;
    }
}
