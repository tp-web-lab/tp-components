/** @module scripts/build-markdown-renderer */

/**
 * Bundles the Markdown source renderer for Node.js into dist/renderers/markdown.js.
 *
 * Run from the tp-components package root with workspace dependencies installed.
 *
 * @example
 * node scripts/build-markdown-renderer.mjs
 */

import { rolldown } from 'rolldown';
// A separate Node bundle keeps browser component registration out of build tools.
const bundle = await rolldown({
  input: 'src/utilities/markdown-source.ts',
  platform: 'node',
});
try {
  await bundle.write({ file: 'dist/renderers/markdown.js', format: 'es', codeSplitting: false });
} finally {
  await bundle.close();
}
