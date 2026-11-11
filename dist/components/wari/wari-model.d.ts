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
    captures: {
        pit: number;
        seeds: number;
    }[];
    grandSlam: boolean;
    collected: [number, number];
    before: string;
    after: string;
}
export declare const DEFAULT_POSITION = "S:4,4,4,4,4,4,4,4,4,4,4,4:0,0";
export declare const EMPTY_POSITION = "S:0,0,0,0,0,0,0,0,0,0,0,0:0,0";
/** Independent rule engine with snapshots for complete undo and replay. */
export declare class WariGame {
    private state;
    private past;
    constructor(value?: string | WariPosition);
    position(): string;
    snapshot(): WariPosition;
    turn(): WariSide;
    history(): WariMove[];
    private candidates;
    legalMoves(): number[];
    private settle;
    move(from: number): WariMove;
    undo(): WariMove | null;
    isGameOver(): boolean;
    result(): string;
}
