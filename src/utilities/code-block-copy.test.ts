import { afterEach, expect, it, vi } from "vitest";
import { ensureCodeBlockCopyButtons } from "./code-block-copy.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it("enhances existing and dynamic blocks once and copies only code", async () => {
	document.body.innerHTML = "<pre><code>const answer = 42;</code></pre>";
	ensureCodeBlockCopyButtons(document);
	ensureCodeBlockCopyButtons(document);
	await vi.waitFor(() =>
		expect(document.querySelector("tp-copy-code")).not.toBeNull(),
	);
	const button = document.querySelector("tp-copy-code");
	expect(button?.forElement).toBe(document.querySelector("code"));
	expect(button?.getAttribute("aria-label")).toBe("Copy code");
	const writeText = vi.fn().mockResolvedValue(undefined);
	vi.stubGlobal("navigator", { clipboard: { writeText } });
	await button?.copy();
	expect(writeText).toHaveBeenCalledWith("const answer = 42;");
	const pre = document.createElement("pre");
	document.body.append(pre);
	pre.innerHTML = "<code>late</code>";
	await vi.waitFor(() =>
		expect(pre.querySelectorAll("tp-copy-code")).toHaveLength(1),
	);
	pre
		.querySelector("code")
		?.replaceWith(
			Object.assign(document.createElement("code"), { textContent: "new" }),
		);
	await vi.waitFor(() =>
		expect(pre.querySelector("tp-copy-code")?.forElement).toBe(
			pre.querySelector("code"),
		),
	);
	expect(pre.querySelectorAll("tp-copy-code")).toHaveLength(1);
});

it("preserves manual buttons and leaves plain pre and editor content alone", async () => {
	document.body.innerHTML =
		'<pre>plain</pre><pre><code>manual</code><tp-copy-code></tp-copy-code></pre><div contenteditable="true"><pre><code>editable</code></pre></div><pre id="manual-target"><code>linked</code></pre><tp-copy-code for="manual-target"></tp-copy-code>';
	ensureCodeBlockCopyButtons(document);
	await new Promise((resolve) => setTimeout(resolve, 20));
	expect(document.querySelectorAll("tp-copy-code")).toHaveLength(2);
	expect(document.querySelectorAll("[data-tp-code-block-copy]")).toHaveLength(
		0,
	);
});

it("copies annotation markers unless the code block explicitly excludes them", async () => {
	document.body.innerHTML =
		'<pre><code>code <b class="conum">(1)</b></code></pre><pre class="no-copy-callouts"><code>code <b class="conum">(1)</b></code></pre>';
	ensureCodeBlockCopyButtons(document);
	await vi.waitFor(() =>
		expect(document.querySelectorAll("tp-copy-code")).toHaveLength(2),
	);
	const writeText = vi.fn().mockResolvedValue(undefined);
	vi.stubGlobal("navigator", { clipboard: { writeText } });
	for (const button of document.querySelectorAll("tp-copy-code"))
		await button.copy();
	expect(writeText.mock.calls.map((call) => call[0])).toEqual([
		"code (1)",
		"code ",
	]);
});
