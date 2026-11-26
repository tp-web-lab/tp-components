export const traceTemplate = (
	language,
	title,
) => `<tp-toolbar class="tp-interpreter-toolbar">
 <span section="start" class="tp-interpreter-title"><tp-icon name="file_type_${language}" library="languages" size="1.5em"></tp-icon> ${title} tracer</span>
 <span section="center" class="tp-interpreter-file" data-interpreter-filename id="filename"></span>
 <tp-icon-button section="end" id="edit" name="code" label="Edit source" aria-expanded="false"></tp-icon-button>
 <tp-icon-button section="end" id="load" name="file-import" label="Load trace"></tp-icon-button>
 <tp-icon-button section="end" id="save" name="file-upload" label="Save trace" disabled></tp-icon-button>
 <tp-divider section="end" inline orientation="vertical" data-document-navbar-divider></tp-divider>
 <tp-color section="end"></tp-color><tp-theme section="end"></tp-theme><tp-fullscreen section="end"></tp-fullscreen>
</tp-toolbar>
<div class="tp-interpreter-source" id="source-panel" hidden><tp-code-editor id="source" language="${language}" toolbar line-numbers></tp-code-editor></div>
<div class="controls" aria-label="Trace controls">
<input id="file" type="file" accept=".json,application/json" hidden>
<div class="trace-actions" role="group" aria-label="Execution and navigation">
<tp-icon-button id="run" name="play" label="Record execution"></tp-icon-button>
<tp-icon-button id="stop" name="stop" label="Stop recording" disabled></tp-icon-button>
<tp-divider inline orientation="vertical"></tp-divider>
<tp-icon-button id="first" name="chevron-left-first" label="First step" disabled></tp-icon-button>
<tp-icon-button id="previous" name="chevron-left" label="Previous step" disabled></tp-icon-button>
<tp-icon-button id="next" name="chevron-right" label="Next step" disabled></tp-icon-button>
<tp-icon-button id="over" name="arrow-right" label="Step over" disabled></tp-icon-button>
<tp-icon-button id="out" name="arrow-up" label="Step out" disabled></tp-icon-button>
<tp-icon-button id="query" name="play" label="Start at query" disabled></tp-icon-button>
<tp-icon-button id="last" name="chevron-right-last" label="Last step" disabled></tp-icon-button>
</div>
<output id="status" aria-live="polite">Load ${title} source, then record execution.</output>
</div>
<p id="event" aria-live="polite"></p>
<div class="panels">
<section class="source-output"><h2>Source</h2><p>The highlight follows the evaluated expression. Next moves to the next visible change.</p><pre id="recorded"></pre><div id="expression" hidden></div><h2>Output</h2><pre id="stdout"></pre></section>
<div class="memory-scroll"><div id="memory"><div class="trace-column" id="frames"><h2>Variables</h2><div id="variables"></div><h2 class="call-stack-heading">Call stack</h2><div id="call-stack"></div></div>
<div class="trace-column"><h2>Objects</h2><p>Arrows point to objects. Shared references converge on the same object. Hover or focus a dot to highlight its connection.</p><div id="heap"></div></div></div></div>
</div>
<details><summary>Trace JSON</summary><pre id="json"></pre></details>
`;
