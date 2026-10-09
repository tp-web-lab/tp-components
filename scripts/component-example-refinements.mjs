/** Curated replacements for redundant examples, with observable author-facing behavior. */
export const exampleRefinements = {
 "post-it": [{
  label: "Lite note",
  description: "Drag the double-size pushpin or move it with arrow keys without opening the note. Click it or press Enter or Space to open the reminder and reveal its header and reset controls, then fold it again without deleting its content.",
  source: '<tp-post-it heading="Reminder" lite><p>Keep examples <strong>simple and meaningful</strong>.</p></tp-post-it>',
 }, {
  label: "Notes board",
  description: "Move three independently floating notes using their headers and compare their colors and rotations. The third contains a text field whose value remains intact while moving or folding the note.",
  source: '<tp-cluster gap="2rem" style="padding: 1rem"><tp-post-it heading="Plan" color="yellow" rotation="-2"><p>Write one useful example.</p></tp-post-it><tp-post-it heading="Review" color="blue" rotation="2"><p>Check the result with the keyboard.</p></tp-post-it><tp-post-it heading="Your reminder" color="pink"><tp-textfield label="Reminder" placeholder="What comes next?" clearable></tp-textfield></tp-post-it></tp-cluster>',
 }],
 lsystem: [{
  label: "Branching tree",
  description: "Load a branching tree from a local definition file. Reset, then play its four iterations to observe how saved turtle positions create branches.",
  source: '<tp-lsystem src="/docs/components/lsystem/examples/tree.lsys" label="Branching tree"></tp-lsystem>',
 }, {
  label: "Preset gallery",
  description: "Compare a fern, a dragon curve and a Sierpinski triangle. Each drawing has independent playback controls and can be exported separately.",
  source: '<tp-grid min-width="16rem"><tp-lsystem preset="barnsley-fern" label="Barnsley fern"></tp-lsystem><tp-lsystem preset="dragon-curve" label="Dragon curve"></tp-lsystem><tp-lsystem preset="sierpinski-triangle" label="Sierpinski triangle"></tp-lsystem></tp-grid>',
 }],
 map: [{
  label: "Multiple markers",
  description: "Explore Brest and Rennes on a map fitted to both places. Select each marker to read its own title; zooming and panning remain available after the initial framing.",
  source: '<tp-map title="Cities in Brittany" fit-markers><dl><dt>Brest</dt><dd>48.3904, -4.4861</dd><dt>Rennes</dt><dd>48.1173, -1.6778</dd></dl></tp-map>',
 }, {
  label: "GPX track",
  description: "Load an illustrative Brest track with two disconnected recording segments and named waypoints, plus a marker declared in the page. The visible gap is preserved; this synthetic example is not a navigation guide.",
  source: '<p>This illustrative Brest track has two separate recording segments. The gap is intentional; this synthetic route is not a navigation guide.</p><tp-map title="Illustrative Brest track" src="/docs/components/map/examples/brest-track.gpx" fit-content><dl><dt>Additional meeting point</dt><dd>48.3920, -4.4840</dd></dl></tp-map>',
 }, {
  label: "GPX route",
  description: "Explore a recorded track in northeastern Ouessant and its altitude profile below the map. Compare elevation in metres against cumulative distance in kilometres; the three recording segments remain separate. Use the profile’s Zoom button for a larger chart.",
  source: '<p>This GPX file contains a recorded track in northeastern Ouessant with three recording segments. The profile plots elevation in metres against cumulative distance in kilometres, without joining recording gaps. The map does not provide navigation guidance.</p><tp-map title="Northeastern Ouessant track" src="/docs/components/map/examples/ouessant-route.gpx" fit-content elevation-profile></tp-map>',
 }],
	animation: [
		{
			label: "Hover animation timing",
			description:
				"Hover over the box to trigger a delayed fade with linear easing; leave it to play the exit animation. Reduced-motion preferences remain respected.",
			source:
				'<p>Hover over the box, then move the pointer away.</p><tp-animation in="fadeIn" out="fadeOut" trigger="hover" duration="800ms" delay="200ms" easing="linear"><tp-box>Hover animation</tp-box></tp-animation>',
		},
	],
	asciidoc: [
		{
			label: "External document",
			description:
				"Load an AsciiDoc document through src instead of an internal script.",
			source:
				'<tp-asciidoc src="/docs/components/asciidoc/examples/basic-usage.adoc"></tp-asciidoc>',
		},
	],
	blank: [
		{
			label: "Disabled blank",
			description:
				"Compare an available blank with a disabled one and their custom placeholders. The disabled blank cannot be focused or cleared.",
			source:
				'<p>Available answer</p><tp-blank name="available" placeholder="Choose an answer" aria-label="Available answer"></tp-blank><p>Unavailable answer</p><tp-blank name="unavailable" placeholder="Not available" aria-label="Unavailable answer" disabled></tp-blank>',
		},
	],
	button: [
		{
			label: "Button styles",
			description:
				"Compare brand, outlined and pill buttons at different sizes. Each button opens the same usage guide.",
			source:
				'<tp-button href="/#/components/button/index.md#usage" variant="brand" size="s">Small brand link</tp-button><tp-button href="/#/components/button/index.md#usage" outlined size="m">Outlined link</tp-button><tp-button href="/#/components/button/index.md#usage" pill size="l">Large pill link</tp-button>',
		},
		{
			label: "Disabled and loading",
			description:
				"Try the unavailable buttons and compare the replace and inline loading indicators. These fixed states intentionally prevent activation.",
			source:
				'<tp-button disabled type="button">Unavailable</tp-button><tp-button loading loading-mode="replace">Saving</tp-button><tp-button loading loading-mode="inline">Saving with label</tp-button>',
		},
		{
			label: "Link and download",
			description:
				"Open the guide in a new tab or download the library logo. The link and download attributes are carried by the underlying anchor.",
			source:
				'<tp-button href="/#/components/button/index.md#usage" target="_blank" rel="noopener noreferrer">Open guide in a new tab</tp-button><tp-button href="/docs/medias/logos/logo-tp.svg" download="tp-logo.svg">Download the logo</tp-button>',
		},
	],
	"button-group": [
		{
			label: "Vertical and stretched groups",
			description:
				"Compare a vertical group with a stretched horizontal group. Each button links to the corresponding documentation section.",
			source:
				'<p>Vertical navigation</p><tp-button-group orientation="vertical" aria-label="Vertical documentation navigation"><tp-button href="/#/components/button-group/index.md#usage">Usage</tp-button><tp-button href="/#/components/button-group/index.md#example">Examples</tp-button></tp-button-group><p>Stretched navigation</p><tp-button-group stretch aria-label="Stretched documentation navigation"><tp-button href="/#/components/button-group/index.md#usage">Usage</tp-button><tp-button href="/#/components/button-group/index.md#example">Examples</tp-button></tp-button-group>',
		},
	],
	"checkbox-list": [
		{
			label: "Horizontal choices",
			description:
				"Select several horizontally arranged choices; the second item is initially selected through value.",
			source:
				'<tp-checkbox-list name="horizontal-topics" value="2" orientation="horizontal"><ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul></tp-checkbox-list>',
		},
	],
	"code-editor": [
		{
			label: "Read-only source",
			description:
				"Inspect a named source file with line numbers and soft wrapping. Try typing: readonly prevents modifications.",
			source:
				'<tp-code-editor language="javascript" filename="greeting.js" readonly line-numbers word-wrap value="const greeting = &quot;This read-only source wraps when the available width becomes too small.&quot;;"></tp-code-editor>',
		},
		{
			label: "Code folding",
			description:
				"Use the fold marker beside the function to collapse and expand its body.",
			source:
				'<tp-code-editor language="javascript" fold-gutter line-numbers><script type="tp/javascript">function greet(name) {\n  const greeting = "Hello, " + name + "!";\n  return greeting;\n}\nconsole.log(greet("reader"));</script></tp-code-editor>',
		},
		{
			label: "Empty editor placeholder",
			description:
				"Inspect the custom placeholder, then type to replace it with editable content.",
			source:
				'<tp-code-editor language="javascript" placeholder="Write your first JavaScript statement here"></tp-code-editor>',
		},
	],
	console: [
		{
			label: "Message levels",
			previousLabel: "Additional usage",
			description:
				"Compare standard, informative, warning and error messages in the console, then clear its output.",
		},
	],
	"formula-picker": [
		{
			label: "Selection event",
			description:
				"Select a formula to copy the emitted formula text into a clearable textfield.",
			source:
				'<tp-formula-picker id="formula-event-picker"></tp-formula-picker><tp-textfield id="formula-event-result" label="Selected formula" placeholder="Select a formula" clearable></tp-textfield><script type="module">const picker = document.querySelector("#formula-event-picker");\nconst result = document.querySelector("#formula-event-result");\nawait customElements.whenDefined("tp-textfield");\npicker.addEventListener("tp-formula-picker-select", (event) => {\n  result.value = event.detail.formula;\n});</script>',
		},
	],
	"icon-button": [
		{
			label: "Disabled icon buttons",
			description:
				"Compare a disabled action with a disabled spinning activity indicator. Both retain accessible labels and cannot be activated.",
			source:
				'<tp-icon-button name="heart" library="tp" label="Like unavailable" disabled variant="brand" color="var(--tp-brand-text-colorful)" size="s" type="button"></tp-icon-button><tp-icon-button name="refresh" library="tp" label="Refresh in progress" disabled spin size="l" type="button"></tp-icon-button>',
		},
	],
	iframe: [
		{
			label: "Inline document and zoom",
			description:
				"Render text supplied through srcdoc at an enlarged zoom level, without fetching a document file.",
			source:
				'<tp-iframe srcdoc="This document is supplied directly through the srcdoc attribute." title="Inline text document" zoom="1.25" loading="eager"></tp-iframe>',
		},
	],
	markdown: [
		{
			label: "Mathematical notation",
			previousLabel: "Additional usage",
			description:
				"Compare inline and displayed mathematical notation written in AsciiMath and LaTeX.",
		},
	],
	"markup-multi-slides": [
		{
			label: "Slides navigation menu",
			previousLabel: "Additional usage",
			description:
				"Open the slide navigation menu and use it to move between the supplied slides.",
		},
	],
	"prolog-playground": [
		{
			label: "Repository project",
			description:
				"Load the constraint-programming project from repository, inspect its files and run its queries.",
			source:
				'<tp-prolog-playground repository="/examples/playgrounds/prolog-playground/04-prolog-clpz"></tp-prolog-playground>',
		},
	],
	"prose-editor": [
		{
			label: "External HTML document",
			description:
				"Load a document through src, then edit its text and formatting.",
			source:
				'<tp-prose-editor src="/docs/components/prose-editor/examples/editable-document.html"></tp-prose-editor>',
		},
	],
	restructuredtext: [
		{
			label: "External document",
			description:
				"Load a reStructuredText document through src instead of an internal script.",
			source:
				'<tp-restructuredtext src="/docs/components/restructuredtext/examples/basic-usage.rst"></tp-restructuredtext>',
		},
	],
	"save-image": [
		{
			label: "Download control icon",
			description:
				"Save the displayed heart using a trigger whose icon is explicitly chosen with name. The filename attribute sets the downloaded file name.",
			source:
				'<p>Save the heart below as an image.</p><tp-icon id="named-download-heart" name="heart" size="4em" aria-label="Heart"></tp-icon><tp-save-image anchor="#named-download-heart" name="image-download" filename="named-heart"></tp-save-image>',
		},
	],
	source: [
		{
			label: "Repository providers",
			description:
				"Compare source links for GitHub, GitLab and a generic Git address. The generic example address is illustrative.",
			source:
				'<p>GitHub</p><tp-source url="https://github.com/tp-web-lab/tp-components"></tp-source><p>GitLab</p><tp-source url="https://gitlab.com"></tp-source><p>Generic Git address (illustrative)</p><tp-source url="https://example.com/project.git"></tp-source>',
		},
	],
	tabs: [
		{
			label: "Manual vertical tabs",
			description:
				"The second panel is initially selected. Focus a vertical tab, use the arrow keys to move focus, then press Enter or Space to activate it.",
			source:
				'<tp-tabs orientation="vertical" activation="manual" selected="1"><dl><dt>Overview</dt><dd>Read the overview.</dd><dt>Details</dt><dd>This panel is selected initially.</dd><dt>Next steps</dt><dd>Choose the next action.</dd></dl></tp-tabs>',
		},
	],
	textfield: [
		{
			label: "Disabled and read-only fields",
			description:
				"Compare an editable value with a read-only value and a disabled field. Try typing and using the clear controls to observe the restrictions.",
			source:
				'<tp-textfield label="Editable" name="editable" value="You can edit this text" autocomplete="off" clearable></tp-textfield><tp-textfield label="Read only" name="readonly" value="This text cannot be edited" readonly clearable></tp-textfield><tp-textfield label="Disabled" name="disabled" value="This field is unavailable" disabled clearable></tp-textfield>',
		},
	],
};
