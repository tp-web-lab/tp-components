import { afterEach, describe, expect, it, vi } from "vitest";
import { TpTikz } from "./tikz.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
function frame(el: TpTikz): HTMLIFrameElement {
	const result = el.shadowRoot?.querySelector("iframe");
	if (!result) throw new Error("Missing frame");
	if (!result.contentWindow)
		Object.defineProperty(result, "contentWindow", {
			value: Object.create(window),
		});
	return result;
}
describe("tp-tikz", () => {
	it("keeps Unicode source and accepts size messages only from the current isolated frame", () => {
		const el = new TpTikz();
		el.value = String.raw`\begin{tikzpicture}\node{Début, Pépé};\end{tikzpicture}`;
		document.body.append(el);
		const first = frame(el);
		expect(first.getAttribute("sandbox")).toBe("allow-scripts");
		expect(first.srcdoc).toContain("Pépé");
		const rendered = vi.fn();
		el.addEventListener("tp-tikz-rendered", rendered);
		window.dispatchEvent(
			new MessageEvent("message", {
				source: first.contentWindow,
				data: { type: "tp-tikz", ready: true, height: 240 },
			}),
		);
		expect(rendered).toHaveBeenCalledOnce();
		expect(first.style.height).toBe("240px");
		window.dispatchEvent(
			new MessageEvent("message", {
				source: first.contentWindow,
				data: { type: "tp-tikz", height: 80 },
			}),
		);
		expect(first.style.height).toBe("80px");
		el.value = String.raw`\begin{tikzpicture}\draw (0,0)--(1,1);\end{tikzpicture}`;
		const second = frame(el);
		expect(second).not.toBe(first);
		window.dispatchEvent(
			new MessageEvent("message", {
				source: first.contentWindow,
				data: { type: "tp-tikz", error: "Old error", height: 999 },
			}),
		);
		expect(frame(el)).toBe(second);
		el.remove();
		expect(el.shadowRoot?.querySelector("iframe")).toBeNull();
		document.body.append(el);
		expect(frame(el).srcdoc).toContain("draw");
	});
	it("reads inline source and recovers after invalid libraries", () => {
		const el = new TpTikz();
		el.innerHTML = String.raw`<script type="tp/tikz">\begin{tikzpicture}\draw (0,0)--(1,1);\end{tikzpicture}</script>`;
		document.body.append(el);
		expect(frame(el).srcdoc).toContain("draw");
		el.libraries = "bad}";
		expect(el.shadowRoot?.querySelector("[role=alert]")).not.toBeNull();
		el.libraries = "calc";
		expect(frame(el).srcdoc).toContain("calc");
		el.value = "";
		expect(el.shadowRoot?.querySelector("iframe")).toBeNull();
		expect(el.hasAttribute("aria-busy")).toBe(false);
	});
});

it("resizes the current drawing without recompiling and normalizes invalid scales", () => {
	const el = new TpTikz();
	el.scale = 1.8;
	el.value = String.raw`\begin{tikzpicture}\node{Scale};\end{tikzpicture}`;
	document.body.append(el);
	const current = frame(el);
	expect(current.srcdoc).toContain("let scale = 1.8;");
	const frameWindow = current.contentWindow;
	if (!frameWindow) throw new Error("Missing frame window");
	const post = vi.spyOn(frameWindow, "postMessage");
	el.scale = 0.75;
	expect(el.scale).toBe(0.75);
	expect(frame(el)).toBe(current);
	expect(post).toHaveBeenLastCalledWith(
		{ type: "tp-tikz-scale", scale: 0.75 },
		"*",
	);
	current.dispatchEvent(new Event("load"));
	expect(post).toHaveBeenLastCalledWith(
		{ type: "tp-tikz-scale", scale: 0.75 },
		"*",
	);
	for (const value of ["", "0", "-2", "NaN", "Infinity", "invalid"]) {
		el.setAttribute("scale", value);
		expect(el.scale).toBe(1);
		expect(frame(el)).toBe(current);
		expect(post).toHaveBeenLastCalledWith(
			{ type: "tp-tikz-scale", scale: 1 },
			"*",
		);
	}
	el.removeAttribute("scale");
	expect(el.scale).toBe(1);
	post.mockRestore();
});
