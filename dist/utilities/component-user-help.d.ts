/** Metadata shown to readers, independently of the author-facing API. */
export interface TpComponentUserHelp {
    /** Human-readable component name from the documentation heading. */
    displayName?: string;
    /** Introductory paragraph from the component documentation, in Markdown. */
    introduction?: string;
    interactions: string;
    keyboard: Array<{
        key: string;
        description: string;
    }>;
}
/** Extracts only reader instructions and declared keyboard interactions. */
export declare function extractComponentUserHelp(markdown: string, source: string): TpComponentUserHelp;
