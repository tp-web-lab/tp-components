import assert from "node:assert/strict";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	realpathSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { build, createServer } from "vite";
import {
	componentsSidebarPlugin,
	sortComponentsSidebar,
	syncComponentsSidebar,
} from "./sync-components-sidebar.mjs";

const original = `- [Home](cover.md)
  - [Components](components/index.md)
    - [Zoo](zoo.md)
      - [Beta](beta.md)
      - [alpha](alpha.md)
    - [Alpha](category.md)
      - [Éclair](eclair.md)
      - [Beta](other-beta.md)
        - [Zulu](z.md)
        - [Alpha](a.md)
  - [Outside](outside.md)
    - [Z](outside-z.md)
    - [A](outside-a.md)
`;
const expected = `- [Home](cover.md)
  - [Components](components/index.md)
    - [Alpha](category.md)
      - [Beta](other-beta.md)
        - [Alpha](a.md)
        - [Zulu](z.md)
      - [Éclair](eclair.md)
    - [Zoo](zoo.md)
      - [alpha](alpha.md)
      - [Beta](beta.md)
  - [Outside](outside.md)
    - [Z](outside-z.md)
    - [A](outside-a.md)
`;
function fixture(t) {
	const root = realpathSync(mkdtempSync(join(tmpdir(), "tp-sidebar-order-")));
	t.after(() => rmSync(root, { recursive: true, force: true }));
	mkdirSync(join(root, "public/docs"), { recursive: true });
	const file = join(root, "public/docs/sidebar.md");
	writeFileSync(file, original);
	writeFileSync(
		join(root, "index.html"),
		"<!doctype html><title>Sidebar test</title>",
	);
	return { root, file };
}

test("sorts every level, preserving links, parents, surrounding sections and line endings", () => {
	const blank =
		"  - [Components](components/index.md)\n\n  - [Other](other.md)\n";
	assert.equal(sortComponentsSidebar(blank), blank);
	assert.equal(
		sortComponentsSidebar(original.replace("    - [Zoo]", "\n    - [Zoo]")),
		expected.replace("    - [Alpha]", "\n    - [Alpha]"),
	);
	for (const newline of ["\n", "\r\n"]) {
		const result = sortComponentsSidebar(original.replaceAll("\n", newline));
		assert.equal(result, expected.replaceAll("\n", newline));
		assert.equal(sortComponentsSidebar(result), result);
	}
});

test("checks without writing and rejects unsupported markup without changing the file", (t) => {
	const { file } = fixture(t);
	assert.equal(syncComponentsSidebar(file, { check: true }), true);
	assert.equal(readFileSync(file, "utf8"), original);
	assert.equal(syncComponentsSidebar(file), true);
	assert.equal(readFileSync(file, "utf8"), expected);
	assert.equal(syncComponentsSidebar(file), false);
	const malformed = original.replace(
		"      - [Beta](beta.md)",
		"      unsupported content",
	);
	writeFileSync(file, malformed);
	assert.throws(() => syncComponentsSidebar(file), /Unsupported/);
	assert.equal(readFileSync(file, "utf8"), malformed);
	assert.throws(
		() => sortComponentsSidebar("- [Other](other.md)"),
		/exactly one/,
	);
});

test("sorts before a real Vite build copies the public directory", async (t) => {
	const { root, file } = fixture(t);
	await build({
		root,
		configFile: false,
		logLevel: "silent",
		plugins: [componentsSidebarPlugin()],
	});
	assert.equal(readFileSync(file, "utf8"), expected);
	assert.equal(
		readFileSync(join(root, "dist/docs/sidebar.md"), "utf8"),
		expected,
	);
});

test("sorts additions while a real Vite development server is running", async (t) => {
	const { root, file } = fixture(t);
	const server = await createServer({
		root,
		configFile: false,
		logLevel: "silent",
		plugins: [componentsSidebarPlugin()],
		server: { host: "127.0.0.1", port: 0 },
	});
	t.after(() => server.close());
	await server.listen();
	const added = expected.replace(
		"    - [Alpha](category.md)",
		"    - [Zebra](zebra.md)\n    - [Alpha](category.md)",
	);
	writeFileSync(file, added);
	const sorted = sortComponentsSidebar(added);
	const deadline = Date.now() + 10000;
	while (readFileSync(file, "utf8") !== sorted && Date.now() < deadline)
		await new Promise((resolve) => setTimeout(resolve, 25));
	assert.equal(readFileSync(file, "utf8"), sorted);
});
