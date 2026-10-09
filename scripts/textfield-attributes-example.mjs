import { readFileSync } from "node:fs";
import { attributeControl } from "./interactive-attribute-examples.mjs";

/** Fields migrated to the shared grouped-attributes example. */
export const groupedFields = [
	"textfield",
	"mathfield",
	"datefield",
	"timefield",
	"numberfield",
];

/** Read initial settings from the component's published local attribute contract. */
export function fieldSettings(component) {
	return JSON.parse(
		readFileSync(
			new URL(
				`../src/components/${component}/${component}.json`,
				import.meta.url,
			),
			"utf8",
		),
	)
		.attributes.map((attribute) => {
			let value = attribute.default;
			try {
				value = JSON.parse(value);
			} catch {
				/* Unquoted enum defaults are already strings. */
			}
			return {
				name: attribute.name,
				value,
				...attributeControl(component, attribute),
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));
}

export const textfieldSettings = fieldSettings("textfield");

const escapeAttribute = (value) =>
	String(value)
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("<", "&lt;");

function buildAttributesExample(component = "textfield") {
	const textfieldSettings = fieldSettings(component);
	const instructions = {
		numberfield: "Set label and a numeric value, then try min, max and step (a positive number or any). Enable range to use a slider; its value is always nonempty and is clamped to its limits. Clear resets a slider to its midpoint. Changing the preview also updates these controls.",
		textfield:
			"Set label or aria-label to give the preview an accessible name. Choose type email and enter email in autocomplete, then focus the preview to try browser-managed suggestions (saved data and browser settings are required). Enable multiline to test rows. Type applies to single-line inputs only.",
		mathfield:
			"Set label, enter x^2 in value, then enable preview to see the rendered formula. Compare latexmath and asciimath, and try multiline. The formula preview button also updates the preview checkbox.",
		datefield:
			"Set label and enter a date such as 2026-09-14 in value. Use YYYY-MM-DD for min and max; step is measured in days. Choose a date in the native field and observe the value setting update.",
		timefield:
			"Set label and enter a time such as 14:30 in value. Use HH:MM or HH:MM:SS for min and max; step is measured in seconds (60 by default). Change the native time and observe the value setting update.",
	};
	const booleans = textfieldSettings.filter(
		(setting) => setting.kind === "boolean",
	);
	const enums = textfieldSettings.filter((setting) => setting.kind === "enum");
	const fields = textfieldSettings.filter((setting) => !setting.kind);
	return `<p>Change several attributes on one preview. All controls start at their documented defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Reset defaults fills the controls with their defaults again. Controls stay available when the preview is disabled or readonly.</p>
<tp-stack>
  <tp-checkbox-list id="textfield-booleans" label="Boolean attributes" label-position="top" orientation="horizontal" value="${booleans
		.map((setting, index) => (setting.value ? index + 1 : null))
		.filter(Boolean)
		.join(
			",",
		)}"><ul>${booleans.map((setting) => `<li>${setting.name}</li>`).join("")}</ul></tp-checkbox-list>
  ${enums.map((setting) => `<tp-radio-list data-setting="${setting.name}" label="${setting.name}" label-position="top" orientation="horizontal" value="${setting.values.indexOf(setting.value) + 1}"><ul>${setting.values.map((value) => `<li>${value}</li>`).join("")}</ul></tp-radio-list>`).join("\n")}
  <tp-cluster>${fields.map((setting) => `<tp-textfield data-setting="${setting.name}" label="${setting.name}" value="${escapeAttribute(setting.value)}" placeholder="${escapeAttribute(setting.value)}" clearable></tp-textfield>`).join("\n")}</tp-cluster>
  <tp-button id="textfield-reset" type="button">Reset defaults</tp-button>
</tp-stack>
<tp-divider></tp-divider>
<h3>Preview</h3>
<tp-box><tp-${component} id="textfield-preview"></tp-${component}></tp-box>
<tp-box id="textfield-readout" aria-live="polite">Reading native attributes…</tp-box>
<tp-callout variant="info" heading="Things to try">${instructions[component]} Enable clearable to show the clear button; it is hidden otherwise.</tp-callout>
<script type="module">
await Promise.all(["tp-${component}", "tp-textfield", "tp-checkbox-list", "tp-radio-list", "tp-button"].map((tag) => customElements.whenDefined(tag)));
const settings = ${JSON.stringify(textfieldSettings)};
const booleanSettings = settings.filter((setting) => setting.kind === "boolean");
const preview = document.querySelector("#textfield-preview");
const booleans = document.querySelector("#textfield-booleans");
const readout = document.querySelector("#textfield-readout");
const controls = [...document.querySelectorAll("[data-setting]")];
const cleared = new Set();
${component === "numberfield" ? `
const ticks = document.createElement("datalist");
ticks.id = "numberfield-ticks";
[0, 25, 50, 75, 100].forEach((value) => {
  const option = document.createElement("option");
  option.value = String(value);
  ticks.append(option);
});
preview.after(ticks);
` : ""}

function showNativeAttributes() {
  const input = preview.querySelector("input, textarea");
  readout.textContent = "Native " + input.localName
    + ": aria-label=" + JSON.stringify(input.getAttribute("aria-label"))
    + ", autocomplete=" + JSON.stringify(input.getAttribute("autocomplete"))
    + ", name=" + JSON.stringify(input.name)
    + (input.localName === "input" ? ", type=" + JSON.stringify(input.type) : ", rows=" + input.rows)
    + (["date", "time", "number", "range"].includes(input.type) ? ", min=" + JSON.stringify(input.min) + ", max=" + JSON.stringify(input.max) + ", step=" + input.step + ", valid=" + input.validity.valid : "")
    + (preview.localName === "tp-mathfield" ? ", mode=" + preview.mode : "")
    + (!preview.label && !input.getAttribute("aria-label") ? ". No accessible name: set a label before publishing." : "");
}

function apply(setting, value) {
  if (!setting.kind && value === "") cleared.add(setting.name);
  else cleared.delete(setting.name);
  if (setting.kind === "boolean") preview.toggleAttribute(setting.name, value);
  else if (value === "") preview.removeAttribute(setting.name);
  else preview.setAttribute(setting.name, String(value));
}

function synchronize() {
  const selected = booleanSettings.map((setting, index) => preview.hasAttribute(setting.name) ? index + 1 : null).filter(Boolean).join(",");
  if (booleans.getAttribute("value") !== selected) booleans.setAttribute("value", selected);
  controls.forEach((control) => {
    const setting = settings.find((item) => item.name === control.dataset.setting);
    const actual = setting.name === "value" ? preview.value : preview.getAttribute(setting.name) ?? String(setting.value);
    if (cleared.has(setting.name)) {
      if (actual === "" || actual === String(setting.value ?? "")) {
        if (control.value !== "") control.value = "";
        return;
      }
      cleared.delete(setting.name);
    }
    const value = setting.kind === "enum" ? String(setting.values.indexOf(actual) + 1) : actual;
    if (control.value !== value) control.value = value;
  });
  showNativeAttributes();
}

booleans.addEventListener("tp-checkbox-list-change", (event) => {
  const selected = event.detail.value.split(",");
  booleanSettings.forEach((setting, index) => apply(setting, selected.includes(String(index + 1))));
  synchronize();
});
controls.forEach((control) => {
  const setting = settings.find((item) => item.name === control.dataset.setting);
  control.addEventListener("tp-clear", (event) => {
    if (event.target !== control || control.localName !== "tp-textfield") return;
    control.value = "";
    apply(setting, "");
    synchronize();
  });
  control.addEventListener(setting.kind === "enum" ? "tp-radio-list-change" : "input", (event) => {
    if (event.target !== control) return;
    const value = setting.kind === "enum" ? setting.values[Number(event.detail.value) - 1] : control.value;
    if (value === undefined) return;
    if (setting.name === "rows" && value !== "" && (!Number.isInteger(Number(value)) || Number(value) < 1)) {
      readout.textContent = "Rows must be a positive integer. The last valid value remains active.";
      return;
    }
    if (setting.name === "step" && value !== "" && !(preview.localName === "tp-numberfield" && value === "any") && (!Number.isFinite(Number(value)) || Number(value) <= 0)) {
      readout.textContent = "Step must be a positive number. The last valid value remains active.";
      return;
    }
    if (["tp-datefield", "tp-timefield"].includes(preview.localName) && ["min", "max", "value"].includes(setting.name) && value !== "") {
      const candidate = document.createElement("input");
      candidate.type = preview.localName === "tp-datefield" ? "date" : "time";
      candidate.value = value;
      if (!candidate.value) {
        readout.textContent = "Invalid " + candidate.type + ": use " + (candidate.type === "date" ? "YYYY-MM-DD." : "HH:MM or HH:MM:SS.") + " The last valid value remains active.";
        return;
      }
    }
    if (preview.localName === "tp-numberfield" && ["min", "max", "value"].includes(setting.name) && value !== "") {
      const candidate = document.createElement("input");
      candidate.type = "number";
      candidate.value = value;
      if (!candidate.value) {
        readout.textContent = "Enter a valid number. The last valid value remains active.";
        return;
      }
    }
    apply(setting, value);
    showNativeAttributes();
  });
});
function resetDefaults() {
  cleared.clear();
  settings.forEach((setting) => preview.removeAttribute(setting.name));
  preview.value = "";
  synchronize();
}
document.querySelector("#textfield-reset").addEventListener("click", resetDefaults);
preview.addEventListener("input", synchronize);
preview.addEventListener("change", synchronize);
const observer = new MutationObserver(synchronize);
observer.observe(preview, { attributes: true, attributeFilter: settings.map((setting) => setting.name) });
window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
resetDefaults();
</script>`.replaceAll("textfield-", `${component}-`);
}

/** Shared by the HTML, Markdown, AsciiDoc and reStructuredText examples. */
export function fieldAttributesScript(component) {
	const script = buildAttributesExample(component).match(/<script type="module">\n([\s\S]*?)\n<\/script>/)?.[1];
	if (!script) throw new Error(`Missing Attributes script for ${component}`);
	return `// Generated by scripts/standardize-component-examples.mjs.\n${script}\n`;
}

/** Keep only declarative controls and one external module reference in the example. */
export function textfieldAttributesExample(component = "textfield") {
	return buildAttributesExample(component).replace(
		/<script type="module">[\s\S]*?<\/script>/,
		`<script type="module" src="/docs/components/${component}/examples/attributes.js"></script>`,
	);
}
