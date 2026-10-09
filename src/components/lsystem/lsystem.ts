/** @module components/lsystem */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-save-image
 * @summary Downloads an anchored image as SVG, PNG or WebP.
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
// tp-docgen:dependencies:end

import {
	expandLSystem,
	getLSystemPreset,
	hasLSystemPreset,
	interpretLSystemTurtle,
	type LSystemDefinition,
	parseLSystem,
	renderLSystemSvg,
} from "@tp/tp-utilities/l-system";
import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../button-group/button-group.js";
import "../callout/callout.js";
import "../save-image/save-image.js";
import style from "./lsystem.css?inline";

/**
 * @summary renders L-system fractals and explores their successive rewriting iterations.
 * @tagname tp-lsystem
 * @attr {string} src = "" - Source file; takes precedence over the internal script and preset.
 * @attr {"fractal-tree"|"barnsley-fern"|"koch-curve"|"dragon-curve"|"hilbert-curve"|"peano-curve"|"levy-c-curve"|"gosper-curve"|"pythagoras-tree"|"sierpinski-triangle"|"sierpinski-carpet"|"sierpinski-arrowhead"|"sierpinski-gasket"|"sierpinski-tetrahedron"} preset = "koch-curve" - Built-in definition used when no source is supplied.
 * @attr {string} iterations = "" - Optional iteration override from 0 to 12; empty uses the source or preset value.
 * @attr {string} angle = "" - Optional turning-angle override in degrees; empty uses the definition.
 * @attr {string} step = "" - Optional positive drawing-step override; empty uses the definition.
 * @attr {number} interval = 1000 - Milliseconds between playback iterations, at least 100.
 * @attr {string} label = "L-system" - Visible caption and accessible SVG name.
 * @event tp-lsystem-rendered Emitted after an iteration has been drawn.
 * @eventdetail tp-lsystem-rendered { iteration: number; iterations: number }
 * @keyboard Tab / Shift+Tab - Move between the playback and export controls.
 * @keyboard Enter / Space - Activate the focused control.
 * @accessibility Named SVG, native button interactions through tp-button, and an announced iteration counter.
 * @accessibilityresponsibility Supply a meaningful label and explain the mathematical construction in adjacent text.
 * @example
 * <tp-lsystem label="Koch curve">
 *   <script type="tp/lsystem">
 *     axiom: F
 *     iterations: 3
 *     angle: 60
 *     rule: F => F+F--F+F
 *   </script>
 * </tp-lsystem>
 */
export class TpLsystem extends TpBase {
	/** Unique anchor identifiers for independent export controls. */
	private static nextId = 0;
	/** Source snapshot shared with other content-driven components. */
	private readonly source = new TpDeclarativeTextSource(this, {
		scriptTypes: ["tp/lsystem", "tp/l-system"],
	});
	/** Current parsed definition, cleared during loading or after a failure. */
	private definition: LSystemDefinition | null = null;
	/** Currently displayed rewriting depth. */
	private iteration = 0;
	/** Playback interval; null when paused. */
	private timer: ReturnType<typeof setInterval> | null = null;
	/** Deferred initial render and grouped attribute updates. */
	private pending: ReturnType<typeof setTimeout> | null = null;
	/** Cancels an obsolete source request. */
	private request: AbortController | null = null;
	/** Invalidates asynchronous work when attributes change or the element disconnects. */
	private revision = 0;
	/** Current generated SVG, also used by export consumers. */
	private svg = "";
	/** Export target unique to this instance. */
	private readonly viewportId = `tp-lsystem-${++TpLsystem.nextId}`;

	/** Attributes affecting the definition, presentation or playback. */
	public static override get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"src",
			"preset",
			"iterations",
			"angle",
			"step",
			"interval",
			"label",
		];
	}
	/** Initializes common styling and waits for parser-inserted script content. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-lsystem-styles", style);
		this.addEventListener("click", this.handleClick);
		this.source.observe(() => this.schedule());
		this.schedule();
	}
	/** Cancels timers, requests and source observation without losing the author snapshot. */
	public disconnectedCallback(): void {
		this.pause();
		this.revision++;
		this.request?.abort();
		if (this.pending !== null) clearTimeout(this.pending);
		this.pending = null;
		this.source.disconnect();
		this.removeEventListener("click", this.handleClick);
	}
	/** Rebuilds only for local attributes, not inherited presentation changes. */
	protected override attributeChangedCallback(name: string): void {
		if (
			this.isConnected &&
			[
				"src",
				"preset",
				"iterations",
				"angle",
				"step",
				"interval",
				"label",
			].includes(name)
		)
			this.schedule();
	}
	/** Coalesces attribute changes and prevents old playback or responses from taking effect. */
	private schedule(): void {
		this.pause();
		this.revision++;
		this.request?.abort();
		this.definition = null;
		if (this.pending !== null) clearTimeout(this.pending);
		this.pending = setTimeout(() => {
			this.pending = null;
			void this.load();
		}, 0);
	}
	/** Reads a finite numeric override, preserving the definition when the attribute is empty. */
	private number(name: string, fallback: number): number {
		const raw = this.getAttribute(name)?.trim();
		const value = raw ? Number(raw) : fallback;
		if (!Number.isFinite(value))
			throw new Error(`Invalid ${name}: expected a finite number.`);
		return value;
	}
	/** Reads the shared source, then falls back to a named preset, and renders the final iteration. */
	private async load(): Promise<void> {
		const revision = this.revision;
		this.request = new AbortController();
		this.setAttribute("aria-busy", "true");
		try {
			this.source.capture();
			const text = await this.source.read({ signal: this.request.signal });
			if (revision !== this.revision || !this.isConnected) return;
			if (text.length > 20000)
				throw new Error("L-system source exceeds 20,000 characters.");
			const preset = this.getAttribute("preset")?.trim() ?? "koch-curve";
			if (!text.trim() && !preset)
				throw new Error(
					"Provide a tp/lsystem script, a source file or a preset.",
				);
			let definition: LSystemDefinition;
			if (text.trim()) definition = parseLSystem(text, { strict: true });
			else if (hasLSystemPreset(preset)) definition = getLSystemPreset(preset);
			else throw new Error(`Unknown L-system preset: ${preset}`);
			if (
				[
					...definition.rules.values(),
					...(definition.rulesV2 ?? []).flatMap((rule) =>
						rule.branches.map((branch) => branch.replacement),
					),
				].some((rule) => rule.length > 256)
			)
				throw new Error("Rule replacements are limited to 256 characters.");
			definition.iterations = this.number("iterations", definition.iterations);
			definition.angleDeg = this.number("angle", definition.angleDeg);
			definition.step = this.number("step", definition.step);
			if (
				!Number.isInteger(definition.iterations) ||
				definition.iterations < 0 ||
				definition.iterations > 12
			)
				throw new Error("Iterations must be an integer from 0 to 12.");
			if (definition.step <= 0) throw new Error("Step must be positive.");
			if (this.number("interval", 1000) < 100)
				throw new Error("Interval must be at least 100 milliseconds.");
			this.definition = definition;
			this.iteration = definition.iterations;
			this.innerHTML = `<tp-button-group data-lsystem-controls>
				<tp-button data-action="step">Step</tp-button>
				<tp-button data-action="play"><span data-play-label>Play</span></tp-button>
				<tp-button data-action="reset">Reset</tp-button>
				<tp-save-image anchor="#${this.viewportId}" filename="lsystem"></tp-save-image>
			</tp-button-group><p data-lsystem-status role="status" aria-live="polite"></p>
			<figure><div id="${this.viewportId}" data-lsystem-viewport></div><figcaption></figcaption></figure>`;
			this.draw();
		} catch (error) {
			if (revision === this.revision && this.isConnected) this.fail(error);
		} finally {
			if (revision === this.revision) this.removeAttribute("aria-busy");
		}
	}
	/** Converts the current generation to accessible SVG using the shared engine. */
	private draw(): void {
		if (!this.definition) return;
		try {
			const definition = { ...this.definition, iterations: this.iteration };
			const expanded = expandLSystem(definition);
			const geometry = interpretLSystemTurtle(expanded.sentence, definition);
			const label = this.getAttribute("label")?.trim() || "L-system";
			this.svg = renderLSystemSvg(geometry, {
				width: 800,
				height: 420,
				padding: 20,
				stroke: "currentColor",
				title: label,
				ariaLabel: label,
			});
			const viewport = this.querySelector("[data-lsystem-viewport]");
			if (viewport) viewport.innerHTML = this.svg;
			const caption = this.querySelector("figcaption");
			if (caption) caption.textContent = label;
			const counter = this.querySelector("[data-lsystem-status]");
			if (counter)
				counter.textContent = `Iteration ${this.iteration} / ${this.definition.iterations}`;
			this.dispatchEvent(
				new CustomEvent("tp-lsystem-rendered", {
					bubbles: true,
					detail: {
						iteration: this.iteration,
						iterations: this.definition.iterations,
					},
				}),
			);
		} catch (error) {
			this.fail(error);
		}
	}
	/** Stops playback and reports a failure as text, never as injected markup. */
	private fail(error: unknown): void {
		this.pause();
		this.definition = null;
		this.svg = "";
		const notice = this.ownerDocument.createElement("tp-callout");
		notice.setAttribute("variant", "warning");
		notice.setAttribute("role", "alert");
		notice.textContent = error instanceof Error ? error.message : String(error);
		this.replaceChildren(notice);
	}
	/** Dispatches toolbar actions while preserving focus on the original buttons. */
	private readonly handleClick = (event: Event): void => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const action = target
			.closest("tp-button[data-action]")
			?.getAttribute("data-action");
		if (action === "step") this.step();
		else if (action === "reset") this.reset();
		else if (action === "play") {
			if (this.timer === null) this.play();
			else this.pause();
		}
	};
	/** Advances one iteration; reaching the limit restarts at the axiom on the next step. */
	public step(): void {
		this.pause();
		if (!this.definition) return;
		this.iteration =
			this.iteration >= this.definition.iterations ? 0 : this.iteration + 1;
		this.draw();
	}
	/** Starts user-requested playback, stopping at the final iteration without looping. */
	public play(): void {
		this.pause();
		if (
			!this.definition ||
			!this.isConnected ||
			this.definition.iterations === 0
		)
			return;
		if (this.iteration >= this.definition.iterations) {
			this.iteration = 0;
			this.draw();
		}
		this.querySelector("[data-play-label]")?.replaceChildren("Pause");
		this.timer = setInterval(
			() => {
				this.iteration++;
				this.draw();
				if (this.definition && this.iteration >= this.definition.iterations)
					this.pause();
			},
			this.number("interval", 1000),
		);
	}
	/** Pauses playback without changing the displayed iteration. */
	public pause(): void {
		if (this.timer !== null) clearInterval(this.timer);
		this.timer = null;
		this.querySelector("[data-play-label]")?.replaceChildren("Play");
	}
	/** Pauses and restores iteration zero, the unexpanded axiom. */
	public reset(): void {
		this.pause();
		this.iteration = 0;
		this.draw();
	}
	/** Returns the current standalone SVG for export integrations. */
	public exportSvg(): string {
		return this.svg;
	}
}

if (!customElements.get("tp-lsystem"))
	customElements.define("tp-lsystem", TpLsystem);

declare global {
	interface HTMLElementTagNameMap {
		"tp-lsystem": TpLsystem;
	}
}
