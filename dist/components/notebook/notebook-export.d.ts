export declare const notebookExportStyle: string;
/** Export actual HTML: reading the document must not depend on the loader. */
export declare function renderNotebookMarkup(language: string, source: string): Promise<HTMLElement>;
