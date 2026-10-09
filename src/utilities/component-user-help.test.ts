import { describe, expect, it } from "vitest";
import { extractComponentUserHelp } from "./component-user-help.js";

describe("component user help metadata", () => {
	it("extracts the readable title without its icon or Markdown decoration", () => {
		expect(
			extractComponentUserHelp(
				'# <tp-icon name="code-editor" library="components"></tp-icon> Code editor',
				"",
			).displayName,
		).toBe("Code editor");
		expect(
			extractComponentUserHelp('# :tp-icon:{name="box"} **Box**', "")
				.displayName,
		).toBe("Box");
	});
	it("keeps reader instructions and keyboard shortcuts, never author directives", () => {
		const result = extractComponentUserHelp(
			"## Usage\n\n### User interactions\n\nClick a heading.\n\n#### Keyboard\nUse Tab.\n\n### Author directives\nSet attributes.\n\n## Programming\nAPI tables.",
			"/**\n * @keyboard {Enter / Space} Toggles the section.\n */",
		);
		expect(result.interactions).toBe(
			"Click a heading.\n\n#### Keyboard\nUse Tab.",
		);
		expect(result.keyboard).toEqual([
			{ key: "Enter / Space", description: "Toggles the section." },
		]);
	});
	it("handles missing metadata and instructions ending at the next section or EOF", () => {
		expect(extractComponentUserHelp("", "")).toEqual({
			displayName: "",
			introduction: "",
			interactions: "",
			keyboard: [],
		});
		expect(
			extractComponentUserHelp(
				"### User interactions\nRead.\n## Examples\nCode.",
				"",
			).interactions,
		).toBe("Read.");
		expect(
			extractComponentUserHelp("### User interactions\nRead.", "").interactions,
		).toBe("Read.");
	});
	it("extracts the introductory paragraph without the example or subsequent prose", () => {
		const introduction =
			'The custom `<tp-box>` element implements the <tp-icon name="box"></tp-icon> Box functionality: wraps content.';
		expect(
			extractComponentUserHelp(
				`# Box\n\n<tp-toc></tp-toc>\n\n${introduction}\n\n<tp-box>Example</tp-box>\n\n## Usage`,
				"",
			).introduction,
		).toBe(introduction);
	});
});
