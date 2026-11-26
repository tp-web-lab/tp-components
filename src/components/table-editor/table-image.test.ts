import { afterEach, expect, it, vi } from "vitest";
import { tableImage } from "./table-image.js";

vi.mock("../math/math.js", () => ({}));
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});
it("preserves multiline cells, merges, alignment and theme styles in the standalone SVG", async () => {
	const owner = document.createElement("div");
	owner.style.cssText = "color:rgb(240, 240, 240);background:rgb(30, 30, 30)";
	document.body.append(owner);
	vi.spyOn(HTMLTableElement.prototype, "getBoundingClientRect").mockReturnValue(
		{
			left: 0,
			top: 0,
			right: 420,
			bottom: 180,
			width: 420,
			height: 180,
			x: 0,
			y: 0,
			toJSON: () => ({}),
		},
	);
	const svg = await tableImage(
		owner,
		'<table style="height:180px;block-size:180px"><caption>Workshop schedule</caption><tr><th>Title</th></tr><tr><td rowspan="2" style="vertical-align:middle;text-align:right">One<br><br>Three</td></tr><tr></tr></table>',
	);
	const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
	expect(doc.querySelector("parsererror")).toBeNull();
	expect(doc.documentElement.getAttribute("width")).toBe("420");
	expect(doc.documentElement.getAttribute("height")).toBe("180");
	expect(doc.querySelectorAll("br")).toHaveLength(2);
	expect(doc.querySelector("caption")?.textContent).toBe("Workshop schedule");
	expect(doc.querySelector("table")?.getAttribute("style")).toContain(
		"height: auto",
	);
	expect(doc.querySelector("table")?.getAttribute("style")).toContain(
		"block-size: auto",
	);
	expect(doc.querySelector("td")?.getAttribute("rowspan")).toBe("2");
	expect(doc.querySelector("td")?.getAttribute("style")).toContain(
		"vertical-align: middle",
	);
	expect(doc.querySelector("td")?.getAttribute("style")).toContain(
		"text-align: right",
	);
	expect(
		doc.querySelector("foreignObject > div")?.getAttribute("style"),
	).toContain("rgb(30, 30, 30)");
	expect(owner.children).toHaveLength(0);
});

it("waits for rendered formulas and embeds their SVG rather than their source", async () => {
	class TestMath extends HTMLElement {
		connectedCallback() {
			queueMicrotask(() => {
				this.innerHTML =
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0L10 10"/></svg>';
				this.dispatchEvent(new CustomEvent("tp-math-rendered"));
			});
		}
	}
	if (!customElements.get("tp-math"))
		customElements.define("tp-math", TestMath);
	const owner = document.createElement("div");
	document.body.append(owner);
	const svg = await tableImage(
		owner,
		'<table><tr><td><tp-math value="x^2"></tp-math></td></tr></table>',
	);
	const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
	expect(doc.querySelector("parsererror")).toBeNull();
	expect(doc.querySelector("td svg path")?.getAttribute("d")).toBe(
		"M0 0L10 10",
	);
	expect(doc.querySelector("td")?.textContent).toBe("");
	expect(owner.children).toHaveLength(0);
});
