import { describe, expect, it, vi } from "vitest";
import { highlightLatexListings } from "./latex-listings.js";

describe("LaTeX listings highlighting", () => {
	it("does not load a highlighter for ordinary prose or untyped code", async () => {
		const root = document.createElement("div");
		root.innerHTML = "<pre><code data-tp-latex-listing>plain</code></pre>";
		const before = document.querySelectorAll('script[src*="highlight"]').length;
		await highlightLatexListings(root);
		expect(document.querySelectorAll('script[src*="highlight"]').length).toBe(
			before,
		);
	});
	it("colours known languages and preserves unknown languages as literal text", async () => {
		const highlight = vi.fn(() => ({
			value: '<span class="hljs-keyword">const</span> value = 1;',
		}));
		Object.assign(window, {
			hljs: { getLanguage: (name: string) => name === "javascript", highlight },
		});
		const root = document.createElement("div");
		root.innerHTML =
			'<pre><code data-tp-latex-listing class="language-javascript">const value = 1;</code></pre><pre><code data-tp-latex-listing class="language-unknown">&lt;tag&gt;</code></pre><p>Inline <code data-tp-latex-listing class="language-javascript">const value = 1;</code>.</p><pre id="native"><code class="language-javascript">const value = 1;</code></pre>';
		await highlightLatexListings(root);
		expect(root.querySelector(".hljs-keyword")?.textContent).toBe("const");
		expect(root.querySelector(".language-unknown")?.textContent).toBe("<tag>");
		expect(highlight).toHaveBeenCalledTimes(3);
		expect(root.querySelector("p code")?.classList.contains("hljs")).toBe(
			false,
		);
		expect(root.querySelector("#native .hljs-keyword")?.textContent).toBe(
			"const",
		);
		await highlightLatexListings(root);
		expect(highlight).toHaveBeenCalledTimes(3);
		Reflect.deleteProperty(window, "hljs");
	});
});
