import { afterEach, expect, it, vi } from "vitest";
import "./mathfield.js";

const load = vi.hoisted(() => vi.fn());
vi.mock("./mathlive-editor.js", () => ({
	createVisualMathfield: () => {
		load();
		const editor = document.createElement("div") as HTMLDivElement & {
			value: string;
			setValue(value: string): void;
			executeCommand: ReturnType<typeof vi.fn>;
		};
		editor.dataset.visualMock = "";
		editor.value = "";
		editor.executeCommand = vi.fn();
		editor.setValue = (value) => {
			editor.value = value;
		};
		return editor;
	},
}));

afterEach(() => {
	document.body.replaceChildren();
	load.mockClear();
});

it("opens only on demand in LaTeX and synchronizes source, events and clear", async () => {
	const field = document.createElement("tp-mathfield");
	field.mathlive = true;
	document.body.append(field);
	const button = field.querySelector<HTMLElement>(
		"[data-tp-mathfield-visual-button]",
	);
	expect(load).not.toHaveBeenCalled();
	expect(button?.localName).toBe("tp-icon-button");
	expect(button?.getAttribute("name")).toBe("pencil");
	expect(
		button?.previousElementSibling?.hasAttribute(
			"data-tp-mathfield-source-copy",
		),
	).toBe(true);
	expect(
		button?.nextElementSibling?.hasAttribute(
			"data-tp-mathfield-preview-button",
		),
	).toBe(true);
	button?.click();
	await vi.waitFor(() => expect(load).toHaveBeenCalledOnce());
	expect(button?.getAttribute("name")).toBe("pencil-off");
	const visual = field.querySelector<HTMLElement>(
		"[data-visual-mock]",
	) as HTMLElement & { value: string };
	const input = vi.fn();
	const change = vi.fn();
	field.addEventListener("input", input);
	field.addEventListener("change", change);
	visual.value = "x^2";
	visual.dispatchEvent(new Event("input", { bubbles: true }));
	visual.dispatchEvent(new Event("change", { bubbles: true }));
	expect(field.value).toBe("x^2");
	expect(field.querySelector("tp-textfield")?.value).toBe("x^2");
	expect(input).toHaveBeenCalledOnce();
	expect(change).toHaveBeenCalledOnce();
	field.value = "y";
	expect(visual.value).toBe("y");
	field.clear();
	expect(visual.value).toBe("");
	field.mode = "asciimath";
	expect(button?.hidden).toBe(true);
	expect(button?.getAttribute("name")).toBe("pencil");
	expect(field.querySelector("[data-visual-mock]")).toBeNull();
	field.mode = "latexmath";
	expect(button?.hidden).toBe(false);
	field.mathlive = false;
	expect(button?.hidden).toBe(true);
});

it.each(["disabled", "readonly", "mathlive"])(
	"closes the visual editor when %s changes",
	async (attribute) => {
		const field = document.createElement("tp-mathfield");
		field.mathlive = true;
		document.body.append(field);
		field
			.querySelector<HTMLElement>("[data-tp-mathfield-visual-button]")
			?.click();
		await vi.waitFor(() => expect(load).toHaveBeenCalledOnce());
		if (attribute === "mathlive") field.removeAttribute(attribute);
		else field.setAttribute(attribute, "");
		expect(field.querySelector("[data-visual-mock]")).toBeNull();
		expect(
			field.querySelector<HTMLElement>("[data-tp-mathfield-visual-panel]")
				?.hidden,
		).toBe(true);
	},
);

it("does not reopen after closing while the import is pending", async () => {
	const field = document.createElement("tp-mathfield");
	field.mathlive = true;
	document.body.append(field);
	const button = field.querySelector<HTMLElement>(
		"[data-tp-mathfield-visual-button]",
	);
	button?.click();
	button?.click();
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(load).not.toHaveBeenCalled();
	expect(
		field.querySelector<HTMLElement>("[data-tp-mathfield-visual-panel]")
			?.hidden,
	).toBe(true);
});
