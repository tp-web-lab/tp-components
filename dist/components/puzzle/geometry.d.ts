/** Image-puzzle geometry in square-cell units. */
export type PuzzleShape = "square" | "puzzle" | "triangle" | "hexagon";
export interface PuzzlePlacement {
    id: number;
    x: number;
    y: number;
    angle: number;
}
export interface PuzzleLayout {
    aspect: number;
    count: number;
    shape: PuzzleShape;
    boardWidth: number;
    boardHeight: number;
    cells: {
        x: number;
        y: number;
        vertices: number[][];
    }[];
    columns: number;
    rows: number;
    width: number;
    height: number;
    targetX: number;
    targetY: number;
}
/** Chooses an exact factorization closest to the image's aspect ratio. */
export declare function puzzleLayout(count: number, aspect: number, shape?: PuzzleShape): PuzzleLayout;
/** The solved center of a piece; piece IDs follow image rows. */
export declare function puzzleTarget(id: number, layout: PuzzleLayout): PuzzlePlacement;
/** Complementary edge signs in clockwise order: top, right, bottom, left. */
export declare function puzzleEdges(id: number, columns: number, rows: number): number[];
/** Builds a closed clipping path with exactly matching tabs on neighboring pieces. */
export declare function puzzlePath(id: number, layout: PuzzleLayout, shape: PuzzleShape): string;
/** Normalizes right-angle rotations, clamps to the play area and snaps to the target. */
export declare function puzzleDestination(piece: PuzzlePlacement, layout: PuzzleLayout, snap?: boolean): PuzzlePlacement | null;
/** A piece is solved only at its own image position with its original orientation. */
export declare function puzzlePieceSolved(piece: PuzzlePlacement, layout: PuzzleLayout): boolean;
/** Rotation increment for each tiling. */
export declare function puzzleRotationStep(shape: PuzzleShape): number;
/** Target silhouette; shared cell edges are omitted from its outline. */
export declare function puzzleContour(layout: PuzzleLayout): string;
