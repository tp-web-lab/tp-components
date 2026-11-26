import { afterEach, beforeEach, expect, it, vi } from "vitest";

vi.mock("./javascript-engine.js", () => ({
	createJavascriptEngine: async () => ({
		execute: async () => undefined,
		dispose() {},
	}),
}));
vi.mock("../javascript-tracer/javascript-tracer.js", () => {
	class Trace extends HTMLElement {
		value = "";
		filename = "";
		record = vi.fn();
		stop = vi.fn();
		refresh = vi.fn(async () => {});
	}
	if (!customElements.get("tp-javascript-tracer"))
		customElements.define("tp-javascript-tracer", Trace);
	return {};
});

import "./javascript.js";

beforeEach(() => {
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
async function mount() {
	const host = document.createElement("tp-javascript");
	host.tracer = true;
	host.value = "let x = 1;";
	host.query = "console.log(x)";
	host.filename = "lesson.js";
	document.body.append(host);
	await vi.waitFor(() =>
		expect(host.querySelector("tp-textfield")).not.toBeNull(),
	);
	return host;
}
it("adds a toolbar command and records current edited code and query in a 75% drawer", async () => {
	const host = await mount();
	vi.spyOn(host, "getSource").mockResolvedValue("let x = 42;");
	const input = host.querySelector("tp-textfield");
	if (input) input.value = "console.log(x + 1)";
	expect(host.querySelector('[data-command="trace"]')).not.toBeNull();
	const transcript = host.querySelector("[role=log]")?.textContent;
	await host.openTrace();
	const drawer = host.querySelector("tp-drawer"),
		trace = drawer?.querySelector("tp-javascript-tracer");
	expect(drawer?.getAttribute("width")).toBe("75%");
	expect(drawer?.hasAttribute("open")).toBe(true);
	expect(trace?.value).toBe("let x = 42;\n\nconsole.log(x + 1)");
	expect(trace?.filename).toBe("lesson.js");
	expect(trace?.record).toHaveBeenCalledOnce();
	expect(host.querySelector("[role=log]")?.textContent).toBe(transcript);
});
it("stops on close and creates a fresh recording while retaining the resized width", async () => {
	const host = await mount();
	await host.openTrace();
	const drawer = host.querySelector("tp-drawer");
	const first = drawer?.querySelector("tp-javascript-tracer");
	drawer?.removeAttribute("open");
	expect(first?.stop).toHaveBeenCalled();
	drawer?.setAttribute("width", "60%");
	vi.spyOn(host, "getSource").mockResolvedValue("let x = 9;");
	await host.openTrace();
	expect(host.querySelectorAll("tp-drawer")).toHaveLength(1);
	expect(drawer?.getAttribute("width")).toBe("60%");
	expect(drawer?.querySelector("tp-javascript-tracer")?.value).toBe(
		"let x = 9;\n\nconsole.log(x)",
	);
	expect(drawer?.querySelector("tp-javascript-tracer")).not.toBe(first);
});
it("records only source for an empty query and cleans up when removed", async () => {
	const host = await mount();
	const input = host.querySelector("tp-textfield");
	if (input) input.value = " ";
	await host.openTrace();
	const trace = host.querySelector("tp-javascript-tracer");
	expect(trace?.value).toBe("let x = 1;");
	host.remove();
	expect(trace?.stop).toHaveBeenCalled();
	expect(host.querySelector("tp-drawer")).toBeNull();
});
it("does not open a drawer after disconnection during source loading", async () => {
	const host = await mount();
	let resolve!: (value: string) => void;
	vi.spyOn(host, "getSource").mockImplementation(
		() =>
			new Promise((r) => {
				resolve = r;
			}),
	);
	const pending = host.openTrace();
	host.remove();
	expect(
		host.querySelector('[data-command="trace"]')?.hasAttribute("disabled"),
	).toBe(false);
	resolve("x=3");
	await pending;
	expect(host.querySelector("tp-drawer")).toBeNull();
});
it("reports source errors and re-enables the command", async () => {
	const host = await mount();
	vi.spyOn(host, "getSource").mockRejectedValue(
		new Error("Source unavailable"),
	);
	await host.openTrace();
	expect(host.querySelector("[role=log]")?.textContent).toContain(
		"Trace error: Source unavailable",
	);
	expect(
		host.querySelector('[data-command="trace"]')?.hasAttribute("disabled"),
	).toBe(false);
});
