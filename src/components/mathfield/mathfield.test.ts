import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { stubMathJaxRuntime } from "../../test-helpers/mathjax.js";
import { required } from "../../test-helpers/required.js";
import "./mathfield.js";

beforeEach(() => {
	stubMathJaxRuntime();
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

async function waitFor(
	predicate: () => boolean,
	timeoutMs = 1000,
): Promise<void> {
	const startedAt = Date.now();
	while (!predicate() && Date.now() - startedAt <= timeoutMs) {
		await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
	}
}

describe("<tp-mathfield>", () => {
	it("uses LaTeX by default and renders through tp-markdown", async () => {
		const field = document.createElement("tp-mathfield");
		field.value = "E = mc^2";
		field.setAttribute("preview", "");
		document.body.append(field);
		expect(field.mode).toBe("latexmath");
		await waitFor(() => document.querySelector("[data-mathjax-tex]") !== null);
		expect(
			field
				.querySelector("[data-mathjax-tex]")
				?.getAttribute("data-mathjax-tex"),
		).toBe("E = mc^2");
	});

	it("supports AsciiMath mode", async () => {
		const field = document.createElement("tp-mathfield");
		field.mode = "asciimath";
		field.value = "sum_(i=1)^n i";
		field.setAttribute("preview", "");
		document.body.append(field);
		await waitFor(
			() => document.querySelector("[data-mathjax-asciimath]") !== null,
		);
		expect(
			field
				.querySelector("[data-mathjax-asciimath]")
				?.getAttribute("data-mathjax-asciimath"),
		).toBe("sum_(i=1)^n i");
		expect(
			field.querySelector("[data-tp-mathfield-preview-mode]")?.textContent,
		).toBe("asciimath");
		expect(
			field
				.querySelector("[data-tp-mathfield-preview-divider]")
				?.getAttribute("orientation"),
		).toBe("vertical");
	});

	it("uses a multiline editor and display rendering when requested", async () => {
		const field = document.createElement("tp-mathfield");
		field.setAttribute("multiline", "");
		field.setAttribute("preview", "");
		field.value = String.raw`\int_0^1 x^2 dx`;
		document.body.append(field);
		expect(field.querySelector("tp-textfield")?.hasAttribute("multiline")).toBe(
			true,
		);
		await waitFor(
			() => document.querySelector("[data-mathjax-display]") !== null,
		);
		expect(
			field
				.querySelector("[data-mathjax-display]")
				?.getAttribute("data-mathjax-display"),
		).toBe("true");
		expect(
			field
				.querySelector("[data-tp-mathfield-preview-divider]")
				?.getAttribute("orientation"),
		).toBe("horizontal");
	});

	it("forwards field attributes to tp-textfield", () => {
		const field = document.createElement("tp-mathfield");
		field.setAttribute("label", "Formula");
		field.setAttribute("label-position", "start");
		field.setAttribute("required", "");
		field.setAttribute("clearable", "");
		document.body.append(field);
		const editor = field.querySelector("tp-textfield");
		expect(editor?.getAttribute("label")).toBe("Formula");
		expect(editor?.getAttribute("label-position")).toBe("start");
		expect(editor?.hasAttribute("required")).toBe(true);
		expect(editor?.hasAttribute("clearable")).toBe(true);
	});

	it("places source copy between clear and preview and exposes the formula source", () => {
		const field = document.createElement("tp-mathfield");
		field.setAttribute("clearable", "");
		field.value = "x^2";
		document.body.append(field);
		const control = required(
			field.querySelector("[data-tp-textfield-control]"),
		);
		const actions = Array.from(control.children);
		const clearIndex = actions.findIndex((element) =>
			element.hasAttribute("data-tp-textfield-clear"),
		);
		const copyIndex = actions.findIndex((element) =>
			element.hasAttribute("data-tp-mathfield-source-copy"),
		);
		const previewIndex = actions.findIndex((element) =>
			element.hasAttribute("data-tp-mathfield-preview-button"),
		);
		expect(clearIndex).toBeLessThan(copyIndex);
		expect(copyIndex).toBeLessThan(previewIndex);
		expect(field.getValue()).toBe("x^2");
	});

	it("configures the rendered copy action to return the generated SVG", () => {
		const field = document.createElement("tp-mathfield");
		field.value = "x^2";
		document.body.append(field);
		const content = required(
			field.querySelector<HTMLElement>("[data-tp-mathfield-preview-content]"),
		) as HTMLElement & { getCode(): string };
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 10 10");
		content.append(svg);
		expect(content.getCode()).toContain("<svg");
		const copy = field.querySelector<HTMLElement>(
			"[data-tp-mathfield-render-copy]",
		) as HTMLElement & { forElement: HTMLElement | null };
		expect(copy.forElement).toBe(content);
	});

	it("hides the preview by default and toggles it with the eye button", () => {
		const field = document.createElement("tp-mathfield");
		field.value = "x^2";
		document.body.append(field);
		const preview = field.querySelector<HTMLElement>(
			"[data-tp-mathfield-preview]",
		);
		const button = field.querySelector<HTMLElement>(
			"[data-tp-mathfield-preview-button]",
		);
		expect(preview?.hidden).toBe(true);
		expect(button?.getAttribute("name")).toBe("eye-outline");
		expect(
			button?.parentElement?.hasAttribute("data-tp-textfield-control"),
		).toBe(true);
		const preparedPreview = preview?.querySelector("tp-markdown");
		expect(preparedPreview).not.toBeNull();
		button?.click();
		expect(field.hasAttribute("preview")).toBe(true);
		expect(preview?.hidden).toBe(false);
		expect(button?.getAttribute("aria-pressed")).toBe("true");
		expect(preview?.querySelector("tp-markdown")).toBe(preparedPreview);
	});

	it("uses a notation-aware default placeholder", () => {
		const field = document.createElement("tp-mathfield");
		document.body.append(field);
		expect(
			field.querySelector("tp-textfield")?.getAttribute("placeholder"),
		).toBe("Type LaTeX formula...");
		field.setAttribute("mode", "asciimath");
		expect(
			field.querySelector("tp-textfield")?.getAttribute("placeholder"),
		).toBe("Type AsciiMath formula...");
	});

	it("uses initial inline text as the name when the attribute is absent", () => {
		const field = document.createElement("tp-mathfield");
		field.textContent = "energy";
		document.body.append(field);
		expect(field.name).toBe("energy");
		expect(field.value).toBe("");
	});

	it("closes the preview when the eye button is selected again", () => {
		const field = document.createElement("tp-mathfield");
		field.value = "x^2";
		field.setAttribute("preview", "");
		document.body.append(field);
		const button = required(
			field.querySelector<HTMLElement>("[data-tp-mathfield-preview-button]"),
		);
		button.click();
		expect(field.hasAttribute("preview")).toBe(false);
	});

	it("reflects editing and emits input from the host", () => {
		const field = document.createElement("tp-mathfield");
		document.body.append(field);
		const listener = vi.fn();
		field.addEventListener("input", listener);
		const editor = required(field.querySelector("tp-textfield"));
		editor.setAttribute("value", "x^2");
		editor.dispatchEvent(new Event("input", { bubbles: true }));
		expect(field.value).toBe("x^2");
		expect(listener).toHaveBeenCalledOnce();
	});

	it("reflects the complete field API", () => {
		const field = document.createElement("tp-mathfield");
		field.mode = "asciimath";
		field.multiline = true;
		field.previewVisible = true;
		field.value = "sqrt(2)";
		field.label = "Formula";
		field.labelPosition = "start";
		field.placeholder = "Expression";
		field.name = "formula";
		field.autocomplete = "off";
		field.required = true;
		field.readOnly = true;
		field.disabled = true;
		field.clearable = true;
		expect([
			field.mode,
			field.multiline,
			field.previewVisible,
			field.value,
			field.label,
			field.labelPosition,
			field.placeholder,
			field.name,
			field.autocomplete,
		]).toEqual([
			"asciimath",
			true,
			true,
			"sqrt(2)",
			"Formula",
			"start",
			"Expression",
			"formula",
			"off",
		]);
		expect([
			field.required,
			field.readOnly,
			field.disabled,
			field.clearable,
		]).toEqual([true, true, true, true]);
		expect(field.getValue()).toBe("sqrt(2)");
	});

	it("forwards focus, change, clear and rendered events", () => {
		const field = document.createElement("tp-mathfield");
		field.value = "x";
		field.previewVisible = true;
		document.body.append(field);
		const editor = required(field.querySelector("tp-textfield"));
		const focus = vi.spyOn(editor, "focus");
		const changed = vi.fn();
		const cleared = vi.fn();
		const rendered = vi.fn();
		field.addEventListener("change", changed);
		field.addEventListener("tp-clear", cleared);
		field.addEventListener("tp-math-rendered", rendered);
		field.focus();
		editor.dispatchEvent(new Event("change", { bubbles: true }));
		editor.dispatchEvent(new CustomEvent("tp-clear", { bubbles: true }));
		field
			.querySelector("tp-markdown")
			?.dispatchEvent(
				new CustomEvent("tp-markdown-rendered", { bubbles: true }),
			);
		expect(focus).toHaveBeenCalled();
		expect(changed).toHaveBeenCalled();
		expect(cleared).toHaveBeenCalled();
		expect(rendered).toHaveBeenCalled();
	});

	it("clears through the editor and ignores blocked or empty values", () => {
		const field = document.createElement("tp-mathfield");
		field.value = "x";
		document.body.append(field);
		const editor = field.querySelector("tp-textfield") as HTMLElement & {
			clear: () => void;
		};
		const clear = vi.spyOn(editor, "clear");
		field.clear();
		expect(clear).toHaveBeenCalledOnce();
		field.disabled = true;
		field.clear();
		expect(clear).toHaveBeenCalledOnce();
	});
});
