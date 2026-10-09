/**
 * @module markdown/extensions/references
 * @summary Markdown-it extension for bibliography, glossary, notes and index references.
 */
import type MarkdownIt from 'markdown-it';
/**
 * Options for the references extension.
 *
 * @summary Configures external file resolution.
 */
interface ReferencesOptions {
    /**
     * Virtual project files indexed by absolute path.
     */
    files?: Record<string, string>;
    /**
     * Current Markdown entry path.
     *
     * Used to resolve relative include paths.
     *
     * @defaultValue `"/index.md"`
     */
    entryPath?: string;
}
/**
 * Registers the references extension.
 *
 * Supported inline syntaxes:
 *
 * ```md
 * [@citation]
 * [%glossary-term]
 * [^note]
 * :index:`Topic,Subtopic`
 * ```
 *
 * Supported definition syntaxes:
 *
 * ```md
 * [@citation]: Bibliography entry
 * [%term]: Glossary definition
 * [^note]: Note definition
 * ```
 *
 * Supported section directives:
 *
 * ```md
 * ::bibliography{}
 * ::glossary{}
 * ::notes{}
 * ::index{}
 * ```
 *
 * @summary Enables bibliography, glossary, notes and index support.
 * @param md Markdown-it instance.
 * @param options Extension options.
 */
export default function markdownReferencesExtension(md: MarkdownIt, options?: ReferencesOptions): void;
export {};
