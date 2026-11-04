import { afterEach, expect, it, vi } from "vitest";
import { TpComponentViewer } from "./component-viewer.js";

const api = {
	tagname: "tp-button",
	classname: "TpButton",
	attributes: [
		{
			name: "disabled",
			type: "boolean",
			default: "false",
			description: "Disable the button.",
		},
		{ name: "variant", type: "TpVariantType", default: "neutral" },
		{ name: "href", type: "string", default: '""' },
	],
	examples: [{ code: "<tp-button>Try me</tp-button>" }],
	events: [{ name: "click", detail: "void", description: "Activation." }],
	methods: [],
	cssproperties: [{ name: "--tp-button-accent", default: "blue" }],
};
function mockFetch() {
	return vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
		const url = String(input);
		if (url.endsWith(".html"))
			return new Response('<tp-button href="next.html">From file</tp-button>');
		return new Response(JSON.stringify(api));
	});
}
async function mount(
	source = '<tp-component-viewer tag="tp-button"></tp-component-viewer>',
) {
	document.body.innerHTML = source;
	const viewer = document.querySelector(
		"tp-component-viewer",
	) as TpComponentViewer;
	await vi.waitFor(() =>
		expect(viewer.querySelector("[data-component-mode]")).not.toBeNull(),
	);
	viewer
		.querySelectorAll<HTMLInputElement>("[data-component-mode] input")[1]
		?.click();
	await vi.waitFor(() => expect(viewer.querySelector("iframe")).not.toBeNull());
	viewer
		.querySelectorAll<HTMLInputElement>("[data-component-mode] input")[1]
		?.click();
	await vi.waitFor(() =>
		expect(viewer.querySelector("iframe")?.srcdoc).toContain("tp-button"),
	);
	return viewer;
}
function preview(viewer: TpComponentViewer) {
	const frame = viewer.querySelector("iframe");
	if (!frame?.contentDocument) throw new Error("Missing preview frame");
	frame.contentDocument.body.innerHTML = "<tp-button>Try me</tp-button>";
	frame.dispatchEvent(new Event("load"));
	const target = frame.contentDocument.querySelector("tp-button");
	if (!target) throw new Error("Missing preview component");
	return target;
}
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});
it("loads API tables, typed controls and the introductory preview from tag alone", async () => {
	mockFetch();
	const viewer = await mount();
	expect(viewer).toBeInstanceOf(TpComponentViewer);
	expect(
		viewer.querySelector(".tp-component-viewer-docs")?.textContent,
	).toContain("Events");
	expect(
		viewer.querySelector(".tp-component-viewer-docs")?.textContent,
	).toContain("--tp-button-accent");
	expect(
		viewer.querySelector('[data-component-setting="variant"]')?.localName,
	).toBe("tp-radio-list");
	expect(viewer.querySelector("iframe")?.srcdoc).toContain("Try me");
});
it("infers the component from an inline script and preserves supplied attributes", async () => {
	mockFetch();
	const viewer = await mount(
		'<tp-component-viewer><script type="tp/html"><tp-button variant="danger">Custom</tp-button></script></tp-component-viewer>',
	);
	expect(viewer.querySelector("iframe")?.srcdoc).toContain('variant="danger"');
	expect(viewer.querySelector("iframe")?.srcdoc).toContain("Custom");
});
it("resolves external files and their relative resources from the author source", async () => {
	const fetch = mockFetch();
	const viewer = await mount(
		'<div data-tp-source="https://example.test/course/index.md"><tp-component-viewer src="examples/button.html"></tp-component-viewer></div>',
	);
	expect(fetch).toHaveBeenCalledWith(
		"https://example.test/course/examples/button.html",
		expect.anything(),
	);
	expect(viewer.querySelector("iframe")?.srcdoc).toContain(
		"https://example.test/course/examples/",
	);
	expect(viewer.querySelector("iframe")?.srcdoc).toContain("From file");
});
it("changes boolean attributes by presence and synchronizes changes from the preview", async () => {
	mockFetch();
	const viewer = await mount();
	const target = preview(viewer);
	const control = viewer.querySelector(
		"[data-component-booleans]",
	) as HTMLElement & { value: string };
	control.value = "1";
	control.dispatchEvent(new Event("change"));
	expect(target.getAttribute("disabled")).toBe("");
	control.value = "";
	control.dispatchEvent(new Event("change"));
	expect(target.hasAttribute("disabled")).toBe(false);
	target.setAttribute("disabled", "");
	await vi.waitFor(() => expect(control.value).toBe("1"));
});
it("clears text attributes without refilling controls and resets documented defaults", async () => {
	mockFetch();
	const viewer = await mount();
	const target = preview(viewer);
	const control = viewer.querySelector(
		'[data-component-setting="href"]',
	) as HTMLElement & { value: string };
	control.value = "/next";
	control.dispatchEvent(new Event("change"));
	expect(target.getAttribute("href")).toBe("/next");
	control.value = "";
	control.dispatchEvent(new Event("change"));
	await Promise.resolve();
	expect(target.hasAttribute("href")).toBe(false);
	expect(control.value).toBe("");
	viewer.resetDefaults();
	await vi.waitFor(() =>
		expect(viewer.querySelector("iframe")?.srcdoc).toContain(
			'variant="neutral"',
		),
	);
});
it("reports missing manifests and recovers after changing the tag", async () => {
	const fetch = mockFetch();
	fetch.mockResolvedValue(new Response("", { status: 404 }));
	document.body.innerHTML =
		'<tp-component-viewer tag="tp-unknown"></tp-component-viewer>';
	const viewer = document.querySelector(
		"tp-component-viewer",
	) as TpComponentViewer;
	await vi.waitFor(() =>
		expect(viewer.querySelector('[role="alert"]')?.textContent).toContain(
			"API manifest unavailable",
		),
	);
	fetch.mockImplementation(async () => new Response(JSON.stringify(api)));
	viewer.tag = "tp-button";
	await vi.waitFor(() =>
		expect(viewer.querySelector("[data-component-mode]")).not.toBeNull(),
	);
	viewer
		.querySelectorAll<HTMLInputElement>("[data-component-mode] input")[1]
		?.click();
	await vi.waitFor(() => expect(viewer.querySelector("iframe")).not.toBeNull());
});
it("keeps instances independent and reconnects without reading its generated UI as source", async () => {
	mockFetch();
	const first = await mount();
	const second = document.createElement(
		"tp-component-viewer",
	) as TpComponentViewer;
	second.tag = "tp-button";
	document.body.append(second);
	await vi.waitFor(() =>
		expect(second.querySelector("[data-component-mode]")).not.toBeNull(),
	);
	second
		.querySelectorAll<HTMLInputElement>("[data-component-mode] input")[1]
		?.click();
	await vi.waitFor(() => expect(second.querySelector("iframe")).not.toBeNull());
	const target1 = preview(first);
	const target2 = preview(second);
	target1.setAttribute("disabled", "");
	await Promise.resolve();
	expect(target2.hasAttribute("disabled")).toBe(false);
	first.remove();
	document.body.append(first);
	await vi.waitFor(() =>
		expect(first.querySelector("iframe")?.srcdoc).toContain("Try me"),
	);
});

it("reads values after native checkbox and radio change handlers have run", async () => {
	mockFetch();
	const viewer = await mount();
	const target = preview(viewer);
	viewer
		.querySelector<HTMLInputElement>("[data-component-booleans] input")
		?.click();
	expect(target.hasAttribute("disabled")).toBe(true);
	viewer
		.querySelector<HTMLInputElement>('[data-component-setting="variant"] input')
		?.click();
	expect(target.getAttribute("variant")).toBe("success");
});
it("does not let an obsolete response replace the latest selection", async () => {
	let resolveOld: (response: Response) => void = () => {};
	const old = new Promise<Response>((resolve) => {
		resolveOld = resolve;
	});
	vi.spyOn(globalThis, "fetch").mockImplementation(async (input) =>
		String(input).includes("old.html")
			? old
			: new Response(JSON.stringify(api)),
	);
	const viewer = document.createElement("tp-component-viewer");
	viewer.src = "old.html";
	viewer.tag = "tp-button";
	document.body.append(viewer);
	viewer.src = "";
	await vi.waitFor(() =>
		expect(viewer.querySelector("[data-component-mode]")).not.toBeNull(),
	);
	viewer
		.querySelectorAll<HTMLInputElement>("[data-component-mode] input")[1]
		?.click();
	await vi.waitFor(() => expect(viewer.querySelector("iframe")).not.toBeNull());
	viewer
		.querySelectorAll<HTMLInputElement>("[data-component-mode] input")[1]
		?.click();
	await vi.waitFor(() =>
		expect(viewer.querySelector("iframe")?.srcdoc).toContain("Try me"),
	);
	resolveOld(new Response("<tp-button>Obsolete content</tp-button>"));
	await Promise.resolve();
	await Promise.resolve();
	expect(viewer.querySelector("iframe")?.srcdoc).toContain("Try me");
	expect(viewer.querySelector("iframe")?.srcdoc).not.toContain(
		"Obsolete content",
	);
});

it("groups API tables in API and command tabs and only shows custom events created locally", async () => {
	vi.spyOn(globalThis, "fetch").mockImplementation(
		async () =>
			new Response(
				JSON.stringify({
					...api,
					events: [
						{ name: "click", description: "Native activation." },
						{
							name: "tp-button-ghost",
							description: "Only mentioned in documentation.",
						},
						{
							name: "tp-button-ready",
							emitted: true,
							description: "The button has finished preparing its content.",
						},
						{
							name: "tp-base-ready",
							emitted: true,
							inherited: true,
							description: "Inherited event.",
						},
					],
				}),
			),
	);
	const viewer = await mount();
	const tabs = viewer.querySelector(".tp-component-viewer-docs tp-tabs");
	expect(
		[...(tabs?.querySelectorAll('[role="tab"]') ?? [])].map((tab) =>
			tab.textContent?.trim(),
		),
	).toEqual(["Commands", "Attributes", "Methods", "Events", "CSS Properties"]);
	const events = [...(tabs?.querySelectorAll('[role="tabpanel"]') ?? [])][3];
	expect(events?.textContent).toContain("tp-button-ready");
	expect(events?.textContent).not.toContain("click");
	expect(events?.textContent).not.toContain("tp-button-ghost");
	expect(events?.textContent).not.toContain("tp-base-ready");
});
it("orders booleans, enums and wrapping typed fields without rewriting API order", async () => {
	vi.spyOn(globalThis, "fetch").mockImplementation(
		async () =>
			new Response(
				JSON.stringify({
					...api,
					attributes: [
						{ name: "href", type: "string", default: '""' },
						{ name: "count", type: "number", default: "2" },
						{ name: "variant", type: "TpVariantType", default: "neutral" },
						{ name: "day", type: "date", default: '""' },
						{ name: "hour", type: "time", default: '""' },
						{ name: "disabled", type: "boolean", default: "false" },
					],
				}),
			),
	);
	const viewer = await mount();
	expect(
		[
			...(viewer.querySelector("[data-component-controls]")?.children ?? []),
		].map((item) => item.localName),
	).toEqual(["tp-checkbox-list", "tp-radio-list", "tp-cluster"]);
	expect(
		[...(viewer.querySelector("[data-component-fields]")?.children ?? [])].map(
			(item) => item.localName,
		),
	).toEqual(["tp-textfield", "tp-numberfield", "tp-datefield", "tp-timefield"]);
});
it("suppresses boilerplate descriptions but preserves informative documentation", async () => {
	vi.spyOn(globalThis, "fetch").mockImplementation(
		async () =>
			new Response(
				JSON.stringify({
					...api,
					attributes: [
						{
							name: "disabled",
							type: "boolean",
							description: "Attribute `disabled`.",
						},
						{
							name: "href",
							type: "string",
							description: "Opens the linked resource when activated.",
						},
					],
					methods: [
						{ name: "reload()", description: "API documentation summary." },
					],
					cssproperties: [
						{ name: "--tp-button-radius", description: "Controls the radius." },
					],
				}),
			),
	);
	const viewer = await mount();
	const docs = viewer.querySelector(".tp-component-viewer-docs")?.textContent;
	expect(docs).not.toContain("Attribute `disabled`.");
	expect(docs).not.toContain("API documentation summary.");
	expect(docs).not.toContain("Controls the radius.");
	expect(docs).toContain("Opens the linked resource when activated.");
});

it("starts with Doc and changes the title and visible panel without recreating the preview", async () => {
	mockFetch();
	const viewer = document.createElement("tp-component-viewer");
	viewer.tag = "tp-button";
	document.body.append(viewer);
	await vi.waitFor(() =>
		expect(viewer.querySelector("[data-component-title]")?.textContent).toBe(
			"tp-button Doc",
		),
	);
	const docs = viewer.querySelector<HTMLElement>(".tp-component-viewer-docs");
	const demo = viewer.querySelector<HTMLElement>(".tp-component-viewer-demo");
	expect(docs?.hidden).toBe(false);
	expect(demo?.hidden).toBe(true);
	const choices = viewer.querySelectorAll<HTMLInputElement>(
		"[data-component-mode] input",
	);
	choices[1]?.click();
	expect(viewer.querySelector("[data-component-title]")?.textContent).toBe(
		"tp-button Demo",
	);
	expect(docs?.hidden).toBe(true);
	expect(demo?.hidden).toBe(false);
	const original = viewer.querySelector("tp-html-viewer");
	const field = viewer.querySelector(
		'[data-component-setting="href"]',
	) as HTMLElement & { value: string };
	field.value = "/kept";
	field.dispatchEvent(new Event("change"));
	choices[0]?.click();
	choices[1]?.click();
	expect(viewer.querySelector("tp-html-viewer")).toBe(original);
	expect(field.value).toBe("/kept");
});

it("renders command meanings with their assigned shortcuts", async () => {
	vi.spyOn(globalThis, "fetch").mockImplementation(
		async () =>
			new Response(
				JSON.stringify({
					...api,
					userHelp: {
						commands: [
							{
								button: "Copy code button",
								description: "Copy the entire editor content.",
								shortcut: "—",
							},
							{
								button: "Palette: Copy",
								description: "Copy the current selection.",
								shortcut: "Mod C",
							},
						],
					},
				}),
			),
	);
	const viewer = await mount();
	const panel = [
		...viewer.querySelectorAll('.tp-component-viewer-docs [role="tabpanel"]'),
	].at(0);
	expect(panel?.textContent).toContain("Copy the entire editor content.");
	expect(panel?.textContent).toContain("Copy the current selection.");
	expect(panel?.textContent).toContain("Mod C");
});
it("distinguishes no commands from missing command documentation", async () => {
	vi.spyOn(globalThis, "fetch").mockImplementation(
		async () =>
			new Response(JSON.stringify({ ...api, userHelp: { commands: [] } })),
	);
	const viewer = await mount();
	expect(
		viewer.querySelector(".tp-component-viewer-docs")?.textContent,
	).toContain("No component-specific commands.");
});

it("loads the full API lazily and preserves it when changing panels", async () => {
	const fetch = mockFetch();
	const viewer = await mount();
	expect(
		viewer.querySelector(".tp-component-viewer-api")?.childElementCount,
	).toBe(0);
	const choices = viewer.querySelectorAll<HTMLInputElement>(
		"[data-component-mode] input",
	);
	choices[2]?.click();
	expect(viewer.querySelector("[data-component-title]")?.textContent).toBe(
		"tp-button API",
	);
	expect(
		viewer.querySelector<HTMLElement>(".tp-component-viewer-docs")?.hidden,
	).toBe(true);
	expect(
		viewer.querySelector<HTMLElement>(".tp-component-viewer-demo")?.hidden,
	).toBe(true);
	const apiViewer = viewer.querySelector(
		".tp-component-viewer-api tp-html-viewer",
	);
	expect(apiViewer?.getAttribute("src")).toMatch(
		/api\/classes\/components_button\.TpButton\.html$/,
	);
	await vi.waitFor(() =>
		expect(
			fetch.mock.calls.some(([url]) =>
				String(url).endsWith("/api/classes/components_button.TpButton.html"),
			),
		).toBe(true),
	);
	choices[0]?.click();
	choices[2]?.click();
	expect(viewer.querySelector(".tp-component-viewer-api tp-html-viewer")).toBe(
		apiViewer,
	);
});
