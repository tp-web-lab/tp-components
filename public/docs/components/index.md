# Components

<tp-toc position="end" expand-all open></tp-toc>

Each component in the `tp-components` library is a [custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) that complies with HTML standards.
It is used just like any standard HTML element and inserts its content into the main [%DOM] tree ([lightDOM](/docs/appendices/dom/index.md)).

[%DOM]: **DOM**: **D**ocument **O**bject **M**odel. The DOM represents a document as a logical tree. Each branch of the tree ends in a node, and each node contains objects. The DOM’s methods allow the tree to be accessed programmatically. They enable the structure, style or content of the document to be modified.


The components in the `tp-components` library are grouped by their primary purpose. Every documented component appears once in the tables below.

| Theme | Components | Use it for |
| --- | ---: | --- |
| [Base](#base) | 2 | Shared foundations used to build higher-level components. |
| [Controllers](#controllers) | 5 | Direction, color, language, fullscreen, and theme controls. |
| [Documentations](#documentations) | 10 | Single-page and multi-page documentation renderers. |
| [Editors](#editors) | 6 | Interactive editors for code, prose, graphs, and spreadsheets. |
| [Feedbacks](#feedbacks) | 4 | Status, messages, and runtime feedback. |
| [Files](#files) | 4 | File trees, file systems, includes, and embedded documents. |
| [Forms](#forms) | 13 | Buttons and reusable form controls. |
| [Games](#games) | 10 | Puzzle and game activities. |
| [Layouts](#layouts) | 21 | Page structure, spacing, alignment, and responsive composition. |
| [Markup Languages](#markup-languages) | 3 | Markup-language rendering components. |
| [Notebooks](#notebooks) | 6 | Components in the Notebooks family. |
| [Overlays](#overlays) | 7 | Dialogs, menus, popovers, and floating contextual content. |
| [Pickers](#pickers) | 5 | Visual selection of colors, emoji, formulas, icons, and symbols. |
| [Playgrounds](#playgrounds) | 9 | Interactive execution environments for languages and markup formats. |
| [Plots](#plots) | 5 | Programmatic drawing and mathematical plotting. |
| [Questions](#questions) | 16 | Quizzes and programming exercises using viewers or playgrounds. |
| [References](#references) | 5 | Notes, bibliography, glossary, inline references and generated lists. |
| [Simulators](#simulators) | 8 | Interactive automata, circuits, optics, and query simulations. |
| [Slides](#slides) | 5 | Components in the Slides family. |
| [Time](#time) | 4 | Clocks, alarms, timers, and chronometers. |
| [Utilities](#utilities) | 18 | Reusable interaction and media helpers. |
| [Viewers](#viewers) | 10 | Rendering and inspection of structured content. |
| **Total** | **176** | |
[Classification of the components in `tp-components` by main themes]

## Base

| Component | Description |
| --- | --- |
| <tp-icon name="base" library="components" size="1.25em"></tp-icon> [`<tp-base>`](base/index.md) | Shared base class and custom element foundation for `tp-*` components. |
| <tp-icon name="question" library="components" size="1.25em"></tp-icon> [`<tp-question>`](question/index.md) | Semantic base container shared by interactive question components. |

## Controllers

| Component | Description |
| --- | --- |
| <tp-icon name="color" library="components" size="1.25em"></tp-icon> [`<tp-color>`](color/index.md) | Preset-based color controller. |
| <tp-icon name="dir" library="components" size="1.25em"></tp-icon> [`<tp-dir>`](dir/index.md) | Parent-scoped reading-direction switcher. |
| <tp-icon name="fullscreen" library="components" size="1.25em"></tp-icon> [`<tp-fullscreen>`](fullscreen/index.md) | Fullscreen controller button scoped to its containing component. |
| <tp-icon name="lang" library="components" size="1.25em"></tp-icon> [`<tp-lang>`](lang/index.md) | Documentation language selector. |
| <tp-icon name="theme" library="components" size="1.25em"></tp-icon> [`<tp-theme>`](theme/index.md) | Parent-scoped theme switcher. |

## Documentations

| Component | Description |
| --- | --- |
| <tp-icon name="asciidoc-multi-pages" library="components" size="1.25em"></tp-icon> [`<tp-asciidoc-multi-pages>`](asciidoc-multi-pages/index.md) | Renders a navigable repository with tp-asciidoc. |
| <tp-icon name="asciidoc-single-page" library="components" size="1.25em"></tp-icon> [`<tp-asciidoc-single-page>`](asciidoc-single-page/index.md) | Renders one document with tp-asciidoc. |
| <tp-icon name="html-multi-pages" library="components" size="1.25em"></tp-icon> [`<tp-html-multi-pages>`](html-multi-pages/index.md) | Renders a navigable repository as native browser HTML. |
| <tp-icon name="html-single-page" library="components" size="1.25em"></tp-icon> [`<tp-html-single-page>`](html-single-page/index.md) | Inserts one HTML document using the browser renderer. |
| <tp-icon name="markdown-multi-pages" library="components" size="1.25em"></tp-icon> [`<tp-markdown-multi-pages>`](markdown-multi-pages/index.md) | Renders a navigable repository of Markdown pages. |
| <tp-icon name="markdown-single-page" library="components" size="1.25em"></tp-icon> [`<tp-markdown-single-page>`](markdown-single-page/index.md) | Renders one document with tp-markdown |
| <tp-icon name="markup-multi-pages" library="components" size="1.25em"></tp-icon> [`<tp-markup-multi-pages>`](markup-multi-pages/index.md) | Renders navigable Markdown, AsciiDoc, reStructuredText and HTML pages, inspired by [docsify](https://docsify.js.org/). |
| <tp-icon name="markup-single-page" library="components" size="1.25em"></tp-icon> [`<tp-markup-single-page>`](markup-single-page/index.md) | Renders one Markdown, AsciiDoc, reStructuredText or HTML document. |
| <tp-icon name="restructuredtext-multi-pages" library="components" size="1.25em"></tp-icon> [`<tp-restructuredtext-multi-pages>`](restructuredtext-multi-pages/index.md) | Renders a navigable repository with tp-restructuredtext. |
| <tp-icon name="restructuredtext-single-page" library="components" size="1.25em"></tp-icon> [`<tp-restructuredtext-single-page>`](restructuredtext-single-page/index.md) | Renders one document with tp-restructuredtext. |

## Editors

| Component | Description |
| --- | --- |
| <tp-icon name="code-comment" library="components" size="1.25em"></tp-icon> [`<tp-code-comment>`](code-comment/index.md) | Associates an ordered annotation list with numbered comments in a code editor. |
| <tp-icon name="code-editor" library="components" size="1.25em"></tp-icon> [`<tp-code-editor>`](code-editor/index.md) | [CodeMirror](https://codemirror.net)-based code editor. |
| <tp-icon name="graph-editor" library="components" size="1.25em"></tp-icon> [`<tp-graph-editor>`](graph-editor/index.md) | Edits and animates domain-specific graphs. |
| <tp-icon name="post-it-editor" library="components" size="1.25em"></tp-icon> [`<tp-post-it-editor>`](post-it-editor/index.md) | Create and edits persistent personal annotations attached to document elements. |
| <tp-icon name="prose-editor" library="components" size="1.25em"></tp-icon> [`<tp-prose-editor>`](prose-editor/index.md) | [ProseMirror](https://prosemirror.net)-based rich text editor. |
| <tp-icon name="spreadsheet-editor" library="components" size="1.25em"></tp-icon> [`<tp-spreadsheet-editor>`](spreadsheet-editor/index.md) | Editable spreadsheet with Excel-style formulas powered by [Formula.js](https://formulajs.info). |

## Feedbacks

| Component | Description |
| --- | --- |
| <tp-icon name="badge" library="components" size="1.25em"></tp-icon> [`<tp-badge>`](badge/index.md) | Compact status label. |
| <tp-icon name="callout" library="components" size="1.25em"></tp-icon> [`<tp-callout>`](callout/index.md) | Highlighted contextual content block. |
| <tp-icon name="console" library="components" size="1.25em"></tp-icon> [`<tp-console>`](console/index.md) | Visual console for playground output. |
| <tp-icon name="post-it" library="components" size="1.25em"></tp-icon> [`<tp-post-it>`](post-it/index.md) | Draggable and collapsible post-it. |

## Files

| Component | Description |
| --- | --- |
| <tp-icon name="file-tree" library="components" size="1.25em"></tp-icon> [`<tp-file-tree>`](file-tree/index.md) |  A specialised tree structure for files and folders. |
| <tp-icon name="filesystem" library="components" size="1.25em"></tp-icon> [`<tp-filesystem>`](filesystem/index.md) | In-memory file system with a file tree UI. |
| <tp-icon name="iframe" library="components" size="1.25em"></tp-icon> [`<tp-iframe>`](iframe/index.md) | Controlled iframe component. |
| <tp-icon name="include" library="components" size="1.25em"></tp-icon> [`<tp-include>`](include/index.md) | Loads remote HTML into the light DOM. |

## Forms

| Component | Description |
| --- | --- |
| <tp-icon name="blank" library="components" size="1.25em"></tp-icon> [`<tp-blank>`](blank/index.md) | Displays a text, SVG or image answer in a focusable blank. |
| <tp-icon name="button" library="components" size="1.25em"></tp-icon> [`<tp-button>`](button/index.md) | Action button or navigation link with shared sizes, variants and loading states. |
| <tp-icon name="button-group" library="components" size="1.25em"></tp-icon> [`<tp-button-group>`](button-group/index.md) | TODO |
| <tp-icon name="checkbox-list" library="components" size="1.25em"></tp-icon> [`<tp-checkbox-list>`](checkbox-list/index.md) | Transforms list items into checkbox options. |
| <tp-icon name="datefield" library="components" size="1.25em"></tp-icon> [`<tp-datefield>`](datefield/index.md) | Native date field with labels, constraints, picker access, and clearing. |
| <tp-icon name="fill-blank" library="components" size="1.25em"></tp-icon> [`<tp-fill-blank>`](fill-blank/index.md) | Manages inline fields and rich blanks and exposes their values as `FormData`. |
| <tp-icon name="icon-button" library="components" size="1.25em"></tp-icon> [`<tp-icon-button>`](icon-button/index.md) | Button icon. |
| <tp-icon name="matching" library="components" size="1.25em"></tp-icon> [`<tp-matching>`](matching/index.md) | Associates rich content from two or more optionally titled lists without grading the groups. |
| <tp-icon name="mathfield" library="components" size="1.25em"></tp-icon> [`<tp-mathfield>`](mathfield/index.md) | Mathematical expression field with live LaTeX or AsciiMath rendering. |
| <tp-icon name="numberfield" library="components" size="1.25em"></tp-icon> [`<tp-numberfield>`](numberfield/index.md) | Numeric field with an optional native range slider. |
| <tp-icon name="radio-list" library="components" size="1.25em"></tp-icon> [`<tp-radio-list>`](radio-list/index.md) | Transforms list items into grouped radio options. |
| <tp-icon name="textfield" library="components" size="1.25em"></tp-icon> [`<tp-textfield>`](textfield/index.md) | Single-line and automatically growing multiline text field. |
| <tp-icon name="timefield" library="components" size="1.25em"></tp-icon> [`<tp-timefield>`](timefield/index.md) | Native time field with labels, constraints, picker access, and clearing. |

## Games

| Component | Description |
| --- | --- |
| <tp-icon name="binary" library="components" size="1.25em"></tp-icon> [`<tp-binary>`](binary/index.md) | Interactive Binary puzzle. |
| <tp-icon name="crossword" library="components" size="1.25em"></tp-icon> [`<tp-crossword>`](crossword/index.md) | Interactive crossword puzzle. |
| <tp-icon name="cryptarithm" library="components" size="1.25em"></tp-icon> [`<tp-cryptarithm>`](cryptarithm/index.md) | Interactive cryptarithm puzzle. |
| <tp-icon name="game-life" library="components" size="1.25em"></tp-icon> [`<tp-game-life>`](game-life/index.md) | Interactive Game of Life. |
| <tp-icon name="loto" library="components" size="1.25em"></tp-icon> [`<tp-loto>`](loto/index.md) | Interactive French loto game. |
| <tp-icon name="mastermind" library="components" size="1.25em"></tp-icon> [`<tp-mastermind>`](mastermind/index.md) | Interactive Mastermind game. |
| <tp-icon name="memory" library="components" size="1.25em"></tp-icon> [`<tp-memory>`](memory/index.md) | Interactive Memory matching game. |
| <tp-icon name="solitaire" library="components" size="1.25em"></tp-icon> [`<tp-solitaire>`](solitaire/index.md) | Interactive Klondike solitaire. |
| <tp-icon name="sudoku" library="components" size="1.25em"></tp-icon> [`<tp-sudoku>`](sudoku/index.md) | Interactive Sudoku puzzle. |
| <tp-icon name="yakazu" library="components" size="1.25em"></tp-icon> [`<tp-yakazu>`](yakazu/index.md) | Interactive Yakazu puzzle. |

## Layouts

| Component | Description |
| --- | --- |
| <tp-icon name="accordion" library="components" size="1.25em"></tp-icon> [`<tp-accordion>`](accordion/index.md) | Collapsible multi-panels element. |
| <tp-icon name="box" library="components" size="1.25em"></tp-icon> [`<tp-box>`](box/index.md) | Wrapper with a configurable bordered box. |
| <tp-icon name="card" library="components" size="1.25em"></tp-icon> [`<tp-card>`](card/index.md) | Structured card. |
| <tp-icon name="center" library="components" size="1.25em"></tp-icon> [`<tp-center>`](center/index.md) | Centers content within a configurable maximum inline size. |
| <tp-icon name="cluster" library="components" size="1.25em"></tp-icon> [`<tp-cluster>`](cluster/index.md) | Groups child elements in a configurable flex row. |
| <tp-icon name="cover" library="components" size="1.25em"></tp-icon> [`<tp-cover>`](cover/index.md) | Vertical cover layout with an optional centered heading element. |
| <tp-icon name="flip-card" library="components" size="1.25em"></tp-icon> [`<tp-flip-card>`](flip-card/index.md) | | Control or gesture | Result | |
| <tp-icon name="frame" library="components" size="1.25em"></tp-icon> [`<tp-frame>`](frame/index.md) | Displays content in a fixed-aspect-ratio frame. |
| <tp-icon name="grid" library="components" size="1.25em"></tp-icon> [`<tp-grid>`](grid/index.md) | Auto-fit responsive grid with configurable minimum column width and gap. |
| <tp-icon name="inline" library="components" size="1.25em"></tp-icon> [`<tp-inline>`](inline/index.md) | Inline flex layout component. |
| <tp-icon name="menu" library="components" size="1.25em"></tp-icon> [`<tp-menu>`](menu/index.md) | Turns a nested list into a keyboard-accessible menu. |
| <tp-icon name="sidebar" library="components" size="1.25em"></tp-icon> [`<tp-sidebar>`](sidebar/index.md) | Two-column sidebar and content layout. |
| <tp-icon name="slider" library="components" size="1.25em"></tp-icon> [`<tp-slider>`](slider/index.md) | Horizontally scrollable row with configurable item width, gap, and scrollbar. |
| <tp-icon name="splitter" library="components" size="1.25em"></tp-icon> [`<tp-splitter>`](splitter/index.md) | Splitter layout with two resizable panels. |
| <tp-icon name="stack" library="components" size="1.25em"></tp-icon> [`<tp-stack>`](stack/index.md) | Stacks child elements vertically. |
| <tp-icon name="switcher" library="components" size="1.25em"></tp-icon> [`<tp-switcher>`](switcher/index.md) | Switches between horizontal and vertical layouts based on available space. |
| <tp-icon name="tabs" library="components" size="1.25em"></tp-icon> [`<tp-tabs>`](tabs/index.md) | Tab group. |
| <tp-icon name="timeline" library="components" size="1.25em"></tp-icon> [`<tp-timeline>`](timeline/index.md) | Arranges chronological events on a vertical or horizontal timeline. |
| <tp-icon name="toc" library="components" size="1.25em"></tp-icon> [`<tp-toc>`](toc/index.md) | Table of contents generated from the current page headings. |
| <tp-icon name="toolbar" library="components" size="1.25em"></tp-icon> [`<tp-toolbar>`](toolbar/index.md) | Sticky, zoned toolbar for tp-* components. |
| <tp-icon name="tree" library="components" size="1.25em"></tp-icon> [`<tp-tree>`](tree/index.md) | Interactive hierarchical tree. |

## Markup Languages

| Component | Description |
| --- | --- |
| <tp-icon name="asciidoc" library="components" size="1.25em"></tp-icon> [`<tp-asciidoc>`](asciidoc/index.md) | Semantic AsciiDoc rendering component. |
| <tp-icon name="markdown" library="components" size="1.25em"></tp-icon> [`<tp-markdown>`](markdown/index.md) | Markdown rendering component adapted from [`mardown-it`](https://github.com/markdown-it/markdown-it). |
| <tp-icon name="restructuredtext" library="components" size="1.25em"></tp-icon> [`<tp-restructuredtext>`](restructuredtext/index.md) | reStructuredText rendering component. |

## Notebooks

| Component | Description |
| --- | --- |
| <tp-icon name="javascript-notebook" library="components" size="1.25em"></tp-icon> [`<tp-javascript-notebook>`](javascript-notebook/index.md) | Interactive notebook combining markup and executable Javascript cells. |
| <tp-icon name="notebook" library="components" size="1.25em"></tp-icon> [`<tp-notebook>`](notebook/index.md) | Interactive notebook combining editable markup cells and executable programming-language cells. |
| <tp-icon name="prolog-notebook" library="components" size="1.25em"></tp-icon> [`<tp-prolog-notebook>`](prolog-notebook/index.md) | Interactive notebook combining markup and executable Prolog cells. |
| <tp-icon name="python-notebook" library="components" size="1.25em"></tp-icon> [`<tp-python-notebook>`](python-notebook/index.md) | The custom `<tp-python-notebook>` element implements the Python Notebook functionality: interactive notebook combining markup and executable code cells. |
| <tp-icon name="sql-notebook" library="components" size="1.25em"></tp-icon> [`<tp-sql-notebook>`](sql-notebook/index.md) | Interactive notebook combining markup and executable SQL cells. |
| <tp-icon name="typescript-notebook" library="components" size="1.25em"></tp-icon> [`<tp-typescript-notebook>`](typescript-notebook/index.md) | Interactive notebook combining markup and executable Typescript cells. |

## Overlays

| Component | Description |
| --- | --- |
| <tp-icon name="contextmenu" library="components" size="1.25em"></tp-icon> [`<tp-contextmenu>`](contextmenu/index.md) | Context menu. |
| <tp-icon name="dialog" library="components" size="1.25em"></tp-icon> [`<tp-dialog>`](dialog/index.md) | Confirm/cancel dialog. |
| <tp-icon name="drawer" library="components" size="1.25em"></tp-icon> [`<tp-drawer>`](drawer/index.md) | Sliding drawer panel. |
| <tp-icon name="dropdown" library="components" size="1.25em"></tp-icon> [`<tp-dropdown>`](dropdown/index.md) | Anchored dropdown menu. |
| <tp-icon name="modal" library="components" size="1.25em"></tp-icon> [`<tp-modal>`](modal/index.md) | Modal content above the page. |
| <tp-icon name="popover" library="components" size="1.25em"></tp-icon> [`<tp-popover>`](popover/index.md) | Anchored popover content. |
| <tp-icon name="tooltip" library="components" size="1.25em"></tp-icon> [`<tp-tooltip>`](tooltip/index.md) | Anchored tooltip content. |

## Pickers

| Component | Description |
| --- | --- |
| <tp-icon name="color-picker" library="components" size="1.25em"></tp-icon> [`<tp-color-picker>`](color-picker/index.md) | Viewer for base color tokens. |
| <tp-icon name="emoji-picker" library="components" size="1.25em"></tp-icon> [`<tp-emoji-picker>`](emoji-picker/index.md) | Unicode Emoji 17.0 picker. |
| <tp-icon name="formula-picker" library="components" size="1.25em"></tp-icon> [`<tp-formula-picker>`](formula-picker/index.md) | Excel-compatible function picker. |
| <tp-icon name="icon-picker" library="components" size="1.25em"></tp-icon> [`<tp-icon-picker>`](icon-picker/index.md) | Picker for predefined icons. |
| <tp-icon name="symbol-picker" library="components" size="1.25em"></tp-icon> [`<tp-symbol-picker>`](symbol-picker/index.md) | HTML5 symbol picker. |

## Playgrounds

| Component | Description |
| --- | --- |
| <tp-icon name="asciidoc-playground" library="components" size="1.25em"></tp-icon> [`<tp-asciidoc-playground>`](asciidoc-playground/index.md) | AsciiDoc project playground |
| <tp-icon name="html-playground" library="components" size="1.25em"></tp-icon> [`<tp-html-playground>`](html-playground/index.md) | HTML project playground. |
| <tp-icon name="javascript-playground" library="components" size="1.25em"></tp-icon> [`<tp-javascript-playground>`](javascript-playground/index.md) | JavaScript project playground. |
| <tp-icon name="markdown-playground" library="components" size="1.25em"></tp-icon> [`<tp-markdown-playground>`](markdown-playground/index.md) | Markdown project playground. |
| <tp-icon name="prolog-playground" library="components" size="1.25em"></tp-icon> [`<tp-prolog-playground>`](prolog-playground/index.md) | [Scryer Prolog](https://www.scryer.pl) project playground. |
| <tp-icon name="python-playground" library="components" size="1.25em"></tp-icon> [`<tp-python-playground>`](python-playground/index.md) | Python project playground. |
| <tp-icon name="restructuredtext-playground" library="components" size="1.25em"></tp-icon> [`<tp-restructuredtext-playground>`](restructuredtext-playground/index.md) | reStructuredText project playground. |
| <tp-icon name="sql-playground" library="components" size="1.25em"></tp-icon> [`<tp-sql-playground>`](sql-playground/index.md) | SQL project playground. |
| <tp-icon name="typescript-playground" library="components" size="1.25em"></tp-icon> [`<tp-typescript-playground>`](typescript-playground/index.md) | TypeScript project playground. |

## Plots

| Component | Description |
| --- | --- |
| <tp-icon name="diagram" library="components" size="1.25em"></tp-icon> [`<tp-diagram>`](diagram/index.md) | Accessible diagrams rendered from Mermaid source. |
| <tp-icon name="lsystem" library="components" size="1.25em"></tp-icon> [`<tp-lsystem>`](lsystem/index.md) | L-system fractals. |
| <tp-icon name="map" library="components" size="1.25em"></tp-icon> [`<tp-map>`](map/index.md) | Interactive [Leaflet](https://leafletjs.com)/[OpenStreetMap](https://www.openstreetmap.org/) with named markers and GPX routes or tracks. |
| <tp-icon name="turtle" library="components" size="1.25em"></tp-icon> [`<tp-turtle>`](turtle/index.md) | SVG renderer for the tp turtle drawing language. |
| <tp-icon name="xy-plot" library="components" size="1.25em"></tp-icon> [`<tp-xy-plot>`](xy-plot/index.md) | Interactive SVG plot generated from the tp XY graph language. |

## Questions

| Component | Description |
| --- | --- |
| <tp-icon name="asciidoc-viewer-question" library="components" size="1.25em"></tp-icon> [`<tp-asciidoc-viewer-question>`](asciidoc-viewer-question/index.md) | Checks rendered AsciiDoc using a viewer and external JavaScript DOM tests. |
| <tp-icon name="fill-blank-question" library="components" size="1.25em"></tp-icon> [`<tp-fill-blank-question>`](fill-blank-question/index.md) | Fill-in-the-blank open-ended or closed-ended question. |
| <tp-icon name="html-viewer-question" library="components" size="1.25em"></tp-icon> [`<tp-html-viewer-question>`](html-viewer-question/index.md) | Checks rendered HTML using a viewer and external JavaScript DOM tests. |
| <tp-icon name="javascript-playground-question" library="components" size="1.25em"></tp-icon> [`<tp-javascript-playground-question>`](javascript-playground-question/index.md) | JavaScript project using its playground and external tests. |
| <tp-icon name="javascript-viewer-question" library="components" size="1.25em"></tp-icon> [`<tp-javascript-viewer-question>`](javascript-viewer-question/index.md) | JavaScript exercise using its viewer and external tests. |
| <tp-icon name="markdown-viewer-question" library="components" size="1.25em"></tp-icon> [`<tp-markdown-viewer-question>`](markdown-viewer-question/index.md) | Checks rendered Markdown using a viewer and external JavaScript DOM tests. |
| <tp-icon name="matching-question" library="components" size="1.25em"></tp-icon> [`<tp-matching-question>`](matching-question/index.md) | Checks groups across two or more optionally titled lists. |
| <tp-icon name="multi-choice-question" library="components" size="1.25em"></tp-icon> [`<tp-multi-choice-question>`](multi-choice-question/index.md) | Multiple-choice question with feedback and a solution. |
| <tp-icon name="prolog-playground-question" library="components" size="1.25em"></tp-icon> [`<tp-prolog-playground-question>`](prolog-playground-question/index.md) | Prolog project using its playground and external tests. |
| <tp-icon name="prolog-viewer-question" library="components" size="1.25em"></tp-icon> [`<tp-prolog-viewer-question>`](prolog-viewer-question/index.md) | Prolog exercise using its viewer and external tests. |
| <tp-icon name="python-playground-question" library="components" size="1.25em"></tp-icon> [`<tp-python-playground-question>`](python-playground-question/index.md) | Python project using its playground and external tests. |
| <tp-icon name="python-viewer-question" library="components" size="1.25em"></tp-icon> [`<tp-python-viewer-question>`](python-viewer-question/index.md) | Python exercise using its viewer and external tests. |
| <tp-icon name="restructuredtext-viewer-question" library="components" size="1.25em"></tp-icon> [`<tp-restructuredtext-viewer-question>`](restructuredtext-viewer-question/index.md) | Checks rendered reStructuredText using a viewer and external JavaScript DOM tests. |
| <tp-icon name="single-choice-question" library="components" size="1.25em"></tp-icon> [`<tp-single-choice-question>`](single-choice-question/index.md) | Single-choice question with feedback and a solution. |
| <tp-icon name="typescript-playground-question" library="components" size="1.25em"></tp-icon> [`<tp-typescript-playground-question>`](typescript-playground-question/index.md) | TypeScript project using its playground and external tests. |
| <tp-icon name="typescript-viewer-question" library="components" size="1.25em"></tp-icon> [`<tp-typescript-viewer-question>`](typescript-viewer-question/index.md) | TypeScript exercise using its viewer and external tests. |

## References

| Component | Description |
| --- | --- |
| <tp-icon name="biblio" library="components" size="1.25em"></tp-icon> [`<tp-biblio>`](biblio/index.md) | Defines a hidden bibliography entry for reference tooltips and generated lists. |
| <tp-icon name="glossary" library="components" size="1.25em"></tp-icon> [`<tp-glossary>`](glossary/index.md) | Defines a hidden glossary entry for reference tooltips and generated lists. |
| <tp-icon name="listof" library="components" size="1.25em"></tp-icon> [`<tp-listof>`](listof/index.md) | Builds a list of reference entries or links to labelled document elements. |
| <tp-icon name="note" library="components" size="1.25em"></tp-icon> [`<tp-note>`](note/index.md) | Defines a hidden HTML note for reference tooltips and generated lists. |
| <tp-icon name="ref" library="components" size="1.25em"></tp-icon> [`<tp-ref>`](ref/index.md) | Displays an inline reference with the corresponding HTML content in a tooltip. |

## Simulators

| Component | Description |
| --- | --- |
| <tp-icon name="graph-analog-circuit" library="components" size="1.25em"></tp-icon> [`<tp-graph-analog-circuit>`](graph-analog-circuit/index.md) | Interactive analog-circuit editor and transient simulator. |
| <tp-icon name="graph-dfa" library="components" size="1.25em"></tp-icon> [`<tp-graph-dfa>`](graph-dfa/index.md) | Interactive deterministic finite automata (DFA) simulator. |
| <tp-icon name="graph-geometric-optics" library="components" size="1.25em"></tp-icon> [`<tp-graph-geometric-optics>`](graph-geometric-optics/index.md) | Interactive paraxial geometric-optics bench. |
| <tp-icon name="graph-logical-circuit" library="components" size="1.25em"></tp-icon> [`<tp-graph-logical-circuit>`](graph-logical-circuit/index.md) | Interactive combinational logic circuits simulator. |
| <tp-icon name="graph-nfa" library="components" size="1.25em"></tp-icon> [`<tp-graph-nfa>`](graph-nfa/index.md) | Interactive nondeterministic finite automata (NFA) simulator. |
| <tp-icon name="graph-petri" library="components" size="1.25em"></tp-icon> [`<tp-graph-petri>`](graph-petri/index.md) | Interactive Petri nets simulator. |
| <tp-icon name="graph-query-tree" library="components" size="1.25em"></tp-icon> [`<tp-graph-query-tree>`](graph-query-tree/index.md) | Interactive relational algebra trees simulator. |
| <tp-icon name="graph-sequential-circuit" library="components" size="1.25em"></tp-icon> [`<tp-graph-sequential-circuit>`](graph-sequential-circuit/index.md) | Interactive sequential logic circuits simulator. |

## Slides

| Component | Description |
| --- | --- |
| <tp-icon name="asciidoc-multi-slides" library="components" size="1.25em"></tp-icon> [`<tp-asciidoc-multi-slides>`](asciidoc-multi-slides/index.md) | Navigable repository of AsciiDoc slides. |
| <tp-icon name="html-multi-slides" library="components" size="1.25em"></tp-icon> [`<tp-html-multi-slides>`](html-multi-slides/index.md) | Navigable repository of native HTML slides. |
| <tp-icon name="markdown-multi-slides" library="components" size="1.25em"></tp-icon> [`<tp-markdown-multi-slides>`](markdown-multi-slides/index.md) | Navigable repository of Markdown slides. |
| <tp-icon name="markup-multi-slides" library="components" size="1.25em"></tp-icon> [`<tp-markup-multi-slides>`](markup-multi-slides/index.md) | Multi-format pages as a responsive slide deck. |
| <tp-icon name="restructuredtext-multi-slides" library="components" size="1.25em"></tp-icon> [`<tp-restructuredtext-multi-slides>`](restructuredtext-multi-slides/index.md) | Navigable repository of reStructuredText slides. |

## Time

| Component | Description |
| --- | --- |
| <tp-icon name="alarm" library="components" size="1.25em"></tp-icon> [`<tp-alarm>`](alarm/index.md) | Alarm component with stop control and optional ring. |
| <tp-icon name="chronometer" library="components" size="1.25em"></tp-icon> [`<tp-chronometer>`](chronometer/index.md) | Chronometer component with play, pause and stop controls. |
| <tp-icon name="clock" library="components" size="1.25em"></tp-icon> [`<tp-clock>`](clock/index.md) | The custom `<tp-clock>` Live clock component with digital or analogic display and date tooltip. |
| <tp-icon name="timer" library="components" size="1.25em"></tp-icon> [`<tp-timer>`](timer/index.md) | Countdown timer with stop control and optional ring. |

## Utilities

| Component | Description |
| --- | --- |
| <tp-icon name="animation" library="components" size="1.25em"></tp-icon> [`<tp-animation>`](animation/index.md) | Applies an animation to a target element with [`animate.css`](https://animate.style) for animation names and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Web_Animations_API_Concepts) for playback control. |
| <tp-icon name="avatar" library="components" size="1.25em"></tp-icon> [`<tp-avatar>`](avatar/index.md) | Displays an image, initials or an icon in a circle or square. |
| <tp-icon name="avatar-group" library="components" size="1.25em"></tp-icon> [`<tp-avatar-group>`](avatar-group/index.md) | Groups tp-avatar elements with configurable overlap, stacking order and orientation. |
| <tp-icon name="compare" library="components" size="1.25em"></tp-icon> [`<tp-compare>`](compare/index.md) | Before-and-after images comparison. |
| <tp-icon name="copy-code" library="components" size="1.25em"></tp-icon> [`<tp-copy-code>`](copy-code/index.md) | Copies the textual content of a target component to the clipboard. |
| <tp-icon name="csv-table" library="components" size="1.25em"></tp-icon> [`<tp-csv-table>`](csv-table/index.md) | Creates an HTML table from CSV text or a CSV file. |
| <tp-icon name="divider" library="components" size="1.25em"></tp-icon> [`<tp-divider>`](divider/index.md) | Horizontal or vertical visual separator. |
| <tp-icon name="dragdrop" library="components" size="1.25em"></tp-icon> [`<tp-dragdrop>`](dragdrop/index.md) | Generic drag-and-drop controller. |
| <tp-icon name="icon" library="components" size="1.25em"></tp-icon> [`<tp-icon>`](icon/index.md) | TODO |
| <tp-icon name="list-table" library="components" size="1.25em"></tp-icon> [`<tp-list-table>`](list-table/index.md) | Creates an HTML table from ordered or unordered lists while preserving cell content. |
| <tp-icon name="lorem-ipsum" library="components" size="1.25em"></tp-icon> [`<tp-lorem-ipsum>`](lorem-ipsum/index.md) | Generates placeholder sentences, titles, paragraphs or lists. |
| <tp-icon name="math" library="components" size="1.25em"></tp-icon> [`<tp-math>`](math/index.md) | Renders LaTeX or AsciiMath expressions as inline or display-style SVG with [MathJax](https://www.mathjax.org). |
| <tp-icon name="save-image" library="components" size="1.25em"></tp-icon> [`<tp-save-image>`](save-image/index.md) | Downloads an anchored image as SVG, PNG, or WebP. |
| <tp-icon name="skeleton" library="components" size="1.25em"></tp-icon> [`<tp-skeleton>`](skeleton/index.md) | Renders selected HTML elements as fixed shaded skeleton patterns without executing the source. |
| <tp-icon name="source" library="components" size="1.25em"></tp-icon> [`<tp-source>`](source/index.md) | Source repository link button. |
| <tp-icon name="speech-to-text" library="components" size="1.25em"></tp-icon> [`<tp-speech-to-text>`](speech-to-text/index.md) | Transcribes microphone speech into editable text using the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API). |
| <tp-icon name="text-to-speech" library="components" size="1.25em"></tp-icon> [`<tp-text-to-speech>`](text-to-speech/index.md) | Reads inline or external text aloud with browser speech synthesis. |
| <tp-icon name="typewriting" library="components" size="1.25em"></tp-icon> [`<tp-typewriting>`](typewriting/index.md) | Progressively reveals text one letter or one word at a time. |

## Viewers

| Component | Description |
| --- | --- |
| <tp-icon name="asciidoc-viewer" library="components" size="1.25em"></tp-icon> [`<tp-asciidoc-viewer>`](asciidoc-viewer/index.md) | Interactive AsciiDoc viewer with editable source and parser outputs. |
| <tp-icon name="html-viewer" library="components" size="1.25em"></tp-icon> [`<tp-html-viewer>`](html-viewer/index.md) | Interactive HTML viewer with editable source, live rendering, and DOM inspection. |
| <tp-icon name="javascript-viewer" library="components" size="1.25em"></tp-icon> [`<tp-javascript-viewer>`](javascript-viewer/index.md) | Displays and runs one JavaScript example in a compact interface. |
| <tp-icon name="markdown-viewer" library="components" size="1.25em"></tp-icon> [`<tp-markdown-viewer>`](markdown-viewer/index.md) | Interactive Markdown viewer with editable source and parser outputs. |
| <tp-icon name="object-tree" library="components" size="1.25em"></tp-icon> [`<tp-object-tree>`](object-tree/index.md) | Specialized tree for inspecting JavaScript values. |
| <tp-icon name="prolog-viewer" library="components" size="1.25em"></tp-icon> [`<tp-prolog-viewer>`](prolog-viewer/index.md) | Displays and runs one Prolog example in a compact interface. |
| <tp-icon name="python-viewer" library="components" size="1.25em"></tp-icon> [`<tp-python-viewer>`](python-viewer/index.md) | Displays and runs one Python example in a compact interface. |
| <tp-icon name="restructuredtext-viewer" library="components" size="1.25em"></tp-icon> [`<tp-restructuredtext-viewer>`](restructuredtext-viewer/index.md) | Interactive reStructuredText viewer with editable source and parser outputs. |
| <tp-icon name="sql-viewer" library="components" size="1.25em"></tp-icon> [`<tp-sql-viewer>`](sql-viewer/index.md) | Displays and runs one SQL example in a compact interface. |
| <tp-icon name="typescript-viewer" library="components" size="1.25em"></tp-icon> [`<tp-typescript-viewer>`](typescript-viewer/index.md) | Displays and runs one TypeScript example in a compact interface. |

[`tp-components` component library]
