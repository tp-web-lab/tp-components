import type { TpBlank } from "../blank/blank.js";
import type { TpMathfield } from "../mathfield/mathfield.js";

/** Supported stored-answer controls; tp-textfield contributes its native input or textarea. */
export type BlankField =
	| HTMLTextAreaElement
	| HTMLInputElement
	| HTMLSelectElement
	| TpBlank
	| TpMathfield;

/** Lists controls in author order, without counting content inside rich blanks. */
export function getBlankFields(root: ParentNode): BlankField[] {
	return Array.from(
		root.querySelectorAll("input, textarea, select, tp-blank, tp-mathfield"),
	).filter(
		(node): node is BlankField =>
			node.localName === "tp-blank" ||
			(node.localName === "tp-mathfield" && !node.closest("tp-blank")) ||
			((node instanceof HTMLInputElement ||
				node instanceof HTMLTextAreaElement ||
				node instanceof HTMLSelectElement) &&
				!node.closest("tp-blank, tp-mathfield") &&
				!node.hasAttribute("data-tp-numberfield-submission")),
	);
}
