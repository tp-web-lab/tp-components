import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import "./fill-blank.js";
import "../button/button.js";
import "../dragdrop/dragdrop.js";

afterEach(() => document.body.replaceChildren());

it("assigns dragged images, replaces them by click and clears the documented blank", async () => {
	const template = document.createElement("template");
	template.innerHTML = readFileSync(
		"public/docs/components/fill-blank/examples/examples.html",
		"utf8",
	);
	const demo = template.content
		.querySelector("template")
		?.content.querySelector("#selected-answer-demo");
	if (!demo) throw new Error("Missing example");
	document.body.append(demo);
	const scriptPath =
		"../../../public/docs/components/fill-blank/examples/selected-answer.js";
	await import(scriptPath);
	await vi.waitFor(() =>
		expect(demo.querySelector("[data-event-output] code")).not.toBeNull(),
	);
	const blank = demo.querySelector("tp-blank");
	const triangle = demo.querySelector('tp-button[data-answer="triangle"] img');
	const square = demo.querySelector('tp-button[data-answer="square"]');
	if (!blank || !triangle || !square) throw new Error("Missing controls");
	const dataTransfer = { effectAllowed: "", dropEffect: "", setData: vi.fn() };
	for (const [type, target] of [
		["dragstart", triangle],
		["dragover", blank],
		["drop", blank],
	] as const) {
		const event = new Event(type, { bubbles: true, cancelable: true });
		Object.defineProperties(event, {
			dataTransfer: { value: dataTransfer },
			clientY: { value: 0 },
		});
		target.dispatchEvent(event);
	}
	expect(blank.value).toBe("triangle");
	expect(blank.querySelector("img")?.getAttribute("alt")).toBe("Triangle");
	expect(triangle.isConnected).toBe(true);
	square.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	expect(blank.value).toBe("square");
	expect(blank.querySelector("img")?.getAttribute("alt")).toBe("Square");
	const output = demo.querySelector("[data-event-output] code");
	expect(JSON.parse(output?.textContent ?? "{}").detail.formData).toEqual([
		["shape", "square"],
	]);
	blank.clear();
	expect(blank.querySelector("img")).toBeNull();
	expect(JSON.parse(output?.textContent ?? "{}").detail.value).toEqual({
		shape: "",
	});
});
