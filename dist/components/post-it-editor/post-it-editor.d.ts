/** @module components/post-it-editor */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-box
 * @summary Simple box layout component.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-cluster
 * @summary Flexible cluster layout component.
 */
/**
 * @tp-dependency tp-color
 * @summary Brand color preset controller scoped to the containing element.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
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
 * @tp-dependency tp-post-it
 * @summary displays a movable floating paper note that folds into a pushpin.
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
 * @credit DOMPurify https://github.com/cure53/DOMPurify
 * @summary HTML sanitization.
 */
import { type AnnotationMarkup } from "../../utilities/personal-annotations.js";
import { TpBase } from "../base/base.js";
/**
 * @summary creates and edits persistent personal annotations attached to document elements.
 * @tagname tp-post-it-editor
 * @attr {string} for = "" - CSS selector of the document container to annotate; without it, use setTarget().
 * @attr {"html" | "markdown" | "asciidoc" | "restructuredtext" | "none"} markup = "none" - Default language for new notes; changes also apply to the active draft.
 * @attr {string} page = "" - Stable document identifier for localStorage; defaults to the current URL without its fragment.
 * @keyboard {Enter / Space} Activate the editor, annotation controls or a focused pin.
 * @keyboard {Tab / Enter} Choose a document target while adding or reattaching an annotation.
 * @keyboard {Escape} Cancel target selection or close the language dropdown.
 * @accessibility Icon buttons have accessible labels; document targets become keyboard-focusable during selection.
 * @example
 * <tp-box id="post-it-editor-example">
 *   <p>Select this first paragraph to attach a note about the introduction.</p>
 *   <p>Or select this second paragraph to attach a different note. Reload this page to restore saved notes.</p>
 * </tp-box>
 * <tp-post-it-editor for="#post-it-editor-example" page="post-it-editor-example"></tp-post-it-editor>
 */
export declare class TpPostItEditor extends TpBase {
    /** Shared annotation workflow, created once a valid target is available. */
    private controller;
    /** Explicit target supplied by a documentation renderer. */
    private targetElement;
    /** Local configuration attributes alongside shared base attributes. */
    static get observedAttributes(): string[];
    /** Language for new notes, synchronized with the editor dropdown. @attr markup */
    get markup(): "html" | "markdown" | "asciidoc" | "restructuredtext" | "none";
    set markup(value: AnnotationMarkup);
    /** Effective default scope excludes the current heading fragment. */
    get page(): string;
    /** Changes storage scope; an empty value suspends annotation creation in source mode. */
    setPage(page: string): void;
    /** Supplies a target without relying on a document-wide selector. */
    setTarget(target: HTMLElement): void;
    /** Installs the reusable editor when connected. */
    protected connectedCallback(): void;
    /** Releases floating notes and listeners on removal. */
    disconnectedCallback(): void;
    /** Reacts only to local configuration changes. */
    protected attributeChangedCallback(name: string): void;
    /** Resolves an external document target and creates one controller. */
    private initialize;
    /** Explicit cleanup for consumers replacing their document shell. */
    dispose(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-post-it-editor": TpPostItEditor;
    }
}
