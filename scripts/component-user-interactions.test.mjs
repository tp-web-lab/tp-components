import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import MarkdownIt from "markdown-it";

const root = resolve(import.meta.dirname, "..");
const markdown = new MarkdownIt();
const section = /### User interactions\n([\s\S]*?)(?=\n### |\n## |$)/;
const pages = readdirSync(resolve(root, "public/docs/components")).filter(name =>
  existsSync(resolve(root, `src/components/${name}/${name}.json`)) &&
  existsSync(resolve(root, `public/docs/components/${name}/index.md`)));

test("every public component documents pointer and keyboard actions in two tables", () => {
  assert.ok(pages.length >= 147);
  pages.forEach(name => {
    const source = readFileSync(resolve(root, `public/docs/components/${name}/index.md`), "utf8");
    const interactions = source.match(section)?.[1];
    assert.ok(interactions, name);
    assert.equal((interactions.match(/^#### Mouse interactions$/gm) ?? []).length, 1, name);
    assert.equal((interactions.match(/^#### Keyboard interactions$/gm) ?? []).length, 1, name);
    const tokens = markdown.parse(interactions, {});
    assert.equal(tokens.filter(token => token.type === "table_open").length, 2, name);
    assert.match(interactions.split("#### Keyboard interactions")[1], /\| Ctrl\+\? \|/, name);
    const manifest = JSON.parse(readFileSync(resolve(root, `src/components/${name}/${name}.json`), "utf8"));
    assert.equal(manifest.userHelp.interactions, interactions.trim(), `${name}: refresh user-help metadata`);
  });
});

test("the code-editor help explains every palette command and distinguishes full-copy from selection-copy", () => {
  const source = readFileSync(resolve(root, "src/components/code-editor/code-editor.ts"), "utf8");
  const doc = readFileSync(resolve(root, "public/docs/components/code-editor/index.md"), "utf8").match(section)[1];
  const commands = [...source.matchAll(/data-tp-code-editor-keyboard-action="[^"]+">\s*<span>([^<]+)<\/span>/g)].map(match => match[1]);
  assert.ok(commands.length >= 18);
  commands.forEach(command => assert.ok(doc.includes(`Palette: ${command}`), command));
  assert.match(doc, /Copy the entire editor content/);
  assert.match(doc, /Copies the current selection/);
  assert.match(doc, /\| `F1` \| Opens or closes the toolbar/);
});
