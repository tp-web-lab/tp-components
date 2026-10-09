import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./xy-plot.js";

const source = `
xyFunctionGraph
  title "Functions"
  x-axis [-10,10]
  y-axis [-5,5]
  functions [["Line", "x/2"]]
`;

async function settle(): Promise<void> {
	await Promise.resolve();
	await Promise.resolve();
}

describe("<tp-xy-plot>", () => {
	beforeEach(() => {
		document.head.innerHTML = "";
		document.body.innerHTML = "";
		vi.restoreAllMocks();
	});

	afterEach(() => vi.unstubAllGlobals());

	it("renders inline source as two accessible SVG plots", async () => {
		const element = document.createElement("tp-xy-plot");
		element.innerHTML = `<script type="tp/xy-plot">${source}</script>`;
		document.body.append(element);
		await settle();
		expect(element.classList.contains("tp-xy-plot")).toBe(true);
		expect(document.head.querySelectorAll("#tp-xy-plot-styles")).toHaveLength(
			1,
		);
		expect(
			element.querySelectorAll(
				".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
			),
		).toHaveLength(2);
		for (const svg of element.querySelectorAll(
			".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg",
		)) {
			expect(svg.getAttribute("role")).toBe("img");
			expect(svg.getAttribute("aria-label")).toBe("XY plot");
		}
	});

	it("retains inline source when rerendering after the script is replaced", async () => {
		const element = document.createElement("tp-xy-plot");
		element.innerHTML = `<script type="tp/xy-plot">${source}</script>`;
		document.body.append(element);
		await settle();
		element.setAttribute("src", "");
		await settle();
		expect(element.querySelector("svg")).not.toBeNull();
	});

	it("reads and snapshots plain inline text", async () => {
		const element = document.createElement("tp-xy-plot");
		element.textContent = source;
		document.body.append(element);
		await settle();
		expect(element.querySelector("svg")).not.toBeNull();
		element.setAttribute("src", " ");
		await settle();
		expect(element.querySelector("svg")).not.toBeNull();
	});

	it("loads a relative source and reports HTTP failures accessibly", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, text: async () => source })
			.mockResolvedValueOnce({ ok: false, status: 404 });
		vi.stubGlobal("fetch", fetchMock);
		const element = document.createElement("tp-xy-plot");
		element.setAttribute("src", "/plot.xy");
		document.body.append(element);
		await settle();
		expect(element.querySelector("svg")).not.toBeNull();
		element.setAttribute("src", "/missing.xy");
		await settle();
		expect(element.querySelector('[role="alert"]')?.textContent).toContain(
			"404",
		);
	});

	it("escapes parser and non-Error failures", async () => {
		const element = document.createElement("tp-xy-plot");
		element.textContent = "<invalid & graph>";
		document.body.append(element);
		await settle();
		expect(element.querySelector('[role="alert"]')).not.toBeNull();

		vi.stubGlobal("fetch", vi.fn().mockRejectedValue("<offline>"));
		element.setAttribute("src", "/offline.xy");
		await settle();
		expect(element.innerHTML).toContain("&lt;offline&gt;");
	});

	it("clears empty content and opens the zoom dialog from its button", async () => {
		const empty = document.createElement("tp-xy-plot");
		document.body.append(empty);
		await settle();
		expect(empty.innerHTML).toBe("");

		const emptyScript = document.createElement("tp-xy-plot");
		emptyScript.innerHTML = '<script type="tp/xy-plot"></script>';
		document.body.append(emptyScript);
		await settle();
		expect(emptyScript.innerHTML).toBe("");

		const element = document.createElement("tp-xy-plot");
		element.innerHTML = `<script type="tp/xy-plot">${source}</script>`;
		document.body.append(element);
		await settle();
		const dialog = element.querySelector("dialog");
		if (!dialog) throw new Error("Missing zoom dialog");
		const showModal = vi.fn();
		Object.defineProperty(dialog, "showModal", {
			configurable: true,
			value: showModal,
		});
		const zoom = element.querySelector("tp-icon-button.tp-xy-plot-zoom-button");
		expect(zoom?.getAttribute("name")).toBe("zoom-out");
		expect(zoom?.getAttribute("library")).toBe("tp");
		zoom?.querySelector("button")?.click();
		expect(showModal).toHaveBeenCalledOnce();
		const close = dialog.querySelector(
			"tp-icon-button.tp-xy-plot-close-button",
		);
		expect(close?.getAttribute("name")).toBe("zoom-in");
		expect(close?.getAttribute("library")).toBe("tp");
		const closeButton = close?.querySelector("button");
		expect(closeButton?.type).toBe("submit");
		expect(closeButton?.getAttribute("aria-label")).toBe("Close zoomed graph");
		expect(closeButton?.form?.getAttribute("method")).toBe("dialog");
	});
});
