/** @module components/text-to-speech/speech-sequence */
export type SpeechStep =
	| { text: string; offset: number; voice?: string }
	| { pause: number; explicit: boolean }
	| { trigger: string; offset: number };
/** Additional punctuation and blank-line silences, in milliseconds. */
export interface SpeechPauses {
	blankLine?: number;
	comma?: number;
	semicolon?: number;
	colon?: number;
	sentence?: number;
}
const maximumPause = 2_147_483_647;
/** Browser timers accept nonnegative integer millisecond durations. */
export function pauseMilliseconds(value: string): number {
	return /^\d+$/.test(value) && Number(value) <= maximumPause
		? Number(value)
		: 0;
}
const pauseCommand = /\[pause=(\d+)\]/g;
const triggerCommand = /\[trigger=([a-zA-Z][a-zA-Z0-9_.:-]*)\]/g;
const voiceCommand = /\[voice=([^[\]\r\n]+)\]/g;
/** Commands are control data, not visible or spoken text. Invalid commands remain literal. */
function stripSpeechCommands(source: string): string {
	return source
		.replace(/\[(?:hide-text|show-text|speech-on|speech-off)\]/g, "")
		.replace(triggerCommand, "")
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
	punctuation: SpeechPauses = {},
): SpeechStep[] {
	if (
		!linePause &&
		!punctuation.blankLine &&
		spokenSpeechText(source) === source
	)
		return addPunctuationPauses(
			source ? [{ text: source, offset: 0 }] : [],
			punctuation,
		);
	const steps: SpeechStep[] = [];
	const pattern =
		linePause || punctuation.blankLine
			? /\[pause=(\d+)\]|\[voice=([^[\]\r\n]+)\]|\[(hide-text|show-text|speech-on|speech-off)\]|\[trigger=([a-zA-Z][a-zA-Z0-9_.:-]*)\]|(\r?\n(?:[^\S\r\n]*\r?\n)*)/g
			: /\[pause=(\d+)\]|\[voice=([^[\]\r\n]+)\]|\[(hide-text|show-text|speech-on|speech-off)\]|\[trigger=([a-zA-Z][a-zA-Z0-9_.:-]*)\]/g;
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
		} else if (match[4] !== undefined) {
			if (speechEnabled) steps.push({ trigger: match[4], offset: match.index });
		} else if (speechEnabled && match[1] !== undefined) {
			if (previous && "pause" in previous && !previous.explicit) steps.pop();
			steps.push({ pause: Number(match[1]), explicit: true });
		} else if (speechEnabled && match[5] !== undefined) {
			const blankLines = (match[5].match(/\n/g)?.length ?? 1) - 1;
			const blankPause = Math.min(
				maximumPause,
				blankLines * pauseMilliseconds(String(punctuation.blankLine ?? 0)),
			);
			const duration = Math.max(linePause, blankPause);
			if (duration > 0 && previous) {
				if ("pause" in previous && !previous.explicit)
					previous.pause = Math.max(previous.pause, duration);
				else if (
					"text" in previous ||
					(blankLines > 0 &&
						"trigger" in previous &&
						steps.some((step) => "text" in step))
				)
					steps.push({ pause: duration, explicit: false });
			}
		}
		cursor = match.index + match[0].length;
	}
	appendText(source.length);
	const last = steps.at(-1);
	if (last && "pause" in last && !last.explicit) steps.pop();
	return addPunctuationPauses(steps, punctuation);
}

/** Merges automatic silences; an adjacent explicit pause replaces them. */
function appendPause(
	steps: SpeechStep[],
	pause: Extract<SpeechStep, { pause: number }>,
): void {
	const previous = steps.at(-1);
	if (previous && "pause" in previous) {
		if (!previous.explicit) {
			if (pause.explicit) {
				steps.pop();
				steps.push(pause);
			} else previous.pause = Math.max(previous.pause, pause.pause);
			return;
		}
		if (!pause.explicit) return;
	}
	steps.push(pause);
}

/** Keeps punctuation and source offsets intact while splitting only spoken passages. */
function addPunctuationPauses(
	steps: SpeechStep[],
	pauses: SpeechPauses,
): SpeechStep[] {
	if (
		![pauses.comma, pauses.semicolon, pauses.colon, pauses.sentence].some(
			(value) =>
				value !== undefined &&
				Number.isInteger(value) &&
				value > 0 &&
				value <= maximumPause,
		)
	)
		return steps;
	const result: SpeechStep[] = [];
	const duration = (punctuation: string) =>
		Math.max(
			...Array.from(punctuation, (character) => {
				const value =
					character === ","
						? pauses.comma
						: character === ";"
							? pauses.semicolon
							: character === ":"
								? pauses.colon
								: pauses.sentence;
				return value !== undefined &&
					Number.isInteger(value) &&
					value > 0 &&
					value <= maximumPause
					? value
					: 0;
			}),
		);
	for (const step of steps) {
		if ("pause" in step) {
			appendPause(result, step);
			continue;
		}
		if (!("text" in step)) {
			result.push(step);
			continue;
		}
		let cursor = 0;
		const appendText = (end: number) => {
			const raw = step.text.slice(cursor, end);
			if (raw.trim())
				result.push({
					...step,
					text: raw.trim(),
					offset: step.offset + cursor + raw.length - raw.trimStart().length,
				});
		};
		// Numbers, times and URL-internal punctuation have no following word boundary.
		for (const match of step.text.matchAll(
			/([,.;:!?…]+)((?:[^\S\r\n]*[»”’"')\]}])*)(?=\s|$)/gu,
		)) {
			const pause = duration(match[1] ?? "");
			if (!pause) continue;
			const end = match.index + match[0].length;
			appendText(end);
			appendPause(result, { pause, explicit: false });
			cursor = end;
		}
		if (cursor === 0) result.push(step);
		else appendText(step.text.length);
	}
	return result;
}
