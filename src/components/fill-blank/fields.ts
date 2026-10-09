import { isTpBlank, type TpBlank } from "../blank/blank.js";

/** Supported stored-answer controls; tp-textfield contributes its native input. */
export type BlankField = HTMLInputElement | HTMLSelectElement | TpBlank;

/** Lists controls in author order, without counting content inside rich blanks. */
export function getBlankFields(root: ParentNode): BlankField[] {
	return Array.from(root.querySelectorAll("input, select, tp-blank")).filter(
		(node): node is BlankField =>
			isTpBlank(node) ||
			((node instanceof HTMLInputElement ||
				node instanceof HTMLSelectElement) &&
				!node.closest("tp-blank") &&
				!node.hasAttribute("data-tp-numberfield-submission")),
	);
}
