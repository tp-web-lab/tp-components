/** @module scripts/native-markup */
import { createHash } from "node:crypto";
import { nativeMarkup as convert } from "../src/utilities/native-markup.js";

/** Convert examples using the same native syntax as the live component viewer. */
export function nativeMarkup(language, html, { onAsset = () => {}, inlineOnly = false } = {}) {
 return convert(language, html, {
  inlineOnly,
  svgSource(source) {
   const path = `/docs/medias/examples/${createHash("sha256").update(source).digest("hex").slice(0, 16)}.svg`;
   onAsset(path, source);
   return path;
  },
 });
}
