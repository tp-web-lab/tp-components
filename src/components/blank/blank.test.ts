import { afterEach, expect, it } from "vitest";
import "./blank.js";
import "../fill-blank/fill-blank.js";
import "../fill-blank-question/fill-blank-question.js";

afterEach(() => document.body.replaceChildren());

it("supports properties, text, rich content, restoration and clearing", () => {
	const blank = document.createElement("tp-blank");
	blank.name = "result";
	blank.value = "initial";
	expect(blank.name).toBe("result");
	expect(blank.readOnly).toBe(true);
	blank.readOnly = false;
	expect(blank.readOnly).toBe(true);
	document.body.append(blank);
	expect(blank.textContent).toContain("initial");
	blank.setAttribute("aria-label", "Expected result");
	expect(blank.getAttribute("aria-label")).toBe("Expected result");
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("aria-label", "One half");
	blank.setAnswer("1", svg);
	expect(blank.value).toBe("1");
	expect(blank.querySelector("svg")).not.toBe(svg);
	blank.clear();
	expect(blank.value).toBe("");
	blank.value = "1";
	expect(blank.querySelector("svg")).not.toBeNull();
	blank.disabled = true;
	blank.clear();
	blank.setAnswer("2", document.createTextNode("ignored"));
	expect(blank.value).toBe("1");
	blank.disabled = false;
	blank.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
	expect(blank.value).toBe("1");
	blank.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));
	expect(blank.value).toBe("");
	blank.setAttribute("placeholder", "Drop here");
	expect(blank.textContent).toContain("Drop here");
	blank.remove();
	document.body.append(blank);
	expect(blank.querySelector("tp-button")).toBeNull();
	expect(blank.tabIndex).toBe(0);
});

it("participates in form data and reset without counting rich content as fields", () => {
	const form = document.createElement("tp-fill-blank");
	form.innerHTML = '<tp-blank></tp-blank><input name="text">';
	document.body.append(form);
	const blank = form.querySelector("tp-blank");
	if (!blank) throw new Error("Missing blank");
	expect(blank.name).not.toBe("");
	blank.setAnswer("2", document.createElement("img"));
	expect(form.value.get(blank.name)).toBe("2");
	form.reset();
	expect(blank.value).toBe("");
	expect(blank.querySelector("img")).toBeNull();
	const data = new FormData();
	data.set(blank.name, "2");
	form.value = data;
	expect(blank.querySelector("img")).not.toBeNull();
});

it("assigns SVG by original list rank and retains the keyboard target", () => {
	const question = document.createElement("tp-fill-blank-question");
	question.closed = true;
	question.innerHTML = `<dl><dt>Answers</dt><dd><ol><li><svg aria-label="Triangle" role="img"><path d="M0 10L5 0L10 10Z"/></svg></li><li>Paris</li></ol></dd><dt>Form</dt><dd><tp-blank name="shape" aria-label="Shape"></tp-blank><tp-textfield name="city"></tp-textfield></dd></dl>`;
	document.body.append(question);
	const blank = question.querySelector("tp-blank");
	const controller = question.querySelector("tp-dragdrop");
	const choice = question.querySelector(
		'tp-button[data-tp-closed-item][aria-label="Triangle"]',
	);
	if (!blank || !controller || !choice)
		throw new Error("Missing rich controls");
	blank.focus();
	blank.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	expect(blank.hasAttribute("data-tp-closed-target")).toBe(true);
	choice
		.querySelector("button")
		?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
		);
	expect(blank.value).toBe("1");
	expect(blank.querySelector(":scope > svg")).not.toBeNull();
	expect(blank.querySelector("tp-button")).toBeNull();
	expect(document.activeElement).toBe(blank);
	const close = blank.querySelector("[data-tp-blank-clear]");
	expect(close).not.toBeNull();
	close?.dispatchEvent(new Event("click", { bubbles: true }));
	expect(blank.value).toBe("");
	expect(choice.hasAttribute("data-tp-closed-assigned")).toBe(false);
	controller.dispatchEvent(
		new CustomEvent("tp-dragdrop-drop", {
			detail: { source: choice, target: blank },
		}),
	);
	const city = question.querySelector(
		'tp-button[data-tp-closed-item][aria-label="Paris"]',
	);
	controller.dispatchEvent(
		new CustomEvent("tp-dragdrop-drop", {
			detail: { source: city, target: question.querySelector("tp-textfield") },
		}),
	);
	question
		.querySelector('[data-action="submit"]')
		?.dispatchEvent(new Event("click"));
	expect(
		question.querySelector("[data-tp-question-feedback-output]")?.textContent,
	).toContain("Congratulations, correct answer!");
});
