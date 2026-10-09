import { afterEach, expect, it, vi } from "vitest";
import "./fill-blank-question.js";

const { loaded } = vi.hoisted(() => ({ loaded: vi.fn() }));
vi.mock("../markdown/markdown.js", async (importOriginal) => {
	loaded();
	return importOriginal();
});

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it("loads Markdown only when a question actually uses Markdown content", async () => {
	document.body.innerHTML = `<tp-fill-blank-question closed><dl>
		<dt>Answers</dt><dd><ol><li>Paris</li></ol></dd>
		<dt>Form</dt><dd>Capital: <tp-blank name="capital"></tp-blank></dd>
	</dl></tp-fill-blank-question>`;
	const choice = document.querySelector("tp-button[data-tp-closed-item]");
	const blank = document.querySelector("tp-blank");
	choice?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	blank?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	expect(blank?.value).toBe("1");
	expect(loaded).not.toHaveBeenCalled();

	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				prompt: "**Complete** the sentence.",
				markup: "markdown",
				form: 'Capital: <tp-textfield name="capital"></tp-textfield>',
				attributes: { answer: ["Paris"] },
			}),
		}),
	);
	const question = document.createElement("tp-fill-blank-question");
	question.setAttribute("src", "/question.json");
	document.body.append(question);
	await vi.waitFor(() =>
		expect(question.querySelector("tp-markdown strong")?.textContent).toBe(
			"Complete",
		),
	);
	expect(
		question.querySelector("tp-fill-blank tp-textfield input"),
	).not.toBeNull();
	expect(loaded).toHaveBeenCalled();
});
