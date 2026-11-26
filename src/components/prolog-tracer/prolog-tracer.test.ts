import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { parseResolutionTrace, resolutionTree } from "./resolution-tree.js";
import "./prolog-tracer.js";

const state = vi.hoisted(() => ({
	workers: [] as {
		onmessage?: (event: { data: unknown }) => void;
		postMessage: ReturnType<typeof vi.fn>;
		terminate: ReturnType<typeof vi.fn>;
	}[],
}));
vi.mock("./prolog-tracer-worker.js?worker", () => ({
	default: class {
		onmessage?: (event: { data: unknown }) => void;
		postMessage = vi.fn();
		terminate = vi.fn();
		constructor() {
			state.workers.push(this);
		}
	},
}));
vi.mock("../code-editor/code-editor.js", () => {
	class Editor extends HTMLElement {
		value = "";
		setValue(value: string) {
			this.value = value;
		}
		getValue() {
			return this.value;
		}
	}
	if (!customElements.get("tp-code-editor"))
		customElements.define("tp-code-editor", Editor);
	return {};
});
const trace = {
	version: 1,
	language: "prolog",
	code: "p(a). p(b).",
	query: "p(X).",
	stdout: "",
	events: [
		{ port: "call", frame: 10, parent: 1, level: 1, goal: "p(X)" },
		{ port: "exit", frame: 10, parent: 1, level: 1, goal: "p(a)" },
		{ port: "solution", frame: 0, parent: 0, level: 0, goal: "X = a" },
		{ port: "redo(0)", frame: 10, parent: 1, level: 1, goal: "p(X)" },
		{ port: "call", frame: 11, parent: 10, level: 2, goal: "check(b)" },
		{ port: "fail", frame: 11, parent: 10, level: 2, goal: "check(b)" },
	],
};
beforeEach(() => {
	state.workers.length = 0;
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("retains explored alternatives and attaches children to the current attempt", () => {
	const first = resolutionTree(trace, 2);
	expect(first.solutions).toEqual(["X = a"]);
	expect(first.nodes).toHaveLength(2);
	const full = resolutionTree(trace, 5);
	expect(full.nodes).toHaveLength(4);
	expect(full.nodes[1]?.backtracked).toBe(true);
	expect(full.nodes[2]?.parent).toBe(0);
	expect(full.nodes[3]?.parent).toBe(2);
	expect(full.nodes[3]?.port).toBe("fail");
	expect(resolutionTree(trace, -1).nodes).toHaveLength(1);
});
it("does not merge distinct calls when SWI reuses a frame reference", () => {
	const data = {
		...trace,
		events: [trace.events[0], { ...trace.events[0], goal: "q(Y)" }],
	};
	expect(resolutionTree(data, 1).nodes.map((n) => n.goal)).toEqual([
		"p(X).",
		"p(X)",
		"q(Y)",
	]);
});
it("rejects recordings from other tracers and malformed events", () => {
	expect(() =>
		parseResolutionTrace(JSON.stringify({ ...trace, language: "python" })),
	).toThrow();
	expect(() =>
		parseResolutionTrace(JSON.stringify({ ...trace, events: [{}] })),
	).toThrow();
	expect(parseResolutionTrace(JSON.stringify(trace)).events).toHaveLength(6);
});
it("replays trace URLs in light DOM without creating a Worker", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(JSON.stringify(trace))),
	);
	const host = document.createElement("tp-prolog-tracer");
	host.trace = "/saved.json";
	host.src = "/ignored.pl";
	document.body.append(host);
	await host.refresh();
	expect(host.shadowRoot).toBeNull();
	expect(host.querySelector("tp-theme")?.getAttribute("mode")).toBe("light");
	expect(
		host.querySelector(".tp-interpreter-file")?.getAttribute("section"),
	).toBe("center");
	expect(host.querySelector(".resolution-json")?.hasAttribute("open")).toBe(
		false,
	);
	expect(
		JSON.parse(host.querySelector("[data-role=json]")?.textContent ?? ""),
	).toEqual(trace);

	expect(state.workers).toHaveLength(0);
	expect(host.querySelectorAll(".resolution-node")).toHaveLength(1);
	host.goTo(5);
	expect(host.querySelectorAll(".resolution-node")).toHaveLength(4);
	expect(host.querySelector("[data-role=solutions]")?.textContent).toContain(
		"X = a",
	);
	host.goTo(-1);
	expect(host.querySelectorAll(".resolution-node")).toHaveLength(1);
	expect(JSON.parse(host.getCode())).toEqual(trace);
	const output = () =>
		host.querySelector(".resolution-tree")?.innerHTML ??
		host.querySelector("svg")?.outerHTML;
	for (const [method, role] of [
		["firstStep", "first"],
		["previousStep", "previous"],
		["nextStep", "next"],
		["lastStep", "last"],
	] as const) {
		host.goTo(2);
		host[method]();
		const expected = output();
		expect(expected).toBeTruthy();
		host.goTo(2);
		host.querySelector<HTMLElement>(`[data-role="${role}"]`)?.click();
		expect(output()).toEqual(expected);
	}
	const json = host.querySelector<HTMLDetailsElement>(".resolution-json");
	host.toggleJson();
	expect(json?.open).toBe(true);
	json?.querySelector("summary")?.click();
	expect(json?.open).toBe(false);
	const file = host.querySelector<HTMLInputElement>('[data-role="file"]');
	if (!file) throw new Error("Missing trace chooser");
	const choose = vi.spyOn(file, "click").mockImplementation(() => {});
	host.loadTrace();
	host.querySelector<HTMLElement>('[data-role="load"]')?.click();
	expect(choose).toHaveBeenCalledTimes(2);
});
it("records the current editor and query, and terminates on removal", async () => {
	const host = document.createElement("tp-prolog-tracer");
	host.innerHTML = '<script type="tp/prolog">\n  p(a).\n</script>';
	host.query = "p(X).";
	document.body.append(host);
	await host.refresh();
	expect(host.querySelector("tp-code-editor")?.getValue()).toBe("p(a).");
	host.querySelector("tp-code-editor")?.setValue("p(b).");
	const field = host.querySelector("tp-textfield");
	if (!field) throw Error("No query");
	field.value = "p(Y).";
	host.record();
	expect(state.workers[0]?.postMessage).toHaveBeenCalledWith({
		code: "p(b).",
		query: "p(Y).",
	});
	host.remove();
	expect(state.workers[0]?.terminate).toHaveBeenCalled();
});
it("ignores messages from a stopped recording", async () => {
	const host = document.createElement("tp-prolog-tracer");
	host.value = "p(a).";
	host.query = "p(X).";
	document.body.append(host);
	await host.refresh();
	host.record();
	host.stop();
	state.workers[0]?.onmessage?.({ data: { type: "trace", result: trace } });
	expect(host.getCode()).toBe("");
});
it("leaves the engine unloaded until a nonempty query is recorded", async () => {
	const host = document.createElement("tp-prolog-tracer");
	host.value = "p(a).";
	document.body.append(host);
	await host.refresh();
	host.record();
	expect(state.workers).toHaveLength(0);
	expect(host.querySelector("[data-role=status]")?.textContent).toBe(
		"Enter a Prolog query.",
	);
});

it("numbers source lines and restores the current line when stepping and replaying", async () => {
	const recording = {
		...trace,
		code: "p(X) :-\n    q(X).\nq(a).",
		events: [
			{
				port: "call",
				frame: 1,
				parent: 0,
				level: 1,
				goal: "q(X)",
				sourceLine: 2,
			},
			{
				port: "unify",
				frame: 1,
				parent: 0,
				level: 1,
				goal: "q(a)",
				sourceLine: 3,
			},
			{ port: "solution", frame: 0, parent: 0, level: 0, goal: "X=a" },
		],
	};
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(JSON.stringify(recording))),
	);
	const host = document.createElement("tp-prolog-tracer");
	host.trace = "/saved.json";
	document.body.append(host);
	await host.refresh();
	expect(
		Array.from(
			host.querySelectorAll(".resolution-line-number"),
			(e) => e.textContent,
		),
	).toEqual(["1", "2", "3"]);
	host.goTo(0);
	expect(
		host
			.querySelector(".resolution-source-line.current")
			?.getAttribute("data-line"),
	).toBe("2");
	host.goTo(1);
	expect(
		host.querySelector(".resolution-source-line.current")?.textContent,
	).toContain("q(a).");
	host.goTo(0);
	expect(
		host
			.querySelector(".resolution-source-line.current")
			?.getAttribute("data-line"),
	).toBe("2");
	host.goTo(2);
	expect(host.querySelector(".resolution-source-line.current")).toBeNull();
	expect(state.workers).toHaveLength(0);
});
