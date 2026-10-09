import { readFileSync } from "node:fs";
import { TpMarkdownParser } from "@tp/tp-markdown/markdown/engine/markdown";
import { afterEach, expect, it, vi } from "vitest";
import { renderMarkdownInto, renderMarkdownRuntimeIn } from "./markdown.js";
import "../fill-blank-question/fill-blank-question.js";
import "../blank/blank.js";

afterEach(() => {
	vi.restoreAllMocks();
	document.body.replaceChildren();
});

it("activates explicitly allowed scripts once after connected rendering", async () => {
	vi.spyOn(TpMarkdownParser.prototype, "renderRuntime").mockResolvedValue();
	const root = document.createElement("div");
	document.body.append(root);
	await renderMarkdownInto(
		'<div data-allow-script><script src="/trusted-demo.js"></script></div><script src="/not-authorized.js"></script>',
		root,
	);
	const trusted = root.querySelector('script[src="/trusted-demo.js"]');
	const untrusted = root.querySelector('script[src="/not-authorized.js"]');
	expect(trusted?.getAttribute("data-tp-md-executed")).toBe("true");
	expect(untrusted?.hasAttribute("data-tp-md-executed")).toBe(false);
	await renderMarkdownRuntimeIn(root);
	expect(root.querySelector('script[src="/trusted-demo.js"]')).toBe(trusted);
	expect(root.querySelector('script[src="/not-authorized.js"]')).toBe(
		untrusted,
	);
});

it("does not activate scripts while preparing disconnected content", async () => {
	vi.spyOn(TpMarkdownParser.prototype, "renderRuntime").mockResolvedValue();
	const root = document.createElement("div");
	await renderMarkdownInto(
		'<div data-allow-script><script src="/demo.js"></script></div>',
		root,
	);
	expect(
		root.querySelector("script")?.hasAttribute("data-tp-md-executed"),
	).toBe(false);
});

it("finishes introductory formulas before an already defined question captures its answers", async () => {
	const runtime = vi
		.spyOn(TpMarkdownParser.prototype, "renderRuntime")
		.mockImplementation(async (root) => {
			await Promise.resolve();
			for (const formula of root.querySelectorAll("[data-mathjax-tex]")) {
				if (formula.querySelector("svg")) continue;
				const svg = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"svg",
				);
				svg.setAttribute(
					"aria-label",
					formula.getAttribute("data-mathjax-tex") ?? "Formula",
				);
				formula.replaceChildren(svg);
			}
		});
	const source = `<tp-fill-blank-question closed>
  <dl>
		<dt>Answers</dt><dd><ol>
		<li><span data-mathjax-tex="a"></span></li>
		<li><span data-mathjax-tex="b"></span></li>
		<li><span data-mathjax-tex="c"></span></li>
		</ol></dd><dt>Form</dt><dd>
		<span data-mathjax-tex="f(x)"></span><tp-blank></tp-blank>
		<span data-mathjax-tex="g(x)"></span><tp-blank></tp-blank><tp-blank></tp-blank>
    </dd>
  </dl>
</tp-fill-blank-question>`;
	const root = document.createElement("div");
	document.body.append(root);
	await renderMarkdownInto(source, root);
	expect(runtime).toHaveBeenNthCalledWith(1, expect.any(DocumentFragment), {
		only: ["math"],
	});
	const question = root.querySelector("tp-fill-blank-question[closed]");
	expect(
		question?.querySelectorAll("tp-button[data-tp-closed-item] svg"),
	).toHaveLength(3);
	expect(
		question?.querySelectorAll("[data-tp-closed-reading] svg"),
	).toHaveLength(2);
});

it("displays the fill-blank documentation before the math runtime finishes loading", async () => {
	let finishRuntime: (() => void) | undefined;
	const pendingRuntime = new Promise<void>((resolve) => {
		finishRuntime = resolve;
	});
	const runtime = vi
		.spyOn(TpMarkdownParser.prototype, "renderRuntime")
		.mockReturnValue(pendingRuntime);
	const source =
		readFileSync(
			"public/docs/components/fill-blank-question/index.md",
			"utf8",
		).split("## Usage")[0] ?? "";
	const root = document.createElement("div");
	document.body.append(root);
	const rendering = renderMarkdownInto(source, root);
	try {
		await vi.waitFor(() => expect(runtime).toHaveBeenCalled());
		expect(root.querySelector("h1")?.textContent).toContain(
			"Fill blank question",
		);
		expect(root.querySelectorAll("tp-blank")).toHaveLength(3);
		expect(
			root.querySelectorAll("tp-button[data-tp-closed-item] tp-math[value]"),
		).toHaveLength(3);
		expect(runtime).toHaveBeenCalledWith(root, undefined);
	} finally {
		finishRuntime?.();
		await rendering;
	}
});
