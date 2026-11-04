import "../button/button.js";
import "../icon-button/icon-button.js";
import "../divider/divider.js";
/** Render the optional navigation list before the toolbar's global commands. */
export declare function updateDocumentNavbar(toolbar: HTMLElement | null, hrefs: string[], rewriteLinks?: (root: HTMLElement) => void): Promise<void>;
