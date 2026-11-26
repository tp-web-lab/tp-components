import { recordJavaScript } from "../javascript-tracer/recorder.js";

/** Instrument the original TypeScript before erasing types, retaining source line numbers. */
export function recordTypeScript(code, options = {}) {
  return recordJavaScript(code, { ...options, language: "typescript" });
}
