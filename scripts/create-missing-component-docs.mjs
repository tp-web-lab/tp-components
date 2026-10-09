import { imports } from './component-doc-imports.mjs';
import { componentUsage } from './component-doc-usage.mjs';
import { exampleFile, markupExample } from './component-basic-examples.mjs';
import { EXAMPLE_TABS_FENCE } from './component-example-tabs.mjs';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const components = {
  animation: ['Animation', 'An animation controller for a light-DOM target.', `<tp-animation in="fadeIn" trigger="load" duration="800ms">
  <tp-box>Animated content</tp-box>
</tp-animation>`, 'Choose an animate.css name with `in` or `out`, then select a `load`, `click`, `hover`, `manual`, or `intersection` trigger.'],
  accordion: ['Accordion', 'An accessible accordion built from paired `<dt>` and `<dd>` elements.', `<tp-accordion open-indexes="0">
  <dl>
    <dt>What is HTML?</dt><dd>The language used to structure web pages.</dd>
    <dt>What is CSS?</dt><dd>The language used to style web pages.</dd>
  </dl>
</tp-accordion>`, 'Use `multiple` to keep several sections open and `open-indexes` with space-separated, zero-based indexes to choose the initially open sections.'],
  base: ['Base', 'The shared base class used by the other `tp-*` custom elements.', `<tp-base>This element provides the common tp-components foundation.</tp-base>`, '`<tp-base>` is primarily an extension point for component authors. Application interfaces should normally use one of its specialized subclasses.'],
  button: ['Button', 'A styled control that renders as a native button or link.', `<tp-button variant="primary">Continue</tp-button>
<tp-button outlined>Cancel</tp-button>
<tp-button href="#programming">Read the API</tp-button>`, 'Without `href`, the component creates a native button. With `href`, it creates a link and forwards `target`, `rel`, and `download`.'],
  'button-group': ['Button group', 'A layout component that organizes related `<tp-button>` controls.', `<tp-button-group attached>
  <tp-button>Previous</tp-button>
  <tp-button variant="primary">Next</tp-button>
</tp-button-group>`, 'Use `orientation="vertical"` for a column, `attached` to join adjacent controls, and `stretch` to fill the available width.'],
  'checkbox-list': ['Checkbox list', 'A list transformer that turns each item into a checkbox option.', `<tp-checkbox-list name="topics" value="1,3">
  <ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul>
</tp-checkbox-list>`, 'The `value` attribute contains comma-separated, one-based item indexes. Listen for `tp-checkbox-list-change` to receive the current value and label.'],
  'copy-code': ['Copy code', 'A compact button that copies the textual content of another element.', `<pre id="copy-example"><code>const answer = 42;</code></pre>
<tp-copy-code for="copy-example"></tp-copy-code>`, 'Set `for` to the target element ID. The component reports success or failure through `tp-copy-code-success` and `tp-copy-code-error`.'],
  compare: ['Compare', 'An interactive before-and-after comparison view.', `<tp-compare position="50%" before-label="Before" after-label="After" style="height: 12rem">
  <div slot="before" style="width:100%;height:100%;background:#88b1a1"></div>
  <div slot="after" style="width:100%;height:100%;background:#e08d79"></div>
</tp-compare>`, 'Provide two overlapping children marked with `slot="before"` and `slot="after"`. The handle updates the percentage in `position`.'],
  dragdrop: ['Drag and drop', 'A generic drag-and-drop layer for reordering light-DOM elements.', `<tp-dragdrop items="li">
  <ol><li>First item</li><li>Second item</li><li>Third item</li></ol>
</tp-dragdrop>`, 'Set `items` to the draggable item selector. Optional `root` and `handle` selectors constrain the observed area and drag handle.'],
  'fill-blank-question': ['Fill blank question', 'An interactive fill-in-the-blank question with validation and feedback.', `<tp-fill-blank-question answer="Paris">
  <dl>
    <dt>Title</dt><dd>Geography</dd>
    <dt>Prompt</dt><dd>Complete the sentence.</dd>
    <dt>Form</dt><dd>The capital of France is <input aria-label="Capital"></dd>
    <dt>Feedback</dt><dd>Check the spelling.</dd>
    <dt>Solution</dt><dd>Paris</dd>
  </dl>
</tp-fill-blank-question>`, 'List answers in input order in the comma-separated `answer` attribute. Inputs and selects inside the `Form` section are wrapped automatically.'],
  frame: ['Frame', 'A fixed-aspect-ratio frame for cropped media.', `<tp-frame aspect-ratio="16:9" style="max-width: 30rem">
  <img src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?auto=format&fit=crop&w=800&q=80" alt="Landscape">
</tp-frame>`, 'Set `aspect-ratio` with the `width:height` syntax. Direct image and video children fill the frame while preserving their proportions.'],
  'game-life': ['Game of Life', "Conway's Game of Life with presets, stepping, and autoplay.", `<tp-game-life preset="glider" label="Glider" cell-size="14"></tp-game-life>`, 'Start with `glider`, `blinker`, `toad`, `beacon`, or `gosper-gun`, or provide a program in `<script type="tp/game-life">`.'],
  'icon-button': ['Icon button', 'An accessible button whose visible content is a `<tp-icon>`.', `<tp-icon-button name="refresh" label="Refresh"></tp-icon-button>
<tp-icon-button name="delete" label="Delete" color="crimson"></tp-icon-button>`, 'Always provide `label` for an accessible name. Icon attributes such as `library`, `color`, `size`, `scale`, `rotate`, `flip-h`, `flip-v`, and `spin` are forwarded to the internal icon.'],
  iframe: ['Iframe', 'A controlled iframe with configurable interaction and zoom.', `<tp-iframe
  srcdoc="<h1>Hello</h1><p>This document is rendered inside tp-iframe.</p>"
  zoom="1"
  loading="lazy">
</tp-iframe>`, 'Use `src` for a remote document or `srcdoc` for inline HTML. `interaction`, `sandbox`, `referrerpolicy`, and `fullscreen` control browser capabilities.'],
  inline: ['Inline', 'A single-line flex layout for related content.', `<tp-inline gap="1rem" align="center">
  <tp-button>Previous</tp-button><span>Page 2 of 5</span><tp-button>Next</tp-button>
</tp-inline>`, 'Use `gap`, `justify`, and `align` with CSS values. Add `stretch` when every direct child should share the available width.'],
  'multi-choice-question': ['Multi-choice question', 'A question component that validates several selected answers.', `<tp-multi-choice-question answer="1,3">
  <dl>
    <dt>Title</dt><dd>Web languages</dd>
    <dt>Prompt</dt><dd>Select the styling languages.</dd>
    <dt>Form</dt><dd><ul><li>CSS</li><li>HTML</li><li>Sass</li></ul></dd>
    <dt>Feedback</dt><dd><ul><li>Correct.</li><li>HTML structures content.</li><li>Correct.</li></ul></dd>
    <dt>Solution</dt><dd>CSS and Sass</dd>
  </dl>
</tp-multi-choice-question>`, 'The `answer` attribute contains comma-separated, one-based indexes in the original list order. Add `random` to shuffle choices.'],
  'object-tree': ['Object tree', 'An interactive tree for inspecting JavaScript values.', `<tp-object-tree id="object-tree-example"></tp-object-tree>
<script>
  document.querySelector('#object-tree-example')?.setValue({
    component: 'tp-object-tree',
    stable: true,
    versions: [1, 2, 3]
  });
</script>`, 'Call `setValue(value)` to display a value. `expandAll()`, `collapseAll()`, and `sortAll()` control the resulting tree.'],
  question: ['Question', 'The semantic base container shared by interactive question components.', `<tp-question>
  <dl>
    <dt>Title</dt><dd>Reflection</dd>
    <dt>Prompt</dt><dd>Describe one benefit of web components.</dd>
    <dt>Form</dt><dd><textarea style="width:100%;resize:vertical;" rows="3" placeholder="Type your answer..."></textarea></dd>
    <dt>Feedback</dt><dd>Think about encapsulation and reuse.</dd>
    <dt>Solution</dt><dd>They package reusable behavior behind a custom element.</dd>
  </dl>
</tp-question>`, 'Structure the content as a definition list with `Title`, `Prompt`, `Form`, `Feedback`, and `Solution` entries. Specialized question components add validation.'],
  'radio-list': ['Radio list', 'A list transformer that turns each item into a grouped radio option.', `<tp-radio-list name="theme" value="2" orientation="horizontal">
  <ul><li>Light</li><li>Automatic</li><li>Dark</li></ul>
</tp-radio-list>`, 'The `value` attribute is the one-based index of the selected item. Listen for `tp-radio-list-change` to receive the selected value and label.'],
  'single-choice-question': ['Single-choice question', 'A question component that validates one selected answer.', `<tp-single-choice-question answer="1">
  <dl>
    <dt>Title</dt><dd>Geography</dd>
    <dt>Prompt</dt><dd>What is the capital of France?</dd>
    <dt>Form</dt><dd><ul><li>Paris</li><li>London</li><li>Berlin</li></ul></dd>
    <dt>Feedback</dt><dd><ul><li>Correct.</li><li>London is in the UK.</li><li>Berlin is in Germany.</li></ul></dd>
    <dt>Solution</dt><dd>Paris</dd>
  </dl>
</tp-single-choice-question>`, 'The `answer` attribute is the one-based index of the correct item in the original list. Add `random` to shuffle choices.'],
  slider: ['Slider', 'A horizontally scrollable row of consistently sized items.', `<tp-box style="max-inline-size: 28rem">
  <tp-slider scrollbar item-width="10rem" gap="1rem">
    <tp-box>First</tp-box><tp-box>Second</tp-box><tp-box>Third</tp-box><tp-box>Fourth</tp-box>
  </tp-slider>
</tp-box>`, 'Set `item-width`, `gap`, and optionally `slider-height`. The `scrollbar` attribute controls whether the horizontal scrollbar is visible.'],
  toc: ['Table of contents', 'A navigable table of contents generated from the current page headings.', `<tp-toc label="On this page" open position="start"></tp-toc>`, 'Place the component in a document containing headings. It assigns missing heading IDs and updates when the document structure changes.'],
  toolbar: ['Toolbar', 'A sticky toolbar divided into start, center, and end sections.', `<tp-toolbar>
  <tp-icon-button section="start" name="menu" label="Menu"></tp-icon-button>
  <span section="center">Document</span>
  <tp-icon-button section="end" name="help" label="Help"></tp-icon-button>
</tp-toolbar>`, 'Assign children with `section="start"`, `section="center"`, or `section="end"`. Use `orientation` and `placement` to control the toolbar edge.'],
  turtle: ['Turtle', 'An SVG renderer for the tp turtle drawing language.', `<tp-turtle width="420" height="220" label="A square">
  <script type="tp/turtle">
    turtle x=0 y=0 heading=0 speed=6
    forward 80
    right 90
    forward 80
    right 90
    forward 80
    right 90
    forward 80
  </script>
</tp-turtle>`, 'Write the drawing program in `<script type="tp/turtle">` or load it with `src`. The generated SVG can be replayed and downloaded.'],
  'xy-plot': ['XY plot', 'An interactive SVG plot generated from the tp XY graph language.', `<tp-xy-plot>
  <script type="tp/xy-plot">
    xyFunctionGraph
      title "Functions"
      x-axis [-10,10]
      y-axis [-5,5]
      functions [["Sine", "2*sin(x)"], ["Line", "x/2"]]
  </script>
</tp-xy-plot>`, 'Provide the graph language inline or load it with `src`. The rendered plot includes a control for opening a larger view.'],
};

const sourceOnlyApi = {
  animation: ['tp-animation', 'TpAnimation', ['in', 'out', 'duration', 'delay', 'iterations', 'easing', 'fill', 'trigger', 'paused', 'once', 'target', 'root-margin', 'threshold']],
  compare: ['tp-compare', 'TpCompare', ['orientation', 'position', 'before-label', 'after-label', 'storage-key']],
  frame: ['tp-frame', 'TpFrame', ['aspect-ratio']],
  'game-life': ['tp-game-life', 'TpGameLife', ['cell-size', 'padding', 'background', 'alive-color', 'dead-color', 'grid-color', 'grid-stroke-width', 'cell-radius', 'steps', 'interval', 'label', 'wrap', 'autoplay', 'preset', 'preset-x', 'preset-y', 'preset-width', 'preset-height']],
  inline: ['tp-inline', 'TpInline', ['gap', 'justify', 'align', 'stretch']],
  slider: ['tp-slider', 'TpSlider', ['slider-height', 'item-width', 'gap', 'scrollbar', 'scrollbar-track-color', 'scrollback-thumb-color']],
  turtle: ['tp-turtle', 'TpTurtle', ['src', 'width', 'height', 'background', 'label', 'save-label', 'replay-label', 'download-name']],
  'xy-plot': ['tp-xy-plot', 'TpXYPlot', ['src']],
};

const cell = (value = '') => String(value).replaceAll('|', '\\|').replaceAll('\n', '<br>').trim();
const code = (value = '') => value === '' ? '' : `<code>${cell(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('{', '&#123;').replaceAll('}', '&#125;').replaceAll('--', '&#45;&#45;')}</code>`;
const table = (headings, rows, noneColumns) => {
  const body = rows.length > 0 ? rows : [noneColumns];
  return `| ${headings.join(' | ')} |\n| ${headings.map(() => '---').join(' | ')} |\n${body.map((row) => `| ${row.join(' | ')} |`).join('\n')}`;
};
const indentedTable = (...args) => table(...args).replaceAll('\n', '\n  ');
const apiBlock = (manifest) => {
  const attributes = manifest.attributes.map((item) => [code(item.name), code(item.type), code(item.default), cell(item.description)]);
  const methods = manifest.methods.map((item) => [code(item.name), cell(item.description)]);
  const events = manifest.events.map((item) => [code(item.name), code(item.detail), cell(item.description)]);
  const cssProperties = manifest.cssproperties.map((item) => [code(item.name), code(item.default), cell(item.description)]);
  return `::: tp-tabs
Attributes
: ${indentedTable(['Attribute', 'Type', 'Default', 'Description'], attributes, ['None.', '', '', ''])}
  [Attributes of \`<${manifest.tagname}>\`]

Methods
: ${indentedTable(['Method', 'Description'], methods, ['None.', ''])}
  [Public methods of \`${manifest.classname}\`]

Events
: ${indentedTable(['Event', 'Detail', 'Description'], events, ['None.', '', ''])}
  [Events emitted by \`<${manifest.tagname}>\`]

CSS properties
: ${indentedTable(['CSS property', 'Default', 'Description'], cssProperties, ['None.', '', ''])}
  [CSS properties of \`<${manifest.tagname}>\`]
:::`;
};

for (const [directory, [title, intro, example, guidance]] of Object.entries(components)) {
  const manifestPath = join(root, 'src/components', directory, `${directory}.json`);
  const fallback = sourceOnlyApi[directory];
  const manifest = fallback === undefined
    ? JSON.parse(readFileSync(manifestPath, 'utf8'))
    : {
        tagname: fallback[0],
        classname: fallback[1],
        attributes: fallback[2].map((name) => ({ name, type: 'string', default: '', description: `Configures \`${name}\`.` })),
        methods: [],
        events: [],
        cssproperties: [],
      };
  const tag = manifest.tagname;
  const className = manifest.classname;
  const markdown = `# ${title}

<tp-toc position="end" expand-all open brand></tp-toc>

${intro}

${example}

## Usage

${componentUsage(directory, `${guidance}\n\n\`\`\`html\n${example}\n\`\`\``)}

## Examples

${EXAMPLE_TABS_FENCE} tp-tabs
HTML
: ::include{examples/examples.html}

tp-asciidoc
: ::include{examples/examples.adoc}

tp-markdown
: ::include{examples/examples.md}

tp-restructuredtext
: ::include{examples/examples.rst}
${EXAMPLE_TABS_FENCE}

## Programming

### API
<!-- tp-docgen:api ${className} -->
${apiBlock(manifest)}
<!-- /tp-docgen:api -->

### Imports

${imports(directory)}
`;
  const destination = join(root, 'public/docs/components', directory, 'index.md');
  mkdirSync(dirname(destination), { recursive: true });
  mkdirSync(join(dirname(destination), 'examples'), { recursive: true });
  for (const extension of ['html', 'adoc', 'md', 'rst']) {
    writeFileSync(join(dirname(destination), 'examples', `examples.${extension}`), exampleFile(extension, tag, [{ label: 'Basic usage', source: markupExample(extension, example) }]));
  }
  writeFileSync(destination, markdown);
}

console.log(`Created ${Object.keys(components).length} component documentation pages.`);
