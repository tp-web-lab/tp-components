export default function markdownVideoExtension(md, options = {}) {
  md.inline.ruler.before('emphasis', 'video_macro', (state, silent) => {
    const match = state.src.slice(state.pos).match(/^::video\{([^}]*)\}/);

    if (match === null) {
      return false;
    }

    if (!silent) {
      const token = state.push('video_macro', '', 0);
      token.meta = parseAttributes(match[1]);
    }

    state.pos += match[0].length;
    return true;
  });

  md.renderer.rules.video_macro = (tokens, index) => {
    const attrs = tokens[index].meta ?? {};
    const src = attrs.src ?? '';

    if (src === '') {
      return '';
    }

    const controls = attrs.controls !== false;
    const width = attrs.width ?? '';
    const poster = attrs.poster ?? '';

    return `
<video
  class="tp-md-video"
  src="${escapeAttribute(src)}"
  ${controls ? 'controls' : ''}
  ${width !== '' ? `width="${escapeAttribute(width)}"` : ''}
  ${poster !== '' ? `poster="${escapeAttribute(poster)}"` : ''}
>
  Your browser does not support the video element.
</video>
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
