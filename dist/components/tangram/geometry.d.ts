export type Point = {
    x: number;
    y: number;
};
export type Placement = Point & {
    id: string;
    angle: number;
    flipped: boolean;
};
export declare function at<T>(items: readonly T[], index: number): T;
export declare const PIECES: {
    id: string;
    points: {
        x: number;
        y: number;
    }[];
    x: number;
    y: number;
}[];
export declare const SQUARE: Placement[];
export declare function polygon(p: Placement): Point[];
export declare function area(points: Point[]): number;
/** Convex clipping; shared edges have zero intersection area. */
export declare function intersection(a: Point[], b: Point[]): Point[];
export declare function overlaps(a: Placement, b: Placement): boolean;
export declare function validate(placements: Placement[]): void;
/** A readable square dissection using named vertices and geometric relations. */
export declare const SQUARE_SOURCE = "# Corners of a square of side 4\npoint A = (0, 0)\npoint B = (4, 0)\npoint C = (4, 4)\npoint D = (0, 4)\n\n# Shared landmarks\npoint O = midpoint(A, C)\npoint E = midpoint(B, C)\npoint F = midpoint(C, D)\npoint G = midpoint(B, O)\npoint H = midpoint(O, C)\npoint I = midpoint(O, D)\n\n# The seven pieces, described by their boundary vertices\ntriangle A B O\ntriangle A O D\ntriangle E C F\ntriangle B E G\ntriangle O H I\nsquare O G E H\nparallelogram D F H I";
/** Named vertices and geometric relations; legacy placement formats remain accepted. */
export declare function parseSolution(source: string): Placement[];
/** Whether one piece is entirely covered by the target silhouette. */
export declare function insideTarget(p: Placement, target: Placement[]): boolean;
/** Completion requires all seven unique pieces, no overlap, and full coverage. */
export declare function solved(state: Placement[], target: Placement[]): boolean;
