# Questions

::: tp-callout { variant="info" style="margin-bottom: 2em" }
Question components combine an answer form, submission controls, feedback and a solution in a shared exercise interface.
:::

- [Quizzes](quizzes.md): choices, matching and fill-in-the-blank exercises.
- [Playgrounds](playground-questions.md): exercises using a full project workspace.
- [Viewers](viewer-questions.md): programming and markup exercises using a compact source viewer.

All questions inherit [TpQuestion](question/index.md). Programming questions use [TpPlaygroundQuestion](playground-question/index.md), and markup questions use [TpMarkupViewerQuestion](markup-viewer-question/index.md). These generic bases share submission and feedback handling through TpEditorQuestion; concrete tags select the language and interface.

<!-- family-introduction:end -->
