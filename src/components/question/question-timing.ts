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
	private static readonly sessions = new WeakMap<HTMLElement, QuestionTiming>();
	private startedAt: number | null = null;
	private pending = false;
	private solved = false;
	private readonly exerciseLocks = new Set<HTMLElement>();
	private readonly notifiedQuestions = new Set<
		HTMLElement & {
			setExerciseTiming(exercise: HTMLElement, pending: boolean): void;
		}
	>();

	/** Applies an exercise deadline without creating a question timer. */
	setExerciseTiming(exercise: HTMLElement, pending: boolean): void {
		if (pending) this.exerciseLocks.add(exercise);
		else this.exerciseLocks.delete(exercise);
		this.refreshSolutionLock();
	}
	private refreshSolutionLock(): void {
		if (this.kind !== "question") return;
		if (!this.solved && (this.pending || this.exerciseLocks.size > 0)) {
			if (!this.releaseSolution) this.lockSolution();
		} else {
			this.releaseSolution?.();
			this.releaseSolution = null;
		}
	}
	private publishExerciseTiming(): void {
		if (this.kind !== "exercise") return;
		for (const question of this.host.querySelectorAll<
			HTMLElement & {
				setExerciseTiming?: (exercise: HTMLElement, pending: boolean) => void;
			}
		>("[data-tp-question]")) {
			if (typeof question.setExerciseTiming !== "function") continue;
			question.setExerciseTiming(this.host, this.pending);
			this.notifiedQuestions.add(
				question as HTMLElement & {
					setExerciseTiming(exercise: HTMLElement, pending: boolean): void;
				},
			);
		}
	}
	private timer: TpTimer | null = null;
	private mask: TpMask | null = null;
	private configured: string | null = null;
	private layout: HTMLElement | null = null;
	private solutionPanel: HTMLElement | null = null;
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
		const solutionPanel = layout.querySelector<HTMLElement>(
			"[data-tp-question-solution-content]",
		);
		if (
			this.configured === value &&
			this.layout === layout &&
			this.solutionPanel === solutionPanel
		)
			return;
		this.dispose();
		this.configured = value;
		this.layout = layout;
		this.solutionPanel = solutionPanel;
		QuestionTiming.sessions.set(this.host, this);
		const seconds = questionTimingSeconds(value);
		this.pending = seconds > 0;
		this.solved = false;
		if (this.kind === "question") {
			for (
				let parent = this.host.parentElement;
				parent;
				parent = parent.parentElement
			) {
				const session = QuestionTiming.sessions.get(parent);
				if (session?.kind === "exercise") {
					this.setExerciseTiming(parent, session.pending);
					session.publishExerciseTiming();
				}
			}
		}
		this.refreshSolutionLock();
		this.publishExerciseTiming();
		if (!seconds) return;
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
				this.startedAt = Date.now();
				timer.start();
				this.focusContent();
			},
		);
		timer.addEventListener("tp-timer-elapsed", () => {
			if (this.timer !== timer) return;
			this.message("Time limit has expired.", "Continue", () => {
				this.pending = false;
				this.refreshSolutionLock();
				this.publishExerciseTiming();
				mask.active = false;
				this.focusContent();
			});
		});
	}
	/** Returns elapsed time from the nearest started question or exercise timer. */
	static elapsedFor(host: HTMLElement): string | null {
		for (
			let element: HTMLElement | null = host;
			element;
			element = element.parentElement
		) {
			const session = QuestionTiming.sessions.get(element);
			if (session?.startedAt == null) continue;
			const seconds = Math.floor((Date.now() - session.startedAt) / 1000);
			return [
				Math.floor(seconds / 3600),
				Math.floor(seconds / 60) % 60,
				seconds % 60,
			]
				.map((value) => String(value).padStart(2, "0"))
				.join(":");
		}
		return null;
	}
	/** Releases the timed solution gate after a verified correct answer. */
	unlockSolution(): void {
		this.solved = true;
		this.refreshSolutionLock();
	}
	private lockSolution(): void {
		let tab = this.layout?.querySelector<HTMLElement>(
			"[data-tp-question-solution-tab]",
		);
		let panel = this.layout?.querySelector<HTMLElement>(
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
			// Tabs may rebuild their internal nodes when an enclosing exercise moves.
			tab =
				tabs.querySelector<HTMLElement>("[data-tp-question-solution-tab]") ??
				tab;
			panel =
				tabs.querySelector<HTMLElement>(
					"[data-tp-question-solution-content]",
				) ?? panel;
			if (!tab || !panel) return;
			tab.toggleAttribute("disabled", wasDisabled);
			tab.setAttribute("aria-disabled", String(wasDisabled));
			panel.inert = wasInert ?? false;
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
		this.pending = false;
		for (const question of this.notifiedQuestions)
			question.setExerciseTiming(this.host, false);
		this.notifiedQuestions.clear();
		this.exerciseLocks.clear();
		this.startedAt = null;
		QuestionTiming.sessions.delete(this.host);
		this.releaseSolution?.();
		this.releaseSolution = null;
		this.timer?.remove();
		this.mask?.remove();
		this.timer = null;
		this.mask = null;
		this.configured = null;
		this.layout = null;
		this.solutionPanel = null;
	}
}
