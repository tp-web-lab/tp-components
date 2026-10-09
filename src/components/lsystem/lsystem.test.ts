import { readFileSync } from "node:fs";
import { listLSystemPresets } from "@tp/tp-utilities/l-system";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TpLsystem } from "./lsystem.js";

/** Small deterministic source shared by lifecycle and control tests. */
const source = "axiom: F\niterations: 2\nangle: 60\nrule: F => F+F--F+F";

it("offers Peano without the duplicate sponge placeholder in every example language", () => {
	["html", "adoc", "md", "rst"].forEach((extension) => {
		const examples = readFileSync(
			`public/docs/components/lsystem/examples/examples.${extension}`,
			"utf8",
		);
		expect(examples).toContain("peano-curve");
		expect(examples).not.toContain("sierpinski-sponge");
	});
});

it("includes the self-contained example viewers without nesting another viewer", () => {
	const documentation = readFileSync(
		"public/docs/components/lsystem/index.md",
		"utf8",
	);
	["html", "adoc", "md", "rst"].forEach((extension) => {
		expect(documentation).toContain(
			`::include{examples/examples.${extension}}`,
		);
	});
	expect(documentation).not.toMatch(
		/<tp-[\w-]*viewer\s+src="examples\/examples\./,
	);
});
/** Allows the source read and deferred render to finish without advancing playback. */
async function settle(): Promise<void> {
	await vi.advanceTimersByTimeAsync(1);
}
/** Creates an independent connected component. */
function fixture(
	attributes = "",
	content = `<script type="tp/lsystem">${source}</script>`,
): TpLsystem {
	const host = document.createElement("div");
	host.innerHTML = `<tp-lsystem ${attributes}>${content}</tp-lsystem>`;
	document.body.append(host);
	const element = host.querySelector("tp-lsystem");
	if (!element) throw new Error("Missing component");
	expect(element).toBeInstanceOf(TpLsystem);
	return element;
}
/** Activates a library toolbar control through its native button. */
function click(element: TpLsystem, action: string): void {
	element
		.querySelector<HTMLButtonElement>(`[data-action="${action}"] button`)
		?.click();
}
beforeEach(() => {
	vi.useFakeTimers();
});

it("renders every shared preset and a parametric rule", async () => {
	for (const preset of listLSystemPresets()) {
		const element = fixture(`preset="${preset}"`, "");
		await settle();
		expect(
			element.querySelector('[role="alert"]')?.textContent,
		).toBeUndefined();
		expect(element.querySelector("[data-lsystem-viewport] svg")).not.toBeNull();
		element.remove();
	}
	const parametric = fixture(
		"",
		'<script type="tp/lsystem">axiom: F(5)\niterations: 2\nrule: F(x) => F(x*0.5)+F(x*0.5)</script>',
	);
	await settle();
	expect(
		parametric.querySelector('[role="alert"]')?.textContent,
	).toBeUndefined();
	expect(
		parametric.querySelector("[data-lsystem-viewport] svg"),
	).not.toBeNull();
});
afterEach(() => {
	document.body.replaceChildren();
	vi.clearAllTimers();
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

it("renders an accessible responsive SVG and preserves source across attributes and reconnection", async () => {
	const element = fixture('label="Koch"');
	const rendered = vi.fn();
	element.addEventListener("tp-lsystem-rendered", rendered);
	await settle();
	expect(element.querySelector('svg[aria-label="Koch"]')).not.toBeNull();
	expect(element.textContent).toContain("Iteration 2 / 2");
	expect(element.exportSvg()).toContain("<svg");
	expect(rendered).toHaveBeenCalled();
	expect(element.querySelector("tp-save-image")?.getAttribute("anchor")).toBe(
		`#${element.querySelector("[data-lsystem-viewport]")?.id}`,
	);
	element.setAttribute("angle", "45");
	element.setAttribute("step", "5");
	element.setAttribute("iterations", "1");
	await settle();
	expect(element.textContent).toContain("Iteration 1 / 1");
	element.removeAttribute("iterations");
	element.setAttribute("label", "<b>Safe</b>");
	await settle();
	expect(element.querySelector("figcaption")?.textContent).toBe("<b>Safe</b>");
	expect(element.querySelector("figcaption b")).toBeNull();
	element.setAttribute("lang", "fr");
	await settle();
	element.remove();
	document.body.append(element);
	await settle();
	expect(element.textContent).toContain("Iteration 2 / 2");
});

it("steps, pauses, resumes and resets without replacing focused native controls", async () => {
	const element = fixture('interval="100"');
	await settle();
	const button = element.querySelector('[data-action="play"] button');
	click(element, "step");
	expect(element.textContent).toContain("Iteration 0 / 2");
	click(element, "step");
	expect(element.textContent).toContain("Iteration 1 / 2");
	click(element, "play");
	expect(element.querySelector("[data-play-label]")?.textContent).toBe("Pause");
	click(element, "play");
	await vi.advanceTimersByTimeAsync(200);
	expect(element.textContent).toContain("Iteration 1 / 2");
	click(element, "play");
	await vi.advanceTimersByTimeAsync(100);
	expect(element.textContent).toContain("Iteration 2 / 2");
	expect(element.querySelector('[data-action="play"] button')).toBe(button);
	expect(element.querySelector("[data-play-label]")?.textContent).toBe("Play");
	click(element, "play");
	expect(element.textContent).toContain("Iteration 0 / 2");
	click(element, "reset");
	await vi.advanceTimersByTimeAsync(300);
	expect(element.textContent).toContain("Iteration 0 / 2");
	element.dispatchEvent(new Event("click"));
	element
		.querySelector("figcaption")
		?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	element.play();
	element.remove();
	await vi.advanceTimersByTimeAsync(500);
	expect(element.textContent).toContain("Iteration 0 / 2");
});

it("accepts presets and late scripts with source precedence", async () => {
	const element = fixture('preset="fractal-tree" iterations="0"', "");
	await settle();
	element.play();
	expect(element.textContent).toContain("Iteration 0 / 0");
	element.removeAttribute("iterations");
	await settle();
	expect(element.textContent).toContain("Iteration 5 / 5");
	const late = fixture('preset=""', "");
	await settle();
	expect(late.querySelector('[role="alert"]')).not.toBeNull();
	const script = document.createElement("script");
	script.type = "tp/l-system";
	script.textContent = source;
	late.append(script);
	await settle();
	await settle();
	expect(late.querySelector("svg")).not.toBeNull();
	const inline = fixture('preset="unknown"');
	await settle();
	expect(inline.querySelector("svg")).not.toBeNull();
});

it("loads src before script and ignores stale responses or failures", async () => {
	let resolve: ((value: Response) => void) | undefined;
	vi.stubGlobal(
		"fetch",
		vi.fn(
			() =>
				new Promise<Response>((done) => {
					resolve = done;
				}),
		),
	);
	const element = fixture('src="/slow.lsys"');
	await settle();
	element.removeAttribute("src");
	await settle();
	resolve?.(new Response("not a definition"));
	await settle();
	expect(element.querySelector("svg")).not.toBeNull();
	vi.stubGlobal(
		"fetch",
		vi
			.fn()
			.mockResolvedValue(
				new Response(source.replace("iterations: 2", "iterations: 1")),
			),
	);
	element.setAttribute("src", "/good.lsys");
	await settle();
	expect(element.textContent).toContain("Iteration 1 / 1");
	vi.stubGlobal("fetch", vi.fn().mockRejectedValue("<offline>"));
	element.setAttribute("src", "/offline.lsys");
	await settle();
	expect(element.textContent).toContain("<offline>");
	expect(element.querySelector("offline")).toBeNull();
	element.step();
	element.play();
	element.reset();
	expect(element.exportSvg()).toBe("");
	const detached = fixture();
	detached.remove();
	await settle();
	expect(detached.querySelector("svg")).toBeNull();
});

it.each([
	['iterations="13"', source, "Iterations"],
	['iterations="-1"', source, "Iterations"],
	['iterations="1.5"', source, "Iterations"],
	['angle="NaN"', source, "finite number"],
	['step="0"', source, "positive"],
	['interval="50"', source, "100 milliseconds"],
	['preset="unknown"', "", "Unknown L-system preset"],
	["", "bad source", "Invalid line"],
	["", "a".repeat(20001), "20,000"],
	["", `axiom: F\nrule: F => ${"F".repeat(257)}`, "256 characters"],
	["", "axiom: F\niterations: 12\nrule: F => FFFFFFFF", "too large"],
])(
	"reports invalid definitions safely: %s",
	async (attributes, content, message) => {
		const element = fixture(
			attributes,
			content ? `<script type="tp/lsystem">${content}</script>` : "",
		);
		await settle();
		expect(element.querySelector('[role="alert"]')?.textContent).toContain(
			message,
		);
		expect(element.hasAttribute("aria-busy")).toBe(false);
		expect(element.exportSvg()).toBe("");
	},
);
