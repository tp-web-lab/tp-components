import { initializeSchemeRecorder, recordScheme } from "./recorder.js";
import standardLibrary from "./vendor/std.xcb?url&no-inline";
import engineUrl from "./vendor/lips.js?url&no-inline";
self.onmessage = async ({ data }) => {
  try {
    const engine = await import(/* @vite-ignore */ engineUrl);
    // LIPS detects binary libraries by the .xcb suffix; Vite adds a development query.
    await initializeSchemeRecorder(standardLibrary.replace(/[?#].*$/, ""), engine);
    self.postMessage({ type: "ready" });
    self.postMessage({ type: "trace", result: await recordScheme(data.code, {query: data.query}) });
  } catch (error) {
    self.postMessage({ type: "error", message: error.message });
  }
};
