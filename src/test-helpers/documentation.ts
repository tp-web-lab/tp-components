import { readFileSync } from "node:fs";
import { required } from "./required.js";

/** Reads a named authored HTML example without executing its scripts. */
export function htmlExample(component: string, label: string): HTMLElement {
	const outer = document.createElement("template");
	outer.innerHTML = readFileSync(
		`public/docs/components/${component}/examples/examples.html`,
		"utf8",
	);
	const content = required(outer.content.querySelector("template")).content;
	return required(
		content.querySelector<HTMLElement>(`[role="example"][label="${label}"]`),
	);
}
