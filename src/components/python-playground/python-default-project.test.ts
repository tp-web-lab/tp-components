import { afterEach, expect, it, vi } from "vitest";
import { TpPythonPlayground } from "./python-playground.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it("provides a default Python project that writes to its HTML document and console", () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const playground = new TpPythonPlayground();
	document.body.append(playground);
	const project = playground.getProject();
	expect(project.findFile("/index.html")?.content).toBe(
		'<main id="app"></main>',
	);
	expect(project.findFile("/main.py")?.content).toContain(
		"from js import document",
	);
	expect(project.findFile("/main.py")?.content).toContain(
		'document.getElementById("app").textContent = message',
	);
	expect(project.findFile("/main.py")?.content).toContain("print(message)");
});
