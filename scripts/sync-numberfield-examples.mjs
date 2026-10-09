import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { exampleFile, markupExample } from "./component-basic-examples.mjs";
import { standardizeComponentExamples } from "./standardize-component-examples.mjs";

// The live HTML introduction is the source of all four Basic usage variants.
const directory = new URL("../public/docs/components/numberfield/", import.meta.url);
const introduction = readFileSync(new URL("index.md", directory), "utf8").match(/<tp-cluster>[\s\S]*?<\/tp-cluster>/)?.[0];
if (!introduction) throw new Error("Missing numberfield introduction");
mkdirSync(new URL("examples/", directory), { recursive: true });
["html", "md", "adoc", "rst"].forEach((language) => {
  const source = language === "html" ? introduction : markupExample(language, introduction);
  writeFileSync(new URL(`examples/examples.${language}`, directory), exampleFile(language, "tp-numberfield", [{ label: "Basic usage", source }]));
});
console.log(standardizeComponentExamples(["numberfield"]));
