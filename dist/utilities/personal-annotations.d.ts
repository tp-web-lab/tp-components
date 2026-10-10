import "../components/box/box.js";
import "../components/button/button.js";
import "../components/button-group/button-group.js";
import "../components/icon-button/icon-button.js";
import "../components/textfield/textfield.js";
import "../components/numberfield/numberfield.js";
import "../components/stack/stack.js";
import "../components/cluster/cluster.js";
import "../components/icon/icon.js";
import { type TpPostItColor } from "../components/post-it/post-it.js";
import "../components/post-it/post-it.js";
/** Supported source languages; older notes use plain text. */
declare const annotationLanguages: readonly ["adoc", "html", "md", "rst", "txt"];
type AnnotationLanguage = (typeof annotationLanguages)[number];
/** Public author-facing language names; storage retains its historical aliases. */
export declare const annotationMarkups: {
    readonly none: "txt";
    readonly html: "html";
    readonly markdown: "md";
    readonly asciidoc: "adoc";
    readonly restructuredtext: "rst";
};
export type AnnotationMarkup = keyof typeof annotationMarkups;
/** Persisted annotation; selectors are checked against a text fingerprint. */
export interface PersonalAnnotation {
    id: string;
    text: string;
    selector: string;
    tag: string;
    quote: string;
    x: number;
    y: number;
    /** Optional presentation values preserve compatibility with earlier saved notes. */
    heading?: string;
    color?: TpPostItColor;
    opacity?: number;
    rotation?: number;
    language?: AnnotationLanguage;
}
/** Renders source without executing annotation scripts or event handlers. */
export declare function renderAnnotation(source: string, language: AnnotationLanguage): Promise<string>;
/** Builds a root-relative structural path; a fingerprint prevents silent reassignment. */
export declare function annotationTarget(root: HTMLElement, element: Element): Pick<PersonalAnnotation, "selector" | "tag" | "quote">;
/** Finds a verified target, falling back only to a unique text match. */
export declare function resolveAnnotationTarget(root: HTMLElement, record: PersonalAnnotation): Element | null;
/** Validates storage before any record can reach the DOM. */
export declare function parseAnnotations(value: string | null): PersonalAnnotation[];
/** One page-scoped annotation editor shared by all single-page and multi-page formats. */
export declare class PersonalAnnotations {
    private readonly host;
    private readonly root;
    private readonly onMarkupChange?;
    /** Toolbar entry point, owned by the host's toolbar. */
    readonly button: import("../components/icon-button/icon-button.js").TpIconButton;
    /** Management panel stays outside rendered author content. */
    private readonly panel;
    /** Announcements include selection instructions and storage errors. */
    private readonly status;
    /** List includes annotations whose target no longer exists. */
    private readonly list;
    /** Plain-text editor does not execute annotation markup. */
    private readonly field;
    /** Language trigger and current source format. */
    private readonly languageButton;
    private language;
    private defaultLanguage;
    /** Menu entries retained to synchronize the selected language after editing or choosing. */
    private readonly languageItems;
    /** Optional title, edited as plain text. */
    private readonly headingField;
    /** Palette controller targets itself so draft changes never recolor the document. */
    private readonly colorField;
    /** Transparency control mirrors the post-it Attributes example. */
    private readonly opacityField;
    /** Angle control mirrors the post-it Attributes example. */
    private readonly rotationField;
    /** Editor actions remain available even for invisible notes. */
    private readonly editor;
    /** Current page's validated records. */
    private records;
    /** Live notes indexed independently of their DOM position. */
    private readonly notes;
    /** Storage key never includes the active heading fragment. */
    private key;
    /** Draft remains unpersisted until Save. */
    private draft;
    /** A pending target selection either creates or reattaches an annotation. */
    private selecting;
    /** Original tabindex values restored when selection ends. */
    private readonly focusTargets;
    /** Watches asynchronously rendered markup without polling. */
    private readonly observer;
    /** Position against the document column, never the smaller selectable example box. */
    private readonly layoutRoot;
    /** Recomputes editor bounds when the document column changes width. */
    private readonly layoutObserver;
    /** Installs scoped controls and listeners. Call dispose before replacing the host. */
    constructor(host: HTMLElement, root: HTMLElement, onMarkupChange?: ((markup: AnnotationMarkup) => void) | undefined);
    /** Header settings remain visible but only edit an active draft. */
    private setEditing;
    /** Keeps the trigger, visible check and accessible current item in agreement. */
    private syncLanguageMenu;
    /** Aligns the editor with the current document column and viewport. */
    private readonly positionPanel;
    /** Keeps the editor above floating notes without making the document modal. */
    private showPanel;
    /** Constructs a library button without interpolating stored text as HTML. */
    private action;
    /** Creates a labelled library icon button with keyboard and tooltip support. */
    private iconAction;
    /** Switches storage scope before page content is replaced; an empty key suspends notes. */
    setPage(url: string): void;
    /** Renders notes once their validated targets are available. */
    private restore;
    /** Persists only explicit edits; failures remain visible and notes stay usable in memory. */
    private persist;
    /** Displays stored text as text, with recovery actions for missing targets. */
    private renderList;
    /** Selects the default for new notes and the language of an active unsaved draft. */
    setMarkup(markup: AnnotationMarkup): void;
    /** Opens a copy so Cancel never changes a saved record. */
    private edit;
    /** Populates independent controls; changing them does not mutate saved notes until Save. */
    private editAppearance;
    /** Commits nonempty source and its language, then refreshes the associated note. */
    private saveDraft;
    /** Deletes only the chosen personal annotation. */
    private remove;
    /** Enables one explicit target selection; no author links are followed during selection. */
    private select;
    /** Clears temporary selection mode. */
    private cancelSelection;
    /** Intercepts clicks only while the user is deliberately choosing a target. */
    private readonly pick;
    /** Supports keyboard-only creation and a predictable Escape exit. */
    private readonly keyboard;
    /** Converts a target selection to either a new draft or a repaired attachment. */
    private choose;
    /** Releases observers, document listeners, and every floating note. */
    dispose(): void;
}
export {};
