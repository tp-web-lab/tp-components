import { afterEach, beforeEach, expect, it, vi } from "vitest";
import "./audio-recorder.js";
import { AudioTranscript } from "./transcript.js";
import "../fill-blank-question/fill-blank-question.js";

class RecognitionMock extends EventTarget {
	static instances: RecognitionMock[] = [];
	lang = "";
	continuous = false;
	interimResults = true;
	start = vi.fn();
	stop = vi.fn();
	abort = vi.fn();
	constructor() {
		super();
		RecognitionMock.instances.push(this);
	}
	result(text: string, final = true) {
		this.dispatchEvent(
			Object.assign(new Event("result"), {
				results: [{ isFinal: final, 0: { transcript: text } }],
			}),
		);
	}
}
beforeEach(() => {
	RecognitionMock.instances = [];
	vi.stubGlobal("SpeechRecognition", RecognitionMock);
	vi.stubGlobal("webkitSpeechRecognition", undefined);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
function setup(selector = "#answer") {
	const host = document.createElement("div");
	host.setAttribute("transcript", selector);
	host.lang = "en-GB";
	document.body.append(host);
	const report = vi.fn();
	return { host, report, session: new AudioTranscript(host, report) };
}
it("writes one editable blank and emits events for question grading", () => {
	document.body.innerHTML =
		'<tp-fill-blank-question><dl><dt>Answers</dt><dd><ol><li>blue</li></ol></dd><dt>Form</dt><dd><tp-audio-recorder transcript="#answer"></tp-audio-recorder><tp-textfield id="answer" multiline clearable></tp-textfield></dd><dt>Solution</dt><dd>blue</dd></dl></tp-fill-blank-question>';
	expect(document.querySelectorAll("tp-audio-recorder")).toHaveLength(1);
	const { session } = setup();
	const field = document.querySelector("tp-textfield");
	const input = vi.fn();
	const change = vi.fn();
	field?.addEventListener("input", input);
	field?.addEventListener("change", change);
	session.start();
	const engine = RecognitionMock.instances[0];
	expect(engine?.lang).toBe("en-GB");
	engine?.result("blu", false);
	expect(field?.value).toBe("");
	engine?.result("blue");
	expect(field?.value).toBe("blue");
	expect(input).toHaveBeenCalledOnce();
	expect(change).toHaveBeenCalledOnce();
	document.querySelector<HTMLElement>('[data-action="submit"]')?.click();
	expect(
		document.querySelector("[data-tp-question-feedback-output]")?.textContent,
	).toContain("1/1");
	session.stop();
	session.stop();
	expect(engine?.stop).toHaveBeenCalledOnce();
	engine?.result("blue");
	session.abort();
	engine?.result("stale");
	expect(field?.value).toBe("blue");
});
it.each([
	'<input id="answer">',
	'<textarea id="answer"></textarea>',
	'<p id="answer"></p>',
])("writes plain text to %s", (markup) => {
	document.body.innerHTML = markup;
	const { session } = setup();
	session.start();
	RecognitionMock.instances[0]?.result("<strong>literal</strong>");
	const target = document.querySelector("#answer");
	expect(target && "value" in target ? target.value : target?.textContent).toBe(
		"<strong>literal</strong>",
	);
	expect(target?.querySelector("strong")).toBeNull();
});
it.each(["", "#missing", "[", "body"])(
	"does not start recognition for %s",
	(selector) => {
		const { session } = setup(selector);
		session.start();
		expect(RecognitionMock.instances).toHaveLength(0);
	},
);
it("ignores a removed target and results from earlier sessions", () => {
	document.body.innerHTML = '<p id="answer">Initial</p>';
	const { session } = setup();
	session.start();
	const previous = RecognitionMock.instances[0];
	session.start();
	previous?.result("stale");
	expect(document.querySelector("#answer")?.textContent).toBe("Initial");
	const target = document.querySelector("#answer");
	target?.remove();
	RecognitionMock.instances[1]?.result("late");
	expect(target?.textContent).toBe("Initial");
});
it("reports unsupported recognition without removing typed text", () => {
	vi.stubGlobal("SpeechRecognition", undefined);
	document.body.innerHTML = '<p id="answer">Typed answer</p>';
	const { session, report } = setup();
	session.start();
	expect(report).toHaveBeenLastCalledWith(
		expect.stringContaining("unavailable"),
	);
	expect(document.querySelector("#answer")?.textContent).toBe("Typed answer");
});
it("uses the prefixed API and reports errors", () => {
	vi.stubGlobal("SpeechRecognition", undefined);
	vi.stubGlobal("webkitSpeechRecognition", RecognitionMock);
	document.body.innerHTML = '<p id="answer"></p>';
	const { session, report } = setup();
	session.start();
	RecognitionMock.instances[0]?.dispatchEvent(
		Object.assign(new Event("error"), { error: "not-allowed" }),
	);
	expect(report).toHaveBeenLastCalledWith(
		expect.stringContaining("not-allowed"),
	);
	expect(RecognitionMock.instances[0]?.abort).toHaveBeenCalledOnce();
});
