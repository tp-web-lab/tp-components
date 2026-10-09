import { afterEach, expect, it, vi } from "vitest";
import "./fill-blank-question.js";
import "../math/math.js";
import type { TpBlank } from "../blank/blank.js";

vi.mock("@tp/tp-markdown/markdown/renderers/math", () => ({
	default: {
		render: async (root: HTMLElement) => {
			const placeholder = root.firstElementChild;
			if (!placeholder) throw new Error("Missing formula source");
			placeholder.innerHTML =
				'<mjx-container><svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10" /></svg></mjx-container>';
		},
	},
}));

afterEach(() => document.body.replaceChildren());

it("keeps rendered inline tp-math answers after dropping, moving and restoring them", async () => {
	document.body.innerHTML = `<tp-fill-blank-question closed><dl>
		<dt>Answers</dt><dd><ol><li><tp-math>f'(a)</tp-math></li><li>text</li></ol></dd>
		<dt>Form</dt><dd><tp-blank name="first"></tp-blank><tp-blank name="second"></tp-blank></dd>
	</dl></tp-fill-blank-question>`;
	const question = document.querySelector("tp-fill-blank-question");
	const first = question?.querySelector<TpBlank>('tp-blank[name="first"]');
	const second = question?.querySelector<TpBlank>('tp-blank[name="second"]');
	if (!question || !first || !second) throw new Error("Missing question");
	await vi.waitFor(() =>
		expect(question.querySelector("tp-button tp-math svg")).not.toBeNull(),
	);
	const source = question.querySelector("tp-button tp-math svg path");
	if (!source) throw new Error("Missing rendered answer");
	const drag = (from: Element, to: Element) => {
		const dataTransfer = {
			effectAllowed: "",
			dropEffect: "",
			setData: vi.fn(),
		};
		for (const [type, target] of [
			["dragstart", from],
			["dragover", to],
			["drop", to],
		] as const) {
			const event = new Event(type, { bubbles: true, cancelable: true });
			Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
			Object.defineProperty(event, "clientY", { value: 0 });
			target.dispatchEvent(event);
		}
	};
	drag(source, first);
	expect(first.value).toBe("1");
	await new Promise((resolve) => setTimeout(resolve, 30));
	expect(first.querySelector('svg[aria-label="f\'(a)"]')).not.toBeNull();
	expect(question.querySelector("[data-tp-closed-reading] svg")).not.toBeNull();
	drag(first, second);
	expect(first.value).toBe("");
	expect(second.value).toBe("1");
	second.value = "";
	second.value = "1";
	await new Promise((resolve) => setTimeout(resolve, 30));
	expect(second.querySelector("svg")).not.toBeNull();
	expect(question.querySelector("tp-button tp-math svg")).not.toBeNull();
});
