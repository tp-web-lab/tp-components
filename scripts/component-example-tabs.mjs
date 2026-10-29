/** @module scripts/component-example-tabs */

/**
 * Normalizes the delimiters surrounding component example language tabs to prevent collisions
 * with nested fences.
 *
 * Import this helper from a Node.js ES module; it is not a standalone command. Pass the
 * component page Markdown as a string.
 *
 * @example
 * import { normalizeExampleTabs } from "./scripts/component-example-tabs.mjs";
 * const normalized = normalizeExampleTabs(markdown);
 */

/** The language tabs must enclose every colon fence in their included examples. */
export const EXAMPLE_TABS_FENCE = ':'.repeat(15);

/** Updates only the tabs that include the four component example files. */
export function normalizeExampleTabs(markdown) {
  return markdown.replace(/^(:{3,})([ \t]+tp-tabs[^\n]*)\n([\s\S]*?)^\1[ \t]*$/gm, (block, _fence, attributes, body) => {
    if (!/::include\{examples\/examples\.md(?:\s+[^}]*)?\}/.test(body)) return block;
    return `${EXAMPLE_TABS_FENCE}${attributes}\n${body}${EXAMPLE_TABS_FENCE}`;
  });
}
