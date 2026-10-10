type MarkdownIncludeMode = "auto" | "raw";
export declare function resolveMarkdownIncludes(markdown: string, currentUrl: URL, depth?: number): Promise<string>;
export declare function applyIncludePrefix(content: string, prefix: string): string;
export declare function renderInclude(includePath: string, currentUrl: URL, depth: number, mode: MarkdownIncludeMode): Promise<string>;
export {};
