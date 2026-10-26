/** @module components/question/question-timing */
import { TpMask } from "../mask/mask.js";
import { TpTimer } from "../timer/timer.js";
import "../button/button.js";

/** Parse a strict two-digit hours, minutes and seconds duration. */
export function questionTimingSeconds(value: string): number {
	const match = /^(\d{2}):([0-5]\d):([0-5]\d)$/.exec(value);
	return match && match[0] === value
		? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
		: 0;
}

/** Coordinates the shared timer and mask without changing question answers. */
export class QuestionTiming {
	private timer: TpTimer | null = null;
	private mask: TpMask | null = null;
	private configured: string | null = null;
	private layout: HTMLElement | null = null;
	private releaseSolution: (() => void) | null = null;
	constructor(
		private readonly host: HTMLElement,
		private readonly kind: "question" | "exercise" = "question",
	) {}

	configure(): void {
		const value = this.host.getAttribute("timing") ?? "";
		const layout = this.host.querySelector<HTMLElement>(
			this.kind === "question"
				? ":scope > details > [data-tp-question-layout]"
				: ":scope > details > [data-tp-exercise-layout]",
		);
		const summary = this.host.querySelector<HTMLElement>(
			this.kind === "question"
				? ":scope > details > summary"
				: ":scope > details > [data-tp-exercise-header]",
		);
		if (!layout || !summary) return;
		if (this.configured === value && this.layout === layout) return;
		this.dispose();
		this.configured = value;
		this.layout = layout;
		const seconds = questionTimingSeconds(value);
		if (!seconds) return;
		if (this.kind === "question") this.lockSolution();
		if (!layout.id) layout.id = `tp-${this.kind}-timing-${crypto.randomUUID()}`;
		const timer = new TpTimer();
		timer.setAttribute("manual", "");
		timer.setAttribute("no-controls", "");
		timer.setAttribute("silent", "");
		timer.duration = seconds;
		timer.setAttribute(`data-tp-${this.kind}-timer`, "");
		timer.setAttribute("aria-label", "Time remaining");
		timer.setAttribute("role", "timer");
		this.timer = timer;
		summary.append(timer);
		const mask = new TpMask();
		mask.anchor = `#${layout.id}`;
		mask.setAttribute(`data-tp-${this.kind}-timing-mask`, "");
		this.mask = mask;
		layout.after(mask);
		this.message(
			`Time-limited ${this.kind}: this section will close in ${value}`,
			"Start",
			() => {
				mask.active = false;
				timer.start();
				this.focusContent();
			},
		);
		timer.addEventListener("tp-timer-elapsed", () => {
			if (this.timer !== timer) return;
			this.message("Time limit has expired.", "Continue", () => {
				this.releaseSolution?.();
				this.releaseSolution = null;
				mask.active = false;
				this.focusContent();
			});
		});
	}
	private lockSolution(): void {
		const tab = this.layout?.querySelector<HTMLElement>(
			"[data-tp-question-solution-tab]",
		);
		const panel = this.layout?.querySelector<HTMLElement>(
			"[data-tp-question-solution-content]",
		);
		const tabs = tab?.closest("tp-tabs");
		if (!tab || !panel || !tabs) return;
		const wasDisabled = tab.hasAttribute("disabled");
		const wasInert = panel.inert;
		tab.setAttribute("disabled", "");
		tab.setAttribute("aria-disabled", "true");
		panel.inert = true;
		panel.setAttribute("data-tp-question-solution-locked", "");
		tabs.setAttribute("selected", "0");
		for (const button of this.layout?.querySelectorAll<HTMLButtonElement>(
			"[data-tp-question-open-solution]",
		) ?? []) {
			if (button.closest("[data-tp-question]") === this.host)
				button.disabled = true;
		}
		// This output has only Feedback and Solution; keep keyboard navigation on Feedback.
		const guard = (event: KeyboardEvent) => {
			if (
				event.target instanceof HTMLElement &&
				event.target.closest('[role="tab"]')?.closest("tp-tabs") === tabs &&
				[
					"ArrowLeft",
					"ArrowRight",
					"ArrowUp",
					"ArrowDown",
					"Home",
					"End",
				].includes(event.key)
			) {
				event.preventDefault();
				event.stopImmediatePropagation();
			}
		};
		tabs.addEventListener("keydown", guard, true);
		this.releaseSolution = () => {
			tabs.removeEventListener("keydown", guard, true);
			tab.toggleAttribute("disabled", wasDisabled);
			tab.setAttribute("aria-disabled", String(wasDisabled));
			panel.inert = wasInert;
			panel.removeAttribute("data-tp-question-solution-locked");
			for (const button of this.layout?.querySelectorAll<HTMLButtonElement>(
				"[data-tp-question-open-solution]",
			) ?? []) {
				if (button.closest("[data-tp-question]") === this.host)
					button.disabled = wasDisabled;
			}
		};
	}
	private message(text: string, label: string, action: () => void): void {
		const mask = this.mask;
		if (!mask) return;
		const message = document.createElement("p");
		message.textContent = text;
		const button = document.createElement("tp-button");
		button.textContent = label;
		button.setAttribute(
			"data-help-description",
			label === "Start"
				? `Reveal the ${this.kind} and begin the countdown.`
				: `Reveal the ${this.kind} after the time limit.`,
		);
		button.addEventListener("click", action, { once: true });
		mask.replaceChildren(message, button);
		mask.active = true;
	}
	private focusContent(): void {
		if (!this.layout) return;
		this.layout.tabIndex = -1;
		this.layout.focus({ preventScroll: true });
	}
	dispose(): void {
		this.releaseSolution?.();
		this.releaseSolution = null;
		this.timer?.remove();
		this.mask?.remove();
		this.timer = null;
		this.mask = null;
		this.configured = null;
		this.layout = null;
	}
}
