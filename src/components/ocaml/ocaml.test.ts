import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TpDrawer } from "../drawer/drawer.js";
import { createOCamlSession } from "./ocaml-runtime.js";
import "./ocaml.js";

vi.mock("./ocaml-runtime.js", () => ({
	createOCamlSession: vi.fn(),
	OCAML_RUNTIME_URL: "http://localhost/runtimes/ocaml/toplevel.js",
}));
vi.mock("../ocaml-tracer/ocaml-tracer.js", () => {
	class Recorder extends HTMLElement {
		value = "";
		filename = "";
		record = vi.fn();
		stop = vi.fn();
		refresh = vi.fn(async () => {});
	}
	customElements.define("tp-ocaml-tracer", Recorder);
	return {};
});
const execute = vi.fn(async (_code: string) => "49");
const dispose = vi.fn();
beforeEach(() => {
	execute.mockReset().mockResolvedValue("49");
	dispose.mockReset();
	vi.mocked(createOCamlSession).mockReset().mockResolvedValue({
		execute,
		dispose,
		set: vi.fn(),
		bind: vi.fn(),
		file: vi.fn(),
		description: "OCaml · Js_of_ocaml 6.5.0",
	});
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
function mount() {
	const el = document.createElement("tp-ocaml");
	el.query = "square 7;;";
	el.innerHTML =
		'<script type="tp/ocaml">\n    let square x = x * x;;\n</script>';
	document.body.append(el);
	return el;
}
async function ready(el: HTMLElement) {
	await vi.waitFor(() => expect(el.getAttribute("aria-busy")).toBe("false"));
}
describe("tp-ocaml", () => {
	it("initializes dedented OCaml and displays the loaded engine version", async () => {
		const el = mount();
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"Loading Js_of_ocaml",
		);
		await ready(el);
		expect(el.shadowRoot).toBeNull();
		expect(execute).toHaveBeenCalledWith("let square x = x * x;;");
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"OCaml · Js_of_ocaml 6.5.0",
		);
		await el.run();
		expect(execute).toHaveBeenLastCalledWith("square 7;;");
		expect(el.querySelector("tp-textfield")?.value).toBe("square 7;;");
	});
	it("clears output without resetting the session and restores the authored program on Reset", async () => {
		const el = mount();
		await ready(el);
		el.clear();
		expect(dispose).not.toHaveBeenCalled();
		expect(el.querySelector("[role=log]")?.textContent).toBe("");
		await el.reset();
		expect(dispose).toHaveBeenCalledOnce();
		expect(createOCamlSession).toHaveBeenCalledTimes(2);
		expect(el.querySelector("[role=log]")?.textContent).not.toContain(
			"Engine:",
		);
	});
	it("recovers from an exception and retains the prompt", async () => {
		const el = mount();
		await ready(el);
		execute.mockRejectedValueOnce(new Error("Expected OCaml error"));
		await el.run('1 + "wrong";;');
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"Expected OCaml error",
		);
		await el.run("square 7;;");
		expect(el.querySelector("[role=log]")?.textContent).toMatch(/49\n$/);
		expect(el.querySelector("tp-textfield")?.disabled).toBe(false);
	});
	it("shows a loading failure and permits retry through Reset", async () => {
		vi.mocked(createOCamlSession).mockRejectedValueOnce(
			new Error("Unable to load Js_of_ocaml script."),
		);
		const el = mount();
		await ready(el);
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"Unable to load Js_of_ocaml",
		);
		await el.reset();
		expect(el.querySelector("[role=log]")?.textContent).not.toContain(
			"Engine:",
		);
	});
	it("releases a session removed while its engine is still loading", async () => {
		let finish:
			| ((engine: Awaited<ReturnType<typeof createOCamlSession>>) => void)
			| undefined;
		vi.mocked(createOCamlSession).mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					finish = resolve;
				}),
		);
		const el = mount();
		await vi.waitFor(() => expect(finish).toBeDefined());
		el.remove();
		finish?.({
			execute,
			dispose,
			set: vi.fn(),
			bind: vi.fn(),
			file: vi.fn(),
			description: "OCaml · Js_of_ocaml",
		});
		await vi.waitFor(() => expect(dispose).toHaveBeenCalledOnce());
		expect(execute).not.toHaveBeenCalled();
	});
});

describe("OCaml execution trace drawer", () => {
	it("is opt-in and records the edited source and prompt as separate phrases", async () => {
		const el = mount();
		await ready(el);
		await el.openTrace();
		expect(el.querySelector('[data-command="trace"]')).toBeNull();
		expect(el.querySelector<TpDrawer>("tp-drawer")).toBeNull();
		el.tracer = true;
		el.filename = "edited.ml";
		vi.spyOn(el, "getSource").mockResolvedValue("let square x = x * x");
		const prompt = el.querySelector("tp-textfield");
		if (!prompt) throw new Error("Missing prompt");
		prompt.value = "print_int (square 8);;";
		const calls = execute.mock.calls.length;
		await el.openTrace();
		const drawer = el.querySelector<TpDrawer>("tp-drawer");
		expect(drawer?.getAttribute("width")).toBe("75%");
		expect(drawer?.open).toBe(true);
		const trace = el.querySelector("tp-ocaml-tracer");
		expect(trace?.value).toBe(
			"let square x = x * x\n;;\n\nprint_int (square 8);;",
		);
		expect(trace?.filename).toBe("edited.ml");
		expect(trace?.record).toHaveBeenCalledOnce();
		expect(execute).toHaveBeenCalledTimes(calls);
		el.mode = "simple";
		expect(
			el.querySelector('.tp-interpreter-prompt > [data-command="trace"]'),
		).not.toBeNull();
		el.tracer = false;
		expect(trace?.stop).toHaveBeenCalled();
		expect(el.querySelector<TpDrawer>("tp-drawer")).toBeNull();
		expect(el.querySelector('[data-command="trace"]')).toBeNull();
	});
	it("reopens using the new query and stops when the drawer closes", async () => {
		const el = mount();
		await ready(el);
		el.tracer = true;
		await el.openTrace();
		const first = el.querySelector("tp-ocaml-tracer");
		el.querySelector<TpDrawer>("tp-drawer")?.hide();
		expect(first?.stop).toHaveBeenCalled();
		const prompt = el.querySelector("tp-textfield");
		if (!prompt) throw new Error("Missing prompt");
		prompt.value = "square 9;;";
		await el.openTrace();
		expect(el.querySelectorAll("tp-drawer")).toHaveLength(1);
		expect(el.querySelector("tp-ocaml-tracer")?.value).toContain("square 9;;");
		expect(el.querySelector("tp-ocaml-tracer")).not.toBe(first);
	});
});
