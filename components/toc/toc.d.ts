/**
 * @module components/toc
 * @summary Table of contents component rendered with `<tp-tree>`.
 */
import "../tree/tree.js";
import { TpBase } from "../base/base.js";
type TpTocPosition = "start" | "end" | "center";
/**
 * `<tp-toc>` renders the current page table of contents as a `<tp-tree>`.
 *
 * @summary Table of contents generated from page headings.
 * @tagname tp-toc
 * @attr {string} label = "Contents" - Visible summary label.
 * @attr {string} position = "center" - Placement (`start`, `end`, `center`).
 * @attr {boolean} open = false - Opens the table of contents panel.
 * @attr {boolean} expand-all = false - Expands every table of contents subtree.
 * @attr {boolean} brand = false - Uses the soft brand background and contrasting brand text colors.
 * @cssprop --tp-toc-background Panel background color.
 * @cssprop --tp-toc-border-color Panel border color.
 * @cssprop --tp-toc-color Panel text color.
 * @example
 * <tp-box data-tp-toc-scope>
 *   <tp-toc label="On this page" open expand-all></tp-toc>
 *   <h2>Getting started</h2>
 *   <p>Choose a heading in the table of contents to jump to its section.</p>
 *   <h3>Installation</h3><p>Install the library in your project.</p>
 *   <h3>First component</h3><p>Add your first interactive component.</p>
 * </tp-box>
 */
export declare class TpToc extends TpBase {
    private static readonly styleId;
    private observer;
    private observedScope;
    private renderQueued;
    static get observedAttributes(): string[];
    get brand(): boolean;
    set brand(value: boolean);
    get label(): string;
    set label(value: string);
    get position(): TpTocPosition;
    set position(value: string);
    get open(): boolean;
    set open(value: boolean);
    get expandAll(): boolean;
    set expandAll(value: boolean);
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    private syncPositionAttribute;
    private observeScope;
    private scheduleRender;
    private render;
    private collectHeadings;
    private ensureHeadingId;
    private renderTreeList;
    private createHeadingHref;
    private getTocScope;
    private readonly handleClick;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-toc": TpToc;
    }
}
export {};
