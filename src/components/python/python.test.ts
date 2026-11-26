import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPythonEngine } from "./python-engine.js";
import "./python.js";

vi.mock("./python-engine.js", () => ({ createPythonEngine: vi.fn() }));
const execute = vi.fn(async (_code: string) => "49");
const dispose = vi.fn();
beforeEach(() => {
	execute.mockReset().mockResolvedValue("49");
	dispose.mockReset();
	vi.mocked(createPythonEngine).mockReset().mockResolvedValue({
		execute,
		dispose,
		description: "Python 3.13.2 · Pyodide 0.29.3",
	});
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
function mount() {
	const el = document.createElement("tp-python");
	el.query = "square(7)";
	el.innerHTML =
		'<script type="tp/python">\n    def square(x):\n        return x*x\n</script>';
	document.body.append(el);
	return el;
}
async function ready(el: HTMLElement) {
	await vi.waitFor(() => expect(el.getAttribute("aria-busy")).toBe("false"));
}
describe("tp-python", () => {
	it("initializes dedented Python and displays the loaded engine version", async () => {
		const el = mount();
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"Loading Pyodide",
		);
		await ready(el);
		expect(el.shadowRoot).toBeNull();
		expect(execute).toHaveBeenCalledWith("def square(x):\n    return x*x");
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"Python 3.13.2 · Pyodide 0.29.3",
		);
		await el.run();
		expect(execute).toHaveBeenLastCalledWith("square(7)");
		expect(el.querySelector("tp-textfield")?.value).toBe("square(7)");
	});
	it("clears output without resetting the session and restores the authored program on Reset", async () => {
		const el = mount();
		await ready(el);
		el.clear();
		expect(dispose).not.toHaveBeenCalled();
		expect(el.querySelector("[role=log]")?.textContent).toBe("");
		await el.reset();
		expect(dispose).toHaveBeenCalledOnce();
		expect(createPythonEngine).toHaveBeenCalledTimes(2);
		expect(el.querySelector("[role=log]")?.textContent).not.toContain(
			"Engine:",
		);
	});
	it("recovers from an exception and retains the prompt", async () => {
		const el = mount();
		await ready(el);
		execute.mockRejectedValueOnce(
			new Error("ZeroDivisionError: division by zero"),
		);
		await el.run("1/0");
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"ZeroDivisionError",
		);
		await el.run("square(7)");
		expect(el.querySelector("[role=log]")?.textContent).toMatch(/49\n$/);
		expect(el.querySelector("tp-textfield")?.disabled).toBe(false);
	});
	it("shows a loading failure and permits retry through Reset", async () => {
		vi.mocked(createPythonEngine).mockRejectedValueOnce(
			new Error("Unable to load Pyodide script."),
		);
		const el = mount();
		await ready(el);
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"Unable to load Pyodide",
		);
		await el.reset();
		expect(el.querySelector("[role=log]")?.textContent).not.toContain(
			"Engine:",
		);
	});
	it("releases a session removed while its engine is still loading", async () => {
		let finish:
			| ((engine: Awaited<ReturnType<typeof createPythonEngine>>) => void)
			| undefined;
		vi.mocked(createPythonEngine).mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					finish = resolve;
				}),
		);
		const el = mount();
		await vi.waitFor(() => expect(finish).toBeDefined());
		el.remove();
		finish?.({ execute, dispose });
		await vi.waitFor(() => expect(dispose).toHaveBeenCalledOnce());
		expect(execute).not.toHaveBeenCalled();
	});
});
