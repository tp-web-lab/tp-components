/** Markdown source conversion shared by browser components and publication builds. */
import { TpMarkdownParser } from "@tp/tp-markdown/markdown/engine/markdown";
type TpMarkdownParserInstance = InstanceType<typeof TpMarkdownParser>;
export declare function renderProtectedMarkdown(parser: TpMarkdownParserInstance, source: string): Promise<string>;
export declare function createTpMarkdownParser(path?: string): TpMarkdownParserInstance;
export declare function renderMarkdownToHtml(source: string, path?: string): Promise<string>;
export declare function parseMarkdownToTokens(source: string, path?: string): Promise<unknown>;
export { resolveMarkdownIncludes } from "./markdown-includes.js";
