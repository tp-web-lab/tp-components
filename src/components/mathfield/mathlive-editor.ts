import { MathfieldElement } from "mathlive";
import fonts from "mathlive/fonts.css?inline";

/** Load fonts through the bundler, without external font or sound requests. */
export function createVisualMathfield(): MathfieldElement {
	if (!document.getElementById("tp-mathlive-fonts")) {
		const style = document.createElement("style");
		style.id = "tp-mathlive-fonts";
		style.textContent = fonts;
		document.head.append(style);
	}
	MathfieldElement.fontsDirectory = null;
	MathfieldElement.soundsDirectory = null;
	const field = new MathfieldElement();
	// Examples run in independent iframes whose parent may not load MathLive.
	// Keep the keyboard local; MathLive reserves and restores its body padding.
	if (window.self !== window.top) {
		field.mathVirtualKeyboardPolicy = "sandboxed";
	}
	return field;
}
