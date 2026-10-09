import assert from "node:assert/strict";
import test from "node:test";
import { nativeMarkup } from "./native-markup.mjs";

test("sibling AsciiDoc lists remain separate", () => {
  const source = nativeMarkup("adoc", "<tp-matching><ul><li>A</li></ul><ol><li>B</li></ol></tp-matching>");
  assert.match(source, /\* A\n\n\/\/\n\n\. B/);
});

test("two lists in an AsciiDoc definition stay inside the same definition", () => {
  const source = nativeMarkup("adoc", "<dl><dt>Form</dt><dd><ul><li>A</li></ul><ol><li>B</li></ol></dd><dt>Feedback</dt><dd>Try again.</dd></dl>");
  assert.match(source, /Form::\n\+\n--\n\* A\n\n\/\/\n\n\. B\n--\n\nFeedback::/);
});

test("media in Markdown lists uses native inline roles", () => {
  const source = nativeMarkup("md", '<ul><li><audio controls src="sound.mp3"></audio></li><li><video controls src="clip.mp4"></video></li></ul>');
  assert.match(source, /- :audio:\{controls src="sound.mp3"\}/);
  assert.match(source, /- :video:\{controls src="clip.mp4"\}/);
  assert.doesNotMatch(source, /:::|<audio|<video/);
});

test("AsciiDoc media stays attached to its list item", () => {
  const source = nativeMarkup("adoc", '<ul><li><audio controls src="sound.mp3"></audio></li></ul>');
  assert.match(source, /\* \{blank\}\n\+\n\[audio/);
  const withCaption = nativeMarkup("adoc", '<ul><li><p>Listen.</p><audio controls src="sound.mp3"></audio></li></ul>');
  assert.match(withCaption, /Listen\.\n\+\n\[audio/);
});

test("AsciiDoc definitions attach later paragraphs and lists with continuations", () => {
  const source = nativeMarkup("adoc", "<dl><dt>Form</dt><dd><p>France.</p><p>Italy.</p></dd><dt>Feedback</dt><dd><p>Check both.</p><ul><li>First</li><li>Second</li></ul></dd></dl>");
  assert.match(source, /Form::\n\+\nFrance\.\n\+\nItaly\./);
  assert.match(source, /Feedback::\n\+\nCheck both\.\n\+\n\* First\n\n\* Second/);
});
