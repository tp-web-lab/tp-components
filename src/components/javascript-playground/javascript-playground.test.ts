import { afterEach, describe, expect, it, vi } from "vitest";
import {
	TpJavascriptPlayground,
	TpJavascriptProject,
} from "./javascript-playground.js";

afterEach(() => document.body.replaceChildren());

describe("<tp-javascript-playground>", () => {
	it("covers project data and the executable language contract", async () => {
		const project = new TpJavascriptProject({
			name: "js",
			entry: "/main.js",
			test: "/main.test.js",
			importmap: { imports: { pkg: "/pkg.js" } },
			files: [
				{
					path: "/index.html",
					language: "html",
					content: '<button id="btn">Click</button>',
				},
				{ path: "/main.js", language: "javascript", content: "console.log(1)" },
				{
					path: "/main.test.js",
					language: "javascript",
					content: "console.assert(true)",
				},
			],
		});
		expect(project.clone().toJSON()).toEqual(project.toJSON());
		const element = new TpJavascriptPlayground();
		document.body.append(element);
		await Promise.resolve();
		const api = element as unknown as Record<
			string,
			(...args: unknown[]) => unknown
		>;
		const empty = api.createEmptyProject?.() as TpJavascriptProject;
		expect(api.getPlaygroundKind?.()).toBe("javascript");
		expect(api.getLanguageIconName?.()).toBe("file_type_javascript");
		expect(api.resolveEntry?.(empty)).toBe("/main.js");
		expect(api.createNewProject?.()).toBeInstanceOf(TpJavascriptProject);
		expect(api.createClearProject?.()).toBeInstanceOf(TpJavascriptProject);
		expect(api.normalizeProject?.(project)).toBeInstanceOf(TpJavascriptProject);
		const execution = (await api.buildExecutionDocument?.(project)) as {
			html: string;
			cleanup?: () => void;
		};
		expect(execution).toMatchObject({ html: expect.any(String) });
		expect(execution.html).toContain('<button id="btn">Click</button>');
		execution.cleanup?.();
		const testDocument = (await api.buildTestDocument?.(project)) as {
			html: string;
			cleanup?: () => void;
		};
		const parsed = new DOMParser().parseFromString(
			testDocument.html,
			"text/html",
		);
		expect(parsed.querySelector("#btn")?.textContent).toBe("Click");
		const externalScripts = [...parsed.querySelectorAll("script[src]")];
		expect(externalScripts).toHaveLength(2);
		for (const script of externalScripts)
			expect(script.getAttribute("crossorigin")).toBe("anonymous");
		testDocument.cleanup?.();
		expect(api.getLanguageHelp?.()).toContain("JavaScript");
		expect(api.getAdditionalToolbarMenuItems?.()).toContain("Import map");
		expect(
			api.createProjectFromExample?.(
				{ id: "sample", importmap: { imports: {} } },
				[],
			),
		).toBeInstanceOf(TpJavascriptProject);
		vi.spyOn(element, "run").mockResolvedValue();
		for (const action of [
			"javascript-importmap-lit",
			"javascript-importmap-shoelace",
			"javascript-importmap-none",
		])
			expect(api.handleAdditionalToolbarAction?.(action)).toBe(true);
		expect(api.handleAdditionalToolbarAction?.("unknown")).toBe(false);
		expect(
			api.normalizeProject?.(
				new TpJavascriptProject({
					files: [
						{ path: "/fallback.js", language: "javascript", content: "" },
					],
				}),
			),
		).toMatchObject({ entry: "/fallback.js" });
		expect(api.resolveEntry?.(new TpJavascriptProject())).toBeNull();
		await expect(
			api.buildExecutionDocument?.(new TpJavascriptProject()),
		).rejects.toThrow("entry");
		element.setAttribute("execution-scope", "notebook");
		expect(
			((await api.buildExecutionDocument?.(project)) as { html: string })?.html,
		).toContain("notebook");
	});
});
