# TP Components

`tp-components` is an open-source library of **web components** written in standard HTML, designed for creating **technical documents for educational purposes**.

## Features

- **Declarative, framework-independent components.** Compose interfaces with standard HTML and `tp-*` custom elements, configured through attributes, properties, methods and events.
- **Four authoring languages.** Use HTML directly or native component extensions in Markdown, AsciiDoc and reStructuredText through `@tp/tp-markdown`, `@tp/tp-asciidoc` and `@tp/tp-restructuredtext`.
- **A broad component catalog.** More than 140 components cover responsive layouts, forms, overlays, feedback, file handling, pickers, timers and reusable utilities. Explore the [component families](public/docs/components/index.md).
- **Interactive technical content.** Combine code, prose, graph and spreadsheet editors with viewers, playgrounds and notebooks. Supported execution environments include JavaScript, TypeScript, Python, SQL and Prolog.
- **Educational activities.** Build single-choice, multiple-choice and fill-in-the-blank questions with feedback and solutions, including closed exercises with draggable text or graphics. Add puzzles, games and domain-specific simulators.
- **Diagrams and visualizations.** Integrate Mermaid diagrams, turtle graphics, XY plots and timelines into documents and learning activities.
- **Documentation and presentations.** Render single-page or dynamically loaded multi-page documentation, and create slide presentations from the supported markup languages.
- **Shared visual foundations.** Reuse consistent sizes, semantic colors, spacing and focus styles, with light and dark themes based on shared [design tokens](public/docs/appendices/design-tokens/index.md).
- **On-demand loading.** The component loader imports components as they appear in the document, including dynamically inserted content. Content-oriented components can use inline sources or external files where supported.
- **Built-in user help.** Press `Ctrl+?` to open contextual help for the component under the pointer or the focused component, with a live preview and mouse/keyboard interaction tables.
- **Documented and tested behavior.** Component documentation provides live introductions, equivalent examples in all four languages, interactive attribute controls and generated API references. Component-level tests, coverage measurements and axe-core checks across Chromium, Firefox and WebKit support the [quality](public/docs/appendices/component-quality/index.md) and [accessibility](public/docs/appendices/accessibility/index.md) reports; automated checks do not replace manual accessibility review.
- **An extensible library.** Follow the [component creation procedure](public/docs/appendices/component-authoring/index.md) to reuse existing components, shared styles and content-loading mechanisms when adding new functionality.

## Development
This package is developed and managed in a `Node.js` environment with :
- `git` for version control, 
- `pnpm` for packages and scripts, 
- `typescript` for source code,
- `typedoc` for API documentation, 
- `biome` for formatting and static code rules,
- `vite` for development and builds, 
- `vitest` for unit tests and code coverage,
- `playwright` for browser tests across Chromium, Firefox, and WebKit, 
- `axe-core` for automated accessibility checks.

### Build from source

Version **1.0.0-rc.1** is the first public release candidate. See the
[release notes](CHANGELOG.md). The project uses the **EUPL-1.2** license;
see [LICENSE](LICENSE). Third-party assets retain their own notices.

Development requires the sibling `tp-utilities`, `tp-markdown`, `tp-asciidoc`
and `tp-restructuredtext` packages in a pnpm workspace. The exact CI layout and
pinned revisions are documented in [.github/ci/README.md](.github/ci/README.md).
After installing and building the shared dependencies, run in `tp-components`:

```sh
pnpm build
pnpm release:check
pnpm preview
```

For browser use, serve the complete `dist/` directory and load `tp-loader.js`
as a module. It discovers and loads `tp-*` components automatically:

```html
<script type="module" src="./tp-loader.js"></script>
```

The package root points to `dist/tp-lib.js`, with declarations in
`dist/index.d.ts`. The `@tp/tp-components/tp-loader` and
`@tp/tp-components/tp-loader.js` exports point to the same loader. npm publication
is a separate step; this candidate does not imply registry availability.

## Publishing the documentation

The `Documentation Pages` workflow builds and publishes the site at
`https://tp-web-lab.github.io/tp-components/` on pushes to `main`. Manual runs on `main` can publish it too.

Before the first deployment, select **Settings → Pages → Build and deployment →
Source → GitHub Actions** in the repository. The workflow reuses the pinned CI
workspace; shared packages do not need to be published on npm first.

To prepare the same site locally, after building the workspace dependencies:

```sh
pnpm build
node --test scripts/prepare-pages.test.mjs
node scripts/prepare-pages.mjs /tp-components/
```

Upload the contents of `.pages/`, not `public/docs/`. The generated site includes
compiled components, documentation, examples and assets. Preparation rewrites
known local asset URLs for the project subdirectory, maps development `/src/`
URLs to built files and leaves `dist/` untouched for library consumers. Serve
`.pages/` mounted at `/tp-components/` to test it locally; opening HTML through
`file://` does not reproduce HTTP loading. A root-domain deployment can use `/`
as the preparation argument instead (and must update the workflow accordingly).

After publication, the workflow publishes the compiled library (without source
maps) to the `runtime` branch and commits its revision to
`tp-examples/.github/tp-components-revision`. This triggers publication of the
examples home and derivatives course. Never merge runtime or gh-pages into main.

The shared setup uses four repository-specific read-only deploy keys:
`TP_UTILITIES_READ_KEY`, `TP_MARKDOWN_READ_KEY`, `TP_ASCIIDOC_READ_KEY` and
`TP_RESTRUCTUREDTEXT_READ_KEY`. Dependencies stay private and pinned. Fork pull
requests skip jobs that need these credentials. `TP_EXAMPLES_UPDATE_KEY` grants
write access only to tp-examples and is used to update its runtime revision.
GitHub Pages must use GitHub Actions, not the historical gh-pages branch.
