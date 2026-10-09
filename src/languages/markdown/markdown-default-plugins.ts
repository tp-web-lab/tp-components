/**
 * @module markdown/markdown-default-plugins
 * @summary Registers the default Markdown-it plugins used by the parser.
 */

import type MarkdownIt from 'markdown-it';

// import markdownItAbbr from 'markdown-it-abbr';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItDeflist from 'markdown-it-deflist';
// import markdownItFootnote from 'markdown-it-footnote';
import markdownItIns from 'markdown-it-ins';
import markdownItMark from 'markdown-it-mark';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';

/**
 * Registers the default Markdown-it plugins on a parser instance.
 *
 * @param md - Markdown-it instance to extend.
 */
export function registerDefaultMarkdownPlugins(
  md: MarkdownIt,
): void {
  // md.use(markdownItAbbr); -> extension references : glossary

  md.use(markdownItAnchor);

  md.use(markdownItMark);

  md.use(markdownItSub);

  md.use(markdownItSup);

  // md.use(markdownItFootnote);

  md.use(markdownItIns);

  md.use(markdownItDeflist);

  md.use(markdownItAttrs, {
    leftDelimiter: '{',
    rightDelimiter: '}',
  });
}