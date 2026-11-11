/** @module components/wari/model
 * Oware Abapa: counterclockwise sowing, compulsory feeding and void grand slams.
 */
export type WariSide = "south" | "north";
export type WariPlayMode = "user/random" | "random/random";
export interface WariPosition {
	pits: number[];
	scores: [number, number];
	turn: WariSide;
}
export interface WariMove {
	number: number;
	side: WariSide;
	from: number;
	to: number;
	seeds: number;
	path: number[];
	captures: { pit: number; seeds: number }[];
	grandSlam: boolean;
	collected: [number, number];
	before: string;
	after: string;
}
interface State extends WariPosition {
	number: number;
	reason: string;
}
export const DEFAULT_POSITION = "S:4,4,4,4,4,4,4,4,4,4,4,4:0,0";
export const EMPTY_POSITION = "S:0,0,0,0,0,0,0,0,0,0,0,0:0,0";
const copy = <T>(v: T): T => structuredClone(v);
const sideIndex = (side: WariSide) => (side === "south" ? 0 : 1);
const owns = (side: WariSide, index: number) =>
	side === "south" ? index < 6 : index >= 6;
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
function encode(s: WariPosition): string {
	return `${s.turn === "south" ? "S" : "N"}:${s.pits.join(",")}:${s.scores.join(",")}`;
}
function parse(input: string | WariPosition): State {
	let value: WariPosition;
	if (typeof input === "string") {
		const parts = input.trim().split(":");
		if (
			parts.length !== 3 ||
			!/^[SN]$/i.test(parts[0] ?? "") ||
			!/^\d+(,\d+){11}$/.test(parts[1] ?? "") ||
			!/^\d+,\d+$/.test(parts[2] ?? "")
		)
			throw Error(
				"Use S: followed by twelve pit counts and two scores, separated by colons.",
			);
		value = {
			turn: parts[0]?.toUpperCase() === "S" ? "south" : "north",
			pits: (parts[1] ?? "").split(",").map(Number),
			scores: (parts[2] ?? "").split(",").map(Number) as [number, number],
		};
	} else value = copy(input);
	if (
		!value ||
		!["south", "north"].includes(value.turn) ||
		!Array.isArray(value.pits) ||
		value.pits.length !== 12 ||
		!Array.isArray(value.scores) ||
		value.scores.length !== 2 ||
		[...value.pits, ...value.scores].some(
			(n) => !Number.isInteger(n) || n < 0 || n > 48,
		)
	)
		throw Error(
			"Use twelve nonnegative pit counts, two scores and a south or north turn.",
		);
	const total = sum(value.pits) + sum(value.scores);
	if (total !== 48 && total !== 0)
		throw Error(
			"Pits and scores must contain exactly 48 seeds (or zero for an empty board).",
		);
	return { ...value, number: 1, reason: "" };
}
function sow(state: WariPosition, from: number) {
	const pits = [...state.pits],
		origin = from - 1,
		path: number[] = [];
	const seeds = pits[origin] ?? 0;
	pits[origin] = 0;
	let cursor = origin;
	for (let n = 0; n < seeds; n++) {
		cursor = (cursor + 1) % 12;
		if (cursor === origin) cursor = (cursor + 1) % 12;
		pits[cursor] = (pits[cursor] ?? 0) + 1;
		path.push(cursor + 1);
	}
	return { pits, path, seeds, to: cursor + 1 };
}
/** Independent rule engine with snapshots for complete undo and replay. */
export class WariGame {
	private state: State;
	private past: { state: State; move: WariMove }[] = [];
	constructor(value: string | WariPosition = DEFAULT_POSITION) {
		this.state = parse(value);
		this.settle();
	}
	position(): string {
		return encode(this.state);
	}
	snapshot(): WariPosition {
		return {
			pits: [...this.state.pits],
			scores: [...this.state.scores],
			turn: this.state.turn,
		};
	}
	turn(): WariSide {
		return this.state.turn;
	}
	history(): WariMove[] {
		return this.past.map((p) => copy(p.move));
	}
	private candidates(): number[] {
		const s = this.state;
		const choices = s.pits.flatMap((count, i) =>
			count > 0 && owns(s.turn, i) ? [i + 1] : [],
		);
		const opponentEmpty = !s.pits.some((n, i) => n > 0 && !owns(s.turn, i));
		return opponentEmpty
			? choices.filter((from) =>
					sow(s, from).pits.some((n, i) => n > 0 && !owns(s.turn, i)),
				)
			: choices;
	}
	legalMoves(): number[] {
		return this.isGameOver() ? [] : this.candidates();
	}
	private settle(): [number, number] {
		const s = this.state,
			collected: [number, number] = [0, 0];
		if (sum(s.pits) + sum(s.scores) === 0) {
			s.reason = "Empty board. Load a position to play.";
			return collected;
		}
		if (s.scores.some((n) => n > 24) || s.scores.every((n) => n === 24)) {
			s.reason = "Score reached.";
			return collected;
		}
		const repeated =
			1 + this.past.filter((p) => encode(p.state) === encode(s)).length >= 3;
		if (!this.candidates().length || repeated) {
			s.reason = repeated
				? "Threefold repetition; remaining seeds collected."
				: "No feeding move remains; remaining seeds collected.";
			for (let i = 0; i < 12; i++) {
				const side = i < 6 ? 0 : 1;
				collected[side] += s.pits[i] ?? 0;
				s.pits[i] = 0;
			}
			s.scores[0] += collected[0];
			s.scores[1] += collected[1];
		}
		return collected;
	}
	move(from: number): WariMove {
		if (!this.legalMoves().includes(from))
			throw Error(
				"Choose a legal nonempty pit on the active side; feed the opponent when required.",
			);
		const before = copy(this.state),
			s = this.state,
			played = sow(s, from),
			captures: WariMove["captures"] = [];
		for (
			let i = played.to - 1;
			!owns(s.turn, i) && [2, 3].includes(played.pits[i] ?? 0);
			i = (i + 11) % 12
		)
			captures.push({ pit: i + 1, seeds: played.pits[i] ?? 0 });
		const captured = sum(captures.map((p) => p.seeds));
		const grandSlam =
			captured > 0 &&
			captured === sum(played.pits.filter((_, i) => !owns(s.turn, i)));
		if (grandSlam) captures.length = 0;
		for (const p of captures) played.pits[p.pit - 1] = 0;
		s.pits = played.pits;
		s.scores[sideIndex(s.turn)] += sum(captures.map((p) => p.seeds));
		const move: WariMove = {
			number: s.number,
			side: s.turn,
			from,
			to: played.to,
			seeds: played.seeds,
			path: played.path,
			captures,
			grandSlam,
			collected: [0, 0],
			before: encode(before),
			after: "",
		};
		if (s.turn === "north") s.number++;
		s.turn = s.turn === "south" ? "north" : "south";
		this.past.push({ state: before, move });
		move.collected = this.settle();
		move.after = this.position();
		return copy(move);
	}
	undo(): WariMove | null {
		const p = this.past.pop();
		if (!p) return null;
		this.state = p.state;
		return copy(p.move);
	}
	isGameOver(): boolean {
		return Boolean(this.state.reason);
	}
	result(): string {
		const s = this.state;
		if (!s.reason) return `${s.turn === "south" ? "South" : "North"} to move.`;
		if (sum(s.pits) + sum(s.scores) === 0) return s.reason;
		const [south, north] = s.scores;
		return `${south === north ? "Draw" : south > north ? "South wins" : "North wins"}: ${south}–${north}. ${s.reason}`;
	}
}
