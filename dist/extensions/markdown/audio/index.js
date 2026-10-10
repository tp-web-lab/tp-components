export default function markdownAudioExtension(md, options = {}) {
  md.inline.ruler.before('emphasis', 'audio_macro', (state, silent) => {
    const match = state.src.slice(state.pos).match(/^::audio\{([^}]*)\}/);

    if (match === null) {
      return false;
    }

    if (!silent) {
      const token = state.push('audio_macro', '', 0);
      token.meta = parseAttributes(match[1]);
    }

    state.pos += match[0].length;
    return true;
  });

  md.renderer.rules.audio_macro = (tokens, index) => {
    const attrs = tokens[index].meta ?? {};
    const src = attrs.src ?? '';

    if (src === '') {
      return '';
    }

    const controls = attrs.controls !== false;

    return `
      <audio
        class="tp-md-audio"
        src="${escapeAttribute(src)}"
        ${controls ? 'controls' : ''}
      >
        Your browser does not support the audio element.
      </audio>
    `;
  };
};

function parseAttributes(source) {
  const attrs = {};
  const pattern = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;

  for (const match of source.matchAll(pattern)) {
    const key = match[1];
    const value = match[2] ?? match[3] ?? match[4];

    attrs[key] = value === undefined ? true : value;
  }

  return attrs;
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

