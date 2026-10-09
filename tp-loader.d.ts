/**
 * @module tp-loader
 * @summary Charge automatiquement les composants `tp-*` réellement présents dans le DOM.
 */
export declare function loadUsedTpComponents(root?: ParentNode): Promise<void>;
export declare function observeUsedTpComponents(root?: ParentNode): MutationObserver;
export declare function startTpLoader(): Promise<void>;
