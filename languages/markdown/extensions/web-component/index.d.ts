/**
 * @module markdown/extensions/web-component
 * @summary Markdown-it extension that renders Markdown directives as custom
 * HTML elements.
 *
 * This extension reserves container directives for web components:
 *
 * ```md
 * ::: sl-card {variant="primary"}
 * Card content
 * :::
 * ```
 *
 * and inline directives:
 *
 * ```md
 * :sl-badge:Success{variant="success" pill}
 * ```
 *
 * Block directives render Markdown content inside the generated custom
 * element, while inline directives render escaped text content.
 */
import type MarkdownIt from 'markdown-it';
/**
 * Registers web component block and inline directives.
 *
 * @summary Enables web component rendering in Markdown.
 * @param md Markdown-it instance to extend.
 */
export default function markdownWebComponentExtension(md: MarkdownIt): void;
