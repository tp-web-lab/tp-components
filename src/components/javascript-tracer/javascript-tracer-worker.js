import { recordJavaScript } from "./recorder.js";
self.onmessage = ({ data }) => {
	self.postMessage({ type: "ready" });
	try {
		self.postMessage({ type: "trace", result: recordJavaScript(data.code) });
	} catch (error) {
		self.postMessage({ type: "error", message: error.message });
	}
};
