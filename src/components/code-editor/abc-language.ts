/**
 * @module components/code-editor/abc-language
 * @summary CodeMirror language support and theme for ABC notation.
 */

import { StreamLanguage } from '@codemirror/language';
import { EditorView } from '@codemirror/view';

/** CodeMirror language definition for ABC notation. */
export const abcLanguage = StreamLanguage.define({
  token(stream) {
    if (stream.sol() && stream.match(/^%.*$/)) {
      return 'comment';
    }

    if (stream.sol() && stream.match(/^[A-Z]:/)) {
      return 'keyword';
    }

    if (stream.match(/"[^"]*"/)) {
      return 'string';
    }

    if (stream.match(/\[[^\]]+\]/)) {
      return 'bracket';
    }

    if (stream.match(/[=_^]?[A-Ga-g][,']*\d*\/?\d*/)) {
      return 'atom';
    }

    if (stream.match(/[zZx]\d*\/?\d*/)) {
      return 'number';
    }

    if (stream.match(/[|:]+|\[|\]|\(|\)/)) {
      return 'operator';
    }

    stream.next();
    return null;
  },
});

/** Base theme for ABC notation. */
export const abcBaseTheme = EditorView.baseTheme({
  '.cm-keyword': {
    color: '#7c3aed',
    fontWeight: '700',
  },

  '.cm-atom': {
    color: '#2563eb',
    fontWeight: '600',
  },

  '.cm-string': {
    color: '#b45309',
  },

  '.cm-number': {
    color: '#0f766e',
  },

  '.cm-operator, .cm-bracket': {
    color: '#dc2626',
    fontWeight: '700',
  },

  '.cm-comment': {
    color: '#64748b',
    fontStyle: 'italic',
  },
});