/** Piecewise linear terrain; altitude uses the same scale as horizontal distance. */
export type Terrain = readonly (readonly [number, number])[];
export declare const profiles: readonly {
    name: string;
    points: Terrain;
}[];
export declare function segmentAt(points: Terrain, x: number, direction?: number): number;
export declare function sample(points: Terrain, x: number, direction?: number): {
    altitude: number;
    grade: number;
};
/** Spend relative input effort across segments, including when travelling backwards. */
export declare function advance(points: Terrain, position: number, effort: number): number;
