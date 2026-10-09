/**
 * @module components/flip-card
 * @summary Two-sided card component.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import style from "./flip-card.css?inline";
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";

type FlipCardSide = "recto" | "verso";
type FlipCardBlockPosition = "top" | "bottom" | "none";
type FlipCardInlinePosition = "start" | "center" | "end" | "none";

const FLIP_CARD_SIDES: FlipCardSide[] = ["recto", "verso"];

/**
 * Displays a two-sided card that can be flipped.
 *
 * @summary Displays a two-sided card.
 * @tagname tp-flip-card
 * @attr {boolean} disabled = false - Prevents the card from being flipped.
 * @attr {boolean} fit-content = false - Adapts the card dimensions to its verso content.
 * @attr {boolean} flipped = false - Shows the verso when present.
 * @attr {string} button-position = "bottom end" - Position of the overlaid flip button, or none to hide it.
 * @event tp-flip-card-change Emitted after the visible side changes.
 * @cssprop --tp-flip-card-aspect-ratio Card aspect ratio.
 * @cssprop --tp-flip-card-background Card face background.
 * @cssprop --tp-flip-card-border-color Card border color.
 * @cssprop --tp-flip-card-border-radius Card border radius.
 * @cssprop --tp-flip-card-button-offset Distance between the button and the card edge.
 * @cssprop --tp-flip-card-padding Card face padding.
 * @cssprop --tp-flip-card-width Card width.
 * @example
 * <tp-flip-card></tp-flip-card>
 */
export class TpFlipCard extends TpBase {
	private static readonly styleId = "tp-flip-card-styles";

	public static get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"disabled",
			"flipped",
			"button-position",
		];
	}

	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}

	public set disabled(value: boolean) {
		this.toggleAttribute("disabled", value);
	}

	public get flipped(): boolean {
		return this.hasAttribute("flipped");
	}

	public set flipped(value: boolean) {
		this.toggleAttribute("flipped", value);
	}

	public get buttonPosition(): string {
		return this.getAttribute("button-position") ?? "bottom end";
	}

	public set buttonPosition(value: string) {
		this.setAttribute("button-position", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpFlipCard.styleId, style);
		this.classList.add("tp-flip-card");

		if (this.dataset.tpFlipCardRendered !== "true") {
			this.renderFromDefinitionList();
		}

		this.syncState();
	}

	public attributeChangedCallback(): void {
		if (this.isConnected && this.dataset.tpFlipCardRendered === "true") {
			this.syncState();
		}
	}

	/** Flips the card and returns its new state. */
	public flip(): boolean {
		if (this.disabled) {
			return this.flipped;
		}

		this.flipped = !this.flipped;
		this.dispatchEvent(
			new CustomEvent("tp-flip-card-change", {
				bubbles: true,
				detail: { flipped: this.flipped },
			}),
		);
		return this.flipped;
	}

	private renderFromDefinitionList(): void {
		const definitionList = Array.from(this.children).find(
			(child): child is HTMLDListElement => child.tagName === "DL",
		);

		if (!definitionList) {
			this.renderError("tp-flip-card requires a definition list");
			return;
		}

		const content = new Map<FlipCardSide, Node[]>();
		let currentSide: FlipCardSide | null = null;

		for (const child of Array.from(definitionList.children)) {
			if (child.tagName === "DT") {
				const key = child.textContent?.trim().toLowerCase() ?? "";
				currentSide = FLIP_CARD_SIDES.includes(key as FlipCardSide)
					? (key as FlipCardSide)
					: null;
			} else if (child.tagName === "DD" && currentSide) {
				const nodes = content.get(currentSide) ?? [];
				nodes.push(...Array.from(child.childNodes));
				content.set(currentSide, nodes);
			}
		}

		if (!content.has("recto") || !content.has("verso")) {
			this.renderError("tp-flip-card requires recto and verso content");
			return;
		}

		const scene = document.createElement("div");
		scene.className = "tp-flip-card-scene";
		scene.addEventListener("click", () => {
			if (this.normalizedButtonPosition()[0] === "none") this.flip();
		});
		scene.addEventListener("keydown", (event) => {
			if (
				this.normalizedButtonPosition()[0] === "none" &&
				(event.key === "Enter" || event.key === " ")
			) {
				event.preventDefault();
				this.flip();
			}
		});
		const inner = document.createElement("div");
		inner.className = "tp-flip-card-inner";

		const sizer = document.createElement("div");
		sizer.className = "tp-flip-card-sizer";
		sizer.setAttribute("aria-hidden", "true");
		sizer.append(
			...(content.get("verso") ?? []).map((node) => node.cloneNode(true)),
		);

		for (const side of FLIP_CARD_SIDES) {
			const face = document.createElement("div");
			face.className = `tp-flip-card-face tp-flip-card-${side}`;
			face.dataset.side = side;
			face.append(...(content.get(side) ?? []));
			inner.append(face);
		}

		const button = document.createElement("tp-icon-button");
		button.className = "tp-flip-card-button";
		button.setAttribute("type", "button");
		button.setAttribute("name", "card-flip");
		button.setAttribute("size", "m");
		button.addEventListener("click", () => this.flip());

		scene.append(inner);
		this.replaceChildren(sizer, scene, button);
		this.dataset.tpFlipCardRendered = "true";
	}

	private syncState(): void {
		const recto = this.querySelector<HTMLElement>(".tp-flip-card-recto");
		const verso = this.querySelector<HTMLElement>(".tp-flip-card-verso");
		const button = this.querySelector<HTMLElement>(".tp-flip-card-button");
		const scene = this.querySelector<HTMLElement>(".tp-flip-card-scene");
		const [block, inline] = this.normalizedButtonPosition();
		const buttonHidden = block === "none";

		recto?.setAttribute("aria-hidden", String(this.flipped));
		verso?.setAttribute("aria-hidden", String(!this.flipped));

		if (button) {
			button.dataset.block = block;
			button.dataset.inline = inline;
			button.hidden = buttonHidden;
			button.setAttribute("label", this.flipped ? "Show recto" : "Show verso");
			button.setAttribute("aria-pressed", String(this.flipped));
			button.toggleAttribute("disabled", this.disabled);
		}
		if (scene) {
			scene.toggleAttribute("role", buttonHidden);
			if (buttonHidden) scene.setAttribute("role", "button");
			scene.tabIndex = buttonHidden && !this.disabled ? 0 : -1;
			scene.setAttribute("aria-disabled", String(this.disabled));
			scene.setAttribute(
				"aria-label",
				this.flipped ? "Show recto" : "Show verso",
			);
		}
	}

	private normalizedButtonPosition(): [
		FlipCardBlockPosition,
		FlipCardInlinePosition,
	] {
		const tokens = this.buttonPosition.trim().toLowerCase().split(/\s+/);
		if (tokens.includes("none")) return ["none", "none"];
		const block =
			tokens.find(
				(token): token is FlipCardBlockPosition =>
					token === "top" || token === "bottom",
			) ?? "bottom";
		const inline =
			tokens.find(
				(token): token is FlipCardInlinePosition =>
					token === "start" || token === "center" || token === "end",
			) ?? "end";
		return [block, inline];
	}

	private renderError(message: string): void {
		const error = document.createElement("div");
		error.className = "tp-flip-card-error";
		error.textContent = `Error: ${message}`;
		this.replaceChildren(error);
	}
}

if (!customElements.get("tp-flip-card")) {
	customElements.define("tp-flip-card", TpFlipCard);
}
