import { afterEach, describe, expect, it, vi } from "vitest";
import "./markup-multi-slides.js";
import "../html-multi-slides/html-multi-slides.js";
import "../markdown-multi-slides/markdown-multi-slides.js";
import "../asciidoc-multi-slides/asciidoc-multi-slides.js";
import "../restructuredtext-multi-slides/restructuredtext-multi-slides.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";

function invoke(target: object, name: string, event: Event): void {
	const handler = Reflect.get(target, name) as (value: Event) => void;
	handler.call(target, event);
}

describe("<tp-markup-multi-slides>", () => {
	afterEach(() => {
		document.body.innerHTML = "";
		window.history.replaceState(null, "", "/");
		vi.restoreAllMocks();
	});

	it("reuses multi-pages loading and replaces page links with slide controls", async () => {
		vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
			const url = String(input);
			if (url.endsWith("/sidebar.md")) {
				return new Response("- [One](one.md)\n- [Two](two.adoc)", {
					status: 200,
					headers: { "content-type": "text/markdown" },
				});
			}
			if (url.endsWith("/cover.md")) {
				return new Response("# Cover", {
					status: 200,
					headers: { "content-type": "text/markdown" },
				});
			}
			if (url.endsWith("/one.md")) {
				return new Response("# One", {
					status: 200,
					headers: { "content-type": "text/markdown" },
				});
			}
			if (url.endsWith("/two.adoc")) {
				return new Response("= Two", {
					status: 200,
					headers: { "content-type": "text/asciidoc" },
				});
			}
			return new Response("", { status: 404 });
		});

		window.history.replaceState(null, "", "/#/one.md");
		const presentation = document.createElement("tp-markup-multi-slides");
		presentation.setAttribute("repository", "/presentation");
		document.body.append(presentation);

		for (
			let attempt = 0;
			attempt < 50 &&
			presentation.querySelector(".tp-markup-multi-slides-navigation") === null;
			attempt += 1
		) {
			await new Promise((resolve) => setTimeout(resolve, 10));
		}

		expect(presentation.querySelector("tp-toolbar")).not.toBeNull();
		expect(presentation.querySelector("tp-splitter")).not.toBeNull();
		expect(
			presentation.querySelector(".tp-markup-multi-pages-page-nav"),
		).toBeNull();
		expect(
			presentation.querySelector(".tp-markup-multi-slides-navigation")
				?.parentElement,
		).toBe(presentation.querySelector("tp-splitter"));
		expect(
			presentation.querySelector<HTMLInputElement>('input[type="range"]')
				?.value,
		).toBe("1");
		expect(
			presentation.querySelector(".tp-markup-multi-slides-counter")
				?.textContent,
		).toBe("1 / 2");
		expect(
			presentation.querySelectorAll(
				".tp-markup-multi-slides-controls tp-icon-button",
			),
		).toHaveLength(2);

		const slider = presentation.querySelector("tp-numberfield");
		expect(slider?.range).toBe(true);
		expect(slider?.clearable).toBe(false);
		expect(slider?.min).toBe("1");
		expect(slider?.max).toBe("2");
		const native = slider?.querySelector("input");
		if (!native) throw new Error("Missing slide slider");
		expect(native.list).toBe(presentation.querySelector("datalist"));
		expect(
			Array.from(native.list?.options ?? [], (option) => option.value),
		).toEqual(["1", "2"]);
		native.value = "2";
		native.dispatchEvent(new Event("input", { bubbles: true }));
		await vi.waitFor(() =>
			expect(
				presentation.querySelector(".tp-markup-multi-slides-counter")
					?.textContent,
			).toBe("2 / 2"),
		);
		expect(presentation.querySelector("tp-numberfield")).toBe(slider);
		native.value = "1";
		native.dispatchEvent(new Event("input", { bubbles: true }));
		await vi.waitFor(() =>
			expect(
				presentation.querySelector(".tp-markup-multi-slides-counter")
					?.textContent,
			).toBe("1 / 2"),
		);

		document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
		for (
			let attempt = 0;
			attempt < 50 &&
			presentation.querySelector(".tp-markup-multi-slides-counter")
				?.textContent !== "2 / 2";
			attempt += 1
		) {
			await new Promise((resolve) => setTimeout(resolve, 10));
		}
		expect(
			presentation.querySelector(".tp-markup-multi-slides-counter")
				?.textContent,
		).toBe("2 / 2");

		document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
		for (
			let attempt = 0;
			attempt < 50 &&
			presentation.querySelector(".tp-markup-multi-slides-counter")
				?.textContent !== "1 / 2";
			attempt += 1
		) {
			await new Promise((resolve) => setTimeout(resolve, 10));
		}
		expect(
			presentation.querySelector(".tp-markup-multi-slides-counter")
				?.textContent,
		).toBe("1 / 2");

		const content = presentation.querySelector<HTMLElement>(
			".tp-markup-multi-pages-content",
		);
		const firstStep = document.createElement("p");
		firstStep.dataset.slideStep = "1";
		const secondStep = document.createElement("p");
		secondStep.dataset.slideStep = "2";
		content?.append(firstStep, secondStep);
		await new Promise((resolve) => setTimeout(resolve, 10));
		expect(firstStep.hasAttribute("data-slide-fragment-hidden")).toBe(true);
		expect(secondStep.hasAttribute("data-slide-fragment-hidden")).toBe(true);
		expect(firstStep.getAttribute("aria-hidden")).toBe("true");

		presentation
			.querySelector<HTMLElement>('[data-slide-direction="next"]')
			?.click();
		expect(firstStep.hasAttribute("data-slide-fragment-hidden")).toBe(false);
		expect(firstStep.hasAttribute("aria-hidden")).toBe(false);
		expect(secondStep.hasAttribute("data-slide-fragment-hidden")).toBe(true);

		document.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
		expect(secondStep.hasAttribute("data-slide-fragment-hidden")).toBe(false);

		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
		expect(secondStep.hasAttribute("data-slide-fragment-hidden")).toBe(true);

		content?.dispatchEvent(
			new MouseEvent("contextmenu", { bubbles: true, cancelable: true }),
		);
		expect(firstStep.hasAttribute("data-slide-fragment-hidden")).toBe(true);

		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
		presentation
			.querySelector<HTMLElement>('[data-slide-direction="next"]')
			?.click();
		presentation
			.querySelector<HTMLElement>('[data-slide-direction="next"]')
			?.click();
		for (
			let attempt = 0;
			attempt < 50 &&
			presentation.querySelector(".tp-markup-multi-slides-counter")
				?.textContent !== "2 / 2";
			attempt += 1
		) {
			await new Promise((resolve) => setTimeout(resolve, 10));
		}
		expect(
			presentation.querySelector(".tp-markup-multi-slides-counter")
				?.textContent,
		).toBe("2 / 2");
	});

	it("renders an empty multi-pages Markdown directive", async () => {
		const html = await renderMarkdownToHtml(
			'::: tp-markup-multi-pages { repository="/docs/components/markup-multi-pages/docs" }\n:::',
		);
		expect(html).toContain("<tp-markup-multi-pages");
		expect(html).toContain(
			'repository="/docs/components/markup-multi-pages/docs"',
		);
	});

	it.each([
		"tp-html-multi-slides",
		"tp-markdown-multi-slides",
		"tp-asciidoc-multi-slides",
		"tp-restructuredtext-multi-slides",
	] as const)("shares the non-clearable number slider with %s", (tag) => {
		const presentation = document.createElement(tag);
		presentation.innerHTML =
			'<div class="tp-markup-multi-pages"><aside class="tp-markup-multi-pages-sidebar"><a href="#one" aria-current="page">One</a><a href="#two">Two</a></aside></div>';
		const sync = Reflect.get(presentation, "syncNavigation") as () => void;
		sync.call(presentation);
		const slider = presentation.querySelector("tp-numberfield");
		expect(slider?.range).toBe(true);
		expect(slider?.clearable).toBe(false);
		expect(slider?.value).toBe("1");
		expect(slider?.min).toBe("1");
		expect(slider?.max).toBe("2");
		expect(slider?.getAttribute("aria-label")).toBe("Current slide");
		const ticks = presentation.querySelector("datalist");
		expect(ticks?.id).toBe(slider?.list);
		expect(ticks?.options.length).toBe(2);
		presentation
			.querySelector(".tp-markup-multi-pages-sidebar")
			?.insertAdjacentHTML("beforeend", '<a href="#three">Three</a>');
		sync.call(presentation);
		expect(ticks?.options.length).toBe(3);
		expect(slider?.max).toBe("3");
	});

	it("preserves slide progression attributes on standard Markdown directives", async () => {
		const html = await renderMarkdownToHtml(`::: p {data-slide-step="6"}
The last slide is intentionally missing to test that the \`slide-not-found\` file is used.
:::`);

		expect(html).toContain('<p data-slide-step="6">');
		expect(html).toContain("<code>slide-not-found</code>");
		const root = document.createElement("div");
		root.innerHTML = html;
		expect(root.querySelector('[data-slide-step="6"]')?.textContent).toContain(
			"The last slide is intentionally missing",
		);
	});

	it("leaves unrelated keys and interactive pointer targets untouched", () => {
		const presentation = document.createElement("tp-markup-multi-slides");
		const content = document.createElement("main");
		content.className = "tp-markup-multi-pages-content";
		const button = document.createElement("button");
		content.append(button);
		presentation.append(content);

		const escapeEvent = new KeyboardEvent("keydown", {
			key: "Escape",
			cancelable: true,
		});
		invoke(presentation, "handleKeydown", escapeEvent);
		expect(escapeEvent.defaultPrevented).toBe(false);

		const keyboard = new KeyboardEvent("keydown", {
			key: "ArrowRight",
			cancelable: true,
		});
		Object.defineProperty(keyboard, "target", { value: button });
		invoke(presentation, "handleKeydown", keyboard);
		expect(keyboard.defaultPrevented).toBe(false);

		for (const name of ["handleProgressClick", "handleProgressContextMenu"]) {
			const outside = new MouseEvent(
				name === "handleProgressClick" ? "click" : "contextmenu",
				{
					cancelable: true,
				},
			);
			Object.defineProperty(outside, "target", {
				value: document.createElement("div"),
			});
			invoke(presentation, name, outside);
			expect(outside.defaultPrevented).toBe(false);

			const interactive = new MouseEvent("click", { cancelable: true });
			Object.defineProperty(interactive, "target", { value: button });
			invoke(presentation, name, interactive);
			expect(interactive.defaultPrevented).toBe(false);
		}
	});
});
