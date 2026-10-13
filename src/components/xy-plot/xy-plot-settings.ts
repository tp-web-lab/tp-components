import {
	normalizeXYGraphAssignments,
	parseXYGraph,
} from "@tp/tp-utilities/xy-graph";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import "../code-editor/code-editor.js";
import type { TpRadioList } from "../radio-list/radio-list.js";
import "../radio-list/radio-list.js";
import type { TpTextfield } from "../textfield/textfield.js";
import "../textfield/textfield.js";
import "../button/button.js";
import "../callout/callout.js";
import "../cluster/cluster.js";
import "../stack/stack.js";

import {
	chooseSaveTarget,
	saveBlob,
	type TpSaveTarget,
} from "../../utilities/save-file.js";
import { choosePlaygroundFile } from "../playground/playground-local-file.js";
import "../icon-button/icon-button.js";
import "../dropdown/dropdown.js";
import type { TpDropdown } from "../dropdown/dropdown.js";

let sourceMenuSequence = 0;
type Control = TpTextfield | TpCodeEditor | TpRadioList;
const kinds = ["xyFunctionGraph", "xyPolarGraph", "xyParametricGraph"];
const grids = ["both", "horizontal", "vertical", "none"];
const declarations = [
	["title", "Chart title", ""],
	["legend-x", "Horizontal axis label", ""],
	["legend-y", "Vertical axis label", ""],
	["x-axis", "Horizontal range", "[-10, 10]"],
	["y-axis", "Vertical range", "[-10, 10]"],
	["x-ticks", "Horizontal ticks", "Automatic: nine ticks"],
	["y-ticks", "Vertical ticks", "Automatic: nine ticks"],
	["x-axis-at", "Horizontal axis at y", "Default layout"],
	["y-axis-at", "Vertical axis at x", "Default layout"],
	["samples", "Samples per curve", "512"],
	["anim", "Ordered names to reveal", "[]"],
	["t-axis", "Parameter range", "[0, 2*PI]"],
	["theta-axis", "Angle range (radians)", "[0, 2*PI]"],
] as const;
const defaultFunctions = [
	'[["Line", "x"]]',
	'[["Circle", "2"]]',
	'[["Circle", "2*cos(t)", "2*sin(t)"]]',
];

/** Retains author expressions and omissions rather than replacing them with sampled values. */
function readFields(source: string): Map<string, string> {
	const values = new Map<string, string>();
	let current = "";
	for (const line of normalizeXYGraphAssignments(source).trim().split("\n")) {
		const match = /^\s*([a-z][a-z-]*)\s+(.+)$/.exec(line);
		if (match?.[1] && match[2]) {
			current = match[1];
			values.set(current, match[2].trim());
		} else if (current)
			values.set(current, `${values.get(current)}\n${line.trim()}`.trim());
	}
	for (const name of ["title", "legend-x", "legend-y"]) {
		const value = values.get(name);
		if (value) values.set(name, value.slice(1, -1));
	}
	return values;
}

/** Lazily loaded, instance-local editor for a declarative graph. */
export class XYPlotSettings {
	public readonly element = document.createElement("tp-stack");
	public readonly container = document.createElement("div");
	private readonly controls = new Map<string, Control>();
	private readonly generated = document.createElement("tp-code-editor");
	private readonly status = document.createElement("tp-callout");
	private currentSource = "";
	private sharedSyntax = false;
	private curveSyntax = false;
	private assignmentSyntax = false;
	private saveTarget: TpSaveTarget | null = null;
	private fileBusy = false;
	private readonly fileRequest = new AbortController();
	private updating = false;
	private timer: ReturnType<typeof setTimeout> | undefined;
	private readonly sampleLimit: number;

	public constructor(
		private readonly initialSource: string,
		private readonly apply: (source: string) => void,
		private readonly getLabel: () => string = () => "",
	) {
		this.container.setAttribute("data-xy-plot-output", "");
		this.container.className = "tp-xy-plot-editors";
		this.container.append(this.element);
		this.sampleLimit = Math.max(4096, parseXYGraph(initialSource).samples);
		this.element.className = "tp-xy-plot-settings";
		this.element.setAttribute("data-xy-plot-output", "");
		this.element.setAttribute("role", "region");
		this.element.setAttribute("aria-label", "Graph settings");
		this.radio("kind", "Graph kind", kinds);
		this.radio("grid", "Grid", grids);
		const cluster = document.createElement("tp-cluster");
		this.element.append(cluster);
		for (const [name, label, placeholder] of declarations) {
			const control = document.createElement("tp-textfield");
			control.setAttribute("label", `${name} — ${label}`);
			control.setAttribute("placeholder", placeholder);
			control.setAttribute("label-position", "top");
			control.setAttribute("clearable", "");
			control.dataset.directive = name;
			this.controls.set(name, control);
			cluster.append(control);
		}
		const help = document.createElement("p");
		help.textContent = `Clear optional fields to use their defaults. Bounds accept expressions such as PI/2. Use x for Cartesian curves and t for polar or parametric curves. Styles: solid, dashed, dotted, dash-dot. Vector dx and dy are displacements from (x, y). Samples: 2–${this.sampleLimit}. Changing graph kind starts a compatible curve; Reset restores the original definition.`;
		this.element.append(help);
		for (const [name, label] of [
			["functions", "Curves (optional line style before the interval)"],
			["points", "Points: [label, x, y, dx, dy]"],
			["vectors", "Vectors: [label, x, y, dx, dy, optional style]"],
		]) {
			if (!name || !label) continue;
			const heading = document.createElement("h3");
			heading.textContent = `${name} — ${label}`;
			const control = document.createElement("tp-code-editor");
			control.setAttribute("language", "text");
			control.setAttribute("aria-label", label);
			control.dataset.directive = name;
			this.controls.set(name, control);
			this.element.append(heading, control);
		}
		const reset = document.createElement("tp-button");
		reset.textContent = "Reset";
		reset.setAttribute("type", "button");
		reset.className = "tp-xy-plot-settings-reset";
		reset.addEventListener("click", () => {
			clearTimeout(this.timer);
			this.setFields(this.initialSource);
			this.apply(this.initialSource);
			this.report("Original graph restored.");
		});
		this.status.setAttribute("role", "status");
		const details = document.createElement("details");
		details.className = "tp-xy-plot-definition";
		const menuId = `tp-xy-source-${++sourceMenuSequence}`;
		details.innerHTML = `<summary>Graph definition</summary><div class="tp-xy-source-toolbar"><div><tp-icon-button id="${menuId}" name="file-outline" library="tp" label="Graph files (.txt)" title="Graph files (.txt)" aria-haspopup="menu" data-source-action="files"></tp-icon-button><tp-dropdown anchor="#${menuId}" outside-click><ul><li data-source-file="load">Load (.txt)</li><li data-source-file="save">Save (.txt)</li><li data-source-file="save-as">Save as (.txt)</li></ul></tp-dropdown></div><div class="tp-xy-source-actions"><tp-icon-button name="keyboard-f1" library="tp" label="F1 — Toggle editor toolbar" title="Toggle editor toolbar (F1)" data-source-action="toolbar"></tp-icon-button><tp-icon-button name="refresh" library="tp" label="Reset definition" title="Reset definition to the displayed graph" data-source-action="reset"></tp-icon-button><tp-icon-button name="play" library="tp" label="Play" title="Play — Apply graph definition" data-source-action="play"></tp-icon-button></div></div>`;
		this.generated.setAttribute("language", "text");
		this.generated.setAttribute("line-numbers", "");
		this.generated.setAttribute("aria-label", "Graph definition");
		this.generated.className = "tp-xy-plot-settings-source";
		details.append(this.generated);
		this.element.append(reset);
		details.append(this.status);
		this.container.append(details);
		details
			.querySelector('[data-source-action="files"]')
			?.addEventListener("click", () =>
				details.querySelector<TpDropdown>("tp-dropdown")?.toggle(),
			);
		details
			.querySelector('[data-source-action="toolbar"]')
			?.addEventListener("click", () => {
				this.generated.toolbar = !this.generated.toolbar;
			});
		details
			.querySelector('[data-source-action="reset"]')
			?.addEventListener("click", () => {
				this.generated.setValue(this.currentSource);
			});
		details
			.querySelector('[data-source-action="play"]')
			?.addEventListener("click", () => {
				try {
					this.applyDefinition(this.generated.getValue());
				} catch (error) {
					this.report(`${String(error)} The previous graph is retained.`, true);
				}
			});
		for (const item of details.querySelectorAll<HTMLElement>(
			"[data-source-file]",
		)) {
			const activate = () => {
				void this.fileAction(
					item.dataset.sourceFile as "load" | "save" | "save-as",
				);
			};
			item.addEventListener("click", activate);
			item.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					activate();
				}
			});
		}
		details.addEventListener("keydown", (event) => {
			if (
				event.key === "F1" &&
				!event.defaultPrevented &&
				!(
					event.target instanceof Element &&
					event.target.closest("tp-code-editor")
				)
			) {
				event.preventDefault();
				this.generated.toolbar = !this.generated.toolbar;
			}
		});
		this.report("Edit a setting to update the graph.");
		this.element.addEventListener("tp-radio-list-change", (event) => {
			if (this.updating) return;
			if (event.target === this.field("kind")) {
				this.updating = true;
				(this.field("functions") as TpCodeEditor).setValue(
					(this.curveSyntax
						? [
								"curve f = function(x, x)",
								"curve r = polar(t, 2)",
								"curve c = parametric(t, 2*cos(t), 2*sin(t))",
							]
						: defaultFunctions)[Number(this.field("kind").value) - 1] ??
						defaultFunctions[0] ??
						"",
				);
				this.updating = false;
			}
			this.update();
		});
		for (const name of ["input", "tp-code-editor-input"]) {
			this.element.addEventListener(name, (event) => {
				if (
					this.updating ||
					!(event.target instanceof Element) ||
					!event.target.closest("[data-directive]")
				)
					return;
				clearTimeout(this.timer);
				this.timer = setTimeout(() => this.update(), 200);
			});
		}
	}

	private field(name: string): Control {
		const control = this.controls.get(name);
		if (!control) throw new Error(`Unknown graph setting: ${name}`);
		return control;
	}

	private radio(name: string, label: string, choices: string[]): void {
		const control = document.createElement("tp-radio-list");
		control.setAttribute("label", label);
		control.setAttribute("label-position", "top");
		control.setAttribute("orientation", "horizontal");
		control.dataset.directive = name;
		const list = document.createElement("ul");
		for (const choice of choices) {
			const item = document.createElement("li");
			item.textContent = choice;
			list.append(item);
		}
		control.append(list);
		this.controls.set(name, control);
		this.element.append(control);
	}

	public initialize(source: string): void {
		clearTimeout(this.timer);
		this.setFields(source);
	}

	private setFields(source: string): void {
		this.updating = true;
		const diagram = parseXYGraph(source);
		const shared = /^\s*(?:point|vector)\s|^\s*(?:label|title)\s*=/m.test(
			source,
		);
		this.sharedSyntax = shared;
		this.curveSyntax = /^\s*curve\s/m.test(source);
		this.assignmentSyntax =
			shared ||
			this.curveSyntax ||
			normalizeXYGraphAssignments(source) !== source;
		const sharedLines = source
			.split("\n")
			.filter((line) =>
				/^\s*(?:point|vector|curve)\s|^\s*(?:label|title)\s*=/.test(line),
			);
		const values = readFields(
			source
				.split("\n")
				.filter((line) => !sharedLines.includes(line))
				.join("\n"),
		);
		if (shared) {
			values.set("title", diagram.title ?? "");
			for (const [name, singular] of [
				["points", "point"],
				["vectors", "vector"],
			]) {
				const legacy = values.get(name ?? "");
				values.set(
					name ?? "",
					[
						legacy ? `${name} ${legacy}` : "",
						...sharedLines.filter((line) =>
							new RegExp(`^\\s*${singular}\\s`).test(line),
						),
					]
						.filter(Boolean)
						.join("\n"),
				);
			}
		}
		if (this.curveSyntax) {
			const legacy = values.get("functions");
			values.set(
				"functions",
				[
					legacy ? `functions = ${legacy}` : "",
					...sharedLines.filter((line) => /^\s*curve\s/.test(line)),
				]
					.filter(Boolean)
					.join("\n"),
			);
		}
		const curves = this.field("functions");
		const curveLabel = this.curveSyntax
			? "Curves: curve f = function(x, expression)"
			: "Curves (optional line style before the interval)";
		curves.setAttribute("aria-label", curveLabel);
		if (curves.previousElementSibling)
			curves.previousElementSibling.textContent = `functions — ${curveLabel}`;

		for (const name of ["points", "vectors"]) {
			const control = this.field(name);
			const label = shared
				? name === "points"
					? "Points: point A = (x, y)"
					: "Vectors: vector u = vector(A, B)"
				: name === "points"
					? "Points: [label, x, y, dx, dy]"
					: "Vectors: [label, x, y, dx, dy, optional style]";
			control.setAttribute("aria-label", label);
			if (control.previousElementSibling)
				control.previousElementSibling.textContent = `${name} — ${label}`;
		}
		this.field("kind").setAttribute(
			"value",
			String(kinds.indexOf(diagram.kind) + 1),
		);
		this.field("grid").setAttribute(
			"value",
			String(grids.indexOf(diagram.grid ?? "both") + 1),
		);
		for (const [name, control] of this.controls) {
			if (name !== "kind" && name !== "grid") {
				const value = values.get(name) ?? "";
				if (control.tagName === "TP-CODE-EDITOR")
					(control as TpCodeEditor).setValue(value);
				else control.value = value;
			}
		}
		if (diagram.kind === "xyPolarGraph") {
			this.field("theta-axis").value =
				values.get("theta-axis") ?? values.get("t-axis") ?? "";
		}
		this.currentSource = source;
		this.generated.setValue(source);
		this.syncKind();
		this.updating = false;
	}

	private syncKind(): string {
		const kind =
			kinds[Number(this.field("kind").value) - 1] ?? "xyFunctionGraph";
		this.field("t-axis").hidden = kind !== "xyParametricGraph";
		this.field("theta-axis").hidden = kind !== "xyPolarGraph";
		return kind;
	}

	private update(): void {
		clearTimeout(this.timer);
		try {
			const kind = this.syncKind();
			const lines = [kind];
			const separator = this.assignmentSyntax ? " = " : " ";
			for (const [name, control] of this.controls) {
				if (name === "kind" || name === "grid") continue;
				if (name === "t-axis" && kind !== "xyParametricGraph") continue;
				if (name === "theta-axis" && kind !== "xyPolarGraph") continue;
				const value = (
					control.tagName === "TP-CODE-EDITOR"
						? (control as TpCodeEditor).getValue()
						: control.value
				).trim();
				if (!value) continue;
				if (["title", "legend-x", "legend-y"].includes(name)) {
					if (!(this.sharedSyntax && name === "title") && /["\r\n]/.test(value))
						throw new Error(`${name}: remove double quotes and line breaks.`);
					lines.push(
						this.sharedSyntax && name === "title"
							? `  label = ${JSON.stringify(value)}`
							: `  ${name}${separator}"${value}"`,
					);
				} else if (
					(this.sharedSyntax && ["points", "vectors"].includes(name)) ||
					(this.curveSyntax && name === "functions")
				)
					lines.push(value);
				else lines.push(`  ${name}${separator}${value}`);
			}
			lines.push(
				`  grid${separator}${grids[Number(this.field("grid").value) - 1] ?? "both"}`,
			);
			const source = lines.join("\n");
			this.validate(source);
			this.apply(source);
			this.currentSource = source;
			this.generated.setValue(source);
			this.report("Graph updated.");
		} catch (error) {
			this.report(
				`${error instanceof Error ? error.message : String(error)} The previous graph is retained.`,
				true,
			);
		}
	}

	private validate(source: string): void {
		const diagram = parseXYGraph(source);
		if (
			!Number.isInteger(diagram.samples) ||
			diagram.samples < 2 ||
			diagram.samples > this.sampleLimit
		)
			throw new Error(
				`samples must be an integer from 2 to ${this.sampleLimit}.`,
			);
		for (const range of [diagram.xAxis, diagram.yAxis]) {
			if (!range.every(Number.isFinite) || range[0] >= range[1])
				throw new Error("Axis bounds must be finite and strictly increasing.");
		}
	}
	private applyDefinition(source: string): void {
		clearTimeout(this.timer);
		this.validate(source);
		this.apply(source);
		this.setFields(source);
		this.report("Graph updated.");
	}
	private async fileAction(action: "load" | "save" | "save-as"): Promise<void> {
		if (this.fileBusy || this.fileRequest.signal.aborted) return;
		this.fileBusy = true;
		for (const item of this.generated
			.closest("details")
			?.querySelectorAll("[data-source-file]") ?? [])
			item.setAttribute("aria-disabled", "true");
		try {
			if (action === "load") {
				const file = await choosePlaygroundFile(
					this.element,
					".txt,text/plain",
					this.fileRequest.signal,
				);
				if (!file) return;
				const text = await file.text();
				if (this.fileRequest.signal.aborted) return;
				this.applyDefinition(text);
				this.saveTarget = null;
			} else {
				const source = this.generated.getValue();
				const slug =
					this.getLabel()
						.normalize("NFKD")
						.replace(/\p{M}/gu, "")
						.toLowerCase()
						.replace(/[^\p{L}\p{N}]+/gu, "-")
						.replace(/^-+|-+$/g, "") || "construction";
				const target =
					(action === "save" && this.saveTarget) ||
					(await chooseSaveTarget({
						suggestedName: `${slug}.txt`,
						description: "Graph definition",
						mimeType: "text/plain",
						extension: ".txt",
					}));
				if (!target || this.fileRequest.signal.aborted) return;
				await saveBlob(
					new Blob([source], { type: "text/plain;charset=utf-8" }),
					target,
				);
				this.saveTarget = target;
				this.report(`Saved ${target.filename}.`);
			}
		} catch (error) {
			this.report(
				`Unable to ${action === "load" ? "load" : "save"} definition: ${String(error)}`,
				true,
			);
		} finally {
			this.fileBusy = false;
			for (const item of this.generated
				.closest("details")
				?.querySelectorAll("[data-source-file]") ?? [])
				item.setAttribute("aria-disabled", "false");
		}
	}
	private report(message: string, failed = false): void {
		this.status.textContent = message;
		this.status.setAttribute("variant", failed ? "danger" : "info");
	}

	public destroy(): void {
		this.fileRequest.abort();
		clearTimeout(this.timer);
		this.container.remove();
	}
}
