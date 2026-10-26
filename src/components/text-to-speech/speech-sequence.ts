/** @module components/text-to-speech/speech-sequence */
export type SpeechStep =
	| { text: string; offset: number; voice?: string }
	| { pause: number; explicit: boolean };
const maximumPause = 2_147_483_647;
/** Browser timers accept nonnegative integer millisecond durations. */
export function pauseMilliseconds(value: string): number {
	return /^\d+$/.test(value) && Number(value) <= maximumPause
		? Number(value)
		: 0;
}
const pauseCommand = /\[pause=(\d+)\]/g;
const voiceCommand = /\[voice=([^[\]\r\n]+)\]/g;
/** Commands are control data, not visible or spoken text. Invalid commands remain literal. */
function stripSpeechCommands(source: string): string {
	return source
		.replace(/\[(?:hide-text|show-text|speech-on|speech-off)\]/g, "")
		.replace(voiceCommand, (command, name: string) =>
			name.trim() ? "" : command,
		)
		.replace(pauseCommand, (command, duration: string) =>
			Number(duration) <= maximumPause ? "" : command,
		);
}
/** Returns only passages enabled for speech; display commands are independent. */
export function spokenSpeechText(source: string): string {
	let enabled = true;
	let cursor = 0;
	let output = "";
	for (const match of source.matchAll(/\[(speech-on|speech-off)\]/g)) {
		if (enabled) output += source.slice(cursor, match.index);
		enabled = match[1] === "speech-on";
		cursor = match.index + match[0].length;
	}
	if (enabled) output += source.slice(cursor);
	return stripSpeechCommands(output);
}
/** Hides selected transcript passages without changing what is read aloud. */
export function visibleSpeechText(source: string): string {
	let visible = true;
	let cursor = 0;
	let output = "";
	for (const match of source.matchAll(/\[(hide-text|show-text)\]/g)) {
		if (visible) output += source.slice(cursor, match.index);
		visible = match[1] === "show-text";
		cursor = match.index + match[0].length;
	}
	if (visible) output += source.slice(cursor);
	return stripSpeechCommands(output);
}
/** Retains source offsets for linked typewriting word boundaries. */
export function speechSequence(
	source: string,
	linePause: number,
): SpeechStep[] {
	if (!linePause && spokenSpeechText(source) === source)
		return source ? [{ text: source, offset: 0 }] : [];
	const steps: SpeechStep[] = [];
	const pattern = linePause
		? /\[pause=(\d+)\]|\[voice=([^[\]\r\n]+)\]|\[(hide-text|show-text|speech-on|speech-off)\]|\r?\n/g
		: /\[pause=(\d+)\]|\[voice=([^[\]\r\n]+)\]|\[(hide-text|show-text|speech-on|speech-off)\]/g;
	let voice: string | undefined;
	let speechEnabled = true;
	let cursor = 0;
	const appendText = (end: number) => {
		const raw = source.slice(cursor, end);
		if (speechEnabled && raw.trim())
			steps.push({
				text: raw.trim(),
				...(voice === undefined ? {} : { voice }),
				offset: cursor + raw.length - raw.trimStart().length,
			});
	};
	for (const match of source.matchAll(pattern)) {
		if (match[1] !== undefined && Number(match[1]) > maximumPause) continue;
		if (match[2] !== undefined && !match[2].trim()) continue;
		appendText(match.index);
		const previous = steps.at(-1);
		if (match[3] === "speech-on" || match[3] === "speech-off") {
			speechEnabled = match[3] === "speech-on";
		} else if (match[2] !== undefined) {
			voice = match[2].trim();
		} else if (speechEnabled && match[1] !== undefined) {
			if (previous && "pause" in previous && !previous.explicit) steps.pop();
			steps.push({ pause: Number(match[1]), explicit: true });
		} else if (
			speechEnabled &&
			match[1] === undefined &&
			match[3] === undefined &&
			previous &&
			"text" in previous
		)
			steps.push({ pause: linePause, explicit: false });
		cursor = match.index + match[0].length;
	}
	appendText(source.length);
	const last = steps.at(-1);
	if (last && "pause" in last && !last.explicit) steps.pop();
	return steps;
}
