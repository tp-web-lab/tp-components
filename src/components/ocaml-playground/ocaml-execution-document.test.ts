import { describe, expect, it } from "vitest";
import { getLanguageFromFilename } from "../../utilities/code.js";
import {
	createSingleSourceProject,
	playgroundSourceAccept,
} from "../playground/playground-source-loader.js";
import { TpProject } from "../playground/project.js";
import {
	buildOCamlExecutionDocument,
	formatOCamlResults,
} from "./ocaml-execution-document.js";

describe("OCaml execution documents", () => {
	it("rejects a missing program instead of executing an unrelated file", async () => {
		await expect(
			buildOCamlExecutionDocument(
				new TpProject({
					files: [{ path: "/index.html", content: "<p>Example</p>" }],
				}),
			),
		).rejects.toThrow("No OCaml entry");
	});
	it("keeps OCaml containing an HTML closing tag inside its source string", async () => {
		const project = new TpProject({
			entry: "/main.ml",
			files: [
				{
					path: "/main.ml",
					content: 'print_endline "</script><p>Literal</p>";;',
				},
			],
		});
		const result = await buildOCamlExecutionDocument(project);
		expect(result.html).not.toContain("</script><p>Literal</p>");
		expect(result.html).toContain("\\u003c/script>");
		expect(project.files[0]?.content).toBe(
			'print_endline "</script><p>Literal</p>";;',
		);
	});
	it("requires the requested test file and isolates tests from notebook scopes", async () => {
		const project = new TpProject({
			entry: "/main.ml",
			test: "/checks.ml",
			files: [{ path: "/main.ml", content: "let count = 1;;" }],
		});
		await expect(
			buildOCamlExecutionDocument(project, "notebook-1", true),
		).rejects.toThrow("No OCaml test file");
		project.files.push({
			path: "/checks.ml",
			content: 'test_equal "count" 1 count;;',
		});
		const result = await buildOCamlExecutionDocument(
			project,
			"notebook-1",
			true,
		);
		expect(result.html).toContain('const scope=""');
		expect(result.html).toContain("No tests executed.");
		expect(result.html).toContain("data-ocaml-test-status");
	});
});

describe("OCaml source files", () => {
	it("imports .ml sources without reassigning Scheme file extensions", () => {
		expect(playgroundSourceAccept("ocaml")).toBe(".ml");
		expect(getLanguageFromFilename("example.ml")).toBe("ocaml");
		for (const extension of ["scm", "ss", "sld"]) {
			expect(getLanguageFromFilename(`example.${extension}`)).toBe("scheme");
			expect(() =>
				createSingleSourceProject(`example.${extension}`, "", "ocaml"),
			).toThrow("Unsupported ocaml source file");
		}
		const project = createSingleSourceProject(
			"example.ml",
			"let answer = 42;;",
			"ocaml",
		);
		expect(project.entry).toBe("/example.ml");
		expect(project.files?.at(-1)?.language).toBe("ocaml");
	});
});

it("shows values without toplevel declarations or type prefixes and keeps diagnostics", () => {
	expect(
		formatOCamlResults("val square : int -> int = <fun>\n- : int = 49\n"),
	).toBe("49");
	expect(
		formatOCamlResults(
			"type item = { value : int; }\nval x : item = {value = 3}\n- : item = {value = 3}\n- : int list = [1; 4; 9]\n",
		),
	).toBe("{value = 3}\n[1; 4; 9]");
	expect(
		formatOCamlResults("module M : sig\n  val x : int\nend\n- : int = 4\n"),
	).toBe("4");
	expect(
		formatOCamlResults(
			'Warning 26 [unused-var]: unused variable.\nval x : int = 1\n- : string = "a = b"',
		),
	).toBe('Warning 26 [unused-var]: unused variable.\n"a = b"');
});
