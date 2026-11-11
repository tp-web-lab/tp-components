/** Convert authored HTML to native prose, lists, roles and component directives.
 * Script/code payloads are data, not document markup, and remain untouched.
 */
export function nativeMarkup(language: any, html: any, { svgSource, inlineOnly }?: {
    svgSource?: ((source: any) => string) | undefined;
    inlineOnly?: boolean | undefined;
}): any;
