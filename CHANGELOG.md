# Changelog

## Unreleased

- Preserve virtual `/index.html` and `/index.htm` playground files when preparing
  the documentation for GitHub Pages; DOM and Web Component examples now render.
- Load browser test libraries with CORS enabled so external script errors expose
  their details instead of the generic "Script error." message.

## 1.0.0-rc.1 — 2026-10-09

First public release candidate, consolidating the initial development history.
This is a candidate for validation before the stable 1.0.0 release.

### Component library

- Declarative web components for interactive educational and technical documents.
- Layouts, forms, pickers, overlays, feedback, themes, timers and contextual help.
- Single-page and multi-page documentation, presentations and code examples.
- Native authoring in HTML, Markdown, AsciiDoc and reStructuredText.

### Learning activities and reference content

- Choice, matching and fill-in-the-blank questions with scores and feedback.
- Logic grids, crosswords, cryptarithms and other games.
- Notes, bibliographies, glossaries, references and generated lists.
- A scientific calculator and personal annotations with markup rendering.

### Editors and visualizations

- Spreadsheet import/export, formulas, relative and absolute references.
- XY plots with curves, points, vectors, stepwise animation, zoom and panning.
- Code editors, viewers, playgrounds and notebooks for supported languages.

### Distribution

- A new public Git history starting with one initial commit.
- Correct package entry points and generated TypeScript declarations.
- GitHub Pages preparation and a reproducible CI workspace.
- EUPL-1.2 license text included, matching the existing package license.

### Release status

The candidate is prepared locally. A GitHub release, public documentation and
npm publication are separate deployment steps. This source repository uses a
pnpm workspace and pinned sibling repositories for CI; a standalone install
from a clone is not sufficient. Registry publication also requires the shared
`@tp` dependencies to be available from the registry.
