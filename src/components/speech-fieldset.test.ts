import { afterEach, expect, it } from "vitest";
import "./text-to-speech/text-to-speech.js";
import "./audio-recorder/audio-recorder.js";
import "./speech-to-text/speech-to-text.js";

afterEach(() => document.body.replaceChildren());

it.each([
	["tp-text-to-speech", "Text to speech"],
	["tp-audio-recorder", "Audio recorder"],
	["tp-speech-to-text", "Speech to text"],
])(
	"%s updates its native legend without replacing controls",
	async (tag, caption) => {
		const host = document.createElement(tag);
		document.body.append(host);
		await new Promise((resolve) => setTimeout(resolve, 0));
		const fieldset = host.querySelector(":scope > fieldset");
		const legend = fieldset?.querySelector(":scope > legend");
		const control = fieldset?.querySelector("tp-button");
		expect(legend?.textContent).toBe(caption);
		expect(control).toBeTruthy();
		host.setAttribute("legend", "<b>Speaking practice</b>");
		expect(legend?.textContent).toBe("<b>Speaking practice</b>");
		expect(legend?.children.length).toBe(0);
		expect(fieldset?.querySelector("tp-button")).toBe(control);
		host.removeAttribute("legend");
		expect(legend?.textContent).toBe(caption);
	},
);
