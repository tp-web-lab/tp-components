export interface TpComponentCommand {
    button: string;
    description: string;
    shortcut: string;
}
/** Extract explicit command rows from the mouse interaction table.
 * An empty Shortcut cell denotes a gesture rather than a command;
 * an em dash denotes a command without a keyboard shortcut.
 */
export declare function extractComponentCommands(markdown: string): TpComponentCommand[] | undefined;
/** Metadata shown to readers, independently of the author-facing API. */
export interface TpComponentUserHelp {
    commands?: TpComponentCommand[];
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
