/** Separates game commands from gestures while keeping one documentation source. */
export function isGameComponent(tag: string): boolean {
	return /^tp-(binary|checkers|chess|crossword|cryptarithm|kakuro|logigram|loto|mastermind|memory|puzzle|solitaire|sudoku|tangram|wari|yakazu)$/.test(
		tag,
	);
}
const textButtons = new Set([
	"Start",
	"Flip",
	"Play vs random",
	"Random vs random",
	"Stop",
	"Clear",
	"Notes",
	"Game / Note",
	"Play",
	"Palette color",
	"Draw a number",
	"Queen / Rook / Bishop / Knight",
	"Choose capture path",
]);
export function isGameButtonLabel(label: string): boolean {
	return (
		label.includes(":tp-icon:") ||
		label.startsWith("Help →") ||
		textButtons.has(label) ||
		label.startsWith("Rotate ")
	);
}
/** The Mouse panel contains only gestures; button descriptions stay in Buttons. */
export function gameMouseInstructions(tag: string, source: string): string {
	if (!isGameComponent(tag)) return source;
	const mouse =
		/#{2,4} Mouse interactions\s*([\s\S]*?)(?=#{2,4} Keyboard interactions|$)/.exec(
			source,
		);
	if (!mouse) return source;
	const rows = (mouse[1] ?? "").split("\n").filter((line) => {
		if (!line.startsWith("|")) return false;
		const label = line.split("|")[1]?.trim() ?? "";
		return (
			label &&
			!/^(?:[-: ]+|Control or gesture|Control|Action)$/.test(label) &&
			label !== "Chronometer" &&
			!isGameButtonLabel(label)
		);
	});
	const keyboard = source.slice((mouse.index ?? 0) + mouse[0].length);
	const content = rows.length
		? `| Gesture | Result |\n| --- | --- |\n${rows.join("\n")}`
		: "No mouse interaction beyond the controls described in Buttons.";
	return `#### Mouse interactions\n\n${content}\n\n${keyboard}`;
}
