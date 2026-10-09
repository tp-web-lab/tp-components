import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { normalizeBase, preparePages, rewriteUrls } from "./prepare-pages.mjs";

const roots = new Set(["docs", "extensions", "components", "tp-loader.js"]);
test("URLs in markup, scripts and manifests stay under the Pages base", () => {
	const input = `<img src="/docs/image.svg"> [Docs](/docs/cover.md) url(/docs/image.svg) fetch('/extensions/test.js')`;
	assert.equal(
		rewriteUrls(input, "/tp-components/", roots),
		input
			.replaceAll("/docs/", "/tp-components/docs/")
			.replaceAll("/extensions/", "/tp-components/extensions/"),
	);
	const manifest = JSON.stringify({ code: '<img src="/docs/image.svg">' });
	assert.equal(
		JSON.parse(rewriteUrls(manifest, "/tp-components/", roots)).code,
		'<img src="/tp-components/docs/image.svg">',
	);
	assert.equal(
		rewriteUrls(
			'"/src/components/card/a.svg" "/src/tp-loader.ts"',
			"/tp-components/",
			roots,
		),
		'"/tp-components/components/card/a.svg" "/tp-components/tp-loader.js"',
	);
});
test("external URLs, fragments, relative URLs and unrelated paths remain intact", () => {
	const source =
		'https://example.org/docs/a //example.org/docs/a ../docs/a #/docs/a "/path/file" "/tp-components/docs/a"';
	assert.equal(rewriteUrls(source, "/tp-components/", roots), source);
	assert.equal(normalizeBase("/"), "/");
	assert.throws(() => normalizeBase("../dist"));
});
test("preparation leaves dist unchanged and replaces stale output", async () => {
	const root = await mkdtemp(join(tmpdir(), "tp-pages-"));
	try {
		await mkdir(join(root, "dist"));
		const html =
			'<title>PREVIEW : tp-components</title><tp-markup-multi-pages repository="docs"></tp-markup-multi-pages><script src="/tp-loader.js"></script>';
		await writeFile(join(root, "dist/index.html"), html);
		await writeFile(join(root, "dist/tp-loader.js"), 'console.log("ok");');
		await writeFile(join(root, "dist/tp-loader.js.map"), "{}");
		const output = await preparePages(root);
		assert.equal(await readFile(join(root, "dist/index.html"), "utf8"), html);
		assert.match(
			await readFile(join(output, "index.html"), "utf8"),
			/src="\/tp-components\/tp-loader.js"/,
		);
		assert.match(
			await readFile(join(output, "index.html"), "utf8"),
			/repository="\/tp-components\/docs"/,
		);
		await assert.rejects(readFile(join(output, "tp-loader.js.map")));
		await writeFile(join(output, "stale"), "old");
		await preparePages(root, "/");
		await assert.rejects(readFile(join(output, "stale")));
	} finally {
		await rm(root, { recursive: true, force: true });
	}
});

test("Pages deploys only main after a successful build with minimal permissions", async () => {
	const { load } = await import("js-yaml");
	const workflow = load(
		await readFile(
			new URL("../.github/workflows/pages.yml", import.meta.url),
			"utf8",
		),
	);
	assert.deepEqual(workflow.permissions, { contents: "read" });
	assert.equal(workflow.jobs.deploy.needs, "build");
	assert.equal(
		workflow.jobs.deploy.if,
		"github.ref == 'refs/heads/main' && github.event_name != 'pull_request'",
	);
	assert.equal(workflow.jobs.deploy.permissions.pages, "write");
	assert.equal(workflow.jobs.deploy.permissions["id-token"], "write");
	assert.equal(workflow.jobs.deploy.environment.name, "github-pages");
	assert.equal(
		workflow.jobs.build.steps.find((step) =>
			step.uses?.startsWith("actions/upload-pages-artifact"),
		).with.path,
		"tp-components/.pages",
	);
});

test("playground HTML entry paths remain virtual when the site contains index.html", () => {
	const roots = new Set(["index.html", "index.htm", "docs", "tp-loader.js"]);
	const source = `project.findFile("/index.html") ?? project.findFile('/index.htm');`;
	assert.equal(rewriteUrls(source, "/tp-components/", roots), source);
	const project = JSON.stringify({
		files: [
			{ path: "/index.html", content: '<button id="btn">Click</button>' },
		],
	});
	assert.equal(
		JSON.parse(rewriteUrls(project, "/tp-components/", roots)).files[0].path,
		"/index.html",
	);
});
