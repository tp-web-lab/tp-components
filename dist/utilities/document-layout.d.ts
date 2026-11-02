/**
 * Prepare components that establish the surrounding document's geometry before
 * publishing parsed markup. Leave optional viewers and language runtimes lazy.
 * Templates and script sources are inert and are not traversed by selectors.
 */
export declare function prepareDocumentLayout(root: ParentNode): Promise<void>;
