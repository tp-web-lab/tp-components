import { existsSync, readFileSync, writeFileSync } from "node:fs";

const descriptions = {
  Base: "Base components provide the shared foundations for building web components and interactive questions with consistent behavior.",
  Controllers: "Controller components let users adjust interface preferences such as language, direction, colors and theme, or switch to fullscreen.",
  Documentations: "Documentation components turn HTML and markup documents into navigable single-page or multi-page reading experiences.",
  Editors: "Editor components let users create and modify code, rich text, graphs and spreadsheets through specialized editing interfaces.",
  Feedbacks: "Feedback components communicate status, contextual messages and runtime output to help users understand what is happening.",
  Files: "File components organize file resources, include external content and embed documents within a page.",
  Forms: "Form components provide reusable buttons, selection controls and typed input fields for collecting user input.",
  Games: "Game components offer interactive puzzles and activities that exercise memory, logic and problem-solving skills.",
  Layouts: "Layout components organize content into responsive structures, controlling spacing, alignment and distribution while providing containers and navigation patterns for composing pages.",
  "Markup Languages": "Markup components transform Markdown, AsciiDoc and reStructuredText source into rendered content with support for the library’s web-component extensions.",
  Notebooks: "Notebook components combine editable code cells and their outputs into interactive documents for exploring computations step by step.",
  Overlays: "Overlay components display dialogs, menus and contextual information above the main content without requiring navigation to another page.",
  Pickers: "Picker components provide visual interfaces for selecting colors, emoji, mathematical formulas, icons and symbols.",
  Playgrounds: "Playground components combine project files, source editing, execution and preview tools into interactive workspaces for experimenting with code and markup.",
  Plots: "Plot components display geographic maps and turn declarative source into diagrams, L-system fractals, turtle drawings and mathematical graphs.",
  Quizzes: "Quiz components collect answers to educational exercises through choices, text fields and draggable blanks, with feedback and solution workflows.",
  Questions: "Question components combine an answer form, submission controls, feedback and a solution in a shared exercise interface.",
  "Questions/Playgrounds": "Playground questions let learners edit a complete programming project and submit its current files to external tests.",
  "Questions/Viewers": "Viewer questions combine a compact editable source viewer with submission controls and external tests, checking program execution or the HTML rendered from markup.",
  Simulators: "Simulator components let users construct and explore interactive models of automata, circuits, optics, Petri nets and relational queries.",
  Slides: "Slide components transform markup documents into navigable presentations with controls for moving between slides.",
  Time: "Time components display the current time, measure elapsed time, count down durations and signal alarms.",
  Utilities: "Utility components supply reusable interaction and media features such as drag and drop, copying, animation, icons and speech input or output.",
  Viewers: "Viewer components render source content and expose tools for inspecting, editing or executing it according to its language or format.",
};

const sidebarPath = "public/docs/sidebar.md";
let sidebar = readFileSync(sidebarPath, "utf8");
const groups = [];
let active;
let parent;
for (const line of sidebar.split("\n")) {
  const family = /^ {4}- (?:\[([^\]]+)\]\(([^)]+)\)|(.+))$/.exec(line);
  if (family) {
    const title = family[1] ?? family[3];
    parent = title;
    if (!descriptions[title]) { active = undefined; continue; }
    const path = family[2]?.replace(/\.ts$/, ".md") ?? `components/${title.toLowerCase()}.md`;
    active = { title, path, components: [] };
    groups.push(active);
    sidebar = sidebar.replace(line, `    - [${title}](${path})`);
  }
  const subgroup = /^ {6}- \[([^\]]+)\]\((components\/[^/]+\.md)\)$/.exec(line);
  if (parent === "Questions" && subgroup) {
    const title = subgroup[1];
    active = { title, path: subgroup[2], description: descriptions[`Questions/${title}`] ?? descriptions[title], components: [] };
    groups.push(active);
  }
  const component = /^ {6,}- \[[^\]]+\]\(components\/([^/]+)\/index\.md\)$/.exec(line);
  if (component && active) active.components.push(component[1]);
}

const requested = new Set(process.argv.slice(2));
for (const { title, path, components, description } of groups) {
  if (requested.size && !requested.has(path)) continue;
  const target = `public/docs/${path}`;
  const old = existsSync(target) ? readFileSync(target, "utf8") : "";
  const marker = "<!-- family-introduction:end -->";
  const preserved = old.includes(marker) ? old.split(marker)[1].trim()
    : ["Playgrounds", "Editors"].includes(title) ? `## Further reading\n\n${old.replace(/^# [^\n]+\n/, "").trim()}` : "";
  const entries = [...new Set(components)].sort().map((name) => {
    if (!existsSync(`public/docs/components/${name}/index.md`)) throw new Error(`Missing page: ${name}`);
    const iconPath = `src/components/icon/icons/components/${name}.svg`;
    const icon = existsSync(iconPath) && readFileSync(iconPath, "utf8").includes("<svg") ? name : "base";
    return `::: tp-center { intrinsic }\n:tp-icon:{name="${icon}" library="components" size="4em" aria-hidden="true"}\n\n[tp-${name}](${name}/index.md)\n:::`;
  });
  const content = title === "Questions"
    ? "- [Quizzes](quizzes.md): choices, matching and fill-in-the-blank exercises.\n- [Playgrounds](playground-questions.md): exercises using a full project workspace.\n- [Viewers](viewer-questions.md): programming and markup exercises using a compact source viewer.\n\nAll questions inherit [TpQuestion](question/index.md). Programming questions use [TpPlaygroundQuestion](playground-question/index.md), and markup questions use [TpMarkupViewerQuestion](markup-viewer-question/index.md). These generic bases share submission and feedback handling through TpEditorQuestion; concrete tags select the language and interface."
    : `:::::: tp-grid { min-width="10rem" gap="1.5rem" }\n\n${entries.join("\n\n")}\n\n::::::`;
  const next = `# ${title}\n\n::: tp-callout { variant="info" style="margin-bottom: 2em" }\n${description ?? descriptions[title]}\n:::\n\n${content}\n\n${marker}\n${preserved ? `\n${preserved.replaceAll("](components/", "](")}\n` : ""}`;
  if (next !== old) writeFileSync(target, next);
}
writeFileSync(sidebarPath, sidebar);
console.log(`Updated ${groups.length} family introductions (${groups.reduce((sum, group) => sum + group.components.length, 0)} components).`);
