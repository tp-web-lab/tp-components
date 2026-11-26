import { describe, expect, it } from "vitest";
import { TpProject } from "../playground/project.js";
import { buildSchemeExecutionDocument } from "./scheme-execution-document.js";

describe("Scheme execution documents", () => {
	it("rejects a missing program instead of executing an unrelated file", async () => {
		await expect(
			buildSchemeExecutionDocument(
				new TpProject({
					files: [{ path: "/index.html", content: "<p>Example</p>" }],
				}),
			),
		).rejects.toThrow("No Scheme entry");
	});
	it("keeps Scheme containing an HTML closing tag inside its source string", async () => {
		const project = new TpProject({
			entry: "/main.scm",
			files: [
				{ path: "/main.scm", content: '(display "</script><p>Literal</p>")' },
			],
		});
		const result = await buildSchemeExecutionDocument(project);
		expect(result.html).not.toContain("</script><p>Literal</p>");
		expect(result.html).toContain("\\u003c/script>");
		expect(project.files[0]?.content).toBe(
			'(display "</script><p>Literal</p>")',
		);
	});
	it("requires the requested test file and isolates tests from notebook scopes", async () => {
		const project = new TpProject({
			entry: "/main.scm",
			test: "/checks.scm",
			files: [{ path: "/main.scm", content: "(define count 1)" }],
		});
		await expect(
			buildSchemeExecutionDocument(project, "notebook-1", true),
		).rejects.toThrow("No Scheme test file");
		project.files.push({
			path: "/checks.scm",
			content: '(test-equal "count" 1 count)',
		});
		const result = await buildSchemeExecutionDocument(
			project,
			"notebook-1",
			true,
		);
		expect(result.html).toContain('const scope=""');
		expect(result.html).toContain("No tests executed.");
		expect(result.html).toContain("data-scheme-test-status");
		expect(result.html).toContain("session.isolateProgram()");
		expect(result.html).toContain("tp-test-program-output");
	});
});
