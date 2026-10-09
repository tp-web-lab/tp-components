/**
 * @module components/code-editor/abc-language
 * @summary CodeMirror language support and theme for ABC notation.
 */
import { StreamLanguage } from '@codemirror/language';
/** CodeMirror language definition for ABC notation. */
export declare const abcLanguage: StreamLanguage<unknown>;
/** Base theme for ABC notation. */
export declare const abcBaseTheme: import("@codemirror/state").Extension;
