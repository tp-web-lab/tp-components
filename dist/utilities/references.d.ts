export declare const referenceOutput = "[data-tp-reference-output], tp-tooltip";
export declare function referenceScope(element: Element): Element;
export declare function referenceId(element: Element): string;
export declare function referenceLabel(element: Element): string;
export declare function referenceElements(scope: Element, selector: string): Element[];
export declare function observeReferences(element: Element, refresh: () => void): () => void;
/** Copies displayed content without duplicating anchors or source definitions. */
export declare function referenceContent(element: Element): DocumentFragment;
/** Shared numbering: first citation order, then uncited definitions in document order. */
export declare function noteNumbers(scope: Element): Map<string, number>;
