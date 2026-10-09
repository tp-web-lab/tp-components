import { afterEach, expect, it } from "vitest";
import { readSpeechText } from "./speech-text.js";

afterEach(() => document.body.replaceChildren());

it("preserves paragraph, line and cell boundaries while excluding hidden and executable content", () => {
	const target = document.createElement("section");
	target.innerHTML =
		'<p> Hello <strong>world</strong>!<br>Next.</p><!-- comment --><ul><li>One</li><li>Two</li></ul><table><tr><th>Name</th><th>Score</th></tr><tr><td>Ada</td><td>20</td></tr></table><template>Template</template><script>Script</script><style>.unused{}</style><input value="Secret"><textarea>Secret</textarea><select><option>Choice</option></select><div style="visibility:hidden">Hidden</div><div style="visibility:collapse">Collapsed</div><tp-button>Button</tp-button><tp-text-to-speech>Speech controls</tp-text-to-speech>';
	document.body.append(target);
	expect(readSpeechText(target)).toBe(
		"Hello world!\nNext.\n\nOne\n\nTwo\n\nName Score\n\nAda 20",
	);
	expect(readSpeechText(document.createElement("div"))).toBe("");
});
