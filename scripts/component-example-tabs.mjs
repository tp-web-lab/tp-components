/** The language tabs must enclose every colon fence in their included examples. */
export const EXAMPLE_TABS_FENCE = ':'.repeat(15);

/** Updates only the tabs that include the four component example files. */
export function normalizeExampleTabs(markdown) {
  return markdown.replace(/^(:{3,})([ \t]+tp-tabs[^\n]*)\n([\s\S]*?)^\1[ \t]*$/gm, (block, _fence, attributes, body) => {
    if (!body.includes('::include{examples/examples.md}')) return block;
    return `${EXAMPLE_TABS_FENCE}${attributes}\n${body}${EXAMPLE_TABS_FENCE}`;
  });
}
