# Code quality

All TypeScript files, including `.test.ts` files, must comply with Biome's formatting and lint rules. Tests are not exempt: do not exclude them, weaken rules for them, or add suppressions solely to make checks pass.

Use the installed `@biomejs/biome` through `pnpm exec biome check` on every changed TypeScript file before completing a change. A successful TypeScript compilation or Vitest run does not replace this check. Review automatic formatting changes; fix remaining diagnostics explicitly.

Run focused tests when appropriate. Do not run global accessibility or coverage reports unless the user requests them.

# Reuse library components

For `tp-*field` components, the clear button must be hidden unless the boolean `clearable` attribute is present. Preserve the field-type markers independently of the clear button and cover dynamic addition/removal of `clearable` in tests.

Use existing `tp-*` components whenever they meet the need, both in implementations and in documentation examples. Prefer their built-in attributes and behaviors (for example, `tp-textfield clearable`) over recreating equivalent native controls or custom code. Reuse existing shared styles rather than duplicating them.

For viewer and playground rendering changes, always verify that both the native render iframe and its containing panel adapt dynamically to their content: initial loading, asynchronous growth, shrinking, replacement and width changes. Avoid fixed minimum heights or stretched containers that leave empty space before the console.

Apply the same checks to code editors and their tab panels/work areas: use the editor's intrinsic height synchronization instead of forcing a fixed splitter height or overriding measured heights with `100% !important`. Verify typing, deletion, file switches, toolbar changes and line wrapping after width changes.

# Documentation language

In every component's `public/docs/components/NAME/interactions.md`, provide exactly two tables under the headings Mouse interactions and Keyboard interactions. Describe each visible button, menu action or gesture and its result for end users, without authoring details. Explicitly state when there is no component-specific interaction. Include Ctrl+? in every keyboard table: help targets the component under the pointer, falling back to the focused component; Shift may be needed to type ?. Distinguish toolbar buttons from palette commands, and verify shortcuts against the implementation.

Each `TpName` class must have only one `@example`, matching the complete introductory documentation example. Do not append additional class examples; put complementary scenarios in the documentation Examples section.

Ctrl+? opens a tp-component-viewer in the drawer titled `User help`, with Doc, Demo and API panels. Capture the targeted instance when help is requested and use its author content and current public attributes for an independent demo. Keep `interactions.md` specific and current: the component manifest includes this text and display name as `userHelp`, together with declared `@keyboard` shortcuts.

Do not add an Accessibility section to component documentation pages. Keep accessibility reporting in the transversal appendix and relevant interaction instructions in Usage; retain accessibility source metadata and tests.

Each component class JSDoc/TSDoc opens with the exact introductory sentence from its documentation page. Keep them aligned with `node scripts/sync-component-introductions.mjs` and verify with `--check`.

Component `@summary` comments describe the functionality without repeating the component's own tag name or mentioning light DOM. Keep meaningful references to other components when they explain integration.

Declare radio-list example choices with a `ul` containing `li` items, not `dl`/`dt`/`dd`. In native markup examples, use the corresponding unordered-list syntax. Name radio and checkbox groups with their `label` attribute; use `label-position="start"` for an inline group label rather than an external paragraph or a fieldset.

Introductory examples must be pure HTML (with CSS/JavaScript when necessary), displayed directly and simple but meaningful: supply the content, source or controls needed to demonstrate the component. An empty content-dependent component is not a useful introduction. Repeat the introduction as the first "Basic usage" example in HTML and equivalent native forms in all three markup languages.

All component examples in Markdown, AsciiDoc and reStructuredText must use the corresponding @tp parser's native syntax and component directives/roles, not raw HTML or HTML passthrough blocks. Preserve literal HTML only as explicitly displayed code or as source data for an HTML viewer/editor. Run `pnpm examples:check-native-markup` after changing examples or their generators.

Use the inline form of `tp-icon` by default in AsciiDoc, Markdown and reStructuredText examples, including standalone icons. Keep icons on the same line as their surrounding text; do not introduce separate paragraphs for inline icons. In Markdown, use `:tp-icon:{name="settings"}` without placeholder text or backticks. Only AsciiDoc and reStructuredText require a nonempty inline placeholder, which `tp-icon` removes from its rendered content. Use a block form only when explicitly requested or when an icon must contain structured source content such as inline SVG.

Write documentation prose and examples in English, including prompts, feedback, solutions, placeholders and accessible labels, unless an example explicitly demonstrates another language.

Do not add generic "Additional usage" examples. Remove duplicates of Basic usage; give each distinct example a specific title and an observable purpose, preferably demonstrating an attribute or behavior not already covered.

In reStructuredText, indentation is structural: keep paragraph continuation lines at the same indentation, keep inline literals within their paragraph, and separate directive options from their indented content with a blank line. Validate syntax with the RST parser when changing generated indentation.

Immediately before the language tabs in Examples, provide a native Markdown definition list (rendered as dl/dt/dd), with one entry per selectable example in the same order. Use its exact title as the term and one or two English sentences explaining the actions to try and the result to observe. Maintain the editorial descriptions in scripts/component-example-descriptions.mjs, run pnpm examples:sync-descriptions, then pnpm examples:check-descriptions and pnpm examples:check-labels. Review descriptions against the actual examples; do not invent behavior or describe a static example as interactive.

# Button legends and keyboard notation

User help for every component with button commands must include a Buttons table showing each command icon or text label with a short description. The shared help renderer builds this legend from the current controls; maintain concise, accurate descriptions in the Mouse interactions table, using the actual button labels. Do not duplicate live interactive controls in this legend.

Whenever prose or interaction tables mention keyboard keys, wrap each key in `<kbd>` independently: `<kbd>Ctrl</kbd>+<kbd>?</kbd>`, `<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>`. Keep literal code examples and machine-readable shortcut metadata unchanged. Existing Mouse interactions and Keyboard interactions tables remain required; the generated Buttons legend is additional.

All user-help tables must use the shared Markdown table presentation (`tp-md-table` inside `tp-markdown-output`), matching the geometry example’s Commands tables. Reuse this style rather than duplicating CSS; command legend icons use `2em`.

Group help command tables by their location or panel, using `data-help-group` on a container (or control). Use `data-help-description` for a concise action description: describe the effect, not the label or shortcut. Keep detailed instructions in the interaction tables.

Component help describes only its own commands. Stop command discovery at functional subcomponents; their internal controls belong to their own Ctrl+? help. Layout containers may carry the parent’s commands. Never annotate a subcomponent’s internal help descriptions from its parent.


# Component documentation structure

Use scripts/sync-component-doc-layout.mjs to maintain all component pages. Start with the component icon and usual name, a closed `<tp-toc position="end" expand-all>`, a single introductory sentence beginning “The custom `<tp-NAME>` element” that states only the component’s function (what it does, without usage instructions or implementation details), and a meaningful live introductory example. Reserve space for the expanded TOC without covering the example.

The four main sections are Component viewer, Usage, Examples and Dependencies, in that order. The component viewer loads the same introductory example. Usage starts with Initial content tabs when multiple input modes are supported; keep concise authoring guidance; reader interactions appear only in the component viewer. End Usage with Importing tabs (script with Autoloading and Cherry picking, import, bundler).

Examples use the four native markup viewers, Basic usage first, followed by meaningful complementary scenarios. The component viewer replaces grouped Attributes examples; do not regenerate those panels. Preserve their legacy fixtures when used by viewer controls. Dependencies starts with “All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.” Then list Internal and External dependencies alphabetically, with links and useful summaries.

The first component-viewer documentation tab is User interactions: include the complete mouse, keyboard and button instructions, with both Ctrl+? and Ctrl+Alt+? contextual help. The Demo HTML source is readonly and must reflect edited and component-reflected public attributes while preserving author content.

Keep User interactions out of Usage. Maintain its source in the adjacent interactions.md file; the API generator embeds it in userHelp for the viewer and contextual help.

Dependencies may end with an optional See also subsection for directly related tp-* components. Declare each relationship on the component class with `@see tp-NAME - A concise description of its relationship or purpose.` The dependency synchronizer generates the links alphabetically; these references are not runtime dependencies. Omit the subsection when no relationships are declared.
