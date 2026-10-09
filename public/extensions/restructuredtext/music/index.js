module.exports = async function musicExtension(root) {
  await loadScript(
    'https://cdn.jsdelivr.net/npm/abcjs@6.6.3/dist/abcjs-basic-min.js',
  );

  if (!window.ABCJS?.renderAbc) {
    console.warn('abcjs is not available');
    return;
  }

  registerStyles();

  const blocks = root.querySelectorAll('.tp-rst-music');

  for (const [index, block] of blocks.entries()) {
    const code = block.querySelector('pre code.language-abc');
    const paper = block.querySelector('.tp-rst-music-paper');
    const audio = block.querySelector('.tp-rst-music-audio');

    if (!(code instanceof HTMLElement) || !(paper instanceof HTMLElement)) {
      continue;
    }

    const source = code.textContent ?? '';
    
    const renderOptions = {
      responsive: 'resize',
      add_classes: true,
    };
    if (block.getAttribute('data-tablature') === 'true') {
      renderOptions.tablature = [
        createTablatureOptions(block.getAttribute('data-instrument') ?? 'guitar'),
      ];
    }
    const visualObjects = window.ABCJS.renderAbc(paper, source, renderOptions);

    const visualObject = visualObjects[0];

    if (
      block.getAttribute('data-play') === 'true' &&
      audio instanceof HTMLElement &&
      visualObject
    ) {
      setupAudio(block, audio, visualObject);
    }
    if (visualObject) {
      setupSaveAs(block, visualObject, source);
    }
  }
};

function createTablatureOptions(instrument) {
  const supported = new Set([
    'guitar',
    'fiveString',
    'fiddle',
    'violin',
    'mandolin',
  ]);

  return {
    instrument: supported.has(instrument)
      ? instrument
      : 'guitar',
  };
}

function setupSaveAs(block, visualObject) {
  const controls = document.createElement('div');
  controls.className = 'tp-rst-music-save';

  const label = document.createElement('label');
  label.textContent = ' ';

  const select = document.createElement('select');

  select.innerHTML = `
    <option value="">Save as…</option>
    <option value="svg">SVG</option>
    <option value="midi">MIDI</option>
    <option value="pdf">PDF</option>
  `;

  select.addEventListener('change', () => {
    const value = select.value;
    select.value = '';

    if (value === 'svg') {
      saveSvg(block);
      return;
    }

    if (value === 'midi') {
      saveMidi(visualObject);
      return;
    }

    if (value === 'pdf') {
      savePdf(block);
      return;
    }
  });

  label.append(select);
  controls.append(label);
  block.append(controls);
}

function askFilename(defaultName, extension) {
  const value = window.prompt('Save as…', defaultName);

  if (value === null) {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed === '') {
    return null;
  }

  return trimmed.toLowerCase().endsWith(`.${extension}`)
    ? trimmed
    : `${trimmed}.${extension}`;
}

function saveSvg(block) {
  const filename = askFilename('score.svg', 'svg');

  if (filename === null) {
    return;
  }

  const svg = block.querySelector('svg');

  if (!(svg instanceof SVGElement)) {
    console.warn('No SVG score found');
    return;
  }

  const source = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([source], {
    type: 'image/svg+xml',
  });

  downloadBlob(blob, filename);
}

function saveMidi(visualObject) {
  const filename = askFilename('score.mid', 'mid');

  if (filename === null) {
    return;
  }

  if (typeof window.ABCJS?.synth?.getMidiFile !== 'function') {
    console.warn('abcjs MIDI export is not available');
    return;
  }

  const midi = window.ABCJS.synth.getMidiFile(visualObject, {
    midiOutputType: 'binary',
  });

  if (!(midi instanceof Uint8Array)) {
    console.warn('abcjs MIDI export did not return binary data');
    return;
  }

  const blob = new Blob([midi], {
    type: 'audio/midi',
  });

  downloadBlob(blob, filename);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function savePdf(block) {
  const filename = askFilename('score.pdf', 'pdf');

  if (filename === null) {
    return;
  }

  const svg = block.querySelector('svg');

  if (!(svg instanceof SVGElement)) {
    console.warn('No SVG score found');
    return;
  }

  const source = new XMLSerializer().serializeToString(svg);

  const html = `
<!doctype html>
<html>
<head>
  <title>${escapeHtml(filename)}</title>

  <style>
    body {
      margin: 0;
      padding: 2rem;
      display: grid;
      place-items: center;
      background: white;
    }

    svg {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
${source}
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    window.print();
  }, 250);
});
<\/script>
</body>
</html>
`;

  const win = window.open('', '_blank');

  if (win === null) {
    console.warn('Unable to open print window');
    return;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function setupAudio(block, audio, visualObject) {
  if (!window.ABCJS.synth?.supportsAudio?.()) {
    audio.textContent = 'Audio is not supported in this browser.';
    return;
  }

  const cursorControl = createCursorControl(block);

  const synthControl = new window.ABCJS.synth.SynthController();
  const audioId = `tp-rst-music-audio-${crypto.randomUUID()}`;

  audio.id = audioId;

  synthControl.load(`#${CSS.escape(audioId)}`, cursorControl, {
    displayLoop: true,
    displayRestart: true,
    displayPlay: true,
    displayProgress: true,
    displayWarp: true,
  });

  synthControl.setTune(visualObject, false).catch((error) => {
    console.warn('abcjs audio problem:', error);
  });
}

function createCursorControl(block) {
  let cursor = null;

  return {
    onStart() {
      const svg = block.querySelector('svg');

      if (!(svg instanceof SVGElement)) {
        return;
      }

      cursor = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      cursor.setAttribute('class', 'abcjs-cursor');
      cursor.setAttribute('x1', '0');
      cursor.setAttribute('x2', '0');
      cursor.setAttribute('y1', '0');
      cursor.setAttribute('y2', '0');
      svg.append(cursor);
    },

    onEvent(event) {
      if (cursor === null || event.measureStart || event.left === null) {
        return;
      }

      cursor.setAttribute('x1', String(event.left - 2));
      cursor.setAttribute('x2', String(event.left - 2));
      cursor.setAttribute('y1', String(event.top));
      cursor.setAttribute('y2', String(event.top + event.height));
    },

    onFinished() {
      cursor?.remove();
      cursor = null;
    },
  };
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    if (window.ABCJS?.renderAbc) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = false;

    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () =>
      reject(new Error(`Unable to load script: ${url}`)),
    );

    document.head.append(script);
  });
}

function loadStyle(url) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `link[href="${url}"]`,
    );

    if (existing instanceof HTMLLinkElement) {
      resolve();
      return;
    }

    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    link.addEventListener('load', () => resolve());

    link.addEventListener('error', () =>
      reject(new Error(`Unable to load stylesheet: ${url}`)),
    );

    document.head.append(link);
  });
}

function registerStyles() {
  if (document.getElementById('tp-rst-music-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'tp-rst-music-styles';
  style.textContent = `
.tp-rst-music {
  margin-block: 1rem;
  overflow-x: auto;
}

.tp-rst-music-paper svg {
  max-inline-size: 100%;
  block-size: auto;
}

.tp-rst-music-audio {
  margin-block-start: 0.75rem;
}

.tp-rst-music-save {
  margin-block-start: 0.5rem;
}

.tp-rst-music-save select {
  font: inherit;
}

/* Some basic CSS to make the Audio controls in abcjs presentable. */

.abcjs-inline-audio {
	height: 26px;
	padding: 0 5px;
	border-radius: 3px;
	background-color: #424242;
	display: flex;
	align-items: center;
	box-sizing: border-box;
}

.abcjs-inline-audio.abcjs-disabled {
	opacity: 0.5;
}

.abcjs-inline-audio .abcjs-btn {
	display: block;
	width: 28px;
	height: 34px;
	margin-right: 2px;
	padding: 7px 4px;

	background: none !important;
	border: 1px solid transparent;
	box-sizing: border-box;
	line-height: 1;
}

.abcjs-btn g {
	fill: #f4f4f4;
	stroke: #f4f4f4;
}

.abcjs-inline-audio .abcjs-btn:hover g {
	fill: #cccccc;
	stroke: #cccccc;
}

.abcjs-inline-audio .abcjs-midi-selection.abcjs-pushed {
	border: 1px solid #cccccc;
	background-color: #666666;
	box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-midi-loop.abcjs-pushed {
	border: 1px solid #cccccc;
	background-color: #666666;
	box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-midi-reset.abcjs-pushed {
	border: 1px solid #cccccc;
	background-color: #666666;
	box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-midi-start .abcjs-pause-svg {
	display: none;
}

.abcjs-inline-audio .abcjs-midi-start .abcjs-loading-svg {
	display: none;
}

.abcjs-inline-audio .abcjs-midi-start.abcjs-pushed .abcjs-play-svg {
	display: none;
}

.abcjs-inline-audio .abcjs-midi-start.abcjs-loading .abcjs-play-svg {
	display: none;
}

.abcjs-inline-audio .abcjs-midi-start.abcjs-pushed .abcjs-pause-svg {
	display: block;
}

.abcjs-inline-audio .abcjs-midi-progress-background {
	background-color: #424242;
	height: 10px;
	border-radius: 5px;
	border: 2px solid #cccccc;
	margin: 0 8px 0 15px;
	position: relative;
	flex: 1;
	padding: 0;
	box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-midi-progress-indicator {
	width: 20px;
	margin-left: -10px; /* half of the width */
	height: 14px;
	background-color: #f4f4f4;
	position: absolute;
	display: inline-block;
	border-radius: 6px;
	top: -4px;
	left: 0;
	box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-midi-clock {
	margin-left: 4px;
	margin-top: 1px;
	margin-right: 2px;
	display: inline-block;
	font-family: sans-serif;
	font-size: 16px;
	box-sizing: border-box;
	color: #f4f4f4;
}

.abcjs-inline-audio .abcjs-tempo-wrapper {
	font-size: 10px;
	color: #f4f4f4;
	box-sizing: border-box;
	display: flex;
	align-items: center;
}

.abcjs-inline-audio .abcjs-midi-tempo {
	border-radius: 2px;
	border: none;
	margin: 0 2px 0 4px;
	width: 42px;
	padding-left: 2px;
	box-sizing: border-box;
}

.abcjs-inline-audio .abcjs-loading .abcjs-loading-svg {
	display: inherit;
}

.abcjs-inline-audio .abcjs-loading {
	outline: none;
	animation-name: abcjs-spin;
	animation-duration: 1s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;

}
.abcjs-inline-audio .abcjs-loading-svg circle {
	stroke: #f4f4f4;
}

@keyframes abcjs-spin {
	from {transform:rotate(0deg);}
	to {transform:rotate(360deg);}
}

/* Adding the class "abcjs-large" will make the control easier on a touch device. */
.abcjs-large .abcjs-inline-audio {
	height: 52px;
}
.abcjs-large .abcjs-btn {
	width: 56px;
	height: 52px;
	font-size: 28px;
	padding: 6px 8px;
}
.abcjs-large .abcjs-midi-progress-background {
	height: 20px;
	border: 4px solid #cccccc;
}
.abcjs-large .abcjs-midi-progress-indicator {
	height: 28px;
	top: -8px;
	width: 40px;
}
.abcjs-large .abcjs-midi-clock {
	font-size: 32px;
	margin-right: 10px;
	margin-left: 10px;
	margin-top: -1px;
}
.abcjs-large .abcjs-midi-tempo {
	font-size: 20px;
	width: 50px;
}
.abcjs-large .abcjs-tempo-wrapper {
	font-size: 20px;
}

.abcjs-css-warning {
	display: none;
}
`;

  document.head.append(style);
}