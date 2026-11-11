/**
 * @module components/card
 * @summary Structured card component using a definition list as source.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-card>` element displays a structured card.
 *
 * The source is a definition list whose terms are `header`, `main`, and `footer`.
 * Section order in the source does not affect the rendered card order.
 *
 * @summary Displays a structured card.
 * @tagname tp-card
 *
 * @cssprop --tp-card-background Card background.
 * @cssprop --tp-card-border-color Card border color.
 * @cssprop --tp-card-border-radius Card border radius.
 * @cssprop --tp-card-footer-background Footer background.
 * @cssprop --tp-card-header-background Header background.
 * @cssprop --tp-card-padding Section padding.
 * @example
 * <tp-card>
 *         <dl>
 *           <dt>header</dt><dd>content header</dd>
 *           <dt>footer</dt><dd>content footer</dd>
 *           <dt>main</dt><dd>content body</dd>
 *         </dl>
 *       </tp-card>
 */
export declare class TpCard extends TpBase {
    private static readonly styleId;
    protected connectedCallback(): void;
    private renderFromDefinitionList;
    private findOnlyMedia;
    private renderError;
}
