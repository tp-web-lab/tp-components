import { recordTypeScript } from "./recorder.js";
self.onmessage = ({ data }) => {
	self.postMessage({ type: "ready" });
	try {
		self.postMessage({ type: "trace", result: recordTypeScript(data.code) });
	} catch (error) {
		self.postMessage({ type: "error", message: error.message });
	}
};
