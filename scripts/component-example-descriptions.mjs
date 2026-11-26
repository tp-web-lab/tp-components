/** @module scripts/component-example-descriptions */

/**
 * Provides curated English descriptions for component example titles and rejects unknown
 * examples.
 *
 * Import this helper from a Node.js ES module; it is not a standalone command.
 *
 * @example
 * import { describeExample } from "./scripts/component-example-descriptions.mjs";
 * const description = describeExample("button", "Basic usage");
 */

import { componentDocScenarios } from "./component-doc-scenarios.mjs";
import { attributeObjectives } from "./component-attribute-examples.mjs";
import { exampleRefinements } from "./component-example-refinements.mjs";
import { describeAttributeControl } from "./interactive-attribute-examples.mjs";

/** Editorial objectives for the existing examples; no descriptions are inferred from titles alone. */
const basic = {
 "python-tracer": "Load the Students Python program, record execution and navigate its variables and shared object references.",
 "ocaml": "Wait for the OCaml engine to load, then run the prefilled expression.",
 "ocaml-playground": "Run the OCaml project and compare its typed results with the source.",
 "ocaml-viewer": "Run the OCaml project and compare its typed results with the source.",
 "ocaml-notebook": "Run all cells to reuse a function defined in the preceding cell.",
 "ocaml-playground-question": "Edit double, then submit to run the three OCaml assertions.",
 "ocaml-viewer-question": "Edit double, then submit to run the three OCaml assertions.",
 "scheme": "Wait for LIPS to load, then run (square 7) and explore the persistent session.",
 "scheme-playground": "Run the Scheme project, inspect its list output and the updated paragraph.",
 "scheme-viewer": "Run the compact Scheme example and edit its source.",
 "scheme-notebook": "Run all cells in order to evaluate a function defined in an earlier cell.",
 "scheme-playground-question": "Edit double, then submit to run the three external Scheme assertions.",
 "javascript-interpreter-question": "Edit the program and run the query, then submit the current source to the external tests.",
 "ocaml-interpreter-question": "Edit the program and run the query, then submit the current source to the external tests.",
 "prolog-interpreter-question": "Edit the program and run the query, then submit the current source to the external tests.",
 "python-interpreter-question": "Edit the program and run the query, then submit the current source to the external tests.",
 "scheme-interpreter-question": "Edit the program and run the query, then submit the current source to the external tests.",
 "typescript-interpreter-question": "Edit the program and run the query, then submit the current source to the external tests.",
 "scheme-viewer-question": "Open Code, edit double, then submit to run the Scheme assertions.",

 python: "Wait for Python to load, then run square(7), edit its source and explore the persistent session.",
 typescript: "Run square(7), edit its typed source and explore the persistent TypeScript session.",
 javascript: "Run square(7), then change the command and explore the persistent JavaScript session.",
 prolog: "Enter color(X). and use Next solution or ; to enumerate red, green and blue. Assert a new fact and query it again to observe the persistent session.",
 "global-listof": "Open Appendices to browse List of figures, List of tables, List of equations, List of codes, List of theorems, List of definitions, List of notes, Glossary, Bibliography and Index. Follow the entries to both chapters and compare authored and generated anchors while references remain local.",
 equanum: "Hover or focus the equation reference to preview its mathematical expression and compare it with the numbered equation.",
 "diff-code-editor": "Compare two JavaScript versions, edit either side and apply a selected difference in either direction.",
 bibtex: "Load two BibTeX book entries and inspect their readable tp-biblio source code.",
 theorem: "Read a named theorem with an explicit number and a reference target.",
 "markup-converter": "Edit a Markdown document containing a formula and an image in a table, choose Run and compare all five formats.",
 "table-editor": "Edit the workshop schedule, insert a row or column, then export markup, spreadsheet data or an image.",
 wari: "Play an Oware Abapa game from the standard forty-eight-seed position. Sow a highlighted pit, inspect the scores and try the playback controls.",
 checkers: "Explore an international draughts endgame with men and kings. Select a piece to see its legal destinations, then play a complete turn or try random play.",
 chess: "Explore a king-and-pawn ending. Select a white piece to see its legal destinations, then play a move or try Play vs random.",
 puzzle: "Assemble the mountain-lake image from twelve interlocking pieces. Drag a piece, open its rotation menu with a right-click, and use Show image to compare the target.",
 kakuro: "Complete the Wikipedia cross-sum grid with digits from 1 to 9, without repeating a digit within a run. Try Game/Note mode, Check and the reveal actions.",
 "word-cloud": "Compare the tp logo with the ranked word groups inside the circular silhouette. Empty list items create additional size steps between groups.",
 "latex-viewer": "Show the source, edit the section or formula and run it. Switch to Generated HTML to inspect the conversion.",
 "latex-playground": "Edit main.tex, then run the project to update the heading and MathJax formula. Reset restores the original source.",
 latex: "Read a section with an inline MathJax formula.",
 tikz: "Compare the red linear function, blue sine function and orange exponential function on a shared grid with labeled axes.",
 "markup-blog": "Browse pages, combine the category and tag filters, and open an article before returning to the list.",
 "html-blog": "Browse pages, combine the category and tag filters, and open an article before returning to the list.",
 "markdown-blog": "Browse pages, combine the category and tag filters, and open an article before returning to the list.",
 "asciidoc-blog": "Browse pages, combine the category and tag filters, and open an article before returning to the list.",
 "restructuredtext-blog": "Browse pages, combine the category and tag filters, and open an article before returning to the list.",
 screen: "Try the absolute and relative format rows, then use OK to apply a format or Cancel to keep the last choice. Type into the field and reopen the chooser to check that the applied page keeps its state.",
 "slide-note": "Expand Speaker notes, read the transcript and try the inherited speech controls. Collapse the panel while narration continues.",
 "video-player": "Play the three-second moving-shapes clip, pause it and seek with the native video controls.",
 "exercise": "Read the shared museum context, answer both questions and submit each answer to inspect its feedback and solution.",
 "mask": "Read the replacement message hiding the answer field. The target remains in the document with its value preserved.",
 "audio-playlist": "Select a melody, use the native audio controls and advance with Previous or Next. Playback stops at the end of the list.",
 "audio-recorder": "Record a short response, stop, replay it and download the audio. Clear removes the local recording.",
 "slope-simulator": "Adjust the slope, drag either point or use arrow keys, then compare the three cycling profiles.",
 "tangram": "Drag and rotate the seven pieces to cover the silhouette. Try Undo, Redo and Solution to inspect the dissection.",
 "graph-geometry": "Drag A or B and observe the arcs, intersections and perpendicular bisector follow the segment.",
 "calculator": "Enter 2+3*4 and evaluate it, then try sin(30) in degree mode. Use the scientific keys to transform a selected expression.",
 "note": "Hover or focus the reference to read its HTML content; inspect the same entry in the generated list.",
 "biblio": "Hover or focus the reference to read its HTML content; inspect the same entry in the generated list.",
 "index": "Read a visible index reference and mark a second occurrence silently. Follow the generated links and inspect the parent/child terms in the index.",
 "glossary": "Hover or focus the reference to read its HTML content; inspect the same entry in the generated list.",
 "ref": "Hover or focus the reference to reveal a formatted note; press Escape to dismiss it.",
 "listof": "Follow the generated figure links to their captions in the document.",

 "code-comment": "Hover or focus a numbered code marker to read its explanation in a tooltip; press Escape to close it. Edit the code without changing how the original source is copied or saved.",
 "asciidoc-viewer-question": "Submit the initial paragraph to see two failures. Use the source editor to mark Hello with strong emphasis, then submit again to pass both DOM tests.",
 "html-viewer-question": "Submit the initial paragraph to see two failures. Use the source editor to mark Hello with strong emphasis, then submit again to pass both DOM tests.",
 "markdown-viewer-question": "Submit the initial paragraph to see two failures. Use the source editor to mark Hello with strong emphasis, then submit again to pass both DOM tests.",
 "restructuredtext-viewer-question": "Submit the initial paragraph to see two failures. Use the source editor to mark Hello with strong emphasis, then submit again to pass both DOM tests.",
 "javascript-playground-question": "Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.",
 "javascript-viewer-question": "Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.",
 "prolog-playground-question": "Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.",
 "prolog-viewer-question": "Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.",
 "python-playground-question": "Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.",
 "python-viewer-question": "Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.",
 "typescript-playground-question": "Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.",
 "typescript-viewer-question": "Edit double and submit to inspect failing tests, then correct addition to multiplication and submit again. Reset restores the initial code.",
 "post-it-editor": "Open Personal annotations, use + and choose either paragraph inside the box. The for attribute limits the selectable area, while your click chooses the individual target; write and save a note, then reload to restore it.",
 "post-it": "Drag the yellow reminder over the surrounding page using its header, or focus the header and use arrow keys. Click the pin to fold and reopen the note without losing its content.",
 lsystem: "Inspect the Koch curve produced by an internal definition. Reset to the initial segment, then use Step or Play to observe successive rewriting iterations; save the current drawing with Save image.",
 map: "Explore Brest by dragging the map or using its keyboard controls. Select the marker to read its location name; the location button requests permission before using your position.",
 "lorem-ipsum": "Read a generated paragraph with two eight-word sentences. The fixed seed makes the output repeatable in all four markup languages.",
 typewriting: "Watch the sentence appear letter by letter while its bold formatting is preserved. Click or focus the component to show everything immediately.",
 "csv-table": "Read the country and capital data converted from CSV. The first record supplies the column headings.",
 "list-table": "Read the country and capital data converted from nested lists. Each outer item is a row and each inner item is a cell.",
 math: "Read the Pythagorean identity inline with its surrounding sentence. The formula is rendered as SVG, not as editable source text.",
 "matching-question": "Associate the English expressions with their French translations, then submit to check the answer. Try an incorrect response, correct it and compare the feedback; Reset clears and reshuffles the lists.",
 matching: "Associate each English expression with its French translation using Select buttons or drag and drop. Remove or replace a pair and observe its shared pair number.",
 skeleton: "Inspect the fixed shaded patterns generated from the article HTML. Text, images and nested list content are not rendered.",
 "avatar-group": "Compare three overlapping avatars. Later avatars cover earlier ones while names remain in their original reading order.",
 avatar: "Compare an image, initials and a fallback icon, displayed in circular and square avatars.",
	timeline: "Read the three workshop events in order: time appears opposite the title and content, and events without an icon use an empty circle.",
	numberfield:
		"Enter a quantity with the number field and adjust the level with the slider. Try the clear and reset controls.",
	accordion: "Expand and collapse the questions to reveal their answers.",
	alarm: "Set an alarm and try its controls to observe the scheduled alert.",
	animation: "Watch shakeX play three times on load, with 1.2 seconds per cycle. Click the box to replay, or focus it and press Enter or Space.",
	badge:
		"Observe the pulsing badge indicating that the build is ready.",
	base: "Inspect a minimal element using the common component foundation.",
	binary:
		"Complete the binary grid while respecting its row and column constraints.",
	blank:
		"Assign text and image answers to the blanks in a closed question, then clear or replace them.",
	box: "Inspect how the box encloses its content with spacing and a border.",
	button: "Activate the button to follow its documentation link.",
	"button-group": "Use Previous and Next to change the displayed page number.",
	callout: "Inspect the highlighted workshop notice and its heading.",
	card: "Inspect the placement of the card header, main content and footer.",
	center:
		"Resize the available area and observe how the content remains centered.",
	"checkbox-list":
		"Select and clear several web-language choices independently.",
	chronometer: "Use the chronometer controls to measure elapsed time.",
	clock: "Observe the clock display and its updating time.",
	cluster:
		"Resize the example to see how the items share a row and wrap when space runs out.",
	"code-editor": "Edit the sample code and try the editor controls.",
	color: "Choose a brand color and observe the content inside its color scope.",
	"color-picker":
		"Choose a color and inspect the picker’s displayed color values.",
	compare:
		"Move the comparison handle to reveal more of the before or after content.",
	console: "Inspect the sample messages and use Clear to empty the console.",
	contextmenu:
		"Open the context menu from its trigger and select a documentation link.",
	"copy-code":
		"Copy the displayed code and observe the button’s confirmation state.",
	cover:
		"Resize the cover and inspect the centered heading between its introductory and supporting content.",
	crossword: "Use the across and down clues to complete the crossword grid.",
	cryptarithm:
		"Assign digits to letters so that the displayed arithmetic equation is correct.",
	datefield: "Choose or enter a date using the field and its date controls.",
	diagram: "Inspect the diagram rendered from the embedded Mermaid source.",
	dialog: "Open the confirmation dialog and try its available actions.",
	dir: "Switch the reading direction and observe the layout of the example text.",
	divider: "Inspect the horizontal separation between two content groups.",
	dragdrop:
		"Move tasks between To do and Done, including an empty column, by dragging or using the Move buttons.",
	drawer:
		"Open the drawer from its trigger, then close the additional-information panel.",
	dropdown: "Open the dropdown and choose one of its documentation links.",
	"emoji-picker":
		"Browse the emoji choices and select one to try the picker’s output controls.",
	"file-tree":
		"Expand folders and select a file to display its path in the in-memory file tree.",
	filesystem:
		"Expand folders and select a file to display its path in the in-memory file system.",
	"fill-blank":
		"Type a city name into the textfield to complete the sentence, then use its clear button to empty it.",
	"fill-blank-question":
		"Enter the capitals in the open blanks and submit the question to check the answers.",
	"flip-card": "Flip the card to inspect its front and back content.",
	"formula-picker":
		"Browse the formulas and select one using the picker controls.",
	frame: "Inspect how the image fits inside a frame with a fixed aspect ratio.",
	fullscreen:
		"Enter fullscreen for the target box, then leave fullscreen using the control or Escape.",
	"game-life":
		"Run the cellular simulation and observe how the initial pattern evolves.",
	"graph-editor": "Inspect and edit the supplied graph using the editor tools.",
	grid: "Resize the example and observe the arrangement of its three columns.",
	icon: "Inspect the icon loaded from the configured icon library.",
	"icon-button":
		"Activate the heart button and observe the updated like count.",
	"icon-picker":
		"Browse and select icons using the picker and its copy controls.",
	iframe: "Inspect the external page displayed inside the embedded frame.",
	include: "Inspect the content inserted from the external source file.",
	inline: "Inspect the navigation controls and page indicator arranged inline.",
	lang: "Choose English or French and observe the translated message in this isolated example.",
	loto: "Inspect the generated loto ticket and its arrangement of numbers.",
	mastermind:
		"Propose combinations and use the feedback to find the hidden code.",
	mathfield:
		"Edit the expression, open the mathfield mark menu and choose latexmath or asciimath. Observe the active check and open the preview; changing notation preserves the source text.",
	memory: "Reveal cards and find matching pairs, remembering their positions.",
	menu: "Select a documentation entry from the menu.",
	modal:
		"Open the modal from its trigger and close it after inspecting its content.",
	"multi-choice-question":
		"Select the styling languages and submit the question to inspect the feedback and solution.",
	notebook: "Run the notebook cells and inspect their outputs.",
	"object-tree":
		"Expand and collapse the object’s branches to inspect its nested values.",
	popover: "Open the information popover from its trigger, then close it.",
	"prose-editor":
		"Edit the document and use the toolbar to format the selected text.",
	question:
		"Write an answer, submit it and inspect the feedback and solution panels.",
	"radio-list":
		"Choose a theme option and observe that only one choice can be selected.",
	"save-audio": "Play the local sound of breaking glass, then open Save audio and choose MP3 to download it. Only MP3 is shown, matching the recording’s format.",
 "save-image":
		"Use the save control to export the heart icon in one of the offered image formats.",
	sidebar:
		"Resize the example to observe how the navigation and main content share the available space.",
	"single-choice-question":
		"Choose the capital of France and submit the question to inspect its feedback and solution.",
	control: "Change Color or Theme and observe the inline code and background inside the box. Open Controllers to show or hide the available controls; the surrounding page keeps its colors.",
	carousel: "Use Previous image and Next image to browse three illustrations, or focus the image viewport and use the arrow keys.",
	slider: "Scroll horizontally to reveal any of the four content panels that do not fit in the available width.",
	solitaire:
		"Play the card layout using the game’s available moves and controls.",
	source: "Activate the source link to open the configured repository.",
	"speech-to-text":
		"Start recognition, allow microphone access when requested and speak to inspect the transcript in a supported browser.",
	splitter: "Drag the divider to resize the two adjacent panels.",
	"spreadsheet-editor":
		"Edit spreadsheet cells and inspect how the sheet presents the supplied data.",
	stack: "Inspect the vertical spacing between the three publishing steps.",
	sudoku:
		"Fill the Sudoku grid while respecting its row, column and region constraints.",
	switcher:
		"Resize the example to switch the panels between a shared row and a vertical stack.",
	"symbol-picker":
		"Browse the symbols and select one using the picker controls.",
	tabs: "Select the tabs to switch between their content panels.",
	"text-to-speech":
		"Start reading the supplied text aloud and try the playback controls in a browser with speech synthesis.",
	textfield: "Enter and edit text in the field using its available controls.",
	theme:
		"Choose a theme and observe how the content inside its scope changes appearance.",
	timefield: "Enter or choose a time using the field and its time controls.",
	timer: "Use the timer controls and observe the countdown.",
	toc: "Select a heading in the table of contents to jump to its section.",
	toolbar: "Inspect the document toolbar and the placement of its controls.",
	tooltip: "Hover over or focus the trigger to reveal the contextual help.",
	tree: "Expand and collapse the project folders and navigate the tree entries.",
	turtle: "Inspect the drawing produced by the supplied turtle instructions.",
	"xy-plot": "Inspect the plotted data and the chart’s axes.",
	yakazu:
		"Complete the number grid while respecting the constraints of its horizontal and vertical runs.",
};

const variants = {
 "Capturing seeds": "Play South pit 5 to finish in pit 8 and capture five seeds from pits 8 and 7. Previous move restores both the pits and the scores.",
 "Feeding the opponent": "North has no seeds. Only pit 6 can feed North, so pit 1 cannot be played even though it contains a seed.",
 "Void grand slam": "Sow pit 6. The two seeds in pit 7 would be the opponent’s entire supply, so the capture is cancelled and North keeps them.",
 "Majority capture": "Select the man on 32 and capture 27 then 17 by choosing destination 12. The shorter capture from 34 is unavailable because the maximum capture is compulsory.",
 "Flying kings": "Select the king on 32 to compare distant landing squares. Captured pieces block further jumps until the turn ends.",
 "Crowning a man": "Move the white man from 7 to 1 or 2. It becomes a king automatically at the end of the move.",
 "Black to move": "Explore the same pawn ending with Black to move and Black at the bottom. Compare the available king moves with Basic usage.",
 "Pawn promotion": "Move the pawn from a7 to a8 and choose a queen, rook, bishop or knight. Reset position lets you compare promotions.",
 "Rook endgame": "Explore a king-and-rook ending against a lone king. Try Play vs random or Random vs random, then stop or reset the exercise.",
 "Triangular pieces": "Assemble equilateral triangles within their adapted board outline. Try the 60° rotation controls and Show image.",
 "Hexagonal pieces": "Assemble regular hexagons in a honeycomb layout. The thirteen whole pieces preserve the requested count; rotations use 60° steps.",
 "Square pieces": "Assemble nine square tiles that start upright. Compare this straight-edged layout with the interlocking pieces in Basic usage.",
	"Derivatives of tan(x)":
		"Select all correct derivatives of the tangent among five MathJax-rendered LaTeX expressions, then submit to compare the equivalent formulas and the distractors.",
	"Markup languages":
		"Select the three markup languages among six SVG language logos, then submit to distinguish document markup from programming languages.",
	"Derivative of tan(x)":
		"Choose the derivative of the tangent function from four MathJax-rendered LaTeX expressions, then submit the answer to inspect the feedback and solution.",
	"Regular heptagon":
		"Identify the regular heptagon among five SVG polygons with five through nine sides, then submit your choice to check the number of sides.",
	"open-indexes":
		"Observe which accordion panels are initially expanded, then change the open panel.",
	multiple:
		"Open several accordion panels at once and close them independently.",
	"appearance: default":
		"Inspect the default accordion appearance while expanding its panels.",
	"appearance: outlined":
		"Inspect the outlined accordion appearance while expanding its panels.",
	"appearance: filled":
		"Inspect the filled accordion appearance while expanding its panels.",
	Variants: "Compare the semantic colors of the displayed badges.",
	Sizes: "Compare the badge sizes from xxs through xxl.",
	"Outlined and pill":
		"Compare outlined badges, pill shapes and their combination.",
	Pulse: "Observe the pulsing badges used to draw attention to a status.",
	"With icon": "Inspect how an inline icon accompanies the badge text.",
	"Border width attribute":
		"Compare the box border with a customized border thickness.",
	"Border radius attribute": "Inspect the box with customized corner rounding.",
	"Padding attribute":
		"Inspect the spacing around the content with customized padding.",
	"Invert attribute":
		"Compare the box’s inverted theme with the surrounding page.",
	"Attribute variant":
		"Compare the callout colors for the available semantic variants.",
	"Attribute outlined":
		"Compare a callout without a filled background to the default appearance.",
	"Attribute heading": "Inspect the heading added above the callout content.",
	"Attribute icon":
		"Compare callouts with an icon, with and without a heading.",
	"Closable and toast":
		"Dismiss a closable callout and try the temporary toast notification.",
	"Basic card":
		"Inspect the placement of header, main content and footer in the card.",
	"Image card": "Inspect the image and main content inside the card.",
	"Icon card": "Inspect the icon and main content inside the card.",
	"Card with defined dimensions":
		"Inspect how the card content fits inside explicitly defined dimensions.",
	"Intrinsic content":
		"Inspect the centering of content at its intrinsic width.",
	"Centered text":
		"Compare centered text alignment with the centering of its containing region.",
	"Constrained region":
		"Compare the same text in two visibly outlined containers with centered regions limited to 18rem and 36rem. The narrower region wraps onto more lines; resize the preview to see both regions adapt to the available width.",
	"Centered actions": "Inspect the centered row of actions.",
	"Space between":
		"Inspect the items placed at opposite ends of the available row.",
	"Wrapping items":
		"Reduce the available width to see the items wrap onto additional rows.",
	"With initial value": "Edit code initialized through the value attribute.",
	"Using an internal script": "Edit code initialized from an embedded script.",
	"With file upload":
		"Use the file-upload control to load code into the editor.",
	"Local color scope":
		"Change the brand color of the local box without targeting the whole page.",
	"Initial preset":
		"Observe the initial tp-emerald brand-color preset, then choose another color.",
	"Button attributes":
		"Compare how variant, size and disabled settings affect the controller buttons.",
	"Dropdown anchor":
		"Open the menu from its separate anchor and observe that changes still apply to the intended content scope.",
	"Values and tables":
		"Inspect how the console displays structured values and tabular data.",
	"Groups and timers": "Inspect grouped console output and timing information.",
	"Redirect global console":
		"Observe global console messages redirected into the component.",
	Constraints:
		"Try values inside and outside the configured bounds and observe the field’s constraints.",
	"Label positions": "Compare the field label positions.",
	"Right-to-left content":
		"Switch direction and inspect the multilingual right-to-left text.",
	"Auto mode":
		"Observe the controller following the document’s reading direction in automatic mode.",
	Horizontal: "Inspect the horizontal divider between two content groups.",
	Vertical: "Inspect the vertical divider between adjacent content regions.",
	"Custom style": "Inspect a divider with customized visual styling.",
	"Dropdown menu":
		"Open the dropdown to inspect the divider separating menu actions.",
	"Sortable list":
		"Reorder the publishing steps by dragging or using the Up and Down buttons, and observe the insertion indicator.",
	"Tree drag and drop":
		"Move files and folders within the tree and observe the highlighted destination; this example uses tp-dragdrop through tp-tree.",
	"Unicode Emoji 17.0":
		"Browse the Unicode emoji collection exposed by the picker.",
	Group: "Inspect the picker restricted to the configured emoji group.",
	"Compact picker":
		"Compare the compact picker layout and try selecting an entry.",
	"Selected answer with tp-blank":
		"Select the triangle or square, or drag its image onto the blank, then clear it. Observe each tp-fill-blank-change event, including the stored value and the FormData entries.",
	Geography:
		"Complete the three European capitals and submit the open question to check the answers.",
	"Irregular verbs":
		"Enter the past simple forms of the three irregular verbs and submit the answers.",
	"Baltic capitals and flags":
		"Match each Baltic country with its capital and flag using the closed blanks.",
	"Square root":
		"Assign the mathematical expressions to the domain, differentiability domain and derivative blanks, then check the completed sentence.",
	"Basic flip card": "Flip the card between its front and back content.",
	"Button at top start":
		"Use the flip control placed at the top-start corner of the card.",
	"Hearts suit": "Flip each of the thirteen hearts cards in the cluster by clicking it, or using Enter or Space when focused. Each card turns independently and the cluster wraps to fit the available width.",
	"Nested submenus": "Open Components, Layout and Rows to explore three submenu levels with the mouse or arrow keys. Arrow Left returns to the parent menu, and selecting a link opens its documentation page.",
	"Toolbar control":
		"Enter and exit fullscreen from the toolbar while keeping the containing box as the target.",
	"Integrated copy controls":
		"Choose a copy format, customize the icon attributes and inspect the output before copying an icon.",
	"Four loto tickets":
		"Compare four generated loto tickets displayed together.",
	"AsciiMath inline": "Edit an inline expression written in AsciiMath.",
	"Inline in prose":
		"Edit the mathematical field embedded directly in a sentence.",
	"LaTeX display": "Edit a display-style expression written in LaTeX.",
	"AsciiMath display": "Edit a display-style expression written in AsciiMath.",
	"Playing cards with blue back":
		"Find matching playing cards using the blue-backed deck.",
	"Playing cards with red back":
		"Find matching playing cards using the red-backed deck.",
	"Numbers 0 to 9": "Find pairs of matching number cards.",
	"European Union flags": "Find matching pairs of flag images.",
	"Internal script":
		"Expand the object initialized from an embedded JSON script.",
	"External JSON file": "Expand the object loaded from an external JSON file.",
	"JavaScript API":
		"Inspect the object supplied through the component’s JavaScript API.",
	"52 cards with blue back":
		"Play solitaire using the 52-card blue-backed deck.",
	"32 cards with red back": "Play solitaire using the 32-card red-backed deck.",
	French:
		"Speak French and inspect the transcript with French recognition configured.",
	Continuous:
		"Speak several phrases in continuous recognition mode, then stop and inspect the final transcript.",
	"Initial text":
		"Start with a prefilled transcript and try the recognition controls.",
	"Show text": "Read the visible text while listening to its speech synthesis.",
	Lang: "Listen to the text using the explicitly configured language.",
	"English voices":
		"Choose among available English voices and compare their readings of the same text.",
	"French voices":
		"Choose among available French voices and compare their readings of the same text.",
	"Input types": "Compare the behavior of the different textfield input types.",
	"Prefix and clear":
		"Inspect the field prefix and use the clear control to empty its value.",
	Multiline: "Enter text across several lines in the multiline field.",
	Label:
		"Inspect the field’s label and its association with the editable control.",
	"Local theme scope":
		"Change the theme of the local box without targeting the whole page.",
	"Initial mode": "Observe the initial dark theme, then select another mode.",
	"Start position":
		"Use the table of contents positioned at the start of the content.",
	"Brand colors at end":
		"Use the brand-colored table of contents positioned at the end of the content.",
	"Mathematical symbols": "Browse and select mathematical symbols.",
	Arrows: "Browse and select arrow symbols.",
};

const additional = {
	blank:
		"Inspect a standalone empty blank with a custom placeholder. No answer-selection controls are attached in this example.",
	button: "Compare action buttons and a button linking to the API.",
	"button-group":
		"Inspect the grouping of Previous and Next controls without the page-counter behavior of Basic usage.",
	callout: "Inspect a neutral callout when no variant is specified.",
	"icon-button": "Inspect the standalone icon button and its accessible label.",
	console:
		"Inspect the additional console configuration and its output controls.",
	lang: "Inspect the standalone language controller and its available choices.",
	"prose-editor":
		"Inspect the editor example demonstrating initialization from an external HTML file.",
	source:
		"Compare source links for GitHub, GitLab and a generic Git repository.",
};

export function describeExample(component, label) {
 if (label === "Explicit Feedback file") return "Edit the program supplied in an inline script; the Feedback field explicitly names its test file, without src or a test attribute. Submit the initial program, correct double in the editor and submit again to compare failing and passing results.";
 if (component === "sql-playground" && label === "SQL query tests") return "Run tests to compare columns and rows, including empty results, duplicates, multiple statements and an expected error. Change query.sql to reverse the ordering and inspect the mismatch; the delete case shows that each following test starts with a fresh database.";
 if (["Mocha and Chai results", "unittest results"].includes(label)) return "Run tests to compare passing and skipped cases in the common results table, then change double to return its input and inspect the failures. Expand Engine output for messages; the Python example also shows subtests and an expected failure.";
 if (["PlUnit tests", "SRFI-64 tests", "Alcotest tests"].includes(label)) return "Run the native test suite and compare passed and skipped cases in the shared results table. Change double to return x, run tests again and inspect the failure details; expand Engine output for the full log.";
 if (component === "javascript-tracer" && label === "Constant expressions and intermediate values") return "Record execution and use Next to follow the highlighted operations and their Expression value until the result is 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running the program again.";
 if (component === "typescript-tracer" && label === "Constant expressions and intermediate values") return "Record execution and use Next to follow the highlighted operations and their Expression value until the result is 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running the program again.";
 if (component === "scheme-tracer" && label === "Constant expressions and intermediate values") return "Record execution and use Next to follow the highlighted operations and their Expression value until the result is 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running the program again.";
 if (component === "ocaml-tracer" && label === "Constant expressions and intermediate values") return "Record execution and use Next to follow the highlighted operations and their Expression value until the result is 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running the program again. Follow the order reported by the OCaml engine: it differs from the JavaScript and Scheme examples.";
 if (component === "python-tracer" && label === "Constant expressions and intermediate values") return "Record execution and use Next to follow the highlighted operations and their Expression value: 8, 8, 16, 48, 3, 9, then 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running Python again.";
 if(component === "python-tracer" && label === "Inheritance and super") return "Follow StepCounter inheriting from Counter, super().__init__(value) and the overridden increment method calling super().increment(). Inspect self referring to the same instance in both classes; the output is 5, 7, True.";
 if (["javascript-tracer", "typescript-tracer"].includes(component) && label === "Inheritance and super") return "Follow StepCounter extending Counter, the super(value) constructor call and the overridden increment method calling super.increment(). Inspect the same instance through both classes; the output is 5, 7, true.";
 if (component === "scheme-tracer" && label === "Subexpressions on one line") return "Record execution and use Next and Previous to follow the two additions and their multiplication on one line. Setting x to its existing value adds no visible state change: these identical internal snapshots are grouped; the final output is 30, including after saving and reloading the trace.";
 if (["javascript-tracer", "typescript-tracer", "python-tracer", "scheme-tracer", "ocaml-tracer"].includes(component) && label === "Nested calls and a separate query") return "Record execution, then choose Start at query to skip the warmup calculation and reach fact(4), whose result is 24. Use Next to enter a nested call: Step over completes that call without visiting its body, while Step out returns from the active function to its caller. Use Previous to revisit the skipped steps; First also restores access to initialization. All steps remain available after saving and reloading the trace.";
 if (["javascript-tracer", "typescript-tracer", "python-tracer", "scheme-tracer", "ocaml-tracer"].includes(component) && label === "Subexpressions on one line") return "Record execution, then use Next and Previous to follow the two additions and their multiplication on the same source line. The output is 30; consecutive snapshots with unchanged highlighted source and visible state are grouped, including after Save trace and Load trace.";
 if (["javascript-tracer", "typescript-tracer"].includes(component)) { const descriptions={"Basic usage":"Record the nested arrays, follow the two arrows to shared and observe push(5) updating the shared object.","Recursion":"Record factorial(5), inspect the five call frames and follow return values up to 120.","Independent closures":"Follow count in the two captured makeCounter environments. The first counter returns 1 then 2; the second returns 1.","Class and shared instance":"Follow this.value from 3 to 4 and check that counter and alias point to the same instance. The output is 4, 4, true.","Caught exception":"Follow the exception from divide into catch, then continue through finally. The error event uses the danger color and execution continues.","Uncaught exception":"Inspect the TypeError and its call stack. Recording ends at the error; previous steps remain available.","Loop and local variables":"Step through the loop to inspect n and the growing squares array. The final output contains 1, 4, 9 and 16.","Replay a saved trace":"Navigate the nested-arrays recording without executing the program. Save trace and Load trace let you save and reopen the complete JSON recording."}; if(descriptions[label]) return descriptions[label]; }
 if (component === "ocaml-tracer" && label === "Replay a saved trace") return "Browse the saved factorial recording without starting OCaml. Load trace and Save trace let you reopen and save the complete JSON recording.";
 if (component === "ocaml-tracer") { const descriptions={"Basic usage": "Record factorial 5 and follow the call frames and returned values up to 120.", "Subexpressions on one line": "Step through both additions and the multiplication on the same line. The output is 30.", "Shared arrays and references": "Follow mutations through shared references: both aliases point to the same array.", "Closures": "Inspect count captured by the counter and its mutation from 0 to 2.", "Pattern matching": "Follow recursive list matching and inspect the head and tail of each list cell.", "Caught exception": "Inspect the Division_by_zero event and continue through its handler.", "Uncaught exception": "Inspect the failure and its recorded source position; previous steps remain available."}; if(descriptions[label]) return descriptions[label]; }
 if (component === "scheme-tracer") { const descriptions={"Basic usage":"Record factorial(5), inspect its five call frames and follow return values up to 120.","Tail recursion":"Record sum-iter with 50 iterations. The result is 1275, and tail calls replace the active frame instead of growing the call stack.","Independent closures":"Follow the separate count bindings captured by first and second. set! updates their retained environments; the output is 1, 2 and 11.","Shared pairs and mutation":"Compare shared and independent lists. set-car! changes both references to shared, while the separately constructed lists remain unchanged.","Cyclic pair":"Follow the cdr arrow back to the same pair after set-cdr!. set-car! updates that same object through the cycle.","Vectors and aliases":"Inspect the shared vector and its alias. vector-set! changes element 1 to 99 without creating a new vector.","Higher-order procedures":"Step through map callbacks, first with square and then with a lambda capturing factor. The results are (1 4 9 16) and (3 6 9).","Error and call stack":"Pass a number to car. Inspect the error, its source line and the active first-item call; previous steps remain available.","Replay a saved trace":"Replay factorial from JSON without loading LIPS or executing Scheme. Save trace and Load trace save and reopen the complete recording."}; if(descriptions[label]) return descriptions[label]; }
 if (component === "python-tracer" && label === "Nested lists and shared references") return "Record execution and inspect the three arrows from rows: the first and third point to the same shared list. Step through append(5) to see both references reflect the change, while the middle list stays unchanged.";
 if (component === "python-tracer" && label === "Caught exception") return "Record execution, then step through the exception and its handler. Output continues with caught and done.";
 if (component === "python-tracer" && label === "Uncaught exception") return "Record execution and follow the exception from fail to the caller. The final event displays ValueError: test error; earlier steps remain available.";
 if (component === "python-tracer" && label === "Closure with nonlocal") return "Record execution and follow count from 0 to 1 to 2 in the retained make_counter frame. The two calls share the same captured variable and print 1 then 2.";
 if(component === "python-tracer" && label === "Class and shared instance") return "Record Counter, follow value from 3 to 4 and check that counter and alias point to the same instance. The output is 4, 4, True.";
 if(component === "python-tracer" && label === "References between instances") return "Record two linked Node instances. Inspect their next attributes, the two reciprocal arrows and alias pointing to the first node; the output is 2.";

 if (component === "prolog" && label === "Execution trace drawer") return "With tracer enabled, open Trace execution to follow ancestor(ann, Who) in a drawer initially 75% wide. Edit the source or query and reopen it; the independent recording preserves the interpreter session and its pending solutions.";
 if (component === "prolog-tracer") {const descriptions={"Basic usage":"Record ancestor(ann, Who), then follow the three solutions, failed branches and successive clause attempts.","Recursion":"Record factorial(4, F) and follow the recursive goals and returned value 24.","Failure":"Follow both likes goals and see why no shared drink is found.","Cut":"Compare the single red solution with the pruned alternatives after the cut.","Exception":"Follow the arithmetic exception and its propagation through the call frames.","Replay a saved trace":"Explore a saved ancestor recording without starting SWI-Prolog. Save trace and Load trace preserve the complete event stream."};if(descriptions[label])return descriptions[label];}
 if (component === "ocaml" && label === "Execution trace drawer") return "Enable tracer and open Trace execution to record the current program and query in a drawer initially 75% wide. Edit factorial or its argument and reopen the drawer; the recording is independent of the interpreter session.";
 if (["typescript", "scheme"].includes(component) && label === "Execution trace drawer") return "With tracer enabled, open Trace execution to record factorial(5) in a drawer initially 75% wide. Edit the source or query and reopen the trace without changing the interpreter session.";
 if(component === "javascript" && label === "Execution trace drawer") return "Open Trace execution to record factorial(5) and its console output in a drawer initially 75% wide. Edit the source or query and reopen the trace to compare the recursive calls without changing the interpreter session.";
 if(component === "python" && label === "Execution trace drawer") return "Open Trace execution to record factorial(5) in a drawer initially 75% wide. Edit the source or query, reopen the trace and compare the recursive frames; closing the drawer stops recording.";
 if(component === "python-tracer") {
  const descriptions = {"Inline Python":"Record factorial(5) from an inline script and compare the recursive call frames.","Replay a saved trace":"Navigate a saved Students recording without starting Python or fetching its source file.","Save and reload":"Save the full trace under a chosen filename, reload that JSON and navigate to the final output. The trace attribute takes precedence over src."};
  if(descriptions[label]) return descriptions[label];
 }

 if (component === "tooltip" && label === "Links and scrollable content") return "Move from the trigger into the tooltip, scroll the long guide and follow its links. Try keyboard focus and <kbd>Escape</kbd>, then leave both areas to observe the delayed closure.";
 if(component === "global-listof" && label === "Compare merge modes") return "Toggle Merge across pages to compare two chapter panels with one merged bibliography. The shared definition and all four citation links remain available; switching back restores closed panels.";
 if(component === "global-listof" && label === "Bibliography across pages") return "Follow four bibliography links across two chapters. Compare independent entries with the same ref, authored anchors and generated anchors, then read the local bibliography.";
 if(component === "global-listof" && label === "Glossary across pages") return "Open the glossary definitions on each chapter page. The shared Model term retains its page-specific definition; local references and lists expose its content.";
 if(component === "global-listof" && label === "Index across pages") return "Navigate to four definitions in the topics index across two chapters. The other index is excluded, and local occurrence links retain their page scope.";

 if(component === "equanum" && label === "align row previews") return "Compare references to the two rows of a native LaTeX align environment; each tooltip contains only its own equation and number.";
 if(component === "equanum" && label === "alignat row previews") return "Compare two rows with two equation pairs; each preview retains the alignat column-pair count and the referenced row's number.";
 if(component === "equanum" && label === "flalign row previews") return "Compare full-width rows in the document with their compact previews; the source retains flalign while each tooltip uses align.";
 if(component === "equanum" && label === "gather row previews") return "Compare independently centered equations; each reference previews its own row and number.";
 if(component === "equanum" && label === "eqnarray row previews") return "Compare references to the two rows of a native LaTeX eqnarray environment, preserving its three-column alignment in each preview.";
 if(component === "markup-converter" && label === "Native comments comparison") return "Compare native comment syntax across all five languages, including inline comments, multiline text and a commented-out component.";

 if(component === "global-listof" && ["Markdown guide", "AsciiDoc guide", "LaTeX guide", "reStructuredText guide", "Mixed markup guide"].includes(label)) return "Follow figure and note entries across the guide pages, including a figure without an authored ID. Return to Overview to compare targets on other pages.";
 if (component === "theorem" && label === "Rich heading and citation") return "Hover or focus the citation in the proposition title to read its bibliography entry. The numeric label is shared with the generated bibliography.";
 if(component === "bibtex") {
  const descriptions={"BibTeX script":"Convert a BibTeX entry supplied by an inline script, without fetching a file.","LaTeX bibliography":"Load two BibTeX books and inspect their standard thebibliography and bibitem output.","CSL-JSON input":"Convert an inline CSL-JSON record into tp-biblio source.","CSL-JSON to LaTeX":"Load a CSL-JSON file and generate a standard LaTeX bibliography."};
  if(descriptions[label])return descriptions[label];
 }

 if (component === "diff-code-editor" && label === "Read-only files") return "Compare two JavaScript files without editing them; navigate differences and save either source.";
 if (component === "diff-code-editor" && label === "Wrapped Markdown") return "Compare Markdown sources with wrapped lines, heading colors and list markers.";
 if (component === "theorem" && label === "Ending symbols") return "Compare a theorem and a definition with custom ending symbols, a proof with an explicit square and a proof without a symbol.";
 if (component === "theorem" && label === "Background variants") return "Compare the plain default with the six colored panels; switch the viewer between light and dark themes.";
 if (component === "theorem" && label === "Statement types") return "Compare the eight statement types and the proof-ending symbol.";
 if (component === "theorem" && label === "Shared section counters") return "Compare the shared theorem/lemma sequence across two sections.";
 if (component === "include" && label === "Raw HTML") return "Display the original HTML notice without interpreting its tags and compare it with Basic usage.";
 if (component === "include" && label === "Raw AsciiDoc") return "Display the original AsciiDoc notice without conversion and compare it with Converted AsciiDoc.";
 if (component === "include" && label === "Raw LaTeX") return "Display the original LaTeX notice without conversion and compare it with Converted LaTeX.";
 if (component === "include" && label === "Raw reStructuredText") return "Display the original reStructuredText notice without conversion and compare it with Converted reStructuredText.";
 if (component === "include" && label === "Converted AsciiDoc") return "Load an AsciiDoc notice and display its heading, emphasis and list as HTML.";
 if (component === "include" && label === "Converted LaTeX") return "Load a LaTeX notice and display its heading, emphasis and itemize list as HTML.";
 if (component === "include" && label === "Converted reStructuredText") return "Load a reStructuredText notice and display its heading, emphasis and bullet list as HTML.";
 if (component === "include" && label === "Converted Markdown") return "Load a Markdown notice and display its heading, emphasis and list as HTML.";
 if (component === "include" && label === "Raw Markdown") return "Load the same Markdown notice in raw mode to inspect its original syntax without conversion.";
 if (component === "index" && label === "Named indexes and cross-references") return "Compare subject and people indexes, follow occurrence links and use see/see also cross-references within each group.";
 if (component === "markup-converter") {
  const comparisonDescriptions = {
 "LaTeX text environments comparison": "Compare alignment, quotations, verse, verbatim, a minipage, tabbing, a figure and a table; inspect the native LaTeX returned from each format.",
   "Native HTML comparison": "Start with the native HTML test document and compare headings, references, numbered lists, tables, formulas, code and images in all five formats.",
   "Native Markdown comparison": "Start with the native Markdown test document and compare its code and rendering in all five formats.",
   "Native AsciiDoc comparison": "Start with the native AsciiDoc test document and compare its code and rendering in all five formats.",
   "Native reStructuredText comparison": "Start with the native reStructuredText test document and compare its code and rendering in all five formats.",
   "Media and subtitles comparison": "Compare formatting, a quotation, an image, audio and video with subtitle tracks. Both alternative video sources use the same local MP4 clip.",
   "Merged table comparison": "Compare the caption, fixed column widths, merged cells, alignment and formatted cell content.",
   "Math and code comparison": "Compare inline LaTeX and AsciiMath, display math, Python highlighting and preserved code indentation.",
   "LaTeX flexible table comparison": "Compare a tabularray table with a fixed-width column, a flexible column, alignment and a bold heading.",
   "LaTeX table rules comparison": "Compare booktabs top, middle, bottom and partial rules with the other four formats.",
   "LaTeX lists comparison": "Compare custom enumitem labels, nested lists, a starting index and resumed numbering.",
   "LaTeX theorems and references comparison": "Compare a definition, theorem and proof with shared counters, formulas and forward references. The definition uses the plain default appearance; the theorem has a brand background and a custom ◆ ending, while the proof keeps its default □ ending.",
   "LaTeX units comparison": "Compare siunitx quantities, French decimal formatting, units and ranges.",
   "LaTeX image transformations comparison": "Compare graphicx dimensions, aspect ratio, rotation and clipping on the canoe image.",
   "LaTeX array and tabularx comparison": "Compare custom column types, fixed and flexible widths, merged cells and top/middle/bottom alignment. Convert to another language, run it, then return to LaTeX to check that the table layout is preserved.",
   "Index components comparison": "Start with tp-index definitions and visible or silent tp-ref occurrences. Compare the five languages, including native imakeidx commands supplemented by TP commands for interactive labels and descriptions.",
   "LaTeX indexes comparison": "Compare two alphabetical indexes with repeated occurrences, three-level entries, sort keys and see/see also links. Follow the occurrence links, then convert back to LaTeX to recover native makeindex, index and printindex commands.",
   "LaTeX core math environments comparison": "Compare inline math, displaymath with a matrix, numbered eqnarray rows with references and an unnumbered eqnarray*. Switch among the five languages to compare the formulas, display mode and equation numbering.",
   "LaTeX AMS equations comparison": "Compare numbered equations, aligned lines, an unnumbered line, cases and gathered equations. Follow the equation references and convert back to LaTeX to check the formulas and numbering.",
   "LaTeX multilingual quotations comparison": "Compare quotation marks in English, French, German, Spanish, Italian, Portuguese and Dutch, with three nesting levels and a block quotation with bold text. Convert in both directions to check language scopes, punctuation and emphasis.",
   "LaTeX code listings comparison": "Compare an external JavaScript listing with a line range and numbering starting at 20, followed by an indented Python listing."
  };
  if(comparisonDescriptions[label]) return comparisonDescriptions[label];
  if (["HTML source", "AsciiDoc source", "LaTeX source", "Markdown source", "reStructuredText source"].includes(label)) return "Edit the source document, choose Run and compare the formula and image table across the five formats.";
  if (label === "Rich text") return "Convert formatted text, a quotation, a list, an image, a video and an audio player; inspect their code and rendering.";
 }

 if (component === "markup-converter" && label === "External source") return "Load an AsciiDoc file and observe that its source tab is selected initially.";
 if (component === "table-editor" && label === "Rich content") return "Edit bold text, an image, a video and an audio clip in four separate rich cells. Compare Code and Render for each markup export, then inspect the text representations in CSV, JSON and XLSX.";
 if (component === "table-editor" && label === "Typed cells") return "Edit numbers, dates, times and mathematical source with their TP fields. Right-click a cell to change its type or insert a row or column before or after it.";
 if (component === "table-editor" && label === "Empty table") return "Fill the empty four-row, three-column grid, then inspect the generated markup.";
 if (component === "table-editor" && label === "Headerless table") return "Export ordinary data without column headings. Switch to Markdown to observe the empty heading row required by pipe tables.";
 if (component === "table-editor" && label === "Read-only exports") return "Export markup, spreadsheet data or images from a table whose contents cannot be edited interactively.";

 if (label === "Javascript API") return "Create the Basic usage example entirely with JavaScript and explicit component imports. Run the example to obtain the same content and interactions without the autoloader.";
 if (component === "control" && label === "All controllers") return "All seven entries start visible. Uncheck All controllers to hide them, then select individual entries.";
 if (component === "control" && label === "Initially hidden") return "Only the Controllers button is initially visible. Open it and select the controllers you want to display.";
 if (component === "animation" && label === "Attention seekers") return "Click Bounce, Shake and Pulse to compare translation and scale; Pulse repeats three times.";
 if (component === "animation" && label === "Directional entrances") return "Click the boxes to compare slideInLeft with bounceInDown. Each click replays the chosen entrance.";
 if (component === "animation" && label === "Zoom and rotation") return "Compare zoomIn and rotateIn by clicking the boxes; observe scale, rotation and opacity changes.";
 if (component === "animation" && label === "Three-dimensional flip") return "Hover over or focus the box to play flipInY. Leave and return to replay the vertical-axis flip.";
 if (component === "animation" && label === "Entrance and exit") return "Use Enter or Exit, then Pause to freeze the movement and Resume to continue from the same position. Each animation lasts three seconds; Reset restores the original visible box.";
 if (component === "carousel" && label === "Vertical navigation") return "Browse the images vertically using the buttons, a vertical swipe or the Up and Down arrow keys.";
 if (component === "carousel" && label === "Automatic scrolling and hover pause") return "Watch the five TP markup logos travel from left to right every three seconds in a 3em-high carousel, without buttons or a counter. Hover to pause, then move the pointer away to resume from the same position.";
 if (component === "carousel" && label === "Looping navigation") return "Use Next image after the last illustration to return to the first; Previous image also wraps in the other direction.";
 if (component === "latex-playground" && label === "A document in sections") return "Edit the introduction, calculation or conclusion file, then run main.tex to assemble the document with input commands.";
 if (component === "latex-playground" && label === "A document with a TikZ figure") return "Edit the explanation and the separate TikZ figure, then run main.tex to render both in one document.";
 if (label === "Basic usage" && (component === "latex-viewer" || component === "latex-playground")) return basic[component];
  if (component === "tikz" && label === "Metallic discs") return "Inspect three stacked metallic discs built from reusable TikZ pics. Gradients and layered translucent shapes create the reflections and soft ground shadow.";
  if (component === "tikz" && label === "Turtle star") return "Follow five turtle steps and 144-degree turns to draw a blue filled star.";
  if (component === "tikz" && label === "Spy magnification") return "Compare the two magnified circular views of the Koch curve. The green segment connects the named spy nodes.";
  if (component === "tikz" && label === "Lindenmayer tree") return "Inspect the branching pattern generated by four iterations of a Lindenmayer rule. Step lengths and angles include randomized variations.";
  if (component === "tikz" && label === "Text decoration") return "Read the text following the ellipse outline. The text decoration is drawn after the filled shape.";
  if (component === "tikz" && label === "Path intersections") return "Locate the two red intersection markers between the ellipse and the rotated rectangle. Named paths let TikZ calculate their positions.";
  if (component === "tikz" && label === "Orbital animation") return "Watch Earth orbit the Sun and the Moon orbit Earth while the Sun changes color. The orbital periods are 36.5 seconds and 2.8 seconds.";
  if (component === "tikz" && label === "Trie graph") return "Follow the red path through the trie and inspect the shared prefixes. This example loads graphs and arrows.meta and defines the pale yellow background used by edge labels.";
  if (component.endsWith("-blog") && label === "External articles") return "Open A small garden to load its complete article from a separate file relative to the index.";
  const scenario = componentDocScenarios[component]?.find(item => item.label === label);
  if (scenario) return scenario.description;
  if (component === "component-viewer" && label === "Basic usage") return "Inspect the button documentation, then select Demo to change its configuration.";
  if (component === "component-viewer" && label === "Custom content") return "Load an outlined button from an HTML file, then change its variant or size while preserving its label.";
 if (component === 'text-to-speech' && label === 'Automatic pauses') return 'Press Speak to hear configurable punctuation and blank-line pauses without commands in the text. Pause freezes the remaining silence and Stop cancels it.';
 if (component.endsWith('-multi-slides') && label === 'Automatic notes') return 'Press Play to read the speaker notes; each clic trigger reveals a step or opens the next slide. Try Pause, Resume and Stop.';
 if (component.endsWith('-multi-slides') && label === 'Timed steps') return 'Press Play to reveal each progressive step and change slides every five seconds. Pause preserves the remaining interval; manual navigation stops playback.';
 if (component === 'text-to-speech' && label === 'Named triggers') return 'Press Speak and watch the counter change exactly when each named trigger is reached. Pause and Stop prevent queued triggers from firing.';
 if (component === "video-player" && label === "YouTube video") return "Play the author’s French virtual-reality introduction with the YouTube controls. Internet access and an embeddable video are required.";
 if (component === "speech-to-text" && label === "Recording") return "In Safari, select Start, wait for audio capture, then speak and select Stop. Review the transcript and replay the recording. Other browsers show a warning and offer transcription alone.";
 if (component === "exercise" && label === "Nested exercises") return "Answer a standalone question, then expand the nested exercise to read its own context and answer its question. Collapse and reopen either exercise: answers are preserved.";
 if (component === "slide-note" && label === "External notes") return "Expand the notes loaded from a text file and start reading. The standard speech settings and pauses apply to this source too.";
	if (component === "text-to-speech" && label === "Dialogue") return "Read a dialogue using named browser voices and pauses. Unavailable names fall back to the component voice; [voice=default] restores it explicitly.";
 if (component === "text-to-speech" && label === "Pauses") return "Read the illustration prompt and four choices with 800-millisecond line pauses. The introduction uses a longer explicit pause and choice A adds a short inline pause. Try Pause, Resume and Stop during silence.";
 if (component === "exercise" && label === "Timed exercise") return "Select Start to reveal the context and both questions for ten seconds. After expiry, select Continue to recover the answers without restarting the countdown.";
 if (component === "question" && label === "Optional score") return "Type blue and submit to see the numerical grade enabled by score. Remove score in the source and submit again: correction remains available, but the grade is hidden.";
 if (component === "audio-recorder" && label === "Spoken answer") return "In Safari, record the word blue, then stop and review the transcription in the answer field. Other browsers record audio only and show a warning. Submit checks the editable answer as a single blank.";
 if (component === "question" && label === "Timed question") return "Open the question and select Start to reveal its content for ten seconds. The Solution tab stays disabled during the countdown unless automatic grading confirms a correct answer. After expiry, select Continue to recover your answer and access the solution.";
 if (component === "slope-simulator" && label === "Alpe d’Huez 2026") return "Explore an approximate 170.9 km reconstruction through the Croix de Fer, Télégraphe, Galibier and Sarenne passes to Alpe d’Huez. Toggle the grid, compare uphill and downhill effort, and edit the profile JSON.";
 if (component === "slope-simulator" && label === "Tour of Lombardy 2026") return "Explore an approximate 239.6 km reconstruction from the supplied route-profile image. Compare the climbs and descents, reverse direction to change the signed slope, and edit the JSON in Profile code.";
 if (component === "tangram" && label === "Exact orientation") return "Start the first convex figure with all seven pieces already oriented as in the solution. Translate them into place, or select one to try its local rotation and flip controls.";
 if (component === "tangram" && /^Convex \d{2}$/.test(label)) return `Reproduce figure ${label.slice(-2)} from the numbered reference gallery. Use Solution to compare its exact dissection, then move and rotate the seven pieces to cover its convex silhouette.`;
 if (component === "tangram" && label === "Named vertices") return "Open the source to see named corners and midpoint constructions. Show the solution to compare the seven pieces with their declared vertices, then play the puzzle.";
 if (component === "xy-plot" && label === "Shared points and vectors") return "Change a point and press Play to update its vector. Try the axis, grid and sampling assignments; the title, point and vector declarations are also accepted by Geometry.";
 if (["xy-plot", "graph-geometry"].includes(component) && label === "Shared points and vectors") return "Open the source, change point A and press Play. The vector follows its endpoints; the same title, point and vector declarations work in both components.";
 if (component === "xy-plot" && label === "Named curves") return "Compare Cartesian, polar and parametric named curves. Open Code, edit an expression, range or style, then press Play; the interactive settings preserve the named syntax.";
 if (component === "xy-plot" && label === "Basic usage") return "Read the Functions label at the left of the toolbar. Use the bottom-left Code button to edit, load or save the source and try F1, Reset definition and Play.";
 if (component === "graph-geometry" && label === "Measurements") return "Drag A, B or C to update the length and marked angles: the right-angle square becomes an arc with its value when the sides are no longer perpendicular. Change the circle radius in Construction source to update its area. In Move mode, drag the measurement labels apart or select them and use the arrow keys. Use the three standard measurement tools to add distances, perimeters and areas without enabling built-in.";
 if (component === "graph-geometry" && label === "Styles and export") return "Select an object in Move mode and change its stroke style or library color. Reveal the hidden circle from the object list, then use Save image to export the current view as SVG, PNG or WebP.";
 if (component === "graph-geometry" && label === "Ruler primitives") return "Move A or B to compare a free segment with a fixed-length segment, a ray and a vector. The sector and comment follow their supports; use the toolbar to add another construction.";
 if (component === "graph-geometry" && label === "Transform in place") return "Choose Transform the object, select Rotation, then the circle c and centre O. The circle keeps its name and its attached point Q follows; Undo restores the original construction. Switch to Create a copy to compare both modes.";
 if (component === "graph-geometry" && label === "Transformations") return "Move the source triangle points, the centre or the translation vector endpoint and observe the five dependent images. Use the built-in transformation tools to add another image, then edit its color independently.";
 if (component === "graph-geometry" && label === "Polygons") return "Move the defining points to reshape the irregular polygon or resize and rotate the regular pentagon. Use the built-in polygon tools to create more figures, then change their color and export the light fills with their outlines.";
 if (component === "graph-geometry" && label === "Direct constructions") return "Use the extra built-in tools to add midpoints, perpendiculars, parallels, bisectors and tangents. Drag P inside and outside the circle to see its tangents disappear and reappear.";
 if (component === "graph-geometry" && label === "From a file") return "Load a construction from a local text file, then move O or slide P along the circle. The file uses the same commands as the construction editor.";
 if (component === "graph-geometry" && label === "Interactive figure") return "Drag O or slide P around its circle in canvas-only mode. Scroll to pan and use the corner theme switcher to change only this figure.";
 if (component === "graph-geometry" && label === "Basic usage") return basic[component];
 if (component === "graph-geometry" && label === "Attached points") return "Move the centre O and slide P around its circle or Q along its line. The fixed-radius circle and attached points keep their construction relationships.";
 if (component === "graph-geometry" && label === "Arc only") return "Inspect a single visible arc with its circle hidden, then drag the centre to move the arc.";
	if (component === "markup-single-page" && label === "Toolbar controls") return "Compare the complete toolbar with a selection of Code, Calculator and Theme. Open a drawer or change the appearance without replacing the document.";
 if (["matching", "matching-question"].includes(component) && label === "Header list") return "Use the first list as English and French column headings. Match the three expressions; headings remain fixed and do not count as answers.";
 if (component === "multi-choice-question" && label === "No correct choices") return "Submit without checking a box to obtain full credit and unlock the solution. Reset, select a distractor and submit again to compare the feedback.";
 if (label === "Inline named field" && /^(text|math|number|date|time)field$/.test(component)) return "Edit the inline field. Its role content supplies the form name, while value supplies the initial data; inspect the source to compare the shared convention across markup languages.";
 if (["ref", "listof"].includes(component) && label === "Notes, bibliography and glossary") return "Compare repeated note citations sharing one superscript number, bibliography citations and dotted glossary terms. Read the numbered notes and alphabetically sorted description lists at the end.";
 if (component === "xy-plot" && label === "Line styles and vectors") return "Compare solid, dashed, dotted and dash-dot curves with their legend samples and a displacement vector. Use the settings below the graph to edit curve styles, vector endpoints or curve intervals.";
 if (component === "logigram" && label !== "Attributes") return label === "Automatic exclusions" ? "Solve the reading club puzzle across three matrices. Observe automatic exclusions and use Undo to reverse a move." : "Match three readers with their books and drinks using the triangular grid, and use Assist… → Show all incorrect boxes to verify the matches.";
 if (component === "xy-plot" && label === "Step-by-step reveal") return "Use Next to reveal A, both curves f1 and f2 together, B, then vector u. Previous hides an entire step; the counter counts four steps and the reference curve stays visible.";
 if (component === "xy-plot" && label === "Vectors only") return "Inspect two successive displacement vectors and their resultant without any function curves. Edit their endpoint coordinates in the settings below the graph.";
 if (component === "xy-plot" && label === "Numeric data (setData)") return "Plot numerical elevation measurements with setData(), a dashed reference line and a labelled marker. Add measurements to update the same graph and its automatic axis ranges, then use Reset to restore the initial data.";
 if (component === "xy-plot" && label === "Author directives") return "Use the settings below the graph to change the graph kind, axes, grid, curves and points. Use Code at the bottom left to edit the source, load or save a .txt file, toggle the editor toolbar with F1 and apply with Play.";
 if (component === "python-playground" && label === "Attributes") return "Choose src file1 or file2, or leave src at Default and choose repository dir1 for addition or dir2 to import geometry.py from main.py; edit the Python files and run them again to update the HTML result. Default restores the greeting in the DOM and console; file-unknown and dir-unknown display loading errors without previous output.";
 if (component === "code-comment" && label === "Attributes") return "Set for to commented-function to connect the list to the visible editor; toggle open to show or hide the list while its tooltips remain available. Clear for or enter an unknown ID to show the warning; Reset defaults restores the defaults.";
 if (component === "text-to-speech" && label === "Read an element") return "Press Speak to read the article referenced by its ID. Its paragraphs and formatting stay unchanged; Pause, Resume and Stop control speech only.";
 if (component === "typewriting" && label === "Initially hidden tab") return "Open the initially hidden Animated text tab to start the reveal. Switch back to Instructions and reopen it to see the animation restart.";
 if ((component === "typewriting" || component === "text-to-speech") && label === "Synchronized speech") return "Press Speak to reveal the words as the selected voice pronounces them. Try Pause, Resume and Stop; voices without word boundaries leave the full text visible.";
 if (component === "csv-table" && label === "Quoted fields") return "Read semicolon-separated records containing a separator, escaped quotes and a newline inside quoted cells.";
 if (component === "list-table" && label === "Single column") return "Compare a simple ordered list with its one-column table. The first item becomes the heading.";
 if (component === "math" && label === "Script and display style") return "Compare the same fraction in inline and display style, supplied by inert tp/math scripts. Display style enlarges the fraction and places it in a centered block.";
 if (component === "math" && label === "AsciiMath") return "Compare an AsciiMath square-root expression inline and in display style. Both formulas use the same source notation and SVG renderer.";
 if (component === "math" && label === "External expression") return "Read the identity loaded from a reviewed local text file. The file contains only the expression, without math delimiters.";
 if ((component === "matching" || component === "matching-question") && label === "Irregular verbs") return "Associate each base form with its past simple, past participle and French translation across four headed columns. Complete or revise a group one member at a time.";
 if (component === "matching-question" && label === "Rich content") return "Identify the flag, sound and video, associate each with its description and submit your answer. Media controls remain independent of association controls.";
 if (component === "matching-question" && label === "External definition") return "Complete an animal-translation question loaded from a local JSON file. Submit to check the pairs and open the Solution tab to compare your answer.";
 if (component === "matching" && label === "Rich content") return "Associate the flag, sound and video with their descriptions. Use the media controls independently of the Select buttons, then create or remove pairs.";
	if (component === "toolbar" && label === "Attributes")
		return "Choose horizontal with top or bottom, or vertical with start or end, and compare the toolbar around the document area. The example grid places the toolbar at the chosen edge; placement controls its sticky edge.";
	if (component === "switcher" && label === "Attributes")
		return "Drag the splitter divider to narrow or widen the switcher in the left panel, without resizing the browser window. Change the gap and threshold, then try max-horizontal at 3 or 2: it limits items per row above the threshold, while narrower panels use one column.";
	if (component === "stack" && label === "Attributes")
		return "Enable recursive to space the nested lines inside the first box. Set split-after to 1 or 2 to push the following boxes toward the bottom of the fixed-height stack, then clear it to restore normal spacing.";
	if (component === "splitter" && label === "Nested splitters")
		return "Resize the side-by-side panels, then resize the vertically stacked panels inside the right-hand panel. Each divider works independently, with both pointer and keyboard controls.";
	if (component === "slider" && label === "Image gallery")
		return "Browse four captioned illustrations in a width-constrained gallery. Scroll horizontally or focus the slider and use Left/Right Arrow, Home and End to reach the images outside the visible area.";
	if (
		label === "Attributes" &&
		![
			"textfield",
			"mathfield",
			"datefield",
			"timefield",
			"numberfield",
		].includes(component)
	)
		return "Combine all local attribute settings on one preview, starting at the published defaults. Use Reset defaults to restore them and Reload preview to restart initialization. Where present, file-loading controls offer only reviewed local fixtures and a deliberate missing-file case.";
	if (
		["mathfield", "datefield", "timefield", "numberfield"].includes(
			component,
		) &&
		label === "Attributes"
	) {
		const actions = {
			numberfield:
				"Switch between number and range, test numeric bounds and increments, and observe native validation and the synchronized value.",
			mathfield:
				"Try the two notation modes, multiline editing and formula preview. Enable mathlive in LaTeX mode to open the visual editor; its edits update the source.",
			datefield:
				"Test date limits and the step in days using YYYY-MM-DD values; invalid settings leave the last valid value unchanged.",
			timefield:
				"Test time limits and the step in seconds using HH:MM or HH:MM:SS values; invalid settings leave the last valid value unchanged.",
		};
		return `Combine all attribute settings on one preview, initialized at the documented defaults, then use Reset defaults to restore them. ${actions[component]}`;
	}
	if (
		["radio-list", "checkbox-list"].includes(component) &&
		label === "Attribute: label"
	)
		return "Edit or clear the group label using the textfield. The visible and accessible group name updates without replacing the choices or changing the selection.";
	if (component === "textfield" && label === "Attributes")
		return "Combine boolean, enumerated and text settings on one preview, starting from the documented defaults. Inspect the native accessible name and autocomplete hint, try editing the preview, and restore the defaults with Reset defaults.";
	if (component === "textfield" && label === "Attribute: aria-label")
		return "Edit the accessible name and inspect the value read back from the native input. Clear it to see the warning about a missing accessible name.";
	if (component === "textfield" && label === "Attribute: autocomplete")
		return "Choose email, on or off and inspect the hint received by the native email input. Try browser suggestions if saved autofill data is available; suggestions are not generated by the component.";
	if (component === "box" && label === "Attribute: invert")
		return "Toggle the checkbox to switch the same box between normal and inverted colors. Unchecking removes the boolean attribute.";
	if (
		component === "box" &&
		[
			"Attribute: border-radius",
			"Attribute: border-width",
			"Attribute: padding",
		].includes(label)
	)
		return `Edit ${label.slice("Attribute: ".length)} in the textfield to update the box immediately. Clear it to restore the default; invalid CSS values leave the last valid setting unchanged.`;
	if (component === "accordion" && label === "Attribute: multiple")
		return "Toggle the checkbox to allow or prevent several panels from remaining open, then try opening two panels. The boolean attribute is added when checked and removed when unchecked.";
	if (component === "accordion" && label === "Attribute: open-indexes")
		return "Select the panels to open using the checkbox list, including none or all three. The checkboxes also follow direct panel interactions; their labels show the zero-based accordion indexes.";
	if (component === "accordion" && label === "Attribute: appearance")
		return "Choose default, outlined or filled in the radio list to change the appearance of the same accordion. Expand and collapse its panels to inspect the selected style.";
	if (component === "flip-card" && label === "Attribute: fit-content")
		return "Toggle the checkbox to compare the default card size with the dimensions determined by its verso logo. Flip the card to inspect that content.";
	if (component === "flip-card" && label === "Attribute: flipped")
		return "Toggle the checkbox to show the recto or verso. It also stays synchronized when you use the card's flip button.";
	if (component === "flip-card" && label === "Attribute: button-position")
		return "Use the radio list to choose any of the six button positions or none. With none, flip the card itself using the pointer or keyboard.";
	if (component === "flip-card" && label === "Attribute: disabled")
		return "Toggle the checkbox to disable or enable flipping, then try the card's flip button. The settings checkbox remains available outside the card.";
	const refinement = exampleRefinements[component]?.find(
		(example) => example.label === label,
	);
	if (refinement) return refinement.description;
	if (label.startsWith("Attribute: ")) {
		const attribute = label.slice("Attribute: ".length);
		const controlDescription = describeAttributeControl(component, attribute);
		if (controlDescription) return controlDescription;
		if (component === "question" && attribute === "src")
			return "Inspect the src contract inherited by specialized questions. The base class declares the URL but leaves loading and interpretation to subclasses; its inline form remains displayed here.";
		if (component === "button" && attribute === "target")
			return "Activate the link to open its destination in a new browser tab.";
		if (component === "iframe" && attribute === "loading")
			return "Inspect the frame's eager or lazy loading policy in the Network panel; lazy loading depends on proximity to the viewport.";
		if (component === "include" && attribute === "loading")
			return "Observe the placeholder displayed while the external fragment is loading; it may be brief when the resource is cached.";
		return (
			attributeObjectives[attribute] ??
			`Focus on the ${attribute} attribute in this example. Compare its declared setting and the resulting component with Basic usage.`
		);
	}
	const language = component.split("-")[0];
	if (label === "Single source file")
		return `Load the standalone ${language} file through src and inspect its output. Open the source editor to inspect the file used as the generated project's entry point.`;
	let objective = basic[component];
	if (component.startsWith("graph-") && component !== "graph-editor") {
		const subjects = {
			"analog-circuit": "analog circuit",
			dfa: "deterministic finite automaton",
			nfa: "nondeterministic finite automaton",
			"geometric-optics": "optical system",
			"logical-circuit": "logic circuit",
			petri: "Petri net",
			"query-tree": "query tree",
			"sequential-circuit": "sequential logic circuit",
		};
		objective = `Inspect the supplied ${subjects[component.slice(6)]} and try the simulator’s available controls.`;
	}
	if (["markdown", "asciidoc", "restructuredtext"].includes(component)) {
		objective = `Inspect how the embedded ${component} source is rendered as a formatted document.`;
		if (label === "Additional usage")
			return `Inspect the basic document supplied through the ${component} source example.`;
		if (label === "Advanced example")
			return `Inspect the richer document supplied through the advanced ${component} source example.`;
	}
	if (component.endsWith("-viewer")) {
		objective = `Inspect the rendered output of the supplied ${language} example and open the source panel to compare it with the code.`;
		if (label === "Multiple examples")
			return "Switch between the named examples and compare their source and rendered output.";
		if (label === "Lite")
			return "Inspect the reduced viewer interface and its rendered content.";
		if (label === "error")
			return "Run the intentionally failing example and inspect the reported error.";
		if (label === "matplotlib")
			return "Run the Python example and inspect the plot produced by Matplotlib.";
		if (label === "repository")
			return "Load the repository-backed example and inspect its files and rendered output.";
		if (label === "src")
			return "Inspect the output produced by loading the external source file.";
		if (label.startsWith("script"))
			return label.includes("filename") && !label.includes("without")
				? "Inspect the output produced from embedded scripts with explicit filenames."
				: "Inspect the output produced from the embedded source script.";
	}
	if (component.endsWith("-notebook"))
		objective = `Run the ${language} notebook cells and inspect their outputs.`;
	if (component.endsWith("-playground"))
		objective = `Edit and run the supplied ${language} example, then compare the source with its output.`;
	if (component.endsWith("-multi-pages"))
		objective = `Navigate between the ${language} documentation pages and observe dynamic page loading inside the isolated example.`;
	if (component.endsWith("-single-page"))
		objective = `Read the rendered ${language} document. The toolbar is hidden unless explicitly enabled.`;
	if (component.endsWith("-multi-slides"))
		objective = `Move between the slides rendered from the ${language} source.`;
	if (component === "diagram" && label !== "Basic usage")
		return `Compare the ${label.toLowerCase()} rendered from the same source: Mermaid first, then Pele (engine="pele").`;
	if (label === "Explicit target")
		return `Use the ${component} controller and observe that it affects the explicitly targeted content.`;
	if (label === "Change event")
		return `Change the ${component} setting and inspect the emitted tp-${component}-change event.`;
	if (component === "text-to-speech" && label === "Lite")
		return "Start and stop speech with the single icon button of the lite interface.";
	if (/⭐/.test(label))
		return `Try the ${component} puzzle at the difficulty indicated by the stars and use its feedback to refine your answers.`;
	if (component === "cryptarithm" && label !== "Basic usage")
		return `Assign digits to letters to solve the equation ${label}.`;
	if (label === "Additional usage" && additional[component])
		return additional[component];
	if (component === "badge" && label === "With icon") return "Inspect the outlined Vite version badge, which combines an icon, text and a vertical divider.";
	if (variants[label]) return variants[label];
	if (["Basic usage", "Basic", "Additional usage"].includes(label) && objective)
		return objective;
	if (component.endsWith("-interpreter-question") && label === "Passing solution") return "Run the query with the completed function, then submit to observe passing tests. Modify the source and submit again to compare results.";
	throw new Error(`Missing editorial description: ${component} / ${label}`);
}
