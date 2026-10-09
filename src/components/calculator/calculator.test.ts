import { afterEach, expect, it, vi } from "vitest";
import { TpCalculator } from "./calculator.js";
import { calculate } from "./calculator-engine.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});
it.each([
	["2+3*4", 14],
	["(2+3)*4", 20],
	["-2^2", -4],
	["2^-3", 0.125],
	["2^3^2", 512],
	["200*15%", 30],
	["5!", 120],
	["0!", 1],
	["1/4", 0.25],
	["sqrt(81)", 9],
	["sqrt(27,3)", 3],
	["sqrt(-8,3)", -2],
	["ln(e)", 1],
	["log(1000)", 3],
	["exp(0)", 1],
	["10^3", 1000],
	["sin(30)", 0.5],
	["cos(60)", 0.5],
	["tan(45)", 1],
	["sinh(0)", 0],
	["cosh(0)", 1],
	["tanh(0)", 0],
	["1e-3+2", 2.001],
	["2×3−4÷2", 4],
] as const)("evaluates %s", (expression, result) =>
	expect(calculate(expression)).toBeCloseTo(result, 12),
);
it("uses radians only for trigonometric functions and returns random numbers", () => {
	expect(calculate("sin(pi/2)", false)).toBeCloseTo(1);
	expect(calculate("sinh(1)", false)).toBe(calculate("sinh(1)", true));
	vi.spyOn(Math, "random").mockReturnValue(0.42);
	expect(calculate("rand()")).toBe(0.42);
});
it.each([
	"1/0",
	"sqrt(-1)",
	"sqrt(2,0)",
	"ln(0)",
	"log(-2)",
	"tan(90)",
	"171!",
	"(-1)!",
	"1.5!",
	"2+",
	"sin()",
	"sin(1,2)",
	"window.alert(1)",
	"2pi",
	"1..2",
])("rejects %s", (expression) => expect(() => calculate(expression)).toThrow());
it("supports keypad editing, functions, errors, modes and dynamic orientation", async () => {
	const game = new TpCalculator();
	document.body.append(game);
	await vi.waitFor(() =>
		expect(game.querySelectorAll("button").length).toBeGreaterThan(0),
	);
	const field = game.querySelector("tp-textfield");
	if (!field) throw new Error("Missing field");
	const press = (label: string) => {
		const button = [...game.querySelectorAll("tp-button")].find(
			(b) => b.textContent === label,
		);
		if (!button) throw new Error(label);
		button.click();
	};
	press("9");
	press("√x");
	press("=");
	expect(field.value).toBe("3");
	press("+");
	press("2");
	press("=");
	expect(field.value).toBe("5");
	press("AC");
	press("2");
	press("7");
	press("ʸ√x");
	press("3");
	press("=");
	expect(Number(field.value)).toBeCloseTo(3);
	press("AC");
	press("1");
	press("/");
	press("0");
	press("=");
	expect(field.value).toBe("1/0");
	expect(game.querySelector('[role="status"]')?.textContent).toContain("zero");
	press("AC");
	press("3");
	press("0");
	press("sin");
	press("=");
	expect(Number(field.value)).toBeCloseTo(0.5);
	press("Deg");
	expect(
		[...game.querySelectorAll("button")].some(
			(b) => b.textContent?.trim() === "Rad",
		),
	).toBe(true);
	press("AC");
	press("π");
	press("/");
	press("2");
	press("sin");
	press("=");
	expect(Number(field.value)).toBeCloseTo(1);
	game.orientation = "vertical";
	expect(game.dataset.orientation).toBe("vertical");
	expect(field.value).toBe("1");
	game.remove();
	document.body.append(game);
	expect(field.value).toBe("1");
	expect(game.querySelectorAll("tp-textfield")).toHaveLength(1);
});
it("accepts typed expressions and emits results without submitting a form", () => {
	const game = new TpCalculator();
	document.body.append(game);
	const field = game.querySelector("tp-textfield");
	if (!field) throw new Error("Missing field");
	field.value = "2+3*4";
	const listener = vi.fn();
	game.addEventListener("tp-calculator-result", listener);
	field.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: "Enter",
			bubbles: true,
			cancelable: true,
		}),
	);
	expect(field.value).toBe("14");
	expect(listener.mock.calls[0]?.[0].detail).toEqual({
		expression: "2+3*4",
		result: 14,
	});
	field.dispatchEvent(
		new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
	);
	expect(field.value).toBe("");
});

it("toggles orientation from the header and keeps the calculation", () => {
	const game = new TpCalculator();
	document.body.append(game);
	const toggle = game.querySelector("tp-icon-button");
	const field = game.querySelector("tp-textfield");
	if (!toggle || !field) throw new Error("Missing controls");
	field.value = "123+4";
	expect(toggle.getAttribute("label")).toBe("Switch to vertical orientation");
	toggle.click();
	expect(game.getAttribute("orientation")).toBe("vertical");
	expect(toggle.getAttribute("name")).toBe("arrow-expand-horizontal");
	expect(field.value).toBe("123+4");
	toggle.click();
	expect(game.orientation).toBe("horizontal");
	game.orientation = "vertical";
	expect(toggle.getAttribute("label")).toBe("Switch to horizontal orientation");
	game.removeAttribute("orientation");
	expect(toggle.getAttribute("label")).toBe("Switch to vertical orientation");
});
