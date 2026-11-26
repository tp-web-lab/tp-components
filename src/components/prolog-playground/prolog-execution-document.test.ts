/**
 * @module components/prolog-playground/execution-document-test
 * @summary Tests for Prolog playground execution document generation.
 */

import { describe, expect, it } from "vitest";
import { buildPrologExecutionDocument } from "./prolog-execution-document.js";
import { TpPrologProject } from "./prolog-project.js";
import { buildPrologTestDocument } from "./prolog-test-document.js";

describe("buildPrologExecutionDocument", () => {
	it("builds a SWI-Prolog WASM document with CLP(FD) support", async () => {
		const document = await buildPrologExecutionDocument(
			new TpPrologProject({
				entry: "/program.pl",
				query: "/query.pl",
				files: [
					{
						path: "/program.pl",
						language: "prolog",
						content: ":- use_module(library(clpfd)).\ndigit(X) :- X in 1..9.",
					},
					{
						path: "/query.pl",
						language: "prolog",
						content: "digit(X).",
					},
				],
			}),
		);

		expect(document.html).toContain(
			"https://cdn.jsdelivr.net/npm/swipl-wasm@8.3.1",
		);
		expect(document.html).toContain("library(clpfd)");
		expect(document.html).toContain("digit(X).");
		expect(document.html).toContain("await window.SWIPL(");
		expect(document.html).toContain("locateFile: file => base + file");
		expect(document.html).toContain(
			"prolog.forEach('tp_runtime:run(Source, Text)'",
		);
		expect(document.html).toContain("call_residue_vars");
		expect(document.html).toContain("prologErrorMessage");
		expect(document.html).toContain("console.log(text)");
		expect(document.html).toContain("console.error(message)");
	});

	it("supports a query-only project and reports an undefined predicate clearly", async () => {
		const document = await buildPrologExecutionDocument(
			new TpPrologProject({
				query: "/query.pl",
				files: [
					{
						path: "/query.pl",
						language: "prolog",
						content: "unknown_predicate(X).",
					},
				],
			}),
		);

		expect(document.html).toContain("unknown_predicate(X).");
		expect(document.html).toContain("prologErrorMessage(error)");
		expect(document.html).not.toContain("findUndefinedQueriesWithoutProgram");
	});

	it("silently accumulates program-only notebook cells for a later query", async () => {
		const scope = "prolog-notebook-accumulation";
		const programDocument = await buildPrologExecutionDocument(
			new TpPrologProject({
				entry: "/program.pl",
				files: [
					{
						path: "/program.pl",
						language: "prolog",
						content: "parent(ada, byron).",
					},
				],
			}),
			{ scope, index: 0 },
		);
		const queryDocument = await buildPrologExecutionDocument(
			new TpPrologProject({
				query: "/query.pl",
				files: [
					{ path: "/query.pl", language: "prolog", content: "parent(ada, X)." },
				],
			}),
			{ scope, index: 1 },
		);

		expect(programDocument.html).not.toContain("No Prolog query found");
		expect(programDocument.html).toContain("output.remove()");
		expect(queryDocument.html).toContain("parent(ada, byron).");
		expect(queryDocument.html).toContain("parent(ada, X).");
		expect(queryDocument.html).not.toContain('Undefined predicate "parent"');
		expect(queryDocument.html).toContain("pre[data-tp-prolog-output]");
		expect(queryDocument.html).toContain("background: transparent");
		expect(queryDocument.html).toContain("padding: 0");
		expect(queryDocument.html).not.toContain("background: #111827");
	});

	it("combines notebook facts and rules into one consultable program", async () => {
		const scope = "prolog-notebook-grandparent";
		const programs = [
			"parent(a,b).",
			"parent(b,c).",
			"grandparent(X,Y) :- parent(X,Z), parent(Z,Y).",
		];

		for (const [index, content] of programs.entries()) {
			await buildPrologExecutionDocument(
				new TpPrologProject({
					entry: "/program.pl",
					files: [{ path: "/program.pl", language: "prolog", content }],
				}),
				{ scope, index },
			);
		}

		const queryDocument = await buildPrologExecutionDocument(
			new TpPrologProject({
				query: "/query.pl",
				files: [
					{
						path: "/query.pl",
						language: "prolog",
						content: "grandparent(X,Y).",
					},
				],
			}),
			{ scope, index: 3 },
		);

		expect(queryDocument.html).toContain(
			"parent(a,b).\\n\\nparent(b,c).\\n\\ngrandparent(X,Y) :- parent(X,Z), parent(Z,Y).",
		);
		expect(queryDocument.html).toContain("/program.pl");
		expect(queryDocument.html).toContain("grandparent(X,Y).");
	});

	it("builds a SWI-Prolog WASM test document from test directives", async () => {
		const document = await buildPrologTestDocument(
			new TpPrologProject({
				entry: "/program.pl",
				test: "/test.pl",
				files: [
					{
						path: "/program.pl",
						language: "prolog",
						content: "parent(john, mary).",
					},
					{
						path: "/test.pl",
						language: "prolog",
						content: ":- test(parent_john_mary, parent(john, mary)).",
					},
				],
			}),
		);

		expect(document.html).toContain(
			"https://cdn.jsdelivr.net/npm/swipl-wasm@8.3.1",
		);
		expect(document.html).toContain("await window.SWIPL(");
		expect(document.html).toContain("locateFile: file => base + file");
		expect(document.html).toContain("parseTestDirectives");
		expect(document.html).toContain("parent_john_mary");
		expect(document.html).not.toContain("console.group('Prolog tests')");
	});

	it("preserves native project modules and their imports", async () => {
		const document = await buildPrologExecutionDocument(
			new TpPrologProject({
				entry: "/program.pl",
				query: "/query.pl",
				files: [
					{
						path: "/math_utils.pl",
						language: "prolog",
						content: `
:- module(math_utils, [square/2]).

square(X, Y) :- Y is X * X.
`.trim(),
					},
					{
						path: "/program.pl",
						language: "prolog",
						content: `
:- use_module(math_utils).
:- use_module(library(clpfd)).

score(X, Result) :- square(X, Result).
`.trim(),
					},
					{
						path: "/query.pl",
						language: "prolog",
						content: "score(5, X).",
					},
				],
			}),
		);

		expect(document.html).toContain("square(X, Y)");
		expect(document.html).toContain("module(math_utils");
		expect(document.html).toContain("use_module(math_utils)");
		expect(document.html).toContain("use_module(library(clpfd))");
	});

	it("uses native SWI DOM libraries without a simulated DOM", async () => {
		const document = await buildPrologExecutionDocument(
			new TpPrologProject({
				entry: "/program.pl",
				query: "/query.pl",
				files: [
					{
						path: "/index.html",
						language: "html",
						content: '<h2 id="title"></h2><button id="button"></button>',
					},
					{
						path: "/program.pl",
						language: "prolog",
						content: `
:- use_module(library(dom)).

setup_dom :-
  Title := document.getElementById(title),
  Title.textContent := "Hello".
`.trim(),
					},
					{
						path: "/query.pl",
						language: "prolog",
						content: "setup_dom.",
					},
				],
			}),
		);

		expect(document.html).toContain("use_module(library(dom))");
		expect(document.html).not.toContain("tp_dom_action");
		expect(document.html).not.toContain("createDomFacts");
		expect(document.html).toContain("module.FS.writeFile");
	});
});

it("preserves PlUnit suites and their source path in the test document", async () => {
	const document = await buildPrologTestDocument(
		new TpPrologProject({
			entry: "/program.pl",
			test: "/tests/suite.pl",
			files: [
				{ path: "/program.pl", language: "prolog", content: "fact(ok)." },
				{
					path: "/tests/suite.pl",
					language: "prolog",
					content:
						":- use_module(library(plunit)).\n:- begin_tests(facts).\ntest(ok) :- fact(ok).\n:- end_tests(facts).",
				},
			],
		}),
	);
	expect(document.html).toContain('const testPath = "/tests/suite.pl"');
	expect(document.html).toContain(
		"prolog.forEach('run_tests(all, [cleanup(false)])')",
	);
	expect(document.html).toContain("PlUnit: failed");
	expect(document.html).toContain("PlUnit: passed");
});

it("keeps script delimiters inside Prolog source data", async () => {
	const document = await buildPrologExecutionDocument(
		new TpPrologProject({
			query: "/query.pl",
			files: [
				{
					path: "/query.pl",
					language: "prolog",
					content: "X = '</script><p>literal</p>'.",
				},
			],
		}),
	);
	expect(document.html).not.toContain("</script><p>literal");
	expect(document.html).toContain("\\u003c/script>");
});
