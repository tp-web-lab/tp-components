// Explicit exceptions for the documentation corpus. An unlisted HTML fallback
// is a regression, even when its rendered output happens to look correct.
const policy = {};
for (const name of ["Basic usage", "Javascript API", "Markdown source", "HTML source", "reStructuredText source", "External source", "LaTeX units comparison"])
  policy[name] = {};
policy["AsciiDoc source"] = {};
policy["External source"] = {};
policy["LaTeX source"] = {};
policy["Rich text"] = {};
policy["Native HTML comparison"] = {};
policy["Native Markdown comparison"] = {};
policy["Native AsciiDoc comparison"] = {};
policy["Native reStructuredText comparison"] = {};
policy["Media and subtitles comparison"] = {};
policy["Merged table comparison"] = {};
policy["Math and code comparison"] = {};
policy["LaTeX flexible table comparison"] = {};
for (const name of ["LaTeX table rules comparison"])
  policy[name] = {};
policy["LaTeX lists comparison"] = {};
policy["LaTeX theorems and references comparison"] = {markdown:"div span strong", asciidoc:"div span strong", restructuredtext:"div span strong"};
policy["LaTeX image transformations comparison"] = {};
policy["LaTeX code listings comparison"] = {};

policy["LaTeX array and tabularx comparison"] = {};
policy["LaTeX AMS equations comparison"] = {};
policy["LaTeX multilingual quotations comparison"] = {};

export const nativePolicy = policy;
export function unexpectedNativeFallbacks(name, language, source) {
  if (!(name in policy)) return ["Missing native-syntax policy"];
  if (language === "html") return [];
  // These are native constructs, despite sharing a name with an HTML element.
  if (language === "asciidoc") source = source.replace(/^\s*\[source,[\w+-]+(?:,[^\]]*)?\]\s*$/gm, "");
  if (language === "restructuredtext") source = source.replace(/^\s*\.\. (?:figure::\s+\S.*|table::.*)$/gm, "");
  const names = "table|caption|colgroup|col|thead|tbody|tr|th|td|ol|ul|li|h[1-6]|div|p|span|strong|img|figure|figcaption|video|audio|source|track";
  const patterns = language === "latex"
    ? [/\\wc([A-Z][A-Za-z]*)/g, /\\webcomponent(?:\[[^\]]*\])?\{(h[1-6])\}/g]
    : language === "markdown"
      ? [new RegExp(`^\\s*:+ (${names})(?=\\s|$)`, "gm")]
      : language === "asciidoc"
        ? [new RegExp(`^\\s*\\[(${names})(?=,|\\])`, "gm")]
        : [new RegExp(`^\\s*\\.\\. (?:html-)?(${names})::`, "gm")];
  const allowed = new Set((policy[name][language] || "").split(" "));
  return [...new Set(patterns.flatMap(pattern => [...source.matchAll(pattern)].map(match => match[1].toLowerCase())))].filter(tag => new RegExp(`^(?:${names})$`).test(tag) && !allowed.has(tag));
}

nativePolicy["LaTeX text environments comparison"] = {markdown:"div table tbody tr td", asciidoc:"div table tbody tr td", restructuredtext:"table tbody tr td"};

for (const name of ["Native comments comparison", "LaTeX indexes comparison", "LaTeX core math environments comparison", "Index components comparison"]) nativePolicy[name] = {};

// Minipage dimensions/position and scoped index paragraphs require these containers.
nativePolicy["LaTeX text environments comparison"].restructuredtext = "div table tbody tr td";
nativePolicy["Index components comparison"] = {latex: "div p", markdown: "div", asciidoc: "div", restructuredtext: "div"};
