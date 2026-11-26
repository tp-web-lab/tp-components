import { undo } from "@codemirror/commands";
import { EditorView } from "@codemirror/view";
import { afterEach, expect, it, vi } from "vitest";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import { TpDiffCodeEditor } from "./diff-code-editor.js";

vi.mock("../../utilities/save-file.js", () => ({
	chooseSaveTarget: vi.fn(),
	saveBlob: vi.fn(),
}));
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
async function mount(
	left = "one\ntwo",
	right = "one\nchanged",
	readonly = false,
) {
	const host = new TpDiffCodeEditor();
	host.setAttribute("value-left", left);
	host.setAttribute("value-right", right);
	host.readonly = readonly;
	document.body.append(host);
	await vi.waitFor(() =>
		expect(host.querySelectorAll(".cm-editor").length).toBe(2),
	);
	return host;
}
function view(host: TpDiffCodeEditor, side: number) {
	const dom = host.querySelectorAll<HTMLElement>(".cm-editor")[side];
	const editor = dom && EditorView.findFromDOM(dom);
	if (!editor) throw Error("Missing editor");
	return editor;
}
it("loads both definition-list scripts, infers languages and preserves line breaks", async () => {
	const host = new TpDiffCodeEditor();
	host.innerHTML =
		'<dl><dt>left</dt><dd><script type="tp/javascript" filename="a.js">\nconst a = 1;\n\nconsole.log(a);\n</script></dd><dt>right</dt><dd><script type="tp/javascript" filename="b.js">\nconst a = 2;\n\nconsole.log(a);\n</script></dd></dl>';
	document.body.append(host);
	await vi.waitFor(() => expect(host.differenceCount).toBe(1));
	expect(host.getValue("left")).toBe("const a = 1;\n\nconsole.log(a);");
	expect(host.shadowRoot).toBeNull();
	expect(host.querySelector("dl")?.hidden).toBe(true);
	expect(
		host.querySelectorAll("[data-tp-code-editor-filename]")[1]?.textContent,
	).toBe("b.js");
});
it.each([
	["one\ntwo", "one\nchanged"],
	["a\nb\n", "a\n"],
	["a", "a\nb"],
	["a\n", "a"],
	["", "hello"],
	["hello", ""],
	["a\nb\nc", "a\nx\nc"],
])(
	"copies differing blocks exactly including EOF: %j / %j",
	async (left, right) => {
		const host = await mount(left, right);
		host.nextDifference();
		host.copyDifference("left");
		expect(host.getValue("right")).toBe(left);
		expect(host.differenceCount).toBe(0);
		undo(view(host, 1));
		expect(host.getValue("right")).toBe(right);
		host.previousDifference();
		host.copyDifference("right");
		expect(host.getValue("left")).toBe(right);
	},
);
it("keeps reset originals, synchronizes edits and preserves edits across reconnection", async () => {
	const host = await mount();
	const changed = vi.fn();
	host.addEventListener("tp-diff-code-editor-change", changed);
	host.setValue("left", "new text");
	expect(changed).toHaveBeenCalled();
	host.remove();
	document.body.append(host);
	expect(host.getValue("left")).toBe("new text");
	host.reset();
	expect(host.getValue("left")).toBe("one\ntwo");
});
it("locks editing, undo and merging while allowing external values, selection and saving", async () => {
	const host = await mount();
	host.setValue("left", "edited");
	host.readonly = true;
	const editor = view(host, 0);
	editor.dispatch({ changes: { from: 0, to: 1, insert: "x" } });
	undo(editor);
	host.copyDifference("right");
	host.reset();
	expect(host.getValue("left")).toBe("edited");
	host.setValue("left", "API update");
	expect(host.getValue("left")).toBe("API update");
	host.readonly = false;
	host.reset();
	expect(host.getValue("left")).toBe("one\ntwo");
});
it("loads files with source precedence and ignores obsolete responses", async () => {
	const host = await mount();
	let finish: ((response: Response) => void) | undefined;
	vi.stubGlobal(
		"fetch",
		vi.fn((url: URL) =>
			url.pathname.endsWith("slow.js")
				? new Promise<Response>((resolve) => {
						finish = resolve;
					})
				: Promise.resolve(new Response("latest")),
		),
	);
	host.setAttribute("src-left", "slow.js");
	await vi.waitFor(() => expect(finish).toBeDefined());
	host.setAttribute("src-left", "latest.js");
	await vi.waitFor(() => expect(host.getValue("left")).toBe("latest"));
	finish?.(new Response("obsolete"));
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(host.getValue("left")).toBe("latest");
});
it("reports a loading error without destroying the current comparison", async () => {
	const host = await mount();
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(new Response("missing", { status: 404 })),
	);
	const error = vi.fn();
	host.addEventListener("tp-diff-code-editor-error", error);
	host.setAttribute("src-right", "missing.txt");
	await vi.waitFor(() => expect(error).toHaveBeenCalled());
	expect(host.getValue("right")).toBe("one\nchanged");
	expect(host.querySelector('[role="alert"]')?.textContent).toContain("404");
	expect(host.hasAttribute("aria-busy")).toBe(false);
});
it("saves either side with its own filename and current code", async () => {
	const host = await mount();
	vi.mocked(chooseSaveTarget).mockResolvedValue({ filename: "chosen.txt" });
	await host.save("right");
	expect(chooseSaveTarget).toHaveBeenCalledWith(
		expect.objectContaining({ suggestedName: "right.txt" }),
	);
	expect(saveBlob).toHaveBeenCalledWith(expect.any(Blob), {
		filename: "chosen.txt",
	});
});
it("accepts definition-list content added after connection and observes source edits", async () => {
	const host = new TpDiffCodeEditor();
	document.body.append(host);
	host.insertAdjacentHTML(
		"beforeend",
		"<dl><dt>left</dt><dd>A &lt; B</dd><dt>right</dt><dd>A &gt; B</dd></dl>",
	);
	await host.refresh();
	expect(host.getValue("left")).toBe("A < B");
	const dd = host.querySelector("dd");
	if (!dd) throw Error("Missing source");
	dd.textContent = "updated";
	await vi.waitFor(() => expect(host.getValue("left")).toBe("updated"));
});

it("reuses visible code-editor toolbars with filenames after language badges", async () => {
	const host = await mount();
	const editors = host.querySelectorAll("tp-code-editor");
	expect(editors.length).toBe(2);
	for (const [index, editor] of [...editors].entries()) {
		expect(editor.toolbar).toBe(true);
		expect(
			editor.querySelector("[data-tp-code-editor-language-badge]")
				?.nextElementSibling?.textContent,
		).toBe(index === 0 ? "left.txt" : "right.txt");
		expect(editor.querySelector("tp-copy-code")).not.toBeNull();
		expect(
			editor.querySelector("[data-tp-code-editor-keyboard-button]"),
		).not.toBeNull();
		editor.lineNumbers = false;
		expect(host.differenceCount).toBe(1);
		editor.lineNumbers = true;
	}
	host.copyDifference("left");
	expect(host.getValue("right")).toBe(host.getValue("left"));
});

it("updates visible sources when author markup replaces the component contents", async () => {
	const host = await mount();
	host.removeAttribute("value-left");
	host.removeAttribute("value-right");
	host.innerHTML =
		"<dl><dt>left</dt><dd>new left</dd><dt>right</dt><dd>new right</dd></dl>";
	await vi.waitFor(() =>
		expect(host.querySelectorAll(".cm-editor").length).toBe(2),
	);
	expect(host.getValue("left")).toBe("new left");
	expect(host.querySelectorAll("tp-code-editor").length).toBe(2);
});
