/**
 * @module components/playground/playground-local-file
 * @summary Helper for choosing local files in the playground.
 */
/** Opens a local text file without requiring the File System Access API.
 * @param host The host element to attach the file input to.
 * @param accept The accepted file types (e.g., "text/plain").
 * @param signal An AbortSignal to cancel the file selection.
 * @returns A promise that resolves with the selected file or null if canceled.
 */
export declare function choosePlaygroundFile(host: HTMLElement, accept: string, signal: AbortSignal): Promise<File | null>;
