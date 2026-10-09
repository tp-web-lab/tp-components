import { parseXYGraph } from "@tp/tp-utilities/xy-graph";
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
	for (const line of source.trim().split("\n")) {
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
	private readonly controls = new Map<string, Control>();
	private readonly generated = document.createElement("tp-code-editor");
	private readonly status = document.createElement("tp-callout");
	private updating = false;
	private timer: ReturnType<typeof setTimeout> | undefined;
	private readonly sampleLimit: number;

	public constructor(
		private readonly initialSource: string,
		private readonly apply: (source: string) => void,
	) {
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
		const heading = document.createElement("h3");
		heading.textContent = "Graph definition";
		this.generated.setAttribute("language", "text");
		this.generated.setAttribute("readonly", "");
		this.generated.className = "tp-xy-plot-settings-source";
		this.element.append(reset, this.status, heading, this.generated);
		this.report("Edit a setting to update the graph.");
		this.element.addEventListener("tp-radio-list-change", (event) => {
			if (this.updating) return;
			if (event.target === this.field("kind")) {
				this.updating = true;
				this.field("functions").value =
					defaultFunctions[Number(this.field("kind").value) - 1] ??
					defaultFunctions[0] ??
					"";
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
		this.setFields(source);
	}

	private setFields(source: string): void {
		this.updating = true;
		const diagram = parseXYGraph(source);
		const values = readFields(source);
		this.field("kind").setAttribute(
			"value",
			String(kinds.indexOf(diagram.kind) + 1),
		);
		this.field("grid").setAttribute(
			"value",
			String(grids.indexOf(diagram.grid ?? "both") + 1),
		);
		for (const [name, control] of this.controls) {
			if (name !== "kind" && name !== "grid")
				control.value = values.get(name) ?? "";
		}
		if (diagram.kind === "xyPolarGraph") {
			this.field("theta-axis").value =
				values.get("theta-axis") ?? values.get("t-axis") ?? "";
		}
		this.generated.value = source;
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
			for (const [name, control] of this.controls) {
				if (name === "kind" || name === "grid") continue;
				if (name === "t-axis" && kind !== "xyParametricGraph") continue;
				if (name === "theta-axis" && kind !== "xyPolarGraph") continue;
				const value = control.value.trim();
				if (!value) continue;
				if (["title", "legend-x", "legend-y"].includes(name)) {
					if (/["\r\n]/.test(value))
						throw new Error(`${name}: remove double quotes and line breaks.`);
					lines.push(`  ${name} "${value}"`);
				} else lines.push(`  ${name} ${value}`);
			}
			lines.push(
				`  grid ${grids[Number(this.field("grid").value) - 1] ?? "both"}`,
			);
			const source = lines.join("\n");
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
					throw new Error(
						"Axis bounds must be finite and strictly increasing.",
					);
			}
			this.apply(source);
			this.generated.value = source;
			this.report("Graph updated.");
		} catch (error) {
			this.report(
				`${error instanceof Error ? error.message : String(error)} The previous graph is retained.`,
				true,
			);
		}
	}

	private report(message: string, failed = false): void {
		this.status.textContent = message;
		this.status.setAttribute("variant", failed ? "danger" : "info");
	}

	public destroy(): void {
		clearTimeout(this.timer);
		this.element.remove();
	}
}
