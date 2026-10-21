import { describe, expect, it } from "vitest";
import { createHelpButtonTable } from "./help-buttons.js";
import { formatHelpKeyboard } from "./help-keyboard.js";

describe("help presentation", () => {
	it("keeps local commands but stops at functional subcomponents", () => {
		const host = document.createElement("tp-graph-geometry");
		host.innerHTML =
			'<tp-button-group><tp-icon-button label="Point" name="point"><button>Point</button></tp-icon-button></tp-button-group><tp-theme><tp-icon-button label="Theme"><button>Theme</button></tp-icon-button></tp-theme><tp-code-editor><button>Copy</button></tp-code-editor>';
		const own = createHelpButtonTable(host, "");
		expect(own?.querySelectorAll("tbody tr")).toHaveLength(1);
		expect(own?.textContent).toContain("Point");
		expect(own?.textContent).not.toContain("Theme");
		const theme = host.querySelector<HTMLElement>("tp-theme");
		if (!theme) throw new Error("Missing theme");
		expect(createHelpButtonTable(theme, "")?.textContent).toContain("Theme");
	});
	it("separates command locations and uses concise explicit effects", () => {
		const host = document.createElement("section");
		host.innerHTML =
			'<div data-help-group="Drawing tools"><button data-help-description="Create a point.">Point</button></div><div data-help-group="History"><button data-help-description="Revert the last change.">Undo</button></div>';
		const legend = createHelpButtonTable(
			host,
			"| Point | A long explanation. More details. |",
		);
		if (!legend) throw new Error("Missing legend");
		expect(
			[...legend.querySelectorAll("h4")].map((e) => e.textContent),
		).toEqual(["Drawing tools", "History"]);
		expect(legend.querySelectorAll("table")).toHaveLength(2);
		expect(legend.textContent).toContain("Create a point.");
		expect(legend.textContent).not.toContain("A long explanation");
	});

	it("marks individual chord keys without touching code or existing markup", () => {
		const source =
			"Use Ctrl+?. `Ctrl+Z`\n```html\nCtrl+Z\n```\n#### Keyboard interactions\n| Ctrl+Shift+Z / Ctrl++ | Redo |\n| Arrow Up / Down | Move |\n| `F1` | Help |";
		const result = formatHelpKeyboard(source);
		expect(result).toContain("<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>");
		expect(result).toContain("<kbd>Ctrl</kbd>+<kbd>+</kbd>");
		expect(result).toContain("<kbd>Arrow Up</kbd> / <kbd>Down</kbd>");
		expect(result).toContain("<kbd>F1</kbd>");
		expect(result).toContain("`Ctrl+Z`");
		expect(result).toContain("```html\nCtrl+Z\n```");
		expect(formatHelpKeyboard(result)).toBe(result);
	});
	it("shows icons and documented descriptions inside an outer document container", () => {
		const outer = document.createElement("div");
		outer.dataset.role = "content";
		outer.innerHTML =
			'<section><tp-icon-button name="undo" label="Undo"><button aria-label="Undo"></button></tp-icon-button><div hidden><button>Hidden</button></div><div data-role="content"><button>Article button</button></div></section>';
		const table = createHelpButtonTable(
			outer.firstElementChild as HTMLElement,
			"| Undo / Redo | Reverse or restore the last action. |",
		);
		expect(table?.querySelectorAll("tbody tr")).toHaveLength(1);
		expect(table?.querySelector("tp-icon")?.getAttribute("name")).toBe("undo");
		expect(table?.textContent).toContain("Reverse or restore the last action.");
		expect(table?.querySelector("button, tp-icon-button")).toBeNull();
	});
	it("includes a button host only once and omits empty legends", () => {
		const host = document.createElement("tp-button");
		host.innerHTML = "<button>Submit</button>";
		expect(
			createHelpButtonTable(host, "")?.querySelectorAll("tbody tr"),
		).toHaveLength(1);
		expect(createHelpButtonTable(document.createElement("div"), "")).toBeNull();
	});
});
