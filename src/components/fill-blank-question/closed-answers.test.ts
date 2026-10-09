import { afterEach, expect, it, vi } from "vitest";
import "./fill-blank-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

it("keeps the info instructions under feedback and cleans them up", () => {
	const { element } = question();
	const output = element.querySelector("[data-tp-question-feedback-output]");
	const instructions = output?.nextElementSibling;
	expect(instructions?.localName).toBe("tp-callout");
	expect(instructions?.getAttribute("variant")).toBe("info");
	expect(instructions?.getAttribute("heading")).toBe("Interactions");
	expect(instructions?.hasAttribute("closable")).toBe(true);
	expect(instructions?.textContent).toContain("Drag an answer to a blank");
	expect(
		Array.from(
			instructions?.querySelectorAll("dl > dt") ?? [],
			(term) => term.textContent,
		),
	).toEqual(["Mouse", "Keyboard"]);
	const descriptions = instructions?.querySelectorAll("dl > dd");
	expect(descriptions).toHaveLength(2);
	expect(descriptions?.[0]?.textContent).toContain("Drag an answer");
	expect(descriptions?.[1]?.textContent).toContain(
		"Right Arrow to reach the answers",
	);
	expect(
		element.querySelector(
			"[data-tp-closed-answers] [data-tp-closed-instructions]",
		),
	).toBeNull();
	const closeButton = instructions?.querySelector("[data-tp-callout-close]");
	expect(closeButton).not.toBeNull();
	closeButton?.dispatchEvent(new Event("click"));
	expect(instructions?.hasAttribute("hidden")).toBe(true);
	element
		.querySelector('tp-icon-button[data-action="reset"]')
		?.dispatchEvent(new Event("click"));
	expect(
		element.querySelectorAll("[data-tp-closed-instructions]"),
	).toHaveLength(1);
	expect(output?.nextElementSibling?.getAttribute("variant")).toBe("info");
	element.closed = false;
	expect(element.querySelector("[data-tp-closed-instructions]")).toBeNull();
});

/** Builds a two-blank question with independently assignable answer tokens. */
function question(answer = "Paris,Rome") {
	const element = document.createElement("tp-fill-blank-question");
	element.closed = true;
	element.innerHTML = `<dl><dt>Answers</dt><dd><ol>${answer
		.split(",")
		.map((value) => `<li>${value}</li>`)
		.join("")}</ol></dd><dt>Prompt</dt><dd>Complete.</dd><dt>Form</dt><dd>
		<tp-textfield name="first" aria-label="First capital" clearable></tp-textfield>
		<tp-textfield name="second" aria-label="Second capital" clearable></tp-textfield>
		</dd></dl>`;
	document.body.append(element);
	const fields = [...element.querySelectorAll("tp-textfield")];
	const buttons = [
		...element.querySelectorAll<HTMLElement>("tp-button[data-tp-closed-item]"),
	];
	const controller = element.querySelector("tp-dragdrop");
	const first = fields[0];
	const second = fields[1];
	const choice = buttons[0];
	const other = buttons[1];
	if (!first || !second || !choice || !other || !controller)
		throw new Error("Expected closed question controls");
	return { element, first, second, choice, other, controller, buttons };
}

/** Emits the shared controller's assignment event. */
function drop(
	controller: HTMLElement,
	source: HTMLElement,
	target: HTMLElement | null,
): void {
	controller.dispatchEvent(
		new CustomEvent("tp-dragdrop-drop", {
			detail: { source, target, position: "inside" },
		}),
	);
}

it("shuffles the bank and keeps open mode unchanged when disabled", () => {
	vi.spyOn(Math, "random").mockReturnValue(0);
	const { element, first, buttons } = question();
	expect(buttons.map((button) => button.textContent)).toEqual([
		"Rome",
		"Paris",
	]);
	expect(first.readOnly).toBe(true);
	const layout = element.querySelector("tp-sidebar");
	expect(layout?.hasAttribute("right-sidebar")).toBe(true);
	expect(layout?.children).toHaveLength(2);
	expect(
		layout?.lastElementChild
			?.querySelector(":scope > tp-divider")
			?.getAttribute("orientation"),
	).toBe("vertical");
	expect(
		layout?.lastElementChild?.querySelector("[data-tp-closed-answers-heading]")
			?.textContent,
	).toBe("Answers");
	expect(layout?.firstElementChild?.localName).toBe("tp-fill-blank");
	expect(
		layout?.lastElementChild?.querySelector("tp-button-group"),
	).not.toBeNull();
	element.closed = false;
	expect(element.querySelector("[data-tp-closed-answers]")).toBeNull();
	expect(first.readOnly).toBe(false);
	expect(first.hasAttribute("draggable")).toBe(false);
	element.closed = true;
	expect(element.querySelectorAll("tp-dragdrop")).toHaveLength(1);
});

it("assigns, moves and replaces answers without duplicating a token", () => {
	const { controller, choice, other, first, second } = question();
	drop(controller, choice, first);
	expect(choice.hasAttribute("data-tp-closed-assigned")).toBe(true);
	expect(
		choice.querySelector("button")?.getAttribute("aria-description"),
	).toContain("First capital");
	expect(first.value).toBe(choice.textContent);
	drop(controller, choice, second);
	expect(first.value).toBe("");
	expect(second.value).toBe(choice.textContent);
	drop(controller, other, second);
	expect(choice.hasAttribute("data-tp-closed-assigned")).toBe(false);
	expect(choice.querySelector("button")?.hasAttribute("aria-description")).toBe(
		false,
	);
	expect(other.hasAttribute("data-tp-closed-assigned")).toBe(true);
	expect(second.value).toBe(other.textContent);
	drop(controller, second, first);
	expect(second.value).toBe("");
	expect(first.value).toBe(other.textContent);
	drop(controller, choice, null);
	first.disabled = true;
	drop(controller, choice, first);
	expect(first.value).toBe(other.textContent);
});

it("accepts repeated answers as separate tokens and supports click and clear", () => {
	const { first, second, choice, other, element } = question("Paris,Paris");
	choice.click();
	first.click();
	other.click();
	second.click();
	expect([first.value, second.value]).toEqual(["Paris", "Paris"]);
	first
		.querySelector("input")
		?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Delete", bubbles: true }),
		);
	expect(first.value).toBe("");
	expect(second.value).toBe("Paris");
	choice.click();
	first.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
	);
	first.click();
	expect(first.value).toBe("");
	element
		.querySelector('tp-icon-button[data-action="reset"]')
		?.dispatchEvent(new Event("click"));
	expect(second.value).toBe("");
	expect(element.querySelectorAll("tp-dragdrop")).toHaveLength(1);
});

it("moves actual keyboard focus from the answer to blanks and assigns", async () => {
	const { choice, first, second } = question();
	await vi.waitFor(() => expect(choice.querySelector("button")).not.toBeNull());
	const button = choice.querySelector("button");
	if (!button) throw new Error("Expected button");
	button.focus();
	for (const [key, target] of [
		["Enter", first],
		["ArrowDown", second],
		["Enter", second],
	] as const) {
		document.activeElement?.dispatchEvent(
			new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
		);
		expect(document.activeElement).toBe(target.querySelector("input"));
	}
	expect(second.value).toBe(choice.textContent);
});

it("reaches and browses cities directly from a focused blank", () => {
	const { first, second, choice, other } = question();
	const input = second.querySelector("input");
	if (!input) throw new Error("Expected input");
	input.focus();
	for (const [key, target] of [
		["ArrowRight", choice],
		["ArrowDown", other],
		["ArrowDown", choice],
		["ArrowUp", other],
	] as const) {
		document.activeElement?.dispatchEvent(
			new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
		);
		expect(document.activeElement).toBe(target.querySelector("button"));
		expect(second.hasAttribute("data-tp-closed-target")).toBe(true);
	}
	document.activeElement?.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: "Enter",
			bubbles: true,
			cancelable: true,
		}),
	);
	expect(document.activeElement).toBe(input);
	expect(second.value).toBe(other.textContent);
	expect(first.value).toBe("");
	expect(second.hasAttribute("data-tp-closed-target")).toBe(false);
});

it("cancels the highlighted target without changing its value", () => {
	const { element, second } = question();
	const input = second.querySelector("input");
	if (!input) throw new Error("Expected input");
	input.focus();
	for (const key of ["ArrowRight", "Escape"]) {
		document.activeElement?.dispatchEvent(
			new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
		);
	}
	expect(document.activeElement).toBe(input);
	expect(second.value).toBe("");
	expect(element.querySelector("[data-tp-closed-target]")).toBeNull();
	input.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
	element.closed = false;
	expect(second.hasAttribute("data-tp-closed-target")).toBe(false);
});

it("supports Space, cancellation and skips disabled blanks", async () => {
	const { choice, first, second } = question();
	await vi.waitFor(() => expect(choice.querySelector("button")).not.toBeNull());
	const button = choice.querySelector("button");
	if (!button) throw new Error("Expected button");
	first.disabled = true;
	button.focus();
	for (const key of [" ", "ArrowUp"]) {
		document.activeElement?.dispatchEvent(
			new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
		);
		expect(document.activeElement).toBe(second.querySelector("input"));
	}
	document.activeElement?.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: "Escape",
			bubbles: true,
			cancelable: true,
		}),
	);
	expect(document.activeElement).toBe(button);
	expect(second.value).toBe("");
	button.dispatchEvent(
		new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }),
	);
	document.activeElement?.dispatchEvent(
		new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true }),
	);
	expect(second.value).toBe(choice.textContent);
});

it("cleans up disconnected questions and isolates simultaneous banks", () => {
	const one = question();
	const two = question();
	expect(one.controller.getAttribute("root")).not.toBe(
		two.controller.getAttribute("root"),
	);
	drop(one.controller, one.choice, two.first);
	expect(two.first.value).toBe("");
	one.element.remove();
	expect(one.first.readOnly).toBe(false);
	document.body.append(one.element);
	expect(one.element.querySelectorAll("tp-dragdrop")).toHaveLength(1);
});

it("retains normal scoring after assignment", () => {
	const { element, buttons, controller, first, second } = question();
	for (const button of buttons)
		drop(controller, button, button.textContent === "Paris" ? first : second);
	element
		.querySelector('tp-icon-button[data-action="submit"]')
		?.dispatchEvent(new Event("click"));
	expect(
		element.querySelector("[data-tp-question-feedback-output]")?.textContent,
	).toContain("Congratulations, correct answer!");
});

it("preserves list order and commas in answers across reconnection", () => {
	const element = document.createElement("tp-fill-blank-question");
	element.closed = true;
	element.innerHTML = `<dl><dt>Answers</dt><dd><ol><li>Paris, France</li><li>Rome</li></ol></dd>
		<dt>Form</dt><dd><tp-textfield name="first"></tp-textfield><tp-textfield name="second"></tp-textfield></dd></dl>`;
	document.body.append(element);
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const controller = element.querySelector("tp-dragdrop");
		const fields = element.querySelectorAll("tp-textfield");
		if (!controller || !fields[0] || !fields[1])
			throw new Error("Missing closed controls");
		for (const button of element.querySelectorAll<HTMLElement>(
			"tp-button[data-tp-closed-item]",
		)) {
			drop(
				controller,
				button,
				button.textContent === "Rome" ? fields[1] : fields[0],
			);
		}
		element
			.querySelector('tp-icon-button[data-action="submit"]')
			?.dispatchEvent(new Event("click"));
		expect(
			element.querySelector("[data-tp-question-feedback-output]")?.textContent,
		).toContain("Congratulations, correct answer!");
		element.remove();
		document.body.append(element);
	}
});

it("handles native pointer drag events through tp-dragdrop", async () => {
	const { choice, first } = question();
	await vi.waitFor(() => expect(choice.querySelector("button")).not.toBeNull());
	const button = choice.querySelector("button");
	const input = first.querySelector("input");
	if (!button || !input) throw new Error("Expected interactive controls");
	const dataTransfer = { effectAllowed: "", dropEffect: "", setData: vi.fn() };
	for (const [type, target] of [
		["dragstart", choice],
		["dragover", input],
		["drop", input],
	] as const) {
		const event = new Event(type, { bubbles: true, cancelable: true });
		Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
		Object.defineProperty(event, "clientY", { value: 0 });
		target.dispatchEvent(event);
	}
	expect(first.value).toBe(choice.textContent);
});

it("creates a closed bank after an asynchronous src load", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				prompt: "Match.",
				markup: "html",
				form: '<tp-textfield name="capital" aria-label="Capital"></tp-textfield>',
				attributes: { answer: ["Paris"] },
			}),
		}),
	);
	try {
		const element = document.createElement("tp-fill-blank-question");
		element.closed = true;
		element.setAttribute("src", "/question.json");
		document.body.append(element);
		await vi.waitFor(() =>
			expect(
				element.querySelector("tp-button[data-tp-closed-item]")?.textContent,
			).toBe("Paris"),
		);
		expect(element.querySelector("tp-textfield")?.readOnly).toBe(true);
	} finally {
		vi.unstubAllGlobals();
	}
});
