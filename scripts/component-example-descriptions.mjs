import { attributeObjectives } from "./component-attribute-examples.mjs";
import { exampleRefinements } from "./component-example-refinements.mjs";
import { describeAttributeControl } from "./interactive-attribute-examples.mjs";

/** Editorial objectives for the existing examples; no descriptions are inferred from titles alone. */
const basic = {
 "calculator": "Enter 2+3*4 and evaluate it, then try sin(30) in degree mode. Use the scientific keys to transform a selected expression.",
 "note": "Hover or focus the reference to read its HTML content; inspect the same entry in the generated list.",
 "biblio": "Hover or focus the reference to read its HTML content; inspect the same entry in the generated list.",
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
 "matching-question": "Associate the English expressions with their French translations, then submit to check the score. Try an incorrect response, correct it and compare the feedback; Reset clears and reshuffles the lists.",
 matching: "Associate each English expression with its French translation using Select buttons or drag and drop. Remove or replace a pair and observe its shared pair number.",
 skeleton: "Inspect the fixed shaded patterns generated from the article HTML. Text, images and nested list content are not rendered.",
 "avatar-group": "Compare three overlapping avatars. Later avatars cover earlier ones while names remain in their original reading order.",
 avatar: "Compare an image, initials and a fallback icon, displayed in circular and square avatars.",
	timeline: "Read the three workshop events in order: time appears opposite the title and content, and events without an icon use an empty circle.",
	numberfield:
		"Enter a quantity with the number field and adjust the level with the slider. Try the clear and reset controls.",
	accordion: "Expand and collapse the questions to reveal their answers.",
	alarm: "Set an alarm and try its controls to observe the scheduled alert.",
	animation: "Watch the content fade in when the example loads.",
	badge:
		"Observe the pulsing build status and the outlined Vite version badge, which combines an icon, text and a vertical divider.",
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
	"save-image":
		"Use the save control to export the heart icon in one of the offered image formats.",
	sidebar:
		"Resize the example to observe how the navigation and main content share the available space.",
	"single-choice-question":
		"Choose the capital of France and submit the question to inspect its feedback and solution.",
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
	if (component === "markup-single-page" && label === "Toolbar controls") return "Compare the complete toolbar with a selection of Code, Calculator and Theme. Open a drawer or change the appearance without replacing the document.";
 if (["matching", "matching-question"].includes(component) && label === "Header list") return "Use the first list as English and French column headings. Match the three expressions; headings remain fixed and do not count as answers.";
 if (component === "multi-choice-question" && label === "No correct choices") return "Submit without checking a box to obtain full credit and unlock the solution. Reset, select a distractor and submit again to compare the feedback.";
 if (label === "Inline named field" && /^(text|math|number|date|time)field$/.test(component)) return "Edit the inline field. Its role content supplies the form name, while value supplies the initial data; inspect the source to compare the shared convention across markup languages.";
 if (["ref", "listof"].includes(component) && label === "Notes, bibliography and glossary") return "Compare repeated note citations sharing one superscript number, bibliography citations and dotted glossary terms. Read the numbered notes and alphabetically sorted description lists at the end.";
 if (component === "xy-plot" && label === "Line styles and vectors") return "Compare solid, dashed, dotted and dash-dot curves with their legend samples and a displacement vector. Open Graph settings to edit styles, components or curve intervals.";
 if (component === "logigram" && label !== "Attributes") return label === "Automatic exclusions" ? "Solve the reading club puzzle across three matrices. Observe automatic exclusions and use Undo to reverse a move." : "Match three readers with their books and drinks using the triangular grid, and use Assist… → Show all incorrect boxes to verify the matches.";
 if (component === "xy-plot" && label === "Step-by-step reveal") return "Use Next to reveal a point, a vector and a curve in order. Try Previous, Start and End, and compare the enlarged view; the reference curve stays visible throughout.";
 if (component === "xy-plot" && label === "Vectors only") return "Inspect two successive displacement vectors and their resultant without any function curves. Edit their origins and components in Graph settings.";
 if (component === "xy-plot" && label === "Numeric data (setData)") return "Plot numerical elevation measurements with setData(), a dashed reference line and a labelled marker. Add measurements to update the same graph and its automatic axis ranges, then use Reset to restore the initial data.";
 if (component === "xy-plot" && label === "Author directives") return "Open the built-in Graph settings panel to change the graph kind, axes, grid, sampling, curves and labelled points. Inspect the generated definition or use Reset to restore the starting graph.";
 if (component === "python-playground" && label === "Attributes") return "Choose src file1 or file2, or leave src at Default and choose repository dir1 for addition or dir2 to import geometry.py from main.py; edit the Python files and run them again to update the HTML result. Default restores the greeting in the DOM and console; file-unknown and dir-unknown display loading errors without previous output.";
 if (component === "code-comment" && label === "Attributes") return "Set for to commented-function to connect the list to the visible editor; toggle open to show or hide the list while its tooltips remain available. Clear for or enter an unknown ID to show the warning; Reset defaults restores the defaults.";
 if (component === "text-to-speech" && label === "Read an element") return "Press Speak to read the article referenced by its ID. Its paragraphs and formatting stay unchanged; Pause, Resume and Stop control speech only.";
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
				"Try the two notation modes, multiline editing and formula preview; changes made with the preview button are reflected in the checkbox.",
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
		return `Inspect the ${label.toLowerCase()} rendered from its Mermaid source and compare the source with the resulting visual structure.`;
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
	if (variants[label]) return variants[label];
	if (["Basic usage", "Basic", "Additional usage"].includes(label) && objective)
		return objective;
	throw new Error(`Missing editorial description: ${component} / ${label}`);
}
