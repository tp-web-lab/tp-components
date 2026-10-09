import assert from "node:assert/strict";
import test from "node:test";
import { nativeMarkup } from "./native-markup.mjs";

const source = "<tp-list-table><ul><li><ul><li>A</li><li>B</li></ul></li><li><ol><li>C</li><li>D</li></ol></li></ul></tp-list-table>";

test("Markdown attaches nested cells directly to their otherwise empty row", () => {
  const output = nativeMarkup("md", source);
  assert.match(output, /- - A\n\n  - B/);
  assert.match(output, /- 1\. C\n\n  2\. D/);
  assert.doesNotMatch(output, /- \n\n/);
});

test("AsciiDoc gives empty outer list items a native blank placeholder", () => {
  const output = nativeMarkup("adoc", source);
  assert.match(output, /\* \{blank\}\n\*\* A/);
  assert.match(output, /\* \{blank\}\n\.\. C/);
});

test("RST retains the blank line and indentation required before a nested list", () => {
  const output = nativeMarkup("rst", source);
  assert.match(output, /- ?\n\n     - A/);
  assert.doesNotMatch(output, /<ul>|<ol>/);
});
