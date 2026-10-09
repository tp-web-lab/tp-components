// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-dragdrop
 * @summary Generic drag-and-drop controller for content.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../callout/callout.js";
import { type TpDragDropDropDetail, TpDragdrop } from "../dragdrop/dragdrop.js";
import style from "./matching.css?inline";

/** Identity colors deliberately exclude success and failure color families. */
const groupColors = [
	"tp-blue",
	"tp-violet",
	"tp-amber",
	"tp-cyan",
	"tp-orange",
	"tp-indigo",
] as const;

/** One-based author ranks, unaffected by display order. */
export interface TpMatchingPair {
	/** Rank in the first author list. */
	left: number;
	/** Rank in the second author list. */
	right: number;
}

/** One original rank per column; null denotes a member not yet selected. */
export interface TpMatchingGroup {
	/** Members in author column order, independent of display order. */
	items: (number | null)[];
}
/** Two columns retain the original pair format; larger exercises use groups. */
export type TpMatchingValue = TpMatchingPair[] | TpMatchingGroup[];

/** Validates and copies a snapshot without changing the component state. */
export function normalizeMatchingValue(
	value: unknown,
	columns: number,
	count: number,
	complete = false,
): TpMatchingGroup[] | null {
	if (
		!Array.isArray(value) ||
		columns < 2 ||
		!count ||
		(complete && value.length !== count)
	)
		return null;
	const used = Array.from({ length: columns }, () => new Set<number>());
	const result: TpMatchingGroup[] = [];
	for (const entry of value) {
		if (typeof entry !== "object" || entry === null) return null;
		const ranks: unknown =
			columns === 2 && "left" in entry && "right" in entry
				? [entry.left, entry.right]
				: "items" in entry
					? entry.items
					: null;
		if (!Array.isArray(ranks) || ranks.length !== columns) return null;
		const items: (number | null)[] = [];
		for (let side = 0; side < columns; side++) {
			const rank: unknown = ranks[side];
			if (rank === null && !complete) {
				items.push(null);
				continue;
			}
			if (
				typeof rank !== "number" ||
				!Number.isInteger(rank) ||
				rank < 1 ||
				rank > count ||
				used[side]?.has(rank)
			)
				return null;
			used[side]?.add(rank);
			items.push(rank);
		}
		if (items.filter((rank) => rank !== null).length < 2) return null;
		result.push({ items });
	}
	return result;
}

/** An original list item and its separate association controls. */
interface MatchingItem {
	/** Original node; rich content is never cloned or serialized. */
	node: HTMLLIElement;
	/** Original zero-based column. */
	side: number;
	/** Original one-based rank. */
	rank: number;
	/** Selectable drag handle, outside author content. */
	select: HTMLElement;
	/** Pair removal control. */
	clear: HTMLElement;
	/** Visible pair identity, also available to screen readers. */
	badge: HTMLElement;
	/** Author palette classes restored when this item is no longer associated. */
	authorColors: string[];
}

/**
 * @summary associates rich content from two or more optionally titled lists without grading the groups.
 * @tagname tp-matching
 * @attr {boolean} heading = false - Uses the first list as column headings instead of matchable items.
 * @attr {boolean} disabled = false - Disables association controls without disabling embedded media.
 * @event change Emitted after associations change; ranks refer to the original lists.
 * @eventdetail change { value: TpMatchingValue; complete: boolean }
 * @keyboard {Tab / Shift+Tab} Moves through association controls and interactive content.
 * @keyboard {Enter / Space} Selects an item or joins it to the selected group from another list.
 * @keyboard {Escape} Cancels the pending selection.
 * @accessibility Dedicated controls keep embedded links, media and components independently usable. Group numbers supplement color; column headings label their lists.
 * @example
 * <tp-matching>
 *   <ul><li>Hello</li><li>Thank you</li><li>Goodbye</li></ul>
 *   <ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol>
 * </tp-matching>
 */
export class TpMatching extends TpBase {
	/** Unique heading identifiers across instances. */
	private static nextHeading = 0;
	/** Author lists, retained on reconnect. */
	private lists: HTMLElement[] = [];
	private originalLists: HTMLElement[] | null = null;
	private headingSources: { source: HTMLElement; heading: HTMLElement }[] = [];
	/** Stable identities captured before any shuffle. */
	private items: MatchingItem[] = [];
	/** Current groups keyed by their stable visible identity. */
	private groups = new Map<number, (number | null)[]>();
	/** Next visible group number; unrelated to the expected answers. */
	private nextGroup = 1;
	/** Pending item for pointer and keyboard selection. */
	private selected: MatchingItem | null = null;
	/** Shared drag controller. */
	private drag: TpDragdrop | null = null;
	/** Live status for selection and pairing. */
	private status: HTMLElement | null = null;
	/** Authoring error, kept outside the original lists. */
	private error: HTMLElement | null = null;
	/** Watches late parser content until valid lists are available. */
	private readonly observer = new MutationObserver(() => this.initialize());

	/** Attributes with live effects. */
	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "disabled", "heading"];
	}
	/** Whether the first list contains column titles. @attr heading */
	public get heading(): boolean {
		return this.hasAttribute("heading");
	}
	public set heading(value: boolean) {
		this.toggleAttribute("heading", value);
	}
	/** Whether associations can be edited. */
	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}
	/** Adds or removes disabled association controls. */
	public set disabled(value: boolean) {
		this.toggleAttribute("disabled", value);
	}
	/** Number of author columns after initialization. */
	public get columnCount(): number {
		return this.lists.length;
	}
	/** Number of expected groups; zero for missing or unequal lists. */
	public get itemCount(): number {
		const counts = this.lists.map(
			(list) => list.querySelectorAll(":scope > li").length,
		);
		return counts.length >= 2 && counts.every((count) => count === counts[0])
			? (counts[0] ?? 0)
			: 0;
	}
	/** Whether all groups have exactly one member from every column. */
	public get complete(): boolean {
		return (
			this.itemCount > 0 &&
			this.groups.size === this.itemCount &&
			[...this.groups.values()].every((group) =>
				group.every((rank) => rank !== null),
			)
		);
	}
	/** Detached, deterministic snapshot; two columns retain the legacy pair format. */
	public get value(): TpMatchingValue {
		const groups = [...this.groups.values()];
		if (this.columnCount === 2)
			return groups
				.map((group) => ({ left: Number(group[0]), right: Number(group[1]) }))
				.sort((a, b) => a.left - b.left);
		return groups
			.map((items) => ({ items: [...items] }))
			.sort((a, b) =>
				JSON.stringify(a.items).localeCompare(JSON.stringify(b.items)),
			);
	}
	/** Restores valid unique members atomically; null marks missing multi-list members. */
	public set value(value: TpMatchingValue) {
		const groups = normalizeMatchingValue(
			value,
			this.columnCount,
			this.itemCount,
		);
		if (!groups)
			throw new RangeError(
				"Groups must use unique, valid one-based ranks from each list and contain at least two members.",
			);
		this.groups = new Map(
			groups.map((group, index) => [index + 1, group.items]),
		);
		this.nextGroup = groups.length + 1;
		this.selected = null;
		this.update();
	}
	/** Clears all groups and reshuffles every list; emits change when values changed. */
	public reset(): void {
		const changed = this.groups.size > 0;
		this.groups.clear();
		this.nextGroup = 1;
		this.selected = null;
		this.order();
		this.update();
		if (changed) this.emitChange();
	}
	/** Installs styles, delegates controls and waits for author lists. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-matching-styles", style);
		this.addEventListener("click", this.onClick);
		this.addEventListener("keydown", this.onKeyDown);
		if (!this.items.length) {
			this.observer.observe(this, { childList: true, subtree: true });
			this.initialize();
		}
	}
	/** Stops observers and delegated events without destroying author content. */
	public disconnectedCallback(): void {
		this.observer.disconnect();
		this.removeEventListener("click", this.onClick);
		this.removeEventListener("keydown", this.onKeyDown);
		this.selected = null;
		this.update();
	}
	/** Updates order and controls without reconstructing rich content. */
	protected override attributeChangedCallback(name: string): void {
		if (name === "heading" && this.originalLists && this.items.length) {
			this.groups.clear();
			this.selected = null;
			this.update();
			for (const { source, heading } of this.headingSources)
				source.append(...heading.childNodes);
			for (const item of this.items) {
				const content = item.node.querySelector(
					":scope > .tp-matching-content",
				);
				if (content) {
					item.node.prepend(...content.childNodes);
					content.remove();
				}
				item.select.parentElement?.remove();
			}
			this.lists.forEach((list, side) => {
				list.append(
					...this.items
						.filter((item) => item.side === side)
						.sort((a, b) => a.rank - b.rank)
						.map((item) => item.node),
				);
				list.removeAttribute("data-matching-list");
				list.removeAttribute("aria-labelledby");
			});
			this.replaceChildren(...this.originalLists);
			this.items = [];
			this.lists = [];
			this.headingSources = [];
			this.drag = null;
			this.status = null;
			this.nextGroup = 1;
			this.observer.observe(this, { childList: true, subtree: true });
			this.initialize();
			this.emitChange();
		} else if (name === "heading" && this.isConnected && !this.items.length)
			this.initialize();
		if (this.disabled) this.selected = null;
		this.update();
	}
	/** Validates bare lists or dt/dd titled columns, preserving all author item nodes. */
	private initialize(): void {
		if (this.items.length) return;
		const definition = this.querySelector(":scope > dl");
		const titles: HTMLElement[] = [];
		let valid = true;
		const lists = [...this.children].filter(
			(node): node is HTMLElement =>
				node instanceof HTMLElement && ["UL", "OL"].includes(node.tagName),
		);
		if (definition) {
			valid =
				lists.length === 0 && this.querySelectorAll(":scope > dl").length === 1;
			const children = [...definition.children];
			for (let index = 0; index < children.length; index += 2) {
				const title = children[index];
				const description = children[index + 1];
				const contained = description?.querySelectorAll(
					":scope > ul, :scope > ol",
				);
				if (
					!(title instanceof HTMLElement) ||
					title.tagName !== "DT" ||
					!title.textContent?.trim() ||
					description?.tagName !== "DD" ||
					contained?.length !== 1
				) {
					valid = false;
					break;
				}
				const list = contained[0];
				if (list instanceof HTMLElement) {
					titles.push(title);
					lists.push(list);
				}
			}
		}
		const authorLists = [...lists];
		let headerList: HTMLElement | undefined;
		if (this.heading && !definition) {
			headerList = lists.shift();
			const labels = [...(headerList?.children ?? [])].filter(
				(node): node is HTMLElement =>
					node instanceof HTMLElement && node.tagName === "LI",
			);
			valid =
				valid &&
				labels.length === lists.length &&
				labels.every((label) => !!label.textContent?.trim());
			titles.push(...labels);
		}
		const rows = lists.map((list) =>
			[...list.children].filter(
				(node): node is HTMLLIElement => node instanceof HTMLLIElement,
			),
		);
		if (
			!valid ||
			lists.length < 2 ||
			!rows[0]?.length ||
			rows.some((row) => row.length !== rows[0]?.length)
		) {
			if (!this.error) {
				this.error = document.createElement("tp-callout");
				this.error.setAttribute("variant", "warning");
				this.error.textContent =
					"Provide at least two nonempty ul or ol lists with the same number of items. With heading, the first list must contain one nonempty title per remaining column. Alternatively, use a dl with one dt and one dd containing a list per column.";
				this.append(this.error);
			}
			return;
		}
		this.observer.disconnect();
		this.error?.remove();
		this.error = null;
		this.lists = lists;
		if (!definition) this.originalLists = authorLists;
		this.style.setProperty("--tp-matching-columns", String(lists.length));
		lists.forEach((list, side) => {
			list.setAttribute("role", "list");
			list.setAttribute("data-matching-list", "");
			const title = titles[side];
			if (title) {
				const column = document.createElement("section");
				column.className = "tp-matching-column";
				const heading = document.createElement("h3");
				heading.id = `tp-matching-heading-${++TpMatching.nextHeading}`;
				heading.append(...title.childNodes);
				if (headerList) this.headingSources.push({ source: title, heading });
				list.setAttribute("aria-labelledby", heading.id);
				column.append(heading, list);
				this.append(column);
			}
		});
		definition?.remove();
		headerList?.remove();
		rows.forEach((row, side) => {
			row.forEach((node, index) => {
				const content = document.createElement("div");
				content.className = "tp-matching-content";
				content.append(...node.childNodes);
				const controls = document.createElement("div");
				controls.className = "tp-matching-controls";
				const select = document.createElement("tp-icon-button");
				select.className = "tp-matching-select";
				select.setAttribute("name", "link");
				select.setAttribute("label", "Select item");
				select.draggable = true;
				const clear = document.createElement("tp-icon-button");
				clear.setAttribute("name", "close");
				clear.setAttribute(
					"label",
					lists.length === 2 ? "Remove pair" : "Remove from group",
				);
				const badge = document.createElement("span");
				controls.append(badge, clear, select);
				node.append(content, controls);
				this.items.push({
					node,
					side,
					rank: index + 1,
					select,
					clear,
					badge,
					authorColors: groupColors.filter((color) =>
						node.classList.contains(color),
					),
				});
			});
		});
		this.status = document.createElement("p");
		this.status.className = "tp-matching-status";
		this.status.setAttribute("role", "status");
		this.drag = new TpDragdrop();
		this.drag.adapter = {
			root: this,
			getItem: (event) => this.itemFromEvent(event)?.node ?? null,
			canStart: (event) =>
				!this.disabled &&
				this.items.some(
					(item) =>
						event.target instanceof Node && item.select.contains(event.target),
				),
			canDrop: (target) =>
				!this.disabled &&
				this.selected !== null &&
				this.items.some(
					(item) => item.node === target && item.side !== this.selected?.side,
				),
			getPosition: () => "inside",
			getData: () => "tp-matching",
		};
		this.drag.addEventListener("tp-dragdrop-start", this.onDragStart);
		this.drag.addEventListener("tp-dragdrop-drop", this.onDrop);
		this.drag.addEventListener("tp-dragdrop-end", this.onDragEnd);
		this.append(this.status, this.drag);
		this.order();
		this.update();
	}
	/** Fisher–Yates shuffles each column independently, preserving original ranks. */
	private order(): void {
		this.lists.forEach((list, side) => {
			const nodes = this.items
				.filter((item) => item.side === side)
				.map((item) => item.node);
			for (let i = nodes.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				const first = nodes[i];
				const second = nodes[j];
				if (first && second) {
					nodes[i] = second;
					nodes[j] = first;
				}
			}
			list.append(...nodes);
		});
	}
	/** Resolves only this component's original items, excluding nested matchers. */
	private itemFromEvent(event: Event): MatchingItem | undefined {
		const target = event.target;
		if (!(target instanceof Element) || target.closest("tp-matching") !== this)
			return undefined;
		return this.items.find((item) => item.node.contains(target));
	}
	/** Selects cards or dedicated controls without intercepting embedded interactions. */
	private readonly onClick = (event: Event): void => {
		if (this.disabled || event.defaultPrevented) return;
		const item = this.itemFromEvent(event);
		if (!item || !(event.target instanceof Node)) return;
		if (item.clear.contains(event.target)) {
			this.unpair(item);
			this.selected = null;
			this.update();
			item.select.querySelector("button")?.focus();
			this.emitChange();
		} else if (item.select.contains(event.target)) this.choose(item);
		else {
			// Inspect the composed path so controls inside a shadow root are protected too.
			for (const target of event.composedPath()) {
				if (target === item.node) break;
				if (!(target instanceof Element)) continue;
				if (
					target.matches(
						'a, button, input, select, textarea, label, summary, audio, video, iframe, object, embed, [tabindex], [contenteditable]:not([contenteditable="false"]), [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="slider"], [role="textbox"], [role="combobox"], [role="listbox"], [role="menuitem"], [role="tab"], [role="spinbutton"]',
					) ||
					(target.localName.startsWith("tp-") && target.localName !== "tp-icon")
				)
					return;
			}
			this.choose(item);
		}
	};
	/** Cancels only a pending selection; embedded widgets keep other key events. */
	private readonly onKeyDown = (event: KeyboardEvent): void => {
		if (event.key !== "Escape" || !this.selected || !this.itemFromEvent(event))
			return;
		event.preventDefault();
		this.selected = null;
		this.update();
	};
	/** Adds or replaces one member in the selected group, retaining its other columns. */
	private choose(item: MatchingItem): void {
		if (this.selected && this.selected.side !== item.side) {
			const existing = this.groupOf(this.selected);
			if (existing?.[1][item.side] === item.rank) {
				this.selected = item;
				this.update();
				return;
			}
			this.unpair(item);
			const id = existing?.[0] ?? this.nextGroup++;
			const members =
				existing?.[1] ?? Array<number | null>(this.columnCount).fill(null);
			members[this.selected.side] = this.selected.rank;
			members[item.side] = item.rank;
			this.groups.set(id, members);
			if (members.every((rank) => rank !== null)) this.selected = null;
			this.update();
			this.emitChange();
		} else {
			this.selected = this.selected === item ? null : item;
			this.update();
		}
	}
	/** Finds the group containing one stable item identity. */
	private groupOf(item: MatchingItem): [number, (number | null)[]] | undefined {
		return [...this.groups].find(
			([, members]) => members[item.side] === item.rank,
		);
	}
	/** Removes only this member; groups with fewer than two members dissolve. */
	private unpair(item: MatchingItem): void {
		const group = this.groupOf(item);
		if (!group) return;
		group[1][item.side] = null;
		if (group[1].filter((rank) => rank !== null).length < 2)
			this.groups.delete(group[0]);
	}
	/** Starts selection through the shared drag controller. */
	private readonly onDragStart = (event: Event): void => {
		const source = (event as CustomEvent<{ source: HTMLElement }>).detail
			.source;
		this.selected = this.items.find((item) => item.node === source) ?? null;
		this.update();
	};
	/** Accepts drops only from this controller and into the opposite column. */
	private readonly onDrop = (event: Event): void => {
		const detail = (event as CustomEvent<TpDragDropDropDetail>).detail;
		const target = this.items.find((item) => item.node === detail.target);
		if (
			!this.disabled &&
			target &&
			this.selected &&
			target.side !== this.selected.side
		)
			this.choose(target);
	};
	/** Clears drag highlighting on drop or cancellation. */
	private readonly onDragEnd = (): void => {
		this.selected = null;
		this.update();
	};
	/** Reflects selected and paired states without touching embedded content. */
	private update(): void {
		for (const item of this.items) {
			const pair = this.groupOf(item);
			item.node.classList.remove(...groupColors);
			const color = pair
				? groupColors[(pair[0] - 1) % groupColors.length]
				: undefined;
			if (color) item.node.classList.add(color);
			else item.node.classList.add(...item.authorColors);
			const selected = this.selected === item;
			item.node.toggleAttribute("data-matching-selected", selected);
			item.node.toggleAttribute("data-matching-paired", !!pair);
			item.select.toggleAttribute("disabled", this.disabled);
			item.select.draggable = !this.disabled;
			item.select.setAttribute(
				"label",
				`${selected ? "Cancel selection of" : "Select"} list ${item.side + 1} item ${[...(item.node.parentElement?.children ?? [])].indexOf(item.node) + 1}`,
			);
			item.select
				.querySelector("button")
				?.setAttribute("aria-pressed", String(selected));
			item.clear.hidden = !pair;
			item.clear.toggleAttribute("disabled", this.disabled);
			item.badge.textContent = pair
				? `${this.columnCount === 2 ? "Pair" : "Group"} ${pair[0]}`
				: "";
		}
		if (this.status)
			this.status.textContent = this.selected
				? "Select an item in another list to continue this group. Escape cancels the selection."
				: `${[...this.groups.values()].filter((members) => members.every((rank) => rank !== null)).length} of ${this.itemCount} ${this.columnCount === 2 ? "pairs" : "groups"} complete.`;
	}
	/** Emits a serializable snapshot, without asserting whether answers are correct. */
	private emitChange(): void {
		this.dispatchEvent(
			new CustomEvent("change", {
				bubbles: true,
				composed: true,
				detail: {
					value: this.value,
					complete: this.complete,
				},
			}),
		);
	}
}

if (!customElements.get("tp-matching"))
	customElements.define("tp-matching", TpMatching);
declare global {
	interface HTMLElementTagNameMap {
		"tp-matching": TpMatching;
	}
}
