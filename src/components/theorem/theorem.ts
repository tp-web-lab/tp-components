/** @module components/theorem
 * @summary Theorems, definitions, examples, remarks and proofs.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import { isTpVariantType, type TpVariantType } from "../base/base.types.js";
import style from "./theorem.css?inline";
import { theoremNumbers } from "./theorem-numbering.js";
export const theoremTypes = [
	"theorem",
	"lemma",
	"proposition",
	"corollary",
	"definition",
	"example",
	"remark",
	"proof",
] as const;
export type TheoremType = (typeof theoremTypes)[number];
export type TheoremNumbering = "none" | "document" | "section" | "subsection";
interface Scope {
	observer: MutationObserver;
	members: Set<TpTheorem>;
	pending: boolean;
}
/**
 * The custom `<tp-theorem>` element presents theorems, lemmas, propositions, corollaries, definitions, examples, remarks and proofs with optional titles, numbering and references.
 *
 * @summary Presents theorems, lemmas, propositions, corollaries, definitions, examples, remarks and proofs with optional titles, numbering and references.
 * @tagname tp-theorem
 * @attr {string} type = "theorem" - Statement type: theorem, lemma, proposition, corollary, definition, example, remark or proof.
 * @attr {string} variant = "none" - Appearance: none (no border or background), neutral, brand, info, success, warning or danger.
 * @attr {string} heading = "" - Optional plain-text complementary title; a child with slot="heading" takes precedence.
 * @attr {string} number = "" - Explicit display number; an explicitly empty value suppresses numbering.
 * @attr {string} numbering = "document" - Automatic numbering: none, document, section or subsection; defaults to none for proofs.
 * @attr {string} counter = "" - Shared counter name; defaults to the statement type.
 * @attr {string} label = "" - Optional replacement for the usual type name.
 * @attr {string} qed = "" - Ending symbol; empty by default, or □ for proof when omitted. Explicit values, including empty, take priority.
 * @example
 * <tp-theorem type="theorem" heading="Nonnegativity" number="1" id="square">
 *   <p>The square of every real number is nonnegative.</p>
 * </tp-theorem>
 */
export class TpTheorem extends TpBase {
	private static scopes = new WeakMap<Node, Scope>();
	private scope?: Scope;
	private root?: Document | DocumentFragment;
	private headingElement: HTMLElement;
	private headingPrefix = document.createTextNode("");
	private headingSuffix = document.createTextNode("");
	private qedElement: HTMLElement;
	private currentNumber = "";
	public constructor() {
		super();
		this.headingElement = document.createElement("strong");
		this.headingElement.setAttribute("data-tp-theorem-generated", "heading");
		this.headingElement.append(this.headingPrefix, this.headingSuffix);
		this.qedElement = document.createElement("span");
		this.qedElement.setAttribute("data-tp-theorem-generated", "qed");
		this.qedElement.setAttribute("aria-label", "End of statement");
	}
	public static get observedAttributes(): string[] {
		return [
			"type",
			"variant",
			"heading",
			"number",
			"numbering",
			"counter",
			"label",
			"qed",
		];
	}
	/** Statement type. @attr type @default theorem */
	public get type():
		| "theorem"
		| "lemma"
		| "proposition"
		| "corollary"
		| "definition"
		| "example"
		| "remark"
		| "proof" {
		const value = this.getAttribute("type");
		return theoremTypes.includes(value as TheoremType)
			? (value as TheoremType)
			: "theorem";
	}
	public set type(value: TheoremType) {
		this.setAttribute("type", value);
	}
	/** Appearance variant. @attr variant @default none */
	public get variant():
		| "none"
		| "neutral"
		| "brand"
		| "info"
		| "success"
		| "warning"
		| "danger" {
		const value = this.getAttribute("variant");
		return value && isTpVariantType(value) ? value : "none";
	}
	public set variant(value: TpVariantType | "none") {
		this.setAttribute("variant", value);
	}
	/** Complementary title. @attr heading @default "" */
	public get heading(): string {
		return this.getAttribute("heading") || "";
	}
	public set heading(value: string) {
		this.setAttribute("heading", value);
	}
	/** Explicit number. @attr number @default "" */
	public get number(): string {
		return this.getAttribute("number") || "";
	}
	public set number(value: string) {
		this.setAttribute("number", value);
	}
	/** Numbering scope. @attr numbering @default document */
	public get numbering(): "none" | "document" | "section" | "subsection" {
		const value = this.getAttribute("numbering");
		return ["none", "document", "section", "subsection"].includes(value || "")
			? (value as TheoremNumbering)
			: this.type === "proof"
				? "none"
				: "document";
	}
	public set numbering(value: TheoremNumbering) {
		this.setAttribute("numbering", value);
	}
	/** Shared counter. @attr counter @default "" */
	public get counter(): string {
		return this.getAttribute("counter") || this.type;
	}
	public set counter(value: string) {
		this.setAttribute("counter", value);
	}
	/** Type label. @attr label @default "" */
	public get label(): string {
		return (
			this.getAttribute("label") ||
			this.type[0]?.toUpperCase() + this.type.slice(1)
		);
	}
	public set label(value: string) {
		this.setAttribute("label", value);
	}
	/** Ending symbol for any statement type. @attr qed @default "" */
	public get qed(): string {
		return this.getAttribute("qed") ?? (this.type === "proof" ? "□" : "");
	}
	public set qed(value: string) {
		this.setAttribute("qed", value);
	}
	/** Effective displayed number, including automatic numbering. */
	public get displayNumber(): string {
		return this.currentNumber;
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-theorem-styles", style);
		this.ensurePresentation();
		this.root = this.getRootNode() as Document | DocumentFragment;
		let scope = TpTheorem.scopes.get(this.root);
		if (!scope) {
			scope = {
				observer: new MutationObserver(() => {
					for (const member of scope?.members || []) {
						member.schedule();
						break;
					}
				}),
				members: new Set(),
				pending: false,
			};
			TpTheorem.scopes.set(this.root, scope);
			scope.observer.observe(this.root, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [...TpTheorem.observedAttributes, "slot"],
			});
		}
		this.scope = scope;
		scope.members.add(this);
		this.schedule();
	}
	protected disconnectedCallback(): void {
		const scope = this.scope;
		scope?.members.delete(this);
		if (scope && !scope.members.size) {
			scope.observer.disconnect();
			if (this.root) TpTheorem.scopes.delete(this.root);
		} else this.schedule();
	}
	protected attributeChangedCallback(): void {
		this.schedule();
	}
	private schedule(): void {
		const scope = this.scope,
			root = this.root;
		if (!scope || !root || scope.pending) return;
		scope.pending = true;
		queueMicrotask(() => {
			scope.pending = false;
			TpTheorem.refresh(root);
		});
	}
	private ensurePresentation(): void {
		for (const element of this.querySelectorAll(
			":scope > [data-tp-theorem-generated]",
		))
			if (element !== this.headingElement && element !== this.qedElement) {
				for (const heading of element.querySelectorAll(
					':scope > [slot="heading"]',
				))
					this.prepend(heading);
				element.remove();
			}
		if (this.firstChild !== this.headingElement)
			this.prepend(this.headingElement);
		if (this.lastChild !== this.qedElement) this.append(this.qedElement);
	}
	private static refresh(root: Document | DocumentFragment): void {
		for (const [node, number] of theoremNumbers(root)) {
			if (!(node instanceof TpTheorem)) continue;
			node.ensurePresentation();
			node.currentNumber = number;
			const rich =
				node.querySelector(':scope > [slot="heading"]') ??
				node.headingElement.querySelector(':scope > [slot="heading"]');
			if (rich && rich.parentNode !== node.headingElement) {
				for (const previous of node.headingElement.querySelectorAll(
					':scope > [slot="heading"]',
				))
					previous.remove();
				node.headingElement.insertBefore(rich, node.headingSuffix);
			}
			const prefix = `${node.label}${number ? ` ${number}` : ""}${rich ? " (" : node.heading ? ` (${node.heading}).` : "."}`;
			if (node.headingPrefix.data !== prefix) node.headingPrefix.data = prefix;
			const suffix = rich ? ")." : "";
			if (node.headingSuffix.data !== suffix) node.headingSuffix.data = suffix;
			if (node.qedElement.textContent !== node.qed)
				node.qedElement.textContent = node.qed;
			node.qedElement.hidden = !node.qed;
		}
	}
}
if (!customElements.get("tp-theorem"))
	customElements.define("tp-theorem", TpTheorem);
declare global {
	interface HTMLElementTagNameMap {
		"tp-theorem": TpTheorem;
	}
}
