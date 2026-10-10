import { type TpBlank } from "../blank/blank.js";
/** Supported stored-answer controls; tp-textfield contributes its native input. */
export type BlankField = HTMLInputElement | HTMLSelectElement | TpBlank;
/** Lists controls in author order, without counting content inside rich blanks. */
export declare function getBlankFields(root: ParentNode): BlankField[];
