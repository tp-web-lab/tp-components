import { afterEach, describe, expect, it, vi } from "vitest";
import "./radio-list/radio-list.js";
import "./checkbox-list/checkbox-list.js";

afterEach(() => document.body.replaceChildren());

describe.each(["tp-radio-list", "tp-checkbox-list"] as const)(
	"%s group label",
	(tag) => {
		async function create(label = "") {
			const element = document.createElement(tag);
			element.innerHTML = "<ul><li>One</li><li>Two</li></ul>";
			element.label = label;
			document.body.append(element);
			await Promise.resolve();
			return element;
		}

		it("adds no heading or role by default and never creates a fieldset", async () => {
			const element = await create();
			expect(element.label).toBe("");
			expect(element.labelPosition).toBe("top");
			expect(
				element.querySelector("[data-tp-choice-label], fieldset, legend"),
			).toBeNull();
			expect(element.hasAttribute("role")).toBe(false);
		});

		it("labels the group without replacing its list, inputs or selection", async () => {
			const element = await create("Choose");
			const list = element.querySelector("ul");
			const inputs = [...element.querySelectorAll("input")];
			element.value = "2";
			const changed = vi.fn();
			element.addEventListener(`${tag}-change`, changed);
			const heading = element.querySelector<HTMLElement>(
				"[data-tp-choice-label]",
			);
			expect(heading?.textContent).toBe("Choose");
			expect(element.getAttribute("aria-labelledby")).toBe(heading?.id);
			expect(element.getAttribute("role")).toBe(
				tag === "tp-radio-list" ? "radiogroup" : "group",
			);
			for (const position of ["top", "bottom", "start", "end"] as const) {
				element.labelPosition = position;
				expect(element.getAttribute("data-tp-choice-label-position")).toBe(
					position,
				);
			}
			element.setAttribute("label-position", "invalid");
			expect(element.labelPosition).toBe("top");
			expect(element.getAttribute("data-tp-choice-label-position")).toBe("top");
			element.label = "<strong>Literal label</strong>";
			expect(heading?.textContent).toBe("<strong>Literal label</strong>");
			expect(heading?.querySelector("strong")).toBeNull();
			expect(element.querySelector("ul")).toBe(list);
			expect([...element.querySelectorAll("input")]).toEqual(inputs);
			expect(element.value).toBe("2");
			expect(changed).not.toHaveBeenCalled();
			heading?.click();
			expect(document.activeElement).toBe(inputs[1]);
			element.label = "";
			expect(element.querySelector("[data-tp-choice-label]")).toBeNull();
			expect(element.hasAttribute("aria-labelledby")).toBe(false);
			expect(element.hasAttribute("role")).toBe(false);
			element.label = "Again";
			element.remove();
			document.body.append(element);
			await Promise.resolve();
			expect(element.querySelectorAll("[data-tp-choice-label]")).toHaveLength(
				1,
			);
			expect(element.querySelector("fieldset, legend")).toBeNull();
		});

		it("preserves author ARIA and generates distinct label identifiers", async () => {
			const one = await create();
			one.setAttribute("role", "group");
			one.setAttribute("aria-labelledby", "author-title");
			one.setAttribute("aria-label", "Author name");
			one.label = "Visible label";
			const two = await create("Another label");
			expect(one.querySelector("[data-tp-choice-label]")?.id).not.toBe(
				two.querySelector("[data-tp-choice-label]")?.id,
			);
			expect(one.getAttribute("aria-labelledby")).toContain("author-title ");
			one.label = "";
			expect(one.getAttribute("aria-labelledby")).toBe("author-title");
			expect(one.getAttribute("aria-label")).toBe("Author name");
			expect(one.getAttribute("role")).toBe("group");
			one.label = "Restored";
			one.querySelector<HTMLElement>("[data-tp-choice-label]")?.click();
			expect(document.activeElement).toBe(one.querySelector("input"));
		});
	},
);
