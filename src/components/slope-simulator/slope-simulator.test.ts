import { readFileSync } from "node:fs";
import { chooseSaveTarget, saveBlob } from "../../utilities/save-file.js";
import { choosePlaygroundFile } from "../playground/playground-local-file.js";

vi.mock("../../utilities/save-file.js", () => ({
	chooseSaveTarget: vi.fn(),
	saveBlob: vi.fn(),
}));
vi.mock("../playground/playground-local-file.js", () => ({
	choosePlaygroundFile: vi.fn(),
}));

import { afterEach, describe, expect, it, vi } from "vitest";
import { advance, profiles, type Terrain } from "./motion.js";
import "./slope-simulator.js";
import { parseProfiles } from "./profiles.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.clearAllMocks();
});
const uphill: Terrain = [
	[0, 0],
	[1, 0.2],
];
const downhill: Terrain = [
	[0, 0.2],
	[1, 0],
];
function mount() {
	const element = document.createElement("tp-slope-simulator");
	document.body.append(element);
	return element;
}
function point(element: HTMLElement, track = 0) {
	const result = element.querySelector<HTMLElement>(`[data-track="${track}"]`);
	if (!result) throw new Error("Missing point");
	return result;
}
function right(element: HTMLElement) {
	element.dispatchEvent(
		new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
	);
}
describe("slope effort", () => {
	it("requires four times the effort uphill and a quarter downhill", () => {
		expect(advance(uphill, 0.5, 0.1)).toBeCloseTo(0.525);
		expect(advance(downhill, 0.5, 0.1)).toBeCloseTo(0.9);
		expect(advance(uphill, 0.5, -0.1)).toBeCloseTo(0.1);
	});
	it("spends effort across summits independently of event frequency", () => {
		for (const profile of profiles) {
			for (const direction of [-1, 1]) {
				let small = 0.5;
				for (let i = 0; i < 100; i++)
					small = advance(profile.points, small, 0.003 * direction);
				expect(advance(profile.points, 0.5, 0.3 * direction)).toBeCloseTo(
					small,
					10,
				);
			}
		}
	});
	it("clamps at endpoints and immediately allows reversal", () => {
		expect(advance(uphill, 0.9, 10)).toBe(1);
		expect(advance(uphill, 0.1, -10)).toBe(0);
		expect(advance(uphill, 1, -0.01)).toBeLessThan(1);
		expect(advance(uphill, 0, 0.01)).toBeGreaterThan(0);
	});
});
describe("simulator controls", () => {
	it("uses the range field and applies keyboard resistance without replacing focus targets", () => {
		const el = mount();
		const p = point(el);
		const field = el.querySelector("tp-numberfield");
		expect(field?.hasAttribute("range")).toBe(true);
		expect(field?.hasAttribute("clearable")).toBe(true);
		if (!field) throw new Error("Missing field");
		field.value = "20";
		field.dispatchEvent(new Event("input", { bubbles: true }));
		p.focus();
		right(p);
		expect(Number(p.getAttribute("aria-valuenow"))).toBeCloseTo(10.3, 1);
		expect(document.activeElement).toBe(p);
		el.remove();
		document.body.append(el);
		expect(el.querySelectorAll("[data-track]")).toHaveLength(2);
	});
	it("switches profiles, restarts each route, and resets the slope with clear", () => {
		const el = mount();
		const p = point(el, 1);
		right(p);
		const radio = el.querySelector("tp-radio-list");
		if (!radio) throw new Error("Missing profiles");
		radio.value = "3";
		expect(p.getAttribute("aria-valuenow")).toBe("10.0");
		right(p);
		el.querySelector<HTMLElement>('[data-reset="1"]')?.click();
		expect(p.getAttribute("aria-valuenow")).toBe("10.0");
		const field = el.querySelector("tp-numberfield");
		if (!field) throw new Error("Missing field");
		field.value = "20";
		field.dispatchEvent(new Event("input", { bubbles: true }));
		field.querySelector<HTMLElement>("tp-icon-button")?.click();
		right(point(el));
		expect(point(el).getAttribute("aria-valuenow")).toBe("11.0");
	});
	it("moves relatively with capture, cancels cleanly, and can be grabbed again", () => {
		const el = mount();
		const p = point(el);
		p.setPointerCapture = vi.fn();
		p.hasPointerCapture = () => true;
		p.releasePointerCapture = vi.fn();
		const board = p.parentElement;
		if (!board) throw new Error("Missing board");
		vi.spyOn(board, "getBoundingClientRect").mockReturnValue({
			width: 1000,
		} as DOMRect);
		const pointer = (type: string, x: number) => {
			const event = new Event(type, { bubbles: true });
			Object.assign(event, { pointerId: 1, clientX: x, button: 0 });
			p.dispatchEvent(event);
		};
		pointer("pointerdown", 100);
		pointer("pointermove", 195.6);
		expect(p.getAttribute("aria-valuenow")).toBe("20.0");
		pointer("pointercancel", 195.6);
		pointer("pointermove", 300);
		expect(p.getAttribute("aria-valuenow")).toBe("20.0");
		pointer("pointerdown", 100);
		pointer("pointermove", 195.6);
		pointer("pointerup", 195.6);
		expect(p.getAttribute("aria-valuenow")).toBe("30.0");
	});
});

const customProfiles = {
	profiles: [
		{
			id: "col",
			name: "My pass",
			points: [
				[0, 200],
				[10, 1000],
				[20, 300],
			] as [number, number][],
		},
	],
};
const settled = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
};
describe("custom profile validation", () => {
	it("accepts both ±20% limits and calculates km/metre slopes", () => {
		const parsed = parseProfiles({
			profiles: [
				{
					id: "limits",
					name: "Limits",
					points: [
						[5, 300],
						[6, 500],
						[7, 300],
					],
				},
			],
		});
		expect(parsed[0]?.points).toEqual([
			[0, 0],
			[0.5, 0.1],
			[1, 0],
		]);
		expect(parseProfiles(JSON.stringify(customProfiles))[0]?.points[1]).toEqual(
			[0.5, 0.04],
		);
	});
	it.each([200.00001, -200.00001])(
		"rejects slope beyond the limit: %s metres per km",
		(height) => {
			expect(() =>
				parseProfiles({
					profiles: [
						{
							id: "steep",
							name: "Steep",
							points: [
								[0, 0],
								[1, height],
							],
						},
					],
				}),
			).toThrow(/steep.*segment 1.*20/);
		},
	);
	it.each([
		[[0, 0]],
		[
			[0, 0],
			[0, 10],
		],
		[
			[1, 0],
			[0, 10],
		],
		[
			[0, 0],
			[1, Infinity],
		],
		[
			[0, 0],
			[1, "20"],
		],
	])("rejects invalid points %j", (...points) => {
		expect(() =>
			parseProfiles({ profiles: [{ id: "invalid", name: "Invalid", points }] }),
		).toThrow();
	});
	it("rejects empty data, duplicate ids and malformed JSON", () => {
		for (const data of [
			{ profiles: [] },
			{ profiles: [...customProfiles.profiles, ...customProfiles.profiles] },
			"{",
		])
			expect(() => parseProfiles(data)).toThrow();
	});
	it("preserves state on rejection and safely inserts profile labels as text", async () => {
		const el = mount();
		await settled();
		const error = vi.fn();
		el.addEventListener("tp-slope-simulator-error", error);
		expect(el.setProfiles(customProfiles)).toBe(true);
		right(point(el, 1));
		const position = point(el, 1).getAttribute("aria-valuenow");
		expect(
			el.setProfiles({
				profiles: [
					{
						id: "bad",
						name: "Bad",
						points: [
							[0, 0],
							[1, 201],
						],
					},
				],
			}),
		).toBe(false);
		expect(error).toHaveBeenCalledOnce();
		expect(el.querySelector("[role=alert]")?.textContent).toMatch(/segment 1/);
		expect(point(el, 1).getAttribute("aria-valuenow")).toBe(position);
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"My pass",
		);
		el.setProfiles({
			profiles: [
				{
					id: "safe",
					name: "<img src=x>",
					points: [
						[0, 0],
						[1, 200],
					],
				},
			],
		});
		expect(el.querySelector("[data-profile-choices] img")).toBeNull();
		expect(el.querySelector("[role=alert]")?.hasAttribute("hidden")).toBe(true);
		expect(point(el, 1).getAttribute("aria-valuenow")).toBe("10.0");
		const path = el
			.querySelector('[data-board="1"] .tp-slope-route')
			?.getAttribute("d");
		expect(path).toBe("M22,260 L978,30");
	});
	it("loads inline JSON, including a late parser insertion", async () => {
		const el = mount();
		const script = document.createElement("script");
		script.type = "tp/slope-simulator";
		script.textContent = JSON.stringify(customProfiles);
		el.append(script);
		await settled();
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"My pass",
		);
		expect(point(el, 1).getAttribute("aria-valuetext")).toContain("8.0% slope");
	});
	it("gives src priority and restores inline data when src is removed", async () => {
		const fetcher = vi.fn().mockResolvedValue({
			ok: true,
			text: async () =>
				JSON.stringify({
					profiles: [
						{
							id: "file",
							name: "File route",
							points: [
								[0, 0],
								[1, 100],
							],
						},
					],
				}),
		});
		vi.stubGlobal("fetch", fetcher);
		const el = document.createElement("tp-slope-simulator");
		const script = document.createElement("script");
		script.type = "tp/slope-simulator";
		script.textContent = JSON.stringify(customProfiles);
		el.append(script);
		el.src = "./profile.json";
		document.body.append(el);
		await settled();
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"File route",
		);
		el.removeAttribute("src");
		await settled();
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"My pass",
		);
	});
	it("keeps the latest request and retains profiles on fetch or validation errors", async () => {
		const resolvers: ((value: {
			ok: boolean;
			status?: number;
			text: () => Promise<string>;
		}) => void)[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(() => new Promise((resolve) => resolvers.push(resolve))),
		);
		const el = mount();
		await settled();
		el.src = "old.json";
		el.src = "new.json";
		resolvers[1]?.({
			ok: true,
			text: async () => JSON.stringify(customProfiles),
		});
		await settled();
		resolvers[0]?.({ ok: true, text: async () => "{}" });
		await settled();
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"My pass",
		);
		expect(el.querySelector("[role=alert]")?.hasAttribute("hidden")).toBe(true);
		el.src = "missing.json";
		resolvers[2]?.({ ok: false, status: 404, text: async () => "" });
		await settled();
		expect(el.querySelector("[role=alert]")?.textContent).toContain("404");
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"My pass",
		);
		el.src = "steep.json";
		resolvers[3]?.({
			ok: true,
			text: async () =>
				JSON.stringify({
					profiles: [
						{
							id: "steep",
							name: "Steep",
							points: [
								[0, 0],
								[1, 201],
							],
						},
					],
				}),
		});
		await settled();
		expect(el.querySelector("[role=alert]")?.textContent).toContain(
			"segment 1",
		);
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"My pass",
		);
	});
	it("does not let pending loads overwrite programmatic data or disconnected state", async () => {
		let resolveFetch:
			| ((value: { ok: boolean; text: () => Promise<string> }) => void)
			| undefined;
		vi.stubGlobal(
			"fetch",
			vi.fn(
				() =>
					new Promise((resolve) => {
						resolveFetch = resolve;
					}),
			),
		);
		const el = mount();
		await settled();
		el.src = "pending.json";
		el.setProfiles(customProfiles);
		resolveFetch?.({ ok: true, text: async () => "{}" });
		await settled();
		expect(el.querySelector("[role=alert]")?.hasAttribute("hidden")).toBe(true);
		el.src = "other.json";
		el.remove();
		resolveFetch?.({ ok: true, text: async () => "{}" });
		await settled();
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"My pass",
		);
	});
});

it("rejects an empty external JSON file", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue({ ok: true, text: async () => "" }),
	);
	const el = mount();
	await settled();
	el.setProfiles(customProfiles);
	el.src = "empty.json";
	await settled();
	expect(el.querySelector("[role=alert]")?.hasAttribute("hidden")).toBe(false);
	expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
		"My pass",
	);
});

describe("directional slope display", () => {
	it.each([0, 1])(
		"shows the signed slope in an XXL badge above route %s",
		async (track) => {
			const el = mount();
			await settled();
			const field = el.querySelector("tp-numberfield");
			if (!field) throw new Error("Missing field");
			field.value = "10";
			field.dispatchEvent(new Event("input", { bubbles: true }));
			const p = point(el, track);
			const badge = el.querySelector(`[data-grade="${track}"]`);
			const footer = el.querySelector(`[data-status="${track}"]`);
			const slope = track === 0 ? "10.0" : "6.0";
			expect(badge?.getAttribute("size")).toBe("xxl");
			expect(badge?.textContent).toContain(`+${slope} %`);
			p.dispatchEvent(
				new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
			);
			expect(badge?.textContent).toContain(`−${slope} %`);
			expect(footer?.textContent).toContain(`−${slope}% slope ← · Downhill`);
			expect(p.getAttribute("aria-valuetext")).toBe(footer?.textContent);
			right(p);
			expect(badge?.textContent).toContain(`+${slope} %`);
			expect(footer?.textContent).toContain(`+${slope}% slope → · Uphill`);
		},
	);
	it("updates the sign when the pointer reverses and avoids negative zero on flat ground", async () => {
		const el = mount();
		await settled();
		const p = point(el);
		const field = el.querySelector("tp-numberfield");
		if (!field || !p.parentElement) throw new Error("Missing controls");
		field.value = "-10";
		field.dispatchEvent(new Event("input", { bubbles: true }));
		p.setPointerCapture = vi.fn();
		p.hasPointerCapture = () => false;
		vi.spyOn(p.parentElement, "getBoundingClientRect").mockReturnValue({
			width: 1000,
		} as DOMRect);
		const pointer = (type: string, x: number) => {
			const event = new Event(type, { bubbles: true });
			Object.assign(event, { pointerId: 1, clientX: x, button: 0 });
			p.dispatchEvent(event);
		};
		pointer("pointerdown", 100);
		pointer("pointermove", 110);
		expect(el.querySelector('[data-grade="0"]')?.textContent).toContain(
			"−10.0 %",
		);
		pointer("pointermove", 100);
		expect(el.querySelector('[data-grade="0"]')?.textContent).toContain(
			"+10.0 %",
		);
		field.value = "0";
		field.dispatchEvent(new Event("input", { bubbles: true }));
		expect(el.querySelector('[data-grade="0"]')?.textContent).toContain(
			"0.0 %",
		);
	});
});

describe("inline profile editor", () => {
	it("applies only the selected profile and restores its original coordinates", async () => {
		const el = mount();
		await settled();
		const editor = el.querySelector("tp-code-editor");
		if (!editor) throw new Error("Missing editor");
		const original = editor.getValue();
		const selected = JSON.parse(original);
		selected.profiles[0].name = "Edited stage";
		selected.profiles[0].points = [
			[5, 300],
			[10, 800],
			[20, 300],
		];
		editor.setValue(JSON.stringify(selected));
		el.querySelector<HTMLElement>("[data-profile-play]")?.click();
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"Edited stage",
		);
		await settled();
		expect(
			el.querySelectorAll('tp-radio-list input[type="radio"]'),
		).toHaveLength(3);
		expect(el.querySelector('[data-grade="1"]')?.textContent).toContain(
			"+10.0 %",
		);
		expect(JSON.parse(editor.getValue()).profiles[0].points).toEqual(
			selected.profiles[0].points,
		);
		el.querySelector<HTMLElement>("[data-profile-reset]")?.click();
		expect(editor.getValue()).toBe(original);
		expect(el.querySelector('[data-grade="1"]')?.textContent).toContain(
			"+6.0 %",
		);
	});
	it("preserves invalid drafts and the curve, including when switching profiles", async () => {
		const el = mount();
		await settled();
		const editor = el.querySelector("tp-code-editor");
		if (!editor) throw new Error("Missing editor");
		const curve = el
			.querySelector('[data-board="1"] .tp-slope-route')
			?.getAttribute("d");
		const invalid = JSON.stringify({
			profiles: [
				{
					id: "bad",
					name: "Bad",
					points: [
						[0, 0],
						[1, 201],
					],
				},
			],
		});
		editor.setValue(invalid);
		el.querySelector<HTMLElement>("[data-profile-play]")?.click();
		expect(editor.getValue()).toBe(invalid);
		expect(
			el.querySelector('[data-board="1"] .tp-slope-route')?.getAttribute("d"),
		).toBe(curve);
		expect(el.querySelector("[data-source-error]")?.textContent).toContain(
			"20%",
		);
		const radio = el.querySelector("tp-radio-list");
		if (!radio) throw new Error("Missing profiles");
		radio.value = "2";
		expect(editor.getValue()).toContain("Mountain passes");
		radio.value = "1";
		expect(editor.getValue()).toBe(invalid);
		el.querySelector<HTMLElement>("[data-profile-reset]")?.click();
		expect(
			el.querySelector("[data-source-error]")?.hasAttribute("hidden"),
		).toBe(true);
	});
	it("preserves supplied units and replaces the reset baseline on new loading", async () => {
		const el = mount();
		await settled();
		el.setProfiles(customProfiles);
		const editor = el.querySelector("tp-code-editor");
		if (!editor) throw new Error("Missing editor");
		expect(JSON.parse(editor.getValue())).toEqual(customProfiles);
		editor.setValue("{");
		el.querySelector<HTMLElement>("[data-profile-play]")?.click();
		expect(editor.getValue()).toBe("{");
		el.querySelector<HTMLElement>("[data-profile-reset]")?.click();
		expect(JSON.parse(editor.getValue())).toEqual(customProfiles);
	});
});

describe("profile file commands", () => {
	const action = (el: HTMLElement, name: string) =>
		el.querySelector<HTMLElement>(`[data-profile-file="${name}"]`)?.click();
	it("saves the current draft, reuses Save and selects a new Save as destination", async () => {
		const el = mount();
		await settled();
		const editor = el.querySelector("tp-code-editor");
		if (!editor) throw new Error("Missing editor");
		vi.mocked(chooseSaveTarget)
			.mockResolvedValueOnce({ filename: "first.json" })
			.mockResolvedValueOnce({ filename: "second.json" });
		vi.mocked(saveBlob).mockResolvedValue(undefined);
		editor.setValue("draft one");
		action(el, "save");
		await settled();
		expect(chooseSaveTarget).toHaveBeenCalledTimes(1);
		expect(saveBlob).toHaveBeenLastCalledWith(expect.any(Blob), {
			filename: "first.json",
		});
		editor.setValue("draft two");
		action(el, "save");
		await settled();
		expect(chooseSaveTarget).toHaveBeenCalledTimes(1);
		expect(vi.mocked(saveBlob).mock.calls[1]?.[0].size).toBe(9);
		action(el, "save-as");
		await settled();
		expect(chooseSaveTarget).toHaveBeenCalledTimes(2);
		expect(saveBlob).toHaveBeenLastCalledWith(expect.any(Blob), {
			filename: "second.json",
		});
	});
	it("loads validated collections and preserves existing data on invalid files or cancellation", async () => {
		const el = mount();
		await settled();
		vi.mocked(choosePlaygroundFile).mockResolvedValueOnce({
			text: async () => JSON.stringify(customProfiles),
		} as File);
		action(el, "load");
		await settled();
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"My pass",
		);
		vi.mocked(choosePlaygroundFile).mockResolvedValueOnce({
			text: async () =>
				'{"profiles":[{"id":"bad","name":"Bad","points":[[0,0],[1,210]]}]}',
		} as File);
		action(el, "load");
		await settled();
		expect(el.querySelector("[data-source-error]")?.textContent).toContain(
			"21.000000%",
		);
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"My pass",
		);
		vi.mocked(choosePlaygroundFile).mockResolvedValueOnce(null);
		action(el, "load");
		await settled();
		expect(el.querySelector("[data-profile-choices]")?.textContent).toContain(
			"My pass",
		);
	});
	it("toggles the editor toolbar with the F1 button", async () => {
		const el = mount();
		await settled();
		const editor = el.querySelector("tp-code-editor");
		expect(editor?.toolbar).toBe(false);
		el.querySelector<HTMLElement>("[data-profile-toolbar]")?.click();
		expect(editor?.toolbar).toBe(true);
		el.querySelector<HTMLElement>("[data-profile-toolbar]")?.click();
		expect(editor?.toolbar).toBe(false);
	});
	it("ignores a pending file when the selected profile changes", async () => {
		const el = mount();
		await settled();
		let resolveFile: ((file: File) => void) | undefined;
		vi.mocked(choosePlaygroundFile).mockReturnValueOnce(
			new Promise((resolve) => {
				resolveFile = resolve;
			}),
		);
		action(el, "load");
		const radio = el.querySelector("tp-radio-list");
		if (!radio) throw new Error("Missing profiles");
		radio.value = "2";
		resolveFile?.({ text: async () => JSON.stringify(customProfiles) } as File);
		await settled();
		expect(el.querySelector("tp-code-editor")?.getValue()).toContain(
			"Mountain passes",
		);
	});
});

it("accepts multiple profiles through Play and selects the first with a working selector", async () => {
	const el = mount();
	await settled();
	el.setProfiles(customProfiles);
	const editor = el.querySelector("tp-code-editor");
	if (!editor) throw new Error("Missing editor");
	const collection = {
		profiles: [
			{
				id: "first",
				name: "First route",
				points: [
					[0, 0],
					[10, 1000],
				],
			},
			{
				id: "second",
				name: "Second route",
				points: [
					[0, 1000],
					[10, 0],
				],
			},
		],
	};
	editor.setValue(JSON.stringify(collection));
	el.querySelector<HTMLElement>("[data-profile-play]")?.click();
	await settled();
	expect(el.querySelector("[data-source-error]")?.hasAttribute("hidden")).toBe(
		true,
	);
	const radio = el.querySelector("tp-radio-list");
	expect(radio?.value).toBe("1");
	expect(el.querySelectorAll('tp-radio-list input[type="radio"]')).toHaveLength(
		2,
	);
	expect(JSON.parse(editor.getValue()).profiles[0].id).toBe("first");
	expect(el.querySelector('[data-grade="1"]')?.textContent).toContain(
		"+10.0 %",
	);
	if (!radio) throw new Error("Missing selector");
	radio.value = "2";
	expect(JSON.parse(editor.getValue()).profiles[0].id).toBe("second");
	expect(el.querySelector('[data-grade="1"]')?.textContent).toContain(
		"−10.0 %",
	);
	editor.setValue(
		JSON.stringify({
			profiles: [
				...collection.profiles,
				{
					id: "bad",
					name: "Bad",
					points: [
						[0, 0],
						[1, 201],
					],
				},
			],
		}),
	);
	el.querySelector<HTMLElement>("[data-profile-play]")?.click();
	await settled();
	expect(el.querySelector("tp-radio-list")?.value).toBe("2");
	expect(el.querySelectorAll('tp-radio-list input[type="radio"]')).toHaveLength(
		2,
	);
	expect(el.querySelector('[data-grade="1"]')?.textContent).toContain(
		"−10.0 %",
	);
});

it.each([
	["2026-lombardy-tour", 239.6],
	["2026-alpe-huez", 170.9],
])(
	"loads %s within the slope limits and fits its elevation",
	async (file, distance) => {
		const source = readFileSync(
			`public/docs/components/slope-simulator/examples/${file}.json`,
			"utf8",
		);
		const parsed = parseProfiles(source);
		expect(parsed).toHaveLength(1);
		expect(parsed[0]?.source.points.at(-1)?.[0]).toBe(distance);
		const el = mount();
		await settled();
		expect(el.setProfiles(source)).toBe(true);
		const path = el
			.querySelector('[data-board="1"] .tp-slope-route')
			?.getAttribute("d");
		const heights = Array.from(
			path?.matchAll(/[ML][^, ]+,([^ ]+)/g) ?? [],
			(match) => Number(match[1]),
		);
		expect(Math.min(...heights)).toBeCloseTo(30);
		expect(Math.max(...heights)).toBeCloseTo(260);
		expect(el.querySelector("tp-code-editor")?.getValue()).toContain(
			String(distance),
		);
	},
);

it("toggles a grid in source units and refreshes it for edited and flat profiles", async () => {
	const el = mount();
	await settled();
	const grid = () => el.querySelector('[data-board="1"] .tp-slope-grid');
	const toggle = el.querySelector<HTMLElement>("[data-profile-grid]");
	expect(grid()?.textContent).toBe("");
	el.setProfiles({
		profiles: [
			{
				id: "offset",
				name: "Offset",
				points: [
					[10, -100],
					[12, 100],
					[14, -100],
				],
			},
		],
	});
	const before = el
		.querySelector('[data-board="1"] .tp-slope-route')
		?.getAttribute("d");
	toggle?.click();
	expect(toggle?.getAttribute("aria-pressed")).toBe("true");
	expect(grid()?.textContent).toContain("Distance (km)");
	expect(grid()?.textContent).toContain("Height (m)");
	const labels = Array.from(
		grid()?.querySelectorAll("text") ?? [],
		(node) => node.textContent,
	);
	expect(labels).toContain("10");
	expect(labels).toContain("14");
	expect(labels).toContain("-100");
	expect(labels).toContain("100");
	expect(
		el.querySelector('[data-board="1"] .tp-slope-route')?.getAttribute("d"),
	).toBe(before);
	expect(point(el, 1).style.left).toBe(
		`${((22 + 0.1 * 956 + 65) / 1080) * 100}%`,
	);
	el.setProfiles({
		profiles: [
			{
				id: "flat",
				name: "Flat",
				points: [
					[0, 500],
					[0.5, 500],
				],
			},
		],
	});
	expect(grid()?.textContent).toContain("500");
	expect(grid()?.textContent).toContain("0.5");
	expect(grid()?.innerHTML).not.toMatch(/NaN|Infinity/);
	expect(toggle?.getAttribute("aria-pressed")).toBe("true");
	toggle?.click();
	expect(grid()?.textContent).toBe("");
	expect(
		el.querySelector('[data-board="1"] svg')?.getAttribute("viewBox"),
	).toBe("0 0 1000 300");
});

it("shows constant-effort speed and clears it on release and inactivity", async () => {
	const el = mount();
	await settled();
	vi.useFakeTimers();
	try {
		const badge = () => el.querySelector('[data-grade="0"]')?.textContent;
		const p = point(el);
		expect(badge()).toBe("0.0 % — 0.0 km/h");
		right(p);
		expect(badge()).toBe("0.0 % — 30.0 km/h");
		const field = el.querySelector("tp-numberfield");
		if (!field) throw new Error("Missing slope");
		field.value = "20";
		field.dispatchEvent(new Event("input", { bubbles: true }));
		right(p);
		expect(badge()).toBe("+20.0 % — 7.5 km/h");
		p.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
		);
		expect(badge()).toBe("−20.0 % — 120.0 km/h");
		p.dispatchEvent(
			new KeyboardEvent("keyup", { key: "ArrowLeft", bubbles: true }),
		);
		expect(badge()).toBe("−20.0 % — 0.0 km/h");
		right(p);
		vi.advanceTimersByTime(600);
		expect(badge()).toBe("+20.0 % — 0.0 km/h");
		right(p);
		el.querySelector<HTMLElement>('[data-reset="0"]')?.click();
		expect(badge()).toBe("+20.0 % — 0.0 km/h");
		el.remove();
	} finally {
		vi.useRealTimers();
	}
});

it("supports speed-base precedence, live changes and editor round trips", async () => {
	const el = mount();
	await settled();
	const data = {
		"speed-base": 20,
		profiles: [
			{
				id: "flat",
				name: "Flat",
				points: [
					[0, 100],
					[10, 100],
				] as [number, number][],
			},
		],
	};
	expect(el.speedBase).toBe(30);
	expect(el.setProfiles(data)).toBe(true);
	expect(el.speedBase).toBe(20);
	const editor = el.querySelector("tp-code-editor");
	if (!editor) throw new Error("Missing editor");
	expect(JSON.parse(editor.getValue())["speed-base"]).toBe(20);
	right(point(el, 1));
	expect(el.querySelector('[data-grade="1"]')?.textContent).toBe(
		"0.0 % — 20.0 km/h",
	);
	el.setAttribute("speed-base", "40");
	expect(el.speedBase).toBe(40);
	expect(el.querySelector('[data-grade="1"]')?.textContent).toBe(
		"0.0 % — 40.0 km/h",
	);
	expect(el.querySelector('[data-speed-note="0"]')?.textContent).toContain(
		"40 km/h",
	);
	el.removeAttribute("speed-base");
	expect(el.speedBase).toBe(20);
	editor.setValue(JSON.stringify({ ...data, "speed-base": 25 }));
	el.querySelector<HTMLElement>("[data-profile-play]")?.click();
	expect(el.speedBase).toBe(25);
	expect(JSON.parse(editor.getValue())["speed-base"]).toBe(25);
	el.querySelector<HTMLElement>("[data-profile-reset]")?.click();
	expect(el.speedBase).toBe(20);
	for (const invalid of [0, -10, "40", null]) {
		expect(
			el.setProfiles(JSON.stringify({ ...data, "speed-base": invalid })),
		).toBe(false);
		expect(el.speedBase).toBe(20);
	}
	el.setAttribute("speed-base", "invalid");
	expect(el.speedBase).toBe(20);
	expect(el.setProfiles({ profiles: data.profiles })).toBe(true);
	expect(el.speedBase).toBe(30);
});

it("loads an optional speed-base from src", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue({
			ok: true,
			text: async () =>
				JSON.stringify({
					"speed-base": 18,
					profiles: [
						{
							id: "flat",
							name: "Flat",
							points: [
								[0, 0],
								[1, 0],
							],
						},
					],
				}),
		}),
	);
	const el = document.createElement("tp-slope-simulator");
	el.src = "speed.json";
	document.body.append(el);
	await settled();
	expect(el.speedBase).toBe(18);
	expect(el.querySelector('[data-speed-note="1"]')?.textContent).toContain(
		"18 km/h",
	);
});
