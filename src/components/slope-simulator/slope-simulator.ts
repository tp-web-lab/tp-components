/** @module components/slope-simulator */
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
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
// tp-docgen:dependencies:end

import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import {
	type NormalizedProfile,
	parseProfiles,
	type TpSlopeProfiles,
} from "./profiles.js";

export type { TpSlopeProfile, TpSlopeProfiles } from "./profiles.js";

import { TpBase } from "../base/base.js";
import "../numberfield/numberfield.js";
import "../radio-list/radio-list.js";
import "../button/button.js";
import { advance, profiles, sample, type Terrain } from "./motion.js";
import style from "./slope-simulator.css?inline";

/**
 * @summary Explore how uphill and downhill gradients change the effort needed to move a point.
 * @tagname tp-slope-simulator
 * @attr {string} src = "" - JSON file containing cycling profiles; takes precedence over the inline script.
 * @event tp-slope-simulator-error Fired when a profile source fails validation or loading; detail contains message.
 * @keyboard ArrowLeft / ArrowRight Move the focused point with slope-dependent effort.
 * @keyboard Escape End the current drag.
 * @example
 * <tp-slope-simulator></tp-slope-simulator>
 */
export class TpSlopeSimulator extends TpBase {
	private ui?: HTMLDivElement;
	private source = new TpDeclarativeTextSource(this, {
		scriptTypes: ["tp/slope-simulator"],
		ignoreSelector: ".tp-slope-ui",
	});
	private available: NormalizedProfile[] = this.defaults();
	private token = 0;
	private abort?: AbortController;
	private programmatic = false;
	public static get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "src"];
	}
	/** External JSON source. Empty src restores inline profiles or defaults. */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	public attributeChangedCallback(
		name: string,
		old: string | null,
		value: string | null,
	): void {
		if (name === "src" && old !== value && this.isConnected && this.ui) {
			this.programmatic = false;
			this.watchSource();
		}
	}
	/** Replace profiles atomically. Returns false and emits an error for invalid data. */
	public setProfiles(data: TpSlopeProfiles | string): boolean {
		try {
			const next = parseProfiles(data);
			this.stopLoading();
			this.source.disconnect();
			this.programmatic = true;
			this.applyProfiles(next);
			return true;
		} catch (error) {
			this.reportError(error);
			return false;
		}
	}
	private defaults(): NormalizedProfile[] {
		return parseProfiles({
			profiles: profiles.map((p, i) => ({
				id: `default-${i + 1}`,
				name: p.name,
				points: p.points.map(([x, h]) => [x * 100, h * 100000]),
			})),
		});
	}
	private stopLoading(): void {
		this.token++;
		this.abort?.abort();
	}
	private watchSource(): void {
		this.source.disconnect();
		this.source.observe(() => {
			void this.reloadProfiles();
		});
		void this.reloadProfiles();
	}
	private async reloadProfiles(): Promise<void> {
		this.stopLoading();
		const token = this.token;
		this.abort = new AbortController();
		try {
			const text = await this.source.read({ signal: this.abort.signal });
			if (token !== this.token) return;
			this.applyProfiles(
				this.src.trim() || text.trim() ? parseProfiles(text) : this.defaults(),
			);
		} catch (error) {
			if (token === this.token) this.reportError(error);
		}
	}
	private applyProfiles(next: NormalizedProfile[]): void {
		this.finish();
		this.available = next;
		this.profile = 0;
		this.positions[1] = 0.1;
		this.directions[1] = 1;
		const old = this.ui?.querySelector("[data-profile-choices]");
		if (old) {
			const radio = document.createElement("tp-radio-list");
			radio.setAttribute("label", "Stage profile");
			radio.setAttribute("orientation", "horizontal");
			radio.setAttribute("value", "1");
			const list = document.createElement("ul");
			for (const profile of next) {
				const item = document.createElement("li");
				item.textContent = profile.name;
				list.append(item);
			}
			radio.append(list);
			if (next.length === 1) {
				const label = document.createElement("p");
				label.textContent = `Stage profile: ${next[0]?.name}`;
				old.replaceChildren(label);
			} else old.replaceChildren(radio);
		}
		const alert = this.ui?.querySelector<HTMLElement>("[data-source-error]");
		if (alert) {
			alert.textContent = "";
			alert.hidden = true;
		}
		this.update(1);
	}
	private reportError(error: unknown): void {
		const message = error instanceof Error ? error.message : String(error);
		const alert = this.ui?.querySelector<HTMLElement>("[data-source-error]");
		if (alert) {
			alert.textContent = message;
			alert.hidden = false;
		}
		this.dispatchEvent(
			new CustomEvent("tp-slope-simulator-error", {
				bubbles: true,
				detail: { message },
			}),
		);
	}
	private slope = 0;
	private profile = 0;
	private positions = [0.1, 0.1];
	private directions = [1, 1];
	private drag?: { id: number; x: number; track: number; target: HTMLElement };
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-slope-simulator-style", style);
		this.source.capture();
		if (this.ui) {
			if (!this.programmatic) this.watchSource();
			return;
		}
		this.ui = document.createElement("div");
		this.ui.className = "tp-slope-ui";
		this.ui.innerHTML = `<section><h3>Constant slope</h3>
   <tp-numberfield label="Slope (%)" min="-20" max="20" step="1" value="0" range clearable></tp-numberfield>
   <p>Drag the point horizontally, or focus it and press ← / →. Uphill takes more effort; downhill takes less. Release and grab again to continue.</p>
   ${this.board(0, "Point on constant slope")}</section>
   <section><h3>Cycling stage</h3>
   <div data-profile-choices></div>
   <p data-elevation-note></p><p role="alert" data-source-error hidden></p>
   ${this.board(1, "Point on cycling stage")}</section>`;
		this.append(this.ui);
		this.ui.addEventListener("input", (event) => {
			const field = (event.target as Element).closest("tp-numberfield");
			if (!field) return;
			this.slope = Number(field.value) || 0;
			this.update(0);
		});
		this.ui.addEventListener("tp-radio-list-change", () => {
			this.finish();
			this.profile =
				Number(this.ui?.querySelector("tp-radio-list")?.value ?? 1) - 1;
			this.positions[1] = 0.1;
			this.directions[1] = 1;
			this.update(1);
		});
		this.ui.addEventListener("click", (event) => {
			const reset = (event.target as Element).closest<HTMLElement>(
				"[data-reset]",
			);
			if (!reset) return;
			this.finish();
			const track = Number(reset.dataset.reset);
			this.positions[track] = 0.1;
			this.directions[track] = 1;
			this.update(track);
		});
		this.ui.addEventListener("keydown", this.key);
		this.ui.addEventListener("pointerdown", this.down);
		this.ui.addEventListener("pointermove", this.move);
		this.ui.addEventListener("pointerup", this.end);
		this.ui.addEventListener("pointercancel", this.end);
		this.ui.addEventListener("lostpointercapture", this.end);
		this.update(0);
		this.applyProfiles(this.available);
		if (!this.programmatic) this.watchSource();
	}
	protected disconnectedCallback(): void {
		this.stopLoading();
		this.source.disconnect();
		this.finish();
	}
	private board(track: number, label: string): string {
		return `<div class="tp-slope-board" data-board="${track}"><svg viewBox="0 0 1000 300" aria-hidden="true"><path class="tp-slope-area"/><path class="tp-slope-route"/></svg>
   <button type="button" class="tp-slope-point" data-track="${track}" role="slider" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-orientation="horizontal"></button></div>
   <div class="tp-slope-footer"><span data-status="${track}"></span><tp-button data-reset="${track}">Restart</tp-button></div>`;
	}
	private terrain(track: number): Terrain {
		return track === 0
			? [
					[0, -this.slope / 200],
					[1, this.slope / 200],
				]
			: ((this.available[this.profile] ?? this.available[0])?.points ?? [
					[0, 0],
					[1, 0],
				]);
	}
	private update(track: number): void {
		const board = this.ui?.querySelector<HTMLElement>(
			`[data-board="${track}"]`,
		);
		if (!board) return;
		const points = this.terrain(track);
		const position = this.positions[track] ?? 0.1;
		const direction = this.directions[track] ?? 1;
		const current = sample(points, position, direction);
		const highest = points.reduce((max, p) => Math.max(max, p[1]), 0);
		const scale = Math.min(1912, highest > 0 ? 230 / highest : 1912);
		const y = (altitude: number) =>
			track === 0 ? 150 - altitude * 956 : 260 - altitude * scale;
		if (track === 1) {
			const note = this.ui?.querySelector("[data-elevation-note]");
			if (note)
				note.textContent = `Elevation display scale ×${(scale / 956).toFixed(2)}. Effort uses the actual slope (maximum ±20%).`;
		}
		const path = points
			.map(([x, h], i) => `${i ? "L" : "M"}${22 + x * 956},${y(h)}`)
			.join(" ");
		board.querySelector(".tp-slope-route")?.setAttribute("d", path);
		board
			.querySelector(".tp-slope-area")
			?.setAttribute("d", `${path} L978,290 L22,290 Z`);
		const point = board.querySelector<HTMLElement>(".tp-slope-point");
		const text = `${(position * 100).toFixed(1)}% of route · ${current.grade.toFixed(1)}% slope → · ${current.grade * direction > 0.01 ? "Uphill" : current.grade * direction < -0.01 ? "Downhill" : "Flat"} ${direction > 0 ? "→" : "←"}`;
		if (point) {
			point.style.left = `${(22 + position * 956) / 10}%`;
			point.style.top = `${y(current.altitude) / 3}%`;
			point.setAttribute("aria-valuenow", (position * 100).toFixed(1));
			point.setAttribute("aria-valuetext", text);
		}
		const status = this.ui?.querySelector(`[data-status="${track}"]`);
		if (status) status.textContent = text;
	}
	private travel(track: number, effort: number): void {
		if (!effort) return;
		this.directions[track] = Math.sign(effort);
		this.positions[track] = advance(
			this.terrain(track),
			this.positions[track] ?? 0.1,
			effort,
		);
		this.update(track);
	}
	private key = (event: KeyboardEvent): void => {
		if (event.key === "Escape") {
			this.finish();
			return;
		}
		const point = (event.target as Element).closest<HTMLElement>(
			"[data-track]",
		);
		if (
			!point ||
			!["ArrowLeft", "ArrowRight"].includes(event.key) ||
			event.ctrlKey ||
			event.metaKey ||
			event.altKey
		)
			return;
		event.preventDefault();
		this.travel(
			Number(point.dataset.track),
			event.key === "ArrowRight" ? 0.01 : -0.01,
		);
	};
	private down = (event: PointerEvent): void => {
		const point = (event.target as Element).closest<HTMLElement>(
			"[data-track]",
		);
		if (!point || event.button !== 0 || this.drag) return;
		event.preventDefault();
		point.focus();
		point.setPointerCapture(event.pointerId);
		this.drag = {
			id: event.pointerId,
			x: event.clientX,
			track: Number(point.dataset.track),
			target: point,
		};
	};
	private move = (event: PointerEvent): void => {
		const drag = this.drag;
		if (!drag || drag.id !== event.pointerId) return;
		const width = drag.target.parentElement?.getBoundingClientRect().width ?? 0;
		if (width > 0)
			this.travel(drag.track, (event.clientX - drag.x) / (width * 0.956));
		drag.x = event.clientX;
	};
	private end = (event: PointerEvent): void => {
		if (this.drag?.id === event.pointerId) this.finish();
	};
	private finish(): void {
		const drag = this.drag;
		this.drag = undefined;
		if (drag?.target.hasPointerCapture(drag.id))
			drag.target.releasePointerCapture(drag.id);
	}
}
if (!customElements.get("tp-slope-simulator"))
	customElements.define("tp-slope-simulator", TpSlopeSimulator);
declare global {
	interface HTMLElementTagNameMap {
		"tp-slope-simulator": TpSlopeSimulator;
	}
}
