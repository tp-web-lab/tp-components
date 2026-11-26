import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSchemeSession } from "./scheme-runtime.js";
import "./scheme.js";

vi.mock("./scheme-runtime.js", () => ({ createSchemeSession: vi.fn() }));
const execute = vi.fn(async (_code: string) => "49");
const dispose = vi.fn();
beforeEach(() => {
	execute.mockReset().mockResolvedValue("49");
	dispose.mockReset();
	vi.mocked(createSchemeSession).mockReset().mockResolvedValue({
		execute,
		dispose,
		set: vi.fn(),
		isolateProgram: vi.fn(),
		bind: vi.fn(),
		load: vi.fn(),
		description: "Scheme · LIPS 1.0.0-beta.23.1",
	});
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
function mount() {
	const el = document.createElement("tp-scheme");
	el.query = "(square 7)";
	el.innerHTML =
		'<script type="tp/scheme">\n    (define (square x)\n        (* x x))\n</script>';
	document.body.append(el);
	return el;
}
async function ready(el: HTMLElement) {
	await vi.waitFor(() => expect(el.getAttribute("aria-busy")).toBe("false"));
}
describe("tp-scheme", () => {
	it("initializes dedented Scheme and displays the loaded engine version", async () => {
		const el = mount();
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"Loading LIPS",
		);
		await ready(el);
		expect(el.shadowRoot).toBeNull();
		expect(execute).toHaveBeenCalledWith("(define (square x)\n    (* x x))");
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"Scheme · LIPS 1.0.0-beta.23.1",
		);
		await el.run();
		expect(execute).toHaveBeenLastCalledWith("(square 7)");
		expect(el.querySelector("tp-textfield")?.value).toBe("(square 7)");
	});
	it("clears output without resetting the session and restores the authored program on Reset", async () => {
		const el = mount();
		await ready(el);
		el.clear();
		expect(dispose).not.toHaveBeenCalled();
		expect(el.querySelector("[role=log]")?.textContent).toBe("");
		await el.reset();
		expect(dispose).toHaveBeenCalledOnce();
		expect(createSchemeSession).toHaveBeenCalledTimes(2);
		expect(el.querySelector("[role=log]")?.textContent).not.toContain(
			"Engine:",
		);
	});
	it("recovers from an exception and retains the prompt", async () => {
		const el = mount();
		await ready(el);
		execute.mockRejectedValueOnce(new Error("Expected Scheme error"));
		await el.run('(error "Expected Scheme error")');
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"Expected Scheme error",
		);
		await el.run("(square 7)");
		expect(el.querySelector("[role=log]")?.textContent).toMatch(/49\n$/);
		expect(el.querySelector("tp-textfield")?.disabled).toBe(false);
	});
	it("shows a loading failure and permits retry through Reset", async () => {
		vi.mocked(createSchemeSession).mockRejectedValueOnce(
			new Error("Unable to load LIPS script."),
		);
		const el = mount();
		await ready(el);
		expect(el.querySelector("[role=log]")?.textContent).toContain(
			"Unable to load LIPS",
		);
		await el.reset();
		expect(el.querySelector("[role=log]")?.textContent).not.toContain(
			"Engine:",
		);
	});
	it("releases a session removed while its engine is still loading", async () => {
		let finish:
			| ((engine: Awaited<ReturnType<typeof createSchemeSession>>) => void)
			| undefined;
		vi.mocked(createSchemeSession).mockImplementationOnce(
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
			isolateProgram: vi.fn(),
			bind: vi.fn(),
			load: vi.fn(),
			description: "Scheme · LIPS",
		});
		await vi.waitFor(() => expect(dispose).toHaveBeenCalledOnce());
		expect(execute).not.toHaveBeenCalled();
	});
});
