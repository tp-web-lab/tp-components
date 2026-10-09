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

In every component's Usage > User interactions, provide exactly two tables under the headings Mouse interactions and Keyboard interactions. Describe each visible button, menu action or gesture and its result for end users, without authoring details. Explicitly state when there is no component-specific interaction. Include Ctrl+? in every keyboard table: help targets the component under the pointer, falling back to the focused component; Shift may be needed to type ?. Distinguish toolbar buttons from palette commands, and verify shortcuts against the implementation.

Each `TpName` class must have only one `@example`, matching the complete introductory documentation example. Do not append additional class examples; put complementary scenarios in the documentation Examples section.

Ctrl+? is end-user help, titled `User help`. Its content begins with an h2 containing the component's human-readable documentation name (for example, Code editor), then a direct independent preview and a User interactions section with mouse/keyboard tables, without source editors, author controls, API tables or inheritance. Keep `Usage > User interactions` specific and current: the component manifest includes this text and display name as `userHelp`, together with declared `@keyboard` shortcuts.

Do not add an Accessibility section to component documentation pages. Keep accessibility reporting in the transversal appendix and relevant interaction instructions in Usage; retain accessibility source metadata and tests.

Component `@summary` comments describe the functionality without repeating the component's own tag name or mentioning light DOM. Keep meaningful references to other components when they explain integration.

Keep grouped `Attributes` interaction code in `examples/attributes.js`, shared by all four markup variants. The example declares its controls and loads that external module; regenerate it with the shared example generator instead of duplicating inline JavaScript.

In grouped Attributes examples, text controls show the documented default as their placeholder. Clear leaves the field empty and removes the preview attribute; synchronization must not refill it with the effective default. Reset defaults restores the actual default values in the controls.

Declare radio-list example choices with a `ul` containing `li` items, not `dl`/`dt`/`dd`. In native markup examples, use the corresponding unordered-list syntax. Name radio and checkbox groups with their `label` attribute; use `label-position="start"` for an inline group label rather than an external paragraph or a fieldset.

All components with local API attributes use one grouped `Attributes` example after Basic usage. Use one horizontal checkbox list for booleans, one horizontal radio list per enum, and textfields for other settings, initialized at their documented defaults. Labels are at top. Keep one shared preview, Reset defaults and (where initialization matters) Reload preview. Resource-loading controls offer only Default, two reviewed local fixtures and file-unknown, never a freely typed path. Components without local attributes keep Basic usage and meaningful complementary examples without an empty Attributes panel.

Remove all legacy `Attribute: NAME` examples when generating grouped Attributes; retain only complementary scenarios with a distinct purpose.

Each attribute example must provide an appropriate external `tp-*` control that changes the attribute on one live preview: a one-item `tp-checkbox-list` for a boolean, `tp-radio-list` for exclusive alternatives, `tp-checkbox-list` for multiple selections, or `tp-textfield`, `tp-mathfield`, `tp-datefield`, `tp-timefield` for typed values. Boolean controls add the attribute when checked and remove it when unchecked; never write `false` as a boolean attribute value. Initialize the control from the preview, explain index conversions, and synchronize controls when users can change the same state directly in the preview. Keep controls outside the preview so they remain usable when it is disabled or hidden. Validate meaningful values and explain attributes that require reinitialization instead of silently showing a nonfunctional control. Apply the same interaction in all four languages.

Introductory examples must be pure HTML (with CSS/JavaScript when necessary), displayed directly and simple but meaningful: supply the content, source or controls needed to demonstrate the component. An empty content-dependent component is not a useful introduction. Repeat the introduction as the first "Basic usage" example in HTML and equivalent native forms in all three markup languages.

All component examples in Markdown, AsciiDoc and reStructuredText must use the corresponding @tp parser's native syntax and component directives/roles, not raw HTML or HTML passthrough blocks. Preserve literal HTML only as explicitly displayed code or as source data for an HTML viewer/editor. Run `pnpm examples:check-native-markup` after changing examples or their generators.

Use the inline form of `tp-icon` by default in AsciiDoc, Markdown and reStructuredText examples, including standalone icons. Keep icons on the same line as their surrounding text; do not introduce separate paragraphs for inline icons. In Markdown, use `:tp-icon:{name="settings"}` without placeholder text or backticks. Only AsciiDoc and reStructuredText require a nonempty inline placeholder, which `tp-icon` removes from its rendered content. Use a block form only when explicitly requested or when an icon must contain structured source content such as inline SVG.

Write documentation prose and examples in English, including prompts, feedback, solutions, placeholders and accessible labels, unless an example explicitly demonstrates another language.

Do not add generic "Additional usage" examples. Remove duplicates of Basic usage; give each distinct example a specific title and an observable purpose, preferably demonstrating an attribute or behavior not already covered.

Order selectable examples identically in all four languages: Basic usage (the live introduction), then one Attributes panel for all local API attributes, then requested complementary examples. Inherited attributes are demonstrated on their declaring base class. Keep controls outside the preview and synchronize changes made directly in it. External `examples/attributes.js` modules are maintained by `pnpm examples:sync-structure`; run `pnpm examples:check-structure`, native-markup and description checks. Preserve working author content and validate rendered behavior, not only generated structure.

In reStructuredText, indentation is structural: keep paragraph continuation lines at the same indentation, keep inline literals within their paragraph, and separate directive options from their indented content with a blank line. Validate syntax with the RST parser when changing generated indentation.

Immediately before the language tabs in Examples, provide a native Markdown definition list (rendered as dl/dt/dd), with one entry per selectable example in the same order. Use its exact title as the term and one or two English sentences explaining the actions to try and the result to observe. Maintain the editorial descriptions in scripts/component-example-descriptions.mjs, run pnpm examples:sync-descriptions, then pnpm examples:check-descriptions and pnpm examples:check-labels. Review descriptions against the actual examples; do not invent behavior or describe a static example as interactive.
