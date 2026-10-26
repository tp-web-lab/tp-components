/**
 * @module components/exercise
 * @summary Groups questions around a shared context and optional countdown.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component.
 */
/**
 * @tp-dependency tp-question
 * @summary Independent question container.
 */
/**
 * @tp-dependency tp-timer
 * @summary Countdown timer.
 */
/**
 * @tp-dependency tp-mask
 * @summary Masks content without discarding it.
 */
// tp-docgen:dependencies:end
import { TpBase } from "../base/base.js";
import { QuestionTiming } from "../question/question-timing.js";
import "../icon/icon.js";
import "../question/question.js";
import style from "./exercise.css?inline";

/**
 * @summary Groups a shared context and an ordered list of independent questions.
 * @tagname tp-exercise
 * @attr {boolean} open - Initially expand the exercise.
 * @attr {string} timing = "" - Optional nonzero time limit in strict hh:mm:ss format.
 * @example
 * <tp-exercise open>
 *   <dl>
 *     <dt>Title</dt><dd>A day at the museum</dd>
 *     <dt>Context</dt><dd>The museum opens at 9 a.m. Admission costs 8 euros.</dd>
 *     <dt>Questions</dt><dd><ol class="questions">
 *       <li><tp-question open="input"><dl>
 *         <dt>Title</dt><dd>Opening time</dd>
 *         <dt>Prompt</dt><dd>When does the museum open?</dd>
 *         <dt>Form</dt><dd><tp-textfield label="Your answer"></tp-textfield></dd>
 *         <dt>Feedback</dt><dd>Compare your answer with the opening time in the context.</dd>
 *         <dt>Solution</dt><dd>At 9 a.m.</dd>
 *       </dl></tp-question></li>
 *       <li><tp-question open="input"><dl>
 *         <dt>Title</dt><dd>Admission</dd>
 *         <dt>Prompt</dt><dd>How much do two tickets cost?</dd>
 *         <dt>Form</dt><dd><tp-textfield label="Your answer"></tp-textfield></dd>
 *         <dt>Feedback</dt><dd>Multiply the price of one ticket by two.</dd>
 *         <dt>Solution</dt><dd>16 euros.</dd>
 *       </dl></tp-question></li>
 *     </ol></dd>
 *   </dl>
 * </tp-exercise>
 */
export class TpExercise extends TpBase {
	private readonly exerciseTiming = new QuestionTiming(this, "exercise");
	private sourceObserver: MutationObserver | null = null;

	public static override get observedAttributes(): string[] {
		return [...(TpBase.observedAttributes ?? []), "open", "timing"];
	}
	public get open(): boolean {
		return this.hasAttribute("open");
	}
	public set open(value: boolean) {
		this.toggleAttribute("open", value);
	}
	public get timing(): string {
		return this.getAttribute("timing") ?? "";
	}
	public set timing(value: string) {
		this.setAttribute("timing", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-exercise-styles", style);
		if (!this.render()) {
			this.sourceObserver = new MutationObserver(() => {
				if (this.render()) {
					this.sourceObserver?.disconnect();
					this.sourceObserver = null;
				}
			});
			this.sourceObserver.observe(this, { childList: true });
		}
	}
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		super.attributeChangedCallback(name, oldValue, newValue);
		if (!this.isConnected || oldValue === newValue) return;
		if (name === "open") {
			const details =
				this.querySelector<HTMLDetailsElement>(":scope > details");
			if (details) details.open = this.open;
		}
		if (name === "timing") this.exerciseTiming.configure();
	}
	public disconnectedCallback(): void {
		this.sourceObserver?.disconnect();
		this.sourceObserver = null;
		this.exerciseTiming.dispose();
	}
	private render(): boolean {
		if (!this.querySelector(":scope > details > [data-tp-exercise-layout]")) {
			const source = this.querySelector(":scope > dl");
			if (!source) return false;
			const details = document.createElement("details");
			details.setAttribute("data-tp-exercise-details", "");
			details.open = this.open;
			const header = document.createElement("summary");
			header.setAttribute("data-tp-exercise-header", "");
			header.setAttribute("data-help-group", "Exercise timer");
			const icon = document.createElement("tp-icon");
			icon.setAttribute("library", "components");
			icon.setAttribute("name", "exercise");
			icon.setAttribute("aria-hidden", "true");
			const title = document.createElement("span");
			title.setAttribute("data-tp-exercise-title", "");
			const term = Array.from(source.children).find(
				(child) =>
					child.tagName === "DT" &&
					child.textContent?.trim().toLowerCase() === "title",
			);
			const description = term?.nextElementSibling;
			if (description?.tagName === "DD") {
				title.append(...description.childNodes);
				description.remove();
				term?.remove();
			}
			if (!title.textContent?.trim()) title.textContent = "Exercise";
			header.append(icon, title);
			const content = document.createElement("div");
			content.setAttribute("data-tp-exercise-layout", "");
			content.append(source);
			details.append(header, content);
			this.append(details);
		}
		this.exerciseTiming.configure();
		return true;
	}
}
if (!customElements.get("tp-exercise"))
	customElements.define("tp-exercise", TpExercise);
declare global {
	interface HTMLElementTagNameMap {
		"tp-exercise": TpExercise;
	}
}
