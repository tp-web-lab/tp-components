// Editorial descriptions: describe the rendered interface, never its construction.
const interactions = new Map();
function describe(names, text) {
  for (const name of names.split(' ')) interactions.set(name, text);
}

describe('badge box card center cluster cover divider frame grid inline stack switcher button-group toolbar', 'This component organizes or presents content; it adds no action of its own. Use any links, buttons or fields inside it in the usual way.');
describe('icon clock', 'This component displays information and has no control to operate.');
describe('asciidoc markdown restructuredtext include iframe', 'Read the displayed content and use its links and embedded controls. The component itself adds no editing or playback controls.');
describe('base', 'Press Ctrl+? to open help for the component under the pointer, including non-focusable components such as boxes. If no component is hovered, help uses the focused component. On keyboards that require Shift to type ?, include Shift. The shared foundation adds no other standalone control.');
describe('accordion', 'Activate a section heading to reveal or hide its content. Focus a heading with Tab, then use Enter or Space. Depending on the exercise or page, opening one section may close the previous one.');
describe('alarm', 'Choose the alarm time, then press Start alarm. Stop alarm stops the alarm. Sound may require permission or an initial interaction with the page.');
describe('animation', 'Content may animate when it appears, when you click it or when you move the pointer over it, depending on the page. There is no separate animation toolbar.');
describe('button icon-button', 'Click the button, or focus it with Tab and activate it with the keyboard, to perform the action identified by its label. A navigation button opens its destination. Disabled controls cannot be activated.');
describe('callout', 'Read the highlighted message. If a close button is displayed, activate it to dismiss the message.');
describe('checkbox-list', 'Select or clear individual options; several options can be selected together. Use Tab to reach a checkbox and Space to toggle it.');
describe('radio-list', 'Choose one option from the group. Selecting another option replaces the previous selection. Use the arrow keys to move between radio options.');
describe('chronometer', 'Start chronometer starts or resumes timing. Pause chronometer freezes the elapsed time; Stop chronometer stops timing and resets the display.');
describe('timer', 'Enter a duration in seconds and press Start timer to begin the countdown. Stop timer stops it. When the countdown reaches zero, the timer signals completion; sound depends on the page and browser.');
describe('code-editor', 'Click in the editor to type or change the source. Select text to copy, cut or replace it. Press F1 to show or hide the editor toolbar; the keyboard button opens the command palette. Editing source here does not by itself execute a program.');
describe('prose-editor', 'Edit the document directly and use the toolbar to format text, insert content, undo or redo changes. The command table below describes the available actions.');
describe('spreadsheet-editor', 'Select a cell to edit its value or enter a formula beginning with =. Use the formula bar and formatting menus to work with the selection. The File menu imports or exports a spreadsheet; Undo and Redo navigate changes.');
describe('graph-editor', 'Drag a shape from the palette onto the canvas to create a node. Select and move nodes, connect their ports, and select links to edit them. Use the toolbar for undo, redo, zoom, import and export; the command table below details each action.');
describe('color', 'Activate the palette button to change the brand color of the associated content.');
describe('theme', 'Activate the theme button to change the light or dark appearance of the associated content.');
describe('dir', 'Activate the direction button to change the reading direction of the associated content.');
describe('lang', 'Open the language menu and choose an available language to navigate to that version of the documentation.');
describe('fullscreen', 'Activate the fullscreen button to expand the associated content. Activate it again, or use the browser\'s fullscreen exit action, to leave fullscreen.');
describe('source', 'Activate the repository button to open the source repository. No button is shown when no repository is available.');
describe('save-image', 'Activate the save-image button to download the associated image. The browser handles the resulting download.');
describe('copy-code', 'Activate the copy button to copy the associated text. On code blocks, the button appears at the top right on hover or keyboard focus. A temporary check mark confirms a successful copy.');
describe('color-picker', 'Select a color to copy its CSS variable reference. You can also focus a color and press Enter or Space.');
describe('emoji-picker symbol-picker icon-picker', 'Browse or search the available items, then select one to copy it in the chosen format. Use the displayed filters and format selector, when available, to narrow the list or change the copied representation.');
describe('formula-picker', 'Browse or search for a formula, then select it. In an editor, the selected formula is inserted into the current field; replace its selected parameters with your own values.');
describe('compare', 'Drag the comparison handle to reveal more of either image or panel. When the handle has keyboard focus, use the arrow keys to adjust the split.');
describe('console', 'Read the messages in the output. Expand structured values to inspect their contents.');
describe('contextmenu', 'Open the context menu on its associated area, then choose an available action. Dismiss the menu to return to the content without choosing an action.');
describe('dialog modal drawer popover', 'Activate the page\'s trigger to open the panel. Use its controls or links, then close it with the available dismissal control. Dismissal by Escape or a click outside depends on the panel settings.');
describe('drawer', 'Activate the page\'s trigger to open the panel. Use its controls or links, then close it with the Close button or Escape. Escape always closes the drawer. Clicking outside, including on the backdrop, closes it only when outside-click is enabled.');
describe('dropdown', 'Activate the trigger to open the dropdown, then choose an item. Close the dropdown to leave without selecting an action.');
describe('tooltip', 'Hover over the associated control or give it keyboard focus to read its additional explanation. The tooltip is not a button or a separate action.');
describe('dragdrop', 'Drag an item to an available destination to move it. The surrounding exercise or list determines which destinations are accepted and provides any alternative selection controls.');
describe('blank', 'A dashed border and an ellipsis identify an answer destination rather than a typing field. Assigned text, formulas or images appear inside it. Use the clear button to release an assigned answer; it is unavailable while the blank is empty or disabled.');
describe('fill-blank', 'Complete the fields in the sentence. Type in editable fields, or use the answer choices provided by the surrounding exercise for closed blanks.');
describe('fill-blank-question', 'Read the prompt and complete each blank. In an open question, type your answers. In a closed question, drag answers from the bank into blanks, or select an answer and then a blank. At the keyboard, focus a blank, press Right Arrow to reach the answers, choose with Up/Down, and press Enter or Space to fill the highlighted blank. Escape cancels; Delete clears a focused blank.\n\nSubmit checks your answers. Read Feedback for help or open Solution to view the explanation. A correct answer displays a congratulatory message. A warning after the prompt tells you when uppercase and lowercase letters must match.');
describe('question', 'Read the prompt, complete the answer form and submit it. In Output, switch between Feedback and Solution. Solution is available before submission; if feedback or a solution is missing, its panel says so.');
describe('single-choice-question', 'Read the prompt, choose one answer and submit it. Review Feedback to understand the result or open Solution for the explanation.');
describe('multi-choice-question', 'Read the prompt, select all the answers you consider correct and submit them. Review Feedback to understand the result or open Solution for the explanation.');
describe('textfield', 'Type or edit text in the field. The trailing clear button removes its contents when clearing is available. A required-field marker means you must provide a value before submitting the form.');
describe('mathfield', 'Enter a mathematical expression using the field\'s math input controls. Use the trailing clear button when available to remove the expression. A required-field marker means an answer is needed.');
describe('datefield', 'Type a date or use the browser\'s date picker. The display follows your locale. Use the clear control when available to remove the selected date.');
describe('timefield', 'Type a time or use the browser\'s time controls. The display follows your locale. Use the clear control when available to remove the selected time.');
describe('flip-card', 'Activate the flip button to switch between the front and back of the card. Activate it again to return to the other side. If no flip button is displayed, click the card itself, or focus it with Tab and press Enter or Space.');
describe('file-tree tree object-tree', 'Expand or collapse branches to inspect nested items. Select available links or entries to use the actions provided by the surrounding page.');
describe('filesystem', 'Use the file browser to navigate folders and select files. File access may require permission from the browser.');
describe('menu', 'Open a menu branch to reveal its entries, then choose an available action or link.');
describe('toc', 'Select a heading in the table of contents to navigate to that section. Expand or collapse branches to show or hide nested headings.');
describe('sidebar', 'Read or use the content in the side panel. Any links and controls inside it retain their usual actions.');
describe('slider', 'Scroll horizontally to reach items outside the visible area. Press Tab to focus the slider, then Left or Right Arrow to scroll by 80% of its visible width. Home and End reach the start and end of the content, respecting text direction. A visible outline identifies the focused slider; scrolling is immediate. Tab continues to links and controls inside it, whose keyboard interactions remain unchanged.');
describe('splitter', 'Drag the separator to resize the two panels. Focus the separator and use the arrow keys to adjust it with the keyboard.');
describe('tabs', 'Select a tab to display its panel. Focus the tab list and use the arrow keys to move between tabs; Home and End reach the first and last tabs.');
describe('diagram', 'Read the rendered diagram. Any links in the diagram behave according to the page\'s security and interaction settings; the component does not provide a source editor.');
describe('turtle', 'View the drawing and use the available replay and download controls. The command table below describes the drawing controls.');
describe('xy-plot', 'Inspect the plotted curves and use the enlargement control to open a larger view.');
describe('text-to-speech', 'Press **Speak** to hear the text, **Pause** to suspend reading, **Resume** to continue, and **Stop** to end it. The status beside the buttons indicates the current state.\n\nOpen **Settings** to choose a voice for the text\'s language. **Automatic** lets the browser choose. Changing the voice stops the current reading; press Speak to hear the new voice. Available voices and their quality depend on your browser and operating system.\n\nIn the compact presentation, the speaker button starts reading and changes into a stop button while reading; pause, resume and voice selection are not offered. The text is visible only when the page includes its written version.');
describe('speech-to-text', 'Press **Start**, grant microphone permission if prompted, then speak. **Stop** ends listening and lets the browser finalize the transcript. **Clear** cancels listening and removes the text. You can also edit the transcript by typing.\n\nProvisional text, when shown, can change while you speak; only finalized words are retained. Recognition depends on your browser and may send audio to an online service. Check the status for permission or service errors before trying again.');
describe('binary sudoku yakazu crossword cryptarithm', 'Complete the puzzle using the editable cells; fixed clues cannot be changed. Use the displayed assistance controls to check or reveal information when available. The puzzle\'s messages indicate progress and completion.');
describe('mastermind', 'Choose colors for an attempt and check it. Exact matches and misplaced colors help you refine the next attempt. Use Undo or Redo to revisit changes, assistance for help, and the reset button to start with another code.');
describe('memory', 'Reveal two cards and try to find matching pairs. Unmatched cards turn back over; matched pairs remain revealed. Reset starts a new game.');
describe('loto', 'Draw numbers using the game control and compare them with the tickets. The history shows numbers already drawn; the reset button starts a new game.');
describe('solitaire', 'Select a face-up card, then select its destination pile. Reveal exposed face-down cards and move cards to the foundations according to the game rules.');
describe('game-life', 'Toggle cells to prepare a pattern. Step advances one generation; Play starts continuous evolution and changes to Pause. Reset restores the starting state.');

const markupLanguages = ['html', 'markdown', 'asciidoc', 'restructuredtext'];
for (const language of [...markupLanguages, 'markup']) {
  describe(`${language}-single-page`, 'Read the document and follow its links. Use the table of contents and document controls when they are displayed.');
  describe(`${language}-multi-pages`, 'Choose a page in the navigation menu or follow a document link. The selected page replaces the current content. Use the available table of contents and document controls to navigate within it.');
  describe(`${language}-multi-slides`, 'Use the presentation controls to move through slides and reveal progressive content. The displayed controls let you navigate without editing the slide source.');
}
for (const language of [...markupLanguages, 'javascript', 'typescript', 'python', 'prolog', 'sql']) {
  describe(`${language}-viewer`, 'The viewer initially displays the result. **Code** shows or hides the source editor; edit the source there, then use **Run** to update the result. **Reset** restores the initial source. The command table below describes the other toolbar buttons.');
  describe(`${language}-playground`, 'Select a project file to edit it, then run the project to update the result. Use the project and file menus to manage your work. The command table below describes the toolbar actions.');
}
for (const name of ['notebook', ...['javascript', 'typescript', 'python', 'prolog', 'sql'].map(language => `${language}-notebook`)]) {
  describe(name, 'Edit the notebook\'s blocks and run programming cells to see their results. In editor mode, select a block to move, duplicate or delete it. Preview displays the document; Export HTML saves an HTML version. The command table below describes the available controls.');
}

const movedHeadings = new Set(['Commands', 'Commands palette', 'Interactions', 'Import and export']);

/** Split an old Usage section without changing declarations or fenced markup. */
export function componentUsage(name, original) {
  original = original.replace(/^Declare `<tp-[a-z0-9-]+>` in HTML, or use the corresponding component extension in `@tp\/tp-markdown`, `@tp\/tp-asciidoc` or `@tp\/tp-restructuredtext`\. See \[Examples\]\([^\n)]+\) for the markup-language variants and \[API\]\([^\n)]+\) for attributes and defaults\. Boolean attributes are enabled by their presence and disabled by their absence\.\n*/gm, '');
  if (/^### User interactions$/m.test(original) && /^### Author directives$/m.test(original)) return original.trim();
  // Hide code fences during structural edits so headings inside example source
  // are not mistaken for documentation subsections.
  const fences = [];
  let author = original.trim().replace(/^([ \t]*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\2[ \t]*$/gm, code => {
    const token = `<!-- tp-usage-fence:${fences.length} -->`;
    fences.push(code);
    return token;
  });
  const userSections = [];
  const sections = author.split(/(?=^### )/m);
  author = sections.filter(section => {
    const heading = section.match(/^### (.+)\n/)?.[1];
    // Field tables also describe DOM events and methods: keep that API contract
    // with the author, and explain the visible controls separately above.
    if (heading === 'Interactions' && name.endsWith('field')) return true;
    if (!movedHeadings.has(heading)) return true;
    userSections.push(section.trim().replace(/^### /gm, '#### '));
    return false;
  }).join('').trim();
  let user = interactions.get(name);
  // Simulator pages already document their own controls before the declaration.
  if (name.startsWith('graph-') && name !== 'graph-editor') {
    const boundary = author.indexOf(`Use \`<tp-${name}>\``);
    if (boundary < 0) throw new Error(`Review user interactions for ${name}`);
    user = author.slice(0, boundary).trim().replace(/ Programmatically, `run\(\)` consumes the complete remaining input\./, '');
    author = author.slice(boundary);
    if (name === 'graph-dfa') author += '\n\nProgrammatically, `run()` consumes the complete remaining input.';
  }
  if (!user) throw new Error(`Document user interactions for ${name} before generating its Usage section.`);
  if (name === 'mathfield') user += '\n\nThe formula copy button copies the mathematical source. Eye opens or closes the rendered preview; its copy button copies the rendered SVG.';
  if (name.endsWith('field')) author = author.replace('### Interactions', '### Events and programmatic interactions');
  if (name === 'code-editor') {
    userSections[0] = userSections[0]?.replace('Add the boolean `toolbar` attribute to display the UI panel. ', '');
    author += '\n\nAdd the boolean `toolbar` attribute to display the editor toolbar initially.';
  }
  // Move complete reader-facing paragraphs, retaining detailed construction prose.
  const readerParagraphs = {
    'base': ['Press <kbd>Ctrl</kbd>'],
    'color-picker': ['Click a color'],
    'speech-to-text': ['Press **Start**'],
    'solitaire': ['Click a face-up card', 'The chronometer starts'],
    'notebook': ['In editor mode,', 'The `Files` dropdown'],
    'graph-editor': ['The `language-json` toolbar', 'Drag a shape from', 'When an existing link', 'Hover or select a node', 'Hover or select an edge', 'Drag the body of an edge', 'Drag **Measurement**', 'The Delete or Backspace', 'Use **Copy**'],
  };
  for (const prefix of readerParagraphs[name] ?? []) {
    const paragraphs = author.split('\n\n');
    const index = paragraphs.findIndex(paragraph => paragraph.startsWith(prefix));
    if (index < 0) continue;
    let paragraph = paragraphs.splice(index, 1)[0];
    author = paragraphs.join('\n\n');
    // The replacement above already gives these instructions without markup/API details.
    if (['base', 'color-picker', 'speech-to-text'].includes(name)) continue;
    paragraph = paragraph
      .replace('This automatically disconnects both endpoints and stores their free positions as `sourcePoint` and `targetPoint`. ', 'This disconnects both endpoints. ')
      .replace(/ Its normalized position is stored in `edge\.data\.measurements`[^\n]*/, '')
      .replace('The usual Ctrl/Cmd+C, X, V,', 'Use Ctrl/Cmd+C, X and V for Copy, Cut and Paste.')
      .replace('a `<tp-code-editor>`', 'a source editor')
      .replace('the `<tp-notebook>` editor wrapper', 'the notebook editing controls');
    user += `\n\n${paragraph}`;
  }
  author = author.replace('The viewer initially shows only the output. Use the code button in the toolbar to display or hide the source editor.\n\n', '');
  author = author.replace(/^### /gm, '#### ');
  return `### User interactions\n\n${[user, ...userSections].join('\n\n')}\n\n### Author directives\n\n${author}`
    .trim()
    .replace(/<!-- tp-usage-fence:(\d+) -->/g, (_, index) => fences[Number(index)]);
}
