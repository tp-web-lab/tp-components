/**
 * @module components/code-editor
 * @summary CodeMirror-based code editor component.
 */
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
 * @tp-dependency tp-copy-code
 * @summary Copy-to-clipboard button component.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-fullscreen
 * @summary Fullscreen controller button.
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
 * @tp-dependency tp-theme
 * @summary Parent-scoped light/dark/auto theme controller with embedded UI.
 */
/**
 * @tp-dependency tp-tooltip
 * @summary Displays anchored tooltip content.
 */
/**
 * @credit CodeMirror https://codemirror.net/
 * @summary Code editing and language support.
 */
/**
 * @credit Lezer https://lezer.codemirror.net/
 * @summary Syntax tree highlighting.
 */
import { type CompletionContext, type CompletionResult } from "@codemirror/autocomplete";
import { StreamLanguage } from "@codemirror/language";
import { type Extension } from "@codemirror/state";
import { TpBase } from "../base/base.js";
import "../dropdown/dropdown.js";
import "../icon/icon.js";
import { type DecorationSet, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import "../badge/badge.js";
import "../button/button.js";
import "../copy-code/copy-code.js";
import "../fullscreen/fullscreen.js";
import "../icon-button/icon-button.js";
import "../theme/theme.js";
export interface TpSqlTableSchema {
    name: string;
    columns: string[];
}
export type TpSqlSchema = TpSqlTableSchema[];
export declare function sqlCompletion(context: CompletionContext): CompletionResult | null;
export declare const prologLanguage: StreamLanguage<unknown>;
interface AsciidocLanguageState {
    rawDelimiter: string | null;
    rawStyle: "comment" | "verbatim" | null;
    pendingVerbatim: boolean;
}
export declare const asciidocLanguage: StreamLanguage<AsciidocLanguageState>;
export declare const rstSectionTitlePlugin: ViewPlugin<{
    decorations: DecorationSet;
    update(update: ViewUpdate): void;
}, undefined>;
export declare const restructuredTextLanguage: StreamLanguage<unknown>;
export declare const tpCodeEditorHighlightStyle: Extension;
export declare const tpCodeEditorTheme: Extension;
export declare const asciidocHighlightStyle: Extension;
export declare const rstHighlightStyle: Extension;
export declare const rstBaseTheme: Extension;
export declare const tpMarkdownSyntaxPlugin: ViewPlugin<{
    decorations: DecorationSet;
    update(update: ViewUpdate): void;
}, undefined>;
export declare const tpMarkdownSyntaxTheme: Extension;
/**
 * Code editor based on CodeMirror 6, without Shadow DOM.
 *
 * Possible sources:
 * 1. content defined by `setValue()`
 * 2. content of a direct child `<script type="tp/<language>">`
 * 3. content loaded from `src`
 * 4. content of the `value` attribute
 *
 * The component automatically adds an internal CodeMirror panel above the editor, containing:
 * - a badge showing the current language
 * - a `<tp-copy-code>` button targeting the editor itself
 * - a `<tp-theme>` button for switching between light and dark themes
 * - a `<tp-dropdown>` button for keyboard shortcuts and editor actions
 *
 * This panel is displayed when the `toolbar` attribute is present and can be
 * toggled with F1.
 *
 * @summary Displays a CodeMirror 6 based code editor.
 * @tagname tp-code-editor
 *
 * @attr {string} dir = "inherited" - Text direction inherited from HTMLElement (`ltr`, `rtl`, `auto`).
 * @attr {string} filename = "" - Logical filename associated with the current content.
 * @attr {boolean} fold-gutter = false - Shows fold markers in the gutter.
 * @attr {string} lang = "inherited" - Language tag inherited from HTMLElement.
 * @attr {string} language = "html" - Fallback editing language when it cannot be inferred from a `tp/LANGUAGE` script or `src` extension.
 * @attr {boolean} line-numbers = false - Shows line numbers.
 * @attr {string} placeholder = "Type some LANGUAGE code... or F1 to toggle the toolbar" - Text shown when the editor is empty. Defaults to `Type some LANGUAGE code... or F1 to toggle the toolbar` using the resolved language.
 * @attr {boolean} readonly = false - Enables read-only mode.
 * @attr {string} src = "" - URL of a source file to load.
 * @attr {boolean} toolbar = false - Shows the editor UI panel.
 * @attr {string} value = "" - Initial editor content.
 * @attr {boolean} word-wrap = false - Enables soft wrapping.
 *
 *
 * @event tp-code-editor-boundary Emitted when keyboard navigation reaches the editor boundary.
 * @event tp-code-editor-change Emitted when the editor content changes after user input.
 * @event tp-code-editor-error Emitted when a source loading error occurs.
 * @event tp-code-editor-input Emitted on user input.
 * @event tp-code-editor-load Emitted after the editor source has been resolved and loaded.
 * @event tp-code-editor-ready Emitted when the editor has been initialized.
 * @event tp-code-editor-reset Emitted after `reset()` restores the initial value.
 * @eventdetail tp-code-editor-boundary { direction: "before" | "after" }
 * @eventdetail tp-code-editor-change { filename: string; value: string }
 * @eventdetail tp-code-editor-error { message: string }
 * @eventdetail tp-code-editor-input { filename: string; value: string }
 * @eventdetail tp-code-editor-load { filename: string; source: "api" | "script" | "src" | "value"; valueLength: number }
 * @eventdetail tp-code-editor-ready void
 * @eventdetail tp-code-editor-reset { value: string }
 *
 * @cssprop --tp-code-editor-active-line Background color of the active editor line.
 * @cssprop --tp-code-editor-caret Caret color.
 * @cssprop --tp-code-editor-fold-background Background color of fold placeholders.
 * @cssprop --tp-code-editor-foreground Main editor text color.
 * @cssprop --tp-code-editor-gutter-background Gutter background color.
 * @cssprop --tp-code-editor-gutter-border Gutter border color.
 * @cssprop --tp-code-editor-gutter-foreground Gutter text and marker color.
 * @cssprop --tp-code-editor-muted Muted editor text color.
 * @cssprop --tp-code-editor-selection Selection background color.
 * @cssprop --tp-code-editor-surface Editor surface background color.
 * @cssprop --tp-code-editor-token-comment Syntax color for comments.
 * @cssprop --tp-code-editor-token-function Syntax color for function names.
 * @cssprop --tp-code-editor-token-keyword Syntax color for keywords.
 * @cssprop --tp-code-editor-token-link Syntax color for links.
 * @cssprop --tp-code-editor-token-number Syntax color for numbers.
 * @cssprop --tp-code-editor-token-property Syntax color for properties.
 * @cssprop --tp-code-editor-token-string Syntax color for strings.
 * @cssprop --tp-code-editor-token-type Syntax color for types.
 * @cssprop --tp-code-editor-token-variable Syntax color for variables.
 * @example
 * <tp-code-editor></tp-code-editor>
 */
export declare class TpCodeEditor extends TpBase {
    /**
     * Identifiant unique de la feuille de styles injectée globalement.
     *
     * @summary Identifiant du style global du composant.
     * @internal
     */
    private static readonly styleId;
    /**
     * Instance CodeMirror active.
     *
     * @summary Référence vers l’éditeur CodeMirror.
     * @internal
     */
    private editor;
    /** Annotation numbers owned by each linked tp-code-comment list. */
    private readonly commentNumbers;
    /** Rich explanations supplied by each linked annotation list. */
    private readonly commentContents;
    /** Reconfigures comment decorations without resetting code, selection or undo. */
    private readonly commentCompartment;
    /** Registers a linked annotation list; an empty array removes only that owner's markers. */
    setCodeCommentNumbers(owner: object, numbers: readonly number[], comments?: ReadonlyMap<number, HTMLElement>): void;
    /** Combines the marker numbers requested by all linked annotation lists. */
    private commentExtension;
    /**
     * Conteneur DOM de l’éditeur.
     *
     * @summary Référence vers le conteneur de rendu de CodeMirror.
     * @internal
     */
    private container;
    private panelContainer;
    private sourceErrorElement;
    private panelObserver;
    private layoutObserver;
    private observedInlineSize;
    private actionPanelEl;
    /**
     * Badge du langage courant.
     *
     * @summary Référence vers le badge de langage.
     * @internal
     */
    private languageBadgeEl;
    private cursorPositionEl;
    /**
     * Bouton de copie interne.
     *
     * @summary Référence vers le bouton de copie.
     * @internal
     */
    private static nextKeyboardId;
    private static nextThemeTargetId;
    private readonly keyboardId;
    private keyboardDropdownEl;
    private readonly generatedThemeTargetId;
    /**
     * Code courant résolu par le composant.
     *
     * @summary Contenu courant de l’éditeur.
     * @internal
     */
    private currentValue;
    private currentLanguage;
    /**
     * Surcharge de code définie explicitement via `setValue()`.
     *
     * @summary Surcharge de contenu fournie par l’API.
     * @internal
     */
    private overrideValue;
    /**
     * Nom de fichier effectivement résolu.
     *
     * @summary Nom logique du fichier courant.
     * @internal
     */
    private currentFilename;
    private pendingSourceLoad;
    private sourceReloadRequested;
    /**
     * Indique si le prochain changement vient d’une synchronisation interne
     * et non d’une saisie utilisateur.
     *
     * @summary Distingue les mises à jour internes des saisies utilisateur.
     * @internal
     */
    private isApplyingExternalValue;
    private initialValue;
    private hasInitialValue;
    private toggleGutters;
    private toggleLineNumbers;
    private emitBoundaryIntent;
    private getShortcutLabels;
    /**
     * Liste des attributs observés par le composant.
     *
     * @summary Déclare les attributs observés.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * Code initial sérialisé dans l’attribut.
     *
     * @attr value
     */
    get value(): string;
    set value(value: string);
    /**
     * URL optionnelle d’un fichier source à charger.
     *
     * @attr src
     */
    get src(): string;
    set src(value: string);
    /**
     * Nom logique du fichier associé au contenu courant.
     *
     * @attr filename
     */
    get filename(): string;
    set filename(value: string);
    /**
     * Langage de l’éditeur.
     *
     * @attr language
     * @default html
     */
    get language(): string;
    set language(value: string);
    /**
     * Texte affiché quand l’éditeur est vide.
     *
     * @attr placeholder
     */
    get placeholder(): string;
    set placeholder(value: string);
    /**
     * Active le mode lecture seule.
     *
     * @attr readonly
     */
    get readonly(): boolean;
    set readonly(value: boolean);
    /**
     * Affiche les numéros de ligne.
     *
     * @attr line-numbers
     */
    get lineNumbers(): boolean;
    set lineNumbers(value: boolean);
    /**
     * Affiche les indicateurs de pliage CodeMirror.
     *
     * @attr fold-gutter
     */
    get foldGutter(): boolean;
    set foldGutter(value: boolean);
    /**
     * Active le retour automatique à la ligne.
     *
     * @attr word-wrap
     */
    get wordWrap(): boolean;
    set wordWrap(value: boolean);
    /**
     * Shows the editor UI panel.
     *
     * @attr toolbar
     */
    get toolbar(): boolean;
    set toolbar(value: boolean);
    /**
     * Définit la valeur initiale de l’éditeur.
     *
     * @summary Sets the value used by `reset()` without changing the current editor content.
     */
    setInitialValue(value: string): void;
    /**
     * Retourne la valeur initiale.
     *
     * @summary Returns the value currently used as the reset target.
     */
    getInitialValue(): string;
    /**
     * Restaure la valeur initiale.
     *
     * @summary Restores the editor content to the initial value and emits `tp-code-editor-reset`.
     */
    reset(): void;
    /**
     * Lifecycle callback called when the component is connected to the document.
     *
     * @summary Initialise le composant lors de sa connexion au DOM.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Callback du cycle de vie appelée lorsqu’un attribut observé change.
     *
     * @summary Réagit aux changements d’attributs observés.
     * @internal
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Callback du cycle de vie appelée lors de la déconnexion du composant.
     *
     * @summary Détruit proprement l’éditeur.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Retourne la hauteur utile intrinsèque du contenu édité.
     *
     * Cette mesure ne dépend pas de la hauteur actuellement visible du composant.
     * Elle est donc adaptée au calcul d’un layout parent, notamment en mode vertical.
     *
     * @summary Returns the computed height required by the current editor content, in pixels.
     * @returns Hauteur utile du contenu en pixels.
     */
    getContentHeight(): number;
    /**
     * Retourne le code courant.
     *
     * @summary Returns the current editor content.
     * @returns Contenu textuel courant.
     */
    getValue(): string;
    /**
     * Définit explicitement le contenu de l’éditeur.
     *
     * @summary Replaces the current editor content and stores it as an explicit API-provided value.
     * @param code Code à injecter dans l’éditeur.
     */
    setValue(code: string): void;
    /**
     * Donne le focus à l’éditeur.
     *
     * @summary Moves focus to the CodeMirror editor.
     */
    focus(): void;
    /**
     * Returns whether the primary cursor is at the start of the document.
     *
     * @summary Returns `true` when the editor selection is collapsed at the start of the document.
     * @returns `true` when the main selection is empty and starts at offset 0.
     */
    isCursorAtStart(): boolean;
    /**
     * Returns whether the primary cursor is at the end of the document.
     *
     * @summary Returns `true` when the editor selection is collapsed at the end of the document.
     * @returns `true` when the main selection is empty and ends at document length.
     */
    isCursorAtEnd(): boolean;
    /**
     * Recharge explicitement la source courante.
     *
     * @summary Reloads the content from `src`, when a source file is configured.
     */
    reload(): void;
    private requestLoadSourceAndSyncEditor;
    /**
     * Force la resynchronisation de la hauteur visible avec le contenu.
     *
     * @summary Recomputes the editor height from the current content and panels.
     */
    syncHeightToContent(): void;
    /**
     * Crée l’instance CodeMirror.
     *
     * @summary Initialise l’éditeur CodeMirror.
     * @internal
     */
    private createEditor;
    private runKeyboardAction;
    private readonly handleKeyboardDropdownClick;
    private readonly handleKeyboardDropdownToggle;
    /**
     * Recharge la source active puis synchronise l’éditeur.
     *
     * @summary Résout la source puis met à jour CodeMirror.
     * @internal
     */
    private loadSourceAndSyncEditor;
    /**
     * Résout la source de code à utiliser.
     *
     * @summary Résout la source de code.
     * @returns Objet contenant le code, sa source et le nom logique du fichier.
     * @internal
     */
    private resolveSource;
    private resolveLanguage;
    /**
     * Applique une nouvelle configuration à CodeMirror
     * après changement d’attributs structurels.
     *
     * @summary Reconfigure l’éditeur CodeMirror.
     * @internal
     */
    private reconfigureEditor;
    /**
     * Injecte une valeur dans l’éditeur sans déclencher la logique
     * de saisie utilisateur.
     *
     * @summary Synchronise le contenu de l’éditeur avec une valeur externe.
     * @param value Contenu à injecter.
     * @internal
     */
    private applyValueToEditor;
    private toggleKeyboardDropdown;
    /**
     * Construit les extensions CodeMirror nécessaires.
     *
     * @summary Construit la configuration de l’éditeur.
     * @returns Tableau d’extensions CodeMirror.
     * @internal
     */
    private buildExtensions;
    /**
     * Ajuste la hauteur visible du composant à la hauteur réelle du contenu.
     *
     * @summary Synchronise la hauteur visible du composant avec le contenu édité.
     * @internal
     */
    private syncHeight;
    /**
     * Programme plusieurs resynchronisations de hauteur après le layout.
     *
     * CodeMirror finalise parfois sa géométrie après la mise à jour du DOM.
     *
     * @summary Rejoue la synchronisation de hauteur après layout.
     * @internal
     */
    private scheduleSyncHeight;
    /**
     * Crée ou réutilise le panel d'actions interne.
     *
     * @summary Crée ou réutilise le panel d'interface.
     * @internal
     */
    private ensureActionPanel;
    private ensureActionPanelSection;
    private syncThemeDropdownPlacement;
    private ensureThemeTargetId;
    /**
     * Synchronise le contenu du panel d'actions interne.
     *
     * @summary Synchronise le badge et le bouton de copie.
     * @internal
     */
    private syncActionPanel;
    private syncCursorPosition;
    /**
     * Garantit l’existence du conteneur DOM interne.
     *
     * @summary Crée ou réutilise le conteneur de l’éditeur.
     * @internal
     */
    private ensureContainer;
    private startPanelObserver;
    /**
     * Re-measures CodeMirror when a hidden tab/viewer becomes visible or when
     * its available inline size changes.
     */
    private startLayoutObserver;
    /**
     * Injecte la feuille de styles du composant dans `document.head`
     * si elle n’existe pas encore.
     *
     * @summary Injecte la feuille de styles globale du composant.
     * @internal
     */
    private ensureStyles;
    private readExplicitLanguage;
    /**
     * Émet un événement d’erreur standardisé.
     *
     * @summary Émet l’événement `tp-code-editor-error`.
     * @param message Message d’erreur.
     * @internal
     */
    private dispatchErrorEvent;
    private showInlineSourceError;
    private clearInlineSourceError;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-code-editor": TpCodeEditor;
    }
}
export {};
