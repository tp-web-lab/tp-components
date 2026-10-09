/** Explicit values for attributes not yet exercised by an existing example.
 * Keep values here intentional: never invent a URL or silently use an empty default.
 */
export const attributeValues = {
	silent: true,
	size: "2rem",
	time: "09:30",
	fill: "forwards",
	iterations: "2",
	once: true,
	paused: true,
	"root-margin": "40px",
	threshold: "0.5",
	dir: "rtl",
	lang: "en-GB",
	title: "Important information",
	"padding-inline": "2rem",
	type: "analog",
	align: "center",
	orientation: "horizontal",
	"storage-key": "tp-example-position",
	open: true,
	"copied-text": "Code copied",
	"error-icon": "warning",
	icon: "copy",
	"success-icon": "check-circle-outline",
	gap: "2rem",
	padding: "2rem",
	"data-crossword-silent": "true",
	autocomplete: "off",
	disabled: true,
	name: "answer",
	readonly: true,
	step: "2",
	contained: true,
	placement: "top",
	width: "24rem",
	offset: "16px",
	copy: "unicode",
	"alive-color": "#005a36",
	autoplay: true,
	background: "#f3f4f6",
	"cell-radius": "4",
	"dead-color": "#ffffff",
	"grid-color": "#64748b",
	"grid-stroke-width": "2",
	interval: "800",
	"preset-height": "16",
	"preset-width": "24",
	"preset-x": "4",
	"preset-y": "4",
	steps: "4",
	wrap: true,
	"ports-visible": true,
	"allow-script": true,
	"no-loader": true,
	color: "var(--tp-brand-text-colorful)",
	fallback: "Fallback content",
	"fallback-icon": "help",
	"flip-h": true,
	"flip-v": true,
	library: "tp",
	rotate: "45deg",
	scale: "1.5",
	spin: true,
	controls: true,
	fullscreen: true,
	interaction: true,
	referrerpolicy: "no-referrer",
	sandbox: "allow-scripts",
	"zoom-levels": "75% 100% 150%",
	"allow-scripts": true,
	"allow-styles": true,
	"fetch-mode": "same-origin",
	mode: "html",
	sanitize: true,
	justify: "space-between",
	stretch: true,
	variant: "brand",
	brand: "tp-emerald",
	git: "https://github.com/tp-web-lab/tp-components.git",
	label: "Example documentation",
	langs: "en,fr",
	menu: true,
	theme: "dark",
	colors: "red blue green yellow",
	"label-position": "start",
	placeholder: "Enter a formula",
	preview: true,
	required: true,
	"mismatch-delay": "2500",
	breakout: true,
	fixed: true,
	margin: "2rem",
	value: "1",
	language: "javascript",
	backdrop: true,
	height: "14rem",
	doctest: true,
	"content-width": "60%",
	"right-sidebar": true,
	"scrollback-thumb-color": "#475569",
	scrollbar: true,
	"scrollbar-track-color": "#e2e8f0",
	"slider-height": "12rem",
	axis: "vertical",
	recursive: true,
	"split-after": "1",
	"max-horizontal": "2",
	pitch: "1.3",
	rate: "0.8",
	volume: "0.5",
	"aria-label": "Your answer",
	"icon-library": "tp",
	duration: "10",
	"outside-click": true,
	draggable: true,
	editable: true,
	"download-name": "my-square.svg",
	"replay-label": "Draw again",
	"save-label": "Save this drawing",
};

export const componentAttributeValues = {
	alarm: { size: "2rem" },
	base: {
		"data-tp-help-src": "/src/components/base/base.json",
		"data-tp-markdown-source": "/docs/components/base/index.md",
	},
	clock: { type: "analogic" },
	compare: { orientation: "vertical" },
	drawer: { placement: "start" },
	"game-life": { padding: "16" },
	icon: { fallback: "?", src: "/docs/medias/logos/logo-tp.svg" },
	"icon-picker": { library: "languages" },
	lang: { size: "l" },
	"save-image": { size: "l" },
	"prose-editor": {
		value: "This initial document can be edited.",
		placeholder: "Write a short paragraph",
	},
	"symbol-picker": { copy: "unicode" },
	toolbar: { orientation: "vertical", placement: "end" },
	turtle: { background: "#fff7cc" },
};

/** Objectives supplement the running example, especially for nonvisual attributes. */
export const attributeObjectives = {
	disabled: "Try activating the disabled control: it must remain unavailable.",
	readonly:
		"Inspect the supplied content and try to edit it: changes are prevented.",
	name: "Inspect the declared form field name; it identifies this value in submitted form data.",
	"aria-label":
		"Inspect the control's accessible name with the browser accessibility inspector or a screen reader.",
	src: "Load the supplied external file and compare the result with Basic usage.",
	repository:
		"Load the supplied project directory and inspect its files or pages.",
	value:
		"Observe the initial value supplied by the author, then try the available controls.",
	random:
		"Reload this example to see the choices shuffled while the correct answers remain associated with their items.",
	answer:
		"Submit a response and compare it with the answer declared by the author.",
	required:
		"Leave the field empty and inspect its required state before entering a value.",
	autocomplete:
		"Inspect the input's autocomplete setting; browser suggestions depend on saved user data.",
	"storage-key":
		"Move the divider, then reload this example to check that its position is restored.",
	autoplay:
		"Automatic playback is requested on initialization; browser permissions may require a user gesture first.",
	voice:
		"Select an installed voice using the settings control, then speak the text. Available voices depend on the browser and operating system.",
	pitch: "Press Speak and listen to the higher pitch.",
	rate: "Press Speak and listen to the slower reading rate.",
	volume: "Press Speak and listen at the reduced volume.",
	paused: "The animation starts paused rather than playing immediately.",
	"allow-script":
		"Run the embedded script and observe its result in the rendered document.",
	"no-loader":
		"Render plain HTML without injecting the component loader into the document.",
	doctest:
		"Render a Python doctest block and inspect its prompt and expected result.",
	"data-tp-help-src":
		"Open the component help to inspect the API manifest supplied through this attribute.",
	"data-tp-markdown-source":
		"This URL establishes the base used to resolve relative resources in generated help; it does not load page content.",
	fallback:
		"Observe the fallback when the requested resource cannot be loaded.",
	"fallback-icon":
		"Observe the replacement icon when the requested icon cannot be loaded.",
	"fetch-mode":
		"Inspect the request in the Network panel: this local fragment uses same-origin fetching.",
	referrerpolicy:
		"Inspect the frame request in the Network panel: no referring URL is sent.",
	sandbox:
		"The framed document runs with the explicitly listed sandbox permissions.",
	handle:
		"Drag a task using its handle, rather than starting a drag from its whole surface.",
	"root-margin":
		"Scroll the animated content into view; the observer uses the declared margin around the viewport.",
	threshold:
		"Scroll the animated content into view; the animation starts when the declared fraction is visible.",
	appearance:
		"Compare the accordion's visual presentation with the default style, then expand a section.",
	multiple:
		"Open several accordion sections; opening another section no longer closes the previous one.",
	"open-indexes":
		"Observe which accordion sections are open on initialization, then change the open sections.",
	silent: "Try the game or timer controls with sound disabled.",
	"data-crossword-silent":
		"Solve the crossword with its silent setting enabled through the data attribute.",
	time: "Observe the initial alarm time and adjust it using the alarm controls.",
	size: "Compare the declared control or icon size with Basic usage.",
	duration:
		"Observe the configured duration using the component's playback or timer controls.",
	delay: "Trigger the animation and observe the delay before it starts.",
	easing: "Trigger the animation and observe its timing curve.",
	fill: "Watch the animation finish and inspect the retained final appearance.",
	in: "Trigger the component and observe its entrance animation.",
	out: "Move the pointer away after entering the animated area and observe the exit animation.",
	iterations: "Watch the animation repeat the declared number of times.",
	once: "Scroll the component into view more than once; the entrance animation should only run the first time.",
	target:
		"Observe that the animation applies to the element identified by the target selector.",
	trigger: "Use the declared trigger, such as hover, to start the animation.",
	outlined:
		"Compare the outlined appearance with the default filled presentation.",
	pill: "Observe the fully rounded outline of the component.",
	pulse:
		"Observe the pulsing indicator; reduced-motion preferences remain respected.",
	variant: "Compare the semantic color treatment with Basic usage.",
	dir: "Observe the right-to-left content direction and control layout.",
	lang: "Inspect the language declared for this content, including its pronunciation with assistive technology.",
	puzzle:
		"Solve the grid supplied as newline-separated rows in the puzzle attribute rather than a list. A script assigns the multiline value before connecting the component, since markup declaration options occupy a single line.",
	"data-crossword-puzzle":
		"Solve the crossword supplied through its data attribute, including across and down clues. A script assigns the multiline value before connecting the component.",
	placeholder:
		"Observe the hint displayed while the field or editor is empty, then enter content.",
	"border-radius": "Observe the rounding applied to the box corners.",
	"border-width": "Compare the thickness of the box border with Basic usage.",
	invert: "Compare the inverted foreground and background treatment.",
	padding: "Observe the space between the component edge and its content.",
	download: "Activate the download link and inspect the proposed file name.",
	href: "Activate the link to open its declared destination.",
	loading:
		"Observe the loading presentation while the component is in its loading state.",
	"loading-mode":
		"Compare the loading indicator that replaces the label with the one displayed beside it.",
	rel: "Inspect the link relationship and its protection when opening a new tab.",
	type: "Inspect how the declared type changes this component's native behavior or presentation.",
	attached: "Observe the adjoining button edges within the group.",
	orientation:
		"Compare the declared arrangement of the items with Basic usage.",
	stretch: "Resize the available width and observe how the items fill it.",
	closable: "Dismiss the callout using its close control.",
	heading: "Observe the heading displayed above the component content.",
	title: "Observe the title supplied by the author.",
	icon: "Observe the explicitly selected icon.",
	library: "Inspect the icons available from the selected library.",
	"center-text":
		"Observe the centered alignment of the text within its container.",
	intrinsic:
		"Resize the example and observe the intrinsic-width content remain centered.",
	"max-inline-size":
		"Resize the example and observe the upper limit on its content width.",
	"padding-inline":
		"Observe the extra space at the inline edges of the centered content.",
	align: "Compare the alignment of the items across their shared row.",
	gap: "Observe the spacing between adjacent items.",
	justify:
		"Resize the container and observe how spare space is distributed between items.",
	filename:
		"Inspect the file name displayed or proposed when saving the content.",
	"fold-gutter":
		"Use the fold marker beside the function to collapse and expand its body.",
	language:
		"Inspect the selected language and the editor or notebook controls associated with it.",
	"line-numbers": "Observe the line numbers beside the editable source.",
	toolbar: "Inspect the editor toolbar displayed from initialization.",
	"word-wrap":
		"Narrow the example and observe long source lines wrap within the editor.",
	anchor:
		"Activate the controller and observe that it targets the element identified by the anchor selector.",
	preset:
		"Inspect the preset selected on initialization and try the component's controls.",
	"ui-anchor":
		"Open the controller menu and observe its position relative to the separate UI anchor.",
	"after-label":
		"Inspect the label identifying the after region of the comparison.",
	"before-label":
		"Inspect the label identifying the before region of the comparison.",
	position:
		"Observe the initial divider position, then move it using the pointer or keyboard.",
	open: "Observe the panel already open on initialization, then close it with its controls.",
	"outside-click": "Open the panel, then click outside it to dismiss it.",
	"copied-text": "Copy the source and inspect the accessible success message.",
	"error-icon":
		"Inspect the icon configured for a failed copy; it is only displayed if clipboard access fails.",
	for: "Copy the text from the source element identified by the for attribute.",
	"success-icon": "Copy the source and observe the temporary success icon.",
	"min-height":
		"Resize the example and observe the minimum height retained by the cover.",
	equation: "Solve the declared letter-based equation.",
	solution:
		"Compare the declared numerical solution with the letter-based equation.",
	clearable: "Enter or inspect a value, then remove it with the clear button.",
	label: "Observe the label supplied for the component or its control.",
	"label-position": "Compare the label's placement relative to its field.",
	max: "Try a value beyond the declared maximum and inspect its validity.",
	min: "Try a value below the declared minimum and inspect its validity.",
	step: "Change the value and inspect the step increment or validity constraint.",
	mode: "Inspect the selected interpretation or operating mode.",
	items:
		"Drag the elements matching the items selector; other content is not a draggable item.",
	root: "Move tasks within the root container that scopes the drag-and-drop interaction.",
	backdrop: "Open the panel and observe its backdrop behind the content.",
	contained:
		"Open the drawer and observe its positioning within the containing region.",
	placement: "Observe the side or position selected for the panel or toolbar.",
	width: "Compare the declared width with Basic usage.",
	offset: "Observe the spacing between the floating panel and its anchor.",
	compact: "Compare the compact picker presentation with Basic usage.",
	copy: "Select an item and inspect the chosen clipboard representation.",
	filter:
		"Observe the initial filtered selection, then change the search text.",
	group: "Inspect the selected group of available items.",
	"case-sensitive":
		"Submit an answer with different capitalization and observe the case-sensitive validation.",
	closed:
		"Assign the supplied answers to the blanks by dragging them or using the keyboard.",
	"aspect-ratio":
		"Resize the example and observe the frame preserve its declared aspect ratio.",
	"alive-color": "Inspect the color of live cells in the simulation.",
	background: "Inspect the background behind the drawing or simulation.",
	"cell-radius": "Inspect the rounded corners of the simulation cells.",
	"cell-size": "Inspect the size of the simulation cells.",
	"dead-color": "Inspect the color of unoccupied simulation cells.",
	"grid-color": "Inspect the color of the lines separating simulation cells.",
	"grid-stroke-width": "Inspect the thickness of the simulation grid lines.",
	interval:
		"Start the simulation and observe the interval between generations.",
	"preset-height": "Inspect the number of rows in the preset's grid.",
	"preset-width": "Inspect the number of columns in the preset's grid.",
	"preset-x": "Inspect the horizontal offset of the initial live pattern.",
	"preset-y": "Inspect the vertical offset of the initial live pattern.",
	steps:
		"Observe the initial pattern after the declared number of generations have already been calculated.",
	wrap: "Run the simulation and observe cells crossing the grid boundaries.",
	grid: "Inspect the graph editor's background grid.",
	"grid-size": "Inspect the spacing of the graph editor's grid.",
	message: "Observe the message supplied for the graph editor.",
	"ports-visible": "Inspect the connection ports on graph nodes.",
	"min-width":
		"Resize the container and observe when the grid changes its column count.",
	lite: "Try the simplified controls and compare them with the complete interface.",
	color: "Observe the custom foreground color of the icon.",
	"flip-h": "Observe the icon reflected horizontally.",
	"flip-v": "Observe the icon reflected vertically.",
	rotate: "Observe the rotation applied to the icon.",
	scale: "Observe the scaling applied inside the icon's bounds.",
	spin: "Observe the rotating icon; reduced-motion preferences remain respected.",
	controls: "Use the frame toolbar to change its view.",
	fullscreen:
		"Use the frame's fullscreen control; browser permission and embedding policies still apply.",
	interaction: "Interact with the document inside the frame.",
	srcdoc:
		"Inspect the inline HTML document supplied directly through the attribute.",
	zoom: "Compare the enlarged document with Basic usage.",
	"zoom-levels":
		"Open the frame zoom selector and choose between the declared zoom levels.",
	"allow-scripts":
		"Observe the message updated by the script in the included fragment.",
	"allow-styles":
		"Observe the notice styled by the stylesheet in the included fragment.",
	sanitize:
		"Inspect the included content: text is retained while the inline event handler is removed.",
	langs: "Open the language selector and inspect the available languages.",
	cards: "Inspect the declared number of game cards.",
	brand: "Inspect the documentation shell's declared brand setting.",
	git: "Use the source link to open the documentation repository.",
	menu: "Open the documentation navigation menu and choose a page.",
	theme: "Inspect the documentation shell's declared theme setting.",
	attempts: "Inspect the number of attempts available to solve the game.",
	colors: "Choose from the declared set of game colors.",
	multiline: "Enter content on several lines and observe the expanded field.",
	preview: "Edit the formula and inspect its rendered preview.",
	back: "Inspect the reverse side of the cards before revealing them.",
	"mismatch-delay":
		"Reveal two different cards and observe how long they remain visible before turning back.",
	breakout:
		"Open the modal and inspect its positioning outside its usual containing layout.",
	fixed:
		"Open the modal and observe its viewport-relative positioning while scrolling.",
	margin: "Observe the space reserved around the modal.",
	height: "Compare the declared height with Basic usage.",
	"item-width":
		"Resize the example and inspect the width allocated to each item.",
	"content-width":
		"Resize the example and inspect the width reserved for the main content.",
	"right-sidebar": "Observe the sidebar on the right of the main content.",
	"side-width": "Inspect the width reserved for the sidebar.",
	"scrollback-thumb-color":
		"Scroll the slider and inspect the scrollbar thumb color where supported by the browser.",
	scrollbar:
		"Inspect the visible scrollbar and use it to move through the items.",
	"scrollbar-track-color":
		"Inspect the scrollbar track color where supported by the browser.",
	"slider-height": "Inspect the height reserved for the sliding content.",
	"deck-size": "Inspect the deck configured for the solitaire game.",
	url: "Follow the generated source link to its declared repository.",
	continuous:
		"Start transcription and speak more than one phrase before pressing Stop.",
	"interim-results":
		"Start transcription and observe provisional text before the final transcript is committed.",
	axis: "Move the divider along the configured axis.",
	columns: "Inspect the initial number of spreadsheet columns.",
	rows: "Inspect the initial number of rows in the field or spreadsheet.",
	recursive:
		"Inspect vertical spacing in both the outer stack and its nested content.",
	"split-after":
		"Observe the separation after the declared child in the stack.",
	"max-horizontal":
		"Resize the example and observe the limit on horizontally arranged items.",
	"show-text": "Read the displayed source text and press Speak to hear it.",
	"icon-library":
		"Inspect the field icon loaded from the explicitly selected library.",
	"expand-all": "Inspect the table of contents with all its branches expanded.",
	activation:
		"Focus a tab with arrow keys, then use Enter or Space when manual activation is enabled.",
	selected:
		"Observe the initially selected tab, then choose a different panel.",
	draggable:
		"Drag a tree item to another position and observe the updated hierarchy.",
	editable: "Use the tree's editing controls to rename an item.",
	guides: "Inspect the guide lines connecting tree items.",
	level: "Inspect the initial expansion depth of the tree.",
	selectable: "Select a tree item and observe its selected state.",
	"download-name": "Save the drawing and inspect the proposed file name.",
	"replay-label":
		"Observe the customized replay label, then replay the drawing.",
	"save-label": "Observe the customized save label, then save the drawing.",
};
