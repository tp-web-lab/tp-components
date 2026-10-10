/**
 * @module components/console
 * @summary Displays structured console output.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-copy-code
 * @summary Copy-to-clipboard button component.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-object-tree
 * @summary Specialized tree for inspecting JavaScript values.
 */
import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../copy-code/copy-code.js";
import "../object-tree/object-tree.js";
/**
 * Niveaux de sortie supportés par la console.
 *
 * @summary Représente la nature d’une entrée console.
 */
export type TpConsoleEntryKind = "log" | "info" | "warn" | "error" | "table" | "group" | "group-collapsed" | "group-end" | "assert" | "count" | "time";
/**
 * Valeur affichable dans la console.
 *
 * @summary Représente une valeur console arbitraire.
 */
export type TpConsoleValue = unknown;
/**
 * Entrée de console.
 *
 * @summary Représente une ligne de sortie console.
 */
export interface TpConsoleEntry {
    /**
     * Identifiant unique de l’entrée.
     */
    id: number;
    /**
     * Nature de l’entrée.
     */
    kind: TpConsoleEntryKind;
    /**
     * Valeurs affichées dans cette entrée.
     */
    values: TpConsoleValue[];
    /**
     * Horodatage de création.
     */
    timestamp: number;
    depth: number;
    collapsed?: boolean;
}
/**
 * Détail de l’événement émis lorsqu’une entrée est ajoutée.
 *
 * @summary Représente l’ajout d’une entrée console.
 */
export interface TpConsoleEntryAddDetail {
    /**
     * Entrée ajoutée.
     */
    entry: TpConsoleEntry;
}
/**
 * Détail de l’événement émis lorsque la console est vidée.
 *
 * @summary Représente l’effacement de la console.
 */
export interface TpConsoleClearDetail {
    /**
     * Nombre d’entrées supprimées.
     */
    removedCount: number;
}
/**
 * `<tp-console>` displays console output in light DOM.
 *
 * The component:
 * - stores a list of entries
 * - renders primitive values as text
 * - renders complex values with `<tp-object-tree>`
 * - exposes an API close to the browser console
 *
 * @summary Visual console for playground output.
 * @tagname tp-console
 *
 * @event tp-console-entry-add Emitted when an entry is added.
 * @eventdetail tp-console-entry-add { entry: TpConsoleEntry }
 * @event tp-console-clear Emitted when the console is cleared.
 * @eventdetail tp-console-clear { removedCount: number }
 * @cssprop --tp-console-bg Console background.
 * @cssprop --tp-console-color Console text color.
 * @cssprop --tp-console-border Console border color.
 * @cssprop --tp-console-entry-border Entry separator color.
 * @cssprop --tp-console-empty-color Empty state text color.
 * @cssprop --tp-console-string-color String value color.
 * @cssprop --tp-console-number-color Number value color.
 * @cssprop --tp-console-boolean-color Boolean value color.
 * @cssprop --tp-console-nullish-color Null and undefined value color.
 * @cssprop --tp-console-bigint-color BigInt value color.
 * @cssprop --tp-console-time-color Timestamp color.
 * @cssprop --tp-console-object-bg Object preview background.
 * @cssprop --tp-console-object-border Object preview border color.
 * @cssprop --tp-console-object-panel-bg Object tree panel background.
 * @cssprop --tp-console-object-key-color Object key color.
 * @cssprop --tp-console-object-summary-color Object summary text color.
 * @example
 * <tp-box data-intro-action="console" data-allow-script>
 *   <p>Inspect these example messages, then use Clear to empty the console.</p>
 *   <tp-console></tp-console>
 *   <p data-demo-status role="status"></p>
 *   <script src="/docs/components/_shared/introduction-actions.js"></script>
 * </tp-box>
 */
export declare class TpConsole extends TpBase {
    /**
     * Identifiant unique de la feuille de styles globale.
     *
     * @summary Identifiant du style injecté.
     * @internal
     */
    private static readonly styleId;
    /**
     * Entrées actuellement affichées.
     *
     * @summary Représente l’historique de la console.
     * @internal
     */
    private entries;
    /**
     * Compteur interne d’identifiants.
     *
     * @summary Génère des identifiants stables d’entrée.
     * @internal
     */
    private nextEntryId;
    /**
     * Conteneur principal des entrées.
     *
     * @summary Référence vers la zone de rendu.
     * @internal
     */
    private entriesEl;
    /**
     * Méthodes console originales sauvegardées.
     *
     * @summary Permet la restauration après redirection.
     * @internal
     */
    private originalConsole;
    /**
     * Indique si la console est actuellement redirigée.
     *
     * @summary Évite les redirections multiples.
     * @internal
     */
    private isRedirecting;
    private maxEntries;
    private groupDepth;
    private readonly counters;
    private readonly timers;
    /**
     * Liste des attributs observés.
     *
     * @summary Déclare les attributs observés.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * Adds a table entry.
     *
     * @summary Writes tabular data.
     * @param values Values to render as a table.
     */
    table(...values: TpConsoleValue[]): void;
    /**
     * Starts a visible group.
     *
     * @summary Starts an expanded group.
     * @param values Group label values.
     */
    group(...values: TpConsoleValue[]): void;
    /**
     * Starts a collapsed group.
     *
     * @summary Starts a collapsed group.
     * @param values Group label values.
     */
    groupCollapsed(...values: TpConsoleValue[]): void;
    /**
     * Ends the current group.
     *
     * @summary Ends the current group.
     */
    groupEnd(): void;
    /**
     * Writes an assertion failure when the condition is falsy.
     *
     * @summary Writes an assertion failure.
     * @param condition Assertion condition.
     * @param values Message values displayed when the condition is falsy.
     */
    assert(condition: unknown, ...values: TpConsoleValue[]): void;
    /**
     * Increments and writes a named counter.
     *
     * @summary Writes a counter value.
     * @param label Counter label.
     */
    count(label?: string): void;
    /**
     * Resets a named counter.
     *
     * @summary Resets a counter.
     * @param label Counter label.
     */
    countReset(label?: string): void;
    /**
     * Starts a named timer.
     *
     * @summary Starts a timer.
     * @param label Timer label.
     */
    time(label?: string): void;
    /**
     * Writes the current value of a named timer.
     *
     * @summary Writes a timer value.
     * @param label Timer label.
     * @param values Additional values to display.
     */
    timeLog(label?: string, ...values: TpConsoleValue[]): void;
    /**
     * Ends a named timer and writes its duration.
     *
     * @summary Ends a timer.
     * @param label Timer label.
     */
    timeEnd(label?: string): void;
    /**
     * Initialise le composant.
     *
     * @summary Initializes the structure and injects the styles.
     * @internal
     */
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    /**
     * Returns the current entries.
     *
     * @summary Returns a copy of the displayed entries.
     * @returns Current entries.
     */
    getEntries(): TpConsoleEntry[];
    /**
     * Returns the displayed console entries as plain text.
     *
     * @summary Returns the text copied by the toolbar copy button.
     * @returns Console content, one entry per line.
     */
    getValue(): string;
    /**
     * Adds an arbitrary entry.
     *
     * @summary Adds an entry to the console.
     * @param kind Entry kind.
     * @param values Values to display.
     * @returns Added entry.
     */
    addEntry(kind: TpConsoleEntryKind, values: TpConsoleValue[]): TpConsoleEntry;
    /**
     * Adds a `log` entry.
     *
     * @summary Writes a standard entry.
     * @param values Values to display.
     */
    log(...values: TpConsoleValue[]): void;
    /**
     * Adds an `info` entry.
     *
     * @summary Writes an informational entry.
     * @param values Values to display.
     */
    info(...values: TpConsoleValue[]): void;
    /**
     * Adds a `warn` entry.
     *
     * @summary Writes a warning entry.
     * @param values Values to display.
     */
    warn(...values: TpConsoleValue[]): void;
    /**
     * Adds an `error` entry.
     *
     * @summary Writes an error entry.
     * @param values Values to display.
     */
    error(...values: TpConsoleValue[]): void;
    /**
     * Clears the console.
     *
     * @summary Removes all entries.
     */
    clear(): void;
    /**
     * Redirects `window.console` calls to this component.
     *
     * The behavior:
     * - native methods are still called
     * - entries are duplicated in `<tp-console>`
     * - redirection is idempotent
     *
     * @summary Redirects global console calls to this component.
     * @returns Restore function.
     */
    redirectConsoleToSelf(): () => void;
    /**
     * Restores the original console methods.
     *
     * @summary Restores the original global console methods.
     */
    restoreConsole(): void;
    /**
     * Injecte la feuille de styles globale si nécessaire.
     *
     * @summary Injecte le style global du composant.
     * @internal
     */
    private ensureStyles;
    /**
     * Garantit que la structure DOM interne existe.
     *
     * @summary Crée ou réutilise la structure interne.
     * @internal
     */
    private ensureLayout;
    private formatCopyValue;
    /**
     * Rend complètement la console.
     *
     * @summary Reconstruit la liste des entrées.
     * @internal
     */
    private render;
    /**
     * Rend une entrée console.
     *
     * @summary Produit une ligne de console complète.
     * @param entry Entrée à rendre.
     * @returns Élément DOM correspondant.
     * @internal
     */
    private renderEntry;
    private renderConsoleValues;
    /**
     * Rend une valeur console.
     *
     * @summary Produit un rendu adapté au type de valeur.
     * @param value Valeur à afficher.
     * @returns Nœud DOM correspondant.
     * @internal
     */
    private renderValue;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-console": TpConsole;
    }
    interface HTMLElementEventMap {
        "tp-console-entry-add": CustomEvent<TpConsoleEntryAddDetail>;
        "tp-console-clear": CustomEvent<TpConsoleClearDetail>;
    }
}
