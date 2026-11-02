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
 * @example
 * <tp-box data-intro-action="console" data-allow-script>
 *   <p>Inspect these example messages, then use Clear to empty the console.</p>
 *   <tp-console></tp-console>
 *   <p data-demo-status role="status"></p>
 *   <script src="/docs/components/_shared/introduction-actions.js"></script>
 * </tp-box>
 * @cssprop [--tp-console-bg=#0d1117] Console background.
 * @cssprop [--tp-console-bigint-color=#bc8cff] BigInt value color.
 * @cssprop [--tp-console-boolean-color=#ffa657] Boolean value color.
 * @cssprop [--tp-console-border=#30363d] Console border color.
 * @cssprop [--tp-console-circular-color=#f2cc60] Text color of circular-reference markers in expanded objects.
 * @cssprop [--tp-console-color=#e6edf3] Console text color.
 * @cssprop [--tp-console-date-color=#7ee787] Text color of Date values in expanded objects.
 * @cssprop [--tp-console-depth=0] Unitless group nesting depth of a log entry; each level adds 1rem of leading indentation. Assigned internally per entry.
 * @cssprop [--tp-console-empty-color=#8b949e] Empty state text color.
 * @cssprop [--tp-console-entry-bg=transparent] Background of an individual log entry.
 * @cssprop [--tp-console-entry-border=#21262d] Entry separator color.
 * @cssprop [--tp-console-error-color=#ff7b72] Text color of Error values in expanded objects.
 * @cssprop [--tp-console-function-color=#d2a8ff] Text color of function summaries in expanded objects.
 * @cssprop [--tp-console-kind-accent=#8b949e] Text color and background tint of the log-level badge; assigned by the entry level.
 * @cssprop [--tp-console-nullish-color=#8b949e] Null and undefined value color.
 * @cssprop [--tp-console-number-color=#79c0ff] Number value color.
 * @cssprop [--tp-console-object-bg=#11161d] Object preview background.
 * @cssprop [--tp-console-object-border=#30363d] Object preview border color.
 * @cssprop [--tp-console-object-key-color=#c9d1d9] Object key color.
 * @cssprop [--tp-console-object-marker-color=#8b949e] Color of the triangle used to expand or collapse an object preview.
 * @cssprop [--tp-console-object-panel-bg=#0f141a] Object tree panel background.
 * @cssprop [--tp-console-object-separator-color=#8b949e] Color of the separator between a property name and its value in expanded objects.
 * @cssprop [--tp-console-object-summary-bg=#161b22] Background of the clickable summary row of an object preview.
 * @cssprop [--tp-console-object-summary-color=#c9d1d9] Object summary text color.
 * @cssprop [--tp-console-string-color=#a5d6ff] String value color.
 * @cssprop [--tp-console-time-color=#8b949e] Timestamp color.
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
     * @summary Adds an assertion-failure entry only when condition is falsy, including the supplied values.
     */
    assert(condition: unknown, ...values: TpConsoleValue[]): void;
    /**
     * @summary Increments the counter associated with label and displays its new value; a new counter starts at one.
     */
    count(label?: string): void;
    /**
     * @summary Resets the counter associated with label so its next count starts again at one.
     */
    countReset(label?: string): void;
    /**
     * @summary Starts or restarts the elapsed-time measurement associated with label.
     */
    time(label?: string): void;
    /**
     * @summary Displays elapsed milliseconds for label with any additional values, without stopping the timer.
     */
    timeLog(label?: string, ...values: TpConsoleValue[]): void;
    /**
     * @summary Displays elapsed milliseconds for label and removes the timer.
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
     * @summary Appends an entry of kind containing values, rerenders the console and returns the created entry record.
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
     * @summary Routes global console methods to this component and returns a cleanup function that restores the previous methods.
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
