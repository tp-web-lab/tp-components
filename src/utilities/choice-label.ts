export { default as choiceLabelStyle } from "./choice-label.css?inline";

/** Logical positions shared by radio and checkbox group labels. */
export type TpChoiceLabelPosition = "top" | "bottom" | "start" | "end";

/** Resolve unsupported or absent positions to the default top position. */
export function choiceLabelPosition(host: HTMLElement): TpChoiceLabelPosition {
	const value = host.getAttribute("label-position");
	return value === "bottom" || value === "start" || value === "end"
		? value
		: "top";
}

/** Render a shared, accessible group heading without introducing a fieldset. */
export class TpChoiceLabel {
	/** Counter shared by both list types to keep label identifiers unique. */
	private static nextId = 0;
	/** The generated heading, retained across disconnects and reconnects. */
	private heading: HTMLSpanElement | null = null;
	/** Whether the default group role belongs to this helper rather than the author. */
	private ownedRole: string | null = null;
	/** The list whose visible heading and accessible group name are synchronized. */
	private readonly host: HTMLElement;

	/** Bind the helper to an existing light-DOM list component. */
	public constructor(host: HTMLElement) {
		this.host = host;
	}

	/** Update heading text, layout and naming while preserving author-provided ARIA. */
	public sync(): void {
		const text = this.host.getAttribute("label")?.trim() ?? "";
		if (!text) {
			if (this.heading) {
				this.updateReference(false);
				this.heading.remove();
			}
			if (this.ownedRole && this.host.getAttribute("role") === this.ownedRole)
				this.host.removeAttribute("role");
			this.ownedRole = null;
			this.host.removeAttribute("data-tp-choice-label-position");
			return;
		}
		if (!this.heading) {
			this.host.querySelector(":scope > [data-tp-choice-label]")?.remove();
			this.heading = document.createElement("span");
			this.heading.setAttribute("data-tp-choice-label", "");
			TpChoiceLabel.nextId += 1;
			this.heading.id = `tp-choice-label-${TpChoiceLabel.nextId}`;
			this.heading.addEventListener("click", () => {
				const input =
					this.host.querySelector<HTMLInputElement>(
						"input:checked:not(:disabled)",
					) ??
					this.host.querySelector<HTMLInputElement>("input:not(:disabled)");
				input?.focus();
			});
		}
		this.heading.textContent = text;
		this.host.prepend(this.heading);
		this.host.setAttribute(
			"data-tp-choice-label-position",
			choiceLabelPosition(this.host),
		);
		if (!this.host.hasAttribute("role")) {
			this.ownedRole =
				this.host.localName === "tp-radio-list" ? "radiogroup" : "group";
			this.host.setAttribute("role", this.ownedRole);
		}
		this.updateReference(true);
	}

	/** Add or remove only this heading's token from the author's naming references. */
	private updateReference(add: boolean): void {
		if (!this.heading) return;
		const tokens = (this.host.getAttribute("aria-labelledby") ?? "")
			.split(/\s+/)
			.filter((token) => token && token !== this.heading?.id);
		if (add) tokens.push(this.heading.id);
		if (tokens.length)
			this.host.setAttribute("aria-labelledby", tokens.join(" "));
		else this.host.removeAttribute("aria-labelledby");
	}
}
