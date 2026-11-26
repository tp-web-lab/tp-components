import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TpTraceableInterpreter } from "./traceable-interpreter.js";

class Recorder extends HTMLElement {
	value = "";
	query = "";
	filename = "";
	record = vi.fn();
	stop = vi.fn();
	refresh = vi.fn(async () => {});
}
class Interpreter extends TpTraceableInterpreter {
	protected readonly language = "javascript";
	protected readonly languageName = "JavaScript";
	protected readonly extension = "js";
	loads = 0;
	loader?: Promise<void>;
	protected async loadTracer() {
		this.loads++;
		await this.loader;
	}
	protected async createEngine() {
		return { execute: async () => "", dispose() {} };
	}
}
customElements.define("tp-test-optional-tracer", Interpreter);
customElements.define("tp-javascript-tracer", Recorder);
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
function mount(enabled = false) {
	const host = new Interpreter();
	host.tracer = enabled;
	host.query = "square(7)";
	document.body.append(host);
	vi.spyOn(host, "getSource").mockResolvedValue(
		"function square(x) { return x*x; }",
	);
	return host;
}
it("does not show, load or open a tracer when the attribute is absent", async () => {
	const host = mount();
	expect(host.tracer).toBe(false);
	expect(host.querySelector('[data-command="trace"]')).toBeNull();
	await host.openTrace();
	expect(host.getSource).not.toHaveBeenCalled();
	expect(host.loads).toBe(0);
	expect(host.querySelector("tp-drawer")).toBeNull();
});
it("reflects the boolean attribute and updates the command without duplicates", () => {
	const host = mount();
	host.setAttribute("tracer", "");
	expect(host.tracer).toBe(true);
	expect(host.querySelectorAll('[data-command="trace"]')).toHaveLength(1);
	host.tracer = true;
	expect(host.querySelectorAll('[data-command="trace"]')).toHaveLength(1);
	vi.spyOn(host, "toggleSource").mockResolvedValue();
	host.mode = "simple";
	expect(
		host.querySelector(".tp-interpreter-prompt > [data-command=trace]"),
	).not.toBeNull();
	host.mode = "default";
	expect(
		host.querySelector(".tp-interpreter-toolbar [data-command=trace]"),
	).not.toBeNull();
	expect(host.querySelectorAll("[data-command=trace]")).toHaveLength(1);
	host.tracer = false;
	expect(host.hasAttribute("tracer")).toBe(false);
	expect(host.querySelector('[data-command="trace"]')).toBeNull();
	expect(host.loads).toBe(0);
});
it("removing tracer stops an active recording and removes its drawer", async () => {
	const host = mount(true);
	await host.openTrace();
	const trace = host.querySelector<Recorder>("tp-javascript-tracer");
	expect(trace?.record).toHaveBeenCalledOnce();
	host.removeAttribute("tracer");
	expect(trace?.stop).toHaveBeenCalled();
	expect(host.querySelector("tp-drawer")).toBeNull();
	expect(host.querySelector('[data-command="trace"]')).toBeNull();
	await host.openTrace();
	expect(host.loads).toBe(1);
	host.tracer = true;
	await host.openTrace();
	expect(host.querySelectorAll("tp-drawer")).toHaveLength(1);
	expect(host.loads).toBe(2);
});
it("cancels before loading modules if tracer is removed while the source is pending", async () => {
	const host = mount(true);
	let resolve!: (source: string) => void;
	vi.mocked(host.getSource).mockImplementation(
		() =>
			new Promise((r) => {
				resolve = r;
			}),
	);
	const pending = host.openTrace();
	host.tracer = false;
	resolve("const n=1;");
	await pending;
	expect(host.loads).toBe(0);
	expect(host.querySelector("tp-drawer")).toBeNull();
});
it("cancels a pending module load even when tracer is immediately enabled again", async () => {
	const host = mount(true);
	let resolve!: () => void;
	host.loader = new Promise((r) => {
		resolve = r;
	});
	const pending = host.openTrace();
	await vi.waitFor(() => expect(host.loads).toBe(1));
	host.tracer = false;
	host.tracer = true;
	resolve();
	await pending;
	expect(host.querySelector("tp-drawer")).toBeNull();
	expect(
		host.querySelector('[data-command="trace"]')?.hasAttribute("disabled"),
	).toBe(false);
	await host.openTrace();
	expect(host.querySelector("tp-drawer")?.getAttribute("width")).toBe("75%");
});
it("reconnects with a single enabled button and no old recording", async () => {
	const host = mount(true);
	await host.openTrace();
	const trace = host.querySelector<Recorder>("tp-javascript-tracer");
	host.remove();
	expect(trace?.stop).toHaveBeenCalled();
	document.body.append(host);
	expect(host.querySelectorAll('[data-command="trace"]')).toHaveLength(1);
	expect(host.querySelector("tp-drawer")).toBeNull();
	await host.openTrace();
	expect(host.querySelector("tp-drawer")?.hasAttribute("open")).toBe(true);
});

it("passes the source and current query separately to preserve the navigation boundary", async () => {
	const host = mount(true);
	host.query = "square(9)";
	await host.openTrace();
	const trace = host.querySelector<Recorder>("tp-javascript-tracer");
	expect(trace?.value).toBe("function square(x) { return x*x; }");
	expect(trace?.query).toBe("square(9)");
	expect(trace?.record).toHaveBeenCalledOnce();
});
