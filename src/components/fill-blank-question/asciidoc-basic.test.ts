import { readFileSync } from "node:fs";
import { afterEach, expect, it } from "vitest";
import { renderAsciidocToHtml } from "../asciidoc/asciidoc.js";
import "./fill-blank-question.js";

afterEach(() => document.body.replaceChildren());

it("keeps both Basic usage sentences and feedback inside the AsciiDoc question", async () => {
	const file = readFileSync(
		"public/docs/components/fill-blank-question/examples/examples.adoc",
		"utf8",
	);
	const source = file.match(/\.Basic usage\n======\n([\s\S]*?)\n======\n/)?.[1];
	if (!source) throw new Error("Missing Basic usage example");
	const template = document.createElement("template");
	template.innerHTML = await renderAsciidocToHtml(source);
	const question = template.content.querySelector("tp-fill-blank-question");
	const headings = [...(question?.querySelectorAll(":scope > dl > dt") ?? [])];
	const section = (name: string) =>
		headings.find((node) => node.textContent?.trim() === name)
			?.nextElementSibling;
	expect(section("Form")?.querySelectorAll("tp-textfield")).toHaveLength(2);
	expect(section("Form")?.textContent).toContain("The capital of Italy is");
	expect(section("Feedback")?.querySelectorAll("li")).toHaveLength(2);
	document.body.append(template.content);
	expect(document.querySelectorAll("tp-fill-blank tp-textfield")).toHaveLength(
		2,
	);
	const liveQuestion = document.querySelector("tp-fill-blank-question");
	liveQuestion?.remove();
	expect(document.body.textContent).not.toContain("The capital of Italy is");
});
