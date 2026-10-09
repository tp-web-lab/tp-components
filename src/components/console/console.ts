/**
 * @module components/console
 * @summary Displays structured console output.
 */

// tp-docgen:dependencies:start
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
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./console.css?inline";

import "../icon-button/icon-button.js";
import "../copy-code/copy-code.js";
import "../object-tree/object-tree.js";

import type { TpCopyCode } from "../copy-code/copy-code.js";
import type { TpObjectTree } from "../object-tree/object-tree.js";

/**
 * Niveaux de sortie supportés par la console.
 *
 * @summary Représente la nature d’une entrée console.
 */
export type TpConsoleEntryKind =
	| "log"
	| "info"
	| "warn"
	| "error"
	| "table"
	| "group"
	| "group-collapsed"
	| "group-end"
	| "assert"
	| "count"
	| "time";

/**
 * Valeur primitive affichable directement.
 *
 * @summary Représente une valeur simple rendue comme texte.
 */
type TpConsolePrimitive = string | number | boolean | null | undefined | bigint;

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
 * Signature d’une méthode console.
 *
 * @summary Fonction console standard.
 * @internal
 */
type TpConsoleMethod = (...args: unknown[]) => void;

/**
 * Snapshot des méthodes console originales.
 *
 * @summary Permet de restaurer l’état initial.
 * @internal
 */
interface TpConsoleOriginalMethods {
	log: TpConsoleMethod;
	info: TpConsoleMethod;
	warn: TpConsoleMethod;
	error: TpConsoleMethod;
	clear: () => void;
}

/**
 * Indique si une valeur est primitive au sens de l’affichage console.
 *
 * @summary Détecte une valeur directement rendable sous forme textuelle.
 * @param value Valeur à tester.
 * @returns `true` si la valeur est primitive.
 * @internal
 */
function isConsolePrimitive(value: unknown): value is TpConsolePrimitive {
	return (
		value === null ||
		value === undefined ||
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean" ||
		typeof value === "bigint"
	);
}

/**
 * Indique si une valeur est une fonction appelable.
 *
 * @summary Type guard pour fonction JavaScript.
 * @param value Valeur à tester.
 * @returns `true` si la valeur est une fonction.
 * @internal
 */
function isCallable(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

/**
 * Convertit une valeur primitive en résumé textuel.
 *
 * @summary Formate une primitive pour affichage.
 * @param value Valeur primitive.
 * @returns Chaîne affichable.
 * @internal
 */
function formatPrimitive(value: TpConsolePrimitive): string {
	if (value === null) {
		return "null";
	}

	if (value === undefined) {
		return "undefined";
	}

	if (typeof value === "string") {
		return `"${value}"`;
	}

	if (typeof value === "bigint") {
		return `${String(value)}n`;
	}

	return String(value);
}

/**
 * Retourne un résumé court pour une valeur complexe.
 *
 * @summary Produit un texte de synthèse pour l’affichage inline.
 * @param value Valeur source.
 * @returns Résumé textuel.
 * @internal
 */
function getValueSummary(value: unknown): string {
	if (isConsolePrimitive(value)) {
		return formatPrimitive(value);
	}

	if (value instanceof Error) {
		return `${value.name}: ${value.message}`;
	}

	if (value instanceof Date) {
		return `Date(${value.toISOString()})`;
	}

	if (Array.isArray(value)) {
		return `Array(${value.length})`;
	}

	if (isCallable(value)) {
		return `Function(${value.name !== "" ? value.name : "(anonymous)"})`;
	}

	if (typeof value === "object" && value !== null) {
		const entries = Object.keys(value).length;
		return `Object(${entries})`;
	}

	return String(value);
}

/**
 * Retourne un horodatage local court.
 *
 * @summary Formate l’heure d’une entrée.
 * @param timestamp Horodatage Unix en millisecondes.
 * @returns Heure courte.
 * @internal
 */
function formatTimestamp(timestamp: number): string {
	return new Date(timestamp).toLocaleTimeString();
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
export class TpConsole extends TpBase {
	/**
	 * Identifiant unique de la feuille de styles globale.
	 *
	 * @summary Identifiant du style injecté.
	 * @internal
	 */
	private static readonly styleId = "tp-console-styles";

	/**
	 * Entrées actuellement affichées.
	 *
	 * @summary Représente l’historique de la console.
	 * @internal
	 */
	private entries: TpConsoleEntry[] = [];

	/**
	 * Compteur interne d’identifiants.
	 *
	 * @summary Génère des identifiants stables d’entrée.
	 * @internal
	 */
	private nextEntryId = 1;

	/**
	 * Conteneur principal des entrées.
	 *
	 * @summary Référence vers la zone de rendu.
	 * @internal
	 */
	private entriesEl: HTMLDivElement | null = null;

	/**
	 * Méthodes console originales sauvegardées.
	 *
	 * @summary Permet la restauration après redirection.
	 * @internal
	 */
	private originalConsole: TpConsoleOriginalMethods | null = null;

	/**
	 * Indique si la console est actuellement redirigée.
	 *
	 * @summary Évite les redirections multiples.
	 * @internal
	 */
	private isRedirecting = false;

	private maxEntries = 500;

	private groupDepth = 0;
	// private collapsedGroupDepths = new Set<number>();

	private readonly counters = new Map<string, number>();
	private readonly timers = new Map<string, number>();

	/**
	 * Liste des attributs observés.
	 *
	 * @summary Déclare les attributs observés.
	 * @internal
	 */
	public static get observedAttributes(): string[] {
		return [];
	}

	/**
	 * Adds a table entry.
	 *
	 * @summary Writes tabular data.
	 * @param values Values to render as a table.
	 */
	public table(...values: TpConsoleValue[]): void {
		this.addEntry("table", values);
	}

	/**
	 * Starts a visible group.
	 *
	 * @summary Starts an expanded group.
	 * @param values Group label values.
	 */
	public group(...values: TpConsoleValue[]): void {
		this.addEntry("group", values);
	}

	/**
	 * Starts a collapsed group.
	 *
	 * @summary Starts a collapsed group.
	 * @param values Group label values.
	 */
	public groupCollapsed(...values: TpConsoleValue[]): void {
		this.addEntry("group-collapsed", values);
	}

	/**
	 * Ends the current group.
	 *
	 * @summary Ends the current group.
	 */
	public groupEnd(): void {
		this.addEntry("group-end", []);
	}

	/**
	 * Writes an assertion failure when the condition is falsy.
	 *
	 * @summary Writes an assertion failure.
	 * @param condition Assertion condition.
	 * @param values Message values displayed when the condition is falsy.
	 */
	public assert(condition: unknown, ...values: TpConsoleValue[]): void {
		if (condition) {
			return;
		}

		this.addEntry("assert", values.length > 0 ? values : ["Assertion failed"]);
	}

	/**
	 * Increments and writes a named counter.
	 *
	 * @summary Writes a counter value.
	 * @param label Counter label.
	 */
	public count(label = "default"): void {
		const nextValue = (this.counters.get(label) ?? 0) + 1;
		this.counters.set(label, nextValue);
		this.addEntry("count", [`${label}: ${nextValue}`]);
	}

	/**
	 * Resets a named counter.
	 *
	 * @summary Resets a counter.
	 * @param label Counter label.
	 */
	public countReset(label = "default"): void {
		if (!this.counters.has(label)) {
			this.addEntry("warn", [`Count for '${label}' does not exist`]);
			return;
		}

		this.counters.set(label, 0);
	}

	/**
	 * Starts a named timer.
	 *
	 * @summary Starts a timer.
	 * @param label Timer label.
	 */
	public time(label = "default"): void {
		this.timers.set(label, performance.now());
	}

	/**
	 * Writes the current value of a named timer.
	 *
	 * @summary Writes a timer value.
	 * @param label Timer label.
	 * @param values Additional values to display.
	 */
	public timeLog(label = "default", ...values: TpConsoleValue[]): void {
		const start = this.timers.get(label);

		if (start === undefined) {
			this.addEntry("warn", [`Timer '${label}' does not exist`]);
			return;
		}

		const duration = performance.now() - start;
		this.addEntry("time", [`${label}: ${duration.toFixed(2)} ms`, ...values]);
	}

	/**
	 * Ends a named timer and writes its duration.
	 *
	 * @summary Ends a timer.
	 * @param label Timer label.
	 */
	public timeEnd(label = "default"): void {
		const start = this.timers.get(label);

		if (start === undefined) {
			this.addEntry("warn", [`Timer '${label}' does not exist`]);
			return;
		}

		const duration = performance.now() - start;
		this.timers.delete(label);
		this.addEntry("time", [`${label}: ${duration.toFixed(2)} ms`]);
	}

	/**
	 * Initialise le composant.
	 *
	 * @summary Initializes the structure and injects the styles.
	 * @internal
	 */
	protected connectedCallback(): void {
		super.connectedCallback();
		this.ensureStyles();
		this.ensureLayout();
		this.render();
	}

	protected disconnectedCallback(): void {
		this.restoreConsole();
	}

	/**
	 * Returns the current entries.
	 *
	 * @summary Returns a copy of the displayed entries.
	 * @returns Current entries.
	 */
	public getEntries(): TpConsoleEntry[] {
		return this.entries.map((entry) => ({
			id: entry.id,
			kind: entry.kind,
			values: [...entry.values],
			timestamp: entry.timestamp,
			depth: entry.depth,
			collapsed: entry.collapsed,
		}));
	}

	/**
	 * Returns the displayed console entries as plain text.
	 *
	 * @summary Returns the text copied by the toolbar copy button.
	 * @returns Console content, one entry per line.
	 */
	public getValue(): string {
		return this.entries
			.filter((entry) => entry.kind !== "group-end")
			.map((entry) => {
				const values = entry.values
					.map((value) => this.formatCopyValue(value))
					.join(" ");
				const indent = "  ".repeat(entry.depth);
				return `${indent}${entry.kind.toUpperCase()} ${formatTimestamp(entry.timestamp)} ${values}`.trimEnd();
			})
			.join("\n");
	}

	/**
	 * Adds an arbitrary entry.
	 *
	 * @summary Adds an entry to the console.
	 * @param kind Entry kind.
	 * @param values Values to display.
	 * @returns Added entry.
	 */
	public addEntry(
		kind: TpConsoleEntryKind,
		values: TpConsoleValue[],
	): TpConsoleEntry {
		const isGroupEnd = kind === "group-end";

		if (isGroupEnd) {
			this.groupDepth = Math.max(0, this.groupDepth - 1);
		}

		const entry: TpConsoleEntry = {
			id: this.nextEntryId,
			kind,
			values: [...values],
			timestamp: Date.now(),
			depth: this.groupDepth,
			collapsed: kind === "group-collapsed",
		};

		if (kind === "group" || kind === "group-collapsed") {
			this.groupDepth += 1;
		}

		this.nextEntryId += 1;
		this.entries = [...this.entries, entry];

		if (this.entries.length > this.maxEntries) {
			this.entries = this.entries.slice(-this.maxEntries);
		}

		this.render();

		this.dispatchEvent(
			new CustomEvent<TpConsoleEntryAddDetail>("tp-console-entry-add", {
				bubbles: true,
				detail: {
					entry,
				},
			}),
		);

		return entry;
	}

	/**
	 * Adds a `log` entry.
	 *
	 * @summary Writes a standard entry.
	 * @param values Values to display.
	 */
	public log(...values: TpConsoleValue[]): void {
		this.addEntry("log", values);
	}

	/**
	 * Adds an `info` entry.
	 *
	 * @summary Writes an informational entry.
	 * @param values Values to display.
	 */
	public info(...values: TpConsoleValue[]): void {
		this.addEntry("info", values);
	}

	/**
	 * Adds a `warn` entry.
	 *
	 * @summary Writes a warning entry.
	 * @param values Values to display.
	 */
	public warn(...values: TpConsoleValue[]): void {
		this.addEntry("warn", values);
	}

	/**
	 * Adds an `error` entry.
	 *
	 * @summary Writes an error entry.
	 * @param values Values to display.
	 */
	public error(...values: TpConsoleValue[]): void {
		this.addEntry("error", values);
	}

	/**
	 * Clears the console.
	 *
	 * @summary Removes all entries.
	 */
	public clear(): void {
		const removedCount = this.entries.length;
		this.entries = [];
		this.counters.clear();
		this.timers.clear();
		this.groupDepth = 0;

		this.ensureLayout();

		if (this.entriesEl instanceof HTMLDivElement) {
			this.entriesEl.replaceChildren();
		}

		this.dispatchEvent(
			new CustomEvent<TpConsoleClearDetail>("tp-console-clear", {
				bubbles: true,
				detail: { removedCount },
			}),
		);
	}

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
	public redirectConsoleToSelf(): () => void {
		if (this.isRedirecting) {
			return () => this.restoreConsole();
		}

		const original: TpConsoleOriginalMethods = {
			log: console.log.bind(console),
			info: console.info.bind(console),
			warn: console.warn.bind(console),
			error: console.error.bind(console),
			clear: console.clear.bind(console),
		};

		this.originalConsole = original;
		this.isRedirecting = true;

		const wrap =
			(kind: TpConsoleEntryKind, fn: TpConsoleMethod): TpConsoleMethod =>
			(...args: unknown[]): void => {
				try {
					// appel natif
					fn(...args);
				} finally {
					// ajout dans le composant
					this.addEntry(kind, args);
				}
			};

		console.log = wrap("log", original.log);
		console.info = wrap("info", original.info);
		console.warn = wrap("warn", original.warn);
		console.error = wrap("error", original.error);
		console.clear = () => {
			original.clear();
			this.clear();
		};
		return () => {
			this.restoreConsole();
		};
	}

	/**
	 * Restores the original console methods.
	 *
	 * @summary Restores the original global console methods.
	 */
	public restoreConsole(): void {
		if (!this.isRedirecting || this.originalConsole === null) {
			return;
		}

		console.log = this.originalConsole.log;
		console.info = this.originalConsole.info;
		console.warn = this.originalConsole.warn;
		console.error = this.originalConsole.error;
		console.clear = this.originalConsole.clear;

		this.originalConsole = null;
		this.isRedirecting = false;
	}

	/**
	 * Injecte la feuille de styles globale si nécessaire.
	 *
	 * @summary Injecte le style global du composant.
	 * @internal
	 */
	private ensureStyles(): void {
		if (document.getElementById(TpConsole.styleId)) {
			return;
		}

		const styleEl = document.createElement("style");
		styleEl.id = TpConsole.styleId;
		styleEl.textContent = style;
		document.head.append(styleEl);
	}

	/**
	 * Garantit que la structure DOM interne existe.
	 *
	 * @summary Crée ou réutilise la structure interne.
	 * @internal
	 */
	private ensureLayout(): void {
		const existingRoot = this.querySelector("[data-tp-console-root]");
		if (existingRoot instanceof HTMLDivElement) {
			const entries = existingRoot.querySelector("[data-tp-console-entries]");

			this.entriesEl = entries instanceof HTMLDivElement ? entries : null;
			return;
		}

		const root = document.createElement("div");
		root.setAttribute("data-tp-console-root", "");

		const header = document.createElement("div");
		header.setAttribute("data-tp-console-header", "");

		const left = document.createElement("div");
		left.setAttribute("data-tp-console-header-left", "");

		const right = document.createElement("div");
		right.setAttribute("data-tp-console-header-right", "");

		// 👉 titre à gauche
		const title = document.createElement("span");
		title.setAttribute("data-tp-console-title", "");
		title.textContent = "Console";

		const copyBtn = document.createElement("tp-copy-code") as TpCopyCode;
		copyBtn.setAttribute("copied-text", "Console copied!");
		copyBtn.setAttribute("title", "Copy console");
		copyBtn.forElement = this;

		// 👉 bouton à droite
		const clearBtn = document.createElement("tp-icon-button");
		clearBtn.setAttribute("name", "close");
		clearBtn.setAttribute("label", "Clear console");
		clearBtn.setAttribute("title", "Clear console");

		clearBtn.addEventListener("click", (event) => {
			event.stopPropagation();
			this.clear();
		});

		left.append(title);
		right.append(copyBtn, clearBtn);

		header.append(left, right);

		const entries = document.createElement("div");
		entries.setAttribute("data-tp-console-entries", "");

		root.append(header, entries);
		this.append(root);

		this.entriesEl = entries;
	}

	private formatCopyValue(value: TpConsoleValue): string {
		if (isConsolePrimitive(value)) return formatPrimitive(value);
		if (value instanceof Error)
			return value.stack ?? `${value.name}: ${value.message}`;
		try {
			const serialized = JSON.stringify(value);
			return serialized ?? getValueSummary(value);
		} catch {
			return getValueSummary(value);
		}
	}

	/**
	 * Rend complètement la console.
	 *
	 * @summary Reconstruit la liste des entrées.
	 * @internal
	 */
	private render(): void {
		this.ensureLayout();

		if (this.entriesEl === null) {
			return;
		}

		this.entriesEl.replaceChildren();

		let hiddenDepth: number | null = null;

		for (const entry of this.entries) {
			if (entry.kind === "group-end") {
				continue;
			}
			if (hiddenDepth !== null) {
				if (entry.depth > hiddenDepth) {
					continue;
				}

				hiddenDepth = null;
			}

			this.entriesEl.append(this.renderEntry(entry));

			if (
				(entry.kind === "group" || entry.kind === "group-collapsed") &&
				entry.collapsed === true
			) {
				hiddenDepth = entry.depth;
			}
		}

		this.entriesEl.scrollTop = this.entriesEl.scrollHeight;
	}

	/**
	 * Rend une entrée console.
	 *
	 * @summary Produit une ligne de console complète.
	 * @param entry Entrée à rendre.
	 * @returns Élément DOM correspondant.
	 * @internal
	 */
	private renderEntry(entry: TpConsoleEntry): HTMLDivElement {
		const line = document.createElement("div");
		line.setAttribute("data-tp-console-entry", "");
		line.setAttribute("data-kind", entry.kind);
		line.setAttribute("data-entry-id", String(entry.id));
		line.style.setProperty("--tp-console-depth", String(entry.depth));

		if (entry.kind === "group" || entry.kind === "group-collapsed") {
			line.setAttribute("data-tp-console-group-toggle", "");

			line.addEventListener("click", () => {
				entry.collapsed = !entry.collapsed;
				this.render();
			});
		}

		const meta = document.createElement("div");
		meta.setAttribute("data-tp-console-meta", "");

		const kind = document.createElement("span");
		kind.setAttribute("data-tp-console-kind", "");
		kind.textContent =
			entry.kind === "group" || entry.kind === "group-collapsed"
				? entry.collapsed
					? "▶"
					: "▼"
				: entry.kind;

		const time = document.createElement("span");
		time.setAttribute("data-tp-console-time", "");
		time.textContent = formatTimestamp(entry.timestamp);

		meta.append(kind, time);

		const values = document.createElement("div");
		values.setAttribute("data-tp-console-values", "");

		if (entry.kind === "assert") {
			const prefix = document.createElement("span");
			prefix.textContent = "✗ ";
			prefix.style.color = "red";
			prefix.style.fontWeight = "bold";

			values.append(prefix);
		}

		this.renderConsoleValues(values, entry.values);

		line.append(meta, values);
		return line;
	}

	private renderConsoleValues(
		container: HTMLElement,
		values: TpConsoleValue[],
	): void {
		const [first, second, ...rest] = values;

		if (
			typeof first === "string" &&
			first.includes("%c") &&
			typeof second === "string"
		) {
			const styled = document.createElement("span");
			styled.setAttribute("data-tp-console-value", "");
			styled.setAttribute("data-kind", "string");

			styled.textContent = first.replaceAll("%c", "");
			styled.setAttribute("style", second);

			container.append(styled);

			for (const value of rest) {
				container.append(this.renderValue(value));
			}

			return;
		}

		for (const value of values) {
			container.append(this.renderValue(value));
		}
	}

	/**
	 * Rend une valeur console.
	 *
	 * @summary Produit un rendu adapté au type de valeur.
	 * @param value Valeur à afficher.
	 * @returns Nœud DOM correspondant.
	 * @internal
	 */
	private renderValue(value: TpConsoleValue): HTMLElement {
		if (isConsolePrimitive(value)) {
			const el = document.createElement("span");
			el.setAttribute("data-tp-console-value", "");
			el.setAttribute("data-kind", value === null ? "null" : typeof value);
			el.textContent = formatPrimitive(value);
			return el;
		}

		if (Array.isArray(value) && value.every((v) => typeof v === "object")) {
			const table = document.createElement("table");
			table.setAttribute("data-tp-console-table", "");

			const keys = Array.from(
				new Set(
					value.flatMap((obj) => Object.keys(obj as Record<string, unknown>)),
				),
			);

			const thead = document.createElement("thead");
			const headRow = document.createElement("tr");

			for (const key of keys) {
				const th = document.createElement("th");
				th.textContent = key;
				headRow.append(th);
			}

			thead.append(headRow);
			table.append(thead);

			const tbody = document.createElement("tbody");

			for (const row of value) {
				const tr = document.createElement("tr");

				for (const key of keys) {
					const td = document.createElement("td");
					const cell = (row as Record<string, unknown>)[key];
					td.textContent = getValueSummary(cell);
					tr.append(td);
				}

				tbody.append(tr);
			}

			table.append(tbody);
			return table;
		}

		const wrapper = document.createElement("details");
		wrapper.setAttribute("data-tp-console-object", "");

		const summary = document.createElement("summary");
		summary.textContent = getValueSummary(value);

		const tree = document.createElement("tp-object-tree") as TpObjectTree;
		tree.setValue(value);

		wrapper.append(summary, tree);
		return wrapper;
	}
}

if (!customElements.get("tp-console")) {
	customElements.define("tp-console", TpConsole);
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
