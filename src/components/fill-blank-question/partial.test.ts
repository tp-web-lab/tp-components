import { afterEach, expect, it } from "vitest";
import "./fill-blank-question.js";

/** Three rich blanks let a submission include correct, incorrect and empty answers. */
function fixture() {
	const question = document.createElement("tp-fill-blank-question");
	question.innerHTML = `<dl><dt>Answers</dt><dd><ol><li>A</li><li>B</li><li>C</li></ol></dd>
	<dt>Form</dt><dd><tp-blank name="a"></tp-blank><tp-blank name="b"></tp-blank><tp-blank name="c"></tp-blank></dd></dl>`;
	question.closed = true;
	document.body.append(question);
	const fields = [...question.querySelectorAll("tp-blank")];
	const submit = () =>
		question
			.querySelector('[data-action="submit"]')
			?.dispatchEvent(new Event("click"));
	const output = () =>
		question.querySelector("[data-tp-question-feedback-output]");
	return { question, fields, submit, output };
}

afterEach(() => document.body.replaceChildren());

it("rejects incomplete responses by default and accepts them when partial is present", () => {
	const { question, fields, submit, output } = fixture();
	expect(question.partial).toBe(false);
	fields[0]?.setAnswer("1", document.createTextNode("A"));
	submit();
	expect(question.querySelector("[data-tp-blank-result]")).toBeNull();
	expect(
		output()?.querySelector(
			'tp-badge[variant="success"], tp-badge[variant="danger"]',
		),
	).toBeNull();
	question.setAttribute("partial", "false");
	expect(question.partial).toBe(true);
	fields[1]?.setAnswer("3", document.createTextNode("C"));
	submit();
	expect(
		fields.map((field) => field.getAttribute("data-tp-blank-result")),
	).toEqual(["success", "danger", null]);
	expect(output()?.textContent).toContain("1/3");
	question.partial = false;
	expect(question.hasAttribute("partial")).toBe(false);
	expect(question.querySelector("[data-tp-blank-result]")).toBeNull();
});

it("clears stale grading on editing, clearing and resetting, and grades the next submission", () => {
	const { question, fields, submit, output } = fixture();
	question.partial = true;
	fields[0]?.setAnswer("1", document.createTextNode("A"));
	fields[1]?.setAnswer("3", document.createTextNode("C"));
	submit();
	fields[1]?.setAnswer("2", document.createTextNode("B"));
	expect(fields[1]?.hasAttribute("data-tp-blank-result")).toBe(false);
	expect(fields[0]?.getAttribute("data-tp-blank-result")).toBe("success");
	fields[2]?.setAnswer("3", document.createTextNode("C"));
	submit();
	expect(
		fields.every(
			(field) => field.getAttribute("data-tp-blank-result") === "success",
		),
	).toBe(true);
	expect(
		output()?.querySelector('tp-badge[variant="success"]')?.textContent,
	).toBe("3/3");
	fields[0]?.clear();
	expect(fields[0]?.hasAttribute("data-tp-blank-result")).toBe(false);
	question
		.querySelector('[data-action="reset"]')
		?.dispatchEvent(new Event("click"));
	expect(
		fields.every(
			(field) =>
				field.value === "" && !field.hasAttribute("data-tp-blank-result"),
		),
	).toBe(true);
});

it("uses case sensitivity when grading partially filled text fields", () => {
	const question = document.createElement("tp-fill-blank-question");
	question.partial = true;
	question.caseSensitive = true;
	question.setAttribute("answer", "Paris,Rome");
	question.innerHTML =
		'<dl><dt>Form</dt><dd><tp-textfield name="a"></tp-textfield><tp-textfield name="b"></tp-textfield></dd></dl>';
	document.body.append(question);
	const field = question.querySelector("input");
	if (!field) throw new Error("Missing field");
	field.value = "paris";
	question
		.querySelector('[data-action="submit"]')
		?.dispatchEvent(new Event("click"));
	expect(field.getAttribute("data-tp-blank-result")).toBe("danger");
	field.value = "Paris";
	field.dispatchEvent(new Event("input", { bubbles: true }));
	expect(field.hasAttribute("data-tp-blank-result")).toBe(false);
	question
		.querySelector('[data-action="submit"]')
		?.dispatchEvent(new Event("click"));
	expect(field.getAttribute("data-tp-blank-result")).toBe("success");
});
