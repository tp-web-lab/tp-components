/**
 * @module components/base
 * @summary Shared base class for tp-* components.
 */
/**
 * Base class for `tp-*` components.
 *
 * This class factors out a few recurring behaviors:
 * - injecting a global stylesheet once
 * - automatic marking of the host with `data-tp-base-host`
 * - simplified read/write handling for boolean attributes
 * - batch attribute removal
 * - typed element lookup in the DOM subtree
 *
 * The `<tp-base>` component can also be used directly
 * as a neutral demo or test element.
 *
 * @summary Shared base for `tp-*` components.
 * @tagname tp-base
 * @attr {string} dir = "" - Text direction (`ltr`, `rtl`, or `auto`).
 * @attr {string} lang = "" - Language tag used by the component content.
 * @attr {string} data-tp-help-src = "" - URL of the component API manifest used by the help system.
 * @attr {string} data-tp-markdown-source = "" - Source document URL used to resolve relative resources in generated help.
 * @example
 * <tp-base>This element provides the common tp-components foundation.</tp-base>
 */
export declare class TpBase extends HTMLElement {
    /**
     * Unique identifier of the globally injected stylesheet.
     *
     * @summary Identifier of the base global stylesheet.
     * @internal
     */
    private static readonly baseStyleId;
    private static readonly resetStyleId;
    private static readonly tokenStyleId;
    private static readonly sourceAttribute;
    private static globalHelpKeydownAttached;
    private static currentHelpElement;
    /** Pointer target is independent of focus, including non-focusable layout components. */
    private static hoveredHelpElement;
    private initialHelpMarkup;
    private baseHelpListenerAttached;
    private readonly handleBaseHelpFocusIn;
    private readonly handleBaseHelpKeydown;
    /**
     * Attributes observed by `tp-base` itself.
     *
     * Subclasses that define their own `observedAttributes` should include
     * these via spread when they also want to react to `dir` and `lang`:
     * ```ts
     * static get observedAttributes() {
     *   return [...TpBase.observedAttributes, 'my-attr'];
     * }
     * ```
     *
     * @summary Liste des attributs observés par la classe de base.
     */
    static get observedAttributes(): string[];
    /**
     * Lifecycle callback called when the component is connected to the document.
     *
     * Cette implémentation :
     * - injects the base styles once
     * - automatically marks the host with `data-tp-base-host`
     *
     * Subclasses must call `super.connectedCallback()`.
     *
     * @summary Initializes the shared component foundation.
     * @internal
     */
    protected connectedCallback(): void;
    private static ensureGlobalHelpKeydown;
    private static findHelpElement;
    private static openHelpFromKeyboard;
    /**
     * Opens generated component help in a drawer.
     *
     * The method loads the component JSON generated beside its source file by
     * the Vite component API plugin. A custom URL can be provided with
     * `data-tp-help-src`.
     *
     * @summary Opens generated component help.
     */
    help(): Promise<void>;
    /**
     * Lifecycle callback invoked when an observed attribute changes.
     *
     * This base implementation is intentionally empty. Subclasses should
     * override it — without calling `super` — to react to their own
     * attribute changes.
     *
     * @summary Réagit aux changements d'attributs observés.
     * @param _name   Nom de l'attribut modifié.
     * @param _oldValue Ancienne valeur (`null` si l'attribut était absent).
     * @param _newValue Nouvelle valeur (`null` si l'attribut a été supprimé).
     * @internal
     */
    protected attributeChangedCallback(_name: string, _oldValue: string | null, _newValue: string | null): void;
    /**
     * Injects the global base styles if needed.
     *
     * @summary Injects the base stylesheet.
     * @internal
     */
    protected ensureBaseStyles(targetDocument?: Document): void;
    /**
     * Injects a global stylesheet into `document.head`
     * if it does not already exist.
     *
     * @summary Injects a global stylesheet once.
     * @param styleId Identifiant unique de la balise `<style>`.
     * @param cssText Contenu CSS à injecter.
     * @internal
     */
    protected ensureGlobalStyle(styleId: string, cssText: string, targetDocument?: Document): void;
    /**
     * Returns the boolean value of an HTML attribute.
     *
     * Rule used:
     * - attribute present → `true`
     * - attribute absent → `false`
     *
     * @summary Reads a boolean attribute.
     * @param name Attribute name.
     * @returns Boolean value of the attribute.
     * @internal
     */
    protected getBooleanAttribute(name: string): boolean;
    /**
     * Sets the boolean value of an HTML attribute.
     *
     * Rule used:
     * - `true` → attribute present with an empty value
     * - `false` → attribute removed
     *
     * @summary Writes a boolean attribute.
     * @param name Attribute name.
     * @param value Value to apply.
     * @internal
     */
    protected setBooleanAttribute(name: string, value: boolean): void;
    /**
     * Returns the value of a text attribute with a default fallback.
     *
     * @summary Reads a text attribute.
     * @param name Attribute name.
     * @param fallback Fallback value if the attribute is absent.
     * @returns Attribute value or fallback value.
     * @internal
     */
    protected getStringAttribute(name: string, fallback?: string): string;
    /**
     * Sets or removes a text attribute.
     *
     * An empty string removes the attribute.
     *
     * @summary Writes a text attribute.
     * @param name Attribute name.
     * @param value Value to apply.
     * @internal
     */
    protected setStringAttribute(name: string, value: string): void;
    /**
     * Removes multiple attributes in a single operation.
     *
     * @summary Removes multiple attributes from the component.
     * @param names Names of the attributes to remove.
     * @internal
     */
    protected removeAttributes(...names: string[]): void;
    /**
     * Returns the first element matching the selector.
     *
     * @summary Finds a typed element in a DOM subtree.
     * @param selectors CSS selector.
     * @param root Search root. Defaults to the component itself.
     * @returns Found element or `null`.
     * @internal
     */
    protected queryElement<T extends Element>(selectors: string, root?: ParentNode): T | null;
    /**
     * Skips over container elements when searching upward with a selector.
     *
     * Like `closest()`, but does not traverse through container elements
     * (toolbar, menu, dropdown, button-group, contextmenu).
     *
     * @summary Finds a matching ancestor, skipping containers.
     * @param selectors CSS selector to match.
     * @returns Matching ancestor, or `null`.
     * @internal
     */
    protected getClosestSkippingContainers(selectors: string): HTMLElement | null;
    private loadComponentApi;
    private getComponentApiSources;
    private getExplicitComponentApiSources;
    private isAbsoluteApiSource;
    private getComponentApiRootSources;
    private getComponentApiRoots;
    private addParentDocumentComponentApiRoots;
    private addDocumentComponentApiRoots;
    private getDocumentDirectoryUrl;
    private getDocumentBaseCandidates;
    private isUsableDocumentUrl;
    private getOrCreateHelpDrawer;
    /** Builds reader help without author controls, source code or class metadata. */
    private renderHelpContent;
    private getCurrentDocumentBaseHref;
    private captureInitialHelpMarkup;
    protected captureHelpSource(): void;
    private getStoredHelpMarkup;
    private stripInternalGeneratedMarkup;
    private serializeUserFacingElement;
    private serializeUserFacingChildNodes;
    private serializeStoredSourceChildNodes;
    private serializeStoredSourceNode;
    private serializeUserFacingNode;
    private isContentlessGeneratedComponent;
    private normalizeHelpMarkupWhitespace;
    private isInternalSourceAttribute;
    private isGeneratedDropdownSourceAttribute;
    private isInternalGeneratedElement;
    private isUserFacingDataAttribute;
    private getUserFacingAttributeValue;
}
/**
 * Injects the shared tp-* styles and a default theme class eagerly.
 *
 * This avoids initial render flashes when static markup uses theme-dependent
 * tokens before any `<tp-theme>` or `<tp-color>` interaction occurs.
 *
 * @summary Ensures global tp-* styles are ready.
 * @internal
 */
export declare function ensureTpBaseStyles(): void;
declare global {
    interface HTMLElementTagNameMap {
        "tp-base": TpBase;
    }
}
