# Named public actions audit

Updated: 2026/11/25.

Every button and menu command must have a documented, named method on its owning component. Functional subcomponents own their own controls: a parent does not duplicate the API of its embedded editor, tree, dropdown or fullscreen control.

## Display regression found after the initial audit

The initial audit checked generated metadata but missed a presentation filter in the Component viewer: `api.methods` was filtered to exclude inherited methods. Consequently, LaTeX playground showed no methods and the other playgrounds showed only their own overrides or additions, despite their complete manifests.

The Doc / Methods table now includes every published public method, whether inherited or declared locally, for every component. Twelve regression cases load the actual playground manifests, open the Methods tab and verify every signature and description in the displayed panel. The complete Component viewer suite passes **43 tests**. A Chromium check also opens the visible Methods panel of all twelve playgrounds and confirms their Run, Reset, project and file-action methods. This corrects the initial audit's insufficient verification of the displayed documentation.

## Corrections

| Component family | Public actions added or completed |
| --- | --- |
| All twelve playgrounds, inherited by their programming viewers | `newProject`, `clearProject`, `openSourceFile`, `importProject`, `saveFile`, `saveFileAs`, `exportProject`, `loadExample`, `showLanguageHelp`, `saveInMemory`, `loadFromMemory`, `clearMemory` |
| HTML, JavaScript and TypeScript playgrounds | `setImportmap`; the HTML menu now applies its previously inactive choices |
| Python playground | `setLibraries` |
| AsciiDoc, Markdown and reStructuredText playgrounds | `setExtensions` |
| SQL playground | Existing `resetActiveDatabase` now returns the rerun promise; DB Reset is included in user help |
| Multi-page readers | `scrollToTop`, `toggleSidebarWidth`, `toggleSidebarSearch` |
| Multi-slide readers | `advanceProgress`, `rewindProgress` |
| Markup viewers | `selectOutputMode` |
| Markup converter | `openImport` |
| Notebook | `chooseNotebookFile` |
| Prose editor | `downloadHTML`, `downloadHTMLAs`, `addTableCaption`, `insertPickerText`, `insertInlineIcon`; editing methods respect readonly |
| Tree and file tree | `addLeaf`, `addBranch`, `duplicateNode`, `deleteNode`, `copyPath`; tree edits retain capability checks and request events |
| Color picker | `copyToken`, `scrollToSection` |
| Mathfield | `selectMode`, `toggleModeMenu` |
| Audio playlist | `selectTrack` |
| Graph editor | `selectShapeType`, `selectCommentColor` |
| Analog circuit | `setMeasurementMode` |
| Component viewer | `renderPreview` |
| Question subclasses | `openSolutionPanel`, retaining the disabled-solution guard |

Browser-memory commands now store one project per playground language. Loading a saved project does not execute it. Clearing browser memory retains the current project. File dialogs still require a user gesture where the browser imposes one.

## Repeatable checks

`pnpm api:check-methods` now combines three checks:

- Descriptions of the 2,370 public API signatures in generated manifests, including inherited methods.
- A source inspection of 254 component classes and 93 literal command branches, with explicit explanations for delegated and legacy commands.
- 123 menu bindings in the 12 concrete playgrounds. An unrecognized menu action or missing public method fails the check.

The source inspection covers switch-based command handlers, named public delegates and inheritance. Inline click handlers were also inspected during this review. This is a structural regression check, not proof that every possible dynamically constructed control has been exercised. Runtime tests remain necessary for guards, events, file chooser cancellation and asynchronous completion.

API manifests and TypeDoc were regenerated. The documentation check covers 246 interaction pages, including source-defined button icons and states. The 246 introductions, 1,230 Basic usage examples and 1,230 Javascript API examples remain synchronized.

## Execution evidence and limits

- New playground action and tree-capability tests, with sidebar regression tests: **18 passed**.
- Existing playground specializations and code-editor suite: **61 passed**.
- Targeted prose-editor save, picker, table and file-action tests: **5 passed**.
- A broader jsdom run recorded **162 passing tests**, but did not complete successfully: the prose-editor suite hit an afterEach timeout and its worker eventually exhausted its heap. That run must not be reported as fully passing. The five targeted prose tests passed separately; the full-suite memory failure remains unresolved.
- Final rerun after asynchronous API adjustments: **86 passed** across playground action tests, SQL, the color picker and code editor. These overlap the suites above and are not an additional independent total.
- TypeScript and focused Biome checks passed.

These checks do not rerun native Safari, Firefox or Chrome interaction suites for every button. Prior browser results elsewhere in the audit do not constitute execution coverage for all of the new public methods.
