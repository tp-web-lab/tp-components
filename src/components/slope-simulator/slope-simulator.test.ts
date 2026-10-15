import { afterEach, describe, expect, it, vi } from "vitest";
import { advance, profiles, type Terrain } from "./motion.js";
import "./slope-simulator.js";
import { parseProfiles } from "./profiles.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
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
